const User = require("../models/user")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")


//register controllers
const registerUser = async (req, res)=>{
    try{
        //extract user info from our request body
        const {username, email, password, role} = req.body

        //check if the user exists in our databse
        const checkExistingUser = await User.findOne({$or: [{username}, {email}]})
         if (checkExistingUser){
            res.status(400).json({
                success: false,
                message: "User already exists. Try other username or email"
            })
         }
         const hash = await bcrypt.genSalt(10)
         const hashedPassword = await bcrypt.hash(password, hash) 

         //create a new user and save in the database

         const newlyCreatedUser = new User({
            username,
            email, 
            password: hashedPassword,
            role: role || "user"

         })
         await newlyCreatedUser.save()

         if (newlyCreatedUser){
            res.status(201).json({
                success: true,
                message: "User registered successfully",
                data: newlyCreatedUser
            })
         }else{
            res.status(400).json({
                success: false,
                message: "Unable to register user! Please try again"
                
            })
         }


    }catch(e){
        console.log(e)
        res.status(500).json({
            success: false,
            message: "Some error occured! Please try again"
        })
    }
}


//login controllers
const loginUser = async (req, res)=>{
    try{
        const {username, password} = req.body

        //find if the user exists in databases or not
        const user = await User.findOne({username})
        if (!user){
            return res.status(400).json({
                success: false,
                message: "Invalid username or password(username)!!!"
            })
        }
        
        //check weather the password is correct
        const isPasswordMatching = await bcrypt.compare(password, user.password)
        if (!isPasswordMatching){
            return res.status(400).json({
                success: false,
                message: "Invalid username or password(password)!!!"
            })
        }
        const accessToken = jwt.sign({
            userId: user._id,
            username: user.username,
            role: user.role
        }, process.env.JWT_SECRET_KEY, {
            expiresIn: "15m"
        })

        res.status(200).json({
            success: true,
            message: "Logged in successfully",
            accessToken
        })



    }catch(e){
        console.log(e)
        res.status(500).json({
            success: false,
            message: "Some error occured! Please try again"
        })
    }
}

const changePassword = async (req, res)=>{
    const userId = req.userInfo.userId

    //extract old and new passwords
    const {oldPassword, newPassword} = req.body

    //find the current user(tring to change the password)
    const user = await User.findById(userId)
    if(!user){
        return res.status(400).json({
            success: false,
            message: "User not found"
        })
    }

    //check if the old password is correct
    const isPasswordMatch = await bcrypt.compare(oldPassword, user.password)
    if(!isPasswordMatch){
        return res.status(400).json({
            success: false,
            message: "Previous password is incorrect"
        })
    }

    //hash the new password 
    const salt = await bcrypt.genSalt(10)
    const newHashedPassword = await bcrypt.hash(newPassword, salt)

    user.password = newHashedPassword
    await user.save()

    res.status(200).json({
        success: true,
        message: "Password changed successfully"
    })
}

module.exports = {registerUser, loginUser, changePassword} 