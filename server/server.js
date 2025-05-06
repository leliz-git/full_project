const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const connectDB = require("./config/dbConn");
const multer = require("multer");
const path = require("path");
const PORT = process.env.PORT || 7001;
const app = express();

const http = require("http");
const { Server } = require("socket.io");

connectDB();
app.use(cors(corsOptions));
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // אפשר לכל מקורות הדפדפן להתחבר בזמן פיתוח
  },
});

// צ'אט בין משתמשים שונים
io.on("connection", (socket) => {
  const username = socket.handshake.query.username; // קבלת שם המשתמש מהלקוח
  socket.username = username || "משתמש לא מזוהה"; // ברירת מחדל אם אין שם משתמש

  console.log(`לקוח התחבר: ${socket.id}, שם משתמש: ${socket.username}`);

  socket.on("send_message", (data) => {
    const messageData = {
      sender: socket.username,
      text: data.text,
      time: new Date().toLocaleTimeString(),
    };
    io.emit("receive_message", messageData); // שליחה לכל המשתמשים
  });

  socket.on("disconnect", () => {
    console.log(`לקוח התנתק: ${socket.id}`);
  });
});



// Configure Multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Folder to store uploaded images
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Create unique file names
  },
});
const upload = multer({ storage });

// API endpoint to handle file uploads
app.post("/api/upload", upload.array("images[]", 10), (req, res) => {
  const files = req.files.map((file) => ({
    url: `http://localhost:7002/uploads/${file.filename}`, // Construct file URL
  }));
  res.status(200).json(files); // Send back the URLs of the uploaded files
});

app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Serve uploaded files

app.use(express.json());
app.use(express.static("public"));

app.use("/api/users", require("./routes/user_router"));
app.use("/api/apartments", require("./routes/apartment_router"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/recourse", require("./routes/recourse_router"));

mongoose.connection.once("open", () => {
  console.log("connect to MongoDB");
  server.listen(PORT, () => console.log(`server is running on port ${PORT}`));
});

mongoose.connection.on("error", (err) => {
  console.error("error MongoDB:", err);
});