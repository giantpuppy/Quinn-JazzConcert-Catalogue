// 从同目录 catalogue.json 读取演出方提供的曲目数据。
// 不在 JavaScript 源码中复制歌词；JSON 由内容维护者上传。
const songIdMap = {
  'that-sunday-that-summer': 'that-sunday',
  'puttin-on-the-ritz': 'putting-on-the-ritz',
  'too-close-for-comfort': 'too-close',
  'mystery-guest': 'guest',
  'every-night-at-seven': 'every-night',
  'when-i-fall-in-love': 'when-i-fall',
  'encore-surprise': 'surprise'
};
const songContentReady = fetch('./catalogue.json').then(async response => {
  if (!response.ok) throw new Error('无法读取节目数据');
  const { songs } = await response.json();
  return songs.map(song => ({ ...song, id: songIdMap[song.song_id] || song.song_id }))
    .sort((left, right) => left.order - right.order);
});
