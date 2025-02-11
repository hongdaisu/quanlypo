'use strict';
const {
  Model, BOOLEAN
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // User.belongsTo(models.Group);
    }
  };
  User.init({
    account: DataTypes.STRING,
    firstName: DataTypes.STRING,
    gender: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    note: DataTypes.STRING,
    File: DataTypes.STRING,
    ky: DataTypes.INTEGER,
    phongban_id: DataTypes.INTEGER,
    use_ehos_id: DataTypes.INTEGER,
    nhanvien_id: DataTypes.INTEGER,
    use_roleId: DataTypes.INTEGER,
    use_groupId: DataTypes.INTEGER,
    positionId: DataTypes.STRING,
    tamngung: DataTypes.INTEGER,
    sudung: DataTypes.INTEGER,
    nguoitaoId: DataTypes.INTEGER,
    nguoicapnhapId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};