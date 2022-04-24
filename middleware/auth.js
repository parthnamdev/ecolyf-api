const jwt=require('jsonwebtoken')
const User=require('../models/users.js')

const auth=async(req,res,next)=>{
    try{
        const token=req.header('Authorization').replace('Bearer ','')
        const decoded=jwt.verify(token,'tassie')
        const user=await User.findOne({_id:decoded._id,'tokens.token':token})

        if(!user){
            throw new Error()
        }

        req.token=token
        req.user=user
        next()
    }catch(error){
        res.json({
            status: false,
            message: "Unauthenticated. Please login again.",
            errors:[error],
            data: {}
        })
    }
}

module.exports=auth