import React from 'react';
import {Meteor} from 'meteor/meteor';
import {render} from 'react-dom'

import './../../client/main';

import Titlebar from './Titlebar';
import Sidebar from './Sidebar';

export default class App extends React.Component{
    render(){
        return(
            <div>
                <Titlebar label="JenCo Titlebar" />
                <Sidebar />
            </div>
        )
    }
}


Meteor.startup(() => {
    render(<App />, document.getElementById('app'));
  });



