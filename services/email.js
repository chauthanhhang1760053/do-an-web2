const nodemailer = require('nodemailer');

async function guikichhoat(to,subject, token) {
    const transporter=nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, 
        auth: {
            user: 'mail mình',
            pass: 'pass mail',
        }
    });
     
    return transporter.sendMail({
        from: 'user',
        to,
        subject, 
        text: 'http://localhost:3000/active/' + token,
    });
 }

 module.exports={guikichhoat};
