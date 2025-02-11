'use strict';
const {
    Model, BOOLEAN
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Log_SendEmail extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // User.belongsTo(models.Group);
        }
    };
    Log_SendEmail.init({
        CapGui_Id: DataTypes.INTEGER,
        NhanVien_Id: DataTypes.INTEGER,
        TenPhongBan: DataTypes.STRING,
        CongVan_Id: DataTypes.INTEGER,
        ThoiGianGui: DataTypes.DATE,
        TrangThaiNhan: DataTypes.INTEGER,
        TrangThaiXem: DataTypes.INTEGER,
        ThoiGianNhan: DataTypes.DATE,
        NgayCheckEmail: DataTypes.DATE,
        GuiLai: DataTypes.INTEGER,
        GuiNhanVien: DataTypes.INTEGER,
        TrangThaiNVXem: DataTypes.INTEGER,
        ThoiGianGuiNhanVien: DataTypes.DATE,
        ThoiGianNhanVienNhan: DataTypes.DATE,
        NhanVienNhan_Id: DataTypes.INTEGER,
        PhongBan_Id: DataTypes.INTEGER,
        NhanVienNhan: DataTypes.INTEGER,
        EmailNhanVien: DataTypes.STRING,
        GhiChu: DataTypes.STRING,
        CheckGui: DataTypes.INTEGER,
        TrangThaiHoanTat: DataTypes.INTEGER,
        ThoiGianHoanTat: DataTypes.DATE,
        GhiChuHoanTat: DataTypes.STRING,
        NumHoanTat: DataTypes.INTEGER


    }, {
        sequelize,
        modelName: 'Log_SendEmail',
    });
    return Log_SendEmail;
};