import React, { useState, useEffect } from 'react';
import { Meteor } from 'meteor/meteor';

import AccountsUI from './AccountsUI'

const sidebar = props => {

    const [admin, setAdmin] = useState(false);

    useEffect(() => {
        Meteor.call('AdminCheck', (err, resp) => {
            setAdmin(resp);
        })
    }, [])

    let login = ''
    let adminInterface = ''
    if (Meteor.userId()) {
        login = <li className="nav-item py-0">
            <div className={props.tab === 'account' ? `nav-link active` : "nav-link"}>
                <button className='button' onClick={() => props.onTabChange('account')}>Account</button>
            </div>
        </li>
        if (admin) {
            adminInterface = <li className="nav-item py-0">
                <div className={props.tab === 'admin' ? `nav-link active` : "nav-link"}>
                    <button className='button' onClick={() => props.onTabChange('admin')}>Admin</button>
                </div>
            </li>
        }
    }

    return (
        <ul className="nav nav-fill nav-tabs justify-content-center">
            <li className="nav-item py-0">
                <div className={props.tab === 'welcome' ? `nav-link active` : "nav-link"}>
                    <button className='button' onClick={() => props.onTabChange('welcome')} >Willkommen</button>

                </div>
            </li>
            <li className="nav-item py-0">
                <div className={props.tab === 'round' ? `nav-link active` : "nav-link"}>
                    <button className='button' onClick={() => props.onTabChange('round')} >Spielerunde</button>
                </div>
            </li>
            {login}
            {adminInterface}
            {/* <li className="nav-item py-0">
                <AccountsUI />
            </li> */}
            {Meteor.userId() != null ?
                <li className="nav-item py-0">
                    <div className={props.tab === 'login' ? `nav-link active` : "nav-link"}>
                        <button className='button' onClick={() => { Meteor.logout(); props.onTabChange('welcome') }} >Abmeldung</button>
                    </div>
                </li>
                :
                <li className="nav-item py-0">
                    <div className={props.tab === 'login' ? `nav-link active` : "nav-link"}>
                        <button className='button' onClick={() => props.onTabChange('login')} >Anmeldung</button>
                    </div>
                </li>
            }
        </ul>
    )
}

export default sidebar