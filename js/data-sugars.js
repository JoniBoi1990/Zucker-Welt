/**
 * Comprehensive Bilingual Sugar Database ("Zucker – Es gibt viel mehr, als nur den Einen ...")
 * Covers all ~76 carbohydrates, sugar alcohols, uronic/aldonic acids, amino sugars,
 * oligosaccharides, and polysaccharides featured on the museum media station.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
  if (root) {
    root.ZuckerWelt = root.ZuckerWelt || {};
    root.ZuckerWelt.SugarData = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const CATEGORIES = {
    monosaccharide: {
      id: 'monosaccharide',
      de: 'Einfachzucker (Monosaccharid)',
      en: 'Simple Sugar (Monosaccharide)',
      shortDe: 'Einfachzucker',
      shortEn: 'Monosaccharides',
      glossaryKey: 'monosaccharid'
    },
    disaccharide: {
      id: 'disaccharide',
      de: 'Zweifachzucker (Disaccharid)',
      en: 'Double Sugar (Disaccharide)',
      shortDe: 'Zweifachzucker',
      shortEn: 'Disaccharides',
      glossaryKey: 'zusammengesetzt'
    },
    oligosaccharide: {
      id: 'oligosaccharide',
      de: 'Mehrfachzucker (Oligosaccharid)',
      en: 'Oligosaccharide (3–10 Units)',
      shortDe: 'Oligosaccharide',
      shortEn: 'Oligosaccharides',
      glossaryKey: 'zusammengesetzt'
    },
    polysaccharide: {
      id: 'polysaccharide',
      de: 'Zusammengesetzter Zucker',
      en: 'Compound Sugar (Polysaccharide)',
      shortDe: 'Vielfachzucker',
      shortEn: 'Polysaccharides',
      glossaryKey: 'zusammengesetzt'
    },
    sugar_alcohol: {
      id: 'sugar_alcohol',
      de: 'Zuckeralkohol (Alditol)',
      en: 'Sugar Alcohol (Polyol)',
      shortDe: 'Zuckeralkohole',
      shortEn: 'Sugar Alcohols',
      glossaryKey: 'zuckeralkohol'
    },
    sugar_acid: {
      id: 'sugar_acid',
      de: 'Zuckersäure (Uron-/Aldonsäure)',
      en: 'Sugar Acid (Uronic/Aldonic Acid)',
      shortDe: 'Zuckersäuren',
      shortEn: 'Sugar Acids',
      glossaryKey: 'zuckersaeure'
    },
    amino_deoxy: {
      id: 'amino_deoxy',
      de: 'Aminozucker / Desoxyzucker',
      en: 'Amino / Deoxy Sugar Derivative',
      shortDe: 'Amino- & Spezialzucker',
      shortEn: 'Amino & Deoxy Sugars',
      glossaryKey: 'aminozucker'
    }
  };

  const GLOSSARY = {
    aldosen: {
      titleDe: 'Aldosen',
      titleEn: 'Aldoses',
      textDe: 'Aldosen sind Einfachzucker (Monosaccharide), die am ersten Kohlenstoffatom (C1) eine Aldehydgruppe (–CH=O) tragen. Bekannteste Vertreter sind D-Glucose (Traubenzucker), D-Galaktose und D-Ribose. In wässriger Lösung schließen sie sich meist zu stabilen Fünf- oder Sechsringen (Halbacetalen).',
      textEn: 'Aldoses are monosaccharides carrying an aldehyde group (–CH=O) at carbon C1. Prominent examples include D-glucose, D-galactose, and D-ribose. In aqueous solution they predominantly cyclize into 5- or 6-membered hemiacetal rings.'
    },
    ketosen: {
      titleDe: 'Ketosen',
      titleEn: 'Ketoses',
      textDe: 'Ketosen sind Einfachzucker, die im Inneren der Kohlenstoffkette – meist am zweiten Kohlenstoffatom (C2) – eine Ketogruppe (C=O) besitzen. Deshalb haben sie bei gleicher Kohlenstoffzahl ein chirales Zentrum weniger als Aldosen. Bekanntestes Beispiel ist die Fruktose (Fruchtzucker).',
      textEn: 'Ketoses are monosaccharides containing an internal ketone group (C=O), usually at C2. Consequently, they have one fewer chiral center than aldoses of the same carbon count. Fructose is the best-known example.'
    },
    monosaccharid: {
      titleDe: 'Einfachzucker (Monosaccharide)',
      titleEn: 'Simple Sugars (Monosaccharides)',
      textDe: 'Monosaccharide sind die kleinsten, nicht weiter durch Verdauungsenzyme in kleinere Zucker spaltbaren Grundbausteine aller Kohlenhydrate. Chemisch sind es Polyhydroxyaldehyde oder Polyhydroxyketone mit der allgemeinen Summenformel (CH₂O)ₙ.',
      textEn: 'Monosaccharides are the fundamental carbohydrate building blocks that cannot be hydrolyzed into smaller sugars. Chemically they are polyhydroxy aldehydes or ketones with formula (CH₂O)ₙ.'
    },
    zusammengesetzt: {
      titleDe: 'Zusammengesetzter Zucker',
      titleEn: 'Compound Sugar (Di-, Oligo- & Polysaccharides)',
      textDe: 'Verbinden sich zwei oder viele Einfachzucker unter Wasserabspaltung über sogenannte glykosidische Bindungen (z. B. α-1→4 oder β-1→4), entstehen Zweifachzucker (wie Haushaltszucker und Milchzucker) bis hin zu riesigen Biopolymeren wie Stärke, Zellulose und Chitin.',
      textEn: 'When two or thousands of monosaccharides condense via glycosidic linkages (such as α-1→4 or β-1→4), they form disaccharides (sucrose, lactose) up to giant biopolymers like starch, cellulose, and chitin.'
    },
    zuckeralkohol: {
      titleDe: 'Zuckeralkohole (Alditole / Polyole)',
      titleEn: 'Sugar Alcohols (Polyols)',
      textDe: 'Wird die Aldehyd- oder Ketogruppe eines Zuckers zu einer Hydroxygruppe (–OH) reduziert, entsteht ein Zuckeralkohol wie Xylit, Sorbit, Mannit oder Erythrit. Sie schmecken süß, verursachen aber keine Karies und lassen den Blutzucker kaum ansteigen.',
      textEn: 'Reducing a sugar’s carbonyl group to a hydroxyl (–OH) yields a sugar alcohol such as xylitol, sorbitol, mannitol, or erythritol. They taste sweet without causing tooth decay and barely raise blood glucose.'
    },
    zuckersaeure: {
      titleDe: 'Zuckersäuren',
      titleEn: 'Sugar Acids',
      textDe: 'Durch Oxidation endständiger Gruppen entstehen Zuckersäuren (Aldonsäuren an C1 wie Gluconsäure, Uronsäuren an C6 wie Glucuronsäure oder Galacturonsäure). Sie dienen in der Leber zur Entgiftung und bilden Gelierstoffe wie Pektin und Alginat.',
      textEn: 'Oxidation of terminal carbons produces sugar acids (aldonic acids at C1 like gluconic acid; uronic acids at C6 like glucuronic or galacturonic acid), crucial in liver detoxification and gelling biopolymers like pectin and alginate.'
    },
    aminozucker: {
      titleDe: 'Aminozucker & Desoxyzucker',
      titleEn: 'Amino & Deoxy Sugars',
      textDe: 'Wird eine OH-Gruppe durch eine Aminogruppe (–NH₂ bzw. –NH–CO–CH₃) ersetzt, entstehen Aminozucker wie Glucosamin oder N-Acetylglucosamin – die Grundbausteine von Knorpel, Bakterienzellwänden (Murein) und Insektenpanzern (Chitin). Fehlt ein Sauerstoffatom, spricht man von Desoxyzuckern (z. B. Desoxyribose in der DNA).',
      textEn: 'Replacing an OH group with an amino or acetamido group yields amino sugars like glucosamine and N-acetylglucosamine — key units of cartilage, bacterial peptidoglycan, and arthropod chitin. Removing oxygen gives deoxy sugars (e.g., deoxyribose in DNA).'
    },
    glykosidisch: {
      titleDe: 'Glykosidische Bindung (α vs. β)',
      titleEn: 'Glycosidic Linkage (α vs. β)',
      textDe: 'Die Stellung der OH-Gruppe am C1-Atom beim Ringschluss entscheidet alles: α-1→4-Ketten (Stärke) bilden lockere Spiralen und sind für unsere Enzyme leicht verdaulich. β-1→4-Ketten (Zellulose, Chitin) bilden kerzengerade, reißfeste Fasern, die unser Körper nicht spalten kann!',
      textEn: 'The orientation at the anomeric carbon changes everything: α-1→4 chains (starch) coil into digestible helices, whereas β-1→4 chains (cellulose, chitin) form rigid, hydrogen-bonded structural fibers indigestible to human enzymes!'
    },
    reduzierend: {
      titleDe: 'Reduzierende vs. nicht-reduzierende Zucker (Fehling-Probe)',
      titleEn: 'Reducing vs. Non-Reducing Sugars (Fehling’s Test)',
      textDe: 'Besitzt ein Zucker noch eine freie halbacetalische OH-Gruppe am anomeren C-Atom (wie Glucose, Laktose, Maltose oder Cellobiose), kann sich der Ring in wässriger Lösung öffnen und als Aldehyd Kupfer(II)-Ionen zu ziegelrotem Kupfer(I)-oxid (Cu₂O) reduzieren (Fehling-Probe positiv; Fruktose reagiert im Alkalischen durch Keto-Enol-Umlagerung ebenfalls positiv!). Sind dagegen BEIDE anomeren Zentren fest in einer Vollacetal-Bindung verschlossen – wie bei Saccharose (α,β-1→2) oder Trehalose (α,α-1→1) –, bleibt die Fehling-Probe negativ: nicht-reduzierender Zucker!',
      textEn: 'Sugars with a free hemiacetal hydroxyl at an anomeric carbon (glucose, lactose, maltose, cellobiose) can ring-open in solution to an aldehyde and reduce blue Cu(II) ions to brick-red Cu₂O in Fehling’s test (fructose also tests positive via base-catalyzed keto–enol tautomerism!). When BOTH anomeric carbons are locked in a full acetal linkage — as in sucrose (α,β-1→2) or trehalose (α,α-1→1) — the ring cannot open, making it a non-reducing sugar!'
    },
    anomere: {
      titleDe: 'Anomere (α und β) & Mutarotation',
      titleEn: 'Anomers (α and β) & Mutarotation',
      textDe: 'Beim Ringschluss der offenen Kette entsteht am ehemaligen Carbonyl-Kohlenstoff (C1 bei Aldosen, C2 bei Ketosen) ein neues Chiralitätszentrum: das anomere Zentrum. Bei D-Zuckern zeigt die neue OH-Gruppe in der α-Form nach unten (trans zu C6) und in der β-Form nach oben (cis zu C6). In Wasser wandeln sich α- und β-Ring über eine winzige Spur offenkettiger Form (< 0,02 %) ständig ineinander um (Mutarotation: ~36 % α- und ~64 % β-D-Glucopyranose).',
      textEn: 'Ring closure converts the planar carbonyl carbon (C1 in aldoses, C2 in ketoses) into a new stereocenter called the anomeric carbon. In D-sugars, the anomeric OH points down in the α-anomer and up in the β-anomer. In water, α and β rings interconvert via trace open-chain sugar (< 0.02%) until reaching mutarotation equilibrium (~36% α and ~64% β for D-glucopyranose).'
    },
    epimere: {
      titleDe: 'Stereoisomere: Epimere, Diastereomere & Enantiomere',
      titleEn: 'Stereoisomers: Epimers, Diastereomers & Enantiomers',
      textDe: 'Zucker mit gleicher Summenformel, aber unterschiedlicher räumlicher Stellung der OH-Gruppen heißen Stereoisomere. Unterscheiden sie sich an GENAU EINEM chiralen C-Atom, nennt man sie Epimere (z. B. D-Glucose und D-Galaktose an C4; D-Glucose und D-Mannose an C2). Sind ALLE chiralen Zentren gespiegelt, liegt ein Enantiomeren-Paar vor (D-Glucose vs. L-Glucose).',
      textEn: 'Sugars sharing the same molecular formula and connectivity but differing in 3D spatial arrangement are stereoisomers. Isomers differing at EXACTLY ONE chiral center are epimers (e.g., D-glucose vs. D-galactose at C4; D-glucose vs. D-mannose at C2). Inverting ALL chiral centers yields mirror-image enantiomers (D-glucose vs. L-glucose).'
    }
  };

  /**
   * Every sugar entry includes:
   * - slug, nameDe, nameEn
   * - category (key in CATEGORIES)
   * - weight (1..5 visual prominence in the floating word cloud, matching Image 2)
   * - cloudPos: [xPercent, yPercent, zLayer] inspired directly by the spatial layout of Image 2!
   * - linkage: glycosidic bond string (e.g., 'β-1→4', 'α-1→4 & α-1→6', or '— (Monomer)')
   * - buildingBlocksDe / buildingBlocksEn + buildingBlockSlugs (clickable links!)
   * - formula: chemical formula
   * - structureKind: renderer template ('chitin_chair', 'cellulose_chair', 'starch_chain', 'glycogen_branch', 'sucrose_dimer', 'lactose_dimer', 'maltose_dimer', 'fischer', 'haworth', 'polyol', 'uronic', 'amino_chair', 'sialic', 'polymer_ribbon')
   * - stereoPreset: optional { sugarClass, carbons, dirs } to jump directly into the C-Dreher!
   * - descDe, descEn, extraDe, extraEn
   */
  const SUGARS = [
    // ==================== POLYSACCHARIDE ====================
    {
      slug: 'chitin',
      nameDe: 'Chitin',
      nameEn: 'Chitin',
      category: 'polysaccharide',
      weight: 4,
      cloudPos: [60.9, 61.2, 2],
      linkage: 'β-1→4',
      buildingBlocksDe: 'N-Acetylglucosamin',
      buildingBlocksEn: 'N-Acetylglucosamine',
      buildingBlockSlugs: ['n-acetylglucosamin'],
      formula: '(C₈H₁₃NO₅)ₙ',
      structureKind: 'chitin_chair',
      descDe: 'Ist ein entscheidender, strukturgebender Bestandteil des Außenskeletts von Gliederfüßern wie Insekten, Krebsen und Spinnen sowie der Zellwand von Pilzen. Es ist im Wesentlichen ein Polymer aus N-Acetylglucosamin.',
      extraDe: 'Seit einigen Jahren wird durch Entfernen der Essigsäurereste aus dem Chitin von Krabbenschalenabfällen Chitosan gewonnen – ein vielseitiger Biowerkstoff für Medizin, Wasserfilter und Bioplastik.',
      descEn: 'A crucial structural biopolymer forming the exoskeleton of arthropods such as insects, crustaceans, and spiders, as well as fungal cell walls. Chemically it is a linear polymer of N-acetylglucosamine.',
      extraEn: 'Removing acetyl groups from crab-shell chitin yields chitosan — a versatile sustainable biomaterial used in wound dressings, water filtration, and bioplastics.'
    },
    {
      slug: 'zellulose',
      nameDe: 'Zellulose',
      nameEn: 'Cellulose',
      category: 'polysaccharide',
      weight: 4,
      cloudPos: [57, 14, 2],
      linkage: 'β-1→4',
      buildingBlocksDe: 'D-Glucose',
      buildingBlocksEn: 'D-Glucose',
      buildingBlockSlugs: ['glucose'],
      formula: '(C₆H₁₀O₅)ₙ',
      structureKind: 'cellulose_chair',
      descDe: 'Das häufigste Biomolekül der Erde! Zellulose verleiht pflanzlichen Zellwänden, Holz, Baumwolle und Papier enorme Zugfestigkeit. Jede zweite Glucose-Einheit ist um 180° gedreht.',
      extraDe: 'Da dem Menschen das Enzym Cellulase fehlt, ist Zellulose für uns ein wichtiger, unverdaulicher Ballaststoff – Wiederkäuer und Termiten nutzen dafür symbiotische Mikroorganismen.',
      descEn: 'Earth’s most abundant organic biomolecule! Cellulose gives plant cell walls, wood, cotton, and paper remarkable tensile strength, with every second glucose unit flipped by 180°.',
      extraEn: 'Because humans lack the enzyme cellulase, cellulose acts as dietary fiber, whereas ruminants and termites digest it via symbiotic gut microbes.'
    },
    {
      slug: 'staerke',
      nameDe: 'Stärke',
      nameEn: 'Starch',
      category: 'polysaccharide',
      weight: 4,
      cloudPos: [82.1, 42.4, 2],
      linkage: 'α-1→4 & α-1→6',
      buildingBlocksDe: 'D-Glucose',
      buildingBlocksEn: 'D-Glucose',
      buildingBlockSlugs: ['glucose'],
      formula: '(C₆H₁₀O₅)ₙ',
      structureKind: 'starch_chain',
      descDe: 'Der wichtigste Energiespeicher der Pflanzen (in Kartoffeln, Getreide, Mais und Reis). Besteht aus unverzweigter, schraubig gewundener Amylose (α-1→4) und verzweigtem Amylopektin (zusätzlich α-1→6).',
      extraDe: 'Neben der Ernährung dient Stärke heute als nachwachsender Rohstoff für Klebstoffe, Papierbeschichtungen und kompostierbare Biokunststoffe.',
      descEn: 'The primary energy reserve of plants (potatoes, grains, corn, rice), composed of helical unbranched amylose (α-1→4) and branched amylopectin (α-1→4 and α-1→6).',
      extraEn: 'Beyond nutrition, starch is a major renewable feedstock for adhesives, paper coatings, and biodegradable bioplastics.'
    },
    {
      slug: 'glykogen',
      nameDe: 'Glykogen',
      nameEn: 'Glycogen',
      category: 'polysaccharide',
      weight: 5,
      cloudPos: [63.6, 73.9, 3],
      linkage: 'α-1→4 & α-1→6',
      buildingBlocksDe: 'D-Glucose',
      buildingBlocksEn: 'D-Glucose',
      buildingBlockSlugs: ['glucose'],
      formula: '(C₆H₁₀O₅)ₙ',
      structureKind: 'glycogen_branch',
      descDe: 'Die „tierische Stärke“: In Leber und Muskulatur speichert der Mensch bis zu 500 g Glucose in Form von hochgradig verzweigtem Glykogen.',
      extraDe: 'Durch die dichten Verzweigungen (alle 8–12 Glucose-Bausteine) können Enzyme bei plötzlichem Energiebedarf an vielen Kettenenden gleichzeitig Glucose abspalten.',
      descEn: 'Often called "animal starch": humans store up to 500 g of glucose in liver and muscle tissue as densely branched glycogen.',
      extraEn: 'Frequent α-1→6 branch points (every 8–12 residues) allow enzymes to release glucose rapidly from many chain ends simultaneously during exercise.'
    },
    {
      slug: 'pektin',
      nameDe: 'Pektin',
      nameEn: 'Pectin',
      category: 'polysaccharide',
      weight: 4,
      cloudPos: [20, 20, 3],
      linkage: 'α-1→4 (verzweigt)',
      buildingBlocksDe: 'D-Galacturonsäure, L-Arabinose, L-Rhamnose',
      buildingBlocksEn: 'D-Galacturonic acid, L-Arabinose, L-Rhamnose',
      buildingBlockSlugs: ['galacturonsaeure', 'arabinose-l', 'rhamnose'],
      formula: '(C₆H₈O₆)ₙ (teilverestert)',
      structureKind: 'polymer_ribbon',
      descDe: 'Pflanzliches Gerüstpolysaccharid in den Zellwänden von Früchten (besonders Äpfeln und Zitrusschalen). Bildet dreidimensionale Gel-Netzwerke.',
      extraDe: 'Als natürliches Geliermittel (E 440) lässt Pektin Marmelade und Konfitüre beim Einkochen mit Zucker und Fruchtsäure fest werden.',
      descEn: 'Structural heteropolysaccharide abundant in fruit cell walls (especially apples and citrus peels) capable of forming 3D hydrogels.',
      extraEn: 'Widely used as natural gelling agent E 440 to set jams and jellies in the presence of sugar and acid.'
    },
    {
      slug: 'inulin',
      nameDe: 'Inulin',
      nameEn: 'Inulin',
      category: 'polysaccharide',
      weight: 4,
      cloudPos: [31.1, 49.7, 3],
      linkage: 'β-2→1',
      buildingBlocksDe: 'D-Fruktose (Start: D-Glucose)',
      buildingBlocksEn: 'D-Fructose (capped by D-Glucose)',
      buildingBlockSlugs: ['fruktose', 'glucose'],
      formula: 'C₆H₁₁O₅–(C₆H₁₀O₅)ₙ–OH',
      structureKind: 'inulin_chain',
      descDe: 'Reservekohlenhydrat von Korbblütlern wie Chicorée, Topinambur, Schwarzwurzeln und Artischocken – aufgebaut aus Ketten von bis zu 100 Fruktose-Fünfringen.',
      extraDe: 'Im Dünndarm unverdaulich, wirkt Inulin im Dickdarm als wertvolles Präbiotikum für nützliche Bifidobakterien.',
      descEn: 'Storage polysaccharide (fructan) in chicory, Jerusalem artichoke, and dahlias, built from chains of β-2→1 linked fructose furanose rings.',
      extraEn: 'Undigested in the small intestine, inulin serves as a valuable prebiotic fiber feeding beneficial gut bifidobacteria.'
    },
    {
      slug: 'laminarin',
      nameDe: 'Laminarin',
      nameEn: 'Laminarin',
      category: 'polysaccharide',
      weight: 5,
      cloudPos: [45.2, 60.2, 3],
      linkage: 'β-1→3 & β-1→6',
      buildingBlocksDe: 'D-Glucose, Mannit',
      buildingBlocksEn: 'D-Glucose, Mannitol',
      buildingBlockSlugs: ['glucose', 'mannit'],
      formula: '(C₆H₁₀O₅)ₙ',
      structureKind: 'polymer_ribbon',
      descDe: 'Das zentrale Speicher-Polysaccharid mariner Braunalgen (Seetang wie Laminaria). Übernimmt im Ozean die Rolle, die Stärke bei Landpflanzen hat.',
      extraDe: 'Spielt eine riesige Rolle im globalen marinen Kohlenstoffkreislauf und wird in der Medizin auf immunmodulierende Wirkungen erforscht.',
      descEn: 'The principal storage glucan of marine brown algae (kelp such as Laminaria), fulfilling the role starch plays in land plants.',
      extraEn: 'Major player in the oceanic carbon cycle and researched in biomedicine for immunomodulatory effects.'
    },
    {
      slug: 'agar',
      nameDe: 'Agar',
      nameEn: 'Agar (Agar-Agar)',
      category: 'polysaccharide',
      weight: 4,
      cloudPos: [38.2, 85.4, 2],
      linkage: 'β-1→4 & α-1→3',
      buildingBlocksDe: 'D-Galaktose, 3,6-Anhydro-Galactose',
      buildingBlocksEn: 'D-Galactose, 3,6-Anhydro-galactose',
      buildingBlockSlugs: ['galaktose', '3-6-anhydro-galactose'],
      formula: '(C₁₂H₁₈O₉)ₙ',
      structureKind: 'polymer_ribbon',
      descDe: 'Aus den Zellwänden von Rotalgen gewonnenes Galaktan. Bildet schon in geringsten Konzentrationen hitzestabile Gele.',
      extraDe: 'Unersetzlich als Nährboden in der Mikrobiologie (entdeckt durch Fanny Hesse im Labor von Robert Koch!) und als pflanzliche Gelatine-Alternative.',
      descEn: 'Galactan polymer extracted from red algae cell walls, forming firm, heat-stable gels at very low concentrations.',
      extraEn: 'Indispensable culture medium in microbiology (pioneered by Fanny Hesse in Robert Koch’s lab!) and vegan gelatin substitute.'
    },
    {
      slug: 'alginat',
      nameDe: 'Alginat',
      nameEn: 'Alginate',
      category: 'polysaccharide',
      weight: 3,
      cloudPos: [29.7, 60.8, 1],
      linkage: 'β-1→4 & α-1→4',
      buildingBlocksDe: 'Mannuronsäure, Guluronsäure',
      buildingBlocksEn: 'Mannuronic acid, Guluronic acid',
      buildingBlockSlugs: ['mannuronsaeure', 'guluronsaeure'],
      formula: '(C₆H₇O₆Na)ₙ',
      structureKind: 'polymer_ribbon',
      descDe: 'Strukturgebender Schleimstoff aus Braunalgen, der ihnen in der Meeresströmung gleichzeitig Festigkeit und geschmeidige Biegsamkeit verleiht.',
      extraDe: 'Mit Calcium-Ionen bildet Alginat sofort elastische Gel-Perlen („Eierkarton-Modell“) – beliebt für Zahnarzt-Abdrücke, Wundauflagen und Molekularküche (Bubble Tea!).',
      descEn: 'Cell-wall copolymer from brown seaweeds granting kelp both strength and flexibility in ocean currents.',
      extraEn: 'Cross-links instantly with calcium ions ("egg-box model") into elastic hydrogels used in dental impressions, wound care, and molecular gastronomy spheres.'
    },
    {
      slug: 'carrageen',
      nameDe: 'Carrageen',
      nameEn: 'Carrageenan',
      category: 'polysaccharide',
      weight: 3,
      cloudPos: [54.3, 73.3, 2],
      linkage: 'α-1→3 & β-1→4',
      buildingBlocksDe: 'D-Galaktose, 3,6-Anhydro-Galactose (sulfatiert)',
      buildingBlocksEn: 'D-Galactose, 3,6-Anhydro-galactose (sulfated)',
      buildingBlockSlugs: ['galaktose', '3-6-anhydro-galactose'],
      formula: '(C₁₂H₁₇O₁₂S)ₙ',
      structureKind: 'polymer_ribbon',
      descDe: 'Gruppe sulfatierter Polysaccharide aus Rotalgen („Irisches Moos“). Reagiert stark mit Milchproteinen.',
      extraDe: 'Wird als Verdickungs- und Stabilisierungsmittel (E 407) in Sahne, Eiscreme, Kakao und Zahnpasta eingesetzt.',
      descEn: 'Family of linear sulfated polysaccharides extracted from red seaweeds ("Irish moss") that interact strongly with milk proteins.',
      extraEn: 'Used widely as stabilizer and thickener (E 407) in dairy products, ice cream, plant milks, and toothpaste.'
    },
    {
      slug: 'pullulan',
      nameDe: 'Pullulan',
      nameEn: 'Pullulan',
      category: 'polysaccharide',
      weight: 3,
      cloudPos: [18.1, 67.5, 2],
      linkage: 'α-1→4 & α-1→6',
      buildingBlocksDe: 'Maltotriose / D-Glucose',
      buildingBlocksEn: 'Maltotriose / D-Glucose',
      buildingBlockSlugs: ['maltotriose', 'glucose', 'maltose'],
      formula: '(C₆H₁₀O₅)ₙ',
      structureKind: 'starch_chain',
      descDe: 'Wasserlösliches Biopolymer des Hefepilzes Aureobasidium pullulans, aufgebaut aus regelmäßig über α-1→6 verknüpften Maltotriose-Dreierblöcken.',
      extraDe: 'Lässt sich zu hauchdünnen, essbaren, sauerstoffdichten Folien gießen – z. B. für Atemfrische-Streifen auf der Zunge und vegane Medikamentenkapseln!',
      descEn: 'Water-soluble fungal polysaccharide made of maltotriose trimers regularly linked via α-1→6 bonds.',
      extraEn: 'Forms transparent, oxygen-impermeable edible films used in breath-freshener strips and plant-based pharmaceutical capsules!'
    },
    {
      slug: 'dextran',
      nameDe: 'Dextran',
      nameEn: 'Dextran',
      category: 'polysaccharide',
      weight: 3,
      cloudPos: [59.4, 80.4, 1],
      linkage: 'α-1→6 (Verzweigung α-1→3)',
      buildingBlocksDe: 'D-Glucose',
      buildingBlocksEn: 'D-Glucose',
      buildingBlockSlugs: ['glucose'],
      formula: '(C₆H₁₀O₅)ₙ',
      structureKind: 'glycogen_branch',
      descDe: 'Von Milchsäurebakterien (Leuconostoc) aus Haushaltszucker gebildetes hochmolekulares Glucose-Polymer.',
      extraDe: 'In der Notfallmedizin dient Dextran als Blutplasma-Ersatzmittel; im Mund ist es allerdings auch Hauptbestandteil von Zahnbelag (Plaque)!',
      descEn: 'High-molecular-weight glucan synthesized from sucrose by lactic acid bacteria such as Leuconostoc mesenteroides.',
      extraEn: 'Used medically as a blood plasma volume expander, while in the mouth bacterial dextrans form sticky dental plaque!'
    },
    {
      slug: 'hemizellulose',
      nameDe: 'Hemizellulose',
      nameEn: 'Hemicellulose',
      category: 'polysaccharide',
      weight: 3,
      cloudPos: [35.3, 79.4, 1],
      linkage: 'β-1→4 (verzweigt)',
      buildingBlocksDe: 'D-Xylose, D-Mannose, L-Arabinose, D-Galaktose',
      buildingBlocksEn: 'D-Xylose, D-Mannose, L-Arabinose, D-Galactose',
      buildingBlockSlugs: ['xylose', 'mannose', 'arabinose-l', 'galaktose'],
      formula: 'Heteropolysaccharid',
      structureKind: 'polymer_ribbon',
      descDe: 'Vielfältige Gruppe verzweigter Zellwand-Polysaccharide, die in Holz und Stroh die starren Zellulosefasern wie ein vernetzender Mörtel zusammenhalten.',
      extraDe: 'Macht bis zu einem Drittel der pflanzlichen Biomasse aus und ist ein Schlüsselrohstoff für Bioraffinerien und Xylit-Herstellung.',
      descEn: 'Diverse group of branched cell-wall heteropolysaccharides that cross-link rigid cellulose microfibrils in wood and straw.',
      extraEn: 'Accounts for roughly one third of plant biomass and serves as a key feedstock in biorefineries and xylitol production.'
    },
    {
      slug: 'gummi-arabicum',
      nameDe: 'Gummi Arabicum',
      nameEn: 'Gum Arabic',
      category: 'polysaccharide',
      weight: 3,
      cloudPos: [70.5, 45.7, 2],
      linkage: 'β-1→3 & β-1→6',
      buildingBlocksDe: 'D-Galaktose, L-Arabinose, L-Rhamnose, D-Glucuronsäure',
      buildingBlocksEn: 'D-Galactose, L-Arabinose, L-Rhamnose, D-Glucuronic acid',
      buildingBlockSlugs: ['galaktose', 'arabinose-l', 'rhamnose', 'glucuronsaeure'],
      formula: 'Arabinogalaktan-Protein',
      structureKind: 'polymer_ribbon',
      descDe: 'Getrockneter Wundsaft afrikanischer Akazienbäume – eines der ältesten genutzten Naturharze der Menschheit (schon im Alten Ägypten für Mumienbinden und Farben!).',
      extraDe: 'Heute unverzichtbar als Emulgator in Erfrischungsgetränken, Aquarellfarben, Briefmarkengummierung und Lakritz.',
      descEn: 'Hardened sap of African Acacia trees — one of humanity’s oldest natural gums, used since Ancient Egypt for pigments and mummification.',
      extraEn: 'Today indispensable as an emulsifier in soft drinks, watercolor paints, postage stamps, and confectionery.'
    },
    {
      slug: 'traganth',
      nameDe: 'Traganth',
      nameEn: 'Tragacanth',
      category: 'polysaccharide',
      weight: 3,
      cloudPos: [50.8, 42.8, 1],
      linkage: 'α-1→4 (hochverzweigt)',
      buildingBlocksDe: 'D-Galacturonsäure, D-Xylose, L-Fucose, L-Arabinose',
      buildingBlocksEn: 'D-Galacturonic acid, D-Xylose, L-Fucose, L-Arabinose',
      buildingBlockSlugs: ['galacturonsaeure', 'xylose', 'fucose', 'arabinose-l'],
      formula: 'Pflanzengummi (E 413)',
      structureKind: 'polymer_ribbon',
      descDe: 'Pflanzliches Polysaccharid-Exsudat aus orientalischen Tragant-Sträuchern (Astragalus), das mit Wasser extrem zähflüssige Gele bildet.',
      extraDe: 'Klassisches Bindemittel der Konditoren für kunstvolle Blüten und Figuren aus Blütenpaste und Zuckerguss.',
      descEn: 'Natural polysaccharide exudate from Middle Eastern Astragalus shrubs that swells in water into highly viscous gels.',
      extraEn: 'Prized by pastry chefs as the classic binder for sculpted sugar paste flowers and icings (E 413).'
    },
    {
      slug: 'glykosaminoglykan',
      nameDe: 'Glykosaminoglykan',
      nameEn: 'Glycosaminoglycan (GAG)',
      category: 'polysaccharide',
      weight: 4,
      cloudPos: [54.8, 34, 3],
      linkage: 'β-1→3 & β-1→4 (alternierend)',
      buildingBlocksDe: 'Aminozucker (Glucosamin) + Uronsäure (Glucuron-/Iduronsäure)',
      buildingBlocksEn: 'Amino sugar + Uronic acid (Glucuronic / Iduronic acid)',
      buildingBlockSlugs: ['glucosamin', 'glucuronsaeure', 'iduronsaeure'],
      formula: 'Lineares Polyanion',
      structureKind: 'polymer_ribbon',
      descDe: 'Lange, negativ geladene Zuckerketten wie Hyaluronsäure, Chondroitinsulfat und Heparin. Sie binden enorme Mengen Wasser wie ein molekularer Schwamm.',
      extraDe: 'Verleihen unseren Gelenkknorpeln, Bandscheiben und dem Glaskörper des Auges ihre stoßdämpfende Elastizität!',
      descEn: 'Long, negatively charged repeating disaccharide chains (hyaluronan, chondroitin sulfate, heparin) that bind vast amounts of water.',
      extraEn: 'Give human joint cartilage, intervertebral discs, and the eye’s vitreous humor shock-absorbing elasticity!'
    },
    {
      slug: 'murein',
      nameDe: 'Murein',
      nameEn: 'Peptidoglycan (Murein)',
      category: 'polysaccharide',
      weight: 4,
      cloudPos: [25.8, 79.6, 2],
      linkage: 'β-1→4 (+ Peptidbrücken)',
      buildingBlocksDe: 'N-Acetylglucosamin, N-Acetylmuraminsäure',
      buildingBlocksEn: 'N-Acetylglucosamine, N-Acetylmuramic acid',
      buildingBlockSlugs: ['n-acetylglucosamin', 'n-acetylmuraminsaeure'],
      formula: 'Zucker-Peptid-Netzwerk',
      structureKind: 'chitin_chair',
      descDe: 'Ein einzigartiges Riesenmolekül, das jede Bakterienzelle wie ein kettenhemdartiger Druckbehälter umhüllt: Zuckerketten, quervernetzt durch kurze Aminosäurebrücken.',
      extraDe: 'Penicillin hemmt gezielt den Aufbau dieses Murein-Netzes – dadurch platzen Bakterien, während menschliche Zellen (ohne Murein!) verschont bleiben!',
      descEn: 'A giant bag-shaped macromolecule surrounding bacteria like chainmail: β-1→4 glycan strands cross-linked by short oligopeptides.',
      extraEn: 'Penicillin specifically blocks murein cross-linking, bursting bacterial cells without harming murein-free human cells!'
    },

    // ==================== DISACCHARIDE & OLIGOSACCHARIDE ====================
    {
      slug: 'saccharose',
      nameDe: 'Saccharose',
      nameEn: 'Sucrose',
      category: 'disaccharide',
      weight: 4,
      cloudPos: [20.8, 61.5, 2],
      linkage: 'α,β-1→2',
      buildingBlocksDe: 'D-Glucose + D-Fruktose',
      buildingBlocksEn: 'D-Glucose + D-Fructose',
      buildingBlockSlugs: ['glucose', 'fruktose'],
      formula: 'C₁₂H₂₂O₁₁',
      structureKind: 'sucrose_dimer',
      descDe: 'Unser klassischer Haushalts-, Kristall-, Rohr- und Rübenzucker! Ein Zweifachzucker aus je einem Ring Glucose und Fruktose, Kopf-an-Kopf über beide anomeren Zentren verknüpft.',
      extraDe: 'Durch diese spezielle α,β-1→2-Bindung ist Saccharose ein nicht-reduzierender Zucker und chemisch besonders lagerstabil.',
      descEn: 'Everyday table sugar from sugar cane and sugar beets! A disaccharide joining α-D-glucose and β-D-fructose head-to-head through both anomeric carbons.',
      extraEn: 'Because both anomeric carbons are locked in the α,β-1→2 bond, sucrose is non-reducing and chemically stable for transport in plant phloem.'
    },
    {
      slug: 'laktose',
      nameDe: 'Laktose',
      nameEn: 'Lactose',
      category: 'disaccharide',
      weight: 4,
      cloudPos: [43.4, 41.9, 3],
      linkage: 'β-1→4',
      buildingBlocksDe: 'D-Galaktose + D-Glucose',
      buildingBlocksEn: 'D-Galactose + D-Glucose',
      buildingBlockSlugs: ['galaktose', 'glucose'],
      formula: 'C₁₂H₂₂O₁₁',
      structureKind: 'lactose_dimer',
      descDe: 'Der Milchzucker der Säugetiere (macht ca. 4,8 % der Kuhmilch und 7 % der Muttermilch aus). Schmeckt deutlich milder süß als Haushaltszucker.',
      extraDe: 'Zur Verdauung ist das Enzym Laktase nötig. Fehlt es im Erwachsenenalter, vergären Darmbakterien die Laktose – bekannt als Laktoseintoleranz.',
      descEn: 'Milk sugar of mammals (~4.8% of cow’s milk and ~7% of human milk), tasting noticeably less sweet than sucrose.',
      extraEn: 'Digestion requires the enzyme lactase; when lactase expression drops in adulthood, gut bacteria ferment lactose (lactose intolerance).'
    },
    {
      slug: 'maltose',
      nameDe: 'Maltose',
      nameEn: 'Maltose',
      category: 'disaccharide',
      weight: 5,
      cloudPos: [92, 67, 3],
      linkage: 'α-1→4',
      buildingBlocksDe: '2 × D-Glucose',
      buildingBlocksEn: '2 × D-Glucose',
      buildingBlockSlugs: ['glucose'],
      formula: 'C₁₂H₂₂O₁₁',
      structureKind: 'maltose_dimer',
      descDe: 'Malzzucker! Entsteht beim Keimen von Getreide (Mälzen beim Bierbrauen) sowie direkt im Mund, wenn unsere Speichel-Amylase Stärke in Zweierblöcke zerlegt.',
      extraDe: 'Deshalb schmeckt ein Stück Brot nach längerem Kauen plötzlich leicht süßlich!',
      descEn: 'Malt sugar! Formed when germinating grain breaks down starch (brewing malt) and right in your mouth via salivary α-amylase.',
      extraEn: 'That’s why chewing bread thoroughly makes it gradually taste sweet!'
    },
    {
      slug: 'isomaltose',
      nameDe: 'Isomaltose',
      nameEn: 'Isomaltose',
      category: 'disaccharide',
      weight: 2,
      cloudPos: [78.7, 75, 1],
      linkage: 'α-1→6',
      buildingBlocksDe: '2 × D-Glucose',
      buildingBlocksEn: '2 × D-Glucose',
      buildingBlockSlugs: ['glucose'],
      formula: 'C₁₂H₂₂O₁₁',
      structureKind: 'isomaltose_dimer',
      descDe: 'Der „Verzweigungs-Zwilling“ der Maltose: Entsteht beim Abbau der α-1→6-Verzweigungsstellen von Stärke (Amylopektin) und Glykogen.',
      extraDe: 'Kommt natürlich in Honig, Karamell und fermentierter Sojasauce vor.',
      descEn: 'Positional isomer of maltose liberated from the α-1→6 branch points during digestion of amylopectin and glycogen.',
      extraEn: 'Naturally present in honey, caramel, and fermented soy sauces.'
    },
    {
      slug: 'isomaltulose',
      nameDe: 'Isomaltulose',
      nameEn: 'Isomaltulose (Palatinose)',
      category: 'disaccharide',
      weight: 3,
      cloudPos: [56.5, 55.6, 2],
      linkage: 'α-1→6',
      buildingBlocksDe: 'D-Glucose + D-Fruktose',
      buildingBlocksEn: 'D-Glucose + D-Fructose',
      buildingBlockSlugs: ['glucose', 'fruktose'],
      formula: 'C₁₂H₂₂O₁₁',
      structureKind: 'isomaltulose_dimer',
      descDe: 'Zahnfreundlicher Zweifachzucker (auch Palatinose genannt), der in geringen Mengen in Honig vorkommt und enzymatisch aus Rübenzucker umgelagert wird.',
      extraDe: 'Seine α-1→6-Bindung wird im Dünndarm viel langsamer gespalten als Saccharose – ideal für gleichmäßige Energie ohne Blutzuckerspitzen.',
      descEn: 'Tooth-friendly isomer of sucrose (Palatinose) occurring naturally in honey and produced enzymatically from beet sugar.',
      extraEn: 'Its stable α-1→6 linkage is hydrolyzed slowly in the small intestine, providing sustained energy with a low glycemic response.'
    },
    {
      slug: 'laktulose',
      nameDe: 'Laktulose',
      nameEn: 'Lactulose',
      category: 'disaccharide',
      weight: 3,
      cloudPos: [31.8, 73.4, 2],
      linkage: 'β-1→4',
      buildingBlocksDe: 'D-Galaktose + D-Fruktose',
      buildingBlocksEn: 'D-Galactose + D-Fructose',
      buildingBlockSlugs: ['galaktose', 'fruktose'],
      formula: 'C₁₂H₂₂O₁₁',
      structureKind: 'laktulose_dimer',
      descDe: 'Entsteht in kleinen Mengen beim starken Erhitzen von Milch durch Umlagerung des Glucose-Teils der Laktose in Fruktose.',
      extraDe: 'Dient als Nachweis für ultrahocherhitzte Milch und in der Medizin als sanftes, osmotisch wirksames Mittel für die Darmgesundheit.',
      descEn: 'Formed during intense heating of milk via isomerization of lactose’s glucose moiety into fructose.',
      extraEn: 'Serves analytically as an indicator of heat-treated milk and medically as a gentle prebiotic and osmotic laxative.'
    },
    {
      slug: 'turanose',
      nameDe: 'Turanose',
      nameEn: 'Turanose',
      category: 'disaccharide',
      weight: 4,
      cloudPos: [22.9, 49.5, 2],
      linkage: 'α-1→3',
      buildingBlocksDe: 'D-Glucose + D-Fruktose',
      buildingBlocksEn: 'D-Glucose + D-Fructose',
      buildingBlockSlugs: ['glucose', 'fruktose'],
      formula: 'C₁₂H₂₂O₁₁',
      structureKind: 'turanose_dimer',
      descDe: 'Natürliches Strukturisomer des Haushaltszuckers, das in Bienenhonig vorkommt und halb so süß wie Saccharose schmeckt.',
      extraDe: 'In Pflanzen wirkt Turanose als spannendes Signalmolekül für den Zuckerstoffwechsel.',
      descEn: 'Naturally occurring α-1→3 isomer of sucrose found in honey, with roughly half the sweetness of table sugar.',
      extraEn: 'Acts in higher plants as a signaling molecule regulating carbohydrate metabolism.'
    },
    {
      slug: 'gentiobiose',
      nameDe: 'Gentiobiose',
      nameEn: 'Gentiobiose',
      category: 'disaccharide',
      weight: 3,
      cloudPos: [80.9, 56.4, 2],
      linkage: 'β-1→6',
      buildingBlocksDe: '2 × D-Glucose',
      buildingBlocksEn: '2 × D-Glucose',
      buildingBlockSlugs: ['glucose'],
      formula: 'C₁₂H₂₂O₁₁',
      structureKind: 'gentiobiose_dimer',
      descDe: 'Überraschung unter den Zuckern: Gentiobiose schmeckt nicht süß, sondern deutlich bitter! Benannt nach dem Enzian (Gentiana).',
      extraDe: 'Sie ist der wasserlösliche Zuckerteil von Crocin (gibt Safran seine leuchtend gelbe Farbe!) und Amygdalin (in Bittermandeln).',
      descEn: 'A surprising sugar that tastes distinctly bitter rather than sweet! Named after gentian root.',
      extraEn: 'Forms the water-soluble sugar moiety of crocin (giving saffron its golden color!) and amygdalin in bitter almonds.'
    },
    {
      slug: 'raffinose',
      nameDe: 'Raffinose',
      nameEn: 'Raffinose',
      category: 'oligosaccharide',
      weight: 3,
      cloudPos: [39.3, 48.2, 2],
      linkage: 'α-1→6 & α,β-1→2',
      buildingBlocksDe: 'D-Galaktose + D-Glucose + D-Fruktose',
      buildingBlocksEn: 'D-Galactose + D-Glucose + D-Fructose',
      buildingBlockSlugs: ['galaktose', 'glucose', 'fruktose'],
      formula: 'C₁₈H₃₂O₁₆',
      structureKind: ' polymer_ribbon'.trim(),
      descDe: 'Dreifachzucker (Trisaccharid) in Hülsenfrüchten (Bohnen, Linsen), Kohl und Zuckerrübenmelasse.',
      extraDe: 'Warum „jedes Böhnchen ein Tönchen“ gibt: Uns fehlt das Enzym α-Galaktosidase – daher bauen erst Darmbakterien Raffinose unter Gasbildung ab!',
      descEn: 'Trisaccharide abundant in beans, lentils, cabbage, and sugar-beet molasses.',
      extraEn: 'Why beans cause flatulence: humans lack α-galactosidase, leaving colonic microbes to ferment raffinose into gas!'
    },
    {
      slug: 'stachyose',
      nameDe: 'Stachyose',
      nameEn: 'Stachyose',
      category: 'oligosaccharide',
      weight: 2,
      cloudPos: [12, 13, 1],
      linkage: 'α-1→6, α-1→6, α,β-1→2',
      buildingBlocksDe: '2 × D-Galaktose + D-Glucose + D-Fruktose',
      buildingBlocksEn: '2 × D-Galactose + D-Glucose + D-Fructose',
      buildingBlockSlugs: ['galaktose', 'glucose', 'fruktose'],
      formula: 'C₂₄H₄₂O₂₁',
      structureKind: 'polymer_ribbon',
      descDe: 'Vierfachzucker (Tetrasaccharid) aus Knollen-Ziest (Stachys), Sojabohnen und Erbsen – quasi Raffinose mit einer zusätzlichen Galaktose.',
      extraDe: 'Dient Pflanzen als Frostschutzmittel in kalten Wintern und im menschlichen Darm als Präbiotikum.',
      descEn: 'Tetrasaccharide in soybeans, peas, and Chinese artichoke — essentially raffinose carrying one extra galactose unit.',
      extraEn: 'Protects overwintering plants against frost and acts as a prebiotic oligosaccharide in the human gut.'
    },
    {
      slug: 'gentianose',
      nameDe: 'Gentianose',
      nameEn: 'Gentianose',
      category: 'oligosaccharide',
      weight: 3,
      cloudPos: [12.5, 49, 2],
      linkage: 'β-1→6 & α,β-1→2',
      buildingBlocksDe: '2 × D-Glucose + D-Fruktose',
      buildingBlocksEn: '2 × D-Glucose + D-Fructose',
      buildingBlockSlugs: ['glucose', 'fruktose'],
      formula: 'C₁₈H₃₂O₁₆',
      structureKind: 'polymer_ribbon',
      descDe: 'Reserve-Dreifachzucker in den Wurzeln von Enzian-Arten (Gentiana lutea), aufgebaut aus einer Gentiobiose- und einer Saccharose-Teilstruktur.',
      extraDe: 'Wird beim Fermentieren von Enzianwurzeln durch Hefen aufgespalten und vergoren.',
      descEn: 'Storage trisaccharide in gentian roots combining structural motifs of both gentiobiose and sucrose.',
      extraEn: 'Hydrolyzed and fermented during traditional alpine gentian root distillation.'
    },
    {
      slug: 'melezitose',
      nameDe: 'Melezitose',
      nameEn: 'Melezitose',
      category: 'oligosaccharide',
      weight: 4,
      cloudPos: [80.9, 62.6, 3],
      linkage: 'α-1→3 & α,β-2→1',
      buildingBlocksDe: '2 × D-Glucose + D-Fruktose',
      buildingBlocksEn: '2 × D-Glucose + D-Fructose',
      buildingBlockSlugs: ['glucose', 'fruktose'],
      formula: 'C₁₈H₃₂O₁₆',
      structureKind: 'polymer_ribbon',
      descDe: 'Der „Zementhonig-Zucker“! Blattläuse bauen Pflanzensaft zu diesem Dreifachzucker um und scheiden ihn als Honigtau im Wald aus.',
      extraDe: 'Sammeln Bienen viel Lärchen-Honigtau, kristallisiert Melezitose schon in der Wabe steinhart aus („Zementhonig“).',
      descEn: 'The "cement honey" trisaccharide synthesized by aphids in forest honeydew from tree sap.',
      extraEn: 'When bees collect larch honeydew rich in melezitose, the honey crystallizes rock-hard right inside the comb!'
    },
    {
      slug: 'planteose',
      nameDe: 'Planteose',
      nameEn: 'Planteose',
      category: 'oligosaccharide',
      weight: 2,
      cloudPos: [80.6, 50, 1],
      linkage: 'α-1→6 & β,α-2→1',
      buildingBlocksDe: 'D-Galaktose + D-Fruktose + D-Glucose',
      buildingBlocksEn: 'D-Galactose + D-Fructose + D-Glucose',
      buildingBlockSlugs: ['galaktose', 'fruktose', 'glucose'],
      formula: 'C₁₈H₃₂O₁₆',
      structureKind: 'polymer_ribbon',
      descDe: 'Dreifachzucker in den Samen von Wegerich (Plantago), Sesam, Minze und Chiasamen. Isomer der Raffinose, bei dem Galaktose am Fruktose-Ende hängt.',
      extraDe: 'Dient keimenden Pflanzensamen als kompakt gespeicherte Startenergie.',
      descEn: 'Trisaccharide found in plantain (Plantago), sesame, mint, and chia seeds — an isomer of raffinose where galactose attaches to the fructose end.',
      extraEn: 'Provides compact, stable energy reserves during seed germination.'
    },

    // ==================== MONOSACCHARIDE (ALDOSEN & KETOSEN) ====================
    {
      slug: 'glucose',
      nameDe: 'Glucose',
      nameEn: 'Glucose',
      category: 'monosaccharide',
      weight: 5,
      cloudPos: [47.5, 27.3, 3],
      linkage: '— (Monosaccharid)',
      buildingBlocksDe: 'Aldohexose (6 C-Atome)',
      buildingBlocksEn: 'Aldohexose (6 Carbons)',
      buildingBlockSlugs: [],
      formula: 'C₆H₁₂O₆',
      structureKind: 'haworth',
      stereoPreset: { sugarClass: 'aldose', carbons: 6, dirs: ['R', 'L', 'R', 'R'] },
      descDe: 'Traubenzucker (D-Glucose) ist der zentrale Kraftstoff des Stoffwechsels: Pflanzen erzeugen ihn bei der Fotosynthese aus Sonnenlicht, Wasser und CO₂.',
      extraDe: 'Unser Gehirn allein verbraucht rund 120–140 Gramm Glucose pro Tag! Zugleich ist Glucose der Grundbaustein von Stärke, Glykogen und Zellulose.',
      descEn: 'D-Glucose (grape sugar) is life’s central metabolic fuel, synthesized by plants from sunlight, water, and CO₂ via photosynthesis.',
      extraEn: 'The human brain alone consumes ~120–140 g of glucose daily! It also serves as the monomer of starch, glycogen, and cellulose.'
    },
    {
      slug: 'fruktose',
      nameDe: 'Fruktose',
      nameEn: 'Fructose',
      category: 'monosaccharide',
      weight: 4,
      cloudPos: [54, 20.4, 3],
      linkage: '— (Monosaccharid)',
      buildingBlocksDe: 'Ketohexose (6 C-Atome)',
      buildingBlocksEn: 'Ketohexose (6 Carbons)',
      buildingBlockSlugs: [],
      formula: 'C₆H₁₂O₆',
      structureKind: 'haworth',
      stereoPreset: { sugarClass: 'ketose', carbons: 6, dirs: ['L', 'R', 'R'] },
      descDe: 'Fruchtzucker kommt frei in Obst und Honig vor und bildet mit Glucose zusammen den Haushaltszucker (Saccharose). Hat von allen natürlichen Zuckern die höchste Süßkraft.',
      extraDe: 'Wird insulinunabhängig in der Leber verstoffwechselt und liegt in Lösung sowohl als Fünfring (Furanose) als auch als Sechsring (Pyranose) vor.',
      descEn: 'Fruit sugar occurs freely in fruits and honey and pairs with glucose in sucrose. It has the highest sweetness of common natural sugars.',
      extraEn: 'Metabolized primarily in the liver independent of insulin, existing in solution as an equilibrium of furanose and pyranose rings.'
    },
    {
      slug: 'galaktose',
      nameDe: 'Galaktose',
      nameEn: 'Galactose',
      category: 'monosaccharide',
      weight: 4,
      cloudPos: [80.8, 82, 3],
      linkage: '— (Monosaccharid)',
      buildingBlocksDe: 'Aldohexose (6 C-Atome, C4-Epimer der Glucose)',
      buildingBlocksEn: 'Aldohexose (6 Carbons, C4-epimer of Glucose)',
      buildingBlockSlugs: [],
      formula: 'C₆H₁₂O₆',
      structureKind: 'haworth',
      stereoPreset: { sugarClass: 'aldose', carbons: 6, dirs: ['R', 'L', 'L', 'R'] },
      descDe: 'Schleimzucker: Unterscheidet sich von der Glucose einzig durch die Stellung der OH-Gruppe am vierten Kohlenstoffatom (C4)!',
      extraDe: 'Wichtiger Baustein des Milchzuckers (Laktose), pflanzlicher Algengele (Agar) und der Blutgruppen-Antigene auf unseren roten Blutkörperchen (Blutgruppe B trägt endständige Galaktose!).',
      descEn: 'Differs from D-glucose solely in the spatial orientation of the hydroxyl group at carbon C4!',
      extraEn: 'Key component of milk sugar (lactose), seaweed agar, and human ABO blood group antigens (blood type B carries terminal D-galactose!).'
    },
    {
      slug: 'mannose',
      nameDe: 'Mannose',
      nameEn: 'Mannose',
      category: 'monosaccharide',
      weight: 2,
      cloudPos: [36.2, 41, 1],
      linkage: '— (Monosaccharid)',
      buildingBlocksDe: 'Aldohexose (6 C-Atome, C2-Epimer der Glucose)',
      buildingBlocksEn: 'Aldohexose (6 Carbons, C2-epimer of Glucose)',
      buildingBlockSlugs: [],
      formula: 'C₆H₁₂O₆',
      structureKind: 'haworth',
      stereoPreset: { sugarClass: 'aldose', carbons: 6, dirs: ['L', 'L', 'R', 'R'] },
      descDe: 'C2-Epimer der Glucose, benannt nach dem süßen Pflanzensaft „Manna“ der Manna-Esche. Wichtig für die Zuckerketten auf menschlichen Zellmembranen.',
      extraDe: 'Wird medizinisch häufig genutzt, da D-Mannose bestimmte Bakterien (E. coli) in den Harnwegen am Anheften hindert.',
      descEn: 'C2-epimer of D-glucose named after "manna" exudate of flowering ash trees; essential in human protein glycosylation.',
      extraEn: 'Widely used medically because D-mannose blocks fimbriae of uropathogenic E. coli from adhering to urinary tract walls.'
    },
    {
      slug: 'allose',
      nameDe: 'Allose',
      nameEn: 'Allose',
      category: 'monosaccharide',
      weight: 3,
      cloudPos: [62.3, 67.4, 2],
      linkage: '— (Monosaccharid)',
      buildingBlocksDe: 'Aldohexose (6 C-Atome)',
      buildingBlocksEn: 'Aldohexose (6 Carbons)',
      buildingBlockSlugs: [],
      formula: 'C₆H₁₂O₆',
      structureKind: 'fischer',
      stereoPreset: { sugarClass: 'aldose', carbons: 6, dirs: ['R', 'R', 'R', 'R'] },
      descDe: 'Die symmetrisch wirkende Aldohexose, bei der in der Fischer-Projektion alle vier chiralen OH-Gruppen auf derselben Seite (rechts bei D-Allose) stehen.',
      extraDe: 'Ein seltener Naturzucker aus Blättern des afrikanischen Zuckerbuschs (Protea rubropilosa).',
      descEn: 'The aldohexose whose four chiral hydroxyl groups all point to the same side (right in D-allose) in Fischer projection.',
      extraEn: 'A rare natural sugar isolated from leaves of the African shrub Protea rubropilosa.'
    },
    {
      slug: 'altrose',
      nameDe: 'Altrose',
      nameEn: 'Altrose',
      category: 'monosaccharide',
      weight: 2,
      cloudPos: [11.9, 56, 1],
      linkage: '— (Monosaccharid)',
      buildingBlocksDe: 'Aldohexose (6 C-Atome)',
      buildingBlocksEn: 'Aldohexose (6 Carbons)',
      buildingBlockSlugs: [],
      formula: 'C₆H₁₂O₆',
      structureKind: 'fischer',
      stereoPreset: { sugarClass: 'aldose', carbons: 6, dirs: ['L', 'R', 'R', 'R'] },
      descDe: 'Sehr seltene Aldohexose (C2-Epimer der Allose). Während D-Altrose meist synthetisch gewonnen wird, kommt L-Altrose natürlich in Pansenbakterien vor.',
      extraDe: 'Zeigt eindrucksvoll, wie schon das Umklappen einer einzigen C–OH-Gruppe aus einem Alltagsbaustein eine exotische Rarität macht.',
      descEn: 'Rare aldohexose (C2-epimer of allose); L-altrose occurs naturally in extracellular polysaccharides of rumen bacteria.',
      extraEn: 'Demonstrates how flipping a single C–OH stereocenter turns common sugars into rare biochemical specialties.'
    },
    {
      slug: 'gulose',
      nameDe: 'Gulose',
      nameEn: 'Gulose',
      category: 'monosaccharide',
      weight: 3,
      cloudPos: [43.7, 35.6, 2],
      linkage: '— (Monosaccharid)',
      buildingBlocksDe: 'Aldohexose (6 C-Atome)',
      buildingBlocksEn: 'Aldohexose (6 Carbons)',
      buildingBlockSlugs: [],
      formula: 'C₆H₁₂O₆',
      structureKind: 'fischer',
      stereoPreset: { sugarClass: 'aldose', carbons: 6, dirs: ['R', 'R', 'L', 'R'] },
      descDe: 'Süß schmeckender, sirupartiger Einfachzucker (C3-Epimer der Galaktose). Kommt in Zellmembranen hitzeliebender Archaeen vor.',
      extraDe: 'Ihre oxidierte Form (L-Guluronsäure) ist einer der zwei Hauptbausteine von Alginat aus Meeresalgen!',
      descEn: 'Sweet syrupy aldohexose (C3-epimer of galactose) found in archaeal cell envelopes.',
      extraEn: 'Its oxidized uronic derivative (L-guluronic acid) is one of the two building blocks of brown-algae alginate!'
    },
    {
      slug: 'idose',
      nameDe: 'Idose',
      nameEn: 'Idose',
      category: 'monosaccharide',
      weight: 3,
      cloudPos: [67.8, 55.8, 2],
      linkage: '— (Monosaccharid)',
      buildingBlocksDe: 'Aldohexose (6 C-Atome)',
      buildingBlocksEn: 'Aldohexose (6 Carbons)',
      buildingBlockSlugs: [],
      formula: 'C₆H₁₂O₆',
      structureKind: 'fischer',
      stereoPreset: { sugarClass: 'aldose', carbons: 6, dirs: ['L', 'R', 'L', 'R'] },
      descDe: 'Seltene Hexose, die kaum frei in der Natur vorkommt, aber als Grundgerüst der L-Iduronsäure in Blutgerinnungshemmern (Heparin) enorm wichtig ist.',
      extraDe: 'Chemischer Merktrick: Invertiert man an D-Glucose nur C5, erhält man L-Idose!',
      descEn: 'Rare free hexose whose uronic acid derivative (L-iduronic acid) is vital in the blood anticoagulant heparin.',
      extraEn: 'Stereochemistry gem: inverting solely C5 of D-glucose yields L-idose!'
    },
    {
      slug: 'talose',
      nameDe: 'Talose',
      nameEn: 'Talose',
      category: 'monosaccharide',
      weight: 2,
      cloudPos: [89, 8.7, 1],
      linkage: '— (Monosaccharid)',
      buildingBlocksDe: 'Aldohexose (6 C-Atome)',
      buildingBlocksEn: 'Aldohexose (6 Carbons)',
      buildingBlockSlugs: [],
      formula: 'C₆H₁₂O₆',
      structureKind: 'fischer',
      stereoPreset: { sugarClass: 'aldose', carbons: 6, dirs: ['L', 'L', 'L', 'R'] },
      descDe: 'Nicht natürlich verbreitete Alltagszucker-Rarität (C2-Epimer der Galaktose), isoliert aus bestimmten Antibiotika wie Hygromycin B.',
      extraDe: 'In D-Talose zeigen die oberen drei chiralen OH-Gruppen (C2, C3, C4) geschlossen nach links.',
      descEn: 'Rare aldohexose (C2-epimer of galactose) isolated from actinomycete antibiotics such as hygromycin B.',
      extraEn: 'In D-talose, the top three chiral OH groups (C2, C3, C4) all point left.'
    },
    {
      slug: 'psicose',
      nameDe: 'Psicose',
      nameEn: 'Psicose (Allulose)',
      category: 'monosaccharide',
      weight: 3,
      cloudPos: [89.9, 55, 2],
      linkage: '— (Monosaccharid)',
      buildingBlocksDe: 'Ketohexose (6 C-Atome, C3-Epimer der Fruktose)',
      buildingBlocksEn: 'Ketohexose (6 Carbons, C3-epimer of Fructose)',
      buildingBlockSlugs: [],
      formula: 'C₆H₁₂O₆',
      structureKind: 'fischer',
      stereoPreset: { sugarClass: 'ketose', carbons: 6, dirs: ['R', 'R', 'R'] },
      descDe: 'Heute oft als „Allulose“ bekannt: Kommt in Spuren in Feigen, Rosinen und Ahornsirup vor und karamellisiert beim Backen genau wie echter Zucker.',
      extraDe: 'Liefert fast null Kalorien (ca. 0,2 kcal/g statt 4 kcal/g), weil der menschliche Körper sie unverändert wieder ausscheidet!',
      descEn: 'Also marketed as Allulose: occurs in trace amounts in figs, raisins, and maple syrup and browns when baked just like table sugar.',
      extraEn: 'Provides almost zero calories (~0.2 kcal/g vs. 4 kcal/g) because humans absorb and excrete it without metabolizing it!'
    },
    {
      slug: 'sorbose',
      nameDe: 'Sorbose',
      nameEn: 'Sorbose',
      category: 'monosaccharide',
      weight: 3,
      cloudPos: [69, 19.2, 2],
      linkage: '— (Monosaccharid)',
      buildingBlocksDe: 'Ketohexose (6 C-Atome)',
      buildingBlocksEn: 'Ketohexose (6 Carbons)',
      buildingBlockSlugs: [],
      formula: 'C₆H₁₂O₆',
      structureKind: 'fischer',
      stereoPreset: { sugarClass: 'ketose', carbons: 6, dirs: ['L', 'R', 'L'] },
      descDe: 'Ketohexose mit ähnlicher Süßkraft wie Haushaltszucker. In der Natur (z. B. vergorenem Vogelbeerensaft) tritt vor allem die L-Sorbose auf.',
      extraDe: 'Industrieller Star: Seit den 1930er Jahren wird über L-Sorbose (Reichstein-Synthese) weltweit Vitamin C im Tonnenmaßstab hergestellt!',
      descEn: 'Ketohexose matching sucrose in sweetness; naturally occurs mainly as L-sorbose in fermented rowanberry juice.',
      extraEn: 'Industrial superstar: L-sorbose has been the key intermediate in global Vitamin C manufacturing (Reichstein process) since the 1930s!'
    },
    {
      slug: 'tagatose',
      nameDe: 'Tagatose',
      nameEn: 'Tagatose',
      category: 'monosaccharide',
      weight: 3,
      cloudPos: [51.1, 84.7, 2],
      linkage: '— (Monosaccharid)',
      buildingBlocksDe: 'Ketohexose (6 C-Atome, C4-Epimer der Fruktose)',
      buildingBlocksEn: 'Ketohexose (6 Carbons, C4-epimer of Fructose)',
      buildingBlockSlugs: [],
      formula: 'C₆H₁₂O₆',
      structureKind: 'fischer',
      stereoPreset: { sugarClass: 'ketose', carbons: 6, dirs: ['L', 'L', 'R'] },
      descDe: 'Seltener Milch- und Fruchtzucker (ca. 92 % Süßkraft von Saccharose), der in erhitzter Milch, Käse und Kakao in kleinen Mengen vorkommt.',
      extraDe: 'Schont die Zähne, liefert deutlich weniger Kalorien und wirkt im Darm präbiotisch.',
      descEn: 'Rare ketohexose (~92% sweetness of sucrose) naturally present in trace amounts in heated dairy products and cacao.',
      extraEn: 'Non-cariogenic, lower in calories, and beneficial as a prebiotic.'
    },
    {
      slug: 'arabino-3-hexulose',
      nameDe: 'Arabino-3-Hexulose',
      nameEn: 'Arabino-3-hexulose',
      category: 'monosaccharide',
      weight: 2,
      cloudPos: [65.2, 25, 1],
      linkage: '— (3-Ketohexose)',
      buildingBlocksDe: 'Spezial-Ketose (Ketogruppe an C3!)',
      buildingBlocksEn: '3-Ketohexose (Ketone at C3!)',
      buildingBlockSlugs: [],
      formula: 'C₆H₁₂O₆',
      structureKind: 'fischer',
      descDe: 'Außergewöhnliche Ketose: Hier sitzt die Ketogruppe nicht wie üblich an C2, sondern mitten in der Kette an C3!',
      extraDe: 'Als 6-Phosphat ein lebenswichtiges Zwischenprodukt, mit dem methylotrophe Bakterien Einkohlenstoff-Verbindungen (Formaldehyd) entgiften und verwerten.',
      descEn: 'Unusual ketohexose carrying its carbonyl group in the middle of the chain at C3 rather than C2!',
      extraEn: 'Its 6-phosphate ester is a central metabolic intermediate enabling methylotrophic bacteria to assimilate formaldehyde.'
    },
    {
      slug: 'sedoheptulose',
      nameDe: 'Sedoheptulose',
      nameEn: 'Sedoheptulose',
      category: 'monosaccharide',
      weight: 2,
      cloudPos: [49, 48.5, 1],
      linkage: '— (Ketoheptose, 7 C-Atome!)',
      buildingBlocksDe: 'Heptose (7 Kohlenstoffatome)',
      buildingBlocksEn: 'Ketoheptose (7 Carbons)',
      buildingBlockSlugs: [],
      formula: 'C₇H₁₄O₇',
      structureKind: 'fischer',
      descDe: 'Ein Zucker mit sieben Kohlenstoffatomen! Entdeckt in Fetthennen-Dickblattgewächsen (Sedum) sowie in Avocados, Karotten und Feigen.',
      extraDe: 'Als Sedoheptulose-7-phosphat unverzichtbar im Calvin-Zyklus der Fotosynthese und im menschlichen Pentosephosphatweg.',
      descEn: 'A seven-carbon sugar (heptose!) discovered in stonecrop succulents (Sedum) and also present in avocados and figs.',
      extraEn: 'Essential as sedoheptulose-7-phosphate in both photosynthesis and the cellular pentose phosphate pathway.'
    },
    {
      slug: 'ribose',
      nameDe: 'Ribose',
      nameEn: 'Ribose',
      category: 'monosaccharide',
      weight: 4,
      cloudPos: [20.9, 43.3, 3],
      linkage: '— (Monosaccharid)',
      buildingBlocksDe: 'Aldopentose (5 C-Atome)',
      buildingBlocksEn: 'Aldopentose (5 Carbons)',
      buildingBlockSlugs: [],
      formula: 'C₅H₁₀O₅',
      structureKind: 'haworth',
      stereoPreset: { sugarClass: 'aldose', carbons: 5, dirs: ['R', 'R', 'R'] },
      descDe: 'Der Fünffach-Kohlenstoffzucker des Lebens: D-Ribose bildet das Rückgrat der RNA (Ribonukleinsäure) und steckt in ATP, NADH und Coenzym A!',
      extraDe: 'Ohne diesen unscheinbaren Fünfring gäbe es weder genetische Proteinbiosynthese noch zellulären Energietransport.',
      descEn: 'A foundational 5-carbon sugar of life: D-ribose forms the backbone of RNA and is part of ATP, NADH, and Coenzyme A!',
      extraEn: 'Without this pentose ring, neither genetic translation nor cellular energy transfer could exist.'
    },
    {
      slug: 'arabinose-d',
      nameDe: 'Arabinose-[D]',
      nameEn: 'D-Arabinose',
      category: 'monosaccharide',
      weight: 3,
      cloudPos: [21, 37.1, 2],
      linkage: '— (Monosaccharid)',
      buildingBlocksDe: 'Aldopentose (5 C-Atome, D-Form)',
      buildingBlocksEn: 'Aldopentose (5 Carbons, D-form)',
      buildingBlockSlugs: [],
      formula: 'C₅H₁₀O₅',
      structureKind: 'fischer',
      stereoPreset: { sugarClass: 'aldose', carbons: 5, dirs: ['L', 'R', 'R'] },
      descDe: 'Die D-Form der Arabinose: Während fast alle biologischen Zucker in der D-Form vorliegen, ist D-Arabinose in der Natur deutlich seltener als ihr Spiegelbild!',
      extraDe: 'Sie findet sich u. a. in den Zellhüllen von Mykobakterien (Erregern der Tuberkulose) und dient Hefen zur Synthese von Erythroascorbinsäure.',
      descEn: 'Whereas almost all biological sugars are D-isomers, D-arabinose is much rarer in nature than its L-mirror image!',
      extraEn: 'Occurs in mycobacterial cell envelopes (arabinogalactan) and fungal erythroascorbic acid.'
    },
    {
      slug: 'arabinose-l',
      nameDe: 'Arabinose-[L]',
      nameEn: 'L-Arabinose',
      category: 'monosaccharide',
      weight: 4,
      cloudPos: [89.3, 73.7, 3],
      linkage: '— (Monosaccharid)',
      buildingBlocksDe: 'Aldopentose (5 C-Atome, L-Form)',
      buildingBlocksEn: 'Aldopentose (5 Carbons, L-form)',
      buildingBlockSlugs: [],
      formula: 'C₅H₁₀O₅',
      structureKind: 'haworth',
      stereoPreset: { sugarClass: 'aldose', carbons: 5, dirs: ['R', 'L', 'L'] },
      descDe: 'Berühmte Ausnahme der Biochemie: L-Arabinose kommt in der Pflanzenwelt massenhaft vor – benannt nach Gummi Arabicum, außerdem in Pektin und Hemizellulose.',
      extraDe: 'Hemmt im Darm gezielt das Enzym Saccharase und bremst so den Blutzuckeranstieg nach Haushaltszucker.',
      descEn: 'Biochemistry’s famous exception: L-arabinose is abundant throughout the plant kingdom in gum arabic, pectin, and hemicellulose.',
      extraEn: 'Selectively inhibits intestinal sucrase, dampening blood-glucose spikes when consumed with sucrose.'
    },
    {
      slug: 'xylose',
      nameDe: 'Xylose',
      nameEn: 'Xylose',
      category: 'monosaccharide',
      weight: 4,
      cloudPos: [58.8, 39.8, 3],
      linkage: '— (Monosaccharid)',
      buildingBlocksDe: 'Aldopentose (5 C-Atome)',
      buildingBlocksEn: 'Aldopentose (5 Carbons)',
      buildingBlockSlugs: [],
      formula: 'C₅H₁₀O₅',
      structureKind: 'haworth',
      stereoPreset: { sugarClass: 'aldose', carbons: 5, dirs: ['R', 'L', 'R'] },
      descDe: 'Holzzucker (von griechisch xylon = Holz): Wird aus Birkenholz, Maiskolbenresten und Stroh gewonnen und zählt zu den häufigsten Zuckern der Biosphäre.',
      extraDe: 'Im menschlichen Körper dient D-Xylose außerdem als erstes Brückenglied, um Glykosaminoglykane an Knorpelproteine zu knüpfen!',
      descEn: 'Wood sugar (from Greek xylon = wood): extracted from birch wood, corncobs, and straw, ranking among Earth’s most abundant monosaccharides.',
      extraEn: 'In humans, D-xylose initiates the linker connecting glycosaminoglycan chains onto cartilage core proteins!'
    },
    {
      slug: 'lyxose',
      nameDe: 'Lyxose',
      nameEn: 'Lyxose',
      category: 'monosaccharide',
      weight: 2,
      cloudPos: [75.1, 25.1, 1],
      linkage: '— (Monosaccharid)',
      buildingBlocksDe: 'Aldopentose (5 C-Atome)',
      buildingBlocksEn: 'Aldopentose (5 Carbons)',
      buildingBlockSlugs: [],
      formula: 'C₅H₁₀O₅',
      structureKind: 'fischer',
      stereoPreset: { sugarClass: 'aldose', carbons: 5, dirs: ['L', 'L', 'R'] },
      descDe: 'Seltene Aldopentose (C2-Epimer der Xylose; der Name „Lyxose“ entstand als Buchstaben-Anagramm aus „Xylose“!).',
      extraDe: 'Kommt nur vereinzelt als Bestandteil bakterieller Glykolipide vor.',
      descEn: 'Rare aldopentose (C2-epimer of xylose — its name "lyxose" was coined by transposing the letters of "xylose"!).',
      extraEn: 'Found sparingly in bacterial glycolipids.'
    },
    {
      slug: 'ribulose',
      nameDe: 'Ribulose',
      nameEn: 'Ribulose',
      category: 'monosaccharide',
      weight: 4,
      cloudPos: [30.8, 86, 2],
      linkage: '— (Monosaccharid)',
      buildingBlocksDe: 'Ketopentose (5 C-Atome)',
      buildingBlocksEn: 'Ketopentose (5 Carbons)',
      buildingBlockSlugs: [],
      formula: 'C₅H₁₀O₅',
      structureKind: 'fischer',
      stereoPreset: { sugarClass: 'ketose', carbons: 5, dirs: ['R', 'R'] },
      descDe: 'Ketopentose mit Schlüsselrolle für alles Leben auf der Erde: Als Ribulose-1,5-bisphosphat fängt sie in grünen Blättern das CO₂ aus der Luft ein!',
      extraDe: 'Aus dieser Reaktion entstehen letztlich alle anderen pflanzlichen Kohlenhydrate.',
      descEn: 'Ketopentose playing a pivotal role on Earth: as ribulose-1,5-bisphosphate, it captures atmospheric CO₂ in green leaves!',
      extraEn: 'Every plant carbohydrate ultimately originates from this carbon-fixation reaction.'
    },
    {
      slug: 'xylulose',
      nameDe: 'Xylulose',
      nameEn: 'Xylulose',
      category: 'monosaccharide',
      weight: 2,
      cloudPos: [82.9, 36.5, 1],
      linkage: '— (Monosaccharid)',
      buildingBlocksDe: 'Ketopentose (5 C-Atome)',
      buildingBlocksEn: 'Ketopentose (5 Carbons)',
      buildingBlockSlugs: [],
      formula: 'C₅H₁₀O₅',
      structureKind: 'fischer',
      stereoPreset: { sugarClass: 'ketose', carbons: 5, dirs: ['L', 'R'] },
      descDe: 'Ketopentose (C3-Epimer der Ribulose), die als Phosphatester in jeder Zelle den Umbau von Fünfer- und Sechserzuckern vermittelt.',
      extraDe: 'Reguliert in der Leber außerdem Gene für den Fett- und Kohlenhydratstoffwechsel.',
      descEn: 'Ketopentose (C3-epimer of ribulose) whose 5-phosphate interconverts pentoses and hexoses in every living cell.',
      extraEn: 'Also acts in liver cells as a signaling regulator of carbohydrate and lipid metabolism.'
    },
    {
      slug: 'erythrose',
      nameDe: 'Erythrose',
      nameEn: 'Erythrose',
      category: 'monosaccharide',
      weight: 3,
      cloudPos: [37.4, 66.8, 2],
      linkage: '— (Monosaccharid)',
      buildingBlocksDe: 'Aldotetrose (4 C-Atome)',
      buildingBlocksEn: 'Aldotetrose (4 Carbons)',
      buildingBlockSlugs: [],
      formula: 'C₄H₈O₄',
      structureKind: 'fischer',
      stereoPreset: { sugarClass: 'aldose', carbons: 4, dirs: ['R', 'R'] },
      descDe: 'Vier-Kohlenstoff-Aldose (benannt nach der Rotfärbung mit Säuren aus Rhabarber/Flechten). Beide OH-Gruppen zeigen in dieselbe Richtung.',
      extraDe: 'Aus Erythrose-4-phosphat bauen Pflanzen und Mikroorganismen aromatische Aminosäuren wie Phenylalanin und Tryptophan!',
      descEn: 'Four-carbon aldose with both chiral OH groups on the same side in Fischer projection.',
      extraEn: 'Plants and microbes use erythrose-4-phosphate to synthesize essential aromatic amino acids like phenylalanine and tryptophan!'
    },
    {
      slug: 'threose',
      nameDe: 'Threose',
      nameEn: 'Threose',
      category: 'monosaccharide',
      weight: 3,
      cloudPos: [53.7, 60.8, 2],
      linkage: '— (Monosaccharid)',
      buildingBlocksDe: 'Aldotetrose (4 C-Atome)',
      buildingBlocksEn: 'Aldotetrose (4 Carbons)',
      buildingBlockSlugs: [],
      formula: 'C₄H₈O₄',
      structureKind: 'fischer',
      stereoPreset: { sugarClass: 'aldose', carbons: 4, dirs: ['L', 'R'] },
      descDe: 'Vier-Kohlenstoff-Aldose, bei der die zwei OH-Gruppen entgegengesetzt stehen. Entsteht u. a. beim Abbau von Vitamin C.',
      extraDe: 'In der Ursuppen-Forschung gilt TNA (Threose-Nukleinsäure) als möglicher evolutionärer Vorläufer von RNA und DNA!',
      descEn: 'Four-carbon aldose with opposite chiral OH orientations, also formed during oxidative breakdown of Vitamin C.',
      extraEn: 'Origins-of-life researchers study TNA (threose nucleic acid) as a plausible prebiotic ancestor of RNA and DNA!'
    },
    {
      slug: 'erythrulose',
      nameDe: 'Erythrulose',
      nameEn: 'Erythrulose',
      category: 'monosaccharide',
      weight: 3,
      cloudPos: [70.9, 67.5, 2],
      linkage: '— (Monosaccharid)',
      buildingBlocksDe: 'Ketotetrose (4 C-Atome)',
      buildingBlocksEn: 'Ketotetrose (4 Carbons)',
      buildingBlockSlugs: [],
      formula: 'C₄H₈O₄',
      structureKind: 'fischer',
      stereoPreset: { sugarClass: 'ketose', carbons: 4, dirs: ['R'] },
      descDe: 'Natürliche Vier-Kohlenstoff-Ketose aus roten Beeren mit nur einem einzigen chiralen Kohlenstoffatom (C3).',
      extraDe: 'Spannende Alltagsanwendung: Reagiert mit der obersten Hautschicht (Maillard-Reaktion) zu braunen Farbstoffen – ganz ohne UV-Strahlung in Selbstbräunern!',
      descEn: 'Natural four-carbon ketose from red berries possessing only a single chiral center (C3).',
      extraEn: 'Everyday chemistry: reacts with amino groups of outer skin keratin (Maillard reaction) in UV-free sunless tanning lotions!'
    },
    {
      slug: 'dihydroxyaceton',
      nameDe: 'Dihydroxyaceton',
      nameEn: 'Dihydroxyacetone (DHA)',
      category: 'monosaccharide',
      weight: 4,
      cloudPos: [50.3, 66.9, 3],
      linkage: '— (Ketotriose, achiral)',
      buildingBlocksDe: 'Ketotriose (3 C-Atome, kein Chiralitätszentrum!)',
      buildingBlocksEn: 'Ketotriose (3 Carbons, achiral)',
      buildingBlockSlugs: [],
      formula: 'C₃H₆O₃',
      structureKind: 'triose_dha',
      descDe: 'Die kleinste aller Ketosen mit nur drei Kohlenstoffatomen – der einzige Einfachzucker, der völlig symmetrisch (achiral) ist und keine D/L-Formen bildet!',
      extraDe: 'Als Phosphat Teil der Glykolyse in jeder Zelle; frei aufgetragen der Hauptwirkstoff moderner Selbstbräunungscremes.',
      descEn: 'The smallest ketose with just three carbons — the only monosaccharide that is completely achiral (no D/L mirror isomers)!',
      extraEn: 'Central glycolysis intermediate as DHAP, and the primary active ingredient in sunless tanning creams.'
    },
    {
      slug: 'glycerinaldehyd',
      nameDe: 'Glycerinaldehyd',
      nameEn: 'Glyceraldehyde',
      category: 'monosaccharide',
      weight: 3,
      cloudPos: [92.1, 79.9, 2],
      linkage: '— (Aldotriose)',
      buildingBlocksDe: 'Aldotriose (3 C-Atome, Ur-Referenz für D/L!)',
      buildingBlocksEn: 'Aldotriose (3 Carbons, D/L reference standard!)',
      buildingBlockSlugs: [],
      formula: 'C₃H₆O₃',
      structureKind: 'triose_gly',
      descDe: 'Die kleinste Aldose (3 Kohlenstoffatome) und der historische Referenzmaßstab Emil Fischers für das gesamte D/L-System der Zucker und Aminosäuren!',
      extraDe: 'Alle D-Zucker leiten ihre Konfiguration am untersten chiralen C-Atom vom rechtsstehenden OH des D-Glycerinaldehyds ab.',
      descEn: 'The smallest aldose (3 carbons) and Emil Fischer’s historical reference standard defining the entire D/L stereochemical system!',
      extraEn: 'Every D-sugar matches the right-pointing OH configuration of D-glyceraldehyde at its highest-numbered chiral carbon.'
    },

    // ==================== ZUCKERALKOHOL ====================
    {
      slug: 'xylit',
      nameDe: 'Xylit',
      nameEn: 'Xylitol',
      category: 'sugar_alcohol',
      weight: 5,
      cloudPos: [58.9, 86.9, 3],
      linkage: '— (Zuckeralkohol)',
      buildingBlocksDe: 'Reduzierte Xylose (C5-Polyol)',
      buildingBlocksEn: 'Reduced Xylose (C5 Polyol)',
      buildingBlockSlugs: ['xylose'],
      formula: 'C₅H₁₂O₅',
      structureKind: 'polyol',
      descDe: '„Birkenzucker“: Besitzt fast exakt dieselbe Süßkraft wie Haushaltszucker, hat aber 40 % weniger Kalorien und schützt aktiv vor Karies!',
      extraDe: 'Kariesbakterien nehmen Xylit auf, können ihn aber nicht verwerten; außerdem kühlt Xylit beim Auflösen auf der Zunge spürbar (endotherme Lösungswärme).',
      descEn: '"Birch sugar": matches table sugar in sweetness with 40% fewer calories while actively helping prevent tooth decay!',
      extraEn: 'Oral Streptococcus mutans cannot ferment xylitol; dissolving xylitol crystals also creates a pleasant cooling sensation on the tongue.'
    },
    {
      slug: 'sorbit',
      nameDe: 'Sorbit',
      nameEn: 'Sorbitol',
      category: 'sugar_alcohol',
      weight: 2,
      cloudPos: [55.2, 28, 1],
      linkage: '— (Zuckeralkohol)',
      buildingBlocksDe: 'Reduzierte D-Glucose (C6-Polyol)',
      buildingBlocksEn: 'Reduced D-Glucose (C6 Polyol)',
      buildingBlockSlugs: ['glucose'],
      formula: 'C₆H₁₄O₆',
      structureKind: 'polyol',
      descDe: 'Zuckeralkohol der Glucose, natürlich reichlich in Vogelbeeren (Sorbus aucuparia), Pflaumen, Birnen und Pfirsichen enthalten.',
      extraDe: 'Zieht Wasser an (hygroskopisch) und hält dadurch Zahnpasta, Backwaren und Kaugummis dauerhaft feucht und geschmeidig (E 420).',
      descEn: 'Sugar alcohol of D-glucose naturally abundant in rowanberries (Sorbus), plums, pears, and peaches.',
      extraEn: 'Strongly humectant (water-retaining), keeping toothpaste, baked goods, and chewing gum soft and moist (E 420).'
    },
    {
      slug: 'mannit',
      nameDe: 'Mannit',
      nameEn: 'Mannitol',
      category: 'sugar_alcohol',
      weight: 3,
      cloudPos: [36.9, 60, 2],
      linkage: '— (Zuckeralkohol)',
      buildingBlocksDe: 'Reduzierte D-Mannose (C6-Polyol)',
      buildingBlocksEn: 'Reduced D-Mannose (C6 Polyol)',
      buildingBlockSlugs: ['mannose'],
      formula: 'C₆H₁₄O₆',
      structureKind: 'polyol',
      descDe: 'Zuckeralkohol aus Manna-Eschensaft, Pilzen und Braunalgen. Im Gegensatz zu Sorbit zieht Mannit kaum Luftfeuchtigkeit an!',
      extraDe: 'Deshalb ideal als Trennpuder auf Kaugummistreifen, als Tablettengrundstoff und medizinisch als Infusionslösung gegen Hirndruck.',
      descEn: 'Sugar alcohol found in flowering ash sap, mushrooms, and kelp. Unlike sorbitol, mannitol is non-hygroscopic!',
      extraEn: 'Ideal dusting powder for chewing gum sticks, tablet excipient, and clinical osmotherapy infusion.'
    },
    {
      slug: 'erythrit',
      nameDe: 'Erythrit',
      nameEn: 'Erythritol',
      category: 'sugar_alcohol',
      weight: 2,
      cloudPos: [68.6, 50.5, 1],
      linkage: '— (Zuckeralkohol)',
      buildingBlocksDe: 'Reduzierte Erythrose (meso-C4-Polyol)',
      buildingBlocksEn: 'Reduced Erythrose (meso-C4 Polyol)',
      buildingBlockSlugs: ['erythrose'],
      formula: 'C₄H₁₀O₄',
      structureKind: 'polyol',
      descDe: 'Vier-Kohlenstoff-Zuckeralkohol aus reifem Obst, Käse und Fermentationsprodukten mit ca. 70 % Süßkraft von Zucker und praktisch null Kalorien!',
      extraDe: 'Chemische Besonderheit: Erythrit besitzt zwei chirale Zentren, ist aber durch eine innere Spiegelebene eine achirale meso-Verbindung!',
      descEn: 'Four-carbon polyol present in ripe fruits and fermented foods, offering ~70% of sucrose’s sweetness with virtually zero calories!',
      extraEn: 'Stereochemical classic: despite having two chiral carbons, an internal mirror plane makes erythritol an achiral meso compound!'
    },

    // ==================== ZUCKERSÄUREN ====================
    {
      slug: 'gluconsaeure',
      nameDe: 'Gluconsäure',
      nameEn: 'Gluconic Acid',
      category: 'sugar_acid',
      weight: 3,
      cloudPos: [83, 14.3, 2],
      linkage: '— (Aldonsäure)',
      buildingBlocksDe: 'An C1 oxidierte D-Glucose',
      buildingBlocksEn: 'C1-oxidized D-Glucose',
      buildingBlockSlugs: ['glucose'],
      formula: 'C₆H₁₂O₇',
      structureKind: 'uronic',
      descDe: 'Milde Fruchtsäure, die entsteht, wenn die Aldehydgruppe (C1) der Glucose zu einer Carbonsäuregruppe (–COOH) oxidiert wird – natürlich in Honig und Kombucha!',
      extraDe: 'Gibt Bionade ihren erfrischenden Geschmack und bindet als Gluconat hervorragend Mineralstoffe wie Calcium, Eisen und Zink.',
      descEn: 'Mild organic acid formed when C1 of D-glucose is oxidized to a carboxylic acid (–COOH), naturally occurring in honey and kombucha!',
      extraEn: 'Provides refreshing acidity in fermented beverages and chelates minerals in calcium, iron, and zinc gluconate supplements.'
    },
    {
      slug: 'glucarsaeure',
      nameDe: 'Glucarsäure',
      nameEn: 'Glucaric Acid',
      category: 'sugar_acid',
      weight: 2,
      cloudPos: [78, 19.9, 1],
      linkage: '— (Aldarsäure / Zuckerdicarbonsäure)',
      buildingBlocksDe: 'An C1 und C6 oxidierte D-Glucose',
      buildingBlocksEn: 'C1 & C6 oxidized D-Glucose',
      buildingBlockSlugs: ['glucose'],
      formula: 'C₆H₁₀O₈',
      structureKind: 'uronic',
      descDe: 'Zuckerdicarbonsäure (historisch „Zuckersäure“), bei der beide Enden der Glucose (C1 und C6) zu Carbonsäuregruppen oxidiert sind.',
      extraDe: 'Gilt in der „Grünen Chemie“ als Top-Plattformchemikalie für biologisch abbaubare Waschmittel-Komplexbildner und Bio-Nylon!',
      descEn: 'Dicarboxylic sugar acid ("saccharic acid") formed by oxidizing both terminal carbons (C1 and C6) of D-glucose.',
      extraEn: 'Hailed in green chemistry as a top biobased platform chemical for phosphate-free detergent builders and bio-nylons!'
    },
    {
      slug: 'glucuronsaeure',
      nameDe: 'Glucuronsäure',
      nameEn: 'Glucuronic Acid',
      category: 'sugar_acid',
      weight: 4,
      cloudPos: [90.9, 48.8, 3],
      linkage: '— (Uronsäure)',
      buildingBlocksDe: 'An C6 oxidierte D-Glucose',
      buildingBlocksEn: 'C6-oxidized D-Glucose',
      buildingBlockSlugs: ['glucose'],
      formula: 'C₆H₁₀O₇',
      structureKind: 'uronic',
      descDe: 'Lebenswichtige Uronsäure (Carbonsäuregruppe an C6): Unsere Leber hängt Glucuronsäure an Medikamente, Hormone und Giftstoffe, um sie wasserlöslich ausscheidbar zu machen!',
      extraDe: 'Außerdem ein Hauptbaustein von Hyaluronsäure, Chondroitinsulfat und Gummi Arabicum.',
      descEn: 'Vital uronic acid (carboxyl at C6): the human liver conjugates glucuronic acid onto drugs, toxins, and bilirubin to make them water-soluble for excretion!',
      extraEn: 'Also a repeating building block of hyaluronic acid, chondroitin sulfate, and gum arabic.'
    },
    {
      slug: 'galacturonsaeure',
      nameDe: 'Galacturonsäure',
      nameEn: 'Galacturonic Acid',
      category: 'sugar_acid',
      weight: 4,
      cloudPos: [43, 73.2, 3],
      linkage: '— (Uronsäure)',
      buildingBlocksDe: 'An C6 oxidierte D-Galaktose',
      buildingBlocksEn: 'C6-oxidized D-Galactose',
      buildingBlockSlugs: ['galaktose'],
      formula: 'C₆H₁₀O₇',
      structureKind: 'uronic',
      descDe: 'Die an C6 oxidierte Schwester der Galaktose und Hauptbaustein aller pflanzlichen Pektine!',
      extraDe: 'Ihre Säuregruppen vernetzen über Calciumbrücken und Wasserstoffbrücken Fruchtsäfte zu fruchtiger Marmelade.',
      descEn: 'C6-oxidized derivative of D-galactose serving as the main backbone monomer of plant pectins!',
      extraEn: 'Its carboxyl groups cross-link via calcium bridges and hydrogen bonds to set fruit jams.'
    },
    {
      slug: 'iduronsaeure',
      nameDe: 'Iduronsäure',
      nameEn: 'Iduronic Acid',
      category: 'sugar_acid',
      weight: 4,
      cloudPos: [14, 30.8, 3],
      linkage: '— (Uronsäure)',
      buildingBlocksDe: 'An C6 oxidierte L-Idose',
      buildingBlocksEn: 'C6-oxidized L-Idose',
      buildingBlockSlugs: ['idose'],
      formula: 'C₆H₁₀O₇',
      structureKind: 'uronic',
      descDe: 'L-Iduronsäure verleiht Glykosaminoglykanen wie Heparin und Dermatansulfat eine außergewöhnliche konformationelle Beweglichkeit.',
      extraDe: 'Genau diese Flexibilität ermöglicht es Heparin, im Blut Gerinnungsfaktoren (Antithrombin III) präzise zu binden.',
      descEn: 'L-Iduronic acid endows glycosaminoglycans like heparin and dermatan sulfate with unusual conformational ring flexibility.',
      extraEn: 'This conformational adaptability enables heparin to bind antithrombin III and prevent blood clots.'
    },
    {
      slug: 'mannuronsaeure',
      nameDe: 'Mannuronsäure',
      nameEn: 'Mannuronic Acid',
      category: 'sugar_acid',
      weight: 2,
      cloudPos: [91.4, 60.7, 1],
      linkage: '— (Uronsäure)',
      buildingBlocksDe: 'An C6 oxidierte D-Mannose',
      buildingBlocksEn: 'C6-oxidized D-Mannose',
      buildingBlockSlugs: ['mannose'],
      formula: 'C₆H₁₀O₇',
      structureKind: 'uronic',
      descDe: 'β-D-Mannuronsäure bildet zusammen mit α-L-Guluronsäure das Alginat der Meeres-Braunalgen.',
      extraDe: 'Je höher der Anteil an Mannuronsäure im Alginat, desto weicher und elastischer sind die Algenwedel in starker Brandung.',
      descEn: 'β-D-Mannuronic acid teams up with α-L-guluronic acid to build brown-seaweed alginate.',
      extraEn: 'Mannuronic-rich segments make kelp blades flexible and elastic in turbulent surf.'
    },
    {
      slug: 'guluronsaeure',
      nameDe: 'Guluronsäure',
      nameEn: 'Guluronic Acid',
      category: 'sugar_acid',
      weight: 3,
      cloudPos: [27.5, 67.3, 2],
      linkage: '— (Uronsäure)',
      buildingBlocksDe: 'An C6 oxidierte L-Gulose',
      buildingBlocksEn: 'C6-oxidized L-Gulose',
      buildingBlockSlugs: ['gulose'],
      formula: 'C₆H₁₀O₇',
      structureKind: 'uronic',
      descDe: 'α-L-Guluronsäure entsteht durch enzymatische Umklappung aus Mannuronsäure direkt in der Algen-Zellwand.',
      extraDe: 'Zickzack-Ketten aus Guluronsäure schließen Calcium-Ionen wie Eier in einem Eierkarton ein und bilden feste Alginat-Gele!',
      descEn: 'α-L-Guluronic acid is epimerized directly from mannuronic acid inside seaweed cell walls.',
      extraEn: 'Buckled guluronate blocks trap calcium ions in an "egg-box" geometry to create firm alginate gels!'
    },

    // ==================== AMINOZUCKER, DESOXYZUCKER & SPEZIALZUCKER ====================
    {
      slug: 'glucosamin',
      nameDe: 'Glucosamin',
      nameEn: 'Glucosamine',
      category: 'amino_deoxy',
      weight: 3,
      cloudPos: [69.5, 61.5, 2],
      linkage: '— (Aminozucker)',
      buildingBlocksDe: 'D-Glucose mit Aminogruppe (–NH₂) an C2',
      buildingBlocksEn: 'D-Glucose with amino group (–NH₂) at C2',
      buildingBlockSlugs: ['glucose'],
      formula: 'C₆H₁₃NO₅',
      structureKind: 'amino_chair',
      descDe: 'Aminozucker, bei dem die OH-Gruppe am zweiten Kohlenstoffatom der Glucose durch eine stickstoffhaltige Aminogruppe (–NH₂) ersetzt ist.',
      extraDe: 'Zentraler Vorläufer für Knorpel-Glykosaminoglykane, Gelenkflüssigkeit (Synovia) sowie Chitin.',
      descEn: 'Amino sugar in which the C2 hydroxyl of D-glucose is replaced by a nitrogen-containing amino group (–NH₂).',
      extraEn: 'Key biosynthetic precursor for joint cartilage glycosaminoglycans, synovial fluid, and chitin.'
    },
    {
      slug: 'n-acetylglucosamin',
      nameDe: 'N-Acetylglucosamin',
      nameEn: 'N-Acetylglucosamine (GlcNAc)',
      category: 'amino_deoxy',
      weight: 3,
      cloudPos: [70.9, 40.4, 2],
      linkage: '— (Acetylierter Aminozucker)',
      buildingBlocksDe: 'Glucosamin + Essigsäurerest (Acetylgruppe)',
      buildingBlocksEn: 'Glucosamine + Acetyl group',
      buildingBlockSlugs: ['glucosamin'],
      formula: 'C₈H₁₅NO₆',
      structureKind: 'amino_chair',
      descDe: 'Einer der erfolgreichsten Bausteine der Evolution: Mit einem Essigsäurerest verknüpftes Glucosamin!',
      extraDe: 'Baut als β-1→4-Kette das Chitin der Insekten und Pilze, mit Muraminsäure das Bakterien-Murein und mit Glucuronsäure unsere Hyaluronsäure!',
      descEn: 'One of evolution’s most versatile building blocks: glucosamine carrying an N-linked acetyl group!',
      extraEn: 'Polymerizes into arthropod/fungal chitin, bacterial peptidoglycan (murein), and human hyaluronic acid!'
    },
    {
      slug: 'mannosamin',
      nameDe: 'Mannosamin',
      nameEn: 'Mannosamine',
      category: 'amino_deoxy',
      weight: 2,
      cloudPos: [69, 30, 1],
      linkage: '— (Aminozucker)',
      buildingBlocksDe: 'D-Mannose mit Aminogruppe (–NH₂) an C2',
      buildingBlocksEn: 'D-Mannose with amino group (–NH₂) at C2',
      buildingBlockSlugs: ['mannose'],
      formula: 'C₆H₁₃NO₅',
      structureKind: 'amino_chair',
      descDe: 'Das C2-Epimer des Glucosamins. Als N-Acetylmannosamin die unmittelbare biochemische Vorstufe aller Sialinsäuren (Neuraminsäuren) in unseren Zellen!',
      extraDe: 'Damit entscheidend für die „Zucker-Antennen“ auf Nerven- und Immunzellen.',
      descEn: 'C2-epimer of glucosamine; as N-acetylmannosamine, it is the direct metabolic precursor to sialic acids in human cells!',
      extraEn: 'Essential for building the sugar antennas on nerve and immune cell surfaces.'
    },
    {
      slug: 'n-acetylmuraminsaeure',
      nameDe: 'N-Acetylmuraminsäure',
      nameEn: 'N-Acetylmuramic Acid (MurNAc)',
      category: 'amino_deoxy',
      weight: 2,
      cloudPos: [48.4, 79.1, 1],
      linkage: '— (Aminozucker-Milchsäureether)',
      buildingBlocksDe: 'N-Acetylglucosamin + Milchsäurerest an C3',
      buildingBlocksEn: 'N-Acetylglucosamine + Lactic acid ether at C3',
      buildingBlockSlugs: ['n-acetylglucosamin'],
      formula: 'C₁₁H₁₉NO₈',
      structureKind: 'amino_chair',
      descDe: 'Spezialbaustein ausschließlich in Bakterien (von lateinisch murus = Mauer): Trägt an C3 einen Milchsäure-Anker für Peptidketten.',
      extraDe: 'Das Enzym Lysozym in unseren Tränen und unserem Speichel spaltet gezielt die Bindung hinter N-Acetylmuraminsäure zur Immunabwehr!',
      descEn: 'Signature bacterial wall sugar (from Latin murus = wall) bearing a C3 lactic acid handle where peptide cross-bridges attach.',
      extraEn: 'Lysozyme in human tears and saliva cleaves the bond right next to MurNAc as an innate antibacterial defense!'
    },
    {
      slug: 'n-acetylneuraminsaeure',
      nameDe: 'N-Acetylneuraminsäure',
      nameEn: 'N-Acetylneuraminic Acid (Neu5Ac)',
      category: 'amino_deoxy',
      weight: 3,
      cloudPos: [19.1, 73.4, 2],
      linkage: '— (Sialinsäure, 9 C-Atome!)',
      buildingBlocksDe: 'Mannosamin-Derivat + Brenztraubensäure (C9)',
      buildingBlocksEn: 'Mannosamine derivative + Pyruvate (C9)',
      buildingBlockSlugs: ['mannosamin'],
      formula: 'C₁₁H₁₉NO₉',
      structureKind: 'sialic',
      descDe: 'Die wichtigste Sialinsäure des Menschen mit neun Kohlenstoffatomen! Sitzt ganz außen auf den Zuckerketten unserer Zellmembranen wie ein molekularer Personalausweis.',
      extraDe: 'Grippeviren (Influenza) docken genau an diesen Zucker an – das „N“ in H1N1 steht für das Virus-Enzym Neuraminidase!',
      descEn: 'The predominant 9-carbon sialic acid in humans, sitting at the outermost tips of cell-surface glycans like a molecular ID badge.',
      extraEn: 'Influenza viruses dock onto Neu5Ac — the "N" in H1N1 stands for viral neuraminidase!'
    },
    {
      slug: 'n-glycolylneuraminsaeure',
      nameDe: 'N-Glycolylneuraminsäure',
      nameEn: 'N-Glycolylneuraminic Acid (Neu5Gc)',
      category: 'amino_deoxy',
      weight: 2,
      cloudPos: [43, 53.9, 1],
      linkage: '— (Sialinsäure, 9 C-Atome)',
      buildingBlocksDe: 'Neuraminsäure mit einem zusätzlichen Sauerstoffatom',
      buildingBlocksEn: 'Neuraminic acid with one extra oxygen atom',
      buildingBlockSlugs: ['n-acetylneuraminsaeure'],
      formula: 'C₁₁H₁₉NO₁₀',
      structureKind: 'sialic',
      descDe: 'Fast identisch mit N-Acetylneuraminsäure – nur ein einziges Sauerstoffatom mehr! Kommt bei fast allen Säugetieren (Rind, Schwein, Schimpansen) vor, aber NICHT beim Menschen.',
      extraDe: 'Vor ca. 2–3 Millionen Jahren ging das verantwortliche Gen (CMAH) in der menschlichen Evolution verloren!',
      descEn: 'Differs from Neu5Ac by just a single oxygen atom! Present in almost all mammals (cattle, pigs, apes) EXCEPT humans.',
      extraEn: 'Humans lost the CMAH gene synthesizing Neu5Gc ~2–3 million years ago during hominid evolution!'
    },
    {
      slug: 'desoxyribose',
      nameDe: 'Desoxyribose',
      nameEn: 'Deoxyribose',
      category: 'amino_deoxy',
      weight: 2,
      cloudPos: [59.8, 45, 1],
      linkage: '— (2-Desoxyzucker)',
      buildingBlocksDe: 'D-Ribose ohne Sauerstoff an C2',
      buildingBlocksEn: 'D-Ribose lacking oxygen at C2',
      buildingBlockSlugs: ['ribose'],
      formula: 'C₅H₁₀O₄',
      structureKind: 'haworth',
      descDe: 'Das „D“ in DNA (Desoxyribonukleinsäure)! Gegenüber der Ribose fehlt am zweiten Kohlenstoffatom (C2) ein einziges Sauerstoffatom.',
      extraDe: 'Genau dieses fehlende Sauerstoffatom verhindert die Selbstspaltung der Kette und macht unsere DNA über Jahrtausende stabil!',
      descEn: 'The "D" in DNA (deoxyribonucleic acid)! Lacks just a single oxygen atom at carbon C2 compared with ribose.',
      extraEn: 'Removing that single 2’-oxygen prevents strand self-cleavage, making DNA chemically stable for millennia!'
    },
    {
      slug: 'rhamnose',
      nameDe: 'Rhamnose',
      nameEn: 'Rhamnose',
      category: 'amino_deoxy',
      weight: 3,
      cloudPos: [28.7, 43.4, 2],
      linkage: '— (6-Desoxy-L-Mannose)',
      buildingBlocksDe: 'L-Mannose ohne Sauerstoff an C6 (–CH₃)',
      buildingBlocksEn: '6-Deoxy-L-mannose (–CH₃ at C6)',
      buildingBlockSlugs: ['mannose'],
      formula: 'C₆H₁₂O₅',
      structureKind: 'haworth',
      descDe: 'Natürlicher L-Desoxyzucker (benannt nach dem Kreuzdorn Rhamnus), der in Pektin-Gelenkstellen („Kinks“), Pflanzenfarbstoffen und Bakterienhüllen steckt.',
      extraDe: 'An C6 sitzt statt CH₂OH eine unpolare Methylgruppe (–CH₃).',
      descEn: 'Naturally abundant 6-deoxy-L-mannose forming flexible "kinks" in plant pectin backbones, flavonoid glycosides, and bacterial capsules.',
      extraEn: 'Carries a non-polar methyl group (–CH₃) at C6 in place of CH₂OH.'
    },
    {
      slug: 'fucose',
      nameDe: 'Fucose',
      nameEn: 'Fucose',
      category: 'amino_deoxy',
      weight: 3,
      cloudPos: [22.3, 55.6, 2],
      linkage: '— (6-Desoxy-L-Galaktose)',
      buildingBlocksDe: 'L-Galaktose ohne Sauerstoff an C6 (–CH₃)',
      buildingBlocksEn: '6-Deoxy-L-galactose (–CH₃ at C6)',
      buildingBlockSlugs: ['galaktose'],
      formula: 'C₆H₁₂O₅',
      structureKind: 'haworth',
      descDe: 'L-Fucose (benannt nach dem Blasentang Fucus) sitzt sowohl in Meeresalgen als auch auf menschlichen Blutzellen!',
      extraDe: 'Sie bildet das H-Antigen der Blutgruppe 0 (Null) – und ist damit das Fundament des gesamten menschlichen AB0-Blutgruppensystems!',
      descEn: 'L-Fucose (named after bladderwrack seaweed Fucus) occurs in marine fucoidans and on human blood cells!',
      extraEn: 'Forms the H-antigen defining human blood type O — the core foundation of the entire ABO blood group system!'
    },
    {
      slug: 'digitoxose',
      nameDe: 'Digitoxose',
      nameEn: 'Digitoxose',
      category: 'amino_deoxy',
      weight: 4,
      cloudPos: [59.4, 50.5, 3],
      linkage: '— (2,6-Didesoxyzucker)',
      buildingBlocksDe: 'Hexose ohne Sauerstoff an C2 und C6',
      buildingBlocksEn: '2,6-Dideoxy-D-ribo-hexose',
      buildingBlockSlugs: ['allose'],
      formula: 'C₆H₁₂O₄',
      structureKind: 'haworth',
      descDe: 'Zweifacher Desoxyzucker aus dem Roten Fingerhut (Digitalis purpurea): Drei Digitoxose-Ringe hängen am Herzmedikament Digitoxin!',
      extraDe: 'Die Zuckerkette steuert präzise Wasserlöslichkeit und Wirkdauer des Herzglykosids im Körper.',
      descEn: '2,6-Dideoxyhexose from foxglove (Digitalis purpurea): a trisaccharide tail of digitoxose units is attached to the cardiac glycoside digitoxin!',
      extraEn: 'Fine-tunes the solubility, receptor binding, and half-life of foxglove heart medication.'
    },
    {
      slug: '3-6-anhydro-galactose',
      nameDe: '3,6-Anhydro-Galactose',
      nameEn: '3,6-Anhydro-galactose',
      category: 'amino_deoxy',
      weight: 3,
      cloudPos: [70.9, 35.4, 2],
      linkage: '— (Verbrückter Doppelring-Zucker)',
      buildingBlocksDe: 'Galaktose mit innerer Sauerstoffbrücke C3–O–C6',
      buildingBlocksEn: 'Bicyclic galactose with internal C3–O–C6 bridge',
      buildingBlockSlugs: ['galaktose'],
      formula: 'C₆H₁₀O₅',
      structureKind: 'haworth',
      descDe: 'Faszinierender Brückenzucker aus Meeres-Rotalgen: Eine innere Sauerstoffbrücke spannt sich quer von C3 zu C6 und bildet ein starres Doppelringsystem!',
      extraDe: 'Genau dieser starre Brückenbaustein zwingt Agar und Carrageen in Doppelhelices, die Wasser zu schnittfesten Gelen erstarren lassen.',
      descEn: 'Fascinating bicyclic sugar unique to red seaweeds: an internal ether bridge spans C3 to C6!',
      extraEn: 'This rigid bicyclic unit drives agar and carrageenan chains into double helices that set water into firm gels.'
    },
    {
      slug: 'cellobiose',
      nameDe: 'Cellobiose',
      nameEn: 'Cellobiose',
      category: 'disaccharide',
      weight: 4,
      cloudPos: [40.5, 13.5, 2],
      linkage: 'β-1→4',
      buildingBlocksDe: '2 × D-Glucose (180° gedreht)',
      buildingBlocksEn: '2 × D-Glucose (180° inverted)',
      buildingBlockSlugs: ['glucose'],
      formula: 'C₁₂H₂₂O₁₁',
      structureKind: 'cellobiose_dimer',
      descDe: 'Das direkte β-1→4-Gegenstück zum Malzzucker (Maltose) und die sich wiederholende Zweifach-Grundeinheit der Zellulose!',
      extraDe: 'Obwohl sie wie Maltose aus zwei identischen Glucose-Ringen besteht, ist sie für menschliche Verdauungsenzyme komplett unspaltbar, bleibt aber reduzierend (Fehling-Probe positiv).',
      descEn: 'The β-1→4 counterpart to maltose and the fundamental repeating disaccharide unit of plant cellulose!',
      extraEn: 'Although built from two D-glucose rings just like maltose, humans cannot cleave its β-1→4 bond; its free right-hand hemiacetal still makes it a reducing sugar.'
    },
    {
      slug: 'trehalose',
      nameDe: 'Trehalose',
      nameEn: 'Trehalose',
      category: 'disaccharide',
      weight: 4,
      cloudPos: [13.5, 84.5, 2],
      linkage: 'α,α-1→1',
      buildingBlocksDe: '2 × D-Glucose (Kopf-an-Kopf)',
      buildingBlocksEn: '2 × D-Glucose (head-to-head)',
      buildingBlockSlugs: ['glucose'],
      formula: 'C₁₂H₂₂O₁₁',
      structureKind: 'trehalose_dimer',
      descDe: 'Der „Auferstehungs- und Pilzzucker“: Zwei Glucose-Ringe sind über beide C1-Atome (α,α-1→1) verschlossen – dadurch extrem hitze- und säurestabil und nicht-reduzierend!',
      extraDe: 'Dient Insekten als Flug-Blutzucker in der Hämolymphe und hüllt Proteine von Bärtierchen (Tardigraden) und Wüstenpflanzen bei völliger Austrocknung in einen schützenden Glaspanzer!',
      descEn: '"Mushroom & resurrection sugar": two α-D-glucose rings locked head-to-head via both C1 carbons (α,α-1→1), making it non-reducing and remarkably stable!',
      extraEn: 'Serves as the primary blood sugar of flying insects and vitrifies tardigrade and resurrection-plant cells into protective bioglass during complete desiccation!'
    },
    {
      slug: 'maltotriose',
      nameDe: 'Maltotriose',
      nameEn: 'Maltotriose',
      category: 'oligosaccharide',
      weight: 2,
      cloudPos: [89.0, 27.5, 1],
      linkage: 'α-1→4',
      buildingBlocksDe: '3 × D-Glucose',
      buildingBlocksEn: '3 × D-Glucose',
      buildingBlockSlugs: ['glucose', 'maltose'],
      formula: 'C₁₈H₃₂O₁₆',
      structureKind: 'polymer_ribbon',
      descDe: 'Dreifachzucker aus drei α-1→4-verknüpften Glucose-Einheiten, der zusammen mit Maltose entsteht, wenn α-Amylase lange Stärkeketten zerschneidet.',
      extraDe: 'Zentraler Würzezucker beim Bierbrauen (ober- und untergärige Brauhefen verwerten Maltotriose unterschiedlich gut!) und Grundbaustein des Biopolymers Pullulan.',
      descEn: 'Trisaccharide of three α-1→4-linked D-glucose rings produced alongside maltose when α-amylase digests starch.',
      extraEn: 'Crucial fermentable wort sugar in brewing beer and the repeating trimer block of edible pullulan films.'
    },
    {
      slug: 'hyaluronsaeure',
      nameDe: 'Hyaluronsäure',
      nameEn: 'Hyaluronic Acid (Hyaluronan)',
      category: 'polysaccharide',
      weight: 4,
      cloudPos: [28.0, 26.5, 3],
      linkage: 'β-1→3 & β-1→4 (alternierend)',
      buildingBlocksDe: 'D-Glucuronsäure + N-Acetylglucosamin',
      buildingBlocksEn: 'D-Glucuronic acid + N-Acetylglucosamine',
      buildingBlockSlugs: ['glucuronsaeure', 'n-acetylglucosamin'],
      formula: '(C₁₄H₂₁NO₁₁)ₙ',
      structureKind: 'polymer_ribbon',
      descDe: 'Wasserspeicher-Weltmeister unseres Körpers: Ein einziges Gramm Hyaluronsäure kann bis zu sechs Liter Wasser zu einem druckelastischen Gel binden!',
      extraDe: 'Schmiert als Gelenkflüssigkeit unsere Knie, füllt den Glaskörper des Auges (griech. hyalos = Glas) und polstert das Bindegewebe der Haut.',
      descEn: 'Champion water-binding biopolymer of the human body: a single gram of hyaluronan traps up to six liters of water into a viscoelastic gel!',
      extraEn: 'Lubricates human joints, fills the vitreous humor of the eye (Greek hyalos = glass), and hydrates dermal connective tissue.'
    },
    {
      slug: 'heparin',
      nameDe: 'Heparin',
      nameEn: 'Heparin',
      category: 'polysaccharide',
      weight: 3,
      cloudPos: [68.5, 11.5, 2],
      linkage: 'α-1→4 & β-1→4 (hochsulfatiert)',
      buildingBlocksDe: 'L-Iduronsäure + D-Glucosamin (sulfatiert)',
      buildingBlocksEn: 'L-Iduronic acid + D-Glucosamine (sulfated)',
      buildingBlockSlugs: ['iduronsaeure', 'glucosamin', 'glucuronsaeure'],
      formula: 'Sulfatiertes Glykosaminoglykan',
      structureKind: 'polymer_ribbon',
      descDe: 'Das Biomolekül mit der höchsten negativen Ladungsdichte im menschlichen Körper! Wird in Mastzellen (besonders in Leber und Lunge) gespeichert.',
      extraDe: 'Unverzichtbares Notfall- und OP-Medikament: Eine spezifische Fünfer-Zuckersequenz im Heparin aktiviert Antithrombin III um das Tausendfache und verhindert Blutgerinnsel (Thrombosen).',
      descEn: 'The most negatively charged biological macromolecule known in humans, stored in mast cells of liver and lung tissue!',
      extraEn: 'Essential clinical anticoagulant: a specific pentasaccharide sequence in heparin accelerates antithrombin III a thousandfold to prevent thrombosis.'
    },
    {
      slug: 'chitosan',
      nameDe: 'Chitosan',
      nameEn: 'Chitosan',
      category: 'polysaccharide',
      weight: 3,
      cloudPos: [74.5, 87.5, 2],
      linkage: 'β-1→4',
      buildingBlocksDe: 'D-Glucosamin (+ N-Acetylglucosamin)',
      buildingBlocksEn: 'D-Glucosamine (+ N-Acetylglucosamine)',
      buildingBlockSlugs: ['glucosamin', 'n-acetylglucosamin', 'chitin'],
      formula: '(C₆H₁₁NO₄)ₙ',
      structureKind: 'amino_chair',
      descDe: 'Das einzige positiv geladene (kationische) Natur-Polysaccharid! Wird durch Abspaltung der Acetylgruppen aus dem Chitin von Krabbenschalen und Pilzen gewonnen.',
      extraDe: 'Wirkt blutstillend und antibakteriell in modernen Notfall-Wundauflagen, klärt Abwasser als Bio-Flockungsmittel und dient als kompostierbare Verpackungsfolie.',
      descEn: 'Nature’s signature positively charged (cationic) polysaccharide, produced by deacetylating chitin from crustacean shells or fungi!',
      extraEn: 'Stops bleeding rapidly in trauma wound dressings, flocculates pollutants in water purification, and forms biodegradable packaging films.'
    },
    {
      slug: 'n-acetylgalactosamin',
      nameDe: 'N-Acetylgalactosamin',
      nameEn: 'N-Acetylgalactosamine (GalNAc)',
      category: 'amino_deoxy',
      weight: 3,
      cloudPos: [25.5, 11.5, 2],
      linkage: '— (Acetylierter Aminozucker)',
      buildingBlocksDe: 'D-Galaktose mit Acetylaminogruppe an C2',
      buildingBlocksEn: 'D-Galactose with acetamido group at C2',
      buildingBlockSlugs: ['galaktose', 'n-acetylglucosamin'],
      formula: 'C₈H₁₅NO₆',
      structureKind: 'amino_chair',
      descDe: 'Das C4-Epimer des N-Acetylglucosamins – und der entscheidende Erkennungszucker für die menschliche **Blutgruppe A** auf roten Blutkörperchen!',
      extraDe: 'In der modernen Medizin nutzen RNA-Medikamente (siRNA) kleine GalNAc-Zuckerantennen als „Postleitzahl“, um Wirkstoffe zielgenau in Leberzellen zu schleusen!',
      descEn: 'The C4-epimer of GlcNAc — and the terminal antigen sugar defining human **Blood Type A** on red blood cells!',
      extraEn: 'Modern RNA therapeutics attach tri-antennary GalNAc clusters as a molecular "postal code" to deliver drugs selectively into liver hepatocytes!'
    },
    {
      slug: 'ascorbinsaeure',
      nameDe: 'Ascorbinsäure',
      nameEn: 'Ascorbic Acid (Vitamin C)',
      category: 'sugar_acid',
      weight: 4,
      cloudPos: [87.5, 88.5, 3],
      linkage: '— (Endiol-γ-Lacton)',
      buildingBlocksDe: 'Zuckerlacton aus D-Glucose / L-Sorbose',
      buildingBlocksEn: 'Sugar lactone derived from D-Glucose / L-Sorbose',
      buildingBlockSlugs: ['sorbose', 'glucose'],
      formula: 'C₆H₈O₆',
      structureKind: 'ascorbic_lactone',
      descDe: 'Überraschung: **Vitamin C** (L-Ascorbinsäure) ist chemisch ein enges Zuckerderivat! Fast alle Säugetiere stellen es in der Leber selbst aus D-Glucose her – nur Primaten, Meerschweinchen und Fledermäuse haben das letzte Enzym verloren.',
      extraDe: 'Seine Endiol-Doppelbindung (HO–C=C–OH) fängt freie Radikale ab (Antioxidans), hält Kollagenfasern stabil (Schutz vor Skorbut!) und reduziert Fehlingsche Lösung schon bei Raumtemperatur!',
      descEn: 'Chemistry surprise: **Vitamin C** (L-ascorbic acid) is a cyclic sugar-acid lactone! Most mammals synthesize it directly from D-glucose in the liver, whereas primates and guinea pigs lost the final enzyme.',
      extraEn: 'Its enediol group (HO–C=C–OH) scavenges free radicals, enables collagen cross-linking (preventing scurvy!), and is such a strong reductant that it reduces Fehling’s solution even at room temperature!'
    }
  ];

  // Bilingual trivial-name & concept search aliases so everyday queries match immediately
  const SEARCH_ALIASES = {
    glucose: 'traubenzucker dextrose blutzucker stärkezucker grape sugar blood sugar corn sugar energie gehirn fehling',
    fruktose: 'fruchtzucker lävulose levulose fruit sugar obst honig süßkraft ketohexose',
    saccharose: 'haushaltszucker kristallzucker rohrzucker rübenzucker tafelzucker zucker table sugar cane sugar beet sugar nicht-reduzierend',
    laktose: 'milchzucker milk sugar dairy laktoseintoleranz kuhmilch muttermilch',
    maltose: 'malzzucker malt sugar bier brauen speichel amylase brot',
    cellobiose: 'zellulosebaustein holzfaser beta-dimer',
    trehalose: 'pilzzucker mykose auferstehungszucker bärtierchen insekten hämolymphe mushroom sugar tardigrade',
    xylit: 'birkenzucker birch sugar zahnpflege kaugummi e967 karies',
    sorbit: 'sorbitol vogelbeere feuchthaltemittel e420',
    mannit: 'mannitol manna hirndruck e421',
    erythrit: 'erythritol kalorienfrei meso zuckerersatz e968',
    galaktose: 'schleimzucker blutgruppe b blood type b milch gehirnzucker',
    'n-acetylgalactosamin': 'galnac blutgruppe a blood type a knorpel sirna leber',
    fucose: 'blutgruppe 0 blutgruppe o blood type o ab0 h-antigen seetang',
    desoxyribose: 'dna erbsubstanz desoxyribonukleinsäure genetik 2-deoxyribose',
    ribose: 'rna atp energiewährung ribonukleinsäure coenzym',
    xylose: 'holzzucker wood sugar birke hemizellulose',
    staerke: 'amylose amylopektin kartoffel getreide nudeln reis mehl starch',
    zellulose: 'cellulose holz papier baumwolle pflanzenfaser ballaststoff',
    glykogen: 'leberstärke muskelstärke tierische stärke ausdauer sport',
    chitin: 'insektenpanzer krabbenschale pilzzellwand exoskelett',
    chitosan: 'wundauflage bioplastik wasserfilter krabben',
    hyaluronsaeure: 'hyaluron gelenkflüssigkeit haut falten glaskörper hyaluronan',
    heparin: 'blutverdünner thrombose antikoagulans blutgerinnung',
    murein: 'peptidoglykan bakterienzellwand penicillin lysozym antibiotika',
    pektin: 'marmelade konfitüre geliermittel apfel e440',
    alginat: 'braunalge bubble tea molekularküche zahnarzt e400',
    agar: 'agar-agar petrischale nährboden rotalge gelatine vegan e406',
    inulin: 'chicoree topinambur präbiotikum darmflora ballaststoff fruktan',
    raffinose: 'bohnen hülsenfrüchte blähungen melasse',
    psicose: 'allulose rare sugar kalorienarm feigen',
    sorbose: 'vitamin c synthese reichstein vogelbeere',
    ascorbinsaeure: 'vitamin c skorbut antioxidans zitrone immunsystem kollagen e300',
    'n-acetylneuraminsaeure': 'sialinsäure influenza grippevirus h1n1 neuraminidase zelloberfläche'
  };

  // Non-reducing sugars (locked full acetals, polymers without significant free ends, polyols, simple oxidized acids)
  const REDUCING_SLUGS = new Set([
    'glucose', 'fruktose', 'galaktose', 'mannose', 'allose', 'altrose', 'gulose', 'idose', 'talose',
    'psicose', 'sorbose', 'tagatose', 'arabino-3-hexulose', 'sedoheptulose',
    'ribose', 'arabinose-d', 'arabinose-l', 'xylose', 'lyxose', 'ribulose', 'xylulose',
    'erythrose', 'threose', 'erythrulose', 'dihydroxyaceton', 'glycerinaldehyd',
    'laktose', 'maltose', 'cellobiose', 'isomaltose', 'isomaltulose', 'laktulose', 'turanose', 'gentiobiose',
    'maltotriose',
    'glucosamin', 'n-acetylglucosamin', 'mannosamin', 'n-acetylgalactosamin', 'n-acetylmuraminsaeure',
    'n-acetylneuraminsaeure', 'n-glycolylneuraminsaeure',
    'desoxyribose', 'rhamnose', 'fucose', 'digitoxose', '3-6-anhydro-galactose',
    'glucuronsaeure', 'galacturonsaeure', 'iduronsaeure', 'mannuronsaeure', 'guluronsaeure',
    'ascorbinsaeure' // strongly reducing via enediol!
  ]);

  // Subtle spatial de-collision adjustments so adjacent word-cloud pills remain crisp & readable across screen widths
  const CLOUD_POS_TWEAKS = {
    threose: [52.5, 63.8, 2],
    ribulose: [29.2, 87.8, 2],
    mannit: [37.4, 57.6, 2],
    traganth: [50.8, 44.8, 1],
    mannose: [34.8, 39.2, 1],
    sorbit: [56.8, 29.8, 1],
    rhamnose: [29.8, 41.8, 2]
  };

  for (const s of SUGARS) {
    if (CLOUD_POS_TWEAKS[s.slug]) {
      s.cloudPos = CLOUD_POS_TWEAKS[s.slug];
    }
    s.reducing = REDUCING_SLUGS.has(s.slug);
    s.aliases = SEARCH_ALIASES[s.slug] || '';
  }

  // Deterministic 2D bounding-box relaxation pass so all 86 word-cloud labels remain legible & non-overlapping in DE and EN
  (function relaxCloudPositions() {
    const refW = 1360;
    const refH = 560;
    const fontScale = { 5: 25, 4: 20, 3: 16.5, 2: 14, 1: 13 };
    const nodes = SUGARS.map((s) => {
      const fs = fontScale[s.weight] || 16;
      const maxChars = Math.max(s.nameDe.length, s.nameEn.length);
      const halfW = ((maxChars * fs * 0.56 + 18) / refW) * 50;
      const halfH = ((fs * 1.45 + 8) / refH) * 50;
      return {
        sugar: s,
        x: s.cloudPos[0],
        y: s.cloudPos[1],
        z: s.cloudPos[2] || 2,
        hw: halfW,
        hh: halfH
      };
    });

    for (let iter = 0; iter < 90; iter++) {
      let moved = false;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const overlapX = a.hw + b.hw - Math.abs(a.x - b.x);
          const overlapY = a.hh + b.hh - Math.abs(a.y - b.y);
          if (overlapX > 0 && overlapY > 0) {
            moved = true;
            // Push apart along the axis requiring the smaller displacement
            if (overlapY <= overlapX * 1.35) {
              const dir = a.y <= b.y ? (a.y === b.y && i < j ? -1 : -1) : 1;
              const push = overlapY * 0.54 + 0.15;
              a.y += dir * push;
              b.y -= dir * push;
            } else {
              const dir = a.x <= b.x ? -1 : 1;
              const push = overlapX * 0.54 + 0.2;
              a.x += dir * push;
              b.x -= dir * push;
            }
          }
        }
      }
      for (const n of nodes) {
        // Keep clear of the floating Pause / Cloud-List buttons in the bottom-right corner (>81%, >78%)
        if (n.x + n.hw > 81 && n.y + n.hh > 78) {
          if (n.x - 81 < n.y - 78) {
            n.x = 81 - n.hw - 0.8;
          } else {
            n.y = 78 - n.hh - 0.8;
          }
        }
        n.x = Math.max(n.hw + 1.2, Math.min(98.8 - n.hw, n.x));
        n.y = Math.max(n.hh + 2.2, Math.min(95.5 - n.hh, n.y));
      }
      if (!moved) break;
    }

    for (const n of nodes) {
      n.sugar.cloudPos = [Number(n.x.toFixed(2)), Number(n.y.toFixed(2)), n.z];
    }
  })();

  /**
   * Interactive 10-Question Museum Rallye Quiz spanning all 5 stations (DE & EN)
   */
  const QUIZ_QUESTIONS = [
    {
      id: 'q1-cellulose-starch',
      qDe: 'Stärke (Kartoffeln) und Zellulose (Holz/Baumwolle) bestehen BEIDE zu 100 % aus D-Glucose. Warum können wir Stärke verdauen, Zellulose aber nicht?',
      qEn: 'Starch (potatoes) and cellulose (wood/cotton) are BOTH 100% pure D-glucose. Why can humans digest starch but not cellulose?',
      optionsDe: [
        'Bei Zellulose ist jeder zweite Glucose-Ring um 180° gedreht (β-1→4) – er passt nicht in unsere α-Amylase',
        'Zellulose besteht aus L-Glucose statt D-Glucose',
        'Stärke enthält Fünfringe, Zellulose Sechsringe',
        'Zellulose besitzt gar keine Sauerstoffatome'
      ],
      optionsEn: [
        'Every second glucose ring in cellulose is flipped 180° (β-1→4), colliding with human α-amylase',
        'Cellulose is built from mirror-image L-glucose instead of D-glucose',
        'Starch uses 5-membered rings whereas cellulose uses 6-membered rings',
        'Cellulose contains no oxygen atoms'
      ],
      correctIndex: 0,
      explainDe: 'Genau! Die α-1→4-Bindung der Stärke passt exakt in unsere Speichel- und Pankreas-Amylase, während die β-1→4-Geometrie der Zellulose sterisch anstößt.',
      explainEn: 'Spot on! Starch’s α-1→4 linkage fits human α-amylase, whereas cellulose’s 180°-alternating β-1→4 geometry causes a steric clash.',
      jump: { station: 'enzyme', substrate: 'zellulose', enzyme: 'amylase' }
    },
    {
      id: 'q2-c5-flip-idose',
      qDe: 'Überraschung im C-Dreher: Was entsteht, wenn man bei D-Glucose EINZIG das unterste chirale Zentrum (C5) umdreht?',
      qEn: 'C-Rotator surprise: What molecule do you get if you flip ONLY the lowest chiral carbon (C5) of D-Glucose?',
      optionsDe: [
        'L-Glucose (das Spiegelbild)',
        'L-Idose (ein Diastereomer – für L-Glucose müsste man ALLE 4 Zentren spiegeln!)',
        'D-Fruktose',
        'D-Galaktose'
      ],
      optionsEn: [
        'L-Glucose (the mirror image)',
        'L-Idose (a diastereomer — L-Glucose requires inverting ALL 4 chiral centers!)',
        'D-Fructose',
        'D-Galactose'
      ],
      correctIndex: 1,
      explainDe: 'Klassiker der Stereochemie! Das „L“ an C5 macht den Zucker zwar zu einem L-Zucker, aber da C2–C4 unverändert blieben, entsteht L-Idose statt L-Glucose!',
      explainEn: 'Classic stereochemistry trap! Inverting C5 switches the D/L prefix to L, but leaving C2–C4 unchanged produces L-Idose rather than mirror-image L-Glucose!',
      jump: { station: 'stereo', stereoClass: 'aldose', carbons: 6, dirs: ['R', 'L', 'R', 'L'] }
    },
    {
      id: 'q3-sucrose-nonreducing',
      qDe: 'Warum fällt die Fehling-Probe bei Haushaltszucker (Saccharose) negativ aus (nicht-reduzierend), bei Milchzucker (Laktose) und Maltose aber positiv?',
      qEn: 'Why does table sugar (sucrose) test negative in Fehling’s test (non-reducing), whereas lactose and maltose test positive?',
      optionsDe: [
        'Weil Fruktose niemals mit Fehlingscher Lösung reagiert',
        'Bei Saccharose sind BEIDE anomeren Zentren (C1 der Glucose & C2 der Fruktose) in der α,β-1→2-Bindung verschlossen',
        'Weil Saccharose ein Vielfachzucker aus 100 Ringen ist',
        'Weil Laktose eine freie Carbonsäuregruppe trägt'
      ],
      optionsEn: [
        'Because fructose can never react with Fehling’s reagent',
        'In sucrose, BOTH anomeric carbons (Glucose C1 & Fructose C2) are locked head-to-head in the α,β-1→2 bond',
        'Because sucrose is a giant polymer of 100 rings',
        'Because lactose carries a carboxylic acid group'
      ],
      correctIndex: 1,
      explainDe: 'Richtig! Ohne freies Halbacetal kann sich bei Saccharose (genauso wie bei Trehalose!) kein Ring zum offenen Aldehyd öffnen.',
      explainEn: 'Exactly! With both anomeric carbons locked in a full acetal/ketal bridge, neither ring of sucrose can open into a reactive aldehyde.',
      jump: { station: 'profile', slug: 'saccharose' }
    },
    {
      id: 'q4-floh-rule',
      qDe: 'Was besagt die berühmte FLOH-Merkregel beim Ringschluss eines Zuckers?',
      qEn: 'What does the classic FLOH mnemonic rule state when converting a Fischer projection into a Haworth ring?',
      optionsDe: [
        'Fruktose Liefert Ohnehin Honig',
        'Fischer Links = Oben im Haworth-Ring!',
        'Fünfringe Liegen Immer Oben Rechts',
        'Fehling Löst Offene Hexosen'
      ],
      optionsEn: [
        'Fructose Links Onto Hexoses',
        'Fischer Left = Up (Oben) in the Haworth ring!',
        'Five-rings Lean Over Hydrogens',
        'Formula Length Orders Hydroxyls'
      ],
      correctIndex: 1,
      explainDe: 'FLOH = „Fischer Links → Oben im Haworth“! Deshalb steht bei D-Glucose die OH-Gruppe an C3 (links in Fischer) im Sechsring nach OBEN.',
      explainEn: 'Groups pointing LEFT in Fischer point UP in the standard Haworth ring — e.g., C3–OH of D-glucose points up!',
      jump: { station: 'profile', slug: 'glucose' }
    },
    {
      id: 'q5-dna-rna',
      qDe: 'Welcher minimale chemische Unterschied an einem Fünfer-Zucker macht unsere DNA tausendfach stabiler als RNA?',
      qEn: 'Which tiny chemical difference on a 5-carbon sugar makes our DNA orders of magnitude more stable than RNA?',
      optionsDe: [
        'Bei 2-Desoxyribose fehlt an C2 ein einziges Sauerstoffatom (–H statt –OH)',
        'DNA besteht aus Sechsringen statt Fünfringen',
        'DNA nutzt L-Zucker statt D-Zucker',
        'Desoxyribose besitzt eine Schwefelbrücke'
      ],
      optionsEn: [
        '2-Deoxyribose lacks just a single oxygen atom at C2 (–H instead of –OH)',
        'DNA uses 6-membered rings instead of 5-membered rings',
        'DNA uses L-sugars instead of D-sugars',
        'Deoxyribose contains a disulfide bridge'
      ],
      correctIndex: 0,
      explainDe: 'Volltreffer! Ohne die reaktive 2’-OH-Gruppe der Ribose kann sich das Rückgrat der DNA nicht selbst spalten – ideal als Langzeit-Erbspeicher!',
      explainEn: 'Bullseye! Removing the reactive 2’-OH group prevents intramolecular strand cleavage, letting DNA preserve genetic code for millennia!',
      jump: { station: 'profile', slug: 'desoxyribose' }
    },
    {
      id: 'q6-galactose-epimer',
      qDe: 'D-Galaktose (im Milchzucker und auf Blutgruppe B) ist ein Epimer der D-Glucose. An welchem Kohlenstoffatom unterscheiden sie sich einzig?',
      qEn: 'D-Galactose (in milk sugar and Blood Type B) is an epimer of D-Glucose. At which single carbon atom do they differ?',
      optionsDe: [
        'An C1 (Aldehydgruppe)',
        'An C2',
        'An C4 (OH zeigt in Fischer nach links statt rechts, im Ring axial nach oben!)',
        'An C6'
      ],
      optionsEn: [
        'At C1 (aldehyde carbon)',
        'At C2',
        'At C4 (OH points left in Fischer and axially up in the ring!)',
        'At C6'
      ],
      correctIndex: 2,
      explainDe: 'Genau! Dieses nach oben stehende C4-OH wirkt bei Laktose wie ein Schlüsselbart, den nur das Enzym Laktase erkennt.',
      explainEn: 'Correct! That upward axial C4-OH acts as a molecular key peg in lactose that only lactase’s dome pocket fits.',
      jump: { station: 'stereo', stereoClass: 'aldose', carbons: 6, dirs: ['R', 'L', 'L', 'R'] }
    },
    {
      id: 'q7-chitin-arthropod',
      qDe: 'Aus welchem speziellen Zuckerbaustein sind sowohl die Panzer von Krabben & Insekten als auch die Zellwände von Speisepilzen aufgebaut?',
      qEn: 'Which modified sugar monomer builds BOTH insect/crab exoskeletons and mushroom cell walls (chitin)?',
      optionsDe: [
        'Reine D-Fruktose',
        'N-Acetylglucosamin (β-1→4-verknüpfter Aminozucker)',
        'Xylit (Birkenzucker)',
        'Dihydroxyaceton'
      ],
      optionsEn: [
        'Pure D-Fructose',
        'N-Acetylglucosamine (β-1→4-linked acetamido sugar)',
        'Xylitol (birch sugar)',
        'Dihydroxyacetone'
      ],
      correctIndex: 1,
      explainDe: 'Richtig! Die –NH–CO–CH₃-Seitengruppen bilden besonders starke Wasserstoffbrücken zwischen den β-1→4-Ketten des Chitins.',
      explainEn: 'Right! Hydrogen bonding between the acetamido (–NH–CO–CH₃) arms turns β-1→4 chitin strands into tough biological armor.',
      jump: { station: 'profile', slug: 'chitin' }
    },
    {
      id: 'q8-glycogen-branching',
      qDe: 'Warum ist unser menschlicher Energiespeicher Glykogen (in Leber & Muskeln) viel stärker verzweigt (α-1→6) als pflanzliche Stärke?',
      qEn: 'Why is human glycogen (in liver & muscle) much more densely branched (α-1→6) than plant starch?',
      optionsDe: [
        'Damit es süßer schmeckt',
        'Viele Kettenenden erlauben Enzymen, bei Sprint oder Gefahr blitzschnell gleichzeitig Glucose freizusetzen!',
        'Damit es wasserunlöslich wie Holz wird',
        'Weil Menschen keine α-1→4-Bindungen bilden können'
      ],
      optionsEn: [
        'So that muscle tissue tastes sweeter',
        'Many non-reducing chain ends let enzymes mobilize glucose simultaneously within seconds during exercise!',
        'To make it completely insoluble like wood',
        'Because human cells cannot form α-1→4 bonds'
      ],
      correctIndex: 1,
      explainDe: 'Genau! Eine Pflanze hat Zeit beim Keimen – ein Mensch auf der Flucht braucht an hunderten Kettenenden gleichzeitig Sofortenergie!',
      explainEn: 'Spot on! Glycogen phosphorylase attacks non-reducing ends simultaneously, delivering instant fuel on demand.',
      jump: { station: 'puzzle', levelId: 'glykogen-speicher' }
    },
    {
      id: 'q9-xylitol-teeth',
      qDe: 'Warum schützt Xylit („Birkenzucker“) die Zähne vor Karies, obwohl er fast genauso süß wie Haushaltszucker schmeckt?',
      qEn: 'Why does xylitol ("birch sugar") help protect teeth against cavities despite tasting nearly as sweet as sucrose?',
      optionsDe: [
        'Als reduzierter C5-Zuckeralkohol können Kariesbakterien (Streptococcus mutans) ihn nicht zu zahnschädigender Säure vergären',
        'Er besteht aus fluoridierten Sechsringen',
        'Er betäubt die Geschmacksnerven dauerhaft',
        'Er härtet im Mund zu Zellulose aus'
      ],
      optionsEn: [
        'As a reduced C5 sugar alcohol, cavity bacteria (Streptococcus mutans) cannot ferment it into tooth-eroding acid',
        'It contains covalently bound fluoride',
        'It permanently blocks sweet taste receptors',
        'It polymerizes into cellulose on enamel'
      ],
      correctIndex: 0,
      explainDe: 'Exakt! Zuckeralkohole (Polyole) besitzen keine Carbonylgruppe mehr und liefern Kariesbakterien keine vergärbare Energie.',
      explainEn: 'Exactly! Polyols lack a carbonyl group and starve acid-producing oral Streptococcus mutans.',
      jump: { station: 'profile', slug: 'xylit' }
    },
    {
      id: 'q10-blood-groups',
      qDe: 'Was entscheidet biochemisch darüber, ob ein Mensch Blutgruppe 0, A oder B besitzt?',
      qEn: 'What biochemically determines whether a person has Blood Type O, A, or B?',
      optionsDe: [
        'Der Eisengehalt im Hämoglobin',
        'Ein einziger zusätzlicher Zuckerbaustein am Ende der Oligosaccharid-Antenne auf den roten Blutkörperchen!',
        'Die Menge an Stärke im Blutplasma',
        'Ob die Zellmembran aus Chitin oder Murein besteht'
      ],
      optionsEn: [
        'The iron concentration inside hemoglobin',
        'A single terminal sugar monomer at the tip of red-blood-cell surface oligosaccharide antennas!',
        'The amount of starch dissolved in blood plasma',
        'Whether red cells have chitin or murein walls'
      ],
      correctIndex: 1,
      explainDe: 'Faszinierend, oder? Blutgruppe 0 endet mit L-Fucose (H-Antigen); Blutgruppe A hängt ein N-Acetylgalactosamin daran, Blutgruppe B eine D-Galaktose!',
      explainEn: 'Amazing biochemistry: Type O carries the L-fucose H-antigen; Type A adds one N-acetylgalactosamine (GalNAc), while Type B adds one D-galactose!',
      jump: { station: 'puzzle', levelId: 'blutgruppen-ab0' }
    }
  ];

  const SUGAR_MAP = new Map(SUGARS.map(s => [s.slug, s]));

  function getSugarBySlug(slug) {
    return SUGAR_MAP.get(slug) || null;
  }

  function findSugarByName(name) {
    if (!name) return null;
    const clean = name.trim().toLowerCase();
    for (const s of SUGARS) {
      if (
        s.nameDe.toLowerCase() === clean ||
        s.nameEn.toLowerCase() === clean ||
        `d-${s.nameDe.toLowerCase()}` === clean ||
        `l-${s.nameDe.toLowerCase()}` === clean ||
        (s.aliases && s.aliases.split(/\s+/).includes(clean))
      ) {
        return s;
      }
    }
    return null;
  }

  return {
    CATEGORIES,
    GLOSSARY,
    SUGARS,
    QUIZ_QUESTIONS,
    getSugarBySlug,
    findSugarByName
  };
});
