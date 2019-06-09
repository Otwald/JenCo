import React, { useState, useEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import { Dropdown } from 'semantic-ui-react';

import { users_account } from './../api/mongo_export';

const account = props => {

    const [account, setAccount] = useState({
        profil: "",
        first: "",
        last: "",
        age: null,
    });

    useEffect(() => {
        if (props.user) {
            setAccount({
                profil: props.user.profil,
                first: props.user.first,
                last: props.user.last,
                age: props.user.age,
            });
        }
    }, [props.user])

    onInput = (e) => {
        let temp = account
        let value = e.target.value
        temp[e.target.name] = value
        setAccount(temp)
    }

    timeCount = (min, max) => {
        let out = [];
        while (max >= min) {
            let item = { key: max, text: max, value: max }
            out.push(item)
            max--
        }
        return out
    }

    onSave = () => {
        const data = account
        let check = true;
        if (data.profil.length === 0) {
            check = false;
        }
        if (data.first.length === 0) {
            check = false;
        }
        if (data.last.length === 0) {
            check = false;
        }
        data.age = new Date(data.age).getTime();
        if (check) {
            if (props.user) {
                Meteor.call('AccountUpdate', data)
            } else {
                Meteor.call('AccountCreate', data)
            }
        }
    }

    let bill = 'Noch kein Zahlungseingang'
    if (props.user) {
        bill = props.user.bill ? 'Zahlungseingang ist bestätigt' : 'Noch kein Zahlungseingang'
    }
    return (
        <div className="text-center">
            <div className="row">
                <div className="col-sm-12">
                    <ul className="list-unstyled">
                        Account Content
                        <li>Profil Name<input type='text' name='profil' onChange={this.onInput} placeholder={account.profil} /></li>
                        <li>Vorname<input type='text' name='first' onChange={this.onInput} placeholder={account.first} /></li>
                        <li>Nachname<input type='text' name='last' onChange={this.onInput} placeholder={account.last} /></li>
                        <li>Alter<input type='date' name='age' onChange={onInput} /></li>
                        <li>{bill}</li>
                        <li><button onClick={this.onSave} >Save</button></li>
                    </ul>
                </div>
            </div>
        </div >
    )
}


export default account;