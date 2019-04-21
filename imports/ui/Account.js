import React from 'react';

import { Dropdown } from 'semantic-ui-react';

import 'semantic-ui-css/semantic.min.css'

export default class Account extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            account: {
                profil: null,
                real_name: null,
                age: null,
                email: null,
            },
            date: {
                day: null,
                month: null,
                year: null
            },
            validemail: null,
        }
    }

    onInput = (e) => {
        var temp = this.state.account
        var value = e.target.value
        temp[e.target.name] = value
        this.setState({ account: temp })
        // if (e.target.name === 'email') {
        //     if (value.includes('@')) {
        //         var substr = value.split('@')
        //         if (substr[1].includes('.')) {
        //             this.setState({ validemail: true })
        //         }
        //         else {
        //             this.setState({ validemail: false })
        //         }
        //     }
        //     else {
        //         this.setState({ validemail: false })
        //     }
        // }
    }

    onDateInput = (e, data) => {
        var temp = this.state.date
        temp[data.type] = data.value
        this.setState({ date: temp })
    }

    // timeCount=(min, max)=>{
    //     var out = [];
    //     while(min <= max){
    //         var item = <a className="dropdown-item" href="#" key={min}>{min}</a>
    //         out.push(item)
    //         min++
    //     }
    //     return (
    //         <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
    //         {out}
    //         </div>
    //     )
    // }

    timeCount = (min, max) => {
        var out = [];
        while (max >= min) {
            var item = { key: max, text: max, value: max }
            out.push(item)
            max--
        }
        return out
    }

    onSave = () => {
        console.log('speichern')
    }

    render() {
        var emaivalid = '';
        const today = new Date()
        const { validemail } = this.state

        if (validemail === false) {
            emaivalid = 'Email hat keine valide Form';
        }
        return (
            <div>
                <ul>
                    Account Content
                    <li>Profil Name<input type='text' name='profil' onChange={this.onInput} /></li>
                    <li>Real Name<input type='text' name='real_name' onChange={this.onInput} /></li>
                    <li>Alter =
                        <Dropdown
                            placeholder='Tage'
                            options={this.timeCount(1, 31)}
                            scrolling
                            onChange={this.onDateInput}
                            type='day'

                        />
                        <Dropdown
                            placeholder='Monate'
                            options={this.timeCount(1, 12)}
                            scrolling
                            onChange={this.onDateInput}
                            type='month'

                        />

                        <Dropdown
                            placeholder='Jahr'
                            search
                            options={this.timeCount(1900, today.getFullYear())}
                            scrolling
                            onChange={this.onDateInput}
                            type='year'
                        />
                        {/* <div className="dropdown">
                        <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Days
                        </button>
                        {this.timeCount(1,31)}
                    </div> */}
                    </li>
                    {/* <li>Alter<select name='days' multiple value={[0,1]} onChange={this.onInput}/></li>
                    <li>Alter<select id='simple' name='days' multiple onChange={this.onInput}>
                    {this.timeCount(1,31)}
                    </select>
                    </li> */}
                    <li>Veranstaltungsinfo per E-Mail<input type='text' name='email' /></li>

                    {/* <li>E-Mail ändern<input type='text' name='email' onChange={this.onInput} />{emaivalid}</li> */}
                    <li><button onClick={this.onSave} >Save</button></li>
                </ul>
            </div>
        )
    }
}