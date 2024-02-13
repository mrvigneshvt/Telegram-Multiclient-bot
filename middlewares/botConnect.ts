import { Telegraf } from 'telegraf'
import {ClientData} from '../dataBase/UserBase.js'

const quickConnect = async (token:string, ctx:any, chatID:number, botid:any) => {

    try {
        await ctx.reply('trying to connect...')

        const bot = new Telegraf(token)

        bot.launch().then(() => { return ctx.reply('Connected to your BOT!') })
            .catch(() => ctx.reply('error'))

        const sendMSG = await bot.telegram.sendMessage(chatID, 'Connected to MachiX Father..')

        if (!sendMSG) {
            setTimeout(() => { bot.stop() }, 3000)
            return await ctx.reply('Start Your BOT..!')
        } else {
            setTimeout(() => { bot.stop() }, 3000)
            const update = await ClientData.findOneAndUpdate({ Admin: chatID },
                {
                    $set: {
                        BotId: botid,
                        Token: token,
                    }
                }, { new: true },)
            return ctx.reply('Updated in DB..')
        }
    } catch (error:any) {
        ctx.reply(error.message)
        console.log(error.description)
        if (error.code == 400 || error.description == 'Bad Request: chat not found') {
            ctx.reply('Start Your Bot and Send Token again..')
        } else if (error.code == 401 || error.description == 'Unauthorized') {
            ctx.reply('Send a Valid token. Unauthorized!')
        }

    }


}

export default quickConnect