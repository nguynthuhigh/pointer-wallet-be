const moment = require('moment'); 
module.exports = {
    limitTime:(time)=>{
        function isWithinTimeLimit(specificTime, limitMinutes) {
            const currentTime = moment();
            const specificMoment = moment(specificTime);

            const duration = moment.duration(currentTime.diff(specificMoment));
            const minutesDifference = Math.abs(duration.asMinutes());

            return minutesDifference <= limitMinutes;
        }
        const specificTime = time;
        const limitMinutes = 10; 
        return isWithinTimeLimit(specificTime, limitMinutes)
    }
}