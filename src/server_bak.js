import express from "express";
import bodyParser from "body-parser";
//import viewEngine from "./config/viewEngine";
//import initWebRoutes from './route/web';
//import connectDB from './config/connectDB';

const connectDB = require('./config/connectDB.js')
const viewEngine = require('./config/viewEngine.js')
const initWebRoutes = require('./route/web.js')

import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";
import fetch from 'node-fetch';

require('dotenv').config();
let app = express();

// app.use(cors({ origin: true }));
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    //res.setHeader('Access-Control-Allow-Origin', process.env.URL_REACT);
    res.setHeader('Access-Control-Allow-Origin', process.env.URL_REACT);

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
        console.log(`Fetching image from URL: ${decodeURIComponent(imageUrl)}`);
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

app.use((req, res) => {
    return res.send('404 not found')
})

const server = http.createServer(app);

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

    socket.on("delete_pr_server", (data) => {
        io.emit("delete_pr_client", { yeucau_id: data.id, message: "" });
    });

    socket.on("delete_log_cthd_server", (data) => {
        io.emit("delete_log_cthd_client", { yeucau_id: data.id, message: "" });
    });

    socket.on("delete_log_ctpo_server", (data) => {
        io.emit("delete_log_ctpo_client", { yeucau_id: data.id, message: "" });
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
// app.listen(port, () => {
//     console.log("Kết nối server thành công:" + port)
// })

// module.exports = app;