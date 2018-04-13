module.exports.connections = {

	/**
	 * Elasticsearch connection config
	 * @url https://www.elastic.co/downloads/past-releases/elasticsearch-2-2-2
	 */
	elastic: {
		adapter: 'elastic',
		hosts: ['http://localhost:9200'],
		keepAlive: false,
		sniffOnStart: true,
		maxRetries: 10,
		deadTimeout: 40000,
		sniffOnConnectionFault: true,
		apiVersion: '2.2'
	},

};
