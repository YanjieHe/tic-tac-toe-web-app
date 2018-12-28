import React from 'react'
import './bootstrap.min.css'
import Square from './Square.js'

class Board extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            values: ['', '', '', '', '', '', '', '', ''],
            nextX: true,
            startX: true
        }
        this.handleClicked = this.handleClicked.bind(this)
        this.calculateGameState = this.calculateGameState.bind(this)
        this.findEmpties = this.findEmpties.bind(this)
        this.minimax = this.minimax.bind(this)
        this.searchMove = this.searchMove.bind(this)
        this.restartGame = this.restartGame.bind(this)
        this.randomlyChoose = this.randomlyChoose.bind(this)
        this.displayGameState = this.displayGameState.bind(this)
    }

    renderSquare(index, value) {
        const squareStyles = [
            {"border-left": "0px", "border-top": "0px"},
            {"border-top": "0px"},
            {"border-right": "0px", "border-top": "0px"},
            {"border-left": "0px"},
            {},
            {"border-right": "0px"},
            {"border-left": "0px", "border-bottom": "0px"},
            {"border-bottom": "0px"},
            {"border-right": "0px", "border-bottom": "0px"},
        ]
        var squareStyle = {}
        var keys = Object.keys(squareStyles[index])
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i]
            squareStyle[key] = squareStyles[index][key]
        }
        if (value === 'X') {
            value = '✖'
            squareStyle['color'] = "#545454"
        } else if (value === 'O') {
            value = '◯'
            squareStyle['color'] = "#f2ebd3"
        }
        return <Square value={value} squareStyle={squareStyle} onClicked={() => this.handleClicked(index)}/>
    }

    handleClicked(index) {
        if (this.calculateGameState(this.state.values) === "playing" && this.state.values[index] === '') {
            var values = this.state.values.slice()
            if (this.state.nextX) {
                values[index] = 'X'
            } else {
                values[index] = 'O'
            }
            var nextX = !this.state.nextX
            this.setState({values: values, nextX: nextX})
            var gameState = this.calculateGameState(values)
            if (gameState === "playing") {
                var values = values.slice()
                var player = nextX ? 'X' : 'O'
                var index = this.searchMove(values, player)
                values[index] = player
                this.setState({
                        values: values, nextX: !nextX, startX: this.state.startX
                    }
                )
            }
        }
    }

    randomlyChoose() {
        var values = ['', '', '', '', '', '', '', '', '']
        values[Math.floor(Math.random() * this.state.values.length)] = 'O'
        return values
    }

    restartGame() {
        var gameState = this.calculateGameState(this.state.values)
        if (gameState === "playing") {
            this.setState({
                    values: ['', '', '', '', '', '', '', '', ''],
                    nextX: true,
                    startX: this.state.startX
                }
            )
        } else {
            this.setState({
                    values: !this.state.startX ? ['', '', '', '', '', '', '', '', ''] : this.randomlyChoose(),
                    nextX: true,
                    startX: !this.state.startX
                }
            )
        }
    }

    calculateGameState(values) {
        const lines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];
        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            if (values[a] && values[a] === values[b] && values[a] === values[c]) {
                if (values[a] === 'X') {
                    return 'X wins!'
                } else {
                    return 'O wins!'
                }
            }
        }
        for (let i = 0; i < values.length; i++) {
            if (values[i] === '') {
                return "playing"
            }
        }
        return "tie"
    }

    findEmpties(values) {
        var empties = []
        for (var i = 0; i < values.length; i++) {
            if (values[i] === '') {
                empties.push(i)
            }
        }
        return empties
    }

    searchMove(values, player) {
        var empties = this.findEmpties(values)
        var result = []
        for (var i = 0; i < empties.length; i++) {
            var emptyIndex = empties[i]
            values[emptyIndex] = player
            result.push(this.minimax(values, player === 'X' ? 'O' : 'X'))
            values[emptyIndex] = ''
        }
        for (var i = 0; i < result.length; i++) {
            if (player === 'X' && result[i] === 'X wins!') {
                return empties[i]
            } else if (player === 'O' && result[i] === 'O wins!') {
                return empties[i]
            }
        }
        for (var i = 0; i < result.length; i++) {
            if (result[i] === 'tie') {
                return empties[i]
            }
        }
        return empties[0]
    }

    minimax(values, player) {
        var gameState = this.calculateGameState(values)
        if (gameState === 'playing') {
            var empties = this.findEmpties(values)
            var result = []
            for (var i = 0; i < empties.length; i++) {
                var emptyIndex = empties[i]
                values[emptyIndex] = player
                result.push(this.minimax(values, player === 'X' ? 'O' : 'X'))
                values[emptyIndex] = ''
            }
            for (var i = 0; i < result.length; i++) {
                if (player === 'X' && result[i] === 'X wins!') {
                    return result[i]
                } else if (player === 'O' && result[i] === 'O wins!') {
                    return result[i]
                }
            }
            for (var i = 0; i < result.length; i++) {
                if (result[i] === 'tie') {
                    return result[i]
                }
            }
            return result[0]
        } else {
            return gameState
        }
    }

    displayGameState() {
        var gameState = this.calculateGameState(this.state.values)
        if (gameState !== "playing") {
            return "Game over: " + gameState
        } else {
            return ""
        }
    }

    render() {
        return (
            <div>
                {/*<h3>Next player: {this.state.nextX ? 'X' : 'O'}</h3>*/}
                <legend>
                    <span style={{float: "left"}}>PLAYER (X)</span><span style={{float: "right"}}>COMPUTER (O)</span>
                </legend>
                <table className="table">
                    <thead>
                    </thead>
                    <tbody>
                    <tr style={{background: "#14bdac"}}>
                        <td>
                            <div className="board-row">
                                {this.renderSquare(0, this.state.values[0])}
                                {this.renderSquare(1, this.state.values[1])}
                                {this.renderSquare(2, this.state.values[2])}
                            </div>
                            <div className="board-row">
                                {this.renderSquare(3, this.state.values[3])}
                                {this.renderSquare(4, this.state.values[4])}
                                {this.renderSquare(5, this.state.values[5])}
                            </div>
                            <div className="board-row">
                                {this.renderSquare(6, this.state.values[6])}
                                {this.renderSquare(7, this.state.values[7])}
                                {this.renderSquare(8, this.state.values[8])}
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <button type="button" className="btn btn-primary btn-lg btn-block"
                                onClick={this.restartGame}>RESTART GAME
                        </button>
                    </tr>
                    </tbody>
                </table>
                <h3>{this.displayGameState()}</h3>
            </div>
        )
    }
}

export default Board