const nodemailer = require('nodemailer');

async function guikichhoat(to,subject, token) {
    const transporter=nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'hainguyenltw@gmail.com',
            pass: 'mailxacnhan123',
        }
    });
    
    return transporter.sendMail({
        from: 'user',
        to: 'hofam75643@mailvk.net',
        subject: 'Confirm email',
        text: 'http://localhost:3000/active/' + token,
    });
 }

 module.exports={guikichhoat};
