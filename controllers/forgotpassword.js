const { createTransport } = require('nodemailer');
const dotenv = require('dotenv');
const uuidv4 = require('uuid').v4;
const ForgotPasswordRequest = require('../models/ForgotPasswordRequests'); 
const User = require('../models/user');

dotenv.config();

exports.forgotPassword = async (req, res) => {
    const transporter = createTransport({
        host: process.env.SENDINBLUE_HOST_NAME,
        port: process.env.SENDINBLUE_PORT_NAME,
        auth: {
            user: process.env.USER_EMAIL,
            pass: process.env.FORGOT_PASSWORD_API_KEY,
        },
    });
    const resetToken = uuidv4(); // It Generates a unique reset token
    const resetPasswordURL = `http://localhost:3000/password/reset-password/${resetToken}`;

    try {
        const user = await User.findOne({ email: req.body.emails });

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Saving the reset token in the database
        const forgotPassword = new ForgotPasswordRequest({
            id: resetToken,
            userId: user._id,
            isActive: true,
        });
        forgotPassword.save()

        const mailOptions = {
            from: process.env.USER_EMAIL,
            to: req.body.emails,
            subject: 'Reset Password!',
            html: `<h1>Reset your Password</h1>
                   <p>Click the following link to reset your password:</p>
                   <a href="${resetPasswordURL}">Reset Password</a>`,
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });

        const email = req.body.emails;
        console.log(email);
        
        res.status(200).json({ message: 'Password reset email sent successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};
