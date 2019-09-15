import React, { useState, useEffect } from 'react';
import { Meteor } from 'meteor/meteor';

import useDate from '../Helper';

const account = props => {

    const [profil, setProfil] = useState('');
    const [first, setFirst] = useState('');
    const [last, setLast] = useState('');
    const [age, setAge] = useState();
    const [edit, setEdit] = useState(false);

    useEffect(() => {
        console.log(props.user)
        if (props.user) {
            updateParams();
        }
    }, [props.user])

    // maybe useless
    // timeCount = (min, max) => {
    //     let out = [];
    //     while (max >= min) {
    //         let item = { key: max, text: max, value: max }
    //         out.push(item)
    //         max--
    //     }
    //     return out
    // }

    /**
     * sets the States to the Database Values, for the Edit part
     * @param {Object} props.user. already loaded user Props
     */
    function updateParams() {
        if (props.user) {
            setProfil(props.user.profile.profil);
            setFirst(props.user.profile.first);
            setLast(props.user.profile.last);
            setAge(props.user.profile.age)
        }
    }

    onSave = () => {
        event.preventDefault()
        const data = {
            profil: profil,
            first: first,
            last: last,
            age: age,
        }
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
        bill = props.user.profile.bill ? 'Zahlungseingang ist bestätigt' : 'Noch kein Zahlungseingang'
    }
    return (
        <div className="text-center">
            <div className="row">
                <div className="col-sm-12">
                    {edit ?
                        <form className='was-validated'>
                            <div className='form-row justify-content-center'>
                                <div className='form-group col-sm-3'>
                                    <label>Profil Name</label>
                                    <input required minLength='2' maxLength='32' type='text' className='form-control' name='profil' onChange={() => setProfil(event.target.value)} placeholder={profil} id='profil' value={profil} />
                                </div>
                            </div>
                            <div className='form-row justify-content-center'>
                                <div className='form-group col-sm-3'>
                                    <label >Vorname</label>
                                    <input required minLength='2' maxLength='32' type='text' className='form-control' name='first' onChange={() => setFirst(event.target.value)} placeholder={first} id='first' value={first} />
                                </div>
                                <div className='form-group col-sm-3'>
                                    <label >Nachname</label>
                                    <input required minLength='2' maxLength='32' type='text' className='form-control' name='last' onChange={() => setLast(event.target.value)} placeholder={last} id='last' value={last} />
                                </div>
                            </div>
                            <div className='form-row justify-content-center'>
                                <div className='form-group col-sm-3'>
                                    <label >Alter</label>
                                    <input required type='date' name='age' className='form-control' id='age' onChange={() => setAge(event.target.value)} value={useDate(age)} />
                                </div>

                            </div>
                            <div className='form-row justify-content-center'>
                                <div className='form-group col-sm-3'>
                                    <button className='btn btn-outline-dark' onClick={() => { setEdit(false); event.preventDefault() }} >Cancel</button>
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
                                    {props.user ?
                                        <React.Fragment>
                                            <h5 className='card-title'>Profil Name</h5>
                                            <p className='text-muted'>{props.user.profile.profil}</p>
                                            <h5 className='card-title'>Vorname</h5>
                                            <p className='text-muted'>{props.user.profile.first}</p>
                                            <h5 className='card-title'>Nachname</h5>
                                            <p className='text-muted'>{props.user.profile.last} </p>
                                            <h5 className='card-title'>Alter</h5>
                                            <p className='text-muted'>{new Date(props.user.profile.age).toDateString()}</p>
                                            <h5 className='card-title'>{bill}</h5>
                                        </React.Fragment>
                                        : ''}

                                    <button className='btn btn-outline-dark' onClick={() => { setEdit(true); updateParams() }} >Edit</button>
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