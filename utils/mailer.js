const logger = require("./logger");
const moment = require("moment");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const defaultFrom = "support@email.com";
const send = async ({ from = defaultFrom, to, subject, text, html }) => {
	logger.info(`Sending subject ${subject} to ${to}`);
	return sgMail.send({
		from,
		to,
		subject,
		text,
		html,
	});
};

module.exports = {
	sendDuplicateAccountCreation: ({ email }) =>
		send({
			to: email,
			subject: "Attempted account creation?",
			text:
				`An attempt was made to create an account using your email but an account already exists. If you have forgotten your account info, click ${process.env.BASE_URL}/forgot?email=${email} to request a link to reset your password. If this request was not made by you, please ignore this email.`,
		}),
	sendDuplicateAccountCreationNeedsVerification: ({ email }) =>
		send({
			to: email,
			subject: "Attempted account creation? Need email verification",
			text: `An attempt was made to create an account using your email but an account already exists. If you need another verification email, click ${process.env.BASE_URL}/account/verify?email=${email}. If this request was not made by you, please ignore this email.`,
		}),
	sendEmailVerification: ({ email, token }) =>
		send({
			to: email,
			subject: "Email Confirmation",
			text: `To confirm creation of your account, please click here ${process.env.BASE_URL}/account/verify/${token}`,
		}),
	sendEmailVerificationAlreadyVerified: ({ email }) =>
		send({
			to: email,
			subject: "Email Confirmation | Already Verified",
			text: `An email verification link was request for this email address but your email has already been verified. If this request was not made by you, please ignore this email.`,
		}),
	sendPasswordReset: ({ email, token, expires }) =>
		send({
			to: email,
			subject: "Password Reset",
			text: `Here is a link to reset your password ${
				process.env.BASE_URL
			}/account/reset?token=${token} This link will expire at ${moment(
				expires
			).format()}.  If this request was not made by you, please ignore this email.`,
		}),
};
