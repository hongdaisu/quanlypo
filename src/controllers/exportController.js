
require('dotenv').config();
import exportService from "../services/exportService";

let getExportNhapNCC = async (req, res) => {
    try {
        let data = req.body
        let message = await exportService.exportNhapNCC(data);
        return res.status(200).json(message);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }
}

let getExportKiemKeTaiSan = async (req, res) => {
    try {
        let data = req.body
        let message = await exportService.exportKiemKeTaiSan(data);
        return res.status(200).json(message);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }
}

let getExportDataPO = async (req, res) => {
    try {
        //let data = req.body
        let message = await exportService.exportDataPO();
        return res.status(200).json(message);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }
}

let getExportDataPR = async (req, res) => {
    try {
        //let data = req.body
        let message = await exportService.exportDataPR();
        return res.status(200).json(message);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }
}

let getExportDataHD = async (req, res) => {
    try {
        //let data = req.body
        let message = await exportService.exportDataHD();
        return res.status(200).json(message);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }
}

let getExportBienLaiChiTiet = async (req, res) => {
    try {
        let data = req.body
        let message = await exportService.exportBienLaiChiTiet(data);
        return res.status(200).json(message);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }
}

let getExportDoiChieuDongBo = async (req, res) => {
    try {
        let data = req.body
        let message = await exportService.exportDoiChieuDongBo(data);
        return res.status(200).json(message);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }
}


module.exports = {
    getExportNhapNCC: getExportNhapNCC,
    getExportBienLaiChiTiet: getExportBienLaiChiTiet,
    getExportDoiChieuDongBo: getExportDoiChieuDongBo,
    getExportDataPO: getExportDataPO,
    getExportDataPR: getExportDataPR,
    getExportDataHD: getExportDataHD,
    getExportKiemKeTaiSan: getExportKiemKeTaiSan
}

