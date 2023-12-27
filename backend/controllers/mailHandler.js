const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.MAIL_FROM,
    pass: process.env.MAIL_PASS,
  },
});

function mailHandler(res, username, otp) {
  const mailOptions = {
    from: process.env.MAIL_FROM,
    to: username,
    subject: "Signup OTP",
    text: `Your OTP for signup is: ${otp}`,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).json({ error: "Error sending OTP" });
    }
    res.json({ message: "OTP sent successfully" });
  });
}

module.exports = { mailHandler };
