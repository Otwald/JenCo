import React, { useEffect, useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { Dropdown } from 'semantic-ui-react';


const roundCreate = props => {

    const [tableOptions, setTableOptions] = useState([]);
    useEffect(() => {
        setTableOptions(props.tableOptions);
        return (()=>{
            setTableOptions([]);
        })
    }, [props.time_block, props.round_create, props.tableOptions])
    let create = '';
    if (Meteor.userId()) {
        create = <div>
            <ul>
                <li>
                    ZeitBlock<Dropdown
                        placeholder='Block'
                        options={props.time_block}
                        scrolling
                        onChange={props.onInputBlock}
                        type='round_tb'
                    />
                </li>
                <li>
                    Tisch Nummer
                    <Dropdown
                        placeholder='Block'
                        options={props.tableOptions}
                        scrolling
                        onChange={props.onInputBlock}
                        type='round_table'
                    />
                </li>
                <li>Runden Name<input type='text' name='round_name' onChange={props.onInput} placeholder={props.round_create.round_name} /></li>
                <li>Setting<input type='text' name='setting' onChange={props.onInput} placeholder={props.round_create.setting} /></li>
                <li>Regelwerk <input type='text' name='ruleset' onChange={props.onInput} placeholder={props.round_create.ruleset} /></li>
                <li>Spieler Max <input type='text' name='round_max_pl' onChange={props.onInput} placeholder={props.round_create.round_max_pl} /></li>
                <li><button onClick={props.onSave} >Save</button></li>
            </ul>
        </div>
    }
    return (
        <div>
            {create}
        </div>
    )

}

export default roundCreate;