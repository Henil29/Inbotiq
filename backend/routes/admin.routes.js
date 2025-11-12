import express from 'express';
import { isAuth } from '../middlewares/isAuth.js';
import { isAdmin } from '../middlewares/isAdmin.js';
import { deleteUserById, editUserDetails, getAllUsers } from '../controller/admin.controller.js';

const router = express.Router();

router.get('/users', isAuth, isAdmin, getAllUsers);
router.delete('/user/:id', isAuth, isAdmin, deleteUserById);
router.put('/user/:id', isAuth, isAdmin, editUserDetails);
export default router;