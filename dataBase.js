const config = require('./config.js');
const { initializeApp } = require("firebase/app");
const { getDatabase, ref, set } = require("firebase/database");
const { getAuth, signInWithEmailAndPassword } = require("firebase/auth");

const app = initializeApp(config.firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

function connectDb () {
    signInWithEmailAndPassword(auth, config.firebaseAuth.mail, config.firebaseAuth.password)
        .then(() => {
            console.log("Connected to database")
        })
}

class DatabaseData {
    async setUser(userId, nameTag, gameCount, eagle, tails, ribs, messagesCount) {
        try {
            await set(ref(database, 'users/' + userId), {
                nameTag: nameTag,
                gameStat: {
                    countGame: gameCount,
                    eagle: eagle,
                    tails: tails,
                    ribs: ribs,
                },
                messagesCount: messagesCount
            });
            console.log("User data saved successfully");
        } catch (error) {
            console.error("Error saving user data:", error);
        }
    }

}

const db = new DatabaseData()

module.exports = {connectDb, db}