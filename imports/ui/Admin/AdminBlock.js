import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import Adminblockform from './AdminBlockForm';

const adminBlock = props => {

    const [activeBlock, setActiveBlock] = useState('');
    const [edit, setEdit] = useState('');

    //deletes timebock from state and updates mongo
    onBlockDelete = (v) => {
        Meteor.call('BlockDelete', v._id);
    }

    timeblockClick = (data) => {
        if (activeBlock == data._id) {
            setActiveBlock('');
        } else {
            setActiveBlock(data._id);
        }
    }

    /**
     * calls getStringDate and getStringClock
     * and builds one Date Format from it
     */
    getStringTime = (timestamp) => {
        let out = getStringDate(timestamp);
        let min = getStringClock(timestamp)
        out += ' ' + min;
        return out
    }

    /**
     * takes timestamp and extracts the date as an string
     * the form is Weekday 01.01
     * @param Number timestamp 
     * @return String
     */
    getStringDate = (timestamp) => {
        let date = new Date(timestamp);
        let out = '';
        const week = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
        out += week[date.getDay()] + ' ' + date.getDate() + '.' + (date.getMonth() + 1) + '.'
        return out;
    }

    /**
     * takes timestamp and extracts clocktime
     * returns it as a string
     * @param Number timestamp 
     * @return String
     */
    getStringClock = (timestamp) => {
        let date = new Date(timestamp);
        let min = date.getMinutes();
        let hour = date.getHours();
        if (min < 10) {
            min = '0' + min;
        }
        if (hour < 10) {
            hour = '0' + hour;
        }
        out = hour + ':' + min;
        return out
    }

    /**
     * resets the states to hide AdminBlockForm
     */
    onCancelButton = () => {
        event.preventDefault()
        setEdit('');
    }

    let blocks = '';
    if (props.timeblock.length > 0) {
        props.timeblock.sort(function (a, b) {
            if (a.block_start < b.block_start) {
                return -1;
            }
            if (a.block_start > b.block_start) {
                return +1;
            }
            return 0;
        })
        blocks = props.timeblock.map((k, v) => {
            return (
                <React.Fragment key={k._id}>
                    {edit == k._id ?
                        (props.event ?
                            <li className='row list-group-item'>
                                <Adminblockform
                                    event={props.event}
                                    block={k}
                                    getStringDate={getStringDate}
                                    getStringClock={getStringClock}
                                    onCancelButton={onCancelButton}
                                />
                            </li>
                            : 'Keine Event Information vorhanden'
                        )
                        :
                        <React.Fragment>
                            <li className={'row list-group-item' + (k._id == activeBlock ? ' active' : '')} key={k._id} onClick={() => this.timeblockClick(k)}>
                                <h4 className='text-center'><strong >{k.block_name}</strong></h4>
                                <p className='text-center'>
                                    <span className='col-sm-3'><strong>Start:</strong>{getStringTime(k.block_start)}</span>
                                    <span className='col-sm-3'><strong>Ende:</strong>{getStringTime(k.block_end)}</span>
                                    <span className='col-sm-3'><strong>Spielblock: </strong>{k.block_pnp ? 'Ja' : 'Nein'}</span>
                                    <span className='col-sm-3'><strong>Tisch:</strong>{k.block_table.length}/{k.block_max_table}</span>
                                </p>
                            </li>
                            {k._id == activeBlock ?
                                <div className='row justify-content-center'>
                                    <button className='btn btn-outline-dark col-sm-4' onClick={() => this.onBlockDelete(k)} >Löschen</button>
                                    <button className='btn btn-outline-dark col-sm-4' onClick={() => setEdit((prev) => { if (prev != k._id) { return k._id } })} >Editieren</button>
                                </div>
                                : ''}
                        </React.Fragment>
                    }
                </React.Fragment>
            )
            // 
        })
    }
    return (
        <div className='col-sm-9'>
            <ul className='list-group'>
                {blocks}
            </ul>
            {edit == 'new' ?
                <Adminblockform
                    event={props.event}
                    onCancelButton={onCancelButton}
                />
                :
                (props.event ?
                    <div className='row justify-content-center'>
                        <button className='btn btn-outline-dark col-sm-4' onClick={() => setEdit('new')} >Neuer Block</button>
                    </div>
                    : 'Keine Event Information vorhanden'
                )
            }
        </div>
    )

}

export default adminBlock