import express from "express"
import { isAuthenticated } from "../controllers/auth-controller.js"
import { getAIQuoteResponse } from "../controllers/groq-controller.js"

const GROQ_ROUTES = express.Router()

GROQ_ROUTES.post("/quotes", isAuthenticated, getAIQuoteResponse)

export default GROQ_ROUTES