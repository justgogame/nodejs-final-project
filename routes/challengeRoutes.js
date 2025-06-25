import express from 'express';
import { body, validationResult } from 'express-validator';
import Challenge from '../models/Challenge.js';
import Entry from '../models/Entry.js';

const router = express.Router();

// GET /challenges - list user challenges
router.get('/', async (req, res) => {
  const filter = req.query.filter || 'all';

  const challenges = await Challenge.find({ owner: req.user._id }).sort({
    startDate: -1
  });

  for (let challenge of challenges) {
    const entries = await Entry.find({ challenge: challenge._id });
    challenge.totalProgress = entries.reduce((sum, e) => sum + e.progress, 0);
  }

  const filteredChallenges =
    filter === 'active'
      ? challenges.filter((c) => c.totalProgress < 100)
      : challenges;

  res.render('challenges/index', {
    challenges: filteredChallenges,
    filter
  });
});

// GET /challenges/new - show form
router.get('/new', (req, res) => {
  res.render('challenges/new');
});

// POST /challenges - create
router.post(
  '/',
  body('title').notEmpty().withMessage('Title is required'),
  body('startDate').isISO8601().toDate(),
  body('endDate').isISO8601().toDate(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash(
        'error',
        errors
          .array()
          .map((e) => e.msg)
          .join('. ')
      );
      return res.redirect('/challenges/new');
    }

    try {
      const challenge = new Challenge({
        ...req.body,
        owner: req.user._id,
        isPublic: req.body.isPublic === 'on'
      });
      await challenge.save();
      req.flash('success', 'Challenge created');
      res.redirect('/challenges');
    } catch (err) {
      req.flash('error', 'Error creating challenge');
      res.redirect('/challenges/new');
    }
  }
);

// GET /challenges/:id - show detail
router.get('/:id', async (req, res) => {
  const challenge = await Challenge.findOne({
    _id: req.params.id,
    owner: req.user._id
  });
  if (!challenge) {
    req.flash('error', 'Challenge not found');
    return res.redirect('/challenges');
  }

  const entries = await Entry.find({ challenge: challenge._id }).sort({
    date: -1
  });

  res.render('challenges/show', { challenge, entries });
});

// GET /challenges/:id/edit
router.get('/:id/edit', async (req, res) => {
  const challenge = await Challenge.findOne({
    _id: req.params.id,
    owner: req.user._id
  });
  if (!challenge) {
    req.flash('error', 'Not found');
    return res.redirect('/challenges');
  }
  res.render('challenges/edit', { challenge });
});

// PUT /challenges/:id
router.put(
  '/:id',
  body('title').notEmpty().withMessage('Title is required'),
  body('startDate').isISO8601().toDate(),
  body('endDate').isISO8601().toDate(),
  async (req, res) => {
    const challenge = await Challenge.findOne({
      _id: req.params.id,
      owner: req.user._id
    });
    if (!challenge) {
      req.flash('error', 'Not found');
      return res.redirect('/challenges');
    }

    try {
      challenge.title = req.body.title;
      challenge.description = req.body.description;
      challenge.startDate = req.body.startDate;
      challenge.endDate = req.body.endDate;
      challenge.isPublic = req.body.isPublic === 'on';
      await challenge.save();
      req.flash('success', 'Updated');
      res.redirect('/challenges');
    } catch {
      req.flash('error', 'Failed to update');
      res.redirect('/challenges');
    }
  }
);

// DELETE /challenges/:id
router.delete('/:id', async (req, res) => {
  await Challenge.deleteOne({ _id: req.params.id, owner: req.user._id });
  req.flash('success', 'Deleted');
  res.redirect('/challenges');
});

export default router;
