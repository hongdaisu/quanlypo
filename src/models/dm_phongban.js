'use strict';
const {
    Model, BOOLEAN
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Dm_PhongBan extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // Định nghĩa mối quan hệ
            Dm_PhongBan.hasMany(models.Dm_NhanVien, {
                foreignKey: 'PhongBan_Id',
                as: 'nhanViens' // Bí danh để sử dụng trong eager loading
            });
        }
    };
    Dm_PhongBan.init({
        ID_Mapping: DataTypes.INTEGER,
        TenPhongBan: DataTypes.STRING,
        Note: DataTypes.STRING,
        TruongKhoa: DataTypes.STRING,
        DieuDuongTruong: DataTypes.STRING,
        NguoiTao_Id: DataTypes.INTEGER,
        NguoiCapNhap_Id: DataTypes.INTEGER,
    }, {
        sequelize,
        modelName: 'Dm_PhongBan',
    });
    return Dm_PhongBan;
};