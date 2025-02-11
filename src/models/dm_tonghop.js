'use strict';
const {
    Model, BOOLEAN, INTEGER
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Dm_TongHop extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // // User.belongsTo(models.Allcode, { foreignKey: 'positionId', targetKey: 'keyMap', as: 'positionData' })
            // // User.belongsTo(models.Allcode, { foreignKey: 'gender', targetKey: 'keyMap', as: 'genderData' })
            // // User.hasOne(models.Markdown, { foreignKey: 'doctorId' })
            // Group.hasMany(models.User);
            // Group.belongsToMany(models.Role, { through: 'Group_Roles' });
        }
    };
    Dm_TongHop.init({
        gioitinh_id: DataTypes.INTEGER,
        mota: DataTypes.STRING,
        loai: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'Dm_TongHop',
    });
    return Dm_TongHop;
};