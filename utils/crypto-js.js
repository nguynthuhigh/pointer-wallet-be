const CryptoJS = require("crypto-js");
module.exports = {
    encrypt:(msg)=>{
        return CryptoJS.AES.encrypt(msg, process.env.CRYPTO_SERECT_KEY).toString()
    },
    decrypt: (encrypt)=>{
        return CryptoJS.AES.decrypt(encrypt,process.env.CRYPTO_SERECT_KEY).toString(CryptoJS.enc.Utf8)
    }

}