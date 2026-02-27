
const tiles = document.getElementsByClassName('tile');
for(let tile of tiles) {
    tile.addEventListener('click', () => {
        if(!tile.classList.contains('tile--unopened--flagged'))
            tile.classList.replace('tile--unopened', 'tile--opened');
    })

    tile.addEventListener('contextmenu', (event) => {
        event.preventDefault();
        let isFlagged = tile.classList.contains('tile--unopened--flagged');
        let isUnopened = tile.classList.contains('tile--unopened');
        if(!isFlagged && isUnopened) {
            tile.classList.replace('tile--unopened', 'tile--unopened--flagged');
            tile.innerHTML = `<img src="img/flag.png" alt="">`;
        }
        else if (isFlagged){
            tile.classList.replace('tile--unopened--flagged', 'tile--unopened');
            tile.innerHTML = ``;
        }
    })
}