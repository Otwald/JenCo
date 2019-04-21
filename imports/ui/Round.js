import React from 'react';
import { Rounds } from '../api/mongo_export';

export default class Round extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            round_create : {
                round_name : '',
                setting : '',
                ruleset : '',
                round_gm : 'Nickname',
                round_gm_id : this.props.loginToken,
                round_curr_pl : 0,
                round_max_pl : 0,
                round_player : []
            }
        }
    }

    onInput = (e) => {
        var temp = this.state.round_create
        var value = e.target.value
        temp[e.target.name] = value
        this.setState({ round_create: temp })
    }

    onSave = ()=>{
        const data = this.state.round_create
        var check = true;
        if(data.round_name.length === 0){
            check = false;
        }
        if(data.round_max_pl === 0){
            check = false;
        }
        if(data.setting.length === 0){
            check = false;
        }
        if(check){
            Rounds.insert(data)
        }
    }

    render() {
        var round = ''
        var create = ''
        const { rounds_box, loginToken } = this.props
        console.log()
        if (rounds_box.length !== 0) {
            round = rounds_box.map((k, v) => {
                return (
                    <div key={v}>
                        <ul>
                            <li>Name = {k.round_name}</li>
                            <li>Setting = {k.setting}</li>
                            <li>Regelwerk = {k.ruleset}</li>
                            <li>Spielleiter = {k.round_gm}</li>
                            <li>Spieler Zahl/Max = {k.round_curr_pl}/{k.round_max_pl}</li>
                            <li>Spieler Namen = {k.round_player}</li>
                        </ul>
                    </div>
                )
            })
        }
        if (loginToken) {
            create = <div>
                <ul>
                    <li>Runden Name<input type='text' name='round_name' onChange={this.onInput} /></li>
                    <li>Setting<input type='text' name='setting' onChange={this.onInput} /></li>
                    <li>Regelwerk <input type='text' name='ruleset' onChange={this.onInput} /></li>
                    <li>Spieler Max <input type='text' name='round_max_pl' onChange={this.onInput} /></li>
                    <li><button onClick={this.onSave} >Save</button></li>
                </ul>
            </div>
        }
        return (
            <div>
                {round}
                {create}
            </div>
        )
    }
}