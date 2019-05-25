import React from 'react';
import { Dropdown } from 'semantic-ui-react';

import { users_account, event_settings, users_archive } from '../api/mongo_export';
import Account from './Account';

const tbdays = [{ text: 'Freitag', value: 0 }, { text: 'Samstag', value: 1 }, { text: 'Sonntag', value: 2 }]
export default class Admin extends React.Component {
    // capache abfragen für anmeldung

    // mail mit konto info beim account erstellen,
    state = {
        settings: {
            e_start: new Date(),
            e_end: new Date(),
            e_loc: null,
            tb: [],
            table: null,
            price: null,
        },
        block_create: null,
        activeUser: null,
        activeTab: {
            user: false,
            event: false,
            tb: false
        },
        date:{
            begin: '0000-00-00',
            end: '0000-00-00',
        }
    }
    componentWillReceiveProps = (nextprops) => {
        if (nextprops.event) {
            if (this.state.settings !== nextprops.event) {
                this.setState({ settings: nextprops.event })
            }
        }
    }

    // for state update with event infos
    onInput = (e) => {
        var temp = this.state.settings
        temp[e.target.name] = e.target.value
        this.setState({ settings: temp })
    }

    //creates timeblock for rounds
    onBlockCreate = (e) => {
        this.setState({ block_create: e.target.value })
    }

    //saves state.setting to mongo
    onSave = () => {
        event_settings.update({ _id: this.state.settings._id }, this.state.settings)
    }

    //saves timeblock into state and updates mongo
    onBlockSave = () => {
        var temp = this.state.settings;
        temp.tb.push({ text: this.state.block_create, value: temp.tb.length })
        this.setState({ settings: temp });
        this.onSave()
    }

    //deletes timebock from state and updates mongo
    onBlockDelete = (v) => {
        var temp = this.state.settings;
        var a_slice = []
        temp.tb.splice(v, 1);
        temp.tb.map((k, v) => {
            a_slice.push({ text: k.text, value: v })
        })
        temp.tb = a_slice
        this.setState({ settings: temp });
        this.onSave()
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
        users_account.update({ _id: data._id }, data)
    }

    //archives and destroys user accounts(!loginaccount)
    onClickUserDestroy(data) {
        users_archive.insert(data)
        users_account.remove({ _id: data._id });
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
        var temp = this.state.activeTab;
        temp[e] = !temp[e];
        this.setState({ activeTab: temp })
    }

    timeCount = (min, max) => {
        const account = new Account
        var out = account.timeCount(min, max);
        out.map((value, key) => {
            if (String(value.text).length < 2) {
                value.text = '0' + value.text;
                value.value = '0' + value.value;
                return value
            }
        })
        return out
    }

    onDateInput = (e, data) => {
        // data = data.type.split('-');
        // var temp = this.state.date
        // temp = temp[data[0]].split('-');
        // switch(data[1]){
        //     case 'day':
        //         temp[2] = data[1];
        //         break
        //     case 'month':
        //         temp[1] = data[1];
        //         break;
        //     case 'year':
        //         temp[0] = data[1];
        //         break;
        // }
        // console.log(temp);
    }

    inBetweenTime = (start, end) =>{
        start = new Date(start);
        end = new Date(end);
        // start =start.getDay();
        // end = end.getDay();
        for(var i = start; i <= end; i++){
            console.log(i);
        }
        return [{ text: 'Freitag', value: 0 }, { text: 'Samstag', value: 1 }, { text: 'Sonntag', value: 2 }]
    }

    timeCountYear() {
        const account = new Account;
        const date = new Date();
        var today = date.getFullYear()
        return account.timeCount(today, today + 1);
    }

    render() {
        var blocks = '';
        var user_block = '';
        const { settings, activeUser, activeTab } = this.state
        const { event, users } = this.props
        if (event) {
            if (settings.tb.length > 0) {
                blocks = settings.tb.map((k, v) => {
                    return (
                        <div key={v}>
                            <li>{k.text}<button onClick={() => this.onBlockDelete(v)} >Destroy</button> </li>
                        </div>
                    )
                })
            }
        }

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
                        <li>Event Start<input type='date' name='e_start' onChange={this.onInput} placeholder={new Date(settings.e_start)} /> </li>
                        <li>Event End<input type='date' name='e_end' onChange={this.onInput} placeholder={settings.e_end} /></li>
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
                        <ul>
                            {blocks}
                            <li>Name <input type='text' name='block_create' onChange={this.onBlockCreate} placeholder='Hier Namen einfügen' /></li>
                            <li>Zeit Start
                                <Dropdown
                                    placeholder='Tag'
                                    search
                                    options={this.inBetweenTime(event.e_start, event.e_end)}
                                    scrolling
                                    onChange={this.onDateInput}
                                    type='year'
                                />
                               <input type='time' name='block_start' />
                            </li>
                            <li>
                                Zeit Länge
                            </li>
                            <li>Spielblock <input type='checkbox' name='block_create' onChange={this.onBlockCreate} placeholder='Ja/Nein' /></li>
                            <li><button onClick={this.onBlockSave} >Add</button><br /></li>
                        </ul>
                        : ''}
                </div>
            </div>
        )
    }
}