const mongoose = require('mongoose')
const recourseSchema = new mongoose.Schema({
    types:{
        type:String,
        enum:["seller_recourse","add_apartment"],
        default:"buyer_recourse"
    },
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
    },
    apartment_id:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"Apartment"
    },
    contact:{
        type:String,
        required:true
    },
    complete:{
        type:Boolean,
        default:false
    }

})

module.exports = mongoose.model('Recourse', recourseSchema)