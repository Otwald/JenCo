import React from 'react';

import Welcome from './Welcome';
export default class Sidebar extends React.Component{
    render(){
        return(
            <div className="Sidebar">
                <ul>
                    <li>Sidebar</li>
                    <li><Welcome/></li>
                </ul>
                
            </div>
            
        )
    }
}