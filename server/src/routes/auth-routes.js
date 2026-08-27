import express from "express";
import { logIn, logOut } from "../controllers/auth-controller.js";
import { altcha } from "../helpers/altcha.js";

const auth_routers = express.Router();

auth_routers.get("/logout", logOut);
auth_routers.post("/login", altcha.middleware(), logIn);
auth_routers.get("/get-altcha-challenge", altcha.challengeHandler);

export default auth_routers;
