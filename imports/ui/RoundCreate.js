import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Dropdown } from 'semantic-ui-react';


export default class RoundCreate extends React.Component {
    render() {
        const { loginToken, time_block, round_create, onSave, onInput, onInputBlock } = this.props
        var create = '';
        if (Meteor.userId()) {
            create = <div>
                <ul>
                    <li>
                        ZeitBlock<Dropdown
                            placeholder='Block'
                            options={Array.from(time_block)}
                            scrolling
                            onChange={onInputBlock}
                            type='round_tb'
                        />
                    </li>
                    <li>Runden Name<input type='text' name='round_name' onChange={onInput} placeholder={round_create.round_name} /></li>
                    <li>Setting<input type='text' name='setting' onChange={onInput} placeholder={round_create.setting} /></li>
                    <li>Regelwerk <input type='text' name='ruleset' onChange={onInput} placeholder={round_create.ruleset} /></li>
                    <li>Spieler Max <input type='text' name='round_max_pl' onChange={onInput} placeholder={round_create.round_max_pl} /></li>
                    <li><button onClick={onSave} >Save</button></li>
                </ul>
            </div>
        }
        return (
            <div>
                {create}
            </div>
        )
    }
}
