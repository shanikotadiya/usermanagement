const express = require('express');
const File = require('./fileSchema.js');
const multer = require('multer');
const cors = require('cors'); // Import the cors package
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require("mongoose");


const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({
    extended: true,
})
);

const DB = "mongodb+srv://shanikotadiya:pw943fCStGYex3VD@cluster0.s7pjvsi.mongodb.net/";


mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        autoIndex: true,
    })
    .then(() => {
        console.log("DB connected successfully");
    });


app.set("view engine,", 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(`${__dirname}/public`))

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Use path.join to construct the correct path
        const uploadPath = path.join(__dirname, 'uploads/');
        req.uploadPath = uploadPath;
        cb(null, uploadPath);
    }, filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({
    storage: storage,
    limits: {
        fieldSize: 10 * 1024 * 1024,
    }
});


app.post('/image', upload.single('name'), async (req, res) => {
    console.log(req.file)
    try {
        const newFile = await File.create({
            name: req.file.filename,
        });
        console.log(newFile)
        res.status(200).json({
            status: "success",
            message: "File created successfully!!",
        });
    } catch (error) {
        res.json({
            error,
        });
    }
})

app.get("/api/getFiles", async (req, res) => {
    try {
        const files = await File.find();
        console.log(files);
        res.status(200).json({
            status: "success",
            files,
        });
    } catch (error) {
        res.json({
            status: "Fail",
            error,
        });
    }
});

app.listen(5000, () => {
    console.log('app is listen at 5000');
});