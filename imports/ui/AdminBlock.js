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
            start: 28800000,
            end: 28810000,
        },
        time: {
            start: 1558656000000,
            end: 1558656000000,
        }

    }

    //creates timeblock for rounds
    onBlockCreate = (e) => {
        var temp = this.state.block_create;
        if (e.target.name === 'block_pnp') {
            e.target.value = !temp[e.target.name];
        }
        temp[e.target.name] = e.target.value
        console.log(temp);
        this.setState({ block_create: temp })
    }

    //saves timeblock into state and updates mongo
    onBlockSave = () => {
        var temp = this.state.block_create;
        if (temp.block_name.length === 0) {
            return
        }
        if (temp.block_table === 0) {
            return
        }
        if (this.state.date.start === null || this.state.date.end === null) {
            return
        }
        if (this.state.time.start === null || this.state.date.end === null) {
            return
        }
        temp.block_start = this.state.date.start + this.state.time.start;
        temp.block_end = this.state.date.end + this.state.time.end
        if (temp.block_start > temp.block_end) {
            return
        }
        Meteor.call('BlockCreate', temp)
        // temp.tb.push({ text: this.state.block_create, value: temp.tb.length })
        // this.setState({ settings: temp });
        // this.onSave()
    }

    //deletes timebock from state and updates mongo
    onBlockDelete = (v) => {
        var temp = this.state.settings;
        var a_slice = []
        temp.tb.splice(v, 1);
        temp.tb.map((k, v) => {
            a_slice.push({ text: k.text, value: v })
        })
        temp.tb = a_slice
        this.setState({ settings: temp });
        this.onSave()
    }

    onDateInput = (e, data) => {
        var temp = this.state.date
        temp[data.type] = data.value
        this.setState({ date: temp });
    }

    onTimeInput = (e) => {
        var time = '1970-01-01T' + e.target.value + 'Z'
        var temp = this.state.time
        temp[e.target.type] = new Date(time).getTime() - 1000 * 60 * 60 * 2
        this.setState({ time: temp });
    }

    // Builds an Array of valid Dates from the Event, to Build the Event Timetable
    inBetweenTime = (start, end) => {
        const week = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
        start = new Date(start).getTime();
        end = new Date(end).getTime();
        var out = []
        var temp = new Date();
        for (var i = start; i <= end;) {
            temp = new Date(i);
            var text = week[temp.getDay()] + ' ' + temp.getDate() + '.' + (temp.getMonth() + 1)
            out.push({ value: i, text: text })
            i = i + 60 * 60 * 24 * 1000;
        }
        return out;
    }

    // lengthOptions = () => {
    //     var out = [];
    //     var time = new Date('1970-01-01T00:00Z');
    //     var timestamp = time.getTime();
    //     var hours = time.getHours();
    //     var min = time.getMinutes();
    //     console.log(min)
    //     for (var i = 0; i <= 6; i++) {
    //         out.push({
    //             value: timestamp
    //         });
    //         timestamp += 1000*60*15
    //     }
    //     return [{ value: 2 * 60 * 60 * 100, text: '2:00' }]
    // }

    render() {
        var blocks = '';
        const { event } = this.props
        if (event) {
            if (event.tb.length > 0) {
                blocks = event.tb.map((k, v) => {
                    return (
                        <div key={v}>
                            <li>{k.text}<button onClick={() => this.onBlockDelete(v)} >Destroy</button> </li>
                        </div>
                    )
                })
            }
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
                    <input type='time' name='block_start' onChange={this.onTimeInput} />
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
                    <input type='time' name='block_end' onChange={this.onTimeInput} />
                </li>
                <li>Tisch Anzahl <input type='number' name='block_table' onChange={this.onBlockCreate} /></li>
                <li>Spielblock <input type='checkbox' name='block_pnp' onChange={this.onBlockCreate} /></li>
                <li><button onClick={this.onBlockSave} >Add</button><br /></li>
            </ul>
        )
    }
}