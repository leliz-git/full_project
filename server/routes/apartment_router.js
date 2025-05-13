const verifyJWT = require("../middleware/verifyJWT")
const brokerJWT=require('../middleware/brokerJWT')
const express = require("express")
const router = express.Router()
const Apartmentcontroller= require("../controllers/apartment_controller");

router.get("/getAllApartments", Apartmentcontroller.getAllApartment)
router.get("/getAllApartmentsByBroker",verifyJWT,brokerJWT, Apartmentcontroller.getAllApartmentByBroker)
router.get("/getbyid/:_id", Apartmentcontroller.getApartmentById)
router.post("/add",verifyJWT, Apartmentcontroller.createNewApartment)
router.put("/complete",verifyJWT,brokerJWT, Apartmentcontroller.CompleteApartment)
router.put("/update",verifyJWT,brokerJWT, Apartmentcontroller.updateApartment)
router.delete("/delete",verifyJWT,brokerJWT, Apartmentcontroller.deleteApartment)
// router.put("/NumOfInterest/:_id",verifyJWT,Apartmentcontroller.updateNumofIntrest )

module.exports = router

