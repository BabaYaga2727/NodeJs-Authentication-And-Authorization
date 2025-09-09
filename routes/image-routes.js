const express = require("express")
const authMiddleware = require("../middleware/auth-middleware")
const adminMiddleware = require("../middleware/admin-middleware")
const uploadMiddleware = require("../middleware/upload-middleware")
const {uploadImageController, 
    fetchImagesControllers,
    deleteImageControllers
} = require("../controllers/image-controllers")


const router = express.Router()

//upload the image
router.post("/upload",authMiddleware, 
    adminMiddleware, 
    uploadMiddleware.single("image"), 
    uploadImageController)

//access all the images
router.get("/get", authMiddleware, fetchImagesControllers)
 
//delete image
router.delete("/:id,",  authMiddleware, adminMiddleware, deleteImageControllers)


module.exports = router