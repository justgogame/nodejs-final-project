import express from 'express';
import { body, validationResult } from 'express-validator';
import Entry from '../models/Entry.js';
import Challenge from '../models/Challenge.js';

const router = express.Router();

// POST /entries/:challengeId - add entry
router.post(
  '/:challengeId',
  body('progress')
    .isInt({ min: 0, max: 100 })
    .withMessage('Progress must be between 0–100'),
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
      return res.redirect(`/challenges/${req.params.challengeId}`);
    }

    try {
      const entry = new Entry({
        challenge: req.params.challengeId,
        owner: req.user._id,
        note: req.body.note,
        progress: req.body.progress
      });
      await entry.save();
      req.flash('success', 'Entry added');
      res.redirect(`/challenges/${req.params.challengeId}`);
    } catch {
      req.flash('error', 'Could not add entry');
      res.redirect(`/challenges/${req.params.challengeId}`);
    }
  }
);

export default router;
