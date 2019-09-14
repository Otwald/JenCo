import React, { useState, useEffect } from 'react';

import Welcome from './Welcome';
import Account from './Account';
import RoundContainer from './RoundContainer';
import AdminContainer from './AdminContainer';
import AccountsLogin from './AccountsLogin';

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
            {props.tab === 'login' ? <AccountsLogin  onTabChange={props.onTabChange} /> : ''}
        </React.Fragment>
    )

}

export default mainContentContainer