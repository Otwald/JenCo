import React, { useEffect, useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { Dropdown } from 'semantic-ui-react';


const roundCreate = props => {

    const [tableOptions, setTableOptions] = useState([]);
    useEffect(() => {
        setTableOptions(props.tableOptions);
        return (() => {
            setTableOptions([]);
        })
    }, [props.time_block, props.round_create, props.tableOptions])
    let create = '';
    if (Meteor.userId()) {
        create = <form>
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
                <label className="col-sm-2 col-form-label">
                    Runden Name
                    </label>
                <div className='col-sm-10'>
                    <input type='text' name='round_name' className='form-control' onChange={props.onInput} placeholder={props.round_create.round_name} />
                </div>
            </div>
            <div className='form-group row justify-content-center'>
                <label className="col-sm-2 col-form-label">
                    Setting
                </label>
                <div className='col-sm-10'>
                    <input type='text' name='setting' className='form-control' onChange={props.onInput} placeholder={props.round_create.setting} />
                </div>
            </div>
            <div className='form-group row justify-content-center'>
                <label className="col-sm-2 col-form-label">
                    Regelwerk
                    </label>
                <div className='col-sm-10'>
                    <input type='text' name='ruleset' className='form-control' onChange={props.onInput} placeholder={props.round_create.ruleset} />
                </div>
            </div>
            <div className='form-group row justify-content-center'>
                <label className="col-sm-2 col-form-label">
                    Spieler Max
                </label>
                <div className='col-sm-10'>
                    <input type='text' name='round_max_pl' className='form-control' onChange={props.onInput} placeholder={props.round_create.round_max_pl} />
                </div>
            </div>
            <button className='btn btn-outline-dark' onClick={props.onCancel} >Abbruch</button><button className='btn btn-outline-dark' onClick={props.onSave} >Speichern</button>
        </form>
    }
    return (
        <div>
            {create}
        </div>
    )

}

export default roundCreate;