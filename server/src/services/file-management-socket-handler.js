const messages = {
  "db": [
    "Validating File Size",
    "Generating File Name Based on MIME Type",
    "Preparing Database Upload Query",
    "Uploading File to Database",
    "File Uploaded Successfully"
  ],
  "server": [
    "Validating File Size",
    "Generating File Name Based on MIME Type",
    "Preparing Server Storage Path",
    "Uploading File to Server",
    "File Uploaded Successfully"
  ],
  "obj": [
    "Validating File Size",
    "Generating File Name Based on MIME Type",
    "Initializing Backblaze B2 Upload",
    "Uploading File to Backblaze B2",
    "File Uploaded Successfully"
  ]
}

import { emitToSocket } from "./socket-service.js";

export const fileControllerSocketMessages = (socketid, step, mode) => {
  const message = messages[mode]?.[step];

  if (!message || !socketid) return;

  emitToSocket(socketid, "file-management", {
    mode,
    message,
    step,
  });
};