import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Dropdown } from 'semantic-ui-react';

export default class AdminBlock extends React.Component {
    state = {

        block_create: {
            block_name: 'null',
            block_pnp: false,
            block_start: null,
            block_end: null,
            block_table: null,
        },
        date: {
            start: null,
            end: null,
        },
        time: {
            start: null,
            end: null,
        }

    }

    //creates timeblock for rounds
    onBlockCreate = (e) => {
        let temp = this.state.block_create;
        if (e.target.name === 'block_pnp') {
            e.target.value = !temp[e.target.name];
        }
        temp[e.target.name] = e.target.value
        this.setState({ block_create: temp })
    }

    //saves timeblock into state and updates mongo
    onBlockSave = () => {
        let temp = this.state.block_create;
        if (temp.block_name.length === 0) {
            return
        }
        if (this.state.date.start === null || this.state.date.end === null) {
            return
        }
        if (this.state.time.start === null || this.state.time.end === null) {
            return
        }
        temp.block_start = this.state.date.start + this.state.time.start;
        temp.block_end = this.state.date.end + this.state.time.end
        if (temp.block_start > temp.block_end) {
            return
        }
        Meteor.call('BlockCreate', temp)
    }

    //deletes timebock from state and updates mongo
    onBlockDelete = (v) => {
        Meteor.call('BlockDelete', v._id);
    }

    onDateInput = (e, data) => {
        let temp = this.state.date
        temp[data.type] = data.value
        this.setState({ date: temp });
    }

    onTimeInput = (e) => {
        let time = '1970-01-01T' + e.target.value + 'Z'
        let temp = this.state.time
        temp[e.target.name] = new Date(time).getTime() - 1000 * 60 * 60 * 2
        this.setState({ time: temp });
    }

    // Builds an Array of valid Dates from the Event, to Build the Event Timetable
    inBetweenTime = (start, end) => {
        const week = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
        start = new Date(start).getTime();
        end = new Date(end).getTime();
        let out = []
        let temp = new Date();
        for (let i = start; i <= end;) {
            temp = new Date(i);
            let text = week[temp.getDay()] + ' ' + temp.getDate() + '.' + (temp.getMonth() + 1)
            out.push({ value: i, text: text })
            i = i + 60 * 60 * 24 * 1000;
        }
        return out;
    }

    timeblockClick = (data) => {
        console.log(data)
    }

    render() {
        let blocks = '';
        const { event, timeblock } = this.props
        if (timeblock.length > 0) {
            // if(timeblock.length > 1){}
            timeblock.sort(function (a, b) {
                if (a.block_start < b.block_start) {
                    return -1;
                }
                if (a.block_start > b.block_start) {
                    return +1;
                }
                return 0;
            })
            blocks = timeblock.map((k, v) => {
                return (
                    <div key={k._id} onClick={() => this.timeblockClick(k)}>
                        <li>{k.block_name}</li>
                        <button onClick={() => this.onBlockDelete(k)} >Destroy</button>
                    </div>
                )
            })
        }

        return (
            <ul>
                {blocks}
                <li>Name <input type='text' name='block_name' onChange={this.onBlockCreate} placeholder='Hier Namen einfügen' /></li>
                <li>Zeit Start
                    <Dropdown
                        placeholder='Tag'
                        search
                        options={this.inBetweenTime(event.e_start, event.e_end)}
                        scrolling
                        onChange={this.onDateInput}
                        type='start'
                    />
                    <input type='time' name='start' onChange={this.onTimeInput} />
                </li>
                <li>
                    Zeit Länge
                    <Dropdown
                        placeholder='Tag'
                        search
                        options={this.inBetweenTime(event.e_start, event.e_end)}
                        scrolling
                        onChange={this.onDateInput}
                        type='end'
                    />
                    <input type='time' name='end' onChange={this.onTimeInput} />
                </li>
                <li>Tisch Anzahl <input type='number' name='block_table' onChange={this.onBlockCreate} /></li>
                <li>Spielblock <input type='checkbox' name='block_pnp' onChange={this.onBlockCreate} /></li>
                <li><button onClick={this.onBlockSave} >Add</button><br /></li>
            </ul>
        )
    }
}