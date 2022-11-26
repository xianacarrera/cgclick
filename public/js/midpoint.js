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
    tile.style.backgroundColor = "red";
}