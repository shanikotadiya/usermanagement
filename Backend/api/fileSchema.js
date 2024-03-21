const mongoose = require("mongoose");

// Creating a Schema for uploaded files
const fileSchema = new mongoose.Schema({
    createdAt: {
        type: Date,
        default: Date.now,
    },

    filename: {
        type: String
    },

    userid: {
        type: Object
    },

    contentType: {
        type: String,
    },

    data: {
        type: Buffer,
        required: true
    },

    size: {
        type: Number,
    }

});

// Creating a Model from that Schema
module.exports = mongoose.model("File", fileSchema);
