"use strict";
module.exports = {
  up: function(migration, DataTypes, done) {
    migration.createTable("Targets", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      name: {
        type: DataTypes.STRING
      },
      age: {
        type: DataTypes.INTEGER
      },
      email: {
        type: DataTypes.STRING
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      UserId:{
        type: DataTypes.INTEGER,
        foreignKey: true
      }
    }).done(done);
  },
  down: function(migration, DataTypes, done) {
    migration.dropTable("Targets").done(done);
  }
};