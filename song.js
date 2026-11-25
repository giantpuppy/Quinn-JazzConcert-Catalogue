(async () => {
  const get = id => document.getElementById(id);
  const url = new URL(location.href);
  const id = url.searchParams.get('id');
  const songs = await songContentReady;
  const index = id ? songs.findIndex(song => song.id === id || song.song_id === id) : 0;
  if (index < 0) {
    location.replace('index.html#' + (id === 'conversation' ? 'conversation' : 'programme'));
    return;
  }
  const song = songs[index];
  const track = catalogue.tracks.find(item => item.id === song.id);
  const show = (id, value) => {
    const node = get(id);
    node.hidden = !value;
    node.textContent = String(value || '').replace(/。$/u, '');
  };
  const title = song.title;
  document.title = title + '｜爵妙人生';
  get('song-back').href = 'index.html' + (url.searchParams.has('picks')
    ? '?' + new URLSearchParams({picks: url.searchParams.get('picks')}) : '') + '#' + song.id;
  const detailTitle = song.detail_title || title;
  show('song-title', detailTitle);
  get('song-title').toggleAttribute('data-long', detailTitle.length > 11);
  show('song-intro', song.intro);
  show('song-origin', song.origin);
  show('song-label', track.number);
  const pad = value => String(value).padStart(2, '0');
  show('song-count', pad(index + 1) + ' / ' + pad(songs.length));

  const record = document.querySelector('.song-record');
  const prev = get('song-prev');
  const next = get('song-next');
  let turning = false;
  function bindTurn(anchor, step) {
    const target = songs[(index + step + songs.length) % songs.length];
    const link = new URL(url);
    link.searchParams.set('id', target.id);
    anchor.href = link;
    anchor.setAttribute('aria-label', (step > 0 ? '下一首 ' : '上一首 ') + target.title);
    anchor.addEventListener('click', async event => {
      if (event.ctrlKey || event.shiftKey || event.metaKey || event.altKey) return;
      event.preventDefault();
      if (turning) return;
      turning = true;
      if (!matchMedia('(prefers-reduced-motion: reduce)').matches && record.animate) {
        await record.animate([{transform:'rotate(0deg)'}, {transform:'rotate(' + step * 110 + 'deg)'}],
          {duration:240, easing:'ease-in'}).finished;
      }
      location.assign(link);
    });
  }
  bindTurn(prev, -1);
  bindTurn(next, 1);
  window.addEventListener('pageshow', () => { turning = false; });
  let start;
  record.onpointerdown = event => {
    if (!event.isPrimary || event.button !== 0) return;
    record.setPointerCapture(event.pointerId);
    start = { x:event.clientX, y:event.clientY, id:event.pointerId };
  };
  record.onpointercancel = () => { start = null; };
  record.onpointerup = event => {
    if (!start || start.id !== event.pointerId) return;
    const dx = event.clientX - start.x, dy = event.clientY - start.y;
    start = null;
    if (Math.abs(dx) > 32 && Math.abs(dx) > Math.abs(dy)) (dx < 0 ? next : prev).click();
  };

  if (song.form !== 'vocal') {
    const guest = song.id === 'guest', surprise = song.id === 'surprise';
    show('placeholder-symbol', guest ? '✧' : '♫');
    show('placeholder-title', guest || surprise ? title : '器乐演奏');
    show('placeholder-text', guest ? '静候不期而遇。' : surprise ? '最后的惊喜，留给此刻的现场。' : '交给现场的乐手。');
    document.querySelector('.song-placeholder').hidden = false;
    return;
  }
  if (!song.sections.length) return;
  const lyrics = get('song-lyrics');
  for (const section of song.sections) {
    const verse = document.createElement('div');
    verse.className = 'song-verse';
    if (section.symbol) {
      verse.textContent = section.symbol;
      verse.setAttribute('aria-label', '间奏');
    }
    for (const line of section.lines || []) {
      const pair = document.createElement('p');
      const original = document.createElement('span');
      original.lang = 'en';
      original.textContent = line.en;
      pair.append(original);
      if (line.zh) {
        const translation = document.createElement('span');
        translation.lang = 'zh-CN';
        translation.textContent = line.zh.replace(/。$/u, '');
        pair.append(translation);
      }
      verse.append(pair);
    }
    lyrics.append(verse);
  }
  const lines = [...lyrics.querySelectorAll('p > span')];
  function fitLines() {
    const width = lyrics.getBoundingClientRect().width - 2;
    if (!width) return;
    for (const line of lines) line.style.removeProperty('font-size');
    const sizes = lines.map(line => {
      const naturalWidth = line.getBoundingClientRect().width;
      return naturalWidth > width
        ? parseFloat(getComputedStyle(line).fontSize) * width / naturalWidth
        : null;
    });
    lines.forEach((line, i) => {
      if (sizes[i] !== null) line.style.fontSize = sizes[i] + 'px';
    });
  }
  const buttons = [...document.querySelectorAll('.song-switch button')];
  buttons.forEach((button, mode) => button.addEventListener('click', () => {
    lyrics.classList.toggle('bilingual', mode === 1);
    fitLines();
    buttons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  }));
  document.querySelector('.song-reading').hidden = false;
  fitLines();
  let previousWidth = lyrics.clientWidth;
  new ResizeObserver(() => {
    if (lyrics.clientWidth === previousWidth) return;
    previousWidth = lyrics.clientWidth;
    fitLines();
  }).observe(lyrics);
  document.fonts.ready.then(fitLines);
})().catch(error => {
  console.error(error);
  document.getElementById('song-title').textContent = '曲目加载失败，请刷新重试';
});
