import React from 'react';
import { Meteor } from 'meteor/meteor';


export default class Sidebar extends React.Component {
    onClickButton = (data) => {
        this.props.onTabChange(data)
    }


    render() {
        var login = ''
        var admin = ''
        if (Meteor.userId()) {
            login = <li><button onClick={(e) => this.onClickButton('account')}>Account</button></li>
            admin = <li><button onClick={(e) => this.onClickButton('admin')}>Admin</button> </li>
        }

        return (
            <div className="Sidebar">
                <ul>
                    <li>Sidebar</li>
                    <li><button onClick={(e) => this.onClickButton('welcome')} >Willkommen</button></li>
                    <li><button onClick={(e) => this.onClickButton('round')} >Spielerunde</button></li>
                    {login}
                    {admin}
                </ul>
            </div>
        )
    }
}