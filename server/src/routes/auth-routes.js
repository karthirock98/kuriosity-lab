import express from 'express'
import { logIn, logOut } from '../controllers/auth-controller.js';

const auth_routers = express.Router();

auth_routers.get('/logout', logOut)
auth_routers.post('/login', logIn)

export default auth_routers