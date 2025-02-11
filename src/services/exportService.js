
import db from "../models/index";
require('dotenv').config();
const mssql = require('mssql');
const { Sequelize } = require('sequelize');

let exportNhapNCC = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            // console.log('data', data)
            const validationRules = [
                { field: 'tungay_ct', message: 'Vui lòng chọn Từ ngày.' },
                { field: 'denngay_ct', message: 'Vui lòng chọn Đến ngày.' },
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
                let tungay = data.tungay_ct
                let denngay = data.denngay_ct
                let report = await db.sequelize.query('CALL sp_baocaonhapnhacungcap(:tungay, :denngay)',
                    {
                        replacements: { tungay: tungay, denngay: denngay },
                        raw: true
                    }
                );
                if (report.length > 0) {
                    resolve({
                        errCode: 0,
                        errMessage: 'Xuất báo cáo thành công',
                        report: report
                    });
                } else {
                    resolve({
                        errCode: 1,
                        errMessage: 'Không có dữ liệu',
                        report: report
                    });
                }
            }
        } catch (e) {
            reject(e)
        }
    })
}

let exportKiemKeTaiSan = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            // console.log('data', data)
            const validationRules = [
                { field: 'tungay_kk', message: 'Vui lòng chọn Từ ngày.' },
                { field: 'denngay_kk', message: 'Vui lòng chọn Đến ngày.' },
                { field: 'KhoQuanLy', message: 'Vui lòng chọn kho quản lý.' },

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
                if (data.KhoQuanLy === 'TẤT CẢ KHO') {
                    const request = db.sqlhis2Connection.request();
                    let KhoQuanLy = data.KhoQuanLy;
                    //console.log('KhoQuanLy', KhoQuanLy)
                    //request.input('KhoQuanLy', mssql.NVarChar, KhoQuanLy);
                    request.queryTimeout = 60000;
                    const getdata = await request.execute('[sp_QLPO_GET_ALL_TAISANTHEOKHO]');
                    // //console.log('KhoTaiSan_Id', KhoTaiSan_Id, KhoQuanLy)
                    // // Lấy dữ liệu từ recordset
                    const datataisan = getdata.recordset;
                    //console.log('data', datataisan)

                    let tungay = data.tungay_kk
                    let denngay = data.denngay_kk
                    let report = await db.sequelize.query('CALL sp_baocaokiemketaisan_all(:tungay, :denngay)',
                        {
                            replacements: { tungay: tungay, denngay: denngay },
                            raw: true
                        }
                    );

                    const plainReport = JSON.parse(JSON.stringify(report));

                    //console.log('plainReport', plainReport)

                    const additionalFields = {
                        LanKiemKe: null,
                        XacNhanKiemKe: null,
                        TrangThaiKiemKe: null,
                        IsCheckKiemKe: null,
                        SoLuongThucTe: null,
                        ChenhLech: null,
                        KhoaPhongHienTai: null,
                        ViTriHienTai: null,
                        GhiChuHienTai: null,
                        TinhTrang: null,
                        NguoiTao: null,
                        NgayTao: null,
                        NgayKiemKe: null,
                        NgayXacNhanKiemKe: null,
                    };

                    // Lấy danh sách Duoc_Id từ report
                    const reportDuocIds = plainReport.map((item) => item.Duoc_Id);

                    // Tìm các phần tử trong data nhưng không có trong report
                    const notInReport = datataisan.filter((item) => !reportDuocIds.includes(item.Duoc_Id));

                    // Bổ sung các trường với giá trị null vào các đối tượng tìm được
                    const newItems = notInReport.map((item) => ({
                        ...item,
                        ...additionalFields,
                    }));

                    // Thêm các phần tử tìm được vào mảng report
                    const updatedReport = [...plainReport, ...newItems];
                    if (updatedReport.length > 0) {
                        resolve({
                            errCode: 0,
                            errMessage: 'Xuất báo cáo thành công',
                            report: updatedReport
                        });
                    }
                } else {
                    const request = db.sqlhis2Connection.request();
                    let KhoQuanLy = data.KhoQuanLy;
                    //console.log('KhoQuanLy', KhoQuanLy)
                    request.input('KhoQuanLy', mssql.NVarChar, KhoQuanLy);
                    request.queryTimeout = 60000;
                    const getdata = await request.execute('[sp_QLPO_GETTAISANTHEOKHO_QUANLY]');
                    // //console.log('KhoTaiSan_Id', KhoTaiSan_Id, KhoQuanLy)
                    // // Lấy dữ liệu từ recordset
                    const datataisan = getdata.recordset;
                    //console.log('data', datataisan)

                    let tungay = data.tungay_kk
                    let denngay = data.denngay_kk
                    let report = await db.sequelize.query('CALL sp_baocaokiemketaisan(:tungay, :denngay,:KhoQuanLy)',
                        {
                            replacements: { tungay: tungay, denngay: denngay, KhoQuanLy: KhoQuanLy },
                            raw: true
                        }
                    );

                    const plainReport = JSON.parse(JSON.stringify(report));

                    //console.log('plainReport', plainReport)

                    const additionalFields = {
                        LanKiemKe: null,
                        XacNhanKiemKe: null,
                        TrangThaiKiemKe: null,
                        IsCheckKiemKe: null,
                        SoLuongThucTe: null,
                        ChenhLech: null,
                        KhoaPhongHienTai: null,
                        ViTriHienTai: null,
                        GhiChuHienTai: null,
                        TinhTrang: null,
                        NguoiTao: null,
                        NgayTao: null,
                        NgayKiemKe: null,
                        NgayXacNhanKiemKe: null,
                    };

                    // Lấy danh sách Duoc_Id từ report
                    const reportDuocIds = plainReport.map((item) => item.Duoc_Id);

                    // Tìm các phần tử trong data nhưng không có trong report
                    const notInReport = datataisan.filter((item) => !reportDuocIds.includes(item.Duoc_Id));

                    // Bổ sung các trường với giá trị null vào các đối tượng tìm được
                    const newItems = notInReport.map((item) => ({
                        ...item,
                        ...additionalFields,
                    }));

                    // Thêm các phần tử tìm được vào mảng report
                    const updatedReport = [...plainReport, ...newItems];
                    if (updatedReport.length > 0) {
                        resolve({
                            errCode: 0,
                            errMessage: 'Xuất báo cáo thành công',
                            report: updatedReport
                        });
                    }

                    //console.log('Danh sách mới của report:', updatedReport);

                    // if (updatedReport.length > 0) {
                    //     resolve({
                    //         errCode: 0,
                    //         errMessage: 'Xuất báo cáo thành công',
                    //         report: updatedReport
                    //     });
                    // } else {
                    //     resolve({
                    //         errCode: 1,
                    //         errMessage: 'Không có dữ liệu',
                    //         //report: updatedReport
                    //     });
                    // }
                }

            }
        } catch (e) {
            reject(e)
        }
    })
}

let exportDataPO = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let report = await db.sequelize.query('CALL sp_get_all_po', { raw: true });
            if (report.length > 0) {
                resolve({
                    errCode: 0,
                    errMessage: 'Xuất báo cáo thành công',
                    report: report
                });
            } else {
                resolve({
                    errCode: 1,
                    errMessage: 'Không có dữ liệu',
                    report: report
                });
            }
        } catch (e) {
            reject(e)
        }
    })
}

let exportDataPR = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let report = await db.sequelize.query('CALL sp_get_all_pr', { raw: true });
            if (report.length > 0) {
                resolve({
                    errCode: 0,
                    errMessage: 'Xuất báo cáo thành công',
                    report: report
                });
            } else {
                resolve({
                    errCode: 1,
                    errMessage: 'Không có dữ liệu',
                    report: report
                });
            }
        } catch (e) {
            reject(e)
        }
    })
}

let exportDataHD = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let report = await db.sequelize.query('CALL sp_get_all_hd', { raw: true });
            if (report.length > 0) {
                resolve({
                    errCode: 0,
                    errMessage: 'Xuất báo cáo thành công',
                    report: report
                });
            } else {
                resolve({
                    errCode: 1,
                    errMessage: 'Không có dữ liệu',
                    report: report
                });
            }
        } catch (e) {
            reject(e)
        }
    })
}

let exportBienLaiChiTiet = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            // console.log('data', data)
            const validationRules = [
                { field: 'tungay_chitiet', message: 'Vui lòng chọn Từ ngày.' },
                { field: 'denngay_chitiet', message: 'Vui lòng chọn Đến ngày.' },
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
                let tungay = data.tungay_chitiet
                let denngay = data.denngay_chitiet
                let report = await db.sequelize.query('CALL sp_baocaobienlaichitiet(:tungay, :denngay)',
                    {
                        replacements: { tungay: tungay, denngay: denngay },
                        raw: true
                    }
                );
                resolve({
                    errCode: 0,
                    errMessage: 'Xuất báo cáo thành công',
                    report: report
                });
                // resolve(report)
            }
        } catch (e) {
            reject(e)
        }
    })
}


let exportDoiChieuDongBo = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const request = db.sqlhis2Connection.request();

            // console.log('data', data)
            const validationRules = [
                { field: 'tungay_dongbo', message: 'Vui lòng chọn Từ ngày.' },
                { field: 'denngay_dongbo', message: 'Vui lòng chọn Đến ngày.' },
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
                let tungay = data.tungay_dongbo
                let denngay = data.denngay_dongbo

                request.input('TuNgay', mssql.DateTime, tungay);
                request.input('DenNgay', mssql.DateTime, denngay);
                const getdata = await request.execute('[sp_QLTN_ThongTinBenhNhanDongBo]');
                // Lấy dữ liệu từ recordset
                const recordset = getdata.recordset;
                //console.log('recordset', recordset)
                let data_benhnhan_tool = await db.sequelize.query('CALL sp_databenhnhan(:tungay, :denngay)',
                    {
                        replacements: { tungay: tungay, denngay: denngay },
                        raw: true
                    }
                );

                //console.log('data_benhnhan_tool', data_benhnhan_tool)

                // Tạo mảng chứa tất cả BENHNHAN_ID từ data_benhnhan_tool
                const benhnhanIdsToExclude = data_benhnhan_tool.map(item => item.BENHNHAN_ID);

                // Lọc các đối tượng trong recordset mà có BENHAN_ID không nằm trong mảng benhnhanIdsToExclude
                const filteredRecordset = recordset.filter(item => !benhnhanIdsToExclude.includes(item.BENHAN_ID));
                //console.log('filteredRecordset', filteredRecordset)
                if (filteredRecordset.length > 0) {
                    resolve({
                        errCode: 0,
                        errMessage: 'Xuất báo cáo thành công',
                        report: filteredRecordset
                    });
                } else {
                    resolve({
                        errCode: 0,
                        errMessage: 'Xuất báo cáo thành công',
                        report: filteredRecordset
                    });
                }
                // resolve({
                //     errCode: 0,
                //     errMessage: 'Xuất báo cáo thành công',
                //     report: report
                // });
            }
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    exportNhapNCC: exportNhapNCC,
    exportBienLaiChiTiet: exportBienLaiChiTiet,
    exportDoiChieuDongBo: exportDoiChieuDongBo,
    exportDataPO: exportDataPO,
    exportDataPR: exportDataPR,
    exportDataHD: exportDataHD,
    exportKiemKeTaiSan: exportKiemKeTaiSan
}
