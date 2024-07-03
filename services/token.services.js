const jwt = require('jsonwebtoken');

module.exports = {
    createToken:(id)=>{
        try {
            return new Promise((resolve, reject)=>{
                jwt.sign({id:id},process.env.SERECT_TOKEN,{algorithm:'HS256'},(err,token)=>{
                    if(err){
                        console.log(err)
                        reject(err)
                    }
                    else{
                        resolve(token)
                    }
                })
            })
           
        } catch (error) {
            console.log(error)
        }
    },
    verifyToken:(token)=>{
        return new Promise((resolve,reject)=>{
            jwt.verify(token, process.env.SERECT_TOKEN, (err, decoded) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(decoded) 
                }
            });
        })
    }
}