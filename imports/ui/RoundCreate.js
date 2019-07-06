import React, { useEffect, useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { Dropdown } from 'semantic-ui-react';


const roundCreate = props => {
    const [desc, setDesc] = useState('');

    useEffect(()=>{
        setDesc(props.round_create.round_desc)
    },[props.round_create.round_desc])

    onTextfield=(e)=>{
        setDesc(e.target.value)
        props.onInput(e);
    }

    let create = '';
    if (Meteor.userId()) {
        create = <form className="was-validated">
            <div className='form-row justify-content-center'>
                <div className='form-group col-sm-2'>
                    <label>ZeitBlock</label>
                    <Dropdown
                        placeholder='Block'
                        options={props.time_block}
                        scrolling
                        onChange={props.onInputBlock}
                        type='round_tb'
                    />
                </div>
                <div className='form-group col-sm-3'>
                    <label >Tisch Nummer</label>
                    <Dropdown
                        placeholder='Block'
                        options={props.tableOptions}
                        scrolling
                        onChange={props.onInputBlock}
                        type='round_table'
                    />
                </div>
            </div>
            <div className='form-group row justify-content-center'>
                <label className="col-sm-3 col-form-label">
                    Runden Name
                    </label>
                <div className='col-sm-9'>
                    <input type='text' name='round_name' className='form-control' onChange={props.onInput} placeholder={props.round_create.round_name} />
                </div>
            </div>
            <div className='form-group row justify-content-center'>
                <label className="col-sm-3 col-form-label">
                    Setting
                </label>
                <div className='col-sm-9'>
                    <input type='text' name='setting' className='form-control' onChange={props.onInput} placeholder={props.round_create.setting} />
                </div>
            </div>
            <div className='form-group row justify-content-center'>
                <label className="col-sm-3 col-form-label">
                    Regelwerk
                    </label>
                <div className='col-sm-9'>
                    <input type='text' name='ruleset' className='form-control' onChange={props.onInput} placeholder={props.round_create.ruleset} />
                </div>
            </div>
            <div className='form-group row justify-content-center'>
                <label className="col-sm-3 col-form-label">
                    Spielerplätze Maximal
                </label>
                <div className='col-sm-9'>
                    <input type='number' name='round_max_pl' className='form-control' onChange={props.onInput} placeholder={props.round_create.round_max_pl} />
                </div>
            </div>
            <div className='form-group row justify-content-center'>
                <label className="col-sm-3 col-form-label">
                    Maximal Online Anmeldungsplätze
                </label>
                <div className='col-sm-9'>
                    <input type='number' name='round_max_online_pl' className='form-control' onChange={props.onInput} placeholder={props.round_create.round_max_online_pl} />
                </div>
            </div>
            <div className='form-group row justify-content-center'>
                <label className="col-sm-3 col-form-label">
                    Vorgefertigte Charakter
                </label>
                <div className='col-sm-9'>
                    <div className='form-check form-check-inline'>
                        <input type='radio' name='own_char' id='inlineradiochar1' className='form-check-input' onChange={props.onInput} value='true' />
                        <label className="form-check-label">Ja</label>

                    </div>
                    <div className='form-check form-check-inline'>
                        <input type='radio' name='own_char' id='inlineradiochar2' className='form-check-input' onChange={props.onInput} value='false' />
                        <label className="form-check-label">Nein</label>
                    </div>
                </div>
            </div>
            <div className='form-group row justify-content-center'>
                <label className="col-sm-3 col-form-label">
                    Rundenbeschreibung
                </label>
                <div className='col-sm-9'>
                    <textarea required value={desc} type='number' name='round_desc' className='form-control' onChange={onTextfield} placeholder={props.round_create.round_desc}/>
                </div>
            </div>
            <div className='form-group row justify-content-center'>
                <button className='btn btn-outline-dark col-sm-4' onClick={props.onCancel} >Abbruch</button><button className='btn btn-outline-dark col-sm-4' onClick={props.onSave} >Speichern</button>
            </div>
        </form>
    }
    return (
        <div>
            {create}
        </div>
    )

}

export default roundCreate;