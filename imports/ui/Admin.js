import React from 'react';

export default class Admin extends React.Component{
    // nutzer verwalten , nutzer aufrufen als liste, admin sehen realnamen, option paycheck false :true
    // mail mit konto info beim account erstellen,
    // zweite mail sobald bestätigt

    // capache abfragen für anmeldung
    onInput(){

    }

    render(){
        return (
            <div>
                Event Start<input type='text' name='ruleset' onChange={this.onInput}/>
                Event End<input type='text' name='ruleset' onChange={this.onInput}/>
                Event Location<input type='text' name='ruleset' onChange={this.onInput}/>
                Timeblocks<input type='text' name='ruleset' onChange={this.onInput}/>
                Table<input type='text' name='ruleset' onChange={this.onInput}/>
                Min Spielerzahl pro Tisch
            </div>
        )
    }
}