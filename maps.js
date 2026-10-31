// Mapy myśli. Węzeł: t = tekst (może zawierać TeX), c = dzieci, n = notatka pokazywana po kliknięciu, l = id lekcji.
const M = (t, c, n, l) => ({ t, c: c && c.length ? c : null, n, l });

const MAPS = [
  {
    id: 'big', emoji: '🌍', title: 'Wielki obraz',
    root: M('Granice i ciągłość', [
      M('📈 Ciągi', [
        M('Granica ciągu', [M(T`pas $\varepsilon$ i numer $N$`, null, 'Od pewnego numeru wszystkie wyrazy wpadają do pasa wokół granicy.', 'l1')], 'Dokąd zmierza lista liczb.', 'l1'),
        M('Kanapka', [M('tw. o dwóch ciągach', null, null, 'l1'), M('tw. o trzech ciągach', null, null, 'l2')], 'Zamykamy trudny ciąg między dwoma prostymi.', 'l2'),
        M('Rachunki', [M('arytmetyka granic', null, null, 'l3'), M('dziel przez najwyższą potęgę', null, null, 'l3'), M(T`ograniczony $\cdot$ znikający`, null, null, 'l3')], 'Jak liczyć granice po kawałku.', 'l3'),
        M('Ważne granice', [M(T`$q^n$`, null, null, 'l4'), M('silnia kontra potęgi', null, null, 'l4'), M('pierwiastki', null, null, 'l5')], 'Tabliczka mnożenia granic.', 'l4'),
        M('Liczba e', [M(T`$(1+\frac cn)^n\to e^c$`, null, null, 'l6')], 'Lokata z coraz częstszym doliczaniem odsetek.', 'l6'),
        M('Zbieżność bez zgadywania', [M('Cauchy', null, null, 'l7'), M('Stolz', null, null, 'l8')], null, 'l7'),
      ]),
      M('🎯 Granice funkcji', [
        M('Definicje', [M('Heine — każdy ciąg', null, null, 'l9'), M('Cauchy — ε i δ', null, null, 'l9')], 'Dwa równoważne sposoby mówienia „funkcja zmierza do a”.', 'l9'),
        M('Brak granicy', [M('dwa ciągi, dwa wyniki', null, null, 'l10')], null, 'l10'),
        M('Jednostronne', [M('z lewej i z prawej', null, null, 'l11')], null, 'l11'),
        M('Ważne granice', [M(T`$\frac{\sin x}{x}\to1$`, null, null, 'l12'), M(T`$(1+x)^{1/x}\to e$`, null, null, 'l12')], null, 'l12'),
        M('Złożona', [M('podstawienie $y=f(x)$', null, null, 'l13')], null, 'l13'),
      ]),
      M('🖊️ Ciągłość', [
        M('W punkcie', [M(T`$\lim f(x)=f(x_0)$`, null, null, 'l14')], 'Rysujesz bez odrywania ołówka.', 'l14'),
        M('Nieciągłości', [M('I rodzaju', null, null, 'l15'), M('II rodzaju', null, null, 'l15')], null, 'l15'),
        M('Odwrotna i złożona', null, 'Ciągłość przechodzi przez odwracanie i składanie.', 'l16'),
        M('Na przedziale', [M('Weierstrass', null, null, 'l17'), M('Darboux', null, null, 'l18')], null, 'l17'),
      ]),
    ]),
  },

  {
    id: 'seq', emoji: '📈', title: 'Granice ciągów',
    root: M(T`Granica ciągu $\lim a_n$`, [
      M('🎯 Co to znaczy', [
        M(T`zmierza do $a$`, [
          M(T`pas $(a-\varepsilon,\,a+\varepsilon)$ coraz węższy`, null, 'Im mniejsze ε, tym większe N — ale zawsze się znajdzie.', 'l1'),
          M(T`$\forall_{\varepsilon}\ \exists_{N}\ \forall_{n\gt N}\ |a_n-a|\lt\varepsilon$`, null, 'Dla każdej tolerancji istnieje numer, od którego wszystkie wyrazy są bliżej niż ε.', 'l1'),
        ], null, 'l1'),
        M('brak granicy', [M(T`$(-1)^n$: 1, −1, 1, …`, null, 'Ograniczony, ale nie zbieżny.', 'l4'), M(T`$(-2)^n$: rośnie i zmienia znak`, null, null, 'l4')], null, 'l4'),
        M(T`granica $\infty$`, [M(T`$n^2$`), M(T`$q^n$ dla $q\gt1$`)], null, 'l4'),
      ]),
      M('🥪 Porównywanie', [
        M('tw. o dwóch ciągach', [M(T`$a_n\le b_n\ \Rightarrow\ a\le b$`), M(T`⚠ ostra nierówność znika: $-\frac1n\lt\frac1n$`, null, 'Obie granice to 0.', 'l1')], null, 'l1'),
        M('tw. o trzech ciągach', [M(T`$a_n\le b_n\le c_n$, brzegi $\to g$ ⇒ $b_n\to g$`), M(T`$\frac{6n+\sin^2n}{3n-2}\to2$`, null, 'Z 0 ≤ sin²n ≤ 1 dostajemy dwa ułamki, oba dążą do 2.', 'l2')], null, 'l2'),
      ]),
      M('🧮 Rachunki', [
        M('arytmetyka granic', [M(T`$+,\ -,\ \cdot$ — granice skończone`), M(T`$:$ — mianownik $\ne0$`), M(T`$c\cdot a_n\to c\cdot a$`)], 'Nie wolno przy ∞−∞, 0/0, ∞/∞ — najpierw przekształć.', 'l3'),
        M('trik: dziel przez najwyższą potęgę', [M(T`$\frac{3n^2+1}{n^2-5}\to3$`, null, 'Dzielimy licznik i mianownik przez n².', 'l3')], null, 'l3'),
        M(T`ograniczony $\cdot$ zbieżny do 0 $=0$`, [M(T`$\frac{(-1)^n}{n}\to0$`), M(T`$\frac{\cos n^2}{n^3}\to0$`)], null, 'l3'),
      ]),
      M('📚 Ważne granice', [
        M(T`$q^n$`, [M(T`$|q|\lt1\ \to\ 0$`), M(T`$q=1\ \to\ 1$`), M(T`$q\gt1\ \to\ \infty$`), M(T`$q\le-1$: brak granicy`)], 'Dowód dla |q|<1: malejący i ograniczony, więc zbieżny; z równania wychodzi A=0.', 'l4'),
        M('hierarchia wzrostu', [M(T`$n^p\ll a^n\ll n!$`), M(T`$\frac{n^p}{a^n}\to0$`), M(T`$\frac{a^n}{n!}\to0$`)], 'Silnia wygrywa z wykładniczą, wykładnicza z wielomianem.', 'l4'),
        M('pierwiastki', [M(T`$\sqrt[n]{a}\to1$`), M(T`$\sqrt[n]{n}\to1$`), M(T`Bernoulli: $(1+x)^n\ge1+nx$ dla $x\ge-1$`, null, 'To nierówność, na której opiera się dowód ⁿ√a → 1.', 'l5')], null, 'l5'),
      ]),
      M('🏦 Liczba e', [
        M(T`$\left(1+\frac1n\right)^n\to e$`, null, 'Lokata 100%/rok, coraz częstsze doliczanie odsetek.', 'l6'),
        M(T`$\left(1+\frac cn\right)^n\to e^c$`, null, null, 'l6'),
        M(T`$\left(1+\frac1{a_n}\right)^{b_n}\to e^A$, $A=\lim\frac{b_n}{a_n}$`, [M(T`$\left(1-\frac{15}{10n}\right)^n\to e^{-3/2}$`)], null, 'l6'),
      ]),
      M('🧰 Zbieżność bez zgadywania', [
        M('warunek Cauchy’ego', [M('zbieżny ⇔ wyrazy zbliżają się do siebie nawzajem'), M(T`przykład: $\sum\frac{\cos k}{3^k}$`)], null, 'l7'),
        M('tw. Stolza', [M('iloraz przyrostów ⇒ iloraz całości'), M('⚠ tylko w jedną stronę!', null, 'Kontrprzykład: aₙ=5n+2(−1)ⁿ, bₙ=5n−2(−1)ⁿ.', 'l8'), M(T`$\frac1{\sqrt n}\sum\frac1{\sqrt k}\to2$`)], null, 'l8'),
      ]),
    ]),
  },

  {
    id: 'fun', emoji: '🎯', title: 'Granice funkcji',
    root: M(T`Granica funkcji $\lim_{x\to x_0}f(x)$`, [
      M('📍 Sąsiedztwo', [M(T`$0\lt|x-x_0|\lt\delta$`, null, 'Punkt x₀ jest wyrzucony — granica nie patrzy na f(x₀).', 'l9'), M(T`lewe $S^-$, prawe $S^+$`)], null, 'l9'),
      M('📐 Dwie definicje', [
        M('Heine (ciągi)', [M(T`każdy ciąg $x_n\to x_0$, $x_n\ne x_0$`), M(T`$f(x_n)\to a$`)], 'Dobre do pokazywania, że granicy nie ma.', 'l9'),
        M('Cauchy (ε–δ)', [M(T`$\forall_{\varepsilon}\exists_{\delta}\forall_{x\in S(x_0,\delta)}\ |f(x)-a|\lt\varepsilon$`)], 'Dobre do bezpośredniego dowodu.', 'l9'),
      ]),
      M('🚫 Brak granicy', [
        M('metoda: dwa ciągi, dwa wyniki', [M(T`$\sin x$, $x\to\infty$: $\pi n\to0$, $\frac\pi2+2\pi n\to1$`), M(T`$\frac1x$ w 0: $+\infty$ i $-\infty$`), M(T`$\sin\frac1x$ w 0: wyniki 0 i 1`)], null, 'l10'),
      ]),
      M('↔️ Jednostronne', [
        M('lewo i prawo', [M(T`$x\to x_0^-$ z lewej`), M(T`$x\to x_0^+$ z prawej`)], null, 'l11'),
        M('związek z ciągłością', [M(T`lewa $=$ prawa $=A$ ⇒ granica $=A$`), M(T`i $f(x_0)=A$ ⇒ ciągła`)], null, 'l11'),
        M(T`$f=\frac{x^2-1}{x-1}$`, [M(T`$f$: dziura w 1`), M(T`$f^*(1)=2$: ciągła`), M(T`$f^{**}(1)=3$: usuwalna nieciągłość`)], null, 'l11'),
      ]),
      M('🧮 Arytmetyka', [M(T`$Af\pm Bg\to Aa\pm Bb$`), M(T`$f\cdot g\to a\cdot b$`), M(T`$\frac fg\to\frac ab$, $b\ne0$`)], null, 'l11'),
      M('📚 Ważne granice', [
        M(T`$\frac{\sin x}{x}\to1$`, [M('dowód: pola P₁ ≤ P₂ ≤ P₃ na okręgu', null, 'Trójkąt ≤ wycinek ≤ większy trójkąt.', 'l12')], null, 'l12'),
        M(T`$\frac{a^x-1}{x}\to\ln a$`, null, null, 'l12'),
        M(T`$\frac{\log_a(1+x)}{x}\to\frac1{\ln a}$`, null, null, 'l12'),
        M(T`$(1+x)^{1/x}\to e$, $(1+\frac1x)^x\to e$`, [M(T`podstawienie $y=\frac1x$`), M(T`$x\to-\infty$: $y=-x$`)], null, 'l12'),
        M(T`$\frac1{\sin x}-\frac1{\operatorname{tg}x}\to0$`, [M(T`$=\operatorname{tg}\frac x2$`)], null, 'l12'),
      ]),
      M('🪆 Funkcja złożona', [
        M('podstawienie y = f(x)', [M(T`$f(x)\to y_0$, $g(y)\to A$ ⇒ $g(f(x))\to A$`), M(T`⚠ warunek: $f(x)\ne y_0$ w sąsiedztwie`, null, 'Bez niego g(y₀) może „popsuć” granicę.', 'l13')], null, 'l13'),
        M('dziedziny', [M(T`$g\circ f$ istnieje, gdy $f[X]\subseteq T$`), M(T`$2x+1$ i $\sqrt x$: tylko w jedną stronę`)], null, 'l13'),
        M(T`$\frac{\sin(2026x)}{2026x}\to1$`, null, null, 'l13'),
      ]),
    ]),
  },

  {
    id: 'cont', emoji: '🖊️', title: 'Ciągłość',
    root: M('Ciągłość funkcji', [
      M('✅ Definicja', [
        M(T`$\lim_{x\to x_0}f(x)=f(x_0)$`, [M(T`$\iff\lim_{h\to0}f(x_0+h)=f(x_0)$`)], null, 'l14'),
        M('trzy rzeczy naraz', [M('f(x₀) istnieje'), M('granica istnieje'), M('są równe')], 'Rysujesz bez odrywania ołówka.', 'l14'),
      ]),
      M('🧰 Które funkcje są ciągłe', [
        M('stała i $x$', null, null, 'l14'), M('wielomiany — wszędzie', null, null, 'l14'), M('wymierne — poza zerami mianownika', null, null, 'l14'),
        M(T`$\sin x$, $\cos x$ — wszędzie`, null, 'sin(x+h) = sin x cos h + sin h cos x', 'l14'), M(T`$\operatorname{tg}x$, $\operatorname{ctg}x$ — poza zerami mianownika`, null, null, 'l14'), M(T`$a^x$ — wszędzie`, null, null, 'l14'),
      ]),
      M('➕ Działania', [M('suma, różnica, iloczyn'), M('iloraz (mianownik ≠ 0)')], 'Dziedziczone z arytmetyki granic.', 'l14'),
      M('💥 Nieciągłości', [
        M('I rodzaju (granice jednostronne skończone)', [
          M('usuwalna', [M(T`dziura: $\frac{x^2-1}{x-1}$ w 1`), M('można „załatać” — przedłużenie ciągłe'), M(T`$\frac{\sin x}{x}$, $f(0)=1$`)], null, 'l15'),
          M('skok', [M('granice skończone, ale różne'), M(T`1 dla $x\ge0$, −1 dla $x\lt0$`)], null, 'l15'),
        ], null, 'l15'),
        M('II rodzaju (jedna z granic nieskończona / nie istnieje)', [M(T`$\frac1x$ w 0 — przepaść`), M(T`$\sin\frac1x$ w 0 — szaleństwo`)], null, 'l15'),
      ]),
      M('🔁 Odwrotna i złożona', [
        M('funkcja odwrotna', [M('ciągła rosnąca ⇒ odwrotna ciągła rosnąca'), M(T`$(\tfrac12)^x$ i $\log_{1/2}x$`)], null, 'l16'),
        M('złożenie', [M('f ciągła w x₀, g ciągła w f(x₀) ⇒ g∘f ciągła'), M(T`wnoszenie granicy: $\lim g(f)=g(\lim f)$`), M(T`$e^{\sin x/x}\to e$`)], null, 'l16'),
      ]),
      M('🏔️ Na przedziale [a, b]', [
        M('Weierstrass', [M('ciągła na [a, b] ⇒ ograniczona'), M('jest wartość najmniejsza i największa'), M(T`⚠ „NIE”: $\operatorname{tg}$ na $[0,\frac\pi2)$; $28x$ na $(-1,1)$`, null, 'Potrzeba: ciągłości, domkniętego i ograniczonego przedziału.', 'l17')], null, 'l17'),
        M('Darboux', [M('przyjmuje wartości pośrednie'), M(T`$f(a)f(b)\lt0$ ⇒ jest zero w $(a,b)$`), M(T`przykład: $3^x=9x$ ma pierwiastek w $(0,1)$`, null, 'x ≈ 0,128 — drugie rozwiązanie obok x = 3.', 'l18'), M(T`⚠ $\frac1x$ na $[-1,1]$: brak ciągłości`)], null, 'l18'),
      ]),
    ]),
  },

  {
    id: 'solve', emoji: '🧭', title: 'Co robić w zadaniu?',
    root: M('Mam policzyć granicę…', [
      M('🔢 …ciągu', [
        M(T`ułamek z $n$, $n^2$, … (wielomiany)`, [M(T`dziel przez najwyższą potęgę $n$`, [M(T`$\frac{3n^2+1}{n^2-5}\to3$`)], null, 'l3')], null, 'l3'),
        M(T`jest $\sin n$, $\cos n$, $(-1)^n$`, [M('kanapka: ogranicz od dołu i od góry', [M(T`$\frac{6n+\sin^2n}{3n-2}$`)], null, 'l2'), M(T`albo: ograniczony $\cdot$ dążący do 0`, null, null, 'l3')], null, 'l2'),
        M(T`$(1+\ldots/n)^n$ — nawias z jedynką`, [M(T`$\to e^{c}$`, [M(T`$c$ = to, co stoi przy $\frac1n$`)], null, 'l6')], null, 'l6'),
        M(T`$n!$, $a^n$, $n^p$ w ułamku`, [M(T`hierarchia: $n^p\ll a^n\ll n!$`)], null, 'l4'),
        M(T`$\sqrt[n]{a}$, $\sqrt[n]{n}$`, [M(T`obie $\to1$`)], null, 'l5'),
        M(T`suma $\sum$ dzielona przez $n$ lub $\sqrt n$`, [M('tw. Stolza: iloraz przyrostów', [M('sprawdź: mianownik rosnący, → ∞')], null, 'l8')], null, 'l8'),
        M('nie umiem zgadnąć granicy', [M('warunek Cauchy’ego: czy wyrazy zbliżają się do siebie?')], null, 'l7'),
      ]),
      M('📉 …funkcji', [
        M(T`$\frac00$ z wielomianami`, [M(T`rozłóż i skróć: $\frac{x^2-1}{x-1}=x+1$`)], null, 'l9'),
        M(T`$\frac{\sin(kx)}{x}$ przy $x\to0$`, [M(T`podstaw $y=kx$: $\to k$`, null, 'sin(5x)/x = 5 · sin(5x)/(5x).', 'l13')], null, 'l13'),
        M(T`$a^x-1$ lub $\log(1+x)$ przez $x$`, [M(T`$\ln a$ oraz $\frac1{\ln a}$`)], null, 'l12'),
        M(T`$(1+x)^{1/x}$, $(1+\frac1x)^x$`, [M(T`$\to e$`)], null, 'l12'),
        M(T`różnica $\frac1{\sin x}-\frac1{\operatorname{tg}x}$`, [M('wspólny mianownik + wzory na kąt podwójny', [M(T`$\to\operatorname{tg}\frac x2\to0$`)])], null, 'l12'),
        M('granica nie istnieje?', [M('dwa ciągi z różnymi wynikami', null, null, 'l10'), M('albo różne granice jednostronne', null, null, 'l11')], null, 'l10'),
      ]),
      M('🖊️ …albo badam ciągłość', [
        M('„porządny” wzór', [M('ciągła wszędzie, gdzie jest określona', null, 'Wielomiany, sin, cos, aˣ; ułamki poza zerami mianownika.', 'l14')], null, 'l14'),
        M('funkcja sklejona / dziura', [M(T`policz granice jednostronne i porównaj z $f(x_0)$`, [M('równe i = f(x₀) → ciągła'), M('skończone, różne → skok'), M('nieskończona / brak → II rodzaj')], null, 'l15')], null, 'l15'),
        M('udowodnić, że równanie ma rozwiązanie', [M(T`znajdź $a,b$ z $f(a)f(b)\lt0$ i użyj Darboux`)], null, 'l18'),
        M('szukam największej/najmniejszej wartości', [M('Weierstrass: ciągła na [a, b]')], null, 'l17'),
      ]),
    ]),
  },

  {
    id: 'traps', emoji: '⚠️', title: 'Pułapki i kontrprzykłady',
    root: M('Gdzie najłatwiej się pomylić', [
      M('🚧 Nierówności i granice', [
        M(T`$\lt$ nie przechodzi do granicy`, [M(T`$-\frac1n\lt\frac1n$, a obie granice $=0$`)], null, 'l1'),
        M('kanapka: brzegi muszą mieć tę samą granicę', null, null, 'l2'),
        M('mnożenie nierówności przez liczbę ujemną odwraca znak', null, null, 'l2'),
      ]),
      M('🧮 Arytmetyka', [
        M('granice muszą być skończone', [M(T`$\infty-\infty$, $\frac00$, $\frac\infty\infty$ — najpierw przekształć`)], null, 'l3'),
        M('mianownik nie może dążyć do 0', null, null, 'l3'),
        M(T`$a_nb_n\to0$ wymaga, by $b_n$ był ograniczony`, [M(T`$\frac1n\cdot n^2\to\infty$`)], null, 'l3'),
      ]),
      M('🏦 Liczba e', [
        M(T`nie każde „$(1+\ldots)^n$” daje $e$`, [M(T`$(1+\frac1{n^2})^n\to1$`), M(T`$(1+\frac cn)^n\to e^c$, nie $e$`)], null, 'l6'),
        M('w notatkach: A = lim bₙ/aₙ (nie aₙ·bₙ)', null, null, 'l6'),
      ]),
      M('🧰 Twierdzenia „w jedną stronę”', [
        M('Stolz', [M('z granicy przyrostów wynika granica ilorazu, nie odwrotnie'), M(T`$a_n=5n+2(-1)^n$: przyrosty skaczą $\frac19\leftrightarrow9$`)], null, 'l8'),
        M('Heine', [M('muszą być WSZYSTKIE ciągi — dwa wystarczą tylko do obalenia'), M(T`ciągi muszą mieć $x_n\ne x_0$`)], null, 'l9'),
        M('zbieżny ⇒ ograniczony, ale nie odwrotnie', [M(T`$(-1)^n$`)], null, 'l4'),
      ]),
      M('🎯 Granica funkcji', [
        M(T`$x_0$ wyrzucone z sąsiedztwa`, [M('granica nie zależy od f(x₀)')], null, 'l9'),
        M(T`granica złożona: wymaga $f(x)\ne y_0$`, [M(T`$g(y)=1$ dla $y\ne0$, $g(0)=0$, $f\equiv0$`, null, 'lim g(f(x)) = 0, ale lim g(y) = 1.', 'l13')], null, 'l13'),
        M(T`$g\circ f$ nie zawsze określone`, [M(T`$2x+1$ i $\sqrt x$`)], null, 'l13'),
      ]),
      M('🖊️ Ciągłość', [
        M('granice jednostronne równe ≠ ciągła', [M(T`trzeba jeszcze $f(x_0)=A$`)], null, 'l11'),
        M('Weierstrass: trzy założenia', [M('domknięty, ograniczony, ciągła'), M(T`$\operatorname{tg}$ na $[0,\frac\pi2)$, $28x$ na $(-1,1)$`)], null, 'l17'),
        M('Darboux: bez ciągłości nie działa', [M(T`$\frac1x$ na $[-1,1]$: $f(-1)f(1)\lt0$, ale zera brak`)], null, 'l18'),
      ]),
    ]),
  },
];
