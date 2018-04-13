/**
 * Member_index.js
 */

module.exports = {
	identity: 'elastic/member',
	connection: 'elastic',
	schema: true,
	tableName: 'member',
	autoCreatedAt: false,
	autoUpdatedAt: false,
	attributes: {

		elasticSearch: {
			mappings: {
				person: {
					properties: {
						code: {
							type: "string"
						},
						firstname: {
							type: "string"
						},
						lastname: {
							type: "string"
						},
						address: {
							type: "string"
						}
					}
				}
			}
		}
	}
};
