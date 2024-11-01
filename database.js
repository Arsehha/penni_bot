const config = require('./config.js')
const { initializeApp } = require("firebase/app")
const { getDatabase, ref, set, update, get, query,} = require("firebase/database");
const { getAuth, signInWithEmailAndPassword } = require("firebase/auth");

const app = initializeApp(config.firebaseConfig)
const database = getDatabase(app)
const auth = getAuth(app)

//Функция проверки пользователся в бд
function connectDb () {
    signInWithEmailAndPassword(auth, config.firebaseAuth.mail, config.firebaseAuth.password)
        .then(() => {
            console.log("Connected to database")
        })
}

//Все методы класса
class DatabaseData {

    async setUser(userId, nameTag,) {
        try {
            await set(ref(database, 'users/' + userId), {
                nameTag: nameTag,
                admin: false,
                gameStat: {
                    countGame: 0,
                    eagle: 0,
                    tails: 0,
                    ribs: 0,
                },
                messagesCount: 1
            }).then(() => {
                console.log("User data saved successfully")
            })
        } catch (error) {
            console.error("Error saving user data:", error)
        }
    }

    async updateCountUserMessages (userId) {
        if (await this.checkUser(userId)) {
            let currentCount = 1;
            const userRef = ref(database, `users/${userId}`)
            const snapshot = await get(userRef)

            // Получаем текущее количество сообщений
            if (snapshot.exists()) {
                const userData = snapshot.val();
                currentCount = userData.messagesCount;
                await update(userRef, {
                    messagesCount: ++currentCount
                })
            }
        }
    }

    async checkUser (userId) {
        const snapShot = await get(query(ref(database, `users/${userId}`)))
        if (snapShot.exists()) {
            console.log("Пользователь существует")
            return true
        } else {
            return false
        }
    }

    async updateGameInfo (userId, choose) {
        if (await this.checkUser(userId)) {
            let allGame = 0
            let winGame = 0
            const userRef = ref(database, `users/${userId}`)
            const snapshot = await get(userRef)

            if (snapshot.exists()) {
                const userData = snapshot.val();
                allGame = userData.gameStat.countGame;
                if (choose === 1) {
                    winGame = userData.gameStat.ribs
                    await update(userRef, {
                        gameStat: {
                            countGame: ++allGame,
                            ribs: ++winGame,
                            eagle: userData.gameStat.eagle,
                            tails: userData.gameStat.tails,
                        }
                    })
                } else if (choose === 2) {
                    winGame = userData.gameStat.eagle
                    await update(userRef, {
                        gameStat: {
                            countGame: ++allGame,
                            ribs: userData.gameStat.ribs,
                            eagle: ++winGame,
                            tails: userData.gameStat.tails,
                        }
                    })
                } else if (choose === 3) {
                    winGame = userData.gameStat.tails
                    await update(userRef, {
                        gameStat: {
                            countGame: ++allGame,
                            ribs: userData.gameStat.ribs,
                            eagle: userData.gameStat.eagle,
                            tails: ++winGame,
                        }
                    })
                }
            }
        }
    }

    async getStats (userId) {
        const userRef = ref(database, `users/${userId}`)
        const snapshot = await get(userRef)

        if (snapshot.exists()) {
            const userData = snapshot.val()
            const countGame = userData.gameStat.countGame;
            const ribs = userData.gameStat.ribs;
            const eagle = userData.gameStat.eagle;
            const tails = userData.gameStat.tails;
            const countMessages = userData.messagesCount;
            return {countGame, ribs, eagle, tails, countMessages};
        }

    }

    async updateAdmin (userId) {
        const userExists = await this.checkUser(userId)
        if(userExists === true) {
            const userRef = ref(database, `users/${userId}`)
            await update(userRef, { admin: true })
            return true
        } else {
            console.error("Неправильный userId")
            return false
        }
    }

    async getAdmin (userId) {
        const userRef = ref(database, `users/${userId}`)
        const snapshot = await get(userRef)

        if (snapshot.exists()) {
            const userData = snapshot.val()
            return userData.admin === true
        } else {
            return false
        }
    }

    async getAllUsers () {
        const snapshot = await get(ref(database, `users`))

        if (snapshot.exists()) {
            const userData = snapshot.val()
            return Object.keys(userData).length
        }
    }

    async getAllMessages () {
        const snapshot = await get(ref(database, `users`))

        if (snapshot.exists()) {
            const usersData = snapshot.val();
            let totalMessages = 0;

            for (const userId in usersData) {
                totalMessages += usersData[userId].messagesCount || 0;
            }

            return totalMessages
        }
    }

    async getAllGames () {
        const snapshot = await get(ref(database, `users`))

        if (snapshot.exists()) {
            const usersData = snapshot.val()
            let totalGame = 0

            for (const userId in usersData) {
                totalGame += usersData[userId].gameStat.countGame || 0
            }

            return totalGame
        }
    }

    async getAllStats () {
        const totalUsers = await this.getAllUsers() || "0"
        const totalMessages = await this.getAllMessages() || "0"
        const totalGames = await this.getAllGames() || "0"

        return { totalUsers, totalMessages, totalGames }
    }

}

const db = new DatabaseData()

module.exports = {connectDb, db}