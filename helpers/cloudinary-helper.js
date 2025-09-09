const cloudinary = require("../config/cloudinary")

const uploadToCloud = async(filePath)=>{
    try{
        const result = await cloudinary.uploader.upload(filePath)

        return {
            url: result.secure_url,
            publicId: result.public_id
        }


    }catch(e){
        console.error("Error", e)
        throw new Error("Error while trying to uplaod the image.")
    }
}


module.exports = {
    uploadToCloud
}