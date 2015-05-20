var mongo = require('../lib/mongoConnection');
var ObjectID = require('mongodb').ObjectID;

exports.getEventTypes = function(req,res) {
	var collection = mongo.mongodb.collection('administration');

	collection.find({'eventTypeList':{ $exists: true }}).toArray(function(err, types) {
		res.send(types);
	});
};

exports.updateEventTypes = function(req,res) {
	var collection = mongo.mongodb.collection('administration');
	var eventTypeDoc = req.body;
	var Id = eventTypeDoc._id;

	collection.update({'_id':Id}, {$set: {eventTypeList:eventTypeDoc.eventTypeList}},{upsert: true}, function(err, result){
		if(err) {
			res.send(err);
		} else {
			res.send(result);
		}
	});
	
};