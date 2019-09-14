import { Meteor } from 'meteor/meteor';

import { withTracker } from 'meteor/react-meteor-data';

import RoundComponent from './Round';
import { Rounds, event_settings, timeblock } from '../api/mongo_export';

export default RoundContainer = withTracker(() => {
    Meteor.subscribe('timeblock_table');
    Meteor.subscribe('event_settings_round');
    return {
        time_block : timeblock.find().fetch()
    }
})(RoundComponent)