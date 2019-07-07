import React, { useState } from 'react';

const adminblockform = props => {
    const [time, setTime] = useState({
        start: null,
        end: null
    })
    const [date, setDate] = useState({
        start: null,
        end: null
    })
    const [phTime, setPhTime] = useState({
        start: 'Start',
        end: 'Ende'
    })
    const [showdp_start, setShowdp_start] = useState('');
    const [showdp_end, setShowdp_end] = useState('');
    const [block_create, setBlock_create] = useState({
        block_name: 'null',
        block_pnp: false,
        block_start: null,
        block_end: null,
        block_table: [],
        block_max_table: 0
    })

    /**
     * saves timeblock into state and calls a Meteor Method
     * after some small valdiations
     */
    onBlockSave = () => {
        let temp = block_create;
        console.log(temp);
        if (temp.block_name.length === 0) {
            return
        }
        if (date.start === null || date.end === null) {
            return
        }
        if (time.start === null || time.end === null) {
            return
        }
        temp.block_start = date.start + time.start;
        temp.block_end = date.end + time.end
        if (temp.block_start > temp.block_end) {
            return
        }
        Meteor.call('BlockCreate', temp)
    }

    onBlockCancel = () => {

    }

    /**
     * Builds an Array of valid Dates from the Event, to Build the Event Timetable
     * takes Dates in Form of TimeStamps
     * 
     * @param Number start 
     * @param Number end
     */
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

    onTimeInput = (e) => {
        let time = '1970-01-01T' + e.target.value + 'Z'
        let temp = time
        temp[e.target.name] = new Date(time).getTime() - 1000 * 60 * 60 * 2
        setTime(temp);

    }

    return (
        <div className='row'>
            <form className='col-sm-7'>
                <div className='form-row'>
                    <div className='input-group mb-3'>
                        <span className='input-group-prepend input-group-text col-sm-3'>Name</span>
                        <input
                            className='form-control'
                            type='text'
                            name='block_name'
                            onChange={() => setBlock_create((prev) => {
                                prev.block_name = event.target.value;
                                return prev
                            })}
                            placeholder='Hier Namen einfügen'
                        />
                    </div>
                </div>
                <div className='form-row'>
                    <div className='input-group mb-3'>
                        <button
                            className='btn btn-outline-secondary dropdown-toggle col-sm-3'
                            data-toggle="dropdown"
                            onClick={() => setShowdp_start((prev) => {
                                if (prev.length > 0) {
                                    return ''
                                }
                                return ' show'
                            })}
                            type='button'
                        >{phTime.start}</button>
                        <div className={'dropdown-menu' + showdp_start}>
                            {inBetweenTime(props.event.e_start, props.event.e_end).map((v) => {
                                return <a
                                    className='dropdown-item'
                                    href='#'
                                    onClick={() => {
                                        setShowdp_start('');
                                        setDate((prev) => {
                                            prev.start = Number(v.value)
                                            return prev
                                        })
                                        setPhTime((prev) => {
                                            prev.start = (v.text)
                                            return prev
                                        })
                                    }}
                                    key={v.value}>{v.text}</a>
                            })}
                        </div>
                        <input className='form-control' type='time' name='start' onChange={this.onTimeInput} />
                    </div>
                </div>
                <div className='form-row'>
                    <div className='input-group mb-3'>
                        <button
                            className='btn btn-outline-secondary dropdown-toggle col-sm-3'
                            data-toggle="dropdown"
                            onClick={() => setShowdp_end((prev) => {
                                if (prev.length > 0) {
                                    return ''
                                }
                                return ' show'
                            })}
                            type='button'
                        >{phTime.end}</button>
                        <div className={'dropdown-menu' + showdp_end}>
                            {inBetweenTime(props.event.e_start, props.event.e_end).map((v) => {
                                return <a
                                    className='dropdown-item'
                                    href='#'
                                    onClick={() => {
                                        setShowdp_end('');
                                        setDate((prev) => {
                                            prev.end = Number(v.value)
                                            return prev
                                        })
                                        setPhTime((prev) => {
                                            prev.end = v.text
                                            return prev
                                        })
                                    }}
                                    key={v.value}>{v.text}</a>
                            })}
                        </div>
                        <input className='form-control' type='time' name='end' onChange={this.onTimeInput} />
                    </div>
                </div>
                <div className='form-row'>
                    <div className='input-group mb3'>
                        <span className='input-group-prepend input-group-text col-sm-3'>Tisch Anzahl</span>
                        <input
                            className='form-control'
                            type='number'
                            name='block_max_table'
                            onChange={() => setBlock_create((prev) => {
                                prev.block_max_table = Number(event.target.value)
                                return prev
                            })}
                        />
                    </div>
                </div>
                <div className='form-row'>
                    <div className='input-group mb3'>
                        <span className='input-group-prepend input-group-text col-sm-3'>Spielblock</span>
                        <input
                            className='form-control col-sm-1'
                            type='checkbox'
                            name='block_pnp'
                            onChange={() => setBlock_create((prev) => {
                                prev.block_pnp = JSON.parse(prev.block_pnp);
                                return prev;
                            })}
                        /></div>
                </div>
                <div className='form-row justify-content-center'>
                    <button className='btn btn-outline-dark col-sm-4' onClick={this.onBlockCancel} >Abbrechen</button>
                    <button className='btn btn-outline-dark col-sm-4' onClick={this.onBlockSave} >Speichern</button>
                </div>
            </form>
        </div>
    )
}

export default adminblockform