import React, { useState, useEffect } from 'react';
import { Meteor } from 'meteor/meteor';

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
                    {edit ?
                        <form>
                            <div className='form-row justify-content-center'>
                                <div className='form-group col-sm-3'>
                                    <label for='profil'>Profil Name</label>
                                    <input type='text' className='form-control' name='profil' onChange={this.onInput} placeholder={account.profil} id='profil' />
                                </div>
                            </div>
                            <div className='form-row justify-content-center'>
                                <div className='form-group col-sm-3'>
                                    <label for='first' >Vorname</label>
                                    <input type='text' className='form-control' name='first' onChange={this.onInput} placeholder={account.first} id='first' />

                                </div>
                                <div className='form-group col-sm-3'>
                                    <label for='last' >Nachname</label>


                                    <input type='text' className='form-control' name='last' onChange={this.onInput} placeholder={account.last} id='last' />
                                </div>
                            </div>
                            <div className='form-row justify-content-center'>
                                <div className='form-group col-sm-3'>
                                    <label for='age'>Alter</label>
                                    <input type='date' name='age' className='form-control' id='age' onChange={onInput} />
                                </div>

                            </div>
                            <div className='form-row justify-content-center'>
                                <div className='form-group col-sm-3'>
                                    <button className='btn btn-outline-dark' onClick={() => setEdit(false)} >Cancel</button>
                                </div>
                                <div className='form-group col-sm-3'>
                                    <button className='btn btn-outline-dark' onClick={onSave} >Save</button>
                                </div>
                            </div>
                        </form>
                        :
                        <div className='row justify-content-center'>
                            <div className="card">
                                <div className="card-body">
                                    <h5 className='card-title'>Profil Name</h5>
                                    <p className='text-muted'>{account.profil}</p>
                                    <h5 className='card-title'>Vorname</h5>
                                    <p className='text-muted'>{account.first}</p>
                                    <h5 className='card-title'>Nachname</h5>
                                    <p className='text-muted'>{account.last} </p>
                                    <h5 className='card-title'>Alter</h5>  
                                    <p className='text-muted'>{new Date(account.age).toDateString()}</p>
                                    <h5 className='card-title'>{bill}</h5>
                                    <button className='btn btn-outline-dark' onClick={() => setEdit(true)} >Edit</button>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div >
    )
}


export default account;