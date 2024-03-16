import mongoose from "mongoose"

const userData = new mongoose.Schema({
    thumbnail: {
        type: String,
    },
    Token: {
        type: String,
        default: '',
        unique: false,
    },
    BotId: {
        default: 0,
        type: Number,
    },
    Admin: {
        required: true,
        type: Number,
    },
    Buttons: {
        default: [],
        type: Array
    },
    MongoDB: {
        default: [],
        type: Array,
        unique: false
    },
    Channels: {
        default: [],
        type: Array,
    },
    validity: {
        default: 0,
        type: Number,
    },
    forceSub: {
        type: String,
    },
    channelLink: {
        type: String,
    },
    forceSubActive: {
        type: Boolean,
        default: false,
    },
    customCaption: {
        type: String,
    },
    isVerified: {
        default: false,
        type: Boolean,
    }
})

const ClientData = mongoose.model('fatherMachiX', userData)


export { ClientData, userData }