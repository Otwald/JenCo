import React from 'react';
import  Meteor  from 'meteor/meteor';
import { render } from 'react-dom'
import {withTracker} from 'meteor/react-meteor-data';

import App from './App';

export default AppContainer = withTracker(()=>{
 
        const loginToken = Meteor.Meteor.userId()
    return {
        loginToken
    }
})(App)


Meteor.Meteor.startup(() => {
    render(<AppContainer />, document.getElementById('app'));
});