var _ = require('lodash');

exports.createUpload = function(req,res,next) {
	var data = _.pick(req.body, 'type'),
			uploadPath ='../../../uploads'
			file = req.files.file;
};