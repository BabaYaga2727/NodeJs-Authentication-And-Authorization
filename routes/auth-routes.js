const express = require("express")

const router = express.Router()
const {registerUser, 
    loginUser, 
    changePassword} = require("../controllers/auth-controllers")

const authMiddleware = require("../middleware/auth-middleware")

//all routes here
router.post("/register", registerUser)
router.post("/login", loginUser)
router.post("/change-password", authMiddleware, changePassword)


module.exports = router