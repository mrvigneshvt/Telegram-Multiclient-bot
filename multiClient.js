var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
import { Client, Composer } from "@mtkruto/node";
import mongoose from "mongoose";
import chalk from "chalk";
import { StorageLocalStorage } from "@mtkruto/storage-local-storage";
import storeData from "./middlewares/localStore.js";
import { schemaFile, userSchema } from "./dataBase/fileModel.js";
import InlineKeyboard from "./middlewares/inlineKeyboard.js";
import { ClientData } from "./dataBase/UserBase.js";
import { saveFile, fileSave } from "./middlewares/saveFile.js";
import logger from "./middlewares/logger.js";
import codeRed from "./codeRed.js";
let childBot = new Composer();
const Admin = [1345158291, 1767901454];
const apiID = 29033643;
const apiHash = "a8cc5f16eddd5e0083b2534ecd31123c";
let dataArray = [];
function multi() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            dataArray = yield storeData();
            for (let i = 0; i < dataArray.length; i++) {
                yield childGenerator(i, dataArray, childBot);
                console.log(chalk.magentaBright('Initialized 100%..'));
                console.log(dataArray);
            }
        }
        catch (err) {
            console.log(chalk.red('Error in multi function:', err));
            logger('Multi child', err);
        }
    });
}
function dataReload() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            dataArray = yield storeData();
            dataArray.forEach((element) => {
                const connection = mongoose.createConnection(element.client.MongoDB[0]);
                let indexArr = [];
                for (let i = 0; i < 4; i++) {
                    const btnModel = connection.model(`${i} buttons`, schemaFile);
                    indexArr.push(btnModel);
                }
                element.client.indexBtn = indexArr;
                element.client.users = connection.model('users', userSchema);
                console.log('data updated');
            });
        }
        catch (error) {
            console.log(error);
            yield logger('data reloader', error);
        }
    });
}
function connectChild(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield dataReload();
            console.log('stored in storeData');
            const content = dataArray.find((item) => item.client.Admin == userId);
            yield codeRed(content.client.MongoDB[0]); // deletes Existing Collection..
            let indexArr = [];
            const connection = mongoose.createConnection(content.client.MongoDB[0]);
            for (let i = 0; i < 4; i++) {
                const btnModel = connection.model(`${i} buttons`, schemaFile);
                indexArr.push(btnModel);
            }
            content.client.users = connection.model('users', userSchema);
            content.client.indexBtn = indexArr;
            console.log('stored necessary database config');
            const client = new Client(new StorageLocalStorage(String(`Client${userId}`)), apiID, apiHash);
            yield client.start(content.client.Token);
            client.use(childBot);
            console.log('client initialized sucess..');
        }
        catch (err) {
            console.log(chalk.red('Error in connectChild function:', err));
            logger('connect child', err);
        }
    });
}
function childGenerator(i, dataArray, childBot) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log(chalk.yellowBright(`Trying to Connect ${i} child`));
            const connection = mongoose.createConnection(dataArray[i].client.MongoDB[0]);
            let indexArr = [];
            for (let j = 0; j < 4; j++) {
                const btnModel = connection.model(`${j} buttons`, schemaFile);
                indexArr.push(btnModel);
            }
            dataArray[i].client.indexBtn = indexArr;
            const userModel = connection.model('users', userSchema);
            dataArray[i].client.users = userModel;
            const client = new Client(new StorageLocalStorage(String(`Client${i}`)), apiID, apiHash);
            yield client.start(dataArray[i].client.Token);
            console.log(chalk.cyanBright(`Connected to ${i} Child Clients`));
            client.use(childBot);
            console.log(dataArray);
        }
        catch (err) {
            logger('Multi child', err);
            console.log(chalk.red('Error in childGenerator function:', err));
        }
    });
}
const checkSudo = (user, chatid) => {
    if (user == chatid || Admin.includes(chatid)) {
        console.log(chatid, user);
        return true;
    }
    return false;
};
childBot.command('start', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(ctx);
        const userName = ctx.message.chat.firstName;
        const chatid = ctx.message.chat.id;
        const botID = ctx.me.id;
        const text = ctx.message.text.split(" ");
        console.log('finding dataArr');
        console.log(dataArray);
        const foundClient = dataArray.find((item) => item.client.BotId == botID);
        console.log(foundClient);
        const userDatas = foundClient.client.users;
        console.log(userDatas);
        console.log(foundClient.client);
        const isExist = yield userDatas.findOne({ chatId: chatid });
        if (!isExist) {
            console.log('new user');
            const date = new Date();
            const localTime = date.toLocaleString('en-Us', { timeZone: 'Asia/Kolkata' });
            const create = yield userDatas.create({
                chatId: chatid,
                Joined: localTime, // Provide a value for 'Joined', such as the current date/time
            });
            console.log('created');
        }
        console.log(dataArray);
        if (!foundClient.client.Thumbnail || foundClient.client.Buttons.length < 1) {
            yield ctx.reply('this bot hasnt been started\n\n- By the Admin');
        }
        else {
            return ctx.replyPhoto(foundClient.client.Thumbnail, {
                caption: `Hi ${userName}👋`,
                replyMarkup: {
                    inlineKeyboard: yield InlineKeyboard(foundClient.client.Buttons)
                }
            });
        }
    }
    catch (error) {
        yield logger('In Child Start..', error);
        console.log(chalk.red('Error in start command handler:', error));
    }
}));
childBot.command('info', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userName = ctx.message.chat.firstName;
        const chatid = ctx.message.chat.id;
        const botID = ctx.me.id;
        //await ctx.client.sendDocument(chatid, 'BQACAgQAAx0CfNMtFQADfGXkvSywWGRiesHpT31tlsyC0pTBAAI8CAACTCqJCgABfa2k8hzpqR4AAwQAAx4E')
        const found = dataArray.find((item) => item.client.BotId == botID);
        const getUserModel = yield found.client.users.findOne({ chatId: chatid });
        if (getUserModel) {
            const user = {
                firstName: userName,
                chatId: chatid,
                Joined: getUserModel.Joined
            };
            console.log(user);
            yield ctx.reply(`NAME: ${user.firstName}\n\nTGID: ${user.chatId}\n\nJoined: ${user.Joined}`);
        }
        else {
            ctx.reply('click /start and try again...');
        }
    }
    catch (error) {
        yield logger('in child Info', error);
        console.log(error);
    }
}));
childBot.command('thumb', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const text = ctx.message.text;
        const chatid = ctx.message.chat.id;
        const botID = ctx.me.id;
        if (ctx.message && ctx.message.replyToMessage && ctx.message.replyToMessage.photo && ctx.message.replyToMessage.photo.fileId) {
            const find = yield ClientData.findOne({ BotId: botID });
            if (!find || !checkSudo(find.Admin, chatid)) {
                return;
            }
            if (yield ctx.replyPhoto(ctx.message.replyToMessage.photo.fileId)) {
                const update = yield ClientData.findOneAndUpdate({ BotId: botID }, {
                    $set: {
                        thumbnail: ctx.message.replyToMessage.photo.fileId,
                    }
                }, { new: true });
                if (update) {
                    const founded = dataArray.find((item) => item.client.BotId == botID);
                    founded.client.Thumbnail = ctx.message.replyToMessage.photo.fileId;
                    yield ctx.replyPhoto(founded.client.Thumbnail);
                    return ctx.reply('Done use /showThumb. to check');
                }
                else {
                    yield ctx.reply('Click /Start and Try Again!');
                    return ctx.reply('error contact Admin');
                }
            }
        }
        else {
            return ctx.reply('invalid reply /thumb to an image');
        }
    }
    catch (err) {
        yield logger('Child Thumb', err);
        console.log(err);
    }
}));
childBot.command('showThumb', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const text = ctx.message.text;
        const chatid = ctx.message.chat.id;
        const botID = ctx.me.id;
        const find = dataArray.find((item) => item.client.BotId == botID);
        console.log(dataArray);
        return ctx.replyPhoto(find.client.Thumbnail);
        /*
        if (ctx.message && ctx.message.replyToMessage && ctx.message.replyToMessage.photo && ctx.message.replyToMessage.photo.fileId) {
            const find = await ClientData.findOne({BotId:botID})
            if(!find || !checkSudo(find.Admin,chatid)){
                return
            }
            const found = dataArray.find((item:any)=>item.client.botId == botID)
            await ctx.replyPhoto(found.client.thumbnail)
        }*/
    }
    catch (err) {
        yield logger('child thumb', err);
        console.log(err);
    }
}));
childBot.command('index', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const text = ctx.message.text;
        const ChannelId = ctx.message.replyToMessage && ctx.message.replyToMessage.forwardFromChat
            ? ctx.message.replyToMessage.forwardFromChat.id
            : null;
        if (ChannelId && ctx.msg.replyToMessage.forwardFromChat.title) {
            const chatid = ctx.message.chat.id;
            const botID = ctx.me.id;
            const NumberBtn = Number(text.replace('/index ', ''));
            const foundObject = dataArray.find((item) => item.client.BotId == botID);
            let resultAfterClient = null;
            try {
                yield ctx.client.sendMessage(ChannelId, "Index Started");
            }
            catch (err) {
                return ctx.reply('Set Bot as ADMIN in the channel');
            }
            if (!checkSudo(foundObject.client.Admin, chatid)) {
                return;
            }
            else if (text == '/index') {
                return ctx.reply('use index with a button Number \n\n EX: /index 0 or /index 1');
            }
            else if (NumberBtn > foundObject.client.Buttons.length - 1) {
                return ctx.reply('Send a Valid Button Number!');
            }
            else {
                const k = yield ctx.reply(`Indexing....\n\nFrom: ${ctx.msg.replyToMessage.forwardFromChat.title}`);
                const msgIdToModify = k.id;
                const msgId = ctx.message.replyToMessage.forwardId ? ctx.message.replyToMessage.forwardId : null;
                const indexBtn = foundObject.client.indexBtn[NumberBtn];
                let FileArr = [];
                let Total = { value: 0 };
                let done = { value: 1 };
                let skipped = { value: 0 };
                yield iterMessage(Total, FileArr, done, ctx, ChannelId, msgId, chatid, msgIdToModify, indexBtn, skipped);
            }
        }
        else {
            return ctx.reply('Forward a File from the Channel with forward Tag\n\nAnd make the bot as admin to that Channel..');
        }
    }
    catch (err) {
        yield logger("File Indexing", err);
        console.log(err);
    }
}));
childBot.command('unLink', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const text = ctx.message.text;
    const chatid = ctx.message.chat.id;
    const botID = ctx.me.id;
    const data = dataArray.find((item) => item.client.Admin == chatid);
    const update = yield ClientData.findOneAndUpdate({ BotId: botID }, {
        $set: {
            Channels: [0, 0, 0, 0]
        }
    }, { new: true });
    console.log(update);
    yield dataReload();
    yield ctx.reply('Done.. Unlinked from All Channels');
}));
childBot.on('inlineQuery', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    //console.log(ctx)
    //const botName = ctx.me.username
    const botID = ctx.me.id;
    const userID = ctx.from.id;
    //const inlineID = ctx.inlineQuery.id;
    const found = dataArray.find((item) => item.client.BotId == botID);
    try {
        const offset = parseInt(ctx.inlineQuery.offset) || 0; // Parse offset to integer
        let query = ctx.inlineQuery.query;
        let number = parseInt(query[0]); // Parse number to integer
        let filename = query.slice(1).trim(); // Remove number from the query and trim whitespace .find().sort({_id: -1}).limit(10);
        if (number <= found.client.Buttons.length - 1) {
            if (found.client.ForceSubActive && found.client.ChannelLink) {
                console.log('comes here');
                const datas = yield ctx.client.getChatMember(found.client.ForceSub, parseInt(userID));
                console.log(datas);
            }
            let searchFile = yield found.client.indexBtn[number].find({ fileName: { $regex: filename, $options: 'i' } }).sort({ _id: -1 }).skip(offset).limit(10); // Use offset to paginate results
            console.log(searchFile);
            if (searchFile.length > 0) {
                const results = searchFile.map((file, index) => ({
                    id: crypto.randomUUID(),
                    type: "document",
                    documentFileId: file.fileId,
                    title: file.fileName,
                    description: `Size : ${Math.floor(file.fileSize / (1024 * 1024))} MB\nType: ${file.mimeType}`,
                    caption: file.caption,
                    replyMarkup: {
                        inlineKeyboard: [[{ text: "Search Again", switchInlineQueryCurrentChat: query }]]
                    }
                }));
                yield ctx.answerInlineQuery(results, {
                    cacheTime: 0, button: {
                        text: " 📂 Results: Swipe Up ⬆️", startParameter: "start"
                    }, nextOffset: (offset + 10).toString()
                }); // Update nextOffset to paginate
            } /*else if (searchFile.length == 0 && datas.status) {
                await ctx.answerInlineQuery([{
                  type: "article",
                  id: crypto.randomUUID(),
                  title: "No File Found",
                  description: '\nNo Data',
                  inputMessageContent: {
                    messageText: "No results found in database.\n\nCheck the spelling of the file.\n\nOr the file hasn't been uploaded to the database."
                  }
                }], { cacheTime: 0 });
              }*/
        }
        else {
            yield ctx.answerInlineQuery([{
                    type: "article",
                    id: crypto.randomUUID(),
                    title: "Button not Valid",
                    description: '\nEnter Correct Button Number',
                    inputMessageContent: {
                        messageText: "Button not valid!!\n\n=> Click Start.\n\n=> Choose the Required Button"
                    }
                }], { cacheTime: 0 });
        }
    }
    catch (error) {
        if (error.error_message == 'USER_NOT_PARTICIPANT' || error.error_message == 'PARTICIPANT_ID_INVALID') {
            console.log('non particiapnt');
            yield ctx.answerInlineQuery([{
                    type: "article",
                    id: crypto.randomUUID(),
                    title: "Join My Channel to Use Me..:)",
                    description: 'Join My Updates Channel to get Updates From Me',
                    inputMessageContent: {
                        messageText: "Join My Channel to Use me free"
                    },
                    replyMarkup: {
                        inlineKeyboard: [[{ text: "Join ", url: found.client.ChannelLink }]]
                    }
                }], { cacheTime: 0 });
        } /*else if (error.error_message == 'CHANNEL_PRIVATE') {
          await ctx.answerInlineQuery([{
            type: "article",
            id: crypto.randomUUID(),
            title: "Add Bot as Admin to Force SUB..",
            description: 'Bot has No Acess',
            inputMessageContent: {
              messageText: "Bot has No Access to the CHANNEL for FORCE SUB.."
            },
            replyMarkup: {
              inlineKeyboard: [[{ text: "Join ", url: found.client.ChannelLink }]]
            }
          }], { cacheTime: 0 });
        }*/
        console.error(error);
        yield logger('inLine', error);
        console.log('error in Inline');
    }
}));
childBot.command('forcesub', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!ctx.message.replyToMessage) {
            return ctx.reply('Forward a Post from a Channel \n\nReply with /forcesub');
        }
        else if (ctx.message && ctx.message.replyToMessage && ctx.message.replyToMessage.forwardFromChat) {
            console.log(ctx.message.replyToMessage.forwardFromChat);
            const channelID = ctx.message.replyToMessage.forwardFromChat.id;
            const botID = ctx.me.id;
            const ChannelLink = yield ctx.client.createInviteLink(channelID);
            if (ChannelLink) {
                const datas = yield ClientData.findOneAndUpdate({ BotId: botID }, {
                    $set: {
                        forceSub: channelID,
                        forceSubActive: true,
                        channelLink: ChannelLink.inviteLink
                    }
                }, { new: true });
                if (datas) {
                    yield dataReload();
                    yield ctx.reply('Force Sub Added Succesfully..');
                }
                else {
                    yield ctx.reply('Contact Admin');
                }
            }
        }
        else {
            yield ctx.reply('add bot as admin with createInviteLink');
        }
    }
    catch (error) {
        console.log(error);
        yield logger('inForceSub', error);
        if (error.error_message == 'CHANNEL_PRIVATE') {
            yield ctx.reply('Add Bot as Admin\n\nwith All Rights enabled..');
        }
    }
}));
childBot.command('admin', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const text = ctx.message.text;
        const botID = ctx.me.id;
        const chatid = ctx.message.chat.id;
        const find = yield ClientData.findOne({ BotId: botID });
        if (!find || !checkSudo(find.Admin, chatid)) {
            return;
        }
        const datas = dataArray.find((item) => item.client.BotId == botID);
        const count = yield datas.client.users.countDocuments({});
        yield ctx.reply(`Total Users: ${count}`);
    }
    catch (error) {
        console.log(error);
        yield logger('childAdmin', error);
    }
}));
function iterMessage(total, FileArr, done, ctx, idChannel, startFrom, chatid, modifyID, indexBtn, skip) {
    var _a, e_1, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        //console.log("1")
        try {
            const bot = ctx.client;
            let finishTo = startFrom - 100;
            const channelName = ctx.msg.replyToMessage.forwardFromChat.title;
            if (total.value > 40) {
                total.value = 0;
            }
            if (total.value / 40 == 1) {
                yield bot.editMessageText(chatid, modifyID, `Indexing..\n\nFrom: ${channelName}\n\nSaved: ${done.value - 1}\n\nSkipped: ${skip.value}`);
            }
            if (finishTo <= 0) {
                //console.log('reached last')
                finishTo = 0;
            }
            for (let i = startFrom; i >= finishTo; i--) {
                FileArr.push(i);
            }
            if (FileArr.length > 1) {
                //console.log(FileArr)
                const datas = yield bot.getMessages(idChannel, FileArr);
                try {
                    for (var _d = true, datas_1 = __asyncValues(datas), datas_1_1; datas_1_1 = yield datas_1.next(), _a = datas_1_1.done, !_a; _d = true) {
                        _c = datas_1_1.value;
                        _d = false;
                        const data = _c;
                        if (data.document && data.document.fileId) {
                            //console.log(data.document.fileName, indexBtn)
                            const saveDB = yield saveFile(data.document, data.caption, indexBtn, done, skip);
                        }
                        else if (data.video && data.video.fileId) {
                            const saveDB = yield saveFile(data.video, data.caption, indexBtn, done, skip);
                        }
                        else {
                            console.log('Invalid File.. from getMessages');
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (!_d && !_a && (_b = datas_1.return)) yield _b.call(datas_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            }
            if (finishTo > 0) {
                FileArr = [];
                console.log('calling again');
                total.value += 20;
                setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                    yield iterMessage(total, FileArr, done, ctx, idChannel, finishTo - 1, chatid, modifyID, indexBtn, skip);
                }), 59000);
            }
            else {
                FileArr = [];
                yield bot.editMessageText(chatid, modifyID, `Index Completed..\n\nTotal Files Saved: ${done.value - 1}\n\nDuplicate Skipped Files: ${skip.value}`);
            }
        }
        catch (err) {
            yield logger("Iter Message", err);
        }
    });
}
childBot.command('link', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const text = ctx.message.text;
    const chatId = ctx.message.chat.id;
    const botID = ctx.me.id;
    const find = dataArray.find((item) => item.client.BotId == botID);
    if (!find || !checkSudo(find.client.Admin, chatId)) {
        return;
    }
    if (text === '/link') {
        console.log(dataArray);
        return ctx.reply('Please use this format: /link [NumberButton]');
    }
    const ChannelId = ctx.message.replyToMessage && ctx.message.replyToMessage.forwardFromChat
        ? ctx.message.replyToMessage.forwardFromChat.id
        : null;
    const numberMatch = text.match(/\d+/);
    if (!numberMatch) {
        return ctx.reply('Please provide a valid number.');
    }
    const number = parseInt(numberMatch[0]);
    if (number >= find.client.Buttons.length) {
        return ctx.reply('Number is invalid.');
    }
    try {
        const channelName = ctx.message.replyToMessage.forwardFromChat.title;
        yield ctx.client.sendMessage(ChannelId, "Connected to Bot");
        const updatedClientData = yield ClientData.findOne({ BotId: botID });
        if (!updatedClientData) {
            return ctx.reply('Bot data not found.');
        }
        yield updatedClientData.Channels.set(number, ChannelId);
        yield updatedClientData.save();
        yield dataReload();
        return ctx.reply('Updated, check /myInfo in fatherBot');
    }
    catch (err) {
        console.error(err);
        return ctx.reply('Failed to link. Make sure the bot is an ADMIN in the channel.');
    }
}));
childBot.command('sudokillme', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    yield ctx.reply('shutting down....');
    yield ctx.client.disconnect();
}));
childBot.on('message:document', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    //console.log(ctx)
    try {
        const chatid = ctx.message.chat.id;
        const botID = ctx.me.id;
        if (ctx.message.chat.type == 'channel') {
            const find = dataArray.find((item) => item.client.BotId == botID);
            console.log('find is', find);
            const channels = find.client.Channels;
            console.log('channelsis', channels);
            console.log('chatid', chatid, 'channelid', channels);
            const ifExist = channels.findIndex((channel) => chatid == channel);
            console.log(ifExist);
            if (ifExist >= 0) {
                console.log(find.client.indexBtn);
                yield fileSave(ctx.msg.document, ctx.msg.caption, find.client.indexBtn[ifExist]);
            }
            else {
                console.log('dont know');
            }
        }
    }
    catch (error) {
        console.log(error);
        logger('eror in savingFile', error);
    }
}));
function deleteNupdate(chatid) {
    return __awaiter(this, void 0, void 0, function* () {
        dataArray = yield storeData();
        console.log('updated dataArray due to delete');
        console.log(dataArray);
    });
}
function syncData() {
    return __awaiter(this, void 0, void 0, function* () {
        dataArray = yield storeData();
    });
}
export { multi, childGenerator, dataArray, connectChild, deleteNupdate, syncData, dataReload };
