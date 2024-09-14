const {Types} = require('mongoose')

const convertToObjectId = (id)=>{
    return new Types.ObjectId(id)
}

module.exports = convertToObjectId