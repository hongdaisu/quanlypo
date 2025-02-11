'use strict';
const {
    Model, BOOLEAN
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Data_DotKiemKe extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        // static associate(models) {
        //     // Định nghĩa mối quan hệ
        //     Dm_PhongBan.hasMany(models.Dm_NhanVien, {
        //         foreignKey: 'PhongBan_Id',
        //         as: 'nhanViens' // Bí danh để sử dụng trong eager loading
        //     });
        // }
    };
    Data_DotKiemKe.init({
        KhoDuoc_Id: DataTypes.INTEGER,
        KhoaPhongSuDung: DataTypes.STRING,
        KhoaQuanLy: DataTypes.STRING,
        NamKiemKe: DataTypes.INTEGER,
        NguoiTao: DataTypes.INTEGER,
        LanKiemKe: DataTypes.INTEGER,
    }, {
        sequelize,
        modelName: 'Data_DotKiemKe',
    });
    return Data_DotKiemKe;
};