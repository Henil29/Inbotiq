import express from 'express';
import { getUserProfile, loginUser, logoutUser, register } from '../controller/auth.controller.js';
import { isAuth } from '../middlewares/isAuth.js';

const router = express.Router();

router.post('/register', register)
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/me', isAuth, getUserProfile)

export default router;