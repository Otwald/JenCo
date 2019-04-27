import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom'

import './../../client/main';

import Titlebar from './Titlebar';
import Sidebar from './Sidebar';
import MainContentContainer from './MainContentContainer';

export default class App extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            tab: 'round',
        }
    }

    onTabChange = (data) => {
        this.setState({ tab: data })
    }

    render() {
        const { tab } = this.state
        const { loginToken ,user } = this.props
        return (
            <div>
                <Titlebar label="Deathcon Slaughterhaus 666 oder Papierkrieger Titlebar" />
                <Sidebar onTabChange={this.onTabChange} loginToken={loginToken} />
                <MainContentContainer tab={tab} user={user} loginToken={loginToken} />
            </div>
        )
    }
}





