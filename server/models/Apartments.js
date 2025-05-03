const mongoose = require('mongoose')
const apartmentSchema = new mongoose.Schema({
    broker_bool:{//הדירה טופלה
        type:Boolean,
        default:false
        //, required:true
    },
    number_of_interested:{
        type:Number,
        default:0
    },
    seller_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
        // ,
        // required:true
    },
    monopolism:{
        type: Boolean,
        default:false
    },
    neighborhood:{
        type: String,
        required:true
    },
    number_of_rooms:{
        type: Number,
        required:true
    },
    floor:{
        type: Number
    },
    price:{
        type: Number,
        required:true
    },
    yad2:{
        type: Boolean,
        default:true
    },
    bought:{
        type:Boolean,
        default:false
    },
    images:{
        // type:String
        type: [String], // מערך של מחרוזות
    default: []
    },
    description:{
        type: String
    }
},{
    timestamps:true
})

module.exports = mongoose.model('Apartment', apartmentSchema)