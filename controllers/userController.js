const userModel = require('../models/userModel');

async function deleteUser (req, res, next) {
    const requesterRole = req.user.role;
    const targetUserId = req.params.userId;

    try {
        if (requesterRole.toLowerCase() !== 'admin') {
            return res.status(403).json({ 
                success: false,
                message: 'You are not authorized to perform this action.'
             });
        }

        const targetUser = await userModel.findOne({ _id: targetUserId });

        if (!targetUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found.'
            });
        }

        if (targetUser.role !== 'user') {
            return res.status(409).json({
                success: false,
                message: 'Admin users cannot be deleted.'
            });
        }

        const deletedUser = await userModel.findOneAndDelete({ _id: targetUserId });

        return res.status(200).json({
            success: true,
            message: 'User deleted successfully.',
            user: {
                id: deletedUser._id,
                name: deletedUser.name,
                age: deletedUser.age,
                email: deletedUser.email,
                role: deletedUser.role
            }
        });

    } catch (error) {
        next(error);
    }
}

module.exports = deleteUser;
