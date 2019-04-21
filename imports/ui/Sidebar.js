import React from 'react';


export default class Sidebar extends React.Component {
    onClickButton = (data) => {
        this.props.onTabChange(data)
    }


    render() {
        var login = ''
        const {loginToken} = this.props
        console.log(this.props)
        if (loginToken) {
            login = <li><button onClick={(e) => this.onClickButton('account')}>Account</button></li>
        }

        return (
            <div className="Sidebar">
                <ul>
                    <li>Sidebar</li>
                    <li><button onClick={(e) => this.onClickButton('welcome')} >Willkommen</button></li>
                    <li><button onClick={(e) => this.onClickButton('round')} >Spielerunde</button></li>
                    {login}
                </ul>
            </div>
        )
    }
}