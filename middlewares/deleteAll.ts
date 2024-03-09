import mongoose from 'mongoose';

// Connection URI

async function deleteAllCollections(uri: string) {
    let connection;
    try {
        // Create a new connection
        connection = await mongoose.createConnection(uri)

        // Get all collection names
        const collections = await connection.db.collections();

        // Delete each collection
        for (let collection of collections) {
            await collection.drop();
            console.log(`Collection '${collection.collectionName}' deleted.`);
        }

        console.log('All collections deleted successfully.');
    } catch (error) {
        console.error('Error deleting collections:', error);
    } finally {
        if (connection) {
            // Close the connection
            await connection.close();
        }
    }
}

// Call the function to delete all collections
export default deleteAllCollections