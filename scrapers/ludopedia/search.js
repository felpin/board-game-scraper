const cheerio = require('cheerio');
const request = require('request-promise-native');
const url = require('url');
const queryUtils = require('../../utils/query');

/**
 * Build the search URL
 * @param {string} query The query to search
 * @returns {string} The search URL
 */
const buildUrl = (query) => {
  const encodedQuery = queryUtils.encode(query);

  return `https://www.ludopedia.com.br/search?search=${encodedQuery}`;
};

/**
 * Get the id of a board game from its URL
 * @param {string} boardGameUrl The board game's URL
 * @returns {string} The id of the board game
 */
const extractIdFromUrl = (boardGameUrl) => {
  const { path } = url.parse(boardGameUrl);
  const pathParts = path.split('/');
  const indexLastPathPart = pathParts.length - 1;

  const id = pathParts[indexLastPathPart];

  return id;
};

/**
 * The response from a search query to Ludopedia
 * @typedef {Object} SearchResponse
 * @property {number} id The id of the board game
 * @property {string} name The name of the board game
 */

/**
 * Search for board games in Ludopedia
 * @param {string} query The query containing the name of the board game
 * @returns {SearchResponse[]} The response from the Ludopedia
 */
const search = async (query) => {
  const searchUrl = buildUrl(query);
  const htmlResponse = await request(searchUrl);
  const $ = cheerio.load(htmlResponse);

  // TODO: get only the content
  const items = [];

  const anchors = $('#bloco-jogos-sm').find('a.full-link');
  anchors.each((index, anchor) => {
    const boardGameUrl = anchor.attribs.href;
    const id = extractIdFromUrl(boardGameUrl);

    const name = $(anchor).children('h4').first().get(0).children[0].data.trim();

    items.push({ id, name });
  });

  return items;
};

module.exports = search;
