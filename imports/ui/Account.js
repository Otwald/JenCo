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
    const [edit, setEdit] = useState(false);

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
        setEdit(false)
    }

    let bill = 'Noch kein Zahlungseingang'
    if (props.user) {
        bill = props.user.bill ? 'Zahlungseingang ist bestätigt' : 'Noch kein Zahlungseingang'
    }
    return (
        <div className="text-center">
            <div className="row">
                <div className="col-sm-12">
                    Account Content

                        {edit ?
                        <form>
                            <div className='form-row'>
                                <div className='form-group col-sm-4'>
                                    <label for='profil' className='col-sm-4'>Profil Name</label>
                                    <input type='text' className='form-control' name='profil' onChange={this.onInput} placeholder={account.profil} id='profil' />
                                </div>
                                <div className='form-group col-sm-4'>
                                    <label for='first' className='col-sm-4'>Vorname</label>
                                    <input type='text' className='form-control' name='first' onChange={this.onInput} placeholder={account.first} id='first' />

                                </div>
                                <div className='form-group col-sm-4'>
                                    <label for='last' className='col-sm-4'>Nachname</label>


                                    <input type='text' className='form-control' name='last' onChange={this.onInput} placeholder={account.last} id='last' />
                                </div>
                            </div>
                            <div className='form-row justify-content-center'>
                                <div className='form-group'>
                                    <label for='age'>Alter</label>
                                    <input type='date' name='age' className='form-control' id='age' onChange={onInput} />
                                </div>

                            </div>
                            <div className='form-row'>
                                <div className='form-group col-sm-6'>
                                    <button className='form-control' onClick={() => setEdit(false)} >Cancel</button>
                                </div>
                                <div className='form-group col-sm-6'>
                                    <button className='form-control' onClick={onSave} >Save</button>
                                </div>
                            </div>
                        </form>
                        :
                        <ul className="list-unstyled">
                            <li>Profil Name: {account.profil} </li>
                            <li>Vorname: {account.first} </li>
                            <li>Nachname: {account.last} </li>
                            <li>Alter:  {account.age}</li>
                            <li>{bill}</li>
                            <li><button onClick={() => setEdit(true)} >Edit</button></li>
                        </ul>
                    }
                </div>
            </div>
        </div >
    )
}


export default account;