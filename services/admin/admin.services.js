const {Admin} = require('../../models/admin.model')
const findAdmin = async(email)=>{
    try {
        return await Admin.findOne({email:email})
    } catch (error) {
        console.log(error)
        throw error
    }
}
const createAdmin = async(email,password,role)=>{
    try{
        return await Admin.create({email:email,password:password,role})
    }catch(error){
        console.log(error)
        throw error
    }
}
const getAllAdmins = async()=>{
    try {
        return await Admin.find().select('avatar email role');
    } catch (error) {
        console.log(error)
        throw error
    }
}
const banAdmin = async(id)=>{
    try {
        return await Admin.findByIdAndUpdate(id,[{$set:{active:{$eq:[false,"$active"]}}}]).select('active')
    } catch (error) {
        console.log(error)
        throw error
    }
}
const func = {
    findAdmin,
    createAdmin,
    getAllAdmins,
    banAdmin
}
module.exports = func