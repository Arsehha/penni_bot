const { Bot, InputFile } = require("grammy")
const message = require("./message")
const config = require('./config.js')

const bot = new Bot(config.bot_token)


//Приветствие новых пользователей
bot.command(`start`, (ctx) => {
    console.log('Команда /start получена');
    const gifStart = `picture/moneta.gif`

    ctx.replyWithAnimation( new InputFile(gifStart), {caption: message.start, parse_mode: "MarkdownV2" })
})

bot.start()