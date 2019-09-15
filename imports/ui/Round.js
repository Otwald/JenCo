import React, { useState, useEffect, useRef } from 'react';
import { Meteor } from 'meteor/meteor';

import RoundCreate from './RoundCreate';

const roundComponent = props => {
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
    const [rounds_box, setRounds_box] = useState([]);
    const [tableOptions, setTableOptions] = useState({});
    const [blockTab, setBlockTab] = useState(null);
    const [extendR, setExtendR] = useState('');
    const [addBlock, setAddBlock] = useState(false);
    const [gm, setGm] = useState({});
    const [player, setPlayer] = useState({});
    const [booked_tb, setBooked_tb] = useState([]);


    useEffect(() => {
        onCheck()
        return (() => {
            setGm({});
            setPlayer({});
            setBooked_tb({});
            setOptions_time_block({});
        })
    }, [props.time_block, props.in_round])

    /**
     * calls Server to build arrays freom checks if user is gm in given round, if user still cann book something in a timeblock usw
     */
    onCheck = () => {
        Meteor.call('GetRounds', ((err, resp) => {
            if (!err) {
                setRounds_box(resp);
            }
        }));
        Meteor.call('Check', (err, res) => {
            if (!err) {
                setGm(res.gm);
                setPlayer(res.player);
                setOptions_time_block(res.timeoptions)
                setBooked_tb(res.booked);
            }
        })
    }

    onInput = (e) => {
        let temp = round_create
        let value = e.target.value
        temp[e.target.name] = value
        setRoundCreate(temp);
    }

    /**
     *  Creates Array for table choice form a given timeblock,
     * for roundcreate dropdown
     * @param String id the id of the timeblock
     * @return Array
     */
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

    /**
    * loads rounds setting and adds this timeblock to the possible options of
    * timeblocks, to allow switching between them
    * @param States round /todo what is it?
    * @param Array time is array of timeblocks 
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

    /**
     * resets States to cancel the input of a new round
     */
    onCancel = () => {
        event.preventDefault()
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
        setEdit_Options_time_block([]);
        setAddBlock('');
    }

    //destroys round in timeblock
    onDestroy = (data, time) => {
        Meteor.call('RoundDelete', data._id)
        props.onCallback({ key: time, value: true });
    }

    /**
     * sends Request to server to add player into player_id array
     * @param String id the id of the Round where you want to add a player
     */
    onJoin = (id) => {
        Meteor.call('RoundAddPlayer', id)
        onPlayerUpdate(id);
        onCheck();
    }

    /**
     * takes the id of an round and sends request to the server to remove player from player_ids
     * @param String id
     */
    onLeave = (id, time) => {
        props.onCallback({ key: time, value: true });
        Meteor.call('RoundRemovePlayer', id)
        onPlayerUpdate(id);
        onCheck();
    }

    /**
     * small helper to recheck after changes if player is in a round or not
     * @param String id
     */
    onPlayerUpdate = (id) => {
        Meteor.call('CheckPlayer', id, (err, res) => {
            setPlayer((prev) => {
                prev[id] = res;
                return prev;
            })
        })
    }

    //gets rounds player names to visiualize
    function onPlayers(data) {
        let out = '';
        if (data) {
            out = out.concat(Object.keys(data).map((k) => {
                return data + ', '
            }))
        }
        return out
    }

    /**
     * rounds over every timeblock and checks if there are still
     * tables free
     * and if the user is already booked for an table
     * if not adds the timeblock to possible options
     * @param Array block holds all possble timeblocks
     */
    timeOptions = () => {
        let temp = []
        props.time_block.map((v) => {
            let test = v._id;;
            if (booked_tb[test]) {
                console.log('test');
            }
            if (v.block_max_table < v.block_table.length) { return }
            if (booked_tb[v._id] === true) { return }
            temp.push({
                text: v.block_name,
                value: v._id
            })
            setOptions_time_block(temp)
        })

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
        let roundtemplate = ''
        if (rounds_box.length !== 0) {
            roundtemplate = rounds_box.map((k, v) => {
                let out = '';
                if (k.round_tb === time) {
                    if (Meteor.userId() && props.user) {
                        if (props.user.profile.bill) {
                            if (gm[k._id] == true) {
                                props.onCallback({ key: time, value: false });
                                out = <div className='row'>
                                    <button className='btn btn-outline-dark col-sm-4' onClick={() => this.onEdit(k, time)} >Ändern</button>
                                    <button className='btn btn-outline-dark col-sm-4' onClick={() => this.onDestroy(k, time)} >Löschen</button>
                                </div>
                            } else if (player[k._id] === true) {
                                out = <div className='row'>
                                    <button className='btn btn-outline-dark col-sm-4' onClick={() => this.onLeave(k._id, time)} >Austreten</button>
                                </div>
                            } else {
                                if (booked_tb[k.round_tb] == false) {
                                    if (k.round_curr_pl < k.round_max_pl) {
                                        out = <div className='row'>
                                            <button className='btn btn-outline-dark col-sm-4' onClick={() => this.onJoin(k._id)} >Beitreten</button>
                                        </div>
                                    }
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
                            createTableOptions={createTableOptions}
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
                    createTableOptions={createTableOptions}
                    tableOptions={tableOptions}
                    onCancel={this.onCancel}
                />
            } else {
                rc = <div className='row justify-content-center'>
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