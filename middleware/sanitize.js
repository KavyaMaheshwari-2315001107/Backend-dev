function sanitizeInput(obj) {
  for (let key in obj) {
    if (typeof obj[key] === 'string') {
      obj[key] = obj[key]
        .replace(/</g, "")
        .replace(/>/g, "")
        .replace(/script/gi, "");
    }
  }
}

module.exports = (req, res, next) => {
  sanitizeInput(req.body);
  sanitizeInput(req.query);
  sanitizeInput(req.params);
  next();
};