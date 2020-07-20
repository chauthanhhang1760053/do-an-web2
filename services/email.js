const nodemailer = require('nodemailer');

async function guikichhoat(to,subject, token) {
    const transporter=nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'dien mail minh vao',
            pass: 'pass mail minh',
        }
    });
    
    return transporter.sendMail({
        from: 'user o tren',
        to,
        subject,
        text: 'http://localhost:3000/active/' + token,
    });
 }

 module.exports={guikichhoat};
