class Sudoku {
  constructor() {
    // Initialize the "game" property of the
    // class instance to a new empty game.
    this.game = this.emptyGame();
    // Populate the "game" property with a
    // randomly generated game.
    this.generateGame();
    // Construct the DOM elements required to
    // play the game.
    this.buildUI();
  }

  emptyGame() {
    // Create the root of the game's data structure.
    let empty = [];
    for (let i = 0; i < 9 * 9; i++) {
      // Push 81 elements into "empty"
      empty.push({
        idx: i,
        val: undefined
      });
    }
    return empty;
  }

  getEmptyCells() {
    // Conditionally return elements that are empty (undefined).
    return this.emptyGame().filter((el, idx) => this.game[idx].val === el.val);
  }

  generateGame() {
    /**
     * Outline of Refactor
     *
     * Step 1: copy local slice of current game state.
     * Step 2: parse each 3x3 box from the game state.
     * Step 3: look for any rows or columns that are full.
     * Step 4: accumulate full rows / columns.
     * Step 5: insert values of "n+1" into rows / columns of boxes that align with step 4.
     * Step 6: once step 5 is complete, insert values of "n+1" into all other rows / columns.
     */
    /**
     * Redacted previous code commented below for reference until replaced
     */
    // for (let n = 0; n < 9; n++) {
    //   // For each value "n", we must create a snapshot of the
    //   // remaining available cells that are empty (undefined).
    //   let cells = this.getEmptyCells();
    //   for (let k = 0; k < 9; k++) {
    //     // We must iterate "k" times to store the required number of
    //     // occurrences of the value "n + 1" within the game board.
    //     let row = cells.filter(el => {
    //       // Filter the cells whose boxRow and cellRow match those
    //       // described by the iteration "k" and the "idx" property
    //       // of element "el".
    //       let boxRow = Math.floor(el.idx / 27);
    //       let y2 = Math.floor(el.idx / 9);
    //       let y3 = Math.floor(el.idx / 3);
    //       let cellRow = y3 - y2 * 3;
    //       if (
    //         boxRow === Math.floor(k / 3) &&
    //         cellRow === k - Math.floor(k / 3) * 3
    //       ) {
    //         // Return any element within "cells" that resides within
    //         // the targeted row.
    //         return true;
    //       }
    //       return false;
    //     });
    //     if (row.length > 0) {
    //       // Randomly select a cell within the row.
    //       let c = Math.floor(Math.random() * row.length);
    //       // Point to the in-game "idx" we have randomly selected.
    //       let gameIdx = row[c].idx;
    //       // Parse coordinates for the position "gameIdx".
    //       let gameBR = Math.floor(gameIdx / 27);
    //       let gameY2 = Math.floor(gameIdx / 9);
    //       let gameY3 = Math.floor(gameIdx / 3);
    //       let gameBC = gameY2 - gameBR * 3;
    //       let gameCC = gameIdx - gameY3 * 3;
    //       /** NOTE:
    //        * - Logically, if we look for aligned columnar entries
    //        *   ahead of our current position and don't find any,
    //        *   they cannot contain "n + 1" because of the top down
    //        *   population.
    //        *
    //        * - Also logically, if we are lower than box row 0 during
    //        *   this search, any filled columns containing "n + 1" are
    //        *   occluded by the algorithm and can be safely ignored.
    //        *
    //        * - This allows us to just use "cells" to filter out
    //        *   these values, looking for a given box number.
    //        */
    //       if (gameBR < 2) {
    //         let boxCells = row.filter(el => {
    //           let bc = Math.floor(el.idx / 9);
    //           let br = Math.floor(el.idx / 27);
    //           if (bc - br * 3 === gameBC) {
    //             return true;
    //           }
    //           return false;
    //         });
    //         console.log('1. BOX CELLS:');
    //         boxCells.forEach(el => {
    //           console.log(el.idx);
    //         });
    //         let indices = [];
    //         for (let chk = 0; chk < boxCells.length; chk++) {
    //           // Go through each column in this box in this row.
    //           let chkCC =
    //             boxCells[chk].idx - Math.floor(boxCells[chk].idx / 3) * 3;
    //           let slotsRemaining = cells.filter(el => {
    //             let br = Math.floor(el.idx / 27);
    //             let bc = Math.floor(el.idx / 9);
    //             let cc = el.idx - Math.floor(el.idx / 3) * 3;
    //             if (
    //               br === gameBR + 1 &&
    //               bc === gameBC &&
    //               cc === chkCC &&
    //               el.val === undefined
    //             ) {
    //               return true;
    //             }
    //             return false;
    //           });
    //           if (slotsRemaining.length === 0) {
    //             indices.push(boxCells[chk].idx);
    //             console.log('2. SLOTS REMAINING:');
    //             slotsRemaining.forEach(el => {
    //               console.log(el.idx);
    //             });
    //           }
    //         }
    //         if (indices.length > 0) {
    //           console.log('3. INDICES:');
    //           indices.forEach(el => {
    //             console.log(el);
    //           });
    //           if (indices.length === 1) {
    //             gameIdx = indices[0];
    //           } else {
    //             let rand = Math.floor(Math.random() * indices.length);
    //             gameIdx = indices[rand];
    //           }
    //         }
    //         console.log('4. gameIdx:');
    //         console.log(gameIdx);
    //         console.log('5. GAME:');
    //         this.printGame();
    //       }
    //       // Otherwise...
    //       // Place "n + 1" at the correct address.
    //       this.game[gameIdx].val = n + 1;
    //       cells = cells.filter(el => {
    //         // Filter the cells that do not reside within the box where
    //         // "n + 1" was placed, or within the column that aligns with the
    //         // populated cell.
    //         let boxRow = Math.floor(el.idx / 27);
    //         let y2 = Math.floor(el.idx / 9);
    //         let y3 = Math.floor(el.idx / 3);
    //         let boxCol = y2 - boxRow * 3;
    //         let cellCol = el.idx - y3 * 3;
    //         if (
    //           !(boxRow === Math.floor(k / 3) && boxCol === gameBC) &&
    //           !(boxCol === gameBC && cellCol === gameCC)
    //         ) {
    //           return true;
    //         }
    //         return false;
    //       });
    //     }
    //   }
    // }
    //this.printGame();
  }

  printGame() {
    let output = [];
    let newLine = [];

    for (let x = 0; x < 9 * 9; x++) {
      let boxRow = Math.floor(x / 27);
      let y2 = Math.floor(x / 9);
      let y3 = Math.floor(x / 3);
      let boxCol = y2 - boxRow * 3;
      let cellRow = y3 - y2 * 3;
      let cellCol = x - y3 * 3;
      newLine.push(
        String(
          +this.game[cellCol + cellRow * 9 + boxCol * 3 + boxRow * 27].val
        ).substring(0, 1)
      );
      if (newLine.length === 3 || newLine.length === 7) {
        newLine.push('|');
      } else if (newLine.length === 11) {
        output.push(newLine.join(' '));
        newLine = [];
      } else if (output.length === 3 || output.length === 7) {
        output.push('------+-------+------');
      }
    }
    console.log(output.join('\n'));
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
