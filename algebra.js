// Część IV — Algebra (kartkówka): logika, zbiory, kresy, wyrażenia algebraiczne.
// Ładowany po quiz.js. Pytania quizu biorę z bloków CHECK lekcji, żeby nie duplikować treści.
PARTS[4] = 'Część IV — Algebra (kartkówka)';

// wiersze tabel: komórki rozdzielone znakiem „ | ”
const TBL = (head, rows) => RAW(`<div class="scroll-x"><table class="t"><tr>${head.map((h) => `<th>${h}</th>`).join('')}</tr>${rows.map((r) => `<tr>${r.split(' | ').map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</table></div>`);

// ───────── widżety ─────────
Widgets.logicTT = (el) => {
  const imp = (a, b) => !a || b;
  const F = [
    ['a) (p ⇒ q) ⇔ (¬p ∨ q)', 2, (p, q) => imp(p, q) === (!p || q)],
    ['b) [(p ∧ q) ⇒ r] ⇔ [p ⇒ (q ⇒ r)]', 3, (p, q, r) => imp(p && q, r) === imp(p, imp(q, r))],
    ['c) [(p ⇒ q) ∧ (q ⇒ p)] ⇒ (p ∨ q)', 2, (p, q) => imp(imp(p, q) && imp(q, p), p || q)],
    ['d) [(p ∨ q) ⇒ r] ⇒ [(p ⇒ r) ∨ (q ⇒ r)]', 3, (p, q, r) => imp(imp(p || q, r), imp(p, r) || imp(q, r))],
    ['e) [(p ∨ q) ∧ ¬p] ⇒ q', 2, (p, q) => imp((p || q) && !p, q)],
    ['f) (p ⇒ q) ⇒ [(p ∧ r) ⇒ q]', 3, (p, q, r) => imp(imp(p, q), imp(p && r, q))],
    ['g) (p ⇒ q) ⇒ [p ⇒ (q ∨ r)]', 3, (p, q, r) => imp(imp(p, q), imp(p, q || r))],
    ['h) [(p ∨ q) ∧ (p ⇒ q)] ⇒ (q ⇒ p)', 2, (p, q) => imp((p || q) && imp(p, q), imp(q, p))],
    ['i) p ∨ (¬p ∨ q) ⇒ (¬q ∧ ¬q)', 2, (p, q) => imp(p || (!p || q), !q && !q)],
  ];
  el.innerHTML = `<p class="w-hint">Wybierz wyrażenie z listy (zad. 1). Tabelka sprawdza wszystkie układy wartości; jeden wiersz z 0 wystarczy, by obalić tautologię.</p>
    <div class="controls"><label>Wyrażenie: <select class="sel">${F.map((f, i) => `<option value="${i}">${f[0]}</option>`).join('')}</select></label></div>
    <div class="scroll-x tt"></div><div class="readout"></div>`;
  const sel = el.querySelector('.sel'), tt = el.querySelector('.tt'), out = el.querySelector('.readout');
  const draw = () => {
    const [, n, f] = F[+sel.value], vars = 'pqr'.slice(0, n).split(''), rows = [];
    for (let m = (1 << n) - 1; m >= 0; m--) {
      const v = vars.map((_, i) => !!((m >> (n - 1 - i)) & 1));
      rows.push([v, f(...v)]);
    }
    const bit = (b) => (b ? 1 : 0);
    tt.innerHTML = `<table class="t"><tr>${vars.map((x) => `<th>${x}</th>`).join('')}<th>wartość</th></tr>${rows.map(([v, r]) => `<tr${r ? '' : ' style="color:var(--bad);font-weight:700"'}>${v.map((b) => `<td>${bit(b)}</td>`).join('')}<td>${bit(r)}</td></tr>`).join('')}</table>`;
    const bad = rows.find((r) => !r[1]);
    out.innerHTML = bad
      ? `<b class="no">To NIE jest tautologia.</b> Kontrprzykład: ${vars.map((x, i) => `${x}=${bit(bad[0][i])}`).join(', ')} — całość daje 0.`
      : '<b class="ok">Tautologia</b> — w każdym wierszu wychodzi 1.';
  };
  sel.addEventListener('change', draw);
  draw();
};

Widgets.kresy = (el) => {
  const seq = (g, N) => Array.from({ length: N }, (_, i) => g(i + 1));
  const pairs = (g, N) => { const a = []; for (let m = 1; m <= N; m++) for (let n = 1; n <= N; n++) { const v = g(m, n); if (v !== null) a.push(v); } return a; };
  // lo/hi = prawdziwe kresy (hi = Infinity, gdy zbiór jest nieograniczony z góry); tl/th = opis słowny
  const S = [
    { label: 'n/(n+1)', v: seq((n) => n / (n + 1), 200), lo: 0.5, hi: 1, tl: '1/2 — minimum (n=1)', th: '1 — nieosiągany' },
    { label: '1 + 1/2ⁿ', v: seq((n) => 1 + 1 / 2 ** n, 60), lo: 1, hi: 1.5, tl: '1 — nieosiągany', th: '3/2 — maksimum (n=1)' },
    { label: '1 + (−1)ⁿ/n', v: seq((n) => 1 + (n % 2 ? -1 : 1) / n, 200), lo: 0, hi: 1.5, tl: '0 — minimum (n=1)', th: '3/2 — maksimum (n=2)' },
    { label: '(n+1)²/2ⁿ', v: seq((n) => (n + 1) ** 2 / 2 ** n, 60), lo: 0, hi: 2.25, tl: '0 — nieosiągany', th: '9/4 — maksimum (n=2)' },
    { label: '√n − [√n]', v: seq((n) => Math.sqrt(n) - Math.floor(Math.sqrt(n)), 400), lo: 0, hi: 1, tl: '0 — minimum (n=1, 4, 9, …)', th: '1 — nieosiągany' },
    { label: '(n²+2n−3)/(n+1)', v: seq((n) => (n * n + 2 * n - 3) / (n + 1), 30), lo: 0, hi: Infinity, tl: '0 — minimum (n=1)', th: '+∞ — brak ograniczenia z góry' },
    { label: '1/m + 1/n, m,n∈ℕ', v: pairs((m, n) => 1 / m + 1 / n, 25), lo: 0, hi: 2, tl: '0 — nieosiągany', th: '2 — maksimum (m=n=1)' },
    { label: 'm/n, m<n', v: pairs((m, n) => (m < n ? m / n : null), 25), lo: 0, hi: 1, tl: '0 — nieosiągany', th: '1 — nieosiągany' },
  ];
  el.innerHTML = `<p class="w-hint">Kropki to wyrazy zbioru (pierwsze kilkaset). Zanim klikniesz „Pokaż kresy”, spróbuj zgadnąć: gdzie leży najmniejsze ograniczenie z dołu i z góry i czy zbiór je „dotyka”?</p>
    <div class="controls"><label>Zbiór: <select class="sel">${S.map((s, i) => `<option value="${i}">${s.label}</option>`).join('')}</select></label>
    <button class="btn sm rev">Pokaż kresy</button></div>
    <svg class="ks" viewBox="0 0 640 90" style="width:100%;height:auto"></svg><div class="readout"></div>`;
  const sel = el.querySelector('.sel'), svg = el.querySelector('.ks'), out = el.querySelector('.readout');
  let shown = false;
  const draw = () => {
    const s = S[+sel.value];
    const mx = Math.max(...s.v), mn = Math.min(...s.v);
    const a = Math.min(mn, s.lo), b = Number.isFinite(s.hi) ? Math.max(mx, s.hi) : mx, pad = (b - a) * 0.06;
    const X = (x) => 20 + (600 * (x - (a - pad))) / (b - a + 2 * pad);
    let h = '<line x1="14" y1="50" x2="626" y2="50" stroke="var(--line)" stroke-width="2"/>';
    h += s.v.map((x) => `<circle cx="${X(x).toFixed(1)}" cy="50" r="3" fill="var(--accent)" opacity=".45"/>`).join('');
    const mark = (x, c, t, up) => `<line x1="${X(x)}" y1="34" x2="${X(x)}" y2="66" stroke="${c}" stroke-width="2.5"/><text x="${X(x)}" y="${up ? 24 : 82}" text-anchor="middle" font-size="13" font-weight="700" fill="${c}">${t}</text>`;
    if (shown) {
      h += mark(s.lo, 'var(--good)', 'inf', true);
      h += Number.isFinite(s.hi) ? mark(s.hi, 'var(--bad)', 'sup', true) : '<text x="618" y="30" text-anchor="end" font-size="13" font-weight="700" fill="var(--bad)">sup = +∞ →</text>';
    }
    svg.innerHTML = h;
    out.innerHTML = shown ? `<b>inf</b> = ${s.tl}<br><b>sup</b> = ${s.th}` : 'Kresy ukryte — zgadnij, potem odkryj.';
  };
  sel.addEventListener('change', () => { shown = false; draw(); });
  el.querySelector('.rev').addEventListener('click', () => { shown = !shown; draw(); });
  draw();
};

// ───────── lekcje ─────────
const ALG = [
  {
    id: 'a1', part: 4, title: 'Logika: spójniki, tautologie, kwantyfikatory', pages: 'Lista III, zad. 1–6', min: 15,
    lead: 'Kiedy zdanie jest prawdziwe, jak sprawdzić tautologię i jak poprawnie zaprzeczyć zdaniu z „dla każdego” i „istnieje”.',
    blocks: [
      H2('Spójniki logiczne'),
      UL([
        T`$p\land q$ („i”) — prawdziwa tylko gdy <b>oba</b> zdania są prawdziwe.`,
        T`$p\lor q$ („lub”) — fałszywa tylko gdy <b>oba</b> są fałszywe (to „lub” nierozłączne: oba mogą być prawdziwe).`,
        T`$\lnot p$ — negacja: zamienia prawdę na fałsz.`,
        T`$p\Rightarrow q$ — fałszywa <b>tylko</b> gdy $p$ jest prawdziwe, a $q$ fałszywe. Równoważnie: $\lnot p\lor q$.`,
        T`$p\Leftrightarrow q$ — prawdziwa, gdy $p$ i $q$ mają tę samą wartość logiczną.`,
      ]),
      BOX('warn', 'Z fałszu wynika wszystko', T`Implikacja z fałszywym poprzednikiem jest prawdziwa. Dlatego „jeśli $2+2=5$, to $3+3=7$” (zad. 2d) jest <b>prawdziwe</b>. Za to „$2\lt0$ i $3\gt2$” (zad. 2h) jest fałszywe — koniunkcja wymaga obu części.`),
      H2('Tautologie'),
      BOX('def', 'Tautologia', T`Wyrażenie logiczne prawdziwe <b>dla każdego</b> układu wartości zmiennych. Żeby ją obalić, wystarczy <b>jeden</b> kontrprzykład (wiersz z 0).`),
      BOX('tip', 'Szybka metoda zamiast tabelki', T`Załóż, że cała implikacja jest <b>fałszywa</b>: poprzednik $=1$, następnik $=0$. Jeśli da się to zrealizować — masz kontrprzykład. Jeśli prowadzi do sprzeczności — to tautologia.`),
      WIDGET('logicTT', 'Tabelka prawdy: które wyrażenia z zad. 1 są tautologiami?'),
      H2('Kwantyfikatory'),
      P(T`$\forall$ czytamy „dla każdego”, $\exists$ — „istnieje”. Zapis z listy (zad. 3):`),
      UL([
        T`„dla każdej liczby naturalnej $n$ zachodzi $n\lt2^n$” $\ \to\ \forall_{n\in\mathbb N}\ n\lt2^n$`,
        T`„istnieje liczba rzeczywista $x$, dla której $x^2=5$” $\ \to\ \exists_{x\in\mathbb R}\ x^2=5$`,
        T`„między dowolnymi dwiema liczbami rzeczywistymi istnieje trzecia” $\ \to\ \forall_{a,b\in\mathbb R}\ \big(a\lt b\Rightarrow\exists_{c\in\mathbb R}\ a\lt c\lt b\big)$`,
        T`„dla każdej całkowitej $x$ jest naturalna $y$, że $x+y\gt0$” $\ \to\ \forall_{x\in\mathbb Z}\ \exists_{y\in\mathbb N}\ x+y\gt0$`,
      ]),
      BOX('idea', 'Kolejność kwantyfikatorów ma znaczenie', T`$\forall_{x}\exists_{y}\ x+y=0$ jest <b>prawdziwe</b> ($y=-x$ dobieramy do każdego $x$). Ale $\exists_{y}\forall_{x}\ x+y=0$ jest <b>fałszywe</b> — jedno $y$ musiałoby pasować do wszystkich $x$. Podobnie $\forall_{m\in\mathbb N}\exists_{n\in\mathbb N}\ m\gt n$ jest fałszywe: dla $m=1$ nie ma mniejszego $n\in\mathbb N$.`),
      BOX('thm', 'Zaprzeczanie', T`$\lnot\forall_x\,\varphi\iff\exists_x\,\lnot\varphi$ oraz $\lnot\exists_x\,\varphi\iff\forall_x\,\lnot\varphi$. Dla spójników: $\lnot(p\land q)\iff\lnot p\lor\lnot q$, $\lnot(p\lor q)\iff\lnot p\land\lnot q$, $\lnot(p\Rightarrow q)\iff p\land\lnot q$.`),
      STEPS(T`Zaprzeczenie zdania z zad. 4k: $\forall_{x\in\mathbb R}\ \big(x\lt3\Rightarrow\exists_{y\in\mathbb R}\ y=\tfrac1x\big)$`, [
        T`Zamieniamy $\forall$ na $\exists$ i negujemy resztę: $\exists_{x\in\mathbb R}\ \lnot\big(x\lt3\Rightarrow\exists_{y}\ y=\tfrac1x\big)$.`,
        T`Negacja implikacji to „poprzednik i nie następnik”: $\exists_{x\in\mathbb R}\ \big(x\lt3\ \land\ \lnot\exists_{y}\ y=\tfrac1x\big)$.`,
        T`Negujemy $\exists_y$: $\exists_{x\in\mathbb R}\ \big(x\lt3\ \land\ \forall_{y\in\mathbb R}\ y\ne\tfrac1x\big)$.`,
        T`To zdanie jest <b>prawdziwe</b> (np. $x=0$: nie istnieje $\frac10$), więc oryginał jest fałszywy.`,
      ]),
      CHECK([
        Q(T`Implikacja $p\Rightarrow q$ jest fałszywa wtedy i tylko wtedy, gdy:`,
          ['p fałszywe, q prawdziwe', 'p prawdziwe, q fałszywe', 'oba fałszywe', 'oba prawdziwe'], 1,
          T`Prawda „nie może prowadzić do fałszu”. Z fałszywego $p$ implikacja jest zawsze prawdziwa.`),
        Q(T`Które zdanie jest prawdziwe?`,
          [T`$\forall_{x\in\mathbb R}\exists_{y\in\mathbb R}\ x+y=0$`, T`$\exists_{y\in\mathbb R}\forall_{x\in\mathbb R}\ x+y=0$`, T`$\exists_{y\in\mathbb R}\forall_{x\in\mathbb R}\ x\gt y$`, T`$\exists_{m\in\mathbb N}\forall_{n\in\mathbb N}\ m\gt n$`], 0,
          T`Tylko pierwsze: $y=-x$. W pozostałych jedna liczba miałaby pasować do wszystkich (dla $x=y$ albo $n=m$ nierówność ostra się psuje).`),
        Q(T`Zaprzeczeniem zdania $\forall_{x\in\mathbb R}\ \sin x\lt2$ jest:`,
          [T`$\exists_{x\in\mathbb R}\ \sin x\ge2$`, T`$\exists_{x\in\mathbb R}\ \sin x\gt2$`, T`$\forall_{x\in\mathbb R}\ \sin x\ge2$`, T`$\forall_{x\in\mathbb R}\ \sin x\gt2$`], 0,
          T`$\lnot\forall$ to $\exists$, a negacją $\lt$ jest $\ge$ (nie $\gt$).`),
        Q(T`Zdanie „jeśli $2+2=5$, to $3+3=7$” jest:`,
          ['prawdziwe', 'fałszywe', 'ani prawdziwe, ani fałszywe', 'nie da się ocenić'], 0,
          'Poprzednik jest fałszywy, więc implikacja jest prawdziwa.'),
        Q(T`Zaprzeczeniem implikacji $p\Rightarrow q$ jest:`,
          [T`$\lnot p\Rightarrow\lnot q$`, T`$p\land\lnot q$`, T`$\lnot p\land q$`, T`$q\Rightarrow p$`], 1,
          T`Implikacja zawodzi tylko wtedy, gdy $p$ prawdziwe i $q$ fałszywe.`),
      ]),
    ],
  },
  {
    id: 'a2', part: 4, title: 'Zbiory: działania, iloczyn kartezjański, zbiór potęgowy', pages: 'Lista III, zad. 7–20', min: 15,
    lead: 'Wypisywanie elementów, działania na zbiorach, pary uporządkowane, podzbiory oraz sumy i przecięcia nieskończonych rodzin.',
    blocks: [
      H2('Zapis i elementy'),
      UL([
        T`$\emptyset$ ma 0 elementów, a $\{\emptyset\}$ ma <b>jeden</b> element (zbiór pusty), więc $\{\emptyset\}\ne\emptyset$ (zad. 7n, 7p).`,
        T`Elementy zbioru mogą być zbiorami: $D=\{1,2,\{3,4\}\}$ ma <b>3</b> elementy: $1$, $2$ i $\{3,4\}$.`,
        T`$a\in A$ („należy”) to co innego niż $\{a\}\subseteq A$ („zawiera się”). Dla $A=\{a,\{a\}\}$ prawdziwe jest i $a\in A$, i $\{a\}\in A$, i $\{a\}\subseteq A$.`,
        T`Zbiór zadany warunkiem: $B=\{x\in\mathbb Z:(x-3)^2\le2\}$. Mamy $|x-3|\le\sqrt2\approx1{,}41$, więc $x-3\in\{-1,0,1\}$ i $B=\{2,3,4\}$.`,
        T`$\mathbb N=\{1,2,3,\dots\}$, a $\mathbb N_0$ zawiera zero. Stąd $\{x\in\mathbb N_0:x\le0\}=\{0\}$, ale $\{x\in\mathbb N:x\le0\}=\emptyset$.`,
      ]),
      H2('Działania na zbiorach'),
      UL([
        T`$A\cup B$ — suma (należy do $A$ <i>lub</i> do $B$), $A\cap B$ — iloczyn (do obu).`,
        T`$A\setminus B$ — różnica (w $A$, ale nie w $B$); $A\setminus B=A\cap B^c$. $A^c$ — dopełnienie.`,
        T`$A\triangle B=(A\setminus B)\cup(B\setminus A)=(A\cup B)\setminus(A\cap B)$ — różnica symetryczna.`,
      ]),
      BOX('thm', 'Prawa', T`$A\cap(B\cup C)=(A\cap B)\cup(A\cap C)$, $\ A\cup(B\cap C)=(A\cup B)\cap(A\cup C)$, $\ (A\cup B)^c=A^c\cap B^c$, $\ (A\cap B)^c=A^c\cup B^c$. Do uzasadnienia (zad. 12) rysuj diagram Venna i zacieniuj obie strony.`),
      BOX('tip', 'Gdy A ⊆ B (zad. 13)', T`<b>Zawsze prawdziwe:</b> $A\cap B=A$, $A\setminus B=\emptyset$, $(A\cup B)\setminus B=\emptyset$, $(A\cap B)\cup B=B$. <b>Nieprawdziwe w ogólności:</b> $A\cup B=A$ (prawda tylko gdy $A=B$) i $B\setminus A=B$ (tylko gdy $A=\emptyset$).`),
      H2('Iloczyn kartezjański i zbiór potęgowy'),
      UL([
        T`$A\times B=\{(a,b):a\in A,\ b\in B\}$ — <b>pary uporządkowane</b>. $|A\times B|=|A|\cdot|B|$, a $A\times B\ne B\times A$ (kolejność w parze ma znaczenie). Np. $A=\{1\}$, $B=\{2,3\}$: $A\times B=\{(1,2),(1,3)\}$, $B\times A=\{(2,1),(3,1)\}$.`,
        T`$\mathcal P(A)=2^A$ — zbiór wszystkich podzbiorów. Ma $2^{|A|}$ elementów. $\mathcal P(\{a,b,c\})$ ma 8 elementów: $\emptyset,\{a\},\{b\},\{c\},\{a,b\},\{a,c\},\{b,c\},\{a,b,c\}$.`,
        T`$\mathcal P(\emptyset)=\{\emptyset\}$ (1 element). $\mathcal P(\{\emptyset\})=\{\emptyset,\{\emptyset\}\}$. Dla $A_6=\{\{a\},a\}$: $\mathcal P(A_6)=\{\emptyset,\{\{a\}\},\{a\},\{\{a\},a\}\}$ — 4 elementy.`,
      ]),
      STEPS(T`Zad. 19: $A=\{x\in\mathbb Z:x^2\lt7\}$, $B=\{y\in\mathbb N:|1-y|\lt7\}$ — wyznacz $A\triangle B$`, [
        T`$x^2\lt7\iff|x|\lt\sqrt7\approx2{,}6$, więc $A=\{-2,-1,0,1,2\}$.`,
        T`$|1-y|\lt7\iff-6\lt y\lt8$; dla $y\in\mathbb N$ dostajemy $B=\{1,2,3,4,5,6,7\}$.`,
        T`$A\cap B=\{1,2\}$, $A\setminus B=\{-2,-1,0\}$, $B\setminus A=\{3,4,5,6,7\}$.`,
        T`$A\triangle B=(A\setminus B)\cup(B\setminus A)=\{-2,-1,0,3,4,5,6,7\}$.`,
      ]),
      H2('Sumy i przecięcia nieskończone'),
      P(T`$\bigcup_{n=1}^\infty A_n$ — punkty, które należą do <b>przynajmniej jednego</b> $A_n$; $\bigcap_{n=1}^\infty A_n$ — punkty należące do <b>wszystkich</b> $A_n$. Pytaj: „kto zostaje, gdy $n\to\infty$?” (zad. 20).`),
      TBL(['$A_n$', '$\\bigcup A_n$', '$\\bigcap A_n$'], [
        T`$[-\frac1n,\frac1n]$ | $[-1,1]$ | $\{0\}$`,
        T`$[\frac1{n+1},\frac1n]$ | $(0,1]$ | $\emptyset$`,
        T`$[\frac1n,\frac2n]$ | $(0,2]$ | $\emptyset$`,
        T`$[(1+\frac1n)^n,\,3]$ | $[2,3]$ | $[e,3]$`,
        T`$[n,n+1]$ | $[1,\infty)$ | $\emptyset$`,
      ]),
      P(T`W wierszu 4 lewy koniec $(1+\frac1n)^n$ rośnie od $2$ do $e$, więc suma zaczyna się w $2$ (najmniejszy lewy koniec), a część wspólna — dopiero w $e$ (kresie górnym lewych końców).`),
      CHECK([
        Q(T`Ile elementów ma zbiór potęgowy zbioru 4-elementowego?`, ['8', '16', '4', '24'], 1, T`$2^4=16$.`),
        Q(T`Zbiór $K=\{\emptyset\}$ ma:`, ['0 elementów', '1 element', '2 elementy', 'nie jest zbiorem'], 1, T`Jego jedynym elementem jest $\emptyset$. Dlatego $K\ne\emptyset$.`),
        Q(T`Jeśli $A\subseteq B$, to zawsze zachodzi:`, [T`$A\cup B=A$`, T`$A\cap B=A$`, T`$B\setminus A=B$`, T`$A\setminus B=B$`], 1, T`Wspólna część mniejszego i większego zbioru to ten mniejszy.`),
        Q(T`Dla $A=\{1\}$, $B=\{2,3\}$ zbiór $A\times B$ ma:`, ['2 elementy i jest równy $B\\times A$', '2 elementy i nie jest równy $B\\times A$', '3 elementy', '1 element'], 1, T`$A\times B=\{(1,2),(1,3)\}$, a $B\times A=\{(2,1),(3,1)\}$ — inne pary.`),
        Q(T`$\displaystyle\bigcap_{n=1}^\infty\left[-\tfrac1n,\tfrac1n\right]=$`, [T`$\{0\}$`, T`$[-1,1]$`, T`$\emptyset$`, T`$(-1,1)$`], 0, T`Jedyny punkt, który jest w każdym przedziale, to $0$.`),
        Q(T`$\mathcal P(\emptyset)=$`, [T`$\emptyset$`, T`$\{\emptyset\}$`, T`$\{0\}$`, 'nie istnieje'], 1, T`Zbiór pusty ma jeden podzbiór: samego siebie.`),
      ]),
    ],
  },
  {
    id: 'a3', part: 4, title: 'Kresy zbiorów (supremum i infimum)', pages: 'kresy.pdf — Zadanie 1 a–z', min: 20,
    lead: 'Najmniejsze ograniczenie z góry i największe z dołu — i jak je znaleźć dla zbioru zadanego nierównością, ciągiem lub dwoma indeksami.',
    blocks: [
      BOX('def', 'Kresy', T`$M$ jest <b>ograniczeniem górnym</b> zbioru $A$, gdy $\forall_{x\in A}\ x\le M$. <b>Kres górny</b> $\sup A$ to <i>najmniejsze</i> ograniczenie górne. Analogicznie <b>kres dolny</b> $\inf A$ to <i>największe</i> ograniczenie dolne. Gdy $A$ nie jest ograniczony z góry, piszemy $\sup A=+\infty$ (z dołu: $\inf A=-\infty$).`),
      BOX('thm', 'Charakteryzacja (z ε)', T`$s=\sup A\iff$ (1) $\forall_{x\in A}\ x\le s$ oraz (2) $\forall_{\varepsilon\gt0}\ \exists_{x\in A}\ x\gt s-\varepsilon$ — czyli nic mniejszego niż $s$ nie jest ograniczeniem. Dla $\inf$: (1) $x\ge i$ oraz (2) $\exists_x\ x\lt i+\varepsilon$.`),
      BOX('warn', 'Kres ≠ maksimum', T`Kres może <b>nie należeć</b> do zbioru. $\sup(0,1)=1$, ale $(0,1)$ nie ma elementu największego. Maksimum istnieje dokładnie wtedy, gdy kres górny <i>należy</i> do zbioru. Każdy niepusty zbiór ograniczony z góry ma kres górny (aksjomat ciągłości) — maksimum już nie musi.`),
      H2('Jak liczyć kresy'),
      UL([
        T`<b>Zbiór zadany nierównością</b> (np. $|2x-5|\lt3$): rozwiąż nierówność. Wynik to przedziały — kresy to ich końce. „Dziury” w środku (np. $x\ne1$) kresów nie zmieniają.`,
        T`<b>Ciąg $a_n$ ($n\in\mathbb N$):</b> wypisz pierwsze wyrazy, sprawdź monotoniczność (iloraz lub różnica $a_{n+1}$ i $a_n$) i granicę. Jeśli ciąg maleje do $g$, to $\inf=g$ (nieosiągany), a $\sup=a_1$ (max).`,
        T`<b>Dwa indeksy $\{f(m,n)\}$:</b> sprawdź, co się dzieje, gdy jeden lub oba indeksy rosną; do oszacowań używaj nierówności, np. $t+\frac4t\ge4$ (bo $(t-2)^2\ge0$).`,
      ]),
      BOX('tip', 'Konwencja', T`W tej liście $\mathbb N=\{1,2,3,\dots\}$.`),
      STEPS(T`Zad. 1a: $\{x\in\mathbb R:\ |2x+3|+|x+3|-x\lt6\}$`, [
        T`Punkty zerowe modułów: $2x+3=0\iff x=-\frac32$ i $x+3=0\iff x=-3$. Dzielą oś na trzy przedziały.`,
        T`<b>$x\ge-\frac32$:</b> oba moduły się otwierają dodatnio: $(2x+3)+(x+3)-x=2x+6\lt6\iff x\lt0$. Daje $[-\frac32,0)$.`,
        T`<b>$-3\le x\lt-\frac32$:</b> $-(2x+3)+(x+3)-x=-2x\lt6\iff x\gt-3$. Daje $(-3,-\frac32)$.`,
        T`<b>$x\lt-3$:</b> $-(2x+3)-(x+3)-x=-4x-6\lt6\iff x\gt-3$ — sprzeczne z $x\lt-3$. Pusto.`,
        T`Zbiór to $(-3,0)$. Kresy: $\inf=-3$, $\sup=0$; żaden nie należy do zbioru (brak min i max).`,
      ]),
      STEPS(T`Zad. 1r: $\left\{\dfrac{(n+1)^2}{2^n}:n\in\mathbb N\right\}$`, [
        T`Wyrazy: $a_1=2$, $a_2=\frac94=2{,}25$, $a_3=2$, $a_4=\frac{25}{16}\approx1{,}56$, … Ciąg najpierw rośnie, potem maleje.`,
        T`Iloraz: $\dfrac{a_{n+1}}{a_n}=\dfrac{(n+2)^2}{2(n+1)^2}\le1\iff\dfrac{n+2}{n+1}\le\sqrt2\iff n\ge\sqrt2$, czyli od $n=2$ ciąg maleje.`,
        T`Największy wyraz to $a_2=\frac94$: $\sup=\max=\frac94$. Dalej $a_n\to0$ (wykładnicza wygrywa z wielomianem) i wszystkie wyrazy są dodatnie: $\inf=0$, nieosiągany.`,
      ]),
      STEPS(T`Zad. 1x: $\left\{\dfrac mn+\dfrac{4n}m:\ m,n\in\mathbb N\right\}$`, [
        T`Podstaw $t=\frac mn\gt0$: wyrażenie to $t+\frac4t$.`,
        T`$t+\frac4t-4=\frac{(t-2)^2}{t}\ge0$, więc $t+\frac4t\ge4$. Równość dla $t=2$, np. $m=2,n=1$: $2+2=4$.`,
        T`Zatem $\inf=\min=4$. Dla $m=1$ i $n\to\infty$ wyrażenie $\frac1n+4n\to\infty$, więc $\sup=+\infty$.`,
      ]),
      WIDGET('kresy', 'Rozrzut zbioru na osi: zgadnij kresy, potem sprawdź'),
      H2('Odpowiedzi do całej listy (zad. 1 a–z)'),
      P(T`Odpowiedzi policzyłam z zeskanowanej listy — jeśli któryś wzór wygląda inaczej niż w Twoim egzemplarzu, policz go ręcznie według powyższych schematów. „min/max” oznacza, że kres jest osiągany.`),
      TBL(['', 'zbiór / ciąg', '$\\inf$', '$\\sup$'], [
        T`a) | $(-3,0)$ | $-3$ | $0$`,
        T`b) | $(0,2)$ ($|x-1|\lt1$ po skróceniu przez $x^2+x+1\gt0$) | $0$ | $2$`,
        T`c) | $(-10,6)\setminus\{-2\}$ | $-10$ | $6$`,
        T`d) | $(-1,3)\setminus\{1\}$ | $-1$ | $3$`,
        T`e) | $(2,3)$ | $2$ | $3$`,
        T`f) | $(1,4)$ | $1$ | $4$`,
        T`g) | $(-5,5)\setminus\{-1,1\}$ | $-5$ | $5$`,
        T`h) | $\{\frac1{k\pi}:k\in\mathbb N\}$ | $0$ (nieosiągany) | $\frac1\pi$ (max)`,
        T`i) | $0{,}3;\ 0{,}33;\ 0{,}333;\dots$ | $0{,}3$ (min) | $\frac13$ (nieosiągany)`,
        T`j) | wyrazy: $-3;\,-5{,}5;\,5;\,0{,}75;\dots$ | $-\frac{11}2$ (min, $n=2$) | $5$ (max, $n=3$)`,
        T`k) | $\frac{n-1}{n+1}\cos\frac{2n\pi}3$ | $-\frac12$ (nieosiągany) | $1$ (nieosiągany)`,
        T`l) | $1+\frac{(-1)^n}n$ | $0$ (min, $n=1$) | $\frac32$ (max, $n=2$)`,
        T`m) | $1+\frac1{2^n}$ | $1$ (nieosiągany) | $\frac32$ (max, $n=1$)`,
        T`n) | $1+\frac{(-1)^n}{n^2}$ | $0$ (min, $n=1$) | $\frac54$ (max, $n=2$)`,
        T`o) | $\frac{n^2+2n-3}{n+1}=n+1-\frac4{n+1}$ | $0$ (min, $n=1$) | $+\infty$`,
        T`p) | $\frac n{n+1}$ | $\frac12$ (min) | $1$ (nieosiągany)`,
        T`q) | $\sqrt n-[\sqrt n]$ | $0$ (min) | $1$ (nieosiągany)`,
        T`r) | $\frac{(n+1)^2}{2^n}$ | $0$ (nieosiągany) | $\frac94$ (max)`,
        T`s) | $\frac{(n+m)^2}{2^{nm}}$ | $0$ (nieosiągany) | $\frac94$ (max, $m=1,n=2$)`,
        T`t) | $\frac mn$, $m\lt n$ | $0$ (nieosiągany) | $1$ (nieosiągany)`,
        T`u) | $\frac1m+\frac1n$ | $0$ (nieosiągany) | $2$ (max)`,
        T`v) | $k+\frac1n$, $k\in\{1,2,3\}$ | $1$ (nieosiągany) | $4$ (max)`,
        T`w) | $\frac n{n+m}$ | $0$ (nieosiągany) | $1$ (nieosiągany)`,
        T`x) | $\frac mn+\frac{4n}m$ | $4$ (min) | $+\infty$`,
        T`y) | $\frac{mn}{4m^2+n^2}$, $m\in\mathbb Z$ | $-\frac14$ (min) | $\frac14$ (max)`,
        T`z) | $\frac{mn}{1+m+n}$ | $\frac13$ (min, $m=n=1$) | $+\infty$`,
      ]),
      CHECK([
        Q(T`Czy zbiór $(0,1)$ ma element największy?`, ['Tak, 1', 'Tak, 0,999…', T`Nie, ale $\sup=1$`, T`Nie ma nawet $\sup$`], 2, T`Kres górny istnieje i wynosi $1$, ale do zbioru nie należy.`),
        Q(T`$\inf\left\{\frac1n:n\in\mathbb N\right\}=$`, ['1', T`$0$ i jest to minimum`, T`$0$, ale nie jest minimum`, 'nie istnieje'], 2, T`Wyrazy zbliżają się do $0$ dowolnie blisko, ale nigdy go nie osiągają.`),
        Q(T`Kresy zbioru $\{x:\ x^2-5x+6\lt0\}$ to:`, [T`$\inf=2$, $\sup=3$, oba należą do zbioru`, T`$\inf=2$, $\sup=3$, żaden nie należy`, T`$\inf=-3$, $\sup=-2$`, T`$\inf=0$, $\sup=6$`], 1, T`$(x-2)(x-3)\lt0\iff x\in(2,3)$ — przedział otwarty.`),
        Q(T`Najmniejsza wartość $t+\dfrac4t$ dla $t\gt0$ to:`, ['2', '4', '1', 'nie ma'], 1, T`$t+\frac4t-4=\frac{(t-2)^2}t\ge0$, równość dla $t=2$.`),
        Q(T`$\sup\left\{\frac n{n+1}:n\in\mathbb N\right\}$ jest równy:`, [T`$1$ i jest osiągany`, T`$1$ i nie jest osiągany`, T`$\frac12$`, T`$+\infty$`], 1, T`$\frac n{n+1}\lt1$ zawsze, a z $n\to\infty$ zbliża się do $1$ dowolnie blisko.`),
      ]),
    ],
  },
  {
    id: 'a4', part: 4, title: 'Potęgi, pierwiastki i liczby', pages: 'Wyr. alg. I.1–I.9, I.33–I.34', min: 15,
    lead: 'Prawa działań na potęgach z wykładnikami całkowitymi i ułamkowymi, zapis jednym pierwiastkiem, ułamki okresowe i notacja wykładnicza.',
    blocks: [
      BOX('thm', 'Prawa potęg (dla $a,b\\ne0$ lub wykładników dodatnich)', T`$a^m\cdot a^n=a^{m+n}$, $\ \dfrac{a^m}{a^n}=a^{m-n}$, $\ (a^m)^n=a^{mn}$, $\ (ab)^n=a^nb^n$, $\ a^{-n}=\dfrac1{a^n}$, $\ a^0=1$, $\ a^{m/n}=\sqrt[n]{a^m}$.`),
      BOX('warn', 'Typowe pułapki', T`$(a+b)^n\ne a^n+b^n$. $\ \sqrt{x^2}=|x|$ (nie $x$!). $\ -3^2=-9$, ale $(-3)^2=9$. Zero nie może stać w mianowniku ani być podnoszone do niedodatniej potęgi.`),
      STEPS(T`I.2d: $\left(\dfrac{45x^{-4}y^2}{9z^{-8}}\right)^{-3}$`, [
        T`Najpierw upraszczamy w nawiasie: $\dfrac{45}{9}=5$, a $\dfrac1{z^{-8}}=z^8$. Mamy $\left(5x^{-4}y^2z^8\right)^{-3}$.`,
        T`Potęgujemy każdy czynnik osobno (wykładniki mnożymy): $5^{-3}\,x^{12}\,y^{-6}\,z^{-24}$.`,
        T`Wynik: $\dfrac{x^{12}}{125\,y^6z^{24}}$.`,
      ]),
      STEPS(T`I.4: ułamkowe wykładniki — sprowadź do wspólnej podstawy`, [
        T`a) $\dfrac{2^{5/3}}{4^{7/3}}=\dfrac{2^{5/3}}{2^{14/3}}=2^{-3}=\dfrac18$.`,
        T`b) $3^{-8/11}\left(\tfrac19\right)^{-4/11}=3^{-8/11}\cdot3^{8/11}=3^0=1$.`,
        T`d) $20^{7/2}\cdot5^{-7/2}=\left(\tfrac{20}5\right)^{7/2}=4^{7/2}=2^7=128$ (gdy wykładniki są równe, łączymy podstawy).`,
      ]),
      STEPS(T`I.5a: zapisz $\sqrt5\cdot\sqrt[5]2$ jednym pierwiastkiem`, [
        T`Zamieniamy na wykładniki: $5^{1/2}\cdot2^{1/5}$.`,
        T`Wspólny mianownik wykładników to $10$: $5^{5/10}\cdot2^{2/10}=(5^5\cdot2^2)^{1/10}$.`,
        T`Wynik: $\sqrt[10]{5^5\cdot2^2}=\sqrt[10]{12500}$.`,
      ]),
      H2('Ułamki okresowe i notacja wykładnicza'),
      UL([
        T`<b>Okres → ułamek:</b> $x=0{,}(7)=0{,}777\dots$; $10x=7{,}777\dots$; odejmij: $9x=7$, czyli $x=\frac79$. Dla $3{,}14(5)$: $100x=314{,}555\dots$, $1000x=3145{,}555\dots$; odejmij: $900x=2831$, więc $x=\frac{2831}{900}$.`,
        T`<b>Notacja wykładnicza:</b> $a\cdot10^k$, gdzie $1\le a\lt10$. Np. $0{,}000\dots0167\text{ kg}=1{,}67\cdot10^{-27}\text{ kg}$; $\ 7{,}632\cdot10^{-4}=0{,}0007632$; $\ 9{,}4\cdot10^5=940000$.`,
        T`<b>Odległość</b> między $a$ i $b$ na osi to $|a-b|$: dla $a=-2$, $b=3$ jest $|-2-3|=5$.`,
      ]),
      CHECK([
        Q(T`$\dfrac{2^{5/3}}{4^{7/3}}=$`, [T`$\frac18$`, '8', '2', T`$\frac14$`], 0, T`$4^{7/3}=2^{14/3}$, więc iloraz to $2^{5/3-14/3}=2^{-3}$.`),
        Q(T`$\sqrt{x^2}=$`, ['x', '|x|', '−x', 'x²'], 1, T`Pierwiastek jest zawsze nieujemny; dla $x\lt0$ wynik to $-x$.`),
        Q(T`$20^{7/2}\cdot5^{-7/2}=$`, ['128', '16384', '2', '25'], 0, T`$\left(\frac{20}5\right)^{7/2}=4^{7/2}=2^7=128$.`),
        Q(T`$\dfrac{x\,(x^2)^4}{(x^3)^3}$ dla $x\ne0$ równa się:`, ['1', 'x', T`$x^2$`, T`$x^{-1}$`], 0, T`Licznik: $x\cdot x^8=x^9$, mianownik: $x^9$.`),
        Q(T`$0{,}(7)=$`, [T`$\frac79$`, T`$\frac7{10}$`, T`$\frac78$`, T`$\frac{77}{100}$`], 0, T`$10x-x=7\Rightarrow 9x=7$.`),
        Q(T`Liczba $0{,}0007632$ w notacji wykładniczej to:`, [T`$7{,}632\cdot10^{-4}$`, T`$7{,}632\cdot10^{4}$`, T`$0{,}7632\cdot10^{-3}$`, T`$76{,}32\cdot10^{-5}$`], 0, T`Przesuwamy przecinek o 4 miejsca w prawo (wykładnik $-4$), mantysa ma być z $[1,10)$.`),
      ]),
    ],
  },
  {
    id: 'a5', part: 4, title: 'Wzory skróconego mnożenia i ułamki algebraiczne', pages: 'Wyr. alg. I.10–I.17', min: 18,
    lead: 'Rozwijanie, rozkład na czynniki, postać kanoniczna i upraszczanie wyrażeń wymiernych — zawsze z pilnowaniem dziedziny.',
    blocks: [
      BOX('thm', 'Wzory do zapamiętania', T`$(a\pm b)^2=a^2\pm2ab+b^2$, $\ (a\pm b)^3=a^3\pm3a^2b+3ab^2\pm b^3$.<br>$a^2-b^2=(a-b)(a+b)$, $\ a^4-b^4=(a^2+b^2)(a+b)(a-b)$.<br>$a^3\pm b^3=(a\pm b)(a^2\mp ab+b^2)$.`),
      H2('Rozkład na czynniki — metody'),
      UL([
        T`<b>Wzór:</b> $4x^2-1=(2x-1)(2x+1)$; $\ a^3+125b^3=(a+5b)(a^2-5ab+25b^2)$.`,
        T`<b>Grupowanie:</b> $x^3+x^2-x-1=x^2(x+1)-(x+1)=(x+1)(x^2-1)=(x+1)^2(x-1)$.`,
        T`<b>Dopełnianie do wzoru:</b> $a^2+b^2-c^2-2ab=(a-b)^2-c^2=(a-b-c)(a-b+c)$. Dla $x^4+y^4$ dodaj i odejmij $2x^2y^2$: $(x^2+y^2)^2-2x^2y^2=(x^2+\sqrt2xy+y^2)(x^2-\sqrt2xy+y^2)$.`,
        T`<b>Z pierwiastkami:</b> $x^3-24=x^3-(\sqrt[3]{24})^3$, a $\sqrt[3]{24}=2\sqrt[3]3$, więc $(x-2\sqrt[3]3)(x^2+2\sqrt[3]3\,x+4\sqrt[3]9)$.`,
      ]),
      H2('Postać kanoniczna'),
      P(T`$ax^2+bx+c=a\left(x+\dfrac b{2a}\right)^2-\dfrac\Delta{4a}$, gdzie $\Delta=b^2-4ac$. Przykłady: $x^2-6x+1=(x-3)^2-8$; $\ 3x^2+9x=3\left(x+\tfrac32\right)^2-\tfrac{27}4$; $\ 6x-x^2=-(x-3)^2+9$.`),
      H2('Ułamki algebraiczne'),
      BOX('warn', 'Najpierw dziedzina, potem skracanie', T`Skracać można tylko <b>czynniki</b>, nie składniki: $\dfrac{x^2-1}{x-1}=x+1$ (dla $x\ne1$), ale $\dfrac{x+3}{x}\ne1+3$. Zapisz, jakie wartości wykluczają mianowniki (zad. 12).`),
      STEPS(T`I.12e: $\dfrac{2x}{x+5}+\dfrac{2x-10}{x^2-25}$`, [
        T`Rozkładamy mianownik: $x^2-25=(x+5)(x-5)$. Dziedzina: $x\ne\pm5$. Wspólny mianownik to $(x+5)(x-5)$.`,
        T`$\dfrac{2x(x-5)+(2x-10)}{(x+5)(x-5)}=\dfrac{2x^2-8x-10}{(x+5)(x-5)}$.`,
        T`Licznik: $2(x^2-4x-5)=2(x-5)(x+1)$. Skracamy $(x-5)$.`,
        T`Wynik: $\dfrac{2(x+1)}{x+5}=\dfrac{2x+2}{x+5}$.`,
      ]),
      STEPS(T`I.12d: $\dfrac{k-1}{k^2+k}\cdot\dfrac{2k}{k^2-1}$`, [
        T`Rozkładamy: $k^2+k=k(k+1)$, $\ k^2-1=(k-1)(k+1)$.`,
        T`$\dfrac{k-1}{k(k+1)}\cdot\dfrac{2k}{(k-1)(k+1)}$ — skracają się $k$ i $(k-1)$.`,
        T`Wynik: $\dfrac2{(k+1)^2}$.`,
      ]),
      BOX('tip', 'Podstawienia (I.15–I.16)', T`Podstawiasz wyrażenie za $x$ w nawiasach, potem upraszczasz. Np. $x^2-2x$ dla $x:=t+1$: $(t+1)^2-2(t+1)=t^2+2t+1-2t-2=t^2-1$.`),
      CHECK([
        Q(T`$a^4-b^4=$`, [T`$(a^2+b^2)(a+b)(a-b)$`, T`$(a^2-b^2)^2$`, T`$(a-b)^4$`, T`$(a^2+b^2)^2$`], 0, T`Dwa razy różnica kwadratów: $(a^2-b^2)(a^2+b^2)$, a $a^2-b^2=(a-b)(a+b)$.`),
        Q(T`$4x^2-1=$`, [T`$(2x-1)(2x+1)$`, T`$(4x-1)(x+1)$`, T`$(2x-1)^2$`, T`$(2x+1)^2$`], 0, T`$(2x)^2-1^2$.`),
        Q(T`Postać kanoniczna $x^2-6x+1$ to:`, [T`$(x-3)^2-8$`, T`$(x-3)^2+1$`, T`$(x+3)^2-8$`, T`$(x-6)^2+1$`], 0, T`$(x-3)^2=x^2-6x+9$, więc trzeba odjąć $8$.`),
        Q(T`$(x+3y)^2-(x-3y)^2=$`, ['12xy', '6xy', T`$18y^2$`, '0'], 0, T`Składniki $x^2$ i $9y^2$ się znoszą, zostaje $6xy-(-6xy)=12xy$.`),
        Q(T`$\dfrac{2x}{x+5}+\dfrac{2x-10}{x^2-25}=$`, [T`$\frac{2(x+1)}{x+5}$`, T`$\frac{4x-10}{x^2+x-25}$`, '2', T`$\frac{2x+2}{x-5}$`], 0, T`Wspólny mianownik $(x+5)(x-5)$; po skróceniu $(x-5)$ zostaje $\frac{2x+2}{x+5}$.`),
        Q(T`$a^3+125b^3=$`, [T`$(a+5b)(a^2-5ab+25b^2)$`, T`$(a+5b)^3$`, T`$(a-5b)(a^2+5ab+25b^2)$`, T`$(a+5b)(a^2+5ab+25b^2)$`], 0, T`$a^3+c^3=(a+c)(a^2-ac+c^2)$ dla $c=5b$.`),
      ]),
    ],
  },
  {
    id: 'a6', part: 4, title: 'Niewymierności: sprzężenie i pierwiastki zagnieżdżone', pages: 'Wyr. alg. I.20–I.25', min: 15,
    lead: 'Usuwanie pierwiastków z mianownika, upraszczanie √(a ± b√c) i sumy teleskopowe.',
    blocks: [
      BOX('idea', 'Sprzężenie', T`Żeby pozbyć się pierwiastka z mianownika, mnożymy licznik i mianownik przez <b>sprzężenie</b> — wyrażenie ze zmienionym znakiem — i używamy $(a-b)(a+b)=a^2-b^2$. Dla pierwiastków trzeciego stopnia: $(a+b)(a^2-ab+b^2)=a^3+b^3$.`),
      STEPS(T`I.20a i I.20d`, [
        T`a) $\dfrac1{\sqrt5-1}\cdot\dfrac{\sqrt5+1}{\sqrt5+1}=\dfrac{\sqrt5+1}{5-1}=\dfrac{1+\sqrt5}4$.`,
        T`d) $\dfrac1{\sqrt[3]5+2}$: bierzemy $a=\sqrt[3]5$, $b=2$ i mnożymy przez $a^2-ab+b^2=\sqrt[3]{25}-2\sqrt[3]5+4$.`,
        T`Mianownik: $a^3+b^3=5+8=13$. Wynik: $\dfrac{\sqrt[3]{25}-2\sqrt[3]5+4}{13}$.`,
      ]),
      H2('Pierwiastki zagnieżdżone: √(a ± b√c)'),
      BOX('tip', 'Metoda', T`Szukamy liczb $x,y\gt0$ takich, że $\sqrt{a\pm2\sqrt{xy}}=\sqrt x\pm\sqrt y$, czyli $x+y=a$ i $xy=$ (pod pierwiastkiem). Wpisz $b\sqrt c$ jako $2\sqrt{\cdot}$: $4\sqrt2=2\sqrt8$.`),
      STEPS(T`I.23: $\sqrt{6+4\sqrt2}$, $\ \sqrt{19+8\sqrt3}$, $\ \sqrt{7-2\sqrt{10}}$`, [
        T`$6+4\sqrt2=6+2\sqrt8$. Szukamy $x+y=6$, $xy=8$: $x=4,y=2$. Zatem $\sqrt{6+4\sqrt2}=\sqrt4+\sqrt2=2+\sqrt2$.`,
        T`$19+8\sqrt3=19+2\sqrt{48}$: $x+y=19$, $xy=48$, czyli $16$ i $3$. Wynik: $4+\sqrt3$.`,
        T`$7-2\sqrt{10}$: $x+y=7$, $xy=10$, czyli $5$ i $2$. Wynik: $\sqrt5-\sqrt2$ (większy pierwiastek pierwszy, żeby wynik był dodatni).`,
      ]),
      STEPS(T`I.24a: pokaż, że $\sqrt{9-4\sqrt5}+\sqrt{14-6\sqrt5}=1$`, [
        T`$9-4\sqrt5=(\sqrt5-2)^2$, bo $(\sqrt5-2)^2=5-4\sqrt5+4$.`,
        T`$14-6\sqrt5=(3-\sqrt5)^2$, bo $(3-\sqrt5)^2=9-6\sqrt5+5$.`,
        T`Obie liczby w nawiasach są dodatnie ($\sqrt5\gt2$ i $3\gt\sqrt5$), więc $\sqrt{(\cdot)^2}$ opuszcza pierwiastek bez zmiany znaku: $(\sqrt5-2)+(3-\sqrt5)=1$.`,
      ]),
      H2('Sumy teleskopowe (I.25)'),
      P(T`$\dfrac1{\sqrt k+\sqrt{k+1}}=\sqrt{k+1}-\sqrt k$ (sprzężenie). Dlatego $\dfrac1{\sqrt1+\sqrt2}+\dots+\dfrac1{\sqrt{99}+\sqrt{100}}=(\sqrt2-\sqrt1)+(\sqrt3-\sqrt2)+\dots+(\sqrt{100}-\sqrt{99})=\sqrt{100}-\sqrt1=9$ — wszystko w środku się skraca.`),
      CHECK([
        Q(T`$\dfrac1{\sqrt5-1}=$`, [T`$\frac{\sqrt5+1}4$`, T`$\frac{\sqrt5-1}4$`, T`$\sqrt5+1$`, T`$\frac14$`], 0, T`Mnożymy przez $\sqrt5+1$; mianownik to $5-1=4$.`),
        Q(T`$\sqrt{6+4\sqrt2}=$`, [T`$2+\sqrt2$`, T`$\sqrt6+2\sqrt2$`, T`$4+\sqrt2$`, T`$2\sqrt2+1$`], 0, T`$(2+\sqrt2)^2=4+4\sqrt2+2=6+4\sqrt2$.`),
        Q(T`$\dfrac1{\sqrt1+\sqrt2}+\dfrac1{\sqrt2+\sqrt3}+\dots+\dfrac1{\sqrt{99}+\sqrt{100}}=$`, ['9', '10', T`$\sqrt{100}$`, '1'], 0, T`Suma teleskopowa daje $\sqrt{100}-\sqrt1=9$.`),
        Q(T`$\sqrt{7-2\sqrt{10}}=$`, [T`$\sqrt5-\sqrt2$`, T`$\sqrt5+\sqrt2$`, T`$\sqrt7-\sqrt{10}$`, '5−2'], 0, T`$(\sqrt5-\sqrt2)^2=7-2\sqrt{10}$, a $\sqrt5\gt\sqrt2$, więc wynik jest dodatni.`),
        Q(T`$\sqrt{(\sqrt3-3)^2}=$`, [T`$3-\sqrt3$`, T`$\sqrt3-3$`, '0', T`$\sqrt3+3$`], 0, T`$\sqrt{x^2}=|x|$, a $\sqrt3-3\lt0$, więc wynik to przeciwna liczba $3-\sqrt3$.`),
      ]),
    ],
  },
  {
    id: 'a7', part: 4, title: 'Wartość bezwzględna: równania i nierówności', pages: 'Wyr. alg. I.9, I.21–I.22, I.26–I.32', min: 20,
    lead: 'Moduł jako odległość, rozwiązywanie równań i nierówności z jednym i wieloma modułami oraz przepis „przedziałami”.',
    blocks: [
      BOX('def', 'Wartość bezwzględna', T`$|x|=x$ dla $x\ge0$ i $|x|=-x$ dla $x\lt0$. Geometrycznie: odległość od zera. $|a-b|$ to odległość punktów $a$ i $b$ na osi. Pamiętaj: $\sqrt{x^2}=|x|$.`),
      BOX('thm', 'Najczęstsze przypadki', T`Dla $a\gt0$: $|x|=a\iff x=\pm a$; $\ |x|\lt a\iff-a\lt x\lt a$; $\ |x|\gt a\iff x\lt-a\ \lor\ x\gt a$. Dla $a\lt0$: $|x|=a$ nie ma rozwiązań, $|x|\gt a$ jest zawsze prawdziwe, $|x|\lt a$ — nigdy. Nierówność trójkąta: $|x+y|\le|x|+|y|$.`),
      BOX('tip', 'Wiele modułów: metoda przedziałów', T`1) Znajdź punkty zerowe każdego modułu. 2) Podziel oś na przedziały. 3) W każdym przedziale opuść moduły z odpowiednimi znakami i rozwiąż. 4) <b>Sprawdź, czy rozwiązanie leży w tym przedziale.</b> 5) Zsumuj wyniki.`),
      STEPS(T`I.26h: $|x+2|=6-2x$`, [
        T`Punkt zerowy: $x=-2$. Dwa przypadki.`,
        T`<b>$x\ge-2$:</b> $x+2=6-2x\iff3x=4\iff x=\frac43$. Czy $\frac43\ge-2$? Tak — rozwiązanie.`,
        T`<b>$x\lt-2$:</b> $-(x+2)=6-2x\iff x=8$. Czy $8\lt-2$? Nie — odrzucamy.`,
        T`Odpowiedź: $x=\frac43$.`,
      ]),
      STEPS(T`I.26n: $|x-2|+|x-7|=7$`, [
        T`Punkty zerowe: $2$ i $7$. Trzy przedziały.`,
        T`<b>$x\lt2$:</b> $(2-x)+(7-x)=9-2x=7\iff x=1$ ✓ (należy do $x\lt2$).`,
        T`<b>$2\le x\lt7$:</b> $(x-2)+(7-x)=5\ne7$ — brak rozwiązań.`,
        T`<b>$x\ge7$:</b> $(x-2)+(x-7)=2x-9=7\iff x=8$ ✓.`,
        T`Odpowiedź: $x\in\{1,8\}$.`,
      ]),
      STEPS(T`I.29h: $|2x-4|\lt x-1$`, [
        T`Moduł jest nieujemny, więc prawa strona musi być dodatnia: $x-1\gt0\iff x\gt1$.`,
        T`Przy tym warunku nierówność jest równoważna $-(x-1)\lt2x-4\lt x-1$.`,
        T`Prawa część: $2x-4\lt x-1\iff x\lt3$. Lewa: $-x+1\lt2x-4\iff3x\gt5\iff x\gt\frac53$.`,
        T`Część wspólna z $x\gt1$: $x\in\left(\frac53,3\right)$.`,
      ]),
      H2('Więcej wzorów z listy'),
      UL([
        T`$1\lt|x|\lt2\iff x\in(-2,-1)\cup(1,2)$ (I.29e).`,
        T`$2\lt|x-1|\le3\iff x-1\in[-3,-2)\cup(2,3]\iff x\in[-2,-1)\cup(3,4]$ (I.29j).`,
        T`$|x+1|=|x-2|$: punkt jednakowo odległy od $-1$ i $2$ to środek: $x=\frac12$ (I.26q).`,
        T`$\sqrt{(2-a)^2}=|2-a|$, a $\ \dfrac{\sqrt{a^2}}a=\dfrac{|a|}a$ równa się $1$ dla $a\gt0$ i $-1$ dla $a\lt0$ (I.22).`,
      ]),
      CHECK([
        Q(T`$|x|\lt3\iff$`, [T`$-3\lt x\lt3$`, T`$x\lt3$`, T`$x\lt-3\ \lor\ x\gt3$`, T`$x\gt-3$`], 0, 'Odległość od zera mniejsza niż 3.'),
        Q(T`Rozwiązaniem $|x-2|\gt1$ jest:`, [T`$(-\infty,1)\cup(3,\infty)$`, T`$(1,3)$`, T`$(-\infty,3)$`, T`$(1,\infty)$`], 0, T`$x-2\lt-1$ lub $x-2\gt1$.`),
        Q(T`$|x+1|=|x-2|$ ma rozwiązanie:`, [T`$x=\frac12$`, T`$x=-\frac12$`, T`$x=\frac32$`, 'brak rozwiązań'], 0, T`Z $x+1=-(x-2)$ mamy $2x=1$. Drugi przypadek ($x+1=x-2$) jest sprzeczny.`),
        Q(T`$|x|=-1$:`, ['nie ma rozwiązań', 'x = 1', 'x = −1', 'x = ±1'], 0, 'Moduł jest nieujemny.'),
        Q(T`$2\lt|x-1|\le3$ to:`, [T`$[-2,-1)\cup(3,4]$`, T`$(-2,-1)\cup(3,4)$`, T`$[-2,4]$`, T`$(3,4]$`], 0, T`$x-1\in[-3,-2)\cup(2,3]$, dodaj $1$.`),
        Q(T`Odległość liczb $a=-2$ i $b=3$ na osi to:`, ['5', '1', '−5', '−1'], 0, T`$|a-b|=|-2-3|=5$.`),
      ]),
    ],
  },
];

ALG.forEach((l) => { LESSONS.push(l); LESSON_BY_ID[l.id] = l; });

// ───────── quiz: pytania z bloków CHECK ─────────
const ALG_TOPIC = { a1: 'Logika i zbiory', a2: 'Logika i zbiory', a3: 'Kresy zbiorów', a4: 'Wyrażenia algebraiczne', a5: 'Wyrażenia algebraiczne', a6: 'Wyrażenia algebraiczne', a7: 'Wyrażenia algebraiczne' };
TOPICS.push('Logika i zbiory', 'Kresy zbiorów', 'Wyrażenia algebraiczne');
ALG.forEach((l) => l.blocks.filter((b) => b.t === 'check').forEach((b) => b.items.forEach((it) => {
  QUESTIONS.push({ topic: ALG_TOPIC[l.id], lesson: l.id, q: it.q, o: it.o, a: it.a, why: it.why });
})));
QUESTIONS.filter((q) => !q.id).forEach((q, i) => { q.id = 'qa' + (i + 1); });

// ───────── fiszki ─────────
CARDS.push(
  CARD('Logika i zbiory', 'a1', 'Kiedy $p\\Rightarrow q$ jest fałszywa?', T`Tylko gdy $p$ prawdziwe, a $q$ fałszywe. Równoważnie $\lnot p\lor q$.`),
  CARD('Logika i zbiory', 'a1', 'Tautologia', T`Wyrażenie prawdziwe dla każdego układu wartości zmiennych. Obalasz ją jednym kontrprzykładem.`),
  CARD('Logika i zbiory', 'a1', 'Zaprzeczenie $\\forall_x\\varphi$ i $\\exists_x\\varphi$', T`$\lnot\forall_x\varphi\iff\exists_x\lnot\varphi$, $\ \lnot\exists_x\varphi\iff\forall_x\lnot\varphi$.`),
  CARD('Logika i zbiory', 'a1', 'Zaprzeczenie implikacji i prawa de Morgana', T`$\lnot(p\Rightarrow q)\iff p\land\lnot q$, $\ \lnot(p\land q)\iff\lnot p\lor\lnot q$, $\ \lnot(p\lor q)\iff\lnot p\land\lnot q$.`),
  CARD('Logika i zbiory', 'a1', 'Czy kolejność kwantyfikatorów ma znaczenie?', T`Tak. $\forall_x\exists_y\ x+y=0$ — prawda; $\exists_y\forall_x\ x+y=0$ — fałsz.`),
  CARD('Logika i zbiory', 'a2', 'Różnica symetryczna $A\\triangle B$', T`$(A\setminus B)\cup(B\setminus A)=(A\cup B)\setminus(A\cap B)$.`),
  CARD('Logika i zbiory', 'a2', 'Liczność zbioru potęgowego i iloczynu kartezjańskiego', T`$|\mathcal P(A)|=2^{|A|}$, $\ |A\times B|=|A|\cdot|B|$; $\ A\times B\ne B\times A$.`),
  CARD('Logika i zbiory', 'a2', '$\\emptyset$ kontra $\\{\\emptyset\\}$', T`$\emptyset$ nie ma elementów; $\{\emptyset\}$ ma jeden element. $\mathcal P(\emptyset)=\{\emptyset\}$.`),
  CARD('Logika i zbiory', 'a2', 'Suma i przecięcie nieskończonej rodziny $A_n$', T`$\bigcup A_n$ — należy do przynajmniej jednego; $\bigcap A_n$ — należy do wszystkich.`),
  CARD('Kresy zbiorów', 'a3', 'Definicja $\\sup A$ i $\\inf A$', T`$\sup A$ — najmniejsze ograniczenie górne; $\inf A$ — największe ograniczenie dolne. Nieograniczony zbiór: $\pm\infty$.`),
  CARD('Kresy zbiorów', 'a3', 'Charakteryzacja $\\sup$ przez $\\varepsilon$', T`$s=\sup A\iff\forall_{x\in A}x\le s$ oraz $\forall_{\varepsilon\gt0}\exists_{x\in A}\ x\gt s-\varepsilon$.`),
  CARD('Kresy zbiorów', 'a3', 'Kres a maksimum', T`Maksimum istnieje, gdy $\sup A\in A$. $\sup(0,1)=1$, ale max nie istnieje.`),
  CARD('Kresy zbiorów', 'a3', 'Kresy zbioru zadanego nierównością', T`Rozwiąż nierówność; kresy to końce przedziałów rozwiązania (dziury w środku nie zmieniają kresów).`),
  CARD('Wyrażenia algebraiczne', 'a4', 'Prawa potęg', T`$a^ma^n=a^{m+n}$, $(a^m)^n=a^{mn}$, $(ab)^n=a^nb^n$, $a^{-n}=\frac1{a^n}$, $a^{m/n}=\sqrt[n]{a^m}$, $\sqrt{x^2}=|x|$.`),
  CARD('Wyrażenia algebraiczne', 'a4', 'Ułamek okresowy → zwykły', T`$x=0{,}(7)$: $10x-x=7$, więc $x=\frac79$. Mnóż przez $10^k$ tak, by okresy się odjęły.`),
  CARD('Wyrażenia algebraiczne', 'a5', 'Wzory skróconego mnożenia', T`$a^2-b^2=(a-b)(a+b)$, $\ a^3\pm b^3=(a\pm b)(a^2\mp ab+b^2)$, $\ (a\pm b)^3=a^3\pm3a^2b+3ab^2\pm b^3$.`),
  CARD('Wyrażenia algebraiczne', 'a5', 'Postać kanoniczna trójmianu', T`$ax^2+bx+c=a\left(x+\frac b{2a}\right)^2-\frac\Delta{4a}$, $\ \Delta=b^2-4ac$.`),
  CARD('Wyrażenia algebraiczne', 'a6', 'Jak usunąć niewymierność z mianownika?', T`Pomnóż przez sprzężenie: $\frac1{\sqrt a-\sqrt b}=\frac{\sqrt a+\sqrt b}{a-b}$; dla $\sqrt[3]{}$ użyj $a^3\pm b^3$.`),
  CARD('Wyrażenia algebraiczne', 'a6', 'Jak uprościć $\\sqrt{a\\pm2\\sqrt{xy}}$?', T`Znajdź $x+y=a$ i $xy$ (pod pierwiastkiem): wynik to $\sqrt x\pm\sqrt y$ (większy pierwiastek pierwszy przy minusie).`),
  CARD('Wyrażenia algebraiczne', 'a7', 'Nierówności z modułem', T`$|x|\lt a\iff-a\lt x\lt a$; $\ |x|\gt a\iff x\lt-a\lor x\gt a$ (dla $a\gt0$).`),
  CARD('Wyrażenia algebraiczne', 'a7', 'Wiele modułów — metoda', T`Punkty zerowe → przedziały → opuść moduły w każdym → sprawdź, czy rozwiązanie leży w przedziale → zsumuj.`),
);
CARDS.filter((c) => !c.id).forEach((c, i) => { c.id = 'ca' + (i + 1); });
