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
    let randomIndex = Math.floor(Math.random() * tiles.length); 
    let tile = tiles[randomIndex];
    tile.classList.add("bg-primary");        // Primary background color
    tile.classList.remove("tile");           // Remove tile class so that it stops being clickable
}

let midpoint_solution = Set();

function computeMidpointSolution(startTile){
    /* For the algorith, we can just assign integers to the tiles
     *  (0, 4)   (1, 4)   (2, 4)   (3, 4)   (4, 4)
     *  (0, 3)   (1, 3)   (2, 3)   (3, 3)   (4, 3)
     *  (0, 2)   (1, 2)   (2, 2)   (3, 2)   (4, 2)
     *  (0, 1)   (1, 1)   (2, 1)   (3, 1)   (4, 1)
     *  (0, 0)   (1, 0)   (2, 0)   (3, 0)   (4, 0)
     *
     * But the tiles are stored in a 1D array that goes from left to right and from top to bottom, so the Y axis has to be inverted.
     *     0       1        2       3        4
     *     5       6        7       8        9
     *    10      11       12      13       14
     *    15      16       17      18       19
     *    20      21       22      23       24
     * 
     * The final tile is always (4, 4).
     */ 
    if (startTile >= 4) startTile++;        // The final tile is always (4, 4), so we need to skip it

    let startX = startTile % 5;     
    let startY = 4 - Math.floor(startTile / 5);
    let endX = 4;
    let endY = 4;

    let m = (endY - startY) / (endX - startX);
    // Swap the start and end tiles if the slope is greater than 1 (angle > 45º)
    if (m > 1){
        let [tempX, tempY] = [startX, startY];
        [startX, startY] = [endX, endY];
        [endX, endY] = [tempX, tempY];
    }

    let dx = endX - startX;
    let dy = endY - startY;

    let x = startX;
    let y = startY;
    let F = - 2 * dy + dx;         // Initial value
    F -= 2 * dy;
    if (F < 0){
        F += 2 * dx;
    }
    while (x < endX){
        midpoint_solution.add((4 - y) * 5 + x);        // Store the tile index (invert the Y axis)
        x++;
        if (F < 0){
            y++;
            F += 2 * dx;
        }
        F -= 2 * dy;
    }
    midpoint_solution.delete(startTile);      // Remove the first element, which is the start tile
}


function validateAnswer(){
    let tiles = document.querySelectorAll(".midpoint");
    let isValid = true;
    tiles.forEach((tile, index)=>{
        if (tile.classList.contains("tile-selected")){
            if (!midpoint_solution.has(index)){
                isValid = false;
            }
        } else {
            if (midpoint_solution.has(index)){
                isValid = false;
            }
        }
    });
    console.log(isValid);
}