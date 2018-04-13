/**
 * ElasticController
 *
 * @description :: Server-side logic for managing Elastic Search
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */


let indexes = [
    {
        model: 'mysql/music',
        elasticModel: 'elastic/music',
        elasticIndex: 'music',
        elasticRecord: [
            'id',
            'title',
            'author',
            'ISWC',
        ],
        populate: 'members',
        idColumn: 'id'
    },
    {
        model: 'mysql/member',
        elasticModel: 'elastic/member',
        elasticIndex: 'member',
        elasticRecord: [
            "id",
            "firstname",
            "lastname",
            "address",
        ],
        populate: false,
        idColumn: 'id'
    }
];

module.exports = {

    /**
     * Reindex all models (with delete old data)
     * @param req
     * @param res
     */
    reindex: function (req, res) {
        let createIndexesPromises = [];

        indexes.forEach(index => {

            // add create index promise
            createIndexesPromises.push(new Promise((resolve, reject) => {

                sails.models[index.elasticModel].client().indices.exists({index: index.elasticIndex}, (error, deleteIndexResult) => {
                    sails.models[index.elasticModel].client().indices.delete({index: index.elasticIndex}, (error, deleteIndexResult) => {
                        // if (error) {
                        // 	console.log(error.msg);
                        // }
                    });
                });

                // get count
                sails.models[index.model].count().then(total => {
                    let bulkCount = Math.ceil(total / 200);

                    for (let i = 1; i <= bulkCount; i++) {

                        // add bulk to the commands array
                        sails.models[index.model].find().paginate({page: i, limit: 200}).then(records => {
                            let commands = [];

                            // two commands for elastic bulk method: first index, second data,
                            let action = {
                                index: {
                                    _index: index.elasticIndex,
                                    _type: index.elasticIndex
                                }
                            };

                            // add all data to commands array
                            records.forEach(record => {
                                let indexRecord = {};
                                index.elasticRecord.forEach(key => {
                                    indexRecord[key] = record[key];
                                });

                                commands.push(action);
                                commands.push(indexRecord);
                            });

                            // run bulk command
                            sails.models[index.elasticModel].bulk(commands, (error, response) => {
                                if (error) {
                                    reject(error);
                                } else {
                                    resolve(response);
                                }
                            });

                        });
                    }

                });
            }));
        });


        Promise.all(createIndexesPromises).then(results => {
            res.send(200);
        }).catch(error => {
            res.negotiate(error);
        });

    },

    /**
     * Search data in elastic index.
     * Example request:
     $http.get('/api/elastic/search?index=music&where=' +
     JSON.stringify({
				or: [
					{ title:			{ contains: 'linkin' } },
					{ author:			{ contains: 'linkin' } }
				]
			}) + '&limit=30'
     * @param req
     * @param res
     * @returns {boolean}
     */
    search: function (req, res) {
        // check index in params
        if (!req.param('index')) {
            res.send(500, 'Index is required');
            return false;
        }

        // get condition
        let condition = req.param('where');

        if (!condition) {
            res.send(500, 'where is required');
            return false;
        } else {
            condition = JSON.parse(condition);
        }

        // find index
        let index = indexes.filter(index => {
            return index.elasticIndex == req.param('index');
        });

        // if index not found
        if (!index.length) {
            res.send(500, 'Index not found');
            return false;
        } else {
            index = index[0];
        }

        // get model data with populate method
        sails.models[index.model]
            .find(condition)
            .populate(index.populate)
            .limit(req.param('limit', 500))
            .exec((err, results) => {

                // if elastic is connected
                if (sails.config.connections.elastic.hosts) {

                    // prepare elastic condition
                    let elasticCondition = {
                        //min_score: 0.5,
                        query: {
                            multi_match: {
                                fields: [],
                                query: '',
                                type: "most_fields",
                                fuzziness: 2,
                                //prefix_length: 1,
                                lenient: true,
                                operator: "or",
                                max_expansions: req.param("limit", 500)
                            }
                        },
                        sort: {
                            _score: {
                                order: 'desc'
                            }
                        }
                    };

                    // prepare condition
                    if (condition.or) {
                        elasticCondition.query.multi_match.fields = condition.or.map(cond => {
                            let key = Object.keys(cond)[0];
                            elasticCondition.query.multi_match.query = cond[key].contains.toString();
                            return key;
                        });
                    } else {
                        let key = Object.keys(condition)[0];
                        elasticCondition.query.multi_match.query = condition[key].contains.toString();
                        elasticCondition.query.multi_match.fields.push(key);
                    }

                    if (elasticCondition.query.multi_match.fields.indexOf(index.idColumn) === -1) {
                        elasticCondition.query.multi_match.fields.push(index.idColumn);
                    }

                    // search in elastic model
                    sails.models[index.elasticModel].search(elasticCondition, (error, result) => {
                        if (error) {
                            return res.negotiate(error);
                        }

                        // prepare results (fetch from hits)
                        results = results.concat(result.hits.hits.map(hit => hit._source))
                                .filter((value, index, self) => self.indexOf(value) === index);

                        // response
                        res.json(results);
                    }, index.elasticIndex);

                } else {
                    res.json(results);
                }
            });
    }
};
