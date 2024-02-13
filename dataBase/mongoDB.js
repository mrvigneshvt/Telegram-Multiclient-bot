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
const connectDB = (monogoURI) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mongodb = yield mongoose.connect(monogoURI);
        console.log(`MongoDB connected: ${mongodb.connection.name} / ${mongodb.connection.host} successfully!`);
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }
});
export default connectDB;
