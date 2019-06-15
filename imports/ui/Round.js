import React, { useState, useEffect } from 'react';
import { Meteor } from 'meteor/meteor';

import RoundCreate from './RoundCreate';

const roundComponent = props => {

    // beschreibungsfeld 
    //Vorgefertigten Charaktere
    // max 3 plätze online


    const [round_create, setRoundCreate] = useState({
        _id: null,
        round_tb: '',
        round_name: 'Round Name',
        setting: 'Setting',
        ruleset: 'Rules',
        own_char: true,
        round_gm: 'Placeholder',
        round_gm_id: Meteor.userId(),
        round_curr_pl: 0,
        round_max_pl: 5,
        round_player: [],
        round_table: null
    })
    const [edit_options_time_block, setEdit_Options_time_block] = useState([]);
    const [options_time_block, setOptions_time_block] = useState([]);
    const [in_round, setIn_round] = useState([]);
    const [tableOptions, setTableOptions] = useState([]);
    const [roundTab, setRoundTab] = useState(null);


    useEffect(() => {
        timeOptions(props.time_block);
        setIn_round(props.in_round);
        return (() => {
            setOptions_time_block([]);
        })
    }, [props.time_block, props.user, props.rounds_box, props.in_round, props.user])
    // useEffect(() => {
    //     setIn_round(props.in_round);
    // }, [props.in_round])
    // useEffect(() => {
    //     return (() => { })
    // }, [props.user, props.rounds_box])

    onInput = (e) => {
        let temp = round_create
        let value = e.target.value
        temp[e.target.name] = value
        setRoundCreate(temp);
    }

    onInputBlock = (e, data) => {
        let temp = round_create
        temp[data.type] = data.value;
        setRoundCreate(round_create)
        if (data.type === 'round_tb') {
            createTableOptions(data.value)
        }
    }

    //Creates Array for table choice 
    createTableOptions = (id) => {
        const block = props.time_block.filter((v) => {
            return v._id === id
        })
        let table = [];
        for (let i = 1; i <= block[0].block_max_table; i++) {
            if (block[0].block_table.filter((v) => {
                return v == i
            }).length === 0) {
                table.push({ text: i, value: i })
                setTableOptions(table);
            }
        }
    }

    //saves a round into the db, is a callback
    onSave = () => {
        const data = round_create
        data.round_gm = props.user.profil
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
            }
            this.onCancel()
        }
    }

    //loads rounds setting
    onEdit = (round, time) => {
        setRoundCreate(round)
        setEdit_Options_time_block(options_time_block);
        time = props.time_block.filter((v) => {
            return v._id === time
        })
        edit_options_time_block.push({
            text: time[0].block_name,
            value: time[0]._id
        })
        setEdit_Options_time_block(edit_options_time_block)
    }

    onCancel = () => {
        setRoundCreate({
            _id: null,
            round_tb: '',
            round_name: 'Round Name',
            setting: 'Setting',
            ruleset: 'Rules',
            own_char: true,
            round_gm: 'Placeholder',
            round_gm_id: Meteor.userId(),
            round_curr_pl: 0,
            round_max_pl: 5,
            round_player: [],
            round_table: null
        })
        setEdit_Options_time_block([])
    }

    //destroys round in timeblock
    onDestroy = (data, time) => {
        Meteor.call('RoundDelete', data._id)
        props.onCallback({ key: time, value: true });
    }

    //joins a round
    onJoin = (data) => {
        data.round_player.push({ 'profil': props.user.profil, 'user_id': Meteor.userId() })
        data.round_curr_pl++
        Meteor.call('RoundUpdate', data)
    }

    //leaves a round
    onLeave = (data, time) => {
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
        props.onCallback({ key: time, value: true });
        Meteor.call('RoundUpdate', data)
    }

    //checks if user is player in round
    onCheck = (data, time) => {
        if (data.length !== 0) {
            for (let i = 0; i < data.length; i++) {
                if (data[i].user_id === Meteor.userId()) {
                    props.onCallback({ key: time, value: false });
                    return false;
                }
            }
        }
        return true;
    }

    //gets rounds player names to visiualize
    function onPlayers(data) {
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
        let temp = []
        if (in_round) {
            block.map((v) => {
                if (v.block_max_table < v.block_table.length) { return }
                if (in_round[v._id] === false) { return }
                temp.push({
                    text: v.block_name,
                    value: v._id
                })
                setOptions_time_block(temp)
            })
        }
    }

    roundTabControll = (id) => {
        if (roundTab !== id) {
            setRoundTab(id);
        } else {
            setRoundTab(null);
        }
    }

    //visualizes the rounds in a timeblock
    timeBlockCreate = (time) => {
        const rounds_box = props.rounds_box
        let roundtemplate = ''
        if (rounds_box.length !== 0) {
            roundtemplate = rounds_box.map((k, v) => {
                let out = '';
                if (k.round_tb === time) {
                    if (Meteor.userId() && props.user) {
                        if (props.user.bill) {
                            if (k.round_gm_id === Meteor.userId()) {
                                props.onCallback({ key: time, value: false });
                                out = <li><button className='btn btn-outline-dark' onClick={() => this.onEdit(k, time)} >Ändern</button><button className='btn btn-outline-dark' onClick={() => this.onDestroy(k, time)} >Löschen</button></li>
                            } else if (in_round[time] !== false) {
                                if (this.onCheck(k.round_player, time)) {
                                    if (k.round_curr_pl < k.round_max_pl) {
                                        out = <li><button className='btn btn-outline-dark' onClick={() => this.onJoin(k)} >Beitreten</button></li>
                                    }
                                }
                            } else {
                                if (!this.onCheck(k.round_player, time)) {
                                    out = <li><button className='btn btn-outline-dark' onClick={() => this.onLeave(k, time)} >Speichern</button></li>
                                }
                            }
                        }
                    }
                    return (
                        <div className="col-sm-6" key={v}>
                            <div className="text-center">
                                {roundTab === k._id ?
                                    round_create._id === k._id ?
                                        <RoundCreate
                                            round_create={round_create}
                                            time_block={edit_options_time_block}
                                            onInput={this.onInput}
                                            onSave={this.onSave}
                                            onInputBlock={this.onInputBlock}
                                            tableOptions={tableOptions}
                                            onCancel={this.onCancel}
                                        /> :
                                        <ul className="list-unstyled">
                                            <li onClick={() => roundTabControll(k._id)}>Runden Name = {k.round_name}</li>
                                            <li>Setting = {k.setting}</li>
                                            <li>Regelwerk = {k.ruleset}</li>
                                            <li>Spielleiter = {k.round_gm}</li>
                                            <li>Spieler Zahl/Max = {k.round_curr_pl}/{k.round_max_pl}</li>
                                            <li>Spieler Namen = {onPlayers(k.round_player)}</li>
                                            <li>Tisch = {k.round_table}</li>
                                            {out}
                                        </ul>
                                    :
                                    <div onClick={() => roundTabControll(k._id)}>{k.round_name} {k.setting} {k.round_curr_pl}/{k.round_max_pl} </div>
                                }
                            </div>
                        </div>
                    )
                }
            })
        }
        return roundtemplate
    }
    let tb = ''
    if (props.time_block.length > 0) {
        props.time_block.sort(function (a, b) {
            if (a.block_start < b.block_start) {
                return -1;
            }
            if (a.block_start > b.block_start) {
                return +1;
            }
            return 0;
        })
        tb = props.time_block.map((k) => {
            if (!k.block_table) { return }
            return (
                <div className="row" key={k._id}>
                    <div className="col-sm">
                        <div className="text-center"><h4>{k.block_name}</h4></div>
                        <div className="row">{this.timeBlockCreate(k._id)}</div>
                    </div>
                </div>
            )
        })
    }
    let rc = '';
    if (props.user) {
        if (props.user.bill && props.user.profil && (options_time_block.length > 0)) {
            rc = <RoundCreate
                round_create={round_create}
                time_block={options_time_block}
                onInput={this.onInput}
                onSave={this.onSave}
                onInputBlock={this.onInputBlock}
                tableOptions={tableOptions}
                onCancel={this.onCancel}
            />

        }
    }
    return (
        <div>
            {tb}
            Hidden Block
                {rc}
        </div >
    )
}

export default roundComponent