const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load env variables
dotenv.config({ path: './config/config.env' });

// Load models
const Participant = require('./models/Participant');

// Connect to databse
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

const participants = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/participants-2021.json`, 'utf-8')
);

// Import to database
const importData = async () => {
  try {
    await Participant.create(participants);
    console.log('Data Imported...');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await Participant.deleteMany();
    console.log('Data Destroyed...');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}
