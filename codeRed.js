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
const uri = "mongodb+srv://sodha123:sodha123@cluster0.ncclx8i.mongodb.net/?retryWrites=true&w=majority";
// Connect to MongoDB
function codeRed(uri) {
    return __awaiter(this, void 0, void 0, function* () {
        mongoose.connect(uri)
            .then(() => __awaiter(this, void 0, void 0, function* () {
            console.log('Connected to MongoDB');
            // Get a list of all collection names in the database
            const collections = yield mongoose.connection.db.listCollections().toArray();
            // Iterate through each collection and delete it
            for (let collection of collections) {
                yield mongoose.connection.db.dropCollection(collection.name);
                console.log(`Collection '${collection.name}' deleted successfully`);
            }
            console.log('All collections deleted successfully');
            // Close the Mongoose connection
            mongoose.connection.close();
        }))
            .catch(error => {
            console.error('Error connecting to MongoDB:', error);
        });
    });
}
export default codeRed;
