'use strict';
const {
    Model, BOOLEAN
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Data_KiemKe extends Model {
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
    Data_KiemKe.init({
        DotKiemKe_Id: DataTypes.INTEGER,
        STT: DataTypes.INTEGER,
        MaTaiSan: DataTypes.STRING,
        MaTaiSanNew: DataTypes.STRING,
        BenhVien: DataTypes.STRING,
        PhanLoai: DataTypes.STRING,
        TenTaiSan: DataTypes.STRING,
        Model: DataTypes.STRING,
        Serial: DataTypes.STRING,
        TenDonViTinh: DataTypes.STRING,
        ThoiGianDuaVao: DataTypes.DATE,
        NguyenGia: DataTypes.INTEGER,
        Duoc_Id: DataTypes.INTEGER,
        SoLoNhap_Id: DataTypes.INTEGER,
        KhoDuoc_Id: DataTypes.INTEGER,
        KhoDuocSaiViTri_Id: DataTypes.INTEGER,
        ViTri_Id: DataTypes.INTEGER,
        TrangThaiKiemKe: DataTypes.INTEGER,
        IsCheckKiemKe: DataTypes.INTEGER,
        LanKiemKe: DataTypes.INTEGER,
        SoLuong: DataTypes.INTEGER,
        NguoiSuDung_Id: DataTypes.INTEGER,
        NguoiSuDung: DataTypes.STRING,
        KhoaPhongSuDung: DataTypes.STRING,
        ViTri: DataTypes.STRING,
        GhiChu: DataTypes.STRING,
        KhoaQuanLy: DataTypes.STRING,
        KhoaQuanLySaiViTri: DataTypes.STRING,
        SoLuongThucTe: DataTypes.INTEGER,
        ChenhLech: DataTypes.INTEGER,
        KhoaPhongHienTai: DataTypes.STRING,
        ViTriHienTai: DataTypes.STRING,
        GhiChuHienTai: DataTypes.STRING,
        TinhTrang: DataTypes.STRING,
        CheckMaTaiSan: DataTypes.INTEGER,
        XacNhanKiemKe: DataTypes.INTEGER,
        NguoiTao: DataTypes.INTEGER,
        NamKiemKe: DataTypes.INTEGER,
        NgayKiemKe: DataTypes.DATE,
        NgayXacNhanKiemKe: DataTypes.DATE,
        TrangThaiChuyen: DataTypes.INTEGER,
    }, {
        sequelize,
        modelName: 'Data_KiemKe',
    });
    return Data_KiemKe;
};