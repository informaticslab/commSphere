//references to controllers go here
var index = require('../controllers/index');
var users = require('../controllers/users');
var events = require('../controllers/events');
var dashboardData = require('../controllers/dashboardData');
var admin = require('../controllers/admin');
var auth = require('./auth');
var mongoose = require('mongoose'),
    User = mongoose.model('User');



module.exports = function(app) {

  app.get('/api/users', auth.requiresRole(), users.getUsers);
  app.post('/api/users', users.createUser);
  app.put('/api/users', users.updateUser);
  app.get('/api/users/analysts', users.getAnalysts);

  app.post('/api/events', events.saveEvent);
  app.post('/api/events/drafts',events.saveDraft);
  app.get('/api/events/id/:id',dashboardData.getEventById);
  app.get('/api/events/:status',dashboardData.getEvents);
  app.get('/api/events/getAvailEventId/:partialId',dashboardData.getAvailEventInstanceId);
  app.get('/api/events/getEventInstanceInfo/:Id',dashboardData.getEventInstanceInfo);
  app.get('/api/events/duplicate/:eventName',events.findDuplicate);
  app.post('/api/events/drafts/delete/:Id',events.deleteDraft);
  app.get('/api/events/analyst/:analystId',events.getEventsByAnalyst);
  app.post('/api/events/saveEventCategory',events.saveEventCategory);
  app.get('/api/events/getEventsForImport',events.getEventsForImport);
  app.get('/api/events/findDuplicateId/:eventId',events.findDuplicateId);

  app.get('/api/eventTypes', admin.getEventTypes);
  app.post('/api/eventTypes', admin.updateEventTypes);


  app.get('/partials/*', function(req, res) {
    res.render('../../public/app/views/' + req.params);
  });

  app.post('/login', auth.authenticate);

  app.post('/logout', function(req, res) {
    req.logout();
    res.end();
  });

  app.all('/api/*', function(req, res) {
    res.send(404);
  });

  //catchall for everything not defined above
  app.get('/*', index.index);
}