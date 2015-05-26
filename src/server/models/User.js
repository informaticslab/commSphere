var mongoose = require('mongoose'),
  encrypt = require('../utilities/encryption');

var userSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  provider: String,
  salt: String,
  hashed_pwd: String,
  roles: {
          levelOne: Boolean,
          levelTwo: Boolean,
          levelThree: Boolean
          },
  displayName: String
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
      User.create({firstName:'Tom',lastName:'Savel',email:'tsavel@cdc.gov',salt:salt, hashed_pwd: hash, roles:{levelOne:true,levelTwo: true, levelThree:false},displayName:'Tom Savel',provider:'local'},function(err, docs) {
			  if (err){ console.log(err);} 
			  else
			  {//console.log(docs);	
			  }
      });
      salt = encrypt.createSalt();
      hash = encrypt.hashPwd(salt, 'kta');
      User.create({firstName:'Michael',lastName:'Ta',email:'kta@cdc.gov',salt:salt, hashed_pwd: hash, roles:{levelOne:true,levelTwo: true, levelThree:false},displayName:'Michael Ta',provider:'local'},function(err, docs) {
			  if (err){ console.log(err);} 
			  else
			  {//console.log(docs);	
			  }
      });
      salt = encrypt.createSalt();
      hash = encrypt.hashPwd(salt, 'tnguyen');
      User.create({firstName:'Trung',lastName:'Nguyen',email:'tnguyen@cdc.gov',salt:salt, hashed_pwd: hash, roles:{levelOne:true,levelTwo: true, levelThree:false},displayName:'Trung Nguyen',provider:'local'},function(err, docs) {
			  if (err){ console.log(err);} 
			  else
			  {//console.log(docs);	
			  }
      });
      salt = encrypt.createSalt();
      hash = encrypt.hashPwd(salt, 'sdavid');
      User.create({firstName:'Sanjith',lastName:'David',email:'sdavid@cdc.gov',salt:salt, hashed_pwd: hash, roles:{levelOne:true,levelTwo: true, levelThree:false},displayName:'Sanjith David',provider:'local'},function(err, docs) {
			  if (err){ console.log(err);} 
			  else
			  {//console.log(docs);	
			  }
      });
      salt = encrypt.createSalt();
      hash = encrypt.hashPwd(salt, 'kxiong');
      User.create({firstName:'KB',lastName:'Xiong',email:'kxiong@cdc.gov',salt:salt, hashed_pwd: hash, roles:{levelOne:true,levelTwo: true, levelThree:false},displayName:'KB Xiong',provider:'local'},function(err, docs) {
			  if (err){ console.log(err);}
			  else
			  {//console.log(docs);	
			  }
      });
      salt = encrypt.createSalt();
      hash = encrypt.hashPwd(salt, 'sanalyst');
      User.create({firstName:'Scott',lastName:'Analyst',email:'sanalyst@cdc.gov',salt:salt, hashed_pwd: hash, roles:{levelOne:false,levelTwo: false, levelThree:true},displayName:'Scott Analyst',provider:'local'},function(err, docs) {
        if (err){ console.log(err);}
        else
        {//console.log(docs); 
        }
      });
      salt = encrypt.createSalt();
      hash = encrypt.hashPwd(salt, 'janalyst');
      User.create({firstName:'Joe',lastName:'Analyst',email:'janalyst@cdc.gov',salt:salt, hashed_pwd: hash, roles:{levelOne:false,levelTwo: false, levelThree:true},displayName:'Joe Analyst',provider:'local'},function(err, docs) {
        if (err){ console.log(err);}
        else
        {//console.log(docs); 
        }
      });
      salt = encrypt.createSalt();
      hash = encrypt.hashPwd(salt, 'danalyst');
      User.create({firstName:'Dan',lastName:'Analyst',email:'danalyst@cdc.gov',salt:salt, hashed_pwd: hash, roles:{levelOne:false,levelTwo: false, levelThree:true},displayName:'Dan Analyst',provider:'local'},function(err, docs) {
        if (err){ console.log(err);}
        else
        {//console.log(docs); 
        }
      });
      salt = encrypt.createSalt();
      hash = encrypt.hashPwd(salt, 'ranalyst');
      User.create({firstName:'Rob',lastName:'Analyst',email:'ranalyst@cdc.gov',salt:salt, hashed_pwd: hash, roles:{levelOne:false,levelTwo: false, levelThree:true},displayName:'Rob Analyst',provider:'local'},function(err, docs) {
        if (err){ console.log(err);}
        else
        {//console.log(docs); 
        }
      });
      salt = encrypt.createSalt();
      hash = encrypt.hashPwd(salt, 'lanalyst');
      User.create({firstName:'Lisa',lastName:'Analyst',email:'lanalyst@cdc.gov',salt:salt, hashed_pwd: hash, roles:{levelOne:false,levelTwo: false, levelThree:true},displayName:'Lisa Analyst',provider:'local'},function(err, docs) {
        if (err){ console.log(err);}
        else
        {//console.log(docs); 
        }
      });
      salt = encrypt.createSalt();
      hash = encrypt.hashPwd(salt, 'klubell');
      User.create({firstName:'Keri',lastName:'Lubell',email:'klubell@cdc.gov',salt:salt, hashed_pwd: hash, roles:{levelOne:true,levelTwo: true, levelThree:false},displayName:'Keri Lubell',provider:'local'},function(err, docs) {
        if (err){ console.log(err);} 
        else
        {//console.log(docs); 
        }
      });
    }
  });
};

exports.createDefaultUsers = createDefaultUsers;