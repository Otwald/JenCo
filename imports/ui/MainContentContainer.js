import React from 'react';

import Welcome from './Welcome';
import Account from './Account';

export default class MainContentContainer extends React.Component{

    render(){
        const {tab} = this.props
        return(
            <div>
                {tab === 'welcome' ? <Welcome /> : ''}
                {tab === 'account' ? <Account /> : ''}

                
            </div>
        )
    }
}