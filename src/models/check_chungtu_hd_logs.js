'use strict';
const {
    Model, BOOLEAN
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Check_Data_ChungTu_Hd_Log extends Model {
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
    Check_Data_ChungTu_Hd_Log.init({
        id_data_hd: DataTypes.INTEGER,
        mataisan: DataTypes.STRING,
        tentaisan: DataTypes.STRING,
        chungtu_id: DataTypes.INTEGER,
        nhacungcap_id: DataTypes.INTEGER,
        machungtu: DataTypes.STRING,
        tennhacungcap: DataTypes.STRING,
        ngaychungtu: DataTypes.DATE,
        khonhap: DataTypes.STRING,
        nguoinhap: DataTypes.STRING,
        soluongnhap: DataTypes.INTEGER,
        dongianhap: DataTypes.INTEGER,
        dongianhapvat: DataTypes.INTEGER,
        vatnhap: DataTypes.INTEGER,
        thanhtiennhap: DataTypes.INTEGER,
        thanhtiennhapvat: DataTypes.INTEGER,
        nguoikiemtra_id: DataTypes.INTEGER,
        dongianhap_check: DataTypes.INTEGER,
        dongianhapvat_check: DataTypes.INTEGER,
        hieuluc_check: DataTypes.INTEGER,
        ngaykiemtra: DataTypes.DATE,
        check_dongianhap: DataTypes.INTEGER,
        check_dongianhapvat: DataTypes.INTEGER,
    }, {
        sequelize,
        modelName: 'Check_Data_ChungTu_Hd_Log',
    });
    return Check_Data_ChungTu_Hd_Log;
};