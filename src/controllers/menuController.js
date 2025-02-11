import menuService from "../services/menuService";
import { raw } from 'body-parser';


let handleGetAllMenuCon = async (req, res) => {
    return new Promise(async (resolve, reject) => {
        try {
            let menu = await menuService.getAllMenuCon();
            return res.status(200).json({
                errCode: 0,
                errMessage: 'ok',
                menu
            })
        } catch (e) {
            reject(e)
        }
    })
}

let handleGetAllMenuCha = async (req, res) => {
    return new Promise(async (resolve, reject) => {
        try {
            let menu_cha = await menuService.getAllMenuCha();
            return res.status(200).json({
                errCode: 0,
                errMessage: 'ok',
                menu_cha
            })
        } catch (e) {
            reject(e)
        }
    })
}


let handleCreateNewMenuCha = async (req, res) => {
    let data = req.body;
    return new Promise(async (resolve, reject) => {
        //console.log('check data', data)
        try {
            let message = await menuService.createNewMenuCha(data);
            // console.log(message);
            return res.status(200).json(message);
        } catch (e) {
            reject(e)
        }
    })
}

let handleDeleteMenuCha = async (req, res) => {
    try {
        let id = req.body.id
        if (!id) {
            return res.status(200).json({
                errCode: 1,
                message: 'Vui lòng chọn dòng cần xóa'
            })
        }
        let message = await menuService.deleteMenuCha(id);
        return res.status(200).json(message);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }
}

let handleEditMenuCha = async (req, res) => {
    let data = req.body;
    return new Promise(async (resolve, reject) => {
        // console.log('check data', data)
        try {
            let message = await menuService.editMenuCha(data);
            return res.status(200).json(message);
        } catch (e) {
            reject(e)
        }
    })
}

let handleGetAllSelectMenuCha = async (req, res) => {
    try {
        let data = await menuService.getAllSelectMenuCha();
        if (data instanceof Promise) {
            data = await data; // Chờ đến khi promise được giải quyết
        }
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

let handleGetAllGroup = async (req, res) => {
    return new Promise(async (resolve, reject) => {
        try {
            let group = await menuService.getAllGroup();
            return res.status(200).json({
                errCode: 0,
                errMessage: 'ok',
                group
            })
        } catch (e) {
            reject(e)
        }
    })
}

let handleCreateNewMenuCon = async (req, res) => {
    try {
        let data = req.body;
        let message = await menuService.createNewMenuCon(data);
        return res.status(200).json(message);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }
}

let handleDeleteMenuCon = async (req, res) => {
    try {
        let id = req.body.id
        if (!id) {
            return res.status(200).json({
                errCode: 1,
                message: 'Vui lòng chọn dòng cần xóa'
            })
        }
        let message = await menuService.deleteMenuCon(id);
        return res.status(200).json(message);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }
}

let handleDeleteHopDong = async (req, res) => {
    try {
        let id = req.body.id
        //console.log('handleDeleteHopDong', id)
        if (!id) {
            return res.status(200).json({
                errCode: 1,
                message: 'Vui lòng chọn dòng cần xóa'
            })
        }
        let message = await menuService.deleteHopDong(id);
        return res.status(200).json(message);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }
}

let handleDeletePO = async (req, res) => {
    try {
        let sopo = req.body.sopo
        //console.log('handleDeleteHopDong', id)
        if (!sopo) {
            return res.status(200).json({
                errCode: 1,
                message: 'Vui lòng chọn dòng cần xóa'
            })
        }
        let message = await menuService.deletePO(sopo);
        return res.status(200).json(message);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }
}

let handleDeletePR = async (req, res) => {
    try {
        let sopr = req.body.sopr
        //console.log('handleDeleteHopDong', id)
        if (!sopr) {
            return res.status(200).json({
                errCode: 1,
                message: 'Vui lòng chọn dòng cần xóa'
            })
        }
        let message = await menuService.deletePR(sopr);
        return res.status(200).json(message);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }
}

let handleDeleteLogCTHD = async (req, res) => {
    try {
        let { machungtu, sopo } = req.body;
        //console.log('machungtu', machungtu)
        if (!machungtu) {
            return res.status(200).json({
                errCode: 1,
                message: 'Vui lòng chọn dòng cần xóa'
            })
        }
        let message = await menuService.deleteLogCTHD(machungtu, sopo);
        return res.status(200).json(message);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }
}

let handleDeleteCheckLogCTHD = async (req, res) => {
    try {
        let { machungtu, sopo } = req.body;
        //console.log('machungtu', machungtu)
        if (!machungtu) {
            return res.status(200).json({
                errCode: 1,
                message: 'Vui lòng chọn dòng cần xóa'
            })
        }
        let message = await menuService.deleteCheckLogCTHD(machungtu, sopo);
        return res.status(200).json(message);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }
}

let handleDeleteLogPOPR = async (req, res) => {
    try {
        let { sopo } = req.body;
        //console.log('machungtu', machungtu)
        if (!sopo) {
            return res.status(200).json({
                errCode: 1,
                message: 'Vui lòng chọn dòng cần xóa'
            })
        }
        let message = await menuService.deleteLogPOPR(sopo);
        return res.status(200).json(message);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }
}

let handleDeleteLogCTPO = async (req, res) => {
    try {
        let { machungtu, sopo } = req.body;
        //console.log('machungtu', machungtu, sopo)
        if (!machungtu) {
            return res.status(200).json({
                errCode: 1,
                message: 'Vui lòng chọn dòng cần xóa'
            })
        }
        let message = await menuService.deleteLogCTPO(machungtu, sopo);
        return res.status(200).json(message);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }
}

let handleDeleteCheckLogCTPO = async (req, res) => {
    try {
        let { machungtu, sopo } = req.body;
        //console.log('machungtu', machungtu, sopo)
        if (!machungtu) {
            return res.status(200).json({
                errCode: 1,
                message: 'Vui lòng chọn dòng cần xóa'
            })
        }
        let message = await menuService.deleteCheckLogCTPO(machungtu, sopo);
        return res.status(200).json(message);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }
}

let handleDeleteCT = async (req, res) => {
    try {
        let { machungtu, sopo } = req.body;
        //console.log('machungtu', machungtu, sopo)
        if (!machungtu) {
            return res.status(200).json({
                errCode: 1,
                message: 'Vui lòng chọn dòng cần xóa'
            })
        }
        let message = await menuService.deleteCT(machungtu, sopo);
        return res.status(200).json(message);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }
}

let handleDeleteTaiSan = async (req, res) => {
    try {
        let { Duoc_Id, TenDuoc_Id } = req.body;
        //console.log('machungtu', machungtu, sopo)

        let message = await menuService.deleteTaiSan(Duoc_Id, TenDuoc_Id);
        return res.status(200).json(message);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }
}

let handleDeleteDataKiemKe = async (req, res) => {
    try {
        let { KhoTaiSan_Id, data } = req.body;
        //console.log('KhoTaiSan_Id', KhoTaiSan_Id)

        let message = await menuService.deleteDaTaKiemKe(KhoTaiSan_Id, data);
        return res.status(200).json(message);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }
}

let handleHuyKiemKe = async (req, res) => {
    try {
        let { IdKiemKe } = req.body;
        //console.log('KhoTaiSan_Id', KhoTaiSan_Id)

        let message = await menuService.huyKiemKe(IdKiemKe);
        return res.status(200).json(message);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }
}

let handleDeleteCheckCT = async (req, res) => {
    try {
        let { machungtu, sopo } = req.body;
        //console.log('machungtu', machungtu, sopo)
        if (!machungtu) {
            return res.status(200).json({
                errCode: 1,
                message: 'Vui lòng chọn dòng cần xóa'
            })
        }
        let message = await menuService.deleteCheckCT(machungtu, sopo);
        return res.status(200).json(message);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }
}

let handleGetNhomQuyen = async (req, res) => {
    try {
        let id = req.body.data.id;
        // console.log('id', id)
        let data = await menuService.getNhomQuyen(id);
        return res.status(200).json(data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }
}

let handleGetMenuCha = async (req, res) => {
    try {
        let id = req.body.data.id;
        // console.log('id', id)
        let data = await menuService.getMenuCha(id);
        return res.status(200).json(data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }
}

let handleEditMenuCon = async (req, res) => {
    let data = req.body;
    return new Promise(async (resolve, reject) => {
        // console.log('check data', data)
        try {
            let message = await menuService.editMenuCon(data);
            return res.status(200).json(message);
        } catch (e) {
            reject(e)
        }
    })
}

let handleXacNhanKiemKe = async (req, res) => {
    let { KhoTaiSan_Id, KhoQuanLy, data, DotKiemKe_Id } = req.body;
    return new Promise(async (resolve, reject) => {
        //console.log('check data', data)
        try {
            let message = await menuService.xacnhanKiemKe(KhoTaiSan_Id, KhoQuanLy, data, DotKiemKe_Id);
            // console.log(message);
            return res.status(200).json(message);
        } catch (e) {
            reject(e)
        }
    })
}

let handleHuyXacNhanKiemKe = async (req, res) => {
    let { KhoTaiSan_Id, KhoQuanLy, data } = req.body;
    return new Promise(async (resolve, reject) => {
        //console.log('check handleHuyXacNhanKiemKe', KhoTaiSan_Id)
        try {
            let message = await menuService.huyxacnhanKiemKe(KhoTaiSan_Id, KhoQuanLy, data);
            // console.log(message);
            return res.status(200).json(message);
        } catch (e) {
            reject(e)
        }
    })
}


module.exports = {
    handleGetAllMenuCon: handleGetAllMenuCon,
    handleGetAllMenuCha: handleGetAllMenuCha,
    handleCreateNewMenuCha: handleCreateNewMenuCha,
    handleDeleteMenuCha: handleDeleteMenuCha,
    handleEditMenuCha: handleEditMenuCha,
    handleGetAllSelectMenuCha: handleGetAllSelectMenuCha,
    handleGetAllGroup: handleGetAllGroup,
    handleCreateNewMenuCon: handleCreateNewMenuCon,
    handleDeleteMenuCon: handleDeleteMenuCon,
    handleGetNhomQuyen: handleGetNhomQuyen,
    handleGetMenuCha: handleGetMenuCha,
    handleEditMenuCon: handleEditMenuCon,
    handleDeleteHopDong: handleDeleteHopDong,
    handleDeletePO: handleDeletePO,
    handleDeletePR: handleDeletePR,
    handleDeleteLogCTHD: handleDeleteLogCTHD,
    handleDeleteLogCTPO: handleDeleteLogCTPO,
    handleDeleteLogPOPR: handleDeleteLogPOPR,
    handleDeleteCT: handleDeleteCT,
    handleDeleteCheckLogCTPO: handleDeleteCheckLogCTPO,
    handleDeleteCheckLogCTHD: handleDeleteCheckLogCTHD,
    handleDeleteCheckCT: handleDeleteCheckCT,
    handleDeleteTaiSan: handleDeleteTaiSan,
    handleXacNhanKiemKe: handleXacNhanKiemKe,
    handleHuyXacNhanKiemKe: handleHuyXacNhanKiemKe,
    handleDeleteDataKiemKe: handleDeleteDataKiemKe,
    handleHuyKiemKe: handleHuyKiemKe
}

