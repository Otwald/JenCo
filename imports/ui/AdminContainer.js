import { Meteor } from 'meteor/meteor';

import { withTracker } from 'meteor/react-meteor-data';

import Admin from './Admin';
import { event_settings, timeblock } from '../api/mongo_export';


export default AdminContainer = withTracker(() => {
    Meteor.subscribe('event_settings_admin', Meteor.userId());
    Meteor.subscribe('users_archive', Meteor.userId());
    Meteor.subscribe('timeblock');
    return {
        event: event_settings.findOne(),
        timeblock: timeblock.find().fetch(),
    }
})(Admin);