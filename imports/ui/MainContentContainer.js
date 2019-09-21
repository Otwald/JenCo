import React, { useState, useEffect } from 'react';

import Welcome from './Welcome';
import Account from './Account/Account';
import RoundContainer from './RoundContainer';
import AdminContainer from './Admin/AdminContainer';
import AccountsLogin from './Account/AccountsLogin';
import Impressum from './Footer/Impressum';
import Dataprivacy from './Footer/Dataprivacy';

const mainContentContainer = props => {
    // state = { in_round: [], }

    const [in_round, setIn_Round] = useState([]);

    //sets props for timeblocks where user has already joined a table or created
    onCallback = (data) => {
        let temp = in_round
        temp[data['key']] = data.value;
        setIn_Round(temp)

    }

    return (
        <React.Fragment>
            {props.tab === 'welcome' ? <Welcome event={props.event} /> : ''}
            {props.tab === 'round' ? <RoundContainer user={props.user} in_round={in_round} onCallback={this.onCallback} /> : ''}
            {props.tab === 'account' ? <Account user={props.user} /> : ''}
            {props.tab === 'admin' ? <AdminContainer /> : ''}
            {props.tab === 'login' ? <AccountsLogin onTabChange={props.onTabChange} /> : ''}
            {props.tab === 'impressum' ? <Impressum /> : ''}
            {props.tab === 'dataprivacy' ? <Dataprivacy /> : ''}
        </React.Fragment>
    )

}

export default mainContentContainer