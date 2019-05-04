import React from 'react';
import { users_account, event_settings , users_archive} from '../api/mongo_export';

export default class Admin extends React.Component {
    // capache abfragen für anmeldung

    // mail mit konto info beim account erstellen,
    // zweite mail sobald bestätigt
    state = {
        settings: {
            e_start: null,
            e_end: null,
            e_loc: null,
            tb: [],
            table: null,
            price: null,
        },
        block_create: null,
        activeUser: null,
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
        var value = e.target.value
        temp[e.target.name] = value
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
        users_account.update({ _id: data._id },data)
    }

    //archives and destroys user accounts(!loginaccount)
    onClickUserDestroy(data){
        users_archive.insert(data)
        users_account.remove({_id: data._id});
    }

    //for user table
    mouseIn = (e) => {
        this.setState({ activeUser: e.target.value })
    }

    //for user table
    mouseOut = (e) => {
        this.setState({ activeUser: null })
    }

    render() {
        var blocks = '';
        var user_block = '';
        const { settings, activeUser } = this.state
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
                                <li><button onClick={(e) => this.onClickUserDestroy(key)} >Destroy</button></li>
                            </ul>
                            : ""}
                    </li>

                )
            })
        }
        return (
            <div>
                <ul>
                    {user_block}
                </ul>
                <ul>
                    <li>Event Start<input type='text' name='e_start' onChange={this.onInput} placeholder={settings.e_start} /></li>
                    <li>Event End<input type='text' name='e_end' onChange={this.onInput} placeholder={settings.e_end} /></li>
                    <li>Event Location<input type='text' name='e_loc' onChange={this.onInput} placeholder={settings.e_loc} /></li>
                    <li>Preis<input type='text' name='price' onChange={this.onInput} placeholder={settings.price} /></li>
                    <li>Min Spielerzahl pro Tisch</li>
                    <li>Table<input type='text' name='table' onChange={this.onInput} placeholder={settings.table} /></li>
                    <li>Timeblocks:</li>
                    <ul>
                        {blocks}
                        <li>
                            <input type='text' name='block_create' onChange={this.onBlockCreate} /><button onClick={this.onBlockSave} >Add</button><br />
                        </li>
                    </ul>
                    <li><button onClick={this.onSave} >Save</button></li>
                </ul>
            </div>
        )
    }
}