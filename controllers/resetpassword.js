const ForgotPasswordRequest = require('../models/ForgotPasswordRequests');
const bcrypt = require('bcrypt');
const User = require('../models/user')

exports.resetPassword = async (req, res) => {
    const resetToken = req.params.token; 
    const newPassword = req.body.newpassword;

    try {
        const resetRequest = await ForgotPasswordRequest.findOne({
                id: resetToken,
                isActive: true
        });

        if (!resetRequest) {
            return res.status(404).json({ message: 'Invalid or expired reset token.' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Updating user's password in the database
        const user = await User.findById(resetRequest.userId);
        user.password = hashedPassword;
        user.save()

        // Deactivatong the reset token
        const forgotPassword = await ForgotPasswordRequest.findOne({ id: resetToken });
        forgotPassword.isActive = false
        forgotPassword.save()

        res.status(200).json({ message: 'Password reset successful.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};
