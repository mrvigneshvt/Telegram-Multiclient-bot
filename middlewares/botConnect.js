var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Telegraf } from 'telegraf';
import { ClientData } from '../dataBase/UserBase.js';
const quickConnect = (token, ctx, chatID, botid) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield ctx.reply('trying to connect...');
        const bot = new Telegraf(token);
        bot.launch().then(() => { return ctx.reply('Connected to your BOT!'); })
            .catch(() => ctx.reply('error'));
        const sendMSG = yield bot.telegram.sendMessage(chatID, 'Connected to MachiX Father..');
        if (!sendMSG) {
            setTimeout(() => { bot.stop(); }, 3000);
            return yield ctx.reply('Start Your BOT..!');
        }
        else {
            setTimeout(() => { bot.stop(); }, 3000);
            const update = yield ClientData.findOneAndUpdate({ Admin: chatID }, {
                $set: {
                    BotId: botid,
                    Token: token,
                }
            }, { new: true });
            return ctx.reply('Updated in DB..');
        }
    }
    catch (error) {
        ctx.reply(error.message);
        console.log(error.description);
        if (error.code == 400 || error.description == 'Bad Request: chat not found') {
            ctx.reply('Start Your Bot and Send Token again..');
        }
        else if (error.code == 401 || error.description == 'Unauthorized') {
            ctx.reply('Send a Valid token. Unauthorized!');
        }
    }
});
export default quickConnect;
