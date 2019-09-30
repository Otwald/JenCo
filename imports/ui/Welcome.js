import React, { useState, useEffect } from 'react';

const welcome = props => {

    const [loco, setLoco] = useState('');
    const [ticket, setTicket] = useState(0);

    useEffect(() => {
        if (props.event) {
            setTicket(props.event.t_price);
            setLoco(props.event.e_loc);
        }
    }, [props.event])

    return (
        <div className='row'>
            <div className='col-sm'>
                <p className="text-sm-left text-break">
                    Hallo zusammen und willkommen auf unserer schönen Website!<br />
                    <br />
                    Diese vorläufige Version dient nur dazu, euch einen Überblick über die angemeldeten Runden zu geben – ignoriert den Anmelde-Button, der tut nichts.
                    Ansonsten: hier noch einmal alle Eckdaten unserer Veranstaltung.
                    <br />
                    <b>Wann?</b> 12. bis 13. Oktober 2019, ab 12 Uhr am Samstag bis 14 Uhr am Sonntag (wir freuen uns über jeden der im Anschluss noch ein wenig beim Putzen der Räume hilft)<br />
                    <br />
                    <b>Wo?</b> Jugendclub Hugo in Jena-Winzerla<br />
                    <br />
                    <b>Wie komme ich da hin?</b> https://www.jz-hugo.de/kontakt/<br />
                    <br />
                    <b>Was kostest der Spaß?</b> 10 Euro (Geld das nach der Bezahlung der Geländekosten übrig bleibt, verteilen wir gleichmäßig unter den Spielleitern)<br />
                    <br />
                    <b>Wie viele Teilnehmer?</b> Maximal 35<br />
                    <br />
                    Für Essen und Trinken ist jeder selber verantwortlich. In unmittelbarer Nähe gibt es einen Rewe und einen Aldi, ansonsten findet ihr sicherlich jemanden für eine gemeinsame Pizzabestellung. Wer möchte kann auch gerne auf dem Gelände übernachten – erwähnt das in diesem Fall einfach kurz in eurer Anmeldung und bringt euch Feldbett, Schlafsack etc. mit.<br />
                    <br />
                    Geplant sind von unserer Seite die folgenden Zeitblöcke:<br />
                    <br />
                    Erster Block (Samstag Nachmittag) → 13-17 Uhr<br />

                    Zweiter Block (Samstag Abend) → 18-22 Uhr<br />

                    Dritter Block (Samstag Nacht) → ab 23 Uhr (Open End)<br />

                    Vierter Block (Sonntag Vormittag) → 9-13 Uhr<br />
                    <br />
                    Freundliche Grüße,<br />
                    Anne, Daniel, Martin und Justus<br />
                </p>
            </div>
        </div >
    )

}

export default welcome