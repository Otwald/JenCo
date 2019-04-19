import React from 'react';
import {Meteor} from 'meteor/meteor';
import {render} from 'react-dom'

import './../../client/main';

import Titlebar from './Titlebar';
import Sidebar from './Sidebar';
import MainContentContainer from './MainContentContainer';

export default class App extends React.Component{
    constructor(props){
        super(props)

        this.state = {
            tab : null,
        }
    }
        
    onTabChange=(data)=>{
        this.setState({tab : data})
    }

    render(){

        const { tab} = this.state
        console.log(tab)
        return(
            <div>
                <Titlebar label="JenCo Titlebar" />
                <Sidebar tab={tab} onTabChange={this.onTabChange}/>
                <MainContentContainer tab={tab}/>
            </div>
        )
    }
}


Meteor.startup(() => {
    render(<App />, document.getElementById('app'));
  });



