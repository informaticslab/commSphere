var mongo = require('../lib/mongoConnection');

exports.saveEvent = function(req, res) {
	var eventData = req.body;
	console.log("req body****",req.body);
	var collection = mongo.mongodb.collection('events');

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

	 collection.find({'eventName': eventName}).toArray(function(err,result) {
		  if(err){
	 	 	console.log(err);
	 	 } else if (result.length < 1) {
		 	 res.send({duplicate:false});
		 } else {
			 res.send({duplicate:true});
		 }
	 });
};
