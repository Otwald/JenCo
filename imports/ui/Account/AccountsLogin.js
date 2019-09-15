import React, { useState } from 'react';
import { Accounts } from 'meteor/accounts-base'
import { Meteor } from 'meteor/meteor';

import Login from './Login';
import Regist from './Regist';


const accountslogin = props => {

    const [regi, setRegi] = useState(false);

    /**
     * small Handler to switch between Login and Register Tab
     * @param {Boolean} data holds a Boolean to set the state regi
     */
    function handlerRegi(data) {
        setRegi(data)
    }
    console.log(regi)
    return (
        <React.Fragment>
            {regi ? <Regist onTabChange={props.onTabChange} handlerRegi={handlerRegi} /> : <Login onTabChange={props.onTabChange} handlerRegi={handlerRegi} />}
        </React.Fragment>

    )
}

export default accountslogin;