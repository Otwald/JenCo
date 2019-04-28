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
            }
        }
        console.log(props)
    }

    componentDidUpdate = (lastprops) => {
        if (this.props.event !== lastprops.event) {
            this.setState({ settings: this.props.event })
        }
    }

    onInput = (e) => {
        var temp = this.state.settings
        var value = e.target.value
        temp[e.target.name] = value
        this.setState({ settings: temp })
    }

    onSave = () => {
        event_settings.update(this.state.settings)
    }

    render() {
        console.log(this.state)
        const { settings } = this.state
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
                        <li>Block 1 Edit <br />
                            Destroy
                        </li>
                        <li>
                            <input type='text' name='table' onChange={this.onBlockCreate} /><button onClick={this.onBlockSave} >Add</button><br />
                        </li>
                    </ul>
                    <li><button onClick={this.onSave} >Save</button></li>
                </ul>
            </div>
        )
    }
}