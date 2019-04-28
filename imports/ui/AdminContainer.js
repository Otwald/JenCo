import { Meteor } from 'meteor/meteor';

import { withTracker } from 'meteor/react-meteor-data';

import Admin from './Admin';

export default AdminContainer = withTracker(() => {

    Meteor.subscribe('user_account_admin')
    return {

    }
})(Admin);