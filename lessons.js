// Treść lekcji. T = String.raw, żeby można było pisać TeX bez podwajania ukośników.
// W TeX używamy \lt i \gt zamiast < i >, bo tekst trafia do innerHTML.
const T = String.raw;
const P = (h) => ({ t: 'p', h });
const H2 = (h) => ({ t: 'h2', h });
const UL = (items) => ({ t: 'ul', items });
const RAW = (h) => ({ t: 'raw', h });
const BOX = (kind, title, h, src) => ({ t: 'box', kind, title, h, src });
const STEPS = (title, steps, src) => ({ t: 'steps', title, steps, src });
const WIDGET = (name, title, arg) => ({ t: 'widget', name, title, arg });
const CHECK = (items) => ({ t: 'check', items });
const Q = (q, o, a, why) => ({ q, o, a, why });

const PARTS = { 1: 'Część I — Ciągi', 2: 'Część II — Granice funkcji', 3: 'Część III — Ciągłość' };

const LESSONS = [
  // ───────────────────────────── CZĘŚĆ I ─────────────────────────────
  {
    id: 'l1', part: 1, title: 'Granica ciągu i porównywanie granic', pages: 'str. 2', min: 8,
    lead: 'Zanim zaczniemy liczyć granice, upewnijmy się, co znaczy „ciąg zmierza do a” — i czego z tego nie wolno wywnioskować.',
    blocks: [
      H2('Intuicja'),
      P(T`Ciąg $a_n$ ma granicę $a$, gdy jego wyrazy od pewnego miejsca są <b>dowolnie blisko</b> $a$ i już tam <b>zostają</b>. „Dowolnie blisko” mierzymy małą liczbą $\varepsilon\gt0$ — to szerokość pasa wokół $a$.`),
      BOX('def', 'Definicja granicy ciągu', T`$$\lim_{n\to\infty}a_n=a\iff\forall_{\varepsilon\gt0}\ \exists_{N}\ \forall_{n\gt N}\ \ |a_n-a|\lt\varepsilon$$Czytamy: dla każdego (nawet bardzo małego) $\varepsilon$ da się znaleźć numer $N$, od którego <i>wszystkie</i> wyrazy wpadają do pasa $(a-\varepsilon,\,a+\varepsilon)$.`, 'add'),
      WIDGET('epsN', 'Pas ε i numer N'),
      BOX('idea', 'Jak to czytać', T`To jest <b>gra</b>: ktoś wybiera $\varepsilon$ (jak blisko ma być), a Ty odpowiadasz numerem $N$. Kolejność kwantyfikatorów ma znaczenie — $N$ zależy od $\varepsilon$, nie odwrotnie. Im mniejsze $\varepsilon$, tym zwykle większe $N$.`),
      H2('Twierdzenie o dwóch ciągach'),
      BOX('thm', 'Tw. (o dwóch ciągach)', T`Jeśli $\lim a_n=a$, $\lim b_n=b$ oraz istnieje takie $N\in\mathbb N$, że dla każdego $n\gt N$ zachodzi $a_n\le b_n$, to $a\le b$.`, 'notes'),
      BOX('warn', 'Uwaga! Ostra nierówność „ginie” w granicy', T`Twierdzenie zachowuje tylko $\le$, nie $\lt$. Przykład z notatek:
$$a_n=-\frac{2026}{15n+10}\ \lt\ b_n=\frac{2026}{15n+10},\qquad\text{ale}\quad \lim a_n=0\ \not\lt\ 0=\lim b_n .$$Wyrazy są różne, a granice równe. Dlatego z $a_n\lt b_n$ wnioskujemy tylko $a\le b$.`, 'notes'),
      CHECK([
        Q(T`Wiemy, że $a_n\lt b_n$ dla każdego $n$ oraz $a_n\to a$, $b_n\to b$. Co możemy stwierdzić?`,
          [T`$a\lt b$`, T`$a\le b$`, T`$a=b$`, 'Nic'], 1,
          T`Tylko $a\le b$. Kontrprzykład: $-\frac1n\lt\frac1n$, a obie granice to $0$.`),
        Q(T`Dla $a_n=\frac1n$ (granica $0$) i $\varepsilon=0{,}1$ najmniejsze $N$, które działa, to:`,
          ['9', '10', '11', '100'], 1,
          T`$\frac1n\lt0{,}1\iff n\gt10$. Warunek ma zachodzić dla $n\gt N$, więc bierzemy $N=10$.`),
      ]),
    ],
  },
  {
    id: 'l2', part: 1, title: 'Twierdzenie o trzech ciągach', pages: 'str. 2–3', min: 8,
    lead: 'Najczęściej używane narzędzie do ciągów z „bałaganem” typu sin n: zamknij ciąg między dwoma prostszymi.',
    blocks: [
      P(T`Wyobraź sobie ciąg $b_n$ idący korytarzem między dwoma „policjantami” $a_n$ i $c_n$. Jeśli policjanci zmierzają do <b>tej samej</b> liczby $g$, to $b_n$ nie ma gdzie uciec — też zmierza do $g$.`),
      BOX('thm', 'Tw. (o trzech ciągach)', T`Dane są ciągi $\{a_n\},\{b_n\},\{c_n\}$ takie, że $\lim a_n=\lim c_n=g$. Jeśli istnieje $N\in\mathbb N$, że dla każdego $n\gt N$ zachodzi $$a_n\le b_n\le c_n,$$ to $\lim b_n=g$.`, 'notes'),
      WIDGET('squeeze', 'Ciąg wciśnięty między dwa inne'),
      STEPS(T`Przykład z notatek: $b_n=\dfrac{6n+\sin^2 n}{3n-2}$`, [
        T`<b>Problem:</b> nie umiemy policzyć granicy wprost, bo $\sin^2 n$ „skacze”. Ale wiemy, że sinus jest ograniczony: $-1\le\sin n\le1$.`,
        T`Podnosimy do kwadratu: $0\le\sin^2 n\le1$. (Kwadrat jest nieujemny i nie większy od $1$.)`,
        T`Wstawiamy do licznika (mianownik $3n-2\gt0$, więc nierówności się nie odwracają): $$\frac{6n+0}{3n-2}\ \le\ \frac{6n+\sin^2 n}{3n-2}\ \le\ \frac{6n+1}{3n-2}.$$`,
        T`Obaj policjanci: dzielimy licznik i mianownik przez $n$. Lewy: $\dfrac{6}{3-\frac2n}\to\dfrac63=2$. Prawy: $\dfrac{6+\frac1n}{3-\frac2n}\to\dfrac63=2$.`,
        T`Oba dążą do $2$, więc z twierdzenia o trzech ciągach także $b_n\to\mathbf{2}$.`,
      ], 'notes'),
      BOX('warn', 'Pułapka z mnożeniem nierówności', T`Gdy mnożysz lub dzielisz nierówność przez liczbę <b>ujemną</b>, znaki się odwracają. Zawsze sprawdź znak mianownika, zanim wstawisz go do „kanapki”.`, 'add'),
      CHECK([
        Q(T`Które ciągi nadają się na „policjantów” dla $\dfrac{\cos n}{n}$?`,
          [T`$-\frac1n$ i $\frac1n$`, T`$0$ i $1$`, T`$\frac1n$ i $n$`, T`$-1$ i $1$`], 0,
          T`Z $-1\le\cos n\le1$ po podzieleniu przez $n\gt0$: $-\frac1n\le\frac{\cos n}n\le\frac1n$. Oba brzegi dążą do $0$ — a policjanci muszą zmierzać do <i>tej samej</i> liczby.`),
        Q(T`$\displaystyle\lim_{n\to\infty}\frac{6n+\sin^2 n}{3n-2}=$`, ['3', '2', '6', 'nie istnieje'], 1,
          T`Policjanci: $\frac{6n}{3n-2}\to2$ i $\frac{6n+1}{3n-2}\to2$.`),
      ]),
    ],
  },
  {
    id: 'l3', part: 1, title: 'Arytmetyka granic i ciągi ograniczone', pages: 'str. 4–5', min: 10,
    lead: 'Jak liczyć granice „po kawałku” — i kiedy ciąg, który sam nie ma granicy, nic nie psuje.',
    blocks: [
      BOX('thm', 'Tw. (o arytmetyce granic)', T`Niech $\lim a_n=a\lt\infty$, $\lim b_n=b\lt\infty$ (granice <b>skończone</b>) oraz $c\in\mathbb R$. Wtedy:
<ol>
<li>$\lim c\,a_n=c\cdot a$</li>
<li>$\lim(a_n\pm b_n)=a\pm b$</li>
<li>$\lim(a_n\cdot b_n)=a\cdot b$</li>
<li>$\lim\dfrac{a_n}{b_n}=\dfrac ab$ — o ile $b\ne0$</li>
<li>jeśli $\lim a_n=0$, a $b_n$ jest <b>ograniczony</b>, to $\lim a_nb_n=0$</li>
</ol>`, 'notes'),
      BOX('warn', 'Kiedy NIE wolno', T`Punkty 1–4 wymagają, by granice <b>istniały i były skończone</b> (a w 4: $b\ne0$). Wyrażenia typu $\infty-\infty$, $\frac00$, $\frac\infty\infty$ trzeba najpierw przekształcić — nie da się ich „policzyć” wprost.`, 'add'),
      STEPS(T`Standardowy ruch: $\displaystyle\lim\frac{3n^2+1}{n^2-5}$`, [
        T`Licznik i mianownik dążą do $\infty$ — to symbol $\frac\infty\infty$, nie wolno stosować wzoru na iloraz.`,
        T`Dzielimy licznik i mianownik przez <b>najwyższą potęgę</b> $n$, czyli $n^2$: $$\frac{3+\frac1{n^2}}{1-\frac5{n^2}}.$$`,
        T`Teraz $\frac1{n^2}\to0$ i $\frac5{n^2}\to0$, a granice licznika ($3$) i mianownika ($1$) są skończone, mianownik $\ne0$.`,
        T`Z punktu 4: granica to $\frac31=\mathbf3$.`,
      ], 'add'),
      H2('Ciąg ograniczony razy ciąg zbieżny do zera'),
      P(T`Ciąg jest <b>ograniczony</b>, gdy mieści się w jakimś pasie: $-M\le b_n\le M$. Ważne: ograniczony <i>nie musi mieć granicy</i> — np. $(-1)^n$ to $1,-1,1,-1,\dots$ i stale mieści się w $[-10,10]$.`),
      BOX('idea', 'Dlaczego iloczyn dąży do 0', T`Mnożymy coś, co maleje do zera, przez coś, co jest „co najwyżej wielkości $M$”. Wynik jest co najwyżej $M$ razy mniejszy niż malejący czynnik — a to nadal dąży do zera. Nie potrzeba granicy drugiego czynnika!`),
      STEPS('Dwa przykłady z notatek', [
        T`<b>$c_n=\dfrac{(-1)^n}{n}=\dfrac1n\cdot(-1)^n$.</b> Czynnik $a_n=\frac1n\to0$, czynnik $b_n=(-1)^n$ jest ograniczony ($-10\le b_n\le10$). Z punktu 5: $c_n\to0$.`,
        T`<b>$c_n=\dfrac{\cos(n^2)}{n^3}=\dfrac1{n^3}\cdot\cos(n^2)$.</b> Czynnik $a_n=\frac1{n^3}\to0$, czynnik $b_n=\cos(n^2)$ jest ograniczony (między $-1$ i $1$). Znów $c_n\to0$.`,
        T`Zauważ: $(-1)^n$ ani $\cos(n^2)$ nie mają granicy — i nie muszą. Liczy się tylko to, że są ograniczone.`,
      ], 'notes'),
      CHECK([
        Q(T`$\displaystyle\lim\frac{(-1)^n}{n}=$`, ['0', 'nie istnieje', '1', '−1'], 0, T`$\frac1n\to0$, a $(-1)^n$ jest ograniczony, więc iloczyn dąży do $0$ (punkt 5).`),
        Q(T`Czy $a_n\to0$ wystarcza, żeby $a_nb_n\to0$ dla <i>dowolnego</i> $b_n$?`,
          ['Tak, zawsze', T`Nie — $b_n$ musi być ograniczony (np. $\frac1n\cdot n^2=n\to\infty$)`, T`Tak, jeśli $b_n\ge0$`, T`Nie, bo $a_n$ musi być ujemny`], 1,
          T`Bez ograniczoności drugi czynnik może „rozbić” zero: $\frac1n\cdot n^2=n\to\infty$.`),
        Q(T`$\displaystyle\lim\frac{3n^2+1}{n^2-5}=$`, ['0', '3', '∞', T`$\frac15$`], 1, T`Dzielimy przez $n^2$: $\frac{3+1/n^2}{1-5/n^2}\to3$.`),
      ]),
    ],
  },
  {
    id: 'l4', part: 1, title: 'Ważne granice: qⁿ, silnia, potęgi', pages: 'str. 6–8', min: 14,
    lead: 'Mała „tabliczka mnożenia” granic ciągów — i dowody, które z nich pokazują, dlaczego tak jest.',
    blocks: [
      H2('Ciąg geometryczny qⁿ'),
      BOX('thm', 'Granica ciągu qⁿ', T`$$\lim_{n\to\infty}q^n=\begin{cases}0 & |q|\lt1\\ 1 & q=1\\ \infty & q\gt1\\ \text{nie istnieje} & q\le-1\ \ \text{(np. }(-2)^n\text{)}\end{cases}$$`, 'notes'),
      WIDGET('qn', 'Przesuń q'),
      STEPS(T`Dlaczego $|q|^n\to0$ dla $|q|\lt1$? (dowód z notatek)`, [
        T`Ciąg $a_n=|q|^n$ jest $\ge0$ (ograniczony z dołu) i <b>malejący</b>: $a_{n+1}-a_n=|q|^n(|q|-1)\le0$, bo $|q|^n\ge0$, a $|q|-1\lt0$.`,
        T`<b>Każdy ciąg ograniczony i monotoniczny jest zbieżny.</b> Więc $|q|^n\to A$ dla pewnej liczby $A$.`,
        T`Przesunięty ciąg ma tę samą granicę: też $|q|^{n+1}\to A$.`,
        T`Przechodzimy do granicy w równości $|q|^{n+1}-|q|^n=|q|^n(|q|-1)$: lewa strona $\to A-A=0$, prawa $\to A(|q|-1)$. Zatem $0=A(|q|-1)$.`,
        T`Skoro $|q|-1\ne0$, to $A=\mathbf0$. ∎`,
      ], 'notes'),
      STEPS(T`Dlaczego $q^n\to\infty$ dla $q\gt1$?`, [
        T`Trzeba pokazać: dla <i>każdej</i> liczby $A$ istnieje $N$, że $q^n\gt A$ dla $n\gt N$.`,
        T`Jeśli $A\le0$: wystarczy $N=1$, bo $q^n\gt0\ge A$.`,
        T`Jeśli $A\gt0$: logarytmujemy przy podstawie $q\gt1$ (znak nierówności się zachowuje): $n\log_q q\gt\log_q A$, czyli $n\gt\log_qA$.`,
        T`Wystarczy więc $N=\lceil\log_qA\rceil$. ∎`,
      ], 'notes'),
      H2('Silnia i potęgi — kto rośnie szybciej?'),
      BOX('thm', 'Granice ciągów z silnią (a > 1, p ∈ ℕ)', T`$$\lim\frac{a^n}{n!}=0,\qquad\lim\frac{n^p}{a^n}=0,\qquad\lim\frac{n^p}{n!}=0,\qquad\lim\frac{x^n}{n!}=0\ \ (x\gt0).$$`, 'notes'),
      BOX('idea', 'Hierarchia wzrostu', T`$$n^p\ \ll\ a^n\ \ll\ n!$$ Wykładnicza wygrywa z wielomianem, a silnia wygrywa z wykładniczą. Jeśli „szybszy” jest w <b>mianowniku</b>, ułamek ginie do zera.`, 'add'),
      CHECK([
        Q(T`$\displaystyle\lim(0{,}99)^n=$`, ['0', '1', '∞', 'nie istnieje'], 0, T`$|q|=0{,}99\lt1$, więc $q^n\to0$ (powoli, ale do zera).`),
        Q(T`$\displaystyle\lim\frac{n^{10}}{2^n}=$`, ['∞', '0', '1', 'nie istnieje'], 1, T`Wykładnicza $2^n$ wygrywa z każdym wielomianem.`),
        Q(T`$\displaystyle\lim\frac{5^n}{n!}=$`, ['∞', '5', '0', '1'], 2, T`Silnia wygrywa z wykładniczą.`),
        Q(T`$\displaystyle\lim(-2)^n$:`, ['+∞', '−∞', '0', 'nie istnieje'], 3, T`Wyrazy: $-2,4,-8,16,\dots$ — rosną co do modułu i zmieniają znak. Ani $+\infty$, ani $-\infty$.`),
      ]),
    ],
  },
  {
    id: 'l5', part: 1, title: 'Pierwiastki n-tego stopnia i nierówność Bernoulliego', pages: 'str. 8–10', min: 10,
    lead: 'Dlaczego $\\sqrt[n]{a}\\to1$ i $\\sqrt[n]{n}\\to1$ — i skąd ta granica wynika z jednej nierówności.',
    blocks: [
      BOX('thm', 'Tw. (granice pierwiastków)', T`$$a\gt0:\ \ \sqrt[n]{a}\xrightarrow{n\to\infty}1,\qquad\qquad \sqrt[n]{n}\xrightarrow{n\to\infty}1.$$`, 'notes'),
      BOX('thm', 'Nierówność Bernoulliego', T`Dla $x\ge-1$ i $n\in\mathbb N$: $$(1+x)^n\ \ge\ 1+nx.$$`, 'notes'),
      STEPS('Dowód Bernoulliego (indukcja) — w notatkach zostało „do udowodnienia”', [
        T`<b>Baza:</b> $n=1$: $(1+x)^1=1+x\ge1+x$ ✓.`,
        T`<b>Krok:</b> zakładamy $(1+x)^n\ge1+nx$. Mnożymy obie strony przez $1+x\ge0$ (znak się nie zmienia): $$(1+x)^{n+1}\ge(1+nx)(1+x)=1+(n+1)x+nx^2.$$`,
        T`Ponieważ $nx^2\ge0$, mamy $1+(n+1)x+nx^2\ge1+(n+1)x$. Więc $(1+x)^{n+1}\ge1+(n+1)x$. ∎`,
      ], 'add'),
      STEPS(T`Dowód, że $\sqrt[n]{a}\to1$ dla $a\gt1$ (z notatek)`, [
        T`Oznaczmy $x_n=\sqrt[n]{a}-1$. Ponieważ $a\gt1$, więc $\sqrt[n]{a}\ge1$ i $x_n\ge0$.`,
        T`Z $1+x_n=\sqrt[n]{a}$ podnosimy do potęgi $n$: $(1+x_n)^n=a$.`,
        T`<b>Bernoulli:</b> $a=(1+x_n)^n\ge1+nx_n$.`,
        T`Stąd $a-1\ge nx_n$, czyli $x_n\le\dfrac{a-1}{n}$.`,
        T`Mamy kanapkę $0\le x_n\le\dfrac{a-1}n$. Lewy brzeg to $0$, prawy $\to0$. Z tw. o trzech ciągach $x_n\to0$, czyli $\sqrt[n]{a}\to1$. ∎`,
      ], 'notes'),
      BOX('tip', 'A dla a < 1?', T`Dla $0\lt a\lt1$: $\sqrt[n]{a}=\dfrac{1}{\sqrt[n]{1/a}}$, a $\frac1a\gt1$, więc mianownik $\to1$ i całość $\to1$. Dla $a=1$ ciąg jest stały $1$.`, 'add'),
      CHECK([
        Q(T`$\displaystyle\lim\sqrt[n]{2026}=$`, ['0', '1', '2026', '∞'], 1, T`Dla każdego $a\gt0$ granica to $1$.`),
        Q(T`$\displaystyle\lim\sqrt[n]{n}=$`, ['0', '1', 'e', '∞'], 1, T`Podstawa rośnie, ale pierwiastek stopnia $n$ „ściska” ją z powrotem — wynik $1$.`),
        Q(T`Nierówność Bernoulliego $(1+x)^n\ge1+nx$ zachodzi dla:`,
          [T`$x\ge-1$`, T`wszystkich $x\in\mathbb R$`, T`tylko $x\gt0$`, T`tylko $x\le0$`], 0,
          T`Założenie $x\ge-1$ to dokładnie to, co jest potrzebne w indukcji: musimy mnożyć przez $1+x\ge0$.`),
      ]),
    ],
  },
  {
    id: 'l6', part: 1, title: 'Liczba e i granice typu (1 + 1/aₙ)^bₙ', pages: 'str. 10–11', min: 12,
    lead: 'Najsłynniejsza granica analizy i jeden trik, który rozwiązuje całą rodzinę zadań.',
    blocks: [
      BOX('def', 'Liczba e', T`$$e=\lim_{n\to\infty}\left(1+\frac1n\right)^n.$$ Jeśli $b_n\to\infty$, to także $\displaystyle\lim\left(1+\frac1{b_n}\right)^{b_n}=e$.`, 'notes'),
      BOX('thm', 'Uogólnienie (używane w zadaniach)', T`Jeśli $a_n\to\pm\infty$ oraz $\dfrac{b_n}{a_n}\to A$, to $$\lim\left(1+\frac1{a_n}\right)^{b_n}=e^{A}.$$`, 'notes'),
      BOX('warn', 'Uwaga do notatek', T`W notatkach przy tym twierdzeniu stoi zapis „$\lim a_nb_n=A$”, ale z rachunku obok (wykładnik $\frac{b_n}{a_n}$) wynika, że chodzi o $\lim\dfrac{b_n}{a_n}=A$. Tak jest poprawnie i tak jest tu.`, 'add'),
      WIDGET('elimit', '(1 + c/n)ⁿ dąży do e^c'),
      STEPS('Skąd bierze się wzór e^A', [
        T`Trik z potęgami: $a^{m\cdot n}=(a^m)^n$. Zapisujemy wykładnik jako $b_n=a_n\cdot\dfrac{b_n}{a_n}$.`,
        T`$$\left(1+\frac1{a_n}\right)^{b_n}=\left[\left(1+\frac1{a_n}\right)^{a_n}\right]^{\frac{b_n}{a_n}}.$$`,
        T`Wnętrze nawiasu kwadratowego $\to e$ (bo $a_n\to\pm\infty$). Wykładnik $\frac{b_n}{a_n}\to A$.`,
        T`Zatem całość $\to e^{A}$. ∎`,
      ], 'notes'),
      STEPS(T`Przykład z notatek: $\displaystyle\lim\left(1-\frac{15}{10n}\right)^n$`, [
        T`Upraszczamy: $\frac{15}{10}=\frac32$, więc mamy $\left(1-\dfrac{3}{2n}\right)^n$. Chcemy postać $\left(1+\frac1{a_n}\right)^{b_n}$.`,
        T`Przyrównujemy $\dfrac1{a_n}=-\dfrac{3}{2n}$, czyli $a_n=-\dfrac{2n}{3}\to-\infty$, a wykładnik to $b_n=n$.`,
        T`Liczymy $\dfrac{b_n}{a_n}=\dfrac{n}{-\frac{2n}3}=-\dfrac32$.`,
        T`Granica to $e^{-3/2}$. ∎ (Zgadza się z widżetem: ustaw $c=-1{,}5$.)`,
      ], 'notes'),
      BOX('tip', 'Szybka reguła', T`$\left(1+\dfrac{c}{n}\right)^n\to e^c$. Reguła w praktyce: „to, co stoi przy $\frac1n$ w nawiasie, ląduje w wykładniku e”.`, 'add'),
      CHECK([
        Q(T`$\displaystyle\lim\left(1+\frac2n\right)^n=$`, ['e', 'e²', '2e', '1'], 1, T`$a_n=\frac n2$, $b_n=n$, $\frac{b_n}{a_n}=2$, więc $e^2$.`),
        Q(T`$\displaystyle\lim\left(1-\frac1n\right)^n=$`, ['1', '0', T`$\frac1e$`, '−e'], 2, T`$c=-1$, więc $e^{-1}=\frac1e$.`),
        Q(T`$\displaystyle\lim\left(1+\frac1{n^2}\right)^n=$`, ['e', '1', '∞', '0'], 1, T`$a_n=n^2$, $b_n=n$, $\frac{b_n}{a_n}=\frac1n\to0$, więc $e^0=1$. Pułapka: nie każdy ciąg „z jedynką w nawiasie” daje e!`),
      ]),
    ],
  },
  {
    id: 'l7', part: 1, title: 'Warunek Cauchy’ego', pages: 'str. 11–12', min: 12,
    lead: 'Jak wykazać, że ciąg jest zbieżny, nie znając jego granicy.',
    blocks: [
      P(T`Czasem granicy nie umiemy „zgadnąć”. Warunek Cauchy’ego pozwala obejść ten problem: zamiast pytać, czy wyrazy są blisko granicy, pytamy, czy są blisko <b>siebie nawzajem</b>.`),
      BOX('thm', 'Tw. (warunek Cauchy’ego)', T`Ciąg $\{a_n\}$ jest zbieżny <b>wtedy i tylko wtedy</b>, gdy $$\forall_{\varepsilon\gt0}\ \exists_{N}\ \forall_{n,m\gt N}\ \ |a_n-a_m|\lt\varepsilon .$$`, 'notes'),
      WIDGET('cauchy', 'Ciąg sum częściowych Σ cos k / 3ᵏ'),
      STEPS(T`Przykład z notatek: $a_n=\displaystyle\sum_{k=1}^n\frac{\cos k}{3^k}$ jest zbieżny`, [
        T`Ustalmy $r\gt s$. Wtedy $a_r-a_s=\displaystyle\sum_{k=s+1}^{r}\frac{\cos k}{3^k}$ — zostają tylko składniki od $s+1$ do $r$.`,
        T`Moduł sumy $\le$ suma modułów, a $|\cos k|\le1$: $$|a_r-a_s|\le\frac1{3^{s+1}}+\frac1{3^{s+2}}+\dots+\frac1{3^{r}}.$$`,
        T`To skończona suma geometryczna, więc mniejsza niż cała nieskończona: $$\le\frac1{3^{s+1}}\left(1+\frac13+\frac19+\dots\right)=\frac1{3^{s+1}}\cdot\frac1{1-\frac13}=\frac1{3^{s+1}}\cdot\frac32=\frac1{2\cdot3^s}.$$ (Wzór na sumę szeregu geometrycznego: $S=\frac{a_1}{1-q}$.)`,
        T`Chcemy, żeby to było $\lt\varepsilon$: $\dfrac1{2\cdot3^s}\lt\varepsilon\iff3^s\gt\dfrac1{2\varepsilon}\iff s\gt\log_3\dfrac1{2\varepsilon}$.`,
        T`Biorąc $N=\left\lceil\log_3\dfrac1{2\varepsilon}\right\rceil$, dla wszystkich $r\gt s\gt N$ mamy $|a_r-a_s|\lt\varepsilon$. Warunek Cauchy’ego spełniony ⇒ ciąg jest zbieżny. ∎`,
      ], 'notes'),
      BOX('idea', 'Do czego to służy', T`Warunek Cauchy’ego daje <b>istnienie</b> granicy, ale nie jej wartość. Przydaje się przy szeregach i ciągach zadanych rekurencyjnie, gdzie granicy nie widać gołym okiem.`, 'add'),
      CHECK([
        Q('Warunek Cauchy’ego mówi, że ciąg jest zbieżny wtedy i tylko wtedy, gdy:',
          ['wyrazy od pewnego miejsca są dowolnie blisko siebie nawzajem', 'wyrazy są dowolnie blisko zera', 'ciąg jest monotoniczny', 'ciąg jest ograniczony'], 0,
          'Chodzi o odległość między wyrazami $a_n$ i $a_m$, a nie o odległość od jakiejś granicy.'),
        Q(T`Suma szeregu geometrycznego $1+\frac13+\frac19+\dots$ wynosi:`, [T`$\frac32$`, T`$\frac13$`, '3', '2'], 0, T`$\frac{a_1}{1-q}=\frac{1}{1-\frac13}=\frac32$.`),
      ]),
    ],
  },
  {
    id: 'l8', part: 1, title: 'Twierdzenie Stolza', pages: 'str. 12–16', min: 14,
    lead: 'Reguła de l’Hospitala dla ciągów: trudny iloraz zamień na iloraz przyrostów.',
    blocks: [
      BOX('thm', 'Tw. Stolza', T`Niech $\{a_n\},\{b_n\}$ będą ciągami, przy czym $a_n$ jest <b>rosnący</b> i $\displaystyle\lim a_n=\infty$. Jeśli istnieje granica $$\lim_{n\to\infty}\frac{b_n-b_{n-1}}{a_n-a_{n-1}},$$ to jest ona równa granicy $\displaystyle\lim_{n\to\infty}\frac{b_n}{a_n}$.`, 'notes'),
      BOX('idea', 'Po ludzku', T`Zamiast porównywać „całe” $b_n$ i $a_n$, porównujemy ich <b>przyrosty</b> między kolejnymi wyrazami. Gdy $b_n$ to suma, przyrost to po prostu ostatni składnik — i cała suma „znika”.`),
      STEPS(T`Przykład z notatek: $c_n=\dfrac1{\sqrt n}\displaystyle\sum_{k=1}^n\frac1{\sqrt k}$`, [
        T`Zapisujemy $c_n=\dfrac{b_n}{a_n}$, gdzie $a_n=\sqrt n$, a $b_n=\displaystyle\sum_{k=1}^n\dfrac1{\sqrt k}$.`,
        T`<b>Sprawdzamy założenia:</b> $a_n\to\infty$ oraz $a_n$ jest rosnący, bo $\dfrac{a_{n+1}}{a_n}=\sqrt{1+\frac1n}\gt1$.`,
        T`<b>Przyrosty:</b> $b_n-b_{n-1}=\dfrac1{\sqrt n}$ (cała suma się skraca, zostaje ostatni składnik), $a_n-a_{n-1}=\sqrt n-\sqrt{n-1}$.`,
        T`Iloraz przyrostów: $\dfrac{1/\sqrt n}{\sqrt n-\sqrt{n-1}}$. Mnożymy licznik i mianownik przez sprzężenie $\sqrt n+\sqrt{n-1}$. Mianownik: $n-(n-1)=1$.`,
        T`Zostaje $\dfrac{\sqrt n+\sqrt{n-1}}{\sqrt n}=1+\sqrt{1-\tfrac1n}\ \to\ 2$.`,
        T`Granica ilorazu przyrostów istnieje i wynosi $2$, więc z tw. Stolza także $c_n\to\mathbf2$. ∎`,
      ], 'notes'),
      H2('Uwaga: w drugą stronę to nie działa'),
      STEPS(T`Kontrprzykład z notatek: $a_n=5n+2(-1)^n,\ b_n=5n-2(-1)^n$`, [
        T`Najpierw iloraz: $\dfrac{b_n}{a_n}=\dfrac{n\left(5-\frac{2(-1)^n}{n}\right)}{n\left(5+\frac{2(-1)^n}{n}\right)}\to\dfrac55=1$. <b>Granica istnieje.</b>`,
        T`Przyrosty: $b_n-b_{n-1}=5-4(-1)^n$ oraz $a_n-a_{n-1}=5+4(-1)^n$.`,
        T`Dla $n$ parzystego iloraz przyrostów to $\dfrac{5-4}{5+4}=\dfrac19$, dla nieparzystego $\dfrac{5+4}{5-4}=9$.`,
        T`Iloraz przyrostów skacze między $\frac19$ i $9$ — <b>nie ma granicy</b>, choć $\frac{b_n}{a_n}\to1$. Wniosek: Stolz działa tylko w jedną stronę (gdy granica przyrostów <i>istnieje</i>).`,
      ], 'notes'),
      CHECK([
        Q('Które założenie występuje w twierdzeniu Stolza (wersja z notatek)?',
          [T`$a_n$ rosnący i $a_n\to\infty$`, T`$b_n$ ograniczony`, T`oba ciągi malejące`, T`$a_n$ i $b_n$ dążą do $0$`], 0,
          T`Mianownik $a_n$ ma rosnąć do nieskończoności. (Istnieje też wersja z $a_n,b_n\to0$, ale tu jej nie ma.)`),
        Q(T`Czy z istnienia $\lim\frac{b_n}{a_n}$ wynika istnienie granicy ilorazu przyrostów?`,
          ['Tak, zawsze', T`Nie — kontrprzykład $a_n=5n+2(-1)^n$, $b_n=5n-2(-1)^n$`, 'Tak, jeśli ciągi są dodatnie', 'Tak, jeśli $b_n$ jest ograniczony'], 1,
          T`Iloraz przyrostów oscyluje między $\frac19$ i $9$ i nie ma granicy.`),
        Q(T`$\displaystyle\lim\frac1{\sqrt n}\sum_{k=1}^n\frac1{\sqrt k}=$`, ['0', '1', '2', '∞'], 2, T`Z Stolza: iloraz przyrostów $\to2$.`),
      ]),
    ],
  },

  // ───────────────────────────── CZĘŚĆ II ─────────────────────────────
  {
    id: 'l9', part: 2, title: 'Granica funkcji: definicje Heinego i Cauchy’ego', pages: 'str. 17–19', min: 14,
    lead: 'Przechodzimy od ciągów do funkcji. Dwie równoważne definicje: jedna przez ciągi, druga przez ε–δ.',
    blocks: [
      H2('Sąsiedztwo punktu'),
      BOX('def', 'Sąsiedztwo', T`$$S(x_0,\delta)=\{x\in\mathbb R:\ 0\lt|x-x_0|\lt\delta\}=(x_0-\delta,\,x_0)\cup(x_0,\,x_0+\delta).$$ Sąsiedztwo <b>nie zawiera</b> samego punktu $x_0$. Wersje jednostronne: $S^-(x_0,\delta)=(x_0-\delta,x_0)$ — lewostronne, $S^+(x_0,\delta)=(x_0,x_0+\delta)$ — prawostronne.`, 'notes'),
      P(T`Zakładamy, że $f$ jest określona w sąsiedztwie punktu $x_0$ — w samym $x_0$ <b>nie musi być</b> określona. To bardzo ważne: granica pyta o to, co funkcja robi <i>obok</i> $x_0$, nie o to, co robi w $x_0$.`),
      BOX('def', 'Definicja Heinego (przez ciągi)', T`$\displaystyle\lim_{x\to x_0}f(x)=a$, jeśli dla <b>każdego niestałego</b> ciągu $\{x_n\}$ dążącego do $x_0$ (czyli $x_n\ne x_0$) ciąg wartości $\{f(x_n)\}$ dąży do $a$.`, 'notes'),
      BOX('def', 'Definicja Cauchy’ego (ε–δ)', T`$$\lim_{x\to x_0}f(x)=a\iff\forall_{\varepsilon\gt0}\ \exists_{\delta\gt0}\ \forall_{x\in S(x_0,\delta)}\ \ |f(x)-a|\lt\varepsilon .$$`, 'notes'),
      BOX('idea', 'Która do czego?', T`Obie definicje są <b>równoważne</b>. <b>Heine</b> jest wygodny, gdy chcesz pokazać, że granica <i>nie istnieje</i> (znajdź dwa ciągi z różnymi wynikami). <b>Cauchy</b> jest wygodny, gdy chcesz <i>wprost</i> wykazać wartość granicy dla konkretnego $\varepsilon$.`),
      WIDGET('epsDelta', 'Gra ε–δ'),
      STEPS(T`Heine w akcji: $f(x)=\dfrac{x^2-1}{x-1}$, $x\to1$ (z notatek)`, [
        T`Bierzemy <b>dowolny</b> ciąg $x_n\to1$ z $x_n\ne1$, np. $x_n=1+\dfrac{2026}n$.`,
        T`Wartości: $f(x_n)=\dfrac{x_n^2-1}{x_n-1}=\dfrac{(x_n-1)(x_n+1)}{x_n-1}=x_n+1$ — wolno skrócić, bo $x_n\ne1$.`,
        T`$\lim(x_n+1)=1+1=2$ — i to niezależnie od wyboru ciągu.`,
        T`Zatem $\displaystyle\lim_{x\to1}\frac{x^2-1}{x-1}=\mathbf2$, choć $f(1)$ w ogóle nie istnieje. Wykres to prosta $y=x+1$ z „dziurą” w punkcie $(1,2)$.`,
      ], 'notes'),
      BOX('warn', 'Dlaczego xₙ ≠ x₀?', T`Bo granica ma ignorować wartość w samym punkcie. Gdyby wolno było brać $x_n=x_0$, wartość $f(x_0)$ (która może nie istnieć albo być „dziwna”) psułaby wszystko.`, 'add'),
      CHECK([
        Q(T`Czy $\displaystyle\lim_{x\to x_0}f(x)$ zależy od wartości $f(x_0)$?`,
          ['Tak, musi być równa granicy', 'Nie — liczy się tylko zachowanie f obok x₀', 'Tak, f(x₀) musi istnieć', 'Tylko dla funkcji ciągłych'], 1,
          T`Granica opiera się na sąsiedztwie, w którym $x_0$ jest wyrzucony.`),
        Q('W definicji Cauchy’ego (ε–δ) kto wybiera pierwszy?',
          ['δ, potem ε', 'ε, potem δ zależne od ε', 'Wybieramy je jednocześnie', 'Kolejność nie ma znaczenia'], 1,
          'Najpierw ktoś narzuca ε (jak blisko ma być), a my dobieramy δ. Zamiana kolejności zmienia sens zdania.'),
      ]),
    ],
  },
  {
    id: 'l10', part: 2, title: 'Kiedy granica nie istnieje (Heine w praktyce)', pages: 'str. 21, 25', min: 8,
    lead: 'Jedna sztuczka, która załatwia pół zadań: dwa ciągi, dwa różne wyniki.',
    blocks: [
      BOX('idea', 'Metoda', T`Chcesz pokazać, że $\lim_{x\to x_0}f(x)$ <b>nie istnieje</b>? Znajdź dwa ciągi $x_n\to x_0$ i $y_n\to x_0$ (obydwa różne od $x_0$), dla których $f(x_n)$ i $f(y_n)$ mają <b>różne granice</b>. Gdyby granica istniała, według Heinego musiałaby być jedna dla wszystkich ciągów.`),
      WIDGET('heine', 'Dwa ciągi — dwa wyniki'),
      STEPS(T`$\sin x$ przy $x\to\infty$ (z notatek)`, [
        T`Ciąg $x_n=\pi n\to\infty$. Wtedy $\sin(\pi n)=0$, więc $f(x_n)\to0$.`,
        T`Ciąg $y_n=\dfrac\pi2+2\pi n\to\infty$. Wtedy $\sin y_n=\sin\dfrac\pi2=1$, więc $f(y_n)\to1$.`,
        T`$0\ne1$, więc <b>granica $\lim_{x\to\infty}\sin x$ nie istnieje</b>. (Podobnie dla $\cos x$.)`,
      ], 'notes'),
      STEPS(T`$\dfrac1x$ przy $x\to0$ (z notatek)`, [
        T`Ciąg $x_n=\dfrac1n\to0$: $f(x_n)=\dfrac{1}{1/n}=n\to+\infty$.`,
        T`Ciąg $y_n=-\dfrac1n\to0$: $f(y_n)=-n\to-\infty$.`,
        T`Wyniki się różnią, więc $\lim_{x\to0}\frac1x$ nie istnieje. (Za to istnieją granice <i>jednostronne</i>: $+\infty$ z prawej i $-\infty$ z lewej.)`,
      ], 'notes'),
      BOX('tip', 'Granice w nieskończoności', T`Dla $x\to\infty$ obowiązuje ta sama zasada: ciągi $x_n\to\infty$ zamiast ciągów dążących do punktu.`, 'add'),
      CHECK([
        Q('Aby pokazać, że granica funkcji w punkcie NIE istnieje, wystarczy:',
          [T`znaleźć jeden ciąg $x_n\to x_0$, dla którego $f(x_n)\to0$`, T`znaleźć dwa ciągi $x_n,y_n\to x_0$ z różnymi granicami $f(x_n)$ i $f(y_n)$`, T`sprawdzić, że $f(x_0)$ nie istnieje`, 'narysować wykres'], 1,
          T`To dokładnie zaprzeczenie definicji Heinego. (Sama nieistniejąca wartość $f(x_0)$ nic nie mówi o granicy.)`),
        Q(T`$\displaystyle\lim_{x\to0}\sin\frac1x$:`, ['wynosi 0', 'wynosi 1', 'nie istnieje', 'wynosi ∞'], 2,
          T`Ciągi $\frac1{\pi n}$ (daje $0$) i $\frac1{\pi/2+2\pi n}$ (daje $1$) dążą do zera, ale wartości mają różne granice.`),
      ]),
    ],
  },
  {
    id: 'l11', part: 2, title: 'Arytmetyka granic funkcji i granice jednostronne', pages: 'str. 21–24', min: 12,
    lead: 'Te same zasady co dla ciągów — plus pytanie, co się dzieje, gdy zbliżamy się do punktu tylko z jednej strony.',
    blocks: [
      BOX('thm', 'Arytmetyka granic funkcji', T`Niech $\lim_{x\to x_0}f(x)=a$ i $\lim_{x\to x_0}g(x)=b$ oraz $A,B\in\mathbb R$. Wtedy:
<ol>
<li>$\lim(Af(x)\pm Bg(x))=Aa\pm Bb$</li>
<li>$\lim\big(f(x)\cdot g(x)\big)=a\cdot b$</li>
<li>jeśli $b\ne0$: $\lim\dfrac{f(x)}{g(x)}=\dfrac ab$</li>
</ol>`, 'notes'),
      H2('Granice jednostronne'),
      BOX('def', 'Granica lewo- i prawostronna', T`$\displaystyle\lim_{x\to x_0^-}f(x)$ — granica <b>lewostronna</b>: $x$ zbliża się do $x_0$ z lewej strony ($x\lt x_0$).<br>$\displaystyle\lim_{x\to x_0^+}f(x)$ — granica <b>prawostronna</b>: $x$ zbliża się z prawej ($x\gt x_0$).`, 'notes'),
      BOX('thm', 'Związek z granicą zwykłą i ciągłością', T`Jeśli funkcja ma w pewnym sąsiedztwie $x_0$ granice jednostronne $\displaystyle\lim_{x\to x_0^-}f=A$ oraz $\displaystyle\lim_{x\to x_0^+}f=B$, to:
<ol>
<li>jeśli $A=B$, funkcja ma granicę obustronną w $x_0$ (równą $A$);</li>
<li>jeśli dodatkowo $f(x_0)=A$, funkcja jest <b>ciągła</b> w $x_0$.</li>
</ol>`, 'notes'),
      WIDGET('oneSided', 'Zbliżamy się z lewej i z prawej', '0'),
      BOX('idea', 'Rodzina f, f*, f** z notatek', T`Funkcja $f(x)=\dfrac{x^2-1}{x-1}$ ma w $x=1$ obie granice jednostronne równe $2$. Dalej zależy od tego, co dopiszemy w punkcie $1$:
<ul>
<li>nic ($f(1)$ nie istnieje) — dziura;</li>
<li>$f^*(1)=2$ — funkcja <b>ciągła</b>;</li>
<li>$f^{**}(1)=3$ — funkcja <b>nieciągła</b>, bo granica $2\ne3=f(1)$.</li>
</ul>Przełącz funkcję w widżecie, żeby zobaczyć wszystkie trzy.`, 'notes'),
      BOX('warn', 'Gdy mianownik zmierza do zera', T`Punkt 3 wymaga $b\ne0$. Dla $\lim_{x\to0}\frac1x$ mianownik dąży do $0$ i wzór nie działa. Z notatek: biorąc $x_n=\frac1n$ dostajemy $+\infty$, a $x_n=-\frac1n$ daje $-\infty$ — więc granica obustronna nie istnieje.`, 'notes'),
      CHECK([
        Q(T`$\displaystyle\lim_{x\to1^-}\frac{x^2-1}{x-1}=$`, ['0', '1', '2', 'nie istnieje'], 2, T`Dla $x\ne1$: $\frac{x^2-1}{x-1}=x+1\to2$.`),
        Q(T`$\displaystyle\lim_{x\to0}\frac1x$:`, ['+∞', '−∞', '0', 'nie istnieje'], 3, T`Z prawej $+\infty$, z lewej $-\infty$. Granice jednostronne są różne, więc granica obustronna nie istnieje.`),
        Q(T`Granice jednostronne w $x_0$ są obie równe $5$, a $f(x_0)=7$. Co z tego wynika?`,
          [T`$f$ jest ciągła w $x_0$`, T`$\lim_{x\to x_0}f=5$, ale $f$ jest nieciągła w $x_0$`, T`$\lim_{x\to x_0}f=7$`, 'granica nie istnieje'], 1,
          T`Granica obustronna to $5$ (obie jednostronne równe). Ale $f(x_0)\ne5$, więc ciągłości brak — to nieciągłość usuwalna.`),
      ]),
    ],
  },
  {
    id: 'l12', part: 2, title: 'Ważne granice funkcji: sin x / x, e i spółka', pages: 'str. 20, 24–27', min: 15,
    lead: 'Pięć granic, które wystarczą do większości zadań. Najpierw lista, potem skąd się biorą.',
    blocks: [
      BOX('thm', 'Lista ważnych granic (z notatek)', T`<ol>
<li>$\displaystyle\lim_{x\to a}c=c$ (stała)</li>
<li>$\displaystyle\lim_{x\to a}x=a$</li>
<li>$\displaystyle\lim_{x\to a}\sqrt[n]{x}=\sqrt[n]{a}$</li>
<li>$\displaystyle\lim_{x\to a}\sin x=\sin a,\quad\lim_{x\to a}\cos x=\cos a$</li>
<li>$\displaystyle\lim_{x\to0}\frac{\sin x}{x}=1$</li>
<li>$\displaystyle\lim_{x\to0}\frac{a^x-1}{x}=\ln a$</li>
<li>$\displaystyle\lim_{x\to0}\frac{\log_a(1+x)}{x}=\frac1{\ln a}$</li>
</ol>`, 'notes'),
      H2(T`Skąd $\dfrac{\sin x}{x}\to1$ — dowód geometryczny`),
      WIDGET('sinGeo', 'Trzy pola na okręgu jednostkowym'),
      STEPS('Dowód krok po kroku (z notatek)', [
        T`Na okręgu jednostkowym rysujemy kąt $\alpha\in(0,\frac\pi2)$ i trzy figury: mały trójkąt o polu $P_1=\frac12\sin\alpha\cos\alpha$, wycinek koła o polu $P_2=\frac\alpha2$ i duży trójkąt o polu $P_3=\frac12\operatorname{tg}\alpha$.`,
        T`Każda figura mieści się w następnej, więc $P_1\le P_2\le P_3$.`,
        T`Wstawiamy wzory: $\ \dfrac12\sin\alpha\cos\alpha\ \le\ \dfrac\alpha2\ \le\ \dfrac12\cdot\dfrac{\sin\alpha}{\cos\alpha}$.`,
        T`Dzielimy przez $\frac12\sin\alpha\gt0$: $\ \cos\alpha\le\dfrac\alpha{\sin\alpha}\le\dfrac1{\cos\alpha}$, a po odwróceniu ułamków: $\ \cos\alpha\le\dfrac{\sin\alpha}\alpha\le\dfrac1{\cos\alpha}$.`,
        T`Gdy $\alpha\to0^+$, to $\cos\alpha\to1$ i $\frac1{\cos\alpha}\to1$. Z twierdzenia o trzech funkcjach $\dfrac{\sin\alpha}{\alpha}\to1$. Dla $\alpha\lt0$ tak samo — $\frac{\sin\alpha}{\alpha}$ jest funkcją parzystą. ∎`,
      ], 'notes'),
      H2(T`Najważniejsza: $\left(1+\dfrac1x\right)^x\to e$`),
      BOX('thm', 'Granice związane z e', T`$$\lim_{x\to\infty}\left(1+\frac1x\right)^x=e,\qquad\lim_{x\to-\infty}\left(1+\frac1x\right)^x=e,\qquad\lim_{x\to0^\pm}(1+x)^{1/x}=e.$$ Notatki: „najważniejsza granica, wszystko się do niej sprowadza”.`, 'notes'),
      STEPS(T`Jak przejść między wersjami (podstawienia z notatek)`, [
        T`<b>Od $x\to\infty$ do $x\to0^+$.</b> W $\lim_{x\to0^+}(1+x)^{1/x}$ podstawiamy $y=\frac1x$. Gdy $x\to0^+$, to $y\to+\infty$, więc granica to $\lim_{y\to+\infty}\left(1+\frac1y\right)^y=e$.`,
        T`<b>Od $+\infty$ do $-\infty$.</b> W $\lim_{x\to-\infty}\left(1+\frac1x\right)^x$ podstawiamy $y=-x$: gdy $x\to-\infty$, to $y\to+\infty$. Wyrażenie przechodzi w $\left(1-\frac1y\right)^{-y}$.`,
        T`Przekształcamy: $\left(1-\dfrac1y\right)^{-y}=\left(\dfrac{y-1}{y}\right)^{-y}=\left(\dfrac{y}{y-1}\right)^{y}=\left(1+\dfrac1{y-1}\right)^{y}$.`,
        T`Rozbijamy wykładnik $y=(y-1)+1$: $\ \left(1+\dfrac1{y-1}\right)^{y-1}\cdot\left(1+\dfrac1{y-1}\right)\ \to\ e\cdot1=e$. ∎`,
      ], 'notes'),
      WIDGET('limTable', 'Granice liczbowo'),
      STEPS(T`Granica z trygonometrią: $\displaystyle\lim_{x\to0}\left(\frac1{\sin x}-\frac1{\operatorname{tg}x}\right)$`, [
        T`Wspólny mianownik: $\dfrac1{\sin x}-\dfrac{\cos x}{\sin x}=\dfrac{1-\cos x}{\sin x}$.`,
        T`Wzory podwójnego kąta: $1-\cos x=2\sin^2\frac x2$ oraz $\sin x=2\sin\frac x2\cos\frac x2$.`,
        T`Skracamy: $\dfrac{2\sin^2\frac x2}{2\sin\frac x2\cos\frac x2}=\operatorname{tg}\dfrac x2$.`,
        T`$\operatorname{tg}\frac x2\to\operatorname{tg}0=0$. Granica wynosi $\mathbf0$.`,
        T`Z plusem zamiast minusa: $\dfrac1{\sin x}+\dfrac1{\operatorname{tg}x}=\dfrac{1+\cos x}{\sin x}=\operatorname{ctg}\dfrac x2\to+\infty$ dla $x\to0^+$.`,
      ], 'notes'),
      CHECK([
        Q(T`$\displaystyle\lim_{x\to0}\frac{2^x-1}{x}=$`, ['1', '0', T`$\ln2$`, '2'], 2, T`Wzór: $\lim\frac{a^x-1}x=\ln a$, tu $a=2$.`),
        Q(T`$\displaystyle\lim_{x\to0}\frac{\ln(1+x)}{x}=$`, ['0', '1', 'e', '∞'], 1, T`Wzór $\frac1{\ln a}$ dla $a=e$: $\frac1{\ln e}=1$.`),
        Q(T`$\displaystyle\lim_{x\to0}(1+x)^{1/x}=$`, ['1', '0', 'e', '∞'], 2, 'To właśnie najważniejsza granica.'),
        Q(T`$\displaystyle\lim_{x\to-\infty}\left(1+\frac1x\right)^x=$`, ['e', T`$\frac1e$`, '1', 'nie istnieje'], 0, T`Dla $x\to-\infty$ też wychodzi $e$ — pokazuje to podstawienie $y=-x$ z notatek.`),
      ]),
    ],
  },
  {
    id: 'l13', part: 2, title: 'Granica funkcji złożonej', pages: 'str. 28–30', min: 10,
    lead: 'Podstawienie y = f(x) ma swoje zasady. Jedno założenie jest łatwe do przeoczenia.',
    blocks: [
      BOX('thm', 'Tw. (o granicy funkcji złożonej)', T`Jeśli $\displaystyle\lim_{x\to x_0}f(x)=y_0$, $\displaystyle\lim_{y\to y_0}g(y)=A$ oraz $f(x)\ne y_0$ w pewnym sąsiedztwie punktu $x_0$, to $$\lim_{x\to x_0}g\big(f(x)\big)=A.$$`, 'notes'),
      BOX('idea', 'Po ludzku', T`To formalne uzasadnienie podstawienia $y=f(x)$: jeśli $x\to x_0$, to $y=f(x)\to y_0$, a wtedy liczymy granicę zewnętrznej funkcji $g$ w $y_0$.`),
      BOX('warn', 'Po co założenie f(x) ≠ y₀?', T`Bo bez niego twierdzenie jest fałszywe. Weźmy $g(y)=1$ dla $y\ne0$, $g(0)=0$ oraz $f(x)=0$ (stała). Wtedy $\lim_{y\to0}g(y)=1$, ale $g(f(x))=g(0)=0$ dla każdego $x$ — granica złożenia to $0$, nie $1$. Założenie $f(x)\ne y_0$ wyklucza takie „psucie”.`, 'add'),
      H2('Składanie funkcji i dziedziny'),
      P(T`Złożenie $g\circ f$ (najpierw $f$, potem $g$) można utworzyć, jeśli zbiór wartości $f$ mieści się w dziedzinie $g$: $f[X]\subseteq T$. Wtedy $(g\circ f)(x)=g(f(x))$.`),
      P(T`<b>Przykład z notatek:</b> $f(x)=2x+1$ (dziedzina i zbiór wartości $\mathbb R$) oraz $g(x)=\sqrt x$ (dziedzina $[0,\infty)$). Ponieważ $\mathbb R\not\subseteq[0,\infty)$, złożenie $g\circ f$ <b>nie jest</b> określone na całej prostej. Odwrotnie: $g[[0,\infty)]=[0,\infty)\subseteq\mathbb R=D_f$, więc $(f\circ g)(x)=2\sqrt x+1$ jest w porządku.`),
      WIDGET('composite', 'Czy złożenie istnieje?'),
      STEPS(T`Przykład z notatek: $\displaystyle\lim_{x\to0}\frac{\sin(2026x)}{2026x}$`, [
        T`To złożenie: funkcja wewnętrzna $f(x)=2026x$, zewnętrzna $g(y)=\dfrac{\sin y}{y}$. Wtedy $g(f(x))=\dfrac{\sin(2026x)}{2026x}$.`,
        T`Wewnętrzna: $\displaystyle\lim_{x\to0}2026x=0=y_0$. Sprawdzamy założenie: $2026x\ne0$ dla $x\ne0$ ✓.`,
        T`Zewnętrzna: $\displaystyle\lim_{y\to0}\dfrac{\sin y}{y}=1$ (ważna granica).`,
        T`Z twierdzenia o granicy złożonej: $\displaystyle\lim_{x\to0}\dfrac{\sin(2026x)}{2026x}=\mathbf1$. ∎`,
      ], 'notes'),
      BOX('tip', 'Odruch do zapamiętania', T`Wszystko, co ma postać $\dfrac{\sin(\text{coś})}{\text{to samo coś}}$ z „czymś” $\to0$, daje $1$. Dlatego $\dfrac{\sin5x}{x}=5\cdot\dfrac{\sin5x}{5x}\to5$.`, 'add'),
      CHECK([
        Q(T`$\displaystyle\lim_{x\to0}\frac{\sin(5x)}{x}=$`, ['1', '5', T`$\frac15$`, '0'], 1, T`$\frac{\sin5x}{x}=5\cdot\frac{\sin5x}{5x}\to5\cdot1$.`),
        Q('Po co w twierdzeniu o granicy złożonej wymagamy f(x) ≠ y₀ w sąsiedztwie?',
          ['żeby f była ciągła', 'żeby uniknąć sytuacji, w której wartość g(y₀) „psuje” granicę zewnętrznej funkcji', 'żeby g była rosnąca', 'to założenie jest zbędne'], 1,
          T`Kontrprzykład: $g(y)=1$ dla $y\ne0$, $g(0)=0$, $f\equiv0$.`),
        Q(T`$f(x)=2x+1$, $g(x)=\sqrt x$. Czy $g\circ f$ jest określone dla wszystkich $x\in\mathbb R$?`,
          ['Tak', T`Nie — $f[\mathbb R]=\mathbb R\not\subseteq[0,\infty)$`, 'Tak, ale tylko dla x > 0', 'Nie, bo f nie jest ciągła'], 1,
          T`Np. $f(-3)=-5$, a $\sqrt{-5}$ nie istnieje.`),
      ]),
    ],
  },

  // ───────────────────────────── CZĘŚĆ III ─────────────────────────────
  {
    id: 'l14', part: 3, title: 'Ciągłość funkcji w punkcie', pages: 'str. 30–34', min: 12,
    lead: 'Ciągłość to granica, która jest akurat tym, czym powinna być: wartością funkcji.',
    blocks: [
      BOX('def', 'Definicja ciągłości w punkcie', T`Niech $f$ będzie określona w otoczeniu $x\in(x_0-\delta,\,x_0+\delta)$. Funkcja jest <b>ciągła w punkcie $x_0$</b>, gdy $$\lim_{x\to x_0}f(x)=f(x_0)\quad\Longleftrightarrow\quad\lim_{h\to0}f(x_0+h)=f(x_0).$$`, 'notes'),
      BOX('idea', 'Trzy rzeczy naraz', T`Ciągłość w $x_0$ wymaga: (1) $f(x_0)$ istnieje, (2) granica w $x_0$ istnieje, (3) obie liczby są równe. Wykres można wtedy „narysować bez odrywania ołówka” w okolicy $x_0$.`),
      BOX('thm', 'Ciągłość a działania', T`Skoro ciągłość opiera się na granicy, to dziedziczy jej arytmetykę: <b>suma, różnica, iloczyn</b> (i iloraz, gdy mianownik $\ne0$) funkcji ciągłych w $x_0$ jest funkcją ciągłą w $x_0$.`, 'notes'),
      H2('Katalog funkcji ciągłych'),
      RAW(`<div class="scroll-x"><table class="t"><tr><th>Funkcja</th><th>Gdzie ciągła</th><th>Dlaczego</th></tr>
<tr><td>stała $f(x)=A$, tożsamość $g(x)=x$</td><td>$\\mathbb R$</td><td>$\\lim A=A$, $\\lim_{h\\to0}(x_0+h)=x_0$ (P1)</td></tr>
<tr><td>wielomiany</td><td>$\\mathbb R$</td><td>sumy i iloczyny funkcji $x$ i stałych (P2)</td></tr>
<tr><td>funkcje wymierne $\\frac{p(x)}{q(x)}$</td><td>poza zerami mianownika</td><td>iloraz ciągłych (P3)</td></tr>
<tr><td>$\\sin x$, $\\cos x$</td><td>$\\mathbb R$</td><td>wzór na sin(x+h) (P4)</td></tr>
<tr><td>$\\operatorname{tg}x$, $\\operatorname{ctg}x$</td><td>poza zerami cos / sin</td><td>iloraz sin i cos (P5)</td></tr>
<tr><td>$a^x$, $a\\gt0$</td><td>$\\mathbb R$</td><td>$a^{x+h}=a^x\\cdot a^h\\to a^x$ (P6)</td></tr></table></div>`),
      WIDGET('catalog', 'Katalog: gdzie funkcja jest ciągła'),
      STEPS(T`Dowód ciągłości $\sin x$ (P4)`, [
        T`Chcemy $\lim_{h\to0}\sin(x+h)=\sin x$. Wzór na sinus sumy: $\sin(x+h)=\sin x\cos h+\sin h\cos x$.`,
        T`Gdy $h\to0$: $\cos h\to1$ i $\sin h\to0$.`,
        T`Zatem granica $=\sin x\cdot1+0\cdot\cos x=\sin x$. ∎`,
      ], 'notes'),
      BOX('def', 'Ciągłość na przedziale', T`$f$ jest ciągła na przedziale otwartym $(a,b)$, gdy jest ciągła w <b>każdym</b> punkcie tego przedziału. Na przedziale domkniętym $[a,b]$ — dodatkowo na końcach rozumiemy ciągłość jednostronnie.`, 'notes'),
      CHECK([
        Q('Która z funkcji NIE jest ciągła w każdym punkcie dziedziny?',
          [T`$x^3-2x$`, T`$\sin x$`, T`$f(x)=1$ dla $x\ge0$, $f(x)=-1$ dla $x\lt0$`, T`$2^x$`], 2,
          T`W $x=0$ granica lewostronna ($-1$) różni się od prawostronnej ($1$).`),
        Q(T`Gdzie ciągła jest funkcja $\operatorname{tg}x$?`, [T`wszędzie na $\mathbb R$`, T`na $\mathbb R\setminus\{\frac\pi2+k\pi\}$`, T`tylko na $[0,\pi]$`, T`tylko dla $x\gt0$`], 1, T`$\operatorname{tg}=\frac{\sin}{\cos}$ — ciągła tam, gdzie $\cos x\ne0$.`),
        Q(T`Czy $\dfrac{x+1}{x^2-1}$ jest ciągła w punkcie $x=1$?`, ['Tak', 'Nie — w tym punkcie nie jest nawet określona', 'Tak, bo wielomiany są ciągłe', 'Nie da się ocenić'], 1,
          T`Mianownik $x^2-1$ znika w $\pm1$. Poza tymi punktami funkcja jest ciągła.`),
      ]),
    ],
  },
  {
    id: 'l15', part: 3, title: 'Punkty nieciągłości I i II rodzaju', pages: 'str. 34–36', min: 10,
    lead: 'Nieciągłości mają typy. Wystarczy zajrzeć w granice jednostronne.',
    blocks: [
      BOX('def', 'Punkt nieciągłości', T`Punkt $x_0$ nazywamy <b>punktem nieciągłości</b>, gdy funkcja jest nieciągła w $x_0$, ale ciągła w jego sąsiedztwie.`, 'notes'),
      BOX('def', 'Rodzaje nieciągłości', T`<ul>
<li><b>I rodzaju</b> — obie granice jednostronne w $x_0$ istnieją i są <b>skończone</b>. Dwa podtypy: <i>usuwalna</i> (granice równe, ale $\ne f(x_0)$ lub $f(x_0)$ nie istnieje) i <i>skok</i> (granice różne).</li>
<li><b>II rodzaju</b> — przynajmniej jedna z granic jednostronnych <b>nie istnieje lub jest nieskończona</b> (np. $\frac1x$ lub $\sin\frac1x$ w zerze).</li>
</ul>`, 'add'),
      WIDGET('oneSided', 'Galeria nieciągłości', '3'),
      RAW(`<div class="scroll-x"><table class="t"><tr><th>Typ</th><th>Granice jednostronne</th><th>Przykład</th></tr>
<tr><td>usuwalna (I)</td><td>skończone, równe</td><td>$\\frac{x^2-1}{x-1}$ w $x=1$</td></tr>
<tr><td>skok (I)</td><td>skończone, różne</td><td>$1$ dla $x\\ge0$, $-1$ dla $x\\lt0$ w $x=0$</td></tr>
<tr><td>II rodzaju</td><td>nieskończona lub nie istnieje</td><td>$\\frac1x$, $\\sin\\frac1x$ w $x=0$</td></tr></table></div>`),
      BOX('thm', 'Kryterium ciągłości przez granice jednostronne', T`$$\lim_{x\to x_0^-}f(x)=\lim_{x\to x_0^+}f(x)=A\ \ \text{ oraz }\ \ f(x_0)=A\ \ \Longrightarrow\ \ f\ \text{jest ciągła w }x_0.$$`, 'notes'),
      STEPS(T`Usuwanie nieciągłości: $f(x)=\dfrac{\sin x}{x}$`, [
        T`Funkcja jest określona dla $x\ne0$. W zerze mamy nieciągłość, bo $f(0)$ nie istnieje.`,
        T`Ale z ważnej granicy $\displaystyle\lim_{x\to0}\dfrac{\sin x}{x}=1$ — granice jednostronne są równe $1$.`,
        T`Definiujemy $f(0)=1$: $\ f(x)=\begin{cases}\frac{\sin x}{x} & x\ne0\\ 1 & x=0\end{cases}$. Teraz granica $=f(0)$ i funkcja jest ciągła.`,
        T`To <b>przedłużenie ciągłe</b> funkcji. Możliwe tylko przy nieciągłości usuwalnej.`,
      ], 'notes'),
      CHECK([
        Q(T`$f(x)=1$ dla $x\ge0$, $f(x)=-1$ dla $x\lt0$. Jaki typ nieciągłości w $x=0$?`, ['usuwalna', T`skok (I rodzaju)`, 'II rodzaju', 'brak nieciągłości'], 1, T`Granice jednostronne są skończone, ale różne ($-1$ i $1$).`),
        Q(T`$f(x)=\sin\dfrac1x$ w $x=0$:`, ['I rodzaju, usuwalna', 'I rodzaju, skok', 'II rodzaju', 'funkcja ciągła'], 2, 'Żadna granica jednostronna nie istnieje (oscylacje).'),
        Q(T`$f(x)=\dfrac1x$ w $x=0$:`, ['I rodzaju', 'II rodzaju', 'ciągła', 'usuwalna'], 1, 'Granice jednostronne są nieskończone.'),
        Q(T`$f^{**}(x)=\frac{x^2-1}{x-1}$ dla $x\ne1$, $f^{**}(1)=3$. Typ w $x=1$:`, ['usuwalna (I rodzaju)', 'skok', 'II rodzaju', 'ciągła'], 0, T`Granica to $2$, ale $f(1)=3$. Wystarczy zmienić $f(1)$ na $2$, by naprawić.`),
      ]),
    ],
  },
  {
    id: 'l16', part: 3, title: 'Funkcja odwrotna i złożona a ciągłość', pages: 'str. 36–38', min: 10,
    lead: 'Ciągłość przechodzi przez odwracanie i składanie — dlatego ln, pierwiastki i spółka są ciągłe „za darmo”.',
    blocks: [
      BOX('thm', 'Funkcja odwrotna', T`Funkcja odwrotna do <b>ciągłej funkcji rosnącej (malejącej)</b> jest funkcją ciągłą rosnącą (malejącą). Np. $f(x)=\left(\tfrac12\right)^x$ jest malejąca, a odwrotna do niej $\log_{1/2}x$ — też malejąca i ciągła. Wykresy są symetryczne względem prostej $y=x$.`, 'notes'),
      BOX('thm', 'Tw. (o ciągłości funkcji złożonej)', T`Jeśli $f$ jest ciągła w $x_0$, a $g$ jest ciągła w $y_0=f(x_0)$, to $g\circ f$ jest ciągła w $x_0$.`, 'notes'),
      BOX('thm', 'Tw. (o wnoszeniu granicy do argumentu funkcji ciągłej)', T`Jeśli $\displaystyle\lim_{x\to x_0}f(x)=A$ i $g$ jest ciągła w $A$, to $$\lim_{x\to x_0}g\big(f(x)\big)=g\Big(\lim_{x\to x_0}f(x)\Big)=g(A).$$ Czyli: wolno „wnieść” granicę pod znak funkcji ciągłej.`, 'notes'),
      BOX('idea', 'Różnica względem granicy złożonej', T`W lekcji o granicy funkcji złożonej wymagaliśmy $f(x)\ne y_0$. Tutaj to zbędne — ale w zamian żądamy, by $g$ była <b>ciągła</b> w $A$. Ciągłość $g$ to dokładnie to, co chroni nas przed „psuciem” w $y_0$.`, 'add'),
      STEPS(T`Przykład z notatek: $\displaystyle\lim_{x\to0}e^{\frac{\sin x}{x}}$`, [
        T`Funkcja wewnętrzna: $\dfrac{\sin x}{x}\to1$ przy $x\to0$.`,
        T`Funkcja zewnętrzna $g(y)=e^y$ jest ciągła w $y=1$ (jak każda funkcja wykładnicza).`,
        T`Wnosimy granicę: $\ \displaystyle\lim e^{\frac{\sin x}{x}}=e^{\lim\frac{\sin x}{x}}=e^1=\mathbf e$. ∎`,
      ], 'notes'),
      STEPS(T`Skąd $\displaystyle\lim_{x\to0}\frac{\log_a(1+x)}{x}=\frac1{\ln a}$ (dokończenie rachunku z notatek)`, [
        T`Zapisujemy $\dfrac{\log_a(1+x)}{x}=\dfrac1x\log_a(1+x)=\log_a(1+x)^{1/x}$ (wnosimy $\frac1x$ do wykładnika logarytmu).`,
        T`Wewnątrz mamy $(1+x)^{1/x}\to e$ (najważniejsza granica), a $\log_a$ jest ciągły.`,
        T`Wnosimy granicę: $\ \log_a\Big(\lim(1+x)^{1/x}\Big)=\log_ae=\dfrac{\ln e}{\ln a}=\dfrac1{\ln a}$. ∎`,
      ], 'add'),
      CHECK([
        Q(T`$\displaystyle\lim_{x\to0}e^{\frac{\sin x}{x}}=$`, ['1', 'e', '0', 'nie istnieje'], 1, T`$\frac{\sin x}{x}\to1$, a $e^y$ jest ciągła w $1$: wynik $e^1=e$.`),
        Q('Funkcja odwrotna do ciągłej i rosnącej funkcji jest:', ['ciągła i rosnąca', 'ciągła i malejąca', 'rosnąca, ale niekoniecznie ciągła', 'nieciągła'], 0, 'Tak mówi twierdzenie z notatek.'),
        Q(T`Czy $g\circ f$ jest ciągła w $x_0$, gdy $f$ jest ciągła w $x_0$, a $g$ jest ciągła w $f(x_0)$?`, ['Tak', 'Nie', 'Tylko gdy f jest rosnąca', 'Tylko gdy g jest wielomianem'], 0, 'To dokładnie twierdzenie o ciągłości złożenia.'),
      ]),
    ],
  },
  {
    id: 'l17', part: 3, title: 'Twierdzenie Weierstrassa', pages: 'str. 39–40', min: 10,
    lead: 'Funkcja ciągła na odcinku domkniętym ma największą i najmniejszą wartość. Każde założenie jest potrzebne.',
    blocks: [
      BOX('thm', 'Tw. (Weierstrassa)', T`Jeśli $f$ jest ciągła na przedziale $[a,b]$, to $f$ jest ograniczona i istnieją punkty $x_1,x_2\in[a,b]$ takie, że $f(x_1)$ jest wartością <b>najmniejszą</b> (kres dolny), a $f(x_2)$ wartością <b>największą</b> (kres górny).`, 'notes'),
      BOX('idea', 'Trzy założenia, trzy sposoby na zepsucie', T`<ol><li>funkcja musi być <b>ciągła</b>,</li><li>przedział musi być <b>domknięty</b> (końce należą),</li><li>przedział musi być <b>ograniczony</b>.</li></ol>Zepsuj dowolne z nich — teza może upaść. W notatkach są takie „przykłady na NIE”.`),
      WIDGET('weier', 'Przykłady TAK i NIE'),
      CHECK([
        Q(T`Dlaczego tw. Weierstrassa nie działa dla $\operatorname{tg}x$ na $[0,\frac\pi2)$?`,
          [T`bo tg nie jest ciągła na $[0,\frac\pi2)$`, T`bo przedział nie jest domknięty, a funkcja jest nieograniczona`, T`bo tg jest malejąca`, 'bo przedział jest zbyt krótki'], 1,
          T`$\operatorname{tg}$ jest ciągła, ale $\frac\pi2$ nie należy do przedziału, i $\operatorname{tg}x\to\infty$ przy $x\to\frac\pi2^-$.`),
        Q(T`Czy $f(x)=28x$ na $(-1,1)$ ma wartość największą?`, ['Tak, 28', 'Tak, 0', 'Nie — przedział jest otwarty', 'Nie, bo f nie jest ciągła'], 2, 'Wartość $28$ jest kresem górnym, ale nigdy nie zostaje osiągnięta.'),
        Q(T`Czy funkcja ciągła na $(0,1)$ musi mieć największą wartość?`, ['Tak, zawsze', T`Nie (np. $f(x)=x$ albo $\frac1x$)`, 'Tak, jeśli jest rosnąca', 'Tak, jeśli jest ograniczona'], 1, 'Przedział otwarty nie jest dobrym polem dla Weierstrassa. Przykład $f(x)=x$: kres $1$ nie jest osiągnięty.'),
      ]),
    ],
  },
  {
    id: 'l18', part: 3, title: 'Twierdzenie Darboux (wartości pośrednie)', pages: 'str. 41', min: 10,
    lead: 'Ciągła funkcja nie może „przeskoczyć” zera: żeby przejść z minusa na plus, musi przez zero przejść.',
    blocks: [
      BOX('thm', 'Tw. Darboux (wersja 1)', T`Jeśli $f$ jest ciągła na $[a,b]$, to przyjmuje <b>każdą wartość pośrednią</b>: dla każdego $\xi$ leżącego pomiędzy $f(a)$ i $f(b)$ istnieje punkt $x_0$ taki, że $f(x_0)=\xi$.`, 'notes'),
      BOX('thm', 'Tw. Darboux (wersja 2 — o miejscu zerowym)', T`Jeśli $f:[a,b]\to\mathbb R$ jest ciągła oraz $$f(a)\cdot f(b)\lt0,$$ to istnieje $x_0\in(a,b)$ takie, że $f(x_0)=0$.`, 'notes'),
      WIDGET('bisect', 'Bisekcja: szukanie zera'),
      STEPS(T`Przykład z notatek: równanie $3^x=9x$ ma dwa rozwiązania`, [
        T`<b>Pierwsze rozwiązanie:</b> $x=3$, bo $3^3=27=9\cdot3$ ✓ (zgadujemy).`,
        T`<b>Drugie:</b> szukamy zer funkcji $f(x)=3^x-9x$. Jest ciągła jako różnica funkcji ciągłych.`,
        T`Bierzemy przedział $[0,1]$: $f(0)=3^0-0=1$, $f(1)=3-9=-6$. Iloczyn $f(0)\cdot f(1)=-6\lt0$.`,
        T`Z twierdzenia Darboux istnieje $x_0\in(0,1)$, dla którego $f(x_0)=0$, czyli $3^{x_0}=9x_0$. Numerycznie $x_0\approx0{,}128$. (Sprawdź w widżecie bisekcją.)`,
      ], 'notes'),
      BOX('warn', 'Bez ciągłości nie działa', T`Weźmy $f(x)=\frac1x$ na $[-1,1]$: $f(-1)\cdot f(1)=-1\lt0$, ale zera nie ma. Powód: $f$ nie jest ciągła (w $0$ nawet nie jest określona).`, 'add'),
      CHECK([
        Q(T`Dla $f(x)=x^3-x-1$ mamy $f(1)=-1$ i $f(2)=5$. Co wynika z tw. Darboux?`,
          [T`istnieje miejsce zerowe w $(1,2)$`, 'brak miejsc zerowych', 'miejsce zerowe jest równe 1,5', T`$f$ jest rosnąca`], 0,
          T`$f$ jest wielomianem (ciągłą), a $f(1)\cdot f(2)=-5\lt0$.`),
        Q(T`$f(x)=\frac1x$, $f(-1)f(1)\lt0$, a zera nie ma. Dlaczego nie ma sprzeczności z Darboux?`,
          ['Darboux ma błąd', T`bo $f$ nie jest ciągła na $[-1,1]$`, 'bo przedział jest za duży', T`bo $f(1)\gt0$`], 1,
          'Założenie ciągłości na całym przedziale domkniętym nie jest spełnione.'),
      ]),
    ],
  },
];

const LESSON_BY_ID = Object.fromEntries(LESSONS.map((l) => [l.id, l]));
