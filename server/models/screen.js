'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Screen extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Screen.init({
    siteID: DataTypes.INTEGER,
    url: DataTypes.STRING,
    thumbUrl: DataTypes.STRING,
    deleted: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'Screen',
  });
  return Screen;
};