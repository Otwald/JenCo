import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom'

import './../../client/main';

import Titlebar from './Titlebar';
import SidebarContainer from './SidebarContainer';
import MainContentContainer from './MainContentContainer';

export default class App extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            tab: 'welcome',
        }
    }

    onTabChange = (data) => {
        this.setState({ tab: data })
    }

    render() {
        const { tab} = this.state
        return (
            <div>
                <Titlebar label="JenCo Titlebar" />
                <SidebarContainer onTabChange={this.onTabChange} />
                <MainContentContainer tab={tab} />
            </div>
        )
    }
}


Meteor.startup(() => {
    render(<App />, document.getElementById('app'));
});



