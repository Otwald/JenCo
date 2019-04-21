import  {Meteor}  from 'meteor/meteor';

import {withTracker} from 'meteor/react-meteor-data';

import Round from './Round';
import { Rounds } from '../api/mongo_export';

export default RoundContainer = withTracker(()=>{
 
        Meteor.subscribe('Rounds');
    return {
        rounds : Rounds.find().fetch(),
    }
})(Round)