const mongoose=require('mongoose')

const rideSchema=new mongoose.Schema({
    uuid:String,

    userUuid:String,

    from:String,
    to:String,

    cycleUuid:{
        uuid:String,
        cycleType:String
    },

    distance:Number,
    isBooked: Boolean,
    time: String

});

const Ride=mongoose.model('ride',rideSchema);
module.exports=Ride;