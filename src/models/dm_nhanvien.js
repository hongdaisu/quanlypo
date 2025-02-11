'use strict';
const {
    Model, BOOLEAN
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Dm_NhanVien extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // Định nghĩa mối quan hệ
            Dm_NhanVien.belongsTo(models.Dm_PhongBan, {
                foreignKey: 'PhongBan_Id',
                as: 'phongBan' // Bí danh để sử dụng trong eager loading
            });
        }
    };
    Dm_NhanVien.init({
        DuyetCongVan: DataTypes.INTEGER,
        Index: DataTypes.INTEGER,
        ID_Mapping: DataTypes.INTEGER,
        TenNhanVien: DataTypes.STRING,
        Email: DataTypes.STRING,
        ChucDanh: DataTypes.STRING,
        ChucVu: DataTypes.STRING,
        UserName: DataTypes.STRING,
        SDT: DataTypes.INTEGER,
        PhongBan_Id: DataTypes.INTEGER,
        TrangThai: DataTypes.INTEGER,
        CheckGui: DataTypes.INTEGER,
    }, {
        sequelize,
        modelName: 'Dm_NhanVien',
    });
    return Dm_NhanVien;
};