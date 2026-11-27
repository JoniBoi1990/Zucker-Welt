/**
 * Chalkboard / Museum-Style SVG Chemical Structure Renderers
 * Renders:
 * 1. Detailed Steckbrief structural formulas (Chitin chair polymer matching Image 3,
 *    Cellulose, Starch, Glycogen, Sucrose, Lactose, Maltose, Inulin, Haworth & Fischer monomers,
 *    Polyols, Uronic acids, Amino sugars, Sialic acids, Heteropolysaccharides)
 * 2. Interactive Fischer Projection ("Dreh ein C und schau was passiert!" matching Image 1)
 * 3. Interactive Haworth Ring-Closure Projection (α/β Pyranose & Furanose with FLOH color mapping)
 */
(function (root, factory) {
  const Stereo = (typeof module !== 'undefined' && module.exports)
    ? require('./stereochemistry.js')
    : root.ZuckerWelt.Stereo;
  const api = factory(Stereo);
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
  if (root) {
    root.ZuckerWelt = root.ZuckerWelt || {};
    root.ZuckerWelt.Structures = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function (Stereo) {
  'use strict';

  function esc(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /**
   * Renders a single 4C1 chair pyranose unit at (cx, cy) with optional tilt/flip for β-1→4 polymers.
   */
  function chairUnitSvg(cx, cy, flipped, opts = {}) {
    // Classic Haworth-chair coordinates around (cx, cy)
    // Unflipped 4C1 chair: C4(-52, 6), C5(-20, -18), O(24, -6), C1(52, 12), C2(18, 22), C3(-24, 10)
    const sign = flipped ? -1 : 1;
    const pC4 = [cx - 54, cy + 4 * sign];
    const pC5 = [cx - 20, cy - 18 * sign];
    const pO  = [cx + 22, cy - 8 * sign];
    const pC1 = [cx + 54, cy + 12 * sign];
    const pC2 = [cx + 18, cy + 20 * sign];
    const pC3 = [cx - 24, cy + 8 * sign];

    // Ring oxygen circle cutout
    const ox = pO[0];
    const oy = pO[1];

    // Substituents (CH2OH on C5, Acetylamino or OH on C2, OH on C3)
    const c6Dir = -sign; // Up when unflipped, down when flipped
    const c2Dir = opts.axialC2 ? -sign : sign; // Axial up for Mannosamine, equatorial down for Glucosamine
    const c3Dir = -sign;

    const topGroup = opts.c6Label || 'OH';
    const isAcetamido = Boolean(opts.acetamido);
    const acylTail = opts.glycolyl ? 'CH₂OH' : 'CH₃';

    let c2Markup = '';
    if (isAcetamido) {
      const ny = pC2[1] + 28 * c2Dir;
      const cyCarb = ny + 22 * c2Dir;
      c2Markup = `
        <line x1="${pC2[0]}" y1="${pC2[1]}" x2="${pC2[0] - 4}" y2="${ny - 8 * c2Dir}" class="chem-bond" />
        <text x="${pC2[0] - 4}" y="${ny + (c2Dir > 0 ? 5 : 4)}" class="chem-atom chem-sm" text-anchor="middle">NH</text>
        <line x1="${pC2[0] - 10}" y1="${ny + 6 * c2Dir}" x2="${pC2[0] - 20}" y2="${cyCarb}" class="chem-bond" />
        <line x1="${pC2[0] - 20}" y1="${cyCarb - 2}" x2="${pC2[0] - 44}" y2="${cyCarb - 2}" class="chem-bond" />
        <line x1="${pC2[0] - 20}" y1="${cyCarb + 3}" x2="${pC2[0] - 44}" y2="${cyCarb + 3}" class="chem-bond" />
        <text x="${pC2[0] - 53}" y="${cyCarb + 5}" class="chem-atom chem-xs" text-anchor="middle">O</text>
        <line x1="${pC2[0] - 20}" y1="${cyCarb}" x2="${pC2[0] - 8}" y2="${cyCarb + 20 * c2Dir}" class="chem-bond" />
        <text x="${pC2[0] + 4}" y="${cyCarb + (c2Dir > 0 ? 33 : -22)}" class="chem-atom chem-xs ${opts.glycolyl ? 'chem-highlight-o' : ''}" text-anchor="middle">${acylTail}</text>
      `;
    } else {
      c2Markup = `
        <line x1="${pC2[0]}" y1="${pC2[1]}" x2="${pC2[0]}" y2="${pC2[1] + 25 * c2Dir}" class="chem-bond" />
        <text x="${pC2[0]}" y="${pC2[1] + (c2Dir > 0 ? 40 : -29)}" class="chem-atom chem-sm ${opts.axialC2 ? 'chem-highlight-o' : ''}" text-anchor="middle">${opts.c2Label || 'OH'}</text>
      `;
    }

    // C5 -> C6 -> OH
    const c6x = pC5[0] - 8;
    const c6y = pC5[1] + 26 * c6Dir;

    return {
      leftAnchor: pC4,
      rightAnchor: pC1,
      svg: `
        <g class="chair-unit">
          <!-- Back bonds -->
          <polyline points="${pC4[0]},${pC4[1]} ${pC5[0]},${pC5[1]} ${ox - 8},${oy - ( pO[1]-pC5[1] )*0.2}" class="chem-bond" fill="none" />
          <line x1="${ox + 7}" y1="${oy + 4 * sign}" x2="${pC1[0]}" y2="${pC1[1]}" class="chem-bond" />
          <!-- Front emphasized chair edge -->
          <polyline points="${pC1[0]},${pC1[1]} ${pC2[0]},${pC2[1]} ${pC3[0]},${pC3[1]} ${pC4[0]},${pC4[1]}" class="chem-bond-thick" fill="none" />
          <text x="${ox}" y="${oy + 5}" class="chem-atom chem-sm" text-anchor="middle">O</text>
          <!-- C6 exocyclic arm -->
          <polyline points="${pC5[0]},${pC5[1]} ${c6x},${c6y} ${c6x + 4},${c6y + 18 * c6Dir}" class="chem-bond" fill="none" />
          <text x="${c6x + 6}" y="${c6y + (c6Dir > 0 ? 33 : -22)}" class="chem-atom chem-sm" text-anchor="middle">${topGroup}</text>
          <!-- C3 OH -->
          <line x1="${pC3[0]}" y1="${pC3[1]}" x2="${pC3[0] - 8}" y2="${pC3[1] + 22 * c3Dir}" class="chem-bond" />
          <text x="${pC3[0] - 12}" y="${pC3[1] + (c3Dir > 0 ? 36 : -26)}" class="chem-atom chem-sm" text-anchor="middle">${opts.c3Label || 'OH'}</text>
          ${c2Markup}
        </g>
      `
    };
  }

  /**
   * Renders the Chitin / Cellulose β-1→4 chair polymer exactly in the tilted chalkboard style of Image 3!
   */
  function renderBetaChairPolymer(isChitin, titleText) {
    const centers = [
      [135, 225, false],
      [295, 196, true],
      [455, 167, false],
      [615, 138, true]
    ];
    const units = centers.map(([x, y, flip]) =>
      chairUnitSvg(x, y, flip, { acetamido: isChitin })
    );

    let bridges = '';
    // Left continuation dashed bond
    const firstL = units[0].leftAnchor;
    bridges += `
      <line x1="${firstL[0]}" y1="${firstL[1]}" x2="${firstL[0] - 26}" y2="${firstL[1] + 18}" class="chem-bond" />
      <text x="${firstL[0] - 34}" y="${firstL[1] + 28}" class="chem-atom chem-sm" text-anchor="middle">O</text>
      <line x1="${firstL[0] - 43}" y1="${firstL[1] + 32}" x2="${firstL[0] - 72}" y2="${firstL[1] + 52}" class="chem-bond chem-dashed" />
    `;

    for (let i = 0; i < units.length - 1; i++) {
      const r = units[i].rightAnchor;
      const l = units[i + 1].leftAnchor;
      const mx = (r[0] + l[0]) / 2;
      const my = (r[1] + l[1]) / 2 + (i % 2 === 0 ? -4 : 6);
      bridges += `
        <line x1="${r[0]}" y1="${r[1]}" x2="${mx - 8}" y2="${my}" class="chem-bond" />
        <text x="${mx}" y="${my + 5}" class="chem-atom chem-sm chem-highlight-o" text-anchor="middle">O</text>
        <line x1="${mx + 8}" y1="${my}" x2="${l[0]}" y2="${l[1]}" class="chem-bond" />
      `;
    }

    const lastR = units[units.length - 1].rightAnchor;
    bridges += `
      <line x1="${lastR[0]}" y1="${lastR[1]}" x2="${lastR[0] + 24}" y2="${lastR[1] - 12}" class="chem-bond" />
      <text x="${lastR[0] + 33}" y="${lastR[1] - 10}" class="chem-atom chem-sm" text-anchor="middle">O</text>
      <line x1="${lastR[0] + 42}" y1="${lastR[1] - 15}" x2="${lastR[0] + 68}" y2="${lastR[1] - 28}" class="chem-bond chem-dashed" />
    `;

    return `
      <svg viewBox="0 0 750 340" class="structure-svg" role="img" aria-label="${esc(titleText)}">
        <title>${esc(titleText)}</title>
        ${bridges}
        ${units.map(u => u.svg).join('')}
      </svg>
    `;
  }

  /**
   * Renders α-1→4 Starch chain or α-1→4 / α-1→6 branched Glycogen.
   */
  function renderAlphaPolymer(withBranch, titleText) {
    const mainCenters = [
      [145, 225],
      [305, 225],
      [465, 225],
      [625, 225]
    ];
    const units = mainCenters.map(([x, y], idx) =>
      chairUnitSvg(x, y, false, { c6Label: (withBranch && idx === 1) ? 'CH₂' : 'OH' })
    );

    let bridges = '';
    const firstL = units[0].leftAnchor;
    bridges += `<line x1="${firstL[0] - 48}" y1="${firstL[1] + 18}" x2="${firstL[0]}" y2="${firstL[1]}" class="chem-bond chem-dashed" />`;

    for (let i = 0; i < units.length - 1; i++) {
      const r = units[i].rightAnchor;
      const l = units[i + 1].leftAnchor;
      const mx = (r[0] + l[0]) / 2;
      const my = r[1] + 26; // Axial α-1→4 downward glycosidic oxygen!
      bridges += `
        <line x1="${r[0]}" y1="${r[1]}" x2="${mx - 8}" y2="${my - 4}" class="chem-bond" />
        <text x="${mx}" y="${my + 6}" class="chem-atom chem-sm chem-highlight-o" text-anchor="middle">O</text>
        <line x1="${mx + 8}" y1="${my - 4}" x2="${l[0]}" y2="${l[1]}" class="chem-bond" />
      `;
    }
    const lastR = units[units.length - 1].rightAnchor;
    bridges += `<line x1="${lastR[0]}" y1="${lastR[1]}" x2="${lastR[0] + 48}" y2="${lastR[1] + 18}" class="chem-bond chem-dashed" />`;

    let branchSvg = '';
    if (withBranch) {
      const b1 = chairUnitSvg(235, 95, false, {});
      const b2 = chairUnitSvg(395, 95, false, {});
      const r = b1.rightAnchor;
      const l = b2.leftAnchor;
      const mx = (r[0] + l[0]) / 2;
      const my = r[1] + 24;
      branchSvg = `
        ${b1.svg}
        ${b2.svg}
        <line x1="${r[0]}" y1="${r[1]}" x2="${mx - 8}" y2="${my - 4}" class="chem-bond" />
        <text x="${mx}" y="${my + 6}" class="chem-atom chem-sm chem-highlight-o" text-anchor="middle">O</text>
        <line x1="${mx + 8}" y1="${my - 4}" x2="${l[0]}" y2="${l[1]}" class="chem-bond" />
        <!-- α-1→6 branch bridge -->
        <path d="M ${b1.rightAnchor[0]},${b1.rightAnchor[1]} C 305,135 282,145 278,164" class="chem-bond chem-accent-bond" fill="none" />
        <text x="318" y="146" class="chem-atom chem-xs chem-highlight-o">α-1→6</text>
      `;
    }

    return `
      <svg viewBox="0 0 750 320" class="structure-svg" role="img" aria-label="${esc(titleText)}">
        <title>${esc(titleText)}</title>
        ${bridges}
        ${units.map(u => u.svg).join('')}
        ${branchSvg}
      </svg>
    `;
  }

  /**
   * Renders Haworth hexagon (Pyranose) or pentagon (Furanose) helper at (cx, cy).
   */
  function haworthRingSvg(cx, cy, scale, isPentagon, labels) {
    const s = scale;
    if (!isPentagon) {
      // Pyranose hexagon: C4(left), C5(top-left), O(top-right), C1(right), C2(bottom-right), C3(bottom-left)
      const p4 = [cx - 72 * s, cy];
      const p5 = [cx - 38 * s, cy - 46 * s];
      const pO = [cx + 38 * s, cy - 46 * s];
      const p1 = [cx + 72 * s, cy];
      const p2 = [cx + 38 * s, cy + 46 * s];
      const p3 = [cx - 38 * s, cy + 46 * s];
      const subs = [
        [p1, labels.c1Top, labels.c1Bot, 'C1'],
        [p2, labels.c2Top, labels.c2Bot, 'C2'],
        [p3, labels.c3Top, labels.c3Bot, 'C3'],
        [p4, labels.c4Top, labels.c4Bot, 'C4'],
        [p5, labels.c5Top, labels.c5Bot, 'C5']
      ];
      return {
        p1, p4, p5, p2,
        svg: `
          <g class="haworth-ring">
            <polyline points="${p4[0]},${p4[1]} ${p5[0]},${p5[1]} ${pO[0] - 12 * s},${pO[1]}" class="chem-bond" fill="none" />
            <line x1="${pO[0] + 10 * s}" y1="${pO[1] + 12 * s}" x2="${p1[0]}" y2="${p1[1]}" class="chem-bond" />
            <polyline points="${p1[0]},${p1[1]} ${p2[0]},${p2[1]} ${p3[0]},${p3[1]} ${p4[0]},${p4[1]}" class="chem-bond-thick" fill="none" />
            <text x="${pO[0]}" y="${pO[1] + 6}" class="chem-atom chem-md" text-anchor="middle">O</text>
            ${subs.map(([pt, top, bot, cname]) => `
              ${top ? `
                <line x1="${pt[0]}" y1="${pt[1]}" x2="${pt[0]}" y2="${pt[1] - 32 * s}" class="chem-bond" />
                <text x="${pt[0]}" y="${pt[1] - 38 * s}" class="chem-atom chem-sm" text-anchor="middle">${top}</text>
              ` : ''}
              ${bot ? `
                <line x1="${pt[0]}" y1="${pt[1]}" x2="${pt[0]}" y2="${pt[1] + 32 * s}" class="chem-bond" />
                <text x="${pt[0]}" y="${pt[1] + 48 * s}" class="chem-atom chem-sm" text-anchor="middle">${bot}</text>
              ` : ''}
              ${labels.showNumbers ? `<text x="${pt[0] + (cname === 'C1' ? -14 : cname === 'C4' ? 14 : 0)}" y="${pt[1] + (cname === 'C5' ? 16 : -8)}" class="chem-cnum" text-anchor="middle">${cname}</text>` : ''}
            `).join('')}
          </g>
        `
      };
    } else {
      // Furanose pentagon: O(top), C1/C2(right), C2/C3(bottom-right), C3/C4(bottom-left), C4/C5(left)
      const pO  = [cx, cy - 52 * s];
      const pR  = [cx + 68 * s, cy - 6 * s];
      const pBR = [cx + 42 * s, cy + 50 * s];
      const pBL = [cx - 42 * s, cy + 50 * s];
      const pL  = [cx - 68 * s, cy - 6 * s];
      const subs = [
        [pR,  labels.c1Top, labels.c1Bot, labels.cNames ? labels.cNames[0] : ''],
        [pBR, labels.c2Top, labels.c2Bot, labels.cNames ? labels.cNames[1] : ''],
        [pBL, labels.c3Top, labels.c3Bot, labels.cNames ? labels.cNames[2] : ''],
        [pL,  labels.c4Top, labels.c4Bot, labels.cNames ? labels.cNames[3] : '']
      ];
      return {
        p1: pR, p4: pL,
        svg: `
          <g class="haworth-ring">
            <line x1="${pL[0]}" y1="${pL[1]}" x2="${pO[0] - 12 * s}" y2="${pO[1] + 8 * s}" class="chem-bond" />
            <line x1="${pO[0] + 12 * s}" y1="${pO[1] + 8 * s}" x2="${pR[0]}" y2="${pR[1]}" class="chem-bond" />
            <polyline points="${pR[0]},${pR[1]} ${pBR[0]},${pBR[1]} ${pBL[0]},${pBL[1]} ${pL[0]},${pL[1]}" class="chem-bond-thick" fill="none" />
            <text x="${pO[0]}" y="${pO[1] + 6}" class="chem-atom chem-md" text-anchor="middle">O</text>
            ${subs.map(([pt, top, bot, cname]) => `
              ${top ? `
                <line x1="${pt[0]}" y1="${pt[1]}" x2="${pt[0]}" y2="${pt[1] - 32 * s}" class="chem-bond" />
                <text x="${pt[0]}" y="${pt[1] - 38 * s}" class="chem-atom chem-sm" text-anchor="middle">${top}</text>
              ` : ''}
              ${bot ? `
                <line x1="${pt[0]}" y1="${pt[1]}" x2="${pt[0]}" y2="${pt[1] + 32 * s}" class="chem-bond" />
                <text x="${pt[0]}" y="${pt[1] + 48 * s}" class="chem-atom chem-sm" text-anchor="middle">${bot}</text>
              ` : ''}
              ${cname ? `<text x="${pt[0]}" y="${pt[1] - 8}" class="chem-cnum" text-anchor="middle">${cname}</text>` : ''}
            `).join('')}
          </g>
        `
      };
    }
  }

  /**
   * Renders Disaccharides cleanly in Haworth style with exact glycosidic regio- & stereochemistry.
   */
  function renderDisaccharideSvg(kind, titleText) {
    if (kind === 'sucrose_dimer') {
      const left = haworthRingSvg(225, 165, 1.05, false, {
        c1Top: 'H', c1Bot: '',
        c2Top: 'H', c2Bot: 'OH',
        c3Top: 'OH', c3Bot: 'H',
        c4Top: 'H', c4Bot: 'OH',
        c5Top: 'CH₂OH', c5Bot: ''
      });
      const right = haworthRingSvg(510, 165, 1.05, true, {
        c1Top: 'CH₂OH', c1Bot: 'OH',
        c2Top: 'OH', c2Bot: 'H',
        c3Top: 'H', c3Bot: 'OH',
        c4Top: 'CH₂OH', c4Bot: ''
      });
      const mx = (left.p1[0] + right.p4[0]) / 2;
      const my = 212;
      return `
        <svg viewBox="0 0 740 330" class="structure-svg" role="img" aria-label="${esc(titleText)}">
          <title>${esc(titleText)}</title>
          ${left.svg}
          ${right.svg}
          <polyline points="${left.p1[0]},${left.p1[1]} ${left.p1[0]},${my} ${mx - 12},${my}" class="chem-bond chem-accent-bond" fill="none" />
          <text x="${mx}" y="${my + 6}" class="chem-atom chem-md chem-highlight-o" text-anchor="middle">O</text>
          <polyline points="${mx + 12},${my} ${right.p4[0]},${my} ${right.p4[0]},${right.p4[1]}" class="chem-bond chem-accent-bond" fill="none" />
          <text x="225" y="295" class="chem-caption" text-anchor="middle">α-D-Glucopyranosyl (C1)</text>
          <text x="510" y="295" class="chem-caption" text-anchor="middle">β-D-Fructofuranosid (C2)</text>
        </svg>
      `;
    }

    if (kind === 'trehalose_dimer') {
      const left = haworthRingSvg(220, 162, 1.02, false, {
        c1Top: 'H', c1Bot: '',
        c2Top: 'H', c2Bot: 'OH',
        c3Top: 'OH', c3Bot: 'H',
        c4Top: 'H', c4Bot: 'OH',
        c5Top: 'CH₂OH', c5Bot: ''
      });
      // Second α-D-glucose rotated horizontally so its C1 sits on the left facing the first C1!
      const right = haworthRingSvg(520, 162, 1.02, false, {
        c1Top: 'H', c1Bot: 'OH',
        c2Top: 'OH', c2Bot: 'H',
        c3Top: 'H', c3Bot: 'OH',
        c4Top: 'H', c4Bot: '',
        c5Top: 'CH₂OH', c5Bot: ''
      });
      const mx = (left.p1[0] + right.p4[0]) / 2;
      const my = 212;
      return `
        <svg viewBox="0 0 740 330" class="structure-svg" role="img" aria-label="${esc(titleText)}">
          <title>${esc(titleText)}</title>
          ${left.svg}
          ${right.svg}
          <polyline points="${left.p1[0]},${left.p1[1]} ${left.p1[0]},${my} ${mx - 12},${my}" class="chem-bond chem-accent-bond" fill="none" />
          <text x="${mx}" y="${my + 6}" class="chem-atom chem-md chem-highlight-o" text-anchor="middle">O</text>
          <polyline points="${mx + 12},${my} ${right.p4[0]},${my} ${right.p4[0]},${right.p4[1]}" class="chem-bond chem-accent-bond" fill="none" />
          <text x="${mx}" y="${my + 26}" class="chem-cnum" text-anchor="middle">α,α-1↔1 (Vollacetal)</text>
          <text x="220" y="298" class="chem-caption" text-anchor="middle">α-D-Glucopyranosyl (C1)</text>
          <text x="520" y="298" class="chem-caption" text-anchor="middle">α-D-Glucopyranosid (C1’)</text>
        </svg>
      `;
    }

    if (kind === 'lactose_dimer' || kind === 'cellobiose_dimer') {
      const isLac = kind === 'lactose_dimer';
      const left = haworthRingSvg(220, 165, 1.05, false, {
        c1Top: '', c1Bot: 'H',
        c2Top: 'H', c2Bot: 'OH',
        c3Top: 'OH', c3Bot: 'H',
        c4Top: isLac ? 'OH' : 'H',
        c4Bot: isLac ? 'H' : 'OH',
        c5Top: 'CH₂OH', c5Bot: ''
      });
      const right = haworthRingSvg(515, 165, 1.05, false, {
        c1Top: 'OH', c1Bot: 'H',
        c2Top: 'H', c2Bot: 'OH',
        c3Top: 'OH', c3Bot: 'H',
        c4Top: 'H', c4Bot: '',
        c5Top: 'CH₂OH', c5Bot: ''
      });
      const mx = (left.p1[0] + right.p4[0]) / 2;
      return `
        <svg viewBox="0 0 740 330" class="structure-svg" role="img" aria-label="${esc(titleText)}">
          <title>${esc(titleText)}</title>
          ${left.svg}
          ${right.svg}
          <polyline points="${left.p1[0]},${left.p1[1]} ${left.p1[0]},${left.p1[1] - 32} ${mx - 10},165" class="chem-bond chem-accent-bond" fill="none" />
          <text x="${mx}" y="171" class="chem-atom chem-md chem-highlight-o" text-anchor="middle">O</text>
          <polyline points="${mx + 10},165 ${right.p4[0]},${right.p4[1] + 32} ${right.p4[0]},${right.p4[1]}" class="chem-bond chem-accent-bond" fill="none" />
          <text x="220" y="298" class="chem-caption" text-anchor="middle">${isLac ? 'β-D-Galaktopyranose' : 'β-D-Glucopyranose'}</text>
          <text x="515" y="298" class="chem-caption" text-anchor="middle">D-Glucopyranose</text>
        </svg>
      `;
    }

    if (kind === 'laktulose_dimer') {
      const left = haworthRingSvg(220, 165, 1.02, false, {
        c1Top: '', c1Bot: 'H',
        c2Top: 'H', c2Bot: 'OH',
        c3Top: 'OH', c3Bot: 'H',
        c4Top: 'OH', c4Bot: 'H',
        c5Top: 'CH₂OH', c5Bot: ''
      });
      const right = haworthRingSvg(515, 165, 1.02, true, {
        c1Top: 'OH', c1Bot: 'CH₂OH',
        c2Top: 'OH', c2Bot: 'H',
        c3Top: 'H', c3Bot: '',
        c4Top: 'CH₂OH', c4Bot: 'H'
      });
      const mx = (left.p1[0] + right.p4[0]) / 2;
      return `
        <svg viewBox="0 0 740 330" class="structure-svg" role="img" aria-label="${esc(titleText)}">
          <title>${esc(titleText)}</title>
          ${left.svg}
          ${right.svg}
          <polyline points="${left.p1[0]},${left.p1[1]} ${left.p1[0]},${left.p1[1] - 28} ${mx - 10},165" class="chem-bond chem-accent-bond" fill="none" />
          <text x="${mx}" y="171" class="chem-atom chem-md chem-highlight-o" text-anchor="middle">O</text>
          <polyline points="${mx + 10},165 446,232 472,216" class="chem-bond chem-accent-bond" fill="none" />
          <text x="220" y="298" class="chem-caption" text-anchor="middle">β-D-Galaktopyranose</text>
          <text x="515" y="298" class="chem-caption" text-anchor="middle">β-D-Fructofuranose (β-1→4)</text>
        </svg>
      `;
    }

    if (kind === 'isomaltose_dimer' || kind === 'gentiobiose_dimer') {
      const isAlpha = kind === 'isomaltose_dimer';
      const upper = haworthRingSvg(225, 132, 0.96, false, {
        c1Top: isAlpha ? 'H' : '',
        c1Bot: isAlpha ? '' : 'H',
        c2Top: 'H', c2Bot: 'OH',
        c3Top: 'OH', c3Bot: 'H',
        c4Top: 'H', c4Bot: 'OH',
        c5Top: 'CH₂OH', c5Bot: ''
      });
      const lower = haworthRingSvg(510, 198, 0.96, false, {
        c1Top: 'H', c1Bot: 'OH',
        c2Top: 'H', c2Bot: 'OH',
        c3Top: 'OH', c3Bot: 'H',
        c4Top: 'H', c4Bot: 'OH',
        c5Top: '', c5Bot: ''
      });
      const c1x = upper.p1[0];
      const c1y = upper.p1[1];
      const c5x = lower.p5[0];
      const c5y = lower.p5[1];
      const elbowY = isAlpha ? c1y + 30 : c1y - 26;
      return `
        <svg viewBox="0 0 740 340" class="structure-svg" role="img" aria-label="${esc(titleText)}">
          <title>${esc(titleText)}</title>
          ${upper.svg}
          ${lower.svg}
          <polyline points="${c1x},${c1y} ${c1x},${elbowY} 382,${elbowY}" class="chem-bond chem-accent-bond" fill="none" />
          <text x="396" y="${elbowY + 6}" class="chem-atom chem-md chem-highlight-o" text-anchor="middle">O</text>
          <polyline points="410,${elbowY} ${c5x},${elbowY} ${c5x},${c5y - 22}" class="chem-bond chem-accent-bond" fill="none" />
          <text x="${c5x}" y="${c5y - 8}" class="chem-atom chem-sm chem-highlight-o" text-anchor="middle">CH₂ (C6)</text>
          <line x1="${c5x}" y1="${c5y - 4}" x2="${c5x}" y2="${c5y}" class="chem-bond" />
          <text x="225" y="255" class="chem-caption" text-anchor="middle">${isAlpha ? 'α' : 'β'}-D-Glucopyranosyl</text>
          <text x="510" y="318" class="chem-caption" text-anchor="middle">D-Glucopyranose (${isAlpha ? 'α-1→6' : 'β-1→6'})</text>
        </svg>
      `;
    }

    if (kind === 'isomaltulose_dimer' || kind === 'turanose_dimer') {
      const is16 = kind === 'isomaltulose_dimer';
      const left = haworthRingSvg(220, 152, 0.98, false, {
        c1Top: 'H', c1Bot: '',
        c2Top: 'H', c2Bot: 'OH',
        c3Top: 'OH', c3Bot: 'H',
        c4Top: 'H', c4Bot: 'OH',
        c5Top: 'CH₂OH', c5Bot: ''
      });
      const right = haworthRingSvg(515, 178, 0.98, true, {
        c1Top: 'OH', c1Bot: 'CH₂OH',
        c2Top: is16 ? 'OH' : '', c2Bot: 'H',
        c3Top: 'H', c3Bot: 'OH',
        c4Top: is16 ? '' : 'CH₂OH', c4Bot: 'H'
      });
      const targetX = is16 ? right.p4[0] : 556;
      const targetY = is16 ? right.p4[1] - 32 : 196;
      return `
        <svg viewBox="0 0 740 330" class="structure-svg" role="img" aria-label="${esc(titleText)}">
          <title>${esc(titleText)}</title>
          ${left.svg}
          ${right.svg}
          <polyline points="${left.p1[0]},${left.p1[1]} ${left.p1[0]},196 368,196" class="chem-bond chem-accent-bond" fill="none" />
          <text x="382" y="202" class="chem-atom chem-md chem-highlight-o" text-anchor="middle">O</text>
          <polyline points="396,196 ${targetX},${targetY}" class="chem-bond chem-accent-bond" fill="none" />
          ${is16 ? `<text x="${right.p4[0]}" y="${right.p4[1] - 14}" class="chem-atom chem-sm chem-highlight-o" text-anchor="middle">CH₂ (C6)</text>` : ''}
          <text x="220" y="295" class="chem-caption" text-anchor="middle">α-D-Glucopyranosyl</text>
          <text x="515" y="305" class="chem-caption" text-anchor="middle">D-Fructofuranose (${is16 ? 'α-1→6' : 'α-1→3'})</text>
        </svg>
      `;
    }

    // Maltose (α-1→4)
    const left = haworthRingSvg(220, 165, 1.05, false, {
      c1Top: 'H', c1Bot: '',
      c2Top: 'H', c2Bot: 'OH',
      c3Top: 'OH', c3Bot: 'H',
      c4Top: 'H', c4Bot: 'OH',
      c5Top: 'CH₂OH', c5Bot: ''
    });
    const right = haworthRingSvg(515, 165, 1.05, false, {
      c1Top: 'H', c1Bot: 'OH',
      c2Top: 'H', c2Bot: 'OH',
      c3Top: 'OH', c3Bot: 'H',
      c4Top: 'H', c4Bot: '',
      c5Top: 'CH₂OH', c5Bot: ''
    });
    const mx = (left.p1[0] + right.p4[0]) / 2;
    const my = 205;
    return `
      <svg viewBox="0 0 740 330" class="structure-svg" role="img" aria-label="${esc(titleText)}">
        <title>${esc(titleText)}</title>
        ${left.svg}
        ${right.svg}
        <polyline points="${left.p1[0]},${left.p1[1]} ${left.p1[0]},${my} ${mx - 12},${my}" class="chem-bond chem-accent-bond" fill="none" />
        <text x="${mx}" y="${my + 6}" class="chem-atom chem-md chem-highlight-o" text-anchor="middle">O</text>
        <polyline points="${mx + 12},${my} ${right.p4[0]},${my} ${right.p4[0]},${right.p4[1]}" class="chem-bond chem-accent-bond" fill="none" />
        <text x="220" y="298" class="chem-caption" text-anchor="middle">α-D-Glucopyranose</text>
        <text x="515" y="298" class="chem-caption" text-anchor="middle">α-D-Glucopyranose</text>
      </svg>
    `;
  }

  /**
   * Renders static or interactive Fischer projection SVG.
   * When `interactive = true`, renders translucent circular touch targets around chiral C atoms
   * exactly like Image 1 ("Dreh ein C und schau was passiert!").
   */
  function renderFischerSvg(sugarClass, carbons, dirs, opts = {}) {
    const interactive = Boolean(opts.interactive);
    const flippedIndex = typeof opts.flippedIndex === 'number' ? opts.flippedIndex : -1;
    const width = interactive ? 360 : 520;
    const cx = width / 2;
    const topY = 58;
    const rowStep = carbons >= 7 ? 46 : carbons === 6 ? 56 : carbons === 5 ? 64 : 70;
    const chiralCount = dirs.length;
    const firstChiralRow = sugarClass === 'aldose' ? 1 : 2;
    const totalHeight = topY + (carbons - 1) * rowStep + 56;

    let headMarkup = '';
    if (sugarClass === 'aldose') {
      // Exact hand-lettered H \ C // O head from Image 1!
      headMarkup = `
        <g class="fischer-head">
          <text x="${cx}" y="${topY + 8}" class="chem-script chem-lg" text-anchor="middle">C</text>
          <!-- H top-left single bond -->
          <line x1="${cx - 12}" y1="${topY - 8}" x2="${cx - 28}" y2="${topY - 22}" class="chem-bond-thick" />
          <text x="${cx - 40}" y="${topY - 24}" class="chem-script chem-lg" text-anchor="middle">H</text>
          <!-- =O top-right double bond -->
          <line x1="${cx + 12}" y1="${topY - 12}" x2="${cx + 30}" y2="${topY - 26}" class="chem-bond-thick" />
          <line x1="${cx + 17}" y1="${topY - 5}" x2="${cx + 35}" y2="${topY - 19}" class="chem-bond-thick" />
          <text x="${cx + 48}" y="${topY - 22}" class="chem-script chem-lg" text-anchor="middle">O</text>
        </g>
      `;
    } else {
      // Ketose: C1 = CH2OH at top, C2 = C=O below it
      const c2Y = topY + rowStep;
      headMarkup = `
        <g class="fischer-head">
          <text x="${cx + 14}" y="${topY + 6}" class="chem-script chem-lg" text-anchor="middle">CH₂OH</text>
          <line x1="${cx}" y1="${topY + 14}" x2="${cx}" y2="${c2Y - 18}" class="chem-bond-thick" />
          <text x="${cx}" y="${c2Y + 8}" class="chem-script chem-lg" text-anchor="middle">C</text>
          <line x1="${cx + 16}" y1="${c2Y - 4}" x2="${cx + 44}" y2="${c2Y - 4}" class="chem-bond-thick" />
          <line x1="${cx + 16}" y1="${c2Y + 4}" x2="${cx + 44}" y2="${c2Y + 4}" class="chem-bond-thick" />
          <text x="${cx + 62}" y="${c2Y + 9}" class="chem-script chem-lg chem-highlight-o" text-anchor="middle">O</text>
        </g>
      `;
    }

    let rowsMarkup = '';
    for (let i = 0; i < chiralCount; i++) {
      const rowIdx = firstChiralRow + i;
      const y = topY + rowIdx * rowStep;
      const prevY = topY + (rowIdx - 1) * rowStep;
      const dir = dirs[i];
      const leftText = dir === 'R' ? 'H' : 'HO';
      const rightText = dir === 'R' ? 'OH' : 'H';
      const cNum = rowIdx + 1;
      const isFlipped = flippedIndex === i;
      const isBottomChiral = i === chiralCount - 1;

      rowsMarkup += `
        <line x1="${cx}" y1="${prevY + 14}" x2="${cx}" y2="${y - 20}" class="chem-bond-thick" />
        <g class="fischer-chiral-row ${isFlipped ? 'is-flipping' : ''}" data-chiral-index="${i}">
          <!-- Horizontal H - C - OH arms -->
          <line x1="${cx - 48}" y1="${y}" x2="${cx - 22}" y2="${y}" class="chem-bond-thick" />
          <line x1="${cx + 22}" y1="${y}" x2="${cx + 48}" y2="${y}" class="chem-bond-thick" />
          <text x="${cx - 56}" y="${y + 9}" class="chem-script chem-lg ${dir === 'L' ? 'chem-oh-active' : ''}" text-anchor="end">${leftText}</text>
          <text x="${cx + 56}" y="${y + 9}" class="chem-script chem-lg ${dir === 'R' ? 'chem-oh-active' : ''}" text-anchor="start">${rightText}</text>
          <!-- Chiral C circle -->
          <circle cx="${cx}" cy="${y}" r="22" class="chiral-halo ${isBottomChiral ? 'chiral-halo-dl' : ''}" />
          <text x="${cx}" y="${y + 8}" class="chem-script chem-lg chiral-c-letter" text-anchor="middle">C</text>
          ${opts.showCarbonNumbers ? `<text x="${cx + 25}" y="${y - 16}" class="chem-cnum">C${cNum}</text>` : ''}
          ${interactive ? `
            <circle cx="${cx}" cy="${y}" r="30" class="chiral-hit-area" data-chiral-hit="${i}" aria-hidden="true" />
          ` : ''}
        </g>
      `;
    }

    // Bottom CH2OH
    const lastChiralY = topY + (carbons - 2) * rowStep;
    const botY = topY + (carbons - 1) * rowStep;
    const tailMarkup = `
      <line x1="${cx}" y1="${lastChiralY + 20}" x2="${cx}" y2="${botY - 16}" class="chem-bond-thick" />
      <text x="${cx + 16}" y="${botY + 12}" class="chem-script chem-lg" text-anchor="middle">CH₂OH</text>
    `;

    const label = opts.title || 'Fischer-Projektion';
    return `
      <svg viewBox="0 0 ${width} ${totalHeight}" class="fischer-svg ${interactive ? 'fischer-interactive' : 'structure-svg'}" role="img" aria-label="${esc(label)}">
        <title>${esc(label)}</title>
        ${headMarkup}
        ${rowsMarkup}
        ${tailMarkup}
      </svg>
    `;
  }

  /**
   * Renders an interactive Haworth model produced by Stereo.buildHaworthModel().
   */
  function renderHaworthFromModel(model, lang = 'de') {
    if (!model || !model.supported) {
      const msg = lang === 'de'
        ? (model && model.reasonDe) || 'Keine stabile Ringform'
        : (model && model.reasonEn) || 'No stable ring form';
      return `<div class="ring-unsupported">${esc(msg)}</div>`;
    }

    const isPentagon = model.ringSize === 5;
    const v = model.vertices;
    let ring;
    if (!isPentagon) {
      ring = haworthRingSvg(260, 155, 1.25, false, {
        c1Top: v[0].top, c1Bot: v[0].bottom,
        c2Top: v[1].top, c2Bot: v[1].bottom,
        c3Top: v[2].top, c3Bot: v[2].bottom,
        c4Top: v[3].top, c4Bot: v[3].bottom,
        c5Top: v[4].top, c5Bot: v[4].bottom,
        showNumbers: true
      });
    } else {
      ring = haworthRingSvg(260, 155, 1.25, true, {
        c1Top: v[0].top, c1Bot: v[0].bottom,
        c2Top: v[1].top, c2Bot: v[1].bottom,
        c3Top: v[2].top, c3Bot: v[2].bottom,
        c4Top: v[3] ? v[3].top : '', c4Bot: v[3] ? v[3].bottom : '',
        cNames: v.map(item => 'C' + item.c)
      });
    }

    const title = lang === 'de' ? model.ringNameDe : model.ringNameEn;
    return `
      <svg viewBox="0 0 520 310" class="structure-svg haworth-live-svg" role="img" aria-label="${esc(title)}">
        <title>${esc(title)}</title>
        ${ring.svg}
      </svg>
    `;
  }

  /**
   * Master Steckbrief structure dispatcher: guarantees EVERY sugar in our 78-sugar database
   * renders a crisp, chemically meaningful white chalkboard structural formula!
   */
  function renderSugarStructure(sugar, lang = 'de') {
    const title = `${lang === 'de' ? 'Strukturformel von ' + sugar.nameDe : 'Chemical structure of ' + sugar.nameEn}`;
    const kind = sugar.structureKind;

    if (kind === 'chitin_chair') {
      return renderBetaChairPolymer(true, title);
    }
    if (kind === 'cellulose_chair') {
      return renderBetaChairPolymer(false, title);
    }
    if (kind === 'starch_chain') {
      return renderAlphaPolymer(false, title);
    }
    if (kind === 'glycogen_branch') {
      return renderAlphaPolymer(true, title);
    }
    if (kind && kind.endsWith('_dimer')) {
      return renderDisaccharideSvg(kind, title);
    }
    if (kind === 'inulin_chain') {
      const f1 = haworthRingSvg(170, 165, 0.95, true, { c1Top: 'CH₂OH', c1Bot: '', c2Top: 'OH', c2Bot: 'H', c3Top: 'H', c3Bot: 'OH', c4Top: 'CH₂', c4Bot: '' });
      const f2 = haworthRingSvg(375, 165, 0.95, true, { c1Top: 'CH₂', c1Bot: '', c2Top: 'OH', c2Bot: 'H', c3Top: 'H', c3Bot: 'OH', c4Top: 'CH₂', c4Bot: '' });
      const g3 = haworthRingSvg(580, 165, 0.95, false, { c1Top: 'H', c1Bot: '', c2Top: 'H', c2Bot: 'OH', c3Top: 'OH', c3Bot: 'H', c4Top: 'H', c4Bot: 'OH', c5Top: 'CH₂OH', c5Bot: '' });
      return `
        <svg viewBox="0 0 740 320" class="structure-svg" role="img" aria-label="${esc(title)}">
          <title>${esc(title)}</title>
          ${f1.svg}${f2.svg}${g3.svg}
          <path d="M 235,159 C 265,195 285,120 310,159" class="chem-bond chem-accent-bond" fill="none" />
          <text x="273" y="150" class="chem-atom chem-sm chem-highlight-o" text-anchor="middle">O (β-2→1)</text>
          <path d="M 440,159 C 470,195 490,195 512,165" class="chem-bond chem-accent-bond" fill="none" />
          <text x="476" y="205" class="chem-atom chem-sm chem-highlight-o" text-anchor="middle">O</text>
        </svg>
      `;
    }

    if (sugar.slug === 'sedoheptulose') {
      // 7-carbon 2-ketoheptose (D-altro-heptulose: C3=L, C4=R, C5=R, C6=R)
      return renderFischerSvg('ketose', 7, ['L', 'R', 'R', 'R'], { title, showCarbonNumbers: true });
    }

    if (sugar.slug === 'arabino-3-hexulose') {
      // Unique 3-ketohexose: C1=CH2OH, C2(L), C3=C=O, C4(R), C5(R), C6=CH2OH
      const cx = 250;
      const ys = [46, 98, 152, 206, 258, 310];
      return `
        <svg viewBox="0 0 520 348" class="structure-svg" role="img" aria-label="${esc(title)}">
          <title>${esc(title)}</title>
          <text x="${cx + 12}" y="${ys[0] + 6}" class="chem-script chem-lg" text-anchor="middle">CH₂OH</text>
          <text x="${cx + 58}" y="${ys[0] + 4}" class="chem-cnum">C1</text>
          <line x1="${cx}" y1="${ys[0] + 14}" x2="${cx}" y2="${ys[1] - 16}" class="chem-bond-thick" />
          <!-- C2: HO - C - H -->
          <line x1="${cx - 44}" y1="${ys[1]}" x2="${cx + 44}" y2="${ys[1]}" class="chem-bond-thick" />
          <text x="${cx - 52}" y="${ys[1] + 8}" class="chem-script chem-md" text-anchor="end">HO</text>
          <text x="${cx + 52}" y="${ys[1] + 8}" class="chem-script chem-md" text-anchor="start">H</text>
          <circle cx="${cx}" cy="${ys[1]}" r="15" class="chiral-halo" />
          <text x="${cx}" y="${ys[1] + 6}" class="chem-script chem-md" text-anchor="middle">C</text>
          <text x="${cx + 22}" y="${ys[1] - 14}" class="chem-cnum">C2</text>
          <!-- C3: Internal Ketone C=O! -->
          <line x1="${cx}" y1="${ys[1] + 16}" x2="${cx}" y2="${ys[2] - 16}" class="chem-bond-thick" />
          <text x="${cx}" y="${ys[2] + 8}" class="chem-script chem-lg chem-highlight-o" text-anchor="middle">C</text>
          <line x1="${cx + 16}" y1="${ys[2] - 4}" x2="${cx + 46}" y2="${ys[2] - 4}" class="chem-bond-thick chem-accent-bond" />
          <line x1="${cx + 16}" y1="${ys[2] + 4}" x2="${cx + 46}" y2="${ys[2] + 4}" class="chem-bond-thick chem-accent-bond" />
          <text x="${cx + 64}" y="${ys[2] + 8}" class="chem-script chem-lg chem-highlight-o" text-anchor="middle">O</text>
          <text x="${cx - 32}" y="${ys[2] + 5}" class="chem-cnum">C3 (Keto!)</text>
          <!-- C4 & C5: H - C - OH -->
          ${[3, 4].map((idx) => `
            <line x1="${cx}" y1="${ys[idx - 1] + 16}" x2="${cx}" y2="${ys[idx] - 16}" class="chem-bond-thick" />
            <line x1="${cx - 44}" y1="${ys[idx]}" x2="${cx + 44}" y2="${ys[idx]}" class="chem-bond-thick" />
            <text x="${cx - 52}" y="${ys[idx] + 8}" class="chem-script chem-md" text-anchor="end">H</text>
            <text x="${cx + 52}" y="${ys[idx] + 8}" class="chem-script chem-md" text-anchor="start">OH</text>
            <circle cx="${cx}" cy="${ys[idx]}" r="15" class="chiral-halo" />
            <text x="${cx}" y="${ys[idx] + 6}" class="chem-script chem-md" text-anchor="middle">C</text>
            <text x="${cx + 22}" y="${ys[idx] - 14}" class="chem-cnum">C${idx + 1}</text>
          `).join('')}
          <line x1="${cx}" y1="${ys[4] + 16}" x2="${cx}" y2="${ys[5] - 16}" class="chem-bond-thick" />
          <text x="${cx + 12}" y="${ys[5] + 8}" class="chem-script chem-lg" text-anchor="middle">CH₂OH</text>
          <text x="${cx + 58}" y="${ys[5] + 6}" class="chem-cnum">C6</text>
        </svg>
      `;
    }

    if (sugar.stereoPreset) {
      const { sugarClass, carbons, dirs } = sugar.stereoPreset;
      if (kind === 'haworth' && carbons >= 5) {
        const model = Stereo.buildHaworthModel(sugarClass, carbons, dirs, 'beta');
        return renderHaworthFromModel(model, lang);
      }
      return renderFischerSvg(sugarClass, carbons, dirs, { title, showCarbonNumbers: true });
    }

    if (kind === 'triose_dha') {
      return `
        <svg viewBox="0 0 500 280" class="structure-svg" role="img" aria-label="${esc(title)}">
          <title>${esc(title)}</title>
          <text x="250" y="72" class="chem-script chem-lg" text-anchor="middle">CH₂OH</text>
          <line x1="250" y1="84" x2="250" y2="122" class="chem-bond-thick" />
          <text x="250" y="148" class="chem-script chem-lg" text-anchor="middle">C</text>
          <line x1="268" y1="136" x2="306" y2="136" class="chem-bond-thick" />
          <line x1="268" y1="144" x2="306" y2="144" class="chem-bond-thick" />
          <text x="326" y="149" class="chem-script chem-lg chem-highlight-o" text-anchor="middle">O</text>
          <line x1="250" y1="158" x2="250" y2="198" class="chem-bond-thick" />
          <text x="250" y="226" class="chem-script chem-lg" text-anchor="middle">CH₂OH</text>
        </svg>
      `;
    }

    if (kind === 'triose_gly') {
      return renderFischerSvg('aldose', 3, ['R'], { title, showCarbonNumbers: true });
    }

    if (kind === 'ascorbic_lactone') {
      // L-Ascorbic acid (Vitamin C): 5-membered γ-lactone with C2(OH)=C3(OH) enediol + dihydroxyethyl arm
      return `
        <svg viewBox="0 0 560 315" class="structure-svg" role="img" aria-label="${esc(title)}">
          <title>${esc(title)}</title>
          <!-- 5-membered lactone ring: O(top 250,82), C1(320,132), C2(294,212), C3(206,212), C4(180,132) -->
          <line x1="180" y1="132" x2="238" y2="90" class="chem-bond" />
          <line x1="262" y1="90" x2="320" y2="132" class="chem-bond" />
          <text x="250" y="88" class="chem-atom chem-md" text-anchor="middle">O</text>
          <line x1="320" y1="132" x2="294" y2="212" class="chem-bond-thick" />
          <line x1="180" y1="132" x2="206" y2="212" class="chem-bond-thick" />
          <!-- Enediol double bond C2=C3 (antioxidant active center!) -->
          <line x1="206" y1="212" x2="294" y2="212" class="chem-bond-thick chem-accent-bond" />
          <line x1="214" y1="203" x2="286" y2="203" class="chem-bond chem-accent-bond" />
          <!-- C1=O lactone carbonyl -->
          <line x1="320" y1="128" x2="358" y2="112" class="chem-bond-thick" />
          <line x1="323" y1="136" x2="361" y2="120" class="chem-bond-thick" />
          <text x="376" y="118" class="chem-atom chem-md chem-highlight-o" text-anchor="middle">O</text>
          <!-- Enediol OH groups on C2 and C3 -->
          <line x1="294" y1="212" x2="318" y2="248" class="chem-bond" />
          <text x="334" y="266" class="chem-atom chem-md chem-highlight-o" text-anchor="middle">OH</text>
          <line x1="206" y1="212" x2="182" y2="248" class="chem-bond" />
          <text x="166" y="266" class="chem-atom chem-md chem-highlight-o" text-anchor="middle">HO</text>
          <!-- C4 exocyclic L-threo side chain: CH(OH)–CH2OH -->
          <line x1="180" y1="132" x2="126" y2="112" class="chem-bond-thick" />
          <text x="92" y="117" class="chem-atom chem-sm" text-anchor="middle">HO–CH</text>
          <line x1="92" y1="126" x2="92" y2="162" class="chem-bond" />
          <text x="92" y="182" class="chem-atom chem-sm" text-anchor="middle">CH₂OH</text>
          <text x="250" y="295" class="chem-caption" text-anchor="middle">L-Ascorbinsäure (Endiol-γ-Lacton · Vitamin C)</text>
        </svg>
      `;
    }

    if (kind === 'polyol') {
      // Sugar alcohol chain with CH2OH at BOTH ends!
      const isC5 = sugar.slug === 'xylit';
      const isC4 = sugar.slug === 'erythrit';
      const dirs = isC4 ? ['R', 'R'] : isC5 ? ['R', 'L', 'R'] : sugar.slug === 'mannit' ? ['L', 'L', 'R', 'R'] : ['R', 'L', 'R', 'R'];
      const cx = 250;
      const step = 48;
      let rows = `<text x="${cx}" y="52" class="chem-script chem-lg chem-highlight-o" text-anchor="middle">CH₂OH</text>`;
      dirs.forEach((d, idx) => {
        const y = 100 + idx * step;
        rows += `
          <line x1="${cx}" y1="${y - 34}" x2="${cx}" y2="${y - 14}" class="chem-bond-thick" />
          <line x1="${cx - 42}" y1="${y}" x2="${cx + 42}" y2="${y}" class="chem-bond-thick" />
          <text x="${cx - 50}" y="${y + 8}" class="chem-script chem-md" text-anchor="end">${d === 'L' ? 'HO' : 'H'}</text>
          <text x="${cx + 50}" y="${y + 8}" class="chem-script chem-md" text-anchor="start">${d === 'R' ? 'OH' : 'H'}</text>
          <circle cx="${cx}" cy="${y}" r="14" class="chiral-halo" />
          <text x="${cx}" y="${y + 6}" class="chem-script chem-md" text-anchor="middle">C</text>
        `;
      });
      const botY = 100 + dirs.length * step;
      rows += `
        <line x1="${cx}" y1="${botY - 34}" x2="${cx}" y2="${botY - 14}" class="chem-bond-thick" />
        <text x="${cx}" y="${botY + 8}" class="chem-script chem-lg chem-highlight-o" text-anchor="middle">CH₂OH</text>
      `;
      return `<svg viewBox="0 0 500 ${botY + 34}" class="structure-svg" role="img" aria-label="${esc(title)}"><title>${esc(title)}</title>${rows}</svg>`;
    }

    if (kind === 'uronic') {
      // Gluconic acid & Glucaric acid are open-chain aldonic / aldaric acids (C1 = COOH, never a pentavalent pyranose!)
      if (sugar.slug === 'gluconsaeure' || sugar.slug === 'glucarsaeure') {
        const isDicarboxylic = sugar.slug === 'glucarsaeure';
        const dirs = ['R', 'L', 'R', 'R'];
        const cx = 250;
        const step = 48;
        let rows = `<text x="${cx}" y="52" class="chem-script chem-lg chem-highlight-o" text-anchor="middle">COOH</text>`;
        dirs.forEach((d, idx) => {
          const y = 100 + idx * step;
          rows += `
            <line x1="${cx}" y1="${y - 34}" x2="${cx}" y2="${y - 14}" class="chem-bond-thick" />
            <line x1="${cx - 42}" y1="${y}" x2="${cx + 42}" y2="${y}" class="chem-bond-thick" />
            <text x="${cx - 50}" y="${y + 8}" class="chem-script chem-md" text-anchor="end">${d === 'L' ? 'HO' : 'H'}</text>
            <text x="${cx + 50}" y="${y + 8}" class="chem-script chem-md" text-anchor="start">${d === 'R' ? 'OH' : 'H'}</text>
            <circle cx="${cx}" cy="${y}" r="14" class="chiral-halo" />
            <text x="${cx}" y="${y + 6}" class="chem-script chem-md" text-anchor="middle">C</text>
            <text x="${cx + 20}" y="${y - 14}" class="chem-cnum">C${idx + 2}</text>
          `;
        });
        const botY = 100 + dirs.length * step;
        rows += `
          <line x1="${cx}" y1="${botY - 34}" x2="${cx}" y2="${botY - 14}" class="chem-bond-thick" />
          <text x="${cx}" y="${botY + 8}" class="chem-script chem-lg ${isDicarboxylic ? 'chem-highlight-o' : ''}" text-anchor="middle">${isDicarboxylic ? 'COOH' : 'CH₂OH'}</text>
        `;
        return `<svg viewBox="0 0 500 ${botY + 34}" class="structure-svg" role="img" aria-label="${esc(title)}"><title>${esc(title)}</title>${rows}</svg>`;
      }

      // Stereochemically exact Haworth pyranuronic rings for all 5 uronic acids!
      const URONIC_CONFIGS = {
        glucuronsaeure:   { c1Top: 'OH', c1Bot: 'H',  c2Top: 'H',  c2Bot: 'OH', c3Top: 'OH', c3Bot: 'H',  c4Top: 'H',  c4Bot: 'OH', c5Top: 'COOH', c5Bot: 'H', showNumbers: true },
        galacturonsaeure: { c1Top: 'H',  c1Bot: 'OH', c2Top: 'H',  c2Bot: 'OH', c3Top: 'OH', c3Bot: 'H',  c4Top: 'OH', c4Bot: 'H',  c5Top: 'COOH', c5Bot: 'H', showNumbers: true },
        mannuronsaeure:   { c1Top: 'OH', c1Bot: 'H',  c2Top: 'OH', c2Bot: 'H',  c3Top: 'OH', c3Bot: 'H',  c4Top: 'H',  c4Bot: 'OH', c5Top: 'COOH', c5Bot: 'H', showNumbers: true },
        // L-Uronic acids: C5 carboxyl points DOWN!
        iduronsaeure:     { c1Top: 'OH', c1Bot: 'H',  c2Top: 'H',  c2Bot: 'OH', c3Top: 'OH', c3Bot: 'H',  c4Top: 'H',  c4Bot: 'OH', c5Top: 'H',    c5Bot: 'COOH', showNumbers: true },
        guluronsaeure:    { c1Top: 'OH', c1Bot: 'H',  c2Top: 'OH', c2Bot: 'H',  c3Top: 'OH', c3Bot: 'H',  c4Top: 'H',  c4Bot: 'OH', c5Top: 'H',    c5Bot: 'COOH', showNumbers: true }
      };
      const cfg = URONIC_CONFIGS[sugar.slug] || URONIC_CONFIGS.glucuronsaeure;
      const ring = haworthRingSvg(260, 155, 1.18, false, cfg);
      return `<svg viewBox="0 0 520 315" class="structure-svg" role="img" aria-label="${esc(title)}"><title>${esc(title)}</title>${ring.svg}</svg>`;
    }

    if (kind === 'amino_chair' || kind === 'sialic') {
      const isAcetyl = sugar.slug.includes('acetyl') || kind === 'sialic';
      const isMannosamine = sugar.slug === 'mannosamin';
      const isGalNAc = sugar.slug === 'n-acetylgalactosamin';
      const isNeu5Gc = sugar.slug === 'n-glycolylneuraminsaeure';
      const isChitosan = sugar.slug === 'chitosan';
      const unit = chairUnitSvg(260, 155, false, {
        acetamido: isAcetyl,
        axialC2: isMannosamine,
        glycolyl: isNeu5Gc,
        c2Label: isAcetyl ? undefined : (isChitosan ? 'NH₂ / NH₃⁺' : 'NH₂'),
        c6Label: kind === 'sialic' ? 'CHOH–CH₂OH' : 'OH',
        c3Label: sugar.slug === 'n-acetylmuraminsaeure' ? 'O–CH(CH₃)COOH' : 'OH'
      });
      const leftEnd = isGalNAc
        ? `
          <line x1="${unit.leftAnchor[0]}" y1="${unit.leftAnchor[1]}" x2="${unit.leftAnchor[0]}" y2="${unit.leftAnchor[1] - 30}" class="chem-bond chem-accent-bond" />
          <text x="${unit.leftAnchor[0]}" y="${unit.leftAnchor[1] - 38}" class="chem-atom chem-sm chem-highlight-o" text-anchor="middle">OH (C4 axial)</text>
        `
        : `
          <line x1="${unit.leftAnchor[0]}" y1="${unit.leftAnchor[1]}" x2="${unit.leftAnchor[0] - 28}" y2="${unit.leftAnchor[1] + 14}" class="chem-bond ${isChitosan ? 'chem-dashed' : ''}" />
          <text x="${unit.leftAnchor[0] - 42}" y="${unit.leftAnchor[1] + 22}" class="chem-atom chem-sm" text-anchor="middle">${isChitosan ? 'O' : 'HO'}</text>
        `;
      return `
        <svg viewBox="0 0 540 320" class="structure-svg" role="img" aria-label="${esc(title)}">
          <title>${esc(title)}</title>
          ${unit.svg}
          ${leftEnd}
          <line x1="${unit.rightAnchor[0]}" y1="${unit.rightAnchor[1]}" x2="${unit.rightAnchor[0] + 28}" y2="${unit.rightAnchor[1] - 12}" class="chem-bond ${isChitosan ? 'chem-dashed' : ''}" />
          <text x="${unit.rightAnchor[0] + 44}" y="${unit.rightAnchor[1] - 10}" class="chem-atom chem-sm" text-anchor="middle">${kind === 'sialic' ? 'COOH / OH' : (isChitosan ? 'O–(β-1→4)' : 'OH')}</text>
        </svg>
      `;
    }

    if (kind === 'haworth') {
      if (sugar.slug === 'desoxyribose') {
        // β-D-2-Deoxyribofuranose: C1 OH up, C2 H/H (no O!), C3 OH DOWN (FLOH: R in Fischer -> down!), C4 CH2OH up
        const ring = haworthRingSvg(260, 155, 1.2, true, {
          c1Top: 'OH', c1Bot: 'H',
          c2Top: 'H', c2Bot: 'H (kein O!)',
          c3Top: 'H', c3Bot: 'OH',
          c4Top: 'CH₂OH', c4Bot: 'H',
          cNames: ['C1', 'C2', 'C3', 'C4']
        });
        return `<svg viewBox="0 0 520 315" class="structure-svg" role="img" aria-label="${esc(title)}"><title>${esc(title)}</title>${ring.svg}</svg>`;
      }
      if (sugar.slug === '3-6-anhydro-galactose') {
        const ring = haworthRingSvg(260, 168, 1.15, false, {
          c1Top: 'OH', c1Bot: 'H',
          c2Top: 'H', c2Bot: 'OH',
          c3Top: '', c3Bot: 'H',
          c4Top: 'OH', c4Bot: 'H',
          c5Top: 'CH₂ (C6)', c5Bot: ''
        });
        return `
          <svg viewBox="0 0 520 315" class="structure-svg" role="img" aria-label="${esc(title)}">
            <title>${esc(title)}</title>
            ${ring.svg}
            <!-- Internal 3,6-anhydro ether bridge spanning C3 (216,221) over ring to C6 (216,76) -->
            <path d="M 216,221 C 142,190 142,95 210,76" class="chem-bond chem-accent-bond" fill="none" />
            <circle cx="160" cy="145" r="11" fill="#2b3035" />
            <text x="160" y="150" class="chem-atom chem-sm chem-highlight-o" text-anchor="middle">O</text>
            <text x="112" y="150" class="chem-cnum" text-anchor="middle">3,6-Brücke</text>
          </svg>
        `;
      }
      const DEOXY_HEX_CONFIGS = {
        digitoxose: { c1Top: 'OH', c1Bot: 'H', c2Top: 'H',  c2Bot: 'H (kein O!)', c3Top: 'H',  c3Bot: 'OH', c4Top: 'H',  c4Bot: 'OH', c5Top: 'CH₃', c5Bot: 'H', showNumbers: true },
        rhamnose:   { c1Top: 'OH', c1Bot: 'H', c2Top: 'OH', c2Bot: 'H',           c3Top: 'H',  c3Bot: 'OH', c4Top: 'OH', c4Bot: 'H',  c5Top: 'H',   c5Bot: 'CH₃', showNumbers: true },
        fucose:     { c1Top: 'OH', c1Bot: 'H', c2Top: 'H',  c2Bot: 'OH',          c3Top: 'OH', c3Bot: 'H',  c4Top: 'H',  c4Bot: 'OH', c5Top: 'H',   c5Bot: 'CH₃', showNumbers: true }
      };
      const cfg = DEOXY_HEX_CONFIGS[sugar.slug] || DEOXY_HEX_CONFIGS.rhamnose;
      const ring = haworthRingSvg(260, 155, 1.2, false, cfg);
      return `<svg viewBox="0 0 520 315" class="structure-svg" role="img" aria-label="${esc(title)}"><title>${esc(title)}</title>${ring.svg}</svg>`;
    }

    // Heteropolysaccharide / Oligosaccharide modular schematic ribbon (Pektin, Agar, Alginat, Raffinose, etc.)
    const blocks = sugar.buildingBlocksDe.split(/[,+]/).map(s => s.trim());
    const nodes = [0, 1, 2, 3].map(i => {
      const x = 125 + i * 155;
      const y = 165 + (i % 2 === 0 ? 0 : -14);
      const isPent = blocks[i % blocks.length] && /Fruktose|Arabinose|Ribose/i.test(blocks[i % blocks.length]);
      const pts = isPent
        ? `${x},${y - 38} ${x + 40},${y - 10} ${x + 25},${y + 34} ${x - 25},${y + 34} ${x - 40},${y - 10}`
        : `${x - 42},${y} ${x - 21},${y - 36} ${x + 21},${y - 36} ${x + 42},${y} ${x + 21},${y + 36} ${x - 21},${y + 36}`;
      const lbl = (blocks[i % blocks.length] || sugar.nameDe).replace(/^\d+\s*×\s*/, '').slice(0, 14);
      return { x, y, pts, lbl };
    });

    const links = nodes.slice(0, -1).map((n, i) => {
      const nx = nodes[i + 1];
      const mx = (n.x + nx.x) / 2;
      const my = (n.y + nx.y) / 2;
      return `
        <line x1="${n.x + 42}" y1="${n.y}" x2="${mx - 10}" y2="${my}" class="chem-bond chem-accent-bond" />
        <text x="${mx}" y="${my + 5}" class="chem-atom chem-sm chem-highlight-o" text-anchor="middle">O</text>
        <line x1="${mx + 10}" y1="${my}" x2="${nx.x - 42}" y2="${nx.y}" class="chem-bond chem-accent-bond" />
      `;
    }).join('');

    return `
      <svg viewBox="0 0 740 310" class="structure-svg" role="img" aria-label="${esc(title)}">
        <title>${esc(title)}</title>
        <line x1="42" y1="165" x2="83" y2="165" class="chem-bond chem-dashed" />
        ${links}
        <line x1="632" y1="151" x2="685" y2="151" class="chem-bond chem-dashed" />
        ${nodes.map(n => `
          <polygon points="${n.pts}" class="chem-poly-ring" />
          <text x="${n.x}" y="${n.y + 62}" class="chem-caption" text-anchor="middle">${esc(n.lbl)}</text>
        `).join('')}
        <text x="370" y="64" class="chem-caption chem-highlight-o" text-anchor="middle">${esc(sugar.linkage)}</text>
      </svg>
    `;
  }

  return {
    renderSugarStructure,
    renderFischerSvg,
    renderHaworthFromModel,
    renderBetaChairPolymer,
    renderAlphaPolymer,
    renderDisaccharideSvg
  };
});
