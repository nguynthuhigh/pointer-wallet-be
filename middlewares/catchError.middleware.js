const catchError = catchAsync => {
    return (req,res,next) => {
        catchAsync(req,res,next)?.catch(next)
    }
}
module.exports = catchError