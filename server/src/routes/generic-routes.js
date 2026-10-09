import express from "express"
import { isAuthenticated } from "../controllers/auth-controller.js"
import { getUnsplashImages, investigateURL } from "../controllers/generic-controllers.js"

const GENERIC_ROUTES = express.Router()

GENERIC_ROUTES.get("/get-unsplash-images",isAuthenticated, getUnsplashImages)
GENERIC_ROUTES.post("/investigate-url", investigateURL)

export default GENERIC_ROUTES