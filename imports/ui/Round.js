import React from 'react';

export default class Round extends React.Component {

    render() {
        var round = ''
        const { rounds } = this.props
        if (rounds.length !== 0) {
            round = rounds.map((k, v) => {
                return (
                    <div key={v}>
                        <ul>
                            <li>Name = {k.round_name}</li>
                            <li>Setting = {k.setting}</li>
                            <li>Regelwerk = {k.ruleset}</li>
                            <li>Spielleiter = {k.round_gm}</li>
                            <li>Spieler Zahl/Max = {k.round_curr_pl}/{k.round_max_pl}</li>
                            <li>Spieler Namen = {k.round_player}</li>
                        </ul>
                    </div>
                )
            })
        }
        return (
            round
        )
    }
}