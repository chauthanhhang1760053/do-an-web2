const nodemailer = require('nodemailer');

async function guikichhoat(to,subject, token) {
    const transporter=nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, 
        auth: {
<<<<<<< HEAD
            user: 'mail mình',
            pass: 'pass mail',
=======
            user: 'hainguyenltw@gmail.com',
            pass: 'mailxacnhan123',
>>>>>>> e7d397ce0640916416ff4bb0951e8ce95e9ab952
        }
    });
    
    return transporter.sendMail({
        from: 'user',
<<<<<<< HEAD
        to,
        subject, 
=======
        to: 'hofam75643@mailvk.net',
        subject: 'Confirm email',
>>>>>>> e7d397ce0640916416ff4bb0951e8ce95e9ab952
        text: 'http://localhost:3000/active/' + token,
    });
 }

 module.exports={guikichhoat};
