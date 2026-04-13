const sanitizeHtml = require('sanitize-html');

const sanitizeInput = (req, res, next) => {

  if (req.body) {
    for (let key in req.body) {
      req.body[key] = sanitizeHtml(req.body[key], {
        allowedTags: ['b', 'i', 'em', 'strong', 'a'],
        allowedAttributes: {
          a: ['href']
        }
      });
    }
  }

  next();
};

module.exports = sanitizeInput;