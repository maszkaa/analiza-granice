// Małe, „życiowe” widżety do ramek „Na chłopski rozum”. Korzystają z Plot, fmt, onRedraw z plot.js / widgets.js.
const sl = (cls, min, max, val, step) => `<input class="${cls}" type="range" min="${min}" max="${max}" value="${val}"${step ? ` step="${step}"` : ''}>`;
const sci = (v) => (!isFinite(v) ? '∞' : Math.abs(v) >= 1e6 ? v.toExponential(2).replace('e+', ' · 10^').replace('.', ',') : fmt(v, v >= 100 ? 0 : 3));
// Widok z równą skalą na osiach (do symetrii względem y = x).
function equalView(plot, ymin, ymax, cx) {
  const s = (plot.h - plot.pad.t - plot.pad.b) / (ymax - ymin);
  const half = (plot.w - plot.pad.l - plot.pad.r) / s / 2;
  plot.set({ xmin: cx - half, xmax: cx + half, ymin, ymax });
}

// ───────── l0: wartość bezwzględna jako odległość ─────────
Widgets.pAbs = (el) => {
  el.innerHTML = `<p class="w-hint">Przesuń punkty A i B po osi liczbowej. Zapis |a − b| znaczy po prostu: <b>jak daleko od siebie są te dwie liczby</b>.</p>
    <div class="controls"><label>a = ${sl('a', -100, 100, -30)}<span class="val av"></span></label><label>b = ${sl('b', -100, 100, 45)}<span class="val bv"></span></label></div>
    <canvas class="plot short"></canvas><div class="readout"></div>`;
  const q = (s) => el.querySelector(s), plot = new Plot(q('canvas'));
  function draw() {
    const a = q('.a').value / 10, b = q('.b').value / 10;
    q('.av').textContent = fmt(a, 1); q('.bv').textContent = fmt(b, 1);
    plot.set({ xmin: -10.5, xmax: 10.5, ymin: -1, ymax: 1 }).clear().axes({ nolabely: true, stepy: 5, stepx: 1 });
    const g = plot.g, c = plot.col, y = plot.Y(0);
    g.strokeStyle = c.warn; g.lineWidth = 5; g.beginPath(); g.moveTo(plot.X(a), y); g.lineTo(plot.X(b), y); g.stroke();
    plot.dot(a, 0, { fill: c.accent, r: 7 }); plot.dot(b, 0, { fill: c.accent2, r: 7 });
    plot.text(a, 0, 'A', { dy: -16, align: 'center', color: c.accent, size: 14 }); plot.text(b, 0, 'B', { dy: -16, align: 'center', color: c.accent2, size: 14 });
    plot.text((a + b) / 2, 0, fmt(Math.abs(a - b), 1), { dy: 18, align: 'center', color: c.warn, size: 14 });
    q('.readout').innerHTML = `|a − b| = |${fmt(a, 1)} − (${fmt(b, 1)})| = <b>${fmt(Math.abs(a - b), 1)}</b> — to długość żółtego odcinka. Jeśli napis |aₙ − a| &lt; 0,1 jest prawdziwy, to znaczy, że aₙ jest od a <i>bliżej niż 0,1</i>.`;
  }
  el.querySelectorAll('input').forEach((i) => i.addEventListener('input', draw));
  draw(); onRedraw(() => { plot.resize(); draw(); });
};

// ───────── l0: ciąg to lista liczb ─────────
Widgets.pSeq = (el) => {
  const F = [
    { n: 'aₙ = 1/n', f: (n) => 1 / n, t: 'wyrazy kurczą się do 0 (granica 0)' },
    { n: 'aₙ = (−1)ⁿ', f: (n) => (n % 2 ? -1 : 1), t: 'skacze między −1 i 1 — nigdzie nie zmierza (brak granicy)' },
    { n: 'aₙ = n²', f: (n) => n * n, t: 'rośnie bez końca (granica ∞)' },
    { n: 'aₙ = (n + 1)/n', f: (n) => (n + 1) / n, t: 'zbliża się do 1 (granica 1)' },
    { n: 'aₙ = 1 − 1/2ⁿ', f: (n) => 1 - Math.pow(2, -n), t: 'zbliża się do 1 (granica 1)' },
  ];
  el.innerHTML = `<p class="w-hint">Ciąg to lista liczb z numerami. Wybierz wzór i przesuń numer n — zobacz, jaki jest „wyraz o numerze n” i dokąd lista zmierza.</p>
    <div class="controls"><label>Wzór: <select class="sel">${F.map((s, i) => `<option value="${i}">${s.n}</option>`).join('')}</select></label><label>n = ${sl('k', 1, 30, 8)}<span class="val kv"></span></label></div>
    <canvas class="plot"></canvas><div class="readout"></div>`;
  const q = (s) => el.querySelector(s), plot = new Plot(q('canvas'));
  function draw() {
    const s = F[+q('.sel').value], k = +q('.k').value; q('.kv').textContent = k;
    const vals = []; for (let n = 1; n <= 30; n++) vals.push(s.f(n));
    const lo = Math.min(...vals), hi = Math.max(...vals), pad = (hi - lo) * 0.12 || 0.5;
    plot.set({ xmin: 0, xmax: 31, ymin: lo - pad, ymax: hi + pad }).clear().axes();
    for (let n = 1; n <= 30; n++) plot.dot(n, vals[n - 1], { fill: n === k ? plot.col.warn : plot.col.accent, r: n === k ? 6 : 3.2 });
    q('.readout').innerHTML = `a<sub>${k}</sub> = <b>${fmt(s.f(k), 4)}</b>. Ten ciąg: ${s.t}.`;
  }
  el.querySelectorAll('input,select').forEach((i) => i.addEventListener('input', draw));
  draw(); onRedraw(() => { plot.resize(); draw(); });
};

// ───────── l1: droga do drzwi ─────────
Widgets.pDoor = (el) => {
  el.innerHTML = `<p class="w-hint">Idziesz do drzwi, a w każdym kroku pokonujesz <b>połowę</b> pozostałej drogi. Kolega daje Ci tolerancję („bądź bliżej niż…”). Od którego kroku jesteś w tolerancji — i czy już zawsze będziesz?</p>
    <div class="controls"><label>kroków: ${sl('k', 0, 14, 3)}<span class="val kv"></span></label>
    <label>tolerancja: <select class="tol"><option value="0.1">10 cm</option><option value="0.01" selected>1 cm</option><option value="0.001">1 mm</option></select></label></div>
    <canvas class="plot short walk"></canvas>
    <canvas class="plot short dist"></canvas><div class="legend"><span>góra: droga do drzwi (1 m)</span><span>dół: ile zostało (skala logarytmiczna)</span></div>
    <div class="readout"></div>`;
  const q = (s) => el.querySelector(s), p1 = new Plot(q('.walk')), p2 = new Plot(q('.dist'));
  function draw() {
    const k = +q('.k').value, tol = +q('.tol').value; q('.kv').textContent = k;
    p1.set({ xmin: -0.03, xmax: 1.08, ymin: -1, ymax: 1 }).clear().axes({ nolabely: true, stepy: 5, stepx: 0.1 });
    p1.vband(1 - tol, 1.2, 'rgba(26,155,91,.25)');
    for (let j = 1; j <= k; j++) p1.dot(1 - Math.pow(0.5, j), 0, { fill: p1.col.muted, r: 2.5 });
    p1.vline(1, { color: p1.col.warn, width: 4 }); p1.text(1, 0.55, 'drzwi', { color: p1.col.warn, align: 'right', dx: -6 });
    p1.dot(1 - Math.pow(0.5, k), 0, { fill: p1.col.accent, r: 8 });
    p2.set({ xmin: -0.5, xmax: 14.5, ymin: -5, ymax: 0.4 }).clear().axes({ stepy: 1, stepx: 1 });
    p2.hline(Math.log10(tol), { color: p2.col.good, dash: [6, 4] }); p2.text(14, Math.log10(tol), 'tolerancja', { color: p2.col.good, align: 'right', dy: -9 });
    for (let j = 0; j <= 14; j++) p2.dot(j, Math.log10(Math.pow(0.5, j)), { fill: Math.pow(0.5, j) < tol ? p2.col.good : p2.col.bad, r: j === k ? 6 : 3 });
    let first = 0; while (Math.pow(0.5, first) >= tol) first++;
    q('.readout').innerHTML = `Po ${k} krokach do drzwi zostało <b>${fmt(Math.pow(0.5, k) * 100, 3)} cm</b> (${k >= first ? '<b class="ok">w tolerancji ✓</b>' : '<b class="no">jeszcze za daleko</b>'}).<br>
      Z tą tolerancją jesteś „dość blisko” od kroku <b>${first}</b> i <i>już zawsze</i> (każdy następny krok jeszcze skraca dystans). Takie „od którego kroku” to właśnie numer N z definicji granicy. Mniejsza tolerancja → większe N, ale zawsze się znajdzie.`;
  }
  el.querySelectorAll('input,select').forEach((i) => i.addEventListener('input', draw));
  draw(); onRedraw(() => { p1.resize(); p2.resize(); draw(); });
};

// ───────── l2: korytarz ─────────
Widgets.pKor = (el) => {
  el.innerHTML = `<p class="w-hint">Idziesz korytarzem między dwiema ścianami, które się zwężają. Możesz kluczyć jak chcesz (suwak „kluczenie”) — ściany i tak Cię doprowadzą do tego samego miejsca.</p>
    <div class="controls"><label>kluczenie: ${sl('w', 0, 100, 80)}<span class="val wv"></span></label><label>przeszedłeś kroków: ${sl('n', 2, 40, 40)}<span class="val nv"></span></label></div>
    <canvas class="plot"></canvas><div class="readout"></div>`;
  const q = (s) => el.querySelector(s), plot = new Plot(q('canvas'));
  function draw() {
    const w = q('.w').value / 100, N = +q('.n').value; q('.wv').textContent = Math.round(w * 100) + '%'; q('.nv').textContent = N;
    plot.set({ xmin: 0.5, xmax: 40.5, ymin: -1.1, ymax: 1.1 }).clear().axes({ stepx: 5, stepy: 0.5 });
    plot.fn((x) => 1 / x, { color: plot.col.warn, x0: 1, n: 300 }); plot.fn((x) => -1 / x, { color: plot.col.warn, x0: 1, n: 300 });
    let prev = null;
    for (let n = 1; n <= N; n++) {
      const y = w * Math.sin(1.7 * n) / n;
      if (prev) { plot.g.strokeStyle = plot.col.accent; plot.g.lineWidth = 1.5; plot.g.beginPath(); plot.g.moveTo(plot.X(n - 1), plot.Y(prev)); plot.g.lineTo(plot.X(n), plot.Y(y)); plot.g.stroke(); }
      plot.dot(n, y, { fill: plot.col.accent, r: n === N ? 5 : 2.4 }); prev = y;
    }
    const y = w * Math.sin(1.7 * N) / N;
    q('.readout').innerHTML = `Krok ${N}: jesteś na wysokości <b>${fmt(y, 4)}</b>, a ściany są na ±<b>${fmt(1 / N, 4)}</b>. Ściany (żółte) dążą do 0, więc Ty — uwięziony między nimi — też dążysz do <b class="ok">0</b>. To właśnie twierdzenie o trzech ciągach.`;
  }
  el.querySelectorAll('input').forEach((i) => i.addEventListener('input', draw));
  draw(); onRedraw(() => { plot.resize(); draw(); });
};

// ───────── l3: który składnik się liczy + ograniczony × znikający ─────────
Widgets.pDom = (el) => {
  el.innerHTML = `<p class="w-hint">Weźmy (3n² + 1)/(n² − 5). Kiedy n jest ogromne, „+1” i „−5” są jak pyłki. Przesuń n i zobacz, jak niewiele znaczą.</p>
    <div class="controls"><label>n = ${sl('e', 0, 60, 20)}<span class="val ev"></span></label></div>
    <div class="scroll-x"><table class="t"></table></div><div class="readout"></div>
    <hr style="border:0;border-top:1px dashed var(--line);margin:16px 0">
    <p class="w-hint"><b>Pokrętło głośności:</b> ograniczone pokrętło (cos n, zawsze od −1 do 1) razy coś, co zanika (1/n). Zanika też iloczyn.</p>
    <canvas class="plot short"></canvas><div class="readout r2"></div>`;
  const q = (s) => el.querySelector(s), plot = new Plot(q('canvas'));
  function draw() {
    const n = Math.round(Math.pow(10, q('.e').value / 10)); q('.ev').textContent = n >= 1e6 ? '10⁶' : n;
    const A = 3 * n * n, B = n * n;
    q('table').innerHTML = `<tr><th></th><th>cała wartość</th><th>najważniejszy kawałek</th><th>pyłek</th></tr>
      <tr><td>licznik 3n² + 1</td><td>${sci(A + 1)}</td><td>3n² = ${sci(A)}</td><td>+1 (${((1 / (A + 1)) * 100).toPrecision(2).replace('.', ',')} % całości)</td></tr>
      <tr><td>mianownik n² − 5</td><td>${sci(B - 5)}</td><td>n² = ${sci(B)}</td><td>−5 (${((5 / (B - 5)) * 100).toPrecision(2).replace('.', ',')} % całości)</td></tr>`;
    q('.readout').innerHTML = `Cały ułamek: <b>${fmt((A + 1) / (B - 5), 6)}</b>. A „czysty” ułamek 3n² / n² to dokładnie <b>3</b>. Im większe n, tym mniej pyłki się liczą — dlatego granica to 3.`;
    plot.set({ xmin: 0, xmax: 41, ymin: -1.1, ymax: 1.1 }).clear().axes({ stepx: 5, stepy: 0.5 });
    plot.fn((x) => 1 / x, { x0: 1, color: plot.col.warn, n: 200 }); plot.fn((x) => -1 / x, { x0: 1, color: plot.col.warn, n: 200 });
    for (let k = 1; k <= 40; k++) { plot.dot(k, Math.cos(k), { fill: plot.col.muted, r: 2.3 }); plot.dot(k, Math.cos(k) / k, { fill: plot.col.accent, r: 3.4 }); }
    q('.r2').innerHTML = 'Szare kropki: samo pokrętło cos n (skacze, nie ma granicy). Niebieskie: cos n · 1/n — mieszczą się między żółtymi ścianami ±1/n i zanikają do 0.';
  }
  q('.e').addEventListener('input', draw);
  draw(); onRedraw(() => { plot.resize(); draw(); });
};

// ───────── l4: wyścig n³, 2ⁿ, n! oraz „kserokopiarka” qⁿ ─────────
Widgets.pRace = (el) => {
  el.innerHTML = `<p class="w-hint"><b>Wyścig:</b> kto rośnie szybciej — wielomian n³, wykładnicza 2ⁿ czy silnia n!? Paski są w skali logarytmicznej (każdy kolejny „krok” paska to dziesięć razy więcej).</p>
    <div class="controls"><label>n = ${sl('n', 1, 40, 25)}<span class="val nv"></span></label></div>
    <div class="bars"></div><div class="readout"></div>
    <hr style="border:0;border-top:1px dashed var(--line);margin:16px 0">
    <p class="w-hint"><b>Kserokopiarka:</b> za każdym razem kopiujesz kopię, skalując ją o q. Co się dzieje po kilku kopiach?</p>
    <div class="controls"><label>q: <select class="qs"><option>0.5</option><option selected>0.8</option><option>1</option><option>1.2</option><option>1.5</option></select></label></div>
    <div class="squares"></div>`;
  const q = (s) => el.querySelector(s);
  const fact = (n) => { let r = 1; for (let i = 2; i <= n; i++) r *= i; return r; };
  function draw() {
    const n = +q('.n').value; q('.nv').textContent = n;
    const rows = [['n³ (wielomian)', Math.pow(n, 3), 'var(--accent2)'], ['2ⁿ (wykładnicza)', Math.pow(2, n), 'var(--accent)'], ['n! (silnia)', fact(n), 'var(--warn)']];
    const maxLog = Math.log10(fact(40));
    q('.bars').innerHTML = rows.map(([nm, v, c]) => `<div class="brow"><div>${nm}</div><div class="btrack"><div class="bfill" style="width:${Math.max(2, (Math.log10(v) / maxLog) * 100)}%;background:${c}"></div></div><div>${sci(v)}</div></div>`).join('');
    const sorted = rows.slice().sort((a, b) => a[1] - b[1]).map((r) => r[0].split(' ')[0]);
    q('.readout').innerHTML = `Dla n = ${n}: ${sorted.join(' &lt; ')}. ${n >= 10 ? 'Od mniej więcej n = 10 kolejność jest już stała: <b>wielomian &lt; wykładnicza &lt; silnia</b>. Dlatego ułamek z „szybszym” na dole dąży do 0.' : 'Dla małych n kolejność bywa różna — liczy się zachowanie dla bardzo dużych n.'}`;
  }
  function squares() {
    const qq = +q('.qs').value;
    q('.squares').innerHTML = Array.from({ length: 9 }, (_, k) => { const v = Math.pow(qq, k), s = Math.min(150, Math.max(4, 54 * v)); return `<div><div class="sqr" style="width:${s}px;height:${s}px"></div><div style="font-size:.75rem;text-align:center;color:var(--muted)">${fmt(v, 3)}</div></div>`; }).join('');
  }
  q('.n').addEventListener('input', draw); q('.qs').addEventListener('input', squares);
  draw(); squares();
};

// ───────── l5: procent składany i pierwiastki ─────────
Widgets.pBern = (el) => {
  el.innerHTML = `<p class="w-hint"><b>Lokata:</b> x to oprocentowanie za okres (np. 0,05 = 5%), n to liczba okresów. Składana: odsetki od odsetek, (1 + x)ⁿ. Prosta: 1 + n·x. Nierówność Bernoulliego mówi, że składana nigdy nie przegrywa (dla x ≥ −1).</p>
    <div class="controls"><label>x = ${sl('x', -100, 100, 20)}<span class="val xv"></span></label><label>n = ${sl('n', 1, 30, 10)}<span class="val nv"></span></label></div>
    <div class="bars"></div><div class="readout"></div>`;
  const q = (s) => el.querySelector(s);
  function draw() {
    const x = q('.x').value / 100, n = +q('.n').value; q('.xv').textContent = fmt(x, 2); q('.nv').textContent = n;
    const A = Math.pow(1 + x, n), B = 1 + n * x, mx = Math.max(A, B, 1e-9);
    const row = (nm, v, c) => `<div class="brow"><div>${nm}</div><div class="btrack"><div class="bfill" style="width:${Math.max(0, (v / mx) * 100)}%;background:${c}"></div></div><div>${fmt(v, 4)}</div></div>`;
    q('.bars').innerHTML = row('składana (1+x)ⁿ', A, 'var(--accent)') + row('prosta 1+n·x', B, 'var(--warn)');
    q('.readout').innerHTML = A >= B - 1e-9 ? `(1+x)ⁿ = ${fmt(A, 4)} ≥ 1+nx = ${fmt(B, 4)} <b class="ok">✓</b> Bernoulli zachodzi.` : `<b class="no">Nierówność nie zachodzi</b> — ale uwaga: dla x ≥ −1 zawsze zachodzi; tu x &lt; −1?`;
  }
  el.querySelectorAll('input').forEach((i) => i.addEventListener('input', draw)); draw();
};
Widgets.pRoot = (el) => {
  el.innerHTML = `<p class="w-hint">ⁿ√a to liczba, którą trzeba pomnożyć przez siebie n razy, żeby dostać a. Dla dużych n wystarczy odrobinę powyżej 1 — zobacz, jak ciąg ⁿ√a zbliża się do 1 (nawet dla a = 1000).</p>
    <div class="controls"><label>a = ${sl('a', -100, 300, 100)}<span class="val av"></span></label></div>
    <canvas class="plot"></canvas><div class="readout"></div>`;
  const q = (s) => el.querySelector(s), plot = new Plot(q('canvas'));
  function draw() {
    const a = Math.pow(10, q('.a').value / 100); q('.av').textContent = a < 10 ? fmt(a, 2) : fmt(a, 0);
    plot.set({ xmin: 0, xmax: 201, ymin: Math.min(a, 1) * 0.9, ymax: Math.min(Math.max(a, 1), 6) * 1.05 }).clear().axes();
    plot.hline(1, { color: plot.col.warn, dash: [6, 4] });
    for (let n = 1; n <= 200; n++) plot.dot(n, Math.pow(a, 1 / n), { fill: plot.col.accent, r: 2.6 });
    q('.readout').innerHTML = `Dla n = 10: ${fmt(Math.pow(a, 0.1), 4)}, dla n = 100: ${fmt(Math.pow(a, 0.01), 4)}, dla n = 200: <b>${fmt(Math.pow(a, 1 / 200), 4)}</b> → granica <b class="ok">1</b>.`;
  }
  q('.a').addEventListener('input', draw); draw(); onRedraw(() => { plot.resize(); draw(); });
};

// ───────── l6: lokata i liczba e ─────────
Widgets.pLokata = (el) => {
  el.innerHTML = `<p class="w-hint">Wpłacasz pieniądze na rok. Bank dopisuje odsetki n razy w roku (każdym razem 1/n rocznej stopy). Im częściej dopisuje, tym więcej — ale wynik nie ucieka w nieskończoność.</p>
    <div class="controls"><label>wpłata (zł): <input class="w" type="number" min="1" step="100" value="1000" style="width:90px"></label><label>roczna stopa: ${sl('c', 10, 100, 100)}<span class="val cv"></span></label></div>
    <div class="bars"></div><div class="readout"></div>`;
  const q = (s) => el.querySelector(s);
  function draw() {
    const c = q('.c').value / 100, w = Math.max(1, +q('.w').value || 1000); q('.cv').textContent = Math.round(c * 100) + '%';
    const L = Math.exp(c), lab = [['raz w roku', 1], ['co pół roku', 2], ['co kwartał', 4], ['co miesiąc', 12], ['co tydzień', 52], ['codziennie', 365], ['co godzinę', 8760]];
    const rows = lab.map(([nm, n]) => [nm, Math.pow(1 + c / n, n)]).concat([['w sposób ciągły (granica)', L]]);
    q('.bars').innerHTML = rows.map(([nm, v], i) => `<div class="brow"><div>${nm}</div><div class="btrack"><div class="bfill" style="width:${Math.max(2, ((v - 1) / (L - 1)) * 100)}%;background:${i === rows.length - 1 ? 'var(--warn)' : 'var(--accent)'}"></div></div><div>${fmt(v * w, 2)} zł</div></div>`).join('');
    q('.readout').innerHTML = `Maksimum, którego nie przeskoczysz, to <b>e<sup>${fmt(c, 2)}</sup> · wpłata</b> = ${fmt(L * w, 2)} zł. Przy stopie 100% to e ≈ 2,718 razy wpłata. Wzór (1 + c/n)ⁿ → e<sup>c</sup> to właśnie ta lokata.`;
  }
  el.querySelectorAll('input').forEach((i) => i.addEventListener('input', draw)); draw();
};

// ───────── l7: wędrowiec się uspokaja ─────────
Widgets.pCal = (el) => {
  el.innerHTML = `<p class="w-hint">Wędrowiec zapisuje swoją pozycję po każdym kroku (sumy cos k/3ᵏ). Wybierz moment N: żółty pas pokazuje, jak bardzo „rozrzucone” są wszystkie jego późniejsze pozycje. Im późniejsze N, tym węższy pas.</p>
    <div class="controls"><label>od kroku N = ${sl('n', 1, 25, 3)}<span class="val nv"></span></label></div>
    <canvas class="plot"></canvas><div class="readout"></div>`;
  const q = (s) => el.querySelector(s), plot = new Plot(q('canvas'));
  const A = []; let s = 0; for (let k = 1; k <= 80; k++) { s += Math.cos(k) / Math.pow(3, k); A[k] = s; }
  function draw() {
    const N = +q('.n').value; q('.nv').textContent = N;
    let lo = Infinity, hi = -Infinity; for (let k = N; k <= 80; k++) { lo = Math.min(lo, A[k]); hi = Math.max(hi, A[k]); }
    plot.set({ xmin: 0, xmax: 31, ymin: -0.05, ymax: 0.4 }).clear();
    plot.band(lo, hi, 'rgba(194,122,6,.25)'); plot.axes({ stepy: 0.1 }); plot.vline(N - 0.5, { color: plot.col.warn, dash: [4, 4] });
    for (let k = 1; k <= 30; k++) plot.dot(k, A[k], { fill: k >= N ? plot.col.good : plot.col.accent, r: 3.4 });
    q('.readout').innerHTML = `Od kroku ${N} wszystkie pozycje mieszczą się w pasie szerokości <b>${(hi - lo) < 1e-4 ? (hi - lo).toExponential(1).replace('.', ',') : fmt(hi - lo, 5)}</b>. Mogę tę szerokość zrobić <i>dowolnie małą</i>, biorąc późniejsze N — to jest warunek Cauchy’ego: wyrazy robią się podobne do siebie nawzajem, więc wędrowiec gdzieś się zatrzyma.`;
  }
  q('.n').addEventListener('input', draw); draw(); onRedraw(() => { plot.resize(); draw(); });
};

// ───────── l8: dwóch biegaczy (Stolz) ─────────
Widgets.pBieg = (el) => {
  el.innerHTML = `<p class="w-hint">Pierwszy biegacz przebiegł łącznie bₙ = Σ 1/√k, drugi aₙ = √n. Porównujemy <span style="color:var(--accent);font-weight:700">stosunek całych dróg</span> bₙ/aₙ ze <span style="color:var(--warn);font-weight:700">stosunkiem prędkości</span> (ile każdy przebiegł w ostatnim kroku). Stolz: ten drugi zdradza granicę pierwszego.</p>
    <div class="controls"><label>pokaż do kroku: ${sl('n', 5, 300, 80)}<span class="val nv"></span></label></div>
    <canvas class="plot"></canvas><div class="readout"></div>`;
  const q = (s) => el.querySelector(s), plot = new Plot(q('canvas'));
  const R1 = [0], R2 = [0]; let b = 0, a0 = 0;
  for (let n = 1; n <= 300; n++) { b += 1 / Math.sqrt(n); const a = Math.sqrt(n); R1[n] = b / a; R2[n] = (1 / Math.sqrt(n)) / (a - a0); a0 = a; }
  function draw() {
    const N = +q('.n').value; q('.nv').textContent = N;
    plot.set({ xmin: 0, xmax: N + 1, ymin: 0.8, ymax: 2.3 }).clear().axes();
    plot.hline(2, { color: plot.col.muted, dash: [6, 4] }); plot.text(1, 2, 'granica 2', { dy: -9, color: plot.col.muted });
    const step = Math.max(1, Math.floor(N / 120));
    for (let n = 1; n <= N; n += step) { plot.dot(n, R1[n], { fill: plot.col.accent, r: 2.8 }); plot.dot(n, R2[n], { fill: plot.col.warn, r: 2.8 }); }
    q('.readout').innerHTML = `Przy n = ${N}: stosunek dróg = <b>${fmt(R1[N], 4)}</b>, stosunek prędkości = <b>${fmt(R2[N], 4)}</b>. Prędkości zbliżają się do 2 <i>szybciej</i> i prowadzą za sobą stosunek dróg. Obie krzywe zmierzają do <b class="ok">2</b>.`;
  }
  q('.n').addEventListener('input', draw); draw(); onRedraw(() => { plot.resize(); draw(); });
};

// ───────── l9: dziura w drodze i różne ścieżki ─────────
Widgets.pDziura = (el) => {
  el.innerHTML = `<p class="w-hint">Droga ma dziurę w punkcie x = 1 — nie możesz w niej stanąć. Ale zobacz: <b>każda ścieżka dojścia</b> (każdy ciąg punktów zbliżający się do 1) prowadzi na tę samą wysokość. Przesuń suwak, żeby zrobić więcej kroków każdą ścieżką.</p>
    <div class="controls"><label>kroków: ${sl('k', 1, 14, 4)}<span class="val kv"></span></label></div>
    <canvas class="plot tall"></canvas><div class="legend"><span><i style="background:var(--accent)"></i>od prawej: 1 + 2⁻ʲ</span><span><i style="background:var(--accent2)"></i>od lewej: 1 − 1/(j+1)</span><span><i style="background:var(--warn)"></i>skacząc: 1 + (−1)ʲ/(j+1)</span></div><div class="readout"></div>`;
  const q = (s) => el.querySelector(s), plot = new Plot(q('canvas'));
  const f = (x) => (x * x - 1) / (x - 1);
  function draw() {
    const k = +q('.k').value; q('.kv').textContent = k;
    plot.set({ xmin: 0, xmax: 2.2, ymin: 0.5, ymax: 3.5 }).clear().axes();
    plot.fn((x) => (Math.abs(x - 1) < 1e-9 ? NaN : f(x)), { n: 400 });
    plot.dot(1, 2, { open: true, stroke: plot.col.ink, r: 5 });
    const P = [[(j) => 1 + Math.pow(2, -j), plot.col.accent], [(j) => 1 - 1 / (j + 1), plot.col.accent2], [(j) => 1 + (j % 2 ? -1 : 1) / (j + 1), plot.col.warn]];
    for (const [xf, c] of P) for (let j = 1; j <= k; j++) { const x = xf(j); plot.dot(x, f(x), { fill: c, r: j === k ? 5 : 3 }); }
    q('.readout').innerHTML = `Po ${k} krokach wysokości na trzech ścieżkach: ${P.map(([xf]) => '<b>' + fmt(f(xf(k)), 4) + '</b>').join(', ')}. Wszystkie dążą do <b class="ok">2</b> — to jest granica, choć w samym punkcie x = 1 funkcja nie istnieje.`;
  }
  q('.k').addEventListener('input', draw); draw(); onRedraw(() => { plot.resize(); draw(); });
};

// ───────── l10: dwie ścieżki, dwa różne cele ─────────
Widgets.pDwie = (el) => {
  el.innerHTML = `<p class="w-hint">Funkcja sin(1/x) przy zerze. Idziemy do x = 0 dwoma ścieżkami (obie „zmierzają do zera”), ale kończą na zupełnie różnych wysokościach: 0 i 1. Skoro cel nie jest jeden — granica nie istnieje.</p>
    <div class="controls"><label>punktów na ścieżce: ${sl('k', 1, 16, 5)}<span class="val kv"></span></label></div>
    <canvas class="plot tall"></canvas><div class="legend"><span><i style="background:var(--accent)"></i>ścieżka A: xₙ = 1/(πn) → wysokość 0</span><span><i style="background:var(--warn)"></i>ścieżka B: yₙ = 1/(π/2 + 2πn) → wysokość 1</span></div><div class="readout"></div>`;
  const q = (s) => el.querySelector(s), plot = new Plot(q('canvas'));
  function draw() {
    const k = +q('.k').value; q('.kv').textContent = k;
    plot.set({ xmin: -0.02, xmax: 0.36, ymin: -1.3, ymax: 1.3 }).clear().axes({ stepx: 0.05, stepy: 0.5 });
    plot.fn((x) => (x <= 0 ? NaN : Math.sin(1 / x)), { x0: 0.003, x1: 0.36, n: 5000, width: 1.2, color: plot.col.muted, jump: 3 });
    for (let n = 1; n <= k; n++) {
      const xa = 1 / (Math.PI * n), xb = 1 / (Math.PI / 2 + 2 * Math.PI * n);
      plot.dot(xa, Math.sin(1 / xa), { fill: plot.col.accent, r: 4 }); plot.dot(xb, Math.sin(1 / xb), { fill: plot.col.warn, r: 4 });
    }
    q('.readout').innerHTML = `Obie ścieżki zbliżają się do 0 (poziomo), ale ścieżka A zawsze ląduje na wysokości <b>0</b>, a B na wysokości <b>1</b>. <b class="no">Dwa różne wyniki ⇒ brak granicy.</b>`;
  }
  q('.k').addEventListener('input', draw); draw(); onRedraw(() => { plot.resize(); draw(); });
};

// ───────── l11: granica rozumie działania ─────────
Widgets.pSum = (el) => {
  el.innerHTML = `<p class="w-hint">Pierwszy ciąg fₙ = 3 + 1/n zmierza do 3, drugi gₙ = 2 − 1/n² zmierza do 2. Granica „rozumie” działania: granica sumy to suma granic, iloczynu — iloczyn itd.</p>
    <div class="controls"><label>n = ${sl('e', 0, 40, 10)}<span class="val ev"></span></label></div>
    <div class="scroll-x"><table class="t"></table></div>`;
  const q = (s) => el.querySelector(s);
  function draw() {
    const n = Math.round(Math.pow(10, q('.e').value / 10)); q('.ev').textContent = n;
    const f = 3 + 1 / n, g = 2 - 1 / (n * n);
    const rows = [['fₙ', f, 3], ['gₙ', g, 2], ['fₙ + gₙ', f + g, 5], ['fₙ · gₙ', f * g, 6], ['fₙ / gₙ', f / g, 1.5]];
    q('table').innerHTML = `<tr><th></th><th>wartość dla tego n</th><th>granica</th><th>różnica</th></tr>` + rows.map(([nm, v, L]) => `<tr><td>${nm}</td><td>${fmt(v, 6)}</td><td><b>${fmt(L)}</b></td><td>${(Math.abs(v - L)).toExponential(1).replace('.', ',')}</td></tr>`).join('');
  }
  q('.e').addEventListener('input', draw); draw();
};

// ───────── l12: sin x ≈ x dla małych kątów ─────────
Widgets.pSin = (el) => {
  el.innerHTML = `<p class="w-hint">Przybliżaj wykres do zera („lupa”). Dla bardzo małych kątów (w radianach) sinus <b>prawie nie różni się od samego kąta</b> — krzywe się zlewają. Stąd sin x / x → 1.</p>
    <div class="controls"><label>lupa: ${sl('z', 0, 100, 0)}<span class="val zv"></span></label></div>
    <canvas class="plot tall"></canvas><div class="legend"><span><i style="background:var(--accent)"></i>y = sin x</span><span><i style="background:var(--warn)"></i>y = x</span></div><div class="readout"></div>`;
  const q = (s) => el.querySelector(s), plot = new Plot(q('canvas'));
  function draw() {
    const h = 3 * Math.pow(0.01 / 3, q('.z').value / 100); q('.zv').textContent = '±' + (h < 0.1 ? h.toFixed(3) : h.toFixed(2)).replace('.', ',');
    plot.set({ xmin: -h, xmax: h, ymin: -h * 1.1, ymax: h * 1.1 }).clear().axes();
    plot.fn((x) => x, { color: plot.col.warn, dash: [6, 4], width: 2 }); plot.fn(Math.sin, { color: plot.col.accent, width: 2.4 });
    q('.readout').innerHTML = `Dla x = ${fmt(h, 4)}: sin x = <b>${fmt(Math.sin(h), 6)}</b>, a x = <b>${fmt(h, 6)}</b>. Stosunek sin x / x = <b>${fmt(Math.sin(h) / h, 6)}</b> ${Math.sin(h) / h > 0.9999 ? '— praktycznie 1.' : ''}`;
  }
  q('.z').addEventListener('input', draw); draw(); onRedraw(() => { plot.resize(); draw(); });
};

// ───────── l13: dwie maszynki w rzędzie ─────────
Widgets.pMasz = (el) => {
  const Fs = { lin: ['2x + 1', (x) => 2 * x + 1], sq: ['x²', (x) => x * x], dec: ['x − 2', (x) => x - 2] };
  const Gs = { sqrt: ['√x', (y) => (y >= 0 ? Math.sqrt(y) : NaN), 'pierwiastek nie przyjmuje liczb ujemnych'], ln: ['ln x', (y) => (y > 0 ? Math.log(y) : NaN), 'logarytm tylko dla liczb dodatnich'], inv: ['1/x', (y) => (y !== 0 ? 1 / y : NaN), 'nie dzieli się przez 0'] };
  el.innerHTML = `<p class="w-hint">Liczba wchodzi do maszynki f, wynik wpada do maszynki g. Złożenie działa tylko, gdy to, co wypluwa f, <b>pasuje</b> do wejścia g. Ustaw maszynki i przesuwaj x.</p>
    <div class="controls"><label>f: <select class="f">${Object.entries(Fs).map(([k, v]) => `<option value="${k}">${v[0]}</option>`).join('')}</select></label>
    <label>g: <select class="g">${Object.entries(Gs).map(([k, v]) => `<option value="${k}">${v[0]}</option>`).join('')}</select></label>
    <label>x = ${sl('x', -40, 40, -10)}<span class="val xv"></span></label></div>
    <div class="flow"></div><div class="readout"></div>`;
  const q = (s) => el.querySelector(s);
  function draw() {
    const x = q('.x').value / 10, F = Fs[q('.f').value], G = Gs[q('.g').value]; q('.xv').textContent = fmt(x, 1);
    const y = F[1](x), z = G[1](y), ok = Number.isFinite(z);
    q('.flow').innerHTML = `<div class="fbox">x<br><b>${fmt(x, 1)}</b></div><span class="arrow">→</span><div class="fbox">f: ${F[0]}</div><span class="arrow">→</span><div class="fbox">f(x)<br><b>${fmt(y, 3)}</b></div><span class="arrow">→</span><div class="fbox">g: ${G[0]}</div><span class="arrow">→</span><div class="fbox ${ok ? 'ok' : 'bad'}">g(f(x))<br><b>${ok ? fmt(z, 4) : '✗'}</b></div>`;
    q('.readout').innerHTML = ok ? `Wszystko gra: g dostała ${fmt(y, 3)} i umie z tym pracować.` : `<b class="no">Złożenie nie działa dla tego x:</b> g dostała ${fmt(y, 3)}, a ${G[2]}. Dlatego złożenie g∘f bywa określone tylko na <i>części</i> dziedziny f.`;
  }
  el.querySelectorAll('input,select').forEach((i) => i.addEventListener('input', draw)); draw();
};

// ───────── l14: czy da się narysować bez odrywania ołówka? ─────────
Widgets.pOlowek = (el) => {
  const PI = Math.PI;
  const F = [
    { n: 'x² − 2 (parabola)', f: (x) => x * x - 2, win: [-3, 3, -3, 7], d: [] },
    { n: 'skok (−1 dla x<0, 1 dla x≥0)', f: (x) => (x >= 0 ? 1 : -1), win: [-3, 3, -2, 2], d: [0], j: 0.3 },
    { n: '1/x', f: (x) => (x === 0 ? NaN : 1 / x), win: [-3, 3, -5, 5], d: [0] },
    { n: '(x² − 1)/(x − 1) (dziura)', f: (x) => (Math.abs(x - 1) < 1e-9 ? NaN : (x * x - 1) / (x - 1)), win: [-2, 4, -2, 6], d: [1] },
    { n: 'tg x', f: Math.tan, win: [-3, 3, -6, 6], d: [-PI / 2, PI / 2] },
  ];
  el.innerHTML = `<p class="w-hint">Funkcja ciągła to taka, którą <b>narysujesz bez odrywania ołówka</b>. Prowadź ołówek od lewej do prawej i licz, ile razy musisz go oderwać.</p>
    <div class="controls"><label>Funkcja: <select class="sel">${F.map((s, i) => `<option value="${i}">${s.n}</option>`).join('')}</select></label><label>ołówek: ${sl('t', 0, 1000, 300)}</label></div>
    <canvas class="plot tall"></canvas><div class="readout"></div>`;
  const q = (s) => el.querySelector(s), plot = new Plot(q('canvas'));
  function draw() {
    const p = F[+q('.sel').value], [xa, xb, ya, yb] = p.win, t = xa + (xb - xa) * q('.t').value / 1000;
    plot.set({ xmin: xa, xmax: xb, ymin: ya, ymax: yb }).clear().axes();
    plot.fn(p.f, { n: 1500, jump: p.j || 0.9, color: plot.col.line, width: 3 });
    plot.fn(p.f, { x1: t, n: 1500, jump: p.j || 0.9, color: plot.col.accent, width: 3.2 });
    for (const d of p.d) if (d < t) plot.text(d, ya, '✂ oderwanie!', { color: plot.col.bad, align: 'center', dy: -14 }), plot.vline(d, { color: plot.col.bad, dash: [4, 4], width: 1.2 });
    const y = p.f(t); if (Number.isFinite(y) && Math.abs(y) < 1e4) plot.dot(t, y, { fill: plot.col.warn, r: 6 });
    const lifts = p.d.filter((d) => d < t).length;
    q('.readout').innerHTML = lifts ? `Do tej chwili musiałaś oderwać ołówek <b class="no">${lifts} ${lifts === 1 ? 'raz' : 'razy'}</b> — w tych punktach funkcja jest nieciągła.` : `Dotąd rysujesz <b class="ok">bez odrywania ołówka</b>.${p.d.length ? ' Przesuń dalej — za chwilę będzie problem.' : ' Ta funkcja jest ciągła: nigdy nie trzeba oderwać.'}`;
  }
  el.querySelectorAll('input,select').forEach((i) => i.addEventListener('input', draw)); draw(); onRedraw(() => { plot.resize(); draw(); });
};

// ───────── l15: cztery rodzaje „zepsutych” miejsc ─────────
Widgets.pCztery = (el) => {
  const C = [
    { n: 'Dziura', k: 'I rodzaju (usuwalna)', f: (x) => (Math.abs(x - 1) < 1e-9 ? NaN : (x * x - 1) / (x - 1)), win: [-1, 3, -1, 4], o: [1, 2], t: 'Wykres idzie gładko, ale jednego punktu brakuje. Wystarczy go dopisać — „załatać” — i funkcja będzie ciągła.' },
    { n: 'Skok', k: 'I rodzaju', f: (x) => (x >= 0 ? 1 : -1), win: [-2, 2, -2, 2], j: 0.3, o: [0, -1], t: 'Z lewej i z prawej wykres kończy się na różnych wysokościach, jak stopień schodów. Nie da się załatać jednym punktem.' },
    { n: 'Przepaść', k: 'II rodzaju', f: (x) => (x === 0 ? NaN : 1 / x), win: [-2, 2, -5, 5], t: 'Wykres ucieka w nieskończoność (granice jednostronne to ±∞). Nie ma „wysokości”, na którą można dojść.' },
    { n: 'Szaleństwo', k: 'II rodzaju', f: (x) => (x === 0 ? NaN : Math.sin(1 / x)), win: [-0.5, 0.5, -1.5, 1.5], j: 1.5, n2: 4000, t: 'Wykres drga coraz szybciej tuż przy zerze i nie ustala się na żadnej wysokości.' },
  ];
  el.innerHTML = `<p class="w-hint">Cztery typy nieciągłości. Kliknij kafelek, żeby przeczytać, co to znaczy.</p>
    <div class="grid4">${C.map((c, i) => `<div class="cell" data-i="${i}"><b>${c.n}</b><div style="font-size:.8rem;color:var(--muted)">${c.k}</div><canvas class="plot mini"></canvas></div>`).join('')}</div><div class="readout">Kliknij któryś kafelek.</div>`;
  const q = (s) => el.querySelector(s), plots = Array.from(el.querySelectorAll('canvas')).map((cv) => new Plot(cv));
  function draw() {
    C.forEach((c, i) => { const p = plots[i], [xa, xb, ya, yb] = c.win; p.pad = { l: 8, r: 8, t: 8, b: 8 }; p.set({ xmin: xa, xmax: xb, ymin: ya, ymax: yb }).clear().axes({ nolabelx: true, nolabely: true, stepx: (xb - xa) / 4, stepy: (yb - ya) / 4 }); p.fn(c.f, { n: c.n2 || 800, jump: c.j || 0.9 }); if (c.o) p.dot(c.o[0], c.o[1], { open: true, stroke: p.col.ink, r: 4 }); });
  }
  el.querySelectorAll('.cell').forEach((cell) => cell.addEventListener('click', () => {
    el.querySelectorAll('.cell').forEach((x) => x.classList.remove('on')); cell.classList.add('on');
    const c = C[+cell.dataset.i]; q('.readout').innerHTML = `<b>${c.n} — nieciągłość ${c.k}.</b> ${c.t}`;
  }));
  draw(); onRedraw(() => { plots.forEach((p) => p.resize()); draw(); });
};

// ───────── l16: lustro y = x ─────────
Widgets.pLustro = (el) => {
  const F = [
    { n: '2ˣ i log₂ x', f: (x) => Math.pow(2, x), g: (y) => Math.log2(y), lo: -3, hi: 3 },
    { n: 'x³ i ∛x', f: (x) => x ** 3, g: (y) => Math.cbrt(y), lo: -1.8, hi: 1.8 },
    { n: '(½)ˣ i log_{1/2} x', f: (x) => Math.pow(0.5, x), g: (y) => Math.log(y) / Math.log(0.5), lo: -3, hi: 3 },
  ];
  el.innerHTML = `<p class="w-hint">Funkcja odwrotna to „maszynka w drugą stronę”. Jej wykres jest <b>lustrzanym odbiciem</b> względem ukośnej prostej y = x. Przesuń punkt P i zobacz jego odbicie Q: (a, b) zamienia się w (b, a).</p>
    <div class="controls"><label>Para: <select class="sel">${F.map((s, i) => `<option value="${i}">${s.n}</option>`).join('')}</select></label><label>x = ${sl('x', -30, 30, 10)}<span class="val xv"></span></label></div>
    <canvas class="plot sq"></canvas><div class="legend"><span><i style="background:var(--accent)"></i>funkcja f</span><span><i style="background:var(--accent2)"></i>funkcja odwrotna</span></div><div class="readout"></div>`;
  const q = (s) => el.querySelector(s), plot = new Plot(q('canvas'));
  function draw() {
    const p = F[+q('.sel').value]; const x = Math.max(p.lo, Math.min(p.hi, q('.x').value / 10)); q('.xv').textContent = fmt(x, 2);
    equalView(plot, -4, 6, 1); plot.clear().axes({ stepx: 1, stepy: 1 });
    plot.fn((t) => t, { color: plot.col.muted, dash: [6, 5], width: 1.5 });
    plot.fn(p.f, { color: plot.col.accent, n: 600 }); plot.fn(p.g, { color: plot.col.accent2, n: 600 });
    const y = p.f(x);
    plot.g.save(); plot.g.setLineDash([4, 4]); plot.g.strokeStyle = plot.col.warn; plot.g.beginPath(); plot.g.moveTo(plot.X(x), plot.Y(y)); plot.g.lineTo(plot.X(y), plot.Y(x)); plot.g.stroke(); plot.g.restore();
    plot.dot(x, y, { fill: plot.col.accent, r: 6 }); plot.dot(y, x, { fill: plot.col.accent2, r: 6 });
    plot.text(x, y, 'P', { dx: 9, dy: -9, color: plot.col.accent }); plot.text(y, x, 'Q', { dx: 9, dy: -9, color: plot.col.accent2 });
    q('.readout').innerHTML = `P = (${fmt(x, 2)}; ${fmt(y, 3)}) leży na wykresie f, a Q = (${fmt(y, 3)}; ${fmt(x, 2)}) na wykresie funkcji odwrotnej. Odbicie nie „rwie” krzywej — dlatego odwrotna do ciągłej, rosnącej funkcji jest ciągła i rosnąca.`;
  }
  el.querySelectorAll('input,select').forEach((i) => i.addEventListener('input', draw)); draw(); onRedraw(() => { plot.resize(); draw(); });
};

// ───────── l17: spacer po górach ─────────
Widgets.pGory = (el) => {
  const f = (x) => Math.sin(x) + 0.5 * Math.cos(2.3 * x) + 0.15 * x;
  el.innerHTML = `<p class="w-hint">Ścieżka górska bez przerw (funkcja ciągła). Wybierz odcinek [a, b] swojej wędrówki. Zawsze znajdzie się <b>najwyższy i najniższy punkt trasy</b> — o ile końce odcinka są „dozwolone”. Spróbuj też odebrać prawy koniec (nie wolno tam stanąć).</p>
    <div class="controls"><label>a = ${sl('a', 0, 100, 10)}<span class="val av"></span></label><label>b = ${sl('b', 0, 100, 70)}<span class="val bv"></span></label>
    <label><input type="checkbox" class="open"> prawy koniec b jest otwarty (nie wolno stanąć)</label></div>
    <canvas class="plot tall"></canvas><div class="readout"></div>`;
  const q = (s) => el.querySelector(s), plot = new Plot(q('canvas'));
  function draw() {
    let a = q('.a').value / 10, b = q('.b').value / 10; if (b < a + 0.3) b = a + 0.3;
    q('.av').textContent = fmt(a, 1); q('.bv').textContent = fmt(b, 1);
    const open = q('.open').checked;
    plot.set({ xmin: 0, xmax: 10, ymin: -2.2, ymax: 3.2 }).clear().axes({ stepx: 1, stepy: 1 });
    plot.vband(a, b, ACC_A); plot.fn(f, { color: plot.col.line, width: 2.5, n: 800 }); plot.fn(f, { x0: a, x1: b, color: plot.col.accent, width: 3.4, n: 800 });
    let lo = Infinity, hi = -Infinity, xl = a, xh = a; const M = 4000;
    for (let i = 0; i <= M; i++) { const x = a + (b - a) * i / M, y = f(x); if (y < lo) { lo = y; xl = x; } if (y > hi) { hi = y; xh = x; } }
    const lost = open && xh > b - (b - a) * 0.002 || (open && xl > b - (b - a) * 0.002);
    plot.dot(a, f(a), { fill: plot.col.ink, r: 5 }); plot.dot(b, f(b), open ? { open: true, stroke: plot.col.ink, r: 5 } : { fill: plot.col.ink, r: 5 });
    plot.hline(hi, { color: plot.col.good, dash: [6, 4] }); plot.hline(lo, { color: plot.col.good, dash: [6, 4] });
    plot.dot(xh, hi, { fill: plot.col.good, r: 6 }); plot.dot(xl, lo, { fill: plot.col.good, r: 6 });
    plot.text(xh, hi, 'najwyżej', { dy: -12, color: plot.col.good, align: 'center' }); plot.text(xl, lo, 'najniżej', { dy: 14, color: plot.col.good, align: 'center' });
    q('.readout').innerHTML = lost ? `<b class="no">Uwaga:</b> najwyższy/najniższy punkt wypada na końcu b, na którym <i>nie wolno stanąć</i>. Można się do niego dowolnie zbliżać, ale go nie ma — to dokładnie przykład „NIE” dla twierdzenia Weierstrassa.` : `Najwyższy punkt: <b>${fmt(hi, 3)}</b> (x ≈ ${fmt(xh, 2)}), najniższy: <b>${fmt(lo, 3)}</b> (x ≈ ${fmt(xl, 2)}). Są <b class="ok">osiągalne</b> — na tym odcinku naprawdę da się w nich stanąć.`;
  }
  el.querySelectorAll('input').forEach((i) => i.addEventListener('input', draw)); draw(); onRedraw(() => { plot.resize(); draw(); });
};

// ───────── l18: spod ziemi na powierzchnię ─────────
Widgets.pZiemia = (el) => {
  const P = [
    { n: 'ścieżka ciągła', f: (x) => 0.45 * x - 1.6 + 0.25 * Math.sin(2.2 * x) },
    { n: 'ścieżka ze skokiem („teleportacja”)', f: (x) => 0.4 * x - 1.6 + (x >= 3 ? 1.8 : 0) },
  ];
  el.innerHTML = `<p class="w-hint">Zaczynasz pod ziemią (wartość ujemna), kończysz nad ziemią. Przesuń suwak — czy musisz gdzieś przejść dokładnie przez poziom 0? Porównaj ścieżkę bez skoków i ze skokiem.</p>
    <div class="controls"><label>Ścieżka: <select class="sel">${P.map((s, i) => `<option value="${i}">${s.n}</option>`).join('')}</select></label><label>postęp: ${sl('t', 0, 1000, 450)}</label></div>
    <canvas class="plot tall"></canvas><div class="readout"></div>`;
  const q = (s) => el.querySelector(s), plot = new Plot(q('canvas'));
  function draw() {
    const p = P[+q('.sel').value], t = 6 * q('.t').value / 1000, f = p.f;
    plot.set({ xmin: 0, xmax: 6, ymin: -2.2, ymax: 3.2 }).clear(); plot.band(-3, 0, 'rgba(214,64,63,.10)'); plot.axes({ stepx: 1, stepy: 1 });
    plot.fn(f, { color: plot.col.line, width: 3, n: 1200, jump: 0.3 }); plot.fn(f, { x1: t, color: plot.col.accent, width: 3.4, n: 1200, jump: 0.3 });
    plot.text(0.1, -1.9, 'pod ziemią', { color: plot.col.bad }); plot.text(0.1, 0.25, 'poziom 0 (ziemia)', { color: plot.col.muted });
    let cross = [], prev = f(0); for (let i = 1; i <= 6000; i++) { const x = 6 * i / 6000; if (x > t) break; const y = f(x); if ((prev < 0) !== (y < 0)) cross.push(x); prev = y; }
    cross.forEach((x) => plot.dot(x, 0, { fill: plot.col.warn, r: 6 }));
    const y = f(t); plot.dot(t, y, { fill: y < 0 ? plot.col.bad : plot.col.good, r: 6 });
    const jumped = p.n.includes('skok') && t >= 3;
    q('.readout').innerHTML = `Jesteś ${y < 0 ? '<b class="no">pod ziemią</b>' : '<b class="ok">nad ziemią</b>'} (wartość ${fmt(y, 2)}). Przeszłaś przez poziom 0: <b>${cross.length}</b> ${cross.length === 1 ? 'raz' : 'razy'}${cross.length ? ' (żółte kropki to miejsca zerowe)' : ''}.` + (jumped && !cross.length ? ' <b class="no">Przeskoczyłaś na powierzchnię bez przejścia przez 0</b> — bo funkcja ma skok (nie jest ciągła). Twierdzenie Darboux wymaga ciągłości!' : '') + (!jumped && p.n.includes('ciągła') && y > 0 ? ' Ciągłość nie pozwala „przeskoczyć” zera — to właśnie twierdzenie Darboux.' : '');
  }
  el.querySelectorAll('input,select').forEach((i) => i.addEventListener('input', draw)); draw(); onRedraw(() => { plot.resize(); draw(); });
};
