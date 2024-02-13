var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const InlineKeyboard = (datas) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const buttonsAlign = [];
        const buttons = datas;
        for (let i = 0; i < buttons.length; i += 2) {
            const row = [];
            row.push({ text: buttons[i], switchInlineQueryCurrentChat: i.toString() + " " });
            if (i + 1 < buttons.length) {
                const query = i + 1;
                row.push({ text: buttons[i + 1], switchInlineQueryCurrentChat: query.toString() + " " });
            }
            buttonsAlign.push(row);
        }
        ;
        return buttonsAlign;
    }
    catch (err) {
        //fs.appendFileSync("Zerror.txt", `ERROR -:- Align InlineKeyboard : ${err}` + "\n", (e) => console.log(e))
        console.log(err);
    }
});
export default InlineKeyboard;
