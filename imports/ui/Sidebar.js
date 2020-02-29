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
            <div className={props.tab === 'account' ? `nav-link active` : "nav-link"} onClick={() => props.onTabChange('account')}>
                <button className='button' onClick={() => props.onTabChange('account')}>
                    <i className='user_icon'></i><span className="d-none d-md-block">Account</span>
                </button>
            </div>
        </li>
        if (admin) {
            adminInterface = <li className="nav-item py-0">
                <div className={props.tab === 'admin' ? `nav-link active` : "nav-link"} onClick={() => props.onTabChange('admin')}>
                    <button className='button' onClick={() => props.onTabChange('admin')}>Admin</button>
                </div>
            </li>
        }
    }

    return (
        <ul className="nav nav-fill nav-tabs justify-content-center nav-bar">
            <li className="nav-item py-0">
                <div className={props.tab === 'welcome' ? `nav-link active` : "nav-link"} onClick={() => props.onTabChange('welcome')}>
                    <button className='button' >
                        <i className='home_icon'></i><span className="d-none d-md-block">Willkommen</span>
                    </button>

                </div>
            </li>
            <li className="nav-item py-0">
                <div className={props.tab === 'round' ? `nav-link active` : "nav-link"} onClick={() => props.onTabChange('round')}>
                    <button className='button'  >
                        <i className='box_icon'></i><span className="d-none d-sm-block">Spielerunde</span>
                    </button>
                </div>
            </li>
            {login}
            {adminInterface}
            {Meteor.userId() != null ?
                <li className="nav-item py-0">
                    <div className={props.tab === 'login' ? `nav-link active` : "nav-link"} onClick={() => { Meteor.logout(); props.onTabChange('welcome') }}>
                        <button className='button'>
                            <i className='key_icon'></i><span className="d-none d-sm-block">Abmeldung</span>
                        </button>
                    </div>
                </li>
                :
                <li className="nav-item py-0">
                    <div className={props.tab === 'login' ? `nav-link active` : "nav-link"} onClick={() => props.onTabChange('login')} >
                        <button className='button' >
                            <i className='key_icon'></i><span className="d-none d-sm-block">Anmeldung</span>
                        </button>
                    </div>
                </li>
            }
        </ul>
    )
}

export default sidebar