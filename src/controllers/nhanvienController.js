import nhanvienService from "../services/nhanvienService";
import { raw } from 'body-parser';


let handleGetAllNhanVien = async (req, res) => {
    try {
        let nhanvien = await nhanvienService.getAllNhanVien();
        return res.status(200).json({
            errCode: 0,
            errMessage: 'ok',
            nhanvien
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }
}

let handleGetAllPhongBan = async (req, res) => {
    try {
        let phongban = await nhanvienService.getAllPhongBan();
        return res.status(200).json({
            errCode: 0,
            errMessage: 'ok',
            phongban
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }
}

let handleCreateNewNhanVien = async (req, res) => {
    try {
        let data = req.body
        // console.log('data', data);
        let message = await nhanvienService.createNewNhanVien(data);
        return res.status(200).json(message);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }
}

let handleEditNhanVien = async (req, res) => {
    try {
        let data = req.body;
        //console.log('data', data)
        let message = await nhanvienService.editNhanVien(data);
        return res.status(200).json(message);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }
}

let handleCheckXoaNhanVien = async (req, res) => {
    let id = req.params.id;
    // console.log('id', id)
    return new Promise(async (resolve, reject) => {
        try {
            let message = await nhanvienService.checkXoaNhanVien(id);
            return res.status(200).json(message);
        } catch (e) {
            reject(e)
        }
    })
}

let handleDeleteNhanVien = async (req, res) => {
    try {
        let id = req.body.id
        if (!id) {
            return res.status(200).json({
                errCode: 1,
                message: 'Vui lòng chọn dòng cần xóa'
            })
        }
        let message = await nhanvienService.deleteNhanVien(id);
        return res.status(200).json(message);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }
}


module.exports = {
    handleGetAllNhanVien: handleGetAllNhanVien,
    handleGetAllPhongBan: handleGetAllPhongBan,
    handleCreateNewNhanVien: handleCreateNewNhanVien,
    handleEditNhanVien: handleEditNhanVien,
    handleCheckXoaNhanVien: handleCheckXoaNhanVien,
    handleDeleteNhanVien: handleDeleteNhanVien
}

