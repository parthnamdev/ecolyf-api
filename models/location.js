const { Int32 } = require('mongodb');
const mongoose=require('mongoose')

const locationSchema=new mongoose.Schema({
    uuid:String,

    standName:String,

    cycleUuid:[{
        uuid:String,
        cycleType:String
    }],

    area:String,

    isEmpty:Boolean,

    prebooked:{
        Geared:Number,
        Regular: Number,
        Diva: Number,
    },

});

const Location=mongoose.model('location',locationSchema);
module.exports=Location;