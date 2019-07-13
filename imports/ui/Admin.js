import React, { useState, useEffect } from 'react';
import { Button } from 'semantic-ui-react';

import AdminBlock from './AdminBlock';


const admin = props => {
    // capache abfragen für anmeldung

    // mail mit konto info beim account erstellen,
    const [settings, setSettings] = useState({
        e_end: null,
        e_loc: null,
        e_start: null,
        t_price: 0,
        e_price: 0
    });
    const [activeUser, setActiveUser] = useState(null);
    const [eventTab, setEventTab] = useState(false);
    const [userTab, setUserTab] = useState(false);
    const [tbTab, setTbTab] = useState(false);
    const [eventEdit, setEventEdit] = useState(false);
    const [eventPay, setEventPay] = useState(0);

    useEffect(() => {
        if (props.event) {
            setSettings(props.event)
        }
        if (props.users) {
            let money = 0
            props.users.map((v) => {
                if (v.bill) {
                    money = money + parseInt(props.t_price)
                    setEventPay(money);
                }
            })
        }
        return (() => {
            setSettings()
        })
    }, [props.event, props.users])
    // useEffect(() => {
    //     return (() => {
    //         setActivTab(activeTab)
    //     })
    // }, [activeTab])

    // for state update with event infos
    onInput = (e) => {
        let temp = settings
        temp[e.target.name] = e.target.value
        setSettings(temp)
    }

    //saves state.setting to mongo
    onSave = () => {
        if (props.event) {
            Meteor.call('EventUpdate', settings)
        } else {
            Meteor.call('EventCreate', settings)
        }
        setEventEdit(false)
    }

    // just translats booleans to words
    outPay = (data) => {
        if (data) {
            return 'hat bezahlt'
        } else {
            return 'nicht bezahlt'
        }

    }

    //switchey paystatus
    onClickUserSwith = data => {
    }

    //archives and destroys user accounts(!loginaccount)
    onClickUserDestroy = (data) => {
        Meteor.call('UserArchiveCreate', data)
        Meteor.call('AccountUpdate', data);
        Meteor.call('AccountDelete', data._id);
    }

    onClickUserConfirm = (data) => {
        // Client: Asynchronously send an email.
        data.email = 'handkrampf@mytrashmailer.com'
        Meteor.call(
            'sendEmail',
            data.email, (err, res) => {
                console.log(res);
            }
        );
    }

    //for user table
    mouseIn = (e) => {
        if (activeUser !== e.target.value) {
            setActiveUser(e.target.value);
        } else {
            setActiveUser(null)
        }

    }

    onTabChange = (e) => {
        let temp = activeTab;
        temp[e] = !temp[e];
        setActivTab(Object.assign(temp))
    }

    let user_block = '';
    if (props.users.length > 0) {
        props.users.sort((a, b) => (a.last > b.last) ? 1 : ((b.last > a.last) ? -1 : 0));
        user_block = props.users.map((key, value) => {
            // Namens Sortierung | Radial alle , bezahlt, nicht bezahlt | Minderjährige
            return (
                <li onClick={(e) => this.mouseIn(e)} key={'User' + value} value={value}>
                    {key.last} {this.outPay(key.bill)}
                    {value === activeUser ?
                        <ul>
                            <li>{key.first}</li>
                            <li>{key.last}</li>
                            <li>{key.profil}</li>
                            <li>{key.age}</li>
                            <li>{key.email}</li>
                            <li><Button onClick={(e) => Meteor.call('SwitchBill', key._id)} >Switch Pay</Button></li>
                            <li><Button onClick={(e) => this.onClickUserConfirm(key)} >Bestätigung</Button><Button onClick={(e) => this.onClickUserDestroy(key)} >Destroy</Button></li>
                        </ul>
                        : ""}
                </li>

            )
        })
    }
    return (
        <React.Fragment >
            <div className="row">
                <div className='col-sm-3' onClick={() => setUserTab(!userTab)}>Nutzerverwaltung</div>
                {userTab ? <ul>
                    {user_block}
                </ul> : ''}
            </div>
            <div className="row">
                <div className='col-sm-3' onClick={() => setEventTab(!eventTab)}>Eventdaten</div>
                {eventTab ? <div className='col-sm-9'>
                    {eventEdit ?
                        <form>
                            <div className='form-row'>
                                <div className='input-group mb-3'>
                                    <span className='input-group-prepend input-group-text col-sm-3'>
                                        Event Start
                                    </span>
                                    <input className='form-control' type='date' name='e_start' onChange={onInput} placeholder={Date(settings.e_start)} />
                                </div>
                            </div>
                            <div className='form-row'>
                                <div className='input-group mb-3'>
                                    <span className='input-group-prepend input-group-text col-sm-3'>
                                        Event End
                                    </span>
                                    <input className='form-control' type='date' name='e_end' onChange={onInput} placeholder={Date(settings.e_end)} />
                                </div>
                            </div>
                            <div className='form-row'>
                                <div className='input-group mb-3'>
                                    <span className='input-group-prepend input-group-text col-sm-3'>
                                        Event Location
                                    </span>
                                    <input className='form-control' type='text' name='e_loc' onChange={onInput} placeholder={settings.e_loc} />
                                </div>
                            </div>
                            <div className='form-row'>
                                <div className='input-group mb-3'>
                                    <span className='input-group-prepend input-group-text col-sm-3'>
                                        Teilnahme Preis
                                    </span>
                                    <input className='form-control' type='number' name='t_price' onChange={onInput} placeholder={settings.t_price} />
                                </div>
                            </div>
                            <div className='form-row'>
                                <div className='input-group mb-3'>
                                    <span className='input-group-prepend input-group-text col-sm-3'>
                                        Event Kosten
                                    </span>
                                    <input className='form-control' type='number' name='e_price' onChange={onInput} placeholder={settings.e_price} />
                                </div>
                            </div>
                            <div className='row justify-content-center'>
                                <button className='btn btn-outline-dark col-sm-4' onClick={() => setEventEdit(false)} >Abbrechen</button>
                                <button className='btn btn-outline-dark col-sm-4' onClick={onSave} >Speichern</button>
                            </div>
                        </form> :

                        <div className='text-left'>
                            <div className='row'>
                                <label className='col-sm-4'>Event Start</label>
                                <div className='col-sm-8 text-muted'>{settings.e_start}</div>
                            </div>
                            <div className='row'>
                                <label className='col-sm-4'>Event End</label>
                                <div className='text-muted col-sm-8'>{settings.e_end}</div>
                            </div>
                            <div className='row'>
                                <label className='col-sm-4'>Event Location</label>
                                <div className='text-muted col-sm-8'>{settings.e_loc}</div>
                            </div>
                            <div className='row'>
                                <label className='col-sm-4'>Teilnahme Preis</label>
                                <div className='text-muted col-sm-8'>{settings.t_price}</div>
                            </div>
                            <div className='row'>
                                <label className='col-sm-4'>Event Kosten</label>
                                <div className='text-muted col-sm-8'>{settings.e_price} </div>
                            </div>
                            <div className='row'>
                                <label className='col-sm-4'>Event Rechnung</label>
                                <div className='text-muted col-sm-8'>{eventPay / settings.e_price * 100}% bezahlt</div>
                            </div>
                            <div className='row justify-content-center'>
                                <button className='btn btn-outline-dark col-sm-5' onClick={() => setEventEdit(true)}>Edit</button>
                            </div>
                        </div>

                    }
                </div> : ''}

            </div>
            <div className="row">
                {/* Reminder beim Intialiseren ein Default Datum oder Exception abgreifen */}
                <div className='col-sm-3' onClick={() => setTbTab(!tbTab)}> ZeitBlock Einstellungen</div>
                {tbTab ?
                    <AdminBlock event={settings} timeblock={props.timeblock} />
                    : ''}
            </div>
        </React.Fragment >
    )

}

export default admin;