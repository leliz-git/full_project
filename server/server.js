const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const connectDB = require("./config/dbConn");

const PORT = process.env.PORT || 7001;
const app = express();

const http = require("http");
const { Server } = require("socket.io");

connectDB();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// צ'אט בין מתווך למוכר
io.on("connection", (socket) => {
  console.log("לקוח התחבר:", socket.id);

  socket.on("send_message", (data) => {
    console.log("הודעה התקבלה:", data);
    // שלח את ההודעה לכל המשתמשים כולל השולח
    io.emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("לקוח התנתק:", socket.id);
  });
});

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static("public"));

app.use("/api/users", require("./routes/user_router"));
app.use("/api/apartments", require("./routes/apartment_router"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/recourse", require("./routes/recourse_router"));

mongoose.connection.once("open", () => {
  console.log("✔ מחובר ל-MongoDB");
  server.listen(PORT, () => console.log(`🚀 השרת פועל על פורט ${PORT}`));
});

mongoose.connection.on("error", (err) => {
  console.error("שגיאת MongoDB:", err);
});