var mongo = require('../lib/mongoConnection');

exports.uploadFile = function(req,res) {
	var collection = mongo.mongodb.collection('uploads');
	console.log(req.body);
	console.log(req.files);
	res.send('success');
};