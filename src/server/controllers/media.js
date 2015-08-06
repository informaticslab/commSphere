var mongo = require('../lib/mongoConnection');


exports.uploadFile = function(req,res) {
	var collection = mongo.mongodb.collection('uploads');
	console.log(req.body);
	console.log(req.files);

	var uploadDoc = {};
	uploadDoc.eventId = req.body.eventId;
	uploadDoc.fileName = req.files.file.name;
	uploadDoc.filePath =  req.files.file.path;

	collection.insert(uploadDoc, function(err, result) {
		if(err) {
			console.log(err);
			res.send(err);
		} else {
				res.send('success');
		}
	});
};

exports.getFile = function(req,res) {
	var collection = mongo.mongodb.collection('uploads');
	var id = req.params.id;

	collection.find({eventId:id}).toArray(function(err, fileDoc) {
		res.send(fileDoc);
	});
};