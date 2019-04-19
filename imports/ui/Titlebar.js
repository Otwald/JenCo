import React from 'react';

export default class Titlebar extends React.Component{
    render(){
        return(
            <div className="Titlebar">
                {this.props.label}
            </div>
            
        )
    }
}