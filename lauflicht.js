// ==========================================
// CONFIGURATION: Menüs und Texte für beide Sprachen
// ==========================================

const sprachen = {
    de: {
        lauflicht: "+++ Willkommen auf meiner Website! +++ Funkstation 13OT301 QRV +++ Neues aus dem Bunker Wollenberg online! +++",
        menue: [
            { name: "Startseite", url: "index.html" },
            { name: "Nachrichtentechnik", url: "nachrichtentechnik.html" },
            { name: "Bunker Wollenberg", url: "bunker.html" },
            { name: "CB-Funk (13OT301)", url: "funk.html" },
            { name: "Arbeit (Mugler SE)", url: "arbeit.html" }
        ]
    },
    ru: {
        lauflicht: "+++ Добро пожаловать на мой сайт! +++ Радиостанция 13OT301 на приёме (QRV) +++ Новости о бункере Волленберг! +++",
        menue: [
            { name: "Главная", url: "index_ru.html" },
            { name: "Информационная техника", url: "nachrichtentechnik_ru.html" },
            { name: "Бункер Волленберг", url: "bunker_ru.html" },
            { name: "Си-Би Радио (13OT301)", url: "funk_ru.html" },
            { name: "Работа (Mugler SE)", url: "arbeit_ru.html" }
        ]
    }
};

// ==========================================
// LOGIK: Popup, Sprach-Wechsel & Seitenaufbau
// ==========================================
document.addEventListener("DOMContentLoaded", function() {

    // Aktuellen Dateinamen ermitteln (z.B. "index_ru.html")
    const aktuellerPfad = window.location.pathname;
    const dateiName = aktuellerPfad.substring(aktuellerPfad.lastIndexOf('/') + 1);

    // Erkennen, ob wir uns bereits auf einer russischen Seite befinden
    let istRussischeSeite = dateiName.includes("_ru.html");
    let gewaehlteSprache = sessionStorage.getItem("sprache");

    // 1. POPUP-ABFRAGE (Nur beim ersten Besuch)
    if (!gewaehlteSprache) {
        let auswahl = confirm("Möchten Sie die Seite auf Deutsch anzeigen?\n\n(Нажмите 'Отмена' для выбора русского языка.)");
        gewaehlteSprache = auswahl ? "de" : "ru";
        sessionStorage.setItem("sprache", gewaehlteSprache);

        // Falls der User Russisch gewählt hat, aber auf der deutschen index.html gestartet ist -> Umleitung!
        if (gewaehlteSprache === "ru" && !istRussischeSeite) {
            window.location.href = "index_ru.html";
            return;
        }
    }

    // Falls die Session-Sprache nicht zur aktuellen Seite passt (z.B. manueller Wechsel)
    const aktiveSprache = istRussischeSeite ? "ru" : "de";
    const aktuelleTexte = sprachen[aktiveSprache];

    // --- TEIL 1: NAVIGATION BAUEN ---
    const navContainer = document.getElementById("haupt-navigation");
    if (navContainer) {
        const ul = document.createElement("ul");

        // Sprach-Umschalter im Menü einbauen
        const liWechsel = document.createElement("li");
        const aWechsel = document.createElement("a");
        if (aktiveSprache === "de") {
            aWechsel.href = dateiName.replace(".html", "_ru.html").replace("_ru_ru", "_ru") || "index_ru.html";
            aWechsel.textContent = "🇷🇺 Русский";
            aWechsel.style.color = "#1abc9c";
        } else {
            aWechsel.href = dateiName.replace("_ru.html", ".html") || "index.html";
            aWechsel.textContent = "🇩🇪 Deutsch";
            aWechsel.style.color = "#1abc9c";
        }
        aWechsel.onclick = function() {
            sessionStorage.setItem("sprache", aktiveSprache === "de" ? "ru" : "de");
        };
        liWechsel.appendChild(aWechsel);
        ul.appendChild(liWechsel);

        // Die normalen Menüpunkte laden
        aktuelleTexte.menue.forEach(link => {
            const li = document.createElement("li");
            const a = document.createElement("a");
            a.href = link.url;
            a.textContent = link.name;
            li.appendChild(a);
            ul.appendChild(li);
        });

        navContainer.appendChild(ul);
    }

    // --- TEIL 2: LAUFLICHT BAUEN ---
    const tickerContainer = document.getElementById("ticker-platzhalter");
    if (tickerContainer) {
        const marquee = document.createElement("marquee");
        marquee.setAttribute("scrollamount", "5");
        marquee.setAttribute("behavior", "scroll");
        marquee.setAttribute("direction", "left");
        marquee.innerHTML = aktuelleTexte.lauflicht;

        tickerContainer.appendChild(marquee);
    }
});
