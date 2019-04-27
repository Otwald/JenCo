import React from 'react';

export default class Admin extends React.Component{

    onInput(){

    }

    render(){
        return (
            <div>
                Event Start<input type='text' name='ruleset' onChange={this.onInput}/>
                Event End<input type='text' name='ruleset' onChange={this.onInput}/>
                Event Location<input type='text' name='ruleset' onChange={this.onInput}/>
                Timeblocks<input type='text' name='ruleset' onChange={this.onInput}/>
                Table<input type='text' name='ruleset' onChange={this.onInput}/>
            </div>
        )
    }
}