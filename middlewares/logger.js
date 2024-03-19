var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import fs from 'fs';
const filePath = './errorLogs.txt';
function logger(text, error) {
    return __awaiter(this, void 0, void 0, function* () {
        fs.access(filePath, fs.constants.F_OK, (err) => {
            if (err) {
                fs.writeFile(filePath, 'Created..', (err) => {
                    if (err) {
                        console.log('err creating file', err);
                    }
                    else {
                        logs(text, error);
                    }
                });
            }
            else {
                logs(text, error);
            }
        });
    });
}
function logs(text, error) {
    const date = new Date();
    const localTime = date.toLocaleString('en-Us', { timeZone: 'Asia/Kolkata' });
    fs.appendFileSync("errorLogs.txt", `ERROR -: ${localTime} :- In ${text} : ${error}` + "\n");
    console.log(error);
}
export default logger;
