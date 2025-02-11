import express from "express";
import bodyParser from "body-parser";
import viewEngine from "./config/viewEngine";
import initWebRoutes from './route/web';
import connectDB from './config/connectDB';
import cookieParser from "cookie-parser";
import http from "http";
import https from "https"; // Thêm import cho https
import fs from "fs"; // Thêm import cho fs
import { Server } from "socket.io";
import fetch from 'node-fetch';

require('dotenv').config();
let app = express();

// app.use(cors({ origin: true }));
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    //res.setHeader('Access-Control-Allow-Origin', process.env.URL_REACT);
    //res.setHeader('Access-Control-Allow-Origin', process.env.URL_REACT);
    res.setHeader('Access-Control-Allow-Origin',
        req.protocol === 'https' ? process.env.URL_REACT_HTTPS : process.env.URL_REACT);


    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    // res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, x-xsrf-token');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    // Pass to next layer of middleware
    next();
});

//config app
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.get('/proxy-image', async (req, res) => {
    try {
        const imageUrl = req.query.url;
        if (!imageUrl.startsWith('http://') && !imageUrl.startsWith('https://')) {
            throw new Error('URL is not absolute');
        }
        //console.log(`Fetching image from URL: ${decodeURIComponent(imageUrl)}`);
        const response = await fetch(decodeURIComponent(imageUrl));
        if (!response.ok) {
            throw new Error(`Failed to fetch image from source: ${imageUrl}`);
        }
        const buffer = await response.arrayBuffer();
        res.set('Content-Type', 'image/jpeg');
        res.send(Buffer.from(buffer));
    } catch (error) {
        console.error('Error fetching image:', error);
        res.status(500).send('Error fetching image');
    }
});


//config cookie -parser
app.use(cookieParser())

viewEngine(app);
initWebRoutes(app);
connectDB();
let port = process.env.PORT || 6969;
let portHttps = process.env.PORT_HTTPS || 6969; // Cổng cho HTTPS

app.use((req, res) => {
    return res.send('404 not found')
})

const server = http.createServer(app);

// Đường dẫn đến chứng chỉ và khóa riêng
const certPath = 'F:/QLPO/NODEJS/certificate.pem';
const keyPath = 'F:/QLPO/NODEJS/private-key.pem';

// // đưa lên server
// const certPath = 'D:/QLPO/NODEJS/certificate.pem';
// const keyPath = 'D:/QLPO/NODEJS/private-key.pem';

// Log đường dẫn đến file chứng chỉ
//console.log('Đường dẫn đến certificate:', certPath);
//console.log('Đường dẫn đến private key:', keyPath);

const httpsOptions = {
    key: fs.readFileSync(keyPath), // Đường dẫn đến khóa riêng
    cert: fs.readFileSync(certPath) // Đường dẫn đến chứng chỉ
};

// // Tạo server HTTPS
// const httpsOptions = {
//     key: fs.readFileSync('F:/QLPO/NODEJS/private-key.pem'), // Đường dẫn đến khóa riêng
//     cert: fs.readFileSync('F:/QLPO/NODEJS/certificate.pem') // Đường dẫn đến chứng chỉ
// };

const httpsServer = https.createServer(httpsOptions, app);

const io = new Server(server, {
    transports: ['websocket']
});

io.on("connection", (socket) => {
    console.log("Connected Socket");

    socket.on("disconnect", () => {
        console.log("Disconnected Socket");
    });

    socket.on("po_new_server", (data) => {
        io.emit("po_new_client", { yeucau_id: data.id, message: "" });
    });

    socket.on("pr_new_server", (data) => {
        io.emit("pr_new_client", { yeucau_id: data.id, message: "" });
    });

    socket.on("hd_new_server", (data) => {
        io.emit("hd_new_client", { yeucau_id: data.id, message: "" });
    });


    socket.on("getmachungtu_server", (data) => {
        io.emit("getmachungtu_client", { yeucau_id: data.id, message: "" });
    });

    socket.on("getchungtu_server", (data) => {
        io.emit("getchungtu_client", { yeucau_id: data.id, message: "" });
    });

    socket.on("getsopr_server", (data) => {
        io.emit("getsopr_client", { yeucau_id: data.id, message: "" });
    });

    socket.on("edit_mataisan_server", (data) => {
        io.emit("edit_mataisan_client", { yeucau_id: data.id, message: "" });
    });

    socket.on("edit_soluongpo_server", (data) => {
        io.emit("edit_soluongpo_client", { yeucau_id: data.id, message: "" });
    });

    socket.on("edit_dongiapo_server", (data) => {
        io.emit("edit_dongiapo_client", { yeucau_id: data.id, message: "" });
    });

    socket.on("edit_vat_server", (data) => {
        io.emit("edit_vat_client", { yeucau_id: data.id, message: "" });
    });

    socket.on("delete_hopdong_server", (data) => {
        io.emit("delete_hopdong_client", { yeucau_id: data.id, message: "" });
    });

    socket.on("delete_po_server", (data) => {
        io.emit("delete_po_client", { yeucau_id: data.id, message: "" });
    });

    socket.on("delete_ct_server", (data) => {
        io.emit("delete_ct_client", { yeucau_id: data.id, message: "" });
    });

    socket.on("delete_check_ct_server", (data) => {
        io.emit("delete_check_ct_client", { yeucau_id: data.id, message: "" });
    });

    socket.on("xacnhan_kiemke_server", (data) => {
        io.emit("xacnhan_kiemke_client", { DotKiemKe_Id: data.DotKiemKe_Id, message: "" });
    });

    socket.on("xacnhan_themtaisan_server", (data) => {
        io.emit("xacnhan_themtaisan_client", { DotKiemKe_Id: data.DotKiemKe_Id, message: "" });
    });

    socket.on("huyxacnhan_kiemke_server", (data) => {
        io.emit("huyxacnhan_kiemke_client", { DotKiemKe_Id: data.DotKiemKe_Id, message: "" });
    });

    socket.on("edit_vitrihientai_server", (data) => {
        io.emit("edit_vitrihientai_client", { DotKiemKe_Id: data.DotKiemKe_Id, errMessage: data.errMessage });
    });

    socket.on("edit_khoaphonghientai_server", (data) => {
        io.emit("edit_khoaphonghientai_client", { DotKiemKe_Id: data.DotKiemKe_Id, errMessage: data.errMessage });
    });

    socket.on("edit_ghichuhientai_server", (data) => {
        io.emit("edit_ghichuhientai_client", { DotKiemKe_Id: data.DotKiemKe_Id, errMessage: data.errMessage });
    });

    socket.on("edit_tinhtranghientai_server", (data) => {
        io.emit("edit_tinhtranghientai_client", { DotKiemKe_Id: data.DotKiemKe_Id, errMessage: data.errMessage });
    });

    socket.on("mataisan_kiemke_server", (data) => {
        io.emit("mataisan_kiemke_client", { DotKiemKe_Id: data.DotKiemKe_Id, message: "" });
    });

    socket.on("serial_kiemke_server", (data) => {
        io.emit("serial_kiemke_client", { DotKiemKe_Id: data.DotKiemKe_Id, message: "" });
    });


    socket.on("huy_kiemke_server", (data) => {
        io.emit("huy_kiemke_client", { DotKiemKe_Id: data.DotKiemKe_Id, message: "" });
    });

    socket.on("xoa_data_kiemke_server", (data) => {
        io.emit("xoa_data_kiemke_client", { DotKiemKe_Id: data.DotKiemKe_Id, message: "" });
    });

    socket.on("delete_pr_server", (data) => {
        io.emit("delete_pr_client", { yeucau_id: data.id, message: "" });
    });

    socket.on("delete_log_cthd_server", (data) => {
        io.emit("delete_log_cthd_client", { yeucau_id: data.id, message: "" });
    });

    socket.on("delete_check_log_cthd_server", (data) => {
        io.emit("delete_check_log_cthd_client", { yeucau_id: data.id, message: "" });
    });

    socket.on("delete_log_ctpo_server", (data) => {
        io.emit("delete_log_ctpo_client", { yeucau_id: data.id, message: "" });
    });

    socket.on("delete_check_log_ctpo_server", (data) => {
        io.emit("delete_check_log_ctpo_client", { yeucau_id: data.id, message: "" });
    });


    socket.on("delete_log_popr_server", (data) => {
        io.emit("delete_log_popr_client", { yeucau_id: data.id, message: "" });
    });

    socket.on("create_menu_cha_server", (data) => {
        io.emit("create_menu_cha_client", { yeucau_id: data.id, message: "" });
    });

    socket.on("edit_menu_cha_server", (data) => {
        io.emit("edit_menu_cha_client", { yeucau_id: data.id, message: "" });
    });

    socket.on("delete_menu_cha_server", (data) => {
        io.emit("delete_menu_cha_client", { yeucau_id: data.id, message: "" });
    });

    socket.on("delete_menu_con_server", (data) => {
        io.emit("delete_menu_con_client", { yeucau_id: data.id, message: "" });
    });

    socket.on("new_taisan_server", (data) => {
        io.emit("new_taisan_client", { yeucau_id: data.id, message: "" });
    });

    socket.on("edit_taisan_server", (data) => {
        io.emit("edit_taisan_client", { yeucau_id: data.id, message: "" });
    });

    socket.on("delete_taisan_server", (data) => {
        io.emit("delete_taisan_client", { yeucau_id: data.id, message: "" });
    });


    // Server-side: Nhận UserId từ client và xử lý logic với UserId đó
    socket.on("button_thanhtoan_server", (data) => {
        const { userId, benhan_id, yeucau_id } = data;
        //console.log('button_thanhtoan_server', userId)
        io.emit("button_thanhtoan_client", { yeucau_id: data.id, benhan_id: benhan_id, nguoikhoa: userId, message: "" });
    });

    socket.on("close_modal_server", (data) => {
        //console.log('close_modal_server')
        io.emit("close_modal_client", { yeucau_id: data.id, message: "" });
    });

    socket.on("new_phong_ban", (data) => {
        io.emit("phong_ban_new", { phong_ban_id: data.id, message: "" });
    });

    socket.on("edit_phong_ban", (data) => {
        io.emit("phong_ban_edited", { phong_ban_id: data.id, message: "" });
    });

    socket.on("delete_phong_ban", (data) => {
        io.emit("phong_ban_delete", { phong_ban_id: data.id, message: "" });
    });

    socket.on("delete_nhanvien", (data) => {
        io.emit("nhanvien_delete", { nhanvien_id: data.id, message: "" });
    });

    socket.on("edit_nhanvien", (data) => {
        //console.log('edit_nhanvien', data)
        io.emit("nhanvien_edited", { nhanvien_id: data.id, message: "" });
    });

    socket.on("new_nhanvien", (data) => {
        io.emit("nhanvien_new", { congvanden_id: data.id, message: "" });
    });



});

server.listen(port, () => {
    console.log("Kết nối server thành công:" + port)
});

httpsServer.listen(portHttps, () => {
    console.log("HTTPS Server running on port: " + portHttps);
});
// app.listen(port, () => {
//     console.log("Kết nối server thành công:" + port)
// })

// module.exports = app;