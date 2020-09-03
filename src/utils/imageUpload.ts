import crypto from 'crypto';
import path from 'path';
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");

const mongoURI = 'mongodb+srv://gyomber32:source32@cluster0-rpz3d.mongodb.net/forester?retryWrites=true&w=majority';

const storage = new GridFsStorage({
    url: mongoURI,
    file: (req: any, file: any) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: 'pictures'
                };
                resolve(fileInfo);
            });
        });
    }
});

export default multer({ storage: storage });