import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom'
import { withTracker } from 'meteor/react-meteor-data';

import { users_account } from './../api/mongo_export';

import App from './App';

export default AppContainer = withTracker(() => {

    Meteor.subscribe('users_account', Meteor.userId());
    return {
        user: users_account.findOne({ _id: Meteor.userId() })
    }
})(App)


Meteor.startup(() => {
    render(<AppContainer />, document.getElementById('app'));
});