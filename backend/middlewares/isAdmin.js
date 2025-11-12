export const isAdmin = (req, res, next) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        if (user.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden: Admins only' });
        }
        return next();
        
    } catch (error) {
        return res.status(500).json({
            message: 'Authorization failed',
            error: error.message,
        });
    }
}