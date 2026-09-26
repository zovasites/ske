// Forward to api/quote handler
const quoteHandler = require('./quote.js');

module.exports = async function handler(req, res) {
  return quoteHandler(req, res);
};
