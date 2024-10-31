const CryptoJS = require("crypto-js");
const crypto = require("crypto");
module.exports = {
  encrypt: (msg) => {
    return CryptoJS.AES.encrypt(msg, process.env.CRYPTO_SECRET_KEY).toString();
  },
  decrypt: (encrypt) => {
    return CryptoJS.AES.decrypt(
      encrypt,
      process.env.CRYPTO_SECRET_KEY
    ).toString(CryptoJS.enc.Utf8);
  },
  generateKeyPair: () => {
    const privateKey = "sk_pointer" + crypto.randomBytes(32).toString("hex");
    const publicKey = "pk_pointer" + crypto.randomBytes(32).toString("hex");
    return { privateKey, publicKey };
  },
};
