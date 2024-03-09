import { Client, Composer, Context } from "@mtkruto/node"
import mongoose from "mongoose";
import chalk from "chalk";
import { StorageLocalStorage } from "@mtkruto/storage-local-storage"
import storeData from "./middlewares/localStore.js";
import { schemaFile, userSchema } from "./dataBase/fileModel.js";
import { userChildInfo } from "./interface/interface.js";
import InlineKeyboard from "./middlewares/inlineKeyboard.js";
import { ClientData, userData } from "./dataBase/UserBase.js";
import { saveFile, fileSave } from "./middlewares/saveFile.js";
import logger from "./middlewares/logger.js";
import deleteAllCollections from "./middlewares/deleteAll.js";

let childBot = new Composer()
const Admin = [1345158291, 1767901454]
const apiID = 29033643
const apiHash = "a8cc5f16eddd5e0083b2534ecd31123c"


let dataArray: any = []


async function multi() {
  try {
    dataArray = await storeData();
    for (let i = 0; i < dataArray.length; i++) {
      await childGenerator(i, dataArray, childBot);
      console.log(chalk.magentaBright('Initialized 100%..'));
      console.log(dataArray);
    }
  } catch (err) {
    console.log(chalk.red('Error in multi function:', err));
    logger('Multi child', err)
  }
}

async function dataReload() {
  dataArray = await storeData();
  dataArray.forEach((element: any) => {
    const connection = mongoose.createConnection(element.client.MongoDB[0])
    let indexArr = [];

    for (let i = 0; i < 4; i++) {
      const btnModel = connection.model(`${i} buttons`, schemaFile);
      indexArr.push(btnModel);
    }

    element.client.indexBtn = indexArr;

    element.client.users = connection.model('users', userSchema);

    console.log('data updated')
  });



}

async function connectChild(userId: number) {
  try {
    dataArray = await storeData();
    console.log('stored in storeData');
    const content = dataArray.find((item: any) => item.client.Admin == userId);
    let indexArr = [];
    const connection = mongoose.createConnection(content.client.MongoDB[0]);
    for (let i = 0; i < 4; i++) {
      const btnModel = connection.model(`${i} buttons`, schemaFile);
      indexArr.push(btnModel);
    }
    content.client.users = connection.model('users', userSchema);
    content.client.indexBtn = indexArr
    console.log('stored necessary database config')
    const client = new Client(new StorageLocalStorage(String(`Client${userId}`)), apiID, apiHash);
    await client.start(content.client.Token);
    client.use(childBot);
    console.log('client initialized sucess..')
  } catch (err) {
    console.log(chalk.red('Error in connectChild function:', err));
    logger('connect child', err)

  }
}

async function childGenerator(i: number, dataArray: any, childBot: Composer<Context>) {
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
    await client.start(dataArray[i].client.Token);
    console.log(chalk.cyanBright(`Connected to ${i} Child Clients`));
    client.use(childBot);

    console.log(dataArray);
  } catch (err) {
    logger('Multi child', err)
    console.log(chalk.red('Error in childGenerator function:', err));
  }
}

const checkSudo = (user: any, chatid: any) => {
  if (user == chatid || Admin.includes(chatid)) {
    console.log(chatid, user)
    return true
  }
  return false
}

childBot.command('start', async (ctx: any) => {
  try {
    const userName = ctx.message.chat.firstName;
    const chatid = ctx.message.chat.id;
    const botID = ctx.me.id;
    const text = ctx.message.text.split(" ");
    console.log('finding dataArr');
    console.log(dataArray);
    const foundClient = dataArray.find((item: any) => item.client.BotId == botID);
    const userDatas = foundClient.client.users
    const isExist = await userDatas.findOne({ chatId: chatid })
    if (!isExist) {
      console.log('new user')
      const date = new Date();
      const localTime = date.toLocaleString('en-Us', { timeZone: 'Asia/Kolkata' })

      const create = await userDatas.create({
        chatId: chatid,
        Joined: localTime, // Provide a value for 'Joined', such as the current date/time
      });


      console.log('created')
    }
    console.log(dataArray)
    if (!foundClient.client.Thumbnail || foundClient.client.Buttons.length < 1) {
      await ctx.reply('this bot hasnt been started\n\n- By the Admin')
    } else {
      return ctx.replyPhoto(foundClient.client.Thumbnail, {
        caption: `Hi ${userName}👋`,
        replyMarkup: {
          inlineKeyboard: await InlineKeyboard(foundClient.client.Buttons)
        }
      })
    }


  } catch (error) {
    console.log(chalk.red('Error in start command handler:', error));
  }
});




childBot.on('message:document', async (ctx) => {
  try {
    console.log(ctx)
    const chatid = ctx.message.chat.id;

    await ctx.replyDocument(ctx.message.document.fileId)
  } catch (error) {
    console.log(error)
  }

})

childBot.command('info', async (ctx: any) => {

  const userName: string = ctx.message.chat.firstName;
  const chatid = ctx.message.chat.id;
  const botID = ctx.me.id;


  //await ctx.client.sendDocument(chatid, 'BQACAgQAAx0CfNMtFQADfGXkvSywWGRiesHpT31tlsyC0pTBAAI8CAACTCqJCgABfa2k8hzpqR4AAwQAAx4E')
  const found = dataArray.find((item: any) => item.client.BotId == botID)

  const getUserModel = await found.client.users.findOne({ chatId: chatid })

  if (getUserModel) {
    const user: userChildInfo = {
      firstName: userName,
      chatId: chatid,
      Joined: getUserModel.Joined
    }
    console.log(user)
    await ctx.reply(`NAME: ${user.firstName}\n\nTGID: ${user.chatId}\n\nJoined: ${user.Joined}`)
  } else {
    ctx.reply('click /start and try again...')
  }
})

childBot.command('thumb', async (ctx: any) => {
  try {
    const text = ctx.message.text
    const chatid = ctx.message.chat.id;
    const botID = ctx.me.id
    if (ctx.message && ctx.message.replyToMessage && ctx.message.replyToMessage.photo && ctx.message.replyToMessage.photo.fileId) {
      const find = await ClientData.findOne({ BotId: botID })
      if (!find || !checkSudo(find.Admin, chatid)) {
        return
      }

      if (await ctx.replyPhoto(ctx.message.replyToMessage.photo.fileId)) {

        const update = await ClientData.findOneAndUpdate({ BotId: botID }, {
          $set: {
            thumbnail: ctx.message.replyToMessage.photo.fileId,
          }
        }, { new: true })

        if (update) {
          const founded = dataArray.find((item: any) => item.client.BotId == botID)
          founded.client.Thumbnail = ctx.message.replyToMessage.photo.fileId
          await ctx.replyPhoto(founded.client.Thumbnail)
          return ctx.reply('Done use /showThumb. to check')
        } else {
          await ctx.reply('Click /Start and Try Again!')
          return ctx.reply('error contact Admin')
        }
      }
    } else {
      return ctx.reply('invalid reply /thumb to an image')
    }
  } catch (err) {
    console.log(err)
  }
})

childBot.command('showThumb', async (ctx: any) => {
  try {
    const text = ctx.message.text
    const chatid = ctx.message.chat.id;
    const botID = ctx.me.id

    const find = dataArray.find((item: any) => item.client.BotId == botID)

    console.log(dataArray)

    return ctx.replyPhoto(find.client.Thumbnail)
    /*
    if (ctx.message && ctx.message.replyToMessage && ctx.message.replyToMessage.photo && ctx.message.replyToMessage.photo.fileId) {
        const find = await ClientData.findOne({BotId:botID})
        if(!find || !checkSudo(find.Admin,chatid)){
            return
        }
        const found = dataArray.find((item:any)=>item.client.botId == botID)
        await ctx.replyPhoto(found.client.thumbnail)
    }*/
  } catch (err) {
    console.log(err)
  }
})

childBot.command('index', async (ctx: any) => {

  try {
    const text = ctx.message.text
    const ChannelId = ctx.message.replyToMessage && ctx.message.replyToMessage.forwardFromChat
      ? ctx.message.replyToMessage.forwardFromChat.id
      : null;


    if (ChannelId && ctx.msg.replyToMessage.forwardFromChat.title) {

      const chatid = ctx.message.chat.id
      const botID = ctx.me.id
      const NumberBtn = Number(text.replace('/index ', ''))

      const foundObject = dataArray.find((item: any) => item.client.BotId == botID);

      let resultAfterClient = null;


      try {
        await ctx.client.sendMessage(ChannelId, "Index Started")
      } catch (err) {
        return ctx.reply('Set Bot as ADMIN in the channel')
      }


      if (!checkSudo(foundObject.client.Admin, chatid)) {

        return

      } else if (text == '/index') {

        return ctx.reply('use index with a button Number \n\n EX: /index 0 or /index 1')

      } else if (NumberBtn > foundObject.client.Buttons.length - 1) {

        return ctx.reply('Send a Valid Button Number!')

      } else {

        const k = await ctx.reply(`Indexing....\n\nFrom: ${ctx.msg.replyToMessage.forwardFromChat.title}`)
        const msgIdToModify = k.id
        const msgId = ctx.message.replyToMessage.forwardId ? ctx.message.replyToMessage.forwardId : null

        const indexBtn = foundObject.client.indexBtn[NumberBtn]
        let FileArr: any = []
        let Total = { value: 0 }
        let done = { value: 1 }
        let skipped = { value: 0 }

        await iterMessage(Total, FileArr, done, ctx, ChannelId, msgId, chatid, msgIdToModify, indexBtn, skipped)
      }
    } else {
      return ctx.reply('Forward a File from the Channel with forward Tag\n\nAnd make the bot as admin to that Channel..')
    }

  } catch (err) {
    //await logger("File Indexing", err)
    console.log(err)
  }
})

childBot.command('unLink', async (ctx: any) => {
  const text = ctx.message.text
  const chatid = ctx.message.chat.id;
  const botID = ctx.me.id

  const data = dataArray.find((item: any) => item.client.Admin == chatid)

  const update = await ClientData.findOneAndUpdate({ BotId: botID }, {
    $set: {
      Channels: [0, 0, 0, 0]
    }
  }, { new: true })

  console.log(update)

  await dataReload()

  await ctx.reply('Done.. Unlinked from All Channels')

})

childBot.on('inlineQuery', async (ctx: any) => {
  try {
    console.log(ctx)
    const botName = ctx.me.username
    const botID = ctx.me.id;
    //const inlineID = ctx.inlineQuery.id;
    const found = dataArray.find((item: any) => item.client.BotId == botID);

    const offset = parseInt(ctx.inlineQuery.offset) || 0; // Parse offset to integer

    let query = ctx.inlineQuery.query;
    let number = parseInt(query[0]); // Parse number to integer
    let filename = query.slice(1).trim(); // Remove number from the query and trim whitespace .find().sort({_id: -1}).limit(10);

    if (number <= found.client.Buttons.length - 1) {
      let searchFile = await found.client.indexBtn[number].find({ fileName: { $regex: filename, $options: 'i' } }).sort({ _id: -1 }).skip(offset).limit(10); // Use offset to paginate results

      console.log(searchFile)
      if (searchFile.length > 0) {


        const results = searchFile.map((file: any, index: any) => ({
          id: crypto.randomUUID(),
          type: "document",
          documentFileId: file.fileId,
          title: file.fileName,
          description: `size : ${Math.floor(file.fileSize / (1024 * 1024))} MB`,
        }));

        /* const resultContent = searchFile.map((file: any) => {
           type: 'article',
             id: '1',
               title: 'Your Name Here', // Change this to the name you want to display
                 input_message_content: {
             message_text: 'Message content here'
           },
           reply_markup: Markup.inlineKeyboard([
             Markup.urlButton('getFile', getFileLink)
           ]).extra()
         })
 */



        await ctx.answerInlineQuery(results, {
          cacheTime: 0, button: {
            text: " 📂 Results: Swipe Up ⬆️", startParameter: "start"
          }, nextOffset: (offset + 10).toString()
        }); // Update nextOffset to paginate
      } else {
        await ctx.answerInlineQuery([{
          type: "article",
          id: crypto.randomUUID(),
          title: "No File Found",
          description: '\nNo Data',
          inputMessageContent: {
            messageText: "No results found in database.\n\nCheck the spelling of the file.\n\nOr the file hasn't been uploaded to the database."
          }
        }], { cacheTime: 0 });
      }
    } else {
      await ctx.answerInlineQuery([{
        type: "article",
        id: crypto.randomUUID(),
        title: "Button not Valid",
        description: '\nEnter Correct Button Number',
        inputMessageContent: {
          messageText: "Button not valid!!\n\n=> Click Start.\n\n=> Choose the Required Button"
        }
      }], { cacheTime: 0 });
    }
  } catch (err) {
    console.error(err);
    logger('inLine', err);
    console.log('error in Inline');
  }
});


childBot.command('admin', async (ctx: any) => {

  const text = ctx.message.text
  const botID = ctx.me.id
  const chatid = ctx.message.chat.id;
  const find = await ClientData.findOne({ BotId: botID })

  if (!find || !checkSudo(find.Admin, chatid)) {
    return
  }

  const datas = dataArray.find((item: any) => item.client.BotId == botID)

  const count = await datas.client.users.countDocuments({});

  await ctx.reply(`Total Users: ${count}`)

})

async function iterMessage(total: any, FileArr: any, done: any, ctx: any, idChannel: any, startFrom: any, chatid: any, modifyID: any, indexBtn: any, skip: any) {
  //console.log("1")
  try {
    const bot = ctx.client
    let finishTo = startFrom - 100;
    const channelName = ctx.msg.replyToMessage.forwardFromChat.title

    if (total.value > 40) {
      total.value = 0
    }

    if (total.value / 40 == 1) {
      await bot.editMessageText(chatid, modifyID, `Indexing..\n\nFrom: ${channelName}\n\nSaved: ${done.value - 1}\n\nSkipped: ${skip.value}`)
    }

    if (finishTo <= 0) {
      //console.log('reached last')
      finishTo = 0
    }

    for (let i = startFrom; i >= finishTo; i--) {
      FileArr.push(i)
    }

    if (FileArr.length > 1) {
      //console.log(FileArr)
      const datas = await bot.getMessages(idChannel, FileArr)

      for await (const data of datas) {
        if (data.document && data.document.fileId) {
          //console.log(data.document.fileName, indexBtn)
          const saveDB = await saveFile(data.document, data.caption, indexBtn, done, skip)
        }
        else {
          console.log('Invalid File.. from getMessages')
        }
      }
    }

    if (finishTo > 0) {
      FileArr = [];
      console.log('calling again')
      total.value += 20
      setTimeout(async () => {
        await iterMessage(total, FileArr, done, ctx, idChannel, finishTo - 1, chatid, modifyID, indexBtn, skip)
      }, 59000)
    } else {
      FileArr = []
      await bot.editMessageText(chatid, modifyID, `Index Completed..\n\nTotal Files Saved: ${done.value - 1}\n\nDuplicate Skipped Files: ${skip.value}`)
    }


  } catch (err) {
    await logger("Iter Message", err);
  }
}

childBot.command('link', async (ctx: any) => {
  const text: string = ctx.message.text
  const chatid = ctx.message.chat.id
  const botID = ctx.me.id

  const find = dataArray.find((item: any) => item.client.BotId == botID)



  if (!find || !checkSudo(find.client.Admin, chatid)) {
    return
  }
  if (text == '/link') {
    console.log(dataArray)
    return ctx.reply('Please use this format \n\n/link NuMbErButton')
  }



  const ChannelId = ctx.message.replyToMessage && ctx.message.replyToMessage.forwardFromChat
    ? ctx.message.replyToMessage.forwardFromChat.id
    : null;

  const number: any = parseInt(text.match(/\d+/)[0])

  if (number > find.client.Buttons.length - 1) {
    return ctx.reply('number is invalid..')
  } else {
    try {

      const channelName = ctx.msg.replyToMessage.forwardFromChat.title
      console.log(ctx)

      console.log(channelName, ChannelId, number, text)
      await ctx.client.sendMessage(ChannelId, "Connected to Bot")
      console.log(ctx)
      let channel = await ClientData.findOneAndUpdate({ BotId: botID }, {
        $push: {
          Channels: {
            $each: [ChannelId],
            $position: Number(number)
          }
        }
      }, { new: true });
      await dataReload()
      return ctx.reply('Updated check /myInfo in fatherBot')

    } catch (err) {
      console.log(err)
      return ctx.reply('Set Bot as ADMIN in the channel')
    }

  }
})

childBot.command('sudokillme', async (ctx) => {
  await ctx.reply('shutting down....')
  await ctx.client.disconnect()
})

childBot.on('message:document', async (ctx: any) => {
  //console.log(ctx)
  try {
    const chatid = ctx.message.chat.id
    const botID = ctx.me.id
    if (ctx.message.chat.type == 'channel') {

      const find = dataArray.find((item: any) => item.client.BotId == botID)
      console.log('find is', find)
      const channels = find.client.Channels


      console.log('channelsis', channels)
      console.log('chatid', chatid, 'channelid', channels)
      const ifExist = channels.findIndex((channel: any) => chatid == channel);
      console.log(ifExist)
      if (ifExist >= 0) {
        console.log(find.client.indexBtn)
        await fileSave(ctx.msg.document, ctx.msg.caption, find.client.indexBtn[ifExist])
      } else {
        console.log('dont know')
      }

    }

  } catch (error) {
    console.log(error)
    logger('eror in savingFile', error)
  }

})
async function deleteNupdate(chatid: any) {

  const delteUser = dataArray.find((item: any) => item.client.admin == chatid)
  await deleteAllCollections(delteUser.client.MongoDB[0])

  dataArray = await storeData()

  console.log('updated dataArray due to delete')
  console.log(dataArray)
}

async function syncData() {
  dataArray = await storeData()
}

export { multi, childGenerator, dataArray, connectChild, deleteNupdate, syncData, dataReload };
