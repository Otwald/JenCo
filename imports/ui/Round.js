import React, { useState, useEffect } from 'react';
import { Meteor } from 'meteor/meteor';

import RoundCreate from './RoundCreate';

const roundComponent = props => {

    //Vorgefertigten Charaktere

    const [round_create, setRoundCreate] = useState({
        _id: null,
        round_tb: '',
        round_name: '',
        setting: '',
        ruleset: '',
        own_char: true,
        round_gm: 'Placeholder',
        round_gm_id: '',
        round_max_online_pl: 0,
        round_curr_pl: 0,
        round_max_pl: 0,
        round_desc: '',
        round_player: [],
        round_table: null
    })
    const [edit_options_time_block, setEdit_Options_time_block] = useState([]);
    const [options_time_block, setOptions_time_block] = useState([]);
    const [in_round, setIn_round] = useState([]);
    const [tableOptions, setTableOptions] = useState([]);
    const [blockTab, setBlockTab] = useState(null);
    const [extendR, setExtendR] = useState('');
    const [addBlock, setAddBlock] = useState(false);
    const [gm, setGm] = useState({});


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
        console.log(data)
        if (check) {
            if (data._id) {
                Meteor.call('RoundUpdate', data)
            } else {
                Meteor.call('RoundCreate', data);
            }
            this.onCancel()
        }
    }

    /**
    * loads rounds setting
    */
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
            round_max_online_pl: 0,
            round_max_pl: 5,
            round_desc: '',
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

    blockTabControll = (id) => {
        if (blockTab !== id) {
            setBlockTab(id);
        } else {
            setBlockTab(null);
        }
    }

    onExtendRound = (k, v) => {
        if (k._id == extendR) {
            setExtendR('');
        } else {
            setExtendR(k._id);
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
                            Meteor.call('CheckGM', k._id, (err, res)=>{
                                setGm((prev)=>{
                                    prev[k._id] = res;
                                    return prev;
                                })
                            })
                            if (gm[k._id] == true) {
                                props.onCallback({ key: time, value: false });
                                out = <div className='row'>
                                    <button className='btn btn-outline-dark col-sm-4' onClick={() => this.onEdit(k, time)} >Ändern</button>
                                    <button className='btn btn-outline-dark col-sm-4' onClick={() => this.onDestroy(k, time)} >Löschen</button>
                                </div>
                            } else if (in_round[time] !== false) {
                                if (this.onCheck(k.round_player, time)) {
                                    if (k.round_curr_pl < k.round_max_pl) {
                                        out = <div className='row'>
                                            <button className='btn btn-outline-dark col-sm-4' onClick={() => this.onJoin(k)} >Beitreten</button>
                                        </div>
                                    }
                                }
                            } else {
                                if (!this.onCheck(k.round_player, time)) {
                                    out = <div className='row'>
                                        <button className='btn btn-outline-dark col-sm-4' onClick={() => this.onLeave(k, time)} >Austreten</button>
                                    </div>
                                }
                            }
                        }
                    }
                    let expand = ''
                    let content =
                        <div className='row ' onClick={() => onExtendRound(k, v)}>
                            <div className="col-sm-2">
                                {/* place for the Icon */}
                                <div className="text-center">
                                    <strong>{k.round_table}</strong>
                                </div>
                            </div>
                            <div className='col-sm-10'>
                                <div className="text-left">
                                    <div className='row'>
                                        <label className="col-sm-4">Runden Name</label>
                                        <div className='col-sm-8 text-muted'>
                                            {k.round_name}
                                        </div>
                                    </div>
                                    {extendR !== k._id ? '' :
                                        <React.Fragment>
                                            <div className='row text-left'>
                                                <label className='col-sm-4'>Spielleiter</label>
                                                <div className='col-sm-8 text-muted' >{k.round_gm}</div>
                                            </div>
                                        </React.Fragment>
                                    }
                                    <div className='row'>
                                        <label className='col-sm-4'>Setting</label>
                                        <div className='col-sm-8 text-muted'>{k.setting}</div>
                                    </div>
                                    <div className='row'>
                                        <label className='col-sm-4'>Regelwerk</label>
                                        <div className='col-sm-8 text-muted'>{k.ruleset}</div>
                                    </div>
                                    <div className='row'>
                                        <label className='col-sm-4'>Spieler Online Curr/Max</label>
                                        <div className='col-sm-8 text-muted'>{k.round_curr_pl}/{k.round_max_online_pl}</div>
                                    </div>
                                    {extendR !== k._id ? '...' :
                                        <React.Fragment>
                                            <div className='row'>
                                                <label className='col-sm-4'>Teilnehmer</label>
                                                <div className='col-sm-8 text-muted'>{onPlayers(k.round_player)}</div>
                                            </div>
                                            <div className='row text-left'>
                                                <label className='col-sm-4'>maximale Spieler</label>
                                                <div className='col-sm-8 text-muted'>{k.round_max_pl}</div>
                                            </div>
                                            <div className='row text-left'>
                                                <label className='col-sm-4'>Vorgefertigte Charaktere</label>
                                                <div className='col-sm-8 text-muted' >{JSON.parse(k.own_char) ? 'Ja' : 'Nein'}</div>
                                            </div>
                                            <div className='row text-left'>
                                                <label className='col-sm-4'>Rundenbeschreibung</label>
                                                <div className='col-sm-8 text-muted'>{k.round_desc}</div>
                                            </div>
                                        </React.Fragment>
                                    }
                                    {out}
                                </div>
                            </div >
                        </div>
                    if (round_create._id === k._id) {
                        content = <RoundCreate
                            round_create={round_create}
                            time_block={edit_options_time_block}
                            onInput={this.onInput}
                            onSave={this.onSave}
                            onInputBlock={this.onInputBlock}
                            tableOptions={tableOptions}
                            onCancel={this.onCancel}
                        />
                    }
                    return (
                        <div className="col-sm-6" key={v}>
                            {content}
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
            let round = ''
            round = this.timeBlockCreate(k._id)
            return (
                <div className="row" key={k._id}>
                    <div className="col-sm">
                        <div className="text-center row" onClick={() => blockTabControll(k._id)}>
                            <h4 className="col-sm-4">{k.block_name}</h4>
                            <div className='col-sm-3'>
                                <label>Tische</label> <a className='text-muted' >{k.block_table.length}/{k.block_max_table}</a>
                            </div>

                        </div>
                        {blockTab === k._id ? <div className="row">{round}</div> : ''}
                    </div>
                </div>
            )
        })
    }
    let rc = '';
    if (props.user) {
        if (props.user.bill && props.user.profil && (options_time_block.length > 0)) {
            if (addBlock === true) {
                rc = <RoundCreate
                    round_create={round_create}
                    time_block={options_time_block}
                    onInput={this.onInput}
                    onSave={this.onSave}
                    onInputBlock={this.onInputBlock}
                    tableOptions={tableOptions}
                    onCancel={this.onCancel}
                />
            } else {
                <div className='row justify-content-center'>
                    <button className='btn btn-outline-dark col-sm-4' onClick={() => setAddBlock(!addBlock)} >Neue Runde Hinzufügen</button>
                </div>
            }

        }
    }
    return (
        <React.Fragment>
            {tb}
            {rc}
        </React.Fragment>
    )
}

export default roundComponent