"use strict";

module.exports = function(sequelize, DataTypes) {
  var Target = sequelize.define("Target", {
    name: DataTypes.STRING,
    age: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        Target.hasMany(models.Crime);
      }
    }
  });

  return Target;
};
