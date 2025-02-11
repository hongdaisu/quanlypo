import importService from "../services/importService";
import { raw } from 'body-parser';
const fs = require('fs');
const path = require('path');

import db from "../models/index";
const mssql = require('mssql');
require('dotenv').config();
const { Workbook } = require('exceljs');

let handleGetAllPO = async (req, res) => {
    try {
        let data = await importService.getAllPO();
        return res.status(200).json({
            errCode: 0,
            errMessage: 'ok',
            data
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }
}


let handleGetAllTaiSan = async (req, res) => {
    try {
        let data = await importService.getAllTaiSan();
        return res.status(200).json({
            errCode: 0,
            errMessage: 'ok',
            data
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }
}

// let handleGetAllTenTaiSan = async (req, res) => {
//     try {
//         let data = await importService.getAllTenTaiSan();
//         return res.status(200).json({
//             errCode: 0,
//             errMessage: 'ok',
//             data
//         })
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
//     }
// }

let handleGetAllTenTaiSan = async (req, res) => {
    // // Lấy các tham số từ query parameters
    // const searchTerm = req.query.search || ''; // Mặc định là chuỗi rỗng nếu không có tham số tìm kiếm
    // const offset = parseInt(req.query.offset, 10) || 0; // Mặc định là 0 nếu không có tham số offset

    let query = req.query.search;

    // Kiểm tra và parse JSON
    let parsedQuery = {};
    if (query) {
        try {
            parsedQuery = JSON.parse(query);
        } catch (error) {
            console.error("Invalid JSON in query:", error);
        }
    }
    let searchTerm = parsedQuery.searchTerm || '';  // Lấy ra searchTerm
    let offset = parsedQuery.offset || 0;  // Lấy ra offset (mặc định là 0 nếu không có)

    //console.log('searchTerm controller', searchTerm)

    try {
        // Gọi service với các tham số tìm kiếm, phân trang, và giới hạn
        //let data = await tiepnhanService.getAllSelectDonViHanhChinh(searchTerm, offset);
        let data = await importService.getAllTenTaiSan({ searchTerm, offset });

        // Kiểm tra xem data có phải là promise không và chờ nếu cần
        if (data instanceof Promise) {
            data = await data;
        }

        return res.status(200).json({
            errCode: 0,
            errMessage: 'ok',
            data
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }
};

let handleXacNhanThemTaiSan = async (req, res) => {
    let { KhoTaiSan_Id, tenTaiSan, nhapTenTaiSan, KhoQuanLy, UserId, DotKiemKe_Id, KhoaPhongHienTai } = req.body;
    return new Promise(async (resolve, reject) => {
        //console.log('check data', UserId)
        try {
            let message = await importService.xacNhanThemTaiSan(KhoTaiSan_Id, tenTaiSan, nhapTenTaiSan, KhoQuanLy, UserId, DotKiemKe_Id, KhoaPhongHienTai);
            // console.log(message);
            return res.status(200).json(message);
        } catch (e) {
            reject(e)
        }
    })
}

let handleCheckDataChuaXacNhan = async (req, res) => {
    let { KhoTaiSan_Id, KhoQuanLy } = req.body;
    return new Promise(async (resolve, reject) => {
        //console.log('check data', data)
        try {
            let message = await importService.checkDataChuaXacNhan(KhoTaiSan_Id, KhoQuanLy);
            // console.log(message);
            return res.status(200).json(message);
        } catch (e) {
            reject(e)
        }
    })
}

let handleGetAllDVT = async (req, res) => {
    try {
        let data = await importService.getAllDVT();
        return res.status(200).json({
            errCode: 0,
            errMessage: 'ok',
            data
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }
}

let handleGetAllNhanVien = async (req, res) => {
    try {
        let data = await importService.getAllNhanVien();
        return res.status(200).json({
            errCode: 0,
            errMessage: 'ok',
            data
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }
}

let handleGetAllNguoiLap = async (req, res) => {
    try {
        let data = await importService.getAllNguoiLap();
        return res.status(200).json({
            errCode: 0,
            errMessage: 'ok',
            data
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }
}

let handleGetKeToanTaiSan = async (req, res) => {
    try {
        let data = await importService.getKeToanTaiSan();
        return res.status(200).json({
            errCode: 0,
            errMessage: 'ok',
            data
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }
}

let handleGetKeToanTruong = async (req, res) => {
    try {
        let data = await importService.getKeToanTruong();
        return res.status(200).json({
            errCode: 0,
            errMessage: 'ok',
            data
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }
}

let handleGetGiamDoc = async (req, res) => {
    try {
        let data = await importService.getGiamDoc();
        return res.status(200).json({
            errCode: 0,
            errMessage: 'ok',
            data
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }
}

let handleGetAllNhanVienPhong = async (req, res) => {
    try {
        let data = await importService.getAllNhanVienPhong();
        return res.status(200).json({
            errCode: 0,
            errMessage: 'ok',
            data
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }
}

let handleGetAllBV = async (req, res) => {
    try {
        let data = await importService.getAllBV();
        return res.status(200).json({
            errCode: 0,
            errMessage: 'ok',
            data
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }
}

let handleGetAllKho = async (req, res) => {
    try {
        let data = await importService.getAllKho();
        return res.status(200).json({
            errCode: 0,
            errMessage: 'ok',
            data
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }
}

let handleGetLanKiemKe = async (req, res) => {
    try {
        let data = await importService.getLanKiemKe();
        return res.status(200).json({
            errCode: 0,
            errMessage: 'ok',
            data
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }
}

let handleGetAllKhoQLTK = async (req, res) => {
    try {
        let data = await importService.getAllKhoQLTK();
        return res.status(200).json({
            errCode: 0,
            errMessage: 'ok',
            data
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }
}

let handleGetAllKhoEdit = async (req, res) => {
    try {
        let data = await importService.getAllKhoEdit();
        return res.status(200).json({
            errCode: 0,
            errMessage: 'ok',
            data
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }
}

let handleGetAllViTri = async (req, res) => {
    try {
        let data = await importService.getAllViTri();
        return res.status(200).json({
            errCode: 0,
            errMessage: 'ok',
            data
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }
}

let handleGetAllNguoiSuDung = async (req, res) => {
    try {
        let data = await importService.getAllNguoiSuDung();
        return res.status(200).json({
            errCode: 0,
            errMessage: 'ok',
            data
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }
}

let handleCheckDongBo = async (req, res) => {
    try {
        let { LanKiemKe, NamKiemKe } = req.body;
        //console.log('LanKiemKe', LanKiemKe)
        let message = await importService.getCheckDongBo(LanKiemKe, NamKiemKe);
        return res.status(200).json(message);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }
}

let handleGetAllTinhTrang = async (req, res) => {
    try {
        let data = await importService.getAllTinhTrang();
        return res.status(200).json({
            errCode: 0,
            errMessage: 'ok',
            data
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }
}

// let handleGetAllKhoQL = async (req, res) => {
//     try {
//         let { KhoTaiSan_Id } = req.body;
//         //console.log('KhoTaiSan_Id', KhoTaiSan_Id, UserId)
//         let data = await importService.getAllKhoQL(KhoTaiSan_Id);
//         return res.status(200).json({
//             errCode: 0,
//             errMessage: 'ok',
//             data
//         })
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
//     }
// }

let handleGetAllKhoQL = async (req, res) => {
    try {
        //let { KhoTaiSan_Id } = req.body;
        //console.log('KhoTaiSan_Id', KhoTaiSan_Id, UserId)
        let data = await importService.getAllKhoQL();
        return res.status(200).json({
            errCode: 0,
            errMessage: 'ok',
            data
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }
}

let handleGetAllPL = async (req, res) => {
    try {
        let data = await importService.getAllPL();
        return res.status(200).json({
            errCode: 0,
            errMessage: 'ok',
            data
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }
}

let handleGetAllTGBH = async (req, res) => {
    try {
        let data = await importService.getAllTGBH();
        return res.status(200).json({
            errCode: 0,
            errMessage: 'ok',
            data
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }
}

let handleGetAllTGKH = async (req, res) => {
    try {
        let data = await importService.getAllTGKH();
        return res.status(200).json({
            errCode: 0,
            errMessage: 'ok',
            data
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }
}


let handleEditTaiSan = async (req, res) => {
    try {
        let data = req.body;
        //console.log('data', data)
        let message = await importService.editTaiSan(data);
        return res.status(200).json(message);
    } catch (e) {
        // console.log('get all code', e)
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}

let handleNewTaiSan = async (req, res) => {
    try {
        let data = req.body;
        //console.log('data', data)
        let message = await importService.newTaiSan(data);
        return res.status(200).json(message);
    } catch (e) {
        // console.log('get all code', e)
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}

let handleCheckXoaTS = async (req, res) => {
    let Duoc_Id = req.params.Duoc_Id;
    // console.log('id', id)
    return new Promise(async (resolve, reject) => {
        try {
            let message = await importService.checkXoaTS(Duoc_Id);
            return res.status(200).json(message);
        } catch (e) {
            reject(e)
        }
    })
}

let handleGetAllCT = async (req, res) => {
    try {
        let data = await importService.getAllCT();
        return res.status(200).json({
            errCode: 0,
            errMessage: 'ok',
            data
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }
}

let handleGetCheckAllCT = async (req, res) => {
    try {
        let data = await importService.getCheckAllCT();
        return res.status(200).json({
            errCode: 0,
            errMessage: 'ok',
            data
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }
}

let handleGetCheckAll = async (req, res) => {
    try {
        let { machungtu } = req.body;
        //console.log('machungtu', machungtu)
        let data = await importService.getCheckAll(machungtu);
        return res.status(200).json({
            errCode: 0,
            errMessage: 'ok',
            data
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }
}

let handleGetAllLogChungTuHopDong = async (req, res) => {
    try {
        let { nhacungcap_id } = req.body;
        let data = await importService.getAllLogChungTuHopDong(nhacungcap_id);
        return res.status(200).json({
            errCode: 0,
            errMessage: 'ok',
            data
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }
}

let handleGetTaiSanTheoKho = async (req, res) => {
    try {
        let { KhoTaiSan_Id, KhoQuanLy, UserId, DotKiemKe_Id } = req.body;
        let data = await importService.getTaiSanTheoKho(KhoTaiSan_Id, KhoQuanLy, UserId, DotKiemKe_Id);
        return res.status(200).json(data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }
}

let handleGetTaiSanTheoKhoLichSu = async (req, res) => {
    try {
        let { KhoTaiSan_Id, KhoQuanLy, UserId, DotKiemKe_Id } = req.body;
        let data = await importService.getTaiSanTheoKhoLichSu(KhoTaiSan_Id, KhoQuanLy, UserId, DotKiemKe_Id);
        return res.status(200).json(data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }
}

let handleGetTaiSanXacNhanTheoKhoLichSu = async (req, res) => {
    try {
        let { KhoTaiSan_Id, KhoQuanLy, UserId, DotKiemKe_Id } = req.body;
        let data = await importService.getTaiSanXacNhanTheoKhoLichSu(KhoTaiSan_Id, KhoQuanLy, UserId, DotKiemKe_Id);
        return res.status(200).json(data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }
}

let handleGetTaiSanXacNhanAllKhoLichSu = async (req, res) => {
    try {
        let { KhoTaiSan_Id, UserId, DotKiemKe_Id } = req.body;
        let data = await importService.getTaiSanXacNhanAllKhoLichSu(KhoTaiSan_Id, UserId, DotKiemKe_Id);
        return res.status(200).json(data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }
}

let handleGetTaiSanXacNhanToanVienKhoLichSu = async (req, res) => {
    try {
        let { TimKiemKhoQuanLy, UserId } = req.body;
        let data = await importService.getTaiSanXacNhanToanVienKhoLichSu(TimKiemKhoQuanLy, UserId);
        return res.status(200).json(data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }
}

let handleGetLichSuKiemKe = async (req, res) => {
    try {
        let { KhoTaiSan_Id, UserId } = req.body;
        let data = await importService.getLichSuKiemKe(KhoTaiSan_Id, UserId);
        return res.status(200).json(data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }
}

let handleGetTaiSanTheoKhoQL = async (req, res) => {
    try {
        let { KhoSuDung, KhoQuanLy, DotKiemKe_Id } = req.body;
        //console.log('KhoTaiSan_Id', KhoTaiSan_Id, UserId)
        let data = await importService.getTaiSanTheoKhoQL(KhoSuDung, KhoQuanLy, DotKiemKe_Id);
        // return res.status(200).json({
        //     errCode: 0,
        //     errMessage: 'ok',
        //     data
        // })
        return res.status(200).json(data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }
}

let handleGetMaTaiSanKiemKe = async (req, res) => {
    try {
        let { MaTaiSan, KhoTaiSan_Id, KhoQuanLy, UserId, DotKiemKe_Id, KhoaPhongHienTai } = req.body;
        //console.log('handleGetMaTaiSanKiemKe', KhoTaiSan_Id, MaTaiSan)
        let data = await importService.getMaTaiSanKiemKe(MaTaiSan, KhoTaiSan_Id, KhoQuanLy, UserId, DotKiemKe_Id, KhoaPhongHienTai);
        return res.status(200).json(data);
        // return res.status(200).json({
        //     errCode: 0,
        //     errMessage: 'ok',
        //     data
        // })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }
}


let handleGetSerialKiemKe = async (req, res) => {
    try {
        let { Serial, KhoTaiSan_Id, KhoQuanLy, UserId, DotKiemKe_Id, KhoaPhongHienTai } = req.body;
        //console.log('handleGetMaTaiSanKiemKe', KhoTaiSan_Id, MaTaiSan)
        let data = await importService.getSerialKiemKe(Serial, KhoTaiSan_Id, KhoQuanLy, UserId, DotKiemKe_Id, KhoaPhongHienTai);
        return res.status(200).json(data);
        // return res.status(200).json({
        //     errCode: 0,
        //     errMessage: 'ok',
        //     data
        // })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }
}

let handleGetCheckAllLogChungTuHopDong = async (req, res) => {
    try {
        let { nhacungcap_id } = req.body;
        let data = await importService.getCheckAllLogChungTuHopDong(nhacungcap_id);
        return res.status(200).json({
            errCode: 0,
            errMessage: 'ok',
            data
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }
}

let handleGetAllLogChungTuPO = async (req, res) => {
    try {
        let { sopo } = req.body;
        let data = await importService.getAllLogChungTuPO(sopo);
        return res.status(200).json({
            errCode: 0,
            errMessage: 'ok',
            data
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }
}

let handleGetCheckAllLogChungTuPO = async (req, res) => {
    try {
        let { sopo } = req.body;
        let data = await importService.getCheckAllLogChungTuPO(sopo);
        return res.status(200).json({
            errCode: 0,
            errMessage: 'ok',
            data
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }
}

let handleGetAllLogPOPR = async (req, res) => {
    try {
        let { sopr } = req.body;
        let data = await importService.getAllLogPOPR(sopr);
        return res.status(200).json({
            errCode: 0,
            errMessage: 'ok',
            data
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }
}

let handleGetLogPOPR = async (req, res) => {
    try {
        let { sopr } = req.body;
        let data = await importService.getLogPOPR(sopr);
        return res.status(200).json({
            errCode: 0,
            errMessage: 'ok',
            data
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }
}

let handleGetCheckHopDong = async (req, res) => {
    try {
        let { nhacungcap_id } = req.body;
        let data = await importService.getCheckHopDong(nhacungcap_id);
        return res.status(200).json(data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }
}

let handleGetCheckPO = async (req, res) => {
    try {
        let { sopo } = req.body;
        let data = await importService.getCheckPO(sopo);
        return res.status(200).json(data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }
}

let handleGetCheckEditMaTaiSanPO = async (req, res) => {
    try {
        let { sopo, mataisan } = req.body;
        let data = await importService.getCheckEditMaTaiSanPO(sopo, mataisan);
        return res.status(200).json(data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }
}

let handleGetCheckEditSoLuongPO = async (req, res) => {
    try {
        let { sopo, mataisan } = req.body;
        let data = await importService.getCheckEditSoLuongPO(sopo, mataisan);
        return res.status(200).json(data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }
}

let handleGetCheckEditMaTaiSanPR = async (req, res) => {
    try {
        let { sopr, mataisan } = req.body;
        let data = await importService.getCheckEditMaTaiSanPR(sopr, mataisan);
        return res.status(200).json(data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }
}

let handleGetCheckPR = async (req, res) => {
    try {
        let { sopr } = req.body;
        let data = await importService.getCheckPR(sopr);
        return res.status(200).json(data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }
}

let handleGetAllHD = async (req, res) => {
    try {
        let data = await importService.getAllHD();
        return res.status(200).json({
            errCode: 0,
            errMessage: 'ok',
            data
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }
}

let handleGetAllPR = async (req, res) => {
    try {
        let data = await importService.getAllPR();
        return res.status(200).json({
            errCode: 0,
            errMessage: 'ok',
            data
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }
}

let handleImportPO = async (req, res) => {
    let data = req.body;
    return new Promise(async (resolve, reject) => {
        //console.log('check data', data)
        try {
            let message = await importService.importPO(data);
            // console.log(message);
            return res.status(200).json(message);
        } catch (e) {
            reject(e)
        }
    })
}



let handleImportPR = async (req, res) => {
    let data = req.body;
    return new Promise(async (resolve, reject) => {
        //console.log('check data', data)
        try {
            let message = await importService.importPR(data);
            // console.log(message);
            return res.status(200).json(message);
        } catch (e) {
            reject(e)
        }
    })
}

let handleImportHD = async (req, res) => {
    let data = req.body;
    return new Promise(async (resolve, reject) => {
        //console.log('check data', data)
        try {
            let message = await importService.importHD(data);
            // console.log(message);
            return res.status(200).json(message);
        } catch (e) {
            reject(e)
        }
    })
}

let handleEditMaTaiSan = async (req, res) => {
    let data = req.body;
    return new Promise(async (resolve, reject) => {
        // console.log('check data', data)
        try {
            let message = await importService.editMaTaiSan(data);
            return res.status(200).json(message);
        } catch (e) {
            reject(e)
        }
    })
}

let handleEditKhoaPhongHienTai = async (req, res) => {
    let data = req.body;
    return new Promise(async (resolve, reject) => {
        // console.log('check data', data)
        try {
            let message = await importService.editKhoaPhongHienTai(data);
            return res.status(200).json(message);
        } catch (e) {
            reject(e)
        }
    })
}

let handleEditMaTaiSanNew = async (req, res) => {
    let data = req.body;
    return new Promise(async (resolve, reject) => {
        //console.log('check data', data)
        try {
            let message = await importService.editMaTaiSanNew(data);
            return res.status(200).json(message);
        } catch (e) {
            reject(e)
        }
    })
}

let handleGetChungTu = async (req, res) => {
    try {
        let { machungtu, UserId } = req.body;
        //console.log('machungtu', machungtu, UserId)
        let data = await importService.getMaChungTu(machungtu, UserId);
        return res.status(200).json(data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }
}

let handleGetCheckChungTu = async (req, res) => {
    try {
        let { machungtu, UserId } = req.body;
        //console.log('machungtu', machungtu, UserId)
        let data = await importService.getCheckMaChungTu(machungtu, UserId);
        return res.status(200).json(data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }
}

let handleGetMaChungTu = async (req, res) => {
    try {
        let { machungtu, UserId } = req.body;
        //console.log('machungtu', machungtu, UserId)
        let data = await importService.getChungTu(machungtu, UserId);
        return res.status(200).json(data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }
}

let handleCheckMaChungTuHD = async (req, res) => {
    try {
        let { machungtu } = req.body;
        //console.log('machungtu', machungtu, UserId)
        let data = await importService.checkMaChungTuHD(machungtu);
        return res.status(200).json(data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }
}

let handleCheckXoaChungTu = async (req, res) => {
    try {
        let { machungtu } = req.body;
        //console.log('machungtu', machungtu, UserId)
        let data = await importService.checkXoaChungTu(machungtu);
        return res.status(200).json(data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }
}

let handleCheckXoaCheckChungTu = async (req, res) => {
    try {
        let { machungtu } = req.body;
        //console.log('machungtu', machungtu, UserId)
        let data = await importService.checkXoaCheckChungTu(machungtu);
        return res.status(200).json(data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }
}

let handleCheckMaChungTuPO = async (req, res) => {
    try {
        let { machungtu } = req.body;
        //console.log('machungtu', machungtu, UserId)
        let data = await importService.checkMaChungTuPO(machungtu);
        return res.status(200).json(data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }
}

let handleCheckPOPR = async (req, res) => {
    try {
        let { sopo } = req.body;
        //console.log('machungtu', machungtu, UserId)
        let data = await importService.checkPOPR(sopo);
        return res.status(200).json(data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }
}

let handleGetOnePo = async (req, res) => {
    try {
        let { machungtu } = req.body;
        let data = await importService.getOnePo(machungtu);
        return res.status(200).json({
            errCode: 0,
            errMessage: 'ok',
            data
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }
}

let handleGetOneCT = async (req, res) => {
    try {
        let { machungtu } = req.body;
        let data = await importService.getOneCT(machungtu);
        return res.status(200).json({
            errCode: 0,
            errMessage: 'ok',
            data
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }
}

let handleGetCheckOneCT = async (req, res) => {
    try {
        let { machungtu } = req.body;
        let data = await importService.getCheckOneCT(machungtu);
        return res.status(200).json({
            errCode: 0,
            errMessage: 'ok',
            data
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }
}

let handleGetOnePR = async (req, res) => {
    try {
        let { sopo } = req.body;
        //console.log('soPO handleGetOnePR', soPO)
        let data = await importService.getOnePR(sopo);
        return res.status(200).json({
            errCode: 0,
            errMessage: 'ok',
            data
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }
}

let handleGetOneHD = async (req, res) => {
    try {
        let { machungtu } = req.body;
        //console.log('soPO handleGetOnePR', soPO)
        let data = await importService.getOneHD(machungtu);
        return res.status(200).json({
            errCode: 0,
            errMessage: 'ok',
            data
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }
}

let handleDownloadDataPO = async (req, res) => {
    try {
        // const filename = req.params.filename; // Lấy tên file từ URL

        // // Lấy dữ liệu từ DB thông qua stored procedure
        // let data = await db.sequelize.query('CALL sp_get_all_po', { raw: false });
        // console.log('data:', data);

        // // Tạo workbook mới
        // const workbook = new Workbook();
        // const worksheet = workbook.addWorksheet('Data');

        const filename = req.params.filename; // Lấy tên file từ URL
        const uploadsDir = path.join(__dirname, '../uploads');

        // Thay đổi quyền của thư mục uploads để cho phép ghi file
        await fs.promises.chmod(uploadsDir, 0o755); // 0o755 là quyền đọc-ghi cho chủ sở hữu và chỉ đọc cho các user khác

        // Lấy dữ liệu từ DB thông qua stored procedure
        let data = await db.sequelize.query('CALL sp_get_all_po', { raw: false });
        //console.log('data:', data);

        // Tạo workbook mới
        const workbook = new Workbook();
        const worksheet = workbook.addWorksheet('Data');

        // Thêm tiêu đề vào worksheet
        worksheet.columns = [
            { header: 'Mã Tài Sản', key: 'mataisan', width: 30 },
            { header: 'Check vói danh mục', key: 'checkmats', width: 30 },
            { header: 'Tên Tài Sản', key: 'tentaisan', width: 30 },
            { header: 'Check vói danh mục', key: 'checktents', width: 30 },
            { header: 'Đơn Vị Tính', key: 'donvitinh', width: 15 },
            { header: 'Số Lượng PO', key: 'soluongpo', width: 15 },
            { header: 'Đơn Giá PO', key: 'dongiapo', width: 15 },
            { header: 'VAT', key: 'vat', width: 15 },
            { header: 'Thành Tiền', key: 'thanhtien', width: 15 },
            { header: 'Số PR', key: 'sopr', width: 15 },
            { header: 'Số PO', key: 'sopo', width: 15 },
            { header: 'Người tạo', key: 'nguoitao', width: 15 },
            { header: 'Ngày Tạo', key: 'ngaytao', width: 20 },
            { header: 'Ngày PO', key: 'ngaypo', width: 20 }
            // Thêm các cột khác ở đây nếu cần
        ];

        // Kiểm tra xem data có phải là một mảng không
        if (Array.isArray(data)) {
            // Duyệt qua từng đối tượng trong mảng
            data.forEach(item => {
                const ngaypoFormatted = new Date(item.ngaypo).toLocaleDateString('en-GB');
                // Thêm các thuộc tính của item vào worksheet
                worksheet.addRow({
                    //id: item.id,
                    mataisan: item.mataisan,
                    checkmats: item.checkmats,
                    tentaisan: item.tentaisan,
                    checktents: item.checktents,
                    donvitinh: item.donvitinh,
                    soluongpo: item.soluongpo,
                    dongiapo: item.dongiapo,
                    dongiapovat: item.dongiapovat,
                    vat: item.vat,
                    thanhtien: item.thanhtien,
                    thanhtienvat: item.thanhtienvat,
                    sopr: item.sopr,
                    sopo: item.sopo,
                    ngaypo: ngaypoFormatted,
                    ngaytao: item.ngaytao,
                    nguoitao: item.nguoitao,
                    dacheckvoict: item.dacheckvoict
                });
            });
        } else {
            console.error('Dữ liệu không phải là một mảng:', data);
            return res.status(500).json({ errCode: 500, errMessage: 'Định dạng dữ liệu không đúng' });
        }

        // Đặt tên file để tải về
        const filePath = path.join(__dirname, '../uploads', filename);
        await workbook.xlsx.writeFile(filePath); // Ghi file Excel vào thư mục uploads

        // Gửi file cho client
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);
    } catch (error) {
        console.error('Error during file download:', error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }
};

let handleDownloadDataPR = async (req, res) => {
    try {
        const filename = req.params.filename; // Lấy tên file từ URL

        // Lấy dữ liệu từ DB thông qua stored procedure
        let data = await db.sequelize.query('CALL sp_get_all_pr', { raw: false });
        //console.log('data:', data);

        // Tạo workbook mới
        const workbook = new Workbook();
        const worksheet = workbook.addWorksheet('Data');

        // Thêm tiêu đề vào worksheet
        worksheet.columns = [
            { header: 'Mã Tài Sản', key: 'mataisan', width: 30 },
            { header: 'Check vói danh mục', key: 'checkmats', width: 30 },
            { header: 'Tên Tài Sản', key: 'tentaisan', width: 30 },
            { header: 'Check vói danh mục', key: 'checktents', width: 30 },
            { header: 'Đơn Vị Tính', key: 'donvitinh', width: 15 },
            { header: 'Số Lượng PR', key: 'soluongpr', width: 15 },
            { header: 'Đơn Giá PR', key: 'dongiaprvat', width: 15 },
            { header: 'Thành Tiền', key: 'thanhtienprvat', width: 15 },
            { header: 'Ngày cần hàng', key: 'ngaycanhang', width: 15 },
            { header: 'Ghi chú', key: 'ghichu', width: 15 },
            { header: 'Số PR', key: 'sopr', width: 15 },
            { header: 'Người tạo', key: 'nguoitao', width: 15 },
            { header: 'Ngày Tạo', key: 'ngaytao', width: 20 },
            // Thêm các cột khác ở đây nếu cần
        ];

        // Kiểm tra xem data có phải là một mảng không
        if (Array.isArray(data)) {
            // Duyệt qua từng đối tượng trong mảng
            data.forEach(item => {
                const ngaycanhangFormatted = new Date(item.ngaycanhang).toLocaleDateString('en-GB');
                // Thêm các thuộc tính của item vào worksheet
                worksheet.addRow({
                    id: item.id,
                    mataisan: item.mataisan,
                    checkmats: item.checkmats,
                    tentaisan: item.tentaisan,
                    checktents: item.checktents,
                    donvitinh: item.donvitinh,
                    soluongpr: item.soluongpr,
                    dongiaprvat: item.dongiaprvat,
                    thanhtienprvat: item.thanhtienprvat,
                    sopr: item.sopr,
                    ngaycanhang: ngaycanhangFormatted,
                    ghichu: item.ghichu,
                    ngaytao: item.ngaytao,
                    nguoitao: item.nguoitao,
                });
            });
        } else {
            console.error('Dữ liệu không phải là một mảng:', data);
            return res.status(500).json({ errCode: 500, errMessage: 'Định dạng dữ liệu không đúng' });
        }

        // Đặt tên file để tải về
        const filePath = path.join(__dirname, '../uploads', filename);
        await workbook.xlsx.writeFile(filePath); // Ghi file Excel vào thư mục uploads

        // Gửi file cho client
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);
    } catch (error) {
        console.error('Error during file download:', error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }
};


let handleDownloadDataHD = async (req, res) => {
    try {
        const filename = req.params.filename; // Lấy tên file từ URL

        // Lấy dữ liệu từ DB thông qua stored procedure
        let data = await db.sequelize.query('CALL sp_get_all_hd', { raw: false });
        //console.log('data:', data);

        // Tạo workbook mới
        const workbook = new Workbook();
        const worksheet = workbook.addWorksheet('Data');

        // Thêm tiêu đề vào worksheet
        worksheet.columns = [
            { header: 'Nha cung cấp id', key: 'nhacungcap_id', width: 30 },
            { header: 'Check vói danh mục', key: 'checknhacungcapts', width: 30 },
            { header: 'Tên nhà cung cấp', key: 'tennhacungcap', width: 30 },
            { header: 'Mã Tài Sản', key: 'mataisan', width: 30 },
            { header: 'Check vói danh mục', key: 'checkmats', width: 30 },
            { header: 'Tên Tài Sản', key: 'tentaisan', width: 30 },
            { header: 'Check vói danh mục', key: 'checktents', width: 30 },
            { header: 'Đơn Vị Tính', key: 'donvitinh', width: 15 },
            { header: 'Đơn Giá HĐ', key: 'dongiahd', width: 15 },
            { header: 'VAT', key: 'vat', width: 15 },
            { header: 'Đơn giá VAT', key: 'dongiahdvat', width: 15 },
            { header: 'RN/Công Văn', key: 'rn', width: 15 },
            { header: 'Số HĐ', key: 'sohopdong', width: 15 },
            { header: 'Ngày hiệu lực', key: 'ngayhieuluc', width: 15 },
            { header: 'Ngày kết thúc', key: 'ngayketthuc', width: 15 },
            { header: 'Tài trợ', key: 'taitro', width: 15 },
            { header: 'Căn cứ tài trợ', key: 'tinhtaitro', width: 15 },
            { header: 'Người tạo', key: 'nguoitao', width: 15 },
            { header: 'Ngày Tạo', key: 'ngaytao', width: 20 },
            // Thêm các cột khác ở đây nếu cần
        ];

        // Kiểm tra xem data có phải là một mảng không
        if (Array.isArray(data)) {
            // Duyệt qua từng đối tượng trong mảng
            data.forEach(item => {
                const ngayhieulucFormatted = new Date(item.ngayhieuluc).toLocaleDateString('en-GB');
                const ngayketthucFormatted = new Date(item.ngayketthuc).toLocaleDateString('en-GB');
                // Thêm các thuộc tính của item vào worksheet
                worksheet.addRow({
                    id: item.id,
                    nhacungcap_id: item.nhacungcap_id,
                    checknhacungcapts: item.checknhacungcapts,
                    tennhacungcap: item.tennhacungcap,
                    mataisan: item.mataisan,
                    checkmats: item.checkmats,
                    tentaisan: item.tentaisan,
                    checktents: item.checktents,
                    donvitinh: item.donvitinh,
                    dongiahd: item.dongiahd,
                    vat: item.vat,
                    dongiahdvat: item.dongiahdvat,
                    rn: item.rn,
                    sohopdong: item.sohopdong,
                    ngayhieuluc: ngayhieulucFormatted,
                    ngayketthuc: ngayketthucFormatted,
                    taitro: item.taitro,
                    tinhtaitro: item.tinhtaitro,
                    ngaytao: item.ngaytao,
                    nguoitao: item.nguoitao,
                });
            });
        } else {
            console.error('Dữ liệu không phải là một mảng:', data);
            return res.status(500).json({ errCode: 500, errMessage: 'Định dạng dữ liệu không đúng' });
        }

        // Đặt tên file để tải về
        const filePath = path.join(__dirname, '../uploads', filename);
        await workbook.xlsx.writeFile(filePath); // Ghi file Excel vào thư mục uploads

        // Gửi file cho client
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);
    } catch (error) {
        console.error('Error during file download:', error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }
};


let handleDownloadFile = async (req, res) => {
    try {
        const filename = req.params.filename; // Lấy tên file từ URL
        //console.log('Downloading file:', filename);

        const filePath = path.join(__dirname, '../uploads', filename);

        if (fs.existsSync(filePath)) {
            res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

            const fileStream = fs.createReadStream(filePath);
            fileStream.pipe(res);
        } else {
            return res.status(404).json({ errCode: 404, errMessage: 'File not found' });
        }
    } catch (error) {
        console.error('Error during file download:', error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }
};

let handleGetSoPO = async (req, res) => {
    try {
        let { soPO, UserId } = req.body;
        //console.log('machungtu', machungtu, UserId)
        let data = await importService.getSoPO(soPO, UserId);
        return res.status(200).json(data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }
}

let getDaTaKiemKe = async (req, res) => {
    try {
        let data = req.body
        //console.log('data', data)
        let message = await importService.getDataDaKiemKe(data);
        return res.status(200).json(message);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }
}


module.exports = {
    handleImportPO: handleImportPO,
    handleGetAllPO: handleGetAllPO,
    handleGetChungTu: handleGetChungTu,
    handleEditMaTaiSan: handleEditMaTaiSan,
    handleGetOnePo: handleGetOnePo,
    handleDownloadFile: handleDownloadFile,
    handleGetAllPR: handleGetAllPR,
    handleImportPR: handleImportPR,
    handleGetOnePR: handleGetOnePR,
    handleGetSoPO: handleGetSoPO,
    handleImportHD: handleImportHD,
    handleGetAllHD: handleGetAllHD,
    handleGetMaChungTu: handleGetMaChungTu,
    handleGetOneHD: handleGetOneHD,
    handleGetAllLogChungTuHopDong: handleGetAllLogChungTuHopDong,
    handleGetCheckHopDong: handleGetCheckHopDong,
    handleGetAllLogChungTuPO: handleGetAllLogChungTuPO,
    handleGetCheckPO: handleGetCheckPO,
    handleGetAllLogPOPR: handleGetAllLogPOPR,
    handleGetCheckPR: handleGetCheckPR,
    handleCheckMaChungTuHD: handleCheckMaChungTuHD,
    handleCheckMaChungTuPO: handleCheckMaChungTuPO,
    handleCheckPOPR: handleCheckPOPR,
    handleGetAllCT: handleGetAllCT,
    handleGetOneCT: handleGetOneCT,
    handleCheckXoaChungTu: handleCheckXoaChungTu,
    handleEditMaTaiSanNew: handleEditMaTaiSanNew,
    handleDownloadDataPO: handleDownloadDataPO,
    handleDownloadDataPR: handleDownloadDataPR,
    handleDownloadDataHD: handleDownloadDataHD,
    handleGetCheckEditMaTaiSanPO: handleGetCheckEditMaTaiSanPO,
    handleGetCheckEditMaTaiSanPR: handleGetCheckEditMaTaiSanPR,
    handleGetCheckEditSoLuongPO: handleGetCheckEditSoLuongPO,
    handleGetCheckAllCT: handleGetCheckAllCT,
    handleGetCheckOneCT: handleGetCheckOneCT,
    handleGetCheckChungTu: handleGetCheckChungTu,
    handleGetCheckAllLogChungTuPO: handleGetCheckAllLogChungTuPO,
    handleGetCheckAllLogChungTuHopDong: handleGetCheckAllLogChungTuHopDong,
    handleCheckXoaCheckChungTu: handleCheckXoaCheckChungTu,
    handleGetCheckAll: handleGetCheckAll,
    handleGetLogPOPR: handleGetLogPOPR,
    handleGetAllTaiSan: handleGetAllTaiSan,
    handleGetAllDVT: handleGetAllDVT,
    handleGetAllBV: handleGetAllBV,
    handleGetAllPL: handleGetAllPL,
    handleGetAllTGBH: handleGetAllTGBH,
    handleGetAllTGKH: handleGetAllTGKH,
    handleEditTaiSan: handleEditTaiSan,
    handleNewTaiSan: handleNewTaiSan,
    handleCheckXoaTS: handleCheckXoaTS,
    handleGetAllKho: handleGetAllKho,
    handleGetTaiSanTheoKho: handleGetTaiSanTheoKho,
    handleGetAllKhoQL: handleGetAllKhoQL,
    handleGetTaiSanTheoKhoQL: handleGetTaiSanTheoKhoQL,
    handleGetMaTaiSanKiemKe: handleGetMaTaiSanKiemKe,
    handleEditKhoaPhongHienTai: handleEditKhoaPhongHienTai,
    handleGetAllViTri: handleGetAllViTri,
    handleGetAllTinhTrang: handleGetAllTinhTrang,
    handleGetAllKhoEdit: handleGetAllKhoEdit,
    getDaTaKiemKe: getDaTaKiemKe,
    handleGetSerialKiemKe: handleGetSerialKiemKe,
    handleGetAllNhanVien: handleGetAllNhanVien,
    handleGetAllNhanVienPhong: handleGetAllNhanVienPhong,
    handleGetAllKhoQLTK: handleGetAllKhoQLTK,
    handleGetAllTenTaiSan: handleGetAllTenTaiSan,
    handleXacNhanThemTaiSan: handleXacNhanThemTaiSan,
    handleGetAllNguoiLap: handleGetAllNguoiLap,
    handleGetKeToanTaiSan: handleGetKeToanTaiSan,
    handleGetKeToanTruong: handleGetKeToanTruong,
    handleGetGiamDoc: handleGetGiamDoc,
    handleGetLichSuKiemKe: handleGetLichSuKiemKe,
    handleGetTaiSanTheoKhoLichSu: handleGetTaiSanTheoKhoLichSu,
    handleCheckDataChuaXacNhan: handleCheckDataChuaXacNhan,
    handleGetTaiSanXacNhanTheoKhoLichSu: handleGetTaiSanXacNhanTheoKhoLichSu,
    handleGetTaiSanXacNhanAllKhoLichSu: handleGetTaiSanXacNhanAllKhoLichSu,
    handleGetTaiSanXacNhanToanVienKhoLichSu: handleGetTaiSanXacNhanToanVienKhoLichSu,
    handleGetAllNguoiSuDung: handleGetAllNguoiSuDung,
    handleCheckDongBo: handleCheckDongBo,
    handleGetLanKiemKe: handleGetLanKiemKe

}

