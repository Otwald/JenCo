import React from 'react';

import AccountsUI from './AccountsUI'
export default class Titlebar extends React.Component {
    render() {
        return (
            <div className="Titlebar">
                <nav className="navbar navbar-expand-sm bg-light">
                    <ul className="navbar-nav">
                        <li className="nav_item">
                            {this.props.label}
                        </li>
                        <li className="nav_item">
                            <AccountsUI />
                        </li>
                    </ul>
                </nav>
            </div>
        )
    }
}