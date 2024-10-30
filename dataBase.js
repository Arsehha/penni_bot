const config = require('./config.js');
const { initializeApp } = require("firebase/app");
const { getDatabase, ref, set, update, get, query,} = require("firebase/database");
const { getAuth, signInWithEmailAndPassword } = require("firebase/auth");

const app = initializeApp(config.firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

//Функция проверки пользователся в бд
function connectDb () {
    signInWithEmailAndPassword(auth, config.firebaseAuth.mail, config.firebaseAuth.password)
        .then(() => {
            console.log("Connected to database")
        })
}

//Все методы класса
class DatabaseData {

    async setUser(userId, nameTag, gameCount, eagle, tails, ribs) {
        try {
            await set(ref(database, 'users/' + userId), {
                nameTag: nameTag,
                gameStat: {
                    countGame: gameCount,
                    eagle: eagle,
                    tails: tails,
                    ribs: ribs,
                },
                messagesCount: 1
            }).then(() => {
                console.log("User data saved successfully");
            })
        } catch (error) {
            console.error("Error saving user data:", error);
        }
    }

    async updateCountUserMessages (userId) {
        let currentCount = 1;
        const userRef = ref(database, `users/${userId}`);
        const snapshot = await get(userRef)

        // Получаем текущее количество сообщений
        if (snapshot.exists()) {
            const userData = snapshot.val();
            currentCount = userData.messagesCount;
        }

        await update( userRef , {
            messagesCount: ++currentCount
        })
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

    async getAllUsers () {

    }

    async getAllMessages () {

    }

    async getAllGames () {

    }

}

const db = new DatabaseData()

module.exports = {connectDb, db}