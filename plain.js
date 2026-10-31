// „Na chłopski rozum”: lekcja 0 z podstawami oraz proste wyjaśnienie na początku każdej lekcji.
PARTS[0] = 'Start — podstawy od zera';

const L0 = {
  id: 'l0', part: 0, title: 'Zanim zaczniemy: podstawy od zera', pages: '—', min: 15,
  lead: 'Wszystko, co trzeba umieć, żeby czytać resztę. Bez zakładania, że cokolwiek pamiętasz ze szkoły.',
  blocks: [
    BOX('plain', 'Najważniejsza rzecz', T`Analiza wygląda strasznie głównie przez <b>zapis</b> (dużo dziwnych symboli). Same pomysły są proste i prawie wszystkie da się powiedzieć zwykłym językiem. W tym kursie zawsze najpierw dostaniesz pomysł po ludzku, a dopiero potem „matematyczny” zapis. Jeśli symbole Cię zmęczą, wracaj do ramek „Na chłopski rozum”.`),
    H2('1. Ciąg to lista liczb z numerami'),
    P(T`<b>Ciąg</b> to po prostu lista liczb ustawionych w kolejności: pierwsza, druga, trzecia… Zapisujemy ją jako $a_1,a_2,a_3,\dots$, a ogólnie $a_n$ — „liczba o numerze $n$”.`),
    P(T`Przykład: $a_n=\dfrac1n$ to lista $1,\ \tfrac12,\ \tfrac13,\ \tfrac14,\dots$. Numer 5 to $a_5=\frac15$. Wyrazy robią się coraz mniejsze i zbliżają się do zera, choć nigdy go nie dotykają.`),
    P(T`Drugi przykład: $a_n=(-1)^n$ to $-1,\ 1,\ -1,\ 1,\dots$ — liczba na zmianę „skacze” (minus jeden do potęgi parzystej to $1$, do nieparzystej to $-1$).`),
    WIDGET('pSeq', 'Pobaw się ciągiem'),
    H2('2. Wartość bezwzględna to odległość'),
    BOX('plain', 'Na chłopski rozum', T`Zapis $|x|$ znaczy: „jak daleko liczba $x$ jest od zera”, bez patrzenia na znak. $|5|=5$ i $|-5|=5$.<br>A zapis $|a-b|$ znaczy: „jak daleko od siebie są $a$ i $b$ na osi liczbowej”. Np. $|7-3|=4$, $|3-7|=4$.`),
    P(T`To jest klucz do całego kursu: napis $|a_n-a|\lt0{,}01$ czytaj po prostu: <b>„wyraz $a_n$ jest bliżej niż $0{,}01$ od liczby $a$”</b>.`),
    WIDGET('pAbs', 'Odległość na osi liczbowej'),
    H2('3. Co znaczy „blisko” i skąd literka ε'),
    P(T`Matematycy nie lubią słowa „blisko”, bo jest nieprecyzyjne. Zamiast tego mówią: „bliżej niż $\varepsilon$” (czytaj: epsilon). To po prostu <b>jakaś mała dodatnia liczba, tolerancja</b>, np. $0{,}1$ albo $0{,}0001$. Im mniejsze $\varepsilon$, tym trudniejszy test „bądź blisko”.`),
    P(T`Literka $N$ to z kolei <b>numer w ciągu</b>, po którym coś już zawsze jest prawdą (np. „od 8. wyrazu w górę wszystkie są blisko”).`),
    H2('4. Symbole, które będą się powtarzać'),
    RAW(`<div class="scroll-x"><table class="t"><tr><th>Symbol</th><th>Czytaj</th><th>Przykład</th></tr>
<tr><td>$\\forall$</td><td>„dla każdego”</td><td>$\\forall_{n\\gt3}$ — dla każdego $n$ większego od $3$</td></tr>
<tr><td>$\\exists$</td><td>„istnieje”</td><td>$\\exists_N$ — istnieje jakiś numer $N$</td></tr>
<tr><td>$\\in$</td><td>„należy do”</td><td>$x\\in\\mathbb R$ — $x$ jest liczbą rzeczywistą</td></tr>
<tr><td>$\\mathbb N$</td><td>liczby naturalne</td><td>$1,2,3,\\dots$</td></tr>
<tr><td>$\\mathbb R$</td><td>wszystkie liczby (rzeczywiste)</td><td>$-3,\\ 0,\\ \\tfrac12,\\ \\sqrt2,\\ \\pi\\dots$</td></tr>
<tr><td>$\\Rightarrow$</td><td>„z tego wynika”</td><td>$x\\gt2\\Rightarrow x\\gt1$</td></tr>
<tr><td>$\\iff$</td><td>„wtedy i tylko wtedy” (to samo, powiedziane inaczej)</td><td>$x\\gt2\\iff x-2\\gt0$</td></tr>
<tr><td>$\\to$</td><td>„zmierza do”, „dąży do”</td><td>$a_n\\to0$ — wyrazy zbliżają się do zera</td></tr>
<tr><td>$\\infty$</td><td>nieskończoność (nie liczba, tylko „bez końca”)</td><td>$a_n\\to\\infty$ — rośnie bez ograniczeń</td></tr>
<tr><td>$\\lim$</td><td>granica (z łaciny „limes”, czyli „kres”)</td><td>$\\lim a_n=2$ — ciąg zmierza do $2$</td></tr>
<tr><td>$\\le,\\ \\ge$</td><td>„mniejsze lub równe”, „większe lub równe”</td><td>$-1\\le\\sin x\\le1$</td></tr></table></div>`),
    BOX('plain', 'Jak czytać „długie” zdania z ∀ i ∃', T`Czytaj od lewej do prawej, jak zwykłe zdanie. Np.
$$\forall_{\varepsilon\gt0}\ \exists_{N}\ \forall_{n\gt N}\ |a_n-a|\lt\varepsilon$$
znaczy: „Dla każdej (nawet bardzo małej) tolerancji $\varepsilon$ da się znaleźć taki numer $N$, że wszystkie wyrazy po numerze $N$ są bliżej niż $\varepsilon$ od $a$.”`),
    H2('5. Podręczny słownik działań'),
    RAW(`<div class="scroll-x"><table class="t"><tr><th>Co</th><th>Co to znaczy po ludzku</th><th>Przykład</th></tr>
<tr><td>potęga $a^n$</td><td>$a$ pomnożone przez siebie $n$ razy</td><td>$2^5=2\\cdot2\\cdot2\\cdot2\\cdot2=32$</td></tr>
<tr><td>pierwiastek $\\sqrt[n]{a}$</td><td>liczba, która podniesiona do $n$-tej potęgi daje $a$</td><td>$\\sqrt[3]{8}=2$, bo $2^3=8$</td></tr>
<tr><td>silnia $n!$</td><td>mnożymy wszystkie liczby od $1$ do $n$</td><td>$5!=1\\cdot2\\cdot3\\cdot4\\cdot5=120$</td></tr>
<tr><td>suma $\\sum_{k=1}^{n}$</td><td>dodaj wszystkie wyrażenia dla $k=1,2,\\dots,n$</td><td>$\\sum_{k=1}^{3}k^2=1+4+9=14$</td></tr>
<tr><td>logarytm $\\log_q A$</td><td>„do jakiej potęgi trzeba podnieść $q$, żeby dostać $A$”</td><td>$\\log_2 8=3$, bo $2^3=8$</td></tr>
<tr><td>sinus, cosinus, tangens</td><td>stosunki boków w trójkącie prostokątnym; $\\sin x$ i $\\cos x$ zawsze mieszczą się między $-1$ i $1$; $\\operatorname{tg}x=\\frac{\\sin x}{\\cos x}$</td><td>$\\sin0=0$, $\\cos0=1$</td></tr>
<tr><td>liczba $e$</td><td>specjalna liczba, ok. $2{,}718$ (jak $\\pi$, tylko do wzrostu); $\\ln x$ to logarytm o podstawie $e$</td><td>$\\ln e=1$</td></tr>
<tr><td>sufit $\\lceil x\\rceil$</td><td>zaokrąglenie w górę do całkowitej</td><td>$\\lceil3{,}2\\rceil=4$</td></tr></table></div>`),
    P(T`Kąty w analizie zawsze liczymy w <b>radianach</b> (nie w stopniach): $\pi$ radianów to $180^\circ$, czyli $\frac\pi2$ to kąt prosty. Dla małych kątów (np. $0{,}1$ rad) sinus jest prawie równy samemu kątowi — to się później przyda.`),
    H2('6. Funkcja to maszynka'),
    P(T`<b>Funkcja</b> $f$ to maszynka: wrzucasz liczbę $x$, wychodzi liczba $f(x)$. Np. $f(x)=2x+1$: wrzucasz $3$, wychodzi $7$. <b>Wykres</b> to rysunek wszystkich par (wejście, wyjście). <b>Dziedzina</b> to zbiór liczb, które wolno wrzucić (np. dla $\frac1x$ nie wolno wrzucić zera, bo nie dzieli się przez $0$).`),
    P(T`Ciąg to szczególna funkcja: wrzucasz tylko numery $1,2,3,\dots$, a wychodzą wyrazy ciągu.`),
    H2('7. Jak czytać dowody (żeby się nie zablokować)'),
    BOX('plain', 'Praktyczne rady', T`<ol>
<li><b>Dowód to odpowiedź na pytanie „dlaczego to prawda?”</b>, a nie magiczne zaklęcie do wykucia. Najpierw przeczytaj <i>co</i> twierdzenie mówi (po ludzku), a dopiero potem <i>dlaczego</i>.</li>
<li>Na kolokwium zwykle liczą się <b>zadania z granic</b> i znajomość <b>twierdzeń</b> (co zakładamy, co wynika). Dowody najważniejszych twierdzeń dobrze rozumieć, ale to zadania przynoszą punkty.</li>
<li>Jeśli krok dowodu jest niejasny, odkryj tylko jeden krok, zamknij oczy i zapytaj: „skąd się to wzięło?”. Potem sprawdź.</li>
<li>Zadania z granic to głównie <b>kilka trików</b> (dzielenie przez najwyższą potęgę, twierdzenie o trzech ciągach, ważne granice, liczba $e$). Każdy trik ma w tym kursie własną lekcję.</li>
</ol>`),
    CHECK([
      Q(T`Zapis $|a_n-a|\lt0{,}01$ czytamy:`, ['wyraz aₙ jest mniejszy od 0,01', 'wyraz aₙ jest bliżej niż 0,01 od liczby a', 'a jest mniejsze od 0,01', 'różnica jest równa 0,01'], 1, T`$|a_n-a|$ to odległość między $a_n$ i $a$.`),
      Q(T`Ile wynosi $|-4|$?`, ['−4', '4', '0', '16'], 1, 'Wartość bezwzględna to odległość od zera, więc zawsze nieujemna.'),
      Q(T`Co znaczy $\forall_{n\gt5}$?`, ['dla każdego n większego od 5', 'istnieje n większe od 5', 'dla n równego 5', 'dla każdego n mniejszego od 5'], 0, T`$\forall$ to „dla każdego”.`),
      Q(T`Ile wynosi $\log_2 8$?`, ['2', '3', '4', '8'], 1, T`Bo $2^3=8$ — to „do jakiej potęgi podnieść $2$, by dostać $8$”.`),
      Q(T`Ile to $4!$?`, ['4', '10', '24', '16'], 2, T`$1\cdot2\cdot3\cdot4=24$.`),
    ]),
  ],
};
LESSONS.unshift(L0);
LESSON_BY_ID.l0 = L0;

// Interaktywne wizualizacje dołączane do ramki „Na chłopski rozum” w danej lekcji: [nazwa widżetu, tytuł].
const PLAIN_W = {
  l1: [['pDoor', 'Droga do drzwi: ile kroków do tolerancji?']],
  l2: [['pKor', 'Korytarz między dwiema ścianami']],
  l3: [['pDom', 'Który składnik się liczy? Pokrętło głośności']],
  l4: [['pRace', 'Wyścig: wielomian, wykładnicza, silnia · kserokopiarka']],
  l5: [['pBern', 'Procent składany kontra prosty'], ['pRoot', 'Pierwiastki zbliżają się do 1']],
  l6: [['pLokata', 'Lokata, która „zaprowadziła” nas do liczby e']],
  l7: [['pCal', 'Wędrowiec się uspokaja']],
  l8: [['pBieg', 'Dwóch biegaczy: drogi kontra prędkości']],
  l9: [['pDziura', 'Dziura w drodze — wszystkie ścieżki prowadzą na tę samą wysokość']],
  l10: [['pDwie', 'Dwie ścieżki, dwa różne cele']],
  l11: [['pSum', 'Granica „rozumie” działania']],
  l12: [['pSin', 'Lupa: sin x i x się zlewają']],
  l13: [['pMasz', 'Dwie maszynki w rzędzie']],
  l14: [['pOlowek', 'Czy da się narysować bez odrywania ołówka?']],
  l15: [['pCztery', 'Cztery typy „zepsutych” miejsc']],
  l16: [['pLustro', 'Funkcja odwrotna to lustro']],
  l17: [['pGory', 'Spacer po górach: najwyższy i najniższy punkt']],
  l18: [['pZiemia', 'Spod ziemi na powierzchnię']],
};

// Proste wyjaśnienie pokazywane na górze każdej lekcji.
const PLAIN = {
  l1: T`<p><b>Granica ciągu to „dokąd ciąg zmierza”.</b> Wyobraź sobie, że idziesz do drzwi, ale w każdym kroku pokonujesz połowę pozostałej drogi: 1 m, potem 0,5 m, 0,25 m… Nigdy formalnie nie dotkniesz drzwi, ale po pewnym czasie jesteś <i>tak blisko, jak tylko zechcesz</i>. Te drzwi to granica.</p>
<p><b>Skąd ε i N?</b> To „gra z kolegą”: kolega mówi „bądź bliżej niż 1 cm”, a Ty odpowiadasz „od 7. kroku jestem”. Potem mówi „bądź bliżej niż 1 mm” — a Ty znowu znajdujesz jakiś krok. Jeśli zawsze potrafisz odpowiedzieć, drzwi są granicą.</p>
<p><b>Uwaga o „&lt;” i „≤”:</b> dwoje ludzi idzie do tych samych drzwi, ale jedna osoba zawsze jest o krok przed drugą. W każdej chwili jest „bliżej” (ostra nierówność), a jednak obie dojdą do tego samego miejsca (granice równe). Dlatego z „zawsze mniejsze” wychodzi tylko „w granicy mniejsze lub równe”.</p>`,
  l2: T`<p><b>Zasada kanapki (albo „dwóch policjantów”).</b> Idziesz korytarzem między dwiema ścianami, które z każdym metrem zbliżają się do siebie i w końcu schodzą się w jednym punkcie. Nie musisz wiedzieć, jak dokładnie się poruszasz — skoro jesteś zawsze między ścianami, to też dojdziesz do tego punktu.</p>
<p><b>Po co to?</b> Gdy w ciągu jest „bałagan” (np. sin n, które skacze bez ładu), wykorzystujemy jedyną rzecz, jaką o nim wiemy: że jest między −1 a 1. Zastępujemy go raz najmniejszą, raz największą możliwą wartością — i dostajemy dwie ściany, które umiemy policzyć.</p>`,
  l3: T`<p><b>Granica „rozumie” dodawanie, mnożenie i dzielenie.</b> Jeśli jeden ciąg zmierza do 3, a drugi do 2, to ich suma zmierza do 5, a iloczyn do 6. Dokładnie tak, jak byś się spodziewała — tylko trzeba uważać, by granice były zwykłymi liczbami, a przy dzieleniu mianownik nie zmierzał do 0.</p>
<p><b>Trik „dziel przez najwyższą potęgę”.</b> Weź ułamek (3n²+1)/(n²−5) i wstaw n=1000: wychodzi 3 000 001 / 999 995. Ten „+1” i „−5” to pyłki przy tak wielkich liczbach. Liczy się tylko najsilniejszy składnik: 3n² kontra n², czyli 3 do 1. Dzielenie przez n² to sprytny sposób, by to „zobaczyć” i uczciwie uzasadnić.</p>
<p><b>Ograniczony razy znikający.</b> Pokrętło głośności kręci się tylko od 0 do 10 (ograniczone), a suwak wzmocnienia zbliża się do zera. Bez względu na to, jak kręcisz pokrętłem, głośność i tak zanika. Dlatego (−1)ⁿ/n → 0.</p>`,
  l4: T`<p><b>qⁿ to „mnożenie przez to samo q raz za razem”.</b> Jeśli q to 0,9 (pomniejszasz o 10% w każdym kroku) — liczba kurczy się do zera. Jeśli q=2 — podwajasz, więc rośnie bez końca. Dla q=1 nic się nie zmienia. Dla q=−1 co krok zmieniasz znak, więc „migasz” między 1 i −1 i nigdzie nie lądujesz.</p>
<p><b>Silnia kontra potęga: wyścig.</b> n! to 1·2·3·…·n, czyli za każdym razem mnożysz przez <i>większą</i> liczbę. A aⁿ to mnożenie za każdym razem przez to samo a. Prędzej czy później mnożenie przez rosnące liczby wygrywa. Z kolei aⁿ zostawia w tyle zwykłe wielomiany (jak n¹⁰) — bo mnożenie wygrywa z dodawaniem. Dlatego: wielomian &lt; wykładnicza &lt; silnia, a ułamek, gdzie „szybszy” jest na dole, idzie do zera.</p>`,
  l5: T`<p><b>ⁿ√a to „liczba, która podniesiona n razy daje a”.</b> Gdy n jest ogromne, wystarczy odrobinę powyżej 1, żeby po tylu mnożeniach urosnąć do a. Np. 1,0001 do potęgi 10 000 to już ok. 2,7. Dlatego ⁿ√a ląduje coraz bliżej 1. To samo z ⁿ√n.</p>
<p><b>Nierówność Bernoulliego</b> to jak oprocentowanie: lokata ze „składaniem odsetek” (1+x)ⁿ jest co najmniej tak dobra jak lokata, w której odsetki liczą się tylko od wpłaty początkowej (1+nx). Procent składany nigdy nie przegrywa z prostym — a dzięki temu mamy prosty „sufit” dla ciągu pierwiastków.</p>`,
  l6: T`<p><b>Skąd się wzięła liczba e: lokata bankowa.</b> Wpłacasz 1 zł na 100% rocznie. Jeśli odsetki doliczą Ci raz w roku, będzie 2 zł. Jeśli co miesiąc (po 1/12 odsetek) — ok. 2,613 zł. Co dzień — 2,7146 zł. Co sekundę — ok. 2,71828 zł. Im częściej dopisują odsetki, tym więcej, ale wynik nie rośnie bez końca: dąży do liczby e ≈ 2,71828.</p>
<p><b>(1 + c/n)ⁿ</b> to ta sama lokata, tylko z oprocentowaniem c zamiast 100%. Wychodzi e<sup>c</sup>. To znaczy: „to, co jest w nawiasie przy 1/n, ląduje w wykładniku e”. Reszta lekcji to pokazanie, jak dowolne podobne wyrażenie doprowadzić do tej postaci.</p>`,
  l7: T`<p><b>Ciąg „się uspokaja”.</b> Wyobraź sobie wędrowca, który coraz mniej się rusza: od pewnej chwili wszystkie jego kolejne pozycje są nawzajem bardzo blisko siebie. Nawet jeśli nie widzisz celu, wiesz, że gdzieś się zatrzyma. To właśnie mówi warunek Cauchy’ego: ciąg jest zbieżny dokładnie wtedy, gdy jego wyrazy od pewnego miejsca są dowolnie blisko <i>siebie nawzajem</i>.</p>
<p><b>Po co to?</b> Czasem nie umiesz zgadnąć granicy. Wtedy zamiast „czy ciąg jest blisko celu?” pytasz „czy ciąg przestał się szarpać?”. W przykładzie z notatek dodajemy coraz mniejsze kawałki (cos k/3ᵏ — każdy co najwyżej 3 razy mniejszy od poprzedniego), więc wynik prawie się już nie zmienia.</p>`,
  l8: T`<p><b>Zamiast całej drogi patrz na prędkość.</b> Dwóch biegaczy: b_n to przebyta droga pierwszego, a_n drugiego. Ciekawi nas stosunek dróg b_n/a_n. Twierdzenie Stolza mówi: zamiast tego zerknij na stosunek ich <i>prędkości</i> (przyrostów: ile przebiegli w ostatnim kroku). Jeśli stosunek prędkości się ustabilizuje, to i stosunek całych dróg ustabilizuje się w to samo miejsce.</p>
<p><b>Uwaga:</b> w drugą stronę to nie działa. Stosunek całych dróg może się ustabilizować, nawet gdy stosunek prędkości „szaleje” w górę i w dół — taki przykład masz w notatkach.</p>`,
  l9: T`<p><b>Granica funkcji = „co funkcja robi tuż obok punktu”</b> (a nie co robi w samym punkcie). Wyobraź sobie drogę z dziurą w jednym miejscu. Nie możesz stanąć w dziurze, ale widzisz, że droga prowadzi dokładnie do tej wysokości. Granica opisuje właśnie tę „wysokość, do której droga prowadzi”.</p>
<p><b>Dwa sposoby, żeby to sprawdzić:</b></p>
<ul><li><b>Heine:</b> podejdź do dziury dowolną ścieżką (dowolnym ciągiem punktów). Jeśli każda ścieżka kończy na tej samej wysokości — to jest granica.</li>
<li><b>Cauchy (ε–δ):</b> to „gra z kolegą”. Kolega mówi: „chcę, żebyś trafiła w wysokość z dokładnością ε”. Ty odpowiadasz: „to stań bliżej niż δ od punktu”. Jeśli na każde ε masz odpowiedź δ — granica istnieje.</li></ul>`,
  l10: T`<p><b>Granica nie istnieje, gdy dwie ścieżki prowadzą do różnych miejsc.</b> Wyobraź sobie rozdroże: idziesz do niego z dwóch stron i w obu przypadkach „widać” inny cel. Jeśli granica miałaby istnieć, to cel musiałby być jeden, niezależnie od tego, którędy idziesz. Wystarczy więc znaleźć <i>dwie ścieżki z dwoma różnymi wynikami</i>, żeby pokazać, że granicy nie ma. To jedyny trik, który tu stosujemy — poznasz go na trzech przykładach.</p>`,
  l11: T`<p><b>Granice jednostronne to „podchodzę z lewej” i „podchodzę z prawej”.</b> Wyobraź sobie schody: z lewej strony stoisz na niższym stopniu, z prawej na wyższym. Z każdej strony widać „swoją” podłogę, ale obie są różne — nie da się powiedzieć, jaka jest <i>jedna</i> wysokość w punkcie krawędzi.</p>
<p>Jeśli z lewej i z prawej dochodzisz do tej samej wysokości — masz granicę „normalną” (obustronną). A jeśli dodatkowo w samym punkcie funkcja ma tę właśnie wysokość — nie ma dziury ani skoku, czyli funkcja jest ciągła.</p>`,
  l12: T`<p><b>To jest „lista przepisów”, które warto znać.</b> Nie musisz zapamiętywać dowodów, a wartości i zastosowania. Kilka z nich ma sensowne wyjaśnienie bez wzorów:</p>
<ul><li><b>sin x / x → 1:</b> dla bardzo małego kąta (w radianach) sinus jest <i>prawie równy kątowi</i>. Np. sin(0,1) ≈ 0,0998. Ich stosunek jest więc prawie 1.</li>
<li><b>(1 + x)^(1/x) → e:</b> to ta sama lokata co w lekcji o e, tylko zapisana „od drugiej strony”.</li>
<li><b>(aˣ − 1)/x → ln a</b> i <b>log(1+x)/x → 1/ln a:</b> opisują „tempo wzrostu” funkcji wykładniczej i logarytmu tuż przy zerze.</li></ul>
<p>Dowód geometryczny sin x / x pokazuje, że trzy pola: trójkąt ≤ wycinek koła ≤ większy trójkąt — a gdy kąt jest malutki, wszystkie trzy prawie się pokrywają.</p>`,
  l13: T`<p><b>Funkcja złożona to dwie maszynki połączone w rząd.</b> Liczba wchodzi do maszynki f, to, co wyjdzie, wchodzi do maszynki g. Granica złożenia to „podstawienie”: policz, do czego zmierza wyjście z f, i sprawdź, co robi g w pobliżu tej wartości.</p>
<p><b>Warunek, by złożenie istniało:</b> wszystko, co wypluwa pierwsza maszynka, musi pasować do wejścia drugiej. Pierwiastek (g) nie przyjmie liczb ujemnych — więc jeśli f potrafi je wyprodukować, złożenie nie zadziała na całej dziedzinie.</p>
<p><b>Dlaczego f(x) ≠ y₀?</b> Bo w samym punkcie y₀ funkcja g może mieć „dziwną” wartość (dziurę). Granica ma tego punktu nie dotykać.</p>`,
  l14: T`<p><b>Ciągła funkcja = taka, którą narysujesz bez odrywania ołówka.</b> Żadnej dziury, żadnego skoku, żadnej przepaści. Formalnie: w punkcie x₀ wartość funkcji jest dokładnie taka, do jakiej funkcja „zmierza” z obu stron.</p>
<p><b>Dobra wiadomość:</b> prawie wszystkie „porządne” funkcje ze szkoły są ciągłe — wielomiany, sinus, cosinus, funkcje wykładnicze, a ułamki (np. 1/x, tg x) są ciągłe wszędzie tam, gdzie nie dzielimy przez zero. Suma, różnica i iloczyn funkcji ciągłych zachowują ciągłość, więc nie musisz sprawdzać ciągłości od początku w każdym zadaniu.</p>`,
  l15: T`<p><b>Cztery rodzaje „zepsutych” miejsc na wykresie:</b></p>
<ul><li><b>dziura</b> (usuwalna): wykres idzie gładko, ale jednego punktu brakuje albo jest przesunięty; wystarczy go „załatać”;</li>
<li><b>skok</b>: z lewej i z prawej wykres kończy się na różnych wysokościach (jak stopień schodów);</li>
<li><b>przepaść</b> (jak 1/x przy zerze): wykres ucieka w nieskończoność;</li>
<li><b>szaleństwo</b> (jak sin(1/x) przy zerze): wykres drga coraz szybciej i nie wiadomo, gdzie jest.</li></ul>
<p>Dziura i skok to nieciągłości <b>I rodzaju</b> (granice jednostronne to normalne liczby), przepaść i szaleństwo to nieciągłości <b>II rodzaju</b>.</p>`,
  l16: T`<p><b>Funkcja odwrotna to „maszynka działająca w drugą stronę”</b>, np. dla 2ˣ odwrotnością jest log₂ x. Wykresy są swoim lustrzanym odbiciem względem ukośnej prostej y = x. Skoro oryginał jest „bez rozerwań”, to i odbicie jest bez rozerwań.</p>
<p><b>Wnoszenie granicy pod funkcję ciągłą.</b> Jeśli maszynka g nie ma skoków, to mała zmiana wejścia daje małą zmianę wyjścia. Dlatego zamiast liczyć granicę z całej złożonej konstrukcji, możesz najpierw policzyć granicę wejścia, a potem je wrzucić do g. Np. e<sup>sin x / x</sup>: wejście zmierza do 1, więc wynik to e¹ = e.</p>`,
  l17: T`<p><b>Spacer po górach z płotem.</b> Wędrujesz ścieżką od punktu a do punktu b (oba końce dozwolone, ścieżka bez przerw i skoków). Wtedy na pewno gdzieś jest <i>najwyższy</i> i <i>najniższy</i> punkt trasy, w których faktycznie możesz stanąć.</p>
<p><b>Dlaczego każde założenie jest ważne:</b> gdyby koniec ścieżki był „otwarty” (do punktu b możesz dochodzić, ale nie stanąć w nim), to szczyt mógłby być właśnie tam, a nie możesz tam być. Gdyby ścieżka miała przerwę lub skok — szczyt mógłby się „zapaść” w nieosiągalne miejsce. Przykłady „NIE” z notatek pokazują dokładnie takie sytuacje.</p>`,
  l18: T`<p><b>Nie da się przejść spod ziemi na powierzchnię bez przekroczenia poziomu zero.</b> Jeśli na początku trasy jesteś pod ziemią (wartość ujemna), a na końcu nad ziemią (dodatnia), a Twoja ścieżka nie ma skoków (ciągła), to gdzieś musisz przejść dokładnie przez poziom 0. Zero funkcji to właśnie rozwiązanie równania f(x)=0.</p>
<p><b>Po co?</b> Dzięki temu można <i>udowodnić, że równanie ma rozwiązanie</i>, nawet jeśli nie umiesz go wyliczyć — jak w przykładzie 3ˣ = 9x. A bisekcja z widżetu to metoda, jak je krok po kroku wyśledzić: dziel odcinek na pół i bierz tę połowę, na której funkcja nadal zmienia znak.</p>`,
};
