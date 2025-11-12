import jwt from 'jsonwebtoken';

export const generateToken = (id, res) => {
    const token = jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });

    const isProd = process.env.NODE_ENV === 'production';

    res.cookie('token', token, {
        httpOnly: true,
        sameSite: isProd ? 'none' : 'lax',
        secure: isProd, // required when SameSite=None
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return token;
};