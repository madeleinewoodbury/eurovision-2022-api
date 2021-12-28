const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const { check, validationResult } = require('express-validator')
const Participant = require('../models/Participant')
const User = require('../models/User')

// @route POST/api/participants
// @desc Create a participant
// @access Private
router.post(
  '/',
  auth,
  [
    check('country', 'Country is required').not().isEmpty(),
    check('artist', 'Artist name is required').not().isEmpty(),
    check('song', 'Song is required').not().isEmpty(),
    check('semifinal', 'Semifinal is required').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    try {
      // Check if user is authorized
      const user = await User.findById(req.user.id).select('-password')
      if (user.role !== 'admin') {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User not authorized' }] })
      }

      // Create new instance of participant
      const newParticipant = new Participant({
        country: req.body.country,
        artist: req.body.artist,
        song: req.body.song,
        image: req.body.image
          ? req.body.image
          : 'https://res.cloudinary.com/dsliohzpe/image/upload/v1612177797/ESC-2021/placeholder_jlghg4.jpg',
        bio: req.body.bio && req.body.bio,
        lyrics: req.body.lyrics ? req.body.lyrics : 'Unknown',
        music: req.body.music ? req.body.music : 'Unknown',
        semifinal: req.body.semifinal,
        final: req.body.final && req.body.final,
        video: req.body.video && req.body.video,
        points: req.body.points && req.body.points,
      })

      const participant = await newParticipant.save()
      res.json(participant)
    } catch (err) {
      console.error(err.message)
      res.status(500).send('Server Error')
    }
  }
)

// @route   GET /api/participants
// @desc    Get all participants
// @acess   Public
router.get('/', async (req, res) => {
  try {
    const participants = await Participant.find().sort({ country: 1 })

    if (participants.length < 1) {
      return res.status(400).json({ msg: 'No participants found' })
    }

    res.json(participants)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

// @route   GET /api/participants/:id
// @desc    Get single participants
// @acess   Public
router.get('/:id', async (req, res) => {
  try {
    const participant = await Participant.findById(req.params.id)

    if (!participant) {
      return res.status(400).json({ msg: 'Participants found' })
    }

    res.json(participant)
  } catch (err) {
    if (err.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'Participant not found' })
    }
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

// @route   PUT /api/participants/:id
// @desc    Update a participant
// @acess   Private
router.put(
  '/:id',
  [
    auth,
    [
      check('country', 'Country is required').not().isEmpty(),
      check('artist', 'Artist name is required').not().isEmpty(),
      check('song', 'Song is required').not().isEmpty(),
      check('semifinal', 'Semifinal is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const {
      country,
      artist,
      song,
      image,
      bio,
      lyrics,
      music,
      semifinal,
      final,
      video,
      points,
    } = req.body

    if (country) participantFields.country = country
    if (artist) participantFields.artist = artist
    if (song) participantFields.song = song
    if (image) participantFields.image = image
    if (bio) participantFields.bio = bio
    if (lyrics) participantFields.lyrics = lyrics
    if (music) participantFields.music = music
    if (semifinal) participantFields.semifinal = semifinal
    if (final) participantFields.final = final
    if (video) participantFields.video = video
    if (points) participantFields.points = points

    try {
      let participant = await Participant.findById(req.params.id)
      if (!participant) {
        res.status(400).json({ msg: 'Participant not found' })
      }

      // Check if user is authorized
      const user = await User.findById(req.user.id).select('-password')
      if (user.role !== 'admin') {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User not authorized' }] })
      }

      // Update the new participant
      participant = await Participant.findByIdAndUpdate(
        { _id: req.params.id },
        { $set: participantFields },
        { new: true }
      )
      return res.json(participant)
    } catch (err) {
      if (err.kind == 'ObjectId') {
        return res.status(400).json({ msg: 'Participant not found' })
      }
      console.error(err.message)
      res.status(500).send('Server Error')
    }
  }
)

// @route   DELETE /api/participants/:id
// @desc    Delete a participant
// @acess   Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const participant = await Participant.findById(req.params.id)
    if (!participant) {
      res.status(400).json({ msg: 'Participant not found' })
    }
    // Check if user is authorized
    const user = await User.findById(req.user.id).select('-password')
    if (user.role !== 'admin') {
      return res.status(400).json({ errors: [{ msg: 'User not authorized' }] })
    }

    await participant.remove()
    res.json({ msg: 'Participant deleted' })
  } catch (err) {
    if (err.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'Participant not found' })
    }
    res.status(500).send('Server Error')
  }
})

module.exports = router
