const request = require('request-promise-native');

/**
 * Encode a query
 * @param {string} query The query to encode
 * @returns {string} The query encoded
 */
const encodeQuery = (query) => {
  const queryTrimmed = query.trim();
  const queryEncoded = queryTrimmed.replace(' ', '+');

  return queryEncoded;
};

/**
 * Constructs the search URL
 * @param {string} query The query to search
 * @returns {string} The search URL
 */
const url = (query) => {
  const encodedQuery = encodeQuery(query);

  return `https://boardgamegeek.com/search/boardgame?q=${encodedQuery}&showcount=20`;
};

/**
 * The response from a search query to BoardGameGeek
 * @typedef {Object} SearchResponse
 * @property {number} id The id of the board game
 * @property {string} name The name of the board game
 */

/**
 * Search for board games in BoardGameGeek
 * @param {string} query The query containing the name of the board game
 * @returns {SearchResponse[]} The response from the BoardGameGeek
 */
const search = async (query) => {
  const searchUrl = url(query);
  const requestOptions = {
    headers: {
      Accept: 'application/json',
    },
  };

  const searchResponse = await request(searchUrl, requestOptions);
  const { items } = JSON.parse(searchResponse);

  return items
    .filter(item => item.subtype === 'boardgame')
    .map(({ objectid, name }) => ({
      id: objectid,
      name,
    }));
};

module.exports = search;
