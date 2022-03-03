const express=require('express')
const mongoose=require('./db/db.js')
const userRouter=require('./routes/userRouter')
const homeRouter=require('./routes/homeRouter')

const app=express()
const port=process.env.PORT||5000

app.use(express.json())
app.use('/user', userRouter)
app.use('/home', homeRouter)


app.listen(port,()=>{
    console.log('Server is up on the port '+port+" !")
})