const express = require("express")
const verifyJWT = require("../middleware/verifyJWT")
const brokerJWT=require('../middleware/brokerJWT')
const router = express.Router()
const Usercontroller= require("../controllers/recourse_controller");

router.get("/getAllRecourse",verifyJWT,brokerJWT, Usercontroller.getAllRecourse)
router.post("/add",verifyJWT, Usercontroller.createNewRecourse)
router.get("/getbyid/:id",brokerJWT,verifyJWT, Usercontroller.getRecourseById)
router.put("/update",verifyJWT,brokerJWT, Usercontroller.updateRecourse)
// router.delete("/delete",verifyJWT, Usercontroller.deleteUser)

module.exports = router

