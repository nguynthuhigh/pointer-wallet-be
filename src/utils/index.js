module.exports = {
    selectData: (select)=>{
        const obj = select.reduce((obj,field)=>{
            Object.assign(obj, {[field]: 1 })
            return obj
        },{})
        return obj
    },
    unSelectData: (select)=>{
        const obj = select.reduce((obj,field)=>{
            Object.assign(obj, {[field]: 0 })
            return obj
        },{})
        return obj
    },
    cleanData: (obj)=>{
        const cleanedObj = Object.entries(obj).reduce((acc, [key, value]) => {
            if (value !== undefined) {
              acc[key] = value;
            }
            return acc;
          }, {});
        return cleanedObj
    }
}