let midpoint_solution;
let user_selected_tiles;
let start_tile;

function updateCorrectMidpoint() {
    if (!isTeacher) {
        document.getElementById("correct-midpoint").innerHTML = `<span class="badge rounded-pill bg-success">${studentTotalCorrectMidpoint} / ${studentTotalDoneMidpoint}</span> attempts correct`;
    } else {
        document.getElementById("correct-midpoint").innerHTML = `<span class="badge rounded-pill bg-success">${goodStudentsMidpoint}</span> students answered correctly at least once`;
    }
}

function addMidpointListeners() {
    document.querySelectorAll(".tile").forEach(tile => {
        tile.addEventListener("click", tileListener);
    });

    document.getElementById("btn_midpoint").addEventListener("click", doneListener);
    updateCorrectMidpoint();
}

function doneListener(event) {
    studentTotalDoneMidpoint++;
    if (validateAnswer() && !isTeacher) {
        if (studentTotalCorrectMidpoint == 0) {
            emitAnswerToTeacher({midpoint: true}, true)
        }
        studentTotalCorrectMidpoint++;
    }
    emitSubmit();
    updateCorrectMidpoint()

    let btn = event.currentTarget;
    btn.innerHTML = "Reset";
    btn.classList.remove("btn-success");
    btn.classList.add("btn-outline-danger");
    btn.removeEventListener("click", doneListener);
    btn.addEventListener("click", resetListener);
}

function resetListener(event) {
    let tiles = document.querySelectorAll(".midpoint");
    tiles.forEach(tile => {
        // Remove the color classes that were added when cheking the solution. If they were not present, the remove method does nothing
        tile.classList.remove("bg-secondary");    
        tile.classList.remove("bg-success");
        tile.classList.remove("bg-light-green");
        tile.classList.remove("bg-danger");   
        tile.classList.add("tile");        // No effect if the class was already present
    });
    tiles[4].classList.remove("tile");          // The final tile is not clickable

    // Remove the dark background color from the previous start tile
    start_tile.classList.remove("bg-dark");

    let btn = event.currentTarget;
    btn.innerHTML = "Done";
    btn.classList.remove("btn-outline-danger");
    btn.classList.add("btn-success");
    btn.removeEventListener("click", resetListener);
    btn.addEventListener("click", doneListener);

    startMidpoint();
    addMidpointListeners();
}

function tileListener(event) {
    let tile = event.currentTarget;
    if (tile.classList.contains("tile-selected")) {
        // tile.style.backgroundColor = "white";
        tile.classList.remove("tile-selected");
        tile.classList.remove("bg-secondary");
        user_selected_tiles.delete(tile.id);
    } else {
        // tile.style.backgroundColor = "violet";
        tile.classList.add("tile-selected");
        tile.classList.add("bg-secondary");
        user_selected_tiles.add(tile.id);
    }
}

function startMidpoint() {
    // Select a random start tile that is not the final tile, compute the solution and initialize the user selected tiles set 

    let tiles = document.querySelectorAll(".tile");
    let randomIndex = Math.floor(Math.random() * tiles.length);
    start_tile = tiles[randomIndex];
    start_tile.classList.add("bg-dark");
    start_tile.classList.remove("tile");           // Remove tile class so that it stops being clickabl

    computeMidpointSolution(randomIndex);       
    user_selected_tiles = new Set();          // The tiles clicked by the user will be kept in this set for later validation

    console.log(midpoint_solution);
}

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
    let status = true;
    tiles.forEach((tile, index) => {
        if (tile.classList.contains("tile-selected")) {
            if (!midpoint_solution.has(index)) {
                status = false;
                tile.classList.add("bg-danger");       // Red (the tile was selected but it shouldn't have been)
            } else {
                tile.classList.add("bg-success");      // Green (the tile was selected and it is part of the solution)
            }
        } else if (midpoint_solution.has(index)) {
            status = false;
            tile.classList.add("bg-light-green");          // Light green (the tile was not selected but it should have been)
        }
        // The start and end tiles remain blue
    });


    tiles.forEach(tile => {
        tile.classList.remove("tile-selected");     // Reset the tile-selected class
        tile.classList.remove("tile");              // Remove the tile class so that it stops being clickable
        tile.removeEventListener("click", tileListener);    // Remove the tile listener
    });
    return status;
}