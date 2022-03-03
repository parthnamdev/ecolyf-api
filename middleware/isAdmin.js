const jwt=require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const auth=async(req,res,next)=>{
    try{
        const token=req.header('Authorization').replace('Bearer ','')
        bcrypt.compare(process.env.ADMIN_PASS,token, function(err, result) {
            if((!err) && result == true) {
                
                next()
            } else {
                throw new Error()
            }
        });
        
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