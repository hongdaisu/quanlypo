
import db from "../models/index";
import role from "../models/role";
const mssql = require('mssql');
require('dotenv').config();

let getAllPO = () => {
    return new Promise(async (resolve, reject) => {
        try {

            let data = await db.sequelize.query('CALL sp_get_all_po',
                {
                    // replacements: { id: 2 },
                    raw: false
                }
            );
            resolve(data)
        } catch (e) {
            reject(e)
        }
    })
}

let getAllTaiSan = () => {
    return new Promise(async (resolve, reject) => {
        try {

            const request = db.sqlhis2Connection.request();
            const getdata = await request.execute('[sp_QLPO_DANHMUC_TAISAN]');
            // Lấy dữ liệu từ recordset
            const data = getdata.recordset;
            //console.log('recordset', data)

            resolve(data)
        } catch (e) {
            reject(e)
        }
    })
}


// let getAllTenTaiSan = () => {
//     return new Promise(async (resolve, reject) => {
//         try {

//             const request = db.sqlhis2Connection.request();
//             const getdata = await request.execute('[sp_QLPO_DANHMUC_TENTAISAN]');
//             // Lấy dữ liệu từ recordset
//             const data = getdata.recordset;
//             //console.log('recordset', data)

//             resolve(data)
//         } catch (e) {
//             reject(e)
//         }
//     })
// }

let getAllTenTaiSan = ({ searchTerm, offset = 0 }) => {
    return new Promise(async (resolve, reject) => {
        try {
            searchTerm = String(searchTerm).trim(); // Chuẩn hóa searchTerm
            const request = db.sqlhis2Connection.request();

            // Thiết lập thời gian chờ (query timeout)
            request.queryTimeout = 60000; // 60 giây

            // Truyền searchTerm và offset vào stored procedure
            const getdata = await request
                .input('searchTerm', mssql.NVarChar(255), searchTerm) // Truyền searchTerm vào stored procedure
                .input('offset', mssql.Int, offset) // Truyền offset vào stored procedure
                .execute('[sp_QLPO_DANHMUC_TENTAISAN]'); // Gọi stored procedure

            // Lấy dữ liệu từ recordset
            const data = getdata.recordset;

            resolve(data); // Trả về dữ liệu từ stored procedure
        } catch (error) {
            reject(error); // Xử lý lỗi nếu có
        }
    });
};

let checkDataChuaXacNhan = (KhoTaiSan_Id, KhoQuanLy) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.sequelize.query('CALL sp_checkdata_chuakiemke(:KhoTaiSan_Id,:KhoQuanLy)',
                {
                    replacements: {
                        KhoTaiSan_Id: KhoTaiSan_Id,
                        KhoQuanLy: KhoQuanLy
                    },
                    raw: false
                }
            );
            //console.log('data', data.length)
            if (data.length > 0) {
                resolve({
                    errCode: 0,
                    errMessage: 'Khoa phòng còn dữ liệu chưa kiểm kê'
                })
            } else {
                resolve({
                    errCode: 1,
                    errMessage: 'Khoa phòng không có dữ liệu chưa kiểm kê'
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

let xacNhanThemTaiSan = (KhoTaiSan_Id, tenTaiSan, nhapTenTaiSan, KhoQuanLy, UserId, DotKiemKe_Id, KhoaPhongHienTai) => {
    return new Promise(async (resolve, reject) => {
        try {
            const NgayTao = new Date();
            const NamKiemKe = NgayTao.getFullYear();
            if (!tenTaiSan && !nhapTenTaiSan) {
                //console.log('check', KhoTaiSan_Id, tenTaiSan, nhapTenTaiSan, KhoQuanLy)
                resolve({
                    errCode: 1,
                    errMessage: 'Tên tài sản không được để trống'
                })
            } else {

                let checklankiem = await db.sequelize.query('CALL sp_checklan_kiemke(:KhoTaiSan_Id,:KhoQuanLy)',
                    {
                        replacements: {
                            KhoTaiSan_Id: KhoTaiSan_Id,
                            KhoQuanLy: KhoQuanLy
                        },
                        raw: false
                    }
                );
                const LanKiemKe = checklankiem[0]?.LanKiemKe;

                await db.Data_KiemKe.create({
                    TenTaiSan: tenTaiSan || nhapTenTaiSan,
                    KhoDuoc_Id: KhoTaiSan_Id,
                    KhoaQuanLy: KhoQuanLy,
                    LanKiemKe: LanKiemKe + 1,
                    IsCheckKiemKe: 1,
                    SoLuong: 0,
                    SoLuongThucTe: 1,
                    ChenhLech: 1,
                    NguoiTao: UserId,
                    TrangThaiKiemKe: 0,
                    NgayKiemKe: NgayTao,
                    NamKiemKe: NamKiemKe,
                    DotKiemKe_Id: DotKiemKe_Id,
                    KhoaPhongHienTai: KhoaPhongHienTai
                });

                resolve({
                    errCode: 0,
                    errMessage: 'Thêm tài sản thành công'
                })
                //console.log('xacNhanThemTaiSan', KhoTaiSan_Id, tenTaiSan, nhapTenTaiSan, KhoQuanLy)
            }
        } catch (e) {
            reject(e)
        }
    })
}

let getAllDVT = () => {
    return new Promise(async (resolve, reject) => {
        try {

            const request = db.sqlhis2Connection.request();
            const getdata = await request.execute('[sp_QLPO_DANHMUC_DVT]');
            // Lấy dữ liệu từ recordset
            const data = getdata.recordset;
            //console.log('recordset', data)

            resolve(data)
        } catch (e) {
            reject(e)
        }
    })
}

let getAllNhanVien = () => {
    return new Promise(async (resolve, reject) => {
        try {

            const request = db.sqlConnection.request();
            const getdata = await request.execute('[sp_QLPO_DANHMUC_NHANVIEN]');
            // Lấy dữ liệu từ recordset
            const data = getdata.recordset;
            //console.log('recordset', data)

            resolve(data)
        } catch (e) {
            reject(e)
        }
    })
}

let getAllNguoiLap = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.sequelize.query('CALL sp_get_all_nguoilap',
                {
                    // replacements: { id: 2 },
                    raw: false
                }
            );
            resolve(data)
        } catch (e) {
            reject(e)
        }
    })
}

let getKeToanTruong = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.sequelize.query('CALL sp_get_all_ketoantruong',
                {
                    // replacements: { id: 2 },
                    raw: false
                }
            );
            resolve(data)
        } catch (e) {
            reject(e)
        }
    })
}

let getKeToanTaiSan = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.sequelize.query('CALL sp_get_all_ketoantaisan',
                {
                    // replacements: { id: 2 },
                    raw: false
                }
            );
            resolve(data)
        } catch (e) {
            reject(e)
        }
    })
}

let getGiamDoc = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.sequelize.query('CALL sp_get_all_giamdoc',
                {
                    // replacements: { id: 2 },
                    raw: false
                }
            );
            resolve(data)
        } catch (e) {
            reject(e)
        }
    })
}

let getAllNhanVienPhong = () => {
    return new Promise(async (resolve, reject) => {
        try {

            const request = db.sqlConnection.request();
            const getdata = await request.execute('[sp_QLPO_DANHMUC_NHANVIEN_PHONG]');
            // Lấy dữ liệu từ recordset
            const data = getdata.recordset;
            //console.log('recordset', data)

            resolve(data)
        } catch (e) {
            reject(e)
        }
    })
}

let getAllBV = () => {
    return new Promise(async (resolve, reject) => {
        try {

            const request = db.sqlhis2Connection.request();
            const getdata = await request.execute('[sp_QLPO_DANHMUC_BV]');
            // Lấy dữ liệu từ recordset
            const data = getdata.recordset;
            //console.log('recordset', data)

            resolve(data)
        } catch (e) {
            reject(e)
        }
    })
}

let getAllKho = () => {
    return new Promise(async (resolve, reject) => {
        try {

            const request = db.sqlhis2Connection.request();
            const getdata = await request.execute('[sp_QLPO_GETALL_KHO]');
            // Lấy dữ liệu từ recordset
            const data = getdata.recordset;
            //console.log('recordset', data)
            resolve(data)

        } catch (e) {
            reject(e)
        }
    })
}

let getAllKhoEdit = () => {
    return new Promise(async (resolve, reject) => {
        try {

            const request = db.sqlhis2Connection.request();
            const getdata = await request.execute('[sp_QLPO_GETALL_KHO]');
            // Lấy dữ liệu từ recordset
            const data = getdata.recordset;
            //console.log('recordset', data)
            resolve(data)

        } catch (e) {
            reject(e)
        }
    })
}

let getAllViTri = () => {
    return new Promise(async (resolve, reject) => {
        try {

            const request = db.sqlhis2Connection.request();
            const getdata = await request.execute('[sp_QLPO_GETALL_ViTri]');
            // Lấy dữ liệu từ recordset
            const data = getdata.recordset;
            //console.log('recordset', data)
            resolve(data)

        } catch (e) {
            reject(e)
        }
    })
}

let getAllTinhTrang = () => {
    return new Promise(async (resolve, reject) => {
        try {

            let data = await db.sequelize.query('CALL sp_get_all_tinhtrang',
                {
                    // replacements: { id: 2 },
                    raw: false
                }
            );
            resolve(data)

        } catch (e) {
            reject(e)
        }
    })
}

// let getAllKhoQL = (KhoTaiSan_Id) => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             let data = await db.sequelize.query('CALL sp_get_all_khoquanly(:KhoTaiSan_Id)',
//                 {
//                     replacements: { KhoTaiSan_Id: KhoTaiSan_Id },
//                     raw: false
//                 }
//             );
//             resolve(data);

//         } catch (e) {
//             reject(e)
//         }
//     })
// }

let getAllKhoQL = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.sequelize.query('CALL sp_get_all_khoquanly',
                {
                    //replacements: { KhoTaiSan_Id: KhoTaiSan_Id },
                    raw: false
                }
            );
            resolve(data);

        } catch (e) {
            reject(e)
        }
    })
}

let getAllKhoQLTK = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.sequelize.query('CALL sp_get_all_khoquanly_tiemkiem',
                {
                    //replacements: { KhoTaiSan_Id: KhoTaiSan_Id },
                    raw: false
                }
            );
            resolve(data);

        } catch (e) {
            reject(e)
        }
    })
}

let getAllPL = () => {
    return new Promise(async (resolve, reject) => {
        try {

            const request = db.sqlhis2Connection.request();
            const getdata = await request.execute('[sp_QLPO_DANHMUC_PHANLOAI]');
            // Lấy dữ liệu từ recordset
            const data = getdata.recordset;
            //console.log('recordset', data)

            resolve(data)
        } catch (e) {
            reject(e)
        }
    })
}

let getAllTGBH = () => {
    return new Promise(async (resolve, reject) => {
        try {

            const request = db.sqlhis2Connection.request();
            const getdata = await request.execute('[sp_QLPO_DANHMUC_TGBH]');
            // Lấy dữ liệu từ recordset
            const data = getdata.recordset;
            //console.log('recordset', data)

            resolve(data)
        } catch (e) {
            reject(e)
        }
    })
}

let getAllTGKH = () => {
    return new Promise(async (resolve, reject) => {
        try {

            const request = db.sqlhis2Connection.request();
            const getdata = await request.execute('[sp_QLPO_DANHMUC_TGKH]');
            // Lấy dữ liệu từ recordset
            const data = getdata.recordset;
            //console.log('recordset', data)

            resolve(data)
        } catch (e) {
            reject(e)
        }
    })
}

let editTaiSan = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            //console.log('data', data.ThoiGianMua)
            const request = db.sqlhis2Connection.request();
            request.input('MaTaiSan', data.MaTaiSan);
            request.input('MaTaiSanNew', data.MaTaiSanNew);
            request.input('Duoc_Id', data.Duoc_Id);
            request.input('TenDuoc_Id', data.TenDuoc_Id);
            request.input('TenHang', data.TenHang);
            request.input('Serial', data.Serial);
            request.input('DonViTinh_Id', data.DonViTinh_Id);
            request.input('Model', data.Model);
            request.input('PhanLoai_Id', data.PhanLoai_Id);
            request.input('ThoiGianBaoHanh_Id', data.ThoiGianBaoHanh_Id);
            request.input('ThoiGianKhauHao_Id', data.ThoiGianKhauHao_Id);
            request.input('BenhVien_Id', data.BenhVien_Id);
            request.input('HangSanXuat', data.HangSanXuat);
            request.input('Book', data.Book);
            request.input('Account', data.Account);
            request.input('SubAccount', data.SubAccount);
            request.input('BudgetOwner', data.BudgetOwner);
            request.input('Budget', data.Budget);
            request.input('Invoice', data.Invoice);
            request.input('Categories', data.Categories);
            request.input('NamSuDung', data.NamSuDung);
            request.input('ThoiGianMua', data.ThoiGianMua);
            request.input('ThoiGianTinhKhauHao', data.ThoiGianTinhKhauHao);
            // request.input('ThoiGianMua', new Date(`${data.ThoiGianMua}T00:00:00.000Z`).toISOString());
            // request.input('ThoiGianTinhKhauHao', new Date(`${data.ThoiGianTinhKhauHao}T00:00:00.000Z`).toISOString());
            request.input('Loai', data.Loai);
            request.input('GhiChu', data.GhiChu);
            request.input('NguoiCapNhap', data.UserId);
            const getdata = await request.execute('[sp_QLPO_UPDATE_TAISAN]');
            // // Lấy dữ liệu từ recordset
            // const data = getdata.recordset;

            resolve({
                errCode: 0,
                errMessage: 'Sửa thông tin thành công'
            });
        } catch (e) {
            console.log("Database error:", e);
            reject(e);
        }
    })
}

let newTaiSan = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const sql = require('mssql');
            const now = new Date();
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');

            // Tạo số ngẫu nhiên từ 1000 đến 9999
            const randomNum = Math.floor(Math.random() * 9000) + 1000;

            // Kết hợp lại thành chuỗi
            const MaTenDuoc = `${minutes}${seconds}${randomNum}`;
            //console.log('code', code)



            let data_user = await db.User.findOne({
                attributes: ['user_ehos_id'],
                where: {
                    id: data.UserId,
                },
                raw: true
            });

            const NguoiTao_Id = data_user.user_ehos_id;
            //console.log('User_Id', data)


            const request = db.sqlhis2Connection.request();
            request.input('MaTenDuoc', MaTenDuoc);
            request.input('NguoiTao_Id', NguoiTao_Id);
            request.input('MaTaiSan', data.MaTaiSan);
            request.input('MaTaiSanNew', data.MaTaiSanNew);
            //request.input('Duoc_Id', data.Duoc_Id);
            //request.input('TenDuoc_Id', data.TenDuoc_Id);
            request.input('TenHang', data.TenHang);
            request.input('Serial', data.Serial);
            request.input('DonViTinh_Id', data.DonViTinh_Id.DonViTinh_Id);
            request.input('Model', data.Model);
            request.input('PhanLoai_Id', data.PhanLoai_Id.PhanLoai_Id);
            request.input('ThoiGianBaoHanh_Id', data.ThoiGianBaoHanh_Id.ThoiGianBaoHanh_Id);
            request.input('ThoiGianKhauHao_Id', data.ThoiGianKhauHao_Id.ThoiGianKhauHao_Id);
            request.input('BenhVien_Id', data.BenhVien_Id.BenhVien_Id);
            request.input('HangSanXuat', data.HangSanXuat);
            request.input('Book', data.Book);
            request.input('Account', sql.Int, parseInt(data.Account, 10));
            request.input('SubAccount', sql.Int, parseInt(data.SubAccount, 10));
            request.input('BudgetOwner', data.BudgetOwner);
            request.input('Budget', data.Budget);
            request.input('Invoice', data.Invoice);
            request.input('Categories', data.Categories);
            request.input('NamSuDung', sql.Int, parseInt(data.NamSuDung, 10));
            request.input('Loai', data.Loai);
            request.input('GhiChu', data.GhiChu);
            request.input('ThoiGianMua', data.ThoiGianMua);
            request.input('ThoiGianTinhKhauHao', data.ThoiGianTinhKhauHao);

            const getdata = await request.execute('[sp_QLPO_ADD_TAISAN]');

            resolve({
                errCode: 0,
                errMessage: 'Tạo mới tài sản thành công'
            });
        } catch (e) {
            console.log("Database error:", e);
            reject(e);
        }
    })
}

const checkXoaTS = (Duoc_Id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const request = db.sqlhis2Connection.request();
            request.input('Duoc_Id', Duoc_Id);

            const getdata = await request.execute('[sp_QLPO_CHECK_DELETE_TAISAN]');
            const checkxoats = getdata.recordset;

            if (checkxoats.length === 0) {
                resolve({
                    errCode: 0,
                });
            } else {
                resolve({
                    errCode: 1,
                    errMessage: 'Tài sản đã phát sinh nhập NCC, không được xóa.',
                });
            }
        } catch (e) {
            reject(e)
        }
    });
}

let getAllCT = () => {
    return new Promise(async (resolve, reject) => {
        try {

            let data = await db.sequelize.query('CALL sp_get_all_ct',
                {
                    // replacements: { id: 2 },
                    raw: false
                }
            );
            resolve(data)
        } catch (e) {
            reject(e)
        }
    })
}

let getCheckAllCT = () => {
    return new Promise(async (resolve, reject) => {
        try {

            let data = await db.sequelize.query('CALL sp_get_check_all_ct',
                {
                    // replacements: { id: 2 },
                    raw: false
                }
            );
            resolve(data)
        } catch (e) {
            reject(e)
        }
    })
}

let getCheckAll = (machungtu) => {
    return new Promise(async (resolve, reject) => {
        try {

            let data = await db.sequelize.query('CALL sp_get_check_all(:machungtu)',
                {
                    replacements: { machungtu: machungtu },
                    raw: false
                }
            );
            //console.log('data', data)
            resolve(data)
        } catch (e) {
            reject(e)
        }
    })
}

let getAllLogChungTuHopDong = (nhacungcap_id) => {
    return new Promise(async (resolve, reject) => {
        try {

            let data = await db.sequelize.query('CALL sp_get_all_log_chungtu_hopdong(:nhacungcap_id)',
                {
                    replacements: { nhacungcap_id: nhacungcap_id },
                    raw: false
                }
            );
            resolve(data)
        } catch (e) {
            reject(e)
        }
    })
}

let getCheckAllLogChungTuHopDong = (nhacungcap_id) => {
    return new Promise(async (resolve, reject) => {
        try {

            let data = await db.sequelize.query('CALL sp_get_check_all_log_chungtu_hopdong(:nhacungcap_id)',
                {
                    replacements: { nhacungcap_id: nhacungcap_id },
                    raw: false
                }
            );
            resolve(data)
        } catch (e) {
            reject(e)
        }
    })
}

let getAllLogChungTuPO = (sopo) => {
    return new Promise(async (resolve, reject) => {
        try {

            let data = await db.sequelize.query('CALL sp_get_all_log_chungtu_po(:sopo)',
                {
                    replacements: { sopo: sopo },
                    raw: false
                }
            );
            resolve(data)
        } catch (e) {
            reject(e)
        }
    })
}

let getCheckAllLogChungTuPO = (sopo) => {
    return new Promise(async (resolve, reject) => {
        try {

            let data = await db.sequelize.query('CALL sp_get_check_all_log_chungtu_po(:sopo)',
                {
                    replacements: { sopo: sopo },
                    raw: false
                }
            );
            resolve(data)
        } catch (e) {
            reject(e)
        }
    })
}

let getAllLogPOPR = (sopr) => {
    return new Promise(async (resolve, reject) => {
        try {

            let data = await db.sequelize.query('CALL sp_get_all_log_po_pr(:sopr)',
                {
                    replacements: { sopr: sopr },
                    raw: false
                }
            );
            resolve(data)
        } catch (e) {
            reject(e)
        }
    })
}

let getLogPOPR = (sopr) => {
    return new Promise(async (resolve, reject) => {
        try {

            let data = await db.sequelize.query('CALL sp_get_all_log_popr(:sopr)',
                {
                    replacements: { sopr: sopr },
                    raw: false
                }
            );
            resolve(data)
        } catch (e) {
            reject(e)
        }
    })
}

let getCheckHopDong = (nhacungcap_id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let check_hd = await db.Data_HD.findAll({
                //attributes: ['SoBenhAn'],
                where: {
                    nhacungcap_id: nhacungcap_id,
                    dacheckvoict: 1,
                },
                raw: true
            });
            //console.log('check_hd', check_hd)
            if (check_hd.length > 0) {
                resolve({ errCode: 1, data: check_hd, errMessage: 'Hợp động đã phát sinh chứng từ kiểm tra. Không thể xóa' });
            } else {
                resolve({ errCode: 0, data: check_hd, errMessage: 'Khóa button thanh toán thành công' });
            }
        } catch (e) {
            reject(e)
        }
    })
}

let getCheckPO = (sopo) => {
    return new Promise(async (resolve, reject) => {
        try {
            let check_po = await db.sequelize.query('CALL sp_check_po(:sopo)',
                {
                    replacements: { sopo: sopo },
                    raw: false
                }
            );
            //console.log('check_hd', check_hd)
            if (check_po.length > 0) {
                resolve({ errCode: 1, data: check_po, errMessage: 'PO đã phát sinh chứng từ kiểm tra. Không thể xóa' });
            } else {
                resolve({ errCode: 0, data: check_po, errMessage: 'Khóa button thanh toán thành công' });
            }
        } catch (e) {
            reject(e)
        }
    })
}

let getCheckEditMaTaiSanPO = (sopo, mataisan) => {
    return new Promise(async (resolve, reject) => {
        try {
            let check_po = await db.sequelize.query('CALL sp_check_editpo(:sopo,:mataisan)',
                {
                    replacements: { sopo: sopo, mataisan: mataisan },
                    raw: false
                }
            );
            //console.log('check_po', check_po.length)
            if (check_po.length > 0) {
                resolve({ errCode: 0, data: check_po, errMessage: 'Khóa button thanh toán thành công' });
            } else {
                resolve({ errCode: 1, data: check_po, errMessage: 'PO đã phát sinh chứng từ kiểm tra. Không thể xóa' });
            }
        } catch (e) {
            reject(e)
        }
    })
}

let getCheckEditSoLuongPO = (sopo, mataisan) => {
    return new Promise(async (resolve, reject) => {
        try {
            let check_po = await db.sequelize.query('CALL sp_check_editslpo(:sopo,:mataisan)',
                {
                    replacements: { sopo: sopo, mataisan: mataisan },
                    raw: false
                }
            );
            //console.log('check_po', check_po.length)
            if (check_po.length > 0) {
                resolve({ errCode: 0, data: check_po, errMessage: 'Khóa button thanh toán thành công' });
            } else {
                resolve({ errCode: 1, data: check_po, errMessage: 'PO đã phát sinh chứng từ kiểm tra. Không thể xóa' });
            }
        } catch (e) {
            reject(e)
        }
    })
}

let getCheckEditMaTaiSanPR = (sopr, mataisan) => {
    return new Promise(async (resolve, reject) => {
        try {
            let check_po = await db.sequelize.query('CALL sp_check_editpr(:sopr,:mataisan)',
                {
                    replacements: { sopr: sopr, mataisan: mataisan },
                    raw: false
                }
            );
            //console.log('check_hd', check_hd)
            if (check_po.length > 0) {
                resolve({ errCode: 0, data: check_po, errMessage: 'Khóa button thanh toán thành công' });
            } else {
                resolve({ errCode: 1, data: check_po, errMessage: 'PO đã phát sinh chứng từ kiểm tra. Không thể xóa' });
            }
        } catch (e) {
            reject(e)
        }
    })
}

let getCheckPR = (sopr) => {
    return new Promise(async (resolve, reject) => {
        try {
            let check_pr = await db.Data_PR.findAll({
                //attributes: ['SoBenhAn'],
                where: {
                    sopr: sopr,
                    dacheckvoipo: 1,
                },
                raw: true
            });
            //console.log('check_hd', check_hd)
            if (check_pr.length > 0) {
                resolve({ errCode: 1, data: check_pr, errMessage: 'PR đã phát sinh chứng từ kiểm tra. Không thể xóa' });
            } else {
                resolve({ errCode: 0, data: check_pr, errMessage: 'Khóa button thanh toán thành công' });
            }
        } catch (e) {
            reject(e)
        }
    })
}

let getAllHD = () => {
    return new Promise(async (resolve, reject) => {
        try {

            let data = await db.sequelize.query('CALL sp_get_all_hd',
                {
                    // replacements: { id: 2 },
                    raw: false
                }
            );
            resolve(data)
        } catch (e) {
            reject(e)
        }
    })
}

let getAllPR = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.sequelize.query('CALL sp_get_all_pr',
                {
                    // replacements: { id: 2 },
                    raw: false
                }
            );
            resolve(data)
        } catch (e) {
            reject(e)
        }
    })
}

let importPO = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const currentTime = new Date();
            // const convertedData = data.excelData.slice(1).map((item) => {
            const convertedData = data.excelData
                .slice(1) // Bỏ qua phần tử đầu tiên (header)
                .filter(item => Object.keys(item).length > 0 && Object.values(item).some(value => value)) // Lọc các đối tượng rỗng
                .map((item) => {
                    try {
                        // Hàm chuyển đổi chuỗi ngày '30/12/2024' thành đối tượng Date
                        function convertDate(dateString) {
                            const [day, month, year] = dateString.split('/');
                            return new Date(year, month - 1, day);
                        }

                        // Loại bỏ ký tự xuống dòng \r\n trong tất cả các trường dạng chuỗi của item
                        Object.keys(item).forEach(key => {
                            if (typeof item[key] === 'string') {
                                item[key] = item[key].replace(/\r\n/g, ''); // Xóa ký tự xuống dòng \r\n
                            }
                        });
                        return {
                            mataisan: item.mataisan,
                            tentaisan: item.tentaisan,
                            donvitinh: item.donvitinh,
                            soluongpo: item.soluongpo,
                            dongiapo: item.dongiapo,
                            vat: item.vat * 100,
                            dongiapovat: item.dongiapo + (item.dongiapo * item.vat),
                            thanhtien: item.thanhtien,
                            //thanhtienvat: item.thanhtienvat,
                            thanhtienvat: (item.dongiapo + (item.dongiapo * item.vat)) * item.soluongpo,
                            sopr: item.sopr,
                            sopo: item.sopo,
                            nguoitao_id: data.user_id,
                            ngaytao: currentTime,
                            ngaypo: convertDate(item.ngaypo),
                            checkma: 0,
                            checkten: 0,
                        };
                    } catch (error) {
                        // Nếu xảy ra lỗi, gửi thông báo lỗi về React
                        console.error("Error converting ngaypo 1:", error.message);
                        //return { error: error.message };
                        resolve({
                            errCode: 1,
                            errMessage: 'Không thể import file, vui lòng kiểm tra lại file'
                        })
                    }
                });

            //console.log('convertedData', convertedData)

            // const sumByMataisan = convertedData.reduce((acc, item) => {
            //     // Kiểm tra nếu đã có 'mataisan' này trong accumulator
            //     if (acc[item.mataisan]) {
            //         acc[item.mataisan].soluongpo += item.soluongpo; // Cộng dồn soluongpo
            //     } else {
            //         // Nếu chưa có, thêm vào accumulator với giá trị ban đầu
            //         acc[item.mataisan] = { ...item }; // Sao chép toàn bộ thuộc tính của item vào acc
            //     }
            //     return acc;
            // }, {});

            // // Chuyển từ object trở lại thành mảng
            // const mergedData = Object.values(sumByMataisan);

            // console.log('mergedData', mergedData);

            // Lấy ra tất cả sopo và mataisan từ mảng đã lọc
            const supplierAndAssets = convertedData.map(item => ({
                sopo: item.sopo,
                mataisan: item.mataisan
            }));


            //  // Lấy ra tất cả sopo và mataisan từ mảng mergedData
            //  const suppliermergedData= mergedData.map(item => ({
            //     sopo: item.sopo,
            //     mataisan: item.mataisan
            // }));

            let dataPO_OLD = [];
            // Duyệt qua từng cặp sopo và mataisan để tìm kiếm trong DB
            for (const { sopo, mataisan } of supplierAndAssets) {
                try {
                    // Tìm kiếm trong DB theo sopo và mataisan
                    let data = await db.Data_PO.findOne({
                        where: {
                            sopo: sopo,
                            mataisan: mataisan
                        },
                        raw: true
                    });

                    if (data) {
                        dataPO_OLD.push(data);
                    }
                } catch (error) {
                    console.error(`Error finding data for ${sopo} - ${mataisan}:`, error);
                }
            }

            if (dataPO_OLD.length > 0) {
                // INSERT BỔ SUNG
                // Tìm kiếm các đối tượng trong file insert có sopo và mataisan khác với data hd để insert mới
                try {
                    const filteredData = convertedData.filter((newData) => {
                        // Kiểm tra xem có đối tượng nào trong dataPO_OLD khớp với sopo và mataisan không
                        const isMatching = dataPO_OLD.some((oldData) =>
                            oldData.sopo === newData.sopo && oldData.mataisan === newData.mataisan
                        );
                        // Nếu không khớp, thêm đối tượng này vào mảng kết quả
                        return !isMatching;
                    });

                    //console.log('filteredData', filteredData)

                    // Lặp qua từng phần tử trong mảng filteredData để insert dữ liệu mới
                    for (const item of filteredData) {
                        try {
                            // function convertDate(dateString) {
                            //     const [day, month, year] = dateString.split('/');
                            //     return new Date(year, month - 1, day);
                            // }
                            // const ngaypo_convert = convertDate(item.ngaypo);
                            await db.Data_PO.create({
                                mataisan: item.mataisan,
                                tentaisan: item.tentaisan,
                                donvitinh: item.donvitinh,
                                soluongpo: item.soluongpo,
                                dongiapo: item.dongiapo,
                                vat: item.vat,
                                dongiapovat: item.dongiapo + (item.dongiapo * item.vat),
                                thanhtien: item.thanhtien,
                                thanhtienvat: item.thanhtienvat,
                                sopr: item.sopr,
                                sopo: item.sopo,
                                nguoitao_id: item.nguoitao_id,
                                ngaytao: currentTime,
                                ngaypo: item.ngaypo,
                                checkma: 0,
                                checkten: 0,
                            });
                        } catch (error) {
                            // Nếu xảy ra lỗi, gửi thông báo lỗi về React
                            console.error("Error converting ngaypo:", error.message);
                            //return { error: error.message };
                            resolve({
                                errCode: 1,
                                errMessage: 'Không thể import file, vui lòng kiểm tra lại file'
                            })
                        }
                    }
                } catch (error) {
                    console.error(error);
                    return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
                }
            }
            else {
                // Insert dữ liệu vào DB nếu file import không tồn tại sopo và mataisan đã import trước đó
                for (const item of convertedData) {
                    try {
                        await db.Data_PO.create(item);
                    } catch (error) {
                        console.error('Error inserting data:', error);
                    }
                }
                // resolve({
                //     errCode: 0,
                //     errMessage: 'Import PO thành công'
                // })
            }
            const request = db.sqlhis2Connection.request();
            const getdata = await request.execute('[sp_QLPO_DANHMUC_VPP]');
            // Lấy dữ liệu từ recordset
            const recordset = getdata.recordset;
            const { Op } = require('sequelize');
            let check_mataisan_dm = await db.Data_PO.findAll({
                where: {
                    [Op.or]: [ // Điều kiện "hoặc"
                        { checkma: 0 },
                        { checkten: 0 }
                    ]
                },
                raw: true
            });

            // Hàm dò tìm và cập nhật checkmataisan
            const updateCheckMataisan = (recordset, check_mataisan_dm) => {
                // Dò tìm từng phần tử trong check_mataisan_dm
                check_mataisan_dm.forEach((item) => {
                    // Tìm trong recordset xem có phần tử nào khớp với mataisan và tentaisan
                    const foundByMa = recordset.find((record) =>
                        record.MaVPP === item.mataisan
                    );

                    const foundByTen = recordset.find((record) =>
                        record.TenVPP === item.tentaisan
                    );

                    // Nếu tìm thấy khớp với MaVPP, cập nhật checkma = 1, ngược lại = 0
                    item.checkma = foundByMa ? 1 : 0;

                    // Nếu tìm thấy khớp với TenVPP, cập nhật checkten = 1, ngược lại = 0
                    item.checkten = foundByTen ? 1 : 0;
                });
                return check_mataisan_dm;

            };

            // Gọi hàm updateCheckMataisan
            const updatedCheckMataisan = updateCheckMataisan(recordset, check_mataisan_dm);
            if (updatedCheckMataisan.length > 0) {

                for (const item of updatedCheckMataisan) {
                    try {
                        // Tìm bản ghi trong Data_HD theo id
                        let data = await db.Data_PO.findOne({ where: { id: item.id }, raw: false });

                        if (data) {
                            //data.checkmataisan = item.checkmataisan;
                            data.checkma = item.checkma;
                            data.checkten = item.checkten;
                            // Lưu thay đổi
                            await data.save();
                        }
                    } catch (error) {
                        console.error(`Lỗi khi cập nhật PO có id: ${item.id}`, error);
                    }
                }
            }

            resolve({
                errCode: 0,
                errMessage: 'Import PO thành công'
            })
        } catch (e) {
            reject(e)
        }
    })
}



let importHD = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const currentTime = new Date();
            // Lọc bỏ hàng đầu tiên (tiêu đề) và trả về mảng các đối tượng đã được chuyển đổi ngày
            //const convertedData = data.excelData.slice(1).map((item) => {
            const convertedData = data.excelData
                .slice(1) // Bỏ qua phần tử đầu tiên (header)
                .filter(item => Object.keys(item).length > 0 && Object.values(item).some(value => value)) // Lọc các đối tượng rỗng
                .map((item) => {
                    // Hàm chuyển đổi chuỗi ngày '30/12/2024' thành đối tượng Date
                    try {
                        function convertDate(dateString) {
                            const [day, month, year] = dateString.split('/');
                            return new Date(year, month - 1, day);
                        }

                        // Loại bỏ ký tự xuống dòng \r\n trong tất cả các trường dạng chuỗi của item
                        Object.keys(item).forEach(key => {
                            if (typeof item[key] === 'string') {
                                item[key] = item[key].replace(/\r\n/g, ''); // Xóa ký tự xuống dòng \r\n
                            }
                        });
                        return {
                            nhacungcap_id: item.nhacungcap_id,
                            tennhacungcap: item.tennhacungcap,
                            mataisan: item.mataisan,
                            tentaisan: item.tentaisan,
                            donvitinh: item.donvitinh,
                            dongiahd: item.dongiahd,
                            vat: item.vat * 100,
                            dongiahdvat: item.dongiahdvat,
                            rn: item.rn,
                            sohopdong: item.sohopdong,
                            ngayhieuluc: convertDate(item.ngayhieuluc),
                            ngayketthuc: convertDate(item.ngayketthuc),
                            //ngayhieuluc: item.ngayhieuluc instanceof Date ? item.ngayhieuluc : new Date(item.ngayhieuluc),
                            //ngayketthuc: item.ngayketthuc instanceof Date ? item.ngayketthuc : new Date(item.ngayketthuc),
                            nguoitao_id: data.user_id,
                            ngaytao: currentTime,
                            taitro: item.taitro,
                            tinhtaitro: item.tinhtaitro,
                            checkma: 0,
                            checkten: 0,
                            checknhacungcap: 0,
                        };
                    } catch (error) {
                        // Nếu xảy ra lỗi, gửi thông báo lỗi về React
                        console.error("Error converting ngaypo:", error.message);
                        //return { error: error.message };
                        resolve({
                            errCode: 1,
                            errMessage: 'Không thể import file, vui lòng kiểm tra lại file'
                        })
                    }
                });

            // Lấy ra tất cả nhacungcap_id và mataisan từ mảng đã lọc
            const supplierAndAssets = convertedData.map(item => ({
                nhacungcap_id: item.nhacungcap_id,
                mataisan: item.mataisan
            }));

            let dataHD_OLD = [];
            // Duyệt qua từng cặp nhacungcap_id và mataisan để tìm kiếm trong DB
            for (const { nhacungcap_id, mataisan } of supplierAndAssets) {
                try {
                    // Tìm kiếm trong DB theo nhacungcap_id và mataisan
                    let data = await db.Data_HD.findOne({
                        where: {
                            nhacungcap_id: nhacungcap_id,
                            mataisan: mataisan
                        },
                        raw: true
                    });

                    if (data) {
                        dataHD_OLD.push(data);
                    }
                } catch (error) {
                    console.error(`Error finding data for ${nhacungcap_id} - ${mataisan}:`, error);
                }
            }
            if (dataHD_OLD.length > 0) {
                // INSERT BỔ SUNG
                // Tìm kiếm các đối tượng trong file insert có nhacungcap_id và mataisan khác với data hd để insert mới
                try {
                    const filteredData = convertedData.filter((newData) => {
                        // Kiểm tra xem có đối tượng nào trong dataHD_OLD khớp với nhacungcap_id và mataisan không
                        const isMatching = dataHD_OLD.some((oldData) =>
                            oldData.nhacungcap_id === newData.nhacungcap_id && oldData.mataisan === newData.mataisan
                        );
                        // Nếu không khớp, thêm đối tượng này vào mảng kết quả
                        return !isMatching;
                    });

                    // Lặp qua từng phần tử trong mảng filteredData để insert dữ liệu mới
                    for (const item of filteredData) {
                        try {
                            // // Hàm chuyển đổi chuỗi ngày '30/12/2024' thành đối tượng Date
                            // function convertDate(dateString) {
                            //     const [day, month, year] = dateString.split('/');
                            //     return new Date(year, month - 1, day);
                            // }
                            // // // Chuyển đổi ngày nếu cần thiết
                            // const ngayhieuluc_convert = convertDate(item.ngayhieuluc);
                            // const ngayketthuc_convert = convertDate(item.ngayketthuc);
                            // Kiểm tra nếu `ngayhieuluc` và `ngayketthuc` đã là đối tượng Date
                            //const ngayhieuluc_convert = item.ngayhieuluc instanceof Date ? item.ngayhieuluc : new Date(item.ngayhieuluc);
                            //const ngayketthuc_convert = item.ngayketthuc instanceof Date ? item.ngayketthuc : new Date(item.ngayketthuc);

                            // Thực hiện insert vào database
                            await db.Data_HD.create({
                                nhacungcap_id: item.nhacungcap_id,
                                tennhacungcap: item.tennhacungcap,
                                mataisan: item.mataisan,
                                tentaisan: item.tentaisan,
                                donvitinh: item.donvitinh,
                                dongiahd: item.dongiahd,
                                vat: item.vat * 100, // Nhân giá trị VAT với 100 nếu cần
                                dongiahdvat: item.dongiahdvat,
                                rn: item.rn,
                                sohopdong: item.sohopdong,
                                ngayhieuluc: item.ngayhieuluc,
                                ngayketthuc: item.ngayketthuc,
                                nguoitao_id: item.nguoitao_id,
                                ngaytao: currentTime,
                                taitro: item.taitro,
                                tinhtaitro: item.tinhtaitro,
                                checkma: 0,
                                checkten: 0,
                                checknhacungcap: 0,
                            });
                        } catch (error) {
                            // Nếu xảy ra lỗi, gửi thông báo lỗi về React
                            console.error("Error converting ngaypo:", error.message);
                            resolve({
                                errCode: 1,
                                errMessage: 'Không thể import file, vui lòng kiểm tra lại file'
                            })
                        }
                    }
                    // resolve({
                    //     errCode: 0,
                    //     errMessage: 'Import hợp đồng thành công'
                    // })
                } catch (error) {
                    console.error(error);
                    return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
                }
            } else {
                // Insert dữ liệu vào DB nếu file import không tồn tại nhacungcap và mataisan đã import trước đó
                for (const item of convertedData) {
                    try {
                        await db.Data_HD.create(item); // Thực hiện insert vào DB
                    } catch (error) {
                        console.error('Error inserting data:', error); // Log lỗi nếu insert thất bại
                    }
                }
                // resolve({
                //     errCode: 0,
                //     errMessage: 'Import hợp đồng thành công'
                // })
            }

            const request = db.sqlhis2Connection.request();
            const getdata = await request.execute('[sp_QLPO_DANHMUC_VPP]');
            // Lấy dữ liệu từ recordset
            const recordset = getdata.recordset;
            const { Op } = require('sequelize');
            let check_mataisan_dm = await db.Data_HD.findAll({
                where: {
                    [Op.or]: [ // Điều kiện "hoặc"
                        { checkma: 0 },
                        { checkten: 0 }
                    ]
                },
                raw: true
            });

            // Hàm dò tìm và cập nhật checkmataisan
            const updateCheckMataisan = (recordset, check_mataisan_dm) => {
                // Dò tìm từng phần tử trong check_mataisan_dm
                check_mataisan_dm.forEach((item) => {
                    // Tìm trong recordset xem có phần tử nào khớp với mataisan và tentaisan
                    const foundByMa = recordset.find((record) =>
                        record.MaVPP === item.mataisan
                    );

                    const foundByTen = recordset.find((record) =>
                        record.TenVPP === item.tentaisan
                    );

                    // Nếu tìm thấy khớp với MaVPP, cập nhật checkma = 1, ngược lại = 0
                    item.checkma = foundByMa ? 1 : 0;

                    // Nếu tìm thấy khớp với TenVPP, cập nhật checkten = 1, ngược lại = 0
                    item.checkten = foundByTen ? 1 : 0;
                });
                return check_mataisan_dm;

            };

            // Gọi hàm updateCheckMataisan
            const updatedCheckMataisan = updateCheckMataisan(recordset, check_mataisan_dm);
            if (updatedCheckMataisan.length > 0) {

                for (const item of updatedCheckMataisan) {
                    try {
                        // Tìm bản ghi trong Data_HD theo id
                        let data = await db.Data_HD.findOne({ where: { id: item.id }, raw: false });

                        if (data) {
                            //data.checkmataisan = item.checkmataisan;
                            data.checkma = item.checkma;
                            data.checkten = item.checkten;
                            // Lưu thay đổi
                            await data.save();
                        }
                    } catch (error) {
                        console.error(`Lỗi khi cập nhật PO có id: ${item.id}`, error);
                    }
                }
            }

            // Xử  lý tìm xem file import NCC có trùng với ncc dm hay không để cập nhập trạng thái
            const requestncc = db.sqlhis2Connection.request();
            const getdata_ncc = await requestncc.execute('[sp_QLPO_DANHMUC_NCC]');
            // Lấy dữ liệu từ recordset
            const recordsetncc = getdata_ncc.recordset;
            //console.log('recordset_ncc', recordset_ncc)
            //console.log('convert', convertedData)

            let check_ncc_dm = await db.Data_HD.findAll({
                where: { checknhacungcap: 0 },
                raw: true
            });

            // Hàm dò tìm và cập nhật checkmataisan
            const updateCheckNCC = (recordsetncc, check_ncc_dm) => {
                // Dò tìm từng phần tử trong check_mataisan_dm
                check_ncc_dm.forEach((item) => {
                    // Tìm trong recordset xem có phần tử nào khớp với mataisan và tentaisan
                    const foundByNcc = recordsetncc.find((record) =>
                        record.nhacungcap_id === item.nhacungcap_id
                    );
                    // Nếu tìm thấy khớp với TenVPP, cập nhật checkten = 1, ngược lại = 0
                    item.checknhacungcap = foundByNcc ? 1 : 0;
                });
                return check_ncc_dm;
            };

            // Gọi hàm updateCheckNCC
            const updatedCheckNcc = updateCheckNCC(recordsetncc, check_ncc_dm);
            //console.log('updatedCheckNcc', updatedCheckNcc)
            if (updatedCheckNcc.length > 0) {

                for (const item of updatedCheckNcc) {
                    try {
                        // Tìm bản ghi trong Data_HD theo id
                        let data = await db.Data_HD.findOne({ where: { id: item.id }, raw: false });
                        if (data) {
                            data.checknhacungcap = item.checknhacungcap;
                            // Lưu thay đổi
                            await data.save();
                        }
                    } catch (error) {
                        console.error(`Lỗi khi cập nhật PO có id: ${item.id}`, error);
                    }
                }
            }

            resolve({
                errCode: 0,
                errMessage: 'Import hợp đồng thành công'
            })

        } catch (e) {
            reject(e)
        }
    })
}


let importPR = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const currentTime = new Date();

            // Lọc bỏ hàng đầu tiên (tiêu đề) và trả về mảng các đối tượng đã được chuyển đổi ngày
            //const convertedData = data.excelData.slice(1).map((item) => {
            const convertedData = data.excelData
                .slice(1) // Bỏ qua phần tử đầu tiên (header)
                .filter(item => Object.keys(item).length > 0 && Object.values(item).some(value => value)) // Lọc các đối tượng rỗng
                .map((item) => {
                    try {
                        // Hàm chuyển đổi chuỗi ngày '30/12/2024' thành đối tượng Date
                        function convertDate(dateString) {
                            const [day, month, year] = dateString.split('/');
                            return new Date(year, month - 1, day);
                        }

                        // Loại bỏ ký tự xuống dòng \r\n trong tất cả các trường dạng chuỗi của item
                        Object.keys(item).forEach(key => {
                            if (typeof item[key] === 'string') {
                                item[key] = item[key].replace(/\r\n/g, ''); // Xóa ký tự xuống dòng \r\n
                            }
                        });
                        return {
                            mataisan: item.mataisan,
                            tentaisan: item.tentaisan,
                            donvitinh: item.donvitinh,
                            soluongpr: item.soluongpr,
                            dongiaprvat: item.dongiaprvat,
                            thanhtienprvat: item.dongiaprvat * item.soluongpr,
                            ngaycanhang: convertDate(item.ngaycanhang),
                            //ngaycanhang: item.ngaycanhang instanceof Date ? item.ngaycanhang : new Date(item.ngaycanhang),
                            ghichu: item.ghichu,
                            sopr: item.sopr,
                            nguoitao_id: data.user_id,
                            ngaytao: currentTime,
                            checkma: 0,
                            checkten: 0,
                        };
                    } catch (error) {
                        // Nếu xảy ra lỗi, gửi thông báo lỗi về React
                        console.error("Error converting ngaypo:", error.message);
                        resolve({
                            errCode: 1,
                            errMessage: 'Không thể import file, vui lòng kiểm tra lại file'
                        })
                    }
                });

            // Lấy ra tất cả sopo và mataisan từ mảng đã lọc
            const supplierAndAssets = convertedData.map(item => ({
                sopr: item.sopr,
                mataisan: item.mataisan
            }));

            let dataPR_OLD = [];
            // Duyệt qua từng cặp nhacungcap_id và mataisan để tìm kiếm trong DB
            for (const { sopr, mataisan } of supplierAndAssets) {
                try {
                    // Tìm kiếm trong DB theo nhacungcap_id và mataisan
                    let data = await db.Data_PR.findOne({
                        where: {
                            sopr: sopr,
                            mataisan: mataisan
                        },
                        raw: true
                    });

                    if (data) {
                        dataPR_OLD.push(data);
                    }
                } catch (error) {
                    console.error(`Error finding data for ${sopr} - ${mataisan}:`, error);
                }
            }

            if (dataPR_OLD.length > 0) {
                // INSERT BỔ SUNG
                // Tìm kiếm các đối tượng trong file insert có nhacungcap_id và mataisan khác với data hd để insert mới
                try {
                    const filteredData = convertedData.filter((newData) => {
                        // Kiểm tra xem có đối tượng nào trong dataHD_OLD khớp với nhacungcap_id và mataisan không
                        const isMatching = dataPR_OLD.some((oldData) =>
                            oldData.sopr === newData.sopr && oldData.mataisan === newData.mataisan
                        );
                        // Nếu không khớp, thêm đối tượng này vào mảng kết quả
                        return !isMatching;
                    });

                    // Lặp qua từng phần tử trong mảng filteredData để insert dữ liệu mới
                    for (const item of filteredData) {
                        try {
                            // // Hàm chuyển đổi chuỗi ngày '30/12/2024' thành đối tượng Date
                            // function convertDate(dateString) {
                            //     const [day, month, year] = dateString.split('/');
                            //     return new Date(year, month - 1, day);
                            // }
                            // // // Chuyển đổi ngày nếu cần thiết
                            // const ngaycanhang_convert = convertDate(item.ngayhieuluc);
                            // const ngayketthuc_convert = convertDate(item.ngayketthuc);
                            // Kiểm tra nếu `ngayhieuluc` và `ngayketthuc` đã là đối tượng Date
                            //const ngaycanhang_convert = item.ngaycanhang instanceof Date ? item.ngaycanhang : new Date(item.ngaycanhang);

                            // Thực hiện insert vào database
                            await db.Data_PR.create({
                                mataisan: item.mataisan,
                                tentaisan: item.tentaisan,
                                donvitinh: item.donvitinh,
                                soluongpr: item.soluongpr,
                                dongiaprvat: item.dongiaprvat,
                                thanhtienprvat: item.dongiaprvat * item.soluongpr,
                                ngaycanhang: item.ngaycanhang,
                                ghichu: item.ghichu,
                                sopr: item.sopr,
                                nguoitao_id: item.nguoitao_id,
                                ngaytao: currentTime,
                                checkma: 0,
                                checkten: 0,
                            });
                        } catch (error) {
                            // Nếu xảy ra lỗi, gửi thông báo lỗi về React
                            console.error("Error converting ngaypo:", error.message);
                            resolve({
                                errCode: 1,
                                errMessage: 'Không thể import file, vui lòng kiểm tra lại file'
                            })
                        }
                    }
                    // resolve({
                    //     errCode: 0,
                    //     errMessage: 'Import PR thành công'
                    // })
                } catch (error) {
                    console.error(error);
                    return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
                }
            } else {
                // Insert dữ liệu vào DB nếu file import không tồn tại sopr và mataisan đã import trước đó
                for (const item of convertedData) {
                    try {
                        await db.Data_PR.create(item); // Thực hiện insert vào DB
                    } catch (error) {
                        console.error('Error inserting data:', error); // Log lỗi nếu insert thất bại
                    }
                }
                // resolve({
                //     errCode: 0,
                //     errMessage: 'Import PR thành công'
                // })
            }

            const request = db.sqlhis2Connection.request();
            const getdata = await request.execute('[sp_QLPO_DANHMUC_VPP]');
            // Lấy dữ liệu từ recordset
            const recordset = getdata.recordset;
            const { Op } = require('sequelize');
            let check_mataisan_dm = await db.Data_PR.findAll({
                // where: {
                //     checkma: 0,
                //     checkten: 0,
                // },
                where: {
                    [Op.or]: [ // Điều kiện "hoặc"
                        { checkma: 0 },
                        { checkten: 0 }
                    ]
                },
                raw: true
            });

            //console.log('check_mataisan_dm', check_mataisan_dm)

            // Hàm dò tìm và cập nhật checkmataisan
            const updateCheckMataisan = (recordset, check_mataisan_dm) => {
                // Dò tìm từng phần tử trong check_mataisan_dm
                check_mataisan_dm.forEach((item) => {
                    // Tìm trong recordset xem có phần tử nào khớp với mataisan và tentaisan
                    const foundByMa = recordset.find((record) =>
                        record.MaVPP === item.mataisan
                    );

                    const foundByTen = recordset.find((record) =>
                        record.TenVPP === item.tentaisan
                    );

                    // Nếu tìm thấy khớp với MaVPP, cập nhật checkma = 1, ngược lại = 0
                    item.checkma = foundByMa ? 1 : 0;

                    // Nếu tìm thấy khớp với TenVPP, cập nhật checkten = 1, ngược lại = 0
                    item.checkten = foundByTen ? 1 : 0;
                });
                return check_mataisan_dm;

            };

            // Gọi hàm updateCheckMataisan
            const updatedCheckMataisan = updateCheckMataisan(recordset, check_mataisan_dm);
            if (updatedCheckMataisan.length > 0) {

                for (const item of updatedCheckMataisan) {
                    try {
                        // Tìm bản ghi trong Data_HD theo id
                        let data = await db.Data_PR.findOne({ where: { id: item.id }, raw: false });

                        if (data) {
                            //data.checkmataisan = item.checkmataisan;
                            data.checkma = item.checkma;
                            data.checkten = item.checkten;
                            // Lưu thay đổi
                            await data.save();
                        }
                    } catch (error) {
                        console.error(`Lỗi khi cập nhật PO có id: ${item.id}`, error);
                    }
                }
            }

            resolve({
                errCode: 0,
                errMessage: 'Import PR thành công'
            })
        } catch (e) {
            reject(e)
        }
    })
}

let getSoPO = (soPO, UserId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const ngaytao = new Date();
            const request = db.sqlhis2Connection.request();

            let datapo = await db.Data_PO.findAll({
                //attributes: ['SoBenhAn'],
                where: {
                    sopo: soPO,
                },
                raw: true
            });

            const sopr = [...new Set(datapo.map(item => item.sopr))];
            //console.log('uniqueSopr', sopr);
            //const sopr = datapo[0];

            let check_log_po_pr = await db.Data_Po_Pr_Log.findAll({
                //attributes: ['SoBenhAn'],
                where: {
                    sopo: soPO,
                },
                raw: true
            });

            if (check_log_po_pr.length > 0) {
                for (const item of check_log_po_pr) {
                    try {
                        // Tìm bản ghi trong Data_HD theo id
                        let data = await db.Data_PR.findOne({ where: { id: item.id_data_pr }, raw: false });

                        if (data) {
                            data.soluongpo = data.soluongpo - item.soluongpo;
                            data.tongsoluongpo = data.tongsoluongpo - item.soluongpo;
                            // Lưu thay đổi
                            await data.save();
                        }
                    } catch (error) {
                        console.error(`Lỗi khi cập nhật PO có id: ${item.id}`, error);
                    }
                }
            }

            if (datapo.length > 0) {
                const { Op } = require('sequelize');
                let datapr = await db.Data_PR.findAll({
                    //attributes: ['SoBenhAn'],
                    where: {
                        //sopr: sopr.sopr,
                        sopr: {
                            [Op.in]: sopr  // Tìm tất cả các bản ghi có 'sopr' nằm trong mảng sopr
                        }
                    },
                    raw: true
                });
                // Vòng lặp tìm các phần tử trùng khớp giữa datapr và datapo
                datapr = datapr.map(prItem => {
                    const recordItem = datapo.find(
                        record =>
                            record.sopr === prItem.sopr && record.mataisan === prItem.mataisan
                    );

                    if (recordItem) {
                        prItem.tongsoluongpo = prItem.tongsoluongpo !== null ? prItem.tongsoluongpo : 0;
                        // Tính toán sự chênh lệch
                        prItem.soluongpo = (recordItem.soluongpo + prItem.tongsoluongpo) - prItem.soluongpr;
                        prItem.tongsoluongpo = recordItem.soluongpo + prItem.tongsoluongpo;
                        prItem.checkmataisan = null;
                    } else {
                        // Điều kiện thứ nhất: Trùng sopr nhưng khác mataisan
                        const recordWithSameSopr = datapo.find(
                            record => record.sopr === prItem.sopr && record.mataisan !== prItem.mataisan
                        );

                        // Điều kiện thứ hai: mataisan không có trong recordset
                        const recordWithDifferentMataisan = !datapo.find(
                            record => record.sopr === prItem.sopr && record.mataisan === prItem.mataisan
                        );

                        // Nếu có record trùng sopo nhưng khác mataisan hoặc mataisan không có trong recordset
                        if (recordWithSameSopr || recordWithDifferentMataisan) {
                            prItem.checkmataisan = 1;
                        }
                    }

                    return prItem;
                });
                //console.log('datapr', datapr)

                for (const item of datapr) {
                    try {
                        // Tìm bản ghi trong Data_PR theo id
                        let data = await db.Data_PR.findOne({ where: { id: item.id }, raw: false });

                        if (data) {
                            if (item.checkmataisan === 1 && item.dacheckvoipo === null) {
                                // Chỉ cập nhật trường check
                                data.checkmataisan = item.checkmataisan;

                                // Lưu thay đổi
                                await data.save();
                            } else {
                                // Cập nhật các thông tin theo từng mục
                                data.soluongpo = item.soluongpo;
                                data.tongsoluongpo = item.tongsoluongpo;
                                data.dacheckvoipo = 1;
                                data.checkmataisan = null;
                                //data.nguoikiemtra_id = UserId;
                                //data.ngaykiemtra = ngaytao

                                // Lưu thay đổi
                                await data.save();
                            }
                        }
                    } catch (error) {
                        console.error(`Lỗi khi cập nhật PO có id: ${item.id}`, error);
                    }
                }

                // Dò tìm và thêm id_data_pr từ datapr vào datapo
                datapo.forEach(record => {
                    const found = datapr.find(
                        pr => pr.sopr === record.sopr && pr.mataisan === record.mataisan
                    );

                    if (found) {
                        record.id_data_pr = found.id;
                        record.soluongpodacheck = found.soluongpo;
                    }
                });

                if (check_log_po_pr.length > 0) {
                    for (const record of check_log_po_pr) {
                        try {
                            // Xóa bản ghi theo ID
                            await db.Data_Po_Pr_Log.destroy({
                                where: { id: record.id }
                            });
                        } catch (error) {
                            console.error(`Lỗi khi xóa dữ liệu với ID ${record.id}:`, error);
                        }
                    }
                    // insert lại thông tin mới    
                    for (const item of datapo) {
                        await db.Data_Po_Pr_Log.create({
                            id_data_pr: item.id_data_pr,
                            soluongpodacheck: item.soluongpodacheck,
                            mataisan: item.mataisan,
                            tentaisan: item.tentaisan,
                            donvitinh: item.donvitinh,
                            soluongpo: item.soluongpo,
                            dongiapo: item.dongiapo,
                            vat: item.vat,
                            dongiapovat: item.dongiapovat,
                            thanhtien: item.thanhtien,
                            thanhtienvat: item.thanhtienvat,
                            sopo: item.sopo,
                            sopr: item.sopr,
                            nguoikiemtra_id: UserId,
                            ngaykiemtra: ngaytao
                        });
                    }
                } else {
                    try {
                        for (const item of datapo) {
                            await db.Data_Po_Pr_Log.create({
                                id_data_pr: item.id_data_pr,
                                soluongpodacheck: item.soluongpodacheck,
                                mataisan: item.mataisan,
                                tentaisan: item.tentaisan,
                                donvitinh: item.donvitinh,
                                soluongpo: item.soluongpo,
                                dongiapo: item.dongiapo,
                                vat: item.vat,
                                dongiapovat: item.dongiapovat,
                                thanhtien: item.thanhtien,
                                thanhtienvat: item.thanhtienvat,
                                sopo: item.sopo,
                                sopr: item.sopr,
                                nguoikiemtra_id: UserId,
                                ngaykiemtra: ngaytao
                            });
                        }

                    } catch (error) {
                        console.error("Lỗi khi insert vào DB:", error);
                    }
                }

                resolve({
                    errCode: 0,
                    errMessage: 'Kiểm tra dữ liệu thành công'
                })
            } else {
                resolve({
                    errCode: 1,
                    errMessage: 'Số PO không tồn tại'
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

let checkMaChungTuHD = (machungtu) => {
    return new Promise(async (resolve, reject) => {
        try {
            const ngaytao = new Date();
            const request = db.sqlhis2Connection.request();

            request.input('machungtu', mssql.NVarChar(50), machungtu);
            const getdata = await request.execute('[sp_QLPO_CHECKCHUNGTUNHAPNCC]');
            // Lấy dữ liệu từ recordset
            const recordset = getdata.recordset;
            //console.log('recordset', recordset)
            const data = recordset[0];

            //console.log('data', data.trangthai)
            if (data.trangthai === 'PNDNK') {
                resolve({
                    errCode: 1,
                    errMessage: 'Chứng từ đã xác nhận nhập kho'
                })
            } else {
                resolve({
                    errCode: 0,
                    errMessage: 'Chứng từ chưa nhập kho'
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

let checkXoaChungTu = (machungtu) => {
    return new Promise(async (resolve, reject) => {
        try {
            const ngaytao = new Date();
            const request = db.sqlhis2Connection.request();

            request.input('machungtu', mssql.NVarChar(50), machungtu);
            const getdata = await request.execute('[sp_QLPO_CHECKCHUNGTUNHAPNCC]');
            // Lấy dữ liệu từ recordset
            const recordset = getdata.recordset;
            //console.log('recordset', recordset)
            const data = recordset[0];

            //console.log('data', data.trangthai)
            let check_log_chungtu = await db.Data_ChungTu_Log.findAll({
                //attributes: ['SoBenhAn'],
                where: {
                    machungtu: data.machungtu,
                },
                raw: true
            });

            let check_log_hopdong = await db.Data_ChungTu_Hd_Log.findAll({
                //attributes: ['SoBenhAn'],
                where: {
                    machungtu: data.machungtu,
                },
                raw: true
            });
            if (data.trangthai === 'PNDNK') {
                resolve({
                    errCode: 1,
                    errMessage: 'Chứng từ đã xác nhận nhập kho'
                })
            } else {
                if (check_log_chungtu.length === 0 && check_log_hopdong.length === 0) {
                    resolve({
                        errCode: 0,
                        errMessage: 'Chứng từ chưa nhập kho'
                    })
                } else {
                    resolve({
                        errCode: 1,
                        errMessage: 'Đã có log kiểm tra, không thể xóa chứng từ'
                    })
                }
            }
        } catch (e) {
            reject(e)
        }
    })
}

let checkXoaCheckChungTu = (machungtu) => {
    return new Promise(async (resolve, reject) => {
        try {
            // const ngaytao = new Date();
            // const request = db.sqlhis2Connection.request();

            // request.input('machungtu', mssql.NVarChar(50), machungtu);
            // const getdata = await request.execute('[sp_QLPO_CHECKCHUNGTUNHAPNCC]');
            // // Lấy dữ liệu từ recordset
            // const recordset = getdata.recordset;
            // //console.log('recordset', recordset)
            // const data = recordset[0];

            // //console.log('data', data.trangthai)
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
            if (check_log_chungtu.length === 0 && check_log_hopdong.length === 0) {
                resolve({
                    errCode: 0,
                    errMessage: 'Chứng từ chưa nhập kho'
                })
            } else {
                resolve({
                    errCode: 1,
                    errMessage: 'Đã có log kiểm tra, không thể xóa chứng từ'
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

let checkMaChungTuPO = (machungtu) => {
    return new Promise(async (resolve, reject) => {
        try {
            const ngaytao = new Date();
            const request = db.sqlhis2Connection.request();

            request.input('machungtu', mssql.NVarChar(50), machungtu);
            const getdata = await request.execute('[sp_QLPO_CHECKCHUNGTUNHAPNCC]');
            // Lấy dữ liệu từ recordset
            const recordset = getdata.recordset;
            //console.log('recordset', recordset)
            const data = recordset[0];

            //console.log('data', data.trangthai)
            if (data.trangthai === 'PNDNK') {
                resolve({
                    errCode: 1,
                    errMessage: 'Chứng từ đã xác nhận nhập kho'
                })
            } else {
                resolve({
                    errCode: 0,
                    errMessage: 'Chứng từ chưa nhập kho'
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

let checkPOPR = (sopo) => {
    return new Promise(async (resolve, reject) => {
        try {
            let check_po = await db.Data_PO.findAll({
                //attributes: ['SoBenhAn'],
                where: {
                    sopo: sopo,
                    dacheckvoict: 1,
                },
                raw: true
            });
            //console.log('check_po', check_po)
            if (check_po.length > 0) {
                resolve({ errCode: 1, data: check_po, errMessage: 'PO đã phát sinh chứng từ kiểm tra. Không thể xóa' });
            } else {
                resolve({ errCode: 0, data: check_po, errMessage: 'Khóa button thanh toán thành công' });
            }
            // let check_log_po_pr = await db.Data_Po_Pr_Log.findAll({
            //     //attributes: ['SoBenhAn'],
            //     where: {
            //         sopr: sopr,
            //     },
            //     raw: true
            // });
            // const data = check_log_po_pr[0];
            // //console.log('data', data.sopo)
            // if (check_log_po_pr.length > 0) {
            //     resolve({
            //         errCode: 0,
            //         errMessage: 'Chứng từ chưa nhập kho',
            //         data: data.sopo,
            //     })
            // }
        } catch (e) {
            reject(e)
        }
    })
}

let getChungTu = (machungtu, UserId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const ngaytao = new Date();
            const request = db.sqlhis2Connection.request();

            request.input('machungtu', mssql.NVarChar(50), machungtu);
            const getdata = await request.execute('[sp_QLPO_GETCHUNGTUNHAPNCC]');
            // Lấy dữ liệu từ recordset
            const recordset = getdata.recordset;
            //console.log('recordset', recordset)
            const data = recordset[0];

            let check_log_chungtu_hd = await db.Data_ChungTu_Hd_Log.findAll({
                //attributes: ['SoBenhAn'],
                where: {
                    machungtu: machungtu,
                },
                raw: true
            });

            // KIỂM TRA XEM CÓ LOG HAY KHÔNG. NẾU CÓ LOG MÃ CHỨNG TỪ ĐÃ CHECK TRƯỚC ĐÓ THÌ CẬP NHẬP LẠI 
            // SỐ LƯỢNG ĐÃ NHẬP Ở DATA HĐ
            if (check_log_chungtu_hd.length > 0) {

                for (const item of check_log_chungtu_hd) {
                    try {
                        // Tìm bản ghi trong Data_HD theo id
                        let data = await db.Data_HD.findOne({ where: { id: item.id_data_hd }, raw: false });

                        if (data) {
                            data.soluongdanhap = data.soluongdanhap - item.soluongnhap;
                            // Lưu thay đổi
                            await data.save();
                        }
                    } catch (error) {
                        console.error(`Lỗi khi cập nhật PO có id: ${item.id}`, error);
                    }
                }
            }


            if (recordset.length > 0) {
                if (data.trangthai !== 'PNDNK') {
                    let gethd = await db.Data_HD.findAll({
                        //attributes: ['SoBenhAn'],
                        where: {
                            nhacungcap_id: data.nhacungcap_id,
                        },
                        raw: true
                    });
                    // Vòng lặp tìm các phần tử trùng khớp giữa recordset và gethd
                    gethd = gethd.map(hdItem => {
                        const recordItem = recordset.find(
                            record =>
                                record.nhacungcap_id === hdItem.nhacungcap_id && record.mataisan === hdItem.mataisan
                        );

                        if (recordItem) {
                            hdItem.soluongdanhap = hdItem.soluongdanhap !== null ? hdItem.soluongdanhap : 0;
                            // Tính toán sự chênh lệch
                            hdItem.dongianhap = recordItem.dongianhap - hdItem.dongiahd;
                            hdItem.dongianhapvat = recordItem.dongianhapvat - hdItem.dongiahdvat;
                            hdItem.soluongdanhap = recordItem.soluongnhap + hdItem.soluongdanhap;
                            hdItem.checkmataisanvoict = null;

                            // Kiểm tra ngaychungtu có nằm trong khoảng ngayhieuluc và ngayketthuc
                            const ngaychungtu = new Date(recordItem.ngaychungtu);
                            const ngayhieuluc = new Date(hdItem.ngayhieuluc);
                            const ngayketthuc = new Date(hdItem.ngayketthuc);

                            // Kiểm tra điều kiện
                            if (ngaychungtu >= ngayhieuluc && ngaychungtu <= ngayketthuc) {
                                hdItem.checkhieuluc = 1; // Trong khoảng
                            } else {
                                hdItem.checkhieuluc = 0; // Ngoài khoảng
                            }
                        } else {
                            // Điều kiện thứ nhất: Trùng ncc nhưng khác mataisan
                            const recordWithSameSoHd = recordset.find(
                                record => record.nhacungcap_id === hdItem.nhacungcap_id && record.mataisan !== hdItem.mataisan
                            );

                            // Điều kiện thứ hai: mataisan không có trong recordset
                            const recordWithDifferentMataisan = !recordset.find(
                                record => record.nhacungcap_id === hdItem.nhacungcap_id && record.mataisan === hdItem.mataisan
                            );

                            // Nếu có record trùng ncc nhưng khác mataisan hoặc mataisan không có trong recordset
                            if (recordWithSameSoHd || recordWithDifferentMataisan) {
                                hdItem.checkmataisanvoict = 1;
                            }
                        }

                        return hdItem;
                    });

                    //console.log('getpo', gethd);

                    for (const item of gethd) {
                        try {
                            // Tìm bản ghi trong Data_HD theo id
                            let data = await db.Data_HD.findOne({ where: { id: item.id }, raw: false });

                            if (data) {
                                if (item.checkmataisanvoict === 1) {
                                    // Chỉ cập nhật trường check
                                    data.checkmataisanvoict = item.checkmataisanvoict;

                                    // Lưu thay đổi
                                    await data.save();
                                } else {
                                    // Cập nhật các thông tin theo từng mục
                                    data.dongianhap = item.dongianhap;
                                    data.dongianhapvat = item.dongianhapvat;
                                    data.soluongdanhap = item.soluongdanhap;
                                    data.checkhieuluc = item.checkhieuluc;
                                    data.checkmataisan = null;
                                    data.dacheckvoict = 1;
                                    //data.ngaykiemtra = ngaytao
                                    // Lưu thay đổi
                                    await data.save();
                                }
                            }
                        } catch (error) {
                            console.error(`Lỗi khi cập nhật PO có id: ${item.id}`, error);
                        }
                    }


                    // Dò tìm và thêm id_data_hd từ gethd vào recordset
                    recordset.forEach(record => {
                        const found = gethd.find(
                            hd => hd.nhacungcap_id === record.nhacungcap_id && hd.mataisan === record.mataisan
                        );

                        if (found) {
                            record.id_data_hd = found.id;
                            record.dongianhap_check = found.dongianhap;
                            record.dongianhapvat_check = found.dongianhapvat;
                            record.hieuluc_check = found.checkhieuluc;
                        }
                    });
                    //console.log('recordset2', recordset)


                    //console.log('check_log_chungtu', check_log_chungtu)
                    if (check_log_chungtu_hd.length > 0) {
                        for (const record of check_log_chungtu_hd) {
                            try {
                                // Xóa bản ghi theo ID
                                await db.Data_ChungTu_Hd_Log.destroy({
                                    where: { id: record.id }
                                });
                            } catch (error) {
                                console.error(`Lỗi khi xóa dữ liệu với ID ${record.id}:`, error);
                            }
                        }
                        // insert lại thông tin mới    
                        for (const item of recordset) {
                            await db.Data_ChungTu_Hd_Log.create({
                                machungtu: item.machungtu,
                                mataisan: item.mataisan,
                                tentaisan: item.tentaisan,
                                dongianhap_check: item.dongianhap_check,
                                dongianhapvat_check: item.dongianhapvat_check,
                                hieuluc_check: item.hieuluc_check,
                                id_data_hd: item.id_data_hd,
                                nhacungcap_id: item.nhacungcap_id,
                                tennhacungcap: item.tennhacungcap,
                                chungtu_id: item.chungtu_id,
                                ngaychungtu: item.ngaychungtu,
                                khonhap: item.khonhap,
                                nguoinhap: item.nguoinhap,
                                soluongnhap: item.soluongnhap,
                                dongianhap: item.dongianhap,
                                dongianhapvat: item.dongianhapvat,
                                vatnhap: item.vatnhap,
                                thanhtiennhap: item.soluongnhap * item.dongianhap,
                                thanhtiennhapvat: item.soluongnhap * item.dongianhapvat,
                                nguoinhap: item.nguoinhap,
                                nguoikiemtra_id: UserId,
                                ngaykiemtra: ngaytao,
                            });
                        }
                    } else {
                        try {
                            for (const item of recordset) {
                                await db.Data_ChungTu_Hd_Log.create({
                                    machungtu: item.machungtu,
                                    mataisan: item.mataisan,
                                    tentaisan: item.tentaisan,
                                    dongianhap_check: item.dongianhap_check,
                                    dongianhapvat_check: item.dongianhapvat_check,
                                    hieuluc_check: item.hieuluc_check,
                                    id_data_hd: item.id_data_hd,
                                    nhacungcap_id: item.nhacungcap_id,
                                    tennhacungcap: item.tennhacungcap,
                                    chungtu_id: item.chungtu_id,
                                    ngaychungtu: item.ngaychungtu,
                                    khonhap: item.khonhap,
                                    nguoinhap: item.nguoinhap,
                                    soluongnhap: item.soluongnhap,
                                    dongianhap: item.dongianhap,
                                    dongianhapvat: item.dongianhapvat,
                                    vatnhap: item.vatnhap,
                                    thanhtiennhap: item.soluongnhap * item.dongianhap,
                                    thanhtiennhapvat: item.soluongnhap * item.dongianhapvat,
                                    nguoinhap: item.nguoinhap,
                                    nguoikiemtra_id: UserId,
                                    ngaykiemtra: ngaytao,
                                });
                            }

                        } catch (error) {
                            console.error("Lỗi khi insert vào DB:", error);
                        }
                    }
                    resolve({
                        errCode: 0,
                        errMessage: 'Kiểm tra dữ liệu thành công'
                    })
                } else {
                    resolve({
                        errCode: 1,
                        errMessage: 'Chứng từ đã nhập kho'
                    })
                }
            } else {
                resolve({
                    errCode: 1,
                    errMessage: 'Mã chứng từ không tồn tại..'
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

let getCheckChungTu = (machungtu, UserId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const ngaytao = new Date();
            const request = db.sqlhis2Connection.request();

            request.input('machungtu', mssql.NVarChar(50), machungtu);
            const getdata = await request.execute('[sp_QLPO_GETCHUNGTUNHAPNCC_DNK]');
            // Lấy dữ liệu từ recordset
            const recordset = getdata.recordset;
            //console.log('recordset', recordset)
            const data = recordset[0];

            let check_log_chungtu_hd = await db.Check_Data_ChungTu_Hd_Log.findAll({
                //attributes: ['SoBenhAn'],
                where: {
                    machungtu: machungtu,
                },
                raw: true
            });

            // KIỂM TRA XEM CÓ LOG HAY KHÔNG. NẾU CÓ LOG MÃ CHỨNG TỪ ĐÃ CHECK TRƯỚC ĐÓ THÌ CẬP NHẬP LẠI 
            // SỐ LƯỢNG ĐÃ NHẬP Ở DATA HĐ
            if (check_log_chungtu_hd.length > 0) {

                for (const item of check_log_chungtu_hd) {
                    try {
                        // Tìm bản ghi trong Data_HD theo id
                        let data = await db.Data_HD.findOne({ where: { id: item.id_data_hd }, raw: false });

                        if (data) {
                            data.soluongdanhap2 = data.soluongdanhap2 - item.soluongnhap;
                            // Lưu thay đổi
                            await data.save();
                        }
                    } catch (error) {
                        console.error(`Lỗi khi cập nhật PO có id: ${item.id}`, error);
                    }
                }
            }


            if (recordset.length > 0) {
                if (data.trangthai !== 'PNCNK') {
                    let gethd = await db.Data_HD.findAll({
                        //attributes: ['SoBenhAn'],
                        where: {
                            nhacungcap_id: data.nhacungcap_id,
                        },
                        raw: true
                    });
                    // Vòng lặp tìm các phần tử trùng khớp giữa recordset và gethd
                    gethd = gethd.map(hdItem => {
                        const recordItem = recordset.find(
                            record =>
                                record.nhacungcap_id === hdItem.nhacungcap_id && record.mataisan === hdItem.mataisan
                        );

                        if (recordItem) {
                            hdItem.soluongdanhap2 = hdItem.soluongdanhap2 !== null ? hdItem.soluongdanhap2 : 0;
                            // Tính toán sự chênh lệch
                            hdItem.dongianhap2 = recordItem.dongianhap - hdItem.dongiahd;
                            hdItem.dongianhapvat2 = recordItem.dongianhapvat - hdItem.dongiahdvat;
                            hdItem.soluongdanhap2 = recordItem.soluongnhap + hdItem.soluongdanhap2;
                            hdItem.checkmataisanvoict2 = null;

                            // Kiểm tra ngaychungtu có nằm trong khoảng ngayhieuluc và ngayketthuc
                            const ngaychungtu = new Date(recordItem.ngaychungtu);
                            const ngayhieuluc = new Date(hdItem.ngayhieuluc);
                            const ngayketthuc = new Date(hdItem.ngayketthuc);

                            // Kiểm tra điều kiện
                            if (ngaychungtu >= ngayhieuluc && ngaychungtu <= ngayketthuc) {
                                hdItem.checkhieuluc = 1; // Trong khoảng
                            } else {
                                hdItem.checkhieuluc = 0; // Ngoài khoảng
                            }
                        } else {
                            // Điều kiện thứ nhất: Trùng ncc nhưng khác mataisan
                            const recordWithSameSoHd = recordset.find(
                                record => record.nhacungcap_id === hdItem.nhacungcap_id && record.mataisan !== hdItem.mataisan
                            );

                            // Điều kiện thứ hai: mataisan không có trong recordset
                            const recordWithDifferentMataisan = !recordset.find(
                                record => record.nhacungcap_id === hdItem.nhacungcap_id && record.mataisan === hdItem.mataisan
                            );

                            // Nếu có record trùng ncc nhưng khác mataisan hoặc mataisan không có trong recordset
                            if (recordWithSameSoHd || recordWithDifferentMataisan) {
                                hdItem.checkmataisanvoict2 = 1;
                            }
                        }

                        return hdItem;
                    });

                    //console.log('getpo', gethd);

                    for (const item of gethd) {
                        try {
                            // Tìm bản ghi trong Data_HD theo id
                            let data = await db.Data_HD.findOne({ where: { id: item.id }, raw: false });

                            if (data) {
                                if (item.checkmataisanvoict2 === 1) {
                                    // Chỉ cập nhật trường check
                                    data.checkmataisanvoict2 = item.checkmataisanvoict2;

                                    // Lưu thay đổi
                                    await data.save();
                                } else {
                                    // Cập nhật các thông tin theo từng mục
                                    data.dongianhap2 = item.dongianhap2;
                                    data.dongianhapvat2 = item.dongianhapvat2;
                                    data.soluongdanhap2 = item.soluongdanhap2;
                                    data.checkhieuluc = item.checkhieuluc;
                                    data.checkmataisan = null;
                                    data.dacheckvoict2 = 1;
                                    //data.ngaykiemtra = ngaytao
                                    // Lưu thay đổi
                                    await data.save();
                                }
                            }
                        } catch (error) {
                            console.error(`Lỗi khi cập nhật PO có id: ${item.id}`, error);
                        }
                    }


                    // Dò tìm và thêm id_data_hd từ gethd vào recordset
                    recordset.forEach(record => {
                        const found = gethd.find(
                            hd => hd.nhacungcap_id === record.nhacungcap_id && hd.mataisan === record.mataisan
                        );

                        if (found) {
                            record.id_data_hd = found.id;
                            record.dongianhap_check = found.dongianhap2;
                            record.dongianhapvat_check = found.dongianhapvat2;
                            record.hieuluc_check = found.checkhieuluc;
                        }
                    });
                    //console.log('recordset2', recordset)


                    //console.log('check_log_chungtu', check_log_chungtu)
                    if (check_log_chungtu_hd.length > 0) {
                        for (const record of check_log_chungtu_hd) {
                            try {
                                // Xóa bản ghi theo ID
                                await db.Check_Data_ChungTu_Hd_Log.destroy({
                                    where: { id: record.id }
                                });
                            } catch (error) {
                                console.error(`Lỗi khi xóa dữ liệu với ID ${record.id}:`, error);
                            }
                        }
                        // insert lại thông tin mới    
                        for (const item of recordset) {
                            await db.Check_Data_ChungTu_Hd_Log.create({
                                machungtu: item.machungtu,
                                mataisan: item.mataisan,
                                tentaisan: item.tentaisan,
                                dongianhap_check: item.dongianhap_check,
                                dongianhapvat_check: item.dongianhapvat_check,
                                hieuluc_check: item.hieuluc_check,
                                id_data_hd: item.id_data_hd,
                                nhacungcap_id: item.nhacungcap_id,
                                tennhacungcap: item.tennhacungcap,
                                chungtu_id: item.chungtu_id,
                                ngaychungtu: item.ngaychungtu,
                                khonhap: item.khonhap,
                                nguoinhap: item.nguoinhap,
                                soluongnhap: item.soluongnhap,
                                dongianhap: item.dongianhap,
                                dongianhapvat: item.dongianhapvat,
                                vatnhap: item.vatnhap,
                                thanhtiennhap: item.soluongnhap * item.dongianhap,
                                thanhtiennhapvat: item.soluongnhap * item.dongianhapvat,
                                nguoinhap: item.nguoinhap,
                                nguoikiemtra_id: UserId,
                                ngaykiemtra: ngaytao,
                            });
                        }

                        //SO SÁNH LẦN CHECK LOG HD 1 VÀ CHECK LOG HD 2 ĐỀ TÌM RA KHÁC NHAU
                        const { Op } = require('sequelize');
                        let data_check_log_chungtu = await db.Check_Data_ChungTu_Hd_Log.findAll({
                            attributes: ['id', 'id_data_hd', 'mataisan', 'dongianhap_check', 'dongianhapvat_check'],
                            where: {
                                machungtu: data.machungtu,
                                id_data_hd: {
                                    [Op.ne]: 0,  // Điều kiện id_data_po khác null
                                }
                            },
                            raw: true
                        });

                        let data_log_chungtu = await db.Data_ChungTu_Hd_Log.findAll({
                            attributes: ['id_data_hd', 'mataisan', 'dongianhap_check', 'dongianhapvat_check'],
                            where: {
                                machungtu: data.machungtu,
                                id_data_hd: {
                                    [Op.ne]: 0,  // Điều kiện id_data_po khác null
                                }
                            },
                            raw: true
                        });
                        //console.log('data_check_log_chungtu', data_check_log_chungtu)
                        //console.log('data_log_chungtu', data_log_chungtu)

                        let result = data_check_log_chungtu.map(itemCheck => {
                            let matchedItem = data_log_chungtu.find(itemLog =>
                                itemLog.id_data_hd === itemCheck.id_data_hd && itemLog.mataisan === itemCheck.mataisan
                            );

                            if (matchedItem) {
                                return {
                                    id: itemCheck.id,
                                    id_data_hd: itemCheck.id_data_hd,
                                    mataisan: itemCheck.mataisan,
                                    check_dongianhap: itemCheck.dongianhap_check === matchedItem.dongianhap_check ? 1 : 0,
                                    check_dongianhapvat: itemCheck.dongianhapvat_check === matchedItem.dongianhapvat_check ? 1 : 0,
                                };
                            }

                            return null;
                        }).filter(item => item !== null);

                        //console.log('result', result);
                        for (const item of result) {
                            try {
                                // Tìm bản ghi trong Data_PO theo id
                                let data = await db.Check_Data_ChungTu_Hd_Log.findOne({ where: { id: item.id }, raw: false });

                                if (data) {
                                    // Cập nhật các thông tin theo từng mục
                                    data.check_dongianhap = item.check_dongianhap;
                                    data.check_dongianhapvat = item.check_dongianhapvat;
                                    // Lưu thay đổi
                                    await data.save();
                                }
                            } catch (error) {
                                console.error(`Lỗi khi cập nhật PO có id: ${item.id}`, error);
                            }
                        }
                    } else {
                        try {
                            for (const item of recordset) {
                                await db.Check_Data_ChungTu_Hd_Log.create({
                                    machungtu: item.machungtu,
                                    mataisan: item.mataisan,
                                    tentaisan: item.tentaisan,
                                    dongianhap_check: item.dongianhap_check,
                                    dongianhapvat_check: item.dongianhapvat_check,
                                    hieuluc_check: item.hieuluc_check,
                                    id_data_hd: item.id_data_hd,
                                    nhacungcap_id: item.nhacungcap_id,
                                    tennhacungcap: item.tennhacungcap,
                                    chungtu_id: item.chungtu_id,
                                    ngaychungtu: item.ngaychungtu,
                                    khonhap: item.khonhap,
                                    nguoinhap: item.nguoinhap,
                                    soluongnhap: item.soluongnhap,
                                    dongianhap: item.dongianhap,
                                    dongianhapvat: item.dongianhapvat,
                                    vatnhap: item.vatnhap,
                                    thanhtiennhap: item.soluongnhap * item.dongianhap,
                                    thanhtiennhapvat: item.soluongnhap * item.dongianhapvat,
                                    nguoinhap: item.nguoinhap,
                                    nguoikiemtra_id: UserId,
                                    ngaykiemtra: ngaytao,
                                });
                            }

                        } catch (error) {
                            console.error("Lỗi khi insert vào DB:", error);
                        }

                        //SO SÁNH LẦN CHECK LOG HD 1 VÀ CHECK LOG HD 2 ĐỀ TÌM RA KHÁC NHAU
                        const { Op } = require('sequelize');
                        let data_check_log_chungtu = await db.Check_Data_ChungTu_Hd_Log.findAll({
                            attributes: ['id', 'id_data_hd', 'mataisan', 'dongianhap_check', 'dongianhapvat_check'],
                            where: {
                                machungtu: data.machungtu,
                                id_data_hd: {
                                    [Op.ne]: 0,  // Điều kiện id_data_po khác null
                                }
                            },
                            raw: true
                        });

                        let data_log_chungtu = await db.Data_ChungTu_Hd_Log.findAll({
                            attributes: ['id_data_hd', 'mataisan', 'dongianhap_check', 'dongianhapvat_check'],
                            where: {
                                machungtu: data.machungtu,
                                id_data_hd: {
                                    [Op.ne]: 0,  // Điều kiện id_data_po khác null
                                }
                            },
                            raw: true
                        });
                        //console.log('data_check_log_chungtu', data_check_log_chungtu)
                        //console.log('data_log_chungtu', data_log_chungtu)

                        let result = data_check_log_chungtu.map(itemCheck => {
                            let matchedItem = data_log_chungtu.find(itemLog =>
                                itemLog.id_data_hd === itemCheck.id_data_hd && itemLog.mataisan === itemCheck.mataisan
                            );

                            if (matchedItem) {
                                return {
                                    id: itemCheck.id,
                                    id_data_hd: itemCheck.id_data_hd,
                                    mataisan: itemCheck.mataisan,
                                    check_dongianhap: itemCheck.dongianhap_check === matchedItem.dongianhap_check ? 1 : 0,
                                    check_dongianhapvat: itemCheck.dongianhapvat_check === matchedItem.dongianhapvat_check ? 1 : 0,
                                };
                            }

                            return null;
                        }).filter(item => item !== null);

                        //console.log('result', result);
                        for (const item of result) {
                            try {
                                // Tìm bản ghi trong Data_PO theo id
                                let data = await db.Check_Data_ChungTu_Hd_Log.findOne({ where: { id: item.id }, raw: false });

                                if (data) {
                                    // Cập nhật các thông tin theo từng mục
                                    data.check_dongianhap = item.check_dongianhap;
                                    data.check_dongianhapvat = item.check_dongianhapvat;
                                    // Lưu thay đổi
                                    await data.save();
                                }
                            } catch (error) {
                                console.error(`Lỗi khi cập nhật PO có id: ${item.id}`, error);
                            }
                        }
                    }
                    resolve({
                        errCode: 0,
                        errMessage: 'Kiểm tra dữ liệu thành công'
                    })
                } else {
                    resolve({
                        errCode: 1,
                        errMessage: 'Chứng từ chưa nhập kho'
                    })
                }
            } else {
                resolve({
                    errCode: 1,
                    errMessage: 'Mã chứng từ không tồn tại..'
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

let getMaChungTu = (machungtu, UserId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const ngaytao = new Date();
            const request = db.sqlhis2Connection.request();
            request.input('machungtu', mssql.NVarChar(50), machungtu);
            const getdata = await request.execute('[sp_QLPO_GETCHUNGTUNHAPNCC]');
            // Lấy dữ liệu từ recordset
            const recordset = getdata.recordset;
            const data = recordset[0];

            // // KIỂM TRA XEM CÓ LOG HAY KHÔNG. NẾU CÓ LOG MÃ CHỨNG TỪ ĐÃ CHECK TRƯỚC ĐÓ THÌ CẬP NHẬP LẠI 
            // // SỐ LƯỢNG ĐÃ NHẬP Ở DATA HĐ
            // if (check_log_chungtu.length > 0) {

            //     for (const item of check_log_chungtu) {
            //         try {
            //             // Tìm bản ghi trong Data_HD theo id
            //             let data = await db.Data_PO.findOne({ where: { id: item.id_data_po }, raw: false });

            //             if (data) {
            //                 data.soluongdanhap = data.soluongdanhap - item.soluongnhap;
            //                 data.soluongnhap = data.soluongnhap - item.soluongnhap;
            //                 // Lưu thay đổi
            //                 await data.save();
            //             }
            //         } catch (error) {
            //             console.error(`Lỗi khi cập nhật PO có id: ${item.id}`, error);
            //         }
            //     }
            // }



            if (recordset.length > 0) {
                let check_log_chungtu = await db.Data_ChungTu_Log.findAll({
                    //attributes: ['SoBenhAn'],
                    where: {
                        machungtu: data.machungtu,
                    },
                    raw: true
                });

                let check_log_hopdong = await db.Data_ChungTu_Hd_Log.findAll({
                    //attributes: ['SoBenhAn'],
                    where: {
                        machungtu: data.machungtu,
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
                if (data.trangthai !== 'PNDNK') {
                    if (data.sopo === null) {
                        resolve({
                            errCode: 1,
                            errMessage: 'Kiểm tra lại phiếu nhập NCC chưa có số PO'
                        })
                    } else {
                        if (check_log_chungtu.length === 0 && check_log_hopdong.length === 0) {
                            let soPO = data.sopo
                            //GỌI HÀM GETCHUNGTU ĐỂ check HĐ VỚI CHỨNG TỪ
                            await getSoPO(soPO, UserId);

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

                            let getpodata = await db.Data_PO.findAll({
                                //attributes: ['SoBenhAn'],
                                where: {
                                    sopo: data.sopo,
                                },
                                raw: true
                            });

                            //console.log('getpo', getpo)

                            // Sử dụng reduce để nhóm theo mataisan và sopo, sau đó tính tổng soluongpo
                            let getpo = Object.values(getpodata.reduce((acc, item) => {
                                const key = `${item.mataisan}-${item.sopo}`; // Tạo khóa dựa trên mataisan và sopo
                                if (!acc[key]) {
                                    acc[key] = { ...item, soluongpo: 0 }; // Khởi tạo đối tượng trong nhóm
                                }
                                acc[key].soluongpo += item.soluongpo; // Tính tổng soluongpo
                                return acc;
                            }, {}));

                            //console.log('result', result);

                            // Vòng lặp tìm các phần tử trùng khớp giữa recordset và getpo
                            getpo = getpo.map(poItem => {
                                const recordItem = recordset.find(
                                    record =>
                                        record.sopo === poItem.sopo && record.mataisan === poItem.mataisan
                                );

                                if (recordItem) {
                                    poItem.soluongdanhap = poItem.soluongdanhap !== null ? poItem.soluongdanhap : 0;
                                    // Tính toán sự chênh lệch
                                    poItem.soluongnhap = recordItem.soluongnhap + poItem.soluongdanhap - poItem.soluongpo;
                                    poItem.dongianhap = recordItem.dongianhap - poItem.dongiapo;
                                    poItem.dongiavatnhap = recordItem.dongianhapvat - poItem.dongiapovat;
                                    poItem.soluongdanhap = recordItem.soluongnhap + poItem.soluongdanhap;
                                    poItem.checkmataisanvoict = null;
                                } else {
                                    // Điều kiện thứ nhất: Trùng sopo nhưng khác mataisan
                                    const recordWithSameSopo = recordset.find(
                                        record => record.sopo === poItem.sopo && record.mataisan !== poItem.mataisan
                                    );

                                    // Điều kiện thứ hai: mataisan không có trong recordset
                                    const recordWithDifferentMataisan = !recordset.find(
                                        record => record.sopo === poItem.sopo && record.mataisan === poItem.mataisan
                                    );

                                    // Nếu có record trùng sopo nhưng khác mataisan hoặc mataisan không có trong recordset
                                    if (recordWithSameSopo || recordWithDifferentMataisan) {
                                        poItem.checkmataisanvoict = 1;
                                    }
                                }

                                return poItem;
                            });//.filter(poItem => poItem.soluongnhap !== null && poItem.dongianhap !== null && poItem.dongiavatnhap !== null);

                            //console.log('getpo', getpo);

                            for (const item of getpo) {
                                try {
                                    // Tìm bản ghi trong Data_PO theo id
                                    let data = await db.Data_PO.findOne({ where: { id: item.id }, raw: false });

                                    if (data) {
                                        if (item.checkmataisanvoict === 1 && item.checkma !== null) {
                                            // Chỉ cập nhật trường check
                                            data.checkmataisanvoict = item.checkmataisanvoict;

                                            // Lưu thay đổi
                                            await data.save();
                                        } else {
                                            // Cập nhật các thông tin theo từng mục
                                            data.soluongnhap = item.soluongnhap;
                                            data.dongianhap = item.dongianhap;
                                            data.dongiavatnhap = item.dongiavatnhap;
                                            data.soluongdanhap = item.soluongdanhap;
                                            data.checkmataisanvoict = null;
                                            data.dacheckvoict = 1;
                                            //data.ngaykiemtra = ngaytao

                                            // Lưu thay đổi
                                            await data.save();
                                        }
                                    }
                                } catch (error) {
                                    console.error(`Lỗi khi cập nhật PO có id: ${item.id}`, error);
                                }
                            }


                            // Dò tìm và thêm id_data_hd từ gethd vào recordset
                            recordset.forEach(record => {
                                const found = getpo.find(
                                    po => po.sopo === record.sopo && po.mataisan === record.mataisan
                                );

                                if (found) {
                                    record.id_data_po = found.id;
                                    record.soluongnhap_check = found.soluongnhap;
                                    record.dongianhap_check = found.dongianhap;
                                    record.dongianhapvat_check = found.dongiavatnhap;
                                }
                            });

                            //console.log('check_log_chungtu', check_log_chungtu)
                            if (check_log_chungtu.length > 0) {
                                for (const record of check_log_chungtu) {
                                    try {
                                        // Xóa bản ghi theo ID
                                        await db.Data_ChungTu_Log.destroy({
                                            where: { id: record.id }
                                        });
                                    } catch (error) {
                                        console.error(`Lỗi khi xóa dữ liệu với ID ${record.id}:`, error);
                                    }
                                }
                                try {
                                    // insert lại thông tin mới    
                                    for (const item of recordset) {
                                        await db.Data_ChungTu_Log.create({
                                            id_data_po: item.id_data_po,
                                            mataisan: item.mataisan,
                                            tentaisan: item.tentaisan,
                                            soluongnhap_check: item.soluongnhap_check,
                                            dongianhap_check: item.dongianhap_check,
                                            dongianhapvat_check: item.dongianhapvat_check,
                                            machungtu: item.machungtu,
                                            sopo: item.sopo,
                                            trangthai: item.trangthai,
                                            nhacungcap_id: item.nhacungcap_id,
                                            tennhacungcap: item.tennhacungcap,
                                            chungtu_id: item.chungtu_id,
                                            ngaychungtu: item.ngaychungtu,
                                            khonhap: item.khonhap,
                                            nguoinhap: item.nguoinhap,
                                            soluongnhap: item.soluongnhap,
                                            dongianhap: item.dongianhap,
                                            dongianhapvat: item.dongianhapvat,
                                            vatnhap: item.vatnhap,
                                            thanhtiennhap: item.soluongnhap * item.dongianhap,
                                            thanhtiennhapvat: item.soluongnhap * item.dongianhapvat,
                                            nguoinhap: item.nguoinhap,
                                            nguoikiemtra_id: UserId,
                                            ngaykiemtra: ngaytao,
                                        });
                                    }
                                } catch (error) {
                                    console.error("Lỗi khi insert vào DB:", error);
                                }
                            } else {
                                try {
                                    for (const item of recordset) {
                                        await db.Data_ChungTu_Log.create({
                                            id_data_po: item.id_data_po,
                                            mataisan: item.mataisan,
                                            tentaisan: item.tentaisan,
                                            soluongnhap_check: item.soluongnhap_check,
                                            dongianhap_check: item.dongianhap_check,
                                            dongianhapvat_check: item.dongianhapvat_check,
                                            machungtu: item.machungtu,
                                            sopo: item.sopo,
                                            trangthai: item.trangthai,
                                            nhacungcap_id: item.nhacungcap_id,
                                            tennhacungcap: item.tennhacungcap,
                                            chungtu_id: item.chungtu_id,
                                            ngaychungtu: item.ngaychungtu,
                                            khonhap: item.khonhap,
                                            nguoinhap: item.nguoinhap,
                                            soluongnhap: item.soluongnhap,
                                            dongianhap: item.dongianhap,
                                            dongianhapvat: item.dongianhapvat,
                                            vatnhap: item.vatnhap,
                                            thanhtiennhap: item.soluongnhap * item.dongianhap,
                                            thanhtiennhapvat: item.soluongnhap * item.dongianhapvat,
                                            nguoinhap: item.nguoinhap,
                                            nguoikiemtra_id: UserId,
                                            ngaykiemtra: ngaytao,
                                        });
                                    }

                                } catch (error) {
                                    console.error("Lỗi khi insert vào DB:", error);
                                }
                            }

                            // insert data chứng từ 
                            try {
                                for (const item of recordset) {
                                    await db.Data_ChungTu.create({
                                        chungtu_id: item.chungtu_id,
                                        machungtu: item.machungtu,
                                        ngaychungtu: item.ngaychungtu,
                                        mataisan: item.mataisan,
                                        tentaisan: item.tentaisan,
                                        donvitinh: item.donvitinh,
                                        soluongnhap: item.soluongnhap,
                                        dongianhap: item.dongianhap,
                                        thanhtiennhap: item.soluongnhap * item.dongianhap,
                                        vatnhap: item.vatnhap,
                                        dongianhapvat: item.dongianhapvat,
                                        thanhtiennhapvat: item.soluongnhap * item.dongianhapvat,
                                        nhacungcap_id: item.nhacungcap_id,
                                        tennhacungcap: item.tennhacungcap,
                                        khonhap: item.khonhap,
                                        nguoinhap: item.nguoinhap,
                                        sopo: item.sopo,
                                        trangthai: item.trangthai,
                                    });
                                }
                            } catch (error) {
                                console.error("Lỗi khi insert vào DB:", error);
                            }

                            //GỌI HÀM GETCHUNGTU ĐỂ check HĐ VỚI CHỨNG TỪ
                            await getChungTu(machungtu, UserId);

                            resolve({
                                errCode: 0,
                                errMessage: 'Kiểm tra dữ liệu thành công'
                            })
                        } else {
                            resolve({
                                errCode: 1,
                                errMessage: 'Chứng từ đã kiểm tra, vui lòng xóa log để kiểm tra lại'
                            })
                        }
                    }
                } else {
                    resolve({
                        errCode: 1,
                        errMessage: 'Chứng từ đã nhập kho'
                    })
                }
            } else {
                resolve({
                    errCode: 1,
                    errMessage: 'Mã chứng từ không tồn tại'
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}
let getLichSuKiemKe = (KhoTaiSan_Id, UserId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.sequelize.query('CALL sp_get_lichsu_kiemke(:KhoTaiSan_Id)',
                {
                    replacements: {
                        KhoTaiSan_Id: KhoTaiSan_Id,
                    },
                    raw: false
                }
            );
            //console.log('data', data)
            resolve({
                errCode: 0,
                //errMessage: 'Không thể insert data kiểm kê',
                data: data
            })
        } catch (e) {
            reject(e)
        }
    })
}

let getTaiSanTheoKhoLichSu = (KhoTaiSan_Id, KhoQuanLy, UserId, DotKiemKe_Id) => {
    return new Promise(async (resolve, reject) => {
        //console.log('DotKiemKe_Id', KhoTaiSan_Id, KhoQuanLy, DotKiemKe_Id)
        const DotKiemKe_Id_Int = Number(DotKiemKe_Id);
        try {
            let datakiemke = await db.sequelize.query('CALL sp_get_data_kiemke_lichsu(:KhoTaiSan_Id,:KhoQuanLy,:DotKiemKe_Id_Int)',
                {
                    replacements: {
                        KhoTaiSan_Id: KhoTaiSan_Id,
                        KhoQuanLy: KhoQuanLy,
                        DotKiemKe_Id_Int: DotKiemKe_Id_Int
                    },
                    raw: false
                });
            resolve({
                errCode: 0,
                //errMessage: 'Không thể insert data kiểm kê',
                data: datakiemke
            })
        } catch (e) {
            reject(e)
        }
    })
}

let getTaiSanXacNhanTheoKhoLichSu = (KhoTaiSan_Id, KhoQuanLy, UserId, DotKiemKe_Id) => {
    return new Promise(async (resolve, reject) => {
        //console.log('DotKiemKe_Id', KhoTaiSan_Id, KhoQuanLy, DotKiemKe_Id)
        const DotKiemKe_Id_Int = Number(DotKiemKe_Id);
        try {
            let datakiemke = await db.sequelize.query('CALL sp_get_data_xacnhan_kiemke_lichsu(:KhoTaiSan_Id,:KhoQuanLy)',
                {
                    replacements: {
                        KhoTaiSan_Id: KhoTaiSan_Id,
                        KhoQuanLy: KhoQuanLy
                    },
                    raw: false
                });
            resolve({
                errCode: 0,
                //errMessage: 'Không thể insert data kiểm kê',
                data: datakiemke
            })
        } catch (e) {
            reject(e)
        }
    })
}

let getTaiSanXacNhanAllKhoLichSu = (KhoTaiSan_Id, UserId, DotKiemKe_Id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let datakiemke = await db.sequelize.query('CALL sp_get_data_xacnhan_allkho_kiemke_lichsu(:KhoTaiSan_Id)',
                {
                    replacements: {
                        KhoTaiSan_Id: KhoTaiSan_Id
                    },
                    raw: false
                });
            resolve({
                errCode: 0,
                //errMessage: 'Không thể insert data kiểm kê',
                data: datakiemke
            })
        } catch (e) {
            reject(e)
        }
    })
}

let getTaiSanXacNhanToanVienKhoLichSu = (TimKiemKhoQuanLy, UserId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let datakiemke = await db.sequelize.query('CALL sp_get_data_xacnhan_toanvien_kho_kiemke_lichsu(:TimKiemKhoQuanLy)',
                {
                    replacements: {
                        TimKiemKhoQuanLy: TimKiemKhoQuanLy
                    },
                    raw: false
                });
            resolve({
                errCode: 0,
                //errMessage: 'Không thể insert data kiểm kê',
                data: datakiemke
            })
        } catch (e) {
            reject(e)
        }
    })
}

let getTaiSanTheoKho = (KhoTaiSan_Id, KhoQuanLy, UserId, DotKiemKe_Id) => {
    return new Promise(async (resolve, reject) => {

        try {
            if (KhoQuanLy === null && KhoTaiSan_Id !== null) {
                //console.log('KhoQuanLy null')
                resolve({
                    errCode: 1,
                    errMessage: 'Vui lòng chọn kho quản lý'
                })
            } else if (KhoQuanLy !== null && KhoTaiSan_Id !== null) {
                //console.log('KhoQuanLy not null')
                const ngaytao = new Date();
                const NamKiemKe = ngaytao.getFullYear();
                const request = db.sqlhis2Connection.request();
                request.input('KhoTaiSan_Id', mssql.Int, KhoTaiSan_Id);
                request.input('KhoQuanLy', mssql.NVarChar, KhoQuanLy);
                request.queryTimeout = 60000;
                const getdata = await request.execute('[sp_QLPO_GETTAISANTHEOKHO]');
                //console.log('KhoTaiSan_Id', KhoTaiSan_Id, KhoQuanLy)
                //console.log('data', data,)
                // Lấy dữ liệu từ recordset
                const data = getdata.recordset;
                if (data.length === 0) {
                    resolve({
                        errCode: 1,
                        errMessage: 'Khoa phòng không có loại tài sản này'
                    })
                } else {
                    let checklankiem = await db.sequelize.query('CALL sp_checklan_kiemke(:KhoTaiSan_Id,:KhoQuanLy)',
                        {
                            replacements: {
                                KhoTaiSan_Id: KhoTaiSan_Id,
                                KhoQuanLy: KhoQuanLy
                            },
                            raw: false
                        }
                    );
                    const LanKiemKe = checklankiem[0]?.LanKiemKe;
                    const DotKiemKe_Id_Int = Number(DotKiemKe_Id);
                    let datakiemke = await db.sequelize.query('CALL sp_get_data_kiemke(:KhoTaiSan_Id,:KhoQuanLy,:DotKiemKe_Id_Int)',
                        {
                            replacements: {
                                KhoTaiSan_Id: KhoTaiSan_Id,
                                KhoQuanLy: KhoQuanLy,
                                DotKiemKe_Id_Int: DotKiemKe_Id_Int
                            },
                            raw: false
                        }
                    );

                    // console.log('LanKiemKe', LanKiemKe)
                    // console.log('DotKiemKe_Id_Int', DotKiemKe_Id_Int)
                    // console.log('datakiemke', datakiemke.length)
                    if (datakiemke.length === 0) {
                        if (LanKiemKe >= 1) {
                            //onsole.log('LanKiemKe > 1')
                            const request = db.sqlhis2Connection.request();
                            request.input('KhoTaiSan_Id', mssql.Int, KhoTaiSan_Id);
                            request.queryTimeout = 60000;
                            const getkhoduoc = await request.execute('[sp_QLPO_GETALL_KHO_ID]');
                            const khoduoc = getkhoduoc.recordset;
                            for (const item of khoduoc) {
                                try {
                                    await db.Data_DotKiemKe.create({

                                        KhoDuoc_Id: item.KhoTaiSan_Id,
                                        KhoaPhongSuDung: item.TenKho,
                                        KhoaQuanLy: KhoQuanLy,
                                        NguoiTao: UserId,
                                        LanKiemKe: LanKiemKe + 1
                                    });
                                } catch (error) {
                                    // Nếu xảy ra lỗi, gửi thông báo lỗi về React
                                    console.error("Error converting ngaypo:", error.message);
                                    resolve({
                                        errCode: 1,
                                        errMessage: 'Không thể insert data kiểm kê'
                                    })
                                }
                            }
                            let getDotKiemKe = await db.sequelize.query('CALL sp_get_dot_kiemke(:KhoTaiSan_Id,:KhoQuanLy,:LanKiemKe)',
                                {
                                    replacements: {
                                        KhoTaiSan_Id: KhoTaiSan_Id,
                                        KhoQuanLy: KhoQuanLy,
                                        LanKiemKe: LanKiemKe + 1
                                    },
                                    raw: false
                                }
                            );
                            let DotKiemKe_Id = getDotKiemKe[0]?.id;
                            try {
                                // Lặp qua từng phần tử trong mảng data để insert data kiểm kê
                                for (const item of data) {
                                    try {
                                        await db.Data_KiemKe.create({
                                            STT: item.STT || 0,
                                            DotKiemKe_Id: DotKiemKe_Id,
                                            MaTaiSan: item.MaTaiSan,
                                            MaTaiSanNew: item.MaTaiSanNew,
                                            BenhVien: item.BenhVien,
                                            PhanLoai: item.PhanLoai,
                                            TenTaiSan: item.TenTaiSan,
                                            Model: item.Model,
                                            Serial: item.Serial,
                                            ThoiGianDuaVao: item.ThoiGianDuaVao,
                                            NguyenGia: item.NguyenGia,
                                            Duoc_Id: item.Duoc_Id,
                                            SoLoNhap_Id: item.SoLoNhap_Id,
                                            KhoDuoc_Id: item.KhoDuoc_Id,
                                            ViTri_Id: item.ViTri_Id,
                                            SoLuong: item.SoLuong,
                                            TrangThaiKiemKe: 0,
                                            IsCheckKiemKe: 0,
                                            KhoaPhongSuDung: item.KhoaPhongSuDung,
                                            NguoiSuDung_Id: item.NguoiSuDung_Id,
                                            NguoiSuDung: item.NguoiSuDung,
                                            ViTri: item.ViTri,
                                            GhiChu: item.GhiChu,
                                            KhoaQuanLy: item.KhoaQuanLy,
                                            TenDonViTinh: item.TenDonViTinh,
                                            CheckMaTaiSan: item.CheckMaTaiSan,
                                            NguoiTao: UserId,
                                            NamKiemKe: NamKiemKe,
                                            LanKiemKe: LanKiemKe + 1
                                        });
                                    } catch (error) {
                                        // Nếu xảy ra lỗi, gửi thông báo lỗi về React
                                        console.error("Error converting ngaypo:", error.message);
                                        resolve({
                                            errCode: 1,
                                            errMessage: 'Không thể insert data kiểm kê'
                                        })
                                    }
                                }
                            } catch (error) {
                                console.error(error);
                                return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
                            }
                            if (DotKiemKe_Id_Int) {
                                //console.log('có đợt', DotKiemKe_Id_Int)
                                let getdata = await db.sequelize.query('CALL sp_get_data_kiemke(:KhoTaiSan_Id,:KhoQuanLy,:DotKiemKe_Id_Int)',
                                    {
                                        replacements: {
                                            KhoTaiSan_Id: KhoTaiSan_Id,
                                            KhoQuanLy: KhoQuanLy,
                                            DotKiemKe_Id_Int: DotKiemKe_Id_Int
                                        },
                                        raw: false
                                    }
                                );
                                let getduocdakiem = await db.sequelize.query('CALL sp_get_duocda_kiemke(:KhoQuanLy,:LanKiemKe,:DotKiemKe_Id_Int)',
                                    {
                                        replacements: {
                                            KhoQuanLy: KhoQuanLy,
                                            DotKiemKe_Id_Int: DotKiemKe_Id_Int,
                                            LanKiemKe: LanKiemKe + 1
                                        },
                                        raw: true
                                    }
                                );
                                const plaingetdata = JSON.parse(JSON.stringify(getdata));
                                const plaingetduocdakiem = JSON.parse(JSON.stringify(getduocdakiem));

                                // Chuẩn hóa dữ liệu trong cả hai mảng
                                const int_plaingetdata = plaingetdata.map(item => ({
                                    ...item,
                                    Duoc_Id: parseInt(item.Duoc_Id, 10), // Chuyển Duoc_Id thành số
                                    LanKiemKe: parseInt(item.LanKiemKe, 10), // Chuyển LanKiemKe thành số
                                }));

                                const int_plaingetduocdakiem = plaingetduocdakiem.map(item => ({
                                    ...item,
                                    Duoc_Id: parseInt(item.Duoc_Id, 10), // Chuyển Duoc_Id thành số
                                    LanKiemKe: parseInt(item.LanKiemKe, 10), // Chuyển LanKiemKe thành số
                                }));

                                const ketqua = int_plaingetdata.filter(dataItem =>
                                    int_plaingetduocdakiem.some(checkedItem =>
                                        dataItem.Duoc_Id === checkedItem.Duoc_Id &&
                                        dataItem.LanKiemKe === checkedItem.LanKiemKe
                                    )
                                );

                                if (ketqua.length > 0) {
                                    for (const dataItem of ketqua) {
                                        try {
                                            // Tìm bản ghi theo id
                                            let data = await db.Data_KiemKe.findOne({ where: { id: dataItem.id }, raw: false });

                                            if (data) {
                                                data.TrangThaiChuyen = 1;
                                                await data.save();
                                            } else {
                                            }
                                        } catch (error) {
                                            console.error(`Lỗi khi cập nhật id: ${dataItem.id}`, error);
                                        }
                                    }

                                    let getdatanew = await db.sequelize.query('CALL sp_get_data_kiemke(:KhoTaiSan_Id,:KhoQuanLy,:DotKiemKe_Id_Int)',
                                        {
                                            replacements: {
                                                KhoTaiSan_Id: KhoTaiSan_Id,
                                                KhoQuanLy: KhoQuanLy,
                                                DotKiemKe_Id_Int: DotKiemKe_Id_Int
                                            },
                                            raw: false
                                        }
                                    );
                                    resolve({
                                        errCode: 0,
                                        errMessage: 'Đã đồng bộ tồn tài sản theo kho thành công',
                                        data: getdatanew
                                    })
                                } else {
                                    resolve({
                                        errCode: 0,
                                        errMessage: 'Đã đồng bộ tồn tài sản theo kho thành công',
                                        data: getdata
                                    })
                                }
                            } else {
                                //console.log('không có đợt')
                                let getDotKiemKe = await db.sequelize.query('CALL sp_get_dot_kiemke(:KhoTaiSan_Id,:KhoQuanLy,:LanKiemKe)',
                                    {
                                        replacements: {
                                            KhoTaiSan_Id: KhoTaiSan_Id,
                                            KhoQuanLy: KhoQuanLy,
                                            LanKiemKe: LanKiemKe + 1
                                        },
                                        raw: false
                                    }
                                );
                                const GetDotKiemKe_Id = getDotKiemKe[0]?.id;
                                let DotKiemKe_Id_Int = GetDotKiemKe_Id
                                //console.log('không có đợt', DotKiemKe_Id_Int, KhoTaiSan_Id, KhoQuanLy)
                                let getdata = await db.sequelize.query('CALL sp_get_data_kiemke_khongcodotkiemke(:KhoTaiSan_Id,:KhoQuanLy,:DotKiemKe_Id_Int)',
                                    {
                                        replacements: {
                                            KhoTaiSan_Id: KhoTaiSan_Id,
                                            KhoQuanLy: KhoQuanLy,
                                            DotKiemKe_Id_Int: DotKiemKe_Id_Int
                                        },
                                        raw: false
                                    }
                                );

                                let getduocdakiem = await db.sequelize.query('CALL sp_get_duocda_kiemke(:KhoQuanLy,:LanKiemKe,:DotKiemKe_Id_Int)',
                                    {
                                        replacements: {
                                            KhoQuanLy: KhoQuanLy,
                                            DotKiemKe_Id_Int: DotKiemKe_Id_Int,
                                            LanKiemKe: LanKiemKe + 1
                                        },
                                        raw: true
                                    }
                                );
                                const plaingetdata = JSON.parse(JSON.stringify(getdata));
                                const plaingetduocdakiem = JSON.parse(JSON.stringify(getduocdakiem));

                                // Chuẩn hóa dữ liệu trong cả hai mảng
                                const int_plaingetdata = plaingetdata.map(item => ({
                                    ...item,
                                    Duoc_Id: parseInt(item.Duoc_Id, 10), // Chuyển Duoc_Id thành số
                                    LanKiemKe: parseInt(item.LanKiemKe, 10), // Chuyển LanKiemKe thành số
                                }));

                                const int_plaingetduocdakiem = plaingetduocdakiem.map(item => ({
                                    ...item,
                                    Duoc_Id: parseInt(item.Duoc_Id, 10), // Chuyển Duoc_Id thành số
                                    LanKiemKe: parseInt(item.LanKiemKe, 10), // Chuyển LanKiemKe thành số
                                }));

                                const ketqua = int_plaingetdata.filter(dataItem =>
                                    int_plaingetduocdakiem.some(checkedItem =>
                                        dataItem.Duoc_Id === checkedItem.Duoc_Id &&
                                        dataItem.LanKiemKe === checkedItem.LanKiemKe
                                    )
                                );

                                if (ketqua.length > 0) {
                                    for (const dataItem of ketqua) {
                                        try {
                                            // Tìm bản ghi theo id
                                            let data = await db.Data_KiemKe.findOne({ where: { id: dataItem.id }, raw: false });

                                            if (data) {
                                                data.TrangThaiChuyen = 1;
                                                await data.save();
                                            } else {
                                            }
                                        } catch (error) {
                                            console.error(`Lỗi khi cập nhật id: ${dataItem.id}`, error);
                                        }
                                    }

                                    let getdatanew = await db.sequelize.query('CALL sp_get_data_kiemke_khongcodotkiemke(:KhoTaiSan_Id,:KhoQuanLy,:DotKiemKe_Id_Int)',
                                        {
                                            replacements: {
                                                KhoTaiSan_Id: KhoTaiSan_Id,
                                                KhoQuanLy: KhoQuanLy,
                                                DotKiemKe_Id_Int: DotKiemKe_Id_Int
                                            },
                                            raw: false
                                        }
                                    );
                                    resolve({
                                        errCode: 0,
                                        errMessage: 'Đã đồng bộ tồn tài sản theo kho thành công',
                                        data: getdatanew
                                    })
                                } else {
                                    resolve({
                                        errCode: 0,
                                        errMessage: 'Đã đồng bộ tồn tài sản theo kho thành công',
                                        data: getdata
                                    })
                                }
                            }
                        } else {
                            //console.log('LanKiemKe = null')
                            try {
                                const request = db.sqlhis2Connection.request();
                                request.input('KhoTaiSan_Id', mssql.Int, KhoTaiSan_Id);
                                request.queryTimeout = 60000;
                                const getkhoduoc = await request.execute('[sp_QLPO_GETALL_KHO_ID]');
                                const khoduoc = getkhoduoc.recordset;
                                for (const item of khoduoc) {
                                    try {
                                        await db.Data_DotKiemKe.create({

                                            KhoDuoc_Id: item.KhoTaiSan_Id,
                                            KhoaPhongSuDung: item.TenKho,
                                            KhoaQuanLy: KhoQuanLy,
                                            NguoiTao: UserId,
                                            LanKiemKe: 1
                                        });
                                    } catch (error) {
                                        // Nếu xảy ra lỗi, gửi thông báo lỗi về React
                                        console.error("Error converting ngaypo:", error.message);
                                        resolve({
                                            errCode: 1,
                                            errMessage: 'Không thể insert data kiểm kê'
                                        })
                                    }
                                }
                                let getDotKiemKe = await db.sequelize.query('CALL sp_get_dot_kiemke(:KhoTaiSan_Id,:KhoQuanLy,:LanKiemKe)',
                                    {
                                        replacements: {
                                            KhoTaiSan_Id: KhoTaiSan_Id,
                                            KhoQuanLy: KhoQuanLy,
                                            LanKiemKe: 1
                                        },
                                        raw: false
                                    }
                                );
                                const GetDotKiemKe_Id = getDotKiemKe[0]?.id;
                                //console.log('getDotKiemKe', getDotKiemKe)
                                //console.log('DotKiemKe_Id', DotKiemKe_Id)
                                // Lặp qua từng phần tử trong mảng data để insert data kiểm kê

                                for (const item of data) {
                                    try {
                                        await db.Data_KiemKe.create({
                                            STT: item.STT || 0,
                                            DotKiemKe_Id: GetDotKiemKe_Id,
                                            MaTaiSan: item.MaTaiSan,
                                            MaTaiSanNew: item.MaTaiSanNew,
                                            BenhVien: item.BenhVien,
                                            PhanLoai: item.PhanLoai,
                                            TenTaiSan: item.TenTaiSan,
                                            Model: item.Model,
                                            Serial: item.Serial,
                                            ThoiGianDuaVao: item.ThoiGianDuaVao,
                                            NguyenGia: item.NguyenGia,
                                            Duoc_Id: item.Duoc_Id,
                                            SoLoNhap_Id: item.SoLoNhap_Id,
                                            KhoDuoc_Id: item.KhoDuoc_Id,
                                            ViTri_Id: item.ViTri_Id,
                                            SoLuong: item.SoLuong,
                                            TrangThaiKiemKe: 0,
                                            IsCheckKiemKe: 0,
                                            KhoaPhongSuDung: item.KhoaPhongSuDung,
                                            NguoiSuDung_Id: item.NguoiSuDung_Id,
                                            NguoiSuDung: item.NguoiSuDung,
                                            ViTri: item.ViTri,
                                            GhiChu: item.GhiChu,
                                            KhoaQuanLy: item.KhoaQuanLy,
                                            TenDonViTinh: item.TenDonViTinh,
                                            CheckMaTaiSan: item.CheckMaTaiSan,
                                            NguoiTao: UserId,
                                            NamKiemKe: NamKiemKe,
                                            LanKiemKe: 1
                                        });
                                    } catch (error) {
                                        // Nếu xảy ra lỗi, gửi thông báo lỗi về React
                                        console.error("Error converting ngaypo:", error.message);
                                        resolve({
                                            errCode: 1,
                                            errMessage: 'Không thể insert data kiểm kê'
                                        })
                                    }
                                }
                            } catch (error) {
                                console.error(error);
                                return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
                            }
                            if (DotKiemKe_Id_Int) {
                                //console.log('có đợt', DotKiemKe_Id_Int)
                                let getdata = await db.sequelize.query('CALL sp_get_data_kiemke(:KhoTaiSan_Id,:KhoQuanLy,:DotKiemKe_Id_Int)',
                                    {
                                        replacements: {
                                            KhoTaiSan_Id: KhoTaiSan_Id,
                                            KhoQuanLy: KhoQuanLy,
                                            DotKiemKe_Id_Int: DotKiemKe_Id_Int
                                        },
                                        raw: false
                                    }
                                );

                                let getduocdakiem = await db.sequelize.query('CALL sp_get_duocda_kiemke(:KhoQuanLy,:LanKiemKe,:DotKiemKe_Id_Int)',
                                    {
                                        replacements: {
                                            KhoQuanLy: KhoQuanLy,
                                            DotKiemKe_Id_Int: DotKiemKe_Id_Int,
                                            LanKiemKe: 1
                                        },
                                        raw: true
                                    }
                                );
                                const plaingetdata = JSON.parse(JSON.stringify(getdata));
                                const plaingetduocdakiem = JSON.parse(JSON.stringify(getduocdakiem));

                                // Chuẩn hóa dữ liệu trong cả hai mảng
                                const int_plaingetdata = plaingetdata.map(item => ({
                                    ...item,
                                    Duoc_Id: parseInt(item.Duoc_Id, 10), // Chuyển Duoc_Id thành số
                                    LanKiemKe: parseInt(item.LanKiemKe, 10), // Chuyển LanKiemKe thành số
                                }));

                                const int_plaingetduocdakiem = plaingetduocdakiem.map(item => ({
                                    ...item,
                                    Duoc_Id: parseInt(item.Duoc_Id, 10), // Chuyển Duoc_Id thành số
                                    LanKiemKe: parseInt(item.LanKiemKe, 10), // Chuyển LanKiemKe thành số
                                }));

                                const ketqua = int_plaingetdata.filter(dataItem =>
                                    int_plaingetduocdakiem.some(checkedItem =>
                                        dataItem.Duoc_Id === checkedItem.Duoc_Id &&
                                        dataItem.LanKiemKe === checkedItem.LanKiemKe
                                    )
                                );

                                if (ketqua.length > 0) {
                                    for (const dataItem of ketqua) {
                                        try {
                                            // Tìm bản ghi theo id
                                            let data = await db.Data_KiemKe.findOne({ where: { id: dataItem.id }, raw: false });

                                            if (data) {
                                                data.TrangThaiChuyen = 1;
                                                await data.save();
                                            } else {
                                            }
                                        } catch (error) {
                                            console.error(`Lỗi khi cập nhật id: ${dataItem.id}`, error);
                                        }
                                    }

                                    let getdatanew = await db.sequelize.query('CALL sp_get_data_kiemke(:KhoTaiSan_Id,:KhoQuanLy,:DotKiemKe_Id_Int)',
                                        {
                                            replacements: {
                                                KhoTaiSan_Id: KhoTaiSan_Id,
                                                KhoQuanLy: KhoQuanLy,
                                                DotKiemKe_Id_Int: DotKiemKe_Id_Int
                                            },
                                            raw: false
                                        }
                                    );
                                    resolve({
                                        errCode: 0,
                                        errMessage: 'Đã đồng bộ tồn tài sản theo kho thành công',
                                        data: getdatanew
                                    })
                                } else {
                                    resolve({
                                        errCode: 0,
                                        errMessage: 'Đã đồng bộ tồn tài sản theo kho thành công',
                                        data: getdata
                                    })
                                }
                            } else {
                                //console.log('không có đợt')
                                let getDotKiemKe = await db.sequelize.query('CALL sp_get_dot_kiemke(:KhoTaiSan_Id,:KhoQuanLy,:LanKiemKe)',
                                    {
                                        replacements: {
                                            KhoTaiSan_Id: KhoTaiSan_Id,
                                            KhoQuanLy: KhoQuanLy,
                                            LanKiemKe: 1
                                        },
                                        raw: false
                                    }
                                );
                                const GetDotKiemKe_Id = getDotKiemKe[0]?.id;
                                let DotKiemKe_Id_Int = GetDotKiemKe_Id
                                //console.log('không có đợt', DotKiemKe_Id_Int, KhoTaiSan_Id, KhoQuanLy)
                                let getdata = await db.sequelize.query('CALL sp_get_data_kiemke_khongcodotkiemke(:KhoTaiSan_Id,:KhoQuanLy,:DotKiemKe_Id_Int)',
                                    {
                                        replacements: {
                                            KhoTaiSan_Id: KhoTaiSan_Id,
                                            KhoQuanLy: KhoQuanLy,
                                            DotKiemKe_Id_Int: DotKiemKe_Id_Int
                                        },
                                        raw: false
                                    }
                                );

                                let getduocdakiem = await db.sequelize.query('CALL sp_get_duocda_kiemke(:KhoQuanLy,:LanKiemKe,:DotKiemKe_Id_Int)',
                                    {
                                        replacements: {
                                            KhoQuanLy: KhoQuanLy,
                                            DotKiemKe_Id_Int: DotKiemKe_Id_Int,
                                            LanKiemKe: 1
                                        },
                                        raw: true
                                    }
                                );
                                const plaingetdata = JSON.parse(JSON.stringify(getdata));
                                const plaingetduocdakiem = JSON.parse(JSON.stringify(getduocdakiem));

                                // Chuẩn hóa dữ liệu trong cả hai mảng
                                const int_plaingetdata = plaingetdata.map(item => ({
                                    ...item,
                                    Duoc_Id: parseInt(item.Duoc_Id, 10), // Chuyển Duoc_Id thành số
                                    LanKiemKe: parseInt(item.LanKiemKe, 10), // Chuyển LanKiemKe thành số
                                }));

                                const int_plaingetduocdakiem = plaingetduocdakiem.map(item => ({
                                    ...item,
                                    Duoc_Id: parseInt(item.Duoc_Id, 10), // Chuyển Duoc_Id thành số
                                    LanKiemKe: parseInt(item.LanKiemKe, 10), // Chuyển LanKiemKe thành số
                                }));

                                const ketqua = int_plaingetdata.filter(dataItem =>
                                    int_plaingetduocdakiem.some(checkedItem =>
                                        dataItem.Duoc_Id === checkedItem.Duoc_Id &&
                                        dataItem.LanKiemKe === checkedItem.LanKiemKe
                                    )
                                );

                                if (ketqua.length > 0) {
                                    for (const dataItem of ketqua) {
                                        try {
                                            // Tìm bản ghi theo id
                                            let data = await db.Data_KiemKe.findOne({ where: { id: dataItem.id }, raw: false });

                                            if (data) {
                                                data.TrangThaiChuyen = 1;
                                                await data.save();
                                            } else {
                                            }
                                        } catch (error) {
                                            console.error(`Lỗi khi cập nhật id: ${dataItem.id}`, error);
                                        }
                                    }

                                    let getdatanew = await db.sequelize.query('CALL sp_get_data_kiemke_khongcodotkiemke(:KhoTaiSan_Id,:KhoQuanLy,:DotKiemKe_Id_Int)',
                                        {
                                            replacements: {
                                                KhoTaiSan_Id: KhoTaiSan_Id,
                                                KhoQuanLy: KhoQuanLy,
                                                DotKiemKe_Id_Int: DotKiemKe_Id_Int
                                            },
                                            raw: false
                                        }
                                    );
                                    resolve({
                                        errCode: 0,
                                        errMessage: 'Đã đồng bộ tồn tài sản theo kho thành công',
                                        data: getdatanew
                                    })
                                } else {
                                    resolve({
                                        errCode: 0,
                                        errMessage: 'Đã đồng bộ tồn tài sản theo kho thành công',
                                        data: getdata
                                    })
                                }
                            }
                        }
                        // chú thích ngày 26.11.2024

                        // if (DotKiemKe_Id_Int) {
                        //     console.log('có đợt', DotKiemKe_Id_Int)
                        //     let getdata = await db.sequelize.query('CALL sp_get_data_kiemke(:KhoTaiSan_Id,:KhoQuanLy,:DotKiemKe_Id_Int)',
                        //         {
                        //             replacements: {
                        //                 KhoTaiSan_Id: KhoTaiSan_Id,
                        //                 KhoQuanLy: KhoQuanLy,
                        //                 DotKiemKe_Id_Int: DotKiemKe_Id_Int
                        //             },
                        //             raw: false
                        //         }
                        //     );
                        //     //console.log('getdata', getdata, DotKiemKe_Id_Int)
                        //     resolve({
                        //         errCode: 0,
                        //         //errMessage: 'Không thể insert data kiểm kê',
                        //         data: getdata
                        //     })
                        // } else {
                        //     console.log('không có đợt')
                        //     let getDotKiemKe = await db.sequelize.query('CALL sp_get_dot_kiemke(:KhoTaiSan_Id,:KhoQuanLy,:LanKiemKe)',
                        //         {
                        //             replacements: {
                        //                 KhoTaiSan_Id: KhoTaiSan_Id,
                        //                 KhoQuanLy: KhoQuanLy,
                        //                 LanKiemKe: 1
                        //             },
                        //             raw: false
                        //         }
                        //     );
                        //     const GetDotKiemKe_Id = getDotKiemKe[0]?.id;
                        //     let DotKiemKe_Id_Int = GetDotKiemKe_Id
                        //     //console.log('không có đợt', DotKiemKe_Id_Int, KhoTaiSan_Id, KhoQuanLy)
                        //     let getdata = await db.sequelize.query('CALL sp_get_data_kiemke_khongcodotkiemke(:KhoTaiSan_Id,:KhoQuanLy,:DotKiemKe_Id_Int)',
                        //         {
                        //             replacements: {
                        //                 KhoTaiSan_Id: KhoTaiSan_Id,
                        //                 KhoQuanLy: KhoQuanLy,
                        //                 DotKiemKe_Id_Int: DotKiemKe_Id_Int
                        //             },
                        //             raw: false
                        //         }
                        //     );
                        //     //console.log('getdata DotKiemKe_Id', getdata, DotKiemKe_Id_Int)
                        //     resolve({
                        //         errCode: 0,
                        //         //errMessage: 'Không thể insert data kiểm kê',
                        //         data: getdata
                        //     })
                        // }

                        //resolve(getdata);
                    } else {
                        //console.log('chạy ử đây')
                        resolve({
                            errCode: 0,
                            errMessage: 'Đã load tồn tài sản theo kho thành công',
                            data: datakiemke
                        })
                        //resolve(datakiemke);
                    }
                }
            }
        } catch (e) {
            reject(e)
        }
    })
}


let getTaiSanTheoKhoQL = (KhoSuDung, KhoQuanLy, DotKiemKe_Id) => {
    return new Promise(async (resolve, reject) => {
        try {
            //console.log('DotKiemKe_Id', DotKiemKe_Id)
            const DotKiemKe_Id_Int = Number(DotKiemKe_Id);
            //console.log('DotKiemKe_Id_Int', DotKiemKe_Id_Int)
            let datakiemke = await db.sequelize.query('CALL sp_get_data_kiemke_theokhoaql(:KhoSuDung,:KhoQuanLy,:DotKiemKe_Id_Int)',
                {
                    replacements: {
                        KhoSuDung: KhoSuDung,
                        KhoQuanLy: KhoQuanLy,
                        DotKiemKe_Id_Int: DotKiemKe_Id_Int
                    },
                    raw: false
                }
            );
            //console.log('datakiemke', datakiemke)
            resolve({
                errCode: 0,
                errMessage: 'ok',
                data: datakiemke
            })
            //resolve(datakiemke);
        } catch (e) {
            reject(e)
        }
    })
}


let getMaTaiSanKiemKe = (MaTaiSan, KhoTaiSan_Id, KhoQuanLy, UserId, DotKiemKe_Id, KhoaPhongHienTai) => {
    return new Promise(async (resolve, reject) => {
        try {
            //console.log('MaTaiSan', MaTaiSan,KhoTaiSan_Id,KhoQuanLy)
            const currentTime = new Date();
            let data = await db.sequelize.query('CALL sp_get_data_kiemke_theomataisan(:MaTaiSan,:KhoTaiSan_Id,:KhoQuanLy,:DotKiemKe_Id)',
                {
                    replacements: {
                        MaTaiSan: MaTaiSan,
                        KhoTaiSan_Id: KhoTaiSan_Id,
                        KhoQuanLy: KhoQuanLy,
                        DotKiemKe_Id: DotKiemKe_Id,
                    },
                    raw: false
                }
            );

            let check_khoaphonghientai = await db.sequelize.query('CALL sp_check_dotkiemke(:DotKiemKe_Id)',
                {
                    replacements: {
                        DotKiemKe_Id: DotKiemKe_Id,
                    },
                    raw: false
                }
            );
            const KhoaPhongHienTaiNew = check_khoaphonghientai[0]?.KhoaPhongSuDung;

            //console.log('data.length', data.length)
            if (data.length > 0) {
                const LanKiemKe = data[0]?.LanKiemKe;
                //console.log('checklankiem', checklankiem, KhoTaiSan_Id)
                //console.log('checkdakiem_khackhoa', MaTaiSan, LanKiemKe == null ? 1 : LanKiemKe + 1, KhoQuanLy)
                let checkdakiem_khackhoa = await db.sequelize.query('CALL sp_check_ma_dakiem_khackhoa(:MaTaiSan,:LanKiemKe,:KhoQuanLy)',
                    {
                        replacements: {
                            MaTaiSan: MaTaiSan,
                            LanKiemKe: LanKiemKe == null ? 1 : LanKiemKe,
                            KhoQuanLy: KhoQuanLy,
                        },
                        raw: false
                    }
                );
                const MessageKhoaPhongSuDung = checkdakiem_khackhoa[0]?.KhoaPhongHienTai;
                if (checkdakiem_khackhoa.length > 0) {
                    resolve({
                        errCode: 1,
                        errMessage: `Tài sản đã được kiểm kê tại khoa/phòng ${MessageKhoaPhongSuDung || ''}`
                    })
                } else {
                    for (const item of data) {
                        try {
                            // Tìm bản ghi trong Data_HD theo id
                            let data = await db.Data_KiemKe.findOne({ where: { id: item.id }, raw: false });

                            if (data) {
                                data.IsCheckKiemKe = 1;
                                data.SoLuongThucTe = 1;
                                data.ChenhLech = 1 - item.SoLuong;
                                data.KhoaPhongHienTai = KhoaPhongHienTaiNew;
                                data.NgayKiemKe = currentTime
                                // Lưu thay đổi
                                await data.save();
                            }

                            resolve({ errCode: 0, data: data, errMessage: 'Đã load mã tài sản thành công' });
                        } catch (error) {
                            console.error(`Lỗi khi cập nhật PO có id: ${item.id}`, error);
                        }
                    }
                }
            } else {
                let checkdakiem_theokhoa = await db.sequelize.query('CALL sp_check_ma_dakiem_theokhoa(:MaTaiSan,:KhoTaiSan_Id,:KhoQuanLy,:DotKiemKe_Id)',
                    {
                        replacements: {
                            MaTaiSan: MaTaiSan,
                            KhoTaiSan_Id: KhoTaiSan_Id,
                            KhoQuanLy: KhoQuanLy,
                            DotKiemKe_Id: DotKiemKe_Id
                        },
                        raw: false
                    }
                );
                if (checkdakiem_theokhoa.length > 0) {
                    resolve({
                        errCode: 1,
                        errMessage: 'Tài sản đã được kiêm kê tại khoa'
                    })
                } else {
                    let check_dotkiemke = await db.sequelize.query('CALL sp_check_dotkiemke(:DotKiemKe_Id)',
                        {
                            replacements: {
                                DotKiemKe_Id: DotKiemKe_Id,
                            },
                            raw: false
                        }
                    );
                    const KhoaPhongHienTaiNew = check_dotkiemke[0]?.KhoaPhongSuDung;
                    // KIỂM TRA ĐỢT KIỂM KÊ CÒN KHÔNG CHO TRƯỜNG HỢP ĐÃ XÓA
                    if (check_dotkiemke.length > 0) {
                        //console.log('tìm kiếm khác kho')
                        const ngaytao = new Date();
                        const NamKiemKe = ngaytao.getFullYear();
                        const request = db.sqlhis2Connection.request();
                        request.input('MaTaiSan', mssql.NVarChar(50), MaTaiSan);
                        request.queryTimeout = 60000;
                        const getdata = await request.execute('[sp_QLPO_GETTAISAN_SAIVITRI]');
                        // Lấy dữ liệu từ recordset
                        const data = getdata.recordset;

                        let checklankiem = await db.sequelize.query('CALL sp_checklan_kiemke(:KhoTaiSan_Id,:KhoQuanLy)',
                            {
                                replacements: {
                                    KhoTaiSan_Id: KhoTaiSan_Id,
                                    KhoQuanLy: KhoQuanLy
                                },
                                raw: false
                            }
                        );
                        const LanKiemKe = checklankiem[0]?.LanKiemKe;
                        //console.log('checklankiem', checklankiem, KhoTaiSan_Id)
                        //console.log('checkdakiem_khackhoa', MaTaiSan, LanKiemKe == null ? 1 : LanKiemKe + 1, KhoQuanLy)
                        let checkdakiem_khackhoa = await db.sequelize.query('CALL sp_check_ma_dakiem_khackhoa(:MaTaiSan,:LanKiemKe,:KhoQuanLy)',
                            {
                                replacements: {
                                    MaTaiSan: MaTaiSan,
                                    LanKiemKe: LanKiemKe == null ? 1 : LanKiemKe + 1,
                                    KhoQuanLy: KhoQuanLy,
                                },
                                raw: false
                            }
                        );
                        const MessageKhoaPhongSuDung = checkdakiem_khackhoa[0]?.KhoaPhongHienTai;

                        if (checkdakiem_khackhoa.length > 0) {
                            resolve({
                                errCode: 1,
                                errMessage: `Tài sản đã được kiểm kê tại khoa/phòng ${MessageKhoaPhongSuDung || ''}`
                            })
                        } else {
                            if (data.length > 0) {
                                // Lặp qua từng phần tử trong mảng data để insert data kiểm kê
                                for (const item of data) {
                                    try {
                                        await db.Data_KiemKe.create({
                                            STT: item.STT || 0,
                                            DotKiemKe_Id: DotKiemKe_Id,
                                            MaTaiSan: item.MaTaiSan,
                                            MaTaiSanNew: item.MaTaiSanNew,
                                            BenhVien: item.BenhVien,
                                            PhanLoai: item.PhanLoai,
                                            TenTaiSan: item.TenTaiSan,
                                            Model: item.Model,
                                            Serial: item.Serial,
                                            ThoiGianDuaVao: item.ThoiGianDuaVao,
                                            NguyenGia: item.NguyenGia,
                                            Duoc_Id: item.Duoc_Id,
                                            SoLoNhap_Id: item.SoLoNhap_Id,
                                            KhoDuoc_Id: item.KhoDuoc_Id,
                                            KhoDuocSaiViTri_Id: KhoTaiSan_Id,
                                            ViTri_Id: item.ViTri_Id,
                                            SoLuong: item.SoLuong,
                                            SoLuongThucTe: item.SoLuong,
                                            ChenhLech: 1 - item.SoLuong,
                                            TrangThaiKiemKe: 0,
                                            IsCheckKiemKe: 1,
                                            KhoaPhongSuDung: item.KhoaPhongSuDung,
                                            NguoiSuDung_Id: item.NguoiSuDung_Id,
                                            NguoiSuDung: item.NguoiSuDung,
                                            KhoaPhongHienTai: KhoaPhongHienTaiNew,
                                            ViTri: item.ViTri,
                                            GhiChu: item.GhiChu,
                                            KhoaQuanLy: item.KhoaQuanLy,
                                            TenDonViTinh: item.TenDonViTinh,
                                            CheckMaTaiSan: item.CheckMaTaiSan,
                                            NamKiemKe: NamKiemKe,
                                            NgayKiemKe: currentTime,
                                            LanKiemKe: LanKiemKe == null ? 1 : LanKiemKe + 1,
                                            NguoiTao: UserId
                                        });
                                    } catch (error) {
                                        // Nếu xảy ra lỗi, gửi thông báo lỗi về React
                                        //console.error("Error converting ngaypo:", error.message);
                                        resolve({
                                            errCode: 1,
                                            errMessage: 'Không thể insert data kiểm kê'
                                        })
                                    }
                                }

                                // TÌM XEM MÃ DƯỢC THUỘC PHÒNG BAN NÀO ĐỂ CẬP NHẠP LẠI TRẠNG THÁI CHUYỂN
                                const DotKiemKe_Id_Int = Number(DotKiemKe_Id);

                                let getdata = await db.sequelize.query('CALL sp_get_data_kiemke(:KhoTaiSan_Id,:KhoQuanLy,:DotKiemKe_Id_Int)',
                                    {
                                        replacements: {
                                            KhoTaiSan_Id: KhoTaiSan_Id,
                                            KhoQuanLy: KhoQuanLy,
                                            DotKiemKe_Id_Int: DotKiemKe_Id_Int
                                        },
                                        raw: false
                                    }
                                );

                                let getduocdakiem = await db.sequelize.query('CALL sp_get_duocda_kiemke(:KhoQuanLy,:LanKiemKe,:DotKiemKe_Id_Int)',
                                    {
                                        replacements: {
                                            KhoQuanLy: KhoQuanLy,
                                            DotKiemKe_Id_Int: DotKiemKe_Id_Int,
                                            LanKiemKe: LanKiemKe == null ? 1 : LanKiemKe + 1,
                                        },
                                        raw: true
                                    }
                                );
                                const plaingetdata = JSON.parse(JSON.stringify(getdata));
                                const plaingetduocdakiem = JSON.parse(JSON.stringify(getduocdakiem));

                                // Chuẩn hóa dữ liệu trong cả hai mảng
                                const int_plaingetdata = plaingetdata.map(item => ({
                                    ...item,
                                    Duoc_Id: parseInt(item.Duoc_Id, 10), // Chuyển Duoc_Id thành số
                                    LanKiemKe: parseInt(item.LanKiemKe, 10), // Chuyển LanKiemKe thành số
                                }));

                                const int_plaingetduocdakiem = plaingetduocdakiem.map(item => ({
                                    ...item,
                                    Duoc_Id: parseInt(item.Duoc_Id, 10), // Chuyển Duoc_Id thành số
                                    LanKiemKe: parseInt(item.LanKiemKe, 10), // Chuyển LanKiemKe thành số
                                }));

                                const ketqua = int_plaingetduocdakiem.filter(dataItem =>
                                    int_plaingetdata.some(checkedItem =>
                                        dataItem.Duoc_Id === checkedItem.Duoc_Id &&
                                        dataItem.LanKiemKe === checkedItem.LanKiemKe
                                    )
                                );

                                if (ketqua.length > 0) {
                                    for (const dataItem of ketqua) {
                                        try {
                                            // Tìm bản ghi theo id
                                            let data = await db.Data_KiemKe.findOne({ where: { id: dataItem.id }, raw: false });

                                            if (data) {
                                                data.TrangThaiChuyen = 1;
                                                await data.save();
                                            } else {
                                            }
                                        } catch (error) {
                                            console.error(`Lỗi khi cập nhật id: ${dataItem.id}`, error);
                                        }
                                    }

                                    resolve({ errCode: 0, data: data, errMessage: 'Đã load mã tài sản thành công' });
                                } else {
                                    resolve({ errCode: 0, data: data, errMessage: 'Đã load mã tài sản thành công' });
                                }
                                // resolve({ errCode: 0, data: data, errMessage: 'Đã load mã tài sản thành công' });
                            } else {
                                resolve({ errCode: 1, data: data, errMessage: 'Không tìm thấy mã tài sản' });
                            }
                        }
                        //console.log('data', data.length)
                    } else {
                        resolve({
                            errCode: 1,
                            errMessage: 'Đợt kiểm kê đã xóa. Vui lòng load lại dữ liệu mới'
                        })
                    }
                }
            }
            // console.log('data', data)
            //resolve(datakiemke);
        } catch (e) {
            reject(e)
        }
    })
}

let getSerialKiemKe = (Serial, KhoTaiSan_Id, KhoQuanLy, UserId, DotKiemKe_Id, KhoaPhongHienTai) => {
    return new Promise(async (resolve, reject) => {
        try {
            //console.log('MaTaiSan', Serial, KhoTaiSan_Id, KhoQuanLy, UserId, DotKiemKe_Id)
            const currentTime = new Date();
            const currentYear = currentTime.getFullYear();
            let data = await db.sequelize.query('CALL sp_get_data_kiemke_theoserial(:Serial,:KhoTaiSan_Id,:KhoQuanLy,:DotKiemKe_Id)',
                {
                    replacements: {
                        Serial: Serial,
                        KhoTaiSan_Id: KhoTaiSan_Id,
                        KhoQuanLy: KhoQuanLy,
                        DotKiemKe_Id: DotKiemKe_Id
                    },
                    raw: false
                }
            );
            let check_khoaphonghientai = await db.sequelize.query('CALL sp_check_dotkiemke(:DotKiemKe_Id)',
                {
                    replacements: {
                        DotKiemKe_Id: DotKiemKe_Id,
                    },
                    raw: false
                }
            );
            const KhoaPhongHienTaiNew = check_khoaphonghientai[0]?.KhoaPhongSuDung;
            //console.log('data.length', data.length)
            if (data.length > 0) {
                const LanKiemKe = data[0]?.LanKiemKe;
                //console.log('checklankiem', checklankiem, KhoTaiSan_Id)
                //console.log('checkdakiem_khackhoa', MaTaiSan, LanKiemKe == null ? 1 : LanKiemKe + 1, KhoQuanLy)
                let checkdakiem_khackhoa = await db.sequelize.query('CALL sp_check_serial_dakiem_khackhoa(:Serial,:LanKiemKe,:KhoQuanLy)',
                    {
                        replacements: {
                            Serial: Serial,
                            LanKiemKe: LanKiemKe == null ? 1 : LanKiemKe,
                            KhoQuanLy: KhoQuanLy,
                        },
                        raw: false
                    }
                );
                const MessageKhoaPhongSuDung = checkdakiem_khackhoa[0]?.KhoaPhongHienTai;
                if (checkdakiem_khackhoa.length > 0) {
                    resolve({
                        errCode: 1,
                        errMessage: `Tài sản đã được kiểm kê tại khoa/phòng ${MessageKhoaPhongSuDung || ''}`
                    })
                } else {
                    for (const item of data) {
                        try {
                            // Tìm bản ghi trong Data_HD theo id
                            let data = await db.Data_KiemKe.findOne({ where: { id: item.id }, raw: false });

                            if (data) {
                                data.IsCheckKiemKe = 1;
                                data.SoLuongThucTe = 1;
                                data.ChenhLech = 1 - item.SoLuong;
                                data.KhoaPhongHienTai = KhoaPhongHienTaiNew;
                                data.NgayKiemKe = currentTime
                                // Lưu thay đổi
                                await data.save();
                            }

                            resolve({ errCode: 0, data: data, errMessage: 'Đã load Serial tài sản thành công' });
                        } catch (error) {
                            console.error(`Lỗi khi cập nhật PO có id: ${item.id}`, error);
                        }
                    }
                }
            } else {

                let checkdakiem_theokhoa = await db.sequelize.query('CALL sp_check_serial_dakiem_theokhoa(:Serial,:KhoTaiSan_Id,:KhoQuanLy,:DotKiemKe_Id)',
                    {
                        replacements: {
                            Serial: Serial,
                            KhoTaiSan_Id: KhoTaiSan_Id,
                            KhoQuanLy: KhoQuanLy,
                            DotKiemKe_Id: DotKiemKe_Id
                        },
                        raw: false
                    }
                );
                if (checkdakiem_theokhoa.length > 0) {
                    resolve({
                        errCode: 1,
                        errMessage: 'Tài sản đã được kiểm kê tại khoa'
                    })
                } else {
                    let check_dotkiemke = await db.sequelize.query('CALL sp_check_dotkiemke(:DotKiemKe_Id)',
                        {
                            replacements: {
                                DotKiemKe_Id: DotKiemKe_Id,
                            },
                            raw: false
                        }
                    );
                    const KhoaPhongHienTaiNew = check_dotkiemke[0]?.KhoaPhongSuDung;
                    if (check_dotkiemke.length > 0) {
                        const ngaytao = new Date();
                        const request = db.sqlhis2Connection.request();
                        request.input('Serial', mssql.NVarChar(50), Serial);
                        request.queryTimeout = 60000;
                        const getdata = await request.execute('[sp_QLPO_GETTAISAN_SAIVITRI_THEO_SERIAL]');
                        // Lấy dữ liệu từ recordset
                        const data = getdata.recordset;
                        let checklankiem = await db.sequelize.query('CALL sp_checklan_kiemke(:KhoTaiSan_Id,:KhoQuanLy)',
                            {
                                replacements: {
                                    KhoTaiSan_Id: KhoTaiSan_Id,
                                    KhoQuanLy: KhoQuanLy
                                },
                                raw: false
                            }
                        );
                        const LanKiemKe = checklankiem[0]?.LanKiemKe;

                        //console.log('checklankiem', checklankiem, KhoTaiSan_Id)
                        //console.log('checkdakiem_khackhoa', MaTaiSan, LanKiemKe == null ? 1 : LanKiemKe + 1, KhoQuanLy)
                        let checkdakiem_khackhoa = await db.sequelize.query('CALL sp_check_serial_dakiem_khackhoa(:Serial,:LanKiemKe,:KhoQuanLy)',
                            {
                                replacements: {
                                    Serial: Serial,
                                    LanKiemKe: LanKiemKe == null ? 1 : LanKiemKe,
                                    KhoQuanLy: KhoQuanLy,
                                },
                                raw: false
                            }
                        );
                        const MessageKhoaPhongSuDung = checkdakiem_khackhoa[0]?.KhoaPhongHienTai;
                        if (checkdakiem_khackhoa.length > 0) {
                            resolve({
                                errCode: 1,
                                errMessage: `Tài sản đã được kiểm kê tại khoa/phòng ${MessageKhoaPhongSuDung || ''}`
                            })
                        } else {
                            if (data.length > 0) {
                                // Lặp qua từng phần tử trong mảng data để insert data kiểm kê
                                for (const item of data) {
                                    try {
                                        await db.Data_KiemKe.create({
                                            STT: item.STT || 0,
                                            DotKiemKe_Id: DotKiemKe_Id,
                                            MaTaiSan: item.MaTaiSan,
                                            MaTaiSanNew: item.MaTaiSanNew,
                                            BenhVien: item.BenhVien,
                                            PhanLoai: item.PhanLoai,
                                            TenTaiSan: item.TenTaiSan,
                                            Model: item.Model,
                                            Serial: item.Serial,
                                            ThoiGianDuaVao: item.ThoiGianDuaVao,
                                            NguyenGia: item.NguyenGia,
                                            Duoc_Id: item.Duoc_Id,
                                            SoLoNhap_Id: item.SoLoNhap_Id,
                                            KhoDuoc_Id: item.KhoDuoc_Id,
                                            KhoDuocSaiViTri_Id: KhoTaiSan_Id,
                                            ViTri_Id: item.ViTri_Id,
                                            SoLuong: item.SoLuong,
                                            TrangThaiKiemKe: 0,
                                            IsCheckKiemKe: 1,
                                            KhoaPhongSuDung: item.KhoaPhongSuDung,
                                            NguoiSuDung_Id: item.NguoiSuDung_Id,
                                            NguoiSuDung: item.NguoiSuDung,
                                            KhoaPhongHienTai: KhoaPhongHienTaiNew,
                                            ViTri: item.ViTri,
                                            GhiChu: item.GhiChu,
                                            KhoaQuanLy: item.KhoaQuanLy,
                                            TenDonViTinh: item.TenDonViTinh,
                                            CheckMaTaiSan: item.CheckMaTaiSan,
                                            SoLuongThucTe: 1,
                                            ChenhLech: 1 - item.SoLuong,
                                            NgayKiemKe: currentTime,
                                            NamKiemKe: currentYear,
                                            LanKiemKe: LanKiemKe == null ? 1 : LanKiemKe + 1,
                                            NguoiTao: UserId,
                                        });
                                    } catch (error) {
                                        resolve({
                                            errCode: 1,
                                            errMessage: 'Không thể insert data kiểm kê'
                                        })
                                    }
                                }
                                // TÌM XEM MÃ DƯỢC THUỘC PHÒNG BAN NÀO ĐỂ CẬP NHẠP LẠI TRẠNG THÁI CHUYỂN
                                const DotKiemKe_Id_Int = Number(DotKiemKe_Id);

                                let getdata = await db.sequelize.query('CALL sp_get_data_kiemke(:KhoTaiSan_Id,:KhoQuanLy,:DotKiemKe_Id_Int)',
                                    {
                                        replacements: {
                                            KhoTaiSan_Id: KhoTaiSan_Id,
                                            KhoQuanLy: KhoQuanLy,
                                            DotKiemKe_Id_Int: DotKiemKe_Id_Int
                                        },
                                        raw: false
                                    }
                                );

                                let getduocdakiem = await db.sequelize.query('CALL sp_get_duocda_kiemke(:KhoQuanLy,:LanKiemKe,:DotKiemKe_Id_Int)',
                                    {
                                        replacements: {
                                            KhoQuanLy: KhoQuanLy,
                                            DotKiemKe_Id_Int: DotKiemKe_Id_Int,
                                            LanKiemKe: LanKiemKe == null ? 1 : LanKiemKe + 1,
                                        },
                                        raw: true
                                    }
                                );
                                const plaingetdata = JSON.parse(JSON.stringify(getdata));
                                const plaingetduocdakiem = JSON.parse(JSON.stringify(getduocdakiem));

                                // Chuẩn hóa dữ liệu trong cả hai mảng
                                const int_plaingetdata = plaingetdata.map(item => ({
                                    ...item,
                                    Duoc_Id: parseInt(item.Duoc_Id, 10), // Chuyển Duoc_Id thành số
                                    LanKiemKe: parseInt(item.LanKiemKe, 10), // Chuyển LanKiemKe thành số
                                }));

                                const int_plaingetduocdakiem = plaingetduocdakiem.map(item => ({
                                    ...item,
                                    Duoc_Id: parseInt(item.Duoc_Id, 10), // Chuyển Duoc_Id thành số
                                    LanKiemKe: parseInt(item.LanKiemKe, 10), // Chuyển LanKiemKe thành số
                                }));

                                const ketqua = int_plaingetduocdakiem.filter(dataItem =>
                                    int_plaingetdata.some(checkedItem =>
                                        dataItem.Duoc_Id === checkedItem.Duoc_Id &&
                                        dataItem.LanKiemKe === checkedItem.LanKiemKe
                                    )
                                );

                                if (ketqua.length > 0) {
                                    for (const dataItem of ketqua) {
                                        try {
                                            // Tìm bản ghi theo id
                                            let data = await db.Data_KiemKe.findOne({ where: { id: dataItem.id }, raw: false });

                                            if (data) {
                                                data.TrangThaiChuyen = 1;
                                                await data.save();
                                            } else {
                                            }
                                        } catch (error) {
                                            console.error(`Lỗi khi cập nhật id: ${dataItem.id}`, error);
                                        }
                                    }

                                    resolve({ errCode: 0, data: data, errMessage: 'Đã load mã tài sản thành công' });
                                } else {
                                    resolve({ errCode: 0, data: data, errMessage: 'Đã load mã tài sản thành công' });
                                }

                                //resolve({ errCode: 0, data: data, errMessage: 'Đã load Serial tài sản thành công' });
                            } else {
                                resolve({ errCode: 1, data: data, errMessage: 'Không tìm thấy Serial tài sản' });
                            }
                        }
                    } else {
                        resolve({
                            errCode: 1,
                            errMessage: 'Đợt kiểm kê đã xóa. Vui lòng load lại dữ liệu mới'
                        })
                    }
                }
            }
        } catch (e) {
            reject(e)
        }
    })
}

// xử lý check lại nhập ncc đã đúng chưa
let getCheckMaChungTu = (machungtu, UserId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const ngaytao = new Date();
            const request = db.sqlhis2Connection.request();
            request.input('machungtu', mssql.NVarChar(50), machungtu);
            const getdata = await request.execute('[sp_QLPO_GETCHUNGTUNHAPNCC_DNK]');
            // Lấy dữ liệu từ recordset
            const recordset = getdata.recordset;
            const data = recordset[0];

            if (recordset.length > 0) {
                let check_log_chungtu = await db.Check_Data_ChungTu_Log.findAll({
                    //attributes: ['SoBenhAn'],
                    where: {
                        machungtu: data.machungtu,
                    },
                    raw: true
                });

                let check_log_hopdong = await db.Check_Data_ChungTu_Hd_Log.findAll({
                    //attributes: ['SoBenhAn'],
                    where: {
                        machungtu: data.machungtu,
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
                if (data.trangthai !== 'PNCNK') {
                    if (data.sopo === null) {
                        resolve({
                            errCode: 1,
                            errMessage: 'Kiểm tra lại phiếu nhập NCC chưa có số PO'
                        })
                    } else {
                        if (check_log_chungtu.length === 0 && check_log_hopdong.length === 0) {
                            let soPO = data.sopo
                            //GỌI HÀM getSoPO kiểm tra PO-PR
                            //await getSoPO(soPO, UserId);

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

                            let getpodata = await db.Data_PO.findAll({
                                //attributes: ['SoBenhAn'],
                                where: {
                                    sopo: data.sopo,
                                },
                                raw: true
                            });

                            // Sử dụng reduce để nhóm theo mataisan và sopo, sau đó tính tổng soluongpo
                            let getpo = Object.values(getpodata.reduce((acc, item) => {
                                const key = `${item.mataisan}-${item.sopo}`; // Tạo khóa dựa trên mataisan và sopo
                                if (!acc[key]) {
                                    acc[key] = { ...item, soluongpo: 0 }; // Khởi tạo đối tượng trong nhóm
                                }
                                acc[key].soluongpo += item.soluongpo; // Tính tổng soluongpo
                                return acc;
                            }, {}));

                            // Vòng lặp tìm các phần tử trùng khớp giữa recordset và getpo
                            getpo = getpo.map(poItem => {
                                const recordItem = recordset.find(
                                    record =>
                                        record.sopo === poItem.sopo && record.mataisan === poItem.mataisan
                                );

                                if (recordItem) {
                                    poItem.soluongdanhap2 = poItem.soluongdanhap2 !== null ? poItem.soluongdanhap2 : 0;
                                    // Tính toán sự chênh lệch
                                    poItem.soluongnhap2 = recordItem.soluongnhap + poItem.soluongdanhap2 - poItem.soluongpo;
                                    poItem.dongianhap2 = recordItem.dongianhap - poItem.dongiapo;
                                    poItem.dongiavatnhap2 = recordItem.dongianhapvat - poItem.dongiapovat;
                                    poItem.soluongdanhap2 = recordItem.soluongnhap + poItem.soluongdanhap2;
                                    poItem.checkmataisanvoict2 = null;
                                } else {
                                    // Điều kiện thứ nhất: Trùng sopo nhưng khác mataisan
                                    const recordWithSameSopo = recordset.find(
                                        record => record.sopo === poItem.sopo && record.mataisan !== poItem.mataisan
                                    );

                                    // Điều kiện thứ hai: mataisan không có trong recordset
                                    const recordWithDifferentMataisan = !recordset.find(
                                        record => record.sopo === poItem.sopo && record.mataisan === poItem.mataisan
                                    );

                                    // Nếu có record trùng sopo nhưng khác mataisan hoặc mataisan không có trong recordset
                                    if (recordWithSameSopo || recordWithDifferentMataisan) {
                                        poItem.checkmataisanvoict2 = 1;
                                    }
                                }

                                return poItem;
                            });//.filter(poItem => poItem.soluongnhap !== null && poItem.dongianhap !== null && poItem.dongiavatnhap !== null);

                            //console.log('getpo', getpo);

                            for (const item of getpo) {
                                try {
                                    // Tìm bản ghi trong Data_PO theo id
                                    let data = await db.Data_PO.findOne({ where: { id: item.id }, raw: false });

                                    if (data) {
                                        if (item.checkmataisanvoict2 === 1 && item.checkma !== null) {
                                            // Chỉ cập nhật trường check
                                            data.checkmataisanvoict2 = item.checkmataisanvoict2;

                                            // Lưu thay đổi
                                            await data.save();
                                        } else {
                                            // Cập nhật các thông tin theo từng mục
                                            data.soluongnhap2 = item.soluongnhap2;
                                            data.dongianhap2 = item.dongianhap2;
                                            data.dongiavatnhap2 = item.dongiavatnhap2;
                                            data.soluongdanhap2 = item.soluongdanhap2;
                                            data.checkmataisanvoict2 = null;
                                            data.dacheckvoict2 = 1;
                                            //data.ngaykiemtra = ngaytao

                                            // Lưu thay đổi
                                            await data.save();
                                        }
                                    }
                                } catch (error) {
                                    console.error(`Lỗi khi cập nhật PO có id: ${item.id}`, error);
                                }
                            }


                            // Dò tìm và thêm id_data_hd từ gethd vào recordset
                            recordset.forEach(record => {
                                const found = getpo.find(
                                    po => po.sopo === record.sopo && po.mataisan === record.mataisan
                                );

                                if (found) {
                                    record.id_data_po = found.id;
                                    record.soluongnhap_check = found.soluongnhap2;
                                    record.dongianhap_check = found.dongianhap2;
                                    record.dongianhapvat_check = found.dongiavatnhap2;
                                }
                            });

                            //console.log('check_log_chungtu', check_log_chungtu)
                            if (check_log_chungtu.length > 0) {
                                for (const record of check_log_chungtu) {
                                    try {
                                        // Xóa bản ghi theo ID
                                        await db.Check_Data_ChungTu_Log.destroy({
                                            where: { id: record.id }
                                        });
                                    } catch (error) {
                                        console.error(`Lỗi khi xóa dữ liệu với ID ${record.id}:`, error);
                                    }
                                }
                                try {
                                    // insert lại thông tin mới    
                                    for (const item of recordset) {
                                        await db.Check_Data_ChungTu_Log.create({
                                            id_data_po: item.id_data_po,
                                            mataisan: item.mataisan,
                                            tentaisan: item.tentaisan,
                                            soluongnhap_check: item.soluongnhap_check,
                                            dongianhap_check: item.dongianhap_check,
                                            dongianhapvat_check: item.dongianhapvat_check,
                                            machungtu: item.machungtu,
                                            sopo: item.sopo,
                                            trangthai: item.trangthai,
                                            nhacungcap_id: item.nhacungcap_id,
                                            tennhacungcap: item.tennhacungcap,
                                            chungtu_id: item.chungtu_id,
                                            ngaychungtu: item.ngaychungtu,
                                            khonhap: item.khonhap,
                                            nguoinhap: item.nguoinhap,
                                            soluongnhap: item.soluongnhap,
                                            dongianhap: item.dongianhap,
                                            dongianhapvat: item.dongianhapvat,
                                            vatnhap: item.vatnhap,
                                            thanhtiennhap: item.soluongnhap * item.dongianhap,
                                            thanhtiennhapvat: item.soluongnhap * item.dongianhapvat,
                                            nguoinhap: item.nguoinhap,
                                            nguoikiemtra_id: UserId,
                                            ngaykiemtra: ngaytao,
                                        });
                                    }
                                } catch (error) {
                                    console.error("Lỗi khi insert vào DB:", error);
                                }

                                //SO SÁNH LẦN CHECK LOG CT 1 VÀ CHECK LOG CT 2 ĐỀ TÌM RA KHÁC NHAU
                                const { Op } = require('sequelize');
                                let data_check_log_chungtu = await db.Check_Data_ChungTu_Log.findAll({
                                    attributes: ['id', 'id_data_po', 'mataisan', 'soluongnhap_check', 'dongianhap_check', 'dongianhapvat_check'],
                                    where: {
                                        machungtu: data.machungtu,
                                        id_data_po: {
                                            [Op.ne]: null,  // Điều kiện id_data_po khác null
                                        }
                                    },
                                    raw: true
                                });

                                let data_log_chungtu = await db.Data_ChungTu_Log.findAll({
                                    attributes: ['id_data_po', 'mataisan', 'soluongnhap_check', 'dongianhap_check', 'dongianhapvat_check'],
                                    where: {
                                        machungtu: data.machungtu,
                                        id_data_po: {
                                            [Op.ne]: null,  // Điều kiện id_data_po khác null
                                        }
                                    },
                                    raw: true
                                });
                                //console.log('data_check_log_chungtu', data_check_log_chungtu)
                                //console.log('data_log_chungtu', data_log_chungtu)

                                let result = data_check_log_chungtu.map(itemCheck => {
                                    let matchedItem = data_log_chungtu.find(itemLog =>
                                        itemLog.id_data_po === itemCheck.id_data_po && itemLog.mataisan === itemCheck.mataisan
                                    );

                                    if (matchedItem) {
                                        return {
                                            id: itemCheck.id,
                                            id_data_po: itemCheck.id_data_po,
                                            mataisan: itemCheck.mataisan,
                                            check_soluongnhap: itemCheck.soluongnhap_check === matchedItem.soluongnhap_check ? 1 : 0,
                                            check_dongianhap: itemCheck.dongianhap_check === matchedItem.dongianhap_check ? 1 : 0,
                                            check_dongianhapvat: itemCheck.dongianhapvat_check === matchedItem.dongianhapvat_check ? 1 : 0,
                                        };
                                    }

                                    return null;
                                }).filter(item => item !== null);

                                //console.log('result', result);
                                for (const item of result) {
                                    try {
                                        // Tìm bản ghi trong Data_PO theo id
                                        let data = await db.Check_Data_ChungTu_Log.findOne({ where: { id: item.id }, raw: false });

                                        if (data) {
                                            // Cập nhật các thông tin theo từng mục
                                            data.check_soluongnhap = item.check_soluongnhap;
                                            data.check_dongianhap = item.check_dongianhap;
                                            data.check_dongianhapvat = item.check_dongianhapvat;
                                            // Lưu thay đổi
                                            await data.save();
                                        }
                                    } catch (error) {
                                        console.error(`Lỗi khi cập nhật PO có id: ${item.id}`, error);
                                    }
                                }
                            } else {
                                try {
                                    for (const item of recordset) {
                                        await db.Check_Data_ChungTu_Log.create({
                                            id_data_po: item.id_data_po,
                                            mataisan: item.mataisan,
                                            tentaisan: item.tentaisan,
                                            soluongnhap_check: item.soluongnhap_check,
                                            dongianhap_check: item.dongianhap_check,
                                            dongianhapvat_check: item.dongianhapvat_check,
                                            machungtu: item.machungtu,
                                            sopo: item.sopo,
                                            trangthai: item.trangthai,
                                            nhacungcap_id: item.nhacungcap_id,
                                            tennhacungcap: item.tennhacungcap,
                                            chungtu_id: item.chungtu_id,
                                            ngaychungtu: item.ngaychungtu,
                                            khonhap: item.khonhap,
                                            nguoinhap: item.nguoinhap,
                                            soluongnhap: item.soluongnhap,
                                            dongianhap: item.dongianhap,
                                            dongianhapvat: item.dongianhapvat,
                                            vatnhap: item.vatnhap,
                                            thanhtiennhap: item.soluongnhap * item.dongianhap,
                                            thanhtiennhapvat: item.soluongnhap * item.dongianhapvat,
                                            nguoinhap: item.nguoinhap,
                                            nguoikiemtra_id: UserId,
                                            ngaykiemtra: ngaytao,
                                        });
                                    }

                                } catch (error) {
                                    console.error("Lỗi khi insert vào DB:", error);
                                }

                                //SO SÁNH LẦN CHECK LOG CT 1 VÀ CHECK LOG CT 2 ĐỀ TÌM RA KHÁC NHAU
                                const { Op } = require('sequelize');
                                let data_check_log_chungtu = await db.Check_Data_ChungTu_Log.findAll({
                                    attributes: ['id', 'id_data_po', 'mataisan', 'soluongnhap_check', 'dongianhap_check', 'dongianhapvat_check'],
                                    where: {
                                        machungtu: data.machungtu,
                                        id_data_po: {
                                            [Op.ne]: null,  // Điều kiện id_data_po khác null
                                        }
                                    },
                                    raw: true
                                });

                                let data_log_chungtu = await db.Data_ChungTu_Log.findAll({
                                    attributes: ['id_data_po', 'mataisan', 'soluongnhap_check', 'dongianhap_check', 'dongianhapvat_check'],
                                    where: {
                                        machungtu: data.machungtu,
                                        id_data_po: {
                                            [Op.ne]: null,  // Điều kiện id_data_po khác null
                                        }
                                    },
                                    raw: true
                                });
                                //console.log('data_check_log_chungtu', data_check_log_chungtu)
                                //console.log('data_log_chungtu', data_log_chungtu)

                                let result = data_check_log_chungtu.map(itemCheck => {
                                    let matchedItem = data_log_chungtu.find(itemLog =>
                                        itemLog.id_data_po === itemCheck.id_data_po && itemLog.mataisan === itemCheck.mataisan
                                    );

                                    if (matchedItem) {
                                        return {
                                            id: itemCheck.id,
                                            id_data_po: itemCheck.id_data_po,
                                            mataisan: itemCheck.mataisan,
                                            check_soluongnhap: itemCheck.soluongnhap_check === matchedItem.soluongnhap_check ? 1 : 0,
                                            check_dongianhap: itemCheck.dongianhap_check === matchedItem.dongianhap_check ? 1 : 0,
                                            check_dongianhapvat: itemCheck.dongianhapvat_check === matchedItem.dongianhapvat_check ? 1 : 0,
                                        };
                                    }

                                    return null;
                                }).filter(item => item !== null);

                                //console.log('result', result);
                                for (const item of result) {
                                    try {
                                        // Tìm bản ghi trong Data_PO theo id
                                        let data = await db.Check_Data_ChungTu_Log.findOne({ where: { id: item.id }, raw: false });

                                        if (data) {
                                            // Cập nhật các thông tin theo từng mục
                                            data.check_soluongnhap = item.check_soluongnhap;
                                            data.check_dongianhap = item.check_dongianhap;
                                            data.check_dongianhapvat = item.check_dongianhapvat;
                                            // Lưu thay đổi
                                            await data.save();
                                        }
                                    } catch (error) {
                                        console.error(`Lỗi khi cập nhật PO có id: ${item.id}`, error);
                                    }
                                }
                            }

                            // insert data chứng từ 
                            try {
                                for (const item of recordset) {
                                    await db.Check_Data_ChungTu.create({
                                        chungtu_id: item.chungtu_id,
                                        machungtu: item.machungtu,
                                        ngaychungtu: item.ngaychungtu,
                                        mataisan: item.mataisan,
                                        tentaisan: item.tentaisan,
                                        donvitinh: item.donvitinh,
                                        soluongnhap: item.soluongnhap,
                                        dongianhap: item.dongianhap,
                                        thanhtiennhap: item.soluongnhap * item.dongianhap,
                                        vatnhap: item.vatnhap,
                                        dongianhapvat: item.dongianhapvat,
                                        thanhtiennhapvat: item.soluongnhap * item.dongianhapvat,
                                        nhacungcap_id: item.nhacungcap_id,
                                        tennhacungcap: item.tennhacungcap,
                                        khonhap: item.khonhap,
                                        nguoinhap: item.nguoinhap,
                                        sopo: item.sopo,
                                        trangthai: item.trangthai,
                                    });
                                }
                            } catch (error) {
                                console.error("Lỗi khi insert vào DB:", error);
                            }

                            //GỌI HÀM GETCHUNGTU ĐỂ check HĐ VỚI CHỨNG TỪ
                            await getCheckChungTu(machungtu, UserId);

                            resolve({
                                errCode: 0,
                                errMessage: 'Kiểm tra dữ liệu thành công'
                            })
                        } else {
                            resolve({
                                errCode: 1,
                                errMessage: 'Chứng từ đã kiểm tra, vui lòng xóa log để kiểm tra lại'
                            })
                        }
                    }
                } else {
                    resolve({
                        errCode: 1,
                        errMessage: 'Chứng từ chưa nhập kho'
                    })
                }
            } else {
                resolve({
                    errCode: 1,
                    errMessage: 'Mã chứng từ không tồn tại'
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

let updateMaTaiSan = (mataisan, nhacungcap_id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let check_mataisan_dm = await db.Data_HD.findAll({
                where: {
                    mataisan: mataisan,
                    nhacungcap_id: nhacungcap_id,
                    checkten: 1,
                },
                raw: true
            });
            resolve(check_mataisan_dm);
            //console.log('check_mataisan_dm', check_mataisan_dm)
        } catch (e) {
            reject(e)
        }
    })
}

let updateMaVaTenHD = (mataisan, nhacungcap_id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let check_mataisan_dm = await db.Data_HD.findAll({
                where: {
                    mataisan: mataisan,
                    nhacungcap_id: nhacungcap_id,
                },
                raw: true
            });
            resolve(check_mataisan_dm);
            //console.log('check_mataisan_dm', check_mataisan_dm)
        } catch (e) {
            reject(e)
        }
    })
}

let updateMaTaiSanPR = (mataisan, sopr) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { Op } = require("sequelize");
            let check_mataisan_dm = await db.Data_PR.findAll({
                where: {
                    mataisan: mataisan,
                    sopr: sopr,
                    [Op.or]: [
                        { checkten: 1 },
                        { checkten: 0 }
                    ]
                    //checkten: 1,
                },
                raw: true
            });
            //console.log('check_mataisan_dm', check_mataisan_dm)
            resolve(check_mataisan_dm);

        } catch (e) {
            reject(e)
        }
    })
}

let updateMaTaiSanPRNew = (mataisan, sopr) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { Op } = require("sequelize");
            let check_mataisan_dm = await db.Data_PR.findAll({
                where: {
                    mataisan: mataisan,
                    sopr: sopr,
                    checkten: 1,
                },
                raw: true
            });
            //console.log('check_mataisan_dm', check_mataisan_dm)
            resolve(check_mataisan_dm);

        } catch (e) {
            reject(e)
        }
    })
}

let updateMaVaTenPR = (mataisan, sopr) => {
    return new Promise(async (resolve, reject) => {
        try {
            let check_mataisan_dm = await db.Data_PR.findAll({
                where: {
                    mataisan: mataisan,
                    sopr: sopr,
                },
                raw: true
            });
            //console.log('check_mataisan_dm', check_mataisan_dm)
            resolve(check_mataisan_dm);

        } catch (e) {
            reject(e)
        }
    })
}

let updateMaTaiSanPO = (mataisan, sopo) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { Op } = require("sequelize");
            let check_mataisan_dm = await db.Data_PO.findAll({
                where: {
                    mataisan: mataisan,
                    sopo: sopo,
                    [Op.or]: [
                        { checkten: 1 },
                        { checkten: 0 }
                    ]
                    //checkten: 1,
                },
                raw: true
            });
            //console.log('check_mataisan_dm', check_mataisan_dm)
            resolve(check_mataisan_dm);

        } catch (e) {
            reject(e)
        }
    })
}

let updateMaTaiSanNewPO = (mataisan, sopo) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { Op } = require("sequelize");
            let check_mataisan_dm = await db.Data_PO.findAll({
                where: {
                    mataisan: mataisan,
                    sopo: sopo,
                    checkten: 1,
                },
                raw: true
            });
            //console.log('check_mataisan_dm', check_mataisan_dm)
            resolve(check_mataisan_dm);

        } catch (e) {
            reject(e)
        }
    })
}

let updateMaVaTenPO = (mataisan, sopo) => {
    return new Promise(async (resolve, reject) => {
        try {
            let check_mataisan_dm = await db.Data_PO.findAll({
                where: {
                    mataisan: mataisan,
                    sopo: sopo,
                    //checkten: 1,
                },
                raw: true
            });
            //console.log('check_mataisan_dm', check_mataisan_dm)
            resolve(check_mataisan_dm);

        } catch (e) {
            reject(e)
        }
    })
}

let updateTenTaiSan = (tentaisan, nhacungcap_id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let check_tentaisan_dm = await db.Data_HD.findAll({
                where: {
                    tentaisan: tentaisan,
                    nhacungcap_id: nhacungcap_id
                },
                raw: true
            });
            resolve(check_tentaisan_dm);
            //console.log('check_mataisan_dm', check_mataisan_dm)
        } catch (e) {
            reject(e)
        }
    })
}


let updateTenTaiSanPR = (tentaisan, sopr) => {
    return new Promise(async (resolve, reject) => {
        try {
            let check_tentaisan_dm = await db.Data_PR.findAll({
                where: {
                    tentaisan: tentaisan,
                    sopr: sopr
                },
                raw: true
            });
            resolve(check_tentaisan_dm);
            //console.log('check_mataisan_dm', check_mataisan_dm)
        } catch (e) {
            reject(e)
        }
    })
}

let updateTenTaiSanPO = (tentaisan, sopo) => {
    return new Promise(async (resolve, reject) => {
        try {
            let check_tentaisan_dm = await db.Data_PO.findAll({
                where: {
                    tentaisan: tentaisan,
                    sopo: sopo
                },
                raw: true
            });
            resolve(check_tentaisan_dm);
            //console.log('check_mataisan_dm', check_mataisan_dm)
        } catch (e) {
            reject(e)
        }
    })
}

let editMaTaiSanNew = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const currentTime = new Date();
            if (data.loai === 'PO') {

                if (data.colma === 'MA') {
                    let checkedit = await db.Data_PO.findOne({ where: { id: data.rowId, dacheckvoict: 1 }, raw: true });
                    if (checkedit === null) {
                        let result_editma = await updateMaTaiSanNewPO(data.mataisanNew, data.sopo);
                        if (result_editma.length === 1) {
                            // resolve({
                            //     errCode: 1,
                            //     errMessage: 'Một PO không thể có hơn 2 mã tài sản giống nhau.'
                            // })
                        } else {
                            const request = db.sqlhis2Connection.request();
                            let mataisan = data.mataisanNew
                            request.input('mataisan', mssql.NVarChar(50), mataisan);
                            const getdata = await request.execute('[sp_QLPO_DANHMUC_VPP_MA]');
                            const recordset = getdata.recordset;
                            //KIỂM TRA NẾU TRONG DANH MỤC KHÔNG TỒN TẠI MÃ THÌ GỬI THÔNG BÁO
                            if (recordset.length === 0) {
                                resolve({
                                    errCode: 1,
                                    errMessage: 'Mã tài sản không tồn tại trong danh mục tài sản.'
                                })
                            } else {
                                let dataedit = await db.Data_PO.findOne({ where: { id: data.rowId }, raw: false });
                                //console.log('check dataedit', dataedit)
                                if (dataedit) {
                                    dataedit.mataisan = data.mataisanNew;
                                    // Lưu thay đổi
                                    await dataedit.save();
                                }

                                let result_editma = await updateMaVaTenPO(data.mataisanNew, data.sopo);
                                //console.log('result_editma', result_editma)
                                //console.log('recordset', data.mataisanNew, data.sopo)
                                // Hàm dò tìm và cập nhật checkmataisan
                                const updateCheckMataisan = (recordset, result_editma) => {
                                    // Dò tìm từng phần tử trong check_mataisan_dm
                                    result_editma.forEach((item) => {
                                        // Tìm trong recordset xem có phần tử nào khớp với mataisan và tentaisan
                                        const foundByMa = recordset.find((record) =>
                                            record.MaVPP === item.mataisan
                                        );

                                        // Nếu tìm thấy khớp với MaVPP, cập nhật checkma = 1, ngược lại = 0
                                        item.checkma = foundByMa ? 1 : 0;
                                        // Cập nhật tentaisan nếu tìm thấy
                                        if (foundByMa) {
                                            item.tentaisan = foundByMa.TenVPP;  // Sử dụng đúng thuộc tính TenVPP
                                        }
                                    });
                                    return result_editma;

                                };
                                // Gọi hàm updateCheckMataisan
                                const updatedCheckMataisan = updateCheckMataisan(recordset, result_editma);
                                //console.log('updatedCheckMataisan', updatedCheckMataisan)
                                if (updatedCheckMataisan.length > 0) {
                                    for (const item of updatedCheckMataisan) {
                                        try {
                                            // Tìm bản ghi trong Data_HD theo id
                                            let data = await db.Data_PO.findOne({ where: { id: item.id }, raw: false });
                                            if (data) {
                                                data.checkma = item.checkma;
                                                data.tentaisan = item.tentaisan;
                                                data.checkten = 1;
                                                // Lưu thay đổi
                                                await data.save();
                                            }
                                        } catch (error) {
                                            console.error(`Lỗi khi cập nhật PO có id: ${item.id}`, error);
                                        }
                                    }
                                }
                                resolve({
                                    errCode: 0,
                                    errMessage: 'Cập nhập mã tài sản thành công'
                                })

                            }
                        }
                    } else {
                        resolve({
                            errCode: 1,
                            errMessage: 'Đã phát sinh chứng từ kiểm tra, không được sửa'
                        })
                    }
                }
            } else if (data.loai === 'PR') {
                if (data.colma === 'MA') {
                    let checkedit = await db.Data_PR.findOne({ where: { id: data.rowId, dacheckvoict: 1 }, raw: true });
                    if (checkedit === null) {
                        let result_editma = await updateMaTaiSanPRNew(data.mataisanNew, data.sopr);
                        if (result_editma.length === 1) {
                            // resolve({
                            //     errCode: 1,
                            //     errMessage: 'Một PR không thể có hơn 2 mã tài sản giống nhau.'
                            // })
                        }
                        else {
                            const request = db.sqlhis2Connection.request();
                            let mataisan = data.mataisanNew
                            request.input('mataisan', mssql.NVarChar(50), mataisan);
                            const getdata = await request.execute('[sp_QLPO_DANHMUC_VPP_MA]');
                            const recordset = getdata.recordset;

                            //KIỂM TRA NẾU TRONG DANH MỤC KHÔNG TỒN TẠI MÃ THÌ GỬI THÔNG BÁO
                            if (recordset.length === 0) {
                                resolve({
                                    errCode: 1,
                                    errMessage: 'Mã tài sản không tồn tại trong danh mục tài sản.'
                                })
                            } else {
                                let dataedit = await db.Data_PR.findOne({ where: { id: data.rowId }, raw: false });
                                //console.log('check dataedit', dataedit)
                                if (dataedit) {
                                    dataedit.mataisan = data.mataisanNew;
                                    // Lưu thay đổi
                                    await dataedit.save();
                                }

                                let result_editma = await updateMaVaTenPR(data.mataisanNew, data.sopr);
                                // Hàm dò tìm và cập nhật checkmataisan
                                const updateCheckMataisan = (recordset, result_editma) => {
                                    // Dò tìm từng phần tử trong check_mataisan_dm
                                    result_editma.forEach((item) => {
                                        // Tìm trong recordset xem có phần tử nào khớp với mataisan và tentaisan
                                        const foundByMa = recordset.find((record) =>
                                            record.MaVPP === item.mataisan
                                        );

                                        // Nếu tìm thấy khớp với MaVPP, cập nhật checkma = 1, ngược lại = 0
                                        item.checkma = foundByMa ? 1 : 0;
                                        // Cập nhật tentaisan nếu tìm thấy
                                        if (foundByMa) {
                                            item.tentaisan = foundByMa.TenVPP;  // Sử dụng đúng thuộc tính TenVPP
                                        }
                                    });
                                    return result_editma;

                                };

                                // Gọi hàm updateCheckMataisan
                                const updatedCheckMataisan = updateCheckMataisan(recordset, result_editma);
                                //console.log('updatedCheckMataisan', updatedCheckMataisan)
                                if (updatedCheckMataisan.length > 0) {
                                    for (const item of updatedCheckMataisan) {
                                        try {
                                            // Tìm bản ghi trong Data_HD theo id
                                            let data = await db.Data_PR.findOne({ where: { id: item.id }, raw: false });
                                            if (data) {
                                                data.checkma = item.checkma;
                                                data.tentaisan = item.tentaisan;
                                                data.checkten = 1;
                                                // Lưu thay đổi
                                                await data.save();
                                            }
                                        } catch (error) {
                                            console.error(`Lỗi khi cập nhật PO có id: ${item.id}`, error);
                                        }
                                    }
                                }
                                resolve({
                                    errCode: 0,
                                    errMessage: 'Cập nhập mã tài sản thành công'
                                })
                            }
                        }
                    } else {
                        resolve({
                            errCode: 1,
                            errMessage: 'Đã phát sinh chứng từ kiểm tra, không được sửa'
                        })
                    }
                }
            } else if (data.loai === 'HD') {
                if (data.colma === 'MA') {
                    let checkedit = await db.Data_HD.findOne({ where: { id: data.rowId, dacheckvoict: 1 }, raw: true });
                    if (checkedit === null) {
                        let result_editma = await updateMaTaiSan(data.mataisanNew, data.nhacungcap_id);
                        //console.log('check_mataisan_dm length', result_editma.length)
                        if (result_editma.length === 1) {
                            // resolve({
                            //     errCode: 1,
                            //     errMessage: 'Một hợp đồng không thể có hơn 2 mã tài sản giống nhau.'
                            // })
                        } else {
                            const request = db.sqlhis2Connection.request();
                            let mataisan = data.mataisanNew
                            request.input('mataisan', mssql.NVarChar(50), mataisan);
                            const getdata = await request.execute('[sp_QLPO_DANHMUC_VPP_MA]');
                            const recordset = getdata.recordset;

                            // Hàm dò tìm và cập nhật checkmataisan
                            const updateCheckMataisan = (recordset, result_editma) => {
                                // Dò tìm từng phần tử trong check_mataisan_dm
                                result_editma.forEach((item) => {
                                    // Tìm trong recordset xem có phần tử nào khớp với mataisan và tentaisan
                                    const foundByMa = recordset.find((record) =>
                                        record.MaVPP === item.mataisan
                                    );

                                    // Nếu tìm thấy khớp với MaVPP, cập nhật checkma = 1, ngược lại = 0
                                    item.checkma = foundByMa ? 1 : 0;
                                    // Cập nhật tentaisan nếu tìm thấy
                                    if (foundByMa) {
                                        item.tentaisan = foundByMa.TenVPP;  // Sử dụng đúng thuộc tính TenVPP
                                    }
                                });
                                return result_editma;

                            };

                            //KIỂM TRA NẾU TRONG DANH MỤC KHÔNG TỒN TẠI MÃ THÌ GỬI THÔNG BÁO
                            if (recordset.length === 0) {
                                resolve({
                                    errCode: 1,
                                    errMessage: 'Mã tài sản không tồn tại trong danh mục tài sản.'
                                })
                            } else {
                                let dataedit = await db.Data_HD.findOne({ where: { id: data.rowId }, raw: false });
                                //console.log('check dataedit', dataedit)
                                if (dataedit) {
                                    dataedit.mataisan = data.mataisanNew;
                                    // Lưu thay đổi
                                    await dataedit.save();
                                }
                                let result_editma = await updateMaVaTenHD(data.mataisanNew, data.nhacungcap_id);
                                // Gọi hàm updateCheckMataisan
                                const updatedCheckMataisan = updateCheckMataisan(recordset, result_editma);
                                //console.log('updatedCheckMataisan', updatedCheckMataisan)
                                if (updatedCheckMataisan.length > 0) {
                                    for (const item of updatedCheckMataisan) {
                                        try {
                                            // Tìm bản ghi trong Data_HD theo id
                                            let data = await db.Data_HD.findOne({ where: { id: item.id }, raw: false });
                                            if (data) {
                                                data.checkma = item.checkma;
                                                data.tentaisan = item.tentaisan
                                                data.checkten = 1;
                                                // Lưu thay đổi
                                                await data.save();
                                            }
                                        } catch (error) {
                                            console.error(`Lỗi khi cập nhật PO có id: ${item.id}`, error);
                                        }
                                    }
                                }
                                resolve({
                                    errCode: 0,
                                    errMessage: 'Cập nhập mã tài sản thành công'
                                })
                            }
                        }
                    } else {
                        resolve({
                            errCode: 1,
                            errMessage: 'Tài sản đã phát sinh chứng từ kiểm tra, không được sửa'
                        })
                    }
                }
            }
        } catch (e) {
            reject(e)
        }
    })
}
let editKhoaPhongHienTai = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            //console.log('check data ', data)
            if (data.col === 'KhoaPhongHienTai') {
                const dataArray = [data];
                if (dataArray.length > 0) {
                    //console.log('check data dataArray', dataArray)
                    for (const item of dataArray) {
                        try {
                            // Tìm bản ghi trong Data_HD theo id
                            let data = await db.Data_KiemKe.findOne({ where: { id: item.rowId }, raw: false });
                            if (data) {
                                data.KhoaPhongHienTai = item.KhoaPhongHienTai;
                                // Lưu thay đổi
                                await data.save();
                            }
                        } catch (error) {
                            console.error(`Lỗi khi cập nhật Data kiểm kê có id: ${item.id}`, error);
                        }
                    }
                }
                resolve({
                    errCode: 0,
                    errMessage: 'Cập nhập Khoa phòng hiện tại thành công'
                })
            } else if (data.col === 'ViTriHienTai') {
                const dataArray = [data];
                if (dataArray.length > 0) {
                    //console.log('check data dataArray', dataArray)
                    for (const item of dataArray) {
                        try {
                            // Tìm bản ghi trong Data_HD theo id
                            let data = await db.Data_KiemKe.findOne({ where: { id: item.rowId }, raw: false });
                            if (data) {
                                data.ViTriHienTai = item.ViTriHienTai;
                                // Lưu thay đổi
                                await data.save();
                            }
                        } catch (error) {
                            console.error(`Lỗi khi cập nhật Data kiểm kê có id: ${item.id}`, error);
                        }
                    }
                }
                resolve({
                    errCode: 0,
                    errMessage: 'Cập nhập Vị trí hiện tại thành công'
                })
            } else if (data.col === 'GhiChuHienTai') {
                const dataArray = [data];
                if (dataArray.length > 0) {
                    //console.log('check data dataArray', dataArray)
                    for (const item of dataArray) {
                        try {
                            // Tìm bản ghi trong Data_HD theo id
                            let data = await db.Data_KiemKe.findOne({ where: { id: item.rowId }, raw: false });
                            if (data) {
                                data.GhiChuHienTai = item.GhiChuHienTai;
                                // Lưu thay đổi
                                await data.save();
                            }
                        } catch (error) {
                            console.error(`Lỗi khi cập nhật Data kiểm kê có id: ${item.id}`, error);
                        }
                    }
                }
                resolve({
                    errCode: 0,
                    errMessage: 'Cập nhập Ghi chú hiện tại thành công'
                })
            } else if (data.col === 'TinhTrang') {
                const dataArray = [data];
                if (dataArray.length > 0) {
                    //console.log('check data dataArray', dataArray)
                    for (const item of dataArray) {
                        try {
                            // Tìm bản ghi trong Data_HD theo id
                            let data = await db.Data_KiemKe.findOne({ where: { id: item.rowId }, raw: false });
                            if (data) {
                                data.TinhTrang = item.TinhTrang;
                                // Lưu thay đổi
                                await data.save();
                            }
                        } catch (error) {
                            console.error(`Lỗi khi cập nhật Data kiểm kê có id: ${item.id}`, error);
                        }
                    }
                }
                resolve({
                    errCode: 0,
                    errMessage: 'Cập nhập Tình trạng thành công'
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}
let editMaTaiSan = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            //console.log('editMaTaiSan', data)
            const currentTime = new Date();
            if (data.loai === 'PO') {

                if (data.colma === 'MA') {
                    let checkedit = await db.Data_PO.findOne({ where: { id: data.rowId, dacheckvoict: 1 }, raw: true });
                    if (checkedit === null) {
                        let result_editma = await updateMaTaiSanPO(data.mataisanNew, data.sopo);
                        if (result_editma.length === 1) {
                            resolve({
                                errCode: 1,
                                errMessage: 'Một PO không thể có hơn 2 mã tài sản giống nhau.'
                            })
                        } else {
                            const request = db.sqlhis2Connection.request();
                            let mataisan = data.mataisanNew
                            request.input('mataisan', mssql.NVarChar(50), mataisan);
                            const getdata = await request.execute('[sp_QLPO_DANHMUC_VPP_MA]');
                            const recordset = getdata.recordset;
                            //KIỂM TRA NẾU TRONG DANH MỤC KHÔNG TỒN TẠI MÃ THÌ GỬI THÔNG BÁO
                            if (recordset.length === 0) {
                                resolve({
                                    errCode: 1,
                                    errMessage: 'Mã tài sản không tồn tại trong danh mục tài sản.'
                                })
                            } else {
                                let dataedit = await db.Data_PO.findOne({ where: { id: data.rowId }, raw: false });
                                //console.log('check dataedit', dataedit)
                                if (dataedit) {
                                    dataedit.mataisan = data.mataisanNew;
                                    // Lưu thay đổi
                                    await dataedit.save();
                                }

                                let result_editma = await updateMaTaiSanPO(data.mataisanNew, data.sopo);
                                //console.log('result_editma', result_editma)
                                //console.log('recordset', recordset)
                                // Hàm dò tìm và cập nhật checkmataisan
                                const updateCheckMataisan = (recordset, result_editma) => {
                                    // Dò tìm từng phần tử trong check_mataisan_dm
                                    result_editma.forEach((item) => {
                                        // Tìm trong recordset xem có phần tử nào khớp với mataisan và tentaisan
                                        const foundByMa = recordset.find((record) =>
                                            record.MaVPP === item.mataisan
                                        );

                                        // Nếu tìm thấy khớp với MaVPP, cập nhật checkma = 1, ngược lại = 0
                                        item.checkma = foundByMa ? 1 : 0;
                                        // Cập nhật tentaisan nếu tìm thấy
                                        if (foundByMa) {
                                            item.tentaisan = foundByMa.TenVPP;  // Sử dụng đúng thuộc tính TenVPP
                                        }
                                    });
                                    return result_editma;

                                };
                                // Gọi hàm updateCheckMataisan
                                const updatedCheckMataisan = updateCheckMataisan(recordset, result_editma);
                                //console.log('updatedCheckMataisan', updatedCheckMataisan)
                                if (updatedCheckMataisan.length > 0) {
                                    for (const item of updatedCheckMataisan) {
                                        try {
                                            // Tìm bản ghi trong Data_HD theo id
                                            let data = await db.Data_PO.findOne({ where: { id: item.id }, raw: false });
                                            if (data) {
                                                data.checkma = item.checkma;
                                                data.tentaisan = item.tentaisan;
                                                data.checkten = 1;
                                                // Lưu thay đổi
                                                await data.save();
                                            }
                                        } catch (error) {
                                            console.error(`Lỗi khi cập nhật PO có id: ${item.id}`, error);
                                        }
                                    }
                                }
                                resolve({
                                    errCode: 0,
                                    errMessage: 'Cập nhập mã tài sản thành công'
                                })

                            }
                        }
                    } else {
                        resolve({
                            errCode: 1,
                            errMessage: 'Đã phát sinh chứng từ kiểm tra, không được sửa'
                        })
                    }
                } else if (data.colten === 'TEN') {
                    //console.log('TEN', data.colten)
                    let checkedit = await db.Data_PO.findOne({ where: { id: data.rowId, dacheckvoict: 1 }, raw: true });
                    if (checkedit === null) {
                        let result_editten = await updateTenTaiSanPO(data.tentaisanNew, data.sopo);
                        //console.log('result_editten', result_editten)
                        if (result_editten.length === 1) {
                            resolve({
                                errCode: 1,
                                errMessage: 'Một PO không thể có hơn 2 tên tài sản giống nhau.'
                            })
                        } else {

                            const request = db.sqlhis2Connection.request();
                            let tentaisan = data.tentaisanNew
                            request.input('tentaisan', mssql.NVarChar(500), tentaisan);
                            const getdata = await request.execute('[sp_QLPO_DANHMUC_VPP_TEN]');
                            const recordset = getdata.recordset;
                            //console.log('recordset', recordset)
                            if (recordset.length === 0) {
                                resolve({
                                    errCode: 1,
                                    errMessage: 'Tên tài sản không tồn tại trong danh mục tài sản.'
                                })
                            } else {
                                let dataedit = await db.Data_PO.findOne({ where: { id: data.rowId }, raw: false });
                                //console.log('check dataedit', dataedit)
                                if (dataedit) {
                                    dataedit.tentaisan = data.tentaisanNew;
                                    // Lưu thay đổi
                                    await dataedit.save();
                                }
                                let result_editten = await updateTenTaiSanPO(data.tentaisanNew, data.sopo);
                                // Hàm dò tìm và cập nhật checkmataisan
                                const updateCheckTentaisan = (recordset, result_editten) => {
                                    // Dò tìm từng phần tử trong check_mataisan_dm
                                    result_editten.forEach((item) => {
                                        // Tìm trong recordset xem có phần tử nào khớp với mataisan và tentaisan
                                        const foundByTen = recordset.find((record) =>
                                            record.TenVPP === item.tentaisan
                                        );
                                        // Nếu tìm thấy khớp với MaVPP, cập nhật checkma = 1, ngược lại = 0
                                        item.checkten = foundByTen ? 1 : 0;
                                    });
                                    return result_editten;

                                };

                                // Gọi hàm updateCheckMataisan
                                const updatedCheckTentaisan = updateCheckTentaisan(recordset, result_editten);
                                if (updatedCheckTentaisan.length > 0) {
                                    for (const item of updatedCheckTentaisan) {
                                        try {
                                            // Tìm bản ghi trong Data_HD theo id
                                            let data = await db.Data_PO.findOne({ where: { id: item.id }, raw: false });
                                            if (data) {
                                                data.checkten = item.checkten;
                                                // Lưu thay đổi
                                                await data.save();
                                            }
                                        } catch (error) {
                                            console.error(`Lỗi khi cập nhật PO có id: ${item.id}`, error);
                                        }
                                    }
                                }
                                resolve({
                                    errCode: 0,
                                    errMessage: 'Cập nhập tên tài sản thành công'
                                })
                            }
                        }
                    } else {
                        resolve({
                            errCode: 1,
                            errMessage: 'Đã phát sinh chứng từ kiểm tra, không được sửa'
                        })
                    }
                } else if (data.colsl === 'SL') {
                    let checkedit = await db.Data_PO.findOne({ where: { id: data.rowId, dacheckvoict: 1 }, raw: true });
                    if (checkedit === null) {
                        let dataedit = await db.Data_PO.findOne({ where: { id: data.rowId }, raw: false });
                        //console.log('check data.soluongpo', data.soluongpo)
                        if (dataedit) {
                            dataedit.soluongpo = data.soluongpo;
                            dataedit.thanhtien = dataedit.dongiapo * data.soluongpo;
                            dataedit.thanhtienvat = dataedit.dongiapovat * data.soluongpo;
                            // Lưu thay đổi
                            await dataedit.save();
                        }
                        resolve({
                            errCode: 0,
                            errMessage: 'Cập nhập số lượng thành công'
                        })
                    } else {
                        resolve({
                            errCode: 1,
                            errMessage: 'Đã phát sinh chứng từ kiểm tra, không được sửa'
                        })
                    }
                } else if (data.coldg === 'DG') {
                    let checkedit = await db.Data_PO.findOne({ where: { id: data.rowId, dacheckvoict: 1 }, raw: true });
                    if (checkedit === null) {
                        let dataedit = await db.Data_PO.findOne({ where: { id: data.rowId }, raw: false });
                        //console.log('check data.soluongpo', data.soluongpo)
                        if (dataedit) {
                            dataedit.dongiapo = data.dongiapo;
                            dataedit.dongiapovat = (data.dongiapo * (dataedit.vat / 100)) + data.dongiapo;
                            dataedit.thanhtien = dataedit.soluongpo * data.dongiapo;
                            dataedit.thanhtienvat = (data.dongiapo * (dataedit.vat / 100)) + data.dongiapo * dataedit.soluongpo;
                            // Lưu thay đổi
                            await dataedit.save();
                        }
                        resolve({
                            errCode: 0,
                            errMessage: 'Cập nhập đơn giá thành công'
                        })
                    } else {
                        resolve({
                            errCode: 1,
                            errMessage: 'Đã phát sinh chứng từ kiểm tra, không được sửa'
                        })
                    }
                } else if (data.colvat === 'VAT') {
                    let checkedit = await db.Data_PO.findOne({ where: { id: data.rowId, dacheckvoict: 1 }, raw: true });
                    if (checkedit === null) {
                        let dataedit = await db.Data_PO.findOne({ where: { id: data.rowId }, raw: false });
                        //console.log('check data.soluongpo', data.soluongpo)
                        if (dataedit) {
                            dataedit.vat = data.vat;
                            dataedit.dongiapovat = ((data.vat / 100) * dataedit.dongiapo) + dataedit.dongiapo;
                            dataedit.thanhtienvat = (((data.vat / 100) * dataedit.dongiapo) + dataedit.dongiapo) * dataedit.soluongpo;
                            // Lưu thay đổi
                            await dataedit.save();
                        }
                        resolve({
                            errCode: 0,
                            errMessage: 'Cập nhập VAT thành công'
                        })
                    } else {
                        resolve({
                            errCode: 1,
                            errMessage: 'Đã phát sinh chứng từ kiểm tra, không được sửa'
                        })
                    }
                }
            } else if (data.loai === 'PR') {
                if (data.colma === 'MA') {
                    let checkedit = await db.Data_PR.findOne({ where: { id: data.rowId, dacheckvoict: 1 }, raw: true });
                    if (checkedit === null) {
                        let result_editma = await updateMaTaiSanPR(data.mataisanNew, data.sopr);
                        if (result_editma.length === 1) {
                            resolve({
                                errCode: 1,
                                errMessage: 'Một PR không thể có hơn 2 mã tài sản giống nhau.'
                            })
                        }
                        else {
                            const request = db.sqlhis2Connection.request();
                            let mataisan = data.mataisanNew
                            request.input('mataisan', mssql.NVarChar(50), mataisan);
                            const getdata = await request.execute('[sp_QLPO_DANHMUC_VPP_MA]');
                            const recordset = getdata.recordset;

                            //KIỂM TRA NẾU TRONG DANH MỤC KHÔNG TỒN TẠI MÃ THÌ GỬI THÔNG BÁO
                            if (recordset.length === 0) {
                                resolve({
                                    errCode: 1,
                                    errMessage: 'Mã tài sản không tồn tại trong danh mục tài sản.'
                                })
                            } else {
                                let dataedit = await db.Data_PR.findOne({ where: { id: data.rowId }, raw: false });
                                //console.log('check dataedit', dataedit)
                                if (dataedit) {
                                    dataedit.mataisan = data.mataisanNew;
                                    // Lưu thay đổi
                                    await dataedit.save();
                                }

                                let result_editma = await updateMaTaiSanPR(data.mataisanNew, data.sopr);
                                // Hàm dò tìm và cập nhật checkmataisan
                                const updateCheckMataisan = (recordset, result_editma) => {
                                    // Dò tìm từng phần tử trong check_mataisan_dm
                                    result_editma.forEach((item) => {
                                        // Tìm trong recordset xem có phần tử nào khớp với mataisan và tentaisan
                                        const foundByMa = recordset.find((record) =>
                                            record.MaVPP === item.mataisan
                                        );

                                        // Nếu tìm thấy khớp với MaVPP, cập nhật checkma = 1, ngược lại = 0
                                        item.checkma = foundByMa ? 1 : 0;
                                        // Cập nhật tentaisan nếu tìm thấy
                                        if (foundByMa) {
                                            item.tentaisan = foundByMa.TenVPP;  // Sử dụng đúng thuộc tính TenVPP
                                        }
                                    });
                                    return result_editma;

                                };

                                // Gọi hàm updateCheckMataisan
                                const updatedCheckMataisan = updateCheckMataisan(recordset, result_editma);
                                if (updatedCheckMataisan.length > 0) {
                                    for (const item of updatedCheckMataisan) {
                                        try {
                                            // Tìm bản ghi trong Data_HD theo id
                                            let data = await db.Data_PR.findOne({ where: { id: item.id }, raw: false });
                                            if (data) {
                                                data.checkma = item.checkma;
                                                data.tentaisan = item.tentaisan;
                                                data.checkten = 1;
                                                // Lưu thay đổi
                                                await data.save();
                                            }
                                        } catch (error) {
                                            console.error(`Lỗi khi cập nhật PO có id: ${item.id}`, error);
                                        }
                                    }
                                }
                                resolve({
                                    errCode: 0,
                                    errMessage: 'Cập nhập mã tài sản thành công'
                                })
                            }
                        }
                    } else {
                        resolve({
                            errCode: 1,
                            errMessage: 'Đã phát sinh chứng từ kiểm tra, không được sửa'
                        })
                    }
                } else if (data.colten === 'TEN') {
                    //console.log('TEN', data.colten)
                    let checkedit = await db.Data_PR.findOne({ where: { id: data.rowId, dacheckvoict: 1 }, raw: true });
                    if (checkedit === null) {
                        let result_editten = await updateTenTaiSanPR(data.tentaisanNew, data.sopr);
                        if (result_editten.length === 1) {
                            resolve({
                                errCode: 1,
                                errMessage: 'Một PR không thể có hơn 2 tên tài sản giống nhau.'
                            })
                        } else {
                            const request = db.sqlhis2Connection.request();
                            let tentaisan = data.tentaisanNew
                            request.input('tentaisan', mssql.NVarChar(50), tentaisan);
                            const getdata = await request.execute('[sp_QLPO_DANHMUC_VPP_TEN]');
                            const recordset = getdata.recordset;

                            if (recordset.length === 0) {
                                resolve({
                                    errCode: 1,
                                    errMessage: 'Tên tài sản không tồn tại trong danh mục tài sản.'
                                })
                            } else {
                                let dataedit = await db.Data_PR.findOne({ where: { id: data.rowId }, raw: false });
                                //console.log('check dataedit', dataedit)
                                if (dataedit) {
                                    dataedit.tentaisan = data.tentaisanNew;
                                    // Lưu thay đổi
                                    await dataedit.save();
                                }
                                let result_editten = await updateTenTaiSanPR(data.tentaisanNew, data.sopr);
                                // Hàm dò tìm và cập nhật checkmataisan
                                const updateCheckTentaisan = (recordset, result_editten) => {
                                    // Dò tìm từng phần tử trong check_mataisan_dm
                                    result_editten.forEach((item) => {
                                        // Tìm trong recordset xem có phần tử nào khớp với mataisan và tentaisan
                                        const foundByTen = recordset.find((record) =>
                                            record.TenVPP === item.tentaisan
                                        );
                                        // Nếu tìm thấy khớp với MaVPP, cập nhật checkma = 1, ngược lại = 0
                                        item.checkten = foundByTen ? 1 : 0;
                                    });
                                    return result_editten;

                                };

                                // Gọi hàm updateCheckMataisan
                                const updatedCheckTentaisan = updateCheckTentaisan(recordset, result_editten);
                                if (updatedCheckTentaisan.length > 0) {
                                    for (const item of updatedCheckTentaisan) {
                                        try {
                                            // Tìm bản ghi trong Data_HD theo id
                                            let data = await db.Data_PR.findOne({ where: { id: item.id }, raw: false });
                                            if (data) {
                                                data.checkten = item.checkten;
                                                // Lưu thay đổi
                                                await data.save();
                                            }
                                        } catch (error) {
                                            console.error(`Lỗi khi cập nhật PO có id: ${item.id}`, error);
                                        }
                                    }
                                }
                                resolve({
                                    errCode: 0,
                                    errMessage: 'Cập nhập tên tài sản thành công'
                                })
                            }
                        }
                    } else {
                        resolve({
                            errCode: 1,
                            errMessage: 'Đã phát sinh chứng từ kiểm tra, không được sửa'
                        })
                    }
                }
            } else if (data.loai === 'HD') {
                if (data.colma === 'MA') {
                    let checkedit = await db.Data_HD.findOne({ where: { id: data.rowId, dacheckvoict: 1 }, raw: true });
                    if (checkedit === null) {
                        let result_editma = await updateMaTaiSan(data.mataisanNew, data.nhacungcap_id);
                        //console.log('check_mataisan_dm length', result_editma.length)
                        if (result_editma.length === 1) {
                            resolve({
                                errCode: 1,
                                errMessage: 'Một hợp đồng không thể có hơn 2 mã tài sản giống nhau.'
                            })
                        } else {
                            const request = db.sqlhis2Connection.request();
                            let mataisan = data.mataisanNew
                            request.input('mataisan', mssql.NVarChar(50), mataisan);
                            const getdata = await request.execute('[sp_QLPO_DANHMUC_VPP_MA]');
                            const recordset = getdata.recordset;

                            // Hàm dò tìm và cập nhật checkmataisan
                            const updateCheckMataisan = (recordset, result_editma) => {
                                // Dò tìm từng phần tử trong check_mataisan_dm
                                result_editma.forEach((item) => {
                                    // Tìm trong recordset xem có phần tử nào khớp với mataisan và tentaisan
                                    const foundByMa = recordset.find((record) =>
                                        record.MaVPP === item.mataisan
                                    );

                                    // Nếu tìm thấy khớp với MaVPP, cập nhật checkma = 1, ngược lại = 0
                                    item.checkma = foundByMa ? 1 : 0;
                                    // Cập nhật tentaisan nếu tìm thấy
                                    if (foundByMa) {
                                        item.tentaisan = foundByMa.TenVPP;  // Sử dụng đúng thuộc tính TenVPP
                                    }
                                });
                                return result_editma;

                            };

                            //KIỂM TRA NẾU TRONG DANH MỤC KHÔNG TỒN TẠI MÃ THÌ GỬI THÔNG BÁO
                            if (recordset.length === 0) {
                                resolve({
                                    errCode: 1,
                                    errMessage: 'Mã tài sản không tồn tại trong danh mục tài sản.'
                                })
                            } else {
                                let dataedit = await db.Data_HD.findOne({ where: { id: data.rowId }, raw: false });
                                //console.log('check dataedit', dataedit)
                                if (dataedit) {
                                    dataedit.mataisan = data.mataisanNew;
                                    // Lưu thay đổi
                                    await dataedit.save();
                                }
                                let result_editma = await updateMaTaiSan(data.mataisanNew, data.nhacungcap_id);
                                // Gọi hàm updateCheckMataisan
                                const updatedCheckMataisan = updateCheckMataisan(recordset, result_editma);
                                if (updatedCheckMataisan.length > 0) {
                                    for (const item of updatedCheckMataisan) {
                                        try {
                                            // Tìm bản ghi trong Data_HD theo id
                                            let data = await db.Data_HD.findOne({ where: { id: item.id }, raw: false });
                                            if (data) {
                                                data.checkma = item.checkma;
                                                data.tentaisan = item.tentaisan
                                                data.checkten = 1;
                                                // Lưu thay đổi
                                                await data.save();
                                            }
                                        } catch (error) {
                                            console.error(`Lỗi khi cập nhật PO có id: ${item.id}`, error);
                                        }
                                    }
                                }
                                resolve({
                                    errCode: 0,
                                    errMessage: 'Cập nhập mã tài sản thành công'
                                })
                            }
                        }
                    } else {
                        resolve({
                            errCode: 1,
                            errMessage: 'Tài sản đã phát sinh chứng từ kiểm tra, không được sửa'
                        })
                    }
                }
                else if (data.colten === 'TEN') {
                    //console.log('TEN', data)
                    let checkedit = await db.Data_HD.findOne({ where: { id: data.rowId, dacheckvoict: 1 }, raw: true });
                    if (checkedit === null) {
                        let result_editten = await updateTenTaiSan(data.tentaisanNew, data.nhacungcap_id);

                        //console.log('check_mataisan_dm length', result_editten.length, data.tentaisanNew)
                        if (result_editten.length === 1) {
                            resolve({
                                errCode: 1,
                                errMessage: 'Một hợp đồng không thể có hơn 2 tên tài sản giống nhau.'
                            })
                        }
                        else {

                            const request = db.sqlhis2Connection.request();
                            let tentaisan = data.tentaisanNew
                            //console.log('const data = recordset[0];', tentaisan)
                            request.input('tentaisan', mssql.NVarChar(50), tentaisan);
                            const getdata = await request.execute('[sp_QLPO_DANHMUC_VPP_TEN]');
                            const recordset = getdata.recordset;
                            // const data = recordset[0];
                            //console.log('const data = recordset[0];', recordset)
                            if (recordset.length === 0) {
                                resolve({
                                    errCode: 1,
                                    errMessage: 'Tên tài sản không tồn tại trong danh mục tài sản.'
                                })
                            } else {
                                let dataedit = await db.Data_HD.findOne({ where: { id: data.rowId }, raw: false });
                                //console.log('check dataedit', dataedit)
                                if (dataedit) {
                                    dataedit.tentaisan = data.tentaisanNew;
                                    // Lưu thay đổi
                                    await dataedit.save();
                                }
                                let result_editten = await updateTenTaiSan(data.tentaisanNew, data.nhacungcap_id);
                                // Hàm dò tìm và cập nhật checkmataisan
                                const updateCheckTentaisan = (recordset, result_editten) => {
                                    // Dò tìm từng phần tử trong check_mataisan_dm
                                    result_editten.forEach((item) => {
                                        // Tìm trong recordset xem có phần tử nào khớp với mataisan và tentaisan
                                        const foundByTen = recordset.find((record) =>
                                            record.TenVPP === item.tentaisan
                                        );
                                        // Nếu tìm thấy khớp với MaVPP, cập nhật checkma = 1, ngược lại = 0
                                        item.checkten = foundByTen ? 1 : 0;
                                    });
                                    return result_editten;

                                };

                                // Gọi hàm updateCheckMataisan
                                const updatedCheckTentaisan = updateCheckTentaisan(recordset, result_editten);
                                if (updatedCheckTentaisan.length > 0) {
                                    for (const item of updatedCheckTentaisan) {
                                        try {
                                            // Tìm bản ghi trong Data_HD theo id
                                            let data = await db.Data_HD.findOne({ where: { id: item.id }, raw: false });
                                            if (data) {
                                                data.checkten = item.checkten;
                                                // Lưu thay đổi
                                                await data.save();
                                            }
                                        } catch (error) {
                                            console.error(`Lỗi khi cập nhật PO có id: ${item.id}`, error);
                                        }
                                    }
                                }
                                resolve({
                                    errCode: 0,
                                    errMessage: 'Cập nhập tên tài sản thành công'
                                })
                            }
                        }
                    } else {
                        resolve({
                            errCode: 1,
                            errMessage: 'Đã phát sinh chứng từ kiểm tra, không được sửa tên'
                        })
                    }
                } else if (data.colncc === 'NCC') {
                    //console.log('TEN', data)
                    let checkedit = await db.Data_HD.findOne({ where: { id: data.rowId, dacheckvoict: 1 }, raw: true });
                    if (checkedit === null) {
                        const request = db.sqlhis2Connection.request();
                        let nhacungcap_id = data.nhacungcap_id
                        request.input('nhacungcap_id', mssql.Int, nhacungcap_id);
                        const getdata = await request.execute('[sp_QLPO_DANHMUC_NCC]');
                        const recordset = getdata.recordset;
                        const datancc = recordset[0];
                        if (recordset.length === 0) {
                            resolve({
                                errCode: 1,
                                errMessage: 'Tên nhà cung cấp không tồn tại trong danh mục.'
                            })
                        }
                        else {
                            let dataedit = await db.Data_HD.findOne({ where: { id: data.rowId }, raw: false });
                            if (dataedit) {
                                dataedit.nhacungcap_id = data.nhacungcap_id;
                                dataedit.checknhacungcap = 1;
                                dataedit.tennhacungcap = datancc.tennhacungcap;
                                // Lưu thay đổi
                                await dataedit.save();
                            }
                            // let result_editten = await updateTenTaiSan(data.tentaisanNew, data.nhacungcap_id);
                            // // Hàm dò tìm và cập nhật checkmataisan
                            // const updateCheckTentaisan = (recordset, result_editten) => {
                            //     // Dò tìm từng phần tử trong check_mataisan_dm
                            //     result_editten.forEach((item) => {
                            //         // Tìm trong recordset xem có phần tử nào khớp với mataisan và tentaisan
                            //         const foundByTen = recordset.find((record) =>
                            //             record.TenVPP === item.tentaisan
                            //         );
                            //         // Nếu tìm thấy khớp với MaVPP, cập nhật checkma = 1, ngược lại = 0
                            //         item.checkten = foundByTen ? 1 : 0;
                            //     });
                            //     return result_editten;

                            // };

                            // // Gọi hàm updateCheckMataisan
                            // const updatedCheckTentaisan = updateCheckTentaisan(recordset, result_editten);
                            // if (updatedCheckTentaisan.length > 0) {
                            //     for (const item of updatedCheckTentaisan) {
                            //         try {
                            //             // Tìm bản ghi trong Data_HD theo id
                            //             let data = await db.Data_HD.findOne({ where: { id: item.id }, raw: false });
                            //             if (data) {
                            //                 data.checkten = item.checkten;
                            //                 // Lưu thay đổi
                            //                 await data.save();
                            //             }
                            //         } catch (error) {
                            //             console.error(`Lỗi khi cập nhật PO có id: ${item.id}`, error);
                            //         }
                            //     }
                            // }
                            resolve({
                                errCode: 0,
                                errMessage: 'Cập nhập nhà cung cấp thành công'
                            })
                        }
                    } else {
                        resolve({
                            errCode: 1,
                            errMessage: 'Đã phát sinh chứng từ kiểm tra, không được sửa'
                        })
                    }
                }
            }
        } catch (e) {
            reject(e)
        }
    })
}

let getOnePo = (machungtu) => {
    return new Promise(async (resolve, reject) => {
        try {

            const request = db.sqlhis2Connection.request();
            request.input('machungtu', mssql.NVarChar(50), machungtu);
            const getdata = await request.execute('[sp_QLPO_GETCHUNGTUNHAPNCC]');
            // Lấy dữ liệu từ recordset
            const recordset = getdata.recordset;
            const datachungtu = recordset[0];
            if (recordset.length > 0) {
                let sopo = datachungtu.sopo

                let data = await db.sequelize.query('CALL sp_get_one_po(:sopo)',
                    {
                        replacements: { sopo: sopo },
                        raw: false
                    }
                );
                //console.log('data new', data)
                resolve(data)
            }
        } catch (e) {
            reject(e)
        }
    })
}

let getOneCT = (machungtu) => {
    return new Promise(async (resolve, reject) => {
        try {

            const request = db.sqlhis2Connection.request();
            request.input('machungtu', mssql.NVarChar(50), machungtu);
            const getdata = await request.execute('[sp_QLPO_GETCHUNGTUNHAPNCC]');
            // Lấy dữ liệu từ recordset
            const recordset = getdata.recordset;
            const datachungtu = recordset[0];
            if (recordset.length > 0) {
                let sopo = datachungtu.sopo

                let data = await db.sequelize.query('CALL sp_get_one_ct(:sopo)',
                    {
                        replacements: { sopo: sopo },
                        raw: false
                    }
                );
                //console.log('data new', data)
                resolve(data)
            }
        } catch (e) {
            reject(e)
        }
    })
}

let getCheckOneCT = (machungtu) => {
    return new Promise(async (resolve, reject) => {
        try {

            const request = db.sqlhis2Connection.request();
            request.input('machungtu', mssql.NVarChar(50), machungtu);
            const getdata = await request.execute('[sp_QLPO_GETCHUNGTUNHAPNCC_DNK]');
            // Lấy dữ liệu từ recordset
            const recordset = getdata.recordset;
            const datachungtu = recordset[0];
            if (recordset.length > 0) {
                let sopo = datachungtu.sopo

                let data = await db.sequelize.query('CALL sp_get_check_one_ct(:sopo)',
                    {
                        replacements: { sopo: sopo },
                        raw: false
                    }
                );
                //console.log('data new', data)
                resolve(data)
            }
        } catch (e) {
            reject(e)
        }
    })
}

let getOneHD = (machungtu) => {
    return new Promise(async (resolve, reject) => {
        try {

            const request = db.sqlhis2Connection.request();
            request.input('machungtu', mssql.NVarChar(50), machungtu);
            const getdata = await request.execute('[sp_QLPO_GETCHUNGTUNHAPNCC]');
            // Lấy dữ liệu từ recordset
            const recordset = getdata.recordset;
            const datachungtu = recordset[0];
            if (recordset.length > 0) {
                let nhacungcap_id = datachungtu.nhacungcap_id

                let data = await db.sequelize.query('CALL sp_get_one_hd(:nhacungcap_id)',
                    {
                        replacements: { nhacungcap_id: nhacungcap_id },
                        raw: false
                    }
                );
                //console.log('data new', data)
                resolve(data)
            }
        } catch (e) {
            reject(e)
        }
    })
}


let getOnePR = (sopo) => {
    return new Promise(async (resolve, reject) => {
        try {

            let datapo = await db.Data_PO.findAll({
                //attributes: ['SoBenhAn'],
                where: {
                    sopo: sopo,
                },
                raw: true
            });
            //let sopr = datapo[0];
            //console.log('datapo', datapo)
            if (datapo.length > 0) {
                let sopr = datapo[0].sopr;
                let data = await db.sequelize.query('CALL sp_get_one_pr(:sopr)',
                    {
                        replacements: { sopr: sopr },
                        raw: false
                    }
                );
                //console.log('data new', data)
                resolve(data)
            }
        } catch (e) {
            reject(e)
        }
    })
}

let getDataDaKiemKe = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            //console.log('data', data)
            const validationRules = [
                { field: 'TuNgay', message: 'Vui lòng chọn Từ ngày.' },
                { field: 'DenNgay', message: 'Vui lòng chọn Đến ngày.' },
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
                if (data.TimKiemKhoTaiSan_Id) {
                    if (data.TimKiemKhoQuanLy === 'TẤT CẢ KHO') {
                        const tungay = new Date(data.TuNgay).toISOString().split('T')[0];
                        const denngay = new Date(data.DenNgay).toISOString().split('T')[0];
                        let KhoTaiSan_Id = data.TimKiemKhoTaiSan_Id
                        let DotKiemKe_Id_React = data.DotKiemKe_Id
                        // console.log('DotKiemKe_Id', DotKiemKe_Id)
                        // Tách thành mảng số nguyên
                        let DotKiemKe_Id_Array = DotKiemKe_Id_React.split(",").map(Number);
                        // Chuyển mảng thành chuỗi dùng trong MySQL
                        let DotKiemKe_Id = DotKiemKe_Id_Array.join(",");

                        // let datakiemke = await db.sequelize.query('CALL sp_get_timkiem_data_kiemke_tatca_theokhoa_sudung(:KhoTaiSan_Id,:DotKiemKe_Id,:tungay, :denngay)',
                        //     {
                        //         replacements: { KhoTaiSan_Id: KhoTaiSan_Id, DotKiemKe_Id: DotKiemKe_Id, tungay: tungay, denngay: denngay },
                        //         raw: true
                        //     }
                        // );
                        let query = `
                            SELECT  
                                kk.STT,
                                kk.id,
                                kk.DotKiemKe_Id,
                                kk.KhoDuocSaiViTri_Id,
                                kk.MaTaiSan,
                                kk.LanKiemKe,
                                kk.XacNhanKiemKe,
                                kk.MaTaiSanNew,
                                kk.BenhVien,
                                kk.PhanLoai,
                                kk.TenTaiSan,
                                kk.Model,
                                kk.Serial,
                                kk.TenDonViTinh,
                                kk.ThoiGianDuaVao,
                                kk.NguyenGia,
                                kk.Duoc_Id,
                                kk.SoLoNhap_Id,
                                kk.KhoDuoc_Id,
                                kk.ViTri_Id,
                                kk.SoLuong,
                                kk.TrangThaiKiemKe,
                                kk.IsCheckKiemKe,
                                kk.KhoaPhongSuDung,
                                kk.ViTri,
                                kk.GhiChu,
                                kk.KhoaQuanLy,
                                kk.SoLuongThucTe,
                                kk.ChenhLech,
                                kk.KhoaPhongHienTai,
                                kk.ViTriHienTai,
                                kk.GhiChuHienTai,
                                kk.TinhTrang,
                                CASE WHEN kk.CheckMaTaiSan = 1 THEN 'YES' ELSE 'NO' END AS CheckMaTaiSan,
                                nv.TenNhanVien AS NguoiTao,
                                nv.ChucDanh,
                                kk.createdAt AS NgayTao,
                                kk.NgayKiemKe,
                                kk.NamKiemKe,
                                (SELECT DISTINCT MIN(HOUR(NgayKiemKe)) AS GioBatDau FROM data_kiemkes WHERE 
                                    (XacNhanKiemKe = 1 AND KhoDuoc_Id = ${KhoTaiSan_Id} AND NgayKiemKe IS NOT NULL 
                                        AND DATE(NgayXacNhanKiemKe) BETWEEN '${tungay}' AND '${denngay}' AND DotKiemKe_Id IN (${DotKiemKe_Id}) ) 
                                        OR (XacNhanKiemKe = 1 AND KhoDuocSaiViTri_Id = ${KhoTaiSan_Id} AND NgayKiemKe IS NOT NULL 
                                        AND DATE(NgayXacNhanKiemKe) BETWEEN '${tungay}' AND '${denngay}' AND DotKiemKe_Id IN (${DotKiemKe_Id}))
                                ) AS GioBatDau,
                                (SELECT DISTINCT MIN(DAY(NgayKiemKe)) AS Ngay FROM data_kiemkes WHERE 
                                    (XacNhanKiemKe = 1 AND KhoDuoc_Id = ${KhoTaiSan_Id} AND NgayKiemKe IS NOT NULL
                                        AND DATE(NgayXacNhanKiemKe) BETWEEN '${tungay}' AND '${denngay}' AND DotKiemKe_Id IN (${DotKiemKe_Id}))
                                        OR (XacNhanKiemKe = 1 AND KhoDuocSaiViTri_Id = ${KhoTaiSan_Id} AND NgayKiemKe IS NOT NULL
                                        AND DATE(NgayXacNhanKiemKe) BETWEEN '${tungay}' AND '${denngay}' AND DotKiemKe_Id IN (${DotKiemKe_Id}))
                                ) AS TuNgayKK,
                                (SELECT DISTINCT  MAX(DAY(NgayXacNhanKiemKe)) AS Ngay FROM data_kiemkes 
                                    WHERE (XacNhanKiemKe = 1 AND KhoDuoc_Id =  ${KhoTaiSan_Id} AND NgayXacNhanKiemKe IS NOT null
                                                AND DATE(NgayXacNhanKiemKe) BETWEEN '${tungay}' AND '${denngay}' AND DotKiemKe_Id IN (${DotKiemKe_Id})) 
                                        OR (XacNhanKiemKe = 1 AND KhoDuocSaiViTri_Id =  ${KhoTaiSan_Id} AND NgayXacNhanKiemKe IS NOT null
                                        AND DATE(NgayXacNhanKiemKe) BETWEEN '${tungay}' AND '${denngay}' AND DotKiemKe_Id IN (${DotKiemKe_Id})) 
                                ) AS DenNgayKK,
                                (SELECT DISTINCT MIN(MONTH(NgayKiemKe)) AS Thang FROM data_kiemkes WHERE 
                                    (XacNhanKiemKe = 1 AND KhoDuoc_Id = ${KhoTaiSan_Id} AND NgayKiemKe IS NOT NULL 
                                        AND DATE(NgayXacNhanKiemKe) BETWEEN '${tungay}' AND '${denngay}' AND DotKiemKe_Id IN (${DotKiemKe_Id}))
                                        OR (XacNhanKiemKe = 1 AND KhoDuocSaiViTri_Id = ${KhoTaiSan_Id} AND NgayKiemKe IS NOT NULL 
                                        AND DATE(NgayXacNhanKiemKe) BETWEEN '${tungay}' AND '${denngay}' AND DotKiemKe_Id IN (${DotKiemKe_Id}))
                                ) AS TuThangKK,
                                (SELECT DISTINCT  MAX(MONTH(NgayXacNhanKiemKe)) AS Thang FROM data_kiemkes 
                                WHERE (XacNhanKiemKe = 1 AND KhoDuoc_Id = ${KhoTaiSan_Id} AND NgayXacNhanKiemKe IS NOT null
                                        AND DATE(NgayXacNhanKiemKe) BETWEEN '${tungay}' AND '${denngay}' AND DotKiemKe_Id IN (${DotKiemKe_Id})) 
                                        OR (XacNhanKiemKe = 1 AND KhoDuocSaiViTri_Id = ${KhoTaiSan_Id} AND NgayXacNhanKiemKe IS NOT null
                                            AND DATE(NgayXacNhanKiemKe) BETWEEN '${tungay}' AND '${denngay}' AND DotKiemKe_Id IN (${DotKiemKe_Id}))  
                                ) AS DenThangKK,
                                (SELECT DISTINCT MIN(YEAR(NgayKiemKe)) AS Nam FROM data_kiemkes WHERE 
                                    (XacNhanKiemKe = 1 AND KhoDuoc_Id = ${KhoTaiSan_Id} AND NgayKiemKe IS NOT NULL 
                                        AND DATE(NgayXacNhanKiemKe) BETWEEN '${tungay}' AND '${denngay}' AND DotKiemKe_Id IN (${DotKiemKe_Id}))
                                        OR (XacNhanKiemKe = 1 AND KhoDuocSaiViTri_Id = ${KhoTaiSan_Id} AND NgayKiemKe IS NOT NULL 
                                        AND DATE(NgayXacNhanKiemKe) BETWEEN '${tungay}' AND '${denngay}' AND DotKiemKe_Id IN (${DotKiemKe_Id}))
                                ) AS TuNamKK,
                                (SELECT DISTINCT  MAX(YEAR(NgayXacNhanKiemKe)) AS Nam FROM data_kiemkes 
                                WHERE (XacNhanKiemKe = 1 AND KhoDuoc_Id = ${KhoTaiSan_Id} AND NgayXacNhanKiemKe IS NOT null
                                        AND DATE(NgayXacNhanKiemKe) BETWEEN '${tungay}' AND '${denngay}' AND DotKiemKe_Id IN (${DotKiemKe_Id})) 
                                        OR (XacNhanKiemKe = 1 AND KhoDuocSaiViTri_Id = ${KhoTaiSan_Id} AND NgayXacNhanKiemKe IS NOT null
                                        AND DATE(NgayXacNhanKiemKe) BETWEEN '${tungay}' AND '${denngay}' AND DotKiemKe_Id IN (${DotKiemKe_Id}))   
                                ) AS DenNamKK,
                                (SELECT COUNT(*) FROM data_kiemkes 
                                    WHERE (KhoDuoc_Id = ${KhoTaiSan_Id} AND XacNhanKiemKe = 1  AND KhoDuocSaiViTri_Id IS null
                                            AND DATE(NgayXacNhanKiemKe) BETWEEN '${tungay}' AND '${denngay}' AND DotKiemKe_Id IN (${DotKiemKe_Id})
                                            ) 
                                    OR (KhoDuocSaiViTri_Id = ${KhoTaiSan_Id} AND XacNhanKiemKe = 1 
                                    AND DATE(NgayXacNhanKiemKe) BETWEEN '${tungay}' AND '${denngay}' AND DotKiemKe_Id IN (${DotKiemKe_Id})
                                        ) 
                                ) as TongSo,
                                (SELECT COUNT(*) FROM data_kiemkes 
                                    WHERE (KhoDuoc_Id = ${KhoTaiSan_Id} AND IsCheckKiemKe = 1 AND XacNhanKiemKe = 1  AND KhoDuocSaiViTri_Id IS null
                                            AND DATE(NgayXacNhanKiemKe) BETWEEN '${tungay}' AND '${denngay}' AND DotKiemKe_Id IN (${DotKiemKe_Id})
                                            ) 
                                    OR (KhoDuocSaiViTri_Id = ${KhoTaiSan_Id} AND IsCheckKiemKe = 1 AND XacNhanKiemKe = 1
                                    AND DATE(NgayXacNhanKiemKe) BETWEEN '${tungay}' AND '${denngay}' AND DotKiemKe_Id IN (${DotKiemKe_Id})
                                        )
                                ) AS DaKiem,
                                ((SELECT COUNT(*) FROM data_kiemkes 
                                    WHERE (KhoDuoc_Id = ${KhoTaiSan_Id} AND XacNhanKiemKe = 1   AND KhoDuocSaiViTri_Id IS null
                                            AND DATE(NgayXacNhanKiemKe) BETWEEN  '${tungay}' AND '${denngay}' AND DotKiemKe_Id IN (${DotKiemKe_Id})
                                            ) 
                                        OR (KhoDuocSaiViTri_Id = ${KhoTaiSan_Id} AND XacNhanKiemKe = 1 
                                        AND DATE(NgayXacNhanKiemKe) BETWEEN  '${tungay}' AND '${denngay}' AND DotKiemKe_Id IN (${DotKiemKe_Id})
                                        ) ) -
                                    (SELECT COUNT(*) FROM data_kiemkes 
                                    WHERE (KhoDuoc_Id = ${KhoTaiSan_Id} AND IsCheckKiemKe = 1 AND XacNhanKiemKe = 1   AND KhoDuocSaiViTri_Id IS null
                                            AND DATE(NgayXacNhanKiemKe) BETWEEN  '${tungay}' AND '${denngay}' AND DotKiemKe_Id IN (${DotKiemKe_Id})
                                            )  
                                        OR (KhoDuocSaiViTri_Id = ${KhoTaiSan_Id} AND IsCheckKiemKe = 1 AND XacNhanKiemKe = 1 
                                        AND DATE(NgayXacNhanKiemKe) BETWEEN  '${tungay}' AND '${denngay}' AND DotKiemKe_Id IN (${DotKiemKe_Id})
                                        ))
                                ) AS ConLai
                            FROM data_kiemkes kk
                            LEFT JOIN users u ON u.id = kk.NguoiTao
                            LEFT JOIN dm_nhanviens nv ON nv.id = u.nhanvien_id
                            WHERE 
                            (kk.KhoDuoc_Id = ${KhoTaiSan_Id} 
                            AND kk.XacNhanKiemKe = 1 
                            AND kk.KhoDuocSaiViTri_Id IS null
                            AND DATE(kk.NgayXacNhanKiemKe) BETWEEN '${tungay}' AND '${denngay}' 
                            AND kk.DotKiemKe_Id IN (${DotKiemKe_Id}) 
                            ) 
                            OR (kk.KhoDuocSaiViTri_Id = ${KhoTaiSan_Id}
                                AND kk.XacNhanKiemKe = 1 
                                AND DATE(kk.NgayXacNhanKiemKe) BETWEEN '${tungay}' AND '${denngay}'
                                AND kk.DotKiemKe_Id IN (${DotKiemKe_Id}) 
                                )
                            ORDER BY kk.IsCheckKiemKe DESC, kk.NgayKiemKe DESC ;
                        `;

                        let data_kiemke = await db.sequelize.query(query, { raw: false });
                        // Làm phẳng mảng và loại bỏ trùng lặp
                        let flatData = data_kiemke.flat();
                        const uniqueData = flatData.filter((value, index, self) =>
                            index === self.findIndex((t) => (
                                t.id === value.id
                            ))
                        );
                        const datakiemke = JSON.parse(JSON.stringify(uniqueData));
                        //console.log('datakiemke', datakiemke.length, DotKiemKe_Id, data.TimKiemKhoQuanLy)
                        if (datakiemke.length === 0) {
                            resolve({
                                errCode: 1,
                                errMessage: 'Không tìm thấy dữ liệu',
                                data: datakiemke
                            });
                        } else {
                            resolve({
                                errCode: 0,
                                errMessage: 'Tìm kiếm thành công',
                                data: datakiemke
                            });
                        }
                    } else {
                        const tungay = new Date(data.TuNgay).toISOString().split('T')[0];
                        const denngay = new Date(data.DenNgay).toISOString().split('T')[0];
                        let KhoTaiSan_Id = data.TimKiemKhoTaiSan_Id
                        let TimKiemKhoQuanLy = data.TimKiemKhoQuanLy
                        let DotKiemKe_Id_Int = data.DotKiemKe_Id
                        const DotKiemKe_Id = Number(DotKiemKe_Id_Int);
                        //console.log('getTaiSanXacNhanTheoKhoLichSu', KhoTaiSan_Id, TimKiemKhoQuanLy, DotKiemKe_Id, tungay, denngay)
                        let datakiemke = await db.sequelize.query('CALL sp_get_timkiem_data_kiemke_theokhoasudung(:KhoTaiSan_Id,:TimKiemKhoQuanLy,:DotKiemKe_Id,:tungay, :denngay)',
                            {
                                replacements: { KhoTaiSan_Id: KhoTaiSan_Id, TimKiemKhoQuanLy: TimKiemKhoQuanLy, DotKiemKe_Id: DotKiemKe_Id, tungay: tungay, denngay: denngay },
                                raw: true
                            }
                        );
                        //console.log('datakiemke', DotKiemKe_Id)
                        if (datakiemke.length === 0) {
                            resolve({
                                errCode: 1,
                                errMessage: 'Không tìm thấy dữ liệu',
                                data: datakiemke
                            });
                        } else {
                            resolve({
                                errCode: 0,
                                errMessage: 'Tìm kiếm thành công',
                                data: datakiemke
                            });
                        }
                    }
                } else {
                    //console.log('chạy b')
                    let tungay = data.TuNgay
                    let denngay = data.DenNgay
                    let TimKiemKhoQuanLy = data.TimKiemKhoQuanLy
                    // let datakiemke = await db.sequelize.query('CALL sp_get_timkiem_data_kiemke_theokhoaquanly_toanvien(:TimKiemKhoQuanLy,:tungay, :denngay)',
                    //     {
                    //         replacements: { TimKiemKhoQuanLy: TimKiemKhoQuanLy, tungay: tungay, denngay: denngay },
                    //         raw: true
                    //     }
                    // );
                    //console.log('TimKiemKhoQuanLy', TimKiemKhoQuanLy)
                    let DotKiemKe_Id_React = data.DotKiemKe_Id
                    // console.log('DotKiemKe_Id', DotKiemKe_Id)
                    // Tách thành mảng số nguyên
                    let DotKiemKe_Id_Array = DotKiemKe_Id_React.split(",").map(Number);
                    // Chuyển mảng thành chuỗi dùng trong MySQL
                    let DotKiemKe_Id = DotKiemKe_Id_Array.join(",");
                    let query = `
                            SELECT  
                                kk.STT,
                                kk.id,
                                kk.DotKiemKe_Id,
                                kk.KhoDuocSaiViTri_Id,
                                kk.MaTaiSan,
                                kk.LanKiemKe,
                                kk.XacNhanKiemKe,
                                kk.MaTaiSanNew,
                                kk.BenhVien,
                                kk.PhanLoai,
                                kk.TenTaiSan,
                                kk.Model,
                                kk.Serial,
                                kk.TenDonViTinh,
                                kk.ThoiGianDuaVao,
                                kk.NguyenGia,
                                kk.Duoc_Id,
                                kk.SoLoNhap_Id,
                                kk.KhoDuoc_Id,
                                kk.ViTri_Id,
                                kk.SoLuong,
                                kk.TrangThaiKiemKe,
                                kk.IsCheckKiemKe,
                                kk.KhoaPhongSuDung,
                                kk.ViTri,
                                kk.GhiChu,
                                kk.KhoaQuanLy,
                                kk.SoLuongThucTe,
                                kk.ChenhLech,
                                kk.KhoaPhongHienTai,
                                kk.ViTriHienTai,
                                kk.GhiChuHienTai,
                                kk.TinhTrang,
                                CASE WHEN kk.CheckMaTaiSan = 1 THEN 'YES' ELSE 'NO' END AS CheckMaTaiSan,
                                nv.TenNhanVien AS NguoiTao,
                                nv.ChucDanh,
                                kk.createdAt AS NgayTao,
                                kk.NgayKiemKe,
                                kk.NamKiemKe,
                                (SELECT DISTINCT MIN(HOUR(kk.NgayKiemKe)) AS GioBatDau FROM data_kiemkes kk
                                    WHERE (kk.XacNhanKiemKe = 1 AND kk.KhoaQuanLy = '${TimKiemKhoQuanLy}' AND kk.NgayKiemKe IS NOT null
                                    AND DATE(kk.NgayXacNhanKiemKe) BETWEEN '${tungay}' AND '${denngay}' AND kk.DotKiemKe_Id IN (${DotKiemKe_Id})) 
                                ) AS GioBatDau,
                                (SELECT DISTINCT  MIN(DAY(kk.NgayKiemKe)) AS Ngay FROM data_kiemkes kk
                                            WHERE (kk.XacNhanKiemKe = 1 AND kk.KhoaQuanLy = '${TimKiemKhoQuanLy}' AND kk.NgayKiemKe IS NOT null
                                            AND DATE(kk.NgayXacNhanKiemKe) BETWEEN '${tungay}' AND '${denngay}' AND kk.DotKiemKe_Id IN (${DotKiemKe_Id}))
                                ) AS TuNgayKK,
                                (SELECT DISTINCT MIN(MONTH(kk.NgayKiemKe)) AS Thang FROM data_kiemkes kk
                                            WHERE (kk.XacNhanKiemKe = 1 AND kk.KhoaQuanLy = '${TimKiemKhoQuanLy}' AND kk.NgayKiemKe IS NOT null
                                            AND DATE(kk.NgayXacNhanKiemKe) BETWEEN '${tungay}' AND '${denngay}' AND kk.DotKiemKe_Id IN (${DotKiemKe_Id}))
                                ) AS TuThangKK,
                                (SELECT DISTINCT  MIN(YEAR(kk.NgayKiemKe)) AS Nam FROM data_kiemkes kk
                                    WHERE (kk.XacNhanKiemKe = 1 AND kk.KhoaQuanLy = '${TimKiemKhoQuanLy}' AND kk.NgayKiemKe IS NOT null
                                    AND DATE(kk.NgayXacNhanKiemKe) BETWEEN '${tungay}' AND '${denngay}' AND kk.DotKiemKe_Id IN (${DotKiemKe_Id}))
                                ) AS TuNamKK,
                                (SELECT DISTINCT  MAX(DAY(kk.NgayXacNhanKiemKe)) AS Ngay FROM data_kiemkes kk
                                    WHERE (kk.XacNhanKiemKe = 1 AND kk.KhoaQuanLy = '${TimKiemKhoQuanLy}' AND kk.NgayXacNhanKiemKe IS NOT null
                                    AND DATE(kk.NgayXacNhanKiemKe) BETWEEN '${tungay}' AND '${denngay}' AND kk.DotKiemKe_Id IN (${DotKiemKe_Id}))
                                ) AS DenNgayKK,
                                (SELECT DISTINCT  MAX(MONTH(kk.NgayXacNhanKiemKe)) AS Thang FROM data_kiemkes kk
                                    WHERE (kk.XacNhanKiemKe = 1 AND kk.KhoaQuanLy = '${TimKiemKhoQuanLy}' AND kk.NgayXacNhanKiemKe IS NOT null
                                        AND DATE(kk.NgayXacNhanKiemKe) BETWEEN '${tungay}' AND '${denngay}' AND kk.DotKiemKe_Id IN (${DotKiemKe_Id}))
                                ) AS DenThangKK,
                                (SELECT DISTINCT  MAX(YEAR(kk.NgayXacNhanKiemKe)) AS Nam FROM data_kiemkes kk
                                    WHERE (kk.XacNhanKiemKe = 1 AND kk.KhoaQuanLy = '${TimKiemKhoQuanLy}' AND kk.NgayXacNhanKiemKe IS NOT null
                                        AND DATE(kk.NgayXacNhanKiemKe) BETWEEN '${tungay}' AND '${denngay}' AND kk.DotKiemKe_Id IN (${DotKiemKe_Id}))
                                ) AS DenNamKK,
                                (SELECT COUNT(*) FROM data_kiemkes kk
                                    WHERE kk.XacNhanKiemKe = 1 AND kk.KhoaQuanLy = '${TimKiemKhoQuanLy}'
                                    AND DATE(kk.NgayXacNhanKiemKe) BETWEEN '${tungay}' AND '${denngay}' AND kk.DotKiemKe_Id IN (${DotKiemKe_Id})
                                ) AS TongSo,
                                (SELECT COUNT(*) FROM data_kiemkes kk
                                    WHERE kk.XacNhanKiemKe = 1 AND IsCheckKiemKe = 1 AND kk.KhoaQuanLy = '${TimKiemKhoQuanLy}'
                                    AND DATE(kk.NgayXacNhanKiemKe) BETWEEN '${tungay}' AND '${denngay}' AND kk.DotKiemKe_Id IN (${DotKiemKe_Id})
                                ) AS DaKiem,
                                ((SELECT COUNT(*) FROM data_kiemkes kk
                                    WHERE kk.XacNhanKiemKe = 1 AND kk.KhoaQuanLy = '${TimKiemKhoQuanLy}'
                                    AND DATE(kk.NgayXacNhanKiemKe) BETWEEN '${tungay}' AND '${denngay}' AND kk.DotKiemKe_Id IN (${DotKiemKe_Id})
                                    ) - 
                                    (SELECT COUNT(*) FROM data_kiemkes kk
                                    WHERE kk.XacNhanKiemKe = 1 AND kk.IsCheckKiemKe = 1 AND kk.KhoaQuanLy ='${TimKiemKhoQuanLy}'
                                    AND DATE(kk.NgayXacNhanKiemKe) BETWEEN '${tungay}' AND '${denngay}' AND kk.DotKiemKe_Id IN (${DotKiemKe_Id})
                                )) AS ConLai
            
                            FROM data_kiemkes kk
                            LEFT JOIN users u ON u.id = kk.NguoiTao
                            LEFT JOIN dm_nhanviens nv ON nv.id = u.nhanvien_id

                             WHERE  (kk.XacNhanKiemKe = 1 
                                AND DATE(kk.NgayXacNhanKiemKe) BETWEEN '${tungay}' AND '${denngay}' 
                                AND kk.KhoaQuanLy = '${TimKiemKhoQuanLy}' 
                                AND kk.DotKiemKe_Id IN (${DotKiemKe_Id}) 
                            ) 
                            ORDER BY kk.IsCheckKiemKe DESC, kk.NgayKiemKe DESC ;
                        `;

                    let data_kiemke = await db.sequelize.query(query, { raw: false });
                    // Làm phẳng mảng và loại bỏ trùng lặp
                    let flatData = data_kiemke.flat();
                    const uniqueData = flatData.filter((value, index, self) =>
                        index === self.findIndex((t) => (
                            t.id === value.id
                        ))
                    );
                    const datakiemke = JSON.parse(JSON.stringify(uniqueData));
                    if (datakiemke.length === 0) {
                        resolve({
                            errCode: 1,
                            errMessage: 'Không tìm thấy dữ liệu',
                            data: datakiemke
                        });
                    } else {
                        resolve({
                            errCode: 0,
                            errMessage: 'Tìm kiếm thành công',
                            data: datakiemke
                        });
                    }
                }

                // if (report.length > 0) {
                //     resolve({
                //         errCode: 0,
                //         errMessage: 'Xuất báo cáo thành công',
                //         report: report
                //     });
                // } else {
                //     resolve({
                //         errCode: 1,
                //         errMessage: 'Không có dữ liệu',
                //         report: report
                //     });
                // }
            }
        } catch (e) {
            reject(e)
        }
    })
}
/////////////////


module.exports = {
    importPO: importPO,
    getAllPO: getAllPO,
    getMaChungTu: getMaChungTu,
    editMaTaiSan: editMaTaiSan,
    getOnePo: getOnePo,
    getAllPR: getAllPR,
    importPR: importPR,
    getOnePR: getOnePR,
    getSoPO: getSoPO,
    importHD: importHD,
    getAllHD: getAllHD,
    getChungTu: getChungTu,
    getOneHD: getOneHD,
    getAllLogChungTuHopDong: getAllLogChungTuHopDong,
    getCheckHopDong: getCheckHopDong,
    getAllLogChungTuPO: getAllLogChungTuPO,
    getCheckPO: getCheckPO,
    getAllLogPOPR: getAllLogPOPR,
    getCheckPR: getCheckPR,
    checkMaChungTuHD: checkMaChungTuHD,
    checkMaChungTuPO: checkMaChungTuPO,
    checkPOPR: checkPOPR,
    getAllCT: getAllCT,
    getOneCT: getOneCT,
    updateMaTaiSan: updateMaTaiSan,
    checkXoaChungTu: checkXoaChungTu,
    editMaTaiSanNew: editMaTaiSanNew,
    getCheckEditMaTaiSanPO: getCheckEditMaTaiSanPO,
    getCheckEditMaTaiSanPR: getCheckEditMaTaiSanPR,
    getCheckEditSoLuongPO: getCheckEditSoLuongPO,
    getCheckAllCT: getCheckAllCT,
    getCheckOneCT: getCheckOneCT,
    getCheckMaChungTu: getCheckMaChungTu,
    getCheckChungTu: getCheckChungTu,
    getCheckAllLogChungTuPO: getCheckAllLogChungTuPO,
    getCheckAllLogChungTuHopDong: getCheckAllLogChungTuHopDong,
    checkXoaCheckChungTu: checkXoaCheckChungTu,
    getCheckAll: getCheckAll,
    getLogPOPR: getLogPOPR,
    getAllTaiSan: getAllTaiSan,
    getAllDVT: getAllDVT,
    getAllBV: getAllBV,
    getAllPL: getAllPL,
    getAllTGBH: getAllTGBH,
    getAllTGKH: getAllTGKH,
    editTaiSan: editTaiSan,
    newTaiSan: newTaiSan,
    checkXoaTS: checkXoaTS,
    getAllKho: getAllKho,
    getTaiSanTheoKho: getTaiSanTheoKho,
    getAllKhoQL: getAllKhoQL,
    getTaiSanTheoKhoQL: getTaiSanTheoKhoQL,
    getMaTaiSanKiemKe: getMaTaiSanKiemKe,
    editKhoaPhongHienTai: editKhoaPhongHienTai,
    getAllViTri: getAllViTri,
    getAllTinhTrang: getAllTinhTrang,
    getAllKhoEdit: getAllKhoEdit,
    getDataDaKiemKe: getDataDaKiemKe,
    getSerialKiemKe: getSerialKiemKe,
    getAllNhanVien: getAllNhanVien,
    getAllNhanVienPhong: getAllNhanVienPhong,
    getAllKhoQLTK: getAllKhoQLTK,
    getAllTenTaiSan: getAllTenTaiSan,
    xacNhanThemTaiSan: xacNhanThemTaiSan,
    getAllNguoiLap: getAllNguoiLap,
    getKeToanTruong: getKeToanTruong,
    getKeToanTaiSan: getKeToanTaiSan,
    getGiamDoc: getGiamDoc,
    getLichSuKiemKe: getLichSuKiemKe,
    getTaiSanTheoKhoLichSu: getTaiSanTheoKhoLichSu,
    checkDataChuaXacNhan: checkDataChuaXacNhan,
    getTaiSanXacNhanTheoKhoLichSu: getTaiSanXacNhanTheoKhoLichSu,
    getTaiSanXacNhanAllKhoLichSu: getTaiSanXacNhanAllKhoLichSu,
    getTaiSanXacNhanToanVienKhoLichSu: getTaiSanXacNhanToanVienKhoLichSu

}
