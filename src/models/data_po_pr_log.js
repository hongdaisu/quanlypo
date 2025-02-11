'use strict';
const {
    Model, BOOLEAN
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Data_Po_Pr_Log extends Model {
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
    Data_Po_Pr_Log.init({
        id_data_pr: DataTypes.INTEGER,
        mataisan: DataTypes.STRING,
        tentaisan: DataTypes.STRING,
        donvitinh: DataTypes.INTEGER,
        soluongpo: DataTypes.INTEGER,
        soluongpodacheck: DataTypes.INTEGER,
        dongiapo: DataTypes.INTEGER,
        vat: DataTypes.INTEGER,
        dongiapovat: DataTypes.INTEGER,
        thanhtien: DataTypes.INTEGER,
        thanhtienvat: DataTypes.INTEGER,
        sopo: DataTypes.STRING,
        sopr: DataTypes.STRING,
        nguoikiemtra_id: DataTypes.INTEGER,
        ngaykiemtra: DataTypes.DATE,
    }, {
        sequelize,
        modelName: 'Data_Po_Pr_Log',
    });
    return Data_Po_Pr_Log;
};