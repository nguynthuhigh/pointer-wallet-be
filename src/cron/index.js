const cron = require('node-cron');
const { deletePendingTransaction } = require('./task/transaction.task');
const {statisticalCalculations} = require('./task/calculate_statistic.task')
const timezone = 'Asia/Ho_Chi_Minh';

cron.schedule('0 0 * * *', deletePendingTransaction, {
  scheduled: true,
  timezone: timezone 
});

cron.schedule('0 7 * * *', statisticalCalculations, {
  scheduled: true,
  timezone: timezone 
});

