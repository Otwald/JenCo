import React, { useState, useEffect } from "react";

const welcome = (props) => {
  const [loco, setLoco] = useState("");
  const [ticket, setTicket] = useState(0);

  useEffect(() => {
    if (props.event) {
      setTicket(props.event.t_price);
      setLoco(props.event.e_loc);
    }
  }, [props.event]);

  return (
    <div className="row welcome">
      <div className="col-sm">
        <p className="text-sm-left text-break">
          Hallo zusammen und willkommen auf unserer schönen Website!
          <br />
          <br />
          auch dieses Jahr wollen wir – Anne, Daniel, Martin und Justus – wieder
          eine ganztägige Pen&Paper-Rollenspiel-Veranstaltung in Jena
          organisieren.
          <br /> Um gleich zum schwierigsten Thema zu kommen: natürlich wissen
          auch wir nicht wie sich die gegenwärtige Lage weiter entwickeln wird.
          Im Anbetracht der aktuellen Lockerungen sind wir jedoch
          zuversichtlich, dass unser kleines Event wie geplant stattfinden kann.
          Sollte sich die Lage bis zum Oktober jedoch wieder verschärfen,
          verschiebt sich unsere Con ins nächste Jahr. <br />
          Und damit zu den Eckdaten unserer Veranstaltung: <br />
          <br />
          <b>Wann?</b> 3. Oktober 2020 (Tag der Deutschen Einheit), Einlass ab 8
          Uhr bis Open End
          <br />
          <b>Wo?</b> Jugendclub Hugo in Jena-Winzerla
          <br />
          <br />
          <b>Wie komme ich da hin?</b> https://www.jz-hugo.de/kontakt/
          <br />
          <br />
          <b>Was kostest der Spaß?</b> 10 Euro (Geld das nach der Bezahlung der
          Geländekosten übrig bleibt, verteilen wir gleichmäßig unter den
          Spielleitern)
          <br />
          <br />
          <b>Wie viele Teilnehmer?</b> Maximal 30
          <br />
          <br />
          <b>Geplant sind von unserer Seite die folgenden Zeitblöcke:</b>
          <br />
          Einlass → ab 8 Uhr
          <br /> Erster Spielrunden-Block (Samstag Vormittag) → 9 bis 13 Uhr
          <br /> Zweiter Spielrunden-Block (Samstag Nachmittag) → 14-18 Uhr
          <br /> Dritter Spielrunden-Block (Samstag Abend) → 19-23 Uhr Vierter
          <br /> Spielrunden-Block (Samstag Nacht) → ab 0 Uhr (Open End)
          <br />
          <br />
          Für Essen und Trinken ist jeder selbst verantwortlich – bitte bedenkt,
          dass es sich bei dem 3. Oktober um einen Feiertag handelt – ihr
          müsstet im Zweifelsfall also teuer in der nahen Tankstelle einkaufen.
          Ansonsten wird es aber mit ziemlicher Sicherheit eine gemeinsame
          Pizzabestellung am Abend geben. Wer möchte kann auch gerne auf dem
          Gelände übernachten – erwähnt das in diesem Fall kurz in eurer
          Anmeldung und bringt euch Feldbett, Schlafsack etc. mit.
          <br />
          Wenn ihr also teilnehmen wollt, schickt uns einfach eine kurze
          Nachricht – eventuell auch schon mit Informationen über Spielrunden
          die ihr gerne anbieten wollt – und wir lassen euch dann die Kontodaten
          zukommen
          <br />
          Ansonsten: wenn ihr noch Leute kennt, die Interesse an einer PnP-Con
          hätten, dann wäre es klasse wenn ihr diese Nachricht weiterleiten
          würdet.
          <br />
          <br />
          So viel erst mal von uns
          <br />
          Mit freundlichen Grüßen
          <br />
          Anne, Daniel, Martin und Justus
          <br />
        </p>
      </div>
    </div>
  );
};

export default welcome;
