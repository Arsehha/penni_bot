const { Bot, InputFile } = require("grammy")
const message = require("./message")
const config = require('./config.js')
const {connectDb, db} = require("./dataBase");

const bot = new Bot(config.bot_token)

connectDb() //Авторизация бота в бд

//Приветствие пользователей, после ввода команды `start`
bot.command(`start`, async (ctx) => {
    console.log('Команда /start получена');
    const gifStart = `picture/moneta.gif`

    //Проверка пользователя на наличие в БД
    if(await db.checkUser(ctx.from.id) === false) {
        //Добавление пользователя в Firebase
        console.log("Пользователь не существует");

            db.setUser(ctx.from.id, ctx.from.username, 0, 0, 0, 0)
                .then(() => {})
    }

    ctx.replyWithAnimation( new InputFile(gifStart), {caption: message.start, parse_mode: "MarkdownV2" })
        .catch(() =>{
            console.log("Ощибка при отправке GIF")
        })
})

//подсчёт сообщений пользователей
bot.on("message", async (ctx) => {
    await db.updateCountUserMessages(ctx.from.id)
    console.log("СООБ ЗАП")
})



bot.start()
.catch(() =>{
    console.log("Не запустился бот")
})