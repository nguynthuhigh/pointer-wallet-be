module.exports = {
    //['a','b'] => { a: 1, b: 1}
    selectData: (select)=>{
        const obj = select.reduce((obj,field)=>{
            Object.assign(obj, {[field]: 1 })
            return obj
        },{})
        return obj
    },
    //['a','b'] => { a: 0, b: 0}
    unSelectData: (select)=>{
        const obj = select.reduce((obj,field)=>{
            Object.assign(obj, {[field]: 0 })
            return obj
        },{})
        return obj
    },
    //{ a: undefined, b: 'a'} => { b: 'a'}
    cleanData: (obj)=>{
        const cleanedObj = Object.entries(obj).reduce((acc, [key, value]) => {
            if (value !== undefined) {
              acc[key] = value;
            }
            return acc;
          }, {});
        return cleanedObj
    },
}