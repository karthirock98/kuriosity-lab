## 1. Multipart Upload

The application sends the selected file to the **Node.js Express server** using a `multipart/form-data` request.

## 2. File Validation

The server validates the uploaded file type and checks whether the file is permitted.

## 3. File Renaming

The server generates a safe filename and assigns the appropriate extension based on the validated file type.

## 4. File System Storage

The Express server writes the uploaded file to a configured folder on the server's file system.

## 5. Database Record

The server stores file metadata in the database, including:

- Original filename
- Stored filename
- Validated file type
- Storage location

## 6. Response

After successful storage, the server returns a response indicating whether the upload succeeded.