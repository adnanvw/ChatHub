const multer = require("multer")
//update
const { GridFsStorage } = require("multer-gridfs-storage")
require("dotenv").config();
const storage = new GridFsStorage({
    url: process.env.url, options: { useUnifiedTopology: true, useNewUrlParser: true }, file: (req, file) => {
        const match = ['image/*']
        if (match.indexOf(file.mimeType) === -1) {
            return `${Date.now()}-file-${file.originalname}`
        }
        return {
            bucketName: 'photos',
            filename: `${Date.now()}-file-${file.originalname}`
        }
    }
})
const upload = multer({ storage })
module.exports = { upload }