import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button
      className="square"
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {

  renderSquare(col, row, index) {
    return (
      <Square
        value={this.props.squares[index]}
        onClick={() => this.props.onClick(col, row, index)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0, 0, 0)}
          {this.renderSquare(1, 0, 1)}
          {this.renderSquare(2, 0, 2)}
        </div>
        <div className="board-row">
          {this.renderSquare(0, 1, 3)}
          {this.renderSquare(1, 1, 4)}
          {this.renderSquare(2, 1, 5)}
        </div>
        <div className="board-row">
          {this.renderSquare(0, 2, 6)}
          {this.renderSquare(1, 2, 7)}
          {this.renderSquare(2, 2, 8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        col: null,
        row: null,
        selected: false,
      }],
      xIsNext: true,
      stepNumber: 0,
    };
  }

  handleClick(col, row, index) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[index]) return;

    squares[index] = this.state.xIsNext ? 'X' : 'O';

    this.setState({
      history: history.concat([{squares, col, row, selected: false}]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
    })
  }

  jumpTo(step) {
    this.setState({
      history: this.state.history.map((s, move) => move === step ? {...s, ...{selected: true}} : {...s, ...{selected: false}}),
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc =  move ?
        `Go to move #${move}; col: ${step.col}; row: ${step.row} `:
        'Go to game start';

      const boldStyle = step.selected ? {fontWeight: 'bold'} : {};

      return (
        <li key={move} style={boldStyle}>
          <button onClick={() => this.jumpTo(move)}>
            <span style={boldStyle}>{desc}</span>
          </button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(col, row, index) => this.handleClick(col, row, index)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
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
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
