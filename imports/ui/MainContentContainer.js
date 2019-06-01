import React from 'react';

import Welcome from './Welcome';
import Account from './Account';
import RoundContainer from './RoundContainer';
import AdminContainer from './AdminContainer';

import 'semantic-ui-css/semantic.min.css'
export default class MainContentContainer extends React.Component {
    constructor(props) {
        super(props)
        this.state = { in_round: [], }
    }

    //sets props for timeblocks where user has already joined a table or created
    onCallback = (data) => {
        let temp = this.state.in_round
        temp[data['key']] = data.value;
        this.setState({ in_round: temp });
    }
    render() {
        const { tab, user } = this.props
        const { in_round } = this.state
        return (
            <div>
                {tab === 'welcome' ? <Welcome /> : ''}
                {tab === 'round' ? <RoundContainer user={user} in_round={in_round} onCallback={this.onCallback} /> : ''}
                {tab === 'account' ? <Account user={user}/> : ''}
                {tab === 'admin' ? <AdminContainer /> : ''}
            </div>
        )
    }
}