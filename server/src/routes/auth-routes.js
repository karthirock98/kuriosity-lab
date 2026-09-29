import express from "express";
import { getProfile, isAuthenticated, logIn, logOut } from "../controllers/auth-controller.js";
import { altcha } from "../helpers/altcha.js";

const auth_routers = express.Router();
const user_routers = express.Router();

auth_routers.post("/login", altcha.middleware(), logIn);
auth_routers.get("/logout", logOut);

auth_routers.get("/get-altcha-challenge", (req, res, next) => {
    console.log(req.cookies)
    next()
} ,altcha.challengeHandler);


// User routes
user_routers.get("/profile", getProfile)

auth_routers.use("/user", isAuthenticated, user_routers);

export default auth_routers;
