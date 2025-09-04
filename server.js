require("dotenv").config()
const express = require("express")
const connectToDB = require("./database/db")
const authRouters = require("./routes/auth-routes")
const homeRouters = require("./routes/home-routes")
const adminRouters = require("./routes/admin-routes")

const app = express()
connectToDB()

//middleware
app.use(express.json()) 

app.use("/api/auth", authRouters)
app.use("/api/home", homeRouters)
app.use("/api/admin", adminRouters)


const PORT = process.env.PORT || 3000 
app.listen(PORT, ()=>{
    console.log(`Server is listening to port ${PORT}`)
})