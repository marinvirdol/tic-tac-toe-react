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
      <Square key={index}
        value={this.props.squares[index]}
        onClick={() => this.props.onClick(col, row, index)}
      />
    );
  }

  render() {
    let index = -1;
    const boardRows = Array(3).fill(null).map((br, row) => {
      const columns = Array(3).fill(null).map((rc, col) => {
        index += 1;
        return this.renderSquare(col, row, index);
      });
      return (
        <div className="board-row" key={index}>
          {columns}
        </div>
      );
    });
    return (
      <div>{boardRows}</div>
    );
  }
}

class Move extends React.Component {
  render() {
    const desc = this.props.step.move ?
      `Go to move #${this.props.step.move}; col: ${this.props.step.col}; row: ${this.props.step.row} `:
      'Go to game start';
    const boldStyle = this.props.step.selected ? {fontWeight: 'bold'} : {};
    return (
      <li style={boldStyle}>
        <button onClick={() => this.props.onSelect(this.props.step.move)}>
          <span style={boldStyle}>{desc}</span>
        </button>
      </li>
    );
  }
}

class Moves extends React.Component {
  render() {
    const moves = this.props.history.map((step, move) => {
      return (
        <Move key={move} step={step} onSelect={(move) => this.props.onSelect(move)}></Move>
      );
    });
    return (
      <ol>
        {moves}
      </ol>
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
        move: 0
      }],
      xIsNext: true,
      stepNumber: 0,
      ascending: true
    };
  }

  handleClick(col, row, index) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[index]) return;

    squares[index] = this.state.xIsNext ? 'X' : 'O';

    const unSelectMoves = history.map(h => ({...h, ...{selected: false}}));

    this.setState({
      history: unSelectMoves.concat([{squares, col, row, selected: false, move: history.length}]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
    })
  }

  jumpTo(step) {
    this.setState({
      history: this.state.history.map((s, move) => s.move === step ? {...s, ...{selected: true}} : {...s, ...{selected: false}}),
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  handleSort() {
    const unSelectMoves = this.state.history.map(h => ({...h, ...{selected: false}}));
    this.setState({
      history: unSelectMoves.sort((a, b) => this.state.ascending ? b.move - a.move : a.move - b.move),
      ascending: !this.state.ascending,
      stepNumber: 0
    })
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

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
          <button type="button" onClick={() => this.handleSort()}>Sort {this.state.ascending ? 'Descending' : 'Ascending'}</button>
          <div>{status}</div>
          <Moves history={history} onSelect={(step) => this.jumpTo(step)}></Moves>
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
