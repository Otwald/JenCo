import React, { useState } from 'react';

import Welcome from './Welcome';
import Account from './Account';
import RoundContainer from './RoundContainer';
import AdminContainer from './AdminContainer';

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
            {props.tab === 'welcome' ? <Welcome /> : ''}
            {props.tab === 'round' ? <RoundContainer user={props.user} in_round={in_round} onCallback={this.onCallback} /> : ''}
            {props.tab === 'account' ? <Account user={props.user} /> : ''}
            {props.tab === 'admin' ? <AdminContainer /> : ''}
        </React.Fragment>
    )
 
}

export default mainContentContainer