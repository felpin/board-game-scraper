const cheerio = require('cheerio');
const Entities = require('html-entities').AllHtmlEntities;
const request = require('request-promise-native');
const { BASE_URL } = require('./constants');

const entities = new Entities();

/**
 * Returns the URL of the board game's page
 * @param {number} id The id of the board game
 * @returns {string} The URL of the board game's page
 */
const url = id => `${BASE_URL}/boardgame/${id}`;

/**
 * Request the html of the board game's page
 * @param {number} id The id of the board game
 * The HTML page of the board game
 */
const getHtml = async (id) => {
  const boardGameUrl = url(id);
  const html = await request(boardGameUrl);

  return html;
};

/**
 * Get the content of a meta property in the board game's page
 * @param {number} id The id of the board game
 * @param {string} property The name of the property
 * @returns {string} The content of the property
 */
const getContentOfMetaProperty = async (id, property) => {
  const html = await getHtml(id);
  const $ = cheerio.load(html);

  const selector = `meta[property="og:${property}"]`;

  const content = $(selector).attr('content');
  const contentDecoded = entities.decode(content);

  return contentDecoded;
};

/**
 * Get the description of a game
 * @param {number} id The id of the board game
 * @returns {string} The description of the game
 */
const getDescription = async id => getContentOfMetaProperty(id, 'description');

/**
 * Get the url of the board game's image
 * @param {number} id The id of the board game
 * @returns {string} The URL of the board game's page
 */
const getImageUrl = async id => getContentOfMetaProperty(id, 'image');

/**
 * Get the title of the board game
 * @param {number} id The id of the board game
 * @returns {string} The title of the board game
 */
const getTitle = async id => getContentOfMetaProperty(id, 'title');

module.exports = {
  getDescription,
  getImageUrl,
  getTitle,
};
