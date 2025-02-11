'use strict';
const {
    Model, BOOLEAN
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Check_Data_ChungTu extends Model {
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
    Check_Data_ChungTu.init({
        chungtu_id: DataTypes.INTEGER,
        machungtu: DataTypes.STRING,
        ngaychungtu: DataTypes.DATE,
        mataisan: DataTypes.STRING,
        tentaisan: DataTypes.STRING,
        donvitinh: DataTypes.STRING,
        soluongnhap: DataTypes.INTEGER,
        dongianhap: DataTypes.INTEGER,
        thanhtiennhap: DataTypes.INTEGER,
        vatnhap: DataTypes.INTEGER,
        dongianhapvat: DataTypes.INTEGER,
        thanhtiennhapvat: DataTypes.INTEGER,
        nhacungcap_id: DataTypes.INTEGER,
        tennhacungcap: DataTypes.STRING,
        khonhap: DataTypes.STRING,
        nguoinhap: DataTypes.STRING,
        sopo: DataTypes.STRING,
        trangthai: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'Check_Data_ChungTu',
    });
    return Check_Data_ChungTu;
};