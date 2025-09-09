const { uploadToCloud } = require("../helpers/cloudinary-helper")
const Image = require("../models/image")
const fs = require("fs")
const cloudinary = require("../config/cloudinary")

const uploadImageController = async (req, res)=>{
    try{
        if(!req.file){
            return res.status(400).json({
                success: false,
                message: "File is required. Please upload the image"
            })
        }

        //upload to cloudinary
        const {url, publicId} = await uploadToCloud(req.file.path)

        //store the image url and public id along with the uploader user id
        const newlyUploadedImage = new Image({
            url,
            publicId,
            uploadedBy: req.userInfo.userId
        })

        await newlyUploadedImage.save()

        //delete the file from local storage
        fs.unlinkSync(req.file.path)


        res.status(201).json({
            success: true,
            message: "Image uploaded successfully!!!",
            image: newlyUploadedImage
        })

    }catch(e){
        console.log(e)
        res.status(500).json({
            success: false,
            message: "Somrthing went wrong! Please try again"
        })
    }
}

const fetchImagesControllers = async(req, res)=>{
    try{
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 2
        const skip = (page - 1) * limit

        const sortBy = req.query.sortBy || "createdAt"
        const sortOrder = req.query.sortOrder === "asc" ? 1: -1
        const totalImages = await Image.countDocuments()
        const totalPages = Math.ceil(totalImages / limit)

        const sortObj = {}
        sortObj[sortBy] = sortOrder

        const images = await Image.find().sort(sortObj).skip().limit(limit)
        if(images){
            return res.status(200).json({
                success: true,
                currentPage: page,
                totalPages: totalPages,
                totalImages: totalImages,
                data: images
            })
        }
    }catch(e){
        console.log(e)
        res.status(500).json({
            success: false,
            message: "Somrthing went wrong! Please try again"
        })
    }
}

const deleteImageControllers = async(req, res)=>{
    try{
        const getCurrentIdOfImageToBeDeleted = req.params.id
        const userId = req.userInfo.userId

        const image = await Image.findById(getCurrentIdOfImageToBeDeleted)

        if(!image){
            return res.status(404).json({
                success: false,
                message: "Image not found"
            })
        }

        if(image.uploadedBy.toString !== userId){
            return res.status(403).json({
                success: false,
                message: "You are not authorized "
            })
        }
        //delete this image from cloudinary storage
        await cloudinary.uploader.destroy(image.publicId)

        //delete this image from mongodb
        await Image.findByIdAndDelete(getCurrentIdOfImageToBeDeleted)

        res.status(200).json({
            success: true,
            message: "Image deleted successfully"
        })
    }catch(e){
        console.log(e)
        res.status(500).json({
            success: false,
            message: "Somrthing went wrong! Please try again"
        })
    }
}

module.exports = {uploadImageController,
    fetchImagesControllers,
    deleteImageControllers
}