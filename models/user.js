var bcrypt = require("bcrypt");
var passport = require("passport");
var passportLocal = require("passport-local");
var salt = bcrypt.genSaltSync(10);

module.exports = function (sequelize, DataTypes){
   var User = sequelize.define('User', {
     username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          len: [6, 30]
        }
    },
    password: DataTypes.STRING
    },

  {
    classMethods: {
      encryptPass: function(password) {
        var hash = bcrypt.hashSync(password, salt);
        return hash;
    },
      comparePass: function(userpass, dbpass) {
      // don't salt twice when you compare....watch out for this
        return bcrypt.compareSync(userpass, dbpass);
    },
      createNewUser:function(username, password, err, success ) {
        if(password.length < 6) {
          err({message: "Password should be more than six characters"});
        }
        else{
        User.create({
            username: username,
            password: this.encryptPass(password)
          }).done(function(error,user) {
            if(error) {
              console.log(error)
              if(error.name === 'SequelizeValidationError'){
              err({message: 'Your username should be at least 6 characters long', username: username});
            }
              else if(error.name === 'SequelizeUniqueConstraintError') {
              err({message: 'An account with that username already exists', username: username});
              }
            }
            else{
              success({message: 'Account created, please log in now'});
            }
          });
        }
      },
      } // close classMethods
    } //close classMethods outer

  ); // close define user

  return User;
};
