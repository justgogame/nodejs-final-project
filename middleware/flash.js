export function setFlashMessages(req, res, next) {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
}
