var mongo = require('../lib/mongoConnection');
var ObjectID = require('mongodb').ObjectID;



//exports.saveEvent = function(req, res) {
//	var eventData = req.body;
//	console.log("req body****",req.body);
//	var collection = mongo.mongodb.collection('events');
//
//	collection.insert(eventData, function(err, result) {
//		
//		if(err) {
//			res.send(err);
//			console.log(err);
//		} else {
//			res.send({success:true});
//		}
//	});
//};

exports.saveEvent = function(req, res) {
	var eventData = req.body;
	console.log("req body****",req.body);
	var Id = eventData._id;
  	eventData._id = null;
	var collection = mongo.mongodb.collection('events');
	collection.remove({"_id":ObjectID(Id)}, function(err, numberOfRemovedDocs) {
       console.log("document removed ", numberOfRemovedDocs);
  	});
    collection.insert(eventData, function(err, result) {
		
		if(err) {
			res.send(err);
			console.log(err);
		} else {
			res.send({success:true});
		}
	});
};

exports.saveDraft = function(req,res) {
  var eventData = req.body;
  var Id = eventData._id;
  eventData._id = null;
  var collection = mongo.mongodb.collection('events');
  
  // delete the doc then insert
  collection.remove({"_id":ObjectID(Id)}, function(err, numberOfRemovedDocs) {
       console.log("document removed ", numberOfRemovedDocs);
  
    });
  collection.insert(eventData, function(err, result) {
		if(err) {
			res.send(err);
			console.log(err);
		} else {
			res.send({success:true});
		}
	});
};
exports.findDuplicate = function(req, res) {
	 var eventName = req.params.eventName;
	 var collection = mongo.mongodb.collection('events');

	 collection.find({'eventName': eventName, 'draftStatus': false}).toArray(function(err,result) {
		  if(err){
	 	 	console.log(err);
	 	 } else if (result.length < 1) {
		 	 res.send({duplicate:false});
		 } else {
			 res.send({duplicate:true});
		 }
	 });
};
