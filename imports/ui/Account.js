import React from 'react';

export default class Account extends React.Component{
    constructor(props){
        super(props)

        this.state = {
            account : {
                profil:null,
                real_name : null,
                age : null,
                email : null,
            }
        }
    }

    onInput=(e)=>{
        var temp = this.state.account
        temp[e.target.name] = e.target.value
        this.setState({account : temp})
    }

    render(){
        console.log(this.state)
        return(
            <div>
                <ul>
                    Account Content
                    <li>Profil Name<input type='text' name='profil' onChange={this.onInput}/></li>
                    <li>Real Name<input type='text' name='real_name' onChange={this.onInput}/></li>
                    <li>Alter<input type='text' name='age' onChange={this.onInput}/></li>
                    <li>Veranstaltungsinfo per Mail<input type='text' name='email' onChange={this.onInput}/></li>
                </ul>
            </div>
        )
    }
}