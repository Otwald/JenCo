import React, { useState, useEffect } from 'react';

import useDate from './Helper';
import AdminBlock from './AdminBlock';


const admin = props => {
    // capache abfragen für anmeldung

    // mail mit konto info beim account erstellen,
    const [e_start, setStart] = useState('');
    const [users, setUsers] = useState([]);
    const [e_end, setEnd] = useState('');
    const [e_loc, setLoc] = useState('');
    const [t_price, setTicketPrice] = useState(0);
    const [e_price, setEventPrice] = useState(0);
    const [activeUser, setActiveUser] = useState(null);
    const [eventTab, setEventTab] = useState(false);
    const [userTab, setUserTab] = useState(false);
    const [tbTab, setTbTab] = useState(false);
    const [eventEdit, setEventEdit] = useState(false);
    const [eventPay, setEventPay] = useState(0);
    const [agefilter, setAgefilter] = useState(false);
    const [payfilter, setPayfilter] = useState(false);
    const [deleteUser, setDeleteUser] = useState('');

    useEffect(() => {
        onSwitch();
        if (props.event) {
            setStart(props.event.e_start);
            setEnd(props.event.e_end);
            setLoc(props.event.e_loc);
            setTicketPrice(props.event.t_price);
            setEventPrice(props.event.e_price);
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
            setStart('');
            setEnd('');
            setLoc('');
            setTicketPrice(0);
            setEventPrice(0);
        })
    }, [props.event, props.users])

    /**
     * calls MeteorServer to updatew the users List State
     */
    function onSwitch(){
        Meteor.call('getUsers', ((err, resp) => {
            if (!err) {
                setUsers(resp);
            }
        }))
    }

    //saves state.setting to mongo
    onSave = () => {
        event.preventDefault()
        let settings = {
            e_end: e_end,
            e_loc: e_loc,
            e_start: e_start,
            t_price: t_price,
            e_price: e_price
        };
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

    /**
     * handles the click event on the user managment table,
     * and saves user id in a state
     * @param Object data holds db Entry to user
     */
    mouseIn = (data) => {
        if (activeUser !== data._id) {
            setActiveUser(data._id);
        } else {
            setActiveUser(null)
        }
    }

    /**
     * small helper to convert timestamp age into
     * age in years with the event as the measurement 
     * 
     * @param Number timestamp holds the age in Timestamp format
     * @return Number Age 
     */
    calcAge = (timestamp) => {
        if (props.event) {
            event_start = new Date(props.event.e_start)
            age = event_start.getTime() - timestamp;
            age = new Date(age);
            age = age.getFullYear() - 1970;
            return age;
        }
        return 0;
    }

    onTabChange = (e) => {
        let temp = activeTab;
        temp[e] = !temp[e];
        setActivTab(Object.assign(temp))
    }

    let user_block = '';
    let userMan = '';
    if (props.users.length > 0) {
        props.users.sort((a, b) => (a.last > b.last) ? 1 : ((b.last > a.last) ? -1 : 0));
        user_block = users.map((key, value) => {
            let age = calcAge(key.age)
            if (agefilter === true) {
                if (age > 16) {
                    return;
                }
            }
            if (payfilter === true) {
                if (key.bill === true) {
                    return;
                }
            }
            return (
                <tr onClick={() => {
                    this.mouseIn(key)
                    setDeleteUser('')
                }} key={'Table' + value}>
                    <th scope='row'>{value + 1}</th>
                    <th>{key.profile.last}</th>
                    <th>{this.outPay(key.profile.bill)}</th>
                    <th>{age}</th>
                </tr>
            )
        })
        if (users) {
            userMan = users.map((value, index) => {
                return (
                    <React.Fragment key={'User' + index}>
                        {value._id == activeUser ?
                            <div className="card col-sm-8">
                                <div className='card-body'>
                                    <div className='row'>
                                        <label className='col-sm-4'><strong>Profil Name</strong></label>
                                        <div className='col-sm-8 text-muted'>{value.profile.profil}</div>
                                    </div>
                                    <div className='row'>
                                        <label className='col-sm-4'><strong>Vorname</strong></label>
                                        <div className='col-sm-8 text-muted'>{value.profile.first}</div>
                                    </div>
                                    <div className='row'>
                                        <label className='col-sm-4'><strong>Nachname</strong></label>
                                        <div className='col-sm-8 text-muted'>{value.profile.last}</div>
                                    </div>
                                    <div className='row'>
                                        <label className='col-sm-4'><strong>Alter</strong></label>
                                        <div className='col-sm-8 text-muted'>{new Date(value.profile.age).toDateString()}</div>
                                    </div>
                                    <div className='row'>
                                        <label className='col-sm-4'><strong>Status</strong></label>
                                        <div className='col-sm-8 text-muted'>{value.profile.bill ? 'Ja' : 'Nein'}</div>
                                    </div>
                                    <div className='row'>
                                        <label className='col-sm-4'><strong>E-Mail</strong></label>
                                        <div className='col-sm-8 text-muted'>{value.profile.email}</div>
                                    </div>
                                    <div className='row justify-content-center'>
                                        <button className='btn btn-outline-dark col-sm-4' onClick={(e) => {Meteor.call('SwitchBill', value._id); onSwitch()}} >Wechsel Bezahlstatus</button>
                                        <button className='btn btn-outline-dark col-sm-4' onClick={(e) => this.onClickUserConfirm(value)} >BestätigungsEmail</button>
                                    </div>
                                    <div className='row justify-content-center'>
                                        <button className='btn btn-outline-dark col-sm-4' onClick={() => setDeleteUser(value._id)} >Nutzer löschen</button>
                                        {deleteUser == value._id ?
                                            <React.Fragment>
                                                <button className='btn btn-outline-dark col-sm-4' onClick={() => setDeleteUser('')}>Abbruch</button>
                                                <button className='btn btn-outline-dark col-sm-4' onClick={(e) => this.onClickUserDestroy(value)}>Wirklich Löschen?</button>
                                            </React.Fragment>
                                            :
                                            ''}
                                    </div>
                                </div>
                            </div>
                            : ""}
                    </React.Fragment>
                )
            })
        }
    }
    return (
        <React.Fragment >
            <div className="row">
                <div className='col-sm-3' onClick={() => {
                    setUserTab(!userTab)
                    setDeleteUser('')
                }}>Nutzerverwaltung</div>
                {userTab ?
                    <div className='col-sm-9'>
                        <div className='table-responsive-sm'>
                            <table className='table table-striped table-hover'>
                                <thead>
                                    <tr>
                                        <th scope='col'>#</th>
                                        <th scope="col">Nachname</th>
                                        <th scope="col" onClick={() => setPayfilter(!payfilter)}>Status<p className='text-muted'>{payfilter ? 'nicht bezahlt' : 'Alle'}</p></th>
                                        <th scope='col' onClick={() => setAgefilter(!agefilter)}>Alter<p className='text-muted'>{agefilter ? 'Jung' : 'Alle'}</p></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {user_block}
                                </tbody>
                            </table>
                        </div>
                        <div className='row justify-content-center'>
                            {userMan}
                        </div>
                    </div>
                    : ''}
            </div>
            <div className="row">
                <div className='col-sm-3' onClick={() => setEventTab(!eventTab)}>Eventdaten</div>
                {eventTab ? <div className='col-sm-9'>
                    {eventEdit ?
                        <form className='was-validated'>
                            <div className='form-row'>
                                <div className='input-group mb-3'>
                                    <span className='input-group-prepend input-group-text col-sm-3'>
                                        Event Start
                                    </span>
                                    <input required className='form-control' type='date' name='e_start' onChange={() => setStart(event.target.value)} value={useDate(e_start)} />
                                </div>
                            </div>
                            <div className='form-row'>
                                <div className='input-group mb-3'>
                                    <span className='input-group-prepend input-group-text col-sm-3'>
                                        Event End
                                    </span>
                                    <input required className='form-control' type='date' name='e_end' onChange={() => setEnd(event.target.value)} value={useDate(e_end)} />
                                </div>
                            </div>
                            <div className='form-row'>
                                <div className='input-group mb-3'>
                                    <span className='input-group-prepend input-group-text col-sm-3'>
                                        Event Location
                                    </span>
                                    <input required className='form-control' type='text' name='e_loc' onChange={() => setLoc(event.target.value)} value={e_loc} />
                                </div>
                            </div>
                            <div className='form-row'>
                                <div className='input-group mb-3'>
                                    <span className='input-group-prepend input-group-text col-sm-3'>
                                        Teilnahme Preis
                                    </span>
                                    <input required min='0' className='form-control' type='number' name='t_price' onChange={() => setTicketPrice(event.target.value)} value={t_price} />
                                </div>
                            </div>
                            <div className='form-row'>
                                <div className='input-group mb-3'>
                                    <span className='input-group-prepend input-group-text col-sm-3'>
                                        Event Kosten
                                    </span>
                                    <input required min='0' className='form-control' type='number' name='e_price' onChange={() => setEventPrice(event.target.value)} value={e_price} />
                                </div>
                            </div>
                            <div className='row justify-content-center'>
                                <button className='btn btn-outline-dark col-sm-4' onClick={() => { setEventEdit(false); event.preventDefault() }} >Abbrechen</button>
                                <button className='btn btn-outline-dark col-sm-4' onClick={onSave} >Speichern</button>
                            </div>
                        </form> :

                        <div className='text-left'>
                            <div className='row'>
                                <label className='col-sm-4'>Event Start</label>
                                <div className='col-sm-8 text-muted'>{e_start}</div>
                            </div>
                            <div className='row'>
                                <label className='col-sm-4'>Event End</label>
                                <div className='text-muted col-sm-8'>{e_end}</div>
                            </div>
                            <div className='row'>
                                <label className='col-sm-4'>Event Location</label>
                                <div className='text-muted col-sm-8'>{e_loc}</div>
                            </div>
                            <div className='row'>
                                <label className='col-sm-4'>Teilnahme Preis</label>
                                <div className='text-muted col-sm-8'>{t_price}</div>
                            </div>
                            <div className='row'>
                                <label className='col-sm-4'>Event Kosten</label>
                                <div className='text-muted col-sm-8'>{e_price} </div>
                            </div>
                            <div className='row'>
                                <label className='col-sm-4'>Event Rechnung</label>
                                <div className='text-muted col-sm-8'>{eventPay / e_price * 100}% bezahlt</div>
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
                    <AdminBlock event={props.event} timeblock={props.timeblock} />
                    : ''}
            </div>
        </React.Fragment >
    )

}

export default admin;