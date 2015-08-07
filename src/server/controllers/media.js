var mongo = require('../lib/mongoConnection');
var fs  = require('fs');
var ObjectID = require('mongodb').ObjectID;


exports.uploadFile = function(req,res) {
	var collection = mongo.mongodb.collection('uploads');
	var modifiedPath = req.files.file.path;
	modifiedPath = modifiedPath.substring(7);
	//console.log(req.body);

	var uploadDoc = {};
	uploadDoc.eventId = req.body.eventId;
	uploadDoc.fileName = req.files.file.name;
	uploadDoc.filePath =  modifiedPath;
	uploadDoc.uploadedDate = new Date().getTime();

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

exports.deleteFile = function(req,res) {
	var Id = req.body._id;
	var filePath = './public/'+req.body.filePath;
	var collection = mongo.mongodb.collection('uploads');
	console.log(req.body);
	if (Id) { // if existing id then update

		collection.remove({
			"_id": ObjectID(Id)
		}, function(err, result) {
			if (err) {
				res.send(err);
				console.log(err);
			} else {
				console.log("document deleted", result);
				fs.unlinkSync(filePath);
				res.send({
					success: true,
					result:result
				});
			}
		});
	}

	
	// collection.remove({'_id':ObjectID(id)}, function(err, result) {
	// 	if(err) {
	// 		console.log(err);
	// 		res.send(err);
	// 	} else {
	// 		//fs.unlinkSync('./public/'+filePath);
	// 		res.send({success:true});
	// 		console.log(result);
	// 	}
	// });
	// TODO logic to delete form FS and Mongo
};