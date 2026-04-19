const mongoose = require('mongoose');

async function dbConnection () {
    await mongoose.connect(process.env.DB_URI);
    console.log('Database connection successful');
}

module.exports = dbConnection;