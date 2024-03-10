import mongoose from "mongoose";

(async function () {
    const uri = 'mongodb+srv://vickey:admin@cluster0.ffmdc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'//'mongodb+srv://Autobot:Autobot@cluster0.1uqttik.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
    const connection = await mongoose.connect(uri);
    if (connection) {
        return console.log('connected')

    }
    else {
        return console.log('failed')
    }
})()