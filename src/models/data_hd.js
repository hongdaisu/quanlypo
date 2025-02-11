'use strict';
const {
    Model, BOOLEAN
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Data_HD extends Model {
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
    Data_HD.init({
        nhacungcap_id: DataTypes.INTEGER,
        tennhacungcap: DataTypes.STRING,
        mataisan: DataTypes.STRING,
        tentaisan: DataTypes.STRING,
        donvitinh: DataTypes.STRING,
        dongiahd: DataTypes.INTEGER,
        vat: DataTypes.INTEGER,
        dongiahdvat: DataTypes.INTEGER,
        dongianhap: DataTypes.INTEGER,
        dongianhap2: DataTypes.INTEGER,
        dongianhapvat: DataTypes.INTEGER,
        dongianhapvat2: DataTypes.INTEGER,
        soluongdanhap: DataTypes.INTEGER,
        soluongdanhap2: DataTypes.INTEGER,
        checkhieuluc: DataTypes.INTEGER,
        rn: DataTypes.STRING,
        taitro: DataTypes.STRING,
        tinhtaitro: DataTypes.STRING,
        sohopdong: DataTypes.STRING,
        nguoitao_id: DataTypes.INTEGER,
        ngayhieuluc: DataTypes.DATE,
        ngayketthuc: DataTypes.DATE,
        checkma: DataTypes.INTEGER,
        checkten: DataTypes.INTEGER,
        checknhacungcap: DataTypes.INTEGER,
        dacheckvoict: DataTypes.INTEGER,
        dacheckvoict2: DataTypes.INTEGER,
        checkmataisanvoict: DataTypes.INTEGER,
        checkmataisanvoict2: DataTypes.INTEGER,

    }, {
        sequelize,
        modelName: 'Data_HD',
    });
    return Data_HD;
};