const Recourse = require("../models/Recourse")
const User = require("../models/Users")
const Apartment = require("../models/Apartments")

const createNewRecourse = async (req,res)=>{
    // if(req.types==="add apartment")
    //     createNewApartment()
    if(req.types==="byuer_recourse")
        updateNumofIntrest(req.apartment_id)
    const{types,user_id,apartment_id,contact,complete}=req.body
    if(!user_id)
        return res.status(400).json({ message: 'user_id is required' })
    const user = await User.findById(user_id).exec()
    if(types=="byuer_recourse")
        user.roles='Seller';
    else{
        user.roles='Buyer'
    }
   await user.sava();
    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }

    if(!apartment_id)
        return res.status(400).json({ message: 'apartment_id is required' })
    const apartment1 = await Apartment.findById(apartment_id).exec()
    if (!apartment1) {
        return res.status(400).json({ message: 'apartment not found' })
    }

    if(!contact)
        return res.status(400).json({ message: 'contact is required' })
    const apartment = await Recourse.create({types,user_id,apartment_id,contact,complete})
    const apartments = await Recourse.find().lean()
    res.json(apartments)
}

const getAllRecourse = async (req,res)=>{
    const recourses = await Recourse.find().lean()
    if (!recourses?.length) 
    return res.status(400).json({ message: 'No recourses found' })
    res.json(recourses)
}

const updateRecourse = async (req,res)=>{
    const{_id,user_id,apartment_id,contact,complete}=req.body
    if (!_id) {
        return res.status(400).json({ message: 'id is required' })
    }
    const recourse = await Recourse.findById(_id).exec()

    if (!recourse) {
        return res.status(400).json({ message: 'recourse not found' })
    }
    recourse.contact=contact
    recourse.complete=!recourse.complete

    const updateRecourse = await recourse.save()
    const recourses = await Recourse.find().lean()
    res.json(recourses)
}

const getRecourseById = async (req,res)=>{
    const { _id } = req.params

    const recourse = await Recourse.findById(_id).lean()

    if (!recourse) {
        return res.status(400).json({ message: 'No recourse found' })
    }
    res.json(recourse)
}


module.exports={createNewRecourse, getAllRecourse, updateRecourse, getRecourseById}