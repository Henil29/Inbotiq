import { User } from "../models/user.model.js";
import { validateUserLogin, validateUserSignup } from "../validations/user.validation.js";
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/generateToken.js';

export const register = async (req, res) => {
    if (req.cookies.token) {
        return res.status(409).json({ message: 'Already authenticated. Logout before registering a new account.' });
    }

    const { name, email, password, role } = req.body;
    try {
        const { error } = validateUserSignup(req.body);
        if (error) {
            return res.status(400).json({ message: error.details?.[0]?.message || 'Validation failed' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists with this email' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ name, email, password: hashedPassword, role });

        // Sign token with user id (not email) for consistency
        const token = generateToken(newUser._id, res);

        return res.status(201).json({
            message: 'User registered successfully',
            user: {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                createdAt: newUser.createdAt,
            },
            token,
        });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
}

export const loginUser = async (req, res) => {
    try {
        if (req.cookies.token) {
            return res.status(409).json({ message: 'Already authenticated. Logout before logging into another account.' });
        }

        const { email, password } = req.body;
        const { error } = validateUserLogin(req.body);
        if (error) {
            return res.status(400).json({ message: error.details?.[0]?.message || 'Validation failed' });
        }

        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = generateToken(user._id, res);

        return res.status(200).json({
            message: 'User logged in successfully',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt,
            },
            token,
        });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const logoutUser = (req, res) => {
    if (!req.cookies.token) {
        return res.status(400).json({ message: 'No active session' });
    }
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
    });
    return res.status(200).json({ message: 'User logged out successfully' });
};

export const getUserProfile = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        return res.status(200).json({ user: req.user });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};