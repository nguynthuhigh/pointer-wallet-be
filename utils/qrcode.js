const path = require('path') 
const QRCode = require('qrcode');
module.exports = {
    generateQrCode:(id)=>{
        const imagePath = path.resolve(__dirname, 'img/qr_code.png');
        const data = {
            transactionID: id
        };
        let stJson = JSON.stringify(data);
        QRCode.toFile(imagePath, stJson, { margin: 1, width:300 }, function (err) {
            if (err) throw err;
        });
    }
}