import Challenge from '../models/Challenge.js';

export const listChallenges = async (req, res) => {
  const challenges = await Challenge.find({ owner: req.user._id });
  res.render('challenges/index', { challenges });
};

export const renderNewForm = (req, res) => {
  res.render('challenges/new');
};

export const createChallenge = async (req, res) => {
  const challenge = new Challenge({ ...req.body, owner: req.user._id });
  await challenge.save();
  req.flash('success', 'Challenge created!');
  res.redirect('/challenges');
};

export const showChallenge = async (req, res) => {
  const challenge = await Challenge.findById(req.params.id).populate('owner');
  res.render('challenges/show', { challenge });
};

export const renderEditForm = async (req, res) => {
  const challenge = await Challenge.findById(req.params.id);
  res.render('challenges/edit', { challenge });
};

export const updateChallenge = async (req, res) => {
  await Challenge.findByIdAndUpdate(req.params.id, req.body);
  req.flash('success', 'Challenge updated!');
  res.redirect(`/challenges/${req.params.id}`);
};

export const deleteChallenge = async (req, res) => {
  await Challenge.findByIdAndDelete(req.params.id);
  req.flash('success', 'Challenge deleted!');
  res.redirect('/challenges');
};
