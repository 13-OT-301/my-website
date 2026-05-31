const fs = require('fs');
const path = require('path');
const { translate } = require('@vitalets/google-translate-api');
const htmlparser2 = require('htmlparser2');
const render = require('dom-serializer').default;

// Alle HTML-Dateien im aktuellen Ordner finden
const dateien = fs.readdirSync(__dirname).filter(file => file.endsWith('.html') && !file.includes('_ru'));

async function uebersetzeText(text) {
    if (!text.trim() || text.match(/^[0-9\W]+$/)) return text; // Überspringe leere Texte oder reine Zahlen
    try {
        const res = await translate(text, { from: 'de', to: 'ru' });
        return res.text;
    } catch (err) {
        console.error("Fehler bei der Übersetzung: ", err);
        return text;
    }
}

async function verarbeiteKnoten(knoten) {
    if (knoten.type === 'text') {
        // Text übersetzen
        knoten.data = await uebersetzeText(knoten.data);
    } else if (knoten.type === 'tag') {
        // Überspringe das Skript-Tag und die Navigation, da JavaScript das Menü regelt
        if (knoten.name === 'script' || (knoten.attribs && knoten.attribs.id === 'haupt-navigation')) {
            return;
        }
        // HTML-Sprachattribut anpassen
        if (knoten.name === 'html') {
            knoten.attribs.lang = 'ru';
        }
        // Kinder-Elemente durchgehen
        if (knoten.children) {
            for (let kind of knoten.children) {
                await verarbeiteKnoten(kind);
            }
        }
    }
}

async function starteUebersetzung() {
    console.log("🔄 Starte automatische Übersetzung...");
    
    for (let datei of dateien) {
        console.log(`📄 Verarbeite: ${datei}...`);
        const htmlInhalt = fs.readFileSync(path.join(__dirname, datei), 'utf-8');
        
        // HTML parsen
        const dom = htmlparser2.parseDocument(htmlInhalt);
        
        // Alle Elemente übersetzen
        for (let knoten of dom.children) {
            await verarbeiteKnoten(knoten);
        }
        
        // Zurück in HTML-Text verwandeln
        const neuesHtml = render(dom);
        
        // Neuen Dateinamen generieren (z.B. index_ru.html)
        const neuerName = datei.replace('.html', '_ru.html');
        fs.writeFileSync(path.join(__dirname, neuerName), neuesHtml, 'utf-8');
        console.log(`✅ Gespeichert als: ${neuerName}`);
    }
    
    console.log("🎉 Fertig! Alle russischen Seiten wurden erstellt.");
}

starteUebersetzung();
