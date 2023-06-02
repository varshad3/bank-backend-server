const mongoose=require('mongoose')

// using mangoose define connection between mongodb and express

mongoose.connect('mongodb://localhost:27017/bank')

// create a model/schema/collection for storing fata in db

const User=mongoose.model('User',{
    acno:Number,
    username:String,
    password:String,
    balance:Number,
    transaction:[]
})

// export collection

module.exports ={
    User
}