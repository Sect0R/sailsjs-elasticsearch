/**
 * Oeuvre_musique.js
 *
 * @description :: The Oeuvre_musique table
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
	identity: 'mysql/music',
	connection: 'mysql',
	schema: true,
	tableName: 'music',
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
		member_id: {
			type: 'interger',
			required: true,
			size: 111
		},
		title: {
			type: 'string',
			required: false,
			size: 30
		},
		author: {
			type: 'string',
			required: true,
			index: true,
			size: 30
		},
		members: {
			collection: 'mysql/mamber',
			via: 'member_id'
		},
		
		afterCreate: function (value, callback) {
			sails.models['elastic/music'].createIndex(value, callback)
		},
		afterUpdate: function (value, callback) {
			sails.models['elastic/music'].updateIndex(value.id, value, callback)
		},
		afterDestroy: function (value, callback) {
			sails.models['elastic/music'].destroyIndex(value.id, callback)
		}
	}
};
