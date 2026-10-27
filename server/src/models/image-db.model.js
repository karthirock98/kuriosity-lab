import dbPool from "../db.js";

class ImageDB {
  async storeImage(data) {
    const result = await dbPool.execute('INSERT INTO images (filename, mime_type, image_data, mode) values (?, ?, ?, ?)', [
        data.name, data.mimetype, data.buffer, 'db'
    ]);
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
