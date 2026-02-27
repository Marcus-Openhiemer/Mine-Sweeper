const table = document.getElementById('table');
const easyModeGrid = [];

for (let i = 0; i < 10; i++) {
    const gridRow = new Array(10).fill(0);
    easyModeGrid.push(gridRow);
}

function displayTable(gridRows, gridCols) {
    for(let row = 0; row < gridRows; row++) {
        for(let col = 0; col < gridCols; col++) {
            const tile = document.createElement('div');
            tile.classList.add('tile', 'tile--unopened');
            if(easyModeGrid[row][col] !== 'b' && easyModeGrid[row][col] !== 0)
                tile.innerHTML = `<p class="tile__number">${easyModeGrid[row][col]}</p>`
            else if (easyModeGrid[row][col] === 'b')
                tile.innerHTML = `<img src="img/bomb.png" alt="">`;
            tile.dataset.row = row;
            tile.dataset.col = col;
            table.appendChild(tile);
        }
    }
}

function initializeBombs(bombs, array) {
    let bombCount = 0;
    while(bombCount !== bombs) {
        let bombRow = Math.floor(Math.random() * (array[0].length));
        let bombCol = Math.floor(Math.random() * (array.length));
        if(array[bombRow][bombCol] !== 'b') {
            array[bombRow][bombCol] = 'b';
            bombCount++;
        }
    }
}

function countBombs(gridRow, gridCol, grid) {
    let numberOfBombs = 0;
    for (let i = gridRow - 1; i <= gridRow + 1; i++) 
        for (let j = gridCol - 1; j <= gridCol + 1; j++) {
            if((i < 0 || i > grid.length - 1 ) || (j < 0 || j > grid[0].length - 1)) continue;
            if(grid[i][j] === 'b')
                numberOfBombs++;
    }

    return numberOfBombs;
}

function initializeGridCells (grid) {
    for(let gridRow = 0; gridRow < grid.length; gridRow++) {
        for(let gridCol = 0; gridCol < grid[0].length; gridCol++) {
            if(grid[gridRow][gridCol] === 'b') continue;
            
            grid[gridRow][gridCol] = countBombs(gridRow,gridCol,grid);
        }
    }
}

function revealTiles(row, col) {
    if((row < 0 || row >= easyModeGrid.length) || (col < 0 || col >= easyModeGrid[0].length))
        return;

    const tile = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);

    if(!tile.classList.contains('tile--opened') && !tile.classList.contains('tile--unopened--flagged'))
        tile.classList.replace('tile--unopened', 'tile--opened');
    else
        return;

    if(easyModeGrid[row][col] === 'b') {
        alert('BOOM! Game Over!');
        revealBombs();
    }

    if(easyModeGrid[row][col] === 0)
        for(let i = row -1; i <= row + 1; i++)
            for(let j = col - 1; j <= col + 1; j++) {
                if(i === row && j === col) 
                    continue;
                revealTiles(i,j);
            }
}

function revealBombs() {
    for (let row = 0; row < easyModeGrid.length; row++) {
        for(let col = 0; col < easyModeGrid[0].length; col++) {
            if(easyModeGrid[row][col] === 'b') {
                const tile = document.querySelector(`[data-row='${row}'][data-col='${col}']`);
                tile.classList.remove('tile--unopened');
                tile.classList.remove('tile--unopened--flagged');
                tile.classList.add('tile--opened');
                table.style.pointerEvents = 'none';
            }
        }
    }
}

function isGameOver() {
    const unopenedTiles = document.querySelectorAll('.tile--unopened, .tile--unopened--flagged');
    return unopenedTiles.length === 10;
}

initializeBombs(10, easyModeGrid);
initializeGridCells(easyModeGrid);
displayTable(10, 10);

const tiles = document.getElementsByClassName('tile');
for(let tile of tiles) {
    tile.addEventListener('click', () => {
        const r = parseInt(tile.dataset.row);
        const c = parseInt(tile.dataset.col);
        revealTiles(r,c);
        if(isGameOver()) {
            alert("you won");
            revealBombs();
        }
    })

    tile.addEventListener('contextmenu', (event) => {
        event.preventDefault();
        let isFlagged = tile.classList.contains('tile--unopened--flagged');
        let isUnopened = tile.classList.contains('tile--unopened');
        if(!isFlagged && isUnopened) {
            tile.oldContent = tile.innerHTML;
            tile.classList.replace('tile--unopened', 'tile--unopened--flagged');
            tile.innerHTML = `<img src="img/flag.png" alt="">`;
        }
        else if (isFlagged){
            tile.classList.replace('tile--unopened--flagged', 'tile--unopened');
            tile.innerHTML = tile.oldContent;
        }
    })
}

