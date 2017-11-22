/**
 * Encode a query
 * @param {string} query The query to encode
 * @returns {string} The query encoded
 */
const encode = (query) => {
  const queryTrimmed = query.trim();
  const queryEncoded = queryTrimmed.replace(' ', '+');

  return queryEncoded;
};

module.exports = {
  encode,
};
