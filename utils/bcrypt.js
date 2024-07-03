const bcrypt = require('bcryptjs');
module.exports ={
    bcryptHash:(key)=>{
        try {
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(key,salt);
            return hash;
        } catch (error) {
            console.log(error)
        }
    },
    bcryptCompare:(key,hash)=>{
        try {
            return bcrypt.compareSync(key, hash);
        } catch (error) {
            console.log(error)
        }
        
    }
}