import express from "express";
import { isAuthenticated } from "../controllers/auth-controller.js"
import { getDataByCountryName } from "../controllers/countries.controller.js";

const COUNTRIES_ROUTES = express.Router()

COUNTRIES_ROUTES.get("/countries", isAuthenticated, getDataByCountryName)

export default COUNTRIES_ROUTES