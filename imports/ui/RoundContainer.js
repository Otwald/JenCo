import { Meteor } from 'meteor/meteor';

import { withTracker } from 'meteor/react-meteor-data';

import Round from './Round';
import { Rounds, event_settings, timeblock } from '../api/mongo_export';

export default RoundContainer = withTracker(() => {
    const connection = Meteor.subscribe('rounds');
    Meteor.subscribe('timeblock_table');
    Meteor.subscribe('event_settings_round');
    const loading = connection.ready();
    let rounds_box = Rounds.find().fetch();
    return {
        loading,
        rounds_box,
        event: event_settings.findOne(),
        timeblock : timeblock.find().fetch()
    }
})(Round)