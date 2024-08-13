const cloudinary = require('../configs/cloudinary/cloudinary')

module.exports = {
    //path: req.file.path
    upload:async (path)=>{
    try {
        const result = await cloudinary.uploader.upload(path)
        const url = result.url
        return url
        
    } catch (error) {
        console.log(error)
        return null
    }
    }
}