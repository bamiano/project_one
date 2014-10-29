"use strict";

module.exports = function(sequelize, DataTypes) {
  var Crime = sequelize.define("Crime", {
    latitude: DataTypes.FLOAT,
    longitude: DataTypes.FLOAT,
    crime_type: DataTypes.STRING,
    date_time: DataTypes.STRING,
    description: DataTypes.STRING,
    case_number: DataTypes.INTEGER,
    TargetId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        Crime.belongsTo(models.Target);
      }
    }
  });

  return Crime;
};
