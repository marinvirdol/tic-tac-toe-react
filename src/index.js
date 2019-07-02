import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// class Square extends React.Component {
//   render() {
//     return (
//       <button
//         className="square"
//         onClick={() => this.props.onClick({value: 'x'})}
//       >
//         {this.props.value}
//       </button>
//     );
//   }
// }

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(row, col) {
    return (
      <Square key={col}
        value={this.props.squares[row][col]}
        onClick={() => this.props.onClick(row, col)}
      />
    );
  }

  render() {
    return (
      <div>
        {
          this.props.squares.map((row, i) => {
            return (
              <div className="board-row" key={i}>
                {
                  row.map((col, j) => {
                    return this.renderSquare(i, j)
                  })
                }
              </div>
            )
          })
        }
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: [Array(3).fill(null), Array(3).fill(null), Array(3).fill(null)],
        location: {
          row: null,
          col: null
        }
      }],
      xIsNext: true,
      stepNumber: 0
    }
  }

  handleClick = (row, col) => {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[row][col]) return;

    squares[row][col] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares,
        location: {row, col}
      }]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
    });
  }

  jumpTo = (step) => {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const {row, col} = step.location;
      const desc = move ?
        'Go to move #' + move + '(' + col + ',' + row + ')' :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
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
            onClick={(row, col) => this.handleClick(row, col)}
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
    [{row: 0, col: 0}, {row: 0, col: 1}, {row: 0, col: 2}],
    [{row: 1, col: 0}, {row: 1, col: 1}, {row: 1, col: 2}],
    [{row: 2, col: 0}, {row: 2, col: 1}, {row: 2, col: 2}],
    [{row: 0, col: 0}, {row: 1, col: 0}, {row: 2, col: 0}],
    [{row: 0, col: 1}, {row: 1, col: 1}, {row: 2, col: 1}],
    [{row: 0, col: 2}, {row: 1, col: 2}, {row: 2, col: 2}],
    [{row: 0, col: 0}, {row: 1, col: 1}, {row: 2, col: 2}],
    [{row: 0, col: 2}, {row: 1, col: 1}, {row: 2, col: 0}],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a.row][a.col] && squares[a.row][a.col] === squares[b.row][b.col] && squares[a.row][a.col] === squares[c.row][c.col]) {
      return squares[a.row][a.col];
    }
  }
  return null;
}
