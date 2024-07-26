const cron = require('node-cron');
const { deletePendingTransaction } = require('./task/transaction.task');

const timezone = 'Asia/Ho_Chi_Minh';

cron.schedule('0 3 * * *', deletePendingTransaction, {
  scheduled: true,
  timezone: timezone 
});

