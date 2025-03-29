const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const {
  verifyEmailVerificationToken,
  generateEmailVerificationToken,
} = require("./tokenService");
const User = require("../schemas/userschema");
dotenv.config();
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "shanikotadiya@gmail.com",
    pass: "zoge zfjw fhww zfqa",
  },
});

const sendVerificationEmail = async (user) => {
  const token = generateEmailVerificationToken(user._id);
  const verificationLink = `${process.env.BASE_URL}/verify-email?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL,
    to: user.email,
    subject: "Email Verification",
    html: `<p>Hi ${user.firstName},</p><p>Click <a href="${verificationLink}">here</a> to verify your email.</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Verification email sent successfully");
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error("Error sending verification email");
  }
};

const verifyEmail = async ({ token }, res) => {
  if (!token) {
    return res.status(400).json({ message: "Verification token is missing." });
  }
  try {
    const decoded = verifyEmailVerificationToken(token);
    const user = await User.findById(decoded.id);    
    if (!user.verified) {
      user.verified = true;
      await user.save();
      return res.redirect(
        `${process.env.FRONTEND_URL}/verify-success?status=success`
      );
    } else {
      return res.status(400).json({ message: "User is already verified" });
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Invalid or expired token" });
  }
};

module.exports = { sendVerificationEmail, verifyEmail };
