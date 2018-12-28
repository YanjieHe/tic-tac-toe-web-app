import React from 'react'
import './Game.css'

class Square extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            value: null,
        };
    }

    render() {
        return (
            <button className="square" style={this.props.squareStyle} onClick={this.props.onClicked}>
                {this.props.value}
            </button>
        )
    }
}

export default Square