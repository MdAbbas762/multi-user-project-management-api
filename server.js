require('dotenv').config();
const app = require('./app');
const databaseConnection = require('./config/db');

async function startServer () {
    try {
        await databaseConnection();

        app.listen(process.env.PORT, () => {
            console.log(`Server running at: ${process.env.PORT}`);
        });

    } catch (error) {
        console.log(`Something went wrong\n${error}`);
        process.exit(1);
    }
}

startServer();