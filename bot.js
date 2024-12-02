const { Bot, InputFile, session} = require("grammy")
const { run, } = require("@grammyjs/runner")
const {createConversation, conversations,  } = require("@grammyjs/conversations");
const {connectDb, db} = require("./database")
const { setAdmin } = require("./conversation")
const message = require("./message")
const config = require('./config.js')
const board = require("./keyboard.js")

const bot = new Bot(config.bot_token)

connectDb()

//Функция для получения ключа диалога
function getSessionKey(ctx) {
    return ctx.chat?.id.toString();
}

//Создание сиссии
bot.use(session({ getSessionKey, initial() {
        return {}
    } }))

//Разрешение боту на использование диалогов
bot.use(conversations())
//Создание диалога
bot.use(createConversation(setAdmin))

//Приветствие пользователей, после ввода команды start
bot.command(`start`, async (ctx) => {
    console.log('Команда /start получена');
    const gifStart = `picture/moneta.gif`
    await db.updateCountUserMessages(ctx.from.id)

    //Проверка пользователя на наличие в БД
    if(await db.checkUser(ctx.from.id) === false) {
        //Добавление пользователя в Firebase
        console.log("Пользователь не существует")

        db.setUser(ctx.from.id, ctx.from.username,)
            .then(() => {
            })
    }

    await db.updateNameTag(ctx.from.id, ctx.from.username,)

    await ctx.replyWithAnimation( new InputFile(gifStart), {caption: message.start, parse_mode: "MarkdownV2" })
        .catch(() =>{
            console.log("Ощибка при отправке GIF")
        })

    if(await db.getAdmin(ctx.from.id) === false) {
        await ctx.reply("Выберите действие", {
            reply_markup: board.userKeyboard,
        });
    } else {
        await ctx.reply("Вы можете пользоваться админ панелью", {
            reply_markup: board.adminKeyboard,
        })
    }

}) //конец start

//Реакция на кнопку Монетка
bot.hears("Монетка", async (ctx) => {
    await db.updateCountUserMessages(ctx.from.id)
    const randomNumber = Math.floor(Math.random() * 100) + 1
    if (randomNumber <= 2) {
        await ctx.reply("Монета упала ребром!")
        await db.updateGameInfo(ctx.from.id, 1)
    } else if (randomNumber <= 51) {
        await ctx.reply("Монета упала орлом!")
        await db.updateGameInfo(ctx.from.id, 2)
    } else if ( randomNumber > 51) {
        await ctx.reply("Монета упала решкой!")
        await db.updateGameInfo(ctx.from.id, 3)
    }
})

//Реакция на кнопку Результат
bot.hears("Результат", async (ctx) => {
    await db.updateCountUserMessages(ctx.from.id)
    const stat = db.getStats(ctx.from.id)
    await ctx.reply(
        `Сыграно ${(await stat).countGame} игр в монетку\nВыпало: ${(await stat).ribs} ребер, ${(await stat).eagle} орлов, ${(await stat).tails} решек\nОтправлено ${(await stat).countMessages} сообщений`)
})

//Результат для админов
bot.hears("Статистика", async (ctx) => {
    await db.updateCountUserMessages(ctx.from.id)
    if (await db.getAdmin(ctx.from.id) === true) {
        const stat =  db.getAllStats()
        console.log("Вывод статистики")
        await ctx.reply(
            `Всего ${(await stat).totalUsers} пользователей\nБыло всего отправлено ${(await stat).totalMessages} сообщений\nБыло всего сыграно ${(await stat).totalGames} игры`
        )
    }
})

//Добавление админа
bot.hears("Добавить админа", async (ctx) =>
    if (await db.getAdmin(ctx.from.id) === true) {
    ctx.conversation.enter("setAdmin")
})

//подсчёт сообщений пользователей
bot.on("message", async (ctx) => {
    await db.updateCountUserMessages(ctx.from.id)
})//Конец подсчёта

run(bot)
