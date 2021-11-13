import './App.css';
import React from 'react';

export default class App extends React.Component {

  state = {
    rows: 6,
    columns: 7,
    moves: [],
    playerTurn: 'red',
  };

  //reset board
  resetBoard = () => {
    this.setState({moves: [], winner: null });
  }

  getPiece = (x,y) => {
    const list = this.state.moves.filter((item) => {
      return (item.x === x && item.y === y)
    })
    return list[0];
  }

  // Check if a winner is found
  checkForWin = (x,y,player) => {
    let winningMoves = [{x,y}];
    // check for horizontal win on the right side
    for (let column =  x + 1; column < x + 4; column += 1) {
      const checkPiece = this.getPiece(column,y);
      if (checkPiece && checkPiece.player === player) {
        winningMoves.push({x: column, y: y});
        
      } else {
        break;
      }
    }
    // check for horizontal win on the left side
    for (let column =  x - 1; column > x - 4; column -= 1) {
      const checkPiece = this.getPiece(column,y);
      if (checkPiece && checkPiece.player === player) {
        winningMoves.push({x: column,y: y});
        
      } else {
        break;
      }
    }
    // checks for wins horizontally
    if (winningMoves.length > 3) {
      this.setState({ winner: player, winningMoves });
      return true;
    }
    // check for wins vertically up
    for (let row =  y + 1; row < y + 4; row += 1) {
      const checkPiece = this.getPiece(x, row);
      if (checkPiece && checkPiece.player === player) {
        winningMoves.push({x: x, y: row});
      } else {
        break;
      }
    }
    // check for wins vertically down
    for (let row =  y - 1; row > y - 4; row -= 1) {
      const checkPiece = this.getPiece(x, row);
      if (checkPiece && checkPiece.player === player) {
        winningMoves.push({x: x, y: row});
        
      } else {
        break;
      }
    }
    // checks for win vertically
    if (winningMoves.length > 3) {
      this.setState({ winner: player, winningMoves });
      return true;
    }
  }

  //add pieces to the board
  addMove = (x,y) => {
    const {playerTurn} = this.state;
    const nextPlayerTurn = playerTurn === 'red' ? 'yellow' : 'red'; //allow to switch players after each turn
    //checks there is an available space. The piece goes to the lowest available spot on the column
    let availableYPosition = null;
    for (let position = this.state.rows - 1; position >= 0; position--) {
      if (!this.getPiece(x, position)){
        availableYPosition = position;
        break;
      }
    }
    if (availableYPosition !== null){
      // check for a win, based on this next move
      this.setState({ moves: this.state.moves.concat({ x, y: availableYPosition, player: playerTurn }), playerTurn: nextPlayerTurn }, () => this.checkForWin(x, availableYPosition, playerTurn));
    }
  }

  //create the board
  renderBoard() {
    const { rows, columns, winner } = this.state;
    const rowViews = [];

    for (let row = 0; row < this.state.rows; row += 1) {
      const columnViews = [];
      for (let column = 0; column < this.state.columns; column += 1) {
        const piece = this.getPiece(column, row);
        columnViews.push(
          <div onClick = {() => {this.addMove(column, row)}} style = { {width: '8vw', height: '8vw', backgroundColor: '#00a8ff', display: 'flex', padding: 5, cursor: 'pointer'} }>
            <div style={{ borderRadius: '50%', backgroundColor: 'white', flex: 1, display: 'flex'}}>
              {piece ? <div style ={{ backgroundColor: piece.player, flex: 1, borderRadius: '50%', border: '1x solid #333'}} /> : undefined}
            </div>
          </div>
        );
      }
      rowViews.push(
        <div style={{ display: 'flex', flexDirection: 'row'}}>{columnViews}</div>
      )
    }
    return (
      // checks and displays winner then resets board on click.
      <div style={{ backgroundColor: 'red', display: 'flex', flexDirection: 'column'}}>
        {winner && <div onClick={this.resetBoard} style = {{ position: 'absolute', left: 0, right: 0, bottom: 0, top: 0, zIndex: 3, backgroundColor: 'rgba( 0, 0, 0, .5)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#fff', fontWeight: 200, fontSize: "8vw"}}>{`${winner} WINS!!!`}</div>} 
        {rowViews}
      </div>
    );
  }

  render() {
    const { style } = this.props;

    return (
      <div style = {style ? Object.assign({}, styles.container, style) : styles.container}>
        <div>
          {this.renderBoard()}
        </div>
      </div>
    );
  }
}

const styles = {
  container: {
    height: '100%',
    padding: 5,
    display: 'flex',
    justifyContent: 'center',
    alignment: 'center'
  }
};
