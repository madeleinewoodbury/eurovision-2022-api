const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const { check, validationResult } = require('express-validator')
const Participant = require('../models/Participant')
const User = require('../models/User')

// @route    POST api/votes/:id/:vote
// @desc     Vote on a participant
// @access   Private
router.post('/:id/:vote', [auth], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  try {
    const participant = await Participant.findById(req.params.id)
    const user = await User.findById(req.user.id)

    // Check if user has voted on participant before
    let userVote = await user.votes.find(
      (vote) => vote.participant.id === req.params.id
    )

    // Update the new vote
    if (userVote) {
      userVote.vote = req.params.vote
      user.votes.sort((a, b) => (a.vote < b.vote ? 1 : -1))
      await user.save()

      let participantVote = await participant.votes.find(
        (vote) => vote.user.toString() === req.user.id
      )

      participantVote.vote = req.params.vote
      await participant.save()

      return res.json(participant)
    }

    // Create a new vote for the user
    const newUserVote = {
      participant: {
        id: participant._id,
        country: participant.country.name,
        flag: participant.country.flag,
        artist: participant.artist,
        song: participant.song,
      },
      vote: req.params.vote,
    }

    // Create a new vote for the participant
    const newParticipantVote = {
      user: req.user.id,
      vote: req.params.vote,
    }

    user.votes.unshift(newUserVote)
    participant.votes.unshift(newParticipantVote)

    user.votes.sort((a, b) => (a.vote < b.vote ? 1 : -1))
    await user.save()
    await participant.save()

    res.json(participant)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

// @route    GET api/votes/:id/votes
// @desc     Get participants total votes
// @access   Private
router.get('/:id', [auth], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  try {
    const participant = await Participant.findById(req.params.id)

    if (!participant) {
      res.status(400).json({ msg: 'Participant not found' })
    }

    const votes = participant.votes.map((vote) => vote)

    if (votes.length < 1) {
      res.status(400).json({ msg: 'No votes found' })
    }

    let totalVotes = 0
    votes.map((vote) => (totalVotes += vote.vote))

    res.json({ total: totalVotes, votes })
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

module.exports = router
