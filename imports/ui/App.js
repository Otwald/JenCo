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
            tab: 'login',
        }
    }

    onTabChange = (data) => {
        this.setState({ tab: data })
    }

    render() {
        const { tab } = this.state
        const { user, event } = this.props
        return (
            <div className="container">
                {/* <Titlebar label="Deathcon Slaughterhaus 666 oder Papierkrieger Titlebar" /> */}
                <Sidebar onTabChange={this.onTabChange} tab={tab} />
<<<<<<< HEAD
                <MainContentContainer  onTabChange={this.onTabChange} tab={tab} user={user} />
=======
                <MainContentContainer tab={tab} user={user} event={event} />
>>>>>>> master
            </div>
        )
    }
}