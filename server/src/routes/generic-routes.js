import express from "express"
import { isAuthenticated } from "../controllers/auth-controller.js"
import { getQuoteOftheDay, getUnsplashImages, investigateURL } from "../controllers/generic-controllers.js"
import multer from "multer"
import { fileSizeValidator } from "../helpers/generic-helper.js"
import { createResponse } from "../utils/common-utils.js"
import { delteFile, getAllObjImagesNames, getImageByIdCtrl, saveFileInCloudService, saveImageinDb, saveImageinServer } from "../controllers/file-management.controller.js";

const memoryFileStore = multer({
    storage: multer.memoryStorage()
})
const GENERIC_ROUTES = express.Router()

GENERIC_ROUTES.get("/get-unsplash-images",isAuthenticated, getUnsplashImages)
GENERIC_ROUTES.get("/quote-of-the-day", isAuthenticated, getQuoteOftheDay)
GENERIC_ROUTES.post("/investigate-url",isAuthenticated, investigateURL)
GENERIC_ROUTES.post("/upload-images", isAuthenticated, memoryFileStore.single("image"),  (req, res, next) => {
    if(fileSizeValidator(req.file, 'max', 1)){
        if(req.query.mode === "db"){
            saveImageinDb(req, res, next)
        }else if (req.query.mode === "obj"){
            saveFileInCloudService(req, res) 
        }else{
            saveImageinServer(req, res)
        }
    }else{
        res.status(500).json(createResponse(500, "", "File size max 1MB!", ""));
    }
} )
GENERIC_ROUTES.get("/get-images-by-id", isAuthenticated, getImageByIdCtrl )
GENERIC_ROUTES.get("/get-obj-images-list", isAuthenticated, getAllObjImagesNames )
GENERIC_ROUTES.delete("/delete-image", isAuthenticated, delteFile )

export default GENERIC_ROUTES