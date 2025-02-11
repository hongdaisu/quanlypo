'use strict';
const {
    Model, BOOLEAN
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Data_PR extends Model {
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
    Data_PR.init({
        mataisan: DataTypes.STRING,
        tentaisan: DataTypes.STRING,
        donvitinh: DataTypes.STRING,
        soluongpr: DataTypes.INTEGER,
        soluongpo: DataTypes.INTEGER,
        tongsoluongpo: DataTypes.INTEGER,
        dongiaprvat: DataTypes.INTEGER,
        thanhtienprvat: DataTypes.INTEGER,
        ghichu: DataTypes.STRING,
        ngaycanhang: DataTypes.DATE,
        nguoikiemtra_id: DataTypes.INTEGER,
        nguoitao_id: DataTypes.INTEGER,
        ngaykiemtra: DataTypes.DATE,
        sopr: DataTypes.STRING,
        checkma: DataTypes.INTEGER,
        checkten: DataTypes.INTEGER,
        dacheckvoict: DataTypes.INTEGER,
        dacheckvoipo: DataTypes.INTEGER,
        checkmataisan: DataTypes.INTEGER,
    }, {
        sequelize,
        modelName: 'Data_PR',
    });
    return Data_PR;
};