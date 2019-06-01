import React from 'react';
import { Meteor } from 'meteor/meteor';

import { Rounds } from '../api/mongo_export';
import RoundCreate from './RoundCreate';

export default class Round extends React.Component {

    state = {
        // beschreibungsfeld 
        //Vorgefertigten Charaktere
        // tisch 5
        // max 3 plätze online
        round_create: {
            round_tb: '',
            round_name: 'Round Name',
            setting: 'Setting',
            ruleset: 'Rules',
            own_char: true,
            round_gm: 'Placeholder',
            round_gm_id: Meteor.userId(),
            round_curr_pl: 0,
            round_max_pl: 5,
            round_player: []
        },
        time_block: [],
        in_round: [],
    }


    componentDidUpdate = (lastprops) => {
        if (this.props.rounds_box !== lastprops.rounds_box) {
            if (this.props.event) {
                this.timeOptions(this.props.timeblock)
            }
        }
        if (this.props.in_round !== lastprops.in_round) {
            this.setState({ in_round: this.props.in_round });
        }

    }

    onInput = (e) => {
        let temp = this.state.round_create
        let value = e.target.value
        temp[e.target.name] = value
        this.setState({ round_create: temp })
    }

    onInputBlock = (e, data) => {
        let temp = this.state.round_create
        temp[data.type] = data.value
        this.setState({ round_create: temp })
    }

    //saves a round into the db, is a callback
    onSave = () => {
        const data = this.state.round_create
        data.round_gm = this.props.user.profil
        let check = true;
        if (data.round_name.length === 0) {
            check = false;
        }
        if (data.round_max_pl < 4) {
            check = false;
        }
        if (data.setting.length === 0) {
            check = false;
        }
        if (check) {
            if (data._id) {
                Meteor.call('RoundUpdate', data)
            } else {
                Meteor.call('RoundCreate', data);
                // Rounds.insert(data)
            }
        }
    }

    //loads rounds setting
    onEdit = (data) => {
        this.setState({ round_create: data })
    }

    //destroys round in timeblock
    onDestroy = (data, time) => {
        Rounds.remove({ _id: data._id })
        this.props.onCallback({ key: time, value: true });
    }

    //joins a round
    onJoin(data) {
        data.round_player.push({ 'profil': this.props.user.profil, 'user_id': Meteor.userId() })
        data.round_curr_pl++
        Meteor.call('RoundUpdate', data)
    }

    //leaves a round
    onLeave(data, time) {
        let index = Object.keys(data.round_player).map((k) => {
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
        this.props.onCallback({ key: time, value: true });
        Meteor.call('RoundUpdate', data)
    }

    //checks if user is player in round
    onCheck(data, time) {
        if (data.length !== 0) {
            for (let i = 0; i < data.length; i++) {
                if (data[i].user_id === Meteor.userId()) {
                    this.props.onCallback({ key: time, value: false });
                    return false;
                }
            }
        }
        return true;
    }

    //gets rounds player names to visiualize
    onPlayers(data) {
        let out = '';
        if (data) {
            out = out.concat(Object.keys(data).map((k) => {
                return data[k].profil
            }))
        }
        return out
    }

    //creates options for timeblock when creating new round
    timeOptions = (block) => {
        if (this.props.in_round) {
            block.map((v) => {
                if (this.props.in_round[v._id] === false) {
                    return
                }
                let temp = this.state.time_block
                temp.push({
                    text: v.block_name,
                    value: v._id
                })
                this.setState({ time_block: temp })
            })
        }
    }

    //visualizes the rounds in a timeblock
    timeBlockCreate = (time) => {
        const rounds_box = this.props.rounds_box
        let round = ''
        if (rounds_box.length !== 0) {
            let out = '';
            round = rounds_box.map((k, v) => {
                if (k.round_tb === time) {
                    if (Meteor.userId() && this.props.user) {
                        if (this.props.user.bill) {
                            if (k.round_gm_id === Meteor.userId()) {
                                this.props.onCallback({ key: time, value: false });
                                out = <li><button onClick={() => this.onEdit(k)} >Edit</button><button onClick={() => this.onDestroy(k, time)} >Destroy</button></li>
                            } else if (this.props.in_round[time] !== false) {
                                if (this.onCheck(k.round_player, time)) {
                                    if (k.round_curr_pl < k.round_max_pl) {
                                        out = <li><button onClick={() => this.onJoin(k)} >Join</button></li>
                                    }
                                }
                            } else {
                                if (!this.onCheck(k.round_player, time)) {
                                    out = <li><button onClick={() => this.onLeave(k, time)} >Leave</button></li>
                                }
                            }
                        }
                    }
                    return (
                        <div className="col-sm-6" key={v}>
                            <div className="text-center">
                                <ul className="list-unstyled">
                                    <li>Runden Name = {k.round_name}</li>
                                    <li>Setting = {k.setting}</li>
                                    <li>Regelwerk = {k.ruleset}</li>
                                    <li>Spielleiter = {k.round_gm}</li>
                                    <li>Spieler Zahl/Max = {k.round_curr_pl}/{k.round_max_pl}</li>
                                    <li>Spieler Namen = {this.onPlayers(k.round_player)}</li>
                                    {out}
                                </ul>
                            </div>
                        </div>
                    )
                }
            })
        }
        return round
    }

    render() {
        const { time_block, round_create } = this.state
        const { event, timeblock } = this.props
        let tb = ''
        if (event) {
            timeblock.sort(function (a, b) {
                if (a.block_start < b.block_start) {
                    return -1;
                }
                if (a.block_start > b.block_start) {
                    return +1;
                }
                return 0;
            })
            tb = timeblock.map((k) => {
                if (!k.block_table) { return }
                return (
                    <div className="row" key={k.block_start}>
                        <div className="col-sm">
                            <div className="text-center"><h4>{k.block_name}</h4></div>
                            <div className="row">{this.timeBlockCreate(k._id)}</div>
                        </div>
                    </div>
                )
            })
        }
        return (
            <div>
                {tb}
                Hidden Block
                <RoundCreate round_create={round_create} time_block={time_block} onInput={this.onInput} onSave={this.onSave} onInputBlock={this.onInputBlock} />
            </div >
        )
    }
}