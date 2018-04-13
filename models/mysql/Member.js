/**
 * Oeuvre_musique.js
 *
 * @description :: The Oeuvre_musique table
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
	identity: 'mysql/member',
	connection: 'mysql',
	schema: true,
	tableName: 'members',
	autoCreatedAt: false,
	autoUpdatedAt: false,
	attributes: {
		id: {
			type: 'integer',
			required: true,
			autoIncrement: true,
			primaryKey: true,
			size: 8
		},
		firstname: {
			type: 'string',
			required: false,
			size: 11
		},
		lastname: {
			type: 'string',
			required: true,
			index: true,
			size: 30
		},
		address: {
			type: 'string',
			required: false,
			size: 30
		},

		afterCreate: function (value, callback) {
			sails.models['elastic/member'].createIndex(value, callback)
		},
		afterUpdate: function (value, callback) {
			sails.models['elastic/member'].updateIndex(value.id, value, callback)
		},
		afterDestroy: function (value, callback) {
			sails.models['elastic/member'].destroyIndex(value.id, callback)
		}
	}
};
