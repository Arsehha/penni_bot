const { Api } = require("grammy");
const  config = require("./config")
const { db} = require("./database")

const api = new Api(config.bot_token)

// Функция для выдачи роли администратора
async function setAdmin(conversation, ctx) {
    await ctx.reply("Напишите userId пользователя, которого хотите сделать администратором.")

    const userId = await conversation.wait("text"); // Ожидаем текстовое сообщение

    const result = await db.updateAdmin(parseInt(userId.message.text))

    if (result) {
        await ctx.reply("Пользователь повышен до админа.")
        await api.sendMessage(parseInt(userId.message.text), "Вы повышены до админа в боте! Напишите /start")
    } else {
        await ctx.reply("Неверный userId.")
    }
}

module.exports = { setAdmin }