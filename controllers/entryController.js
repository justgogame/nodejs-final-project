import Entry from '../models/Entry.js';

export const addEntry = async (req, res) => {
  const entry = new Entry({
    ...req.body,
    challenge: req.params.challengeId,
    owner: req.user._id
  });
  await entry.save();
  req.flash('success', 'Entry added!');
  res.redirect(`/challenges/${req.params.challengeId}`);
};

export const deleteEntry = async (req, res) => {
  await Entry.findByIdAndDelete(req.params.entryId);
  req.flash('success', 'Entry removed!');
  res.redirect('back');
};
