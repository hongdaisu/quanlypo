import grouproleService from "../services/grouproleService";
import { raw } from 'body-parser';


let handleGetAllRole = async (req, res) => {
    return new Promise(async (resolve, reject) => {
        try {
            let role = await grouproleService.getAllRole();
            return res.status(200).json({
                errCode: 0,
                errMessage: 'ok',
                role
            })
        } catch (e) {
            reject(e)
        }
    })
}

let handleCreateNewRole = async (req, res) => {
    return new Promise(async (resolve, reject) => {
        try {
            let message = await grouproleService.createNewRole(req.body);
            // console.log(message);
            return res.status(200).json(message);
        } catch (e) {
            reject(e)
        }
    })
}

let handleEditRole = async (req, res) => {
    let data = req.body;
    return new Promise(async (resolve, reject) => {
        try {
            let message = await grouproleService.editRole(data);
            return res.status(200).json(message);
        } catch (e) {
            reject(e)
        }
    })
}

let handleDeleteRole = async (req, res) => {
    let data = req.body.id;
    return new Promise(async (resolve, reject) => {
        try {
            if (!data) {
                return res.status(200).json({
                    errCode: 1,
                    message: 'Vui lòng chọn dòng cần xóa'
                })
            }
            let message = await grouproleService.deleteRole(data);
            return res.status(200).json(message);
        } catch (e) {
            reject(e)
        }
    })
}

let handleGetAllRoleGroup = async (req, res) => {
    let data = req.body;
    return new Promise(async (resolve, reject) => {
        try {
            let grouprole = await grouproleService.getAllRoleGroup(data);
            return res.status(200).json({
                errCode: 0,
                errMessage: 'ok',
                grouprole
            })
        } catch (e) {
            reject(e)
        }
    })
}

let handleCheckRoleGroup = async (req, res) => {
    let data = req.body;
    return new Promise(async (resolve, reject) => {
        try {
            let checkgrouprole = await grouproleService.checkRoleGroup(data);
            return res.status(200).json({
                errCode: 0,
                errMessage: 'ok',
                checkgrouprole
            })
        } catch (e) {
            reject(e)
        }
    })
}

let handleCreateNewRoleGroup = async (req, res) => {
    let data = req.body;
    return new Promise(async (resolve, reject) => {
        try {
            let message = await grouproleService.createNewRoleGroup(data, req, res);
            return res.status(200).json(message);
        } catch (e) {
            reject(e)
        }
    })
}
let handleDeleteRoleGroup = async (req, res) => {
    let data = req.body;
    return new Promise(async (resolve, reject) => {
        try {
            let message = await grouproleService.deleteRoleGroup(data);
            return res.status(200).json(message);
        } catch (e) {
            reject(e)
        }
    })
}

let handleGetAllGroup = async (req, res) => {
    return new Promise(async (resolve, reject) => {
        try {
            let group = await grouproleService.getAllGroup();
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

let handleCreateNewGroup = async (req, res) => {
    let data = req.body;
    return new Promise(async (resolve, reject) => {
        // console.log('check data', data)
        try {
            let message = await grouproleService.createNewGroup(data);
            // console.log(message);
            return res.status(200).json(message);
        } catch (e) {
            reject(e)
        }
    })
}

let handleEditGroup = async (req, res) => {
    let data = req.body;
    return new Promise(async (resolve, reject) => {
        // console.log('check data', data)
        try {
            let message = await grouproleService.editGroup(data);
            return res.status(200).json(message);
        } catch (e) {
            reject(e)
        }
    })
}

let handleDeleteGroup = async (req, res) => {
    let data = req.body.id;
    return new Promise(async (resolve, reject) => {
        // console.log('check data', data)
        try {
            if (!data) {
                return res.status(200).json({
                    errCode: 1,
                    message: 'Vui lòng chọn dòng cần xóa'
                })
            }
            let message = await grouproleService.deleteGroup(data);
            return res.status(200).json(message);
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    handleGetAllRole: handleGetAllRole,
    handleGetAllGroup: handleGetAllGroup,
    handleCreateNewGroup: handleCreateNewGroup,
    handleEditGroup: handleEditGroup,
    handleCreateNewRole: handleCreateNewRole,
    handleEditRole: handleEditRole,
    handleGetAllRoleGroup: handleGetAllRoleGroup,
    handleCheckRoleGroup: handleCheckRoleGroup,
    handleDeleteGroup: handleDeleteGroup,
    handleDeleteRole: handleDeleteRole,
    handleCreateNewRoleGroup: handleCreateNewRoleGroup,
    handleDeleteRoleGroup: handleDeleteRoleGroup,
}

