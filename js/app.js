/**
 * Main Application Controller – Alles Zucker! Interaktive Medienstation
 * Coordinates all 5 stations, View Transitions with focus routing, DE/EN live i18n,
 * history back/forward navigation, glossary native <dialog>, pointer-capture drag & drop,
 * and screen-reader announcements.
 */
(function () {
  'use strict';

  const { Stereo, SugarData, Structures, EnzymeLab, PolyPuzzle } = window.ZuckerWelt;

  const UI_COPY = {
    de: {
      siteTitle: 'Alles Zucker! Interaktive Medienstation',
      cloudTitle: 'Zucker – Es gibt viel mehr, als nur den Einen ...',
      allFilter: 'Alle',
      searchPlaceholder: 'Zucker suchen …',
      pauseCloud: 'Bewegung pausieren',
      playCloud: 'Bewegung starten',
      switchToList: 'Als übersichtliche Liste anzeigen',
      switchToCloud: 'Als schwebende Wortwolke anzeigen',
      typeLabel: 'Typ:',
      bondLabel: 'Verbindung über:',
      buildingBlockLabel: 'Kettenförmiger Zucker aus:',
      monomerInfoLabel: 'Chemische Klasse:',
      formulaLabel: 'Summenformel:',
      openInStereo: 'Im C-Dreher interaktiv drehen ↻',
      backToCloud: '← Zurück zur Zucker-Wolke',
      viewFormulaChain: 'Ketten-/Strukturformel',
      viewAlphaRing: 'α-Ringform (Haworth)',
      viewBetaRing: 'β-Ringform (Haworth)',
      stereoTitleAldose: (n) => `Aldosen mit ${n} Kohlenstoff Atomen`,
      stereoTitleKetose: (n) => `Ketosen mit ${n} Kohlenstoff Atomen`,
      stereoLead: 'An den markierten Kohlenstoffatomen macht es einen großen Unterschied, ob das "OH" nach links oder rechts zeigt.',
      stereoSpeech: 'Dreh ein C und schau was passiert!',
      aldosesLabel: 'Aldosen',
      ketosesLabel: 'Ketosen',
      flipMirrorBtn: 'Spiegelbild (Enantiomer) erzeugen',
      toggleRingPreview: 'Haworth-Ringform ein-/ausblenden',
      openProfileBtn: 'Steckbrief öffnen →',
      relationToRef: (ref) => `Vergleich zu ${ref}:`,
      flipCBtn: (c) => `C${c} drehen`,
      enzymeTitle: 'Enzyme – Wer knackt welchen Zucker?',
      enzymeLead: 'Stärke liefert uns Energie, Zellulose nicht – obwohl beide aus reiner Glucose bestehen! Entscheidend ist das Schlüssel-Schloss-Prinzip.',
      enzymeSpeech: 'Schlüssel & Schloss im Takt: Schau dem Enzym beim Schneiden zu!',
      substrateHeading: '1. Zuckerkette (Schlüssel)',
      enzymeHeading: '2. Enzym (Schloss & Schere)',
      lactoseToggle: 'Laktoseintoleranz simulieren (Laktase fehlt)',
      runEnzymeBtn: 'Reaktion starten ▶',
      replayEnzymeBtn: 'Erneut abspielen ↻',
      pauseEnzymeBtn: 'Pause ⏸',
      resumeEnzymeBtn: 'Weiter ▶',
      slowMoBtn: 'Zeitlupe 0,5×',
      enzymeSteps: ['1. Annäherung', '2. Schlüssel-Schloss', '3. Schnitt / Konflikt', '4. Ergebnis'],
      bondsCutCounter: (cut, total) => `Bindungen gespalten: ${cut} / ${total}`,
      statusMatched: 'Schlüssel passt · Hydrolyse aktiv',
      statusMismatch: 'Kein Passen · Sterischer Konflikt',
      statusIntol: 'Laktase fehlt · Darmpassage',
      colonLabel: 'Dickdarm (Bakterien → H₂ / CO₂)',
      puzzleTitle: 'Unendliche Möglichkeiten',
      puzzleP1: 'Es gibt nicht nur einen Zucker, sondern eine ganze Menge davon!',
      puzzleP2: 'Einen einzelnen Zucker nennt man Einfachzucker oder Monosaccharid. Monosaccharide können sich miteinander zu größeren Molekülen verbinden. Sie sind die Bausteine der Zucker.',
      puzzlePrompt: 'Baue das Polysaccharid nach!\nZiehe die Moleküle an die richtige Stelle:',
      puzzleLevelLabel: 'Polysaccharid-Bauplan:',
      puzzleProgress: (f, t) => `Bausteine platziert: ${f} / ${t}`,
      puzzleSolved: 'Perfekt aufgebaut! Alle Monosaccharide sitzen an der richtigen Position!',
      puzzleHintBtn: 'Nächsten Baustein zeigen',
      puzzleResetBtn: 'Neu starten',
      closeBtn: 'Schließen',
      skipLink: 'Zum Hauptinhalt springen',
      dockStationsNav: 'Stationen',
      dockBack: 'Zurück',
      dockFwd: 'Vorwärts',
      dockStationLabels: {
        cloud: 'Zucker-Wolke & Lexikon',
        profile: 'Zucker-Steckbrief & Ringform',
        stereo: 'C-Dreher: Aldosen und Ketosen',
        enzyme: 'Enzym-Labor & Verdauung',
        puzzle: 'Polysaccharid-Puzzle: Unendliche Möglichkeiten'
      },
      clearSearch: 'Suche löschen',
      sugarCountBadge: (shown, total) => (shown === total ? `${total} Zucker` : `${shown} / ${total} Zucker`),
      emptySearchMsg: 'Kein Zucker gefunden – probiere z. B. „Traubenzucker“, „Birkenzucker“, „Blutgruppe“ oder „Vitamin C“.',
      resetFiltersBtn: 'Filter zurücksetzen',
      fehlingLabel: 'Fehling-Probe:',
      reducingYes: 'Reduzierend (Fehling +)',
      reducingNo: 'Nicht-reduzierend (Fehling −)',
      openInEnzyme: 'Im Enzym-Labor testen ᗧ',
      openInPuzzle: 'Im Baukasten nachbauen 🧩',
      ringGroupLabel: 'Darstellungsform',
      fischerChainBtn: 'Fischer (Kette)',
      ringSize6: '6-Ring (Pyranose)',
      ringSize5: '5-Ring (Furanose)',
      quickStripLabel: 'Bekannte Zucker schnell auswählen',
      stereoisomersBadge: (n) => `${n} Stereoisomere`,
      chiralKbdLabel: 'Kohlenstoffatome per Tastatur drehen',
      presetsLabel: 'Entdecker-Schnellwahl:',
      matchEnzymeBtn: 'Passendes Enzym ✨',
      openSubstrateProfile: 'Steckbrief →',
      enzymePhasesGroup: 'Reaktionsphasen',
      monomerPaletteGroup: 'Monosaccharid-Bausteine',
      puzzleBoardGroup: 'Polysaccharid-Spielfeld',
      slotLabel: (idx, isPent) => `Position ${idx + 1} (${isPent ? 'Fünfring' : 'Sechsring'})`,
      quizBtnLabel: 'Quiz',
      quizBtnAria: 'Interaktives Museums-Quiz öffnen',
      quizTitle: 'Alles Zucker! – Museums-Quiz',
      quizStepBadge: (idx, total, score) => `Frage ${idx + 1} / ${total} · Punkte: ${score}`,
      quizJumpBtn: 'An Station live ausprobieren →',
      quizNextBtn: 'Nächste Frage →',
      quizFinishBtn: 'Ergebnis anzeigen',
      quizRestartBtn: 'Quiz neu starten ↻',
      quizResultHeadline: (score, total) => `Stark! Du hast ${score} von ${total} Fragen richtig gelöst!`,
      quizResultSub: 'Springe jederzeit zurück in die fünf Stationen, um alle Strukturen und Enzyme selbst auszuprobieren.',
      stationNames: {
        cloud: 'Zucker-Wolke',
        profile: 'Zucker-Steckbrief',
        stereo: 'C-Dreher (Aldosen & Ketosen)',
        enzyme: 'Enzym-Labor',
        puzzle: 'Unendliche Möglichkeiten'
      }
    },
    en: {
      siteTitle: 'All About Sugar! Interactive Exhibit',
      cloudTitle: 'Sugar – There is so much more than just the one ...',
      allFilter: 'All',
      searchPlaceholder: 'Search sugars …',
      pauseCloud: 'Pause floating motion',
      playCloud: 'Resume floating motion',
      switchToList: 'Switch to structured list view',
      switchToCloud: 'Switch to floating word cloud',
      typeLabel: 'Type:',
      bondLabel: 'Linked via:',
      buildingBlockLabel: 'Chain built from:',
      monomerInfoLabel: 'Chemical class:',
      formulaLabel: 'Formula:',
      openInStereo: 'Flip carbons in C-Rotator ↻',
      backToCloud: '← Back to Sugar Cloud',
      viewFormulaChain: 'Standard / Chain Formula',
      viewAlphaRing: 'α-Ring (Haworth)',
      viewBetaRing: 'β-Ring (Haworth)',
      stereoTitleAldose: (n) => `Aldoses with ${n} Carbon Atoms`,
      stereoTitleKetose: (n) => `Ketoses with ${n} Carbon Atoms`,
      stereoLead: 'At the highlighted carbon atoms, it makes a huge difference whether the "OH" group points left or right.',
      stereoSpeech: 'Flip a C atom and see what happens!',
      aldosesLabel: 'Aldoses',
      ketosesLabel: 'Ketoses',
      flipMirrorBtn: 'Create mirror image (Enantiomer)',
      toggleRingPreview: 'Toggle Haworth ring view',
      openProfileBtn: 'Open sugar profile →',
      relationToRef: (ref) => `Relation to ${ref}:`,
      flipCBtn: (c) => `Flip C${c}`,
      enzymeTitle: 'Enzymes – Which Key Fits Which Sugar?',
      enzymeLead: 'Starch fuels our body while cellulose passes right through — even though both are pure glucose! Test the lock-and-key principle.',
      enzymeSpeech: 'Watch the Lock-and-Key cut live in action!',
      substrateHeading: '1. Sugar Chain (Key)',
      enzymeHeading: '2. Enzyme (Lock & Shears)',
      lactoseToggle: 'Simulate lactose intolerance (lactase missing)',
      runEnzymeBtn: 'Run reaction ▶',
      replayEnzymeBtn: 'Replay ↻',
      pauseEnzymeBtn: 'Pause ⏸',
      resumeEnzymeBtn: 'Resume ▶',
      slowMoBtn: 'Slow motion 0.5×',
      enzymeSteps: ['1. Approach', '2. Lock & Key', '3. Snip / Clash', '4. Result'],
      bondsCutCounter: (cut, total) => `Bonds cleaved: ${cut} / ${total}`,
      statusMatched: 'Key fits · Active hydrolysis',
      statusMismatch: 'No fit · Steric clash',
      statusIntol: 'Lactase missing · Colon transit',
      colonLabel: 'Colon (Bacteria → H₂ / CO₂)',
      puzzleTitle: 'Infinite Possibilities',
      puzzleP1: 'There is not just one single sugar, but a whole universe of them!',
      puzzleP2: 'A single sugar unit is called a simple sugar or monosaccharide. Monosaccharides link together into vast macromolecules. They are the building blocks of carbohydrates.',
      puzzlePrompt: 'Rebuild the polysaccharide!\nDrag (or click) the molecules into the right spot:',
      puzzleLevelLabel: 'Polysaccharide Blueprint:',
      puzzleProgress: (f, t) => `Monomers placed: ${f} / ${t}`,
      puzzleSolved: 'Masterfully built! Every monosaccharide sits in its exact spot!',
      puzzleHintBtn: 'Fill one hint tile',
      puzzleResetBtn: 'Reset puzzle',
      closeBtn: 'Close',
      skipLink: 'Skip to main content',
      dockStationsNav: 'Stations',
      dockBack: 'Back',
      dockFwd: 'Forward',
      dockStationLabels: {
        cloud: 'Sugar Cloud & Encyclopedia',
        profile: 'Sugar Profile & Ring Forms',
        stereo: 'C-Rotator: Aldoses and Ketoses',
        enzyme: 'Enzyme Lab & Digestion',
        puzzle: 'Polysaccharide Puzzle: Infinite Possibilities'
      },
      clearSearch: 'Clear search',
      sugarCountBadge: (shown, total) => (shown === total ? `${total} sugars` : `${shown} / ${total} sugars`),
      emptySearchMsg: 'No matching sugar found — try "grape sugar", "birch sugar", "blood type", or "Vitamin C".',
      resetFiltersBtn: 'Reset filters',
      fehlingLabel: 'Fehling’s test:',
      reducingYes: 'Reducing (Fehling +)',
      reducingNo: 'Non-reducing (Fehling −)',
      openInEnzyme: 'Test in Enzyme Lab ᗧ',
      openInPuzzle: 'Build in Polysaccharide Puzzle 🧩',
      ringGroupLabel: 'Structural projection',
      fischerChainBtn: 'Fischer (Chain)',
      ringSize6: '6-Ring (Pyranose)',
      ringSize5: '5-Ring (Furanose)',
      quickStripLabel: 'Quick-select prominent sugars',
      stereoisomersBadge: (n) => `${n} Stereoisomers`,
      chiralKbdLabel: 'Flip chiral carbons via keyboard',
      presetsLabel: 'Quick presets:',
      matchEnzymeBtn: 'Pick matching enzyme ✨',
      openSubstrateProfile: 'Profile →',
      enzymePhasesGroup: 'Reaction phases',
      monomerPaletteGroup: 'Monosaccharide building blocks',
      puzzleBoardGroup: 'Polysaccharide assembly board',
      slotLabel: (idx, isPent) => `Slot ${idx + 1} (${isPent ? '5-ring' : '6-ring'})`,
      quizBtnLabel: 'Quiz',
      quizBtnAria: 'Open interactive museum quiz',
      quizTitle: 'All About Sugar! – Museum Quiz',
      quizStepBadge: (idx, total, score) => `Question ${idx + 1} / ${total} · Score: ${score}`,
      quizJumpBtn: 'Try live at station →',
      quizNextBtn: 'Next question →',
      quizFinishBtn: 'Show results',
      quizRestartBtn: 'Restart quiz ↻',
      quizResultHeadline: (score, total) => `Well done! You answered ${score} of ${total} questions accurately!`,
      quizResultSub: 'Jump back into any of the five stations to explore the molecules and enzymes hands-on.',
      stationNames: {
        cloud: 'Sugar Cloud',
        profile: 'Sugar Profile',
        stereo: 'C-Rotator (Stereoisomers)',
        enzyme: 'Enzyme Lab',
        puzzle: 'Infinite Possibilities'
      }
    }
  };

  // Application State
  const state = {
    lang: 'de',
    station: 'cloud', // 'cloud' | 'profile' | 'stereo' | 'enzyme' | 'puzzle'
    cloudMode: 'cloud', // 'cloud' | 'list'
    cloudDrifting: !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    cloudCategory: 'all',
    cloudQuery: '',

    // Station 2: Steckbrief (defaults to Chitin like Image 3!)
    selectedSugarSlug: 'chitin',
    profileRingMode: 'standard', // 'standard' | 'fischer' | 'alpha' | 'beta'
    profileRingSize: null,

    // Station 3: C-Dreher (defaults to Aldosen 6 -> D-Allose like Image 1!)
    stereoClass: 'aldose',
    stereoCarbons: 6,
    stereoDirs: ['R', 'R', 'R', 'R'],
    stereoLastFlipped: -1,
    stereoShowHaworth: false,
    stereoAnomer: 'alpha',
    stereoRingSize: null,

    // Station 4: Enzyme Lab
    enzymeSubstrate: 'staerke',
    enzymeSelected: 'amylase',
    lactoseIntolerant: false,
    enzymePlaying: false,
    enzymeSlowMo: false,
    enzymeElapsedMs: 0,
    enzymeRafId: null,
    enzymeLastTickTs: null,
    enzymeSelectedStep: 1,

    // Station 5: Polysaccharide Puzzle
    puzzleLevelId: 'museum-zellwand',
    selectedTileId: 'hex-cyan',
    puzzlePlacements: PolyPuzzle.createInitialPlacements('museum-zellwand'),
    lastPlacedSlotId: null,
    wrongSlotId: null,

    // Interactive Museum Rallye Quiz
    quizIndex: 0,
    quizAnswers: {},
    quizFinished: false
  };

  // Cross-station mapping tables for Steckbrief -> Enzyme Lab / Puzzle deep links
  const ENZYME_SUBSTRATE_SLUGS = new Set(['staerke', 'zellulose', 'laktose', 'saccharose', 'chitin', 'inulin']);
  const PUZZLE_BLUEPRINT_BY_SLUG = {
    pektin: 'museum-zellwand',
    hemizellulose: 'museum-zellwand',
    glykogen: 'glykogen-speicher',
    staerke: 'glykogen-speicher',
    chitin: 'chitin-murein',
    murein: 'chitin-murein',
    chitosan: 'chitin-murein',
    inulin: 'inulin-raffinose',
    raffinose: 'inulin-raffinose',
    fucose: 'blutgruppen-ab0',
    galaktose: 'blutgruppen-ab0',
    'n-acetylgalactosamin': 'blutgruppen-ab0'
  };

  // Navigation History Stack for `<` and `>` dock buttons
  const historyStack = [{ station: 'cloud', slug: 'chitin' }];
  let historyIndex = 0;

  const stageEl = document.getElementById('museum-stage');
  const announcerEl = document.getElementById('sr-announcer');
  const glossaryDialog = document.getElementById('glossary-dialog');
  const quizDialog = document.getElementById('quiz-dialog');

  function esc(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function announce(msg) {
    if (!announcerEl) return;
    announcerEl.textContent = '';
    window.setTimeout(() => {
      announcerEl.textContent = msg;
    }, 30);
  }

  /**
   * Formats museum-style clickable text with underlined first character (like A̲ldosen, Z̲usammengesetzter Zucker)
   */
  function firstCharUnderline(label) {
    if (!label) return '';
    return `<span class="first-char">${esc(label.charAt(0))}</span>${esc(label.slice(1))}`;
  }

  function pushHistory(station, slug = state.selectedSugarSlug) {
    const current = historyStack[historyIndex];
    if (current && current.station === station && current.slug === slug) return;
    historyStack.splice(historyIndex + 1);
    historyStack.push({ station, slug });
    historyIndex = historyStack.length - 1;
    syncDockControls();
  }

  function transitionRender(mutator, focusHeadingAfter = true) {
    const applyUpdate = () => {
      mutator();
      const dock = document.querySelector && document.querySelector('.museum-dock');
      if (dock && dock.classList) dock.classList.remove('is-dock-hidden');
      if (focusHeadingAfter && typeof window.scrollTo === 'function') {
        window.scrollTo(0, 0);
      }
      renderCurrentStation();
      syncDockControls();
      updateDocumentTitle();
    };

    if (!document.startViewTransition || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      applyUpdate();
      if (focusHeadingAfter) {
        document.getElementById('stage-heading')?.focus({ preventScroll: true });
      }
      return;
    }

    const vt = document.startViewTransition(applyUpdate);
    vt.finished.finally(() => {
      if (focusHeadingAfter) {
        document.getElementById('stage-heading')?.focus({ preventScroll: true });
      }
    });
  }

  let supportsDisplayTransition;
  function canTransitionDisplay() {
    if (supportsDisplayTransition !== undefined) return supportsDisplayTransition;
    if (!window.CSS || typeof window.CSS.supports !== 'function' || !window.CSS.supports('transition-behavior', 'allow-discrete') || !document.body || typeof window.getComputedStyle !== 'function') {
      supportsDisplayTransition = false;
      return false;
    }
    const probe = document.createElement('div');
    probe.style.cssText = 'transition: display 1s allow-discrete !important; display: block;';
    document.body.appendChild(probe);
    window.getComputedStyle(probe).display;
    probe.style.display = 'none';
    supportsDisplayTransition = window.getComputedStyle(probe).display === 'block';
    if (typeof probe.remove === 'function') probe.remove();
    return supportsDisplayTransition;
  }

  function supportsTopLayerExit() {
    return Boolean(window.CSS && typeof window.CSS.supports === 'function' && window.CSS.supports('overlay', 'auto') && canTransitionDisplay());
  }

  async function closeTopLayer(dlg) {
    if (!dlg) return;
    if (!supportsTopLayerExit() && typeof dlg.getAnimations === 'function') {
      dlg.setAttribute('data-closing', '');
      const animations = dlg.getAnimations({ subtree: true });
      if (animations.length > 0) {
        await Promise.race([
          Promise.allSettled(animations.map((a) => a.finished)),
          new Promise((r) => window.setTimeout(r, 400))
        ]);
      }
      dlg.removeAttribute('data-closing');
    }
    dlg.close();
  }

  function syncUrlHash() {
    if (!window.history || typeof window.history.replaceState !== 'function' || !window.location) return;
    try {
      const params = new URLSearchParams();
      params.set('station', state.station);
      if (state.station === 'profile') params.set('sugar', state.selectedSugarSlug);
      if (state.lang !== 'de') params.set('lang', state.lang);
      window.history.replaceState(null, '', `#${params.toString()}`);
    } catch (_) {
      // Ignore file:// restrictions if any
    }
  }

  function restoreFromUrlHash() {
    if (!window.location || !window.location.hash) return;
    try {
      const params = new URLSearchParams(window.location.hash.slice(1));
      const st = params.get('station');
      const sug = params.get('sugar');
      const lg = params.get('lang');
      if (lg === 'en' || lg === 'de') state.lang = lg;
      if (sug && SugarData.getSugarBySlug(sug)) state.selectedSugarSlug = sug;
      if (st && ['cloud', 'profile', 'stereo', 'enzyme', 'puzzle'].includes(st)) {
        state.station = st;
        historyStack[0] = { station: st, slug: state.selectedSugarSlug };
      }
    } catch (_) {
      // Ignore malformed hash
    }
  }

  function updateDocumentTitle() {
    const t = UI_COPY[state.lang];
    let pageTopic = t.stationNames[state.station];
    if (state.station === 'profile') {
      const s = SugarData.getSugarBySlug(state.selectedSugarSlug);
      if (s) pageTopic = state.lang === 'de' ? s.nameDe : s.nameEn;
    } else if (state.station === 'stereo') {
      const info = Stereo.identifyStereoisomer(state.stereoClass, state.stereoCarbons, state.stereoDirs);
      pageTopic = state.lang === 'de' ? info.nameDe : info.nameEn;
    }
    document.title = `${pageTopic} | ${t.siteTitle}`;
    document.documentElement.lang = state.lang;
    syncUrlHash();
  }

  function syncDockControls() {
    const t = UI_COPY[state.lang];
    document.getElementById('btn-lang-de').setAttribute('aria-pressed', String(state.lang === 'de'));
    document.getElementById('btn-lang-en').setAttribute('aria-pressed', String(state.lang === 'en'));

    const skipEl = document.querySelector && document.querySelector('.skip-link');
    if (skipEl) skipEl.textContent = t.skipLink;

    const navEl = document.querySelector && document.querySelector('.dock-stations');
    if (navEl) navEl.setAttribute('aria-label', t.dockStationsNav);

    document.querySelectorAll('.dock-station-btn').forEach((btn) => {
      const st = btn.dataset.station;
      const isCurrent = st === state.station;
      if (isCurrent) {
        btn.setAttribute('aria-current', 'page');
      } else {
        btn.removeAttribute('aria-current');
      }
      if (t.dockStationLabels[st]) {
        btn.setAttribute('aria-label', t.dockStationLabels[st]);
      }
    });

    const backBtn = document.getElementById('btn-nav-back');
    const fwdBtn = document.getElementById('btn-nav-fwd');
    backBtn.setAttribute('aria-disabled', String(historyIndex <= 0));
    backBtn.setAttribute('aria-label', t.dockBack);
    fwdBtn.setAttribute('aria-disabled', String(historyIndex >= historyStack.length - 1));
    fwdBtn.setAttribute('aria-label', t.dockFwd);

    const quizBtn = document.getElementById('btn-open-quiz');
    const quizLbl = document.getElementById('dock-quiz-label');
    if (quizBtn) quizBtn.setAttribute('aria-label', t.quizBtnAria);
    if (quizLbl) quizLbl.textContent = t.quizBtnLabel;
  }

  function openGlossaryModal(key) {
    const entry = SugarData.GLOSSARY[key];
    if (!entry || !glossaryDialog) return;
    document.getElementById('glossary-dialog-title').textContent =
      state.lang === 'de' ? entry.titleDe : entry.titleEn;
    document.getElementById('glossary-dialog-body').textContent =
      state.lang === 'de' ? entry.textDe : entry.textEn;
    document.getElementById('glossary-dialog-close').textContent = UI_COPY[state.lang].closeBtn;
    glossaryDialog.showModal();
  }

  function computeQuizScore() {
    const questions = SugarData.QUIZ_QUESTIONS || [];
    let score = 0;
    for (const q of questions) {
      if (state.quizAnswers[q.id] === q.correctIndex) score++;
    }
    return score;
  }

  function renderQuizModal() {
    if (!quizDialog) return;
    const contentEl = document.getElementById('quiz-dialog-content');
    if (!contentEl) return;
    const t = UI_COPY[state.lang];
    const questions = SugarData.QUIZ_QUESTIONS || [];
    const total = questions.length;
    const score = computeQuizScore();

    if (state.quizFinished || total === 0) {
      contentEl.innerHTML = `
        <div class="quiz-header-row">
          <h1 id="quiz-dialog-title" style="margin-bottom:0">${esc(t.quizTitle)}</h1>
        </div>
        <progress class="museum-progress" value="${score}" max="${Math.max(1, total)}" aria-label="${esc(t.quizTitle)}"></progress>
        <p class="quiz-question-text" style="color:var(--success)">🏆 ${esc(t.quizResultHeadline(score, total))}</p>
        <p>${esc(t.quizResultSub)}</p>
        <div class="quiz-footer-row">
          <button type="button" id="btn-quiz-restart" class="mini-pill">${esc(t.quizRestartBtn)}</button>
          <button type="button" id="btn-quiz-close" class="action-pill">${esc(t.closeBtn)}</button>
        </div>
      `;
      return;
    }

    const q = questions[Math.min(state.quizIndex, total - 1)];
    const chosen = state.quizAnswers[q.id];
    const answered = typeof chosen === 'number';
    const opts = state.lang === 'de' ? q.optionsDe : q.optionsEn;
    const explain = state.lang === 'de' ? q.explainDe : q.explainEn;

    contentEl.innerHTML = `
      <div class="quiz-header-row">
        <h1 id="quiz-dialog-title" style="margin-bottom:0">${esc(t.quizTitle)}</h1>
        <span class="stereo-badge">${esc(t.quizStepBadge(state.quizIndex, total, score))}</span>
      </div>
      <progress class="museum-progress" value="${state.quizIndex + (answered ? 1 : 0)}" max="${total}" aria-label="${esc(t.quizTitle)}"></progress>
      <div class="quiz-question-text">${esc(state.lang === 'de' ? q.qDe : q.qEn)}</div>
      <div class="quiz-options-list" role="group" aria-labelledby="quiz-dialog-title">
        ${opts.map((optText, idx) => {
          let cls = 'quiz-option-btn';
          if (answered) {
            if (idx === q.correctIndex) cls += ' is-correct';
            else if (idx === chosen) cls += ' is-wrong';
          }
          const marker = answered
            ? (idx === q.correctIndex ? '✓' : idx === chosen ? '✗' : String.fromCharCode(65 + idx))
            : String.fromCharCode(65 + idx);
          return `
            <button type="button" class="${cls}" data-quiz-opt="${idx}" ${answered ? 'disabled' : ''}>
              <strong style="color:var(--cyan-title)">${marker}.</strong>
              <span>${esc(optText)}</span>
            </button>
          `;
        }).join('')}
      </div>
      ${answered ? `
        <div class="quiz-feedback-box" role="status">
          <strong style="color:${chosen === q.correctIndex ? 'var(--success)' : 'var(--warning)'}">
            ${chosen === q.correctIndex ? (state.lang === 'de' ? 'Richtig! ' : 'Correct! ') : (state.lang === 'de' ? 'Auflösung: ' : 'Explanation: ')}
          </strong>
          ${esc(explain)}
        </div>
      ` : ''}
      <div class="quiz-footer-row">
        <div style="display:flex;flex-wrap:wrap;gap:0.45rem">
          ${answered && q.jump ? `
            <button type="button" id="btn-quiz-jump" class="mini-pill" style="border-color:var(--cyan-title);color:var(--cyan-title)">
              ${esc(t.quizJumpBtn)}
            </button>
          ` : ''}
          <button type="button" id="btn-quiz-restart" class="mini-pill">${esc(t.quizRestartBtn)}</button>
        </div>
        <div style="display:flex;gap:0.45rem">
          ${answered ? `
            <button type="button" id="btn-quiz-next" class="action-pill" style="background:var(--cyan-strong);border-color:#ffffff">
              ${esc(state.quizIndex + 1 < total ? t.quizNextBtn : t.quizFinishBtn)}
            </button>
          ` : ''}
          <button type="button" id="btn-quiz-close" class="mini-pill">${esc(t.closeBtn)}</button>
        </div>
      </div>
    `;
  }

  function openQuizModal() {
    if (!quizDialog) return;
    renderQuizModal();
    quizDialog.showModal();
  }

  // =========================================================================
  // STATION 1: WORTWOLKE & ZUCKER-KATALOG (Image 2)
  // =========================================================================
  function renderCloudStation() {
    const t = UI_COPY[state.lang];
    const query = state.cloudQuery.trim().toLowerCase();
    const filtered = SugarData.SUGARS.filter((s) => {
      const catMatch = state.cloudCategory === 'all' || s.category === state.cloudCategory;
      if (!catMatch) return false;
      if (!query) return true;
      return (
        s.nameDe.toLowerCase().includes(query) ||
        s.nameEn.toLowerCase().includes(query) ||
        (s.aliases && s.aliases.toLowerCase().includes(query)) ||
        s.formula.toLowerCase().includes(query) ||
        s.linkage.toLowerCase().includes(query) ||
        s.buildingBlocksDe.toLowerCase().includes(query) ||
        s.buildingBlocksEn.toLowerCase().includes(query) ||
        s.descDe.toLowerCase().includes(query) ||
        s.descEn.toLowerCase().includes(query) ||
        s.extraDe.toLowerCase().includes(query) ||
        s.extraEn.toLowerCase().includes(query)
      );
    });

    const catButtons = [
      { id: 'all', label: t.allFilter },
      ...Object.values(SugarData.CATEGORIES).map((c) => ({
        id: c.id,
        label: state.lang === 'de' ? c.shortDe : c.shortEn
      }))
    ];

    const emptyMarkup = filtered.length === 0
      ? `
        <div class="cloud-empty-state" role="status">
          <p>${esc(t.emptySearchMsg)}</p>
          <button type="button" id="btn-reset-cloud-filters" class="action-pill">${esc(t.resetFiltersBtn)}</button>
        </div>
      `
      : '';

    const bodyContent = filtered.length === 0
      ? `<div class="cloud-viewport">${emptyMarkup}${renderCloudCornerButtons(t)}</div>`
      : state.cloudMode === 'cloud'
      ? `
        <div class="cloud-viewport">
          <div class="word-cloud-canvas ${state.cloudDrifting ? 'is-drifting' : ''}">
            ${filtered.map((s, idx) => {
              const label = state.lang === 'de' ? s.nameDe : s.nameEn;
              const [x, y] = s.cloudPos;
              const dx = ((idx % 5) - 2) * 4 + (idx % 2 === 0 ? 5 : -5);
              const dy = ((idx % 4) - 1.5) * 3.5;
              const dur = 11 + (idx % 7) * 1.8;
              const delay = -(idx * 0.7).toFixed(1);
              return `
                <button
                  type="button"
                  class="cloud-word"
                  data-sugar-slug="${esc(s.slug)}"
                  data-weight="${s.weight}"
                  style="left:${x}%; top:${y}%; --dx:${dx}px; --dy:${dy}px; --drift-dur:${dur}s; --drift-delay:${delay}s;"
                >${esc(label)}</button>
              `;
            }).join('')}
          </div>
          ${renderCloudCornerButtons(t)}
        </div>
      `
      : `
        <div class="cloud-viewport is-list-mode">
          <div class="catalog-grid">
            ${filtered.map((s) => {
              const cat = SugarData.CATEGORIES[s.category];
              return `
                <button type="button" class="catalog-card" data-sugar-slug="${esc(s.slug)}">
                  <span class="catalog-card-name">${esc(state.lang === 'de' ? s.nameDe : s.nameEn)}</span>
                  <span class="catalog-card-meta">${esc(state.lang === 'de' ? cat.shortDe : cat.shortEn)} · ${esc(s.linkage)}</span>
                  <span class="catalog-card-formula">${esc(s.formula)}</span>
                </button>
              `;
            }).join('')}
          </div>
          ${renderCloudCornerButtons(t)}
        </div>
      `;

    stageEl.innerHTML = `
      <div class="cloud-header">
        <div style="display:flex;align-items:center;gap:0.75rem;flex-wrap:wrap">
          <h1 id="stage-heading" tabindex="-1" class="station-title" style="margin-bottom:0">${esc(t.cloudTitle)}</h1>
          <span class="cloud-count-badge">${esc(t.sugarCountBadge(filtered.length, SugarData.SUGARS.length))}</span>
        </div>
        <div class="cloud-toolbar">
          ${catButtons.map((b) => `
            <button type="button" class="filter-chip" data-cat-filter="${b.id}" aria-pressed="${state.cloudCategory === b.id}">
              ${esc(b.label)}
            </button>
          `).join('')}
          <div class="search-box">
            <label for="sugar-search" class="visually-hidden">${esc(t.searchPlaceholder)}</label>
            <input
              id="sugar-search"
              type="search"
              class="search-input"
              placeholder="${esc(t.searchPlaceholder)}"
              value="${esc(state.cloudQuery)}"
            />
            ${state.cloudQuery ? `
              <button type="button" id="btn-clear-search" class="search-clear-btn" aria-label="${esc(t.clearSearch)}">×</button>
            ` : ''}
          </div>
        </div>
      </div>
      ${bodyContent}
    `;

    // Attach search input listener without losing focus
    const searchInput = document.getElementById('sugar-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        state.cloudQuery = e.target.value;
        const pos = e.target.selectionStart;
        renderCloudStation();
        const nextInput = document.getElementById('sugar-search');
        if (nextInput) {
          nextInput.focus();
          nextInput.setSelectionRange(pos, pos);
        }
      });
    }
  }

  function renderCloudCornerButtons(t) {
    // Pause button follows modern-web-guidance `motion`: label toggles between Pause and Play WITHOUT aria-pressed!
    const pauseBtn = state.cloudMode === 'cloud'
      ? `
        <button
          type="button"
          id="btn-toggle-drift"
          class="circle-icon-btn"
          aria-label="${esc(state.cloudDrifting ? t.pauseCloud : t.playCloud)}"
        >
          ${state.cloudDrifting
            ? `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9 7v10M15 7v10" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg>`
            : `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9 7l9 5-9 5V7Z" fill="currentColor"/></svg>`
          }
        </button>
      `
      : '';

    // Exact Cloud/List split icon from Image 2 (`cloud_toggle.png`)!
    const toggleLabel = state.cloudMode === 'cloud' ? t.switchToList : t.switchToCloud;
    return `
      <div class="cloud-corner-controls">
        ${pauseBtn}
        <button
          type="button"
          id="btn-toggle-cloud-mode"
          class="circle-icon-btn"
          aria-label="${esc(toggleLabel)}"
        >
          <svg width="30" height="30" viewBox="0 0 36 36" fill="none" aria-hidden="true">
            <!-- Cloud top-left half -->
            <path d="M10.5 21.5a4.2 4.2 0 0 1-.4-8.3 5.5 5.5 0 0 1 10.2-1.8" stroke="currentColor" stroke-width="2.1" stroke-linecap="round"/>
            <!-- Diagonal slash -->
            <line x1="9" y1="28" x2="27" y2="8" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
            <!-- Horizontal list lines bottom-right half -->
            <path d="M19.5 16h7.5M17 20h10M14.5 24h12.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
    `;
  }

  // =========================================================================
  // STATION 2: ZUCKER-STECKBRIEF & RINGFORM (Image 3: Chitin)
  // =========================================================================
  function renderProfileStation() {
    const t = UI_COPY[state.lang];
    const sugar = SugarData.getSugarBySlug(state.selectedSugarSlug) || SugarData.SUGARS[0];
    const cat = SugarData.CATEGORIES[sugar.category];
    const catName = state.lang === 'de' ? cat.de : cat.en;

    const isCompound = sugar.buildingBlockSlugs && sugar.buildingBlockSlugs.length > 0;
    const blockLabel = isCompound ? t.buildingBlockLabel : t.monomerInfoLabel;

    let buildingLinksHtml = '';
    if (isCompound) {
      buildingLinksHtml = sugar.buildingBlockSlugs.map((slug) => {
        const b = SugarData.getSugarBySlug(slug);
        if (!b) return esc(slug);
        const bName = state.lang === 'de' ? b.nameDe : b.nameEn;
        return `<button type="button" class="museum-link" data-sugar-slug="${esc(slug)}">${firstCharUnderline(bName)}</button>`;
      }).join(', ');
    } else {
      buildingLinksHtml = esc(state.lang === 'de' ? sugar.buildingBlocksDe : sugar.buildingBlocksEn);
    }

    const canCyclize = Boolean(sugar.stereoPreset && sugar.stereoPreset.carbons >= 5);
    const effectiveRingMode = !canCyclize
      ? 'standard'
      : state.profileRingMode === 'standard'
      ? (sugar.structureKind === 'haworth' ? 'beta' : 'fischer')
      : state.profileRingMode;

    let structureHtml = '';
    let flohText = '';
    let activeRingSize = null;

    if (canCyclize && (effectiveRingMode === 'alpha' || effectiveRingMode === 'beta')) {
      const { sugarClass, carbons, dirs } = sugar.stereoPreset;
      const model = Stereo.buildHaworthModel(sugarClass, carbons, dirs, effectiveRingMode, state.profileRingSize);
      activeRingSize = model.ringSize;
      structureHtml = Structures.renderHaworthFromModel(model, state.lang);
      flohText = state.lang === 'de' ? model.flohExplanationDe : model.flohExplanationEn;
    } else if (canCyclize && effectiveRingMode === 'fischer') {
      const { sugarClass, carbons, dirs } = sugar.stereoPreset;
      structureHtml = Structures.renderFischerSvg(sugarClass, carbons, dirs, {
        title: state.lang === 'de' ? sugar.nameDe : sugar.nameEn,
        showCarbonNumbers: true
      });
    } else {
      structureHtml = Structures.renderSugarStructure(sugar, state.lang);
    }

    const canTestEnzyme = ENZYME_SUBSTRATE_SLUGS.has(sugar.slug);
    const puzzleBlueprint = PUZZLE_BLUEPRINT_BY_SLUG[sugar.slug] || null;
    const featuredSlugs = [
      'chitin', 'glucose', 'fruktose', 'saccharose', 'trehalose', 'laktose', 'cellobiose',
      'staerke', 'zellulose', 'glykogen', 'hyaluronsaeure', 'pektin', 'inulin', 'xylit',
      'ascorbinsaeure', 'ribose', 'desoxyribose'
    ];

    stageEl.innerHTML = `
      <div class="profile-layout">
        <aside class="profile-sidebar">
          <h1 id="stage-heading" tabindex="-1" class="station-title">${esc(state.lang === 'de' ? sugar.nameDe : sugar.nameEn)}</h1>

          <div class="profile-meta-block">
            <span class="profile-meta-label">${esc(t.typeLabel)}</span>
            <div class="profile-meta-value">
              <button type="button" class="museum-link" data-glossary="${esc(cat.glossaryKey)}">
                ${firstCharUnderline(catName)}
              </button>
            </div>
          </div>

          <div class="profile-meta-block">
            <span class="profile-meta-label">${esc(t.bondLabel)}</span>
            <div class="profile-meta-value">
              ${sugar.linkage.startsWith('—')
                ? esc(sugar.linkage)
                : `<button type="button" class="museum-link" data-glossary="glykosidisch">${esc(sugar.linkage)}</button>`
              }
            </div>
          </div>

          <div class="profile-meta-block">
            <span class="profile-meta-label">${esc(blockLabel)}</span>
            <div class="profile-meta-value">${buildingLinksHtml}</div>
          </div>

          <div class="profile-meta-block">
            <span class="profile-meta-label">${esc(t.formulaLabel)}</span>
            <div class="profile-meta-value" style="display:flex;flex-direction:column;gap:0.42rem">
              <span>${esc(sugar.formula)}</span>
              <button
                type="button"
                class="reducing-badge ${sugar.reducing ? 'is-reducing' : 'is-nonreducing'}"
                data-glossary="reduzierend"
              >
                ${esc(sugar.reducing ? t.reducingYes : t.reducingNo)}
              </button>
            </div>
          </div>

          <div class="profile-actions">
            ${sugar.stereoPreset ? `
              <button type="button" id="btn-jump-stereo" class="action-pill">
                ${esc(t.openInStereo)}
              </button>
            ` : ''}
            ${canTestEnzyme ? `
              <button type="button" id="btn-jump-enzyme" class="action-pill">
                ${esc(t.openInEnzyme)}
              </button>
            ` : ''}
            ${puzzleBlueprint ? `
              <button type="button" id="btn-jump-puzzle" class="action-pill" data-puzzle-blueprint="${esc(puzzleBlueprint)}">
                ${esc(t.openInPuzzle)}
              </button>
            ` : ''}
            <button type="button" id="btn-back-cloud" class="action-pill">
              ${esc(t.backToCloud)}
            </button>
          </div>
        </aside>

        <div class="profile-main">
          <div class="profile-story">
            <p>${esc(state.lang === 'de' ? sugar.descDe : sugar.descEn)}</p>
            <p class="profile-extra">${esc(state.lang === 'de' ? sugar.extraDe : sugar.extraEn)}</p>
          </div>

          <div class="profile-structure-box">
            ${canCyclize ? `
              <div class="ring-toggle-bar" role="group" aria-label="${esc(t.ringGroupLabel)}">
                <button type="button" class="mini-pill" data-ring-mode="fischer" aria-pressed="${effectiveRingMode === 'fischer'}">
                  ${esc(t.fischerChainBtn)}
                </button>
                <button type="button" class="mini-pill" data-ring-mode="alpha" aria-pressed="${effectiveRingMode === 'alpha'}">
                  ${esc(t.viewAlphaRing)}
                </button>
                <button type="button" class="mini-pill" data-ring-mode="beta" aria-pressed="${effectiveRingMode === 'beta'}">
                  ${esc(t.viewBetaRing)}
                </button>
                ${sugar.stereoPreset.carbons === 6 && (effectiveRingMode === 'alpha' || effectiveRingMode === 'beta') ? `
                  <button type="button" class="mini-pill" data-profile-ringsize="6" aria-pressed="${activeRingSize === 6}">
                    ${esc(t.ringSize6)}
                  </button>
                  <button type="button" class="mini-pill" data-profile-ringsize="5" aria-pressed="${activeRingSize === 5}">
                    ${esc(t.ringSize5)}
                  </button>
                ` : ''}
              </div>
            ` : ''}
            ${structureHtml}
            ${flohText ? `<p class="floh-banner">${esc(flohText)}</p>` : ''}
          </div>

          <div class="quick-sugar-strip" role="region" tabindex="0" aria-label="${esc(t.quickStripLabel)}">
            ${featuredSlugs.map((slug) => {
              const item = SugarData.getSugarBySlug(slug);
              if (!item) return '';
              return `
                <button
                  type="button"
                  class="quick-sugar-chip"
                  data-sugar-slug="${esc(slug)}"
                  aria-current="${slug === sugar.slug ? 'true' : 'false'}"
                >${esc(state.lang === 'de' ? item.nameDe : item.nameEn)}</button>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    `;
  }

  // =========================================================================
  // STATION 3: C-DREHER ("Dreh ein C und schau was passiert!" – Image 1)
  // =========================================================================
  function renderCarbonRingButton(sClass, n, isActive) {
    // Renders the exact circle with `n` cyan carbon dots around its perimeter from `aldosen_ketosen.png`!
    const r = 27;
    const cx = 34;
    const cy = 34;
    const dots = [];
    // Match visual dot placement of Image 1 (evenly spaced around the white ring!)
    const startAngle = n === 4 ? -Math.PI / 2 : -Math.PI / 2;
    for (let i = 0; i < n; i++) {
      const angle = startAngle + (i * 2 * Math.PI) / n;
      const dx = (cx + r * Math.cos(angle)).toFixed(1);
      const dy = (cy + r * Math.sin(angle)).toFixed(1);
      dots.push(`<circle cx="${dx}" cy="${dy}" r="3.4" class="carbon-dot" />`);
    }

    const t = UI_COPY[state.lang];
    const label = `${sClass === 'aldose' ? t.aldosesLabel : t.ketosesLabel} ${n} C`;
    return `
      <button
        type="button"
        class="carbon-ring-btn"
        data-stereo-class="${sClass}"
        data-stereo-carbons="${n}"
        aria-pressed="${isActive}"
        aria-label="${label}"
      >
        <svg viewBox="0 0 68 68" aria-hidden="true">
          <circle cx="${cx}" cy="${cy}" r="${r}" class="carbon-ring-circle" />
          ${dots.join('')}
          <text x="${cx}" y="${cy + 6}" text-anchor="middle" class="carbon-ring-num">${n}</text>
        </svg>
      </button>
    `;
  }

  function renderStereoStation() {
    const t = UI_COPY[state.lang];
    const info = Stereo.identifyStereoisomer(state.stereoClass, state.stereoCarbons, state.stereoDirs);
    const title = state.stereoClass === 'aldose'
      ? t.stereoTitleAldose(state.stereoCarbons)
      : t.stereoTitleKetose(state.stereoCarbons);

    const sugarName = state.lang === 'de' ? info.nameDe : info.nameEn;
    const noteText = state.lang === 'de' ? info.note.de : info.note.en;

    // Compare to D-Glucose (for Aldose 6) or D-Fruktose (for Ketose 6) as educational bonus!
    let relationHtml = '';
    if (state.stereoClass === 'aldose' && state.stereoCarbons === 6) {
      const rel = Stereo.compareStereoisomers(state.stereoDirs, ['R', 'L', 'R', 'R'], 2);
      if (rel.type !== 'identical') {
        relationHtml = `<div class="opt-sub">${esc(t.relationToRef('D-Glucose'))} <strong>${esc(state.lang === 'de' ? rel.de : rel.en)}</strong></div>`;
      }
    } else if (state.stereoClass === 'ketose' && state.stereoCarbons === 6) {
      const rel = Stereo.compareStereoisomers(state.stereoDirs, ['L', 'R', 'R'], 3);
      if (rel.type !== 'identical') {
        relationHtml = `<div class="opt-sub">${esc(t.relationToRef('D-Fruktose'))} <strong>${esc(state.lang === 'de' ? rel.de : rel.en)}</strong></div>`;
      }
    }

    const fischerSvg = Structures.renderFischerSvg(state.stereoClass, state.stereoCarbons, state.stereoDirs, {
      interactive: true,
      flippedIndex: state.stereoLastFlipped,
      showCarbonNumbers: true,
      title: `${sugarName} (${info.formula})`
    });

    let haworthPreviewHtml = '';
    if (state.stereoShowHaworth && state.stereoCarbons >= 5) {
      const hModel = Stereo.buildHaworthModel(state.stereoClass, state.stereoCarbons, state.stereoDirs, state.stereoAnomer, state.stereoRingSize);
      haworthPreviewHtml = `
        <div class="stereo-note-card" style="margin-top:0.5rem">
          <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:0.45rem">
            <strong style="color:var(--cyan-title)">${esc(state.lang === 'de' ? hModel.ringNameDe : hModel.ringNameEn)}</strong>
            <div style="display:flex;flex-wrap:wrap;gap:0.3rem">
              <button type="button" class="mini-pill" data-stereo-anomer="alpha" aria-pressed="${state.stereoAnomer === 'alpha'}">α</button>
              <button type="button" class="mini-pill" data-stereo-anomer="beta" aria-pressed="${state.stereoAnomer === 'beta'}">β</button>
              ${state.stereoCarbons === 6 ? `
                <button type="button" class="mini-pill" data-stereo-ringsize="6" aria-pressed="${hModel.ringSize === 6}">6-Ring</button>
                <button type="button" class="mini-pill" data-stereo-ringsize="5" aria-pressed="${hModel.ringSize === 5}">5-Ring</button>
              ` : ''}
            </div>
          </div>
          ${Structures.renderHaworthFromModel(hModel, state.lang)}
        </div>
      `;
    }

    const stereoPresets = [
      { id: 'd-glucose', labelDe: 'D-Glucose', labelEn: 'D-Glucose', cls: 'aldose', n: 6, dirs: 'RLRR' },
      { id: 'd-galaktose', labelDe: 'D-Galaktose (C4)', labelEn: 'D-Galactose (C4)', cls: 'aldose', n: 6, dirs: 'RLLR' },
      { id: 'l-idose', labelDe: 'L-Idose (nur C5!)', labelEn: 'L-Idose (C5 flip!)', cls: 'aldose', n: 6, dirs: 'RLRL' },
      { id: 'd-fruktose', labelDe: 'D-Fruktose', labelEn: 'D-Fructose', cls: 'ketose', n: 6, dirs: 'LRR' },
      { id: 'd-ribose', labelDe: 'D-Ribose (RNA)', labelEn: 'D-Ribose (RNA)', cls: 'aldose', n: 5, dirs: 'RRR' }
    ];

    const linkedSugar = SugarData.getSugarBySlug(info.slug);

    stageEl.innerHTML = `
      <div class="stereo-header-row">
        <div>
          <h1 id="stage-heading" tabindex="-1" class="station-title">${esc(title)}</h1>
          <p class="station-lead">${esc(t.stereoLead)}</p>
        </div>
        <div class="speech-banner">${esc(t.stereoSpeech)}</div>
      </div>

      <div class="stereo-grid">
        <!-- Left: Identified Stereoisomer Name & Chemistry Insight -->
        <div class="stereo-name-panel">
          <h2 class="stereo-sugar-name">${esc(sugarName)}</h2>
          <div class="stereo-note-card">
            <div class="stereo-badge-row">
              <button type="button" class="stereo-badge" data-glossary="epimere">${info.series}-${state.lang === 'de' ? 'Reihe' : 'Series'}</button>
              <span class="stereo-badge">${info.formula}</span>
              <button type="button" class="stereo-badge" data-glossary="epimere">${esc(t.stereoisomersBadge(info.totalStereoisomers))}</button>
            </div>
            <p>${esc(noteText)}</p>
            ${relationHtml}
            <div style="display:flex;flex-wrap:wrap;gap:0.45rem;margin-top:0.35rem">
              <button type="button" id="btn-flip-enantiomer" class="mini-pill">
                ${esc(t.flipMirrorBtn)}
              </button>
              ${state.stereoCarbons >= 5 ? `
                <button type="button" id="btn-toggle-stereo-ring" class="mini-pill" aria-pressed="${state.stereoShowHaworth}">
                  ${esc(t.toggleRingPreview)}
                </button>
              ` : ''}
              ${linkedSugar ? `
                <button type="button" class="mini-pill" data-sugar-slug="${esc(linkedSugar.slug)}">
                  ${esc(t.openProfileBtn)}
                </button>
              ` : ''}
            </div>
            <div class="stereo-preset-bar" role="group" aria-label="${esc(t.presetsLabel)}">
              ${stereoPresets.map((p) => `
                <button
                  type="button"
                  class="preset-chip"
                  data-stereo-preset="${p.cls}:${p.n}:${p.dirs}"
                >${esc(state.lang === 'de' ? p.labelDe : p.labelEn)}</button>
              `).join('')}
            </div>
          </div>
          ${haworthPreviewHtml}
        </div>

        <!-- Center: Interactive Hand-Drawn Fischer Projection -->
        <div class="stereo-molecule-stage">
          ${fischerSvg}
          <div class="chiral-kbd-controls" role="group" aria-label="${esc(t.chiralKbdLabel)}">
            ${info.chiralCarbons.map((c, idx) => `
              <button type="button" class="chiral-kbd-btn" data-flip-index="${idx}">
                ${esc(t.flipCBtn(c.carbonNumber))} (${c.ohSide === 'R' ? 'OH→' : '←HO'})
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Right: Aldosen & Ketosen 4, 5, 6 Selector (Exact Image 1) -->
        <div class="stereo-selector-panel">
          <div class="class-selector-row">
            <button type="button" class="museum-link class-label-btn" data-glossary="aldosen">
              ${firstCharUnderline(t.aldosesLabel)}
            </button>
            <div class="carbon-ring-group">
              ${[4, 5, 6].map((n) => renderCarbonRingButton('aldose', n, state.stereoClass === 'aldose' && state.stereoCarbons === n)).join('')}
            </div>
          </div>

          <div class="class-selector-row">
            <button type="button" class="museum-link class-label-btn" data-glossary="ketosen">
              ${firstCharUnderline(t.ketosesLabel)}
            </button>
            <div class="carbon-ring-group">
              ${[4, 5, 6].map((n) => renderCarbonRingButton('ketose', n, state.stereoClass === 'ketose' && state.stereoCarbons === n)).join('')}
            </div>
          </div>
        </div>
      </div>
    `;

    state.stereoLastFlipped = -1;

    // Enable horizontal swipe-to-flip on chiral C rows for touch / iPad users
    stageEl.querySelectorAll('.fischer-chiral-row').forEach((row) => {
      let startX = null;
      let swiped = false;
      const idx = Number(row.dataset.chiralIndex);
      row.style.touchAction = 'pan-y';
      row.addEventListener('pointerdown', (ev) => {
        startX = ev.clientX;
        swiped = false;
      });
      row.addEventListener('pointermove', (ev) => {
        if (startX === null || swiped) return;
        if (Math.abs(ev.clientX - startX) > 22) {
          swiped = true;
          startX = null;
          flipChiralCenter(idx);
        }
      });
      row.addEventListener('pointerup', () => { startX = null; });
      row.addEventListener('pointercancel', () => { startX = null; });
    });
  }

  // =========================================================================
  // STATION 4: ACTIVE LOCK-AND-KEY ENZYME MOTION-GRAPHIC LAB
  // =========================================================================
  function renderSubstrateMiniIcon(substrate) {
    const isPent = substrate.unitShape === 'pent-white';
    const isSuc = substrate.id === 'saccharose';
    if (isSuc) {
      return `
        <svg class="enzyme-mini-icon" viewBox="-16 -14 32 28" aria-hidden="true">
          <polygon points="-13,0 -9,-7 -2,-7 2,0 -2,7 -9,7" fill="#08aeef" stroke="#bae6fd" stroke-width="1.2"/>
          <polygon points="9,-7 15,-2 13,6 5,6 3,-2" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.2"/>
        </svg>
      `;
    }
    if (isPent) {
      return `
        <svg class="enzyme-mini-icon" viewBox="-14 -14 28 28" aria-hidden="true">
          <polygon points="0,-10 10,-2 6,9 -6,9 -10,-2" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.4"/>
        </svg>
      `;
    }
    const fill =
      substrate.unitShape === 'hex-striped' ? 'url(#museum-stripes)' :
      substrate.unitShape === 'hex-light' || substrate.id === 'laktose' ? '#8bd3f7' : '#08aeef';
    const extra =
      substrate.id === 'zellulose'
        ? '<rect x="-3" y="-12" width="6" height="5" rx="1.5" fill="#e0f2fe"/>'
        : substrate.id === 'chitin'
        ? '<path d="M0,-9 V-13 M-5,-13 H5" stroke="#fde047" stroke-width="2" stroke-linecap="round"/>'
        : substrate.id === 'laktose'
        ? '<circle cx="0" cy="-9" r="3.5" fill="#e0f2fe"/>'
        : '';
    return `
      <svg class="enzyme-mini-icon" viewBox="-14 -15 28 30" aria-hidden="true">
        <polygon points="10,0 5,9 -5,9 -10,0 -5,-9 5,-9" fill="${fill}" stroke="#e2e8f0" stroke-width="1.3"/>
        ${extra}
      </svg>
    `;
  }

  function renderMonomerKeyUnit(substrate, idx) {
    const isPent = substrate.unitShape === 'pent-white' || (substrate.id === 'saccharose' && idx === 1);
    const pts = PolyPuzzle.polygonPoints(isPent ? 'pent' : 'hex', 28);
    const fillClass =
      substrate.unitShape === 'hex-striped' ? 'tile-fill-striped' :
      substrate.unitShape === 'hex-light' || (substrate.id === 'laktose' && idx === 0) ? 'tile-fill-light' :
      isPent ? 'tile-fill-pent' : 'tile-fill-cyan';

    let keyFeatures = '';
    if (substrate.id === 'staerke') {
      // Subtle upright CH2OH tab
      keyFeatures = `<rect x="-7" y="-33" width="14" height="8" rx="3" fill="#bae6fd" stroke="#ffffff" stroke-width="1.2" />`;
    } else if (substrate.id === 'zellulose') {
      // Odd units are flipped 180° with a prominent tall upward C6 ridge!
      if (idx % 2 === 1) {
        keyFeatures = `
          <path d="M -9,-24 L -9,-42 Q 0,-47 9,-42 L 9,-24 Z" fill="#e0f2fe" stroke="#ffffff" stroke-width="1.5" />
          <text x="0" y="-32" text-anchor="middle" fill="#0f172a" font-size="8.5" font-weight="800">180°</text>
        `;
      } else {
        keyFeatures = `<rect x="-6" y="24" width="12" height="7" rx="2.5" fill="#bae6fd" opacity="0.85" />`;
      }
    } else if (substrate.id === 'laktose') {
      if (idx === 0) {
        // Galactose signature axial C4-OH dome peg at top
        keyFeatures = `
          <path d="M -13,-24 C -13,-42 13,-42 13,-24 Z" fill="#bae6fd" stroke="#ffffff" stroke-width="1.5" />
          <text x="0" y="-29" text-anchor="middle" fill="#0f172a" font-size="7.5" font-weight="800">C4-OH</text>
        `;
      } else {
        keyFeatures = `<text x="0" y="4" text-anchor="middle" fill="#0f172a" font-size="9" font-weight="800">Glc</text>`;
      }
    } else if (substrate.id === 'saccharose') {
      keyFeatures = `<text x="0" y="4" text-anchor="middle" fill="#0f172a" font-size="9" font-weight="800">${idx === 0 ? 'Glc' : 'Fru'}</text>`;
    } else if (substrate.id === 'chitin') {
      // Protruding T-shaped –NH–CO–CH3 side arm
      keyFeatures = `
        <line x1="0" y1="-25" x2="0" y2="-40" stroke="#fde047" stroke-width="3.2" stroke-linecap="round" />
        <rect x="-15" y="-46" width="30" height="11" rx="4" fill="#fde047" stroke="#0f172a" stroke-width="1.2" />
        <text x="0" y="-38" text-anchor="middle" fill="#0f172a" font-size="7.5" font-weight="800">NHAc</text>
      `;
    }

    const label =
      substrate.id === 'laktose' && idx === 0 ? 'Gal' :
      substrate.id === 'staerke' || substrate.id === 'zellulose' ? 'Glc' : '';

    return `
      <polygon points="${pts}" class="${fillClass}" />
      ${keyFeatures}
      ${label ? `<text x="0" y="4" text-anchor="middle" fill="#0f172a" font-size="9" font-weight="800">${label}</text>` : ''}
    `;
  }

  function renderEnzymeStageSvg(substrate, enzyme, result, frame) {
    const metrics = EnzymeLab.getLayoutMetrics(substrate);
    const totalBonds = metrics.bondCentersX.length;
    const cy = metrics.chainY;

    // 1. Intact + Cleaved Bond layers between units
    let bondsSvg = '';
    for (let i = 0; i < totalBonds; i++) {
      const lx = metrics.unitCentersX[i];
      const rx = metrics.unitCentersX[i + 1];
      const mx = metrics.bondCentersX[i];
      const by = cy + (substrate.bondYOffset || 0);
      const isCut = frame.bondCutStates[i];

      let bridgeGeom = '';
      if (substrate.bondGeometry === 'alpha-down') {
        bridgeGeom = `<polyline points="${lx + 26},${cy + 4} ${mx},${by} ${rx - 26},${cy + 4}" class="chem-bond chem-accent-bond" fill="none" />`;
      } else if (substrate.bondGeometry === 'beta-zig' || substrate.bondGeometry === 'beta-chitin') {
        bridgeGeom = `<polyline points="${lx + 24},${cy - 6} ${mx},${by} ${rx - 24},${cy - 6}" class="chem-bond-thick" fill="none" />`;
      } else if (substrate.bondGeometry === 'beta-lactose') {
        bridgeGeom = `<polyline points="${lx + 25},${cy - 10} ${mx},${by} ${rx - 25},${cy + 6}" class="chem-bond chem-accent-bond" fill="none" />`;
      } else if (substrate.bondGeometry === 'fructan-beta') {
        bridgeGeom = `<polyline points="${lx + 23},${cy - 6} ${mx},${by} ${rx - 23},${cy + 4}" class="chem-bond chem-accent-bond" fill="none" />`;
      } else {
        bridgeGeom = `<line x1="${lx + 26}" y1="${cy}" x2="${rx - 26}" y2="${cy}" class="chem-bond chem-accent-bond" />`;
      }

      bondsSvg += `
        <g id="enz-bond-${i}" class="enz-bond-group" data-bond-index="${i}">
          <rect x="${mx - 22}" y="${cy - 34}" width="44" height="68" fill="transparent" />
          <g id="enz-bond-intact-${i}" style="opacity:${isCut ? 0 : 1}">
            ${bridgeGeom}
            <circle cx="${mx}" cy="${by}" r="10" fill="#1e293b" stroke="#5cd3ff" stroke-width="1.8" />
            <text x="${mx}" y="${by + 3.5}" text-anchor="middle" fill="#f8fafc" font-size="10.5" font-weight="800">O</text>
          </g>
          <g id="enz-bond-cut-${i}" style="opacity:${isCut ? 1 : 0}">
            <text x="${mx - 15}" y="${cy + 4}" text-anchor="middle" fill="#86efac" font-size="11" font-weight="800">–OH</text>
            <text x="${mx + 16}" y="${cy + 4}" text-anchor="middle" fill="#86efac" font-size="11" font-weight="800">HO–</text>
          </g>
        </g>
      `;
    }

    // 2. Monomer Units
    let unitsSvg = '';
    for (let i = 0; i < substrate.unitCount; i++) {
      const ux = metrics.unitCentersX[i];
      const off = frame.unitOffsets[i] || { dx: 0, dy: 0, rot: 0 };
      unitsSvg += `
        <g id="enz-unit-${i}" transform="translate(${(ux + off.dx).toFixed(1)}, ${(cy + off.dy).toFixed(1)}) rotate(${off.rot.toFixed(1)})">
          ${renderMonomerKeyUnit(substrate, i)}
        </g>
      `;
    }

    // 3. Clash & Gap layer (for Steric Mismatch)
    const mismatch = result.mismatch;
    let clashMarkup = '';
    if (mismatch) {
      const clashCircles = (mismatch.clashPoints || []).map(([dx, dy]) => `
        <g transform="translate(${dx},${dy})">
          <circle cx="0" cy="0" r="14" class="enz-clash-ring" />
          <path d="M -5,-5 L 5,5 M 5,-5 L -5,5" stroke="#fca5a5" stroke-width="2.5" stroke-linecap="round" />
        </g>
      `).join('');
      const gapRects = (mismatch.gapPoints || []).map(([dx, dy, w, h]) => `
        <rect x="${dx - w / 2}" y="${dy - h / 2}" width="${w}" height="${h}" rx="5" class="enz-gap-box" />
      `).join('');
      const calloutText = state.lang === 'de' ? mismatch.reasonShortDe : mismatch.reasonShortEn;
      clashMarkup = `
        <g id="enz-clash-layer" style="opacity:${frame.clashIntensity.toFixed(2)}">
          <g transform="translate(${frame.enzymeX.toFixed(1)}, ${frame.enzymeY.toFixed(1)})">
            ${gapRects}
            ${clashCircles}
          </g>
          <g transform="translate(380, 294)">
            <rect x="-250" y="-16" width="500" height="26" rx="13" fill="rgba(127,29,29,0.88)" stroke="#fca5a5" stroke-width="1.4" />
            <text x="0" y="1" text-anchor="middle" fill="#fee2e2" font-size="12" font-weight="700">${esc(calloutText)}</text>
          </g>
        </g>
      `;
    } else {
      clashMarkup = `<g id="enz-clash-layer" style="opacity:0"></g>`;
    }

    // 4. Colon Transit Zone (Lactose Intolerance)
    const t = UI_COPY[state.lang];
    const colonOpacity = frame.mode === 'intolerance' ? 1 : 0;
    const bubbleOp = frame.bubbleIntensity ? frame.bubbleIntensity.toFixed(2) : '0';
    const colonSvg = `
      <g id="enz-colon-zone" style="opacity:${colonOpacity}">
        <rect x="595" y="120" width="142" height="145" rx="18" fill="rgba(251,191,36,0.10)" stroke="#fbbf24" stroke-width="1.8" stroke-dasharray="6 4" />
        <text x="666" y="142" text-anchor="middle" fill="#fde047" font-size="11" font-weight="800">${esc(t.colonLabel)}</text>
        <!-- Friendly gut microbe silhouettes -->
        <ellipse cx="645" cy="238" rx="14" ry="8" fill="#fbbf24" opacity="0.65" />
        <ellipse cx="690" cy="242" rx="13" ry="7" fill="#f59e0b" opacity="0.65" />
        <g id="enz-colon-bubbles" style="opacity:${bubbleOp}">
          <circle cx="640" cy="176" r="7" fill="none" stroke="#fde047" stroke-width="1.8" />
          <text x="640" y="179" text-anchor="middle" fill="#fde047" font-size="7.5" font-weight="800">H₂</text>
          <circle cx="688" cy="164" r="9.5" fill="none" stroke="#fde047" stroke-width="1.8" />
          <text x="688" y="167.5" text-anchor="middle" fill="#fde047" font-size="8" font-weight="800">CO₂</text>
        </g>
      </g>
    `;

    // 5. Cut Flash & H2O Hydrolysis Droplet
    const flashX = metrics.bondCentersX[frame.activeBondIndex] || 380;
    const flashY = cy + (substrate.bondYOffset || 0);
    const h2oX = frame.h2o.x || flashX;
    const h2oY = frame.h2o.y || 100;

    // 6. Articulated Sculpted Enzyme Lock & Catalytic Blades
    const [pivX, pivY] = enzyme.bladePivot || [0, 6];
    const bAng = frame.bladeAngle || 34;
    const enzymeLabel = state.lang === 'de' ? enzyme.nameDe : enzyme.nameEn;

    return `
      <svg id="enzyme-motion-svg" viewBox="0 0 760 320" class="enzyme-motion-svg" role="img" aria-label="${esc(state.lang === 'de' ? result.headlineDe : result.headlineEn)}">
        <title>${esc(state.lang === 'de' ? result.headlineDe : result.headlineEn)}</title>

        ${colonSvg}
        ${bondsSvg}
        ${unitsSvg}

        <!-- Water Molecule (Hydrolysis Agent) -->
        <g id="enz-h2o" transform="translate(${h2oX.toFixed(1)}, ${h2oY.toFixed(1)})" style="opacity:${frame.h2o.visible ? 1 : 0}">
          <circle cx="0" cy="0" r="12" fill="#0ea5e9" stroke="#e0f2fe" stroke-width="1.8" />
          <text x="0" y="3.5" text-anchor="middle" fill="#ffffff" font-size="9.5" font-weight="800">H₂O</text>
        </g>

        <!-- Sculpted Enzyme Actor with Articulated Catalytic Shear Blades -->
        <g id="enz-actor" transform="translate(${frame.enzymeX.toFixed(1)}, ${frame.enzymeY.toFixed(1)}) rotate(${frame.enzymeRot.toFixed(1)})" style="opacity:${frame.enzymeOpacity.toFixed(2)}">
          <path id="enz-fit-glow" d="${enzyme.lockPath}" class="enz-fit-seam" style="opacity:${(frame.fitGlow * 0.85).toFixed(2)}" />
          <path d="${enzyme.lockPath}" fill="${enzyme.color}" class="enz-body-path" />
          <!-- Catalytic Scissor Blades -->
          <g transform="translate(${pivX}, ${pivY})">
            <path id="enz-blade-l" d="M -3,0 L -8,34 L 2,26 Z" class="enz-blade" transform="rotate(${bAng.toFixed(1)})" />
            <path id="enz-blade-r" d="M 3,0 L 8,34 L -2,26 Z" class="enz-blade" transform="rotate(${(-bAng).toFixed(1)})" />
            <circle cx="0" cy="0" r="4.5" fill="#0f172a" stroke="#ffffff" stroke-width="1.5" />
          </g>
          <text x="0" y="-34" text-anchor="middle" fill="#0f172a" font-size="13" font-weight="800">${esc(enzymeLabel)}</text>
        </g>

        <!-- Active Snip Spark Burst -->
        <g id="enz-cut-flash" transform="translate(${flashX.toFixed(1)}, ${flashY.toFixed(1)})" style="opacity:${frame.cutFlash.toFixed(2)}">
          <line x1="-18" y1="-16" x2="18" y2="16" class="enz-cut-spark" />
          <line x1="-16" y1="16" x2="16" y2="-16" class="enz-cut-spark" />
          <line x1="0" y1="-22" x2="0" y2="22" class="enz-cut-spark" />
          <circle cx="0" cy="0" r="14" fill="none" stroke="#fef08a" stroke-width="2.5" />
        </g>

        ${clashMarkup}

        <text x="380" y="309" class="chem-caption" text-anchor="middle">
          ${esc(state.lang === 'de' ? substrate.nameDe : substrate.nameEn)} · ${esc(substrate.bond)} (${esc(state.lang === 'de' ? substrate.sourceDe : substrate.sourceEn)})
        </text>
      </svg>
    `;
  }

  function applyEnzymeFrame(frame) {
    const substrate = EnzymeLab.SUBSTRATES.find((s) => s.id === state.enzymeSubstrate) || EnzymeLab.SUBSTRATES[0];
    const metrics = EnzymeLab.getLayoutMetrics(substrate);
    const cy = metrics.chainY;

    const actor = document.getElementById('enz-actor');
    if (actor) {
      actor.setAttribute('transform', `translate(${frame.enzymeX.toFixed(1)}, ${frame.enzymeY.toFixed(1)}) rotate(${frame.enzymeRot.toFixed(1)})`);
      actor.style.opacity = frame.enzymeOpacity.toFixed(2);
    }

    const bladeL = document.getElementById('enz-blade-l');
    const bladeR = document.getElementById('enz-blade-r');
    if (bladeL) bladeL.setAttribute('transform', `rotate(${frame.bladeAngle.toFixed(1)})`);
    if (bladeR) bladeR.setAttribute('transform', `rotate(${(-frame.bladeAngle).toFixed(1)})`);

    const fitGlow = document.getElementById('enz-fit-glow');
    if (fitGlow) fitGlow.style.opacity = (frame.fitGlow * 0.85).toFixed(2);

    // Update monomers
    for (let i = 0; i < substrate.unitCount; i++) {
      const uEl = document.getElementById(`enz-unit-${i}`);
      if (!uEl) continue;
      const off = frame.unitOffsets[i] || { dx: 0, dy: 0, rot: 0 };
      const ux = metrics.unitCentersX[i];
      uEl.setAttribute('transform', `translate(${(ux + off.dx).toFixed(1)}, ${(cy + off.dy).toFixed(1)}) rotate(${off.rot.toFixed(1)})`);
    }

    // Update bonds
    for (let i = 0; i < frame.bondCutStates.length; i++) {
      const intactEl = document.getElementById(`enz-bond-intact-${i}`);
      const cutEl = document.getElementById(`enz-bond-cut-${i}`);
      const isCut = frame.bondCutStates[i];
      if (intactEl) intactEl.style.opacity = isCut ? '0' : '1';
      if (cutEl) cutEl.style.opacity = isCut ? '1' : '0';
    }

    // H2O droplet
    const h2oEl = document.getElementById('enz-h2o');
    if (h2oEl) {
      h2oEl.style.opacity = frame.h2o.visible ? '1' : '0';
      h2oEl.setAttribute('transform', `translate(${frame.h2o.x.toFixed(1)}, ${frame.h2o.y.toFixed(1)})`);
    }

    // Cut flash
    const flashEl = document.getElementById('enz-cut-flash');
    if (flashEl) {
      const fx = metrics.bondCentersX[frame.activeBondIndex] || 380;
      const fy = cy + (substrate.bondYOffset || 0);
      flashEl.setAttribute('transform', `translate(${fx.toFixed(1)}, ${fy.toFixed(1)})`);
      flashEl.style.opacity = frame.cutFlash.toFixed(2);
    }

    // Clash & Colon bubbles
    const clashEl = document.getElementById('enz-clash-layer');
    if (clashEl) {
      clashEl.style.opacity = frame.clashIntensity.toFixed(2);
      const innerGroup = clashEl.querySelector('g');
      if (innerGroup) {
        innerGroup.setAttribute('transform', `translate(${frame.enzymeX.toFixed(1)}, ${frame.enzymeY.toFixed(1)})`);
      }
    }
    const bubblesEl = document.getElementById('enz-colon-bubbles');
    if (bubblesEl) {
      bubblesEl.style.opacity = (frame.bubbleIntensity || 0).toFixed(2);
    }

    // Live counter & stepper highlight
    const counterEl = document.getElementById('enz-cut-counter');
    if (counterEl) {
      counterEl.textContent = UI_COPY[state.lang].bondsCutCounter(frame.cutCount, frame.totalBonds);
    }
    document.querySelectorAll('.step-pill').forEach((btn) => {
      const stepNum = Number(btn.dataset.enzStep);
      if (stepNum === frame.phaseStep) {
        btn.setAttribute('aria-current', 'step');
      } else {
        btn.removeAttribute('aria-current');
      }
    });

    const playBtn = document.getElementById('btn-enz-play');
    if (playBtn && frame.finished) {
      playBtn.textContent = UI_COPY[state.lang].replayEnzymeBtn;
    }
  }

  function startEnzymeAnimation(fromMs = null) {
    stopEnzymeAnimation();
    if (fromMs !== null) {
      state.enzymeElapsedMs = fromMs;
    }
    state.enzymePlaying = true;
    state.enzymeLastTickTs = null;

    const pauseBtn = document.getElementById('btn-enz-pause');
    if (pauseBtn) pauseBtn.textContent = UI_COPY[state.lang].pauseEnzymeBtn;

    if (typeof window.requestAnimationFrame !== 'function') {
      // Deterministic synchronous fallback (e.g., headless Node harness)
      const frame = EnzymeLab.computeFrameState(state.enzymeSelected, state.enzymeSubstrate, state.enzymeElapsedMs, {
        lactoseIntolerant: state.lactoseIntolerant
      });
      applyEnzymeFrame(frame);
      return;
    }

    const tick = (now) => {
      if (!state.enzymePlaying || state.station !== 'enzyme') {
        stopEnzymeAnimation();
        return;
      }
      if (state.enzymeLastTickTs === null) {
        state.enzymeLastTickTs = now;
      }
      const dt = Math.min(64, Math.max(0, now - state.enzymeLastTickTs));
      state.enzymeLastTickTs = now;
      state.enzymeElapsedMs += dt * (state.enzymeSlowMo ? 0.5 : 1);

      const frame = EnzymeLab.computeFrameState(state.enzymeSelected, state.enzymeSubstrate, state.enzymeElapsedMs, {
        lactoseIntolerant: state.lactoseIntolerant
      });
      applyEnzymeFrame(frame);

      if (frame.finished) {
        stopEnzymeAnimation();
        return;
      }
      state.enzymeRafId = window.requestAnimationFrame(tick);
    };

    state.enzymeRafId = window.requestAnimationFrame(tick);
  }

  function jumpToEnzymeStep(stepNumber) {
    stopEnzymeAnimation();
    const res = EnzymeLab.evaluateReaction(state.enzymeSelected, state.enzymeSubstrate, {
      lactoseIntolerant: state.lactoseIntolerant
    });
    const table =
      res.reasonCode === 'lactose-deficiency' ? EnzymeLab.PHASE_TIMESTAMPS.intolerance :
      res.cleaved ? EnzymeLab.PHASE_TIMESTAMPS.cleaved :
      EnzymeLab.PHASE_TIMESTAMPS.mismatch;
    const idx = Math.max(0, Math.min(3, stepNumber - 1));
    state.enzymeElapsedMs = table[idx];
    const frame = EnzymeLab.computeFrameState(state.enzymeSelected, state.enzymeSubstrate, state.enzymeElapsedMs, {
      lactoseIntolerant: state.lactoseIntolerant
    });
    applyEnzymeFrame(frame);
    const pauseBtn = document.getElementById('btn-enz-pause');
    if (pauseBtn) pauseBtn.textContent = UI_COPY[state.lang].resumeEnzymeBtn;
  }

  function renderEnzymeStation(autoPlay = true) {
    stopEnzymeAnimation();
    const t = UI_COPY[state.lang];
    const substrate = EnzymeLab.SUBSTRATES.find((s) => s.id === state.enzymeSubstrate) || EnzymeLab.SUBSTRATES[0];
    const enzyme = EnzymeLab.ENZYMES.find((e) => e.id === state.enzymeSelected) || EnzymeLab.ENZYMES[0];
    const result = EnzymeLab.evaluateReaction(enzyme.id, substrate.id, {
      lactoseIntolerant: state.lactoseIntolerant
    });

    const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (autoPlay && reducedMotion) {
      const table =
        result.reasonCode === 'lactose-deficiency' ? EnzymeLab.PHASE_TIMESTAMPS.intolerance :
        result.cleaved ? EnzymeLab.PHASE_TIMESTAMPS.cleaved :
        EnzymeLab.PHASE_TIMESTAMPS.mismatch;
      state.enzymeElapsedMs = table[2]; // Diagnostic key frame (Snip / Clash)
    } else if (autoPlay) {
      state.enzymeElapsedMs = 0;
    }

    const frame = EnzymeLab.computeFrameState(enzyme.id, substrate.id, state.enzymeElapsedMs, {
      lactoseIntolerant: state.lactoseIntolerant
    });

    const statusBadge =
      result.reasonCode === 'lactose-deficiency' ? t.statusIntol :
      result.cleaved ? t.statusMatched : t.statusMismatch;

    stageEl.innerHTML = `
      <div class="stereo-header-row">
        <div>
          <h1 id="stage-heading" tabindex="-1" class="station-title">${esc(t.enzymeTitle)}</h1>
          <p class="station-lead" style="max-width:54ch">${esc(t.enzymeLead)}</p>
        </div>
        <div class="speech-banner">${esc(t.enzymeSpeech)}</div>
      </div>

      <div class="enzyme-layout">
        <div class="enzyme-controls">
          <div>
            <h2 class="control-group-title">${esc(t.substrateHeading)}</h2>
            <div class="enzyme-grid-2col">
              ${EnzymeLab.SUBSTRATES.map((s) => `
                <button
                  type="button"
                  class="enzyme-opt-btn"
                  data-substrate-id="${s.id}"
                  aria-pressed="${s.id === substrate.id}"
                >
                  ${renderSubstrateMiniIcon(s)}
                  <span class="opt-text-wrap">
                    <span>${esc(state.lang === 'de' ? s.nameDe : s.nameEn)}</span>
                    <span class="opt-sub">${esc(s.bond)}</span>
                  </span>
                </button>
              `).join('')}
            </div>
          </div>

          <div>
            <h2 class="control-group-title">${esc(t.enzymeHeading)}</h2>
            <div class="enzyme-grid-2col">
              ${EnzymeLab.ENZYMES.map((e) => `
                <button
                  type="button"
                  class="enzyme-opt-btn"
                  data-enzyme-id="${e.id}"
                  aria-pressed="${e.id === enzyme.id}"
                >
                  <svg class="enzyme-mini-icon" viewBox="-14 -13 28 24" aria-hidden="true">
                    <path d="${e.miniIconPath}" fill="${e.color}" stroke="#ffffff" stroke-width="1.3" />
                  </svg>
                  <span class="opt-text-wrap">
                    <span>${esc(state.lang === 'de' ? e.nameDe : e.nameEn)}</span>
                    <span class="opt-sub">${esc(state.lang === 'de' ? e.originDe : e.originEn)}</span>
                  </span>
                </button>
              `).join('')}
            </div>
          </div>

          <label class="intolerance-toggle" for="chk-lactose-intol">
            <input type="checkbox" id="chk-lactose-intol" ${state.lactoseIntolerant ? 'checked' : ''} />
            <span>${esc(t.lactoseToggle)}</span>
          </label>
        </div>

        <div class="enzyme-stage-card">
          <div class="enzyme-toolbar">
            <div class="enzyme-play-controls">
              <button type="button" id="btn-enz-play" class="mini-pill" style="background:var(--cyan-strong);border-color:#ffffff">
                ${esc(frame.finished ? t.replayEnzymeBtn : t.runEnzymeBtn)}
              </button>
              <button type="button" id="btn-enz-pause" class="mini-pill">
                ${esc(state.enzymePlaying ? t.pauseEnzymeBtn : t.resumeEnzymeBtn)}
              </button>
              <button type="button" id="btn-enz-slowmo" class="mini-pill" aria-pressed="${state.enzymeSlowMo}">
                ${esc(t.slowMoBtn)}
              </button>
              ${!result.cleaved ? `
                <button type="button" id="btn-enz-match" class="mini-pill" style="border-color:var(--cyan-title);color:var(--cyan-title)">
                  ${esc(t.matchEnzymeBtn)}
                </button>
              ` : ''}
            </div>
            <div class="enzyme-stepper" role="group" aria-label="${esc(t.enzymePhasesGroup)}">
              ${t.enzymeSteps.map((stepLabel, idx) => `
                <button
                  type="button"
                  class="step-pill"
                  data-enz-step="${idx + 1}"
                  ${frame.phaseStep === idx + 1 ? 'aria-current="step"' : ''}
                >${esc(stepLabel)}</button>
              `).join('')}
            </div>
          </div>

          <div class="enzyme-svg-wrap">
            ${renderEnzymeStageSvg(substrate, enzyme, result, frame)}
            <div class="enz-stage-footer">
              <span>
                ${esc(statusBadge)} · <strong>${esc(state.lang === 'de' ? substrate.keyDescDe : substrate.keyDescEn)}</strong>
                · <button type="button" class="museum-link" style="font-size:0.84rem" data-sugar-slug="${esc(substrate.id)}">${esc(t.openSubstrateProfile)}</button>
              </span>
              <span id="enz-cut-counter" class="enz-counter-pill">${esc(t.bondsCutCounter(frame.cutCount, frame.totalBonds))}</span>
            </div>
          </div>

          <div class="enzyme-result-banner ${result.cleaved ? 'is-cleaved' : 'is-blocked'}">
            <h3 style="font-size:1.06rem;margin-bottom:0.25rem;color:#ffffff">
              ${esc(state.lang === 'de' ? result.headlineDe : result.headlineEn)}
            </h3>
            <p style="color:var(--text-muted);font-size:0.92rem">
              ${esc(state.lang === 'de' ? result.detailDe : result.detailEn)}
            </p>
          </div>
        </div>
      </div>
    `;

    const chk = document.getElementById('chk-lactose-intol');
    if (chk) {
      chk.addEventListener('change', (e) => {
        state.lactoseIntolerant = e.target.checked;
        if (state.lactoseIntolerant) {
          state.enzymeSubstrate = 'laktose';
          state.enzymeSelected = 'laktase';
        }
        renderEnzymeStation(true);
      });
    }

    if (autoPlay && !reducedMotion) {
      startEnzymeAnimation(0);
    }
  }

  // =========================================================================
  // STATION 5: POLYSACCHARID-PUZZLE ("Unendliche Möglichkeiten" – Image 4)
  // =========================================================================
  function tileFillClass(tileId) {
    if (tileId === 'hex-cyan') return 'tile-fill-cyan';
    if (tileId === 'hex-light') return 'tile-fill-light';
    if (tileId === 'hex-striped') return 'tile-fill-striped';
    return 'tile-fill-pent';
  }

  function renderPaletteTileSvg(tile) {
    const pts = PolyPuzzle.polygonPoints(tile.shape, 25);
    return `
      <svg width="58" height="58" viewBox="-30 -30 60 60" aria-hidden="true">
        <polygon points="${pts}" class="${tileFillClass(tile.id)}" />
      </svg>
    `;
  }

  function renderPuzzleStation() {
    const t = UI_COPY[state.lang];
    const level = PolyPuzzle.PUZZLE_LEVELS.find((l) => l.id === state.puzzleLevelId) || PolyPuzzle.PUZZLE_LEVELS[0];
    const progress = PolyPuzzle.getProgress(level, state.puzzlePlacements);
    const bondStates = PolyPuzzle.getBondStates(level, state.puzzlePlacements);
    const activeTile = PolyPuzzle.MONOMER_TILES.find((m) => m.id === state.selectedTileId) || PolyPuzzle.MONOMER_TILES[0];

    stageEl.innerHTML = `
      <div class="puzzle-layout">
        <div class="puzzle-sidebar">
          <h1 id="stage-heading" tabindex="-1" class="station-title">${esc(t.puzzleTitle)}</h1>
          <div class="puzzle-copy">
            <p>${esc(t.puzzleP1)}</p>
            <p>${esc(t.puzzleP2)}</p>
          </div>

          <p class="palette-prompt" style="white-space:pre-line">${esc(t.puzzlePrompt)}</p>

          <div class="monomer-palette" role="group" aria-label="${esc(t.monomerPaletteGroup)}">
            ${PolyPuzzle.MONOMER_TILES.map((tile) => `
              <button
                type="button"
                class="palette-tile-btn"
                data-tile-id="${tile.id}"
                aria-pressed="${state.selectedTileId === tile.id}"
                aria-label="${esc(state.lang === 'de' ? tile.labelDe : tile.labelEn)}"
              >
                ${renderPaletteTileSvg(tile)}
              </button>
            `).join('')}
          </div>

          <div class="palette-hint-box">
            <strong style="color:var(--cyan-title)">${esc(state.lang === 'de' ? activeTile.labelDe : activeTile.labelEn)}:</strong>
            <div>${esc(state.lang === 'de' ? activeTile.hintDe : activeTile.hintEn)}</div>
          </div>

          <div class="puzzle-level-bar">
            <label for="puzzle-level-select" class="profile-meta-label">${esc(t.puzzleLevelLabel)}</label>
            <select id="puzzle-level-select" class="puzzle-select">
              ${PolyPuzzle.PUZZLE_LEVELS.map((l) => `
                <option value="${l.id}" ${l.id === level.id ? 'selected' : ''}>
                  ${esc(state.lang === 'de' ? l.titleDe : l.titleEn)}
                </option>
              `).join('')}
            </select>
            <div style="font-size:0.84rem;color:var(--text-subtle)">
              ${esc(state.lang === 'de' ? level.subtitleDe : level.subtitleEn)}
            </div>
          </div>

          <div style="display:flex;flex-direction:column;gap:0.45rem">
            <progress
              class="museum-progress"
              value="${progress.filled}"
              max="${progress.total}"
              aria-label="${esc(t.puzzleProgress(progress.filled, progress.total))}"
            ></progress>
            <div style="display:flex;flex-wrap:wrap;align-items:center;gap:0.5rem">
              <span class="stereo-badge" style="font-size:0.86rem;padding:0.3rem 0.7rem">
                ${esc(t.puzzleProgress(progress.filled, progress.total))}
              </span>
              <button type="button" id="btn-puzzle-hint" class="mini-pill">${esc(t.puzzleHintBtn)}</button>
              <button type="button" id="btn-puzzle-reset" class="mini-pill">${esc(t.puzzleResetBtn)}</button>
            </div>
          </div>

          ${progress.completed ? `
            <div class="enzyme-result-banner is-cleaved" role="status">
              <strong>🎉 ${esc(t.puzzleSolved)}</strong>
            </div>
          ` : ''}
        </div>

        <div class="puzzle-canvas-wrap">
          <svg id="puzzle-board-svg" viewBox="0 0 800 540" class="puzzle-svg" role="group" aria-label="${esc(t.puzzleBoardGroup)}">
            ${bondStates.map((b) => `
              <line
                x1="${b.from.x}"
                y1="${b.from.y}"
                x2="${b.to.x}"
                y2="${b.to.y}"
                class="puzzle-bond-line ${b.bothPlaced ? 'is-connected' : ''}"
              />
            `).join('')}
            ${(level.annotations || []).map((ann) => `
              <text x="${ann.x}" y="${ann.y}" text-anchor="middle" class="puzzle-annotation">
                ${esc(state.lang === 'de' ? ann.textDe : ann.textEn)}
              </text>
            `).join('')}
            ${level.slots.map((slot, idx) => {
              const placedTileId = state.puzzlePlacements[slot.id];
              const isPent = slot.expected === 'pent-white';
              const pts = PolyPuzzle.polygonPoints(isPent ? 'pent' : 'hex', 25);
              const isPop = state.lastPlacedSlotId === slot.id;
              const isWrong = state.wrongSlotId === slot.id;
              const slotName = t.slotLabel(idx, isPent);
              return `
                <g
                  class="puzzle-slot ${isWrong ? 'is-wrong' : ''}"
                  data-slot-id="${slot.id}"
                  data-expected="${slot.expected}"
                  transform="translate(${slot.x},${slot.y}) rotate(${slot.rot || 0})"
                  tabindex="${placedTileId ? '-1' : '0'}"
                  role="button"
                  aria-label="${esc(slotName)}"
                >
                  <polygon
                    points="${pts}"
                    class="${placedTileId ? `${tileFillClass(placedTileId)} ${isPop ? 'placed-pop' : ''}` : 'puzzle-slot-poly'}"
                  />
                </g>
              `;
            }).join('')}
          </svg>
        </div>
      </div>
    `;

    state.lastPlacedSlotId = null;

    const lvlSelect = document.getElementById('puzzle-level-select');
    if (lvlSelect) {
      lvlSelect.addEventListener('change', (e) => {
        state.puzzleLevelId = e.target.value;
        state.puzzlePlacements = PolyPuzzle.createInitialPlacements(state.puzzleLevelId);
        renderPuzzleStation();
      });
    }

    setupPuzzlePointerDrag();
  }

  function attemptPlaceInSlot(slotId, tileId) {
    const level = PolyPuzzle.PUZZLE_LEVELS.find((l) => l.id === state.puzzleLevelId) || PolyPuzzle.PUZZLE_LEVELS[0];
    const slot = level.slots.find((s) => s.id === slotId);
    if (!slot || state.puzzlePlacements[slotId]) return;

    const check = PolyPuzzle.canPlaceTile(slot, tileId);
    if (check.allowed) {
      state.puzzlePlacements[slotId] = tileId;
      state.lastPlacedSlotId = slotId;
      state.wrongSlotId = null;
      const prog = PolyPuzzle.getProgress(level, state.puzzlePlacements);
      announce(
        state.lang === 'de'
          ? `Baustein eingesetzt (${prog.filled} von ${prog.total}).`
          : `Monomer placed (${prog.filled} of ${prog.total}).`
      );
      renderPuzzleStation();
    } else {
      state.wrongSlotId = slotId;
      announce(
        state.lang === 'de'
          ? 'Dieser Baustein passt hier nicht – achte auf Fünfeck/Sechseck und Umriss!'
          : 'This monomer does not fit this slot — check polygon shape and outline!'
      );
      renderPuzzleStation();
      window.setTimeout(() => {
        if (state.wrongSlotId === slotId) {
          state.wrongSlotId = null;
          const el = stageEl.querySelector(`[data-slot-id="${slotId}"]`);
          if (el) el.classList.remove('is-wrong');
        }
      }, 650);
    }
  }

  /**
   * Pointer-capture drag & drop from the 4 palette tiles onto SVG target slots
   * (follows modern-web-guidance `drag` & `natural-interactions`!).
   */
  function setupPuzzlePointerDrag() {
    stageEl.querySelectorAll('.palette-tile-btn').forEach((btn) => {
      let ghost = null;
      let moved = false;
      let startX = 0;
      let startY = 0;
      const tileId = btn.dataset.tileId;
      const tileObj = PolyPuzzle.MONOMER_TILES.find((m) => m.id === tileId);

      btn.addEventListener('pointerdown', (ev) => {
        if (ev.button !== 0) return;
        state.selectedTileId = tileId;
        startX = ev.clientX;
        startY = ev.clientY;
        moved = false;
        btn.setPointerCapture(ev.pointerId);
      });

      btn.addEventListener('pointermove', (ev) => {
        if (!btn.hasPointerCapture(ev.pointerId)) return;
        const dist = Math.hypot(ev.clientX - startX, ev.clientY - startY);
        if (!moved && dist > 5) {
          moved = true;
          btn.classList.add('dragging');
          ghost = document.createElement('div');
          ghost.className = 'floating-drag-ghost';
          ghost.innerHTML = renderPaletteTileSvg(tileObj);
          document.body.appendChild(ghost);
        }
        if (ghost) {
          const left = Math.max(0, Math.min(window.innerWidth - 66, ev.clientX - 33));
          const top = Math.max(0, Math.min(window.innerHeight - 66, ev.clientY - 33));
          ghost.style.left = `${left}px`;
          ghost.style.top = `${top}px`;

          // Highlight hovered slot
          stageEl.querySelectorAll('.puzzle-slot.is-drop-target').forEach((s) => s.classList.remove('is-drop-target'));
          const hit = document.elementFromPoint(ev.clientX, ev.clientY);
          const slotEl = hit && hit.closest ? hit.closest('.puzzle-slot') : null;
          if (slotEl) slotEl.classList.add('is-drop-target');
        }
      });

      const finishDrag = (ev) => {
        btn.classList.remove('dragging');
        stageEl.querySelectorAll('.puzzle-slot.is-drop-target').forEach((s) => s.classList.remove('is-drop-target'));
        if (ghost) {
          ghost.remove();
          ghost = null;
          if (ev && ev.type === 'pointerup') {
            const hit = document.elementFromPoint(ev.clientX, ev.clientY);
            const slotEl = hit && hit.closest ? hit.closest('.puzzle-slot') : null;
            if (slotEl) {
              attemptPlaceInSlot(slotEl.dataset.slotId, tileId);
              return;
            }
          }
        } else if (ev && ev.type === 'pointerup' && !moved) {
          // Pure click selects the tile for click-to-place / keyboard placement!
          renderPuzzleStation();
        }
      };

      btn.addEventListener('pointerup', finishDrag);
      btn.addEventListener('lostpointercapture', finishDrag);
    });
  }

  // =========================================================================
  // MASTER RENDER & DELEGATED INTERACTIONS
  // =========================================================================
  function stopEnzymeAnimation() {
    if (state.enzymeRafId !== null && typeof window.cancelAnimationFrame === 'function') {
      window.cancelAnimationFrame(state.enzymeRafId);
    }
    state.enzymeRafId = null;
    state.enzymePlaying = false;
    state.enzymeLastTickTs = null;
  }

  function renderCurrentStation() {
    if (state.station !== 'enzyme') {
      stopEnzymeAnimation();
    }
    switch (state.station) {
      case 'cloud':
        renderCloudStation();
        break;
      case 'profile':
        renderProfileStation();
        break;
      case 'stereo':
        renderStereoStation();
        break;
      case 'enzyme':
        renderEnzymeStation();
        break;
      case 'puzzle':
        renderPuzzleStation();
        break;
      default:
        renderCloudStation();
    }
  }

  function flipChiralCenter(index) {
    if (index < 0 || index >= state.stereoDirs.length) return;
    state.stereoDirs[index] = state.stereoDirs[index] === 'R' ? 'L' : 'R';
    state.stereoLastFlipped = index;
    const info = Stereo.identifyStereoisomer(state.stereoClass, state.stereoCarbons, state.stereoDirs);
    announce(state.lang === 'de' ? info.nameDe : info.nameEn);
    renderStereoStation();
    updateDocumentTitle();
  }

  // Stage Click Delegation
  stageEl.addEventListener('click', (e) => {
    const target = e.target;

    // 1. Open sugar profile from any `[data-sugar-slug]` button
    const sugarBtn = target.closest('[data-sugar-slug]');
    if (sugarBtn) {
      const slug = sugarBtn.dataset.sugarSlug;
      transitionRender(() => {
        state.selectedSugarSlug = slug;
        state.profileRingMode = 'standard';
        state.profileRingSize = null;
        state.station = 'profile';
        pushHistory('profile', slug);
      });
      return;
    }

    // 2. Glossary modal trigger
    const glossaryBtn = target.closest('[data-glossary]');
    if (glossaryBtn) {
      openGlossaryModal(glossaryBtn.dataset.glossary);
      return;
    }

    // 3. Word Cloud category filter, clear search & reset filters
    const catBtn = target.closest('[data-cat-filter]');
    if (catBtn) {
      state.cloudCategory = catBtn.dataset.catFilter;
      renderCloudStation();
      return;
    }
    if (target.closest('#btn-clear-search')) {
      state.cloudQuery = '';
      renderCloudStation();
      document.getElementById('sugar-search')?.focus();
      return;
    }
    if (target.closest('#btn-reset-cloud-filters')) {
      state.cloudCategory = 'all';
      state.cloudQuery = '';
      renderCloudStation();
      document.getElementById('sugar-search')?.focus();
      return;
    }

    // 4. Toggle cloud drift Pause/Play
    if (target.closest('#btn-toggle-drift')) {
      state.cloudDrifting = !state.cloudDrifting;
      renderCloudStation();
      document.getElementById('btn-toggle-drift')?.focus();
      return;
    }

    // 5. Toggle Cloud <-> List view
    if (target.closest('#btn-toggle-cloud-mode')) {
      transitionRender(() => {
        state.cloudMode = state.cloudMode === 'cloud' ? 'list' : 'cloud';
      }, false);
      document.getElementById('btn-toggle-cloud-mode')?.focus();
      return;
    }

    // 6. Profile -> Jump directly to Stereo C-Dreher, Enzyme Lab, or Polysaccharide Puzzle!
    if (target.closest('#btn-jump-stereo')) {
      const sugar = SugarData.getSugarBySlug(state.selectedSugarSlug);
      if (sugar && sugar.stereoPreset) {
        transitionRender(() => {
          state.stereoClass = sugar.stereoPreset.sugarClass;
          state.stereoCarbons = sugar.stereoPreset.carbons;
          state.stereoDirs = [...sugar.stereoPreset.dirs];
          state.stereoRingSize = null;
          state.station = 'stereo';
          pushHistory('stereo');
        });
      }
      return;
    }
    if (target.closest('#btn-jump-enzyme')) {
      if (ENZYME_SUBSTRATE_SLUGS.has(state.selectedSugarSlug)) {
        transitionRender(() => {
          state.enzymeSubstrate = state.selectedSugarSlug;
          state.lactoseIntolerant = false;
          state.station = 'enzyme';
          pushHistory('enzyme');
        });
      }
      return;
    }
    const jumpPuzzleBtn = target.closest('#btn-jump-puzzle');
    if (jumpPuzzleBtn) {
      const bp = jumpPuzzleBtn.dataset.puzzleBlueprint;
      if (bp) {
        transitionRender(() => {
          state.puzzleLevelId = bp;
          state.puzzlePlacements = PolyPuzzle.createInitialPlacements(bp);
          state.station = 'puzzle';
          pushHistory('puzzle');
        });
      }
      return;
    }

    // 7. Profile -> Back to Cloud
    if (target.closest('#btn-back-cloud')) {
      transitionRender(() => {
        state.station = 'cloud';
        pushHistory('cloud');
      });
      return;
    }

    // 8. Profile Fischer / α / β ring mode & ring size switch
    const ringBtn = target.closest('[data-ring-mode]');
    if (ringBtn) {
      state.profileRingMode = ringBtn.dataset.ringMode;
      renderProfileStation();
      return;
    }
    const profRingSizeBtn = target.closest('[data-profile-ringsize]');
    if (profRingSizeBtn) {
      state.profileRingSize = Number(profRingSizeBtn.dataset.profileRingsize);
      renderProfileStation();
      return;
    }

    // 9. Stereo C-Dreher: Click chiral C circle on SVG or keyboard button
    const hitCircle = target.closest('[data-chiral-hit]');
    if (hitCircle) {
      flipChiralCenter(Number(hitCircle.dataset.chiralHit));
      return;
    }
    const kbdFlipBtn = target.closest('[data-flip-index]');
    if (kbdFlipBtn) {
      const idx = Number(kbdFlipBtn.dataset.flipIndex);
      flipChiralCenter(idx);
      stageEl.querySelector(`[data-flip-index="${idx}"]`)?.focus();
      return;
    }

    // 10. Stereo Aldosen/Ketosen 4, 5, 6 ring button & discovery presets
    const carbonBtn = target.closest('[data-stereo-carbons]');
    if (carbonBtn) {
      const nextClass = carbonBtn.dataset.stereoClass;
      const nextCarbons = Number(carbonBtn.dataset.stereoCarbons);
      transitionRender(() => {
        state.stereoClass = nextClass;
        state.stereoCarbons = nextCarbons;
        state.stereoDirs = Stereo.getDefaultDirections(nextClass, nextCarbons);
        state.stereoRingSize = null;
        if (nextCarbons < 5) state.stereoShowHaworth = false;
      }, false);
      return;
    }
    const presetBtn = target.closest('[data-stereo-preset]');
    if (presetBtn) {
      const [cls, nStr, dirStr] = presetBtn.dataset.stereoPreset.split(':');
      state.stereoClass = cls;
      state.stereoCarbons = Number(nStr);
      state.stereoDirs = dirStr.split('');
      state.stereoRingSize = null;
      const info = Stereo.identifyStereoisomer(state.stereoClass, state.stereoCarbons, state.stereoDirs);
      announce(state.lang === 'de' ? info.nameDe : info.nameEn);
      renderStereoStation();
      updateDocumentTitle();
      return;
    }

    // 11. Stereo Enantiomer mirror & Haworth preview
    if (target.closest('#btn-flip-enantiomer')) {
      state.stereoDirs = Stereo.invertAll(state.stereoDirs);
      const info = Stereo.identifyStereoisomer(state.stereoClass, state.stereoCarbons, state.stereoDirs);
      announce(state.lang === 'de' ? info.nameDe : info.nameEn);
      renderStereoStation();
      return;
    }
    if (target.closest('#btn-toggle-stereo-ring')) {
      state.stereoShowHaworth = !state.stereoShowHaworth;
      renderStereoStation();
      return;
    }
    const anomerBtn = target.closest('[data-stereo-anomer]');
    if (anomerBtn) {
      state.stereoAnomer = anomerBtn.dataset.stereoAnomer;
      renderStereoStation();
      return;
    }
    const stereoRingSizeBtn = target.closest('[data-stereo-ringsize]');
    if (stereoRingSizeBtn) {
      state.stereoRingSize = Number(stereoRingSizeBtn.dataset.stereoRingsize);
      renderStereoStation();
      return;
    }

    // 12. Enzyme Lab substrate, enzyme, playback & stepper controls
    const subBtn = target.closest('[data-substrate-id]');
    if (subBtn) {
      state.enzymeSubstrate = subBtn.dataset.substrateId;
      renderEnzymeStation(true);
      return;
    }
    const enzBtn = target.closest('[data-enzyme-id]');
    if (enzBtn) {
      state.enzymeSelected = enzBtn.dataset.enzymeId;
      const res = EnzymeLab.evaluateReaction(state.enzymeSelected, state.enzymeSubstrate, {
        lactoseIntolerant: state.lactoseIntolerant
      });
      announce(state.lang === 'de' ? res.headlineDe : res.headlineEn);
      renderEnzymeStation(true);
      return;
    }
    if (target.closest('#btn-enz-play')) {
      startEnzymeAnimation(0);
      return;
    }
    if (target.closest('#btn-enz-pause')) {
      const pauseBtn = document.getElementById('btn-enz-pause');
      if (state.enzymePlaying) {
        stopEnzymeAnimation();
        if (pauseBtn) pauseBtn.textContent = UI_COPY[state.lang].resumeEnzymeBtn;
      } else {
        const res = EnzymeLab.computeFrameState(state.enzymeSelected, state.enzymeSubstrate, state.enzymeElapsedMs, {
          lactoseIntolerant: state.lactoseIntolerant
        });
        startEnzymeAnimation(res.finished ? 0 : state.enzymeElapsedMs);
      }
      return;
    }
    if (target.closest('#btn-enz-slowmo')) {
      state.enzymeSlowMo = !state.enzymeSlowMo;
      const btn = document.getElementById('btn-enz-slowmo');
      if (btn) btn.setAttribute('aria-pressed', String(state.enzymeSlowMo));
      return;
    }
    if (target.closest('#btn-enz-match')) {
      const sub = EnzymeLab.SUBSTRATES.find((s) => s.id === state.enzymeSubstrate);
      const matchingEnz = sub && EnzymeLab.ENZYMES.find((enz) => enz.matchesGeometry === sub.bondGeometry);
      if (matchingEnz) {
        state.lactoseIntolerant = false;
        state.enzymeSelected = matchingEnz.id;
        const res = EnzymeLab.evaluateReaction(state.enzymeSelected, state.enzymeSubstrate, { lactoseIntolerant: false });
        announce(state.lang === 'de' ? res.headlineDe : res.headlineEn);
        renderEnzymeStation(true);
      }
      return;
    }
    const stepBtn = target.closest('[data-enz-step]');
    if (stepBtn) {
      jumpToEnzymeStep(Number(stepBtn.dataset.enzStep));
      return;
    }
    const bondHit = target.closest('[data-bond-index]');
    if (bondHit) {
      const bIdx = Number(bondHit.dataset.bondIndex);
      const res = EnzymeLab.evaluateReaction(state.enzymeSelected, state.enzymeSubstrate, {
        lactoseIntolerant: state.lactoseIntolerant
      });
      if (res.cleaved) {
        startEnzymeAnimation(650 + bIdx * 1400);
      } else {
        startEnzymeAnimation(0);
      }
      return;
    }

    // 13. Puzzle slot click-to-place & Hint/Reset buttons
    const slotEl = target.closest('[data-slot-id]');
    if (slotEl) {
      attemptPlaceInSlot(slotEl.dataset.slotId, state.selectedTileId);
      return;
    }
    if (target.closest('#btn-puzzle-hint')) {
      const level = PolyPuzzle.PUZZLE_LEVELS.find((l) => l.id === state.puzzleLevelId) || PolyPuzzle.PUZZLE_LEVELS[0];
      const nextEmpty = level.slots.find((s) => !state.puzzlePlacements[s.id]);
      if (nextEmpty) {
        state.selectedTileId = nextEmpty.expected;
        attemptPlaceInSlot(nextEmpty.id, nextEmpty.expected);
      }
      return;
    }
    if (target.closest('#btn-puzzle-reset')) {
      state.puzzlePlacements = PolyPuzzle.createInitialPlacements(state.puzzleLevelId);
      renderPuzzleStation();
      return;
    }
  });

  // Keyboard Enter/Space + Arrow navigation for SVG `<g role="button">` puzzle slots & tile hotkeys
  stageEl.addEventListener('keydown', (e) => {
    if (state.station === 'puzzle' && ['1', '2', '3', '4'].includes(e.key) && e.target.tagName !== 'SELECT') {
      const tile = PolyPuzzle.MONOMER_TILES[Number(e.key) - 1];
      if (tile) {
        state.selectedTileId = tile.id;
        announce(state.lang === 'de' ? tile.labelDe : tile.labelEn);
        renderPuzzleStation();
        return;
      }
    }
    const slotEl = e.target.closest && e.target.closest('.puzzle-slot[role="button"]');
    if (!slotEl) return;
    if (e.key === 'Enter') {
      attemptPlaceInSlot(slotEl.dataset.slotId, state.selectedTileId);
    } else if (e.key === ' ') {
      e.preventDefault();
    } else if (['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'].includes(e.key)) {
      e.preventDefault();
      const openSlots = Array.from(stageEl.querySelectorAll('.puzzle-slot[tabindex="0"]'));
      const curIdx = openSlots.indexOf(slotEl);
      if (curIdx !== -1 && openSlots.length > 0) {
        const step = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : -1;
        const nextSlot = openSlots[(curIdx + step + openSlots.length) % openSlots.length];
        nextSlot?.focus();
      }
    }
  });
  stageEl.addEventListener('keyup', (e) => {
    const slotEl = e.target.closest && e.target.closest('.puzzle-slot[role="button"]');
    if (slotEl && e.key === ' ') {
      attemptPlaceInSlot(slotEl.dataset.slotId, state.selectedTileId);
    }
  });

  // Global `/` shortcut to focus search in Station 1
  if (typeof document.addEventListener === 'function') {
    document.addEventListener('keydown', (e) => {
      if (e.key === '/' && state.station === 'cloud' && (!e.target || !['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName))) {
        const searchEl = document.getElementById('sugar-search');
        if (searchEl) {
          e.preventDefault();
          searchEl.focus();
        }
      }
    });
  }

  // Dock Station Navigation
  document.querySelectorAll('.dock-station-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const nextStation = btn.dataset.station;
      if (nextStation === state.station) return;
      transitionRender(() => {
        state.station = nextStation;
        pushHistory(nextStation);
      });
    });
  });

  // Language Switcher (DE / EN)
  document.getElementById('btn-lang-de').addEventListener('click', () => {
    if (state.lang === 'de') return;
    transitionRender(() => {
      state.lang = 'de';
    }, false);
  });
  document.getElementById('btn-lang-en').addEventListener('click', () => {
    if (state.lang === 'en') return;
    transitionRender(() => {
      state.lang = 'en';
    }, false);
  });

  // Dock History Back (`<`) / Forward (`>`)
  document.getElementById('btn-nav-back').addEventListener('click', (e) => {
    if (e.currentTarget.getAttribute('aria-disabled') === 'true' || historyIndex <= 0) return;
    transitionRender(() => {
      historyIndex--;
      const snap = historyStack[historyIndex];
      state.station = snap.station;
      state.selectedSugarSlug = snap.slug;
    });
  });
  document.getElementById('btn-nav-fwd').addEventListener('click', (e) => {
    if (e.currentTarget.getAttribute('aria-disabled') === 'true' || historyIndex >= historyStack.length - 1) return;
    transitionRender(() => {
      historyIndex++;
      const snap = historyStack[historyIndex];
      state.station = snap.station;
      state.selectedSugarSlug = snap.slug;
    });
  });

  // Glossary & Quiz Dialog Controls (Modern Web Guidance `dialog` + `animate-to-from-top-layer`)
  document.getElementById('glossary-dialog-close').addEventListener('click', (e) => {
    e.preventDefault();
    closeTopLayer(glossaryDialog);
  });

  const openQuizBtn = document.getElementById('btn-open-quiz');
  if (openQuizBtn) {
    openQuizBtn.addEventListener('click', () => {
      openQuizModal();
    });
  }

  if (quizDialog) {
    quizDialog.addEventListener('click', (e) => {
      const target = e.target;
      const optBtn = target.closest && target.closest('[data-quiz-opt]');
      if (optBtn) {
        const questions = SugarData.QUIZ_QUESTIONS || [];
        const q = questions[state.quizIndex];
        if (q && typeof state.quizAnswers[q.id] !== 'number') {
          state.quizAnswers[q.id] = Number(optBtn.dataset.quizOpt);
          renderQuizModal();
        }
        return;
      }
      if (target.closest && target.closest('#btn-quiz-next')) {
        const total = (SugarData.QUIZ_QUESTIONS || []).length;
        if (state.quizIndex + 1 < total) {
          state.quizIndex++;
        } else {
          state.quizFinished = true;
        }
        renderQuizModal();
        return;
      }
      if (target.closest && target.closest('#btn-quiz-restart')) {
        state.quizIndex = 0;
        state.quizAnswers = {};
        state.quizFinished = false;
        renderQuizModal();
        return;
      }
      if (target.closest && target.closest('#btn-quiz-jump')) {
        const q = (SugarData.QUIZ_QUESTIONS || [])[state.quizIndex];
        if (q && q.jump) {
          closeTopLayer(quizDialog);
          transitionRender(() => {
            const j = q.jump;
            state.station = j.station;
            if (j.slug) {
              state.selectedSugarSlug = j.slug;
              state.profileRingMode = 'standard';
              state.profileRingSize = null;
            }
            if (j.stereoClass) {
              state.stereoClass = j.stereoClass;
              state.stereoCarbons = j.carbons;
              state.stereoDirs = [...j.dirs];
              state.stereoRingSize = null;
            }
            if (j.substrate) {
              state.enzymeSubstrate = j.substrate;
              state.enzymeSelected = j.enzyme || state.enzymeSelected;
              state.lactoseIntolerant = false;
            }
            if (j.levelId) {
              state.puzzleLevelId = j.levelId;
              state.puzzlePlacements = PolyPuzzle.createInitialPlacements(j.levelId);
            }
            pushHistory(j.station, state.selectedSugarSlug);
          });
        }
        return;
      }
      if (target.closest && target.closest('#btn-quiz-close')) {
        closeTopLayer(quizDialog);
      }
    });
  }

  for (const dlg of [glossaryDialog, quizDialog]) {
    if (!dlg) continue;
    dlg.addEventListener('cancel', (ev) => {
      ev.preventDefault();
      closeTopLayer(dlg);
    });
  }

  // Progressive enhancement fallback for `<dialog closedby="any">` where `closedBy` is unsupported (e.g. Safari)
  if (typeof HTMLDialogElement !== 'undefined' && !('closedBy' in HTMLDialogElement.prototype)) {
    const outside = (e, dialog) => {
      const r = dialog.getBoundingClientRect();
      return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
    };
    for (const dialog of document.querySelectorAll('dialog[closedby="any"]')) {
      let pressedOutside = false;
      dialog.addEventListener('pointerdown', (e) => {
        pressedOutside = outside(e, dialog);
      });
      dialog.addEventListener('pointerup', (e) => {
        if (pressedOutside && outside(e, dialog)) closeTopLayer(dialog);
      });
    }
  }

  // Sync `--dock-height` for scroll-padding-bottom & auto-tuck sticky dock on scroll-down where scroll-state queries aren't supported
  const dockEl = document.querySelector && document.querySelector('.museum-dock');
  if (dockEl && typeof window.ResizeObserver === 'function' && document.documentElement && document.documentElement.style) {
    const ro = new window.ResizeObserver(() => {
      const h = dockEl.offsetHeight;
      if (h > 0) {
        document.documentElement.style.setProperty('--dock-height', `${h}px`);
      }
    });
    ro.observe(dockEl);
  }

  if (
    dockEl &&
    typeof window.addEventListener === 'function' &&
    !(window.CSS && typeof window.CSS.supports === 'function' && window.CSS.supports('container-type', 'scroll-state'))
  ) {
    let lastY = window.scrollY || 0;
    window.addEventListener(
      'scroll',
      () => {
        const docEl = document.documentElement;
        if (!docEl) return;
        const maxScroll = Math.max(0, docEl.scrollHeight - window.innerHeight);
        if (maxScroll <= 6) {
          dockEl.classList.remove('is-dock-hidden');
          lastY = 0;
          return;
        }
        const y = Math.max(0, Math.min(window.scrollY || 0, maxScroll));
        if (y === lastY) return;
        const nearBottom = maxScroll - y <= 18;
        const shouldHide = !nearBottom && y > lastY && y > (dockEl.offsetHeight || 60) * 0.6;
        dockEl.classList.toggle('is-dock-hidden', shouldHide);
        lastY = y;
      },
      { passive: true }
    );
  }

  // Initial Boot
  restoreFromUrlHash();
  renderCurrentStation();
  syncDockControls();
  updateDocumentTitle();
})();
