import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Button, Menu } from 'semantic-ui-react';

import AccountsUI from './AccountsUI'

export default class Sidebar extends React.Component {
    onClickButton = (data) => {
        this.props.onTabChange(data)
    }


    render() {
        let login = ''
        let admin = ''
        if (Meteor.userId()) {
            login = <div className="col-sm"><Button primary onClick={(e) => this.onClickButton('account')}>Account</Button></div>
            admin = <div className="col-sm"><Button primary onClick={(e) => this.onClickButton('admin')}>Admin</Button> </div>
        }

        return (
            <div className="row">
                    <div className="col-sm"><Button primary onClick={(e) => this.onClickButton('welcome')} >Willkommen</Button></div>
                    <div className="col-sm"><Button primary onClick={(e) => this.onClickButton('round')} >Spielerunde</Button></div>
                    {login}
                    {admin}
                    <div className="col-sm">
                        <AccountsUI />
                    </div>
            </div>
        )
    }
}