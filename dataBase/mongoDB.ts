import mongoose from "mongoose"



const connectDB = async (monogoURI:string) => {
    try {
        const mongodb = await mongoose.connect(monogoURI);
        console.log(`MongoDB connected: ${mongodb.connection.name} / ${mongodb.connection.host} successfully!`);
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
}



export default connectDB