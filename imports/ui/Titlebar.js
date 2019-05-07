import React from 'react';

export default class Titlebar extends React.Component {
    render() {
        return (
            <div className="Titlebar">
                <nav className="navbar navbar-expand-sm bg-light">
                    <ul className="navbar-nav">
                        <li className="nav_item">
                            {this.props.label}
                        </li>
                    </ul>
                </nav>
            </div>
        )
    }
}