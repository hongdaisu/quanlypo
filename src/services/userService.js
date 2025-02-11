
import db from "../models/index";
import bcrypt from 'bcryptjs';
import { getGroupWithRoles } from './JWTService';
import { createJWT } from '../middleware/JWTAction';
import jwt from 'jsonwebtoken';
const { Sequelize } = require('sequelize');
import user from '../models/user';
require('dotenv').config();
const path = require('path');
import fs from 'fs';


const salt = bcrypt.genSaltSync(10);

let handleUserLogin_bak = (account, password, authAD, token = null) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};

            if (token) {
                //console.log('đăng nhập bằng token')
                // Xác thực người dùng từ token
                let decodedToken;
                try {
                    decodedToken = jwt.verify(token, process.env.JWT_SECRET);
                    //console.log('decodedToken', decodedToken)
                } catch (e) {
                    return resolve({
                        errCode: 4,
                        errMessage: `Token không hợp lệ`
                    });
                }

                let user = await db.User.findOne({
                    where: { id: decodedToken.id },
                    raw: true
                });

                // if (user) {
                //     let groupWithRoles = await getGroupWithRoles(user);
                //     resolve({
                //         errCode: 0,
                //         errMessage: `OK`,
                //         data: groupWithRoles,
                //         user: user,
                //         authAD: true
                //     });
                // } else {
                //     resolve({
                //         errCode: 2,
                //         errMessage: `Không tìm thấy người dùng`
                //     });
                // }

            } else {
                //console.log('đăng nhập bằng mật khẩu')
                // Xử lý đăng nhập với tài khoản và mật khẩu
                let isExist = await checkUserEmail(account);
                if (isExist) {

                    let users = await db.sequelize.query('CALL sp_get_user_login(:user)', {
                        replacements: { user: account },
                        raw: true
                    });

                    let user = users.reduce((result, item) => {
                        Object.keys(item).forEach(key => {
                            result[key] = item[key];
                        });
                        return result;
                    }, {});

                    // Danh sách tài khoản admin
                    const adminAccounts = ['Admin', 'tmn001-dn', 'ttn001-dn', 'ddc001-dn', 'NDA002-DN'
                        , 'LPU001-DN', 'BTK001-DN', 'NKA001-DN', 'TMK001-DN', 'PA001-DN'
                        , 'tha002-dn', 'ttd003-dn', 'hnt004-dn', 'hlp001-dn'];

                    if (adminAccounts.includes(account)) {
                        let AD = await db.User.findOne({
                            attributes: ['password'],
                            where: { account: account },
                            raw: true,
                        });
                        let check = await bcrypt.compareSync(password, AD.password);
                        if (check) {
                            if (user.use_groupId) {
                                let groupWithRoles = await getGroupWithRoles(user);
                                let payload = {
                                    account: user.account,
                                    groupWithRoles,
                                    firstName: user.firstName,
                                    id: user.id,
                                    phongban_id: user.phongban_id,
                                    authAD: true,
                                    expiresIn: process.env.JWT_EXPIRES_IN,
                                    use_groupId: user.use_groupId,
                                    ky: user.ky,
                                }
                                let token = createJWT(payload);
                                delete user.password;
                                resolve({
                                    errCode: 0,
                                    errMessage: `OK`,
                                    token: token,
                                    data: groupWithRoles,
                                    user: user,
                                    authAD: authAD
                                });
                            } else {
                                resolve({
                                    errCode: 1,
                                    errMessage: `Tài khoản chưa được phân quyền`
                                });
                            }
                        } else {
                            resolve({
                                errCode: 3,
                                errMessage: `Sai mật khẩu`
                            });
                        }
                    } else {
                        if (user) {
                            if (authAD === true) {
                                if (user.use_groupId) {
                                    let groupWithRoles = await getGroupWithRoles(user);
                                    let payload = {
                                        account: user.account,
                                        groupWithRoles,
                                        firstName: user.firstName,
                                        id: user.id,
                                        phongban_id: user.phongban_id,
                                        authAD: authAD,
                                        expiresIn: process.env.JWT_EXPIRES_IN,
                                        use_groupId: user.use_groupId,
                                        ky: user.ky,
                                    }
                                    let token = createJWT(payload);
                                    delete user.password;
                                    resolve({
                                        errCode: 0,
                                        errMessage: `OK`,
                                        token: token,
                                        data: groupWithRoles,
                                        user: user,
                                        authAD: authAD
                                    });

                                } else {
                                    resolve({
                                        errCode: 1,
                                        errMessage: `Tài khoản chưa được phân quyền`
                                    });
                                }
                            } else {
                                resolve({
                                    errCode: 3,
                                    errMessage: `Sai mật khẩu`
                                });
                            }
                        } else {
                            resolve({
                                errCode: 2,
                                errMessage: `Sai thông tin tài khoản`
                            });
                        }
                    }
                } else {
                    resolve({
                        errCode: 1,
                        errMessage: `Sai thông tin tài khoản`
                    });
                }
            }

            resolve(userData);
        } catch (e) {
            reject(e);
        }
    });
}

let handleUserLoginToken = (token) => {
    return new Promise(async (resolve, reject) => {
        try {
            let decodedToken;
            try {
                decodedToken = jwt.verify(token, process.env.JWT_SECRET);
                //console.log('decodedToken', decodedToken)
            } catch (e) {
                return resolve({
                    errCode: 4,
                    errMessage: `Token đã hết hạn`
                });
            }

            let users = await db.sequelize.query('CALL sp_get_user_login(:user)',
                {
                    replacements: { user: decodedToken.account },
                    raw: true
                }
            );

            let user = users.reduce((result, item) => {
                Object.keys(item).forEach(key => {
                    result[key] = item[key];
                });
                return result;
            }, {});
            if (user.use_groupId) {
                let groupWithRoles = await getGroupWithRoles(user);
                // console.log('check role', groupWithRoles)
                let payload = {
                    account: user.account, //user.account,
                    groupWithRoles,
                    firstName: user.firstName,
                    id: user.id,
                    phongban_id: user.phongban_id,
                    authAD: true,
                    expiresIn: process.env.JWT_EXPIRES_IN,
                    use_groupId: user.use_groupId,
                    ky: user.ky,
                }
                // console.log('check payload', payload)
                let token = createJWT(payload);
                // console.log('check createJWT login:', token)
                delete user.password;
                resolve({
                    errCode: 0,
                    errMessage: `OK`,
                    token: token,
                    data: groupWithRoles,
                    user: user,
                    authAD: true
                })

            } else {
                resolve({
                    errCode: 1,
                    errMessage: `Tài khoản chưa được phân quyền`
                })
            }
        } catch (e) {
            reject(e);
        }
    });
}


let handleUserLogin = (account, password, authAD) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};
            let isExist = await checkUserEmail(account);
            // console.log('isExist', isExist, account)
            if (isExist) {

                let users = await db.sequelize.query('CALL sp_get_user_login(:user)',
                    {
                        replacements: { user: account },
                        raw: true
                    }
                );

                let user = users.reduce((result, item) => {
                    Object.keys(item).forEach(key => {
                        result[key] = item[key];
                    });
                    return result;
                }, {});

                if (account === 'Admin' || account === 'tha002-dn' || account === 'hmt002-dn'
                    //|| account === 'dko001-dn'
                    //|| account === 'tav002-dn'
                    //|| account === 'pbn001-dn'
                ) {
                    let AD = await db.User.findOne({
                        attributes: ['password'],
                        where: { account: account },
                        raw: true,
                    });
                    let check = await bcrypt.compareSync(password, AD.password);
                    if (check) {
                        if (user.use_groupId) {
                            let groupWithRoles = await getGroupWithRoles(user);
                            // console.log('check role', groupWithRoles)
                            let payload = {
                                account: user.account, //user.account,
                                groupWithRoles,
                                firstName: user.firstName,
                                id: user.id,
                                phongban_id: user.phongban_id,
                                authAD: true,
                                expiresIn: process.env.JWT_EXPIRES_IN,
                                use_groupId: user.use_groupId,
                                ky: user.ky,
                            }
                            // console.log('check payload', payload)
                            let token = createJWT(payload);
                            // console.log('check createJWT login:', token)
                            delete user.password;
                            resolve({
                                errCode: 0,
                                errMessage: `OK`,
                                token: token,
                                data: groupWithRoles,
                                user: user,
                                authAD: authAD
                            })

                        } else {
                            resolve({
                                errCode: 1,
                                errMessage: `Tài khoản chưa được phân quyền`
                            })
                        }
                    } else {
                        resolve({
                            errCode: 3,
                            errMessage: `Sai mật khẩu`
                        })
                    }
                } else {
                    if (user) {
                        if (authAD === true) {
                            if (user.use_groupId) {
                                let groupWithRoles = await getGroupWithRoles(user);
                                // console.log('check role', groupWithRoles)
                                let payload = {
                                    account: user.account, //user.account,
                                    groupWithRoles,
                                    firstName: user.firstName,
                                    id: user.id,
                                    phongban_id: user.phongban_id,
                                    authAD: authAD,
                                    expiresIn: process.env.JWT_EXPIRES_IN,
                                    use_groupId: user.use_groupId,
                                    ky: user.ky,
                                }
                                // console.log('check payload', payload)
                                let token = createJWT(payload);
                                // console.log('check createJWT login:', token)
                                delete user.password;
                                resolve({
                                    errCode: 0,
                                    errMessage: `OK`,
                                    token: token,
                                    data: groupWithRoles,
                                    user: user,
                                    authAD: authAD
                                })

                            } else {
                                resolve({
                                    errCode: 1,
                                    errMessage: `Tài khoản chưa được phân quyền`
                                })
                            }
                        } else {
                            resolve({
                                errCode: 3,
                                errMessage: `Sai mật khẩu`
                            })
                        }
                    } else {
                        resolve({
                            errCode: 2,
                            errMessage: `Sai thông tin tài khoản`
                        })
                    }
                }
            } else {
                resolve({
                    errCode: 1,
                    errMessage: `Sai thông tin tài khoản`
                })
            }
            // console.log('check data', userData)
            resolve(userData)
        } catch (e) {
            reject(e)
        }
    })
}

// let refeshGroupWithRoles = (use_groupId) => {
//     // console.log('button', button)
//     return new Promise(async (resolve, reject) => {
//         try {
//             let groupWithRoles = await getGroupWithRoles(use_groupId);
//             resolve({
//                 data: groupWithRoles
//             })
//             // resolve(butonAction)
//         } catch (e) {
//             reject(e)
//         }
//     })
// }

let handleGetActionImage = (button, User_Id) => {
    // console.log('button', button)
    return new Promise(async (resolve, reject) => {
        try {
            let butonAction = button
            let filename = await db.User.findOne({
                where: { id: User_Id },
                raw: false
            });
            // console.log('filename', filename)
            if (filename && filename.File) {
                // Tạo URL file
                const URL_VIEW = process.env.URL_VIEW;
                const imageUrl = `${URL_VIEW}/image/${filename.File}`;
                resolve({
                    errCode: 0,
                    butonAction: butonAction,
                    imageUrl: imageUrl // Trả về URL file
                });
            } else {
                resolve({
                    errCode: 0,
                    butonAction: butonAction,
                });
                // resolve({
                //     errCode: 1,
                //     errMessage: 'User or file not found'
                // });
            }
            // resolve(butonAction)
        } catch (e) {
            reject(e)
        }
    })
}

let handleGetAction = (button) => {
    //console.log('button handleGetAction', button)
    return new Promise(async (resolve, reject) => {
        try {
            let butonAction = button
            resolve({
                errCode: 0,
                butonAction: butonAction,
            });

        } catch (e) {
            reject(e)
        }
    })
}

let checkUserEmail = (userEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { account: userEmail }
            });
            if (user) {
                resolve(true)
            } else {
                resolve(false)
            }
        } catch (e) {
            resolve(e)
        }
    })
}
let getAllUsers = () => {

    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.sequelize.query('CALL sp_get_all_users',
                {
                    raw: false
                }
            );
            resolve(users)
        } catch (e) {
            reject(e)
        }
    })
}

let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            var hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        } catch (e) {
            reject(e);
        }
    })
}

let createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        // console.log('check data', data)
        try {
            let check = await checkUserEmail(data.account);
            if (check === true) {
                resolve({
                    errCode: 1,
                    errMessage: 'Tài khoản đã tồn tại'
                })
            } else {
                // let hashPasswordFromBcrypt = await hashUserPassword(data.password);
                const validationRules = [
                    { field: 'account', message: 'Vui lòng nhập tài khoản sử dụng.' },
                    { field: 'nhanvien_id', message: 'Vui lòng chọn tên nhân viên.' },
                    // { field: 'phongban_id', message: 'Vui lòng chọn phòng ban' },
                    { field: 'group', message: 'Vui lòng chọn group' },
                ];
                let errorMessage = '';
                for (const rule of validationRules) {
                    if (!data[rule.field]) {
                        errorMessage = rule.message;
                        break; // Dừng vòng lặp nếu tìm thấy trường không hợp lệ
                    }
                }
                if (errorMessage) {
                    resolve({
                        errCode: 1,
                        errMessage: errorMessage
                    });
                } else {
                    let NhanVien = await db.Dm_NhanVien.findOne({
                        attributes: ['id', 'TenNhanVien', 'PhongBan_Id'],
                        where: {
                            id: data.nhanvien_id.NhanVien_Id
                        },
                        raw: true
                    });
                    //console.log('NhanVien', NhanVien)
                    await db.User.create({
                        account: data.account,
                        // password: hashPasswordFromBcrypt,
                        nhanvien_id: data.nhanvien_id.NhanVien_Id,
                        firstName: NhanVien.TenNhanVien,
                        phongban_id: NhanVien.PhongBan_Id,
                        use_groupId: data.group.id

                    })
                    resolve({
                        errCode: 0,
                        errMessage: 'Tạo user thành công'
                    })
                }
            }
        } catch (e) {
            reject(e)
        }
    })
}

let editUser = (data, file) => {
    // console.log('data', data)
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.User_Id) {
                resolve({
                    errCode: 2,
                    errMessage: 'Vui lòng chọn thông tin cần cập nhập'
                })
            }
            let NhanVien = await db.Dm_NhanVien.findOne({
                attributes: ['id', 'TenNhanVien', 'PhongBan_Id'],
                where: {
                    id: data.NhanVien_Id
                },
                raw: true
            });

            let datauser = await db.User.findOne({
                where: { id: data.User_Id },
                raw: false
            });
            if (file) {
                if (!checkIMG(file)) {
                    resolve({
                        errCode: 3,
                        errMessage: 'Vui lòng chọn loại file hình'
                    });
                    removeNonIMGFiles(__dirname + "/../image/");
                } else {
                    if (datauser.File) {
                        if (datauser.File === data.File) {

                        } else {
                            removeFileByName(datauser.File, __dirname + "/../image/");
                        }
                    } else {
                    }
                    if (data.id !== 'undefined') {
                        const filename = await uploadFile(file);
                        datauser.File = filename;
                        datauser.account = data.account;
                        datauser.firstName = NhanVien.TenNhanVien;
                        datauser.nhanvien_id = data.nhanvien_id;
                        datauser.use_groupId = data.id;
                        datauser.phongban_id = NhanVien.PhongBan_Id;
                        datauser.tamngung = data.tamngung;
                        await datauser.save();
                        removeFilesWithoutExtension(__dirname + "/../image/");
                        resolve({
                            errCode: 0,
                            errMessage: 'Sửa thông tin thành công'
                        });
                    } else {
                        const filename = await uploadFile(file);
                        //console.log('filename', filename)
                        datauser.File = filename;
                        datauser.account = data.account;
                        datauser.firstName = NhanVien.TenNhanVien;
                        datauser.nhanvien_id = data.nhanvien_id;
                        datauser.phongban_id = NhanVien.PhongBan_Id;
                        datauser.tamngung = data.tamngung;
                        await datauser.save();
                        removeFilesWithoutExtension(__dirname + "/../image/");
                        resolve({
                            errCode: 0,
                            errMessage: 'Sửa thông tin thành công'
                        });
                    }
                }
            } else {
                if (data.id !== 'undefined') {
                    datauser.account = data.account;
                    datauser.firstName = NhanVien.TenNhanVien;
                    datauser.nhanvien_id = data.nhanvien_id;
                    datauser.use_groupId = data.id;
                    datauser.phongban_id = NhanVien.PhongBan_Id;
                    datauser.tamngung = data.tamngung;
                    await datauser.save();

                    resolve({
                        errCode: 0,
                        errMessage: 'Sửa thông tin thành công'
                    });
                } else {
                    datauser.account = data.account;
                    datauser.firstName = NhanVien.TenNhanVien;
                    datauser.nhanvien_id = data.nhanvien_id;
                    // datauser.use_groupId = data.id;
                    datauser.phongban_id = NhanVien.PhongBan_Id;
                    datauser.tamngung = data.tamngung;
                    await datauser.save();

                    resolve({
                        errCode: 0,
                        errMessage: 'Sửa thông tin thành công'
                    });
                }
            }
        } catch (error) {
            reject(error);
        }
    });
}

const checkIMG = (file) => {
    try {
        const allowedExtensions = ['.jpg'];
        const fileExtension = path.extname(file.originalname).toLowerCase();
        return allowedExtensions.includes(fileExtension);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }
};

const uploadFile = (file) => {
    return new Promise((resolve, reject) => {
        try {
            // Kiểm tra loại file
            const filenameWithoutExtension = path.basename(file.filename, path.extname(file.filename));
            const fileExtension = path.extname(file.filename).slice(1);
            // console.log(filenameWithoutExtension, fileExtension)
            const randomNumber = Math.floor(Math.random() * 100);
            const destPath = path.join(__dirname, "../image/");
            // const filename = `${Date.now()}-${file.originalname}`;
            const filename = `${filenameWithoutExtension}.${randomNumber}.${fileExtension}`;
            fs.rename(file.path, path.join(destPath, filename), (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(filename);
                }
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
        }
    });
};

// const uploadFile = (file) => {
//     return new Promise((resolve, reject) => {
//         const filenameWithoutExtension = path.basename(file.filename, path.extname(file.filename));
//         const fileExtension = path.extname(file.filename).slice(1);
//         const randomNumber = Math.floor(Math.random() * 100);
//         const destPath = path.join(__dirname, "../image/");
//         const filename = `${filenameWithoutExtension}.${randomNumber}.${fileExtension}`;
//         const filePath = path.join(destPath, filename);

//         // Đường dẫn tới file gốc và file đích
//         const originalFilePath = file.path;
//         const resizedFilePath = filePath;

//         // Resize hình ảnh về kích thước 800x600
//         sharp(originalFilePath)
//             .resize(800, 600)
//             .toFile(resizedFilePath, (err, info) => {
//                 if (err) {
//                     reject(err);
//                 } else {
//                     // Sau khi resize xong, di chuyển file đến đích và resolve với tên file
//                     fs.rename(originalFilePath, resizedFilePath, (err) => {
//                         if (err) {
//                             reject(err);
//                         } else {
//                             resolve(filename);
//                         }
//                     });
//                 }
//             });
//     });
// };

const removeFilesWithoutExtension = (directory) => {
    try {
        fs.readdir(directory, (err, files) => {
            if (err) {
                console.error("Error reading directory:", err);
                return;
            }
            // Lặp qua từng file trong thư mục
            files.forEach((file) => {
                const filePath = path.join(directory, file);
                // Sử dụng biểu thức chính quy để kiểm tra tên tệp
                const regex = /^[^.]+$/; // So khớp với bất kỳ ký tự nào ngoại trừ dấu chấm
                if (regex.test(file)) {
                    // Nếu tên tệp không có phần mở rộng, xóa tệp
                    fs.unlink(filePath, (err) => {
                        if (err) {
                            console.error("Error deleting file:", err);
                        } else {
                            console.log("File without extension deleted successfully:", filePath);
                        }
                    });
                }
            });
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }
};

const removeNonIMGFiles = (directory) => {
    try {
        fs.readdir(directory, (err, files) => {
            if (err) {
                console.error("Error reading directory:", err);
                return;
            }

            // Lặp qua từng file trong thư mục
            files.forEach((file) => {
                const filePath = path.join(directory, file);
                const fileExtension = path.extname(file).toLowerCase();
                // Kiểm tra xem file có phải là jpg không
                if (!fileExtension.includes('.jpg')) {
                    fs.unlink(filePath, (err) => {
                        if (err) {
                            console.error("Error deleting file:", err);
                        } else {
                            console.log("Non-PDF file deleted successfully:", filePath);
                        }
                    });
                }
            });
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }
};

const removeFileByName = (filename, directory) => {
    try {
        const filePath = path.join(directory, filename);
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error("Error deleting file:", err);
            } else {
                console.log("File deleted successfully:", filePath);
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }
};

let deleteUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: data }
            })
            if (!user) {
                resolve({
                    errCode: 2,
                    errMessage: `Người dùng không tồn tại`
                })
            }
            await db.User.destroy({
                where: { id: data }
            })
            // await user.destroy();
            resolve({
                errCode: 0,
                errMessage: `Đã xóa thông tin thành công`
            })
        } catch (error) {
            console.error(error);
            return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
        }
    })
}

let getAllCodeService = (typeInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!typeInput) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing prameter'
                })
            } else {
                let res = {};
                let allcode = await db.Allcode.findAll({
                    where: { type: typeInput }
                });
                res.errCode = 0;
                res.data = allcode;
                resolve(res)
            }
        } catch (e) {
            reject(e)
        }
    })
}

let getGroup_Id = (Group_Id) => {
    return new Promise(async (resolve, reject) => {
        // let grouprole = '';
        try {
            let groupid = await db.Group.findOne({
                where: { id: Group_Id },
                raw: true
            });
            //console.log('groupid', groupid)
            let menu_cha = await db.Dm_Menu_Cha.findAll({
                //where: db.sequelize.literal(`FIND_IN_SET(${Group_Id}, group_id) > 0`),
                raw: true
            });

            let menu_con = await db.Dm_Menu_Con.findAll({
                where: db.sequelize.literal(`FIND_IN_SET(${Group_Id}, group_id) > 0`),
                raw: true
            });
            //console.log('menu', menu)
            // resolve(groupid)
            resolve({ groupid, menu_con, menu_cha });

        } catch (e) {
            reject(e)
        }
    })
}


let getMaGroup = () => {
    return new Promise(async (resolve, reject) => {
        // let grouprole = '';
        try {
            let magroup = await db.Group.findAll({
                attributes: ['Group', 'MaGroup'],
                raw: true
            });
            resolve(magroup)

        } catch (e) {
            reject(e)
        }
    })
}

let getAllGroup = () => {
    return new Promise(async (resolve, reject) => {
        let group = '';
        try {
            let group = await db.sequelize.query('CALL sp_get_all_group()',
                {
                    // replacements: { user: account },
                    raw: true
                }
            );
            resolve(group);
        } catch (e) {
            reject(e)
        }
    })
}


let getAllNhanVien = () => {
    return new Promise(async (resolve, reject) => {
        let nhanvien = '';
        try {
            let nhanvien = await db.sequelize.query('CALL sp_get_all_nhanvien()',
                {
                    // replacements: { user: account },
                    raw: true
                }
            );
            resolve(nhanvien);
        } catch (e) {
            reject(e);
        }
    })
}

const checkXoaUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { Op } = require('sequelize');
            const checkxoa = await db.User.findOne({
                attributes: ['id'],
                where: {
                    id: id,
                    use_groupId: { [Op.ne]: null } // use_groupId khác null
                },
                raw: true
            });
            // console.log('checkxoa', checkxoa)
            if (!checkxoa) {
                resolve({
                    errCode: 0,
                });
            } else {
                resolve({
                    errCode: 1,
                    errMessage: 'User đã được sử dụng, không được xóa.',
                });
            }
        } catch (e) {
            reject(e)
        }
    });
};

module.exports = {
    handleUserLogin: handleUserLogin,
    getAllUsers: getAllUsers,
    createNewUser: createNewUser,
    deleteUser: deleteUser,
    editUser: editUser,
    getAllCodeService: getAllCodeService,
    handleGetActionImage: handleGetActionImage,
    handleGetAction: handleGetAction,
    getGroup_Id: getGroup_Id,
    getAllGroup: getAllGroup,
    getAllNhanVien: getAllNhanVien,
    checkXoaUser: checkXoaUser,
    handleUserLoginToken: handleUserLoginToken,
    getMaGroup: getMaGroup,
}
