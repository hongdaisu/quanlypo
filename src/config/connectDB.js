const { Sequelize } = require('sequelize');
// const mysql = require('mysql');
// Option 3: Passing parameters separately (other dialects)
const sequelize = new Sequelize('quanlycongvan', 'root', null, {
    host: 'localhost',
    dialect: 'mysql'
});

let connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Kết nối đến DB thành công...');
    } catch (error) {
        console.error('Kết nối đết DB thất bại:', error);
    }
}

// let connectDBMysql = () => {
//     var con = mysql.createConnection({
//         host: "localhost",
//         port: "3306",
//         user: "root",
//         password: "",
//         database: "node"
//     });
// }


module.exports = connectDB;
