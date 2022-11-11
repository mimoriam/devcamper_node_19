const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({path: './config/config.env'});

// Load models
const Bootcamp = require('./models/Bootcamp');

mongoose.connect(process.env.MONGO_URI);

// Read JSON files
const bootcamps = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8')
);

// Import into DB
const importData = async () => {
    try {
        await Bootcamp.create(bootcamps);
        console.log('Created~')
        process.exit();
    } catch (err) {
        console.error(err);
    }
};

// Delete data
const deleteData = async () => {
    try {
        await Bootcamp.deleteMany();
        console.log('Data deleted !!!')
        process.exit();
    } catch (err) {
        console.error(err);
    }
};

if (process.argv[2] === '-i') {
    importData().then();
} else if (process.argv[2] === '-d') {
    deleteData().then();
}