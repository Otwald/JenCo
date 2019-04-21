import React from 'react';
import { Rounds } from '../api/mongo_export';

export default class Round extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            round_create: {
                round_name: '',
                setting: '',
                ruleset: '',
                round_gm: 'Placeholder',
                round_gm_id: this.props.loginToken,
                round_curr_pl: 0,
                round_max_pl: 0,
                round_player: []
            }
        }
    }

    onInput = (e) => {
        var temp = this.state.round_create
        var value = e.target.value
        temp[e.target.name] = value
        this.setState({ round_create: temp })
    }

    onSave = () => {
        const data = this.state.round_create
        data.round_gm = this.props.user.profil
        var check = true;
        if (data.round_name.length === 0) {
            check = false;
        }
        if (data.round_max_pl === 0) {
            check = false;
        }
        if (data.setting.length === 0) {
            check = false;
        }
        if (check) {
            if (data._id) {
                Rounds.update({ _id: data._id }, data)
            } else {
                Rounds.insert(data)
            }
        }
    }

    onEdit(data) {
        this.setState({ round_create: data })
    }

    onJoin(data) {
        data.round_player.push({ 'profil': this.props.user.profil })
        this.setState({ round_create: data })
        this.onSave()
    }

    onCheck(data) {
        console.log(data)
        return true;
    }

    render() {
        var round = ''
        var create = ''
        const { rounds_box, loginToken } = this.props
        console.log(this.state.round_create)
        if (rounds_box.length !== 0) {
            var out = '';
            round = rounds_box.map((k, v) => {

                if (k.round_gm_id === loginToken) {
                    out = <li><button onClick={() => this.onEdit(k)} >Edit</button></li>
                } else if (this.onCheck(k.round_player)) {
                    out = <li><button onClick={() => this.onJoin(k)} >Join</button></li>
                }else{
                    out = '';
                }
                return (
                    <div key={v}>
                        <ul>
                            <li>Name = {k.round_name}</li>
                            <li>Setting = {k.setting}</li>
                            <li>Regelwerk = {k.ruleset}</li>
                            <li>Spielleiter = {k.round_gm}</li>
                            <li>Spieler Zahl/Max = {k.round_curr_pl}/{k.round_max_pl}</li>
                            <li>Spieler Namen = {k.round_player}</li>
                            {out}
                        </ul>
                    </div>
                )
            })
        }
        if (loginToken) {
            create = <div>
                <ul>
                    <li>Runden Name<input type='text' name='round_name' onChange={this.onInput} placeholder={this.state.round_create.round_name} /></li>
                    <li>Setting<input type='text' name='setting' onChange={this.onInput} placeholder={this.state.round_create.setting} /></li>
                    <li>Regelwerk <input type='text' name='ruleset' onChange={this.onInput} placeholder={this.state.round_create.ruleset} /></li>
                    <li>Spieler Max <input type='text' name='round_max_pl' onChange={this.onInput} placeholder={this.state.round_create.round_max_pl} /></li>
                    <li><button onClick={this.onSave} >Save</button></li>
                </ul>
            </div>
        }
        return (
            <div>
                {round}
                {create}
            </div >
        )
    }
}