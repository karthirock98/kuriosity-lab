## 1. Multipart Upload

The application sends the selected file to the **Node.js Express server** using a `multipart/form-data` request.

## 2. File Validation

The server validates the uploaded file and checks whether the file is permitted.

## 3. Metadata Processing

The server generates a filename with the appropriate extension based on the file's MIME type.

## 4. Database Storage

The server writes the file's binary content directly into a column of the database's `images` table, along with its metadata:

- Filename
- Validated file type
- Storage mode

## 5. Response

After successful storage, the server returns a response indicating whether the upload succeeded.
