import { auth } from "google-auth-library";
import userService from "../services/userService";
import { raw } from 'body-parser';
import user from "../models/user";
import jwt from 'jsonwebtoken';
import db from "../models/index";
require('dotenv').config();
const ActiveDirectory = require('activedirectory');
// const config = {
//     url: 'ldap://10.22.10.9',
//     baseDN: 'ou=FHMCDN,dc=fhmc,dc=com'
// };

const config = {
    url: process.env.URL_AD,
    baseDN: process.env.baseDN,
};

const ad = new ActiveDirectory(config);
// const username = 'tmk001-dn-oa@fhmc.com';
// const password = 'Tmk@541981';

function authenticateAsync(username, password) {
    return new Promise((resolve, reject) => {
        try {
            ad.authenticate(username, password, (err, auth) => {
                resolve(auth);
                // if (err) {
                //     reject(err);
                // } else {
                //     resolve(auth);
                // }
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
        }
    });
}

// // Sử dụng hàm authenticateAsync với async/await
// async function yourFunction() {
//     try {
//         const auth = await authenticateAsync(username, password);
//         console.log('auth', auth);
//         // Bạn có thể làm gì đó với giá trị auth tại đây
//     } catch (error) {
//         console.error('Error during authentication:', error);
//     }
// }
// yourFunction()


let handleLogin = async (req, res) => {
    try {
        let account = req.body.account;
        let password = req.body.password;

        let userad = account + '@fhmc.com';
        // console.log('acount', acount)
        let passwordad = password;
        // let passwordad = 'Hoanmy@9999';

        if (!account || !password) {
            return res.status(500).json({
                errCode: 1,
                message: 'Vui lòng nhập thông tin'
            })
        }
        let authAD = await authenticateAsync(userad, passwordad);
        // console.log('authAD', authAD)
        let userData = await userService.handleUserLogin(account, password, authAD);
        // console.log('check data', userData)
        // //set cookie
        if (userData && userData.token) {
            const maxCookieLength = 4000; // Giả sử giới hạn là 4000 thay vì 4096 để tránh vấn đề

            // Tính số lượng phần JWT cần chia nhỏ
            const jwtPartsCount = Math.ceil(userData.token.length / maxCookieLength);

            // Lưu số lượng phần của JWT vào cookie
            // res.cookie('jwt_parts_count', jwtPartsCount, { expires: 7 });
            res.cookie('jwt_parts_count', jwtPartsCount, { httpOnly: true, maxAge: 60 * 60 * 10000 })
            // Chia nhỏ chuỗi JWT thành các phần có độ dài tối đa là maxCookieLength
            for (let i = 0; i < jwtPartsCount; i++) {
                const startIndex = i * maxCookieLength;
                const endIndex = Math.min((i + 1) * maxCookieLength, userData.token.length);
                const jwtPart = userData.token.substring(startIndex, endIndex);
                // res.cookie(`jwt_${i}`, jwtPart, { expires: 7 });
                res.cookie(`jwt_${i}`, jwtPart, { httpOnly: true, maxAge: 60 * 60 * 10000 })
            }
            // res.cookie('jwt', userData.token, { httpOnly: true, maxAge: 60 * 60 * 10000 })  //60 * 60 * 1000
        }

        return res.status(200).json({
            errCode: userData.errCode,
            message: userData.errMessage,
            token: userData.token,
            data: userData.data,
            // authAD: auth.auth,
            user: userData.user ? userData.user : {}
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }
}

let handleLoginToken = async (req, res) => {
    try {
        const { token } = req.body; // Lấy token từ req.body
        //console.log('Received token:', token);
        // let account = req.body.account;
        // let password = req.body.password;

        // let userad = account + '@fhmc.com';
        // // console.log('acount', acount)
        // let passwordad = password;
        // // let passwordad = 'Hoanmy@9999';

        // if (!account || !password) {
        //     return res.status(500).json({
        //         errCode: 1,
        //         message: 'Vui lòng nhập thông tin'
        //     })
        // }
        //let authAD = await authenticateAsync(userad, passwordad);
        // console.log('authAD', authAD)


        let userData = await userService.handleUserLoginToken(token);
        // // console.log('check data', userData)
        // // //set cookie
        if (userData && userData.token) {
            const maxCookieLength = 4000; // Giả sử giới hạn là 4000 thay vì 4096 để tránh vấn đề

            // Tính số lượng phần JWT cần chia nhỏ
            const jwtPartsCount = Math.ceil(userData.token.length / maxCookieLength);

            // Lưu số lượng phần của JWT vào cookie
            // res.cookie('jwt_parts_count', jwtPartsCount, { expires: 7 });
            res.cookie('jwt_parts_count', jwtPartsCount, { httpOnly: true, maxAge: 60 * 60 * 10000 })
            // Chia nhỏ chuỗi JWT thành các phần có độ dài tối đa là maxCookieLength
            for (let i = 0; i < jwtPartsCount; i++) {
                const startIndex = i * maxCookieLength;
                const endIndex = Math.min((i + 1) * maxCookieLength, userData.token.length);
                const jwtPart = userData.token.substring(startIndex, endIndex);
                // res.cookie(`jwt_${i}`, jwtPart, { expires: 7 });
                res.cookie(`jwt_${i}`, jwtPart, { httpOnly: true, maxAge: 60 * 60 * 10000 })
            }
            // res.cookie('jwt', userData.token, { httpOnly: true, maxAge: 60 * 60 * 10000 })  //60 * 60 * 1000
        }

        return res.status(200).json({
            errCode: userData.errCode,
            message: userData.errMessage,
            token: userData.token,
            data: userData.data,
            // authAD: auth.auth,
            user: userData.user ? userData.user : {}
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }
}


let handleLogout = async (req, res) => {
    // console.log('req', req.cookies)
    try {
        const cookies = Object.keys(req.cookies);

        // Lặp qua từng cookie và xóa nó
        cookies.forEach(cookie => {
            if (cookie.startsWith('jwt_')) {
                res.clearCookie(cookie);
            }
        });

        return res.status(200).json({
            errCode: 0,
            errMessage: 'ok',
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }
}

let handleGetAction = async (req, res) => {
    try {
        let button = req.body.actionButton;
        //let User_Id = req.body.User_Id;
        //console.log('button', button)
        let getActionButton = await userService.handleGetAction(button);
        return res.status(200).json(getActionButton);
        // if (User_Id) {
        //     let getActionButtonImage = await userService.handleGetActionImage(button, User_Id);
        //     return res.status(200).json(getActionButtonImage);
        // } else {
        //     let getActionButton = await userService.handleGetAction(button);
        //     return res.status(200).json(getActionButton);
        // }
    } catch (e) {
        // console.log('get all code', e)
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}

let handleGetAllUsers = async (req, res) => {
    try {
        let users = await userService.getAllUsers();
        // console.log(users)
        return res.status(200).json({
            errCode: 0,
            errMessage: 'ok',
            users
        })
    } catch (e) {
        // console.log('get all code', e)
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}

let handleEditUser = async (req, res) => {
    try {
        let data = req.body;
        const file = req.file;
        // console.log('data', data)
        // console.log('file', file)
        let message = await userService.editUser(data, file);
        return res.status(200).json(message);
    } catch (e) {
        // console.log('get all code', e)
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}


let handleDeleteUser = async (req, res) => {
    try {
        let data = req.body.id;
        if (!data) {
            return res.status(200).json({
                errCode: 1,
                message: 'Vui lòng chọn dòng cần xóa'
            })
        }
        let message = await userService.deleteUser(data);
        return res.status(200).json(message);
    } catch (e) {
        // console.log('get all code', e)
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}

let getAllCode = async (req, res) => {
    try {
        setTimeout(async () => {
            let data = await userService.getAllCodeService(req.query.type);
            return res.status(200).json(data);
        }, 500)
    } catch (e) {
        // console.log('get all code', e)
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}

let handleGetGroupId = async (req, res) => {
    try {
        let Group_Id = req.params.Group_Id;
        // //console.log('Group_Id controler', Group_Id)
        // let groupid = await userService.getGroup_Id(Group_Id);
        // if (groupid instanceof Promise) {
        //     groupid = await groupid; // Chờ đến khi promise được giải quyết
        // }
        // return res.status(200).json({
        //     errCode: 0,
        //     errMessage: 'ok',
        //     groupid
        // })
        // Gọi hàm từ services và lấy kết quả
        let { groupid, menu_con, menu_cha } = await userService.getGroup_Id(Group_Id);

        // Trả về JSON response chứa cả groupid và menu
        return res.status(200).json({
            errCode: 0,
            errMessage: 'ok',
            groupid,
            menu_con,
            menu_cha
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }
}

let handleGetMaGroup = async (req, res) => {
    try {

        let magroup = await userService.getMaGroup();
        if (magroup instanceof Promise) {
            magroup = await magroup; // Chờ đến khi promise được giải quyết
        }
        return res.status(200).json({
            errCode: 0,
            errMessage: 'ok',
            magroup
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }
}


let handleGetAllGroup = async (req, res) => {
    try {
        let group = await userService.getAllGroup();
        return res.status(200).json({
            errCode: 0,
            errMessage: 'ok',
            group
        })
    } catch (e) {
        // console.log('get all code', e)
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}

let handleGetAllNhanVien = async (req, res) => {
    try {
        let nhanvien = await userService.getAllNhanVien();
        return res.status(200).json({
            errCode: 0,
            errMessage: 'ok',
            nhanvien
        })
    } catch (e) {
        // console.log('get all code', e)
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}

let handleCreateNewUser = async (req, res) => {
    return new Promise(async (resolve, reject) => {
        // console.log('req.body', req.body)
        let data = req.body
        try {
            let message = await userService.createNewUser(data);
            return res.status(200).json(message);
        } catch (e) {
            reject(e)
        }
    })
}

let handleCheckXoaUser = async (req, res) => {
    let id = req.params.id;
    // console.log('id', id)
    return new Promise(async (resolve, reject) => {
        try {
            let message = await userService.checkXoaUser(id);
            return res.status(200).json(message);
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    handleLogin: handleLogin,
    handleGetAllUsers: handleGetAllUsers,
    handleCreateNewUser: handleCreateNewUser,
    handleEditUser: handleEditUser,
    handleDeleteUser: handleDeleteUser,
    getAllCode: getAllCode,
    handleGetAction: handleGetAction,
    handleGetGroupId: handleGetGroupId,
    handleGetAllGroup: handleGetAllGroup,
    handleGetAllNhanVien: handleGetAllNhanVien,
    handleCheckXoaUser: handleCheckXoaUser,
    handleLogout: handleLogout,
    handleLoginToken: handleLoginToken,
    handleGetMaGroup: handleGetMaGroup

}

