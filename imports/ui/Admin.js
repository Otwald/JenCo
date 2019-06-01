import React from 'react';

import { users_account, event_settings, users_archive } from '../api/mongo_export';
import AdminBlock from './AdminBlock';


export default class Admin extends React.Component {
    // capache abfragen für anmeldung

    // mail mit konto info beim account erstellen,
    state = {
        settings: {
            e_start: null,
            e_end: null,
            e_loc: null,
            tb: [],
            table: null,
            price: null,
        },
        activeUser: null,
        activeTab: {
            user: false,
            event: false,
            tb: false
        },
    }

    componentWillReceiveProps = (nextprops) => {
        if (nextprops.event) {
            if (this.state.settings !== nextprops.event) {
                // let temp = Object.create()
                this.setState({ settings: nextprops.event })
            }
        }
    }

    // for state update with event infos
    onInput = (e) => {
        let temp = this.state.settings
        temp[e.target.name] = e.target.value
        this.setState({ settings: temp })
    }

    //saves state.setting to mongo
    onSave = () => {
        Meteor.call('EventUpdate',  this.state.settings)
    }

    // just translats booleans to words
    outPay(data) {
        if (data) {
            return 'hat bezahlt'
        } else {
            return 'nicht bezahlt'
        }

    }

    //switchey paystatus
    onClickUserSwith(data) {
        data.bill = !data.bill
        Meteor.call('AccountUpdate', data);
    }

    //archives and destroys user accounts(!loginaccount)
    onClickUserDestroy(data) {
        Meteor.call('UserArchiveCreate', data)
        Meteor.call('AccountUpdate', data);
        Meteor.call('AccountDelete', data._id);
    }

    onClickUserConfirm(data) {
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
        this.setState({ activeUser: e.target.value })
    }

    //for user table
    mouseOut = (e) => {
        this.setState({ activeUser: null })
    }

    onTabChange = (e) => {
        let temp = this.state.activeTab;
        temp[e] = !temp[e];
        this.setState({ activeTab: temp })
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

    render() {
        let user_block = '';
        const { settings, activeUser, activeTab } = this.state
        const { event, users, timeblock} = this.props
        if (users.length > 0) {
            users.sort((a, b) => (a.last > b.last) ? 1 : ((b.last > a.last) ? -1 : 0));
            user_block = users.map((key, value) => {
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
                                <li><button onClick={(e) => this.onClickUserSwith(key)} >Switch Pay</button></li>
                                <li><button onClick={(e) => this.onClickUserConfirm(key)} >Bestätigung</button><button onClick={(e) => this.onClickUserDestroy(key)} >Destroy</button></li>
                            </ul>
                            : ""}
                    </li>

                )
            })
        }
        return (
            <div>
                <div className="row">
                    <div onClick={(e) => this.onTabChange('user')}>Nutzerverwaltung</div>
                    {activeTab.user ? <ul>
                        {user_block}
                    </ul> : ''}
                </div>
                <div className="row">
                    <div onClick={(e) => this.onTabChange('event')}>Eventdaten</div>
                    {activeTab.event ? <ul>
                        <li>Event Start<input type='date' name='e_start' onChange={this.onInput} placeholder={Date(settings.e_start)} /> </li>
                        <li>Event End<input type='date' name='e_end' onChange={this.onInput} placeholder={Date(settings.e_end)} /></li>
                        <li>Event Location<input type='text' name='e_loc' onChange={this.onInput} placeholder={settings.e_loc} /></li>
                        <li>Preis<input type='text' name='price' onChange={this.onInput} placeholder={settings.price} /></li>
                        <li>Min Spielerzahl pro Tisch</li>
                        <li>Table<input type='text' name='table' onChange={this.onInput} placeholder={settings.table} /></li>
                        <li><button onClick={this.onSave} >Save</button></li>
                    </ul> : ''}
                </div>
                <div className="row">
                    {/* Reminder beim Intialiseren ein Default Datum oder Exception abgreifen */}
                    <div onClick={(e) => this.onTabChange('tb')}>ZeitBlock Einstellungen</div>
                    {activeTab.tb ?
                        <AdminBlock event={event} timeblock={timeblock} />
                        : ''}
                </div>
            </div>
        )
    }
}