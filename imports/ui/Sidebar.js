import React from 'react';
import { Meteor } from 'meteor/meteor';

import AccountsUI from './AccountsUI'

export default class Sidebar extends React.Component {
    onClickButton = (data) => {
        this.props.onTabChange(data)
    }


    render() {
        var login = ''
        var admin = ''
        if (Meteor.userId()) {
            login = <div className="col-sm"><button onClick={(e) => this.onClickButton('account')}>Account</button></div>
            admin = <div className="col-sm"><button onClick={(e) => this.onClickButton('admin')}>Admin</button> </div>
        }

        return (
            <div className="row">
                    <div className="col-sm"><button onClick={(e) => this.onClickButton('welcome')} >Willkommen</button></div>
                    <div className="col-sm"><button onClick={(e) => this.onClickButton('round')} >Spielerunde</button></div>
                    {login}
                    {admin}
                    <div className="col-sm">
                        <AccountsUI />
                    </div>
            </div>
        )
    }
}