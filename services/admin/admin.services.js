const AppError = require('../../helpers/handleError')
const {Admin} = require('../../models/admin.model')
class AdminServices {
    static findAdminById =async (id)=>{
        const data = await Admin.findById(id)
        if(!data){
            throw new AppError("Unauthorized",401)
        }
        return data
    }
}
module.exports = AdminServices