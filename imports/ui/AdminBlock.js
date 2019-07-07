import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import Adminblockform from './AdminBlockForm';

const adminBlock = props => {



    //deletes timebock from state and updates mongo
    onBlockDelete = (v) => {
        Meteor.call('BlockDelete', v._id);
    }

    timeblockClick = (data) => {
        console.log(data)
    }

    let blocks = '';
    if (props.timeblock.length > 0) {
        // if(timeblock.length > 1){}
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
                <div key={k._id} onClick={() => this.timeblockClick(k)}>
                    <li>{k.block_name}</li>
                    <button onClick={() => this.onBlockDelete(k)} >Destroy</button>
                </div>
            )
        })
    }

    return (
        <div className='col-sm-9'>
            {blocks}
            <Adminblockform event={props.event} />
        </div>
    )

}

export default adminBlock