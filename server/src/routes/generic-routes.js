import express from "express"
import { isAuthenticated } from "../controllers/auth-controller.js"
import { getQuoteOftheDay, getUnsplashImages, investigateURL } from "../controllers/generic-controllers.js"

const GENERIC_ROUTES = express.Router()

GENERIC_ROUTES.get("/get-unsplash-images",isAuthenticated, getUnsplashImages)
GENERIC_ROUTES.get("/quote-of-the-day", getQuoteOftheDay)
GENERIC_ROUTES.post("/investigate-url",isAuthenticated, investigateURL)

export default GENERIC_ROUTES