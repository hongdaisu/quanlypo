'use strict';
const {
    Model, BOOLEAN
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Data_PO extends Model {
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
    Data_PO.init({
        mataisan: DataTypes.STRING,
        tentaisan: DataTypes.STRING,
        donvitinh: DataTypes.STRING,
        soluongpo: DataTypes.INTEGER,
        dongiapo: DataTypes.INTEGER,
        vat: DataTypes.INTEGER,
        dongiapovat: DataTypes.INTEGER,
        thanhtien: DataTypes.INTEGER,
        thanhtienvat: DataTypes.INTEGER,
        sopr: DataTypes.STRING,
        sopo: DataTypes.STRING,
        soluongnhap: DataTypes.INTEGER,
        soluongnhap2: DataTypes.INTEGER,
        vatnhap: DataTypes.INTEGER,
        dongianhap: DataTypes.INTEGER,
        dongianhap2: DataTypes.INTEGER,
        dongiavatnhap: DataTypes.INTEGER,
        dongiavatnhap2: DataTypes.INTEGER,
        soluongdanhap: DataTypes.INTEGER,
        soluongdanhap2: DataTypes.INTEGER,
        nguoikiemtra_id: DataTypes.INTEGER,
        ngaykiemtra: DataTypes.DATE,
        ngaypo: DataTypes.DATE,
        nguoitao_id: DataTypes.INTEGER,
        checkma: DataTypes.INTEGER,
        checkten: DataTypes.INTEGER,
        dacheckvoict: DataTypes.INTEGER,
        checkmataisanvoict: DataTypes.INTEGER,
        dacheckvoict2: DataTypes.INTEGER,
        checkmataisanvoict2: DataTypes.INTEGER,
    }, {
        sequelize,
        modelName: 'Data_PO',
    });
    return Data_PO;
};