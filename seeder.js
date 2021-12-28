const fs = require('fs')
const mongoose = require('mongoose')
const colors = require('colors')
const dotenv = require('dotenv')

// Load env variables
dotenv.config({ path: './config/config.env' })

// Load models
const Participant = require('./models/Participant')

// Connect to databse
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
})

const participants = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/participants.json`, 'utf-8')
)

// Import to database
const importData = async () => {
  try {
    await Participant.create(participants)
    console.log('Data Imported...'.green.inverse)
    process.exit()
  } catch (err) {
    console.log(err)
  }
}

// Delete data
const deleteData = async () => {
  try {
    await Participant.deleteMany()
    console.log('Data Destroyed...'.red.inverse)
    process.exit()
  } catch (err) {
    console.log(err)
  }
}

if (process.argv[2] === '-i') {
  importData()
} else if (process.argv[2] === '-d') {
  deleteData()
}
