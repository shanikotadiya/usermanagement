const express = require('express');
const { MongoClient, GridFSBucket } = require('mongodb');
const cors = require('cors'); // Import the cors package
const { ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const secretKey = "fjkhdahsdadhaskdhasjkdhadasdad";
const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const mongoose = require("mongoose");
const File = require('./fileSchema.js');


const app = express();
const uri = "mongodb+srv://shanikotadiya:pw943fCStGYex3VD@cluster0.s7pjvsi.mongodb.net/userdatatable";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const port = 5001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.set("view engine,", 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(`${__dirname}/public`))


mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: true,
})
    .then(() => {
        console.log("DB connected successfully");
    });


const ResponseFormatter = (status, data, message = '') => {
    return {
        status,
        data,
        message,
    };
};

const initializeDatabase = async (dbname, tablename) => {
    try {
        await client.connect();
        const database = client.db(dbname);
        const bucket = new GridFSBucket(database, { bucketName: 'userProfileImages' });
        const collection = database.collection(tablename);
        const dbconn = {
            'collection': collection,
            'bucket': bucket
        }
        return dbconn;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

app.use(async (req, res, next) => {
    try {
        const dbconn = await initializeDatabase('userdatatable', 'userdata');
        const dbconn2 = await initializeDatabase('userdatatable', 'files');
        req.collection = dbconn.collection
        req.bucket = dbconn.bucket
        req.filecollection = dbconn2.collection

        next();
    } catch (error) {
        res.status(500).json({ message: "internal server error" });
    }
});

//For verifyToken
const verifyToken = async (req, res, next) => {
    const clientToken = req.headers.authorization;
    if (!clientToken) {
        return res.status(400).json({ message: 'Token is missing', status: 400 });
    }
    const user = await req.collection.findOne({ token: clientToken });
    if (!user) {
        return res.status(400).json({ message: 'Unauthorised user', status: 400 })
    }
    jwt.verify(clientToken, secretKey, (err) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token', status: 401 });
        } else {
            return next();
        }
    });
}


// For profile pic of register
const storage = multer.memoryStorage({
    destination: (req, file, cb) => {
        cb(null, "upload/");
    }, filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage })

app.route("/users")
    //For Datatable 
    .get(verifyToken, async (req, res) => {
        try {
            const userdata = await req.collection;
            const data = await userdata.aggregate([
                {
                    $lookup: {
                        from: 'files',
                        localField: '_id',
                        foreignField: 'userid',
                        as: 'profilelist'
                    }
                },
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        username: 1,
                        profilelist: {
                            contentType: 1,
                            data: 1
                        },
                    }
                }
            ]).toArray()
            res.json(ResponseFormatter(200, { data: data }, 'Record fetched successfully'));

        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "internal server error" });
        }
    })
    //For Register

    .post(upload.single('image'), async (req, res) => {
        try {
            const { name, username, password } = req.body;
            const user = await req.collection.findOne({ username: username });
            const { originalname, mimetype, buffer, size } = req.file;
            if (user == null) {
                const hashedPassword = await bcrypt.hash(password, 10);
                const data = { name, username, password: hashedPassword };
                const result = await req.collection.insertOne(data);
                console.log(typeof (result.insertedId));

                await File.create({
                    filename: originalname,
                    contentType: mimetype,
                    data: buffer,
                    size: size,
                    userid: result.insertedId
                });
                return res.json({ message: "data inserted", result, status: 200 });
            }
            res.status(401).json({ message: 'username is already avaliable', status: 401 });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "internal server error" });
        }
    })


app.route("/users/:id")
    //For Delete Record
    .delete(verifyToken, async (req, res) => {
        try {
            const result = await req.collection.deleteOne({ _id: new ObjectId(req.params.id) });

            if (result.deletedCount === 0) {
                return res.json(ResponseFormatter(404, null, "Record not found"));
            }

            return res.json(ResponseFormatter(200, null, 'Record deleted successfully'));
        } catch (error) {
            console.log(error);
            return res.json(ResponseFormatter(500, null, "Internal server error"));
        }
    })
    //For EditData
    .put(verifyToken, upload.single('image'), async (req, res) => {
        try {
            const { name, username } = req.body;
            const userdata = { name, username };
            if (req.file) {
                const { buffer, originalname, mimetype } = req.file
                const filedata = { data: buffer, filename: originalname, contentType: mimetype }
                await req.filecollection.updateOne({ userid: new ObjectId(req.params.id) }, { $set: filedata })
            }
            await req.collection.updateOne({ _id: new ObjectId(req.params.id) }, { $set: userdata });
            return res.json(ResponseFormatter(200, null, "Data Updated"));
        } catch (err) {
            console.log(err);
            return res.json(ResponseFormatter(500, null, "internal server error"));
        }
    })
//For LoginData
app.post('/users/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await req.collection.findOne({ username });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.json(ResponseFormatter(401, null, 'Authentication failed'));
        }

        const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });

        if (!token) {
            return res.json(ResponseFormatter(500, null, 'Token generation failed'));
        }

        const result = await req.collection.updateOne(
            { username },
            { $set: { token } }
        );
        if (result.modifiedCount === 1) {
            return res.json(ResponseFormatter(200, { token: token, currentuserid: user._id.toString(), currentusername: username }, 'Login Successfull'));

        } else {
            console.log('Token update failed');
        }

    } catch (err) {
        console.error('Login error:', err);
        return res.json(ResponseFormatter(500, null, 'Internal server error'));
    }

})

//for profile getting
app.get('/users/profileGet', async (req, res) => {
    try {
        const userid = await req.headers.currentuserid;
        const userprofile = await req.filecollection.findOne({ userid: new ObjectId(userid) })
        // console.log(userprofile);

        if (userprofile) {
            return res.json(ResponseFormatter(200, { binarydata: userprofile.data, contentType: userprofile.contentType }, 'profile fetched successfully'));
        }
        else {
            return res.json(ResponseFormatter(400, null, 'user is not avaliable for profile'));
        }
    } catch (error) {
        console.error(error);
        return res.status(ResponseFormatter(500, null, 'Internal server error'));
    }
})

app.listen(port, () => {
    console.log(`app is listen at ${port}`);
});