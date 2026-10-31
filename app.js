// Aplikacja: routing, widoki lekcji, quiz, fiszki, ściągawka, postęp (localStorage).
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const main = $('#main');

  // ───────── postęp ─────────
  const Store = {
    key: 'analiza-granice-v1',
    data: { done: {}, q: {}, c: {}, kol: '2026-11-12', kolA: '2026-11-03', course: 'analiza' },
    load() { try { const r = localStorage.getItem(this.key); if (r) Object.assign(this.data, JSON.parse(r)); } catch (e) { /* tryb prywatny — działamy bez zapisu */ } },
    save() { try { localStorage.setItem(this.key, JSON.stringify(this.data)); } catch (e) { /* j.w. */ } },
  };
  Store.load();

  // dwa osobne kursy: każdy ma własne lekcje, quiz, fiszki, ściągawkę i termin
  const COURSES = {
    analiza: { name: 'Analiza', icon: '📈', parts: [0, 1, 2, 3], topics: ['Ciągi', 'Granice funkcji', 'Ciągłość'], h1: 'Granice i ciągłość', lead: 'Twoje notatki z wykładu (40 stron) jako kurs: wyjaśnienia, interaktywne wykresy, quiz i fiszki.', dateKey: 'kol', dateLbl: 'Kolokwium (z notatek)' },
    algebra: { name: 'Algebra', icon: '🧮', parts: [4], topics: ['Logika i zbiory', 'Kresy zbiorów', 'Wyrażenia algebraiczne'], h1: 'Logika, zbiory, kresy, wyrażenia', lead: 'Materiały na kartkówkę: logika, zbiory, kresy zbiorów i wyrażenia algebraiczne — z rozpisanymi przykładami, quizem i fiszkami.', dateKey: 'kolA', dateLbl: 'Kartkówka' },
  };
  const course = () => COURSES[Store.data.course] || COURSES.analiza;
  const cLessons = () => LESSONS.filter((l) => course().parts.includes(l.part));
  const cTopics = () => course().topics;
  const cQuestions = () => QUESTIONS.filter((q) => cTopics().includes(q.topic));
  const cCards = () => CARDS.filter((c) => cTopics().includes(c.topic));
  const lessonNo = (l) => cLessons().indexOf(l) + (course().parts.includes(0) ? 0 : 1);
  const setCourse = (k) => { if (Store.data.course !== k) { Store.data.course = k; Store.save(); } };

  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const srcTag = (s) => (s === 'notes' ? '<span class="src">z notatek</span>' : s === 'add' ? '<span class="src add">uzupełnienie</span>' : '');
  const lessonLink = (id) => `<a href="#/lesson/${id}">${LESSON_BY_ID[id].title}</a>`;

  // ───────── nawigacja ─────────
  function renderNav() {
    const CL = cLessons(), doneCount = CL.filter((l) => Store.data.done[l.id]).length;
    $('#top-progress').textContent = `${course().name}: ${doneCount}/${CL.length} lekcji`;
    let h = `<div class="course-sw">${Object.entries(COURSES).map(([k, c]) => `<button class="chip ${Store.data.course === k ? 'on' : ''}" data-k="${k}">${c.icon} ${c.name}</button>`).join('')}</div><div class="nav-top">
      <a href="#/" data-r="">🏠 Start</a>
      <a href="#/quiz" data-r="quiz">✍️ Quiz</a>
      ${Store.data.course === 'analiza' ? '<a href="#/maps" data-r="maps">🧠 Mapy myśli</a>' : ''}
      <a href="#/cards" data-r="cards">🃏 Fiszki</a>
      <a href="#/cheat" data-r="cheat">📋 Ściągawka</a></div>`;
    for (const part of course().parts) {
      h += `<h4>${PARTS[part]}</h4>`;
      for (const l of CL.filter((x) => x.part === part)) {
        const n = lessonNo(l);
        h += `<a href="#/lesson/${l.id}" data-r="lesson/${l.id}"><span class="tick">${Store.data.done[l.id] ? '✓' : n}</span><span>${l.title}</span></a>`;
      }
    }
    $('#nav').innerHTML = h;
    $$('.course-sw .chip').forEach((b) => b.addEventListener('click', () => { setCourse(b.dataset.k); location.hash === '#/' ? route() : (location.hash = '#/'); }));
    markActive();
  }
  function markActive() {
    const cur = location.hash.replace(/^#\/?/, '');
    $$('#nav a').forEach((a) => a.classList.toggle('active', a.dataset.r === cur));
  }

  // ───────── lekcja ─────────
  function renderBlock(b) {
    switch (b.t) {
      case 'p': return `<p>${b.h}</p>`;
      case 'h2': return `<h2>${b.h}</h2>`;
      case 'ul': return `<ul>${b.items.map((i) => `<li>${i}</li>`).join('')}</ul>`;
      case 'raw': return b.h;
      case 'box': {
        const label = { def: 'Definicja', thm: 'Twierdzenie', warn: 'Uwaga', tip: 'Wskazówka', idea: 'Intuicja', plain: 'Na chłopski rozum' }[b.kind] || '';
        return `<div class="box ${b.kind}"><div class="box-t">${b.title || label}${srcTag(b.src)}</div>${b.h}</div>`;
      }
      case 'steps':
        return `<div class="steps"><div class="steps-h">${b.title}${srcTag(b.src)}</div>
          <div class="steps-body">${b.steps.map((s, i) => `<div class="step" data-n="${i + 1}"${i ? ' hidden' : ''}>${s}</div>`).join('')}</div>
          <div class="steps-f"><button class="btn sm next">Następny krok ▸</button><button class="btn sm ghost all">Pokaż wszystkie</button><span class="cnt" style="color:var(--muted);font-size:.85rem"></span></div></div>`;
      case 'widget':
        return `<div class="widget" data-w="${b.name}" data-arg="${b.arg || ''}"><div class="w-title">${b.title}</div><div class="w-body"></div></div>`;
      case 'check':
        return `<div class="check"><div class="check-h">Sprawdź się</div>${b.items.map((it, qi) => `
          <div class="q" data-a="${it.a}"><div class="q-text">${it.q}</div>
            <div class="opts">${it.o.map((o, oi) => `<button class="opt" data-o="${oi}">${o}</button>`).join('')}</div>
            <div class="why" hidden>${it.why}</div></div>`).join('')}</div>`;
      default: return '';
    }
  }

  function wireLesson(root) {
    $$('.steps', root).forEach((st) => {
      const steps = $$('.step', st), cnt = $('.cnt', st), next = $('.next', st), all = $('.all', st);
      const upd = () => {
        const shown = steps.filter((s) => !s.hidden).length;
        cnt.textContent = `krok ${shown} z ${steps.length}`;
        next.disabled = all.disabled = shown === steps.length;
      };
      next.addEventListener('click', () => { const s = steps.find((x) => x.hidden); if (s) { s.hidden = false; s.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); } upd(); });
      all.addEventListener('click', () => { steps.forEach((s) => (s.hidden = false)); upd(); });
      upd();
    });
    $$('.q', root).forEach((q) => {
      const ans = +q.dataset.a;
      $$('.opt', q).forEach((btn) => btn.addEventListener('click', () => {
        const pick = +btn.dataset.o;
        $$('.opt', q).forEach((b) => { b.disabled = true; if (+b.dataset.o === ans) b.classList.add('right'); });
        if (pick !== ans) btn.classList.add('wrong');
        const why = $('.why', q);
        why.hidden = false;
        why.innerHTML = (pick === ans ? '<b class="ok">Dobrze! </b>' : '<b class="no">Nie tym razem. </b>') + why.innerHTML;
      }));
    });
    $$('.widget', root).forEach((w) => {
      const fn = Widgets[w.dataset.w];
      if (fn) fn($('.w-body', w), w.dataset.arg);
    });
  }

  function renderLesson(id) {
    const l = LESSON_BY_ID[id];
    if (!l) return renderHome();
    setCourse(l.part === 4 ? 'algebra' : 'analiza');
    const CL = cLessons(), i0 = CL.indexOf(l), prev = CL[i0 - 1], next = CL[i0 + 1];
    const done = !!Store.data.done[id];
    main.innerHTML = `<article class="lesson">
      <div class="crumb">${PARTS[l.part]} · lekcja ${lessonNo(l)} z ${lessonNo(CL[CL.length - 1])}${l.pages !== '—' ? ` · notatki ${l.pages}` : ''} · ok. ${l.min} min</div>
      <h1>${l.title}</h1><p class="lead">${l.lead}</p>
      ${PLAIN[id] ? `<details class="box plain" id="plain-box"${Store.data.plainClosed ? '' : ' open'}><summary>Na chłopski rozum <small>(kliknij, by zwinąć / rozwinąć)</small></summary>${PLAIN[id]}${(PLAIN_W[id] || []).map(([n, t]) => renderBlock({ t: 'widget', name: n, title: t })).join('')}</details>` : ''}
      ${l.blocks.map(renderBlock).join('')}
      <div class="lesson-foot">
        ${prev ? `<a class="btn ghost" href="#/lesson/${prev.id}">◂ ${prev.title}</a>` : ''}
        <span class="spacer"></span>
        <button class="btn ${done ? 'good' : ''}" id="done-btn">${done ? '✓ Zrozumiałam — kliknij, by cofnąć' : 'Zrozumiałam tę lekcję ✓'}</button>
        ${next ? `<a class="btn ghost" href="#/lesson/${next.id}">${next.title} ▸</a>` : `<a class="btn ghost" href="#/quiz">Czas na quiz ▸</a>`}
      </div></article>`;
    typeset(main);
    wireLesson(main);
    const pb = $('#plain-box');
    if (pb) pb.addEventListener('toggle', () => { Store.data.plainClosed = !pb.open; Store.save(); window.dispatchEvent(new Event('resize')); });
    $('#done-btn').addEventListener('click', () => {
      Store.data.done[id] = !Store.data.done[id]; Store.save(); renderNav(); renderLesson(id);
    });
  }

  // ───────── start ─────────
  function daysTo(dateStr) {
    const t = new Date(dateStr + 'T00:00:00'), n = new Date(); n.setHours(0, 0, 0, 0);
    return Math.round((t - n) / 86400000);
  }
  function renderHome() {
    const CL = cLessons(), C = course(), CC = cCards();
    const done = CL.filter((l) => Store.data.done[l.id]).length, pct = Math.round(100 * done / CL.length);
    const nextL = CL.find((l) => !Store.data.done[l.id]);
    const qs = cQuestions().map((q) => Store.data.q[q.id]).filter(Boolean), tot = qs.reduce((s, x) => s + x.ok + x.bad, 0), ok = qs.reduce((s, x) => s + x.ok, 0);
    const known = CC.filter((c) => Store.data.c[c.id] === 'know').length;
    const dk = C.dateKey, d = daysTo(Store.data[dk]), dt = new Date(Store.data[dk] + 'T00:00:00');
    const dateTxt = dt.toLocaleDateString('pl-PL', { weekday: 'long', day: 'numeric', month: 'long' });
    main.innerHTML = `
      <div class="hero"><div>
        <div class="crumb">${C.name}</div>
        <h1>${C.h1}</h1>
        <p class="lead">${C.lead}</p>
        ${nextL ? `<a class="btn" href="#/lesson/${nextL.id}">${done ? 'Kontynuuj' : 'Zacznij'}: ${nextL.title} ▸</a>` : `<a class="btn" href="#/quiz">Wszystko przerobione — quiz! ▸</a>`}
      </div>
      <div class="card" style="min-width:260px">
        <div style="font-size:.8rem;color:var(--muted)">${C.dateLbl}</div>
        <div style="font-size:1.5rem;font-weight:700">${d >= 0 ? `za ${d} ${d === 1 ? 'dzień' : 'dni'}` : 'już było'}</div>
        <div style="color:var(--muted);margin-bottom:6px">${dateTxt}</div>
        <label style="font-size:.85rem;color:var(--muted)">zmień datę: <input type="date" id="kol" value="${Store.data[dk]}"></label>
      </div></div>

      <div class="stats">
        <div class="stat"><b>${done}/${CL.length}</b><span>lekcji zrozumianych</span><div class="bar" style="margin-top:8px"><i style="width:${pct}%"></i></div></div>
        <div class="stat"><b>${tot ? Math.round(100 * ok / tot) + '%' : '—'}</b><span>poprawnych w quizie (${tot} odp.)</span></div>
        <div class="stat"><b>${known}/${CC.length}</b><span>fiszek „umiem”</span></div>
      </div>

      <h2>Jak z tego korzystać</h2>
      <ol>
        <li><b>Czytaj lekcję po kolei</b> i baw się widżetami — to one tłumaczą „dlaczego”, a nie tylko „co”.</li>
        <li>Przykłady z notatek są rozpisane <b>krok po kroku</b> — odkrywaj kroki po jednym i spróbuj zgadnąć następny, zanim go klikniesz.</li>
        <li>Znaczniki <span class="src">z notatek</span> i <span class="src add">uzupełnienie</span> pokazują, co pochodzi z Twojego wykładu, a co dopisałam dla zrozumienia.</li>
        <li>Na koniec: <a href="#/cards">fiszki</a> na definicje i <a href="#/quiz">quiz</a> — błędne pytania zapamiętuję i możesz je powtórzyć.</li>
      </ol>

      ${C.parts.map((p) => `<h2>${PARTS[p]}</h2><div class="grid">${CL.filter((l) => l.part === p).map((l) => `
        <a class="tile ${Store.data.done[l.id] ? 'done' : ''}" href="#/lesson/${l.id}"><div class="n">Lekcja ${lessonNo(l)} · ${l.min} min</div><div class="t">${l.title}</div><div class="d">${l.lead}</div></a>`).join('')}</div>`).join('')}`;
    typeset(main);
    $('#kol').addEventListener('change', (e) => { if (e.target.value) { Store.data[dk] = e.target.value; Store.save(); renderHome(); } });
  }

  // ───────── quiz ─────────
  const quiz = { topic: 'Wszystko', n: 10, list: [], i: 0, score: 0, answered: false, log: [] };

  function wrongIds() { return cQuestions().filter((q) => Store.data.q[q.id] && Store.data.q[q.id].last === false); }

  function renderQuiz() {
    if (!['Wszystko', 'Moje błędy', ...cTopics()].includes(quiz.topic)) quiz.topic = 'Wszystko';
    quiz.list = []; quiz.i = 0;
    const wrong = wrongIds().length;
    const topics = ['Wszystko', ...cTopics(), 'Moje błędy'];
    main.innerHTML = `<div class="crumb">Quiz</div><h1>Sprawdź, ile umiesz</h1>
      <p class="lead">${cQuestions().length} pytań z całego materiału (${course().name}). Po każdej odpowiedzi dostajesz wyjaśnienie i odnośnik do lekcji.</p>
      <div class="card">
        <b>Zakres</b>
        <div class="chips" id="q-topics">${topics.map((t) => `<button class="chip ${quiz.topic === t ? 'on' : ''}" data-t="${t}">${t}${t === 'Moje błędy' ? ` (${wrong})` : ''}</button>`).join('')}</div>
        <b>Liczba pytań</b>
        <div class="chips" id="q-n">${[10, 20, 0].map((n) => `<button class="chip ${quiz.n === n ? 'on' : ''}" data-n="${n}">${n || 'wszystkie'}</button>`).join('')}</div>
        <p><button class="btn" id="q-start">Start ▸</button></p>
      </div>`;
    $$('#q-topics .chip').forEach((c) => c.addEventListener('click', () => { quiz.topic = c.dataset.t; renderQuiz(); }));
    $$('#q-n .chip').forEach((c) => c.addEventListener('click', () => { quiz.n = +c.dataset.n; renderQuiz(); }));
    $('#q-start').addEventListener('click', startQuiz);
  }

  function startQuiz() {
    let pool = cQuestions();
    if (quiz.topic === 'Moje błędy') pool = QUESTIONS.filter((q) => wrongIds().includes(q));
    else if (quiz.topic !== 'Wszystko') pool = QUESTIONS.filter((q) => q.topic === quiz.topic);
    if (!pool.length) { main.insertAdjacentHTML('beforeend', '<p class="readout">Brak pytań w tym zakresie — super! 🎉</p>'); return; }
    pool = shuffle(pool);
    if (quiz.n) pool = pool.slice(0, quiz.n);
    quiz.list = pool.map((q) => {
      const order = shuffle(q.o.map((_, i) => i));
      return { q, order };
    });
    quiz.i = 0; quiz.score = 0; quiz.log = [];
    showQuestion();
  }

  function showQuestion() {
    const item = quiz.list[quiz.i], q = item.q, total = quiz.list.length;
    main.innerHTML = `<div class="crumb">Quiz · ${q.topic}</div>
      <div class="bar" style="margin:8px 0 18px"><i style="width:${100 * quiz.i / total}%"></i></div>
      <div class="card"><div style="color:var(--muted);font-size:.85rem">Pytanie ${quiz.i + 1} z ${total}</div>
        <div class="q-text" style="font-size:1.15rem;margin:8px 0 14px">${q.q}</div>
        <div class="opts">${item.order.map((oi, pos) => `<button class="opt" data-oi="${oi}">${q.o[oi]}</button>`).join('')}</div>
        <div class="why" hidden></div>
        <p><button class="btn" id="q-next" hidden>${quiz.i + 1 < total ? 'Dalej ▸' : 'Zobacz wynik ▸'}</button></p></div>`;
    typeset(main);
    $$('.opt', main).forEach((btn) => btn.addEventListener('click', () => {
      const pick = +btn.dataset.oi, ok = pick === q.a;
      $$('.opt', main).forEach((b) => { b.disabled = true; if (+b.dataset.oi === q.a) b.classList.add('right'); });
      if (!ok) btn.classList.add('wrong');
      const rec = Store.data.q[q.id] || (Store.data.q[q.id] = { ok: 0, bad: 0, last: true });
      if (ok) { rec.ok++; quiz.score++; } else rec.bad++;
      rec.last = ok; Store.save();
      quiz.log.push({ q, ok });
      const why = $('.why', main);
      why.hidden = false;
      why.innerHTML = `${ok ? '<b class="ok">Dobrze!</b>' : '<b class="no">Niepoprawnie.</b>'} ${q.why}<br><small>Powtórka: ${lessonLink(q.lesson)}</small>`;
      typeset(why);
      $('#q-next').hidden = false;
      $('#q-next').focus();
    }));
    $('#q-next').addEventListener('click', () => { quiz.i++; quiz.i < total ? showQuestion() : showResult(); });
  }

  function showResult() {
    const total = quiz.list.length, pct = Math.round(100 * quiz.score / total);
    const wrong = quiz.log.filter((x) => !x.ok);
    const byTopic = cTopics().map((t) => { const a = quiz.log.filter((x) => x.q.topic === t); return a.length ? `<tr><td>${t}</td><td>${a.filter((x) => x.ok).length} / ${a.length}</td></tr>` : ''; }).join('');
    main.innerHTML = `<div class="crumb">Quiz · wynik</div><h1>${quiz.score} / ${total} <small style="color:var(--muted);font-weight:400">(${pct}%)</small></h1>
      <p class="lead">${pct >= 90 ? 'Świetnie! Materiał siedzi.' : pct >= 70 ? 'Dobrze — wróć do pytań, które się nie udały.' : 'Jest nad czym popracować — wróć do lekcji podlinkowanych poniżej i spróbuj jeszcze raz.'}</p>
      <div class="scroll-x"><table class="t" style="max-width:380px"><tr><th>Temat</th><th>Poprawnie</th></tr>${byTopic}</table></div>
      ${wrong.length ? `<h2>Do powtórki</h2>${wrong.map((x) => `<div class="card" style="margin:10px 0"><div class="q-text">${x.q.q}</div><div>${x.q.why}</div><small>Lekcja: ${lessonLink(x.q.lesson)}</small></div>`).join('')}` : ''}
      <p><button class="btn" id="again">Jeszcze raz</button> ${wrong.length ? '<button class="btn ghost" id="redo">Powtórz tylko błędne</button>' : ''} <a class="btn ghost" href="#/cards">Fiszki</a></p>`;
    typeset(main);
    $('#again').addEventListener('click', renderQuiz);
    const redo = $('#redo');
    if (redo) redo.addEventListener('click', () => { quiz.topic = 'Moje błędy'; startQuiz(); });
  }

  // ───────── fiszki ─────────
  const fc = { topic: 'Wszystko', deck: [], flipped: false, seen: 0, total: 0 };
  function renderCards() {
    if (!['Wszystko', 'Jeszcze nie umiem', ...cTopics()].includes(fc.topic)) fc.topic = 'Wszystko';
    const learn = cCards().filter((c) => Store.data.c[c.id] === 'learn').length;
    const topics = ['Wszystko', ...cTopics(), 'Jeszcze nie umiem'];
    main.innerHTML = `<div class="crumb">Fiszki</div><h1>Definicje i twierdzenia</h1>
      <p class="lead">${cCards().length} fiszek. Spróbuj odpowiedzieć na głos, zanim odwrócisz kartę (klik lub spacja).</p>
      <div class="chips">${topics.map((t) => `<button class="chip ${fc.topic === t ? 'on' : ''}" data-t="${t}">${t}${t === 'Jeszcze nie umiem' ? ` (${learn})` : ''}</button>`).join('')}</div>
      <p><button class="btn" id="fc-start">Start ▸</button></p>`;
    $$('.chip', main).forEach((c) => c.addEventListener('click', () => { fc.topic = c.dataset.t; renderCards(); }));
    $('#fc-start').addEventListener('click', startCards);
  }
  function startCards() {
    let pool = cCards();
    if (fc.topic === 'Jeszcze nie umiem') pool = cCards().filter((c) => Store.data.c[c.id] === 'learn' || !Store.data.c[c.id]);
    else if (fc.topic !== 'Wszystko') pool = CARDS.filter((c) => c.topic === fc.topic);
    fc.deck = shuffle(pool); fc.total = fc.deck.length; fc.done = 0; fc.flipped = false;
    showCard();
  }
  function showCard() {
    if (!fc.deck.length) {
      main.innerHTML = `<div class="crumb">Fiszki</div><h1>Koniec talii 🎉</h1><p class="lead">Przerobiłaś ${fc.total} fiszek.</p><p><button class="btn" id="again">Jeszcze raz</button> <a class="btn ghost" href="#/quiz">Quiz</a></p>`;
      $('#again').addEventListener('click', renderCards); return;
    }
    const c = fc.deck[0];
    main.innerHTML = `<div class="crumb">Fiszki · ${c.topic}</div>
      <div class="bar" style="margin:8px 0"><i style="width:${100 * fc.done / fc.total}%"></i></div>
      <div style="color:var(--muted);font-size:.85rem">Zostało ${fc.deck.length} · ${fc.done} „umiem” w tej rundzie</div>
      <div class="flash"><div class="flash-in" id="card"><div class="side">pytanie</div><div>${c.f}</div><div style="margin-top:18px;color:var(--muted);font-size:.85rem">kliknij, by odwrócić</div></div></div>
      <div id="fc-btns" hidden><button class="btn good" id="know">Umiem ✓</button> <button class="btn bad" id="learn">Jeszcze nie ✗</button> <a href="#/lesson/${c.lesson}" style="margin-left:10px">lekcja</a></div>`;
    typeset(main);
    fc.flipped = false;
    const flip = () => {
      if (fc.flipped) return; fc.flipped = true;
      const el = $('#card'); el.classList.add('back');
      el.innerHTML = `<div class="side">odpowiedź</div><div>${c.b}</div>`;
      typeset(el); $('#fc-btns').hidden = false;
    };
    $('#card').addEventListener('click', flip);
    const mark = (v) => {
      Store.data.c[c.id] = v; Store.save(); fc.deck.shift();
      if (v === 'know') fc.done++; else fc.deck.push(c);
      showCard();
    };
    $('#know').addEventListener('click', () => mark('know'));
    $('#learn').addEventListener('click', () => mark('learn'));
    cardKey = (e) => { if (e.code === 'Space') { e.preventDefault(); flip(); } };
  }
  let cardKey = null;
  document.addEventListener('keydown', (e) => { if (cardKey && location.hash === '#/cards') cardKey(e); });

  // ───────── ściągawka ─────────
  function renderCheat() {
    main.innerHTML = `<div class="crumb">Ściągawka</div><h1>Wszystko na jednej stronie</h1>
      <p class="lead">Definicje i twierdzenia z fiszek, pogrupowane tematycznie. Do powtórki tuż przed kolokwium.</p>
      <div class="cheat">${cTopics().map((t) => `<h3>${t}</h3>${CARDS.filter((c) => c.topic === t).map((c) => `<div class="row"><div class="k">${c.f}</div><div>${c.b} <a href="#/lesson/${c.lesson}">→ lekcja</a></div></div>`).join('')}`).join('')}</div>`;
    typeset(main);
  }

  // ───────── mapy myśli ─────────
  const PAL = ['#2f5bd8', '#0e9f9a', '#e0457b', '#c27a06', '#7a3fd0', '#1a9b5b', '#2b7fd9', '#d6403f'];
  const mm = { id: 'big', secret: false, sel: null };
  function mmNode(map, path) {
    let n = map.root;
    for (const i of path.split('.').slice(1)) n = n.c[+i];
    return n;
  }
  function mmHtml(node, depth, color, path) {
    const kids = node.c || [], has = kids.length > 0, open = depth <= 1;
    return `<div class="mm-item d${depth}${has ? '' : ' leaf'}${has && !open ? ' collapsed' : ''}${depth === 0 ? ' top' : ''}"${depth === 1 ? ` style="--bc:${color}"` : ''}>
      <div class="mm-row"><button class="mm-box" data-p="${path}"><span class="mm-lbl">${node.t}</span>${has && depth > 0 ? `<span class="mm-tg">${open ? '−' : '+'}</span>` : ''}</button>
      ${has ? `<div class="mm-kids">${kids.map((k, i) => mmHtml(k, depth + 1, depth === 0 ? PAL[i % PAL.length] : color, path + '.' + i)).join('')}</div>` : ''}</div></div>`;
  }
  function renderMaps() {
    const map = MAPS.find((m) => m.id === mm.id) || MAPS[0];
    main.innerHTML = `<div class="crumb">Mapy myśli</div><h1>Zobacz to w całości</h1>
      <p class="lead">Kliknij gałąź, żeby ją rozwinąć. Kliknij dowolny węzeł, żeby zobaczyć krótkie wyjaśnienie i skok do lekcji. Kolor = jedna „rodzina” pojęć.</p>
      <div class="chips" id="mm-tabs">${MAPS.map((m) => `<button class="chip ${m.id === map.id ? 'on' : ''}" data-id="${m.id}">${m.emoji} ${m.title}</button>`).join('')}</div>
      <div class="chips"><button class="chip" id="mm-open">➕ Rozwiń wszystko</button><button class="chip" id="mm-reset">➖ Zwiń do początku</button><button class="chip ${mm.secret ? 'on' : ''}" id="mm-secret">🙈 Tryb zapamiętywania (zakryj liście)</button></div>
      <div class="mm-wrap"><div class="mm${mm.secret ? ' secret' : ''}" id="mm">${mmHtml(map.root, 0, null, 'r')}</div></div>
      <div class="mm-detail card" id="mm-detail"><span style="color:var(--muted)">Kliknij węzeł, żeby zobaczyć wyjaśnienie.</span></div>
      <p style="color:var(--muted);font-size:.9rem"><b>Jak się uczyć z mapy:</b> włącz tryb zapamiętywania — najniższe poziomy zrobią się rozmyte. Spróbuj przypomnieć sobie treść, potem kliknij węzeł, żeby ją odsłonić.</p>`;
    typeset(main);
    const root = $('#mm');
    $$('#mm-tabs .chip').forEach((c) => c.addEventListener('click', () => { mm.id = c.dataset.id; renderMaps(); }));
    $('#mm-open').addEventListener('click', () => { $$('.mm-item.collapsed', root).forEach((i) => i.classList.remove('collapsed')); $$('.mm-tg', root).forEach((t) => (t.textContent = '−')); });
    $('#mm-reset').addEventListener('click', renderMaps);
    $('#mm-secret').addEventListener('click', () => { mm.secret = !mm.secret; renderMaps(); });
    $$('.mm-box', root).forEach((b) => b.addEventListener('click', () => {
      const item = b.closest('.mm-item'), node = mmNode(map, b.dataset.p);
      if (node.c && !item.classList.contains('top')) {
        item.classList.toggle('collapsed');
        const tg = $('.mm-tg', b); if (tg) tg.textContent = item.classList.contains('collapsed') ? '+' : '−';
      }
      b.classList.add('seen');
      $$('.mm-box.sel', root).forEach((x) => x.classList.remove('sel')); b.classList.add('sel');
      const l = node.l && LESSON_BY_ID[node.l];
      $('#mm-detail').innerHTML = `<div style="font-weight:700;font-size:1.05rem">${node.t}</div>${node.n ? `<p style="margin:.4em 0">${node.n}</p>` : ''}${l ? `<div><a class="btn sm ghost" href="#/lesson/${l.id}">Do lekcji: ${l.title} ▸</a></div>` : ''}${!node.n && !l ? '<span style="color:var(--muted)">Ten węzeł jest elementem większej gałęzi — rozwiń ją lub kliknij nadrzędny.</span>' : ''}`;
      typeset($('#mm-detail'));
    }));
  }

  // ───────── motyw ─────────
  const THEMES = { light: '☀️ Biały', pink: '🌸 Różowy', dark: '🌙 Ciemny' };
  const applyTheme = (t) => { document.documentElement.dataset.theme = t; window.dispatchEvent(new Event('resize')); };
  let theme = 'light';
  try { theme = localStorage.getItem('analiza-theme') || 'light'; } catch (e) { /* bez zapisu */ }
  if (!THEMES[theme]) theme = 'light';
  document.documentElement.dataset.theme = theme;
  const tsel = document.createElement('select');
  tsel.className = 'theme-sel'; tsel.setAttribute('aria-label', 'Motyw');
  tsel.innerHTML = Object.entries(THEMES).map(([k, v]) => `<option value="${k}"${k === theme ? ' selected' : ''}>${v}</option>`).join('');
  tsel.addEventListener('change', () => { try { localStorage.setItem('analiza-theme', tsel.value); } catch (e) { /* j.w. */ } applyTheme(tsel.value); });
  $('.top-right').prepend(tsel);

  // ───────── router ─────────
  function route() {
    clearRedraws();
    cardKey = null;
    document.body.classList.remove('nav-open');
    const [page, arg] = location.hash.replace(/^#\/?/, '').split('/');
    if (page === 'lesson') renderLesson(arg);
    else if (page === 'quiz') renderQuiz();
    else if (page === 'maps') renderMaps();
    else if (page === 'cards') renderCards();
    else if (page === 'cheat') renderCheat();
    else renderHome();
    renderNav();
    window.scrollTo(0, 0);
  }
  $('#menu-btn').addEventListener('click', () => document.body.classList.toggle('nav-open'));
  window.addEventListener('hashchange', route);
  route();
})();
