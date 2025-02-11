import express from "express";
import userController from "../controllers/userController";
import phongbanController from "../controllers/phongbanController";
import grouproleController from "../controllers/grouproleController";
import menuController from "../controllers/menuController";
import importController from "../controllers/importController";
import nhanvienController from "../controllers/nhanvienController";
import urlController from "../controllers/urlController";
import exportController from "../controllers/exportController";
import { checkUserJWT, checkUserPermission, checkButonPermission } from '../middleware/JWTAction';
import multer from "multer";
import fs from "fs";

require('dotenv').config();

// const app = express();
let router = express.Router();

import path from "path";
// const uploadnew = multer({ dest: path.join(__dirname, "../uploads/") });
// const uploadedit = multer({ dest: path.join(__dirname, "../uploads/") });
// const uploadnew_congvandi = multer({ dest: path.join(__dirname, "../uploads/") });
// const uploadedit_congvandi = multer({ dest: path.join(__dirname, "../uploads/") });

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads/'));
    },
    filename: (req, file, cb) => {
        // Convert original name from latin1 to utf8
        const originalNameBuffer = Buffer.from(file.originalname, 'latin1');
        const originalName = originalNameBuffer.toString('utf8');
        cb(null, originalName);
    }
});

const storageimage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../image/'));
    },
    filename: (req, file, cb) => {
        // Convert original name from latin1 to utf8
        const originalNameBuffer = Buffer.from(file.originalname, 'latin1');
        const originalName = originalNameBuffer.toString('utf8');
        cb(null, originalName);
    }
});

const uploadnew_congvandi = multer({ storage: storage });
const uploadedit_congvandi = multer({ storage: storage });
const uploadnew = multer({ storage: storage });
const uploadnewmerge = multer({ storage: storage });
const uploadedit = multer({ storage: storage });
const uploadedituser = multer({ storage: storageimage });


let initWebRoutes = (app) => {
    router.all('*', checkUserJWT, checkUserPermission, checkButonPermission); //checkUserPermission,checkButonPermission

    // router.get('/api/url-view', (req, res) => {
    //     res.json({ url: process.env.URL_VIEW });
    // });

    // Cấu hình phục vụ các tệp tĩnh từ thư mục uploads
    const uploadsDirectory = path.join(__dirname, '..', 'uploads');
    app.use('/uploads', express.static(uploadsDirectory));

    // Cấu hình phục vụ các tệp tĩnh từ thư mục image
    const uploadsDirectoryimgae = path.join(__dirname, '..', 'image');
    app.use('/image', express.static(uploadsDirectoryimgae));


    router.get('/api/url-view', urlController.getUrlView);
    router.post('/api/import-po', importController.handleImportPO);
    router.get('/api/get-all-po', importController.handleGetAllPO);
    router.post('/api/get-chungtu', importController.handleGetChungTu);
    router.post('/api/get-checkchungtu', importController.handleGetCheckChungTu);
    router.post('/api/edit-mataisan', importController.handleEditMaTaiSan);
    router.post('/api/edit-mataisannew', importController.handleEditMaTaiSanNew);
    router.post('/api/get-one-po', importController.handleGetOnePo);
    router.post('/api/get-all-log-chungtu-po', importController.handleGetAllLogChungTuPO);
    router.post('/api/get-check-all-log-chungtu-po', importController.handleGetCheckAllLogChungTuPO);
    router.post('/api/get-check-po', importController.handleGetCheckPO);
    router.post('/api/get-check-editmataisanpo', importController.handleGetCheckEditMaTaiSanPO);
    router.post('/api/get-check-editsoluongpo', importController.handleGetCheckEditSoLuongPO);
    router.post('/api/get-check-editmataisanpr', importController.handleGetCheckEditMaTaiSanPR);
    router.delete('/api/delete-po', menuController.handleDeletePO);
    router.post('/api/check-machungtu-po', importController.handleCheckMaChungTuPO);
    router.post('/api/delete-log-ctpo', menuController.handleDeleteLogCTPO);
    router.post('/api/delete-check-log-ctpo', menuController.handleDeleteCheckLogCTPO);

    router.get('/api/get-all-taisan', importController.handleGetAllTaiSan);
    router.get('/api/get-all-tentaisan', importController.handleGetAllTenTaiSan);
    router.get('/api/get-all-dvt', importController.handleGetAllDVT);
    router.get('/api/get-all-bv', importController.handleGetAllBV);
    router.get('/api/get-all-pl', importController.handleGetAllPL);
    router.get('/api/get-all-tgbh', importController.handleGetAllTGBH);
    router.get('/api/get-all-tgkh', importController.handleGetAllTGKH);
    router.put('/api/edit-taisan', importController.handleEditTaiSan);
    router.post('/api/create-new-ts', importController.handleNewTaiSan);
    router.get('/api/check-xoa-ts/:Duoc_Id', importController.handleCheckXoaTS);
    router.post('/api/delete-taisan', menuController.handleDeleteTaiSan);

    router.get('/api/get-all-kho', importController.handleGetAllKho);
    router.get('/api/get-lankiemke', importController.handleGetLanKiemKe);
    router.get('/api/get-all-kho-qltk', importController.handleGetAllKhoQLTK);
    router.get('/api/get-all-kho-edit', importController.handleGetAllKhoEdit);
    router.get('/api/get-all-vitri', importController.handleGetAllViTri);
    router.get('/api/get-all-nguoisudung', importController.handleGetAllNguoiSuDung);
    router.get('/api/get-all-tinhtrang', importController.handleGetAllTinhTrang);
    router.post('/api/get-all-khoql', importController.handleGetAllKhoQL);
    router.post('/api/get-taisantheokho', importController.handleGetTaiSanTheoKho);
    router.post('/api/get-taisantheokho-lichsu', importController.handleGetTaiSanTheoKhoLichSu);
    router.post('/api/get-taisanxacnhantheokho-lichsu', importController.handleGetTaiSanXacNhanTheoKhoLichSu);
    router.post('/api/get-taisanxacnhanallkho-lichsu', importController.handleGetTaiSanXacNhanAllKhoLichSu);
    router.post('/api/get-taisanxacnhantoanvien-kho-lichsu', importController.handleGetTaiSanXacNhanToanVienKhoLichSu);
    router.post('/api/get-lichsukiemke', importController.handleGetLichSuKiemKe);
    router.post('/api/get-taisantheokhoql', importController.handleGetTaiSanTheoKhoQL);
    router.post('/api/get-mataisan-kiemke', importController.handleGetMaTaiSanKiemKe);
    router.post('/api/edit-khoaphonghientai', importController.handleEditKhoaPhongHienTai);
    router.post('/api/get-serial-kiemke', importController.handleGetSerialKiemKe);
    router.get('/api/get-all-nhanvien', importController.handleGetAllNhanVien)
    router.get('/api/get-all-nhanvien-phong', importController.handleGetAllNhanVienPhong)
    router.get('/api/get-all-nguoilap', importController.handleGetAllNguoiLap)
    router.get('/api/get-all-ketoantruong', importController.handleGetKeToanTruong)
    router.get('/api/get-all-ketoantaisan', importController.handleGetKeToanTaiSan)
    router.get('/api/get-all-giamdoc', importController.handleGetGiamDoc)
    router.post('/api/check-dongbo', importController.handleCheckDongBo);

    router.get('/api/get-all-ct', importController.handleGetAllCT);
    router.post('/api/get-check-all-ct', importController.handleGetCheckAllCT);
    router.post('/api/get-check-all', importController.handleGetCheckAll);
    router.post('/api/get-one-ct', importController.handleGetOneCT);
    router.post('/api/get-check-one-ct', importController.handleGetCheckOneCT);
    router.post('/api/check-xoa-chungtu', importController.handleCheckXoaChungTu);
    router.post('/api/check-xoa-check-chungtu', importController.handleCheckXoaCheckChungTu);
    router.post('/api/delete-ct', menuController.handleDeleteCT);
    router.post('/api/delete-check-ct', menuController.handleDeleteCheckCT);
    router.post('/api/xacnhan-kiemke', menuController.handleXacNhanKiemKe);
    router.post('/api/huyxacnhan-kiemke', menuController.handleHuyXacNhanKiemKe);
    router.post('/api/delete-data-kiemke', menuController.handleDeleteDataKiemKe);
    router.post('/api/huy-kiemke', menuController.handleHuyKiemKe);
    router.post('/api/timkiem-data-kiemke', importController.getDaTaKiemKe);
    router.post('/api/xacnhan-themtaisan', importController.handleXacNhanThemTaiSan);
    router.post('/api/checkdata-chuaxacnhan', importController.handleCheckDataChuaXacNhan);

    router.post('/api/import-pr', importController.handleImportPR);
    router.get('/api/get-all-pr', importController.handleGetAllPR);
    router.post('/api/get-one-pr', importController.handleGetOnePR);
    router.post('/api/get-sopo', importController.handleGetSoPO);
    router.post('/api/get-all-log-po-pr', importController.handleGetAllLogPOPR);
    router.post('/api/get-all-log-popr', importController.handleGetLogPOPR);
    router.post('/api/get-check-pr', importController.handleGetCheckPR);
    router.delete('/api/delete-pr', menuController.handleDeletePR);
    router.post('/api/check-po-pr', importController.handleCheckPOPR);
    router.post('/api/delete-log-popr', menuController.handleDeleteLogPOPR);


    router.post('/api/import-hd', importController.handleImportHD);
    router.get('/api/get-all-hd', importController.handleGetAllHD);
    router.post('/api/get-all-log-chungtu-hd', importController.handleGetAllLogChungTuHopDong);
    router.post('/api/get-check-all-log-chungtu-hd', importController.handleGetCheckAllLogChungTuHopDong);
    router.post('/api/get-one-hd', importController.handleGetOneHD);
    router.post('/api/get-machungtu', importController.handleGetMaChungTu);
    router.post('/api/get-check-hd', importController.handleGetCheckHopDong);
    router.delete('/api/delete-hopdong', menuController.handleDeleteHopDong);
    router.post('/api/check-machungtu-hopdong', importController.handleCheckMaChungTuHD);
    router.post('/api/delete-log-cthd', menuController.handleDeleteLogCTHD);
    router.post('/api/delete-check-log-cthd', menuController.handleDeleteCheckLogCTHD);

    router.get('/api/download-file/:filename', importController.handleDownloadFile);
    // router.get('/api/download-po/:filename', importController.handleDownloadDataPO);
    // router.get('/api/download-pr/:filename', importController.handleDownloadDataPR);
    // router.get('/api/download-hd/:filename', importController.handleDownloadDataHD);

    router.post('/api/exportnhapncc', exportController.getExportNhapNCC);
    router.post('/api/exportdatapo', exportController.getExportDataPO);
    router.post('/api/exportdatapr', exportController.getExportDataPR);
    router.post('/api/exportdatahd', exportController.getExportDataHD);
    router.post('/api/export-kiemketaisan', exportController.getExportKiemKeTaiSan);

    router.post('/api/get-action', userController.handleGetAction);
    router.post('/api/login', userController.handleLogin);
    router.post('/api/login-token', userController.handleLoginToken);
    router.post('/api/logout', userController.handleLogout);

    router.get('/api/get-all-users', userController.handleGetAllUsers);
    router.post('/api/create-new-user', userController.handleCreateNewUser);
    // router.put('/api/edit-user', userController.handleEditUser);
    router.put('/api/edit-user', uploadedituser.single('File'), userController.handleEditUser);

    router.delete('/api/delete-user', userController.handleDeleteUser);
    router.get('/api/allcode', userController.getAllCode);
    router.get('/api/get-group_id/:Group_Id', userController.handleGetGroupId);
    router.get('/api/get-all-group', userController.handleGetAllGroup);
    router.post('/api/create-new-user', userController.handleCreateNewUser);
    router.get('/api/get-all-nhanvien', userController.handleGetAllNhanVien);
    router.get('/api/check-xoa-user/:id', userController.handleCheckXoaUser);
    router.get('/api/get-magroup', userController.handleGetMaGroup);

    router.get('/api/get-all-dm-nhanvien', nhanvienController.handleGetAllNhanVien);
    router.get('/api/get-phongban', nhanvienController.handleGetAllPhongBan);
    router.post('/api/create-new-nhanvien', nhanvienController.handleCreateNewNhanVien);
    router.put('/api/edit-nhanvien', nhanvienController.handleEditNhanVien);
    router.get('/api/check-xoa-nhanvien/:id', nhanvienController.handleCheckXoaNhanVien);
    router.delete('/api/delete-nhanvien', nhanvienController.handleDeleteNhanVien);


    router.get('/api/get-all-phongban', phongbanController.handleGetAllPhongBan);
    router.put('/api/get-phongban_id', phongbanController.handleGetPhongBanId);
    router.post('/api/create-new-phongban', phongbanController.handleCreateNewPhongBan);
    router.put('/api/edit-phongban', phongbanController.handleEditPhongBan);
    router.delete('/api/delete-phongban', phongbanController.handleDeletePhongBan);
    router.get('/api/get-all-phongban-his', phongbanController.handleGetAllPhongBanHis);
    router.get('/api/check-xoa-phongban/:id', phongbanController.handleCheckXoaPhongBan);


    router.put('/api/get-all-rolegroup', grouproleController.handleGetAllRoleGroup);
    router.put('/api/get-all-checkrolegroup', grouproleController.handleCheckRoleGroup);
    router.post('/api/create-new-rolegroup', grouproleController.handleCreateNewRoleGroup);

    router.delete('/api/delete-rolegroup', grouproleController.handleDeleteRoleGroup);

    router.get('/api/get-all-role', grouproleController.handleGetAllRole);
    router.post('/api/create-new-role', grouproleController.handleCreateNewRole);
    router.put('/api/edit-role', grouproleController.handleEditRole);
    router.delete('/api/delete-role', grouproleController.handleDeleteRole);

    router.get('/api/get-all-group', grouproleController.handleGetAllGroup);
    router.post('/api/create-new-group', grouproleController.handleCreateNewGroup);
    router.put('/api/edit-group', grouproleController.handleEditGroup);
    router.delete('/api/delete-group', grouproleController.handleDeleteGroup);


    router.get('/api/get-all-menu-con', menuController.handleGetAllMenuCon);
    router.get('/api/get-all-menu-cha', menuController.handleGetAllMenuCha);
    router.post('/api/create-new-menucha', menuController.handleCreateNewMenuCha);
    router.delete('/api/delete-menucha', menuController.handleDeleteMenuCha);
    router.put('/api/edit-menu-cha', menuController.handleEditMenuCha);
    router.get('/api/get-all-select-menu-cha', menuController.handleGetAllSelectMenuCha);
    router.get('/api/get-all-group', menuController.handleGetAllGroup);
    router.put('/api/create-new-menucon', menuController.handleCreateNewMenuCon);
    router.delete('/api/delete-menucon', menuController.handleDeleteMenuCon);
    router.post('/api/get-all-nhomquyen', menuController.handleGetNhomQuyen);
    router.post('/api/get-all-menucha', menuController.handleGetMenuCha);
    router.put('/api/edit-menu-con', menuController.handleEditMenuCon);

    return app.use("/", router);
}

module.exports = initWebRoutes;