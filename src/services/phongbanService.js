
import db from "../models/index";
const { Sequelize } = require('sequelize');
require('dotenv').config();

// let handleGetAction = (button) => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             let butonAction = button
//             resolve(butonAction)
//         } catch (e) {
//             reject(e)
//         }
//     })
// }

let getAllPhongBan = () => {
    return new Promise(async (resolve, reject) => {
        let phongban = '';
        try {
            phongban = await db.Dm_PhongBan.findAll()
            // console.log('check phòng ban', phongban)
            resolve(phongban)
        } catch (e) {
            reject(e)
        }
    })
}

function TextRow(data) {
    this.PhongBan_Id = data.PhongBan_Id;
    this.TenPhongBan = data.TenPhongBan;
}

let getAllPhongBanHis = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const request = db.sqlConnection.request();
            const getphongban = await request.execute('[QLCV_GetPhongBan]');
            const phongban = getphongban.recordset.map(record => {
                return new TextRow(record);
            });

            // console.log('check phòng ban', phongban);
            resolve(phongban);
        } catch (e) {
            reject(e)
        }
    })
}

let getPhongBanId = (data) => {
    return new Promise(async (resolve, reject) => {
        // let grouprole = '';
        try {
            let phongbanid = await db.sequelize.query('CALL sp_get_phongban_id(:phongban_id)',
                {
                    replacements: { phongban_id: 20 },
                    raw: true
                }
            );
            resolve(phongbanid)

        } catch (e) {
            reject(e)
        }
    })
}

let checkPhongBan = (TenPhongBan) => {
    return new Promise(async (resolve, reject) => {
        try {
            let phongban = await db.Dm_PhongBan.findOne({
                where: { TenPhongBan: TenPhongBan }
            });
            if (phongban) {
                resolve(true)
            } else {
                resolve(false)
            }
        } catch (e) {
            resolve(e)
        }
    })
}

let createNewPhongBan = (data) => {
    return new Promise(async (resolve, reject) => {
        // console.log('check data', data)
        try {
            let check = await checkPhongBan(data.tenphongban);
            if (check === true) {
                resolve({
                    errCode: 1,
                    errMessage: 'Phòng ban đã tồn tại'
                })
            } else {
                const validationRules = [
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
                    await db.Dm_PhongBan.create({
                        ID_Mapping: data.phongban.PhongBan_Id,
                        TenPhongBan: data.tenphongban,
                        TruongKhoa: data.truongkhoa,
                        DieuDuongTruong: data.dieuduongtruong
                    })
                    resolve({
                        errCode: 0,
                        errMessage: 'Tạo phòng ban thành công'
                    })
                }
            }
        } catch (e) {
            reject(e)
        }
    })
}

let editPhongBan = (data) => {
    // console.log('data', data)
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 2,
                    errMessage: 'Vui lòng chọn thông tin cần cập nhập'
                })
            }
            let phongban = await db.Dm_PhongBan.findOne({
                where: { id: data.id },
                raw: false
            })
            if (phongban) {
                phongban.TenPhongBan = data.TenPhongBan;
                phongban.TruongKhoa = data.TruongKhoa;
                phongban.DieuDuongTruong = data.DieuDuongTruong;

                await phongban.save();
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

let deletePhongBan = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let phongban = await db.Dm_PhongBan.findOne({
                where: { id: id }
            })
            if (!phongban) {
                resolve({
                    errCode: 2,
                    errMessage: `Phòng ban không tồn tại`
                })
            }
            await db.Dm_PhongBan.destroy({
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

const checkXoaPhongBan = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let checkxoa = await db.sequelize.query('CALL sp_get_checkxoa_phongban(:PhongBan_Id)',
                {
                    replacements: { PhongBan_Id: id },
                    raw: true
                }
            );

            // console.log('checkxoa', checkxoa.length)
            if (checkxoa.length < 2) {
                resolve({
                    errCode: 0,
                });
            } else {
                resolve({
                    errCode: 1,
                    errMessage: 'Phòng ban đã được mapping, không được xóa.',
                });
            }
        } catch (e) {
            reject(e)
        }
    });
};

module.exports = {
    getAllPhongBan: getAllPhongBan,
    createNewPhongBan: createNewPhongBan,
    deletePhongBan: deletePhongBan,
    editPhongBan: editPhongBan,
    getPhongBanId: getPhongBanId,
    getAllPhongBanHis: getAllPhongBanHis,
    checkXoaPhongBan: checkXoaPhongBan
}
