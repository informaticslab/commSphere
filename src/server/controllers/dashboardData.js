
var mongo = require('../lib/mongoConnection');
var ObjectId = require('mongodb').ObjectID;

//var EventInstance = require('mongoose').model('EventInstance')

exports.getEvents = function(req, res) {

    
    var collection = mongo.mongodb.collection('events');
    var draftStatus = (req.params.status === 'drafts');
    console.log(draftStatus);
  
  collection.find({'draftStatus' : draftStatus}).sort('-dateCreated').toArray(function(err, eventInstances) {
        res.send(eventInstances);

      
  });
  };

exports.getEventById = function(req, res) {

    console.log(req.params.id);
    var id=req.params.id;
    var collection = mongo.mongodb.collection('events');
    collection.find({
        _id: ObjectId(id)
    }).toArray(function(err, eventdoc) {
      console.log("eventdoc",eventdoc);
        res.send(eventdoc);
    });



  };

exports.getAvailEventInstanceId = function(req,res) {
    
    var collection = mongo.mongodb.collection('events');
     var partialId = req.params.partialId;

     console.log(partialId);  
     collection.find({'eventInstanceId': partialId}).toArray(function(err,docs){
         
        console.log(docs);
         res.send(docs)
         
     });
};
  exports.getEventInstanceInfo = function (req,res) {
    
     var collection = mongo.mongodb.collection('events');
     var eventId = req.params.Id;

     collection.find({'eventInstanceId': eventId}).toArray(function(err,docs){
         res.send(docs);
  });
     
     
     
     
//    sort('-dateCreated');
//    query.exec(function(err,eventInstance) {
//       if (err || eventInstance == null) return res.json(null);
//       else if (!eventInstance)
//       {
//            res.json(eventInstance);
//        }
//    }
//    )
};
   

  

  