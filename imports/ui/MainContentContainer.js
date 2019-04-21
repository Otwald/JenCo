import React from 'react';

import Welcome from './Welcome';
import Account from './Account';
import RoundContainer from './RoundContainer';

export default class MainContentContainer extends React.Component {

    render() {
        const { tab , loginToken} = this.props
        return (
            <div>
                {tab === 'welcome' ? <Welcome /> : ''}
                {tab === 'round' ? <RoundContainer loginToken={loginToken}/> : ''}
                {tab === 'account' ? <Account /> : ''}


            </div>
        )
    }
}