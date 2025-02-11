'use strict';
const {
  Model, BOOLEAN, INTEGER
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // // Role.hasMany(models.Group_Role, { foreignKey: 'roleId', as: 'role_id' })
      // // Role.hasMany(models.Group_Role);
      // Role.belongsToMany(models.Group, { through: 'Group_Roles' });
      // // Role.hasMany(models.Group_Role, { foreignKey: 'roleId', as: 'roleData' })
      // // User.belongsTo(models.Allcode, { foreignKey: 'positionId', targetKey: 'keyMap', as: 'positionData' })
      // // User.belongsTo(models.Allcode, { foreignKey: 'gender', targetKey: 'keyMap', as: 'genderData' })
      // // User.hasOne(models.Markdown, { foreignKey: 'doctorId' })
      // // User.hasOne(models.Doctor_Infor, { foreignKey: 'doctorId' })
    }
  };
  Role.init({
    url: DataTypes.STRING,
    action: DataTypes.STRING,
    MoTa: DataTypes.STRING,
    Nhom: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Role',
  });
  return Role;
};