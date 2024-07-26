const QRCode = require('qrcode');
const data = {
    transactionID: "66899b17531c59286debefd9"
};
let stJson = JSON.stringify(data);
QRCode.toFile('qr_code.png', stJson, { margin: 1, width:300 }, function (err) {
    if (err) throw err;
    console.log('QR code generated without white margin');
});

const paragraph = "I think Ruth's dog is cuter than your dog!";

console.log(paragraph.replace("Ruth's", 'my'));