import { Client, Composer } from "@mtkruto/node"
import { StorageLocalStorage } from "@mtkruto/storage-local-storage"
import chalk from "chalk"

import { ClientData } from "./dataBase/UserBase.js"
import connectDB from "./dataBase/mongoDB.js"
import logger from "./middlewares/logger.js"
import quickConnect from "./middlewares/botConnect.js"
import storeData from "./middlewares/localStore.js"
import { multi, childGenerator, dataArray, connectChild, deleteNupdate, syncData, dataReload } from './multiClient.js'
import codeRed from "./codeRed.js"
/*
const connectDB = require("./dataBase/mongoDB.js")
const { ClientData } = require("./dataBase/UserBase.js")
const validateMongo = require('./middlewares/validMongo.js')
const multi = require("./multiClient.js")
const { starter } = require("./middlewares/starter")
const storeData = require("./middlewares/localStore")
const logger = require('./middlewares/logger')
*/
const mongoURI = ''
const apiID: number = ''
const apiHash: string = ""
const fatherToken = ""

let fatherBot = new Client(new StorageLocalStorage('father'), apiID, apiHash)

father()

async function father() {
    try {
        console.log(chalk.yellow('Connecting to DataBase..'))
        await connectDB(mongoURI)
        console.log(chalk.green('Connected to DB Success..'))
        console.log(chalk.yellow('Connecting to FatherBot...'))
        await fatherBot.start(fatherToken);
        const fatherInfo = await fatherBot.getMe()
        console.log(fatherInfo)
        console.log(chalk.green('Connected to Father...'))
        console.log(chalk.yellow('Connecting to Childs....'))
        await multi()
    }
    catch (err) {
        await father()
        console.log(err)
        await logger('Start father', err)

    }
}

fatherBot.command('start', async (ctx: any) => {
    try {
        const chatid = ctx.message.chat.id;

        await ctx.reply(`Welcome ${ctx.message.chat.firstName}\n\nThis a MultiClient bot of @MrMachiXbot.\n\nJust Add ur token with mongoDb\n\nTo Start your Own bot\n\nPlug n Play ⚡`)

        console.log(dataArray)
        const isExist = await ClientData.findOne({ Admin: chatid })

        if (!isExist) {
            await ClientData.create({ Admin: chatid })
        }

    } catch (err) {
        await logger("Start CMD - Father", err)
        console.log(err)
    }
})

fatherBot.command('deletemyid', async (ctx: any) => {
    try {
        const chatid = ctx.message.chat.id;
        const checkExist = await ClientData.findOneAndDelete({ Admin: chatid })

        if (checkExist) {
            console.log(checkExist)
            await codeRed(checkExist.MongoDB[0])
            await deleteNupdate(chatid)

            return ctx.reply('deleted successfully')
        } else {
            return ctx.reply('no datas of u')
        }

    } catch (err) {
        await logger("DeleteMyId CMD", err)
        console.log(err)
    }
})

fatherBot.command('token', async (ctx) => {
    try {
        const text = ctx.message.text

        if (text === '/token') {
            return ctx.reply('send in this format /token bOtid')
        }

        const chatid = ctx.message.chat.id;
        console.log(chatid, '-chatdid')
        console.log(ctx.message.chat.id)
        const token = text.replace('/token ', '')
        const isAlreadyExist = await ClientData.findOne({ Token: token })

        if (isAlreadyExist) {
            return ctx.reply('someone is already using this token!')
        }

        const botid: any = (token.substring(0, 10))
        console.log(botid)
        const checkExist = await ClientData.findOne({ Admin: chatid })


        if (checkExist) {
            if (checkExist.isVerified) {
                return ctx.reply('Sorry U Cant Change Contact Admin..')
            } else {
                const botAuth = await quickConnect(token, ctx, chatid, botid)
            }
        } else {
            return ctx.reply('click /start and try again')
        }
    } catch (err) {
        await logger("Set Client Token", err)
        console.log(err)
    }
})


fatherBot.command('myInfo', async (ctx: any) => {
    try {
        const chatid = ctx.message.chat.id;
        const details = ctx.message.chat;
        console.log(chatid);
        const checkData = await ClientData.findOne({ Admin: chatid });
        if (checkData) {
            console.log(checkData.Channels)
            if (details.firstName) {
                // Format the Channels array
                const channelsFormatted = checkData.Channels.map((channel, index) => {
                    return `${index}) ${channel}`;
                }).join('\n');

                let userDatas = `Name: ${ctx.message.chat.firstName}\n\nBotID: ${checkData.BotId}\n\nButtons: ${checkData.Buttons}\n\nMongoDB: ${checkData.MongoDB}\n\nChannels:\n${channelsFormatted}\n\nVerified: ${checkData.isVerified}`;
                return ctx.reply(userDatas);
            } else {
                return ctx.reply('Setup a first name');
            }
        } else {
            return ctx.reply('Click /start and then check');
        }
    } catch (err) {
        await logger("Show Client Info", err);
        console.log(err);
    }
});


fatherBot.command('buttons', async (ctx: any) => {
    try {
        const text = ctx.message.text
        const chatid = ctx.message.chat.id;
        const findToken = await ClientData.findOne({ Admin: chatid })

        if (findToken && findToken.Token.length > 10) {

            let sendButtons = 'Button List\n\n';

            if (text == "/buttons") {
                return ctx.reply('Send in this format\n\nEx: /buttons Name1 - Name2 - Name3\n\nMaximum 4 Buttons allowed for now')
            } else {
                const buttons = text.replace('/buttons ', '')
                const splitButtons = buttons.split('-')

                if (splitButtons.length > 4) {
                    return ctx.reply('only 4 buttons allowed')
                } else {
                    for (let i = 0; i < splitButtons.length; i++) {
                        sendButtons += `${i + 1}) ${splitButtons[i]}\n\n`
                    }

                    const data = await ClientData.findOneAndUpdate({ Admin: chatid }, {
                        $set: {
                            Buttons: splitButtons
                        }
                    }, { new: true })

                    if (data) {
                        console.log(dataArray)
                        await dataReload()
                        console.log(dataArray)
                        await ctx.reply(sendButtons, 'updated')
                        if (dataArray.find((item: any) => item.client.Admin == chatid)) {
                            const datas = dataArray.find((item: any) => item.client.Admin == chatid)
                            console.log('dataaas', datas)
                            datas.client.Buttons = splitButtons
                        }

                    } else {
                        ctx.reply('try /start and do again')
                    }
                }
            }
        } else {
            return ctx.reply('First Fill the Token!')
        }

    } catch (err: any) {
        await logger("Set Client Buttons", err)
        console.log(err)
        return ctx.reply(err.message)
    }
})

fatherBot.command('mongoose', async (ctx: any) => {
    try {
        const text = ctx.message.text
        const chatid = ctx.message.chat.id;
        let token = text.replace('/mongoose', '')
        token = token.replace(' ', '')

        console.log(token)
        if (token.length > 3) {

            const find = await ClientData.findOne({ Admin: chatid })

            if (find && find.Token.length > 10 && find.Buttons.length >= 1) {
                let userDatas = `Name: ${ctx.message.chat.firstName}\n\nID: ${chatid}\n\nBotID: ${find.BotId}\n\nButtons: ${find.Buttons}\n\nMongoDB: ${token}`

                await ctx.client.sendMessage(-1001678508201, userDatas, {
                    replyMarkup: {
                        inlineKeyboard: [[{ text: "APPROVE", callbackData: "approve" }, { text: "CANCEL", callbackData: "cancel" }]]
                    }
                })
                return ctx.reply('Your Request sended to Admin, You can use the Bot after Approved by the Admin\n\nYou will Notify Soon')
            } else {
                return ctx.reply('No Data About You, Click /start and Set Tokens and Buttons')
            }
        } else {
            return ctx.reply('Format Wrong : Use like => (/mongodb YourUri)')
        }
    } catch (err) {
        await logger("Set Client Mongodb Uri", err)
        console.log(err)
    }
})

fatherBot.on('callbackQuery', async (ctx: any) => {
    const data = ctx.callbackQuery.data;
    const msg = ctx.callbackQuery.message.text;
    let userId = msg.split("\n")[2].split(" ")[1]
    const uri = msg.split("\n")[8].split(" ")[1]

    if (data.startsWith("approve")) {
        try {

            console.log(userId)
            console.log(data, uri, userId)

            const verify = await ClientData.findOneAndUpdate({ Admin: parseInt(userId) }, {
                $set: {
                    MongoDB: uri,
                    isVerified: true,
                }
            }, { new: true })

            if (verify) {
                console.log('verify' + verify)
                console.log('done.. creatiing in db..')
                await connectChild(Number(userId))
                await ctx.client.sendMessage(verify.Admin, 'Verified use your bot..')
            } else {
                await ctx.reply("ClientData not Found")
            }

        } catch (err) {
            console.log(err)
            await logger("Approve CallBack", err)
            await ClientData.findOneAndUpdate({ Admin: userId }, {
                $set: {
                    isVerified: false,
                }
            }, { new: true })
        }

    }
})



