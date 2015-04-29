
var mongo = require('../lib/mongoConnection');


//var EventInstance = require('mongoose').model('EventInstance')

exports.getEvents = function(req, res) {

    
    var collection = mongo.mongodb.collection('events');
  //var draftStatus = (req.params.status === 'drafts')
  
  collection.find({}).sort('-dateCreated').toArray(function(err, eventInstances) {
        res.send(eventInstances);

      
  })
  };

exports.getAvailEventInstanceId = function(req,res) {
    
    var collection = mongo.mongodb.collection('events');
     var partialId = req.params.partialId;

     console.log(partialId);  
     collection.find({'eventInstanceId': partialId}).toArray(function(err,docs){
         
        console.log(docs);
         res.send(docs)
         
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
   

  

  