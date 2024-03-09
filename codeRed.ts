import mongoose from "mongoose";


// Connection URI
const uri = "mongodb+srv://sodha123:sodha123@cluster0.ncclx8i.mongodb.net/?retryWrites=true&w=majority"

// Connect to MongoDB

async function codeRed(uri: string) {

    mongoose.connect(uri)
        .then(async () => {
            console.log('Connected to MongoDB');

            // Get a list of all collection names in the database
            const collections = await mongoose.connection.db.listCollections().toArray();

            // Iterate through each collection and delete it
            for (let collection of collections) {
                await mongoose.connection.db.dropCollection(collection.name);
                console.log(`Collection '${collection.name}' deleted successfully`);
            }

            console.log('All collections deleted successfully');

            // Close the Mongoose connection
            mongoose.connection.close();
        })
        .catch(error => {
            console.error('Error connecting to MongoDB:', error);
        });


}

export default codeRed
