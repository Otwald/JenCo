import { Meteor } from 'meteor/meteor';

import { withTracker } from 'meteor/react-meteor-data';

import Admin from './Admin';
import { users_account, event_settings, timeblock } from '../api/mongo_export';


export default AdminContainer = withTracker(() => {

    Meteor.subscribe('user_account_admin', Meteor.userId());
    Meteor.subscribe('event_settings_admin', Meteor.userId());
    Meteor.subscribe('users_archive', Meteor.userId());
    Meteor.subscribe('timeblock');
    return {
        users : users_account.find().fetch(),
        event : event_settings.findOne(),
        timeblock: timeblock.find().fetch(),
    }
})(Admin);