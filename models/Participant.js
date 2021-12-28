const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ParticipantSchema = new Schema({
  country: {
    _id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    flag: {
      type: String,
    },
  },
  artist: {
    type: String,
    required: true,
  },
  song: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  bio: {
    type: Array,
  },
  lyrics: {
    type: String,
  },
  music: {
    type: String,
  },
  semifinal: {
    type: String,
    required: true,
  },
  final: {
    type: Boolean,
    default: false,
  },
  video: {
    type: String,
  },
  points: {
    type: Number,
    default: 0,
  },
  votes: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'users',
      },
      vote: {
        type: Number,
      },
    },
  ],
})

module.exports = Participant = mongoose.model('participant', ParticipantSchema)
