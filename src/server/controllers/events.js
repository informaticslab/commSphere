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
	})
};
