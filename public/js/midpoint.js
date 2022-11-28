function addMidpointListeners() {
    document.querySelectorAll(".tile").forEach(tile => {
        tile.addEventListener("click", tileListener);
    });

    document.getElementById("btn_midpoint").addEventListener("click", doneListener);
}

function doneListener(event) {
    validateAnswer();

    let btn = event.currentTarget;
    btn.innerHTML = "Reset";
    btn.classList.remove("btn-primary");
    btn.classList.add("btn-secondary");
    btn.removeEventListener("click", doneListener);
    btn.addEventListener("click", resetListener);
}

function resetListener(event) {
    //let finalTile = document.querySelectorAll(".midpoint").at(-1);      // Get the last element of the array
    //finalTile.classList = "midpoint col border border-dark bg-primary";
    let tiles = document.querySelectorAll(".midpoint");
    tiles.forEach(tile => {
        tile.classList.remove(bg_color_solution);
        tile.classList.add("tile");        // No effect if the class was already present
    });
    tiles[4].classList.remove("tile");          // The final tile is not clickable
    tiles[4].classList.add("bg-primary");       // And it is always coloured

    let btn = event.currentTarget;
    btn.innerHTML = "Done";
    btn.classList.remove("btn-secondary");
    btn.classList.add("btn-primary");
    btn.removeEventListener("click", resetListener);
    btn.addEventListener("click", doneListener);

    selectStartTile();
    addMidpointListeners();
}

function tileListener(event) {
    let tile = event.currentTarget;
    if (tile.classList.contains("tile-selected")) {
        tile.style.backgroundColor = "white";
        tile.classList.remove("tile-selected");
    } else {
        tile.style.backgroundColor = "violet";
        tile.classList.add("tile-selected");
    }
}

function selectStartTile() {
    let tiles = document.querySelectorAll(".tile");
    let randomIndex = Math.floor(Math.random() * tiles.length);
    let tile = tiles[randomIndex];
    tile.classList.add("bg-primary");        // Primary background color
    tile.classList.remove("tile");           // Remove tile class so that it stops being clickable

    computeMidpointSolution(randomIndex);

    console.log(midpoint_solution);
}

let midpoint_solution;
let bg_color_solution;

function computeMidpointSolution(startTile) {
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
    midpoint_solution = new Set();
    if (startTile >= 4) startTile++;        // The final tile is always (4, 4), so we need to skip it

    let startX = startTile % 5;
    let startY = 4 - Math.floor(startTile / 5);
    let endX = 4;
    let endY = 4;

    let m = (endY - startY) / (endX - startX);
    let swaped = false;
    if (m >= 1) {
        // Swap the start and end tiles if the slope is greater than 1 (angle > 45º)
        // Also invert the x and y coordinates
        [startX, startY, endX, endY] = [0, 0, 4 - startY, 4 - startX];
        swaped = true;
    }

    let dx = endX - startX;
    let dy = endY - startY;

    let x = startX;
    let y = startY;
    let F = - 2 * dy + dx;         // Initial value
    F -= 2 * dy;
    if (F < 0) {
        F += 2 * dx;
    }
    while (x < endX) {
        if (!swaped) midpoint_solution.add((4 - y) * 5 + x);        // Store the tile index (invert the Y axis)
        else midpoint_solution.add(x * 5 + 4 - y);
        // If the indexes were swaped, the grid is being traversed from top to bottom and from right to left (i.e., rotated 90º clockwise and flipped)
        // Not swaped: (x, y) ---> (4 - y) * 5 + x
        // Swaped: (x, y) ---> (4 - y, 4 - x) ---> (4 - (4 - x)) * 5 + (4 - y) = x * 5 + (4 - y) 

        x++;
        if (F < 0) {
            y++;
            F += 2 * dx;
        }
        F -= 2 * dy;
    }
    if (!swaped) midpoint_solution.delete(startTile);      // Remove the first element, which is the start tile
    else midpoint_solution.delete(4);                      // Remove the first element in the swaped case: the original final tile
}


function validateAnswer() {
    let tiles = document.querySelectorAll(".midpoint");
    let isValid = true;
    tiles.forEach((tile, index) => {
        if (tile.classList.contains("tile-selected")) {
            if (!midpoint_solution.has(index)) {
                isValid = false;
            }
        } else {
            if (midpoint_solution.has(index)) {
                isValid = false;
            }
        }
    });

    bg_color_solution = isValid ? "bg-success" : "bg-danger";
    tiles.forEach(tile => {
        tile.classList.remove("tile-selected");
        tile.style.backgroundColor = "white";
        tile.classList.add(bg_color_solution);
        tile.classList.remove("bg-primary");        // Remove the primary background color from the start and end tiles
        tile.classList.remove("tile");              // Remove the tile class so that it stops being clickable
        tile.removeEventListener("click", tileListener);
    });
}