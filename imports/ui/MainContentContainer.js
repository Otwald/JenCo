import React from 'react';

import Welcome from './Welcome';
import Account from './Account';
import Round from './Round';

export default class MainContentContainer extends React.Component {

    render() {
        const { tab , loginToken} = this.props
        return (
            <div>
                {tab === 'welcome' ? <Welcome /> : ''}
                {tab === 'round' ? <Round loginToken={loginToken}/> : ''}
                {tab === 'account' ? <Account /> : ''}


            </div>
        )
    }
}