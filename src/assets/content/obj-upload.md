## 1. Multipart Upload

The application sends the selected file to the **Node.js Express server** using a `multipart/form-data` request.

## 2. File Validation

The server validates the uploaded file and checks whether the file is permitted.

## 3. Object Naming

The server generates a unique object name with the appropriate extension based on the file's MIME type.

## 4. Cloud Storage

The Express server uploads the file to a **Backblaze B2** bucket and verifies that Backblaze returned a file ID.

## 5. Database Record

The server stores object metadata in the database, including:

- Object name
- Validated file type
- Backblaze file ID
- Storage mode

## 6. Response

After successful storage, the server returns a response indicating whether the upload succeeded.
