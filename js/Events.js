let drag_flag;

function clamp(min,opt,max) {
    if (opt < min) {
        return min;
    } else if (opt > max) {
        return max;
    }
    return opt;
}

function keyPressed() {
    if (connected_flag == 1) return;
    if (keyCode === ENTER) {
        // deactivate all branches
        for (var i = 0; i < brc.length; i++)  brc[i].setSleep();
        if (active_brc_index == brc.length - 1) active_brc_index = 0; // go back to the first index of branches
        else active_brc_index += 1; // add the index
        brc[active_brc_index].setMoveActive(); // select the branch by activating it
    }

    var position = brc[active_brc_index].pos.copy();
    var angle = brc[active_brc_index].rot;
    var moveVec = new createVector(0, 0);

    if (keyCode === LEFT_ARROW) {
        if (keyIsDown(90)) angle -= 0.1 * PI; // change angle if z is pressed
        else moveVec.add(-10, 0); // change position
    } else if (keyCode === RIGHT_ARROW) {
        if (keyIsDown(90)) angle += 0.1 * PI; // change angle if z is pressed
        else moveVec.add(10, 0); // change position
    } else if (keyCode === UP_ARROW) {
        moveVec.add(0, -10); // go up. Note that the value is mirrored due to the origin is top left corner.
    } else if (keyCode === DOWN_ARROW) {
        moveVec.add(0, 10); // go down
    } else if (keyCode == 82) { // mirror if r is pressed
        brc[active_brc_index].setMirror();
    }
  
    position.x = clamp(20, position.x + moveVec.x, 480);
    position.y = clamp(20, position.y + moveVec.y, 430);

    brc[active_brc_index].setPosition(position.x, position.y);
    brc[active_brc_index].setAngle(angle); // in radians
    score.updateScore();
}


// selection of branches
function mousePressed(event) {
    if (connected_flag == 1) return;
//     /* first get clicked position by 
//     console.log(event.layerX + ' , ' + event.layerY); 
//     or 
//     console.log(mouseX + ' , ' + mouseY);
    
//     and then select
//     var branch = checkCloseBranch(20)[0];
//     */
    
//     var mouseVec = new createVector(mouseX, mouseY);
//     var branch = checkCloseBranch(20, mouseVec);
//     if (branch[0]) {
//         for (var i = 0; i < brc.length; i++) brc[i].setSleep();
//         for (var i = brc.length-1; i >= 0; i--) {
//             if (branch[1][i]) {
//                 active_brc_index = i;
//                 brc[active_brc_index].setMoveActive();
//                 break;
//             }
//         }
//     }
  
    var mouseVec = new createVector(mouseX, mouseY);
    var branch = checkCloseBranch(20, mouseVec);
    if (!branch[0]) return;
    if (!branch[1][active_brc_index]) {
        for (var i = 0; i < brc.length; i++) brc[i].setSleep();
        for (var i = brc.length-1; i >= 0; i--) {
            if (branch[1][i]) {
                active_brc_index = i;
                brc[active_brc_index].setMoveActive();
                break;
            }
        }
    }
}

// move and rotate 
function mouseDragged(event) {
    if (connected_flag == 1) return;
    /*
    see keyPressed
    */
    drag_flag = true;
    var mouseVec = new createVector(mouseX, mouseY);
    var moveVec = new createVector(event.movementX, event.movementY);
    var original_mouseVec = mouseVec.copy().sub(moveVec);
    var branch = checkCloseBranch(20, original_mouseVec);
    // if (!branch[0]) return;
    // if (!branch[1][active_brc_index]) {
    //     for (var i = 0; i < brc.length; i++) brc[i].setSleep();
    //     for (var i = brc.length-1; i >= 0; i--) {
    //         if (branch[1][i]) {
    //             active_brc_index = i;
    //             brc[active_brc_index].setMoveActive();
    //             break;
    //         }
    //     }
    // }
  
    var position = brc[active_brc_index].pos.copy();
    var angle = brc[active_brc_index].rot;
    
    if (keyIsDown(90)) { // change angle if z is pressed
        let v1 = original_mouseVec.copy().sub(position);
        let v2 = mouseVec.copy().sub(position);
        // const dotmagmag = v1.dot(v2) / (v1.mag() * v2.mag());
        // angle += Math.sign(v1.cross(v2).z || 1) * Math.acos(Math.min(1, Math.max(-1, dotmagmag)));
        angle += v1.angleBetween(v2);
    } else {
        position.x = clamp(20, position.x + moveVec.x, 480);
        position.y = clamp(20, position.y + moveVec.y, 430);
    }
    
    brc[active_brc_index].setPosition(position.x, position.y);
    brc[active_brc_index].setAngle(angle); // in radians
    score.updateScore();
  
    // keep drag_flag false until 0.5 sec
    var spanedSec = 0;
    // execute every 10 ms
    var id = setInterval(function () {
        spanedSec++;
        drag_flag = true;
        // if 0.5 sec passed
        if (spanedSec >= 50) {
            drag_flag = false;
            clearInterval(id);
        }
    }, 10);
}

// deactivate the selected branch
function mouseReleased() {
    if (connected_flag == 1) return;
    /*
    you might need to deselect the selected branch 
    */
    /* first get clicked position by 
    console.log(event.layerX + ' , ' + event.layerY); 
    or 
    console.log(mouseX + ' , ' + mouseY);
    
    and then select
    var branch = checkCloseBranch(20)[0];
    */
    
    // ignore release after draging
    if (drag_flag) return;
    var mouseVec = new createVector(mouseX, mouseY);
    var branch = checkCloseBranch(20, mouseVec);
    if (branch[0]) {
        for (var i = 0; i < brc.length; i++) brc[i].setSleep();
        for (var i = brc.length-1; i >= 0; i--) {
            if (branch[1][i]) {
                active_brc_index = i;
                brc[active_brc_index].setMoveActive();
                break;
            }
        }
    }
}


function doubleClicked(event) {
    if (connected_flag == 1) return;
    
    if (drag_flag) return;
    var mouseVec = new createVector(mouseX, mouseY);
    var branch = checkCloseBranch(20, mouseVec);
    if (branch[0]) {
        for (var i = 0; i < brc.length; i++) brc[i].setSleep();
        for (var i = brc.length-1; i >= 0; i--) {
            if (branch[1][i]) {
                active_brc_index = i;
                brc[active_brc_index].setMoveActive();
                brc[active_brc_index].setMirror();
                break;
            }
        }
    }
  
    var position = brc[active_brc_index].pos.copy();
    var angle = brc[active_brc_index].rot;
    brc[active_brc_index].setPosition(position.x, position.y);
    brc[active_brc_index].setAngle(angle); // in radians
    score.updateScore();
};

function checkCloseBranch(thresholdDist, mouseVec) {
    var closeBranch = false;
    var closeIndex = null;
    var minDist = thresholdDist;
    // 各枝がマウス上にあるか
    var branches = new Array(brc.length).fill(false)
    for (var i = 0; i < brc.length; i++) {
        var vertices = brc[i].getTransformedContour();
        for (var j = 0; j < vertices.length; j++) {
            var distance = mouseVec.dist(vertices[j]);
            if (distance < thresholdDist) {
                // if (distance < minDist) {
                //     closeBranch = true;
                //     minDist = distance;
                //     closeIndex = i;
                // }
                closeBranch = true;
                branches[i] = true;
            }
        }
    }
    return [closeBranch, branches];
}