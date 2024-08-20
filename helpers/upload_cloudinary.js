const cloudinary = require('../configs/cloudinary/cloudinary')

module.exports = {
    //path: req.file.path
    upload:async (path)=>{
        if(!path){
            return
        }
        const result = await cloudinary.uploader.upload(path)
        const url = result.url
        return url
    }
}