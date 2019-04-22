import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Dropdown } from 'semantic-ui-react';

import { Rounds } from '../api/mongo_export';


const time_block = [{ text: 'Früh', value: 'early' }, { text: 'Spät', value: 'later' }]
export default class Round extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            round_create: {
                round_tb: '',
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

    onInputBlock = (e, data) => {
        var temp = this.state.round_create
        temp[data.type] = data.value
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
        data.round_player.push({ 'profil': this.props.user.profil, 'user_id': Meteor.userId() })
        data.round_curr_pl++
        Rounds.update({ _id: data._id }, data)
    }

    onLeave(data) {
        var index = Object.keys(data.round_player).map((k) => {
            if (data.round_player[k].user_id === Meteor.userId()) {
                return k
            }
        })
        if (index.length !== 0) {
            index.map((k, v) => {
                if (k !== undefined) {
                    data.round_curr_pl--
                    data.round_player.splice(k, 1);
                }
            })
        }
        Rounds.update({ _id: data._id }, data)
    }

    onCheck(data) {
        if (data.length !== 0) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].user_id === Meteor.userId()) {
                    return false;
                }
            }
        }
        return true;
    }

    onPlayers(data) {
        var out = '';
        if (data) {
            out = out.concat(Object.keys(data).map((k) => {
                return data[k].profil
            }))
        }
        return out
    }

    timeOptions = (block) => {
        var query = this.props.rounds_box.map((k, v) => {
            if (k.round_gm_id === this.props.loginToken) {
                return k.round_tb
            }
        })
        var index = time_block.map((k, v) => {
            if (query.includes(k.value)) {
                return v
            }
        })
        if (index.length !== 0) {
            for(var i = 0 ; i< block.length ; i++){
                if(index[i] !== undefined){
                    block.splice(i, 1);
                    index.splice(i, 1);
                    i--;
                }
            }
        }
        return block
    }

    timeBlockCreate = (time) => {
        const rounds_box = this.props.rounds_box
        var round = ''
        if (rounds_box.length !== 0) {
            var out = '';
            round = rounds_box.map((k, v) => {
                if (k.round_tb === time) {
                    if (Meteor.userId()) {
                        if (k.round_gm_id === this.props.loginToken) {
                            out = <li><button onClick={() => this.onEdit(k)} >Edit</button></li>
                        } else if (this.onCheck(k.round_player)) {
                            out = <li><button onClick={() => this.onJoin(k)} >Join</button></li>
                        } else {
                            out = <li><button onClick={() => this.onLeave(k)} >Leave</button></li>
                        }
                    }
                    return (
                        <div key={v}>
                            <ul>
                                <li>Name = {k.round_name}</li>
                                <li>Setting = {k.setting}</li>
                                <li>Regelwerk = {k.ruleset}</li>
                                <li>Spielleiter = {k.round_gm}</li>
                                <li>Spieler Zahl/Max = {k.round_curr_pl}/{k.round_max_pl}</li>
                                <li>Spieler Namen = {this.onPlayers(k.round_player)}</li>
                                {out}
                            </ul>
                        </div>
                    )
                }
            })
        }
        return round
    }

    render() {
        var create = ''
        const { rounds_box, loginToken } = this.props
        if (loginToken) {
            create = <div>
                <ul>
                    <li>
                        ZeitBlock<Dropdown
                            placeholder='Block'
                            options={this.timeOptions(time_block)}
                            scrolling
                            onChange={this.onInputBlock}
                            type='round_tb'
                        />
                    </li>
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
                Early Block
                {this.timeBlockCreate('early')}
                Late Block
                {this.timeBlockCreate('later')}
                Hidden Block
                {create}
            </div >
        )
    }
}