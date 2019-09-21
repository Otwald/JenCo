import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom'

import './../../client/main';

import Titlebar from './Titlebar';
import Sidebar from './Sidebar';
import MainContentContainer from './MainContentContainer';
import Footer from './Footer/Footer';

export default class App extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            tab: 'welcome',
        }
    }
    onTabChange = (data) => {
        this.setState({ tab: data });
    }

    //todo, spielrunde, zeitblöccke signalisieren das mans anklicken kann
    //impressum
    //noch ein wenig design arbeit

    render() {
        const { tab } = this.state
        const { user, event } = this.props
        return (
            <React.Fragment>
                <div className='container'>
                    <Sidebar onTabChange={this.onTabChange} tab={tab} />
                    <MainContentContainer onTabChange={this.onTabChange} tab={tab} user={user} event={event} />
                </div>
                <Footer onTabChange={this.onTabChange} />
            </React.Fragment>
        )
    }
}