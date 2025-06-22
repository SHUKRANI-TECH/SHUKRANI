// SHUKRANI BOT - Download Commands const ytdl = require('ytdl-core'); const axios = require('axios'); const fs = require('fs'); const path = require('path'); const { getBuffer } = require('../lib/simple');

module.exports = { name: 'download', description: 'Download media like YouTube audio/video, TikTok, etc.',

execute: async (sock, msg, text) => { const groupId = msg.key.remoteJid; const command = text.toLowerCase().split(' ')[0]; const args = text.split(' ').slice(1); const url = args[0];

const react = async (emoji) => await sock.sendMessage(groupId, {
  react: { text: emoji, key: msg.key }
});

if (!url) {
  return await sock.sendMessage(groupId, {
    text: '❌ Please provide a valid link.'
  });
}

// YTMP3: Download audio from YouTube
if (command === 'ytmp3' || command === 'ytmp3doc') {
  if (!url.includes('youtube.com')) {
    return await sock.sendMessage(groupId, {
      text: '❌ Invalid YouTube link. Example: ytmp3 https://youtube.com/watch?v=abc123'
    });
  }

  await react('🎵');
  await sock.sendMessage(groupId, { text: '⏳ Downloading audio...' });

  try {
    const info = await ytdl.getInfo(url);
    const title = info.videoDetails.title;

    const audioStream = ytdl(url, {
      quality: 'highestaudio',
      filter: 'audioonly'
    });

    const buffer = await streamToBuffer(audioStream);

    await sock.sendMessage(groupId, {
      audio: buffer,
      mimetype: 'audio/mp4',
      fileName: `${title}.mp3`
    });
  } catch (err) {
    console.error('❌ YTMP3 Error:', err.message);
    await sock.sendMessage(groupId, {
      text: '❌ Failed to download audio. Please try again.'
    });
  }
}

// YTMP4: Download video from YouTube
else if (command === 'ytmp4' || command === 'ytmp4doc') {
  if (!url.includes('youtube.com')) {
    return await sock.sendMessage(groupId, {
      text: '❌ Invalid YouTube link. Example: ytmp4 https://youtube.com/watch?v=abc123'
    });
  }

  await react('🎬');
  await sock.sendMessage(groupId, { text: '⏳ Downloading video...' });

  try {
    const info = await ytdl.getInfo(url);
    const title = info.videoDetails.title;

    const videoStream = ytdl(url, {
      quality: 'highestvideo',
      filter: format => format.container === 'mp4'
    });

    const buffer = await streamToBuffer(videoStream);

    await sock.sendMessage(groupId, {
      video: buffer,
      mimetype: 'video/mp4',
      fileName: `${title}.mp4`,
      caption: `🎞 ${title}`
    });
  } catch (err) {
    console.error('❌ YTMP4 Error:', err.message);
    await sock.sendMessage(groupId, {
      text: '❌ Failed to download video.'
    });
  }
}

// TikTok: Download TikTok video (no watermark via API)
else if (command === 'tiktok') {
  if (!url.includes('tiktok.com')) {
    return await sock.sendMessage(groupId, {
      text: '❌ Invalid TikTok link. Example: tiktok https://www.tiktok.com/@user/video/123456'
    });
  }

  await react('🎥');
  await sock.sendMessage(groupId, { text: '⏳ Fetching TikTok video...' });

  try {
    const api = `https://api.tiklydown.me/api/download?url=${encodeURIComponent(url)}`;
    const { data } = await axios.get(api);

    if (!data.video?.nowm) throw new Error('No video found');

    const videoUrl = data.video.nowm;
    const buffer = await getBuffer(videoUrl);

    await sock.sendMessage(groupId, {
      video: buffer,
      mimetype: 'video/mp4',
      caption: `🎵 TikTok Video`
    });
  } catch (err) {
    console.error('❌ TikTok Error:', err.message);
    await sock.sendMessage(groupId, {
      text: '❌ Failed to fetch TikTok video.'
    });
  }
}

} };

// Helper: Convert stream to buffer function streamToBuffer(stream) { return new Promise((resolve, reject) => { const chunks = []; stream.on('data', chunk => chunks.push(chunk)); stream.on('end', () => resolve(Buffer.concat(chunks))); stream.on('error', reject); }); }

                  
