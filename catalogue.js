(function (root) {
  let musicNumber = 0;
  const tracks = [
    ['in-the-mood', 'In the Mood', '器乐 · 高阶版', 'rrrrr', '从开场就跟着打拍子，听听大乐团怎样把第一段节奏推起来。'],
    ['that-sunday', 'That Sunday, That Summer', '器乐', 'iiiir', '跟住主旋律，听听乐器怎么把一首情歌唱出来。'],
    ['putting-on-the-ritz', 'Puttin’ on the Ritz', '演唱', 'rvrrr', '听听歌手咬字时，哪些字正好落在拍上。'],
    ['fever', 'Fever', '演唱', 'vrvvv', '听听歌手唱完一句之后，乐队怎么接。中间那一小拍，也可以留给耳朵。'],
    ['unforgettable', 'Unforgettable', '演唱', 'vvivv', '挑一句最想记住的歌词，听听歌手怎么把它唱完整。'],
    ['too-close', 'Too Close for Comfort', '演唱', 'irvvr', '留意一句人声结束之后，耳朵最先被哪件乐器带走。'],
    ['get-happy', 'Get Happy', '演唱', 'rrrvr', '试着一边打拍子一边跟着人声，感受两者如何合在一起。'],
    ['guest', '神秘人', '待揭晓'],
    ['a-few-good-men', 'A Few Good Men', '器乐', 'riiri', '可以先跟住节拍，再挑一个器乐声部，听听它们怎么配合。'],
    ['every-night', 'Every Night at Seven', '演唱', 'rvivr', '听听人声什么时候贴着节拍走，什么时候稍稍错开。'],
    ['when-i-fall', 'When I Fall in Love', '演唱', 'vvvvv', '留意一句歌词怎样起头、怎样收住，也听听句子之间的空隙。'],
    ['natural-woman', 'A Natural Woman', '演唱', 'vvrvv', '听听哪一句唱得最想让你跟着哼，留意那里的人声和节奏。'],
    ['thats-life', 'That’s Life', '演唱', 'vrrrv', '找一句有态度的歌词，听人声怎样借着乐队的节奏把它送出来。'],
    ['deep-insight', 'Deep Insight', '原创器乐', 'iiiii', '在这首原创器乐里挑一个声部，看看它什么时候独自开口，什么时候融回合奏。'],
    ['conversation', '成员介绍、合影、对谈', '现场环节'],
    ['surprise', '惊喜曲目', '待揭晓'],
  ].map(([id, title, format, profile, note], index) => ({
    id, title, format, profile, note, half: index < 8 ? '上半场' : '下半场',
    number: format === '现场环节' ? null : `M${++musicNumber}`,
  }));

  const programmeNotes = {
    'in-the-mood': '格伦·米勒乐团在 1939 年录下这首摇摆曲。本场用高阶器乐版开场，可以听听反复出现的短旋律怎样把节奏带起来。',
    'that-sunday': '纳特·金·科尔在 1963 年发行过这首歌，唱的是一个让人难忘的夏日星期天。本场用器乐演出，让旋律来讲这段回忆。',
    'putting-on-the-ritz': '欧文·柏林写的银幕歌曲，歌名大意是「盛装亮相」。可以听听歌手怎样把一串密密的字唱进节拍里。',
    'fever': '歌里的「发烧」说的是心动。佩吉·李的版本给人声留了很多空隙，几句唱词和几次停顿就能把气氛带起来。',
    'unforgettable': '纳特·金·科尔在 1951 年录下了这首抒情歌。它像把一句「我忘不了你」放慢，唱给一个人听。',
    'too-close': '这首歌出自百老汇音乐剧《Mr. Wonderful》。它唱的是靠近一个人时，那种心动又有点招架不住的感觉。',
    'get-happy': '朱迪·加兰在 1950 年的电影《Summer Stock》里唱过这首歌。可以跟着打两下拍子，听听歌声怎样把情绪往上带。',
    'guest': '静候不期而遇。',
    'a-few-good-men': '下半场由这首器乐曲开场。可以先跟住节拍，再把耳朵交给你最想追着听的那件乐器。',
    'every-night': '这首歌出自 1951 年音乐电影《Royal Wedding》（《皇家婚礼》），由 Burton Lane 作曲、Alan Jay Lerner 作词。白天漫长而乏味，唯有每晚七点值得期待；熟悉的身影如约出现，仿佛五月归来，春天再次盛放。',
    'when-i-fall': '纳特·金·科尔也录过这首慢歌。它把爱唱得像一个郑重的承诺，可以留意长句怎样慢慢落下来。',
    'natural-woman': '艾瑞莎·富兰克林在 1967 年录下这首灵魂乐。歌声从低落唱到重新有了力量，到了副歌，情绪一下打开。',
    'thats-life': '《That’s Life》由 Dean Kay 与 Kelly Gordon 创作，Frank Sinatra 于 1966 年录下经典版本。歌里把人生的高低起伏唱得洒脱又倔强：有时得意，有时跌倒，但总能重新站起来。',
    'deep-insight': '这是下半场的一首原创器乐曲。可以挑一件乐器跟着听，留意它什么时候走到前面，什么时候回到合奏里。',
    'conversation': '介绍乐团成员，并安排合影与对谈。',
    'surprise': '最后的惊喜，留给此刻的现场。',
  };
  const questions = [
    ['音乐一响，你先听见什么？', [
      ['r', '脚已经开始打拍子了'], ['v', '歌手唱的第一句'], ['i', '乐器你一句、我一句'],
    ]],
    ['哪一刻会让你放下手机？', [
      ['v', '哎，这句唱到心里了'], ['r', '整个乐团一下合上了拍'], ['i', '咦，哪件乐器冒出来了？'],
    ]],
    ['倒回十秒，你想再听哪段？', [
      ['i', '那句还没听够的器乐旋律'], ['r', '全团把节奏推起来那段'], ['v', '歌手刚唱完，乐队接上的那段'],
    ]],
    ['散场后，你会跟朋友说哪句？', [
      ['i', '「刚才那句是谁接的？」'], ['v', '「有一句我现在还记得。」'], ['r', '「那段我一直在打拍子。」'],
    ]],
    ['这场音乐会，你想多留意哪种声音？', [
      ['r', '铜管合奏'], ['v', '贴近耳边的人声'], ['i', '乐器间的对话'],
    ]],
  ];

  const recommendable = tracks.filter(track => track.profile);

  const moods = {
    r: ['编外鼓手', '乐团没给我排班\n我的膝盖自己开工了'],
    v: ['副歌钉子户', '人已经到家了\n嘴里那句副歌还在剧院返场'],
    i: ['耳朵包打听', '刚才是谁接了萨克斯那一句？\n等会儿散场，我真要去问'],
    rv: ['踩点抢麦王', '脚下拍子一稳\n连歌手在哪儿换气我都想跟'],
    ri: ['空拍守门员', '全团突然一停\n别慌，我脚底下还数着呢'],
    vr: ['摇摆型复读机', '唱词只记住半句\n但那个拐着弯的节奏，我能哼一路'],
    vi: ['尾音收藏家', '最想打包带走的\n是歌手收声时，乐队轻轻接住的那一下'],
    ir: ['低音线卧底', '你们看台前，我跟贝斯走\n它一换步，我就知道要转弯'],
    iv: ['乐队同声传译', '歌手刚唱完，铜管就回了三声\n翻译一下：我、懂、你'],
  };

  function rankTracks(answers) {
    // The fractional bonus breaks equal match counts in favour of later answers.
    return recommendable.map(track => ({
      track,
      score: answers.reduce((sum, answer, index) =>
        sum + (answer === track.profile[index] ? 1 + 2 ** index / 32 : 0), 0),
    })).sort((left, right) => right.score - left.score).map(({ track }) => track);
  }

  function recommend(answers) {
    return rankTracks(answers)[0];
  }

  function listeningResult(answers) {
    const totals = { r: 0, v: 0, i: 0 };
    answers.forEach((answer, index) => { totals[answer] += 1 + 2 ** index / 32; });
    const [first, second] = Object.keys(totals).sort((a, b) => totals[b] - totals[a]);
    const dominant = answers.filter(answer => answer === first).length >= 4;
    const mood = dominant ? first : first + second;
    const picks = rankTracks(answers).slice(0, 3);
    return { mood, picks: recommendable.filter(track => picks.includes(track)) };
  }

  const catalogue = { tracks, programmeNotes, questions, recommendable, recommend, moods, listeningResult };
  if (typeof module === 'object') module.exports = catalogue;
  else root.catalogue = catalogue;
})(globalThis);

