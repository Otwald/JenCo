import React from 'react';

const dataprivacy = props => {
    return (
        <div className='row'>
            <div className='col-sm'>
                Wir, der Websitebetreiber bzw.Seitenprovider,<br />
                erheben aufgrund unseres berechtigten Interesses(s.Art. 6 Abs. 1 lit.f.DSGVO) <br />
                Daten über Zugriffe auf die Website und speichern diese als “Server - Logfiles” <br />
                auf dem Server der Website ab.Folgende Daten werden so protokolliert:<br />
                <ul><br />
                    <li>Besuchte Website</li>
                    <li>Uhrzeit zum Zeitpunkt des Zugriffes</li>
                    <li>Menge der gesendeten Daten in Byte</li>
                    <li>Quelle / Verweis, von welchem Sie auf die Seite gelangten</li>
                    <li>Verwendeter Browser</li>
                    <li>Verwendetes Betriebssystem</li>
                    <li>Verwendete IP - Adresse</li>
                    <br />
                </ul>
                Die Server - Logfiles werden für maximal 7 Tage gespeichert und anschließend gelöscht.<br />
                Die Speicherung der Daten erfolgt aus Sicherheitsgründen, um z.B.Missbrauchsfälle aufklären zu können.<br />
                Müssen Daten aus Beweisgründen aufgehoben werden, sind sie solange von der Löschung ausgenommen bis der Vorfall endgültig geklärt ist.<br />
            </div>
        </div>
    );
};

export default dataprivacy;