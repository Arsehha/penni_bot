const config = require('./config.js')
const { initializeApp } = require("firebase/app")
const { getDatabase } = require("firebase/database")
const { getAuth, signInWithEmailAndPassword } = require("firebase/auth")

const app = initializeApp(config.firebaseConfig)
const database = getDatabase(app);
const auth = getAuth(app);

function connectDb () {
    signInWithEmailAndPassword(auth, config.firebaseAuth.mail, config.firebaseAuth.password)
        .then(() => {
            console.log("Connected to database")
        })
}

class DatabaseData {

}

const db = new DatabaseData()

module.exports = {connectDb, db}
