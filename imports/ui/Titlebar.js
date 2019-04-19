import React from 'react';

import AccountsUI from './AccountsUI'
export default class Titlebar extends React.Component{
    render(){
        return(
            <div className="Titlebar">
                <nav>
                    {this.props.label}
                    <AccountsUI />
                </nav>
            </div>           
        )
    }
}