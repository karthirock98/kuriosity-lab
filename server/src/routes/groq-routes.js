import express from "express"
import { isAuthenticated } from "../controllers/auth-controller.js"
import { getAIQuoteResponse, getAstronomyDetails, getFactsByKeyword } from "../controllers/groq-controller.js"

const GROQ_ROUTES = express.Router()

GROQ_ROUTES.post("/quotes", isAuthenticated, getAIQuoteResponse)
GROQ_ROUTES.post("/astronomy", isAuthenticated, getAstronomyDetails)
GROQ_ROUTES.post("/facts", getFactsByKeyword)

export default GROQ_ROUTES