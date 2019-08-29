import React, { useState } from 'react';
import { Accounts } from 'meteor/accounts-base'
import { Meteor } from 'meteor/meteor';


const accountslogin = props => {

    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    console.log(Meteor.user())
    console.log(Meteor.userId())
    function onLogin() {
        Meteor.loginWithPassword(user, password, (err, resp) => {
            console.log(err);
            console.log(resp);
            if (!err) {
                props.onTabChange('account')
            }
        })
    }

    return (
        <React.Fragment>
            {Meteor.userId()}
            <input type='text' onChange={() => setUser(event.target.value)} />
            <input type='password' onChange={() => setPassword(event.target.value)} />
            <button onClick={() => onLogin()} >Press Me</button>
        </React.Fragment>
    )
}

export default accountslogin;