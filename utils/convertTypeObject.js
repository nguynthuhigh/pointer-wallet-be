const {Types} = require('mongoose')

const convertToObjectId = (id)=>{
    return Types.ObjectId(id)
}

module.exports = convertToObjectId