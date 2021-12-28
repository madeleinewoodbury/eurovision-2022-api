const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  votes: [
    {
      participant: {
        id: String,
        country: String,
        flag: String,
        artist: String,
        song: String,
      },
      vote: {
        type: Number,
      },
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
})

module.exports = User = mongoose.model('user', UserSchema)
