const bcrypt = require('bcryptjs');
module.exports ={
    bcryptHash:(key)=>{
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(key,salt);
        return hash;
    },
    bcryptCompare:(key,hash)=>{
        return bcrypt.compareSync(key, hash);
    }
}