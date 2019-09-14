import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom'
import { withTracker } from 'meteor/react-meteor-data';

import { users_account, event_settings } from './../api/mongo_export';

import App from './App';

export default AppContainer = withTracker(() => {

    Meteor.subscribe('users_account', Meteor.userId());
    Meteor.subscribe('event_settings', Meteor.userId());
    return {
        event: event_settings.findOne({}),
        user: users_account.findOne({ _id: Meteor.userId() })
    }
})(App)


Meteor.startup(() => {
    render(<AppContainer />, document.getElementById('app'));
});