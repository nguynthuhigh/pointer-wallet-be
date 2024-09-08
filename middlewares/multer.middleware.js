const multer = require('multer')

const storage = multer.diskStorage({
    filename: function (req,file,cb){
        cb(null,req.user.toString())
    }
});
const upload = multer({storage:storage});

module.exports = upload