const mongoose = require('mongoose')
const bcrypt= require('bcrypt')
require("dotenv").config()
const express = require("express")
const cors = require("cors")
const corsOptions = require("./config/corsOptions")
const connectDB = require("./config/dbConn")
const PORT = process.env.PORT || 7001
const app = express()
connectDB()

app.use(cors(corsOptions))
app.use(express.json())
app.use(express.static("public"))
app.use("/api/users", require("./routes/user_router"))
app.use("/api/apartments", require("./routes/apartment_router"))
app.use("/api/auth", require("./routes/authRoutes"))
app.use("/api/recourse", require("./routes/recourse_router"))

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))})

mongoose.connection.on('error', err => {
    console.log(err)})
    