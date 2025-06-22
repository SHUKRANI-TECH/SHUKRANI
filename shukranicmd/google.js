// SHUKRANI BOT - Google Search Command
const axios = require('axios');
const cheerio = require('cheerio');

module.exports = {
  name: 'google',
  description: 'Search anything on Google and get quick results.',

  execute: async (sock, msg, text) => {
    const groupId = msg.key.remoteJid;
    const query = text.split(' ').slice(1).join(' ').trim();

    if (!query) {
      return await sock.sendMessage(groupId, {
        text: '❌ Please enter a search term.\nExample: google news about Tanzania'
      });
    }

    try {
      const res = await axios.get('https://www.google.com/search', {
        params: { q: query },
        headers: {
          'User-Agent': 'Mozilla/5.0'
        }
      });

      const $ = cheerio.load(res.data);
      const results = [];

      $('div.g').slice(0, 5).each((i, el) => {
        const title = $(el).find('h3').text();
        const link = $(el).find('a').attr('href');
        if (title && link) {
          results.push(`🔹 *${title}*\n${link}`);
        }
      });

      if (results.length === 0) {
        return await sock.sendMessage(groupId, {
          text: '⚠️ Sorry, no results found.'
        });
      }

      await sock.sendMessage(groupId, {
        text: `🔍 *Google search results for:* _${query}_\n\n${results.join('\n\n')}`
      });
    } catch (err) {
      console.error('❌ Google search error:', err.message);
      await sock.sendMessage(groupId, {
        text: '❌ Failed to search. Please try again later.'
      });
    }
  }
};
