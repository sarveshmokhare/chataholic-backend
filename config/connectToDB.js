const mongoose = require('mongoose');

async function connectToDB() {
    try {
        const connection = await mongoose.connect(process.env.MONGO_URI);
        // const connection = await mongoose.connect(process.env.MONGO_URI_PROD);

        if (connection) console.log("Connection to the chatAppDB is successful.");

    } catch (error) {
        console.log(`Error occured: ${error}`);
    }
}


module.exports = connectToDB;