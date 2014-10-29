"use strict";
module.exports = {
  up: function(migration, DataTypes, done) {
    migration.createTable("Crimes", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      latitude: {
        type: DataTypes.FLOAT
      },
      longitude: {
        type: DataTypes.FLOAT
      },
      crime_type: {
        type: DataTypes.STRING
      },
      date_time: {
        type: DataTypes.STRING
      },
      description: {
        type: DataTypes.STRING
      },
      case_number: {
        type: DataTypes.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      TargetId:{
        type: DataTypes.INTEGER,
        foreignKey: true
      },
    }).done(done);
  },
  down: function(migration, DataTypes, done) {
    migration.dropTable("Crimes").done(done);
  }
};