import React from 'react';

export default class Admin extends React.Component {
    // nutzer verwalten , nutzer aufrufen als liste, admin sehen realnamen, option paycheck false :true
    // mail mit konto info beim account erstellen,
    // zweite mail sobald bestätigt

    // capache abfragen für anmeldung
    onInput() {

    }

    render() {
        return (
            <div>
                <ul>
                    <li>Event Start<input type='text' name='ruleset' onChange={this.onInput} /></li>
                    <li>Event End<input type='text' name='ruleset' onChange={this.onInput} /></li>
                    <li>Event Location<input type='text' name='ruleset' onChange={this.onInput} /></li>
                    <li>Timeblocks<input type='text' name='ruleset' onChange={this.onInput} /></li>
                    <li>Table<input type='text' name='ruleset' onChange={this.onInput} /></li>
                    <li>Preis<input type='text' name='ruleset' onChange={this.onInput} /></li>
                    <li>Min Spielerzahl pro Tisch</li>
                </ul>
            </div>
        )
    }
}