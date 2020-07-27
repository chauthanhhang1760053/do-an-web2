const nodemailer = require('nodemailer');

async function guikichhoat(to,subject, token) {
    const transporter=nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'nguyennhiscorpio0811@gmail.com',
            pass: 'tranthithuong081199hailan',
        }
    });
    
    return transporter.sendMail({
        from: 'nguyennhiscorpio0811@gmail.com',
        to,
        subject,
        text: 'http://localhost:3000/active/' + token,
    });
 }

 module.exports={guikichhoat};
