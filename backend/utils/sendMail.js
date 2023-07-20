var nodemailer = require('nodemailer');
const {options} = require('../app');
const sendMail = (options) => {
	var transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: process.env.SMPT_MAIL,
			pass: process.env.SMPT_PASSWORD,
		},
	});

	var mailOptions = {
		from: process.env.SMPT_MAIL,
		to: options.email,
		subject: options.subject,
		text: options.message,
	};

	transporter.sendMail(mailOptions, function (error, info) {
		if (error) {
			console.log(error);
		} else {
			console.log('Email sent: ' + info.response);
		}
	});
};

module.exports = sendMail;
