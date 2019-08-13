import React, { useEffect, useState } from 'react';
import { Meteor } from 'meteor/meteor';


const roundCreate = props => {
    const [name, setName] = useState('');
    const [setting, setSetting] = useState('');
    const [ruleset, setRuleset] = useState('');
    const [own_char, setOwn_char] = useState(false);
    const [max_online_pl, setMax_online_pl] = useState(0);
    const [max_pl, setMax_pl] = useState(0);
    const [desc, setDesc] = useState('');
    const [dp_tb, setDp_tb] = useState('');
    const [tb, setTb] = useState('');
    const [tbH, setTbH] = useState('Zeit Block');
    const [dp_table, setDp_table] = useState('');
    const [table, setTable] = useState(0);
    const [tableH, setTableH] = useState('Tisch');

    useEffect(() => {
        if (props.round_create) {
            setName(props.round_create.round_name);
            setSetting(props.round_create.setting);
            setRuleset(props.round_create.ruleset);
            setOwn_char(props.round_create.own_char);
            setMax_online_pl(Number(props.round_create.round_max_online_pl));
            setMax_pl(Number(props.round_create.round_max_pl));
            setDesc(props.round_create.round_desc);
            setTb(props.round_create.round_tb);
            setTable(Number(props.round_create.round_table));
            setTbH(() => {
                let out = '';
                out = props.time_block.map((v) => {
                    if (v.value === props.round_create.round_tb) {
                        return v.text
                    }
                })
                return out;
            });
            setTableH(Number(props.round_create.round_table));
        }
    }, [props.round_create])

    /**
     * calls metheor method to insert dataset into the db,
     * makes some small validation before calling
     */
    onSave = () => {
        let data = {
            round_name: name,
            setting: setting,
            ruleset: ruleset,
            own_char: own_char,
            round_max_online_pl: max_online_pl,
            round_max_pl: max_pl,
            round_desc: desc,
            round_tb: tb,
            round_table: Number(table)
        }
        event.preventDefault()
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
            if (props.round_create._id) {
                data['_id'] = props.round_create._id
                Meteor.call('RoundUpdate', data)
            } else {
                Meteor.call('RoundCreate', data);
            }
            this.onCancel()
        }
    }
    let create = '';
    if (Meteor.userId()) {
        create = <form className="was-validated">
            <div className='form-row justify-content-center'>
                <div className='form-group col-sm-2'>
                    <label>ZeitBlock</label>
                    <button
                        className='btn btn-outline-secondary dropdown-toggle'
                        data-toggle="dropdown"
                        onClick={() => setDp_tb((prev) => {
                            if (prev.length > 0) {
                                return ''
                            }
                            return ' show'
                        })}
                        type='button'
                    >{tbH}</button>
                    <div className={'dropdown-menu' + dp_tb}>
                        {props.time_block.map((v) => {
                            return <a
                                className='dropdown-item'
                                href='#'
                                onClick={() => {
                                    setDp_tb('');
                                    setTb(v.value)
                                    setTbH(v.text)
                                    props.createTableOptions(v.value);
                                }}
                                key={v.value}>{v.text}</a>
                        })}
                    </div>
                </div>
                {props.tableOptions.length > 0 ?
                    <div className='form-group col-sm-3'>
                        <label >Tisch Nummer</label>
                        <button
                            className='btn btn-outline-secondary dropdown-toggle'
                            data-toggle="dropdown"
                            onClick={() => setDp_table((prev) => {
                                if (prev.length > 0) {
                                    return ''
                                }
                                return ' show'
                            })}
                            type='button'
                        >{tableH}</button>
                        <div className={'dropdown-menu' + dp_table}>
                            {props.tableOptions.map((v) => {
                                return <a
                                    className='dropdown-item'
                                    href='#'
                                    onClick={() => {
                                        setDp_table('');
                                        setTable(v.value)
                                        setTableH(v.text)
                                    }}
                                    key={v.value}>{v.text}</a>
                            })}
                        </div>
                    </div>
                    : ''}
            </div>
            <div className='form-group row justify-content-center'>
                <label className="col-sm-3 col-form-label">
                    Runden Name
                    </label>
                <div className='col-sm-9'>
                    <input required value={name} minLength='2' maxLength='64' type='text' name='round_name' className='form-control' onChange={() => setName(event.target.value)} placeholder={props.round_create.round_name} />
                </div>
            </div>
            <div className='form-group row justify-content-center'>
                <label className="col-sm-3 col-form-label">
                    Setting
                </label>
                <div className='col-sm-9'>
                    <input required value={setting} minLength='2' maxLength='64' type='text' name='setting' className='form-control' onChange={() => setSetting(event.target.value)} placeholder={props.round_create.setting} />
                </div>
            </div>
            <div className='form-group row justify-content-center'>
                <label className="col-sm-3 col-form-label">
                    Regelwerk
                    </label>
                <div className='col-sm-9'>
                    <input required value={ruleset} minLength='2' maxLength='64' type='text' name='ruleset' className='form-control' onChange={() => setRuleset(event.target.value)} placeholder={props.round_create.ruleset} />
                </div>
            </div>
            <div className='form-group row justify-content-center'>
                <label className="col-sm-3 col-form-label">
                    Spielerplätze Maximal
                </label>
                <div className='col-sm-9'>
                    <input required value={max_pl} min='2' max='10' type='number' name='round_max_pl' className='form-control' onChange={() => setMax_pl(Number(event.target.value))} placeholder={props.round_create.round_max_pl} />
                </div>
            </div>
            <div className='form-group row justify-content-center'>
                <label className="col-sm-3 col-form-label">
                    Maximal Online Anmeldungsplätze
                </label>
                <div className='col-sm-9'>
                    <input required value={max_online_pl} min='0' max={max_pl} type='number' name='round_max_online_pl' className='form-control' onChange={() => setMax_online_pl(Number(event.target.value))} placeholder={props.round_create.round_max_online_pl} />
                </div>
            </div>
            <div className='form-group row justify-content-center'>
                <label className="col-sm-3 col-form-label">
                    Vorgefertigte Charakter
                </label>
                <div className='col-sm-9'>
                    <div className='form-check form-check-inline'>
                        <input required type='radio' name='own_char' id='inlineradiochar1' className='form-check-input' onChange={() => setOwn_char(true)} value={true} />
                        <label className="form-check-label">Ja</label>

                    </div>
                    <div className='form-check form-check-inline'>
                        <input required type='radio' name='own_char' id='inlineradiochar2' className='form-check-input' onChange={() => setOwn_char(false)} value={false} />
                        <label className="form-check-label">Nein</label>
                    </div>
                </div>
            </div>
            <div className='form-group row justify-content-center'>
                <label className="col-sm-3 col-form-label">
                    Rundenbeschreibung
                </label>
                <div className='col-sm-9'>
                    <textarea required value={desc} minLength='2' maxLength='500' type='number' name='round_desc' className='form-control' onChange={() => setDesc(event.target.value)} placeholder={props.round_create.round_desc} />
                </div>
            </div>
            <div className='form-group row justify-content-center'>
                <button className='btn btn-outline-dark col-sm-4' onClick={props.onCancel} >Abbruch</button><button className='btn btn-outline-dark col-sm-4' onClick={onSave} >Speichern</button>
            </div>
        </form >
    }
    return (
        <div>
            {create}
        </div>
    )

}

export default roundCreate;