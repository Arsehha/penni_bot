const { Keyboard } = require("grammy");

class Keyboards {
    constructor() {
        this.adminKeyboard = this.createAdminKeyboard();
        this.userKeyboard = this.createUserKeyboard();
    }

    createAdminKeyboard() {
        return new Keyboard()
            .text("Монетка")
            .text("Результат")
            .row()
            .text("Добавить админа")
            .text("Статистика")
            .resized();
    }

    createUserKeyboard() {
        return new Keyboard()
            .text("Монетка")
            .text("Результат")
            .resized();
    }
}

const keyboards = new Keyboards();

module.exports = keyboards;