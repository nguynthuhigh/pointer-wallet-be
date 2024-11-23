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
    const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
      modulusLength: 2048,
    });
    return {
      privateKey: `sk_pointer_${privateKey}`,
      publicKey: `pk_pointer_${publicKey}`,
    };
  },
  signature: (privateKey, data) => {
    const jsonString = JSON.stringify(data._id);
    return crypto
      .createHmac("sha256", privateKey)
      .update(jsonString)
      .digest("hex");
  },
};
