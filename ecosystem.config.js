module.exports = {
  apps: [
    {
      name: "QLPO", // Tên ứng dụng
      script: "indexstart.js", // Đường dẫn đến tệp mới
      watch: true, // Bật chế độ theo dõi
      env: {
        NODE_ENV: "development", // Thiết lập biến môi trường
      },
    },
  ],
};
