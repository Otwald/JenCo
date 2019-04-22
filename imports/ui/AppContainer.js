import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom'
import { withTracker } from 'meteor/react-meteor-data';

import {users_account} from './../api/mongo_export';

import App from './App';

export default AppContainer = withTracker(() => {

    const loginToken = Meteor.userId()
    Meteor.subscribe('users_account', loginToken);
    return {
        loginToken,
        user : users_account.findOne({_id : loginToken})
    }
})(App)


Meteor.startup(() => {
    render(<AppContainer />, document.getElementById('app'));
});