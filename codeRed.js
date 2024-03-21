var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import mongoose from "mongoose";
// Connection URI
const uri = "mongodb+srv://Admin:Admin@cluster0.qf1qi6y.mongodb.net/"; //"mongodb+srv://sodha123:sodha123@cluster0.ncclx8i.mongodb.net/?retryWrites=true&w=majority";
//codeRed(uri)
function codeRed(uri) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const connection = mongoose.createConnection(uri);
            console.log('Connected to MongoDB');
            // Check if the connection is established successfully
            if (!connection) {
                throw new Error('Failed to establish connection to MongoDB');
            }
            // Get a list of all collection names in the database
            const collections = yield connection.listCollections();
            console.log(collections);
            // Iterate through each collection and delete it
            for (let collection of collections) {
                yield connection.dropCollection(collection.name);
                console.log(`Collection '${collection.name}' deleted successfully`);
            }
            console.log('All collections deleted successfully');
            // Close the Mongoose connection
            yield connection.close();
            console.log('Connection closed');
        }
        catch (error) {
            console.error('Error connecting to MongoDB:', error);
        }
    });
}
//codeRed(uri)
export default codeRed;
