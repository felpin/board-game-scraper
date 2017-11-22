const request = require('request-promise-native');
const { BASE_URL } = require('./constants');
const queryUtils = require('../../utils/query');

/**
 * Constructs the search URL
 * @param {string} query The query to search
 * @returns {string} The search URL
 */
const url = (query) => {
  const encodedQuery = queryUtils.encode(query);

  return `${BASE_URL}/search/boardgame?q=${encodedQuery}&showcount=20`;
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
