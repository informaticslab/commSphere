
//var mongo = require('../lib/mongoConnection');
//var collection = mongo.mongodb.collection('events');

var EventInstance = require('mongoose').model('EventInstance')

exports.getEvents = function(req, res) {
  var draftStatus = (req.params.status == 'draft')
  EventInstance.find({'statusFinalized': draftStatus}).sort('-dateCreated').exec(function(err, eventInstances) {
        res.json(eventInstances);
      
  })
  };
  

  