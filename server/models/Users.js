const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    roles:{
        type:String,
        enum:['Seller', 'Buyer', 'Broker'],
        default:"Buyer"
    },
    name:{
        type: String
    },
    username:{
        type:String,
        required:true,
        uniqe:true
    },
    phone:{
        type:String
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
},{
    timestamps:true
})

module.exports = mongoose.model('User', userSchema)