const express = require("express")
const router = express.Router()
const authController = require("../controllers/authController")




router.post("/login", authController.login)
router.post("/register", authController.register)
router.post("/Broker_register", authController.Broker_register)

module.exports = router