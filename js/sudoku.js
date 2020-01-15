class Sudoku {
  constructor() {
    this.game = this.emptyGame();
    this.generateGame();
    this.buildUI();
  }

  emptyGame() {
    const game = [];

    for (let c = 0; c < 81; c++) {
      const y1 = Math.floor(c / 27);
      const y2 = Math.floor(c / 9);
      const y3 = Math.floor(c / 3);
      const y4 = y2 - y1 * 3;
      const y5 = y3 - y2 * 3;
      const y6 = c - y3 * 3;

      game.push({
        boxRow: y1,
        boxCol: y4,
        cellRow: y5,
        cellCol: y6,
        val: undefined
      });
    }

    return game;
  }

  intersectGame(game1, game2) {
    return game1.filter((el, idx) => game2[idx].val === el.val);
  }

  generateGame() {
    for (let n = 1; n < 10; n++) {
      let emptyCells = this.intersectGame(this.game, this.emptyGame());
      let changes = [];
      for (let k = 1; k < 10; k++) {
        if (emptyCells.length > 0) {
          const idx = Math.floor(Math.random() * emptyCells.length);

          const br = emptyCells[idx].boxRow;
          const bc = emptyCells[idx].boxCol;
          const cr = emptyCells[idx].cellRow;
          const cc = emptyCells[idx].cellCol;

          for (let g = 0; g < this.game.length; g++) {
            if (this.game[g].val === undefined) {
              if (
                this.game[g].boxRow === br &&
                this.game[g].boxCol === bc &&
                this.game[g].cellRow === cr &&
                this.game[g].cellCol === cc
              ) {
                this.game[g].val = n;
              }
            }
          }

          const before = emptyCells.length;

          // for (let d = emptyCells.length - 1; d > -1; d--) {
          //   if (emptyCells[d].boxRow === br && emptyCells[d].boxCol === bc) {
          //     emptyCells.splice(d, 1);
          //     continue;
          //   }

          //   if (emptyCells[d].boxRow === br && emptyCells[d].cellRow === cr) {
          //     emptyCells.splice(d, 1);
          //     continue;
          //   }

          //   if (emptyCells[d].boxCol === bc && emptyCells[d].cellCol === cc) {
          //     emptyCells.splice(d, 1);
          //     continue;
          //   }
          // }

          emptyCells = emptyCells.filter(el => {
            if (el.boxRow == br && el.boxCol == bc) {
              return false;
            }
            if (el.boxRow == br && el.cellRow == cr) {
              return false;
            }
            if (el.boxCol == bc && el.cellCol == cc) {
              return false;
            }
            return true;
          });

          const after = emptyCells.length;
          changes.push(before - after);
        }
      }
      console.log(`[${n}] emptyCells change sequence: ${changes.join(', ')}`);
    }
    console.log(this.game);
  }

  buildUI() {
    let gameBoard = document.createElement('div');
    gameBoard.className = 'board';

    for (let i = 0; i < 3; i++) {
      let row = document.createElement('div');
      row.classList.add('box-row');
      for (let j = 0; j < 3; j++) {
        let boxContainer = document.createElement('div');
        boxContainer.classList.add(`box-col`);
        let box = document.createElement('div');
        box.classList.add(`game-box`);
        let randNum = document.createTextNode(
          (Math.floor(Math.random() * 9) + 1).toString()
        );
        box.appendChild(randNum);
        boxContainer.appendChild(box);
        row.appendChild(boxContainer);
      }
      gameBoard.appendChild(row);
    }

    let root = document.getElementById('root');
    root.appendChild(gameBoard);
  }
}

(function() {
  let sss = new Sudoku();
})();
