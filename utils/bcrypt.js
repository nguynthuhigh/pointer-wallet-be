const bcrypt = require('bcryptjs');
module.exports ={
    bcryptHash:(key)=>{
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(key,salt);
        return hash;
    },
    bcryptCompare:(key,hash)=>{
        try {
            return bcrypt.compareSync(key, hash);
        } catch (error) {
            console.log(error)
            throw(error)
        }
        
    }
}