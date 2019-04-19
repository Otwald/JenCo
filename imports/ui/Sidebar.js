import React from 'react';


export default class Sidebar extends React.Component{
    onClickButton=(data)=>{
        // e.preventDefault();
        this.props.onTabChange(data)
    }


    render(){
        return(
            <div className="Sidebar">
                <ul>
                    <li>Sidebar</li>
                    <li><button onClick={(e) =>this.onClickButton('welcome')} value='welcome'>Welcome</button></li>
                    {<li><button onClick={(e) =>this.onClickButton('account')}>Account</button></li>}
                </ul>
                
            </div>
            
        )
    }
}