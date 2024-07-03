module.exports = {
    Response:(res,message,data,status)=>{
        res.status(status).json({message:message,data:data})
    }
}