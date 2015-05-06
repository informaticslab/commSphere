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
  	delete eventData._id;
	var collection = mongo.mongodb.collection('events');
	if (Id) {  // if existing id then update
     collection.update({"_id":ObjectID(Id)},eventData,function(err, affectedDocCount) {
       console.log("document changed ", affectedDocCount);
   		});
	}
	else {
  		collection.insert(eventData, function(err, result) {
		if(err) {
			res.send(err);
			console.log(err);
		} else {
			res.send({success:true});
		}
 	});
  }
};

exports.saveDraft = function(req,res) {
  var eventData = req.body;
  var Id = eventData._id;
  delete eventData._id;
  var collection = mongo.mongodb.collection('events');
  if (Id) {  // if existing id then update
  	 
      collection.update({"_id":ObjectID(Id)},eventData,function(err, affectedDocCount) {
       console.log("document changed ", affectedDocCount);
   		});
	}
	else {
  		collection.insert(eventData, function(err, result) {
		if(err) {
			res.send(err);
			console.log(err);
		} else {
			res.send({success:true});
		}
 	});
  }

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
