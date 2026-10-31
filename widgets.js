// Interaktywne widżety używane w lekcjach. Każdy dostaje element kontenera (el) i argument (arg).
const Widgets = {};
const _redraws = [];
function onRedraw(fn) { _redraws.push(fn); }
function clearRedraws() { _redraws.length = 0; }
window.addEventListener('resize', () => _redraws.forEach((f) => f()));

function typeset(root) {
  if (window.renderMathInElement) {
    renderMathInElement(root, {
      delimiters: [{ left: '$$', right: '$$', display: true }, { left: '$', right: '$', display: false }],
      throwOnError: false,
    });
  }
}

const GOOD_A = 'rgba(26,155,91,.16)';
const ACC_A = 'rgba(47,91,216,.13)';

// ───────────────────────── 1. ε–N dla ciągu ─────────────────────────
Widgets.epsN = (el) => {
  const S = [
    { label: 'aₙ = (6n + sin²n)/(3n − 2)', f: (n) => (6 * n + Math.sin(n) ** 2) / (3 * n - 2), L: 2 },
    { label: 'aₙ = (−1)ⁿ / n', f: (n) => (n % 2 ? -1 : 1) / n, L: 0 },
    { label: 'aₙ = 1/n', f: (n) => 1 / n, L: 0 },
    { label: 'aₙ = (−1)ⁿ  (granica nie istnieje!)', f: (n) => (n % 2 ? -1 : 1), L: 0 },
  ];
  el.innerHTML = `
    <p class="w-hint">Przesuń ε. Pas wokół granicy L robi się węższy — za każdym razem szukamy numeru N, od którego <b>wszystkie</b> wyrazy do niego wpadają.</p>
    <div class="controls">
      <label>Ciąg: <select class="sel">${S.map((s, i) => `<option value="${i}">${s.label}</option>`).join('')}</select></label>
      <label>ε = <input class="eps" type="range" min="0" max="100" value="35"><span class="val ev"></span></label>
    </div>
    <canvas class="plot"></canvas>
    <div class="legend"><span><i style="background:var(--good)"></i>wyraz w pasie (L−ε, L+ε)</span><span><i style="background:var(--bad)"></i>wyraz poza pasem</span></div>
    <div class="readout"></div>`;
  const q = (s) => el.querySelector(s);
  const plot = new Plot(q('canvas'));
  function draw() {
    const s = S[+q('.sel').value];
    const eps = Math.pow(10, -2 * q('.eps').value / 100);
    q('.ev').textContent = fmt(eps, 3);
    let last = 0;
    for (let n = 1; n <= 3000; n++) if (Math.abs(s.f(n) - s.L) >= eps) last = n;
    const none = last >= 2990;
    const nmax = none ? 60 : Math.max(20, Math.min(200, Math.round(last * 1.5 + 10)));
    plot.set({ xmin: 0, xmax: nmax + 1, ymin: s.L - eps * 2.2, ymax: s.L + eps * 2.2 }).clear();
    plot.band(s.L - eps, s.L + eps, GOOD_A).axes();
    plot.hline(s.L, { color: plot.col.accent, dash: [6, 4] });
    plot.text(0.3, s.L - eps * 0.45, 'L = ' + fmt(s.L), { color: plot.col.accent, align: 'left' });
    if (!none && last > 0) {
      plot.vline(last + 0.5, { color: plot.col.warn, dash: [4, 4] });
      plot.text(last + 0.5, s.L + eps * 1.9, 'N = ' + last, { color: plot.col.warn, dx: 6 });
    }
    for (let n = 1; n <= nmax; n++) {
      const y = s.f(n), inside = Math.abs(y - s.L) < eps;
      plot.dot(n, y, { fill: inside ? plot.col.good : plot.col.bad, r: 3.2 });
    }
    q('.readout').innerHTML = none
      ? `Dla ε = <b>${fmt(eps)}</b> wyrazy <b class="no">wciąż wychodzą poza pas</b> — nie da się dobrać żadnego N. To właśnie znaczy, że 0 <b>nie jest</b> granicą tego ciągu (żadna liczba nie jest).`
      : `Dla ε = <b>${fmt(eps)}</b> bierzemy <b class="ok">N = ${last}</b>: każdy wyraz o numerze n &gt; ${last} leży w pasie. Im mniejsze ε, tym większe N — ale <i>zawsze</i> się da.`;
  }
  el.querySelectorAll('input,select').forEach((i) => i.addEventListener('input', draw));
  draw(); onRedraw(() => { plot.resize(); draw(); });
};

// ───────────────────────── 2. Twierdzenie o trzech ciągach ─────────────────────────
Widgets.squeeze = (el) => {
  const E = [
    { label: '(6n + sin²n)/(3n − 2)  →  2', lo: (n) => 6 * n / (3 * n - 2), mid: (n) => (6 * n + Math.sin(n) ** 2) / (3 * n - 2), hi: (n) => (6 * n + 1) / (3 * n - 2), L: 2, y: [1.7, 4.2], lt: '6n/(3n−2)', ht: '(6n+1)/(3n−2)' },
    { label: 'cos(n²)/n³  →  0', lo: (n) => -1 / n ** 3, mid: (n) => Math.cos(n * n) / n ** 3, hi: (n) => 1 / n ** 3, L: 0, y: [-1.05, 1.05], lt: '−1/n³', ht: '1/n³' },
    { label: 'sin(n)/n  →  0', lo: (n) => -1 / n, mid: (n) => Math.sin(n) / n, hi: (n) => 1 / n, L: 0, y: [-1.05, 1.05], lt: '−1/n', ht: '1/n' },
  ];
  el.innerHTML = `
    <p class="w-hint">Niebieski ciąg jest „wciśnięty” między dwa ciągi-policjantów. Gdy policjanci zbiegają do tej samej liczby, środkowy nie ma wyjścia.</p>
    <div class="controls">
      <label>Przykład: <select class="sel">${E.map((s, i) => `<option value="${i}">${s.label}</option>`).join('')}</select></label>
      <label>pokaż n do: <input class="nm" type="range" min="8" max="80" value="30"><span class="val nv"></span></label>
    </div>
    <canvas class="plot"></canvas>
    <div class="legend"><span><i style="background:var(--accent2)"></i>dolny aₙ</span><span><i style="background:var(--accent)"></i>środkowy bₙ (badany)</span><span><i style="background:var(--warn)"></i>górny cₙ</span></div>
    <div class="readout"></div>`;
  const q = (s) => el.querySelector(s);
  const plot = new Plot(q('canvas'));
  function draw() {
    const e = E[+q('.sel').value], nm = +q('.nm').value;
    q('.nv').textContent = nm;
    plot.set({ xmin: 0, xmax: nm + 1, ymin: e.y[0], ymax: e.y[1] }).clear().axes();
    plot.hline(e.L, { color: plot.col.muted, dash: [6, 4] });
    for (let n = 1; n <= nm; n++) {
      plot.dot(n, e.lo(n), { fill: plot.col.accent2, r: 2.6 });
      plot.dot(n, e.hi(n), { fill: plot.col.warn, r: 2.6 });
      plot.dot(n, e.mid(n), { fill: plot.col.accent, r: 3.6 });
    }
    q('.readout').innerHTML = `Dolny: <b>${e.lt}</b> → ${fmt(e.L)}, górny: <b>${e.ht}</b> → ${fmt(e.L)}. Dla n = ${nm}: ${fmt(e.lo(nm), 4)} ≤ <b>${fmt(e.mid(nm), 4)}</b> ≤ ${fmt(e.hi(nm), 4)}. Środkowy ciąg też zmierza do <b class="ok">${fmt(e.L)}</b>.`;
  }
  el.querySelectorAll('input,select').forEach((i) => i.addEventListener('input', draw));
  draw(); onRedraw(() => { plot.resize(); draw(); });
};

// ───────────────────────── 3. qⁿ ─────────────────────────
Widgets.qn = (el) => {
  el.innerHTML = `
    <p class="w-hint">Ciąg geometryczny qⁿ. Przesuń q i zobacz wszystkie przypadki z notatek — zwłaszcza okolice q = 1 i q = −1.</p>
    <div class="controls"><label>q = <input class="q" type="range" min="-250" max="250" value="80"><span class="val qv"></span></label></div>
    <canvas class="plot"></canvas>
    <div class="readout"></div>`;
  const q = (s) => el.querySelector(s);
  const plot = new Plot(q('canvas'));
  function draw() {
    const qq = +q('.q').value / 100;
    q('.qv').textContent = fmt(qq, 2);
    const big = Math.abs(qq) > 1.0001;
    plot.set({ xmin: -0.5, xmax: 25.5, ymin: big ? -4 : -1.3, ymax: big ? 4 : 1.3 }).clear().axes();
    for (let n = 0; n <= 25; n++) plot.dot(n, Math.pow(qq, n), { fill: plot.col.accent, r: 3.4 });
    let t;
    const a = Math.abs(qq);
    if (a < 1) t = `|q| &lt; 1: qⁿ → <b class="ok">0</b>. Wyrazy kurczą się do zera (dowód z notatek: |q|ⁿ jest malejący i ograniczony, więc ma granicę A, a z równania A(|q|−1)=0 wychodzi A = 0).`;
    else if (Math.abs(qq - 1) < 0.005) t = `q = 1: ciąg stały 1, 1, 1, … → <b class="ok">1</b>.`;
    else if (qq > 1) t = `q &gt; 1: qⁿ → <b class="ok">+∞</b>. Dla każdego A (większego od 0) wystarczy n &gt; log<sub>q</sub>A, czyli N = ⌈log<sub>q</sub>A⌉.`;
    else if (Math.abs(qq + 1) < 0.005) t = `q = −1: ciąg 1, −1, 1, −1, … jest ograniczony, ale <b class="no">granica nie istnieje</b>.`;
    else t = `q &lt; −1 (np. (−2)ⁿ): wyrazy rosną co do modułu i zmieniają znak — <b class="no">granica nie istnieje</b> (ani +∞, ani −∞).`;
    q('.readout').innerHTML = t;
  }
  q('.q').addEventListener('input', draw);
  draw(); onRedraw(() => { plot.resize(); draw(); });
};

// ───────────────────────── 4. (1 + c/n)ⁿ → e^c ─────────────────────────
Widgets.elimit = (el) => {
  el.innerHTML = `
    <p class="w-hint">Sprawdź, że (1 + c/n)ⁿ zmierza do e<sup>c</sup>. Przykład z notatek to c = −3/2 = −1,5 (czyli (1 − 15/(10n))ⁿ).</p>
    <div class="controls"><label>c = <input class="c" type="range" min="-30" max="30" value="10"><span class="val cv"></span></label></div>
    <canvas class="plot"></canvas>
    <div class="legend"><span><i style="background:var(--accent)"></i>(1 + c/n)ⁿ</span><span><i style="background:var(--warn)"></i>e<sup>c</sup> (granica)</span></div>
    <div class="readout"></div>`;
  const q = (s) => el.querySelector(s);
  const plot = new Plot(q('canvas'));
  function draw() {
    const c = +q('.c').value / 10;
    q('.cv').textContent = fmt(c, 1);
    const n0 = Math.max(1, Math.floor(-c) + 1), nmax = 60, L = Math.exp(c);
    const vals = [];
    for (let n = n0; n <= nmax; n++) vals.push(Math.pow(1 + c / n, n));
    const lo = Math.min(L, ...vals), hi = Math.max(L, ...vals), pad = (hi - lo) * 0.12 + 1e-9;
    plot.set({ xmin: 0, xmax: nmax + 1, ymin: lo - pad, ymax: hi + pad }).clear().axes();
    plot.hline(L, { color: plot.col.warn, dash: [6, 4] });
    for (let n = n0; n <= nmax; n++) plot.dot(n, vals[n - n0], { fill: plot.col.accent, r: 3 });
    const row = [10, 100, 1000, 1e6].map((n) => `n=${n >= 1e6 ? '10⁶' : n}: <b>${fmt(Math.pow(1 + c / n, n), 5)}</b>`).join(' &nbsp;·&nbsp; ');
    q('.readout').innerHTML = `${row}<br>Granica: e<sup>${fmt(c, 1)}</sup> = <b class="ok">${fmt(L, 5)}</b>`;
  }
  q('.c').addEventListener('input', draw);
  draw(); onRedraw(() => { plot.resize(); draw(); });
};

// ───────────────────────── 5. Warunek Cauchy’ego ─────────────────────────
Widgets.cauchy = (el) => {
  el.innerHTML = `
    <p class="w-hint">Ciąg sum częściowych aₙ = Σ cos(k)/3ᵏ. Nie znamy jego granicy, a mimo to pokażemy, że jest zbieżny: od pewnego N wszystkie wyrazy są <i>blisko siebie</i>.</p>
    <div class="controls"><label>ε = <input class="eps" type="range" min="0" max="100" value="40"><span class="val ev"></span></label></div>
    <canvas class="plot"></canvas>
    <div class="readout"></div>`;
  const q = (s) => el.querySelector(s);
  const plot = new Plot(q('canvas'));
  const A = []; let s = 0;
  for (let k = 1; k <= 80; k++) { s += Math.cos(k) / Math.pow(3, k); A[k] = s; }
  function draw() {
    const eps = Math.pow(10, -0.3 - 3.2 * q('.eps').value / 100);
    q('.ev').textContent = eps < 0.001 ? eps.toExponential(1).replace('.', ',') : fmt(eps, 4);
    const N = Math.max(1, Math.ceil(Math.log(1 / (2 * eps)) / Math.log(3)));
    let mn = Infinity, mx = -Infinity;
    for (let k = N; k <= 80; k++) { mn = Math.min(mn, A[k]); mx = Math.max(mx, A[k]); }
    const D = mx - mn;
    const nshow = Math.min(40, Math.max(15, N + 8));
    let lo = Infinity, hi = -Infinity;
    for (let k = 1; k <= nshow; k++) { lo = Math.min(lo, A[k]); hi = Math.max(hi, A[k]); }
    const pad = (hi - lo) * 0.15 + 1e-9;
    plot.set({ xmin: 0, xmax: nshow + 1, ymin: lo - pad, ymax: hi + pad }).clear().axes();
    plot.vband(N - 0.5, nshow + 1, GOOD_A);
    plot.vline(N - 0.5, { color: plot.col.warn, dash: [4, 4] });
    for (let k = 1; k <= nshow; k++) plot.dot(k, A[k], { fill: k >= N ? plot.col.good : plot.col.accent, r: 3.4 });
    q('.readout').innerHTML = `Z notatek: |aᵣ − aₛ| &lt; 1/(2·3ˢ), więc wystarczy N = ⌈log₃(1/(2ε))⌉ = <b>${N}</b>.<br>
      Sprawdzenie liczbowe: dla wszystkich wyrazów o numerach ≥ ${N} największa odległość między nimi to <b>${D < 1e-4 ? D.toExponential(2).replace('.', ',') : fmt(D, 5)}</b> ${D < eps ? `&lt; ε <b class="ok">✓</b>` : `≥ ε <b class="no">✗</b>`}.`;
  }
  q('.eps').addEventListener('input', draw);
  draw(); onRedraw(() => { plot.resize(); draw(); });
};

// ───────────────────────── 6. ε–δ dla funkcji ─────────────────────────
Widgets.epsDelta = (el) => {
  const F = [
    { label: 'f(x) = (x²−1)/(x−1),  x → 1,  L = 2', f: (x) => (Math.abs(x - 1) < 1e-12 ? NaN : (x * x - 1) / (x - 1)), x0: 1, L: 2, W: 1.5, H: 1.5, n: 800 },
    { label: 'f(x) = 2x + 1,  x → 1,  L = 3', f: (x) => 2 * x + 1, x0: 1, L: 3, W: 1.5, H: 3, n: 800 },
    { label: 'f(x) = x²,  x → 2,  L = 4', f: (x) => x * x, x0: 2, L: 4, W: 1.5, H: 3, n: 800 },
    { label: 'f(x) = sin(1/x),  x → 0,  L = 0  (granica nie istnieje!)', f: (x) => (x === 0 ? NaN : Math.sin(1 / x)), x0: 0, L: 0, W: 0.3, H: 1.6, n: 3000 },
  ];
  el.innerHTML = `
    <p class="w-hint">Gra: przeciwnik wybiera ε (poziomy pas). Ty musisz znaleźć δ (pionowy pas), żeby <b>cały</b> wykres nad pasem pionowym zmieścił się w pasie poziomym. Zielone = dobrze, czerwone = wychodzi poza pas.</p>
    <div class="controls">
      <label>Funkcja: <select class="sel">${F.map((s, i) => `<option value="${i}">${s.label}</option>`).join('')}</select></label>
    </div>
    <div class="controls">
      <label>ε = <input class="eps" type="range" min="5" max="150" value="50"><span class="val ev"></span></label>
      <label>δ = <input class="del" type="range" min="1" max="200" value="120"><span class="val dv"></span></label>
      <button class="btn sm ghost best">Znajdź największe δ</button>
    </div>
    <canvas class="plot tall"></canvas>
    <div class="readout"></div>`;
  const q = (s) => el.querySelector(s);
  const plot = new Plot(q('canvas'));
  const cur = () => F[+q('.sel').value];
  const epsV = () => +q('.eps').value / 100;
  const delV = () => cur().W * (+q('.del').value) / 200;
  function good(F0, eps, d) {
    for (let k = 1; k <= 3000; k++) {
      const t = d * k / 3000;
      for (const x of [F0.x0 - t, F0.x0 + t]) {
        const y = F0.f(x);
        if (Number.isFinite(y) && Math.abs(y - F0.L) >= eps) return false;
      }
    }
    return true;
  }
  function draw() {
    const f0 = cur(), eps = epsV(), d = delV();
    q('.ev').textContent = fmt(eps, 2); q('.dv').textContent = fmt(d, 3);
    plot.set({ xmin: f0.x0 - f0.W, xmax: f0.x0 + f0.W, ymin: f0.L - f0.H, ymax: f0.L + f0.H }).clear();
    plot.band(f0.L - eps, f0.L + eps, GOOD_A);
    plot.vband(f0.x0 - d, f0.x0 + d, ACC_A);
    plot.axes();
    plot.hline(f0.L - eps, { color: plot.col.good, dash: [5, 4], width: 1.2 }).hline(f0.L + eps, { color: plot.col.good, dash: [5, 4], width: 1.2 });
    plot.vline(f0.x0 - d, { color: plot.col.accent, dash: [5, 4], width: 1.2 }).vline(f0.x0 + d, { color: plot.col.accent, dash: [5, 4], width: 1.2 });
    plot.fn(f0.f, {
      n: f0.n, jump: 1.8,
      colorAt: (x) => {
        if (Math.abs(x - f0.x0) >= d) return plot.col.muted;
        return Math.abs(f0.f(x) - f0.L) < eps ? plot.col.good : plot.col.bad;
      },
    });
    plot.dot(f0.x0, f0.L, { open: true, stroke: plot.col.ink, r: 4.5 });
    const ok = good(f0, eps, d);
    q('.readout').innerHTML = ok
      ? `Dla ε = <b>${fmt(eps, 2)}</b> i δ = <b>${fmt(d, 3)}</b>: każdy x z sąsiedztwa 0 &lt; |x − x₀| &lt; δ daje |f(x) − L| &lt; ε <b class="ok">✓ δ działa</b>. (Punkt x₀ pomijamy — dlatego otwarte kółko.)`
      : `<b class="no">✗ δ za duże</b> — w pionowym pasie są punkty wykresu poza poziomym pasem (czerwone). Zmniejsz δ albo kliknij „Znajdź największe δ”.`;
  }
  q('.best').addEventListener('click', () => {
    const f0 = cur(), eps = epsV();
    for (let v = 200; v >= 1; v--) {
      if (good(f0, eps, f0.W * v / 200)) { q('.del').value = v; draw(); return; }
    }
    q('.del').value = 1; draw();
    q('.readout').innerHTML = `<b class="no">Nie istnieje żadne δ</b> dla tego ε: niezależnie jak wąski pas pionowy weźmiemy, sin(1/x) w każdym sąsiedztwie zera przyjmuje i wartości bliskie 1, i bliskie −1. Zatem 0 nie jest granicą — i żadna inna liczba też nie.`;
  });
  el.querySelectorAll('input,select').forEach((i) => i.addEventListener('input', draw));
  draw(); onRedraw(() => { plot.resize(); draw(); });
};

// ───────────────────────── 7. Definicja Heinego ─────────────────────────
Widgets.heine = (el) => {
  const P = [
    { label: 'sin x,  x → ∞', f: Math.sin, A: { t: 'xₙ = πn', x: (n) => Math.PI * n }, B: { t: 'yₙ = π/2 + 2πn', x: (n) => Math.PI / 2 + 2 * Math.PI * n }, target: '→ ∞',
      verdict: 'Dwa ciągi dążące do ∞ dają <b>różne granice</b> (0 oraz 1). Gdyby granica istniała, byłaby jedna dla wszystkich ciągów — więc <b class="no">lim sin x nie istnieje</b>. (Tak samo cos x.)' },
    { label: '1/x,  x → 0', f: (x) => 1 / x, A: { t: 'xₙ = 1/n', x: (n) => 1 / n }, B: { t: 'yₙ = −1/n', x: (n) => -1 / n }, target: '→ 0',
      verdict: 'Z prawej f(xₙ) → +∞, z lewej f(yₙ) → −∞. Różne wyniki, więc <b class="no">lim 1/x w zerze nie istnieje</b> (istnieją tylko granice jednostronne: +∞ i −∞).' },
    { label: 'sin(1/x),  x → 0', f: (x) => Math.sin(1 / x), A: { t: 'xₙ = 1/(πn)', x: (n) => 1 / (Math.PI * n) }, B: { t: 'yₙ = 1/(π/2 + 2πn)', x: (n) => 1 / (Math.PI / 2 + 2 * Math.PI * n) }, target: '→ 0',
      verdict: 'Oba ciągi dążą do 0, ale wartości dają 0 i 1. <b class="no">Granica nie istnieje.</b> Wykres „drga” coraz szybciej tuż przy zerze.' },
    { label: '(x²−1)/(x−1),  x → 1', f: (x) => (x * x - 1) / (x - 1), A: { t: 'xₙ = 1 + 2026/n', x: (n) => 1 + 2026 / n }, B: { t: 'yₙ = 1 − 1/n', x: (n) => 1 - 1 / n }, target: '→ 1',
      verdict: 'Tym razem oba ciągi dają <b class="ok">2</b>. Dwa ciągi to nie dowód (Heine wymaga <i>każdego</i> ciągu niestałego), ale można pokazać: f(xₙ) = xₙ + 1 → 2 dla dowolnego xₙ → 1, xₙ ≠ 1. Stąd lim = 2.' },
  ];
  el.innerHTML = `
    <p class="w-hint">Według Heinego granica istnieje, gdy <b>każdy</b> ciąg xₙ → x₀ (xₙ ≠ x₀) daje ten sam wynik f(xₙ). Wystarczy więc znaleźć <b>dwa ciągi z różnymi wynikami</b>, by obalić istnienie granicy.</p>
    <div class="controls"><label>Funkcja: <select class="sel">${P.map((s, i) => `<option value="${i}">${s.label}</option>`).join('')}</select></label></div>
    <div class="scroll-x"><table class="t"></table></div>
    <div class="readout"></div>`;
  const q = (s) => el.querySelector(s);
  function draw() {
    const p = P[+q('.sel').value];
    const ns = [1, 2, 5, 10, 100, 1000, 10000, 1000000];
    let h = `<tr><th>n</th><th>${p.A.t}</th><th>f(xₙ)</th><th>${p.B.t}</th><th>f(yₙ)</th></tr>`;
    for (const n of ns) {
      const xa = p.A.x(n), xb = p.B.x(n);
      h += `<tr><td>${n >= 1e6 ? '10⁶' : n}</td><td>${fmt(xa, 5)}</td><td><b>${fmt(p.f(xa), 4)}</b></td><td>${fmt(xb, 5)}</td><td><b>${fmt(p.f(xb), 4)}</b></td></tr>`;
    }
    q('table').innerHTML = h;
    q('.readout').innerHTML = p.verdict;
  }
  q('.sel').addEventListener('input', draw);
  draw();
};

// ───────────────────────── 8. Granice jednostronne i klasyfikacja ─────────────────────────
Widgets.oneSided = (el, arg) => {
  const hole = (x) => Math.abs(x - 1) < 1e-12;
  const F = [
    { name: 'f(x) = (x²−1)/(x−1)', f: (x) => (hole(x) ? NaN : (x * x - 1) / (x - 1)), x0: 1, left: 2, right: 2, fx0: null, win: [-1, 3, -1, 4], jump: 0.9,
      kind: 'Nieciągłość usuwalna (I rodzaju)', v: 'Obie granice jednostronne wynoszą 2, ale f(1) <b>nie istnieje</b> (0 w mianowniku). To „dziura” w wykresie. Wystarczy dopisać f(1) = 2 i dostajemy funkcję ciągłą f* (przedłużenie ciągłe).' },
    { name: 'f**(x): to samo, ale f(1) = 3', f: (x) => (hole(x) ? 3 : (x * x - 1) / (x - 1)), x0: 1, left: 2, right: 2, fx0: 3, win: [-1, 3, -1, 4], jump: 0.9,
      kind: 'Nieciągłość usuwalna (I rodzaju)', v: 'Granica = 2, ale f(1) = 3 ≠ 2. Punkt „wisi w powietrzu” nad dziurą. Ciągłość wymaga <i>trzech</i> rzeczy naraz: granica lewa = granica prawa = f(x₀).' },
    { name: 'f*(x): to samo, ale f(1) = 2', f: (x) => (hole(x) ? 2 : (x * x - 1) / (x - 1)), x0: 1, left: 2, right: 2, fx0: 2, win: [-1, 3, -1, 4], jump: 0.9,
      kind: 'Funkcja ciągła w x₀', v: 'Granica lewa = granica prawa = f(1) = 2. Dziurę „załatano” — funkcja jest ciągła.' },
    { name: 'skok: f(x) = 1 dla x ≥ 0, −1 dla x < 0', f: (x) => (x >= 0 ? 1 : -1), x0: 0, left: -1, right: 1, fx0: 1, win: [-2, 2, -2, 2], jump: 0.3,
      kind: 'Skok (nieciągłość I rodzaju)', v: 'Granice jednostronne istnieją i są skończone, ale <b>różne</b> (−1 i 1), więc granica obustronna nie istnieje. Funkcji nie da się „załatać” jedną wartością.' },
    { name: 'f(x) = 1/x', f: (x) => (x === 0 ? NaN : 1 / x), x0: 0, left: -Infinity, right: Infinity, fx0: null, win: [-2, 2, -6, 6], jump: 0.9,
      kind: 'Nieciągłość II rodzaju', v: 'Granice jednostronne są <b>nieskończone</b> (−∞ z lewej, +∞ z prawej). Jeśli choć jedna granica jednostronna jest nieskończona lub nie istnieje — to II rodzaj.' },
    { name: 'f(x) = sin(1/x)', f: (x) => (x === 0 ? NaN : Math.sin(1 / x)), x0: 0, left: NaN, right: NaN, fx0: null, win: [-0.5, 0.5, -1.5, 1.5], jump: 1.5, n: 4000,
      kind: 'Nieciągłość II rodzaju', v: 'Wykres drga coraz szybciej i <b>żadna</b> z granic jednostronnych nie istnieje. To przykład II rodzaju z notatek (str. 35).' },
    { name: 'f(x) = sin x / x, f(0) = 1', f: (x) => (x === 0 ? 1 : Math.sin(x) / x), x0: 0, left: 1, right: 1, fx0: 1, win: [-12, 12, -0.4, 1.3], jump: 0.9,
      kind: 'Funkcja ciągła w x₀', v: 'Dzięki ważnej granicy lim sin x/x = 1 możemy dopisać f(0) = 1 i dostać funkcję ciągłą.' },
  ];
  const limTxt = (v) => (v === Infinity ? '+∞' : v === -Infinity ? '−∞' : Number.isNaN(v) ? 'nie istnieje' : fmt(v));
  el.innerHTML = `
    <p class="w-hint">Zbliżaj się do punktu x₀ z lewej i z prawej strony i patrz, co robi f. Potem przeczytaj klasyfikację.</p>
    <div class="controls">
      <label>Funkcja: <select class="sel">${F.map((s, i) => `<option value="${i}">${s.name}</option>`).join('')}</select></label>
      <label>odległość od x₀: <input class="t" type="range" min="0" max="100" value="20"><span class="val tv"></span></label>
    </div>
    <canvas class="plot tall"></canvas>
    <div class="legend"><span><i style="background:var(--accent2)"></i>z lewej (x₀ − t)</span><span><i style="background:var(--warn)"></i>z prawej (x₀ + t)</span></div>
    <div class="readout"></div>`;
  const q = (s) => el.querySelector(s);
  q('.sel').value = String(arg ? +arg : 0);
  const plot = new Plot(q('canvas'));
  function draw() {
    const p = F[+q('.sel').value], [xa, xb, ya, yb] = p.win;
    const tmax = 0.8 * Math.min(p.x0 - xa, xb - p.x0);
    const t = tmax * Math.pow(10, -3 * q('.t').value / 100);
    q('.tv').textContent = t < 0.01 ? t.toExponential(1).replace('.', ',') : fmt(t, 3);
    plot.set({ xmin: xa, xmax: xb, ymin: ya, ymax: yb }).clear().axes();
    plot.vline(p.x0, { color: plot.col.line, dash: [4, 4] });
    plot.fn(p.f, { n: p.n || 1600, jump: p.jump });
    const sides = [p.left, p.right];
    if (sides[0] === sides[1]) sides.pop();
    for (const L of sides) if (Number.isFinite(L) && L !== p.fx0) plot.dot(p.x0, L, { open: true, stroke: plot.col.ink, r: 4.5 });
    if (p.fx0 !== null) plot.dot(p.x0, p.fx0, { fill: plot.col.ink, r: 4.5 });
    const fl = p.f(p.x0 - t), fr = p.f(p.x0 + t);
    plot.dot(p.x0 - t, fl, { fill: plot.col.accent2, r: 5 });
    plot.dot(p.x0 + t, fr, { fill: plot.col.warn, r: 5 });
    q('.readout').innerHTML =
      `f(x₀ − t) = <b>${fmt(fl, 4)}</b> &nbsp;·&nbsp; f(x₀ + t) = <b>${fmt(fr, 4)}</b><br>
       granica lewostronna: <b>${limTxt(p.left)}</b> &nbsp;·&nbsp; prawostronna: <b>${limTxt(p.right)}</b> &nbsp;·&nbsp; f(x₀): <b>${p.fx0 === null ? 'nie istnieje' : fmt(p.fx0)}</b><br>
       <b>${p.kind}.</b> ${p.v}`;
  }
  el.querySelectorAll('input,select').forEach((i) => i.addEventListener('input', draw));
  draw(); onRedraw(() => { plot.resize(); draw(); });
};

// ───────────────────────── 9. Geometria sin α / α ─────────────────────────
Widgets.sinGeo = (el) => {
  el.innerHTML = `
    <p class="w-hint">Dowód z notatek: pole trójkąta P₁ ≤ pole wycinka P₂ ≤ pole dużego trójkąta P₃. Przesuń α i zobacz te trzy pola.</p>
    <div class="controls"><label>α (rad) = <input class="a" type="range" min="5" max="95" value="60"><span class="val av"></span></label></div>
    <canvas class="plot sq"></canvas>
    <div class="legend"><span><i style="background:var(--good)"></i>P₁ trójkąt = ½ sin α cos α</span><span><i style="background:var(--accent)"></i>P₂ wycinek = α/2</span><span><i style="background:var(--warn)"></i>P₃ trójkąt = ½ tg α</span></div>
    <div class="readout"></div>`;
  const q = (s) => el.querySelector(s);
  const plot = new Plot(q('canvas'));
  function draw() {
    const a = +q('.a').value / 100;
    q('.av').textContent = fmt(a, 2);
    const ymin = -0.12, ymax = 1.45;
    const s = (plot.h - plot.pad.t - plot.pad.b) / (ymax - ymin);
    const xmin = -0.15, xmax = xmin + (plot.w - plot.pad.l - plot.pad.r) / s;
    plot.set({ xmin, xmax, ymin, ymax }).clear().axes({ nolabelx: true, nolabely: true });
    const g = plot.g, c = plot.col, X = (x) => plot.X(x), Y = (y) => plot.Y(y);
    const R = X(1) - X(0), cx = X(0), cy = Y(0);
    const ca = Math.cos(a), sa = Math.sin(a), ta = Math.tan(a);
    plot.clip(() => {
      g.beginPath(); g.moveTo(cx, cy); g.lineTo(X(1), Y(0)); g.lineTo(X(1), Y(ta)); g.closePath();
      g.fillStyle = 'rgba(194,122,6,.14)'; g.fill(); g.strokeStyle = c.warn; g.lineWidth = 2; g.stroke();
      g.beginPath(); g.moveTo(cx, cy); g.lineTo(X(1), Y(0)); g.arc(cx, cy, R, 0, -a, true); g.closePath();
      g.fillStyle = 'rgba(47,91,216,.22)'; g.fill(); g.strokeStyle = c.accent; g.stroke();
      g.beginPath(); g.moveTo(cx, cy); g.lineTo(X(ca), Y(0)); g.lineTo(X(ca), Y(sa)); g.closePath();
      g.fillStyle = 'rgba(26,155,91,.35)'; g.fill(); g.strokeStyle = c.good; g.stroke();
      g.beginPath(); g.arc(cx, cy, R, -Math.PI / 2, 0); g.strokeStyle = c.muted; g.lineWidth = 1.4; g.stroke();
    });
    plot.dot(ca, sa, { fill: c.accent, r: 4 }); plot.dot(1, 0, { fill: c.ink, r: 3.5 });
    plot.text(1, 0, 'A', { dx: 8, dy: 12 }); plot.text(ca, sa, 'B', { dx: -14, dy: -8 });
    plot.text(0, 0, 'O', { dx: -12, dy: 12 }); plot.text(ca, 0, 'cos α', { dy: 14, align: 'center', color: c.good, size: 11 });
    plot.text(0.12, 0.03, 'α', { color: c.ink, size: 13, dy: -6 });
    const P1 = 0.5 * sa * ca, P2 = a / 2, P3 = 0.5 * ta;
    q('.readout').innerHTML = `P₁ = <b>${fmt(P1, 4)}</b> ≤ P₂ = <b>${fmt(P2, 4)}</b> ≤ P₃ = <b>${fmt(P3, 4)}</b><br>
      Dzielimy przez ½ sin α i odwracamy ułamki: &nbsp; cos α = <b>${fmt(ca, 4)}</b> ≤ sin α / α = <b>${fmt(sa / a, 4)}</b> ≤ 1 / cos α = <b>${fmt(1 / ca, 4)}</b><br>
      Gdy α → 0, lewa i prawa strona → 1, więc (tw. o trzech funkcjach) sin α / α → <b class="ok">1</b>.`;
  }
  q('.a').addEventListener('input', draw);
  draw(); onRedraw(() => { plot.resize(); draw(); });
};

// ───────────────────────── 10. Tabela ważnych granic funkcji ─────────────────────────
Widgets.limTable = (el) => {
  el.innerHTML = `
    <p class="w-hint">Zobacz liczbowo, że wartości zbliżają się do granic z notatek, gdy x → 0.</p>
    <div class="controls"><label>podstawa a = <select class="a"><option>2</option><option>3</option><option>10</option><option value="0.5">0,5</option></select></label></div>
    <div class="scroll-x"><table class="t"></table></div>
    <div class="readout"></div>`;
  const q = (s) => el.querySelector(s);
  function draw() {
    const a = +q('.a').value, la = Math.log(a);
    const xs = [1, 0.1, 0.01, 0.001, 0.0001, 0.00001];
    let h = `<tr><th>x</th><th>sin x / x</th><th>(aˣ − 1)/x</th><th>log<sub>a</sub>(1+x)/x</th><th>(1+x)<sup>1/x</sup></th></tr>`;
    for (const x of xs) {
      h += `<tr><td>${String(x).replace('.', ',')}</td><td>${fmt(Math.sin(x) / x, 6)}</td><td>${fmt((Math.pow(a, x) - 1) / x, 6)}</td><td>${fmt(Math.log(1 + x) / la / x, 6)}</td><td>${fmt(Math.pow(1 + x, 1 / x), 6)}</td></tr>`;
    }
    h += `<tr><td><b>granica</b></td><td><b>1</b></td><td><b>ln a = ${fmt(la, 6)}</b></td><td><b>1/ln a = ${fmt(1 / la, 6)}</b></td><td><b>e = ${fmt(Math.E, 6)}</b></td></tr>`;
    q('table').innerHTML = h;
    q('.readout').innerHTML = 'Pierwsza kolumna to granica z geometrii. Kolejne dwie zależą od a (dla a = e wychodzi 1). Ostatnia to granica definiująca e.';
  }
  q('.a').addEventListener('input', draw);
  draw();
};

// ───────────────────────── 11. Składanie funkcji ─────────────────────────
Widgets.composite = (el) => {
  const SETS = { R: 'ℝ', R0: 'ℝ∖{0}', P0: '[0, ∞)', P: '(0, ∞)', S: '[−1, 1]' };
  const SUB = { R: ['R'], R0: ['R', 'R0'], P0: ['R', 'P0'], P: ['R', 'R0', 'P0', 'P'], S: ['R'] };
  const FN = {
    lin: { name: '2x + 1', tex: (u) => `2(${u})+1`, dom: 'R', rng: 'R' },
    sqrt: { name: '√x', tex: (u) => `\\sqrt{${u}}`, dom: 'P0', rng: 'P0' },
    sq: { name: 'x²', tex: (u) => `(${u})^2`, dom: 'R', rng: 'P0' },
    ln: { name: 'ln x', tex: (u) => `\\ln(${u})`, dom: 'P', rng: 'R' },
    inv: { name: '1/x', tex: (u) => `\\frac{1}{${u}}`, dom: 'R0', rng: 'R0' },
    sin: { name: 'sin x', tex: (u) => `\\sin(${u})`, dom: 'R', rng: 'S' },
  };
  const opts = Object.keys(FN).map((k) => `<option value="${k}">${FN[k].name}</option>`).join('');
  el.innerHTML = `
    <p class="w-hint">Złożenie g∘f (najpierw f, potem g) da się zapisać, gdy <b>zbiór wartości f mieści się w dziedzinie g</b>. Wybierz funkcje i sprawdź.</p>
    <div class="controls">
      <label>f (wewnętrzna): <select class="f">${opts}</select></label>
      <label>g (zewnętrzna): <select class="g">${opts}</select></label>
    </div>
    <div class="readout"></div>`;
  const q = (s) => el.querySelector(s);
  q('.f').value = 'lin'; q('.g').value = 'sqrt';
  function draw() {
    const f = FN[q('.f').value], g = FN[q('.g').value];
    const ok = SUB[f.rng].includes(g.dom);
    const last = ok
      ? `Złożenie istnieje: $(g\\circ f)(x) = ${g.tex(f.tex('x'))}$`
      : `Złożenie <b>nie jest określone na całej dziedzinie</b> f — g dostaje liczby, których nie przyjmuje (np. dla f = 2x+1, g = √x: f[ℝ] = ℝ ⊄ [0,∞)). Trzeba zawęzić dziedzinę albo zamienić kolejność.`;
    q('.readout').innerHTML = `
      <p>f(x) = ${f.name}: zbiór wartości f[X] = <b>${SETS[f.rng]}</b><br>g(x) = ${g.name}: dziedzina T = <b>${SETS[g.dom]}</b></p>
      <p>f[X] ⊆ T ? &nbsp;<b class="${ok ? 'ok' : 'no'}">${ok ? 'TAK ✓' : 'NIE ✗'}</b></p>
      <p>${last}</p>`;
    typeset(q('.readout'));
  }
  el.querySelectorAll('select').forEach((s) => s.addEventListener('input', draw));
  draw();
};

// ───────────────────────── 12. Katalog funkcji ciągłych ─────────────────────────
Widgets.catalog = (el) => {
  const PI = Math.PI;
  const C = [
    { name: 'wielomian x³ − 2x + 1', f: (x) => x ** 3 - 2 * x + 1, win: [-3, 3, -6, 8], disc: [], dom: 'ℝ', why: 'Funkcja stała i funkcja x są ciągłe, a suma, różnica i iloczyn funkcji ciągłych jest ciągły (arytmetyka granic). Wielomian to tylko takie działania — więc <b>wszystkie wielomiany są ciągłe</b> (P2).' },
    { name: 'funkcja wymierna (x+1)/(x²−1)', f: (x) => (x + 1) / (x * x - 1), win: [-4, 4, -6, 6], disc: [-1, 1], dom: 'ℝ∖{−1, 1}', why: 'Iloraz funkcji ciągłych jest ciągły wszędzie tam, gdzie mianownik ≠ 0 (P3). Mianownik znika w −1 i 1 — tam f nie jest nawet określona.' },
    { name: 'tg x', f: Math.tan, win: [-5, 5, -6, 6], disc: [-3 * PI / 2, -PI / 2, PI / 2, 3 * PI / 2], dom: 'ℝ ∖ {π/2 + kπ}', why: 'tg = sin/cos jest ilorazem funkcji ciągłych, więc jest ciągła wszędzie poza zerami cos x, czyli π/2 + kπ (P5).' },
    { name: 'ctg x', f: (x) => Math.cos(x) / Math.sin(x), win: [-4, 4, -6, 6], disc: [-PI, 0, PI], dom: 'ℝ ∖ {kπ}', why: 'ctg = cos/sin — iloraz funkcji ciągłych, ciągły poza zerami sin x, czyli kπ (P5).' },
    { name: 'aˣ  (tu 2ˣ)', f: (x) => Math.pow(2, x), win: [-4, 4, -1, 10], disc: [], dom: 'ℝ', why: 'lim<sub>h→0</sub> a^(x+h) = aˣ · lim a^h = aˣ · 1 = aˣ (P6). Funkcja wykładnicza jest ciągła.' },
    { name: 'sin x', f: Math.sin, win: [-7, 7, -1.5, 1.5], disc: [], dom: 'ℝ', why: 'sin(x+h) = sin x cos h + sin h cos x → sin x · 1 + 0 · cos x = sin x (P4). Podobnie cos x.' },
    { name: '1/x', f: (x) => 1 / x, win: [-4, 4, -6, 6], disc: [0], dom: 'ℝ∖{0}', why: 'W zerze funkcja nie jest określona, więc o ciągłości w 0 nie ma co mówić. W każdym punkcie swojej dziedziny jest ciągła.' },
    { name: 'skok: 1 dla x ≥ 0, −1 dla x < 0', f: (x) => (x >= 0 ? 1 : -1), win: [-3, 3, -2, 2], disc: [0], dom: 'ℝ', why: 'W 0 granica lewostronna (−1) ≠ prawostronna (1) → <b>nieciągła w 0</b>. Poza zerem jest stała, więc ciągła.', jump: 0.3 },
  ];
  el.innerHTML = `
    <p class="w-hint">Wybierz funkcję i przesuwaj x₀. Ciągłość w x₀ znaczy: gdy h → 0, wartości f(x₀ + h) zbliżają się do f(x₀).</p>
    <div class="controls"><label>Funkcja: <select class="sel">${C.map((s, i) => `<option value="${i}">${s.name}</option>`).join('')}</select></label>
      <label>x₀ = <input class="x" type="range" min="0" max="1000" value="400"><span class="val xv"></span></label></div>
    <canvas class="plot"></canvas>
    <div class="readout"></div>`;
  const q = (s) => el.querySelector(s);
  const plot = new Plot(q('canvas'));
  function draw() {
    const p = C[+q('.sel').value], [xa, xb, ya, yb] = p.win;
    let x0 = xa + (xb - xa) * (+q('.x').value) / 1000;
    for (const d of p.disc) if (Math.abs(x0 - d) < (xb - xa) * 0.012) x0 = d;
    q('.xv').textContent = fmt(x0, 2);
    plot.set({ xmin: xa, xmax: xb, ymin: ya, ymax: yb }).clear().axes();
    for (const d of p.disc) plot.vline(d, { color: plot.col.bad, dash: [5, 5], width: 1.2 });
    plot.fn(p.f, { n: 1600, jump: p.jump || 0.9 });
    if (p.name.startsWith('skok')) { plot.dot(0, -1, { open: true, stroke: plot.col.ink, r: 4.5 }); plot.dot(0, 1, { fill: plot.col.ink, r: 4.5 }); }
    const atDisc = p.disc.includes(x0), f0 = p.f(x0);
    const inDom = Number.isFinite(f0) && Math.abs(f0) < 1e6;
    if (inDom) plot.dot(x0, f0, { fill: atDisc ? plot.col.bad : plot.col.good, r: 5 });
    else plot.vline(x0, { color: plot.col.bad, width: 2 });
    let msg;
    if (!inDom) msg = `x₀ = ${fmt(x0, 2)} <b>nie należy do dziedziny</b> — f nie jest tu określona.`;
    else {
      const hs = [0.1, 0.01, 0.001].map((h) => `f(x₀+${String(h).replace('.', ',')}) = ${fmt(p.f(x0 + h), 4)}`).join(' · ');
      msg = `f(x₀) = <b>${fmt(f0, 4)}</b>; ${hs}.<br>` + (atDisc ? `<b class="no">Nieciągła w x₀</b> — wartości z prawej nie zbiegają do f(x₀).` : `<b class="ok">Ciągła w x₀</b> — te wartości zbliżają się do f(x₀).`);
    }
    q('.readout').innerHTML = `Dziedzina: <b>${p.dom}</b>. ${msg}<br><span style="color:var(--muted)">${p.why}</span>`;
  }
  el.querySelectorAll('input,select').forEach((i) => i.addEventListener('input', draw));
  draw(); onRedraw(() => { plot.resize(); draw(); });
};

// ───────────────────────── 13. Twierdzenie Weierstrassa ─────────────────────────
Widgets.weier = (el) => {
  const PI = Math.PI;
  const W = [
    { label: 'sin x na [−π, 3π]', f: Math.sin, a: -PI, b: 3 * PI, cl: [1, 1], y: [-1.6, 1.6], ok: true, why: 'Funkcja ciągła na przedziale <b>domkniętym i ograniczonym</b> ⇒ jest ograniczona i osiąga wartość najmniejszą (−1) oraz największą (1).' },
    { label: 'x³ − 3x na [−2; 2,5]', f: (x) => x ** 3 - 3 * x, a: -2, b: 2.5, cl: [1, 1], y: [-4, 10], ok: true, why: 'Ciągła na [a, b]. Największa wartość jest na prawym końcu przedziału, najmniejsza (−2) w dwóch punktach — tw. mówi tylko, że <i>istnieją</i> takie punkty.' },
    { label: 'tg x na [0, π/2)', f: Math.tan, a: 0, b: PI / 2, cl: [1, 0], y: [-1, 9], ok: false, unb: true, why: 'Przedział <b>nie jest domknięty</b> (π/2 nie należy do dziedziny). Funkcja jest nieograniczona: nie ma wartości największej. (Przykład „NIE” z notatek.)' },
    { label: '28x na (−1, 1)', f: (x) => 28 * x, a: -1, b: 1, cl: [0, 0], y: [-30, 30], ok: false, sup: 28, inf: -28, why: 'Przedział <b>otwarty</b>: wartości 28 i −28 są kresami, ale nigdy nie zostają przyjęte. Nie ma ani największej, ani najmniejszej wartości.' },
    { label: '1/x na (0, 1]', f: (x) => 1 / x, a: 0, b: 1, cl: [0, 1], y: [-1, 12], ok: false, unb: true, why: 'Lewy koniec otwarty — funkcja rośnie do ∞, jest nieograniczona.' },
    { label: 'f(x) = x dla x<1, 0 dla x≥1, na [0, 2]', f: (x) => (x < 1 ? x : 0), a: 0, b: 2, cl: [1, 1], y: [-0.3, 1.4], ok: false, sup: 1, why: 'Przedział domknięty, ale f <b>nie jest ciągła</b> w 1. Kres górny 1 nie jest osiągany. Założenie ciągłości też jest potrzebne!', jump: 0.3 },
  ];
  el.innerHTML = `
    <p class="w-hint">Tw. Weierstrassa: ciągła na [a, b] ⇒ ograniczona i przyjmuje najmniejszą oraz największą wartość. Sprawdź przykłady „TAK” i przykłady „NIE”, w których coś w założeniach jest zepsute.</p>
    <div class="controls"><label>Przykład: <select class="sel">${W.map((s, i) => `<option value="${i}">${s.label}</option>`).join('')}</select></label></div>
    <canvas class="plot tall"></canvas>
    <div class="readout"></div>`;
  const q = (s) => el.querySelector(s);
  const plot = new Plot(q('canvas'));
  function draw() {
    const p = W[+q('.sel').value];
    const pad = (p.b - p.a) * 0.1, e = (p.b - p.a) * 1e-4;
    plot.set({ xmin: p.a - pad, xmax: p.b + pad, ymin: p.y[0], ymax: p.y[1] }).clear().axes();
    plot.vband(p.a, p.b, ACC_A);
    plot.fn(p.f, { x0: p.a + (p.cl[0] ? 0 : e), x1: p.b - (p.cl[1] ? 0 : e), n: 1600, jump: p.jump || 0.9 });
    const end = (x, closed) => { const y = p.f(x); if (Number.isFinite(y) && Math.abs(y) < 1e5) plot.dot(x, y, closed ? { fill: plot.col.ink, r: 4.5 } : { open: true, stroke: plot.col.ink, r: 4.5 }); };
    end(p.cl[0] ? p.a : p.a + e, p.cl[0]); end(p.cl[1] ? p.b : p.b - e, p.cl[1]);
    plot.text(p.a, p.y[0], 'a', { dy: -10, dx: 6 }); plot.text(p.b, p.y[0], 'b', { dy: -10, dx: -10 });
    let lo = Infinity, hi = -Infinity, xl = 0, xh = 0;
    for (let i = 0; i <= 8000; i++) {
      const x = p.a + (p.b - p.a) * i / 8000, y = p.f(x);
      if (!Number.isFinite(y)) continue;
      if (y < lo) { lo = y; xl = x; } if (y > hi) { hi = y; xh = x; }
    }
    if (p.ok) {
      plot.hline(hi, { color: plot.col.good, dash: [6, 4] }).hline(lo, { color: plot.col.good, dash: [6, 4] });
      plot.dot(xh, hi, { fill: plot.col.good, r: 6 }); plot.dot(xl, lo, { fill: plot.col.good, r: 6 });
      plot.text(xh, hi, 'max = ' + fmt(hi, 2), { dy: -12, color: plot.col.good, align: 'center' });
      plot.text(xl, lo, 'min = ' + fmt(lo, 2), { dy: 14, color: plot.col.good, align: 'center' });
    } else {
      if (p.sup !== undefined) plot.hline(p.sup, { color: plot.col.bad, dash: [6, 4] }), plot.text(p.a, p.sup, 'kres górny ' + p.sup + ' — nieosiągnięty', { dx: 8, dy: -10, color: plot.col.bad });
      if (p.inf !== undefined) plot.hline(p.inf, { color: plot.col.bad, dash: [6, 4] }), plot.text(p.b, p.inf, 'kres dolny ' + p.inf + ' — nieosiągnięty', { dx: -8, dy: 12, color: plot.col.bad, align: 'right' });
      if (p.unb) plot.text((p.a + p.b) / 2, p.y[1], 'f → ∞ : brak wartości największej', { dy: 14, color: plot.col.bad, align: 'center' });
    }
    q('.readout').innerHTML = `<b class="${p.ok ? 'ok' : 'no'}">${p.ok ? 'Tw. Weierstrassa działa ✓' : 'Teza nie zachodzi ✗'}</b> — ${p.why}`;
  }
  q('.sel').addEventListener('input', draw);
  draw(); onRedraw(() => { plot.resize(); draw(); });
};

// ───────────────────────── 14. Bisekcja — tw. Darboux ─────────────────────────
Widgets.bisect = (el) => {
  const B = [
    { label: 'f(x) = 3ˣ − 9x na [0, 1]  (z notatek)', f: (x) => Math.pow(3, x) - 9 * x, a: 0, b: 1, y: [-7, 2.5] },
    { label: 'f(x) = x³ − x − 1 na [1, 2]', f: (x) => x ** 3 - x - 1, a: 1, b: 2, y: [-2, 6] },
    { label: 'f(x) = cos x − x na [0, 1]', f: (x) => Math.cos(x) - x, a: 0, b: 1, y: [-1.2, 1.2] },
  ];
  el.innerHTML = `
    <p class="w-hint">Tw. Darboux (wersja 2): jeśli f jest ciągła na [a, b] i f(a)·f(b) &lt; 0, to w (a, b) leży miejsce zerowe. Bisekcja to dowód „na żywo” — za każdym razem bierzemy tę połowę, na której znaki na końcach nadal się różnią.</p>
    <div class="controls">
      <label>Funkcja: <select class="sel">${B.map((s, i) => `<option value="${i}">${s.label}</option>`).join('')}</select></label>
      <button class="btn sm step">Krok ▸</button><button class="btn sm ghost five">+5 kroków</button><button class="btn sm ghost reset">Od nowa</button>
    </div>
    <canvas class="plot"></canvas>
    <div class="scroll-x"><table class="t"></table></div>
    <div class="readout"></div>`;
  const q = (s) => el.querySelector(s);
  const plot = new Plot(q('canvas'));
  let a, b, hist;
  const cur = () => B[+q('.sel').value];
  function reset() { const p = cur(); a = p.a; b = p.b; hist = [[a, b]]; draw(); }
  function step() {
    const p = cur(), m = (a + b) / 2;
    if (p.f(a) * p.f(m) <= 0) b = m; else a = m;
    hist.push([a, b]);
  }
  function draw() {
    const p = cur(), w = p.b - p.a;
    plot.set({ xmin: p.a - w * 0.05, xmax: p.b + w * 0.05, ymin: p.y[0], ymax: p.y[1] }).clear();
    plot.vband(a, b, ACC_A); plot.axes();
    plot.fn(p.f, { n: 800 });
    plot.dot(a, p.f(a), { fill: p.f(a) > 0 ? plot.col.good : plot.col.bad, r: 5.5 });
    plot.dot(b, p.f(b), { fill: p.f(b) > 0 ? plot.col.good : plot.col.bad, r: 5.5 });
    let h = `<tr><th>krok</th><th>a</th><th>b</th><th>f(a)</th><th>f(b)</th><th>f(a)·f(b)</th></tr>`;
    const rows = hist.slice(-6);
    const off = hist.length - rows.length;
    rows.forEach(([x, y], i) => { const fa = p.f(x), fb = p.f(y); h += `<tr><td>${off + i}</td><td>${fmt(x, 6)}</td><td>${fmt(y, 6)}</td><td>${fmt(fa, 5)}</td><td>${fmt(fb, 5)}</td><td>${fa * fb < 0 ? '&lt; 0 ✓' : '—'}</td></tr>`; });
    q('table').innerHTML = h;
    q('.readout').innerHTML = `Przedział ma długość <b>${(b - a).toExponential(2).replace('.', ',')}</b>. Na końcach f ma różne znaki (zielony = dodatnia, czerwony = ujemna), więc miejsce zerowe x₀ jest w środku: x₀ ≈ <b>${fmt((a + b) / 2, 6)}</b>.`;
  }
  q('.step').addEventListener('click', () => { step(); draw(); });
  q('.five').addEventListener('click', () => { for (let i = 0; i < 5; i++) step(); draw(); });
  q('.reset').addEventListener('click', reset);
  q('.sel').addEventListener('input', reset);
  reset(); onRedraw(() => { plot.resize(); draw(); });
};
