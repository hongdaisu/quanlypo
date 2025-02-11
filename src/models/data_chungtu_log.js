'use strict';
const {
    Model, BOOLEAN
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Data_ChungTu_Log extends Model {
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
    Data_ChungTu_Log.init({
        id_data_po: DataTypes.INTEGER,
        mataisan: DataTypes.STRING,
        tentaisan: DataTypes.STRING,
        chungtu_id: DataTypes.INTEGER,
        nhacungcap_id: DataTypes.INTEGER,
        tennhacungcap: DataTypes.STRING,
        machungtu: DataTypes.STRING,
        sopo: DataTypes.STRING,
        trangthai: DataTypes.STRING,
        ngaychungtu: DataTypes.DATE,
        khonhap: DataTypes.STRING,
        nguoinhap: DataTypes.STRING,
        soluongnhap: DataTypes.INTEGER,
        dongianhap: DataTypes.INTEGER,
        dongianhapvat: DataTypes.INTEGER,
        vatnhap: DataTypes.INTEGER,
        thanhtiennhap: DataTypes.INTEGER,
        soluongnhap_check: DataTypes.INTEGER,
        dongianhap_check: DataTypes.INTEGER,
        dongianhapvat_check: DataTypes.INTEGER,
        thanhtiennhapvat: DataTypes.INTEGER,
        nguoikiemtra_id: DataTypes.INTEGER,
        ngaykiemtra: DataTypes.DATE,
    }, {
        sequelize,
        modelName: 'Data_ChungTu_Log',
    });
    return Data_ChungTu_Log;
};