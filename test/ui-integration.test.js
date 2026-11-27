const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const rootDir = path.resolve(__dirname, '..');

function relLuminance(hex) {
  const n = parseInt(hex.replace('#', ''), 16);
  const channels = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrastRatio(hex1, hex2) {
  const l1 = relLuminance(hex1);
  const l2 = relLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

test('WCAG 2.1 AA/AAA color contrast ratios hold across theme surfaces', () => {
  // Primary text (#f8fafc) on lightest center background (#585d62) and mid (#474c50)
  assert.ok(contrastRatio('#f8fafc', '#585d62') >= 6.0, 'Main text on center surface >= 6:1');
  assert.ok(contrastRatio('#f8fafc', '#474c50') >= 8.0, 'Main text on mid surface >= 8:1');
  // Cyan headings (#5cd3ff) on mid/edge surface & panel surface
  assert.ok(contrastRatio('#5cd3ff', '#373b3f') >= 6.5, 'Cyan title on edge surface >= 6.5:1');
  assert.ok(contrastRatio('#5cd3ff', '#474c50') >= 4.8, 'Cyan title on mid surface >= 4.5:1 AA');
  // Focus ring (#7dd3fc) non-text contrast >= 3:1 against all dark surfaces
  assert.ok(contrastRatio('#7dd3fc', '#585d62') >= 3.5, 'Focus indicator >= 3:1 against lightest surface');
});

test('HTML markup and CSS follow Modern Web Guidance accessibility & motion rules', () => {
  const html = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
  const css = fs.readFileSync(path.join(rootDir, 'css/styles.css'), 'utf8');
  const appJs = fs.readFileSync(path.join(rootDir, 'js/app.js'), 'utf8');

  // Semantic landmarks & skip link
  assert.match(html, /<html lang="de">/);
  assert.match(html, /class="skip-link visually-hidden"/);
  assert.match(html, /<main id="museum-stage"/);
  assert.match(html, /<nav class="dock-stations" aria-label="Stationen">/);
  assert.match(html, /<dialog id="glossary-dialog"[^>]*closedby="any"/);
  assert.match(html, /<dialog id="quiz-dialog"[^>]*closedby="any"/);
  assert.match(html, /aria-live="polite"/);

  // All 5 station buttons exist in dock
  for (const st of ['cloud', 'profile', 'stereo', 'enzyme', 'puzzle']) {
    assert.match(html, new RegExp(`data-station="${st}"`));
  }

  // Safari -webkit-user-select fallback before user-select
  assert.match(css, /-webkit-user-select:\s*none;\s*\n\s*user-select:\s*none;/);
  // Modal scroll containment & discrete top-layer entry/exit transitions
  assert.match(css, /dialog:modal\s*\{\s*overscroll-behavior:\s*contain;/);
  assert.match(css, /dialog::backdrop\s*\{\s*overflow:\s*hidden;\s*overscroll-behavior:\s*contain;/);
  assert.match(css, /transition-behavior:\s*allow-discrete;/);
  assert.match(css, /@starting-style/);
  // Separate -webkit- and -moz- progress bar rules
  assert.match(css, /progress\.museum-progress::-webkit-progress-value/);
  assert.match(css, /progress\.museum-progress::-moz-progress-bar/);
  // Reduced motion view-transition guard
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*no-preference\)/);
  // Focus-visible indicator
  assert.match(css, /:focus-visible/);

  // View Transitions + programmatic focus routing
  assert.match(appJs, /document\.startViewTransition/);
  assert.match(appJs, /getElementById\('stage-heading'\)\?\.focus/);
  // Pointer capture drag
  assert.match(appJs, /setPointerCapture/);
  assert.match(appJs, /lostpointercapture/);
});

test('All 42 stereoisomers in C-Dreher map to valid Haworth models (for C5/C6) without throwing', () => {
  const Stereo = require('../js/stereochemistry.js');
  const Structures = require('../js/structures-svg.js');

  const all = Stereo.listAllStereoisomers();
  for (const iso of all) {
    const fSvg = Structures.renderFischerSvg(iso.sugarClass, iso.carbons, iso.dirs, {
      interactive: true,
      showCarbonNumbers: true
    });
    assert.match(fSvg, /<svg/);

    if (iso.carbons >= 5) {
      for (const anomer of ['alpha', 'beta']) {
        const hm = Stereo.buildHaworthModel(iso.sugarClass, iso.carbons, iso.dirs, anomer);
        assert.equal(hm.supported, true);
        const hSvg = Structures.renderHaworthFromModel(hm, 'de');
        assert.match(hSvg, /<svg/);
      }
    }
  }
});

test('App controller executes cleanly across all 5 stations, DE/EN switching, C-Dreher flips, and Puzzle interactions', () => {
  const vm = require('node:vm');

  // Lightweight DOM harness to exercise app.js end-to-end
  function makeEl(id, dataset = {}) {
    const attrs = new Map();
    const listeners = {};
    const classSet = new Set();
    return {
      id,
      dataset,
      innerHTML: '',
      textContent: '',
      value: '',
      checked: false,
      selectionStart: 0,
      style: {},
      classList: {
        add: (c) => classSet.add(c),
        remove: (c) => classSet.delete(c),
        contains: (c) => classSet.has(c),
        toggle: (c, f) => (f ? classSet.add(c) : classSet.delete(c))
      },
      setAttribute: (k, v) => attrs.set(k, String(v)),
      getAttribute: (k) => (attrs.has(k) ? attrs.get(k) : null),
      removeAttribute: (k) => attrs.delete(k),
      addEventListener: (type, fn) => {
        listeners[type] = listeners[type] || [];
        listeners[type].push(fn);
      },
      trigger: (type, ev = {}) => {
        (listeners[type] || []).forEach((fn) => fn({ currentTarget: elements[id], target: ev.target || elements[id], preventDefault() { }, ...ev }));
      },
      focus: () => { },
      setSelectionRange: () => { },
      showModal: () => { attrs.set('open', 'true'); },
      close: () => { attrs.delete('open'); },
      querySelectorAll: () => [],
      querySelector: () => null
    };
  }

  const elements = {
    'museum-stage': makeEl('museum-stage'),
    'sr-announcer': makeEl('sr-announcer'),
    'glossary-dialog': makeEl('glossary-dialog'),
    'glossary-dialog-title': makeEl('glossary-dialog-title'),
    'glossary-dialog-body': makeEl('glossary-dialog-body'),
    'glossary-dialog-close': makeEl('glossary-dialog-close'),
    'quiz-dialog': makeEl('quiz-dialog'),
    'quiz-dialog-content': makeEl('quiz-dialog-content'),
    'btn-open-quiz': makeEl('btn-open-quiz'),
    'dock-quiz-label': makeEl('dock-quiz-label'),
    'btn-lang-de': makeEl('btn-lang-de'),
    'btn-lang-en': makeEl('btn-lang-en'),
    'btn-nav-back': makeEl('btn-nav-back'),
    'btn-nav-fwd': makeEl('btn-nav-fwd')
  };

  const dockBtns = ['cloud', 'profile', 'stereo', 'enzyme', 'puzzle'].map((st) => {
    const b = makeEl(`dock-${st}`, { station: st });
    elements[`dock-${st}`] = b;
    return b;
  });

  const sandbox = {
    window: {
      ZuckerWelt: {
        Stereo: require('../js/stereochemistry.js'),
        SugarData: require('../js/data-sugars.js'),
        Structures: require('../js/structures-svg.js'),
        EnzymeLab: require('../js/enzyme-lab.js'),
        PolyPuzzle: require('../js/polysaccharide-puzzle.js')
      },
      matchMedia: () => ({ matches: false }),
      setTimeout: (fn) => fn(),
      innerWidth: 1440,
      innerHeight: 900
    },
    document: {
      title: '',
      documentElement: { lang: 'de' },
      getElementById: (id) => elements[id] || null,
      querySelectorAll: (sel) => (sel === '.dock-station-btn' ? dockBtns : []),
      createElement: (tag) => makeEl(tag),
      body: { appendChild: () => { } },
      elementFromPoint: () => null
    }
  };
  sandbox.globalThis = sandbox.window;

  const code = fs.readFileSync(path.join(rootDir, 'js/app.js'), 'utf8');
  vm.runInNewContext(code, sandbox);

  // 1. Initial boot rendered Station 1 (Word Cloud)
  assert.match(elements['museum-stage'].innerHTML, /Zucker – Es gibt viel mehr/);
  assert.match(elements['museum-stage'].innerHTML, /Chitin/);

  // 2. Navigate across all 5 dock stations and verify rendered headings & SVG graphics
  dockBtns[1].trigger('click'); // Profile (Chitin)
  assert.match(elements['museum-stage'].innerHTML, /Chitin/);
  assert.match(elements['museum-stage'].innerHTML, /N<\/span>-Acetylglucosamin/);

  dockBtns[2].trigger('click'); // Stereo (Aldosen 6 -> D-Allose)
  assert.match(elements['museum-stage'].innerHTML, /Aldosen mit 6 Kohlenstoff Atomen/);
  assert.match(elements['museum-stage'].innerHTML, /D-Allose/);

  // Flip chiral C3 (index 1: R -> L on RRRR gives RLRR = D-Glucose!)
  elements['museum-stage'].trigger('click', {
    target: {
      closest: (sel) => (sel === '[data-chiral-hit]' ? { dataset: { chiralHit: '1' } } : null)
    }
  });
  assert.match(elements['museum-stage'].innerHTML, /D-Glucose/);

  dockBtns[3].trigger('click'); // Enzyme Lab (Active Lock-and-Key Motion Graphic)
  assert.match(elements['museum-stage'].innerHTML, /Enzyme – Wer knackt welchen Zucker\?/);
  assert.match(elements['museum-stage'].innerHTML, /α-Amylase schneidet Stärke/);
  assert.match(elements['museum-stage'].innerHTML, /id="enz-actor"/);
  assert.match(elements['museum-stage'].innerHTML, /id="enz-blade-l"/);
  assert.match(elements['museum-stage'].innerHTML, /Bindungen gespalten:/);

  // Switch substrate to Zellulose -> verify steric mismatch callout and zero "prallt ab"
  elements['museum-stage'].trigger('click', {
    target: {
      closest: (sel) => (sel === '[data-substrate-id]' ? { dataset: { substrateId: 'zellulose' } } : null)
    }
  });
  assert.match(elements['museum-stage'].innerHTML, /α-Amylase passt nicht zu Zellulose/);
  assert.match(elements['museum-stage'].innerHTML, /180°-Drehung/);
  assert.doesNotMatch(elements['museum-stage'].innerHTML, /prallt ab|PRALLT AB/i);

  // Jump to Phase Step 3 (Conflict) via stepper button
  elements['museum-stage'].trigger('click', {
    target: {
      closest: (sel) => (sel === '[data-enz-step]' ? { dataset: { enzStep: '3' } } : null)
    }
  });
  assert.match(elements['museum-stage'].innerHTML, /enzyme-motion-svg/);

  dockBtns[4].trigger('click'); // Polysaccharide Puzzle
  assert.match(elements['museum-stage'].innerHTML, /Unendliche Möglichkeiten/);
  assert.match(elements['museum-stage'].innerHTML, /puzzle-board-svg/);

  // 3. Switch language to English and verify dynamic translation & <html lang="en">
  elements['btn-lang-en'].trigger('click');
  assert.equal(sandbox.document.documentElement.lang, 'en');
  assert.match(elements['museum-stage'].innerHTML, /Infinite Possibilities/);

  // 4. Test Back button returns to Enzyme Lab in English
  elements['btn-nav-back'].trigger('click');
  assert.match(elements['museum-stage'].innerHTML, /Enzymes – Which Key Fits Which Sugar\?/);

  // 5. Pick matching enzyme helper resolves mismatch automatically
  elements['museum-stage'].trigger('click', {
    target: {
      closest: (sel) => (sel === '#btn-enz-match' ? {} : null)
    }
  });
  assert.match(elements['museum-stage'].innerHTML, /Cellulase cleaves Cellulose!/);

  // 6. Verify Fischer-default sugar (`allose`) highlights Fischer button rather than β-Ring
  elements['museum-stage'].trigger('click', {
    target: {
      closest: (sel) => (sel === '[data-sugar-slug]' ? { dataset: { sugarSlug: 'allose' } } : null)
    }
  });
  assert.match(elements['museum-stage'].innerHTML, /data-ring-mode="fischer" aria-pressed="true"/);
  assert.match(elements['museum-stage'].innerHTML, /Reducing \(Fehling \+\)/);

  // 7. Interactive Museum Quiz opens, scores answer, and jumps to live experiment
  elements['btn-open-quiz'].trigger('click');
  assert.match(elements['quiz-dialog-content'].innerHTML, /Question 1 \/ 10/);
  elements['quiz-dialog'].trigger('click', {
    target: {
      closest: (sel) => (sel === '[data-quiz-opt]' ? { dataset: { quizOpt: '0' } } : null)
    }
  });
  assert.match(elements['quiz-dialog-content'].innerHTML, /Correct!/);
  elements['quiz-dialog'].trigger('click', {
    target: {
      closest: (sel) => (sel === '#btn-quiz-jump' ? {} : null)
    }
  });
  assert.match(elements['museum-stage'].innerHTML, /α-Amylase does not fit Cellulose!/);
});

test('Word Cloud 86-sugar layout stays inside viewport bounds without pill collisions in DE and EN', () => {
  const SugarData = require('../js/data-sugars.js');
  const vw = 1360;
  const vh = 560;
  const fontPx = { 5: 25, 4: 20, 3: 16.5, 2: 14, 1: 13 };

  for (const lang of ['de', 'en']) {
    const boxes = SugarData.SUGARS.map((s) => {
      const txt = lang === 'de' ? s.nameDe : s.nameEn;
      const fs = fontPx[s.weight] || 16;
      const w = txt.length * fs * 0.56 + 14;
      const h = fs * 1.4 + 4;
      const cx = (s.cloudPos[0] / 100) * vw;
      const cy = (s.cloudPos[1] / 100) * vh;
      return { slug: s.slug, l: cx - w / 2, r: cx + w / 2, t: cy - h / 2, b: cy + h / 2 };
    });

    for (const b of boxes) {
      assert.ok(b.l >= 0 && b.r <= vw, `${b.slug} [${lang}] horizontal bounds (${b.l.toFixed(1)}..${b.r.toFixed(1)})`);
      assert.ok(b.t >= 0 && b.b <= vh, `${b.slug} [${lang}] vertical bounds (${b.t.toFixed(1)}..${b.b.toFixed(1)})`);
    }

    for (let i = 0; i < boxes.length; i++) {
      for (let j = i + 1; j < boxes.length; j++) {
        const a = boxes[i];
        const b = boxes[j];
        const ox = Math.min(a.r, b.r) - Math.max(a.l, b.l);
        const oy = Math.min(a.b, b.b) - Math.max(a.t, b.t);
        assert.ok(!(ox > 4 && oy > 3), `Word cloud overlap [${lang}] between ${a.slug} and ${b.slug} (${ox.toFixed(1)}x${oy.toFixed(1)})`);
      }
    }

    // Also verify no word-cloud pill overlaps the bottom-right Pause / Cloud-List buttons (>81.5% x and >78.5% y)
    for (const b of boxes) {
      const rightPct = (b.r / vw) * 100;
      const botPct = (b.b / vh) * 100;
      assert.ok(!(rightPct > 82 && botPct > 79), `${b.slug} [${lang}] intrudes into bottom-right corner controls (${rightPct.toFixed(1)}%, ${botPct.toFixed(1)}%)`);
    }
  }
});

test('Bottom dock layout, grid track shrinkage, SVG height caps, and scroll auto-tuck prevent view interference', () => {
  const vm = require('node:vm');
  const css = fs.readFileSync(path.join(rootDir, 'css/styles.css'), 'utf8');

  // 1. Root & stage sizing must never clamp body to 100% height or shrink <main> under <footer>
  assert.doesNotMatch(css, /html,\s*body\s*\{[^}]*\bheight:\s*100%/, 'body must not clamp height: 100%');
  assert.doesNotMatch(css, /body\s*\{[^}]*overflow-x:\s*hidden/, 'body must not hide horizontal overflow');
  assert.match(css, /html\s*\{[^}]*scroll-padding-bottom:/, 'html reserves scroll-padding-bottom for sticky dock');
  assert.match(css, /\.museum-stage\s*\{[^}]*flex:\s*1 0 auto;/, 'museum-stage must not shrink below content height');
  assert.doesNotMatch(css, /\.museum-stage\s*\{[^}]*min-height:\s*0/, 'museum-stage must not collapse via min-height: 0');

  // 2. Grid columns & vertical SVGs prevent horizontal blowout and laptop vertical overflow
  assert.match(css, /\.profile-layout\s*\{[^}]*minmax\(0,\s*1fr\)/);
  assert.match(css, /\.profile-main\s*\{[^}]*min-inline-size:\s*0/);
  assert.match(css, /\.structure-svg\s*\{[^}]*max-block-size:\s*clamp\(/);
  assert.match(css, /\.fischer-svg\s*\{[^}]*max-block-size:\s*clamp\(/);
  assert.match(css, /\.museum-dock\s*\{[^}]*position:\s*sticky;\s*\n\s*bottom:\s*0;/);

  // 3. Verify JS scroll-direction auto-tuck fallback hides dock when scrolling down mid-page and restores on scroll-up / bottom / navigation
  const listeners = {};
  const dockClasses = new Set();
  const dockMock = {
    offsetHeight: 62,
    classList: {
      add: (c) => dockClasses.add(c),
      remove: (c) => dockClasses.delete(c),
      toggle: (c, force) => (force ? dockClasses.add(c) : dockClasses.delete(c)),
      contains: (c) => dockClasses.has(c)
    }
  };

  function makeSimpleEl(id, dataset = {}) {
    const attrs = new Map();
    const evs = {};
    return {
      id,
      dataset,
      innerHTML: '',
      textContent: '',
      style: { setProperty: () => {} },
      classList: { add: () => {}, remove: () => {}, toggle: () => {}, contains: () => false },
      setAttribute: (k, v) => attrs.set(k, String(v)),
      getAttribute: (k) => (attrs.has(k) ? attrs.get(k) : null),
      removeAttribute: (k) => attrs.delete(k),
      addEventListener: (t, fn) => { (evs[t] = evs[t] || []).push(fn); },
      trigger: (t, ev = {}) => (evs[t] || []).forEach((fn) => fn({ currentTarget: els[id], target: els[id], preventDefault() {}, ...ev })),
      focus: () => {},
      showModal: () => {},
      close: () => {},
      querySelectorAll: () => [],
      querySelector: () => null
    };
  }

  const els = {
    'museum-stage': makeSimpleEl('museum-stage'),
    'sr-announcer': makeSimpleEl('sr-announcer'),
    'glossary-dialog': makeSimpleEl('glossary-dialog'),
    'glossary-dialog-title': makeSimpleEl('glossary-dialog-title'),
    'glossary-dialog-body': makeSimpleEl('glossary-dialog-body'),
    'glossary-dialog-close': makeSimpleEl('glossary-dialog-close'),
    'quiz-dialog': makeSimpleEl('quiz-dialog'),
    'quiz-dialog-content': makeSimpleEl('quiz-dialog-content'),
    'btn-open-quiz': makeSimpleEl('btn-open-quiz'),
    'dock-quiz-label': makeSimpleEl('dock-quiz-label'),
    'btn-lang-de': makeSimpleEl('btn-lang-de'),
    'btn-lang-en': makeSimpleEl('btn-lang-en'),
    'btn-nav-back': makeSimpleEl('btn-nav-back'),
    'btn-nav-fwd': makeSimpleEl('btn-nav-fwd')
  };
  const dBtns = ['cloud', 'profile', 'stereo', 'enzyme', 'puzzle'].map((st) => makeSimpleEl(`d-${st}`, { station: st }));

  const docEl = { lang: 'de', scrollHeight: 1200, style: { setProperty: () => {} } };
  const win = {
    ZuckerWelt: {
      Stereo: require('../js/stereochemistry.js'),
      SugarData: require('../js/data-sugars.js'),
      Structures: require('../js/structures-svg.js'),
      EnzymeLab: require('../js/enzyme-lab.js'),
      PolyPuzzle: require('../js/polysaccharide-puzzle.js')
    },
    matchMedia: () => ({ matches: false }),
    setTimeout: (fn) => fn(),
    scrollTo: () => {},
    innerWidth: 1360,
    innerHeight: 700,
    scrollY: 0,
    addEventListener: (type, fn) => { listeners[type] = fn; }
  };

  const sandbox = {
    window: win,
    globalThis: win,
    document: {
      title: '',
      documentElement: docEl,
      getElementById: (id) => els[id] || null,
      querySelector: (sel) => (sel === '.museum-dock' ? dockMock : null),
      querySelectorAll: (sel) => (sel === '.dock-station-btn' ? dBtns : []),
      createElement: (tag) => makeSimpleEl(tag),
      body: { appendChild: () => {} },
      elementFromPoint: () => null
    }
  };

  vm.runInNewContext(fs.readFileSync(path.join(rootDir, 'js/app.js'), 'utf8'), sandbox);
  assert.equal(typeof listeners.scroll, 'function', 'Registers scroll fallback listener');

  // Scrolling down mid-document hides dock so overflowing content is unobstructed
  win.scrollY = 180;
  listeners.scroll();
  assert.equal(dockClasses.has('is-dock-hidden'), true, 'Dock tucks away while scrolling down mid-page');

  // Scrolling back up reveals dock immediately
  win.scrollY = 120;
  listeners.scroll();
  assert.equal(dockClasses.has('is-dock-hidden'), false, 'Dock reappears on scroll-up');

  // Scrolling down to the very bottom reveals dock (where it sits in its own flex row below <main>)
  win.scrollY = 260;
  listeners.scroll();
  assert.equal(dockClasses.has('is-dock-hidden'), true);
  win.scrollY = 495; // maxScroll = 1200 - 700 = 500 -> within 18px of bottom
  listeners.scroll();
  assert.equal(dockClasses.has('is-dock-hidden'), false, 'Dock reappears at bottom of page below <main>');
});

