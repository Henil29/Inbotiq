import { User } from '../models/user.model.js';
import { validateAdminUpdateUser } from '../validations/admin.validation.js';

export const getAllUsers = async (req, res) => {
    try {
        // Return only regular users (exclude admins) and hide password field
        const users = await User.find({ role: 'user' }).select('-password');
        return res.status(200).json({ count: users.length, users });
    } catch (error) {
        return res.status(500).json({
            message: 'Failed to retrieve users',
            error: error.message,
        });
    }
}

export const deleteUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (user.role === 'admin') {
            return res.status(403).json({ message: 'Forbidden: Cannot delete admin users' });
        }
        await User.findByIdAndDelete(userId);
        return res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        return res.status(500).json({
            message: 'Failed to delete user',
            error: error.message,
        });
    }
}

export const editUserDetails = async (req, res) => {
    try {
        const userId = req.params.id;
        // Validate payload
        const { error } = validateAdminUpdateUser(req.body);
        if (error) {
            return res.status(400).json({ message: error.details?.[0]?.message || 'Invalid input' });
        }

    const { name, email, role } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (user.role === 'admin') {
            return res.status(403).json({ message: 'Forbidden: Cannot edit admin users' });
        }

        // If email is being updated, ensure it's unique
        if (email) {
            const existing = await User.findOne({ email, _id: { $ne: userId } });
            if (existing) {
                return res.status(409).json({ message: 'Email already in use' });
            }
        }
        user.name = name ?? user.name;
        user.email = email ?? user.email;
        if (role) {
            user.role = role; // role validated by Joi
        }
        await user.save();
        return res.status(200).json({ message: 'User details updated successfully', user });
    } catch (error) {
        return res.status(500).json({
            message: 'Failed to update user details',
            error: error.message,
        });
    }
}