import React from 'react';

const welcome = props => {
    console.log(props.event)
    return (
        <div>
            <p className="text-sm-left text-break">
                Hallo zusammen,<br />
                wenn du dir diese Seite ansiehst, wurdest du vermutlich zu unserer kleinen
                    Pen&Paper-Con im Oktober diesen Jahres eingeladen. Hier noch einmal die Fakten:<br />
                <br />
                <b>Wann?</b> 12. bis 13. Oktober 2019, ab 12 Uhr am Samstag bis 14 Uhr am Sonntag<br />
                <br />
                <b>Wo?</b>{props.event.e_loc}<br />
                <br />
                <b>Wie komme ich da hin?</b> https://www.jz-hugo.de/kontakt/<br />
                <br />
                <b>Was kostest der Spaß?</b> {props.event.t_price} Euro (Geld das nach der Bezahlung der Geländekosten übrig bleibt, verteilen wir unter den Spielleitern)<br />
                <br />
                <b>Wie viele Teilnehmer?</b> Maximal 35<br />
                <br />
                Für Essen und Trinken ist jeder selber verantwortlich. In unmittelbarer Nähe gibt es einen Rewe,
                ansonsten findet ihr sicherlich jemanden für eine gemeinsame Pizzabestellung. Wer möchte kann auch gerne
                    auf dem Gelände übernachten – gebt uns in dem Fall bitte kurz Bescheid und bringt euch Feldbett, Schlafsack etc. mit.<br />
                <br />
                Wenn du kommen möchtest – worüber wir uns sehr freuen würden – dann erstelle dir zunächst
                einen Account auf dieser Website. Darauf hin erhältst du eine Mail mit Kontodaten. Sobald
                dein Geld eingetroffen ist, kannst du online eigene Spielrunden eintragen bzw. dich für angebotene
                Runden anmelden. Pro Zeitblock – jeweils ? Stunden, mit Ausnahme des Open-End-Nachtblocks – können
                    maximal sieben Runden stattfinden.<br />
                <br />
                Bei Fragen könnt ihr uns unter folgender E-Mail-Adresse kontaktieren:<br />
                <br />
                Freundliche Grüße,<br />
                Anne, Martin und Justus
                </p>
        </div >
    )

}

export default welcome