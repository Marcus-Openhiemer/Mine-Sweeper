const table = document.getElementById('table');
const grid = [];
const level = document.getElementById('selectLevel');

const bombCount = document.getElementById('bomb-count');
let currentFlag = 0;

const timerDisplay = document.getElementById('timer');
let timerInterval;
let isTimerRunning = false;
let seconds = 0;

function startTimer() {
    if(isTimerRunning) return;
    isTimerRunning = true;
    timerInterval = setInterval(() => {
        seconds++;
        updateTimerDisplay();
    }, 1000);
}

function resetTimer() {
    stopTimer();
    seconds = 0;
    updateTimerDisplay();
}

function stopTimer() {
    isTimerRunning = false;
    clearInterval(timerInterval);
}

function updateTimerDisplay() {
    let mins = Math.floor(seconds / 60).toString().padStart(2,'0');
    let secs = Math.floor(seconds % 60).toString().padStart(2,'0');
    timerDisplay.textContent = `${mins}:${secs}`;
}

function displayRemainingBombs() {
    bombCount.textContent = grid.totalBombs - currentFlag;
}

function makeGrid(row) {
    for (let i = 0; i < row; i++) {
        const gridRow = new Array(10).fill(0);
        grid.push(gridRow);
    }
}

function displayTable(gridRows, gridCols) {
    for(let row = 0; row < gridRows; row++) {
        for(let col = 0; col < gridCols; col++) {
            const tile = document.createElement('div');
            tile.classList.add('tile', 'tile--unopened');
            if(grid[row][col] !== 'b' && grid[row][col] !== 0)
                tile.innerHTML = `<p class="tile__number">${grid[row][col]}</p>`
            else if (grid[row][col] === 'b')
                tile.innerHTML = `<img src="img/bomb.png" alt="">`;
            tile.dataset.row = row;
            tile.dataset.col = col;
            designNumbers(tile);
            table.appendChild(tile);
        }
    }
}

function designNumbers(tile) {
    const p = tile.querySelector('.tile__number');
    if(!p) return;
    const number = parseInt(p.textContent);
    if(number === 1) p.style.color = '#5E34EA';
    if(number === 2) p.style.color = '#218B25';
    if(number === 3) p.style.color = '#FF0C00';
    if(number === 4) p.style.color = '#740532';
    if(number === 5) p.style.color = '#17A34A';
    if(number === 6) p.style.color = '#B91557';
    if(number === 7) p.style.color = '#9A23A2';
    if(number === 8) p.style.color = '#0F139B';
}

// Display grid based on the level chosen
function selectLevel() {
    const selectedLevel = level.value;
    let rows;
    let cols;
    resetTimer();
    currentFlag = 0;

    if(selectedLevel === 'beginner') {
        rows = 10;
        cols = 10;
        grid.totalBombs = 12;
    }
    else if(selectedLevel === 'intermediate') {
        rows = 13;
        cols = 10;
        grid.totalBombs = 22;
    }
    else if(selectedLevel === 'advance') {
        rows = 17;
        cols = 10;
        grid.totalBombs = 35;
    }
    table.innerHTML = '';
    table.style.pointerEvents = 'auto';
    grid.length = 0;

    makeGrid(rows);
    initializeBombs(grid.totalBombs, grid);
    initializeGridCells(grid);
    displayTable(rows,cols);
    displayRemainingBombs();
    updateTimerDisplay();
    addEventListeners();
}

function initializeBombs(bombs, array) {
    let bombCount = 0;
    while(bombCount !== bombs) {
        let bombRow = Math.floor(Math.random() * (array.length));
        let bombCol = Math.floor(Math.random() * (array[0].length));
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
    if((row < 0 || row >= grid.length) || (col < 0 || col >= grid[0].length))
        return;

    const tile = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);

    if(!tile || tile.classList.contains('tile--opened') || tile.classList.contains('tile--unopened--flagged'))
        return;
    tile.classList.remove('tile--unopened');
    tile.classList.add('tile--opened');

    if(grid[row][col] === 'b') {
        stopTimer();
        alert('BOOM! Game Over!');
        revealBombs();
    }

    if(grid[row][col] === 0)
        for(let i = row -1; i <= row + 1; i++)
            for(let j = col - 1; j <= col + 1; j++) {
                if(i === row && j === col) 
                    continue;
                revealTiles(i,j);
            }
}

function revealBombs() {
    for (let row = 0; row < grid.length; row++) {
        for(let col = 0; col < grid[0].length; col++) {
            if(grid[row][col] === 'b') {
                const tile = document.querySelector(`[data-row='${row}'][data-col='${col}']`);
                if(tile.classList.contains('tile--unopened--flagged'))
                    tile.innerHTML = tile.oldContent;
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
    return unopenedTiles.length === grid.totalBombs;
}

function addEventListeners() {
    const tiles = document.getElementsByClassName('tile');
    for(let tile of tiles) {
        tile.addEventListener('click', () => {
            startTimer();
            const r = parseInt(tile.dataset.row);
            const c = parseInt(tile.dataset.col);
            revealTiles(r,c);
            if(isGameOver()) {
                stopTimer();
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
                currentFlag++;
                displayRemainingBombs();
            }
            else if (isFlagged){
                tile.classList.replace('tile--unopened--flagged', 'tile--unopened');
                tile.innerHTML = tile.oldContent;
                currentFlag--;
                displayRemainingBombs();
            }
        })
    }
}

selectLevel();
level.addEventListener('change', selectLevel);