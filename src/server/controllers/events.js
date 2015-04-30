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

exports.getDuplicates = function(req, res) {
	
 	console.log(req.params.eventName);
	res.send('test');
//	 var eventName = req.body.eventName;
//	 var query = {'eventName':eventName};
//	 var returnfield = {eventName:1};
//	 var collection = mongo.mongodb.collection('events');
//
//	 collection.find({'eventName': 'Japan'}).toArray(function(err,result) {
//	 	 //res.send(result);
//	 	 if(err){
//	 	 	console.log(err);
//	 	 }
//		 console.log(result);
//	 	 res.send(result);
//	 });
};
