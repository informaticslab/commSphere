var mongo = require('../lib/mongoConnection');
var ObjectID = require('mongodb').ObjectID;



//exports.saveEvent = function(req, res) {
//	var eventData = req.body;
//	console.log("req body****",req.body);
//	var collection = mongo.mongodb.collection('events');
//
//	collection.insert(eventData, function(err, result) {
//		
//		if(err) {
//			res.send(err);
//			console.log(err);
//		} else {
//			res.send({success:true});
//		}
//	});
//};

exports.saveEvent = function(req, res) {
	var eventData = req.body;
	console.log("req body****",req.body);
	var Id = eventData._id;
  	delete eventData._id;
	var collection = mongo.mongodb.collection('events');
	var eventDataCollection = mongo.mongodb.collection('eventsData');
	if (Id) {  // if existing id then update
     collection.update({"_id":ObjectID(Id)},eventData,function(err, affectedDocCount) {
       if (err) {
			res.send(err);
			console.log(err);
		}
		else {
       console.log("document changed ", affectedDocCount);
	   res.send({success:true});
		}
   		});
	}
	else {
  		collection.insert(eventData, function(err, result) {
		if(err) {
			res.send(err);
			console.log(err);
		} else {
			// create matching data collection for this new event if not exist	
			var partialId = new RegExp('^'+eventData.eventInstanceId.split('-')[0]);		
	 			eventDataCollection.find({'eventInstanceId': {$regex: partialId}}).toArray(function(err,result) {
				  	if(err){
			 	 		console.log(err);
			 	 	} else if (result.length < 1) {
			 	 	// not exist, add

			 	 	  var creationDate =  eventData.dateCreated;
			 	// 	  var creationTime =  new Date().toISOString().split('T')[1].replace('Z','').split(':').join('').split('.')[0];
			 	 	  var newRecord = {
			 	 	  			"eventName": eventData.eventName,
			 	 	  		 	"eventInstanceId": eventData.eventInstanceId,
			 	 	  		 	"gridData" : [ {
			 	 	  		 					'gridName': 'table 1',
							 	 	  		 	"dailyData":
							 	 	  		 		[
							 	 	  		 			{
							 	 	  		 				"subTopic":""
							 	 	  		 		 	}
							 	 	  		 		]
							 	 	  		 	}
			 	 	  		 				]
			 	 	  		 	};
			 	 	 // 	newRecord.dailyData[0][creationDate] = null;
			 	 	  	newRecord.gridData[0].dailyData[0][creationDate] = '*';
			 	 	 	eventDataCollection.insert(newRecord, function(err, result) {
							if(err) {
							res.send(err);
							console.log(err);
							} else {
								
							}
			 			});
	 	 	  		}
	 	 	  		else {  // event data already exists,  add the next column the for new instance
	 					  for(var i=0; i < result[0].dailyData.length; i++) {
						           if (result[0].dailyData[i].hasOwnProperty(eventData.dateCreated)) {
						              // column alread there
						           } else {  // column not exists, add
						               result[0].dailyData[i][eventData.dateCreated] = '*';
						           }
						      }
						  console.log(result[0]);
						  var Id = result[0]._id;
						  delete result[0]._id;   
						  eventDataCollection.update({"_id":ObjectID(Id)},result[0],function(err, affectedDocCount) {
						       if (err) {
									res.send(err);
									console.log(err);
								}
								else {
						       console.log("event data document changed ", affectedDocCount);
							   res.send({success:true});
								}
						   		});
  // end of eventdata exist
	 	 	  		}
	 	 	  	});		
	
	// end of new block

			res.send({success:true});
		}
 	});
  }
};

exports.saveDraft = function(req,res) {
  var eventData = req.body;
  var Id = eventData._id;
  console.log('I am in save draft');
  delete eventData._id;
  var collection = mongo.mongodb.collection('events');
  if (Id) {  // if existing id then update
  	 console.log("ID true",Id);
      collection.update({"_id":ObjectID(Id)},eventData,function(err, affectedDocCount) {
		if (err) {
			res.send(err);
			console.log(err);
		}
		else {
       console.log("document changed ", affectedDocCount);
	   res.send({type:"update"});
		}
   	 });
	}
	else {
		console.log(" I am in draft insert");
  		collection.insert(eventData, function(err, result) {
		if(err) {
			res.send(err);
			console.log(err);
		} else {
			// send the inserted record new id back to ctrl
			res.send({'eventdoc': result[0],type:"insert"});
		}
 	});
  }

};

exports.deleteDraft = function(req,res) {
	 
  var Id = req.params.Id;
  console.log('I am in delete draft');
  var collection = mongo.mongodb.collection('events');
  if (Id) {  // if existing id then update
  	 
    collection.remove({"_id":ObjectID(Id)},function(err, affectedDocCount) {
		if (err) {
			res.send(err);
			console.log(err);
		}
		else {
			console.log("document deleted", affectedDocCount);
			res.send({success:true});
		}
   	});
	}
};

exports.saveCollectedData = function(req,res) {
	var eventData = req.body;
	var Id = eventData._id;
  	delete eventData._id;
	var collection = mongo.mongodb.collection('eventsData');
	if (Id) {  // if existing id then update
     	collection.update({"_id":ObjectID(Id)},eventData,function(err, affectedDocCount) {
       		if (err) {
				res.send(err);
				console.log(err);
			} else {
  		   		res.send({success:true});
			}
   		});
	}

}

exports.getEventsByAnalyst = function (req,res) {
	var analystId = req.params.analystId;
	console.log("analyst id", analystId);
    var collection = mongo.mongodb.collection('events');
	collection.find({'draftStatus':false,'categories':{$elemMatch:{'userAssigned.id': analystId, 'statusCompleted' :false}}}).toArray(function(err,eventInstances) {
	  	if(err){
	 	 	console.log(err);
	 	 } else {
			  
		  	res.send(eventInstances);
		 }
	 });
	
};

exports.saveEventCategory = function (req,res) {
  var data = req.body;
  var Id = data.docId;
  var categoryData = data.categoryData;
  
  var collection = mongo.mongodb.collection('events');
  if (Id) {  // if existing id then update
     collection.update({"_id":ObjectID(Id),"categories.name":categoryData.name },{$set : {"categories.$" : categoryData}},function(err, affectedDocCount) {
	 if (err) {
           res.send(err);
           console.log(err);
		   console.log('category update encountered error');
	 }
	 else {
       console.log("document changed ", affectedDocCount);
                 res.send({success:true});
                             }
               });
              }
	
};
exports.findDuplicate = function(req, res) {
	 var eventName =  new RegExp(req.params.eventName,'i');
	 var collection = mongo.mongodb.collection('events');
	 collection.find({'eventName': {$regex: eventName}, 'draftStatus': false}).toArray(function(err,result) {
		  if(err){
	 	 	console.log(err);
	 	 } else if (result.length < 1) {
		 	 res.send({duplicate:false});
		 } else {
			 res.send({duplicate:true});
		 }
	 });
};

exports.findDuplicateId = function(req, res) {
	 var eventId = req.params.eventId;
	 var collection = mongo.mongodb.collection('events');
	 collection.find({'eventInstanceId': eventId, 'draftStatus': false}).toArray(function(err,result) {
		  if(err){
	 	 	console.log(err);
	 	 } else if (result.length < 1) {
		 	 res.send({duplicate:false});
		 } else {
			 res.send({duplicate:true});
		 }
	 });
};

exports.getEventsForImport = function(req, res) {
// get all active and archived events    
var collection = mongo.mongodb.collection('events');
collection.find( { $or: [{'draftStatus' : false},{'archiveStatus' : true}]}).toArray(function(err, eventInstances) {
        res.send(eventInstances);
  });
  };


exports.deleteActiveEvent = function(req,res) {
// delete event by id.  could have used the same delete draft function but we may need to include other criteria or functionality such as archiving
// instead of permanent delete	 
  var Id = req.params.Id;
  var collection = mongo.mongodb.collection('events');
  if (Id) {  // if existing id then update
  	 
    collection.remove({"_id":ObjectID(Id)},function(err, affectedDocCount) {
		if (err) {
			res.send(err);
			console.log(err);
		}
		else {
			console.log("document deleted", affectedDocCount);
			res.send({success:true});
		}
   	});
	}
};
 
exports.getAvailEventInstanceId = function(req,res) {
    
    var collection = mongo.mongodb.collection('events');
     var partialId = new RegExp('^'+req.params.partialId.split('-')[0]);

     collection.find({'eventInstanceId': {$regex: partialId}}).sort({'dateCreated':-1}).limit(1).toArray(function(err,docs){
         res.send(docs);
         
     });
};

exports.getNextAutoId = function(req,res){
	var collection = mongo.mongodb.collection('eventCounters');
	collection.find().toArray(function(err1, items) {
		if (items.length >= 1) {

			var availNumber = items[0].nextAutoId;
			if (availNumber > 9999) {
				res.send({'error':'next available id has reached limit of 9999'});
			}
			else {
				collection.update({},{ $inc: { nextAutoId: 1 }},function(err, affectedDocCount) {
					if (err) {
						res.send(err);
						console.log(err);
					}
					else {
	       			//	console.log("document changed ", affectedDocCount);
		   	  		}
				});
				res.send({'availNumber': getPaddedNum(availNumber,3)});
			}
		}
		else {
		  // collection not found , create one
		   console.log('not found')
		   collection.insert({'nextAutoId':2}, function(err, result) {
		   	  if (result){
		   	  console.log('creating collection eventCounters');

		   	  res.send({'availNumber': getPaddedNum(1,3)});
			  }
			})
   	   	}
   			
	});
	
}

function getPaddedNum(numText,padLength) {
 var zeroes="";
 var numberLen = numText.toString().length;
   for (var i=0; i<= padLength-numberLen; i++){
       zeroes = zeroes + '0';
   }
   return zeroes + numText;
 
}

exports.getDataById = function(req,res){
	var collection = mongo.mongodb.collection('eventData');
	var partialId = new RegExp('^'+req.params.id.split('-')[0]);
	collection.find({'eventInstanceId': {$regex: partialId}}).sort({'dateCollected':-1}).toArray(function(err,docs){
         res.send(docs);

	})
}

exports.getDataById2 = function(req,res){
	var collection = mongo.mongodb.collection('eventsData');
	var partialId = new RegExp('^'+req.params.id.split('-')[0]);
	collection.find({'eventInstanceId': {$regex: partialId}}).toArray(function(err,docs){
         res.send(docs);

	})
}
