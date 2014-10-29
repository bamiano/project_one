"use strict";

module.exports = function(sequelize, DataTypes) {
  var Target = sequelize.define("Target", {
    name: DataTypes.STRING,
    age: DataTypes.INTEGER,
    email: DataTypes.STRING,
    UserId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        Target.belongsTo(models.User);
        Target.hasMany(models.Crime);
      }
    }
  });

  return Target;
};
