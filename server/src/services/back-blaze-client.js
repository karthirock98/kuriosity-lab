import { B2Client, BufferSource } from "@backblaze-labs/b2-sdk";

const client = new B2Client({
    applicationKey: process.env.BACK_BLAZE_APP_KEY,
    applicationKeyId: process.env.BACK_BLAZE_KEY_ID,
})

await client.authorize();
const bucket = await client.getBucket('kuriosity-lab');

class BackBlazeMain {
    async uploadFile (payload)  {
        const fileData = {
            fileName: payload.name,
            source: new BufferSource(payload.buffer),
            contentType: payload.mime_type
        }
        const bucketResponse = await bucket.upload(fileData);
        return bucketResponse;
    }
    async getAllFiles () {
        const files = await bucket.listFileNames();
        return files.files;
    }
    async getFileByName (id) {
        const file = await bucket.download(id);
        const fileBuffer = await new Response(file.body).arrayBuffer();
        const buffer = Buffer.from(fileBuffer);
        return buffer;
    }
    async deleteFileByNameAndId (filename, fileId) {
        const deleteFile = await bucket.deleteFileVersion(filename, fileId);
        return deleteFile;
    }
}

export default new BackBlazeMain();