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
  score.updateScore(); // initial calculation
}

function draw() {
  background(250);
  boundary.drawBoundary(); 
  boundary.drawActivePoints(4, color(255, 240, 0, 200));
  for (var i = 0; i < brc.length; i++){
    brc[i].drawBranch();
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
  //     var element = this.document.getElementById('target'),
  //         listener = {
  //       disableDefault: true,
  //       handleEvent: handleClickKeydown
  //     };

  //     element.addEventListener('click', listener, false);
  //     element.addEventListener('keydown', listener, false);
  //     setTimeout(handleTimeout, 3000, element, listener);

      if (connected_flag == 0) {
          var spanedSec = 0;
          connected_flag = 1;
          // 1秒間隔で無名関数を実行
          var id = setInterval(function () {

              spanedSec++;
              connected_flag = 1;

              // 経過時間 >= 待機時間の場合、待機終了。
              if (spanedSec >= 1000) {

                  // タイマー停止
                  clearInterval(id);
              }
          }, 10);
      }
      connected_flag = 2;
    } else {
      connected_flag = 0;
    }
}