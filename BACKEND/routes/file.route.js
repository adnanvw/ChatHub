const express = require("express");
const { upload } = require("../middlewares/upload.middleware");
const fileRouter = express.Router();
const Grid = require('gridfs-stream')
const mongoose = require("mongoose");
fileRouter.post('/upload', upload.single("file"), (req, res) => {
    if (!req.file) {
        res.json({ msg: 'File not found' })
    }
    res.json(`http://localhost:5000/file/${req.file.filename}`)
})
let gfs, gridFSBucket
const conn = mongoose.connection
conn.once('open', () => {
    gridFSBucket = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: 'fs'
    })
    gfs = Grid(conn.db, mongoose.model)
    gfs.collection('fs')
})
fileRouter.get('/:filename', async (req, res) => {
    try {
        const file = await gfs.files.findOne({ filename: req.params.filename })
        const readStream = gridFSBucket.openDownloadStream(file._id)
        readStream.pipe(res)
    } catch (error) {
        res.json({ error: error.message })
    }
})
module.exports = {
    fileRouter,
};