class Sudoku {
  constructor() {
    this.game = this.emptyGame();
    this.generateGame();
    this.buildUI();
  }

  emptyGame() {
    let game = { boxRow: [] };

    for (let br = 0; br < 3; br++) {
      game.boxRow.push({
        row: br,
        boxCol: []
      });

      for (let bc = 0; bc < 3; bc++) {
        game.boxRow[br].boxCol.push({
          col: bc,
          cellRow: []
        });

        for (let cr = 0; cr < 3; cr++) {
          game.boxRow[br].boxCol[bc].cellRow.push({
            row: cr,
            cellCol: []
          });

          for (let cc = 0; cc < 3; cc++) {
            game.boxRow[br].boxCol[bc].cellRow[cr].cellCol.push({
              col: cc,
              val: undefined
            });
          }
        }
      }
    }

    return game;
  }

  intersectGame(game1, game2) {
    let xGame = undefined;

    let boxRowData = undefined;
    let boxColData = undefined;
    let cellRowData = undefined;
    let cellColData = undefined;

    let len1 = game1.boxRow.length;

    for (let br = 0; br < len1; br++) {
      boxRowData = undefined;
      let len2 = game1.boxRow[br].boxCol.length;

      for (let bc = 0; bc < len2; bc++) {
        boxColData = undefined;
        let len3 = game1.boxRow[br].boxCol[bc].cellRow.length;

        for (let cr = 0; cr < len3; cr++) {
          cellRowData = undefined;
          let len4 = game1.boxRow[br].boxCol[bc].cellRow[cr].cellCol.length;

          for (let cc = 0; cc < len4; cc++) {
            cellColData = undefined;
            let v1 = game1.boxRow[br].boxCol[bc].cellRow[cr].cellCol[cc].val;
            let v2 = game2.boxRow[br].boxCol[bc].cellRow[cr].cellCol[cc].val;

            if (v1 == v2) {
              cellColData = game1.boxRow[br].boxCol[bc].cellRow[cr].cellCol[cc];

              if (cellRowData === undefined) {
                cellRowData = {
                  row: game1.boxRow[br].boxCol[bc].cellRow[cr].row,
                  cellCol: []
                };
              }

              cellRowData.cellCol.push(cellColData);
            }
          }
          if (cellRowData !== undefined) {
            if (boxColData === undefined) {
              boxColData = {
                col: game1.boxRow[br].boxCol[bc].col,
                cellRow: []
              };
            }

            boxColData.cellRow.push(cellRowData);
          }
        }
        if (boxColData !== undefined) {
          if (boxRowData === undefined) {
            boxRowData = {
              row: game1.boxRow[br].row,
              boxCol: []
            };
          }

          boxRowData.boxCol.push(boxColData);
        }
      }
      if (boxRowData !== undefined) {
        if (xGame === undefined) {
          xGame = {
            boxRow: []
          };
        }

        xGame.boxRow.push(boxRowData);
      }
    }

    if (xGame === undefined) {
      xGame = [];
    }

    return xGame;
  }

  generateGame() {
    /**
     * For each number on the game board, iterate 9 times.
     *
     * Each iteration returns only the available slots remaining
     * after intersecting the state of the game with an empty
     * game.
     *
     * If there is only one row or one column left, only take
     * the last remaining index in the given dimension of the
     * 2D array.
     *
     * Because we need to decode true coordinates from the
     * intersection of the arrays, we extract the "row" and
     * "col" properties of the object stored at location (r, c).
     *
     * Store a value of n+1 (1 to 9) into the "val" property
     * of the object stored at location (trueRow, trueCol).
     */

    for (let n = 1; n < 10; n++) {
      // Take a snapshot of the intersection between the state of the
      // generated game and an empty game.

      // emptyCells will contain only the remaining locations where
      // "n" can be stored, as indicated by the embedded row/col
      // coordinates.
      let emptyCells = this.intersectGame(this.emptyGame(), this.game);
      for (let k = 1; k < 10; k++) {
        let br,
          brRef,
          brLen,
          bc,
          bcRef,
          bcLen,
          cr,
          crRef,
          crLen,
          cc,
          ccRef,
          ccLen,
          trueBoxRow,
          trueBoxCol,
          trueCellRow,
          trueCellCol,
          brDest,
          bcDest,
          crDest,
          ccDest = undefined;

        if (emptyCells.boxRow.length > 0) {
          // Grab a random box row.
          brLen = emptyCells.boxRow.length;
          br = brLen > 1 ? Math.floor(Math.random() * brLen) : 0;
          brRef = emptyCells.boxRow[br];
          trueBoxRow = brRef.row;
          if (brRef.boxCol.length > 0) {
            // Grab a random box column.
            bcLen = brRef.boxCol.length;
            bc = bcLen > 1 ? Math.floor(Math.random() * bcLen) : 0;
            bcRef = brRef.boxCol[bc];
            trueBoxCol = bcRef.col;
            if (bcRef.cellRow.length > 0) {
              // Grab a random cell row.
              crLen = bcRef.cellRow.length;
              cr = crLen > 1 ? Math.floor(Math.random() * crLen) : 0;
              crRef = bcRef.cellRow[cr];
              trueCellRow = crRef.row;
              if (crRef.cellCol.length > 0) {
                // Grab a random cell column.
                ccLen = crRef.cellCol.length;
                cc = ccLen > 1 ? Math.floor(Math.random() * ccLen) : 0;
                ccRef = crRef.cellCol[cc];
                trueCellCol = ccRef.col;
                // Point to the true coordinates before storing "n".
                brDest = this.game.boxRow[trueBoxRow];
                bcDest = brDest.boxCol[trueBoxCol];
                crDest = bcDest.cellRow[trueCellRow];
                ccDest = crDest.cellCol[trueCellCol];
                ccDest.val = n;
                console.log(
                  `Placed value ${n} into coordinates: box => (${trueBoxRow}, ${trueBoxCol}), cell => (${trueCellRow}, ${trueCellCol}) under iteration ${k}.\n\n`
                );
              }
            }
          }
        }
        // * * * Collisions * * *
        // We must check all the data for possible collisions of value
        // and remove them to prevent them from happening.
        let tempBR = [];
        let tempBC = [];
        let tempCR = [];
        let tempCC = [];

        brLen = emptyCells.boxRow.length;
        for (br = 0; br < brLen; br++) {
          brRef = emptyCells.boxRow[br];
          bcLen = brRef.boxCol.length;
          let brCollision = brRef.row === trueBoxRow;
          for (bc = 0; bc < bcLen; bc++) {
            bcRef = brRef.boxCol[bc];
            crLen = bcRef.cellRow.length;
            let bcCollision = bcRef.col === trueBoxCol;
            for (cr = 0; cr < crLen; cr++) {
              crRef = bcRef.cellRow[cr];
              ccLen = crRef.cellCol.length;
              let crCollision = crRef.row === trueCellRow;
              for (cc = 0; cc < ccLen; cc++) {
                ccRef = crRef.cellCol[cc];
                let ccCollision = ccRef.col === trueCellCol;
                if (
                  !brCollision &&
                  !bcCollision &&
                  !crCollision &&
                  !ccCollision
                ) {
                  tempCC.push({
                    col: ccRef.col,
                    val: ccRef.val
                  });
                }
              } // end iteration of cell column.
              if (tempCC.length > 0) {
                tempCR.push({
                  row: crRef.row,
                  cellCol: tempCC
                });
              }
            } // end iteration of cell row.
            if (tempCR.length > 0) {
              tempBC.push({
                col: bcRef.col,
                cellRow: tempCR
              });
            }
          } // end iteration of box column.
          if (tempBC.length > 0) {
            tempBR.push({
              row: brRef.row,
              boxCol: tempBC
            });
          }
        } // end iteration of box row.
        if (tempBR.length > 0) {
          emptyCells.boxRow = tempBR;
        }
      }
    }
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
