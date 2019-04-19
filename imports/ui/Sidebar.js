import React from 'react';


export default class Sidebar extends React.Component{
    onClickButton=(data)=>{
        this.props.onTabChange(data)
    }


    render(){
        const login = Meteor.userId()
        return(
            <div className="Sidebar">
                <ul>
                    <li>Sidebar</li>
                    <li><button onClick={(e) =>this.onClickButton('welcome')} >Willkommen</button></li>
                    <li><button onClick={(e) =>this.onClickButton('round')} >Spielerunde</button></li>
                    {login ? <li><button onClick={(e) =>this.onClickButton('account')}>Account</button></li> : ''}
                </ul>
            </div>
        )
    }
}