// Get a random integer between 0 and max
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function addTileListeners(){
    document.querySelectorAll(".tile").forEach(tile=>{
        tile.addEventListener("click", tileListener);
    });
}

function tileListener(event){
    let tile = event.currentTarget;
    if (tile.classList.contains("tile-selected")){
        tile.style.backgroundColor = "white";
        tile.classList.remove("tile-selected");
    } else {
        tile.style.backgroundColor = "red";
        tile.classList.add("tile-selected");
    }
}

function selectStartTile(){
    let tiles = document.querySelectorAll(".tile");
    let tile = tiles[Math.floor(Math.random() * tiles.length)];
    tile.classList.add("bg-primary");        // Primary background color
    tile.classList.remove("tile");           // Remove tile class so that it stops being clickable
}