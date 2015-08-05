var mongo = require('../lib/mongoConnection');

exports.uploadFile = function(req,res) {
	console.log(req.files);
	res.send('success');
};