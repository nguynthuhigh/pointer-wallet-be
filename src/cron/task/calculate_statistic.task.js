const {Transaction} = require('../../models/transaction.model')
const {VolumeStatistic, TotalStatistic} = require('../../models/statistic.model')
const {Partner} = require('../../models/partner.model')
const {User} = require('../../models/user.model')
const nodemailer = require('../../utils/nodemailer')
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
       try {
        const now = new Date();
        const total_user_all_time = await User.countDocuments()
        const total_partner = await Partner.countDocuments()
        const total_transaction = await Transaction.countDocuments()
        //today
        const startOfDay = new Date(Date.UTC(
          now.getUTCFullYear(),
          now.getUTCMonth(),
          now.getUTCDate(), 
          0, 0, 0, 0
        ))
        const endOfDay = new Date(Date.UTC(
          now.getUTCFullYear(),
          now.getUTCMonth(),
          now.getUTCDate() - 1,
          23, 59, 59, 999
        ))
        //yesterday
        const startOfYesterday = new Date(Date.UTC(
          now.getUTCFullYear(),
          now.getUTCMonth(),
          now.getUTCDate() - 1, 
          0, 0, 0, 0
        ));
        const endOfYesterday = new Date(Date.UTC(
          now.getUTCFullYear(),
          now.getUTCMonth(),
          now.getUTCDate() - 1, // Trừ 1 ngày
          23, 59, 59, 999
        ));
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
        console.log(startOfDay)   
        const data = await Transaction.aggregate(
          [
            {
              $match: {
                createdAt: {
                  $gte: 
                    startOfYesterday
,
                  $lte: 
                    endOfYesterday
                  
                }
              }
            },
            {
              $group: {
                _id: {
                  currency: '$currency',
                  date: {
                    $dateToString: {
                      format: '%Y-%m-%d',
                      date: '$createdAt'
                    }
                  }
                },
                totalAmount: { $sum: '$amount' }
              }
            },
            {
              $lookup: {
                from: 'currencies',
                localField: '_id.currency',
                foreignField: '_id',
                as: 'result'
              }
            },
            {
              $group: {
                _id: {
                  currency: '$result.symbol',
                  date: '$_id.date'
                },
                totalAmount: { $sum: '$totalAmount' }
              }
            }
          ],
          { maxTimeMS: 60000, allowDiskUse: true }
        );
        const totalVolume = await Transaction.aggregate([
          {
           $group: {
             _id: {
               currency: '$currency',
             },
             totalAmount: { $sum: '$amount' }
           }
         },
         {
           $lookup: {
             from: 'currencies',
             localField: '_id.currency',
             foreignField: '_id',
             as: 'result'
           }
         },
       ])
       const calculate_total_volume = ()=>{
          let total =0
          totalVolume.forEach(element => {
            if(element?.result[0]?.symbol  === 'VND'){
              total += element.totalAmount;
            }
            if(element?.result[0]?.symbol  === 'ETH'){
              total += element.totalAmount *3000 * 25000;
            }
            if(element?.result[0]?.symbol  === 'USD'){
              total += element.totalAmount *25500;
            }
          });
          return total
       }
       
        await VolumeStatistic.create({
          date:data[0]._id.date || startOfYesterday,
          value:[{
            currency:'VND',
            value:data[0]?.totalAmount
          },
          {
            currency:'USD',
            value:data[1]?.totalAmount || 0
          },
          {
            currency:'ETH',
          value:data[2]?.totalAmount || 0
          }
          ]
        })
        await TotalStatistic.create({
          date:startOfYesterday,
          total_user:{
            value:total_user_all_time,
            dailyGrowthRate:calculateRate(total_user_today,total_user_yesterday)
          },
          total_volume:{
            value:calculate_total_volume(),
            dailyGrowthRate:0
          },
          total_partner:{
            value:total_partner,
            dailyGrowthRate:calculateRate(total_partner_today,total_partner_yesterday)
          },
          total_transaction:{
            value:total_transaction,
            dailyGrowthRate:calculateRate(total_transaction_today,total_partner_yesterday)
          }
        })
        nodemailer.sendMail('minhnguyen11a1cmg@gmail.com','ok','pressPay statistic working.')
       } catch (error) {
        nodemailer.sendMail('minhnguyen11a1cmg@gmail.com',error,'pressPay statistic error')
       }
    }
} 
