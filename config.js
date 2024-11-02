require('dotenv').config();

const config = {
bot_token: process.env.BOT_TOKEN,
    firebaseConfig: {
        apiKey: process.env.DATABASE_API_KEY,
        authDomain: process.env.AUTH_DOMAIN,
        databaseURL: process.env.DATABASE_URL,
        projectId: process.env.PROJECT_ID,
        storageBucket: process.env.STORAGE_BUCKET,
        messagingSenderId: process.env.MESSAGING_SENDER_ID,
        appId: process.env.APP_ID,
        measurementId: process.env.MEASUREMENT_ID,
    },
    firebaseAuth: {
        mail: process.env.EMAIL,
        password: process.env.PASSWORD,
    },
    databaseURL: process.env.DATABASE_URL,
}

module.exports = config