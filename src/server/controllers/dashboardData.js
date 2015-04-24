
//var mongo = require('../lib/mongoConnection');
//var collection = mongo.mongodb.collection('events');

var EventInstance = require('mongoose').model('EventInstance')

exports.actEventInstances = function(req, res) {
  EventInstance.find({'draftStatus': false},function(err, eventInstances) {
        res.json(eventInstances);
      
  })
  };



   