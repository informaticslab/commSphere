var mongo = require('../lib/mongoConnection');


exports.uploadFile = function(req,res) {
	var collection = mongo.mongodb.collection('uploads');
	var modifiedPath = req.files.file.path;
	modifiedPath = modifiedPath.substring(7);
	//console.log(req.body);

	var uploadDoc = {};
	uploadDoc.eventId = req.body.eventId;
	uploadDoc.fileName = req.files.file.name;
	uploadDoc.filePath =  modifiedPath;

	//console.log('Uploaded Doc**', uploadDoc);
	collection.insert(uploadDoc, function(err, result) {
		if(err) {
			console.log(err);
			res.send(err);
		} else {
				//console.log(result);
				res.send(result);
		}
	});
};

exports.getFile = function(req,res) {
	var collection = mongo.mongodb.collection('uploads');
	var partialId = new RegExp('^'+req.params.id.split('-')[0]);
	collection.find({'eventId': {$regex: partialId}}).toArray(function(err,fileDoc){
         res.send(fileDoc);
	});
};