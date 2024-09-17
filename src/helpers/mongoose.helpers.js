module.exports = {
    getRange:(start,end)=>{
        return !start || !end ? undefined : {$gte: new Date(start), $lt: new Date(end)}
    },
    toBoolean:(active)=>{
        if(active === undefined){
            return undefined
        }
        return  active === 'true' ? true : false
    },
    sortBy:(key)=>{
        return key === 'desc' ? -1 : 1
    }
}