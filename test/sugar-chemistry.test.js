const test = require('node:test');
const assert = require('node:assert/strict');

const Stereo = require('../js/stereochemistry.js');
const SugarData = require('../js/data-sugars.js');
const Structures = require('../js/structures-svg.js');
const EnzymeLab = require('../js/enzyme-lab.js');
const PolyPuzzle = require('../js/polysaccharide-puzzle.js');

test('Stereochemistry Engine enumerates all 42 unique Aldose & Ketose stereoisomers (C4, C5, C6)', () => {
  const all = Stereo.listAllStereoisomers();
  assert.equal(all.length, 42, '4 + 8 + 16 aldoses + 2 + 4 + 8 ketoses = 42');
  const uniqueNames = new Set(all.map((s) => s.nameDe));
  assert.equal(uniqueNames.size, 42, 'Every stereoisomer must have a unique IUPAC/trivial D/L name');
});

test('Stereochemistry Engine identifies D-Allose, D-Glucose, L-Glucose, and L-Idose accurately', () => {
  const dAllose = Stereo.identifyStereoisomer('aldose', 6, ['R', 'R', 'R', 'R']);
  assert.equal(dAllose.nameDe, 'D-Allose');

  const dGlucose = Stereo.identifyStereoisomer('aldose', 6, ['R', 'L', 'R', 'R']);
  assert.equal(dGlucose.nameDe, 'D-Glucose');

  // Classic chemistry check: flipping ONLY C5 of D-Glucose gives L-Idose, NOT L-Glucose!
  const c5Flipped = Stereo.identifyStereoisomer('aldose', 6, ['R', 'L', 'R', 'L']);
  assert.equal(c5Flipped.nameDe, 'L-Idose');

  // Inverting ALL 4 chiral centers of D-Glucose gives L-Glucose!
  const lGlucose = Stereo.identifyStereoisomer('aldose', 6, ['L', 'R', 'L', 'L']);
  assert.equal(lGlucose.nameDe, 'L-Glucose');

  // Relationships
  assert.equal(Stereo.compareStereoisomers(['R', 'L', 'R', 'R'], ['R', 'L', 'L', 'R'], 2).type, 'epimer');
  assert.equal(Stereo.compareStereoisomers(['R', 'L', 'R', 'R'], ['L', 'R', 'L', 'L'], 2).type, 'enantiomer');
  assert.equal(Stereo.compareStereoisomers(['R', 'L', 'R', 'R'], ['R', 'L', 'R', 'L'], 2).type, 'epimer');
});

test('FLOH Rule Haworth Cyclization builds exact α- and β-D-Glucopyranose & β-D-Fructofuranose', () => {
  const alphaGlc = Stereo.buildHaworthModel('aldose', 6, ['R', 'L', 'R', 'R'], 'alpha');
  assert.equal(alphaGlc.supported, true);
  assert.equal(alphaGlc.ringSize, 6);
  assert.equal(alphaGlc.vertices[0].bottom, 'OH', 'α-D-Glucose C1 OH points down');
  assert.equal(alphaGlc.vertices[1].bottom, 'OH', 'C2 (R in Fischer) points down');
  assert.equal(alphaGlc.vertices[2].top, 'OH', 'C3 (L in Fischer) points up (FLOH!)');
  assert.equal(alphaGlc.vertices[3].bottom, 'OH', 'C4 (R in Fischer) points down');
  assert.equal(alphaGlc.vertices[4].top, 'CH₂OH', 'D-series C6 CH₂OH points up');

  const betaGlc = Stereo.buildHaworthModel('aldose', 6, ['R', 'L', 'R', 'R'], 'beta');
  assert.equal(betaGlc.vertices[0].top, 'OH', 'β-D-Glucose C1 OH points up');

  const betaFru = Stereo.buildHaworthModel('ketose', 6, ['L', 'R', 'R'], 'beta');
  assert.equal(betaFru.ringSize, 5);
  assert.equal(betaFru.vertices[0].top, 'OH', 'β-D-Fructofuranose C2 OH points up');
  assert.equal(betaFru.vertices[0].bottom, 'CH₂OH', 'β-D-Fructofuranose C1 CH₂OH points down');

  // Explicit 6-ring pyranose for D-Fructose & 5-ring furanose for D-Glucose
  const betaFruPyr = Stereo.buildHaworthModel('ketose', 6, ['L', 'R', 'R'], 'beta', 6);
  assert.equal(betaFruPyr.ringSize, 6);
  assert.equal(betaFruPyr.attackingCarbon, 6);
  assert.match(betaFruPyr.ringNameDe, /Fruktopyranose/);

  const alphaGlcFur = Stereo.buildHaworthModel('aldose', 6, ['R', 'L', 'R', 'R'], 'alpha', 5);
  assert.equal(alphaGlcFur.ringSize, 5);
  assert.equal(alphaGlcFur.attackingCarbon, 4);
  assert.match(alphaGlcFur.ringNameDe, /Glucofuranose/);
});

test('Sugar Database has full referential integrity and renders valid SVG structures for every entry', () => {
  assert.equal(SugarData.SUGARS.length, 86, 'Contains expanded 86-sugar museum catalog');

  const slugs = new Set(SugarData.SUGARS.map((s) => s.slug));
  const mustInclude = [
    'chitin', 'pektin', 'stachyose', 'iduronsaeure', 'arabinose-d', 'arabinose-l',
    'gentianose', 'ribose', 'rhamnose', 'inulin', 'turanose', 'fucose', 'saccharose',
    'pullulan', 'guluronsaeure', 'erythrose', 'n-acetylneuraminsaeure', 'murein',
    'laktulose', 'hemizellulose', 'agar', 'ribulose', 'laktose', 'raffinose',
    'alginat', 'mannit', 'laminarin', 'galacturonsaeure', 'carrageen', 'fruktose',
    'zellulose', 'sorbit', 'glykosaminoglykan', 'traganth', 'xylose', 'isomaltulose',
    'sedoheptulose', 'desoxyribose', 'digitoxose', 'threose', 'dihydroxyaceton',
    'tagatose', 'dextran', 'xylit', 'sorbose', 'arabino-3-hexulose', 'n-acetylglucosamin',
    '3-6-anhydro-galactose', 'gummi-arabicum', 'erythrit', 'idose', 'glucosamin',
    'allose', 'erythrulose', 'glykogen', 'talose', 'gluconsaeure', 'glucarsaeure',
    'staerke', 'glucuronsaeure', 'planteose', 'psicose', 'gentiobiose', 'melezitose',
    'mannuronsaeure', 'maltose', 'isomaltose', 'glycerinaldehyd', 'galaktose', 'glucose',
    'cellobiose', 'trehalose', 'maltotriose', 'hyaluronsaeure', 'heparin', 'chitosan',
    'n-acetylgalactosamin', 'ascorbinsaeure'
  ];

  for (const requiredSlug of mustInclude) {
    assert.ok(slugs.has(requiredSlug), `Missing museum sugar: ${requiredSlug}`);
  }

  for (const s of SugarData.SUGARS) {
    const cat = SugarData.CATEGORIES[s.category];
    assert.ok(cat, `Invalid category on ${s.slug}`);
    assert.ok(SugarData.GLOSSARY[cat.glossaryKey], `Missing glossary entry for ${cat.glossaryKey}`);

    for (const ref of s.buildingBlockSlugs) {
      assert.ok(slugs.has(ref), `Broken buildingBlockSlug "${ref}" on ${s.slug}`);
    }

    const svgDe = Structures.renderSugarStructure(s, 'de');
    const svgEn = Structures.renderSugarStructure(s, 'en');
    assert.match(svgDe, /<svg[\s>]/, `German SVG missing on ${s.slug}`);
    assert.match(svgDe, /<title>/, `Accessible SVG <title> missing on ${s.slug}`);
    assert.match(svgEn, /<svg[\s>]/, `English SVG missing on ${s.slug}`);
  }

  // Chemical structure accuracy checks for tricky sugars
  const gluconSvg = Structures.renderSugarStructure(SugarData.getSugarBySlug('gluconsaeure'), 'de');
  assert.doesNotMatch(gluconSvg, /haworth-ring/, 'Gluconic acid must render as open-chain Fischer, not pentavalent C1 ring');
  assert.match(gluconSvg, /COOH/);

  const hex3Svg = Structures.renderSugarStructure(SugarData.getSugarBySlug('arabino-3-hexulose'), 'de');
  assert.doesNotMatch(hex3Svg, /chem-poly-ring/, 'Arabino-3-hexulose must not fall through to polymer ribbon');
  assert.match(hex3Svg, /C3 \(Keto!\)/);

  const sedoSvg = Structures.renderSugarStructure(SugarData.getSugarBySlug('sedoheptulose'), 'de');
  assert.doesNotMatch(sedoSvg, /chem-poly-ring/, 'Sedoheptulose must render 7-carbon Fischer projection');
  assert.match(sedoSvg, /C6/);

  const isomaltoseSvg = Structures.renderSugarStructure(SugarData.getSugarBySlug('isomaltose'), 'de');
  assert.match(isomaltoseSvg, /α-1→6/, 'Isomaltose must render explicit α-1→6 linkage');

  const gentiobioseSvg = Structures.renderSugarStructure(SugarData.getSugarBySlug('gentiobiose'), 'de');
  assert.match(gentiobioseSvg, /β-1→6/, 'Gentiobiose must render explicit β-1→6 linkage');

  // Reducing vs. non-reducing flags & alias lookup
  assert.equal(SugarData.getSugarBySlug('glucose').reducing, true);
  assert.equal(SugarData.getSugarBySlug('cellobiose').reducing, true);
  assert.equal(SugarData.getSugarBySlug('saccharose').reducing, false);
  assert.equal(SugarData.getSugarBySlug('trehalose').reducing, false);
  assert.equal(SugarData.findSugarByName('Birkenzucker').slug, 'xylit');
});

test('Enzyme Lab enforces lock-and-key specificity and lactose intolerance simulation', () => {
  assert.equal(EnzymeLab.evaluateReaction('amylase', 'staerke').cleaved, true);
  assert.equal(EnzymeLab.evaluateReaction('amylase', 'zellulose').cleaved, false);
  assert.equal(EnzymeLab.evaluateReaction('cellulase', 'zellulose').cleaved, true);
  assert.equal(EnzymeLab.evaluateReaction('laktase', 'laktose', { lactoseIntolerant: false }).cleaved, true);
  const intol = EnzymeLab.evaluateReaction('laktase', 'laktose', { lactoseIntolerant: true });
  assert.equal(intol.cleaved, false);
  assert.equal(intol.reasonCode, 'lactose-deficiency');
});

test('Enzyme Lab computeFrameState models intact start, sequential snip, steric clash, and colon transit', () => {
  const matches = [
    ['amylase', 'staerke', 4],
    ['cellulase', 'zellulose', 4],
    ['laktase', 'laktose', 1],
    ['saccharase', 'saccharose', 1],
    ['chitinase', 'chitin', 4],
    ['inulinase', 'inulin', 4]
  ];

  for (const [enzId, subId, expectedBonds] of matches) {
    const f0 = EnzymeLab.computeFrameState(enzId, subId, 0);
    assert.equal(f0.cutCount, 0, `${enzId}+${subId} must start with 0 cut bonds at t=0`);
    assert.equal(f0.totalBonds, expectedBonds);
    assert.equal(f0.finished, false);

    // Mid-cut moment of bond 0 (650 + 0.62*1400 = 1518ms): blades close and flash/H2O appear
    const fCut = EnzymeLab.computeFrameState(enzId, subId, 1518);
    assert.ok(fCut.bladeAngle < 15, `${enzId}+${subId} blades must close during cut (got ${fCut.bladeAngle})`);
    assert.ok(fCut.cutFlash > 0.2, `${enzId}+${subId} cutFlash must spike during cut`);
    assert.equal(fCut.h2o.visible, true);

    const fEnd = EnzymeLab.computeFrameState(enzId, subId, 12000);
    assert.equal(fEnd.finished, true);
    assert.equal(fEnd.cutCount, expectedBonds, `${enzId}+${subId} must cut all ${expectedBonds} bonds`);
    assert.ok(fEnd.unitOffsets.some((o) => Math.abs(o.dx) > 5), 'Cleaved monomers must separate physically');
  }

  const mismatches = [
    ['amylase', 'zellulose'],
    ['cellulase', 'chitin'],
    ['saccharase', 'staerke'],
    ['amylase', 'inulin'],
    ['amylase', 'laktose']
  ];
  for (const [enzId, subId] of mismatches) {
    const res = EnzymeLab.evaluateReaction(enzId, subId);
    assert.equal(res.cleaved, false);
    assert.ok(res.mismatch && res.mismatch.clashPoints.length > 0, `${enzId}+${subId} needs steric clash markers`);
    assert.doesNotMatch(res.headlineDe + res.detailDe, /prallt ab/i, 'Avoid bouncing wording');

    const fClash = EnzymeLab.computeFrameState(enzId, subId, 1600);
    assert.equal(fClash.cutCount, 0);
    assert.ok(fClash.clashIntensity > 0.5, `${enzId}+${subId} must exhibit steric clash intensity`);
  }

  // Lactose intolerance colon transit
  const fIntol = EnzymeLab.computeFrameState('laktase', 'laktose', 2800, { lactoseIntolerant: true });
  assert.equal(fIntol.mode, 'intolerance');
  assert.equal(fIntol.cutCount, 0);
  assert.ok(fIntol.colonTransitProgress > 0.8);
  assert.ok(fIntol.bubbleIntensity > 0.5);
});

test('Polysaccharide Puzzle validates monomer placements and glycosidic bonds across all 5 blueprints', () => {
  assert.equal(PolyPuzzle.PUZZLE_LEVELS.length, 5);
  for (const level of PolyPuzzle.PUZZLE_LEVELS) {
    const placements = PolyPuzzle.createInitialPlacements(level.id);
    const startProg = PolyPuzzle.getProgress(level, placements);
    assert.equal(startProg.filled, 1, `Level ${level.id} starts with 1 anchor monomer prefilled`);
    assert.equal(startProg.completed, false);

    const startBonds = PolyPuzzle.getBondStates(level, placements);
    assert.ok(startBonds.length > 0, `Level ${level.id} defines glycosidic bond connectors`);
    assert.ok(startBonds.every((b) => !b.bothPlaced), 'No bond starts fully connected with only 1 tile placed');

    for (const slot of level.slots) {
      if (slot.prefilled) continue;
      const wrongTile = slot.expected === 'pent-white' ? 'hex-cyan' : 'pent-white';
      assert.equal(PolyPuzzle.canPlaceTile(slot, wrongTile).allowed, false);
      assert.equal(PolyPuzzle.canPlaceTile(slot, slot.expected).allowed, true);
      placements[slot.id] = slot.expected;
    }

    const endProg = PolyPuzzle.getProgress(level, placements);
    assert.equal(endProg.completed, true);
    assert.equal(endProg.percent, 100);
    const endBonds = PolyPuzzle.getBondStates(level, placements);
    assert.ok(endBonds.every((b) => b.bothPlaced), `All glycosidic bonds connect once ${level.id} is solved`);
  }
});

test('Museum Quiz questions have complete bilingual options, explanations, and valid jump targets', () => {
  assert.equal(SugarData.QUIZ_QUESTIONS.length, 10);
  for (const q of SugarData.QUIZ_QUESTIONS) {
    assert.equal(q.optionsDe.length, 4);
    assert.equal(q.optionsEn.length, 4);
    assert.ok(q.correctIndex >= 0 && q.correctIndex < 4);
    assert.ok(q.explainDe.length > 10 && q.explainEn.length > 10);
    assert.ok(['cloud', 'profile', 'stereo', 'enzyme', 'puzzle'].includes(q.jump.station));
  }
});
