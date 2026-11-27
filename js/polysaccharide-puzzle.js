/**
 * Station 5: "Unendliche Möglichkeiten – Baue das Polysaccharid nach!"
 * Reproduces the exact 4 monomer tiles from Image 4:
 *   - hex-cyan    : kräftig hellblaues Sechseck (z. B. α/β-D-Glucose / Hauptkette)
 *   - hex-light   : zart hellblaues Sechseck (z. B. D-Galaktose / Galacturonsäure)
 *   - hex-striped : weiß schraffiertes Sechseck (z. B. N-Acetylglucosamin / Rhamnose)
 *   - pent-white  : weißes Fünfeck (z. B. L-Arabinose / D-Fruktose Furanose)
 * Plus multiple selectable target polysaccharides (starting with the exact multi-branched
 * museum scaffold from Image 4!).
 */
(function (root, factory) {
  const api = factory();
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
  if (root) {
    root.ZuckerWelt = root.ZuckerWelt || {};
    root.ZuckerWelt.PolyPuzzle = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const MONOMER_TILES = [
    {
      id: 'hex-cyan',
      shape: 'hex',
      labelDe: 'D-Glucose (Hexose)',
      labelEn: 'D-Glucose (Hexose)',
      hintDe: 'Kräftig blauer Sechsring – Hauptketten-Baustein (durchgezogener Sechseck-Umriss)',
      hintEn: 'Bright cyan hexagon — main backbone unit (solid hexagon outline)'
    },
    {
      id: 'hex-light',
      shape: 'hex',
      labelDe: 'D-Galaktose / Uronsäure',
      labelEn: 'D-Galactose / Uronic Acid',
      hintDe: 'Hellblauer Sechsring – Seitenketten-Hexose (gepunktet-feiner Sechseck-Umriss)',
      hintEn: 'Light sky-blue hexagon — side-branch hexose (soft/dotted hexagon outline)'
    },
    {
      id: 'hex-striped',
      shape: 'hex',
      labelDe: 'Spezial-Hexose (GlcNAc / Rhamnose)',
      labelEn: 'Modified Hexose (GlcNAc / Rhamnose)',
      hintDe: 'Schraffierter Sechsring – Verzweigungs- & Gelenkbaustein (leuchtend dicker Sechseck-Umriss)',
      hintEn: 'Striped hexagon — branch-point & structural unit (bright bold hexagon outline)'
    },
    {
      id: 'pent-white',
      shape: 'pent',
      labelDe: 'Pentose / Fruktose (Fünfring)',
      labelEn: 'Pentose / Fructose (5-Ring)',
      hintDe: 'Weißer Fünfring – passt ausschließlich auf die fünfeckigen Felder!',
      hintEn: 'White pentagon — fits exclusively into five-sided slots!'
    }
  ];

  /**
   * Puzzle Levels (viewBox 0 0 820 560)
   * Level 1 faithfully recreates the sweeping branched polysaccharide artwork of Image 4!
   * Notice how every slot encodes its expected tile visually via polygon geometry (hex vs pent)
   * AND border style (standard solid = hex-cyan, bold bright = hex-striped branch/anchor,
   * soft dashed = hex-light side branch, pentagon = pent-white) so students can solve it logically!
   */
  const PUZZLE_LEVELS = [
    {
      id: 'museum-zellwand',
      titleDe: '1. Pflanzliches Zellwand-Netzwerk (Museums-Original)',
      titleEn: '1. Plant Cell-Wall Heteropolysaccharide (Museum Original)',
      subtitleDe: 'Komplexes Heteropolysaccharid (wie Pektin / Hemizellulose) aus Hauptkette, Verzweigungsstellen und Fünfring-Seitenkette.',
      subtitleEn: 'Complex plant cell-wall heteropolysaccharide combining hexose backbone, branch kinks, and a pentose side wave.',
      slots: [
        // Bottom-left tail curving up into central trunk (slot 0 prefilled just like Image 4!)
        { id: 's0',  x: 112, y: 476, rot: 0,   expected: 'hex-cyan',    prefilled: true },
        { id: 's1',  x: 164, y: 472, rot: -4,  expected: 'hex-cyan' },
        { id: 's2',  x: 215, y: 462, rot: -12, expected: 'hex-cyan' },
        { id: 's3',  x: 263, y: 442, rot: -24, expected: 'hex-cyan' },
        { id: 's4',  x: 304, y: 411, rot: -38, expected: 'hex-cyan' },
        { id: 's5',  x: 336, y: 370, rot: -55, expected: 'hex-cyan' },
        // Lower branch junction (bright bold hexagon in Image 4!)
        { id: 's6',  x: 356, y: 322, rot: -75, expected: 'hex-striped' },
        // Vertical trunk continuing upward
        { id: 's7',  x: 363, y: 269, rot: -86, expected: 'hex-cyan' },
        // Middle branch junction (bright bold hexagon in Image 4!)
        { id: 's8',  x: 364, y: 216, rot: -90, expected: 'hex-striped' },
        { id: 's9',  x: 361, y: 163, rot: -94, expected: 'hex-cyan' },
        // Upper branch junction (bright bold hexagon in Image 4!)
        { id: 's10', x: 354, y: 110, rot: -98, expected: 'hex-striped' },
        { id: 's11', x: 332, y: 61,  rot: -118, expected: 'hex-cyan' },

        // Middle short horizontal side branch (4 light-blue hexagons)
        { id: 'm1',  x: 416, y: 218, rot: 6,   expected: 'hex-light' },
        { id: 'm2',  x: 468, y: 224, rot: 8,   expected: 'hex-light' },
        { id: 'm3',  x: 520, y: 232, rot: 10,  expected: 'hex-light' },

        // Upper looping side chain (from s10 curving right and dipping like Image 4)
        { id: 'u1',  x: 404, y: 95,  rot: -12, expected: 'hex-light' },
        { id: 'u2',  x: 456, y: 88,  rot: 4,   expected: 'hex-striped' },
        { id: 'u3',  x: 495, y: 124, rot: 45,  expected: 'hex-light' },
        { id: 'u4',  x: 542, y: 150, rot: 22,  expected: 'hex-light' },
        { id: 'u5',  x: 594, y: 152, rot: -4,  expected: 'hex-light' },
        { id: 'u6',  x: 642, y: 130, rot: -26, expected: 'hex-striped' },
        { id: 'u7',  x: 694, y: 126, rot: 6,   expected: 'hex-light' },

        // Lower wavy pentagon/furanose chain (curving right from s6 just like Image 4!)
        { id: 'p1',  x: 408, y: 328, rot: 10,  expected: 'hex-light' },
        { id: 'p2',  x: 460, y: 338, rot: 12,  expected: 'pent-white' },
        { id: 'p3',  x: 508, y: 322, rot: -18, expected: 'pent-white' },
        { id: 'p4',  x: 554, y: 348, rot: 28,  expected: 'pent-white' },
        { id: 'p5',  x: 592, y: 388, rot: 48,  expected: 'pent-white' },
        { id: 'p6',  x: 638, y: 364, rot: -32, expected: 'pent-white' },
        { id: 'p7',  x: 678, y: 326, rot: -40, expected: 'pent-white' },
        { id: 'p8',  x: 728, y: 318, rot: 8,   expected: 'pent-white' }
      ],
      bonds: [
        ['s0', 's1'], ['s1', 's2'], ['s2', 's3'], ['s3', 's4'], ['s4', 's5'], ['s5', 's6'],
        ['s6', 's7'], ['s7', 's8'], ['s8', 's9'], ['s9', 's10'], ['s10', 's11'],
        ['s8', 'm1'], ['m1', 'm2'], ['m2', 'm3'],
        ['s10', 'u1'], ['u1', 'u2'], ['u2', 'u3'], ['u3', 'u4'], ['u4', 'u5'], ['u5', 'u6'], ['u6', 'u7'],
        ['s6', 'p1'], ['p1', 'p2'], ['p2', 'p3'], ['p3', 'p4'], ['p4', 'p5'], ['p5', 'p6'], ['p6', 'p7'], ['p7', 'p8']
      ]
    },
    {
      id: 'glykogen-speicher',
      titleDe: '2. Glykogen & Amylopektin (Energiespeicher)',
      titleEn: '2. Glycogen & Amylopectin (Branched Energy Store)',
      subtitleDe: 'Schnell abrufbarer Glucose-Speicher: α-1→4-Hauptkette mit markierten Verzweigungsstellen (α-1→6).',
      subtitleEn: 'Rapid-release glucose store: α-1→4 chains connected via highlighted α-1→6 branch points.',
      slots: [
        { id: 'g0', x: 120, y: 380, rot: 0, expected: 'hex-cyan', prefilled: true },
        { id: 'g1', x: 185, y: 374, rot: -6, expected: 'hex-cyan' },
        { id: 'g2', x: 250, y: 360, rot: -12, expected: 'hex-striped' },
        { id: 'g3', x: 315, y: 354, rot: -4, expected: 'hex-cyan' },
        { id: 'g4', x: 380, y: 354, rot: 2, expected: 'hex-cyan' },
        { id: 'g5', x: 445, y: 362, rot: 8, expected: 'hex-striped' },
        { id: 'g6', x: 510, y: 374, rot: 10, expected: 'hex-cyan' },
        { id: 'g7', x: 575, y: 384, rot: 8, expected: 'hex-cyan' },
        // Branch 1
        { id: 'gb1', x: 275, y: 295, rot: -55, expected: 'hex-light' },
        { id: 'gb2', x: 322, y: 245, rot: -35, expected: 'hex-light' },
        { id: 'gb3', x: 382, y: 222, rot: -12, expected: 'hex-light' },
        // Branch 2
        { id: 'gb4', x: 472, y: 298, rot: -55, expected: 'hex-light' },
        { id: 'gb5', x: 522, y: 250, rot: -30, expected: 'hex-light' },
        { id: 'gb6', x: 584, y: 230, rot: -8,  expected: 'hex-light' }
      ],
      bonds: [
        ['g0', 'g1'], ['g1', 'g2'], ['g2', 'g3'], ['g3', 'g4'], ['g4', 'g5'], ['g5', 'g6'], ['g6', 'g7'],
        ['g2', 'gb1'], ['gb1', 'gb2'], ['gb2', 'gb3'],
        ['g5', 'gb4'], ['gb4', 'gb5'], ['gb5', 'gb6']
      ]
    },
    {
      id: 'chitin-murein',
      titleDe: '3. Bakterien-Murein & Chitin-Panzerfaser',
      titleEn: '3. Bacterial Peptidoglycan & Chitin Armor Fiber',
      subtitleDe: 'Kerzengerade, zugfeste β-1→4-Strukturfasern aus abwechselnden Aminozucker-Bausteinen.',
      subtitleEn: 'Rigid, linear β-1→4 structural strands composed of alternating amino sugar building blocks.',
      slots: [
        // Strand 1
        { id: 'c0', x: 140, y: 200, rot: 0, expected: 'hex-striped', prefilled: true },
        { id: 'c1', x: 215, y: 200, rot: 0, expected: 'hex-light' },
        { id: 'c2', x: 290, y: 200, rot: 0, expected: 'hex-striped' },
        { id: 'c3', x: 365, y: 200, rot: 0, expected: 'hex-light' },
        { id: 'c4', x: 440, y: 200, rot: 0, expected: 'hex-striped' },
        { id: 'c5', x: 515, y: 200, rot: 0, expected: 'hex-light' },
        { id: 'c6', x: 590, y: 200, rot: 0, expected: 'hex-striped' },
        // Strand 2 parallel below
        { id: 'd0', x: 140, y: 340, rot: 0, expected: 'hex-light' },
        { id: 'd1', x: 215, y: 340, rot: 0, expected: 'hex-striped' },
        { id: 'd2', x: 290, y: 340, rot: 0, expected: 'hex-light' },
        { id: 'd3', x: 365, y: 340, rot: 0, expected: 'hex-striped' },
        { id: 'd4', x: 440, y: 340, rot: 0, expected: 'hex-light' },
        { id: 'd5', x: 515, y: 340, rot: 0, expected: 'hex-striped' },
        { id: 'd6', x: 590, y: 340, rot: 0, expected: 'hex-light' }
      ],
      bonds: [
        ['c0', 'c1'], ['c1', 'c2'], ['c2', 'c3'], ['c3', 'c4'], ['c4', 'c5'], ['c5', 'c6'],
        ['d0', 'd1'], ['d1', 'd2'], ['d2', 'd3'], ['d3', 'd4'], ['d4', 'd5'], ['d5', 'd6'],
        ['c1', 'd1'], ['c3', 'd3'], ['c5', 'd5']
      ]
    },
    {
      id: 'inulin-raffinose',
      titleDe: '4. Inulin-Fruktan (Glucose-Kopf + Fünfring-Kette)',
      titleEn: '4. Inulin Fructan (Glucose Cap + Furanose Chain)',
      subtitleDe: 'Ein einzelner Sechsring (D-Glucose) am Start, gefolgt von einer langen Welle aus Fruktose-Fünfringen!',
      subtitleEn: 'A single terminal D-glucose hexagon capped onto a sweeping wave of β-2→1 fructose pentagons!',
      slots: [
        { id: 'i0', x: 125, y: 300, rot: 0, expected: 'hex-cyan', prefilled: true },
        { id: 'i1', x: 192, y: 285, rot: -15, expected: 'pent-white' },
        { id: 'i2', x: 254, y: 252, rot: -28, expected: 'pent-white' },
        { id: 'i3', x: 318, y: 238, rot: 5, expected: 'pent-white' },
        { id: 'i4', x: 382, y: 264, rot: 28, expected: 'pent-white' },
        { id: 'i5', x: 444, y: 302, rot: 25, expected: 'pent-white' },
        { id: 'i6', x: 510, y: 314, rot: -5, expected: 'pent-white' },
        { id: 'i7', x: 574, y: 284, rot: -28, expected: 'pent-white' },
        { id: 'i8', x: 638, y: 252, rot: -18, expected: 'pent-white' }
      ],
      bonds: [
        ['i0', 'i1'], ['i1', 'i2'], ['i2', 'i3'], ['i3', 'i4'],
        ['i4', 'i5'], ['i5', 'i6'], ['i6', 'i7'], ['i7', 'i8']
      ]
    },
    {
      id: 'blutgruppen-ab0',
      titleDe: '5. Menschliche AB0-Blutgruppen-Zuckerantennen',
      titleEn: '5. Human ABO Blood-Group Sugar Antennas',
      subtitleDe: 'Ein einziger End-Zucker entscheidet: Typ 0 endet mit L-Fucose (Fünfeck-Symbol), Typ A hängt GalNAc (schraffiert) an, Typ B eine D-Galaktose (hellblau)!',
      subtitleEn: 'One terminal sugar decides blood type: Type O carries the H-antigen fucose, Type A adds GalNAc (striped), and Type B adds D-galactose (light blue)!',
      annotations: [
        { x: 185, y: 78, textDe: 'Blutgruppe 0 (H-Antigen)', textEn: 'Blood Type O (H-Antigen)' },
        { x: 425, y: 78, textDe: 'Blutgruppe A (+ GalNAc)', textEn: 'Blood Type A (+ GalNAc)' },
        { x: 650, y: 78, textDe: 'Blutgruppe B (+ Gal)', textEn: 'Blood Type B (+ Gal)' }
      ],
      slots: [
        // Type O antenna (left)
        { id: 'o0', x: 165, y: 420, rot: -90, expected: 'hex-cyan', prefilled: true },
        { id: 'o1', x: 165, y: 342, rot: -90, expected: 'hex-striped' },
        { id: 'o2', x: 165, y: 264, rot: -90, expected: 'hex-light' },
        { id: 'o3', x: 224, y: 214, rot: 25,  expected: 'pent-white' },
        // Type A antenna (center: H-antigen + terminal GalNAc hex-striped!)
        { id: 'a0', x: 405, y: 420, rot: -90, expected: 'hex-cyan' },
        { id: 'a1', x: 405, y: 342, rot: -90, expected: 'hex-striped' },
        { id: 'a2', x: 405, y: 264, rot: -90, expected: 'hex-light' },
        { id: 'a3', x: 464, y: 218, rot: 25,  expected: 'pent-white' },
        { id: 'a4', x: 372, y: 192, rot: -20, expected: 'hex-striped' },
        // Type B antenna (right: H-antigen + terminal D-Galactose hex-light!)
        { id: 'b0', x: 635, y: 420, rot: -90, expected: 'hex-cyan' },
        { id: 'b1', x: 635, y: 342, rot: -90, expected: 'hex-striped' },
        { id: 'b2', x: 635, y: 264, rot: -90, expected: 'hex-light' },
        { id: 'b3', x: 694, y: 218, rot: 25,  expected: 'pent-white' },
        { id: 'b4', x: 602, y: 192, rot: -20, expected: 'hex-light' }
      ],
      bonds: [
        ['o0', 'o1'], ['o1', 'o2'], ['o2', 'o3'],
        ['a0', 'a1'], ['a1', 'a2'], ['a2', 'a3'], ['a2', 'a4'],
        ['b0', 'b1'], ['b1', 'b2'], ['b2', 'b3'], ['b2', 'b4']
      ]
    }
  ];

  function createInitialPlacements(levelId) {
    const level = PUZZLE_LEVELS.find(l => l.id === levelId) || PUZZLE_LEVELS[0];
    const placements = {};
    for (const slot of level.slots) {
      if (slot.prefilled) {
        placements[slot.id] = slot.expected;
      }
    }
    return placements;
  }

  function canPlaceTile(slot, tileId) {
    if (!slot || slot.prefilled) return { allowed: false, reason: 'locked' };
    return {
      allowed: slot.expected === tileId,
      reason: slot.expected === tileId ? 'match' : 'mismatch'
    };
  }

  function getProgress(level, placements) {
    const total = level.slots.length;
    let filled = 0;
    for (const s of level.slots) {
      if (placements[s.id] === s.expected) filled++;
    }
    return {
      filled,
      total,
      remaining: total - filled,
      completed: filled === total,
      percent: Math.round((filled / total) * 100)
    };
  }

  /**
   * Polygon SVG point generator centered at (0,0) with radius r.
   */
  function polygonPoints(shape, r = 25) {
    const sides = shape === 'pent' ? 5 : 6;
    const offset = shape === 'pent' ? -Math.PI / 2 : 0; // flat top/bottom hexagon, pointed top pentagon matching Image 4!
    const pts = [];
    for (let i = 0; i < sides; i++) {
      const angle = offset + (i * 2 * Math.PI) / sides;
      // For flat-top hexagon like Image 4: angle = i * 60deg -> vertices at 0, 60, 120, 180, 240, 300 gives flat top & bottom!
      const px = (r * Math.cos(angle)).toFixed(1);
      const py = (r * Math.sin(angle)).toFixed(1);
      pts.push(`${px},${py}`);
    }
    return pts.join(' ');
  }

  function getBondStates(level, placements) {
    if (!level || !Array.isArray(level.bonds)) return [];
    const slotMap = new Map(level.slots.map((s) => [s.id, s]));
    return level.bonds
      .map(([aId, bId]) => {
        const a = slotMap.get(aId);
        const b = slotMap.get(bId);
        if (!a || !b) return null;
        return {
          from: a,
          to: b,
          bothPlaced: Boolean(placements[aId] && placements[bId])
        };
      })
      .filter(Boolean);
  }

  return {
    MONOMER_TILES,
    PUZZLE_LEVELS,
    createInitialPlacements,
    canPlaceTile,
    getProgress,
    getBondStates,
    polygonPoints
  };
});
