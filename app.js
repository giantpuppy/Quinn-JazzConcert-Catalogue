const { tracks, programmeNotes, questions, recommendable, moods, listeningResult } = catalogue;

function element(tag, text, className) {
  const node = document.createElement(tag);
  if (text) node.textContent = text;
  if (className) node.className = className;
  return node;
}

function link(text, href, className) {
  const node = element('a', text, className);
  node.href = href;
  return node;
}

function button(text, action, className) {
  const node = element('button', text, className);
  node.type = 'button';
  node.addEventListener('click', action);
  return node;
}

const programme = document.querySelector('[data-programme]');
const params = new URL(location.href).searchParams;
const manualPicks = new Map();
const cataloguePage = document.querySelector('.catalogue-page');
const siteHeader = document.querySelector('.site-header');
if (cataloguePage && siteHeader && typeof ResizeObserver === 'function') {
  const syncHeaderHeight = () => {
    cataloguePage.style.setProperty('--header-height', `${siteHeader.offsetHeight}px`);
  };
  syncHeaderHeight();
  new ResizeObserver(syncHeaderHeight).observe(siteHeader);
}

const programmeIcons = {
  guest: 'sparkles',
  surprise: 'sparkles',
  conversation: 'messages-square',
  'in-the-mood': 'trumpet',
};

function readPicks() {
  const ids = new Set((params.get('picks') || '').split(','));
  const picks = recommendable.filter(track => ids.has(track.id));
  return picks.length === 3 && ids.size === 3 ? picks : [];
}

function setTrackMark(control, picked) {
  control.setAttribute('aria-pressed', String(picked));
}

function markProgramme(picks) {
  const pickedIds = new Set(picks.map(track => track.id));
  for (const row of programme.querySelectorAll('li[id]')) {
    const control = row.querySelector('.track-marker');
    setTrackMark(control, manualPicks.get(row.id) ?? pickedIds.has(row.id));
  }
}

if (programme) {
  for (const half of ['上半场', '下半场']) {
    const section = element('section', '', 'programme-act');
    section.append(element(programme.classList.contains('programme-grid') ? 'h3' : 'h2', half));
    const list = element('ol');
    for (const track of tracks.filter(item => item.half === half)) {
      const row = element('li');
      row.id = track.id;
      const title = element('span', track.title);
      if (track.profile) title.lang = 'en';
      const icon = element('kubai-icon', '', 'programme-icon');
      icon.setAttribute('name', programmeIcons[track.id] || (track.format === '演唱' ? 'mic-vocal' : 'music'));
      icon.setAttribute('size', '36');
      icon.setAttribute('trigger', 'parent');
      icon.setAttribute('aria-hidden', 'true');
      const marker = button('', () => {
        const picked = marker.getAttribute('aria-pressed') !== 'true';
        manualPicks.set(track.id, picked);
        setTrackMark(marker, picked);
      }, 'track-marker');
      marker.setAttribute('aria-label', `圈出《${track.title}》`);
      marker.append(icon);
      const caption = element('span', '', 'track-caption');
      const meta = element('small', '', 'track-meta');
      if (track.number) meta.append(element('span', track.number, 'track-code'));
      meta.append(element('span', track.format));
      caption.append(title, meta);
      if (!track.number) {
        row.append(marker, caption);
        list.append(row);
        continue;
      }
      const detailLink = link('', `song.html?id=${encodeURIComponent(track.id)}`, 'track-detail-link');
      detailLink.setAttribute('aria-label', `查看《${track.title}》的曲目内页`);
      detailLink.append(caption, element('span', '›', 'track-chevron'));
      row.append(marker, detailLink);
      list.append(row);
    }
    section.append(list);
    programme.append(section);
  }
  markProgramme(readPicks());
  function revealTrack() {
    const row = document.getElementById(location.hash.slice(1));
    if (row && programme.contains(row)) {
      requestAnimationFrame(() => row.scrollIntoView());
    }
  }
  revealTrack();
  window.addEventListener('hashchange', revealTrack);
}

function addSharing(container, actions, href, copyOnly = false) {
  const status = element('p', '', 'meta');
  status.setAttribute('role', 'status');
  const copyField = element('input', '', 'copy-field');
  copyField.hidden = true;
  copyField.readOnly = true;
  copyField.setAttribute('aria-label', '推荐链接');
  actions.append(button(copyOnly ? '复制歌单链接' : '分享这条推荐', async () => {
    if (location.protocol === 'file:') {
      status.textContent = '这是本地预览。发布后，可从这里分享公开链接。';
      return;
    }
    const url = new URL(href, location.href).href;
    if (!copyOnly && navigator.share) {
      try {
        await navigator.share({ title: '爵妙人生｜为你圈出的曲目', url });
        return;
      } catch (error) {
        if (error.name === 'AbortError') return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      status.textContent = '推荐链接已复制。';
    } catch {
      copyField.hidden = false;
      copyField.value = url;
      copyField.focus();
      copyField.select();
      status.textContent = '可以复制这条链接。';
    }
  }, 'secondary'));
  container.append(actions, status, copyField);
}

async function playlistPoster(name, quote, picks) {
  const canvas = document.createElement('canvas');
  canvas.width = 900;
  canvas.height = 1120;
  const ctx = canvas.getContext('2d');
  function print(text, x, y, font, color, maxWidth = 752) {
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.fillText(text, x, y, maxWidth);
  }
  ctx.fillStyle = '#241d1c';
  ctx.fillRect(0, 0, 900, 1120);
  ctx.fillStyle = '#151212';
  ctx.beginPath();
  ctx.arc(840, 65, 334, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#443736';
  for (let radius = 80; radius < 333; radius += 9) {
    ctx.beginPath();
    ctx.arc(840, 65, radius, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.fillStyle = '#873442';
  ctx.beginPath();
  ctx.arc(840, 65, 74, 0, Math.PI * 2);
  ctx.fill();
  const gold = '#e8c997', cream = '#f7ead5';
  const logo = new Image();
  logo.src = 'assets/wordmark.png';
  try {
    await logo.decode();
    ctx.drawImage(logo, 62, 42, 292, 292 * logo.naturalHeight / logo.naturalWidth);
  } catch {
    print('爵妙人生', 72, 104, 'bold 45px serif', cream);
  }
  print('今晚我的爵士猫身份', 74, 267, '30px sans-serif', gold);
  print(name, 68, 366, 'bold 78px serif', cream);
  ctx.font = '32px sans-serif';
  let line = '', y = 430;
  for (const character of quote) {
    if (ctx.measureText(line + character).width > 752) {
      print(line, 74, y, '32px sans-serif', cream);
      line = '';
      y += 44;
    }
    line += character;
  }
  print(line, 74, y, '32px sans-serif', cream);
  picks.forEach((track, index) => {
    const y = 580 + index * 110;
    print(track.number, 74, y, '32px Georgia', gold, 90);
    print(track.title, 178, y, 'italic bold 48px Georgia, serif', cream, 650);
    ctx.fillStyle = '#5d4c43';
    ctx.fillRect(74, y + 34, 752, 2);
  });
  print('苗梦初 × RJ 爵士大乐团', 74, 935, 'bold 35px serif', cream);
  print('11.28  19:30   久事·上海商城剧院', 74, 1000, '29px sans-serif', gold);
  return canvas;
}

function addPlaylistShare(container, actions, name, quote, picks, href) {
  const dialog = element('dialog', '', 'playlist-share');
  dialog.setAttribute('aria-label', '分享我的爵士歌单');
  const top = element('div', '', 'share-heading');
  top.append(element('strong', '分享歌单'), button('关闭', () => dialog.close(), 'secondary'));
  const frame = element('div', '', 'share-art');
  const image = element('img');
  image.alt = [name, quote, ...picks.map(track => track.title)].join(' · ');
  const canvas = element('canvas');
  canvas.width = 900;
  canvas.height = 1120;
  canvas.hidden = true;
  canvas.setAttribute('aria-label', image.alt);
  const label = element('label', '图片署名（选填）', 'signature-field');
  const input = element('input');
  input.type = 'text';
  input.maxLength = 32;
  input.placeholder = '你的名字';
  const fontStatus = element('small');
  fontStatus.setAttribute('role', 'status');
  label.append(input, fontStatus);
  label.hidden = true;
  let original;
  let chineseFont;
  let fontReady = false;
  function drawSignature() {
    const ctx = canvas.getContext('2d');
    ctx.drawImage(original, 0, 0);
    const signature = input.value.trim();
    if (!signature) return;
    ctx.save();
    ctx.font = '120px "Ma Shan Zheng", "Buchaner Vagancy", serif';
    const metrics = ctx.measureText(signature);
    const left = metrics.actualBoundingBoxLeft, right = metrics.actualBoundingBoxRight;
    const ascent = metrics.actualBoundingBoxAscent, descent = metrics.actualBoundingBoxDescent;
    const scale = Math.min(1, 360 / Math.max(1, left + right), 132 / Math.max(1, ascent + descent));
    // This rectangle lies entirely on the visible vinyl, clear of the logo and caption.
    ctx.translate(715, 101);
    ctx.scale(scale, scale);
    ctx.fillStyle = '#f7ead5';
    ctx.fillText(signature, (left - right) / 2, (ascent - descent) / 2);
    ctx.restore();
  }
  function loadChineseFont() {
    if (!chineseFont) {
      chineseFont = document.fonts.load('120px "Ma Shan Zheng"', '苗').then(faces => {
        if (!faces.length) throw new Error('Chinese font unavailable');
        fontReady = true;
        fontStatus.textContent = '';
        drawSignature();
        return true;
      }).catch(() => {
        chineseFont = null;
        if (needsChineseFont()) fontStatus.textContent = '手写字体加载失败，点确认保存重试';
        return false;
      });
    }
    return chineseFont;
  }
  function needsChineseFont() {
    return !fontReady && /\p{Script=Han}/u.test(input.value);
  }
  function prepareSignature() {
    fontStatus.textContent = needsChineseFont() ? '正在加载中文手写体…' : '';
    if (needsChineseFont()) loadChineseFont();
    drawSignature();
  }
  input.addEventListener('input', prepareSignature);
  function editSignature() {
    label.hidden = false;
    image.hidden = true;
    canvas.hidden = false;
    drawSignature();
    save.textContent = '确认保存图片';
    input.focus();
    loadChineseFont();
  }
  const edit = button('', editSignature, 'signature-hit');
  edit.setAttribute('aria-label', '在唱片上署名');
  frame.append(image, canvas, edit);
  const controls = element('div', '', 'share-controls');
  const save = link('保存歌单图片', '#', 'primary');
  save.download = '爵妙人生-' + name + '.png';
  save.addEventListener('click', event => {
    if (label.hidden) {
      event.preventDefault();
      editSignature();
      return;
    }
    if (needsChineseFont()) {
      event.preventDefault();
      fontStatus.textContent = '正在加载中文手写体…';
      loadChineseFont().then(ready => { if (ready && dialog.open && !label.hidden) save.click(); });
      return;
    }
    drawSignature();
    image.src = canvas.toDataURL('image/png');
    save.href = image.src;
    label.hidden = true;
    canvas.hidden = true;
    image.hidden = false;
    save.textContent = '保存歌单图片';
  });
  dialog.addEventListener('close', () => {
    label.hidden = true;
    canvas.hidden = true;
    image.hidden = false;
    save.textContent = '保存歌单图片';
  });
  input.addEventListener('keydown', event => {
    if (event.key === 'Enter' && !event.isComposing) save.click();
  });
  controls.append(save);
  dialog.append(top, frame, label);
  const local = location.protocol === 'file:' || ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname);
  if (local) dialog.append(controls);
  else addSharing(dialog, controls, href, true);
  actions.append(button('分享歌单', async () => {
    if (!image.hasAttribute('src')) {
      [original] = await Promise.all([
        playlistPoster(name, quote, picks),
        document.fonts.load('120px "Buchaner Vagancy"').catch(() => []),
      ]);
      image.src = original.toDataURL('image/png');
      save.href = image.src;
    }
    if (!dialog.open) dialog.showModal();
  }, 'secondary'));
  container.append(actions, dialog);
}

function renderListeningResult(container, { mood, picks }, restart) {
  const [name, description] = moods[mood];
  const heading = element('h2', name, 'result-title');
  heading.tabIndex = -1;
  const editionHead = element('header', '', 'edition-head');
  editionHead.append(element('p', '你的爵士猫身份'), heading, element('p', description));
  const list = element('ol', '', 'result-tracks');
  const query = new URLSearchParams({ mood, picks: picks.map(track => track.id).join(',') });

  function programmeLink(text, track, className) {
    const target = `#${track.id}`;
    const anchor = link(text, `index.html?${query}${target}`, className);
    if (programme) {
      anchor.href = target;
      anchor.addEventListener('click', event => {
        if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
        markProgramme(picks);
        const row = document.getElementById(track.id);
        if (row) row.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    }
    return anchor;
  }

  for (const track of picks) {
    const row = element('li');
    const entry = programmeLink('', track);
    const title = element('strong', track.title);
    title.lang = 'en';
    const number = element('span', track.number, 'track-number');
    entry.append(number, title);
    row.append(entry);
    list.append(row);
  }
  const actions = element('div', '', 'actions');
  const circle = programmeLink('去节目单看这三首', picks[0], 'primary');
  actions.append(circle, restart ? button('再测一次', restart, 'secondary')
    : link('再测一次', 'index.html#quiz', 'secondary'));
  const stub = element('div', '', 'edition-body');
  stub.append(list);
  addPlaylistShare(stub, actions, name, description, picks, `result.html?${query}`);
  container.classList.add('result-panel', 'listening-edition');
  container.replaceChildren(editionHead, stub);
  return heading;
}

const quiz = document.querySelector('[data-quiz]');
if (quiz) {
  let step = 0;
  const answers = [];

  function restart() {
    step = 0;
    answers.length = 0;
    quiz.classList.remove('result-panel', 'listening-edition');
    if (programme) markProgramme([]);
    showQuestion();
  }

  function showQuestion(moveFocus = true) {
    const [title, options] = questions[step];
    const question = element('h3', title, 'question-title');
    question.tabIndex = -1;
    question.setAttribute('aria-label', `第 ${step + 1} 题，共 ${questions.length} 题。 ${title}`);
    const count = element('p', `${step + 1} / ${questions.length}`, 'question-count');
    count.style.setProperty('--progress', ((step + 1) / questions.length * 100) + '%');
    count.setAttribute('aria-hidden', 'true');
    const choices = element('div', '', 'choices');
    function choose(value) {
      answers[step] = value;
      if (step === questions.length - 1) {
        const outcome = listeningResult(answers);
        if (programme) {
          markProgramme(outcome.picks);
          renderListeningResult(quiz, outcome, restart).focus();
        } else {
          const query = new URLSearchParams({
            mood: outcome.mood, picks: outcome.picks.map(track => track.id).join(','),
          });
          location.href = `result.html?${query}`;
        }
        return;
      }
      step += 1;
      showQuestion();
    }
    for (const [value, label] of options) {
      const choice = button(label, async () => {
        if (!quiz.closest('.catalogue-quiz') || matchMedia('(prefers-reduced-motion: reduce)').matches) {
          choose(value);
          return;
        }
        if (quiz.inert) return;
        quiz.inert = true;
        for (const item of choices.children) item.setAttribute('aria-pressed', String(item === choice));
        try {
          await quiz.animate([{opacity:1},{opacity:0}], {duration:190, easing:'ease-out'}).finished;
        } finally {
          quiz.inert = false;
          choose(value);
          quiz.animate([{opacity:0},{opacity:1}], {duration:190, easing:'ease-out'});
        }
      }, 'option');
      if (answers[step] === value) choice.setAttribute('aria-pressed', 'true');
      choices.append(choice);
    }
    const back = button('上一题', () => {
      step -= 1;
      showQuestion();
    }, 'quiz-back');
    back.hidden = step === 0;
    quiz.replaceChildren(count, question, choices, back);
    if (moveFocus) question.focus({ preventScroll: true });
  }

  showQuestion(false);
}

const result = document.querySelector('[data-result]');
if (result) {
  const picks = readPicks();
  const mood = params.get('mood');
  const track = recommendable.find(item => item.id === params.get('track'));
  if (picks.length && Object.hasOwn(moods, mood)) {
    renderListeningResult(result, { mood, picks });
  } else if (track) {
    document.title = `${track.title}｜爵妙人生`;
    const heading = element('h2', track.title, 'result-title');
    heading.lang = 'en';
    const actions = element('div', '', 'actions');
    actions.append(link('在节目单里找这首', `index.html#${track.id}`, 'primary'),
      link('再测一次', 'index.html#quiz', 'secondary'));
    result.append(heading, element('p', track.half, 'meta'), element('p', track.note));
    addSharing(result, actions, `result.html?track=${track.id}`);
  } else {
    result.append(element('p', '测一测，找到你的三首歌。'),
      link('去选一选', 'index.html#quiz', 'primary'));
  }
}

const catalogueHeader = document.querySelector('.site-header');
if (catalogueHeader) {
  const page = document.querySelector('.catalogue-page');
  const sizeHeader = () => page.style.setProperty('--header-height', catalogueHeader.getBoundingClientRect().height + 'px');
  sizeHeader();
  new ResizeObserver(sizeHeader).observe(catalogueHeader);
}

// Only settle gestures between the two opening screens. Reading positions are unrestricted.
if (catalogueHeader) {
  const poster = document.querySelector('.poster-final');
  const quizSection = document.querySelector('.catalogue-quiz');
  const mobileScroll = document.querySelector('.catalogue-scroll');
  const scroller = () => matchMedia('(max-width:51.999rem)').matches ? mobileScroll : document.scrollingElement;
  let previous = scroller().scrollTop;
  let direction = 0;
  let timer;
  let touching = false;

  function settleOpening() {
    if (touching || !direction) return;
    const top = catalogueHeader.getBoundingClientRect().bottom;
    const quizBox = quizSection.getBoundingClientRect();
    const down = direction > 0;
    direction = 0;
    let delta;
    if (quizBox.top > top + 2) {
      delta = down ? quizBox.top - top : poster.getBoundingClientRect().top - top;
    } else if (quizBox.bottom > top + 2 && quizBox.bottom < innerHeight - 2) {
      delta = down ? quizBox.bottom - top : quizBox.top - top;
    }
    if (Math.abs(delta) > 2) {
      scroller().scrollBy({top:delta, behavior:matchMedia('(prefers-reduced-motion:reduce)').matches ? 'instant' : 'smooth'});
    }
  }

  function afterScroll() {
    const current = scroller().scrollTop;
    if (current === previous) return;
    direction = Math.sign(current - previous);
    previous = current;
    clearTimeout(timer);
    timer = setTimeout(settleOpening, 180);
  }
  mobileScroll.addEventListener('scroll', afterScroll, {passive:true});
  window.addEventListener('scroll', afterScroll, {passive:true});
  window.addEventListener('touchstart', () => { touching = true; }, {passive:true});
  function release() {
    touching = false;
    clearTimeout(timer);
    timer = setTimeout(settleOpening, 180);
  }
  window.addEventListener('touchend', release, {passive:true});
  window.addEventListener('touchcancel', release, {passive:true});
}
