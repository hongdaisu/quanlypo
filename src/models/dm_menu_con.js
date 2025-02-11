'use strict';
const {
    Model, BOOLEAN, INTEGER
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Dm_Menu_Con extends Model {
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
    Dm_Menu_Con.init({
        link: DataTypes.STRING,
        menu_cha_id: DataTypes.INTEGER,
        tenmenu_con: DataTypes.STRING,
        group_id: DataTypes.TEXT,
    }, {
        sequelize,
        modelName: 'Dm_Menu_Con',
    });
    return Dm_Menu_Con;
};