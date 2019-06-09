import React, { useState, useEffect } from 'react';
import AdminBlock from './AdminBlock';


const admin = props => {
    // capache abfragen für anmeldung

    // mail mit konto info beim account erstellen,
    const [settings, setSettings] = useState({
        e_end: null,
        e_loc: null,
        e_start: null,
        t_price: null,
        e_price: null
    });
    const [activeUser, setActiveUser] = useState(null);
    const [eventTab, setEventTab] = useState(false);
    const [userTab, setUserTab] = useState(false);
    const [tbTab, setTbTab] = useState(false);
    const [eventEdit, setEventEdit] = useState(false);

    useEffect(() => {
        if (props.event) {
            setSettings(props.event)
        }
        return (() => {
            setSettings()
        })
    }, [props.event])
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
        setActiveUser(e.target.value);
    }

    //for user table
    mouseOut = (e) => {
        setActiveUser(null)
    }

    onTabChange = (e) => {
        let temp = activeTab;
        temp[e] = !temp[e];
        setActivTab(Object.assign(temp))
    }

    // timeCount = (min, max) => {
    //     const account = new Account
    //     let out = account.timeCount(min, max);
    //     out.map((value, key) => {
    //         if (String(value.text).length < 2) {
    //             value.text = '0' + value.text;
    //             value.value = '0' + value.value;
    //             return value
    //         }
    //     })
    //     return out
    // }

    // timeCountYear() {
    //     const account = new Account;
    //     const date = new Date();
    //     let today = date.getFullYear()
    //     return account.timeCount(today, today + 1);
    // }
    let user_block = '';
    if (props.users.length > 0) {
        props.users.sort((a, b) => (a.last > b.last) ? 1 : ((b.last > a.last) ? -1 : 0));
        user_block = props.users.map((key, value) => {
            return (
                <li onMouseEnter={this.mouseIn} onMouseLeave={this.mouseOut} key={'User' + value} value={value}>
                    {key.last} {this.outPay(key.bill)}
                    {value === activeUser ?
                        <ul>
                            <li>{key.first}</li>
                            <li>{key.last}</li>
                            <li>{key.profil}</li>
                            <li>{key.age}</li>
                            <li>{key.email}</li>
                            <li><button onClick={(e) => Meteor.call('SwitchBill', key._id)} >Switch Pay</button></li>
                            <li><button onClick={(e) => this.onClickUserConfirm(key)} >Bestätigung</button><button onClick={(e) => this.onClickUserDestroy(key)} >Destroy</button></li>
                        </ul>
                        : ""}
                </li>

            )
        })
    }
    return (
        <div >
            <div className="row">
                <div onClick={() => setUserTab(!userTab)}>Nutzerverwaltung</div>
                {userTab ? <ul>
                    {user_block}
                </ul> : ''}
            </div>
            <div className="row">
                <div onClick={() => setEventTab(!eventTab)}>Eventdaten</div>
                {eventTab ? <ul>
                    <li>Event Start {eventEdit ? <input type='date' name='e_start' onChange={onInput} placeholder={Date(settings.e_start)} /> : settings.e_start}</li>
                    <li>Event End {eventEdit ? <input type='date' name='e_end' onChange={onInput} placeholder={Date(settings.e_end)} /> : settings.e_end}</li>
                    <li>Event Location {eventEdit ? <input type='text' name='e_loc' onChange={onInput} placeholder={settings.e_loc} /> : settings.e_loc}</li>
                    <li>Teilnahme Preis {eventEdit ? <input type='number' name='t_price' onChange={onInput} placeholder={settings.t_price} /> : settings.t_price}</li>
                    <li>Event Kosten {eventEdit ? <input type='number' name='e_price' onChange={onInput} placeholder={settings.e_price} /> : settings.e_price} </li>
                    {eventEdit ? <li><button onClick={() => setEventEdit(false)} >Cancel</button> <button onClick={onSave} >Save</button> </li>
                        : <li><button onClick={() => setEventEdit(true)}>Edit</button></li>}
                </ul> : ''}
            </div>
            <div className="row">
                {/* Reminder beim Intialiseren ein Default Datum oder Exception abgreifen */}
                <div onClick={() => setTbTab(!tbTab)}> ZeitBlock Einstellungen</div>
                {tbTab ?
                    <AdminBlock event={settings} timeblock={props.timeblock} />
                    : ''}
            </div>
        </div>
    )

}

export default admin;