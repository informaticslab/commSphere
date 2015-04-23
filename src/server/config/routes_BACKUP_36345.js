//references to controllers go here
var index = require('../controllers/index');
var users = require('../controllers/users');
<<<<<<< HEAD
var dashboardData = require('../controllers/dashboardData');
=======
var events = require('../controllers/events');
>>>>>>> develop
var auth = require('./auth');
var mongoose = require('mongoose'),
    User = mongoose.model('User');

var EventInstance = mongoose.model('EventInstance');


module.exports = function(app) {

  app.get('/api/users', auth.requiresRole('admin'), users.getUsers);
  app.post('/api/users', users.createUser);
  app.put('/api/users', users.updateUser);

<<<<<<< HEAD
    /* data for main dashboard */
  app.get('/api/actEventInstances', dashboardData.actEventInstances);
=======
  app.post('/api/events', events.saveEvent);
>>>>>>> develop

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