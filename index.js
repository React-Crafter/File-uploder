// configaration
const express = require('express');
const multer = require('multer');
const path = require('path');

// upload path
const UPLOADS__FOLDERS = './uplodes/'

// storeagr variaboles
const storeage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOADS__FOLDERS)
    },
    filename: (req, file, cb) => {
        const fileExt = path.extname(file.originalname);
        const fileName = file.originalname
                             .replace(fileExt, "")
                             .toLocaleUpperCase()
                             .split(' ')
                             .join('-') + '-' + Date.now();
        cb(null, fileName + fileExt)
    }
});

// file upload Object
const upload = multer({
    storage: storeage,
    limits: {
        fileSize: 1000000
    },
    fileFilter: (req, file, cb) => {
        if (
            file.mimetype == 'image/png' ||
            file.mimetype == 'image/jpg' ||
            file.mimetype == 'image/jpeg'
        ) {
            cb(null, true);
        } else {
            cb(new Error('Only .jpg, .png, .jpeg format allowed'));
        }
    }
});

// app Objext
const app = express();

// Routing start
app.post('/', upload.single('avatar'), (req, res) => {
    res.send('Hello World')
    console.log(req.file)
});

// upload error handaleing
app.use((err, req, res, next) => {
    if (err) {
        if (err instanceof multer.MulterError) {
            res.status(500).send('thear was a upload erroe');
        } else {
            res.status(500).send(err.message);
        }
    } else {
        res.send('success')
    }
});

// start server
app.listen(3000, () => {
    console.log('listening the port number 3000')
})