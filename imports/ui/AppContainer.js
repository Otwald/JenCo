import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom'
import { withTracker } from 'meteor/react-meteor-data';

import { event_settings } from './../api/mongo_export';

import App from './App';

export default AppContainer = withTracker(() => {

    Meteor.subscribe('event_settings', Meteor.userId());
    return {
        event: event_settings.findOne({}),
        user: Meteor.users.findOne({})
    }
})(App)


Meteor.startup(() => {
    render(<AppContainer />, document.getElementById('app'));
});