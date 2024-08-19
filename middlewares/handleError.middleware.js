module.exports = handleError = (error,req,res,next)=>{
    console.log(error)
    res.status(error.httpCode || 500).json({message:error.message})
}