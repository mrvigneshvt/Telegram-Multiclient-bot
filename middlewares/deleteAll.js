var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import mongoose from 'mongoose';
// Connection URI
function deleteAllCollections(uri) {
    return __awaiter(this, void 0, void 0, function* () {
        let connection;
        try {
            // Create a new connection
            connection = yield mongoose.createConnection(uri);
            // Get all collection names
            const collections = yield connection.db.collections();
            // Delete each collection
            for (let collection of collections) {
                yield collection.drop();
                console.log(`Collection '${collection.collectionName}' deleted.`);
            }
            console.log('All collections deleted successfully.');
        }
        catch (error) {
            console.error('Error deleting collections:', error);
        }
        finally {
            if (connection) {
                // Close the connection
                yield connection.close();
            }
        }
    });
}
// Call the function to delete all collections
export default deleteAllCollections;
