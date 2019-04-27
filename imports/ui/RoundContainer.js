import { Meteor } from 'meteor/meteor';

import { withTracker } from 'meteor/react-meteor-data';

import Round from './Round';
import { Rounds } from '../api/mongo_export';

export default RoundContainer = withTracker(() => {
    const connection = Meteor.subscribe('rounds');
    const loading = connection.ready();
    var rounds_box = Rounds.find().fetch()
    const origin_tb = [{ text: 'Früh', value: 'early' }, { text: 'Spät', value: 'later' }]
    return {
        loading,
        rounds_box,
        origin_tb
    }
})(Round)