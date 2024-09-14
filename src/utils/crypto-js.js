const CryptoJS = require("crypto-js");
const crypto = require('crypto');
module.exports = {
    encrypt:(msg)=>{
        return CryptoJS.AES.encrypt(msg, process.env.CRYPTO_SECRET_KEY).toString()
    },
    decrypt: (encrypt)=>{
        return CryptoJS.AES.decrypt(encrypt,process.env.CRYPTO_SECRET_KEY).toString(CryptoJS.enc.Utf8)
    },
    generateKeyPair: () => {
        const privateKey = 'pk_presspay_' +crypto.randomBytes(32).toString('hex')
        const publicKey = 'pl_presspay_' +crypto.randomBytes(32).toString('hex')
        return {privateKey,publicKey}
    }
}