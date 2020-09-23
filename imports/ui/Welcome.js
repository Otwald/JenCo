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
          Hallo zusammen, <br />
          <br />
          nach einer gründlichen, orgainternen Diskussion und Rücksprache mit
          dem Jugendclub Hugo haben wir uns entschieden, unsere Con dieses Jahr
          online stattfinden zu lassen. Dieser Schritt ist uns nicht leicht
          gefallen und wir entschuldigen uns in aller Form für die
          Kurzfristigkeit des Ganzen und eventuellen Umstände die euch daraus
          entstehen – aber in Anbetracht der gegenwärtig wieder rapide
          steigenden Fallzahlen, ist dies die einzige verantwortungsbewusste
          Vorgehensweise für uns. Wir bitten dafür um Verständnis, es ist leider
          ein eigenartiges Jahr für alle. <br />
          <br />
          Gut, so viel dazu, wie geht es jetzt weiter?
          <br />
          <br />
          <strong>1. Teilnahmegebühren</strong> <br />
          <br /> Da die Geländemiete entfällt, ist das diesjährige Online-Event
          kostenlos. Bereits bezahlte Beiträge werden wir bis Ende der kommenden
          Woche zurück überweisen. Wer das Geld bar übergeben hat, kann uns
          entweder seine Kontodaten schicken oder bei Gelegenheit Bargeld zurück
          erhalten.
          <br />
          <br /> <strong> 2. Unsere Con auf Discord</strong> <br />
          <br /> Wir haben für unser Event einen Discordserver eingerichtet.
          Dieser Onlinedienst erfordert von euch eine Anmeldung, bietet dafür
          aber eine Menge Möglichkeiten. Über den untenstehenden Link kommt ihr
          direkt zu unserem Server – sobald ihr dort registriert seit, habt ihr
          euch für die Veranstaltung angemeldet. Nehmt Kontakt mit uns auf (per
          Mail oder bei Otwald auf Discord) wenn ihr eine Runde leiten wollt und
          wir schalten euch als Spielleiter mit dazugehörigen Rechten frei. Wenn
          ihr möchtet, könnt ihr gerne auf weitere Onlinespielhilfen – wie etwa
          Roll20 – zurückgreifen. Wir machen euch da keine Vorgaben, ihr müsst
          es nur entsprechend ankündigen (unter „Runden-Vorstellungen“) und
          selbst verwalten. <br />
          <br />
          <a href="https://discord.gg/zb4cgtC">
            https://discord.gg/zb4cgtC
          </a>  <br /> <br /> An den Eckdaten der Veranstaltung ändert sich
          generell wenig. Wir beginnen voraussichtlich um 9 Uhr am Samstag dem
          3.10. und spielen bis keiner mehr Lust hat. Ob bereits angemeldete
          Runden weiterhin stattfinden, hängt natürlich an den jeweiligen
          Spielleitern. Entsprechende Infos findet ihr auf Discord – unter
          „Runden-Vorstellungen“ – und auf dieser Website.
          <br /> <br /> <strong> 3. Weitere Aussichten</strong> <br /> <br />
          Wir hoffen natürlich sehr, dass sich die Lage bald wieder entspannt.
          Mit dem Hugo stehen wir weiterhin in Kontakt und dementsprechend
          werden wir uns im kommenden Jahr erneut bemühen, eine klassische
          PnP-Con auszurichten. Wir halten euch auf dem Laufenden!
          <br /> <br />
          So viel erst mal von uns
          <br /> Mit freundlichen Grüßen
          <br /> Anne, Daniel, Martin und Justus
        </p>
      </div>
    </div>
  );
};

export default welcome;
