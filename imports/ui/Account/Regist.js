import React, { useState } from 'react';
import { Accounts } from 'meteor/accounts-base'
import { Meteor } from 'meteor/meteor';


const regist = props => {

    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const [fail, setFail] = useState(false);
    const [confirmpassword, setConPW] = useState(true);
    const [error, setError] = useState('')

    /**
     * sendes an Request to the Server to add a new User
     * Password will be Encrypted from the Accounts package,
     * user will be added to the users Collection
     * 
     * @param {String} user is the users state and should be filled with a string in the email format
     * @param {String} password is state should hold the password with at least 6 character
     * @param {String} confirmpassword is a state that holds the password with at least 6 charakter is used to confirm the password
     */
    function onRegi() {

        if (confirmpassword === password) {
            Accounts.createUser(
                {
                    email: user,
                    password: password,
                    profile: {
                        profil: '',
                        first: '',
                        last: '',
                        age: 0,
                        bill: false
                    }
                },
                (err) => {
                    if (!err) {
                        setFail(false);
                        props.onTabChange('account')
                    } else {
                        setFail(true);
                        setError('Nutzer schon vorhanden')
                    }
                })
        } else {
            setFail(true);
            setError('Passwörter sind nicht identisch')
        }
    }

    return (
        <div className="row">
            <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
                <div className="card card-signin my-5">
                    <div className="card-body">
                        <h5 className="card-title text-center">Regestrierung</h5>
                        <form className="form-signin" onSubmit={() => { onRegi(); event.preventDefault() }}>
                            <div className="form-label-group">
                                <input type="email" onChange={() => setUser(event.target.value)} id="inputEmail" className="form-control" placeholder="Email address" required autoFocus />
                                <label htmlFor="inputEmail">Email-Address</label>
                            </div>

                            <div className="form-label-group">
                                <input type="password" onChange={() => setPassword(event.target.value)} minLength='6' id="inputPassword" className="form-control" placeholder="Password" required />
                                <label htmlFor="inputPassword">Passwort</label>
                            </div>
                            <div className="form-label-group">
                                <input type="password" onChange={() => setConPW(event.target.value)} minLength='6' id="inputPasswordconfirm" className="form-control" placeholder="Password" required />
                                <label htmlFor="inputPasswordconfirm">Passwort wiederholen</label>
                            </div>
                            <button className="btn btn-lg btn-primary btn-block text-uppercase" type="submit">Registieren</button>
                            {fail ?
                                <div>
                                    {error}
                                </div>
                                : ''}
                        </form>
                        <hr />
                        <div className='text-muted'>
                            Account vorhanden?<br />
                            <div onClick={() => props.handlerRegi(false)}>Zur Anmeldung</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default regist;