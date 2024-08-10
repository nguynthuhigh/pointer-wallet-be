const {Transaction} = require('../../models/transaction.model')
const {VolumeStatistic} = require('../../models/statistic.model')
const {Statistic} = require('../../models/statistic.model')
const {Partner} = require('../../models/partner.model')
const {User} = require('../../models/user.model')
const calculateRate =(today,yesterday)=>{
    if(yesterday === 0 && today === 0){
        return 0
    }
    if(yesterday === 0){
        return 100
    }
    return (today-yesterday)/yesterday*100
}
module.exports ={
    statisticalCalculations:async()=>{
        const now = new Date();
        const total_user_all_time = await User.countDocuments()
        const total_partner = await Partner.countDocuments()
        const total_transaction = await Transaction.countDocuments()
        //today
        const startOfDay = new Date(now)
        startOfDay.setDate(startOfDay.getDate()-12)//test
        startOfDay.setHours(0,0,0,0)
        const endOfDay = new Date(startOfDay)
        endOfDay.setHours(23,59,59,59)
        //yesterday
        const startOfYesterday = new Date(now);
        startOfYesterday.setDate(now.getDate() - 13); //-1
        startOfYesterday.setHours(0,0,0,0)
        const endOfYesterday = new Date(startOfYesterday);
        endOfYesterday.setHours(23,59,59,59)



        console.log(startOfYesterday)
        console.log(endOfYesterday)
        const total_user_yesterday = await User.countDocuments({
            createdAt: { $gte: startOfYesterday, $lt: endOfYesterday }
          });
          const total_user_today = await User.countDocuments({
            createdAt: { $gte: startOfDay, $lt: endOfDay }
          });
          const total_partner_today = await Partner.countDocuments({
            createdAt: { $gte: startOfDay, $lt: endOfDay }
          });
          const total_partner_yesterday = await Partner.countDocuments({
            createdAt: { $gte: startOfYesterday, $lt: endOfYesterday }
          });
          const total_transaction_today = await Transaction.countDocuments({
            createdAt: { $gte: startOfDay, $lt: endOfDay }
          });
          const total_transaction_yesterday = await Transaction.countDocuments({
            createdAt: { $gte: startOfYesterday, $lt: endOfYesterday }
          });
   
        console.log(total_partner_today)
        console.log(total_partner_yesterday)
        console.log(`Total user: ${total_user_all_time} 
                    - Rate: ${calculateRate(total_user_today,total_user_yesterday)} 
                    \n Total partner: ${total_partner} 
                    - Rate ${calculateRate(total_partner_today,total_partner_yesterday)} 
                    \n Total transaction: ${total_transaction}
                    - Rate ${calculateRate(total_transaction_today,total_transaction_yesterday)} 
                    `)
                    
        const data = await Transaction.aggregate([
            {
                $match: {
                  createdAt: {
                    $gte: startOfDay,
                    $lte: endOfDay
                  }
                }
              },
            {
              $group: {
                _id: {
                  currency: "$currency", // Nhóm theo currency (ObjectId)
                  date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } } // Nhóm theo ngày
                },
                totalAmount: { $sum: "$amount" } // Tính tổng số tiền
              }
            },
            {
              $lookup: {
                from: "currencies",      // Tên collection chứa thông tin tiền tệ
                localField: "_id.currency", // Trường trong collection transactions
                foreignField: "_id", // Trường tương ứng trong collection currencies
                as: "currencyInfo" // Tên trường chứa thông tin kết quả join
              }
            },
            {
              $unwind: "$currencyInfo" // Đảm bảo rằng bạn có một đối tượng currencyInfo cho mỗi bản ghi
            },
            {
              $group: {
                _id: {
                  currency: "$currencyInfo.name", // Sử dụng tên tiền tệ từ currencyInfo
                  date: "$_id.date" // Ngày từ nhóm
                },
                totalAmount: { $sum: "$totalAmount" } // Tính tổng số tiền cho nhóm
              }
            },
            {
              $sort: { "_id.date": 1, "_id.currency": 1 } // Sắp xếp theo ngày và tên tiền tệ
            }
          ])
          console.log(data)
    }
} 
