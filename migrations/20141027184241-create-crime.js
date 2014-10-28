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
      id: {
        type: DataTypes.INTEGER
      },
      coordinates: {
        type: DataTypes.NUMBER
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
      }
    }).done(done);
  },
  down: function(migration, DataTypes, done) {
    migration.dropTable("Crimes").done(done);
  }
};