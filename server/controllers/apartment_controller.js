const Apartment = require("../models/Apartments")

const createNewApartment = async (req, res) => {
   
    const { number_of_interested, seller_id, images, monopolism, neighborhood, number_of_rooms, floor, price, yad2, description } = req.body
    if (!neighborhood) {
        return res.status(400).json({ message: 'neighborhood is required' })
    }
    if (!number_of_rooms) {
        return res.status(400).json({ message: 'number_of_rooms is required' })
    }
    if (!price) {
        return res.status(400).json({ message: 'price is required' })
    }
   

    const apartment = await Apartment.create({ number_of_interested, seller_id, images, monopolism, neighborhood, number_of_rooms, floor, price, yad2, description })
    const apartments = await Apartment.find().lean()
    res.json(apartments)
}

const getAllApartmentByBroker = async (req, res) => {

    // const apartments = await Apartment.find(broker_bool===true).lean()//יש פה בעיה
    const apartments = await Apartment.find({ 'broker_bool': false }).lean();
    if (!apartments?.length)
        return res.status(400).json({ message: 'No apartments found' })
    res.json(apartments)

}//כדי שיראה את זה באיזור האישי שלו

const getAllApartment = async (req, res) => {

    const apartments = await Apartment.find({ 'broker_bool': true }).lean()
    if (!apartments?.length) {
        return res.status(400).json({ message: 'No apartments found' })
    }
    res.json(apartments)

}//שכל מי שנכנס לאתר יראה

const CompleteApartment = async (req, res) => {
   
    const { _id } = req.body
    if (!_id) {
        
        return res.status(400).json({ message: 'id is required' })
    }
    const apartment = await Apartment.findById(_id).exec()

    if (!apartment) {
        
        return res.status(400).json({ message: 'apartment not found' })
    }
    apartment.broker_bool = !apartment.broker_bool;
    const updateApartment = await apartment.save()
    const apartments = await Apartment.find().lean()
    res.json(apartments)
}

const updateApartment = async (req, res) => {
    
    const { _id, monopolism, neighborhood, number_of_rooms, floor, price, yad2, description, images, broker_bool } = req.body

    if (!_id) {
        // console.log("!")
        return res.status(400).json({ message: 'id is required' })
    }
    const apartment = await Apartment.findById(_id).exec()

    if (!apartment) {
        // console.log("?")
        return res.status(400).json({ message: 'apartment not found' })
    }

    apartment.monopolism = monopolism
    apartment.neighborhood = neighborhood
    apartment.number_of_rooms = number_of_rooms
    apartment.floor = floor
    apartment.price = price
    apartment.yad2 = yad2
    apartment.description = description
    apartment.images = images
    apartment.broker_bool = broker_bool || apartment.broker_bool
    const updateApartment = await apartment.save()
    const apartments = await Apartment.find().lean()
    res.json(apartments)
}

// const updateNumofIntrest = async (req, res) => {
//     // getApartmentById()
//     const { _id } = req.params
//     // const { _id } = req.body
//     const apartment = await Apartment.findById(_id).lean()

//     if (!apartment) {
//         return res.status(400).json({ message: 'No apartment found' })
//     }

//     apartment.number_of_interested = apartment.number_of_interested + 1

// }

const deleteApartment = async (req, res) => {
    const { _id } = req.body

    const apartment = await Apartment.findById(_id).exec()

    if (!apartment) {
        return res.status(400).json({ message: 'Apartment not found' })
    }
    const result = await apartment.deleteOne()
    const apartments = await Apartment.find().lean()
    res.json(apartments)
}

const getApartmentById = async (req, res) => {//גם משנה את מספר המתעניינים

   
    const { _id } = req.params
   
    const apartment = await Apartment.findById(_id).exec()
    
    if (!apartment) {
        return res.status(400).json({ message: 'No apartment found' })
    }
    apartment.number_of_interested = apartment.number_of_interested + 1;
    const updateApartment =  await apartment.save();

    console.log(apartment)
    res.json(apartment)
}

module.exports = { createNewApartment, getAllApartment, CompleteApartment, updateApartment, deleteApartment, getApartmentById, getAllApartmentByBroker }

