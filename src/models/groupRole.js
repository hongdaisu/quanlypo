'use strict';
const {
  Model, BOOLEAN, INTEGER
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Group_Roles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Group_Roles.hasMany(models.Role, { foreignKey: 'id', as: 'role_id' })
      // User.belongsTo(models.Allcode, { foreignKey: 'positionId', targetKey: 'keyMap', as: 'positionData' })
      // User.belongsTo(models.Allcode, { foreignKey: 'gender', targetKey: 'keyMap', as: 'genderData' })
      // User.hasOne(models.Markdown, { foreignKey: 'doctorId' })
      // User.hasOne(models.Doctor_Infor, { foreignKey: 'doctorId' })
    }
  };
  Group_Roles.init({
    groupId: DataTypes.INTEGER,
    roleId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Group_Roles',
  });
  return Group_Roles;
};