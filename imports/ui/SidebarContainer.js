import React from 'react';
import Meteor from 'meteor/meteor';
import {withTracker} from 'meteor/react-meteor-data';

import Sidebar from './Sidebar';

export default SidebarContaiener = withTracker(()=>{
    if(Meteor.userId()){
        const loginToken = Meteor.userId()
    }
    return {
        loginToken
    }
})(Sidebar)