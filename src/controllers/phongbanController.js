import phongbanService from "../services/phongbanService";
import { raw } from 'body-parser';
import { Server } from "socket.io";
const io = new Server();

// let handleGetAction = async (req, res) => {
//     let button = req.body.actionButton;
//     let getActionButton = await userService.handleGetAction(button);
//     return res.status(200).json(getActionButton);
// }

let handleGetAllPhongBan = async (req, res) => {
    try {
        let phongban = await phongbanService.getAllPhongBan();
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

let handleGetAllPhongBanHis = async (req, res) => {
    try {
        let phongban = await phongbanService.getAllPhongBanHis();
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

let handleGetPhongBanId = async (req, res) => {
    try {
        let phongban = await phongbanService.getPhongBanId(20);
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

let handleCreateNewPhongBan = async (req, res) => {
    try {
        let data = req.body
        let message = await phongbanService.createNewPhongBan(data);
        return res.status(200).json(message);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }
}

let handleEditPhongBan = async (req, res) => {
    try {
        let data = req.body;
        // console.log('data', data)
        let message = await phongbanService.editPhongBan(data);
        return res.status(200).json(message);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }
}

let handleDeletePhongBan = async (req, res) => {
    try {
        let id = req.body.id
        if (!id) {
            return res.status(200).json({
                errCode: 1,
                message: 'Vui lòng chọn dòng cần xóa'
            })
        }
        let message = await phongbanService.deletePhongBan(id);
        return res.status(200).json(message);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }
}

let handleCheckXoaPhongBan = async (req, res) => {
    let id = req.params.id;
    // console.log('id', id)
    return new Promise(async (resolve, reject) => {
        try {
            let message = await phongbanService.checkXoaPhongBan(id);
            return res.status(200).json(message);
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    handleGetAllPhongBan: handleGetAllPhongBan,
    handleCreateNewPhongBan: handleCreateNewPhongBan,
    handleDeletePhongBan: handleDeletePhongBan,
    handleEditPhongBan: handleEditPhongBan,
    handleGetPhongBanId: handleGetPhongBanId,
    handleGetAllPhongBanHis: handleGetAllPhongBanHis,
    handleCheckXoaPhongBan: handleCheckXoaPhongBan
}

