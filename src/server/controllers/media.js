var mongo = require('../lib/mongoConnection');


exports.uploadFile = function(req,res) {
	var collection = mongo.mongodb.collection('uploads');
	var modifiedPath = req.files.file.path;
	modifiedPath = modifiedPath.substring(7);

	var uploadDoc = {};
	uploadDoc.eventId = req.body.eventId;
	uploadDoc.fileName = req.files.file.name;
	uploadDoc.filePath =  modifiedPath;

	collection.insert(uploadDoc, function(err, result) {
		if(err) {
			console.log(err);
			res.send(err);
		} else {
				console.log(result);
				res.send(result);
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