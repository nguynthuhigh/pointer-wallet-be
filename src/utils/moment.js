const moment = require('moment'); 
module.exports = {
    limitTime:(time)=>{
        const now = moment()
        const expireTime = moment(time).add(10, 'minutes')
        const secondsLeft = expireTime.diff(now, 'seconds')
        return secondsLeft
    }
}