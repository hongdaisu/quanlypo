
import db from "../models/index";
const { Sequelize } = require('sequelize');
require('dotenv').config();


let getAllNhanVien = () => {
    return new Promise(async (resolve, reject) => {
        try {

            let nhanvien = await db.sequelize.query('CALL sp_get_all_dm_nhanvien',
                {
                    // replacements: { id: 2 },
                    raw: false
                }
            );
            resolve(nhanvien)
        } catch (e) {
            reject(e)
        }
    })
}

let getAllPhongBan = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let phongban = await db.sequelize.query('CALL sp_get_all_phongban()',
                {
                    // replacements: { user: account },
                    raw: true
                }
            );
            resolve(phongban)
        } catch (e) {
            reject(e)
        }
    })
}

let checkNhanVien = (TenNhanVien) => {
    return new Promise(async (resolve, reject) => {
        try {
            let nhanvien = await db.Dm_NhanVien.findOne({
                where: { TenNhanVien: TenNhanVien }
            });
            if (nhanvien) {
                resolve(true)
            } else {
                resolve(false)
            }
        } catch (e) {
            resolve(e)
        }
    })
}

let createNewNhanVien = (data) => {
    return new Promise(async (resolve, reject) => {
        // console.log('check data', data)
        try {
            let check = await checkNhanVien(data.tennhanvien);
            if (check === true) {
                resolve({
                    errCode: 1,
                    errMessage: 'Nhân viên đã tồn tại'
                })
            } else {
                const validationRules = [
                    { field: 'tennhanvien', message: 'Vui lòng nhập tên nhân viên.' },
                    { field: 'email', message: 'Vui lòng nhập email.' },
                    { field: 'phongban', message: 'Vui lòng chọn phòng ban.' },
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
                    await db.Dm_NhanVien.create({
                        TenNhanVien: data.tennhanvien,
                        Email: data.email,
                        PhongBan_Id: data.phongban.PhongBan_Id,
                        TrangThai: 0
                    })
                    resolve({
                        errCode: 0,
                        errMessage: 'Tạo nhân viên thành công'
                    })
                }
            }
        } catch (e) {
            reject(e)
        }
    })
}

let editNhanVien = (data) => {
    // console.log('data', data)
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 2,
                    errMessage: 'Vui lòng chọn thông tin cần cập nhập'
                })
            }
            let nhanvien = await db.Dm_NhanVien.findOne({
                where: { id: data.id },
                raw: false
            })
            if (nhanvien) {
                nhanvien.TenNhanVien = data.TenNhanVien;
                nhanvien.Email = data.Email;
                nhanvien.PhongBan_Id = data.PhongBan_Id;
                nhanvien.TrangThai = data.TrangThai_Int;
                nhanvien.CheckGui = data.CheckGui_Int;

                await nhanvien.save();
                resolve({
                    errCode: 0,
                    errMessage: 'Sửa thông tin thành công'
                })
            } else {
                resolve({
                    errCode: 1,
                    errMessage: 'Không tìm thấy thông tin'
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

const checkXoaNhanVien = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let checkxoa = await db.sequelize.query('CALL sp_get_checkxoa_nhanvien(:NhanVien_Id)',
                {
                    replacements: { NhanVien_Id: id },
                    raw: true
                }
            );

            // console.log('checkxoa', checkxoa.length)
            if (checkxoa.length === 0) {
                resolve({
                    errCode: 0,
                });
            } else {
                resolve({
                    errCode: 1,
                    errMessage: 'Nhân viên đã được mapping, không được xóa.',
                });
            }
        } catch (e) {
            reject(e)
        }
    });
}

let deleteNhanVien = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let nhanvien = await db.Dm_NhanVien.findOne({
                where: { id: id }
            })
            if (!nhanvien) {
                resolve({
                    errCode: 2,
                    errMessage: `Phòng ban không tồn tại`
                })
            }
            await db.Dm_NhanVien.destroy({
                where: { id: id }
            })
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

module.exports = {
    getAllNhanVien: getAllNhanVien,
    getAllPhongBan: getAllPhongBan,
    createNewNhanVien: createNewNhanVien,
    editNhanVien: editNhanVien,
    checkXoaNhanVien: checkXoaNhanVien,
    deleteNhanVien: deleteNhanVien
}
