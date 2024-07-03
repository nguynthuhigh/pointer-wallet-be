const nodemailer = require('nodemailer')

module.exports={
    sendMail:(to,content,title)=>{
        try {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.MAIL_USERNAME, 
                    pass: process.env.MAIL_PASSWORD 
                }
            })
            const mailOptions = {
                from: 'presspay.mail@gmail.com', 
                to: to, 
                subject: title, 
                text: content
            };
            transporter.sendMail(mailOptions,(error, info)=>{
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            })
        } catch (error) {
            return error
        }
}}