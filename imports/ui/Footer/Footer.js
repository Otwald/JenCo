import React, { useState } from 'react';



const footer = props => {
    return (
        <footer className='footer py-4'>
            <div className="footer-container">
                <a onClick={() => props.onTabChange('dataprivacy')}>Datenschutz  </a>
            </div>
            <div className="footer-container">
                <a onClick={() => props.onTabChange('impressum')}>Impressum</a>
            </div>
        </footer>
    );
}

export default footer;