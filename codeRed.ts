import mongoose from "mongoose";

// Connection URI
const uri = "mongodb+srv://sodha123:sodha123@cluster0.ncclx8i.mongodb.net/?retryWrites=true&w=majority";

codeRed(uri)
async function codeRed(uri: string) {
    try {
        const connection = mongoose.createConnection(uri);
        console.log('Connected to MongoDB');

        // Check if the connection is established successfully
        if (!connection) {
            throw new Error('Failed to establish connection to MongoDB');
        }



        // Get a list of all collection names in the database
        const collections = await connection.listCollections()

        console.log(collections)

        // Iterate through each collection and delete it
        for (let collection of collections) {
            await connection.dropCollection(collection.name);
            console.log(`Collection '${collection.name}' deleted successfully`);
        }

        console.log('All collections deleted successfully');

        // Close the Mongoose connection
        await connection.close();
        console.log('Connection closed');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

export default codeRed;
