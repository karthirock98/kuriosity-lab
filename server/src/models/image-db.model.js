import dbPool from "../db.js";
import { intentionalSleep } from "../helpers/generic-helper.js";
import { fileControllerSocketMessages } from "../services/file-management-socket-handler.js";

class ImageDB {
  async storeImage(data, socketId) {
    if(socketId){
      await fileControllerSocketMessages(socketId, 3, 'db')
      await intentionalSleep(2000)
    }
    const result = await dbPool.execute('INSERT INTO images (filename, mime_type, image_data, mode) values (?, ?, ?, ?)', [
        data.name, data.mimetype, data.buffer, 'db'
    ]);
    if(socketId){
      await fileControllerSocketMessages(socketId, 4, 'db')
    }
    return result[0];
  }
  async storeImagePath(data) {
    const result = await dbPool.execute('INSERT INTO images (filename, mime_type, image_data, file_path, mode) values (?, ?, ?, ?, ?)', [
        data.name, data.mimetype, null, data.path, data.mode
    ]);
    return result[0];
  }
  async getImageById(id) {
    const result = await dbPool.execute('SELECT * from images where id = ?', [
        id
    ]);
    return result[0];
  }
  async deleteImageById(id) {
    const result = await dbPool.execute('delete from images as i where i.id  = ?', [
        id
    ]);
    return result[0];
  }
}

export default new ImageDB();
