const nodemailer = require('nodemailer');

async function send(toUserEmail, emailSubject, emailContent, emailHTML) {
	const transporter = nodemailer.createTransport({
		host: 'smtp.gmail.com',
		port: 587,
		secure: false,
		auth: {
			user: process.env.EMAIL_NAME,
			pass: process.env.EMAIL_PASSWORD
		}
	});
	return transporter.sendMail({
		from: process.env.EMAIL_FROM,
		to: toUserEmail,
		subject: emailSubject,
		text: emailContent,
		html: emailHTML
	});
}

module.exports = { send };
