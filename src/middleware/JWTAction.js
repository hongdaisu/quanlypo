require('dotenv').config();
import jwt from 'jsonwebtoken';
import { getGroupWithRoles } from '../services/JWTService';
// kiểm tra đường dẫn không cần phân quyền
const nonSecurePaths = ['/', '/api/login', '/api/login-token', '/api/logout', '/api/create-new-rolegroup', '/api/delete-rolegroup',
    // KHI ĐƯA LÊN SERVER THÌ KO CẦN CÁC LINK NÀY
    // 'http://10.22.10.22:8082',
    //'http://dn-qlpo.fhmc.com:8086',
    // 'http://localhost:8082',
    //'http://qlpo.local:8086',
    //'https://qlpo.local:8087',
    //'http://10.22.22.1:8084', 
    //'/api/get-menu/',
    '/api/get-group_id/', '/api/get-magroup',
    '/api/url-view', '/api/get-group_id/undefined', '/api/exportcongvanden', '/api/exportcongvandi',
    '/api/get-all-select-menu-cha', '/api/get-all-nhomquyen', '/api/get-all-menucha', '/api/get-all-menu-con',
    '/api/delete-po', '/api/delete-pr', '/api/delete-log-popr', '/api/delete-hopdong', '/api/delete-log-ctpo', '/api/delete-log-cthd',
    '/api/delete-ct', '/api/delete-check-ct', '/api/download-file/TemplatePO.xlsx', '/api/download-file/TemplatePR.xlsx', '/api/download-file/TemplateHD.xlsx',
    '/api/exportnhapncc', '/api/export-kiemketaisan',
    // '/api/download-po/DataPO.xlsx', '/api/download-pr/DataPR.xlsx', '/api/download-hd/DataHD.xlsx',
    '/api/exportdatapo', '/api/exportdatapr', '/api/exportdatahd', '/api/get-check-editmataisanpo', '/api/get-check-editmataisanpr',
    '/api/get-check-editsoluongpo', '/api/delete-check-log-ctpo', '/api/delete-check-log-cthd', '/api/get-check-all',
    '/api/get-all-dvt', '/api/get-all-bv', '/api/get-all-pl', '/api/get-all-tgbh', '/api/get-all-tgkh', '/api/edit-taisan', '/api/create-new-ts'
    , '/api/delete-taisan', '/api/get-all-kho', '/api/get-all-khoql', '/api/get-lankiemke'
    , '/api/edit-khoaphonghientai', '/api/get-all-vitri', '/api/get-all-tinhtrang', '/api/get-all-kho-edit', '/api/xacnhan-kiemke', '/api/huyxacnhan-kiemke'
    , '/api/delete-data-kiemke', '/api/timkiem-data-kiemke', '/api/get-all-nhanvien', '/api/get-all-nhanvien-phong', '/api/get-all-kho-qltk'
    , '/api/get-all-tentaisan', '/api/xacnhan-themtaisan', '/api/get-all-nguoilap', '/api/get-all-ketoantruong', '/api/get-all-ketoantaisan'
    , '/api/get-all-giamdoc', '/api/huy-kiemke', '/api/get-lichsukiemke', '/api/get-taisantheokho-lichsu', '/api/checkdata-chuaxacnhan'
    , '/api/get-taisanxacnhantheokho-lichsu', '/api/get-taisanxacnhanallkho-lichsu', '/api/get-taisanxacnhantoanvien-kho-lichsu', '/api/get-all-nguoisudung'
    , '/api/check-dongbo'
];


// const nonSecurePathsGroup = ['api/get-group_id/undefined'];


const createJWT = (payload) => {
    // console.log('createJWT')
    let key = process.env.JWT_SECRET;
    let token = null;
    try {
        token = jwt.sign(payload, key);
        // console.log(token)
    } catch (err) {
        console.log(err)
    }
    // console.log('createJWT token', token)
    return token;
}

const verifyToken = (token) => {
    // console.log('verifyToken')
    // console.log('verifyToken', token)
    let key = process.env.JWT_SECRET;
    let decoded = null;
    try {
        decoded = jwt.verify(token, key);
    } catch (err) {
        console.log(err)
    }
    // console.log(decoded)
    return decoded;
}

const combineJWTFromCookies = (req) => {
    try {
        const jwtPartsCount = req.cookies.jwt_parts_count;
        let combinedJWT = '';

        // Duyệt qua từng phần của JWT trong cookie và nối chúng lại với nhau
        for (let i = 0; i < jwtPartsCount; i++) {
            const jwtPart = req.cookies[`jwt_${i}`];
            combinedJWT += jwtPart;
        }

        return combinedJWT;
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }
};

const removeCookiesByPrefix = (req, res, prefix) => {
    const cookies = Object.keys(req.cookies);
    cookies.forEach(cookie => {
        if (cookie.startsWith(prefix)) {
            res.clearCookie(cookie);
        }
    });
};

const removeAllCookies = (req, res) => {
    try {
        const cookies = Object.keys(req.cookies);
        cookies.forEach(cookie => {
            res.clearCookie(cookie);
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }
};

function parseExpiresIn(expiresIn) {
    try {
        const regex = /^(\d+)([smhd])$/; // Biểu thức chính quy để phân tích "1m" thành [1, "m"]
        const matches = expiresIn.match(regex);
        if (matches) {
            const value = parseInt(matches[1]); // Lấy giá trị số
            const unit = matches[2]; // Lấy đơn vị thời gian
            switch (unit) {
                case "s":
                    return value;
                case "m":
                    return value * 60; // Phút thành giây
                case "h":
                    return value * 3600; // Giờ thành giây
                // case "d":
                //     return value * 86400; // Ngày thành giây
                // default:
                //     return null; // Đơn vị không hợp lệ
            }
        } else {
            return null; // Chuỗi không hợp lệ
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }
}


const checkUserJWT = async (req, res, next) => {
    //console.log('checkUserJWT');
    try {
        if (nonSecurePaths.includes(req.path)) return next();
        // const isNonSecurePath = nonSecurePaths.some(path => req.path.startsWith(path));

        // if (isNonSecurePath) {
        //     return next(); // Bỏ qua kiểm tra phân quyền nếu đường dẫn không yêu cầu
        // }
        const combinedJWT = combineJWTFromCookies(req);
        // console.log('req.cookies', req.cookies);
        if (combinedJWT) {
            // console.log('combinedJWT');
            // if (nonSecurePathsGroup.includes(req.path)) return next();
            let decoded = verifyToken(combinedJWT);
            let user = { use_groupId: decoded.use_groupId };
            let groupWithRoles = await getGroupWithRoles(user);

            if (decoded) {
                let expiresIn = decoded.expiresIn
                const expiresInInSeconds = parseExpiresIn(expiresIn);
                const currentTimestamp = Math.floor(Date.now() / 1000);
                const issuedAtTimestamp = decoded.iat
                // Tính thời gian hết hạn của cookie
                const expirationTimestamp = issuedAtTimestamp + expiresInInSeconds;
                // console.log('expirationTimestamp', expirationTimestamp);
                // console.log('currentTimestamp', currentTimestamp);

                // Kiểm tra xem cookie có hết hạn chưa
                if (currentTimestamp < expirationTimestamp) {
                    // console.log("Cookie còn hợp lệ.");
                    let payload = {
                        ...decoded,
                        groupWithRoles: groupWithRoles
                    };
                    let newToken = createJWT(payload);
                    const maxCookieLength = 4000; // Giả sử giới hạn là 4000 thay vì 4096 để tránh vấn đề
                    // Tính số lượng phần JWT cần chia nhỏ
                    const jwtPartsCount = Math.ceil(newToken.length / maxCookieLength);
                    // Lưu số lượng phần của JWT vào cookie
                    res.cookie('jwt_parts_count', jwtPartsCount, { httpOnly: true, maxAge: 60 * 60 * 10000 })
                    // Chia nhỏ chuỗi JWT thành các phần có độ dài tối đa là maxCookieLength
                    for (let i = 0; i < jwtPartsCount; i++) {
                        const startIndex = i * maxCookieLength;
                        const endIndex = Math.min((i + 1) * maxCookieLength, newToken.length);
                        const jwtPart = newToken.substring(startIndex, endIndex);
                        // res.cookie(`jwt_${i}`, jwtPart, { expires: 7 });
                        res.cookie(`jwt_${i}`, jwtPart, { httpOnly: true, maxAge: 60 * 60 * 10000 })
                    }
                    req.user = payload;
                    next();
                } else {
                    // console.log("Cookie đã hết hạn.");
                    removeAllCookies(req, res);
                    return res.status(302).json({
                        errCode: -1,
                    });
                }
            } else {
                return res.status(401).json({
                    errCode: -1,
                    data: '',
                    errMessage: 'Not authenticated'
                });
                // removeAllCookies(req, res);
                // return res.status(302).json({
                //     errCode: -1,
                // });
            }
        } else {
            // console.log('Un combinedJWT');
            removeAllCookies(req, res);
            return res.status(302).json({
                errCode: -1,
            });
        }
    } catch (error) {
        // console.log('combinedJWT', combinedJWT);
        console.error(error);
        return res.status(500).json({
            errCode: -1,
            data: '',
            errMessage: 'Internal server error 1'
        });
    }
};


const checkUserPermission = (req, res, next) => {
    try {
        //console.log('checkUserPermission')
        // kiểm tra đường dẫn không cần phân quyền

        if (nonSecurePaths.includes(req.path)) return next();
        // const isNonSecurePath = nonSecurePaths.some(path => req.path.startsWith(path));

        // if (isNonSecurePath) {
        //     return next(); // Bỏ qua kiểm tra phân quyền nếu đường dẫn không yêu cầu
        // }
        if (req.user) {
            // console.log('checkUserPermission không lỗi')
            // if (nonSecurePathsGroup.includes(req.path)) return next();
            let email = req.user.email
            let roles = req.user.groupWithRoles.reduce((acc, curr) => acc.concat(Object.values(curr)), []).filter(item => item && item.id);
            let Url = req.path
            let currentUrl = Url.replace(/\/\d+(\/\d*)*\/?$/, '');
            // console.log('check currentUrl', currentUrl)
            if (!roles || roles.length === 0) {
                return res.status(403).json({
                    errCode: -1,
                    data: '',
                    errMessage: 'Không được phân quyền'
                })
            }
            let VIEW = roles.some(item => item.url === currentUrl);

            // console.log('check VIEW', VIEW)
            if (currentUrl === `/api/get-action`) {
                // console.log('next')
                next();
            } else {
                // console.log('stop')
                if (VIEW === true) {
                    next();
                } else {
                    return res.status(403).json({
                        errCode: -1,
                        data: '',
                        errMessage: 'Không được phân quyền 1'
                    })
                }
            }
        } else {
            // console.log('checkUserPermission lỗi')
            return res.status(401).json({
                errCode: -1,
                data: Button,
                errMessage: 'Not authenticated'
            })
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }

}

const checkButonPermission = (req, res, next) => {
    try {
        //console.log('checkButonPermission')
        // kiểm tra đường dẫn không cần phân quyền
        if (nonSecurePaths.includes(req.path)) return next();
        // const isNonSecurePath = nonSecurePaths.some(path => req.path.startsWith(path));

        // if (isNonSecurePath) {
        //     return next(); // Bỏ qua kiểm tra phân quyền nếu đường dẫn không yêu cầu
        // }
        let Button = req.body.actionButton
        //console.log('Button', Button)
        if (req.user) {
            //console.log('req.user', Button)
            // if (nonSecurePathsGroup.includes(req.path)) return next();
            // let roles = req.user.groupWithRoles
            let roles = req.user.groupWithRoles.reduce((acc, curr) => acc.concat(Object.values(curr)), []).filter(item => item && item.id);
            //console.log('req.user', roles)
            if (!roles || roles.length === 0) {
                return res.status(403).json({
                    errCode: -1,
                    data: '',
                    errMessage: 'Không được phân quyền'
                })
            }
            let buttonAction = roles.some(item => item.action === Button);
            //console.log('buttonAction', buttonAction)
            if (Button === undefined) {
                next();
            } else {
                if (buttonAction === true) {
                    next();
                } else {
                    return res.status(403).json({
                        errCode: -1,
                        data: '',
                        errMessage: 'Không được phân quyền'
                    })
                }
            }

        } else {
            return res.status(401).json({
                errCode: -1,
                data: Button,
                errMessage: 'Not authenticated'
            })
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }
}

module.exports = {
    createJWT, verifyToken, checkUserJWT, checkUserPermission, checkButonPermission
}