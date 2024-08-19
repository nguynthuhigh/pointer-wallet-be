const axios = require('axios');
const AppError = require('../helpers/handleError');

module.exports = {
    postWebhook:async(endpoint,body)=>{
        const response = await axios.post(endpoint,body)
        if(response.status !== 200 || response.status === undefined){
            await session.abortTransaction();
            return AppError("Không thể cập nhật đơn hàng giao dịch thất bại",400);
        }
   
    }
}