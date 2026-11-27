# Alles Zucker! – Interaktive Kohlenhydrat-Medienstation

Interaktive Web-Anwendung rund um die Biochemie, Stereoisomerie, Verdauung und Polymervielfalt der Kohlenhydrate – inspiriert von der interaktiven Medienstation der Dauerausstellung *„Alles Zucker! Nahrung – Werkstoff – Energie“* im Deutschen Technikmuseum Berlin.

## Die 5 interaktiven Stationen + Museums-Quiz

1. **Zucker-Wolke & Lexikon (`[Z]`)**: Schwebende Wortwolke und umschaltbare Katalog-Ansicht mit **86 Zuckern** (Monosaccharide, Disaccharide, Oligosaccharide, Polysaccharide, Zuckeralkohole, Zuckersäuren/Lactone, Amino- und Desoxyzucker), Kategorie-Filtern und zweisprachiger Volltextsuche inklusive Alltags-Synonymen (findet z. B. *Traubenzucker*, *Milchzucker*, *Birkenzucker*, *Pilzzucker*, *Blutgruppe A/B/0*, *DNA/RNA* oder *Vitamin C*).
2. **Zucker-Steckbriefe & Ringschluss (`[i]`)**: Detailansicht jedes Zuckers (wie *Chitin*, *Zellulose*, *Stärke*, *Glykogen*, *Saccharose*, *Trehalose*, *Laktose*, *Cellobiose*, *Hyaluronsäure*, *Ascorbinsäure*) mit interaktiven Glossar-Begriffen, Fehling-Reduktions-Indikator, anklickbaren Grundbausteinen, maßgeschneiderten Strukturformeln (Sesselkonformation, Haworth- und Fischer-Projektion) sowie Umschalter zwischen offenkettiger Fischer-Form und α-/β-Pyranose-/Furanose-Ringform (FLOH-Regel) und Direkt-Sprung ins Enzym-Labor oder Puzzle.
3. **C-Dreher – Stereoisomerie (`[C↻]`)**: *„Dreh ein C und schau was passiert!“* – Interaktive Fischer-Projektion aller **42 Stereoisomere** der Aldosen und Ketosen mit 4, 5 und 6 Kohlenstoffatomen (D- und L-Reihe chemisch exakt), Entdecker-Schnellwahl, Epimer-/Enantiomer-Vergleich, Spiegelbild-Generator und Live-Haworth-Vorschau (inkl. Pyranose-/Furanose-Umschaltung).
4. **Enzym-Labor (`[ᗧ]`)**: Interaktive 60-fps-Simulation des Schlüssel-Schloss-Prinzips bei der Kohlenhydratverdauung (*α-Amylase*, *Laktase*, *Saccharase*, *Cellulase*, *Chitinase*, *Inulinase*) an sechs Zuckerketten inklusive Simulation einer Laktoseintoleranz.
5. **Polysaccharid-Baukasten (`[🧩]`)**: *„Unendliche Möglichkeiten – Baue das Polysaccharid nach!“* – Drag-&-Drop-, Klick- und Tastatur-Puzzle mit vier Monosaccharid-Grundformen, sichtbaren glykosidischen Bindungen und fünf biologischen Bauplänen (pflanzliches Zellwand-Netzwerk, Glykogen, Chitin/Murein, Inulin und menschliche AB0-Blutgruppen-Zuckerantennen).
6. **Interaktives Museums-Quiz (`[🎓 Quiz]`)**: 10 biochemische Entdecker-Fragen quer durch alle fünf Stationen mit Sofort-Erklärung und Direkt-Sprung zum jeweiligen Live-Experiment.

## Starten & Testen

- **Direkt im Browser öffnen**: Einfach `index.html` per Doppelklick im Browser öffnen (funktioniert ohne Build-Schritt auch direkt über `file://`).
- **Lokaler Webserver**:
  ```bash
  npm start
  # Öffnet http://127.0.0.1:8765
  ```
- **Automatisierte Tests ausführen**:
  ```bash
  npm test
  ```
