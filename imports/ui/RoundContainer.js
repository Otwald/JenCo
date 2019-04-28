import { Meteor } from 'meteor/meteor';

import { withTracker } from 'meteor/react-meteor-data';

import Round from './Round';
import { Rounds, event_settings } from '../api/mongo_export';

export default RoundContainer = withTracker(() => {
    const connection = Meteor.subscribe('rounds');
    Meteor.subscribe('event_settings_round');
    const loading = connection.ready();
    var rounds_box = Rounds.find().fetch();
    return {
        loading,
        rounds_box,
        event: event_settings.findOne()
    }
})(Round)