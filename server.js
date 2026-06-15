const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

// Cho phép truyền dữ liệu chéo miền giữa Frontend (Port 5500) và Backend (Port 5000)
app.use(cors());
app.use(express.json());

// 1. CẤU HÌNH LIÊN KẾT ĐẾN CƠ SỞ DỮ LIỆU MYSQL TRÊN MÁY LOCAL (XAMPP)
const db = mysql.createConnection({
  host: "localhost",
  user: "root", // Mặc định của XAMPP là root
  password: "", // Mặc định của XAMPP là bỏ trống
  database: "torano_shop", // Tên database bạn tạo trong phpMyAdmin
});

// Tiến hành kết nối dữ liệu
db.connect((err) => {
  if (err) {
    console.error("Không thể kết nối MySQL. Lỗi: " + err.message);
    return;
  }
  console.log("=> ĐÃ KẾT NỐI ĐẾN CƠ SỞ DỮ LIỆU MYSQL THÀNH CÔNG!");
});

// 2. ĐƯỜNG DẪN API (ROUTE) LẤY SẢN PHẨM ĐỂ TRẢ VỀ CHO FRONTEND USER
app.get("/api/products", (req, res) => {
  const querySql = "SELECT * FROM products";

  db.query(querySql, (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Lỗi truy vấn cơ sở dữ liệu: " + err.message });
    }
    // Trả kết quả mảng sản phẩm dạng JSON sạch về cho client
    res.json(results);
  });
});

// Khởi chạy máy chủ Server ở cổng 5000
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`=> SERVER BACKEND ĐANG CHẠY ỔN ĐỊNH TẠI PORT: ${PORT}`);
});
