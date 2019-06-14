import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Button, Menu } from 'semantic-ui-react';

import AccountsUI from './AccountsUI'

const sidebar = props => {
    onClickButton = (data) => {
        props.onTabChange(data)
    }


    let login = ''
    let admin = ''
    if (Meteor.userId()) {
        login = <li className="nav-item py-0">
            <div className={props.tab === 'account' ? `nav-link active` : "nav-link"}>
                <button primary onClick={() => this.onClickButton('account')}>Account</button>
            </div>
        </li>
        admin = <li className="nav-item py-0">
            <div className={props.tab === 'admin' ? `nav-link active` : "nav-link"}>
                <button primary onClick={() => this.onClickButton('admin')}>Admin</button>
            </div>
        </li>
    }

    return (
        <ul className="nav nav-fill nav-tabs justify-content-center">
            <li className="nav-item py-0">
                <div className={props.tab === 'welcome' ? `nav-link active` : "nav-link"}>
                    <button primary onClick={() => this.onClickButton('welcome')} >Willkommen</button>

                </div>
            </li>
            <li className="nav-item py-0">
                <div className={props.tab === 'round' ? `nav-link active` : "nav-link"}>
                    <button primary onClick={() => this.onClickButton('round')} >Spielerunde</button>
                </div>
            </li>
            {login}
            {admin}
            <li className="nav-item py-0">
                <AccountsUI />
            </li>
        </ul>
    )
}

export default sidebar