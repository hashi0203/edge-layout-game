'use strict';
// global variables
let brc = [];
let boundary;
let score;
let active_brc_index;
let connected_flag = 0;

// preload branches BEFORE setup()
function preload() {
  getBranches(plate_12); // check this function in LibraryBranch.js. You can also try plate_20
}

function setup() {
  var canvas = createCanvas(500, 450);
  boundary = new Boundary(); // initialize the boundary including target points on the corners
  score = new Score(); // initialize the scoring system including joint evaluation 
  active_brc_index = 0;
  brc[active_brc_index].setMoveActive();
  
  var position = brc[active_brc_index].pos.copy();
    var angle = brc[active_brc_index].rot;
    
    if (keyIsDown(CONTROL)) {
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
  
  score.updateScore(); // initial calculation
}

function draw() {
  background(250);
  boundary.drawBoundary(); 
  boundary.drawActivePoints(4, color(255, 240, 0, 200));
  for (var i = 0; i < brc.length; i++){
    brc[i].drawBranch();
  }
  for (var i = 0; i < brc.length; i++){
    brc[i].drawValidIntersections();
  }
  for (var i = 0; i < brc.length; i++){
    brc[i].drawInvalidIntersections();
  }

  // score.updateScore(); // this function is not here to avoid getting heavy. instead, it's calculated in Events.js
  
  // show effect when the game is completed
  if (score.complete) {
      textSize(70);
      textFont("Helvetica");
      noStroke();
      textStyle(BOLD);
      fill(50);
      text("Connected!", 60, height/2+20);
    
      if (!document.getElementById("chk_stop").checked) connected_flag = 2;
      // stop a little while when connected
      if (connected_flag == 0) {
          var spanedSec = 0;
          connected_flag = 1;
          // execute every 10 ms
          var id = setInterval(function () {
              spanedSec++;
              connected_flag = 1;
              // if 1 sec passed
              if (spanedSec >= 100) {
                  connected_flag = 2;
                  clearInterval(id);
              }
          }, 10);
        }
    } else {
      connected_flag = 0;
    }
}