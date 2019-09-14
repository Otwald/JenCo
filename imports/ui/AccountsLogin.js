import React, { useState } from 'react';
import { Accounts } from 'meteor/accounts-base'
import { Meteor } from 'meteor/meteor';


const accountslogin = props => {

    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    console.log(Meteor.user())
    console.log(Meteor.userId())

    /**
     * handler that holds the Meteor Call to loginWithPassword
     * changes Tab to Account when Login Succesfull
     * 
     * @param {String} user is state that should hold email adress Format
     * @param {String} password is stat that holds the user input password in clear 
     */
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
        <div className="row">
            <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
                <div className="card card-signin my-5">
                    <div className="card-body">
                        <h5 className="card-title text-center">Anmeldung</h5>
                        <form className="form-signin" onSubmit={() => onLogin()}>
                            <div className="form-label-group">
                                <input type="email" onChange={() => setUser(event.target.value)} id="inputEmail" className="form-control" placeholder="Email address" required autoFocus />
                                <label htmlFor="inputEmail">Email-Address</label>
                            </div>

                            <div className="form-label-group">
                                <input type="password" onChange={() => setPassword(event.target.value)} id="inputPassword" className="form-control" placeholder="Password" required />
                                <label htmlFor="inputPassword">Passwort</label>
                            </div>
                            <button className="btn btn-lg btn-primary btn-block text-uppercase" type="submit">Einloggen</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default accountslogin;