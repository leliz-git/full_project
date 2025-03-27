const verifyJWT = require("../middleware/verifyJWT")
const brokerJWT=require('../middleware/brokerJWT')
const express = require("express")
const router = express.Router()
const Apartmentcontroller= require("../controllers/apartment_controller");

router.get("/getAllApartments",verifyJWT, Apartmentcontroller.getAllApartment)
router.get("/getAllApartmentsByBroker",verifyJWT,brokerJWT, Apartmentcontroller.getAllApartmentByBroker)
router.get("/getbyid/:id",verifyJWT, Apartmentcontroller.getApartmentById)
// router.post("/add",verifyJWT,brokerJWT, Usercontroller.createNewApartment)
router.post("/add",verifyJWT, Apartmentcontroller.createNewApartment)//זה יישמר במסד נתונים בתור דירה, צריך לשנות בקבלת כל הדירות שרק אם זה טופל ע"י המתווך יראו את זה
router.put("/update",verifyJWT,brokerJWT, Apartmentcontroller.updateApartment)
router.delete("/delete",verifyJWT,brokerJWT, Apartmentcontroller.deleteApartment)
router.put("/NumOfInterest",verifyJWT,Apartmentcontroller.updateNumofIntrest )

module.exports = router

