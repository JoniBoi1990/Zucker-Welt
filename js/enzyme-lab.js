/**
 * Station 4: Active Enzyme & Digestion Motion-Graphic Lab (Schlüssel-Schloss-Prinzip)
 * Models substrate key silhouettes, sculpted enzyme active-site locks,
 * steric-mismatch collision geometry, and a deterministic 60fps hydrolysis timeline.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
  if (root) {
    root.ZuckerWelt = root.ZuckerWelt || {};
    root.ZuckerWelt.EnzymeLab = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const VIEWBOX = { width: 760, height: 320, pitch: 114, chainY: 206 };

  const SUBSTRATES = [
    {
      id: 'staerke',
      nameDe: 'Stärke (Amylose)',
      nameEn: 'Starch (Amylose)',
      bond: 'α-1→4',
      bondGeometry: 'alpha-down',
      unitShape: 'hex-cyan',
      unitCount: 5,
      pitch: VIEWBOX.pitch,
      chainY: VIEWBOX.chainY,
      bondYOffset: 22,
      monomerDe: 'D-Glucose',
      monomerEn: 'D-Glucose',
      sourceDe: 'Kartoffeln, Brot, Reis, Nudeln',
      sourceEn: 'Potatoes, bread, rice, pasta',
      keyDescDe: 'Aufrechte Sechsringe + tiefe V-förmige α-1→4-Brücke',
      keyDescEn: 'Upright hexoses + deep V-shaped α-1→4 bridge'
    },
    {
      id: 'zellulose',
      nameDe: 'Zellulose',
      nameEn: 'Cellulose',
      bond: 'β-1→4',
      bondGeometry: 'beta-zig',
      unitShape: 'hex-light',
      unitCount: 5,
      pitch: VIEWBOX.pitch,
      chainY: VIEWBOX.chainY,
      bondYOffset: -18,
      monomerDe: 'D-Glucose (180° gedreht)',
      monomerEn: 'D-Glucose (flipped 180°)',
      sourceDe: 'Pflanzenfasern, Gemüse, Holz, Vollkorn',
      sourceEn: 'Plant cell walls, vegetables, wood, bran',
      keyDescDe: 'Jeder 2. Ring um 180° gedreht + hohe β-1→4-Brücke',
      keyDescEn: 'Alternating 180°-flipped rings + elevated β-1→4 bar'
    },
    {
      id: 'laktose',
      nameDe: 'Laktose (Milchzucker)',
      nameEn: 'Lactose (Milk Sugar)',
      bond: 'β-1→4 (Gal–Glc)',
      bondGeometry: 'beta-lactose',
      unitShape: 'dimer-lac',
      unitCount: 2,
      pitch: VIEWBOX.pitch,
      chainY: VIEWBOX.chainY,
      bondYOffset: -6,
      monomerDe: 'D-Galaktose + D-Glucose',
      monomerEn: 'D-Galactose + D-Glucose',
      sourceDe: 'Milch, Joghurt, Molke',
      sourceEn: 'Milk, yogurt, whey',
      keyDescDe: 'Galaktose-Kuppel (C4-OH oben) + diagonale β-1→4-Brücke',
      keyDescEn: 'Galactose C4-OH dome peg + diagonal β-1→4 bridge'
    },
    {
      id: 'saccharose',
      nameDe: 'Saccharose (Haushaltszucker)',
      nameEn: 'Sucrose (Table Sugar)',
      bond: 'α,β-1→2',
      bondGeometry: 'sucrose-bridge',
      unitShape: 'dimer-suc',
      unitCount: 2,
      pitch: VIEWBOX.pitch,
      chainY: VIEWBOX.chainY,
      bondYOffset: 6,
      monomerDe: 'D-Glucose + D-Fruktose',
      monomerEn: 'D-Glucose + D-Fructose',
      sourceDe: 'Zuckerrübe, Zuckerrohr, Obst',
      sourceEn: 'Sugar beet, sugar cane, fruits',
      keyDescDe: 'Sechsring (Glucose) + spitzer Fünfring (Fruktose)',
      keyDescEn: 'Hexagon (Glucose) + pointed pentagon (Fructose)'
    },
    {
      id: 'chitin',
      nameDe: 'Chitin',
      nameEn: 'Chitin',
      bond: 'β-1→4 (GlcNAc)',
      bondGeometry: 'beta-chitin',
      unitShape: 'hex-striped',
      unitCount: 5,
      pitch: VIEWBOX.pitch,
      chainY: VIEWBOX.chainY,
      bondYOffset: -18,
      monomerDe: 'N-Acetylglucosamin',
      monomerEn: 'N-Acetylglucosamine',
      sourceDe: 'Pilze (Champignons), Insekten- & Krabbenpanzer',
      sourceEn: 'Mushrooms, insect & crab exoskeletons',
      keyDescDe: 'Sperrige Acetylamino-Arme (–NH–CO–CH₃) + β-1→4-Brücke',
      keyDescEn: 'Bulky acetamido side-arms (–NH–CO–CH₃) + β-1→4 bridge'
    },
    {
      id: 'inulin',
      nameDe: 'Inulin (Ballaststoff)',
      nameEn: 'Inulin (Prebiotic Fiber)',
      bond: 'β-2→1',
      bondGeometry: 'fructan-beta',
      unitShape: 'pent-white',
      unitCount: 5,
      pitch: VIEWBOX.pitch,
      chainY: VIEWBOX.chainY,
      bondYOffset: -14,
      monomerDe: 'D-Fruktose',
      monomerEn: 'D-Fructose',
      sourceDe: 'Chicorée, Topinambur, Artischocke',
      sourceEn: 'Chicory, Jerusalem artichoke',
      keyDescDe: 'Reine Kette aus Fruktose-Fünfringen (β-2→1)',
      keyDescEn: 'Chain of five-membered fructose pentagons (β-2→1)'
    }
  ];

  /**
   * Sculpted Enzyme Active Sites (centered at 0,0, sized to engage pitch=114 monomers below).
   * Top outer dome rises to ~-70; lower flanking lobes extend to x=±92, y=+38.
   */
  const ENZYMES = [
    {
      id: 'amylase',
      nameDe: 'α-Amylase',
      nameEn: 'α-Amylase',
      originDe: 'Mensch (Speichel & Pankreas)',
      originEn: 'Human (Saliva & Pancreas)',
      humanHasIt: true,
      matchesGeometry: 'alpha-down',
      color: '#38bdf8',
      pocketDescDe: 'Symmetrische Sechsring-Taschen + tiefer V-Keil für α-1→4',
      pocketDescEn: 'Symmetric hexose pockets + deep V-beak for α-1→4',
      // Twin hex recesses at dx=±57 with central deep downward V-beak at (0, +38)
      lockPath: 'M -92,32 C -94,-42 -48,-72 0,-72 C 48,-72 94,-42 92,32 L 76,32 L 72,6 L 57,-2 L 42,6 L 24,18 L 0,40 L -24,18 L -42,6 L -57,-2 L -72,6 L -76,32 Z',
      miniIconPath: 'M -12,8 C -12,-6 -6,-11 0,-11 C 6,-11 12,-6 12,8 L 8,8 L 6,1 L 0,9 L -6,1 L -8,8 Z',
      bladePivot: [0, 8]
    },
    {
      id: 'laktase',
      nameDe: 'Laktase',
      nameEn: 'Lactase',
      originDe: 'Mensch (Dünndarm)',
      originEn: 'Human (Small Intestine)',
      humanHasIt: true,
      matchesGeometry: 'beta-lactose',
      color: '#7dd3fc',
      pocketDescDe: 'Linke runde Kuppel-Tasche für C4-OH der Galaktose + β-1→4-Spalt',
      pocketDescEn: 'Left dome recess for Galactose C4-OH peg + β-1→4 cleft',
      // Left tall rounded dome recess at dx=-57 (for Galactose peg), diagonal center bridge slot, flat right hex pocket
      lockPath: 'M -92,32 C -94,-42 -48,-72 0,-72 C 48,-72 94,-42 92,32 L 76,32 L 72,6 L 57,-2 L 42,6 L 22,12 L 0,14 L -24,8 L -38,2 C -42,-16 -72,-16 -74,6 L -76,32 Z',
      miniIconPath: 'M -12,8 C -12,-6 -6,-11 0,-11 C 6,-11 12,-6 12,8 L 7,8 L 5,2 L 0,5 L -4,1 C -6,-4 -9,-4 -10,2 L -10,8 Z',
      bladePivot: [0, 4]
    },
    {
      id: 'saccharase',
      nameDe: 'Saccharase',
      nameEn: 'Sucrase',
      originDe: 'Mensch (Dünndarm)',
      originEn: 'Human (Small Intestine)',
      humanHasIt: true,
      matchesGeometry: 'sucrose-bridge',
      color: '#bae6fd',
      pocketDescDe: 'Breite linke Sechsring-Tasche + schmale rechte Fünfring-Tasche',
      pocketDescEn: 'Wide left hexagon pocket + narrow pointed right pentagon pocket',
      // Asymmetric: wide hex pocket on left (-57), tight pointed pentagon pocket on right (+57)
      lockPath: 'M -92,32 C -94,-42 -48,-72 0,-72 C 48,-72 90,-40 86,32 L 72,32 L 69,4 L 57,-10 L 45,4 L 22,20 L 0,24 L -24,18 L -42,6 L -57,-2 L -72,6 L -76,32 Z',
      miniIconPath: 'M -12,8 C -12,-6 -6,-11 0,-11 C 6,-11 12,-6 11,8 L 8,8 L 6,-2 L 0,6 L -6,1 L -8,8 Z',
      bladePivot: [0, 8]
    },
    {
      id: 'cellulase',
      nameDe: 'Cellulase',
      nameEn: 'Cellulase',
      originDe: 'Nur Mikroben (Kuh, Termiten)',
      originEn: 'Microbes only (Cow, termites)',
      humanHasIt: false,
      matchesGeometry: 'beta-zig',
      color: '#86efac',
      pocketDescDe: 'Hohe Decken-Aussparung für 180°-gedrehte Glucose + β-1→4-Bogen',
      pocketDescEn: 'Tall ceiling notch for 180°-flipped glucose + β-1→4 arch',
      // Right pocket has deep ceiling notch for 180°-flipped ridge, elevated center arch
      lockPath: 'M -92,32 C -94,-42 -48,-72 0,-72 C 48,-72 94,-42 92,32 L 76,32 L 70,-4 L 62,-18 L 52,-18 L 44,-4 L 22,-4 L 0,4 L -22,12 L -42,6 L -57,-2 L -72,6 L -76,32 Z',
      miniIconPath: 'M -12,8 C -12,-6 -6,-11 0,-11 C 6,-11 12,-6 12,8 L 8,8 L 6,-5 L 2,-5 L 0,3 L -6,1 L -8,8 Z',
      bladePivot: [0, -2]
    },
    {
      id: 'chitinase',
      nameDe: 'Chitinase',
      nameEn: 'Chitinase',
      originDe: 'Pilze, Insekten, Pflanzen',
      originEn: 'Fungi, insects, plants',
      humanHasIt: false,
      matchesGeometry: 'beta-chitin',
      color: '#fde047',
      pocketDescDe: 'Tiefe Seitentaschen für sperrige –NH–CO–CH₃-Gruppen + β-1→4',
      pocketDescEn: 'Deep lateral pockets for bulky –NH–CO–CH₃ arms + β-1→4',
      // Deep T-shaped lateral notches on both pockets for NHAc side arms
      lockPath: 'M -92,32 C -94,-42 -48,-72 0,-72 C 48,-72 94,-42 92,32 L 76,32 L 72,2 L 82,-6 L 68,-18 L 46,-18 L 42,4 L 22,-2 L 0,4 L -22,4 L -42,4 L -46,-18 L -68,-18 L -82,-6 L -72,2 L -76,32 Z',
      miniIconPath: 'M -12,8 C -12,-6 -6,-11 0,-11 C 6,-11 12,-6 12,8 L 8,8 L 9,-4 L 4,-4 L 0,3 L -4,-4 L -9,-4 L -8,8 Z',
      bladePivot: [0, -2]
    },
    {
      id: 'inulinase',
      nameDe: 'Inulinase',
      nameEn: 'Inulinase',
      originDe: 'Darmflora (Bifidobakterien)',
      originEn: 'Gut flora (Bifidobacteria)',
      humanHasIt: false,
      matchesGeometry: 'fructan-beta',
      color: '#c084fc',
      pocketDescDe: 'Zwei schmale Fünfring-Taschen für β-2→1-Fruktoseketten',
      pocketDescEn: 'Twin five-membered furanose pockets for β-2→1 fructan',
      // Twin narrow pointed pentagon recesses at dx=±57 matching Inulin furanose chain
      lockPath: 'M -88,32 C -90,-40 -46,-70 0,-70 C 46,-70 90,-40 88,32 L 72,32 L 69,4 L 57,-12 L 45,4 L 22,6 L 0,2 L -22,6 L -45,4 L -57,-12 L -69,4 L -72,32 Z',
      miniIconPath: 'M -11,8 C -11,-6 -6,-11 0,-11 C 6,-11 11,-6 11,8 L 8,8 L 6,-3 L 0,2 L -6,-3 L -8,8 Z',
      bladePivot: [0, -2]
    }
  ];

  function getLayoutMetrics(substrate) {
    const count = substrate.unitCount;
    const pitch = substrate.pitch || VIEWBOX.pitch;
    const chainY = substrate.chainY || VIEWBOX.chainY;
    const totalSpan = (count - 1) * pitch;
    const startX = (VIEWBOX.width - totalSpan) / 2;
    const unitCentersX = [];
    const bondCentersX = [];
    for (let i = 0; i < count; i++) {
      const ux = startX + i * pitch;
      unitCentersX.push(ux);
      if (i < count - 1) {
        bondCentersX.push(ux + pitch / 2);
      }
    }
    return {
      width: VIEWBOX.width,
      height: VIEWBOX.height,
      pitch,
      chainY,
      startX,
      unitCentersX,
      bondCentersX
    };
  }

  /**
   * Explains the exact steric mismatch (Schlüssel-Schloss conflict) between enzyme & substrate
   * and returns relative coordinates (around enzyme center) for red clash rings and amber gap zones.
   */
  function getMismatchDetails(enzyme, substrate) {
    const sId = substrate.id;
    const eId = enzyme.id;

    // 1. Bulky Chitin NHAc arms collide with any enzyme other than Chitinase
    if (sId === 'chitin' && eId !== 'chitinase') {
      return {
        reasonShortDe: 'Sperrige –NH–CO–CH₃-Arme stoßen am Enzymrand an!',
        reasonShortEn: 'Bulky –NH–CO–CH₃ side arms collide with the enzyme wall!',
        clashPoints: [[-57, -14], [57, -14]],
        gapPoints: [[0, 12, 26, 18]]
      };
    }

    // 2. Cellulose alternating 180°-flipped rings collide where enzyme expects upright C6
    if (sId === 'zellulose' && eId !== 'cellulase') {
      return {
        reasonShortDe: '180°-Drehung & β-1→4-Winkel blockieren das aktive Zentrum!',
        reasonShortEn: '180°-flipped ring & β-1→4 angle block the active site!',
        clashPoints: [[57, -16], [0, 8]],
        gapPoints: [[-57, -8, 22, 14]]
      };
    }

    // 3. Inulin pentagon chain mismatches hexagon pockets
    if (sId === 'inulin') {
      return {
        reasonShortDe: 'Fünfring-Kette (β-2→1) passt in keine Sechsring-Tasche!',
        reasonShortEn: 'Pentagon chain (β-2→1) does not fit hexose pockets!',
        clashPoints: [[0, 6]],
        gapPoints: [[-57, -4, 32, 18], [57, -4, 32, 18]]
      };
    }

    // 4. Saccharase expects a compact pentagon on the right — larger hexoses collide!
    if (eId === 'saccharase' && sId !== 'saccharose') {
      return {
        reasonShortDe: 'Zweiter Sechsring ist zu groß für die schmale Fünfring-Tasche!',
        reasonShortEn: 'Second hexagon is too wide for the narrow pentagon pocket!',
        clashPoints: [[57, -4], [0, 16]],
        gapPoints: []
      };
    }

    // 4b. Inulinase expects two narrow pentagons — hexose rings collide on both sides!
    if (eId === 'inulinase' && sId !== 'inulin') {
      return {
        reasonShortDe: 'Sechsringe sind zu breit für die schmalen Fünfring-Taschen der Inulinase!',
        reasonShortEn: 'Hexose rings are too wide for Inulinase’s narrow pentagon pockets!',
        clashPoints: [[-57, -6], [57, -6]],
        gapPoints: []
      };
    }

    // 5. Lactose galactose C4-OH dome peg collides with enzymes lacking the dome recess
    if (sId === 'laktose' && eId !== 'laktase') {
      return {
        reasonShortDe: 'Axiales C4-OH der Galaktose stößt oben an!',
        reasonShortEn: 'Axial C4-OH peg on Galactose collides at top!',
        clashPoints: [[-57, -14], [0, 10]],
        gapPoints: []
      };
    }

    // 6. Saccharose pentagon leaves hollow gap in hexagon pocket + wrong 1→2 angle
    if (sId === 'saccharose' && eId !== 'saccharase') {
      return {
        reasonShortDe: 'Fünfring zu klein für Sechsring-Tasche · α,β-1→2-Winkel falsch!',
        reasonShortEn: 'Pentagon too small for hexose pocket · α,β-1→2 angle mismatch!',
        clashPoints: [[0, 14]],
        gapPoints: [[57, -4, 34, 18]]
      };
    }

    // 7. Starch α-1→4 deep V-bond vs. elevated β-enzymes (Cellulase / Chitinase / Laktase)
    return {
      reasonShortDe: `Bindungswinkel (${substrate.bond}) verfehlt die katalytische Schere!`,
      reasonShortEn: `Bond angle (${substrate.bond}) misses the catalytic shear site!`,
      clashPoints: [[0, 14]],
      gapPoints: [[-57, -12, 30, 18], [57, -12, 30, 18]]
    };
  }

  /**
   * Evaluates lock-and-key interaction between a chosen enzyme and substrate.
   */
  function evaluateReaction(enzymeId, substrateId, opts = {}) {
    const enzyme = ENZYMES.find((e) => e.id === enzymeId);
    const substrate = SUBSTRATES.find((s) => s.id === substrateId);
    if (!enzyme || !substrate) {
      throw new Error(`Unknown enzyme (${enzymeId}) or substrate (${substrateId})`);
    }

    const lactoseIntolerant = Boolean(opts.lactoseIntolerant);
    if (enzyme.id === 'laktase' && substrate.id === 'laktose' && lactoseIntolerant) {
      return {
        cleaved: false,
        reasonCode: 'lactose-deficiency',
        headlineDe: 'Laktoseintoleranz aktiv: Laktase fehlt!',
        headlineEn: 'Lactose Intolerance Active: Lactase Missing!',
        detailDe: 'Ohne aktives Laktase-Enzym passt der Schlüssel zwar theoretisch, doch es ist kein Enzym zum Schneiden da: Der Milchzucker wandert ungespalten in den Dickdarm und wird dort von Bakterien zu Gasen (H₂, CO₂) vergoren.',
        detailEn: 'Without active lactase, milk sugar passes uncut into the colon, where gut bacteria ferment intact lactose into H₂ and CO₂ gas.',
        mismatch: {
          reasonShortDe: 'Enzymmangel: Laktose wandert ungespalten weiter!',
          reasonShortEn: 'Enzyme deficiency: intact lactose transits to colon!',
          clashPoints: [],
          gapPoints: []
        }
      };
    }

    const matches = enzyme.matchesGeometry === substrate.bondGeometry;
    if (matches) {
      const physiologicalDe = enzyme.humanHasIt
        ? `Schlüssel-Schloss-Treffer! Das aktive Zentrum der ${enzyme.nameDe} umschließt die ${substrate.bond}-Bindung passgenau, nutzt ein Wassermolekül (Hydrolyse) und schneidet ${substrate.nameDe} in resorbierbare Bausteine (${substrate.monomerDe}).`
        : `Treffer im Mikroben-Labor! Die aktive Tasche der ${enzyme.nameDe} passt exakt auf die ${substrate.bond}-Geometrie. Symbiotische Mikroben (z. B. im Kuhpansen) nutzen genau diese molekulare Schere!`;
      const physiologicalEn = enzyme.humanHasIt
        ? `Lock-and-key match! ${enzyme.nameEn}’s active pocket clasps the ${substrate.bond} linkage precisely, recruits water (hydrolysis), and snips ${substrate.nameEn} into absorbable ${substrate.monomerEn}.`
        : `Microbial match! ${enzyme.nameEn}’s pocket aligns seamlessly with ${substrate.bond} geometry, allowing symbiotic microbes to cleave ${substrate.nameEn} into ${substrate.monomerEn}!`;

      return {
        cleaved: true,
        reasonCode: 'cleaved',
        headlineDe: `${enzyme.nameDe} schneidet ${substrate.nameDe}!`,
        headlineEn: `${enzyme.nameEn} cleaves ${substrate.nameEn}!`,
        detailDe: physiologicalDe,
        detailEn: physiologicalEn,
        mismatch: null
      };
    }

    const mismatch = getMismatchDetails(enzyme, substrate);
    let detailDe = `Kein Enzym-Substrat-Komplex: ${mismatch.reasonShortDe} Nach dem Schlüssel-Schloss-Prinzip findet kein Schnitt statt – die Kette bleibt geschlossen.`;
    let detailEn = `No enzyme-substrate complex: ${mismatch.reasonShortEn} By the lock-and-key principle, no hydrolysis occurs and the chain stays intact.`;

    if (substrate.id === 'zellulose' && enzyme.id === 'amylase') {
      detailDe = 'Klassiker der Biochemie: Stärke und Zellulose bestehen BEIDE aus reiner D-Glucose! Weil bei Zellulose jeder zweite Baustein um 180° gedreht ist (β-1→4), stößt der Glucose-Ring oben an und die Schere verfehlt die Bindung – kein Schnitt!';
      detailEn = 'Biochemistry classic: Starch and cellulose are BOTH pure D-glucose! Because every second ring in cellulose is flipped 180° (β-1→4), it collides with α-amylase’s pocket and no cut can happen!';
    } else if (substrate.id === 'inulin') {
      detailDe = 'Sterischer Konflikt: Die Fruktose-Fünfringe der β-2→1-Kette passen in keine unserer menschlichen Sechsring-Taschen. So gelangt Inulin ungeschnitten als Präbiotikum in den Dickdarm.';
      detailEn = 'Steric mismatch: Inulin’s five-membered β-2→1 fructose rings do not match human hexose pockets, so the fiber travels uncut to the colon as a prebiotic.';
    }

    return {
      cleaved: false,
      reasonCode: 'steric-mismatch',
      headlineDe: `${enzyme.nameDe} passt nicht zu ${substrate.nameDe}!`,
      headlineEn: `${enzyme.nameEn} does not fit ${substrate.nameEn}!`,
      detailDe,
      detailEn,
      mismatch
    };
  }

  function clamp01(v) {
    return Math.max(0, Math.min(1, v));
  }

  function easeOutCubic(t) {
    const x = clamp01(t);
    return 1 - Math.pow(1 - x, 3);
  }

  function easeInOutCubic(t) {
    const x = clamp01(t);
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  }

  function lerp(a, b, t) {
    return a + (b - a) * clamp01(t);
  }

  // Per-bond cycle duration in ms for cleavage mode
  const BOND_CYCLE_MS = 1400;
  const APPROACH_MS = 650;
  const FINISH_SETTLE_MS = 900;
  const MISMATCH_DURATION_MS = 2800;
  const INTOL_DURATION_MS = 3200;

  /**
   * Canonical step timestamps for the 4-step teaching stepper (also used under reduced motion).
   */
  const PHASE_TIMESTAMPS = {
    cleaved: [0, 900, 1280, 6800], // Step 1 Approach, Step 2 Lock-and-Key Dock, Step 3 Active Snip, Step 4 Cleaved Result
    mismatch: [0, 820, 1550, 2600],
    intolerance: [0, 650, 1650, 3000]
  };

  /**
   * Deterministic 60fps animation frame calculator.
   * Guarantees:
   * - At elapsedMs = 0: ALL bonds are intact (`bondCutStates` all false, `cutCount === 0`).
   * - In cleavage mode: Enzyme approaches bond 0, docks, recruits H2O, closes blades, snips bond 0..N-1 sequentially,
   *   and smoothly separates the cleaved fragments.
   * - In mismatch mode: Enzyme descends toward center bond, hits steric clash (`clashIntensity > 0`), tilts & recoils up.
   * - In lactose-deficiency mode: Ghostly missing lactase fades out while intact lactose transits into colon bacteria zone.
   */
  function computeFrameState(enzymeId, substrateId, elapsedMs, opts = {}) {
    const enzyme = ENZYMES.find((e) => e.id === enzymeId) || ENZYMES[0];
    const substrate = SUBSTRATES.find((s) => s.id === substrateId) || SUBSTRATES[0];
    const metrics = getLayoutMetrics(substrate);
    const totalBonds = metrics.bondCentersX.length;
    const reaction = evaluateReaction(enzyme.id, substrate.id, opts);
    const t = Math.max(0, Number(elapsedMs) || 0);

    const baseUnits = Array.from({ length: substrate.unitCount }, () => ({ dx: 0, dy: 0, rot: 0 }));
    const bondCutStates = Array(totalBonds).fill(false);
    const h2oDefault = { visible: false, x: metrics.bondCentersX[0], y: 60, splitProgress: 0 };

    // -----------------------------------------------------------------------
    // MODE A: LACTOSE INTOLERANCE (Lactase missing -> intact transit to colon)
    // -----------------------------------------------------------------------
    if (reaction.reasonCode === 'lactose-deficiency') {
      const p = clamp01(t / INTOL_DURATION_MS);
      const transit = p < 0.25 ? 0 : easeInOutCubic((p - 0.25) / 0.65);
      const shiftX = lerp(0, 150, transit);
      const phase =
        p < 0.22 ? 'approach' :
        p < 0.72 ? 'intolerance-transit' : 'completed';
      const phaseStep =
        p < 0.22 ? 1 :
        p < 0.50 ? 2 :
        p < 0.80 ? 3 : 4;

      const unitOffsets = baseUnits.map((_, i) => ({
        dx: shiftX,
        dy: p > 0.75 ? Math.sin((p - 0.75) * 18 + i) * 3 : 0,
        rot: 0
      }));

      return {
        mode: 'intolerance',
        phase,
        phaseStep,
        enzymeX: metrics.bondCentersX[0],
        enzymeY: 96,
        enzymeRot: 0,
        enzymeOpacity: lerp(0.55, 0.22, clamp01(p * 2)),
        bladeAngle: 34,
        fitGlow: 0,
        clashIntensity: 0,
        cutFlash: 0,
        activeBondIndex: 0,
        h2o: h2oDefault,
        bondCutStates,
        unitOffsets,
        cutCount: 0,
        totalBonds,
        colonTransitProgress: transit,
        bubbleIntensity: clamp01((p - 0.62) / 0.3),
        finished: t >= INTOL_DURATION_MS,
        totalDurationMs: INTOL_DURATION_MS
      };
    }

    // -----------------------------------------------------------------------
    // MODE B: STERIC MISMATCH (Key does not fit Lock -> Clash & Recoil)
    // -----------------------------------------------------------------------
    if (!reaction.cleaved) {
      const centerBondIdx = Math.floor(totalBonds / 2);
      const targetX = metrics.bondCentersX[centerBondIdx];
      const p = clamp01(t / MISMATCH_DURATION_MS);

      let enzymeY = 92;
      let enzymeRot = 0;
      let clashIntensity = 0;
      let phase = 'approach';
      let phaseStep = 1;

      if (p < 0.28) {
        // Phase 1: Descending smoothly toward the substrate key
        const u = easeOutCubic(p / 0.28);
        enzymeY = lerp(86, 128, u);
        phase = 'approach';
        phaseStep = 1;
      } else if (p < 0.45) {
        // Phase 2: Probing the lock pocket -> hits steric obstacle at y=136!
        const u = easeInOutCubic((p - 0.28) / 0.17);
        enzymeY = lerp(128, 138, u);
        enzymeRot = lerp(0, -4, u);
        clashIntensity = u * 0.85;
        phase = 'probe';
        phaseStep = 2;
      } else if (p < 0.78) {
        // Phase 3: Active steric clash pulse + side-to-side rejection wobble
        const u = (p - 0.45) / 0.33;
        const wobble = Math.sin(u * Math.PI * 3);
        enzymeY = 136 - Math.abs(wobble) * 5;
        enzymeRot = wobble * 9;
        clashIntensity = 0.75 + 0.25 * Math.abs(wobble);
        phase = 'clash';
        phaseStep = 3;
      } else {
        // Phase 4: Recoils back up clearly separated, showing conflict badge
        const u = easeOutCubic((p - 0.78) / 0.22);
        enzymeY = lerp(134, 96, u);
        enzymeRot = lerp(6, -3, u);
        clashIntensity = lerp(0.95, 0.72, u);
        phase = p >= 0.98 ? 'completed' : 'recoil';
        phaseStep = 4;
      }

      return {
        mode: 'mismatch',
        phase,
        phaseStep,
        enzymeX: targetX,
        enzymeY,
        enzymeRot,
        enzymeOpacity: 1,
        bladeAngle: 34,
        fitGlow: 0,
        clashIntensity,
        cutFlash: 0,
        activeBondIndex: centerBondIdx,
        h2o: h2oDefault,
        bondCutStates,
        unitOffsets: baseUnits,
        cutCount: 0,
        totalBonds,
        colonTransitProgress: 0,
        bubbleIntensity: 0,
        finished: t >= MISMATCH_DURATION_MS,
        totalDurationMs: MISMATCH_DURATION_MS
      };
    }

    // -----------------------------------------------------------------------
    // MODE C: CLEAVAGE (Schlüssel-Schloss Match -> Sequential Hydrolysis Snips!)
    // -----------------------------------------------------------------------
    const totalDurationMs = APPROACH_MS + totalBonds * BOND_CYCLE_MS + FINISH_SETTLE_MS;
    const clampedT = Math.min(t, totalDurationMs);

    // Track exact completion progress [0..1] for each bond's snip
    const bondCutProgress = Array(totalBonds).fill(0);

    let enzymeX = metrics.bondCentersX[0];
    let enzymeY = 88;
    let enzymeRot = 0;
    let bladeAngle = 36;
    let fitGlow = 0;
    let cutFlash = 0;
    let activeBondIndex = 0;
    let phase = 'approach';
    let phaseStep = 1;
    let h2o = { ...h2oDefault };

    if (clampedT < APPROACH_MS) {
      const u = easeOutCubic(clampedT / APPROACH_MS);
      enzymeX = metrics.bondCentersX[0];
      enzymeY = lerp(84, 134, u);
      bladeAngle = lerp(38, 34, u);
      fitGlow = u * 0.35;
      phase = 'approach';
      phaseStep = 1;
    } else if (clampedT < APPROACH_MS + totalBonds * BOND_CYCLE_MS) {
      const cycleElapsed = clampedT - APPROACH_MS;
      const idx = Math.min(totalBonds - 1, Math.floor(cycleElapsed / BOND_CYCLE_MS));
      const localP = (cycleElapsed - idx * BOND_CYCLE_MS) / BOND_CYCLE_MS;
      activeBondIndex = idx;

      for (let b = 0; b < idx; b++) {
        bondCutStates[b] = true;
        bondCutProgress[b] = 1;
      }

      const prevX = idx === 0 ? metrics.bondCentersX[0] : metrics.bondCentersX[idx - 1];
      const currX = metrics.bondCentersX[idx];

      if (localP < 0.25) {
        // Slide/dock onto bond[idx]
        const u = easeInOutCubic(localP / 0.25);
        enzymeX = idx === 0 ? currX : lerp(prevX, currX, u);
        enzymeY = idx === 0 ? lerp(134, 148, u) : lerp(124, 148, Math.sin(u * Math.PI) * -0.35 + u);
        if (idx > 0) {
          enzymeY = 148 - Math.sin(u * Math.PI) * 24;
        }
        bladeAngle = 36;
        fitGlow = lerp(0.35, 1, u);
        phase = 'dock';
        phaseStep = 2;
      } else if (localP < 0.50) {
        // Lock engaged + H2O enters active site for hydrolysis!
        const u = easeOutCubic((localP - 0.25) / 0.25);
        enzymeX = currX;
        enzymeY = 148;
        bladeAngle = lerp(36, 26, u);
        fitGlow = 1;
        phase = 'hydrolysis';
        phaseStep = 2;
        h2o = {
          visible: true,
          x: currX,
          y: lerp(96, metrics.chainY + (substrate.bondYOffset || 0) - 6, u),
          splitProgress: 0
        };
      } else if (localP < 0.72) {
        // ACTIVE SCISSOR SNIP! Blades snap shut (26° -> 2°), cutFlash spikes, bond cuts!
        const u = easeOutCubic((localP - 0.50) / 0.22);
        enzymeX = currX;
        enzymeY = 148 + Math.sin(u * Math.PI) * 4;
        bladeAngle = lerp(26, 2, u);
        fitGlow = 1;
        cutFlash = Math.sin(u * Math.PI);
        if (u >= 0.35) {
          bondCutStates[idx] = true;
          bondCutProgress[idx] = clamp01((u - 0.35) / 0.65) * 0.45;
        }
        h2o = {
          visible: true,
          x: currX,
          y: metrics.chainY + (substrate.bondYOffset || 0),
          splitProgress: u * 0.5
        };
        phase = 'cut';
        phaseStep = 3;
      } else {
        // Release & blades reopen while cleaved monomer drifts apart
        const u = easeOutCubic((localP - 0.72) / 0.28);
        enzymeX = currX;
        enzymeY = lerp(148, 128, u);
        bladeAngle = lerp(2, 34, u);
        fitGlow = lerp(1, 0.2, u);
        bondCutStates[idx] = true;
        bondCutProgress[idx] = 0.45 + u * 0.55;
        h2o = {
          visible: u < 0.85,
          x: currX,
          y: metrics.chainY + (substrate.bondYOffset || 0),
          splitProgress: 0.5 + u * 0.5
        };
        phase = 'release';
        phaseStep = 3;
      }
    } else {
      // All bonds cut -> enzyme lifts smoothly to resting triumph pose
      const settleU = easeOutCubic((clampedT - (APPROACH_MS + totalBonds * BOND_CYCLE_MS)) / FINISH_SETTLE_MS);
      for (let b = 0; b < totalBonds; b++) {
        bondCutStates[b] = true;
        bondCutProgress[b] = 1;
      }
      activeBondIndex = totalBonds - 1;
      enzymeX = lerp(metrics.bondCentersX[totalBonds - 1], VIEWBOX.width / 2, settleU);
      enzymeY = lerp(128, 92, settleU);
      bladeAngle = 32;
      fitGlow = 0;
      phase = clampedT >= totalDurationMs ? 'completed' : 'settle';
      phaseStep = 4;
    }

    // Compute smooth physical separation offsets for every monomer based on cut progress
    // Keep all units strictly inside [76, 684] horizontally and [160, 250] vertically
    const maxSpread = substrate.unitCount === 2 ? 44 : 18;
    const unitOffsets = baseUnits.map((_, i) => {
      // Monomer i separates from left neighbor when bond[i-1] is cut and from right neighbor when bond[i] is cut
      let dx = 0;
      let dy = 0;
      let rot = 0;
      const leftCut = i > 0 ? bondCutProgress[i - 1] : 0;
      const rightCut = i < totalBonds ? bondCutProgress[i] : 0;

      if (substrate.unitCount === 2) {
        dx = i === 0 ? -rightCut * maxSpread : leftCut * maxSpread;
        dy = i === 0 ? rightCut * 10 : -leftCut * 10;
        rot = i === 0 ? -rightCut * 7 : leftCut * 7;
      } else {
        // Cumulative drift from center outwards as bonds sever
        const centerIdx = (substrate.unitCount - 1) / 2;
        const sign = i < centerIdx ? -1 : 1;
        const localActivity = Math.max(leftCut, rightCut);
        const distFactor = Math.abs(i - centerIdx);
        dx = sign * distFactor * maxSpread * localActivity;
        dy = (i % 2 === 0 ? 12 : -10) * leftCut + (i === 0 ? rightCut * 10 : 0);
        rot = (i % 2 === 0 ? -7 : 7) * localActivity;
      }
      return { dx, dy, rot };
    });

    const cutCount = bondCutStates.filter(Boolean).length;

    return {
      mode: 'cleaved',
      phase,
      phaseStep,
      enzymeX,
      enzymeY,
      enzymeRot,
      enzymeOpacity: 1,
      bladeAngle,
      fitGlow,
      clashIntensity: 0,
      cutFlash,
      activeBondIndex,
      h2o,
      bondCutStates,
      unitOffsets,
      cutCount,
      totalBonds,
      colonTransitProgress: 0,
      bubbleIntensity: 0,
      finished: t >= totalDurationMs,
      totalDurationMs
    };
  }

  return {
    VIEWBOX,
    SUBSTRATES,
    ENZYMES,
    PHASE_TIMESTAMPS,
    getLayoutMetrics,
    getMismatchDetails,
    evaluateReaction,
    computeFrameState
  };
});
