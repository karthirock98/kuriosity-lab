import path from "node:path";
import fs from "node:fs/promises";
import backBlazeClient from "../services/back-blaze-client.js";
import imageDbModel from "../models/image-db.model.js";
import { createResponse } from "../utils/common-utils.js";
import { emitToSocket, getSocketId } from "../services/socket-service.js";
import { fileControllerSocketMessages } from "../services/file-management-socket-handler.js";
import { intentionalSleep } from "../helpers/generic-helper.js";

export const saveImageinDb = async (req, res) => {
  try {
    const socketId = getSocketId(req.auth?.username);
    if (socketId) {
      await fileControllerSocketMessages(socketId, 0, "db");
      await intentionalSleep(2000);
    }
    if (req?.file) {
      if (socketId) {
        await fileControllerSocketMessages(socketId, 1, "db");
        await intentionalSleep(1000);
      }
      const fileName = req.file.originalname.replace(
        req.file.originalname.split(".").pop(),
        req.file.mimetype.split("/").pop(),
      );

      const imageDbPayload = {
        name: fileName,
        mimetype: req.file.mimetype,
        buffer: req.file.buffer,
      };

      const response = await imageDbModel.storeImage(imageDbPayload, socketId);
      res.status(200).json(response);
    }
  } catch (error) {
    res.status(500).json(createResponse(500, "", "Something Went Wrong!", ""));
    throw error;
  }
};

export const saveImageinServer = async (req, res) => {
  const socketId = getSocketId(req.auth?.username);
  const storage = "server";

  try {
    // Step 3: Server validation
    await runProcessingStep(socketId, storage, 3, async () => {
      if (!req.file) {
        throw new Error("No file uploaded");
      }
    });

    // Step 4: Rename file based on MIME
    const { filename, fileName } = await runProcessingStep(
      socketId,
      storage,
      4,
      async () => {
        const extension = path.extname(req.file.originalname);
        const filename = `${crypto.randomUUID()}${extension}`;

        const fileName = req.file.originalname.replace(
          /\.[^.]+$/,
          `.${req.file.mimetype.split("/").pop()}`,
        );

        return { filename, fileName };
      },
    );

    const uploadDir = path.join(process.cwd(), "uploads", "images");
    const filePath = path.join(uploadDir, filename);

    // Step 5: Upload to server directory
    await runProcessingStep(socketId, storage, 5, async () => {
      await fs.mkdir(uploadDir, { recursive: true });
      await fs.writeFile(filePath, req.file.buffer);
    });

    // Step 6: Store details in DB
    const response = await runProcessingStep(socketId, storage, 6, async () => {
      const imageDbPayload = {
        name: fileName,
        mimetype: req.file.mimetype,
        path: filePath,
        mode: storage,
      };

      return await imageDbModel.storeImagePath(imageDbPayload);
    });

    res.status(200).json(response);
  } catch (error) {
    console.error("Image upload failed:", error);

    if (!res.headersSent) {
      res
        .status(500)
        .json(createResponse(500, "", "Something Went Wrong!", ""));
    }
  }
};

export const saveFileInCloudService = async (req, res) => {
  try {
    const fileName = req.file.originalname.replace(
      req.file.originalname.split(".").pop(),
      req.file.mimetype.split("/").pop(),
    );
    const objResponse = await backBlazeClient.uploadFile({
      name: fileName,
      buffer: req.file.buffer,
      mime_type: req.file.mimetype,
    });
    const imageDbPayload = {
      name: fileName,
      mimetype: req.file.mimetype,
      path: objResponse.fileId,
      mode: "obj",
    };
    const response = await imageDbModel.storeImagePath(imageDbPayload);
    res
      .status(200)
      .json(
        createResponse(
          200,
          { objResponse, response },
          "Saved Successfully",
          null,
        ),
      );
  } catch (error) {
    res.status(500).json(createResponse(500, "", "Something Went Wrong!", ""));
    throw error;
  }
};

/** @type {import('express').RequestHandler} */
export const getImageByIdCtrl = async (req, res) => {
  try {
    if (req?.query.id) {
      const [response] = await imageDbModel.getImageById(req.query.id);

      if (response.image_data) {
        res.set({
          "Content-Type": response.mime_type,
          "Content-Disposition": `inline; filename="${response.filename}"`,
          "Access-Control-Expose-Headers": "Content-Disposition",
        });
        res.send(response.image_data);
      } else if (response.mode === "server") {
        const fileBuffer = await fs.readFile(response.file_path);
        res.set({
          "Content-Type": response.mime_type,
          "Content-Disposition": `inline; filename="${response.filename}"`,
          "Access-Control-Expose-Headers": "Content-Disposition",
        });
        res.send(fileBuffer);
      } else if (response.mode === "obj") {
        const fileRes = await backBlazeClient.getFileByName(response.filename);
        res.set({
          "Content-Type": response.mime_type,
          "Content-Disposition": `inline; filename="${response.filename}"`,
          "Access-Control-Expose-Headers": "Content-Disposition",
        });
        res.send(fileRes);
      }
    }
  } catch (error) {
    res.status(500).json(createResponse(500, "", "Something Went Wrong!", ""));
    throw error;
  }
};

// this method returns only files names from back blaze service
export const getAllObjImagesNames = async (req, res) => {
  try {
    const fileNameList = await backBlazeClient.getAllFiles();
    res
      .status(200)
      .json(
        createResponse(200, fileNameList, "Files Fetched Successfully", null),
      );
  } catch (error) {
    res.status(500).json(createResponse(500, "", "Something Went Wrong!", ""));
    throw error;
  }
};

export const delteFile = async (req, res) => {
  try {
    const id = req.query.id;
    if (id) {
      const [fileInfo] = await imageDbModel.getImageById(id);
      if (fileInfo) {
        switch (fileInfo.mode) {
          case "obj": {
            const deleteObj = await backBlazeClient.deleteFileByNameAndId(
              fileInfo.filename,
              fileInfo.file_path,
            );
            res
              .status(200)
              .json(
                createResponse(
                  200,
                  deleteObj,
                  "Files Deleted Successfully",
                  null,
                ),
              );
            break;
          }
          case "server": {
            const deleteFile = await fs.unlink(fileInfo.file_path);
            res
              .status(200)
              .json(
                createResponse(
                  200,
                  deleteFile,
                  "Files Deleted Successfully",
                  null,
                ),
              );
            break;
          }
          case "db": {
            const deleteFileDb = await imageDbModel.deleteImageById(id);
            res
              .status(200)
              .json(
                createResponse(
                  200,
                  deleteFileDb[0],
                  "Files Deleted Successfully",
                  null,
                ),
              );
            break;
          }
          default:
            break;
        }
      } else {
        throw Error("No File Found");
      }
    }
  } catch (error) {
    res
      .status(500)
      .json(
        createResponse(500, "", error.message || "Something Went Wrong!", ""),
      );
    throw error;
  }
};

export const runProcessingStep = async (
  socketId,
  storage,
  stepId,
  callback,
  delay = 2000
) => {
  try {
    if (socketId) {
      await fileControllerSocketMessages(
        socketId, stepId, storage, "processing"
      );

      await intentionalSleep(delay);
    }

    const result = await callback();

    if (socketId) {
      await fileControllerSocketMessages(
        socketId, stepId, storage, "completed"
      );
    }

    return result;

  } catch (error) {
    if (socketId) {
      await fileControllerSocketMessages(
        socketId, stepId, storage, "failed"
      );
    }

    throw error;
  }
};
