import React from 'react';
import Meteor from 'meteor/meteor';
import {withTracker} from 'meteor/react-meteor-data';

import Sidebar from './Sidebar';

export default SidebarContaiener = withTracker(()=>{
 
        const loginToken = Meteor.Meteor.userId()
    return {
        loginToken
    }
})(Sidebar)