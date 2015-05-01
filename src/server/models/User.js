var mongoose = require('mongoose'),
  encrypt = require('../utilities/encryption');

var userSchema = mongoose.Schema({
  firstName: {type:String},
  lastName: {type:String},
  email: {type: String},
  salt: {type:String},
  hashed_pwd: {type:String},
  roles: {
          admin: Boolean,
          coordinator: Boolean,
          analyst: Boolean},
  displayName: {type: String}
});

userSchema.methods = {
  authenticate: function(passwordToMatch) {
    return encrypt.hashPwd(this.salt, passwordToMatch) === this.hashed_pwd;
  },
  hasRole: function(role) {
    return this.roles.indexOf(role) > -1;
  }
};
var User = mongoose.model('User', userSchema);

function createDefaultUsers() {
  User.find({}).exec(function(err, collection) {
    if(collection.length === 0) {
      var salt, hash;
      salt = encrypt.createSalt();
      hash = encrypt.hashPwd(salt, 'tsavel');
      User.create({firstName:'Tom',lastName:'Savel',email:'tsavel@cdc.gov', salt: salt, hashed_pwd: hash, roles: {admin:true, coordinator:true, analyst:true}, displayName:'Tom Savel'});
      salt = encrypt.createSalt();
      hash = encrypt.hashPwd(salt, 'kta');
      User.create({firstName:'Michael',lastName:'Ta',email:'kta@cdc.gov', salt: salt, hashed_pwd: hash, roles: {admin:true, coordinator:true, analyst:true}, displayName:'Michael Ta'});
    }
  });
};

exports.createDefaultUsers = createDefaultUsers;