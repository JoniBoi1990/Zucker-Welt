/**
 * Stereochemistry & Ring Cyclization Engine for Monosaccharides
 * Supports all 42 stereoisomers across Aldoses (C4, C5, C6) and 2-Ketoses (C4, C5, C6),
 * plus Glyceraldehyde / Dihydroxyacetone (C3), Epimer/Enantiomer/Diastereomer detection,
 * and IUPAC-accurate Fischer-to-Haworth (FLOH rule) Pyranose & Furanose cyclization.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
  if (root) {
    root.ZuckerWelt = root.ZuckerWelt || {};
    root.ZuckerWelt.Stereo = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  // D-series base lookup keyed by chiral OH directions ('R' = right, 'L' = left) from top chiral C to bottom chiral C
  const D_ALDOSE_NAMES = {
    // n = 3 (1 chiral center: C2)
    1: {
      R: { de: 'Glycerinaldehyd', en: 'Glyceraldehyde', slug: 'glycerinaldehyd' }
    },
    // n = 4 (2 chiral centers: C2, C3)
    2: {
      RR: { de: 'Erythrose', en: 'Erythrose', slug: 'erythrose' },
      LR: { de: 'Threose', en: 'Threose', slug: 'threose' }
    },
    // n = 5 (3 chiral centers: C2, C3, C4)
    3: {
      RRR: { de: 'Ribose', en: 'Ribose', slug: 'ribose' },
      LRR: { de: 'Arabinose', en: 'Arabinose', slug: 'arabinose-d' },
      RLR: { de: 'Xylose', en: 'Xylose', slug: 'xylose' },
      LLR: { de: 'Lyxose', en: 'Lyxose', slug: 'lyxose' }
    },
    // n = 6 (4 chiral centers: C2, C3, C4, C5)
    4: {
      RRRR: { de: 'Allose', en: 'Allose', slug: 'allose' },
      LRRR: { de: 'Altrose', en: 'Altrose', slug: 'altrose' },
      RLRR: { de: 'Glucose', en: 'Glucose', slug: 'glucose' },
      LLRR: { de: 'Mannose', en: 'Mannose', slug: 'mannose' },
      RRLR: { de: 'Gulose', en: 'Gulose', slug: 'gulose' },
      LRLR: { de: 'Idose', en: 'Idose', slug: 'idose' },
      RLLR: { de: 'Galaktose', en: 'Galactose', slug: 'galaktose' },
      LLLR: { de: 'Talose', en: 'Talose', slug: 'talose' }
    }
  };

  const D_KETOSE_NAMES = {
    // n = 4 (1 chiral center: C3)
    1: {
      R: { de: 'Erythrulose', en: 'Erythrulose', slug: 'erythrulose' }
    },
    // n = 5 (2 chiral centers: C3, C4)
    2: {
      RR: { de: 'Ribulose', en: 'Ribulose', slug: 'ribulose' },
      LR: { de: 'Xylulose', en: 'Xylulose', slug: 'xylulose' }
    },
    // n = 6 (3 chiral centers: C3, C4, C5)
    3: {
      RRR: { de: 'Psicose', en: 'Psicose (Allulose)', slug: 'psicose' },
      LRR: { de: 'Fruktose', en: 'Fructose', slug: 'fruktose' },
      RLR: { de: 'Sorbose', en: 'Sorbose', slug: 'sorbose' },
      LLR: { de: 'Tagatose', en: 'Tagatose', slug: 'tagatose' }
    }
  };

  const STEREO_NOTES = {
    'D-Allose': {
      de: 'Alle vier OH-Gruppen zeigen nach rechts! Kommt selten in der Natur vor (z. B. in afrikanischen Protea-Sträuchern).',
      en: 'All four OH groups point right! A rare monosaccharide found in African Protea shrubs.'
    },
    'L-Allose': {
      de: 'Das exakte Spiegelbild (Enantiomer) der D-Allose: Alle vier OH-Gruppen zeigen nach links.',
      en: 'The exact mirror image (enantiomer) of D-Allose: all four OH groups point left.'
    },
    'D-Altrose': {
      de: 'C2-Epimer der D-Allose. Kommt natürlich in bestimmten Bakterien (Butyrivibrio fibrisolvens) vor.',
      en: 'C2-epimer of D-Allose. Occurs naturally in certain bacteria (Butyrivibrio fibrisolvens).'
    },
    'D-Glucose': {
      de: 'Traubenzucker („Ta-tü-ta-ta“: rechts-links-rechts-rechts) – der wichtigste Energielieferant des Lebens und Baustein von Stärke, Glykogen und Zellulose!',
      en: 'Grape sugar (right-left-right-right) — life’s central energy fuel and monomer of starch, glycogen, and cellulose!'
    },
    'L-Glucose': {
      de: 'Spiegelbild der D-Glucose: Schmeckt genauso süß, kann aber von unseren Enzymen (Hexokinase) nicht abgebaut werden!',
      en: 'Mirror image of D-Glucose: tastes just as sweet, yet cannot be phosphorylated by human hexokinase!'
    },
    'D-Mannose': {
      de: 'C2-Epimer der D-Glucose. Wichtiger Baustein von Glykoproteinen auf menschlichen Zelloberflächen und pflanzlichen Mannanen.',
      en: 'C2-epimer of D-Glucose. Essential component of cell-surface glycoproteins and plant mannans.'
    },
    'D-Gulose': {
      de: 'Seltener Sirup-Zucker mit süßlichem Geschmack; kommt in Archaeen und einigen Bakterien vor.',
      en: 'Rare syrupy hexose with a sweet taste; present in archaea and certain bacteria.'
    },
    'D-Idose': {
      de: 'Wichtig als Vorstufe der L-Iduronsäure in Glykosaminoglykanen wie Heparin und Dermatansulfat.',
      en: 'Important related hexose to L-iduronic acid in glycosaminoglycans such as heparin.'
    },
    'L-Idose': {
      de: 'Spannender Aha-Effekt: Dreht man bei D-Glucose nur C5 um, entsteht NICHT L-Glucose, sondern das Diastereomer L-Idose!',
      en: 'Classic chemistry surprise: flipping only C5 of D-Glucose yields the diastereomer L-Idose, NOT L-Glucose!'
    },
    'D-Galaktose': {
      de: 'Schleimzucker (C4-Epimer der D-Glucose). Bildet zusammen mit D-Glucose den Milchzucker (Laktose).',
      en: 'C4-epimer of D-Glucose. Combines with D-Glucose to form milk sugar (lactose).'
    },
    'D-Talose': {
      de: 'Seltene Hexose (C2-Epimer der D-Galaktose), isoliert aus Antibiotika bestimmter Streptomyceten.',
      en: 'Rare hexose (C2-epimer of D-Galactose) isolated from actinomycete antibiotics.'
    },
    'D-Ribose': {
      de: 'Unverzichtbarer Pentose-Baustein der RNA (Ribonukleinsäure) sowie des universellen Energieträgers ATP!',
      en: 'Indispensable pentose backbone unit of RNA as well as the universal energy currency ATP!'
    },
    'D-Arabinose': {
      de: 'Seltenere D-Form der Arabinose; in Pflanzenzellwänden überwiegt interessanterweise ihr Spiegelbild L-Arabinose!',
      en: 'Less common D-enantiomer; unusually in nature, its mirror image L-Arabinose is much more abundant in plants!'
    },
    'L-Arabinose': {
      de: 'Ausnahme in der Natur: Obwohl ein L-Zucker, ist L-Arabinose in Pektin, Hemizellulose und Gummi Arabicum weit verbreitet!',
      en: 'Nature’s famous L-sugar exception: abundant in pectin, hemicellulose, and gum arabic!'
    },
    'D-Xylose': {
      de: 'Holzzucker! Einer der häufigsten Zucker auf der Erde als Hauptbestandteil pflanzlicher Hemizellulosen; Ausgangsstoff für Xylit.',
      en: 'Wood sugar! One of Earth’s most abundant sugars in plant hemicellulose; precursor to xylitol.'
    },
    'D-Lyxose': {
      de: 'Sehr seltene Aldopentose, die u. a. in bakteriellen Glykolipiden von Mykobakterien vorkommt.',
      en: 'Rare aldopentose occurring mainly in mycobacterial glycolipids.'
    },
    'D-Erythrose': {
      de: 'Aldotetrose; ihr Phosphorsäureester (Erythrose-4-phosphat) ist ein zentrales Zwischenprodukt im Calvin-Zyklus der Fotosynthese.',
      en: 'Aldotetrose whose 4-phosphate ester is a central intermediate in the photosynthetic Calvin cycle.'
    },
    'D-Threose': {
      de: 'Diastereomer der Erythrose; Namensgeberin für die „threo“-Konfiguration und die Aminosäure Threonin.',
      en: 'Diastereomer of erythrose; namesake of the stereochemical "threo" descriptor and the amino acid threonine.'
    },
    'D-Fruktose': {
      de: 'Fruchtzucker! Die wichtigste Ketohexose mit der höchsten Süßkraft unter den natürlichen Zuckern. An C3–C5 baugleich mit D-Glucose!',
      en: 'Fruit sugar! The most important ketohexose and sweetest common natural sugar. Matches D-Glucose at C3–C5!'
    },
    'D-Psicose': {
      de: 'Auch D-Allulose genannt: Ein kalorienarmer „Rare Sugar“ (ca. 70 % Süßkraft von Haushaltszucker, kaum verwertbare Kalorien).',
      en: 'Also called D-Allulose: a low-calorie rare sugar (~70% sucrose sweetness, minimal caloric value).'
    },
    'L-Sorbose': {
      de: 'Berühmter L-Ketozucker: Kommt in Vogelbeeren vor und ist das Schlüssel-Zwischenprodukt der industriellen Vitamin-C-Synthese!',
      en: 'Famous L-ketohexose found in rowanberries and key intermediate in industrial Vitamin C synthesis!'
    },
    'D-Sorbose': {
      de: 'Das D-Enantiomer der Sorbose (C3,C5-rechts, C4-links). In der Technik ist vor allem ihr Spiegelbild L-Sorbose bedeutend.',
      en: 'The D-enantiomer of sorbose; industrially its mirror image L-sorbose is crucial for Vitamin C production.'
    },
    'D-Tagatose': {
      de: 'Zahnfreundliche Ketohexose aus erhitzten Milchprodukten (C4-Epimer der Fruktose) mit geringem Einfluss auf den Blutzucker.',
      en: 'Tooth-friendly ketohexose found in heated dairy products (C4-epimer of fructose) with low glycemic impact.'
    },
    'D-Ribulose': {
      de: 'Als Ribulose-1,5-bisphosphat (RuBP) der CO₂-Akzeptor der Fotosynthese – gebunden von RuBisCO, dem häufigsten Enzym der Erde!',
      en: 'As ribulose-1,5-bisphosphate (RuBP), the primary CO₂ acceptor in photosynthesis via RuBisCO!'
    },
    'D-Xylulose': {
      de: 'Ketopentose des Pentosephosphatwegs im Zellstoffwechsel (C3-Epimer der D-Ribulose).',
      en: 'Ketopentose active in the cellular pentose phosphate pathway (C3-epimer of D-Ribulose).'
    },
    'D-Erythrulose': {
      de: 'Einfachste chirale Ketotetrose; kommt in roten Himbeeren vor und reagiert mit Haut-Aminosäuren in sanften Selbstbräunern!',
      en: 'Simplest chiral ketotetrose; occurs in red raspberries and reacts with skin amino acids in sunless tanners!'
    },
    'L-Galaktose': {
      de: 'Natürlicher L-Zucker in Meeresalgen-Agar und biologische Vorstufe der L-Fucose auf unseren roten Blutkörperchen (Blutgruppe 0)!',
      en: 'Natural L-hexose present in seaweed agar and biosynthetic precursor to L-fucose on human blood type O cells!'
    },
    'L-Mannose': {
      de: 'Spiegelbild der D-Mannose und Grundgerüst des wichtigen Pflanzen- und Bakterienzuckers L-Rhamnose (6-Desoxy-L-Mannose).',
      en: 'Mirror image of D-mannose and stereochemical parent of L-rhamnose (6-deoxy-L-mannose) in plant pectins.'
    },
    'L-Ribose': {
      de: 'Spiegelbild des RNA-Zuckers D-Ribose: Weil körpereigene Nukleasen L-Zucker nicht spalten, dient L-Ribose als Baustein moderner Spiegelmer-Medikamente!',
      en: 'Mirror image of RNA’s D-ribose: resistant to cellular nucleases, making it a prized scaffold in L-nucleoside antivirals and Spiegelmers!'
    },
    'L-Fruktose': {
      de: 'Nicht-natürliches Spiegelbild des Fruchtzuckers: Schmeckt süß, liefert aber keine Kalorien, da menschliche Enzyme auf D-Fruktose spezialisiert sind.',
      en: 'Non-natural mirror image of fruit sugar: tastes sweet yet yields zero metabolic energy because human enzymes recognize D-fructose.'
    },
    'L-Xylose': {
      de: 'Spiegelbild des Holzzuckers D-Xylose; das Antivirus-Medikament Telbivudin basiert auf einem L-Nukleosid-Analogon.',
      en: 'Enantiomer of wood sugar D-xylose; L-sugar nucleoside analogs inspire modern selective antiviral drugs.'
    },
    'L-Tagatose': {
      de: 'Spiegelbild der D-Tagatose (C3,C4-rechts, C5-links) – ein seltener Synthesebaustein der asymmetrischen Naturstoffchemie.',
      en: 'Enantiomer of D-tagatose used as a chiral building block in asymmetric natural-product synthesis.'
    }
  };

  function invertDir(d) {
    return d === 'R' ? 'L' : 'R';
  }

  function invertAll(dirs) {
    return dirs.map(invertDir);
  }

  /**
   * Returns default initial OH directions for a given sugar class & carbon count.
   * Notice Image 1 starts Aldosen 6 on D-Allose (['R','R','R','R'])!
   */
  function getDefaultDirections(sugarClass, carbons) {
    const chiralCount = sugarClass === 'aldose' ? carbons - 2 : carbons - 3;
    return Array(Math.max(0, chiralCount)).fill('R');
  }

  /**
   * Identifies a monosaccharide from its class ('aldose' | 'ketose'), carbon count (4, 5, 6),
   * and array of chiral OH directions ('R' or 'L') from top chiral C to bottom chiral C.
   */
  function identifyStereoisomer(sugarClass, carbons, dirs) {
    const expectedChiral = sugarClass === 'aldose' ? carbons - 2 : carbons - 3;
    if (!Array.isArray(dirs) || dirs.length !== expectedChiral) {
      throw new Error(`Invalid chiral directions length for ${sugarClass} C${carbons}: expected ${expectedChiral}, got ${dirs && dirs.length}`);
    }

    const lastDir = dirs[dirs.length - 1];
    const series = lastDir === 'R' ? 'D' : 'L';
    const lookupKey = (series === 'D' ? dirs : invertAll(dirs)).join('');
    const table = sugarClass === 'aldose' ? D_ALDOSE_NAMES[expectedChiral] : D_KETOSE_NAMES[expectedChiral];
    const entry = table ? table[lookupKey] : null;

    if (!entry) {
      throw new Error(`Unknown stereoisomer configuration ${lookupKey} for ${sugarClass} C${carbons}`);
    }

    const fullDe = `${series}-${entry.de}`;
    const fullEn = `${series}-${entry.en}`;
    // Special slug override for L-Arabinose which has its own museum entry!
    let slug = entry.slug;
    if (entry.de === 'Arabinose') {
      slug = series === 'L' ? 'arabinose-l' : 'arabinose-d';
    }

    const firstChiralC = sugarClass === 'aldose' ? 2 : 3;
    const chiralCarbons = dirs.map((dir, i) => ({
      carbonNumber: firstChiralC + i,
      ohSide: dir, // 'R' or 'L'
      isSeriesDeterminant: i === dirs.length - 1
    }));

    const fallbackNote = series === 'L'
      ? {
          de: `L-Enantiomer (Spiegelbild) von D-${entry.de}. Am untersten chiralen Zentrum (C${carbons - 1}) zeigt die OH-Gruppe nach links.`,
          en: `L-enantiomer (mirror image) of D-${entry.en}. At the highest-numbered chiral center (C${carbons - 1}), the OH group points left.`
        }
      : {
          de: `D-Stereoisomer aus der Familie der ${sugarClass === 'aldose' ? 'Aldosen' : 'Ketosen'} mit ${carbons} Kohlenstoffatomen.`,
          en: `D-stereoisomer belonging to the ${sugarClass === 'aldose' ? 'aldoses' : 'ketoses'} with ${carbons} carbon atoms.`
        };

    return {
      sugarClass,
      carbons,
      series,
      baseNameDe: entry.de,
      baseNameEn: entry.en,
      nameDe: fullDe,
      nameEn: fullEn,
      slug,
      dirs: [...dirs],
      enantiomerDirs: invertAll(dirs),
      chiralCarbons,
      totalStereoisomers: Math.pow(2, expectedChiral),
      formula: `C${carbons}H${carbons * 2}O${carbons}`,
      note: STEREO_NOTES[fullDe] || fallbackNote
    };
  }

  /**
   * Computes stereochemical relationship between two isomers of the same class & carbon count.
   */
  function compareStereoisomers(dirsA, dirsB, firstChiralC = 2) {
    if (dirsA.length !== dirsB.length) return { type: 'different-constitution' };
    const diffs = [];
    for (let i = 0; i < dirsA.length; i++) {
      if (dirsA[i] !== dirsB[i]) diffs.push(firstChiralC + i);
    }
    if (diffs.length === 0) {
      return { type: 'identical', de: 'Identisch', en: 'Identical', diffCarbons: [] };
    }
    if (diffs.length === dirsA.length) {
      return {
        type: 'enantiomer',
        de: 'Enantiomer (exaktes Bild & Spiegelbild)',
        en: 'Enantiomer (non-superimposable mirror image)',
        diffCarbons: diffs
      };
    }
    if (diffs.length === 1) {
      return {
        type: 'epimer',
        de: `C${diffs[0]}-Epimer (unterscheidet sich nur an C${diffs[0]})`,
        en: `C${diffs[0]}-Epimer (differs solely at C${diffs[0]})`,
        diffCarbons: diffs
      };
    }
    return {
      type: 'diastereomer',
      de: `Diastereomer (Abweichung an ${diffs.map(c => 'C' + c).join(', ')})`,
      en: `Diastereomer (differs at ${diffs.map(c => 'C' + c).join(', ')})`,
      diffCarbons: diffs
    };
  }

  /**
   * Computes Haworth ring projection substituents using IUPAC & FLOH rule:
   * "Was in Fischer LINKS steht, steht im Haworth OBEN!"
   * Supports:
   * - Aldohexose -> Pyranose (6-ring: C1..C5 + O, exocyclic C6 at C5)
   * - Aldopentose -> Furanose (5-ring: C1..C4 + O, exocyclic C5 at C4) or Pyranose (6-ring: C1..C5 + O)
   * - Ketohexose -> Furanose (5-ring: C2..C5 + O, exocyclic C1 at C2 & C6 at C5) or Pyranose (6-ring: C2..C6 + O)
   */
  function buildHaworthModel(sugarClass, carbons, dirs, anomer = 'alpha', ringSize = null) {
    const info = identifyStereoisomer(sugarClass, carbons, dirs);
    const isD = info.series === 'D';

    // Choose biologically dominant ring size if not specified
    const resolvedRing = ringSize || (
      (sugarClass === 'aldose' && carbons === 6) ? 6 :
      (sugarClass === 'aldose' && carbons === 5) ? 5 :
      (sugarClass === 'ketose' && carbons === 6) ? 5 :
      5
    );

    if (carbons < 5) {
      return {
        supported: false,
        reasonDe: 'Tetrosen (4 C-Atome) bilden nur gespannte Fünfringe (Furanosen) ohne exocyclische Gruppe.',
        reasonEn: 'Tetroses (4 carbons) rarely form stable unstrained pyranose rings.'
      };
    }

    // Anomeric OH orientation:
    // In D-sugars: alpha = DOWN ('down'), beta = UP ('up')
    // In L-sugars: alpha = UP ('up'), beta = DOWN ('down')
    const anomericOh = isD
      ? (anomer === 'alpha' ? 'down' : 'up')
      : (anomer === 'alpha' ? 'up' : 'down');

    const ringVertices = [];
    let ringTypeDe = '';
    let ringTypeEn = '';

    const stemDe = info.baseNameDe.replace(/ose$/i, '');
    const stemEn = info.baseNameEn.split(' ')[0].replace(/ose$/i, '');

    if (sugarClass === 'aldose' && carbons === 6 && resolvedRing === 6) {
      // Aldohexopyranose: C1 (anomeric), C2 (dirs[0]), C3 (dirs[1]), C4 (dirs[2]), C5 (C6H2OH up for D, down for L)
      ringTypeDe = `${anomer === 'alpha' ? 'α' : 'β'}-${info.series}-${stemDe}opyranose`;
      ringTypeEn = `${anomer === 'alpha' ? 'α' : 'β'}-${info.series}-${stemEn}opyranose`;
      ringVertices.push(
        { c: 1, top: anomericOh === 'up' ? 'OH' : 'H', bottom: anomericOh === 'down' ? 'OH' : 'H', isAnomeric: true },
        { c: 2, top: dirs[0] === 'L' ? 'OH' : 'H', bottom: dirs[0] === 'R' ? 'OH' : 'H' },
        { c: 3, top: dirs[1] === 'L' ? 'OH' : 'H', bottom: dirs[1] === 'R' ? 'OH' : 'H' },
        { c: 4, top: dirs[2] === 'L' ? 'OH' : 'H', bottom: dirs[2] === 'R' ? 'OH' : 'H' },
        { c: 5, top: isD ? 'CH₂OH' : 'H', bottom: isD ? 'H' : 'CH₂OH', isClosing: true }
      );
    } else if (sugarClass === 'aldose' && carbons === 5) {
      // Aldopentofuranose (5-ring: C1..C4 + O)
      ringTypeDe = `${anomer === 'alpha' ? 'α' : 'β'}-${info.series}-${stemDe}ofuranose`;
      ringTypeEn = `${anomer === 'alpha' ? 'α' : 'β'}-${info.series}-${stemEn}ofuranose`;
      ringVertices.push(
        { c: 1, top: anomericOh === 'up' ? 'OH' : 'H', bottom: anomericOh === 'down' ? 'OH' : 'H', isAnomeric: true },
        { c: 2, top: dirs[0] === 'L' ? 'OH' : 'H', bottom: dirs[0] === 'R' ? 'OH' : 'H' },
        { c: 3, top: dirs[1] === 'L' ? 'OH' : 'H', bottom: dirs[1] === 'R' ? 'OH' : 'H' },
        { c: 4, top: isD ? 'CH₂OH' : 'H', bottom: isD ? 'H' : 'CH₂OH', isClosing: true }
      );
    } else if (sugarClass === 'ketose' && carbons === 6 && resolvedRing === 6) {
      // 2-Ketohexopyranose (6-ring: C2..C6 + O; in aqueous solution free D-fructose is ~70% β-D-fructopyranose!)
      ringTypeDe = `${anomer === 'alpha' ? 'α' : 'β'}-${info.series}-${stemDe}opyranose`;
      ringTypeEn = `${anomer === 'alpha' ? 'α' : 'β'}-${info.series}-${stemEn}opyranose`;
      ringVertices.push(
        { c: 2, top: anomericOh === 'up' ? 'OH' : 'CH₂OH', bottom: anomericOh === 'down' ? 'OH' : 'CH₂OH', isAnomeric: true },
        { c: 3, top: dirs[0] === 'L' ? 'OH' : 'H', bottom: dirs[0] === 'R' ? 'OH' : 'H' },
        { c: 4, top: dirs[1] === 'L' ? 'OH' : 'H', bottom: dirs[1] === 'R' ? 'OH' : 'H' },
        { c: 5, top: dirs[2] === 'L' ? 'OH' : 'H', bottom: dirs[2] === 'R' ? 'OH' : 'H' },
        { c: 6, top: 'H', bottom: 'H', isClosing: true }
      );
    } else if (sugarClass === 'ketose' && carbons === 6) {
      // Ketohexofuranose (5-ring: C2..C5 + O; C2 has OH and C1H2OH!)
      ringTypeDe = `${anomer === 'alpha' ? 'α' : 'β'}-${info.series}-${stemDe}ofuranose`;
      ringTypeEn = `${anomer === 'alpha' ? 'α' : 'β'}-${info.series}-${stemEn}ofuranose`;
      ringVertices.push(
        { c: 2, top: anomericOh === 'up' ? 'OH' : 'CH₂OH', bottom: anomericOh === 'down' ? 'OH' : 'CH₂OH', isAnomeric: true },
        { c: 3, top: dirs[0] === 'L' ? 'OH' : 'H', bottom: dirs[0] === 'R' ? 'OH' : 'H' },
        { c: 4, top: dirs[1] === 'L' ? 'OH' : 'H', bottom: dirs[1] === 'R' ? 'OH' : 'H' },
        { c: 5, top: isD ? 'CH₂OH' : 'H', bottom: isD ? 'H' : 'CH₂OH', isClosing: true }
      );
    } else if (sugarClass === 'ketose' && carbons === 5) {
      // 2-Ketopentofuranose: 5-membered ring consists of O + C2, C3, C4, C5(CH2)!
      ringTypeDe = `${anomer === 'alpha' ? 'α' : 'β'}-${info.series}-${stemDe}ofuranose`;
      ringTypeEn = `${anomer === 'alpha' ? 'α' : 'β'}-${info.series}-${stemEn}ofuranose`;
      ringVertices.push(
        { c: 2, top: anomericOh === 'up' ? 'OH' : 'CH₂OH', bottom: anomericOh === 'down' ? 'OH' : 'CH₂OH', isAnomeric: true },
        { c: 3, top: dirs[0] === 'L' ? 'OH' : 'H', bottom: dirs[0] === 'R' ? 'OH' : 'H' },
        { c: 4, top: dirs[1] === 'L' ? 'OH' : 'H', bottom: dirs[1] === 'R' ? 'OH' : 'H' },
        { c: 5, top: 'H', bottom: 'H', isClosing: true }
      );
    } else {
      // Aldohexofuranose fallback
      ringTypeDe = `${anomer === 'alpha' ? 'α' : 'β'}-${info.series}-${stemDe}ofuranose`;
      ringTypeEn = `${anomer === 'alpha' ? 'α' : 'β'}-${info.series}-${stemEn}ofuranose`;
      ringVertices.push(
        { c: 1, top: anomericOh === 'up' ? 'OH' : 'H', bottom: anomericOh === 'down' ? 'OH' : 'H', isAnomeric: true },
        { c: 2, top: dirs[0] === 'L' ? 'OH' : 'H', bottom: dirs[0] === 'R' ? 'OH' : 'H' },
        { c: 3, top: dirs[1] === 'L' ? 'OH' : 'H', bottom: dirs[1] === 'R' ? 'OH' : 'H' },
        { c: 4, top: isD ? 'CHOH–CH₂OH' : 'H', bottom: isD ? 'H' : 'CHOH–CH₂OH', isClosing: true }
      );
    }

    const attackingCarbon = sugarClass === 'aldose'
      ? (carbons === 6 && resolvedRing === 6 ? 5 : 4)
      : (carbons === 6 && resolvedRing === 6 ? 6 : 5);
    const carbonylCarbon = sugarClass === 'aldose' ? 1 : 2;

    return {
      supported: true,
      ringSize: ringVertices.length + 1, // carbons in ring + 1 ring oxygen
      anomer,
      ringNameDe: ringTypeDe,
      ringNameEn: ringTypeEn,
      attackingCarbon,
      carbonylCarbon,
      anomericOh,
      vertices: ringVertices,
      flohExplanationDe: `FLOH-Regel: Die OH-Gruppe an C${attackingCarbon} greift die C=O-Gruppe an C${carbonylCarbon} an (Halbacetalbildung). Was in der Fischer-Projektion LINKS steht, zeigt im Haworth-Ring nach OBEN!`,
      flohExplanationEn: `FLOH rule: The OH at C${attackingCarbon} attacks C=O at C${carbonylCarbon} (hemiacetal formation). Groups on the LEFT in Fischer point UP in the Haworth ring!`
    };
  }

  /**
   * Enumerates all 42 stereoisomers across Aldoses (4,5,6) and Ketoses (4,5,6).
   */
  function listAllStereoisomers() {
    const results = [];
    for (const sugarClass of ['aldose', 'ketose']) {
      for (const carbons of [4, 5, 6]) {
        const chiralCount = sugarClass === 'aldose' ? carbons - 2 : carbons - 3;
        const total = 1 << chiralCount;
        for (let mask = 0; mask < total; mask++) {
          const dirs = [];
          for (let bit = chiralCount - 1; bit >= 0; bit--) {
            dirs.push(((mask >> bit) & 1) === 0 ? 'R' : 'L');
          }
          results.push(identifyStereoisomer(sugarClass, carbons, dirs));
        }
      }
    }
    return results;
  }

  return {
    D_ALDOSE_NAMES,
    D_KETOSE_NAMES,
    getDefaultDirections,
    identifyStereoisomer,
    compareStereoisomers,
    buildHaworthModel,
    listAllStereoisomers,
    invertAll
  };
});
