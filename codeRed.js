import mongoose from "mongoose";


// Connection URI
const uri ="mongodb+srv://thevixyz:admin@MachiX.thsc7w6.mongodb.net/"

// Connect to MongoDB
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
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
    })
    .catch(error => {
        console.error('Error connecting to MongoDB:', error);
    })
    .finally(() => {
        // Close the Mongoose connection
        mongoose.connection.close();
    });
