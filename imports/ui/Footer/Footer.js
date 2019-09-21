import React, { useState } from 'react';



const footer = props => {
    return (
        <footer>
            <div className="footer-container">
                {/* <div className="footer-logo">
          <img src="brand" alt="logo"/>
                </div> */}
                <div className="footer-row">
                    <h5>Project JenCo</h5>
                    <ul>
                        <li><a onClick={() => props.onTabChange('dataprivacy')}>Datenschutz </a></li>
                        {/* <li><a href="/agb">AGB</a></li> */}
                        <li><a onClick={() => props.onTabChange('impressum')}>Impressum</a></li>
                    </ul>
                </div>
                {/* <div className="footer-row">
                    <h3>Kontakt</h3>
                    <ul>
                        <li><a href="/kontakt">Kontaktformular</a></li>
                        <li><a href="#"></a></li>
                    </ul>
                </div> */}
            </div>
            {/* <div className="footer-container">
                <div className="text-left">
                    <p><small>2019</small></p>
                </div>
            </div> */}
        </footer>
    );
}

export default footer;