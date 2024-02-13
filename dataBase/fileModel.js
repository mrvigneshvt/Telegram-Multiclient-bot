import mongoose from "mongoose";
const schemaFile = new mongoose.Schema({
    fileName: {
        type: String,
        required: true,
    },
    fileSize: {
        type: Number,
        required: true
    },
    fileId: {
        type: String,
        required: true,
    },
    fileUniqueId: {
        type: String,
        unique: true,
        required: true
    },
    fileType: {
        type: String,
        default: null,
        required: false
    },
    mimeType: {
        type: String,
        default: null,
        required: false
    },
    caption: {
        type: String,
        default: null,
        required: false
    }
});
const userSchema = new mongoose.Schema({
    chatId: {
        type: String,
        required: true,
    },
    Joined: {
        type: String,
        required: true,
    }
});
export { schemaFile, userSchema };
