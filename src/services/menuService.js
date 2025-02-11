
import db from "../models/index";
import role from "../models/role";
import { getGroupWithRoles } from './JWTService';
// import { createJWT } from '../middleware/JWTAction';
import { repairToken } from '../middleware/JWTAction';
import { checkUserJWT } from '../middleware/JWTAction';

require('dotenv').config();

let getAllMenuCon = () => {
    return new Promise(async (resolve, reject) => {
        let menu = '';
        try {
            let menu = await db.sequelize.query('CALL sp_get_allmenu_con',
                {
                    // replacements: { id: 2 },
                    raw: false
                }
            );
            //console.log('menu', menu)
            resolve(menu)
        } catch (e) {
            reject(e)
        }
    })
}

let getAllMenuCha = () => {
    return new Promise(async (resolve, reject) => {
        let menu = '';
        try {
            let menu_cha = await db.sequelize.query('CALL sp_get_allmenu_cha',
                {
                    // replacements: { id: 2 },
                    raw: false
                }
            );
            //console.log('menu_cha', menu_cha)
            resolve(menu_cha)
        } catch (e) {
            reject(e)
        }
    })
}

let createNewMenuCha = (data) => {
    // console.log('data group', data)
    return new Promise(async (resolve, reject) => {
        try {
            let check = await checkMenuCha(data.tenmenu_cha);
            //console.log('check menu',check)
            if (check === true) {
                resolve({
                    errCode: 1,
                    errMessage: 'Tên munu cha đã tồn tại'
                })
            } else {
                await db.Dm_Menu_Cha.create({
                    tenmenu_cha: data.tenmenu_cha
                })
            }
            resolve({
                errCode: 0,
                errMessage: 'Tạo menu cha thành công'
            })
        } catch (e) {
            reject(e)
        }
    })
}

let checkMenuCha = (tenmenu_cha) => {
    return new Promise(async (resolve, reject) => {
        try {
            let menu = await db.Dm_Menu_Cha.findOne({
                where: { tenmenu_cha: tenmenu_cha }
            });
            if (menu) {
                resolve(true)
            } else {
                resolve(false)
            }
        } catch (e) {
            resolve(e)
        }
    })
}


let deleteMenuCha = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let check_menu = await db.Dm_Menu_Con.findAll({
                where: { menu_cha_id: id },
                raw: true
            })

            if (check_menu.length > 0) {
                resolve({
                    errCode: 2,
                    errMessage: `Menu đã sử dụng không thể xóa`
                })
            } else {
                await db.Dm_Menu_Cha.destroy({
                    where: { id: id }
                })
                resolve({
                    errCode: 0,
                    errMessage: `Đã xóa thông tin thành công`
                })
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
        }
    })
}


let editMenuCha = (data) => {
    // console.log('data', data)
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 2,
                    errMessage: 'Vui lòng chọn thông tin cần cập nhập'
                })
            }
            let menu_cha = await db.Dm_Menu_Cha.findOne({
                where: { id: data.id },
                raw: false
            })
            if (menu_cha) {
                menu_cha.tenmenu_cha = data.tenmenu_cha;
                await menu_cha.save();
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


let getAllSelectMenuCha = () => {
    return new Promise(async (resolve, reject) => {
        // let grouprole = '';
        try {
            let data = await db.sequelize.query('CALL sp_get_all_menu_cha',
                {
                    // replacements: { phongban_id: 20 },
                    raw: true
                }
            );
            //console.log('data', data)
            resolve(data)

        } catch (e) {
            reject(e)
        }
    })
}

let getAllGroup = () => {
    return new Promise(async (resolve, reject) => {
        let group = '';
        try {
            //group = await db.Group.findAll()
            // console.log('checkgroup', group)
            let group = await db.Group.findAll({
                attributes: ['id', 'Group', 'MoTa', 'MaGroup'],
                raw: true
            });
            //console.log('checkgroup', group)
            resolve(group)
        } catch (e) {
            reject(e)
        }
    })
}

let createNewMenuCon = (data) => {
    return new Promise(async (resolve, reject) => {
        try {

            const validationRules = [
                { field: 'link', message: 'Vui lòng nhập link.' },
                { field: 'tenmenu_con', message: 'Vui lòng nhập tên menu con.' },
                { field: 'menucha.id', message: 'Vui lòng chọn menu cha' },
                { field: 'group', message: 'Vui lòng chọn nhóm quyền' },
            ];

            let errorMessage = '';

            // Kiểm tra từng trường trong validationRules
            for (const rule of validationRules) {
                const fieldParts = rule.field.split('.'); // Kiểm tra nếu trường là object (ví dụ: menucha.id)
                let fieldValue = data;

                // Lấy giá trị thực tế từ data
                for (const part of fieldParts) {
                    if (fieldValue[part] !== undefined) {
                        fieldValue = fieldValue[part];
                    } else {
                        fieldValue = undefined;
                        break;
                    }
                }

                // Kiểm tra giá trị của field (với group kiểm tra độ dài mảng)
                if (!fieldValue || (Array.isArray(fieldValue) && fieldValue.length === 0)) {
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
                let menu = await db.sequelize.query('CALL sp_get_allmenu_con',
                    {
                        // replacements: { id: 2 },
                        raw: false
                    }
                );
                //console.log('menu', menu)
                // Hàm để kiểm tra trùng lặp
                const checkDuplicate = (data, menu) => {
                    // Kiểm tra trùng link
                    const isLinkDuplicate = menu.some(item => item.link === data.link);

                    // Kiểm tra trùng tên menu con
                    const isMenuConDuplicate = menu.some(item => item.tenmenu_con === data.tenmenu_con);

                    // Nếu trùng cả link hoặc tên menu con
                    if (isLinkDuplicate && isMenuConDuplicate) {
                        //console.log('Trùng cả link và tên menu con');
                        return { isDuplicate: true, message: 'Link và tên menu con đã tồn tại.' };
                    }

                    if (isLinkDuplicate) {
                        //console.log('Trùng link');
                        return { isDuplicate: true, message: 'Link đã tồn tại.' };
                    }

                    if (isMenuConDuplicate) {
                        //console.log('Trùng tên menu con');
                        return { isDuplicate: true, message: 'Tên menu con đã tồn tại.' };
                    }

                    return { isDuplicate: false, message: '' };
                };

                // Gọi hàm kiểm tra
                const result = checkDuplicate(data, menu);

                if (result.isDuplicate) {
                    //console.warn(result.message); // Hiển thị cảnh báo
                    resolve({
                        errCode: 1,
                        errMessage: result.message
                    });
                } else {
                    //console.log('Không có trùng lặp.');
                    await db.Dm_Menu_Con.create({
                        link: data.link,
                        tenmenu_con: data.tenmenu_con,
                        menu_cha_id: data.menucha.id,
                        group_id: data.group.join(','),
                    })
                    resolve({
                        errCode: 0,
                        errMessage: 'Tạo menu con thành công'
                    })
                }
            }
        } catch (e) {
            reject(e)
        }
    })
}

let deleteMenuCon = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            await db.Dm_Menu_Con.destroy({
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

let deleteHopDong = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            await db.Data_HD.destroy({
                where: { nhacungcap_id: id }
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

let deletePO = (sopo) => {
    return new Promise(async (resolve, reject) => {
        try {
            await db.Data_PO.destroy({
                where: { sopo: sopo }
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

let deletePR = (sopr) => {
    return new Promise(async (resolve, reject) => {
        try {
            await db.Data_PR.destroy({
                where: { sopr: sopr }
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


let deleteLogCTHD = (machungtu, sopo) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data_log = await db.Data_ChungTu_Hd_Log.findAll({
                //attributes: ['SoBenhAn'],
                where: {
                    machungtu: machungtu,
                },
                raw: true
            });

            // Lấy ra tất cả id_data_hd 
            const dataidhd = data_log.map(item => ({
                id_data_hd: item.id_data_hd,
            }));
            //console.log('data_log', data_log)

            let dataHD_OLD = [];
            for (const { id_data_hd } of dataidhd) {
                try {
                    // Tìm kiếm trong DB theo sopo và mataisan
                    let data = await db.Data_HD.findOne({
                        where: {
                            id: id_data_hd,
                        },
                        raw: true
                    });

                    if (data) {
                        dataHD_OLD.push(data);
                    }
                } catch (error) {
                    console.error(`Error finding data for ${machungtu}:`, error);
                }
            }

            for (const logItem of data_log) {
                // Tìm item trong dataHD_OLD có cùng id và mataisan
                const hdItem = dataHD_OLD.find(item => item.id === logItem.id_data_hd && item.mataisan === logItem.mataisan);

                if (hdItem) {
                    // Thực hiện phép trừ soluongdanhap từ dataHD_OLD với soluongnhap từ data_log
                    const soluongconlai = hdItem.soluongdanhap - logItem.soluongnhap;

                    // Kiểm tra kết quả của phép trừ và cập nhật dacheck
                    if (soluongconlai === 0) {
                        hdItem.dongianhap = null;
                        hdItem.dongianhapvat = null;
                        hdItem.soluongdanhap = null;
                        hdItem.checkhieuluc = null;
                        hdItem.dacheckvoict = null;
                        hdItem.checkmataisanvoict = null;
                    } else if (soluongconlai > 0) {
                        hdItem.dacheckvoict = 1;
                        hdItem.checkmataisanvoict = 1;
                        hdItem.soluongdanhap = soluongconlai;
                    }

                    // Cập nhật vào cơ sở dữ liệu
                    try {
                        let data = await db.Data_HD.findOne({ where: { id: hdItem.id }, raw: false });
                        if (data) {
                            // Cập nhật các giá trị
                            data.dongianhap = hdItem.dongianhap;
                            data.dongianhapvat = hdItem.dongianhapvat;
                            data.soluongdanhap = hdItem.soluongdanhap;
                            data.checkhieuluc = hdItem.checkhieuluc;
                            data.dacheckvoict = hdItem.dacheckvoict;
                            data.checkmataisanvoict = hdItem.checkmataisanvoict;

                            // Lưu thay đổi
                            await data.save();
                        } else {
                            //console.log(`Record not found with id: ${hdItem.id}`);
                        }
                    } catch (error) {
                        console.error(`Error updating record with id: ${hdItem.id}`, error);
                    }
                }
            }

            for (const logItem of data_log) {
                try {
                    // Xóa các bản ghi từ db.Data_PR dựa trên sopr
                    await db.Data_ChungTu_Hd_Log.destroy({
                        where: {
                            id: logItem.id
                        }
                    });
                } catch (error) {
                    console.error(`Error deleting record with id_data_hd: ${logItem.id_data_hd}`, error);
                }
            }

            // let data_dacheck = await db.sequelize.query('CALL sp_get_checkxoa_chungtu(:sopo)',
            //     {
            //         replacements: { sopo: sopo },
            //         raw: false
            //     }
            // );

            // console.log('data_dacheck', data_dacheck)

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

let deleteCheckLogCTHD = (machungtu, sopo) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data_log = await db.Check_Data_ChungTu_Hd_Log.findAll({
                //attributes: ['SoBenhAn'],
                where: {
                    machungtu: machungtu,
                },
                raw: true
            });

            // Lấy ra tất cả id_data_hd 
            const dataidhd = data_log.map(item => ({
                id_data_hd: item.id_data_hd,
            }));
            //console.log('data_log', data_log)

            let dataHD_OLD = [];
            for (const { id_data_hd } of dataidhd) {
                try {
                    // Tìm kiếm trong DB theo sopo và mataisan
                    let data = await db.Data_HD.findOne({
                        where: {
                            id: id_data_hd,
                        },
                        raw: true
                    });

                    if (data) {
                        dataHD_OLD.push(data);
                    }
                } catch (error) {
                    console.error(`Error finding data for ${machungtu}:`, error);
                }
            }

            for (const logItem of data_log) {
                // Tìm item trong dataHD_OLD có cùng id và mataisan
                const hdItem = dataHD_OLD.find(item => item.id === logItem.id_data_hd && item.mataisan === logItem.mataisan);

                if (hdItem) {
                    // Thực hiện phép trừ soluongdanhap từ dataHD_OLD với soluongnhap từ data_log
                    const soluongconlai = hdItem.soluongdanhap2 - logItem.soluongnhap;

                    // Kiểm tra kết quả của phép trừ và cập nhật dacheck
                    if (soluongconlai === 0) {
                        hdItem.dongianhap2 = null;
                        hdItem.dongianhapvat2 = null;
                        hdItem.soluongdanhap2 = null;
                        hdItem.checkhieuluc = null;
                        hdItem.dacheckvoict2 = null;
                        hdItem.checkmataisanvoict2 = null;
                    } else if (soluongconlai > 0) {
                        hdItem.dacheckvoict2 = 1;
                        hdItem.checkmataisanvoict2 = 1;
                        hdItem.soluongdanhap2 = soluongconlai;
                    }

                    // Cập nhật vào cơ sở dữ liệu
                    try {
                        let data = await db.Data_HD.findOne({ where: { id: hdItem.id }, raw: false });
                        if (data) {
                            // Cập nhật các giá trị
                            data.dongianhap2 = hdItem.dongianhap2;
                            data.dongianhapvat2 = hdItem.dongianhapvat2;
                            data.soluongdanhap2 = hdItem.soluongdanhap2;
                            data.checkhieuluc = hdItem.checkhieuluc;
                            data.dacheckvoict2 = hdItem.dacheckvoict2;
                            data.checkmataisanvoict2 = hdItem.checkmataisanvoict2;

                            // Lưu thay đổi
                            await data.save();
                        } else {
                            //console.log(`Record not found with id: ${hdItem.id}`);
                        }
                    } catch (error) {
                        console.error(`Error updating record with id: ${hdItem.id}`, error);
                    }
                }
            }

            for (const logItem of data_log) {
                try {
                    // Xóa các bản ghi từ db.Data_PR dựa trên sopr
                    await db.Check_Data_ChungTu_Hd_Log.destroy({
                        where: {
                            id: logItem.id
                        }
                    });
                } catch (error) {
                    console.error(`Error deleting record with id_data_hd: ${logItem.id_data_hd}`, error);
                }
            }

            // let data_dacheck = await db.sequelize.query('CALL sp_get_checkxoa_chungtu(:sopo)',
            //     {
            //         replacements: { sopo: sopo },
            //         raw: false
            //     }
            // );

            // console.log('data_dacheck', data_dacheck)

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

let deleteLogPOPR = (sopo) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data_log = await db.Data_Po_Pr_Log.findAll({
                //attributes: ['SoBenhAn'],
                where: {
                    sopo: sopo,
                },
                raw: true
            });

            // Lấy ra tất cả id_data_hd 
            const dataidpr = data_log.map(item => ({
                id_data_pr: item.id_data_pr,
            }));

            let dataPR_OLD = [];
            for (const { id_data_pr } of dataidpr) {
                try {
                    // Tìm kiếm trong DB theo sopo và mataisan
                    let data = await db.Data_PR.findOne({
                        where: {
                            id: id_data_pr,
                        },
                        raw: true
                    });

                    if (data) {
                        dataPR_OLD.push(data);
                    }
                } catch (error) {
                    console.error(`Error finding data for ${machungtu}:`, error);
                }
            }
            for (const logItem of data_log) {
                // Tìm item trong dataHD_OLD có cùng id và mataisan
                const prItem = dataPR_OLD.find(item => item.id === logItem.id_data_pr && item.mataisan === logItem.mataisan);
                if (prItem) {
                    // Thực hiện phép trừ soluongdanhap từ dataHD_OLD với soluongnhap từ data_log
                    //const soluongpoconlai = prItem.soluongpr - logItem.soluongpo - (prItem.soluongpo * -1);
                    const soluongpoconlai = prItem.tongsoluongpo - logItem.soluongpo;
                    const tongsoluongpoconlai = prItem.tongsoluongpo - logItem.soluongpo;

                    // Kiểm tra kết quả của phép trừ và cập nhật dacheck
                    if (soluongpoconlai === 0) {
                        prItem.soluongpo = null;
                        prItem.tongsoluongpo = null;
                        prItem.dacheckvoipo = null;
                        prItem.checkmataisan = null;
                    } else if (soluongpoconlai > 0) {
                        prItem.dacheckvoipo = 1;
                        prItem.checkmataisan = 1;
                        prItem.soluongpo = tongsoluongpoconlai - prItem.soluongpr;
                        prItem.tongsoluongpo = tongsoluongpoconlai;
                    }

                    // Cập nhật vào cơ sở dữ liệu
                    try {
                        let data = await db.Data_PR.findOne({ where: { id: prItem.id }, raw: false });
                        if (data) {
                            // Cập nhật các giá trị
                            data.soluongpo = prItem.soluongpo;
                            data.tongsoluongpo = prItem.tongsoluongpo;
                            data.dacheckvoipo = prItem.dacheckvoipo;
                            data.checkmataisan = prItem.checkmataisan;

                            // Lưu thay đổi
                            await data.save();
                        } else {
                            console.log(`Record not found with id: ${prItem.id}`);
                        }
                    } catch (error) {
                        console.error(`Error updating record with id: ${prItem.id}`, error);
                    }
                }
            }

            for (const logItem of data_log) {
                try {
                    // Xóa các bản ghi từ db.Data_PR dựa trên sopr
                    await db.Data_Po_Pr_Log.destroy({
                        where: {
                            id: logItem.id
                        }
                    });
                } catch (error) {
                    console.error(`Error deleting record with id_data_hd: ${logItem.id_data_hd}`, error);
                }
            }

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

let deleteCT = (machungtu, sopo) => {
    return new Promise(async (resolve, reject) => {
        try {

            let check_log_chungtu = await db.Data_ChungTu_Log.findAll({
                //attributes: ['SoBenhAn'],
                where: {
                    machungtu: machungtu,
                },
                raw: true
            });

            let check_log_hopdong = await db.Data_ChungTu_Hd_Log.findAll({
                //attributes: ['SoBenhAn'],
                where: {
                    machungtu: machungtu,
                },
                raw: true
            });

            let data_chungtu = await db.Data_ChungTu.findAll({
                //attributes: ['SoBenhAn'],
                where: {
                    machungtu: machungtu,
                },
                raw: true
            });

            if (check_log_chungtu.length === 0 && check_log_hopdong.length === 0) {
                //XÓA DATA CHỨNG TỪ TRƯỚC KHI INSRT LẠI
                for (const logItem of data_chungtu) {
                    try {
                        // Xóa các bản ghi từ db.Data_PR dựa trên sopr
                        await db.Data_ChungTu.destroy({
                            where: {
                                machungtu: logItem.machungtu
                            }
                        });
                    } catch (error) {
                        console.error(`Error deleting record with`, error);
                    }
                }
                resolve({
                    errCode: 0,
                    errMessage: 'Đã xóa chứng từ thành công'
                })
            } else {
                resolve({
                    errCode: 1,
                    errMessage: 'Chứng từ đã kiểm tra, không thể xóa'
                })
            }

        } catch (error) {
            console.error(error);
            return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
        }
    })
}

let deleteTaiSan = (Duoc_Id, TenDuoc_Id) => {
    return new Promise(async (resolve, reject) => {
        try {
            //console.log('Duoc_Id', Duoc_Id, TenDuoc_Id)
            const request = db.sqlhis2Connection.request();
            request.input('Duoc_Id', Duoc_Id);
            request.input('TenDuoc_Id', TenDuoc_Id);
            const getdata = await request.execute('[sp_QLPO_DELETE_TAISAN]');
            resolve({
                errCode: 0,
                errMessage: 'Xóa tài sản thành công.',
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
        }
    })
}

let deleteDaTaKiemKe = (KhoTaiSan_Id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            //console.log('data', data)
            await db.Data_KiemKe.destroy({
                where: {
                    KhoDuoc_Id: KhoTaiSan_Id,
                    XacNhanKiemKe: null,
                    DotKiemKe_Id: data.DotKiemKe_Id
                }
            })
            await db.Data_DotKiemKe.destroy({
                where: {
                    id: data.DotKiemKe_Id
                }
            })
            resolve({
                errCode: 0,
                errMessage: `Đã xóa thông tin thành công`
            })

        } catch (error) {
            console.error(error);
            //return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
        }
    })
}

let huyKiemKe = (IdKiemKe) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Data_KiemKe.findOne({
                where: { id: IdKiemKe },
                raw: false
            })
            let check_trangthaichuyen = await db.sequelize.query('CALL sp_check_trangthaichuyen(:IdKiemKe)',
                {
                    replacements: {
                        IdKiemKe: IdKiemKe
                    },
                    raw: false
                }
            );
            const id_chuyen = check_trangthaichuyen[0]?.Id_Chuyen;

            if (check_trangthaichuyen.length > 0) {

                //CẬP NHẬP LẠI TRẠNG THÁI CHUYỂN CHO TÀI SẢN ĐÚNG KHO
                let data_dachuyen = await db.Data_KiemKe.findOne({ where: { id: id_chuyen }, raw: false });
                //console.log('chạy a', check_trangthaichuyen.length, id_chuyen)
                if (data_dachuyen) {
                    data_dachuyen.TrangThaiChuyen = null;
                    // Lưu thay đổi
                    await data_dachuyen.save();
                }
                if (data.KhoDuocSaiViTri_Id) {
                    try {
                        // Xóa bản ghi theo ID từ đối tượng duy nhất
                        await db.Data_KiemKe.destroy({
                            where: { id: data.id }
                        });
                    } catch (error) {
                        console.error(`Lỗi khi xóa dữ liệu với ID ${data.id}:`, error);
                    }
                    resolve({
                        errCode: 0,
                        errMessage: 'Hủy kiểm kê thành công'
                    })
                } else {
                    if (data) {
                        data.IsCheckKiemKe = 0;
                        data.SoLuongThucTe = null;
                        data.ChenhLech = null;
                        data.NgayKiemKe = null
                        await data.save();
                        resolve({
                            errCode: 0,
                            errMessage: 'Hủy kiểm kê thành công'
                        })
                    } else {
                        resolve({
                            errCode: 1,
                            errMessage: 'Không tìm thấy thông tin'
                        })
                    }
                }
            } else {
                if (data.KhoDuocSaiViTri_Id) {
                    try {
                        // Xóa bản ghi theo ID từ đối tượng duy nhất
                        await db.Data_KiemKe.destroy({
                            where: { id: data.id }
                        });
                    } catch (error) {
                        console.error(`Lỗi khi xóa dữ liệu với ID ${data.id}:`, error);
                    }
                    resolve({
                        errCode: 0,
                        errMessage: 'Hủy kiểm kê thành công'
                    })
                } else {
                    if (data) {
                        data.IsCheckKiemKe = 0;
                        data.SoLuongThucTe = null;
                        data.ChenhLech = null;
                        data.NgayKiemKe = null
                        await data.save();
                        resolve({
                            errCode: 0,
                            errMessage: 'Hủy kiểm kê thành công'
                        })
                    } else {
                        resolve({
                            errCode: 1,
                            errMessage: 'Không tìm thấy thông tin'
                        })
                    }
                }
                // //console.log('chạy b')
                // if (data) {
                //     data.IsCheckKiemKe = 0;
                //     data.SoLuongThucTe = null;
                //     data.ChenhLech = null;
                //     data.NgayKiemKe = null
                //     await data.save();
                //     resolve({
                //         errCode: 0,
                //         errMessage: 'Hủy kiểm kê thành công'
                //     })
                // } else {
                //     resolve({
                //         errCode: 1,
                //         errMessage: 'Không tìm thấy thông tin'
                //     })
                // }
            }
        } catch (error) {
            console.error(error);
            //return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
        }
    })
}

let deleteCheckCT = (machungtu, sopo) => {
    return new Promise(async (resolve, reject) => {
        try {

            let check_log_chungtu = await db.Check_Data_ChungTu_Log.findAll({
                //attributes: ['SoBenhAn'],
                where: {
                    machungtu: machungtu,
                },
                raw: true
            });

            let check_log_hopdong = await db.Check_Data_ChungTu_Hd_Log.findAll({
                //attributes: ['SoBenhAn'],
                where: {
                    machungtu: machungtu,
                },
                raw: true
            });

            let data_chungtu = await db.Check_Data_ChungTu.findAll({
                //attributes: ['SoBenhAn'],
                where: {
                    machungtu: machungtu,
                },
                raw: true
            });

            if (check_log_chungtu.length === 0 && check_log_hopdong.length === 0) {
                //XÓA DATA CHỨNG TỪ TRƯỚC KHI INSRT LẠI
                for (const logItem of data_chungtu) {
                    try {
                        // Xóa các bản ghi từ db.Data_PR dựa trên sopr
                        await db.Check_Data_ChungTu.destroy({
                            where: {
                                machungtu: logItem.machungtu
                            }
                        });
                    } catch (error) {
                        console.error(`Error deleting record with`, error);
                    }
                }
                resolve({
                    errCode: 0,
                    errMessage: 'Đã xóa chứng từ thành công'
                })
            } else {
                resolve({
                    errCode: 1,
                    errMessage: 'Chứng từ đã kiểm tra, không thể xóa'
                })
            }

        } catch (error) {
            console.error(error);
            return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
        }
    })
}

let deleteLogCTPO = (machungtu, sopo) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data_log = await db.Data_ChungTu_Log.findAll({
                //attributes: ['SoBenhAn'],
                where: {
                    machungtu: machungtu,
                },
                raw: true
            });

            let data_chungtu = await db.Data_ChungTu.findAll({
                //attributes: ['SoBenhAn'],
                where: {
                    machungtu: machungtu,
                },
                raw: true
            });

            // Lấy ra tất cả id_data_po 
            const dataidpo = data_log.map(item => ({
                id_data_po: item.id_data_po,
            }));
            //console.log('data_log', data_log)


            let dataPO_OLD = [];
            for (const { id_data_po } of dataidpo) {
                try {
                    // Tìm kiếm trong DB theo sopo và mataisan
                    let data = await db.Data_PO.findOne({
                        where: {
                            id: id_data_po,
                        },
                        raw: true
                    });

                    if (data) {
                        dataPO_OLD.push(data);
                    }
                } catch (error) {
                    console.error(`Error finding data for ${machungtu}:`, error);
                }
            }

            for (const logItem of data_log) {
                // Tìm item trong dataHD_OLD có cùng id và mataisan
                const hdItem = dataPO_OLD.find(item => item.id === logItem.id_data_po && item.mataisan === logItem.mataisan);

                if (hdItem) {
                    // Thực hiện phép trừ soluongdanhap từ dataHD_OLD với soluongnhap từ data_log
                    const soluongconlai = hdItem.soluongdanhap - logItem.soluongnhap;
                    const soluongnhap = hdItem.soluongpo - (hdItem.soluongdanhap - logItem.soluongnhap);
                    const soluongnhapconlai = hdItem.soluongdanhap - logItem.soluongnhap;

                    // Kiểm tra kết quả của phép trừ và cập nhật dacheck
                    if (soluongconlai === 0) {
                        hdItem.soluongnhap = null;
                        hdItem.dongianhap = null;
                        hdItem.dongiavatnhap = null;
                        hdItem.soluongdanhap = null;
                        hdItem.dacheckvoict = null;
                        hdItem.checkmataisanvoict = null;
                    } else if (soluongconlai > 0) {
                        hdItem.soluongnhap = soluongnhap * -1;
                        hdItem.soluongdanhap = soluongnhapconlai;
                        hdItem.dacheckvoict = 1;
                        hdItem.checkmataisanvoict = 1;
                        hdItem.soluongnhap_check = soluongnhap * -1;
                    }

                    // Cập nhật vào cơ sở dữ liệu
                    try {
                        let data = await db.Data_PO.findOne({ where: { id: hdItem.id }, raw: false });
                        if (data) {
                            // Cập nhật các giá trị
                            data.soluongnhap = hdItem.soluongnhap;
                            data.dongianhap = hdItem.dongianhap;
                            data.dongiavatnhap = hdItem.dongiavatnhap;
                            data.soluongdanhap = hdItem.soluongdanhap;
                            data.dacheckvoict = hdItem.dacheckvoict;
                            data.checkmataisanvoict = hdItem.checkmataisanvoict;
                            // Lưu thay đổi
                            await data.save();
                        } else {
                            console.log(`Record not found with id: ${hdItem.id}`);
                        }
                    } catch (error) {
                        console.error(`Error updating record with id: ${hdItem.id}`, error);
                    }
                }
            }
            //console.log('dataHD_OLD', dataHD_OLD)

            for (const logItem of data_log) {
                try {
                    // Xóa các bản ghi từ db.Data_PR dựa trên sopr
                    await db.Data_ChungTu_Log.destroy({
                        where: {
                            id: logItem.id
                        }
                    });
                } catch (error) {
                    console.error(`Error deleting record with`, error);
                }
            }

            // for (const logItem of data_chungtu) {
            //     try {
            //         // Xóa các bản ghi từ db.Data_PR dựa trên sopr
            //         await db.Data_ChungTu.destroy({
            //             where: {
            //                 machungtu: logItem.machungtu
            //             }
            //         });
            //     } catch (error) {
            //         console.error(`Error deleting record with`, error);
            //     }
            // }

            // TÌM LẠI PO CHƯA CHECK VỚI CHỨNG TỪ ĐỀ CẬP NHẬP LẠI  DACHEKVOICT.
            let data_dacheck_ct = await db.sequelize.query('CALL sp_get_po_dacheck_ct(:sopo)',
                {
                    replacements: { sopo: sopo },
                    raw: false
                }
            );

            if (data_dacheck_ct) {
                for (const itemCheck of data_dacheck_ct) {
                    try {
                        let data = await db.Data_PO.findOne({ where: { id: itemCheck.id }, raw: false });
                        if (data) {
                            // Cập nhật các giá trị
                            data.dacheckvoict = null;
                            // Lưu thay đổi
                            await data.save();
                        }
                    } catch (error) {
                        console.error(`Error updating record`, error);
                    }

                }
            }

            // TÌM LẠI CHỨNG TỪ CÙNG SỐ PO ĐỂ CẬP NHẬP LẠI SOLUONGDACHECK.
            let data_dacheck = await db.sequelize.query('CALL sp_get_po_dacheck(:sopo)',
                {
                    replacements: { sopo: sopo },
                    raw: false
                }
            );

            //console.log('data_dacheck', data_dacheck)
            if (data_dacheck) {
                for (const itemCheck of data_dacheck) {
                    try {
                        let data = await db.Data_ChungTu_Log.findOne({ where: { id: itemCheck.id }, raw: false });
                        //console.log('data', data)
                        if (data) {
                            // Cập nhật các giá trị
                            data.soluongnhap_check = itemCheck.soluongnhap;
                            // Lưu thay đổi
                            await data.save();
                        }
                    } catch (error) {
                        console.error(`Error updating record`, error);
                    }

                }
            }

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

let deleteCheckLogCTPO = (machungtu, sopo) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data_log = await db.Check_Data_ChungTu_Log.findAll({
                //attributes: ['SoBenhAn'],
                where: {
                    machungtu: machungtu,
                },
                raw: true
            });

            let data_chungtu = await db.Check_Data_ChungTu.findAll({
                //attributes: ['SoBenhAn'],
                where: {
                    machungtu: machungtu,
                },
                raw: true
            });

            // Lấy ra tất cả id_data_po 
            const dataidpo = data_log.map(item => ({
                id_data_po: item.id_data_po,
            }));
            //console.log('data_log', data_log)


            let dataPO_OLD = [];
            for (const { id_data_po } of dataidpo) {
                try {
                    // Tìm kiếm trong DB theo sopo và mataisan
                    let data = await db.Data_PO.findOne({
                        where: {
                            id: id_data_po,
                        },
                        raw: true
                    });

                    if (data) {
                        dataPO_OLD.push(data);
                    }
                } catch (error) {
                    console.error(`Error finding data for ${machungtu}:`, error);
                }
            }

            for (const logItem of data_log) {
                // Tìm item trong dataHD_OLD có cùng id và mataisan
                const hdItem = dataPO_OLD.find(item => item.id === logItem.id_data_po && item.mataisan === logItem.mataisan);

                if (hdItem) {
                    // Thực hiện phép trừ soluongdanhap từ dataHD_OLD với soluongnhap từ data_log
                    const soluongconlai = hdItem.soluongdanhap2 - logItem.soluongnhap;
                    const soluongnhap = hdItem.soluongpo - (hdItem.soluongdanhap2 - logItem.soluongnhap);
                    const soluongnhapconlai = hdItem.soluongdanhap2 - logItem.soluongnhap;

                    // Kiểm tra kết quả của phép trừ và cập nhật dacheck
                    if (soluongconlai === 0) {
                        hdItem.soluongnhap2 = null;
                        hdItem.dongianhap2 = null;
                        hdItem.dongiavatnhap2 = null;
                        hdItem.soluongdanhap2 = null;
                        hdItem.dacheckvoict2 = null;
                        hdItem.checkmataisanvoict2 = null;
                    } else if (soluongconlai > 0) {
                        hdItem.soluongnhap2 = soluongnhap * -1;
                        hdItem.soluongdanhap2 = soluongnhapconlai;
                        hdItem.dacheckvoict2 = 1;
                        hdItem.checkmataisanvoict2 = 1;
                        hdItem.soluongnhap_check = soluongnhap * -1;
                    }

                    // Cập nhật vào cơ sở dữ liệu
                    try {
                        let data = await db.Data_PO.findOne({ where: { id: hdItem.id }, raw: false });
                        if (data) {
                            // Cập nhật các giá trị
                            data.soluongnhap2 = hdItem.soluongnhap2;
                            data.dongianhap2 = hdItem.dongianhap2;
                            data.dongiavatnhap2 = hdItem.dongiavatnhap2;
                            data.soluongdanhap2 = hdItem.soluongdanhap2;
                            data.dacheckvoict2 = hdItem.dacheckvoict2;
                            data.checkmataisanvoict2 = hdItem.checkmataisanvoict2;
                            // Lưu thay đổi
                            await data.save();
                        } else {
                            console.log(`Record not found with id: ${hdItem.id}`);
                        }
                    } catch (error) {
                        console.error(`Error updating record with id: ${hdItem.id}`, error);
                    }
                }
            }
            //console.log('dataHD_OLD', dataHD_OLD)

            for (const logItem of data_log) {
                try {
                    // Xóa các bản ghi từ db.Data_PR dựa trên sopr
                    await db.Check_Data_ChungTu_Log.destroy({
                        where: {
                            id: logItem.id
                        }
                    });
                } catch (error) {
                    console.error(`Error deleting record with`, error);
                }
            }

            // for (const logItem of data_chungtu) {
            //     try {
            //         // Xóa các bản ghi từ db.Data_PR dựa trên sopr
            //         await db.Data_ChungTu.destroy({
            //             where: {
            //                 machungtu: logItem.machungtu
            //             }
            //         });
            //     } catch (error) {
            //         console.error(`Error deleting record with`, error);
            //     }
            // }

            // TÌM LẠI PO CHƯA CHECK VỚI CHỨNG TỪ ĐỀ CẬP NHẬP LẠI  DACHEKVOICT.
            let data_dacheck_ct = await db.sequelize.query('CALL sp_get_check_po_dacheck_ct(:sopo)',
                {
                    replacements: { sopo: sopo },
                    raw: false
                }
            );

            if (data_dacheck_ct) {
                for (const itemCheck of data_dacheck_ct) {
                    try {
                        let data = await db.Data_PO.findOne({ where: { id: itemCheck.id }, raw: false });
                        if (data) {
                            // Cập nhật các giá trị
                            data.dacheckvoict2 = null;
                            // Lưu thay đổi
                            await data.save();
                        }
                    } catch (error) {
                        console.error(`Error updating record`, error);
                    }

                }
            }

            // TÌM LẠI CHỨNG TỪ CÙNG SỐ PO ĐỂ CẬP NHẬP LẠI SOLUONGDACHECK.
            let data_dacheck = await db.sequelize.query('CALL sp_get_check_po_dacheck(:sopo)',
                {
                    replacements: { sopo: sopo },
                    raw: false
                }
            );

            //console.log('data_dacheck', data_dacheck)
            if (data_dacheck) {
                for (const itemCheck of data_dacheck) {
                    try {
                        let data = await db.Check_Data_ChungTu_Log.findOne({ where: { id: itemCheck.id }, raw: false });
                        //console.log('data', data)
                        if (data) {
                            // Cập nhật các giá trị
                            data.soluongnhap_check = itemCheck.soluongnhap2;
                            // Lưu thay đổi
                            await data.save();
                        }
                    } catch (error) {
                        console.error(`Error updating record`, error);
                    }

                }
            }

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

let getNhomQuyen = (id) => {
    return new Promise(async (resolve, reject) => {
        // let grouprole = '';
        try {
            let data = await db.sequelize.query('CALL sp_get_data_menucon_nhomquyen(:id)',
                {
                    replacements: { id: id },
                    raw: true
                }
            );
            //console.log('getNhomQuyen', data)
            resolve(data)

        } catch (e) {
            reject(e)
        }
    })
}

let getMenuCha = (id) => {
    return new Promise(async (resolve, reject) => {
        // let grouprole = '';
        try {
            let data = await db.sequelize.query('CALL sp_get_data_menucon_menucha(:id)',
                {
                    replacements: { id: id },
                    raw: true
                }
            );
            //console.log('getNhomQuyen', data)
            resolve(data)

        } catch (e) {
            reject(e)
        }
    })
}

let editMenuCon = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let menu_con = await db.Dm_Menu_Con.findOne({
                where: { id: data.id },
                raw: false
            })
            //console.log('data', data.group)
            menu_con.link = data.link;
            menu_con.tenmenu_con = data.tenmenu_con;
            menu_con.menu_cha_id = data.menu_cha_id;
            if (data.group !== undefined) {
                //console.log('data 2', data.group)
                menu_con.group_id = data.group.join(',');
            }
            await menu_con.save();
            resolve({
                errCode: 0,
                errMessage: 'Sửa thông tin thành công'
            })
        } catch (e) {
            reject(e);
        }
    })
}

let xacnhanKiemKe = (KhoTaiSan_Id, KhoQuanLy, data, DotKiemKe_Id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const currentTime = new Date();
            // const DotKiemKe_Id_Int = Number(DotKiemKe_Id);
            // let dataxacnhan = await db.sequelize.query('CALL sp_get_data_kiemke(:KhoTaiSan_Id,:KhoQuanLy,:DotKiemKe_Id_Int)',
            //     {
            //         replacements: {
            //             KhoTaiSan_Id: KhoTaiSan_Id,
            //             KhoQuanLy: KhoQuanLy,
            //             DotKiemKe_Id_Int: DotKiemKe_Id_Int
            //         },
            //         raw: false
            //     }
            // );
            //console.log('dataxacnhan', dataxacnhan)
            for (const item of data) {
                try {
                    // Tìm bản ghi trong Data_HD theo id
                    let data = await db.Data_KiemKe.findOne({ where: { id: item.id }, raw: false });

                    if (data) {
                        data.XacNhanKiemKe = 1;
                        data.NgayXacNhanKiemKe = currentTime;
                        // Lưu thay đổi
                        await data.save();
                    }

                    resolve({
                        errCode: 0,
                        errMessage: 'Xác nhận kiểm kê thành công'
                    })
                } catch (error) {
                    console.error(`Lỗi khi cập nhật Data_KiemKe có id: ${item.id}`, error);
                }
            }
        } catch (e) {
            reject(e)
        }
    })
}

let huyxacnhanKiemKe = (KhoTaiSan_Id, KhoQuanLy, data) => {
    return new Promise(async (resolve, reject) => {
        try {

            // let dataxacnhan = await db.sequelize.query('CALL sp_get_data_dakiemke(:KhoTaiSan_Id,:KhoQuanLy)',
            //     {
            //         replacements: {
            //             KhoTaiSan_Id: KhoTaiSan_Id,
            //             KhoQuanLy: KhoQuanLy
            //         },
            //         raw: false
            //     }
            // );
            //console.log('dataxacnhan', dataxacnhan)
            for (const item of data) {
                try {
                    // Tìm bản ghi trong Data_HD theo id
                    let data = await db.Data_KiemKe.findOne({ where: { id: item.id }, raw: false });

                    if (data) {
                        data.XacNhanKiemKe = null;
                        data.NgayXacNhanKiemKe = null;
                        // Lưu thay đổi
                        await data.save();
                    }

                    resolve({
                        errCode: 0,
                        errMessage: 'Hủy xác nhận kiểm kê thành công'
                    })
                } catch (error) {
                    console.error(`Lỗi khi cập nhật Data_KiemKe có id: ${item.id}`, error);
                }
            }
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    getAllMenuCon: getAllMenuCon,
    getAllMenuCha: getAllMenuCha,
    createNewMenuCha: createNewMenuCha,
    deleteMenuCha: deleteMenuCha,
    editMenuCha: editMenuCha,
    getAllSelectMenuCha: getAllSelectMenuCha,
    getAllGroup: getAllGroup,
    createNewMenuCon: createNewMenuCon,
    deleteMenuCon: deleteMenuCon,
    getNhomQuyen: getNhomQuyen,
    getMenuCha: getMenuCha,
    editMenuCon: editMenuCon,
    deleteHopDong: deleteHopDong,
    deletePO: deletePO,
    deletePR: deletePR,
    deleteLogCTHD: deleteLogCTHD,
    deleteLogCTPO: deleteLogCTPO,
    deleteLogPOPR: deleteLogPOPR,
    deleteCT: deleteCT,
    deleteCheckLogCTPO: deleteCheckLogCTPO,
    deleteCheckLogCTHD: deleteCheckLogCTHD,
    deleteCheckCT: deleteCheckCT,
    deleteTaiSan: deleteTaiSan,
    xacnhanKiemKe: xacnhanKiemKe,
    huyxacnhanKiemKe: huyxacnhanKiemKe,
    deleteDaTaKiemKe: deleteDaTaKiemKe,
    huyKiemKe: huyKiemKe
}
