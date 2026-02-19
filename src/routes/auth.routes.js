import express from 'express';
import {register,login,logout,check} from '../controller/auth.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
const authRouter = express.Router();
authRouter.post("/register",register)
authRouter.post("/login",login)
authRouter.post("/logout",authMiddleware,logout)
authRouter.get("/profile" ,authMiddleware,check)  
export default authRouter;