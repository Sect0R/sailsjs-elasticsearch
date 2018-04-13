/**
 * Music_index.js
 */

module.exports = {
	identity: 'elastic/music',
	connection: 'elastic',
	schema: true,
	tableName: 'music',
	autoCreatedAt: false,
	autoUpdatedAt: false,
	attributes: {

		elasticSearch: {
			mappings: {
				person: {
					properties: {
						id: {
							type: "interger"
						},
						title: {
							type: "string"
						},
						author: {
							type: "string"
						},
						ISWC: {
							type: "string"
						},
					}
				}
			}
		}
	}
};
