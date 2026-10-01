import express from "express"
import { isAuthenticated } from "../controllers/auth-controller.js"
import { getUnsplashImages } from "../controllers/generic-controllers.js"

const GENERIC_ROUTES = express.Router()

GENERIC_ROUTES.get("/get-unsplash-images",isAuthenticated, getUnsplashImages)

export default GENERIC_ROUTES