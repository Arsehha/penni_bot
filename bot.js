const { Bot, InputFile } = require("grammy")
const message = require("./message")
const config = require('./config.js')
const {connectDb, db} = require("./dataBase");

const bot = new Bot(config.bot_token)

connectDb()

//Приветствие пользователей, после ввода команды `start`
bot.command(`start`, (ctx) => {
    console.log('Команда /start получена');
    db.setUser(ctx.from.id, ctx.from.username, 0,0,0,0,1)
    const gifStart = `picture/moneta.gif`

    ctx.replyWithAnimation( new InputFile(gifStart), {caption: message.start, parse_mode: "MarkdownV2" })
})



bot.start()