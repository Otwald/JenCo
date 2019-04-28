import React from 'react';
import { users_account, event_settings } from '../api/mongo_export';

export default class Admin extends React.Component {
    // nutzer verwalten , nutzer aufrufen als liste, admin sehen realnamen, option paycheck false :true
    // mail mit konto info beim account erstellen,
    // zweite mail sobald bestätigt

    // capache abfragen für anmeldung
    constructor(props) {
        super(props)
        this.state = {
            settings: {
                e_start: null,
                e_end: null,
                e_loc: null,
                tb: [],
                table: null,
                price: null,
            },
            block_create: null
        }
    }

    componentWillReceiveProps = (nextprops) => {
        if (nextprops.event) {
            if (this.state.settings !== nextprops.event) {
                this.setState({ settings: nextprops.event})
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
        temp.tb.map((k,v)=>{
            a_slice.push({text:k.text , value: v})
        })
        temp.tb = a_slice
        this.setState({ settings: temp });
        this.onSave()
    }

    render() {
        var blocks = ''
        const { settings } = this.state
        const { event } = this.props
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
        return (
            <div>
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