const express = require("express")
const verifyJWT = require("../middleware/verifyJWT")
const brokerJWT=require('../middleware/brokerJWT')
const router = express.Router()
const Usercontroller= require("../controllers/user_controller");
// router.use(verifyJWT)

router.get("/getAllUsers",verifyJWT,brokerJWT, Usercontroller.getAllUsers)
router.get("/getbyid/:_id",verifyJWT, Usercontroller.getUserById)
router.put("/update",verifyJWT, Usercontroller.updateUser)
router.put("/updateRole",verifyJWT, Usercontroller.updateRole)
router.delete("/delete",verifyJWT, Usercontroller.deleteUser)

module.exports = router