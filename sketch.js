var database;
var play, playimg;
var playerReal;
var gameState = 'start';
var playerNumber;
var objective, objectiveimg;
var playerNumbertemp;
var grid, gridimg;
var square, squareimg;
var down, right, up, left;
var downimg, rightimg, upimg, leftimg;
var locationTracker;
var moveOnce;
var movedTracker;

var downS, rightS, upS, leftS;
var downimgS, rightimgS, upimgS, leftimgS;




function preload() {

  playimg = loadImage('images/Play.png');
  objectiveimg = loadImage('images/EndTurnB.png');
  gridimg = loadImage('images/Grid.png');
  squareimg = loadImage('images/Player.png');
  downimg = loadImage('images/Down.png');
  rightimg = loadImage('images/Right.png');
  upimg = loadImage('images/Up.png');
  leftimg = loadImage('images/Left.png');

  downimgS = loadImage('images/Down.png');
  rightimgS = loadImage('images/Right.png');
  upimgS = loadImage('images/Up.png');
  leftimgS = loadImage('images/Left.png');


}

function setup(){

  canvas = createCanvas(1600,750);
  
  
  play = createSprite(800,375,200,200);
  play.addImage(playimg);
  play.scale = 1;

  objective = createSprite(1400,100,200,200);
  objective.addImage(objectiveimg);
  objective.scale = 1;
  objective.visible = false;

  grid = createSprite(800,400,200,200);
  grid.addImage(gridimg);
  grid.scale = 1;
  grid.visible = false;

  square = createSprite(590,630,200,200);
  square.addImage(squareimg);
  square.scale = 1;
  square.visible = false;

  down = createSprite(300,100,200,200);
  down.addImage(downimg);
  down.scale = 0.3;
  down.visible = false;

  up = createSprite(100,100,200,200);
  up.addImage(upimg);
  up.scale = 0.3;
  up.visible = false;

  left = createSprite(100,200,200,200);
  left.addImage(leftimg);
  left.scale = 0.3;
  left.visible = false;

  right = createSprite(300,200,200,200);
  right.addImage(rightimg);
  right.scale = 0.3;
  right.visible = false;

  playerNumbertemp = 0;


  movedTracker = 0;



  database = firebase.database();




}

function draw(){

  background('grey');
  if (keyWentDown('space')) {
    console.log('playerNumber '+playerNumber);
    console.log('playerReal '+playerReal);
  }

  drawSprites();

  constUpdate();
  constUpdate2();
  constUpdate3();

  if (gameState === 'start') {

    playPressed();
    textSize(20);
    fill('black');
    text("Press P to play", 740, 460);

  }

  if (gameState === 'play') {

    turn();

  }

  if (movedTracker === false) {

    text("Press U", 50, 60);
    text("Press D", 250, 60);
    text("Press L", 50, 245);
    text("Press R", 250, 245);
    text("MOVE BUTTONS", 100, 20);

  }

  if (movedTracker === true) {

    right.visible = false;
    up.visible = false;
    down.visible = false;
    left.visible = false;

  }


  


}

function constUpdate() {

  database.ref('info/player').on("value",(data) => {

    playerReal = data.val();
    
  });

}

function constUpdate2() {

  if (playerNumber === 1) {
    database.ref('info/player1/location').on("value",(data) => {

      locationTracker = data.val();
      
    });
  }

  if (playerNumber === 2) {

    database.ref('info/player2/location').on("value",(data) => {

      locationTracker = data.val();
      
    });

  }

}

function constUpdate3() {

  if (playerNumber === 1) {
    database.ref('info/player1/moved').on("value",(data) => {

      movedTracker = data.val();
      
    });
  }

  if (playerNumber === 2) {

    database.ref('info/player2/moved').on("value",(data) => {

      movedTracker = data.val();
      
    });

  }


}

function playPressed() {

  if (keyWentDown('p')) {

    play.visible = false;

    database.ref('info/player').on("value",(data) => {

      playerNumbertemp = data.val();
      
    });

    playerNumber = playerNumbertemp;

    database.ref('info').update({

      player: playerReal+1

    });

    if (playerReal === 3) {

      database.ref('info').update({

        player: 1

      });

    }

    gameState = 'play';

    if (playerNumber === 1) {

      square.x = 590;
      square.y = 630;

    }

    if (playerNumber === 2) {

      square.x = 1095;
      square.y = 127;

    }

  }

}

function turn() {

  if (playerNumber === playerReal) {

    if (movedTracker === false) {

      move();
      right.visible = true;
      up.visible = true;
      down.visible = true;
      left.visible = true;

    }

    textSize(20);
    fill('black');
    text("Press E to end turn", 1325, 150);
    objective.visible = true;
    grid.visible = true;
    square.visible = true;
    moveOffMap();
    
    gameState = "play";
  
    if (keyWentDown('e')) {

      

      if (playerNumber === 1) {

        database.ref('info/').update({

          player: 2
  
        });

        database.ref('info/player1/').update({

          moved: true

        });

        database.ref('info/player2/').update({

          moved: false

        });

      }

      if (playerNumber === 2) {

        database.ref('info/').update({

          player: 1
  
        });

        database.ref('info/player2/').update({

          moved: true

        });

        database.ref('info/player1/').update({

          moved: false

        });

      }

    }

    

  }

  if (playerNumber !== playerReal) {

    objective.visible = false;
    grid.visible = false;
    square.visible = false;

    right.visible = false;
    up.visible = false;
    down.visible = false;
    left.visible = false;
    


  }



}

function move() {

  if (keyWentDown('u')) {

    right.visible = false;
    up.visible = false;
    down.visible = false;
    left.visible = false;

    square.y = square.y-84;

    if (playerNumber === 1) {
      database.ref('info/player1/').update({

        location: locationTracker - 1

      });

      database.ref('info/player1/').update({

        moved: true

      });
    }

    if (playerNumber === 2) {
      database.ref('info/player2/').update({

        location: locationTracker - 1

      });

      database.ref('info/player2/').update({

        moved: true

      });
    }

    
    

  }

  if (keyWentDown('d')) {

    right.visible = false;
    up.visible = false;
    down.visible = false;
    left.visible = false;

    square.y = square.y+84;
    if (playerNumber === 1) {
      database.ref('info/player1/').update({

        location: locationTracker + 1

      });

      database.ref('info/player1/').update({

        moved: true

      });
    }

    if (playerNumber === 2) {
      database.ref('info/player2/').update({

        location: locationTracker + 1

      });

      database.ref('info/player2/').update({

        moved: true

      });
    }

    
    

  }

  if (keyWentDown('r')) {

    right.visible = false;
    up.visible = false;
    down.visible = false;
    left.visible = false;

    square.x = square.x+84;
    if (playerNumber === 1) {
      database.ref('info/player1/').update({

        location: locationTracker + 10 

      });
      database.ref('info/player1/').update({

        moved: true

      });
    }

    if (playerNumber === 2) {
      database.ref('info/player2/').update({

        location: locationTracker + 10

      });
      database.ref('info/player2/').update({

        moved: true

      });
    }

    
    

  }

  if (keyWentDown('l')) {

    right.visible = false;
    up.visible = false;
    down.visible = false;
    left.visible = false;

    square.x = square.x-84;
    if (playerNumber === 1) {
      database.ref('info/player1/').update({

        location: locationTracker - 10

      });
      database.ref('info/player1/').update({

        moved: true

      });
    }

    if (playerNumber === 2) {
      database.ref('info/player2/').update({

        location: locationTracker - 10

      });
      database.ref('info/player2/').update({

        moved: true

      });
    }

    

  }

}

function moveOffMap() {

  if (locationTracker > 0 && locationTracker < 8) {

    if (playerNumber === 1) {

      square.x = square.x+84;

      database.ref('info/player1/').update({

        location: locationTracker + 10

      });

      database.ref('info/player1/').update({

        moved: false

      });

    }

    if (playerNumber === 2) {

      square.x = square.x+84;

      database.ref('info/player2/').update({

        location: locationTracker + 10

      });

      database.ref('info/player2/').update({

        moved: false

      });

    }
    
  }

  if (locationTracker > 80 && locationTracker < 88) {

    if (playerNumber === 1) {

      square.x = square.x-84;

      database.ref('info/player1/').update({

        location: locationTracker - 10

      });

      database.ref('info/player1/').update({

        moved: false

      });

    }

    if (playerNumber === 2) {

      square.x = square.x-84;

      database.ref('info/player2/').update({

        location: locationTracker - 10

      });

      database.ref('info/player2/').update({

        moved: false

      });

    }

  }

  if (locationTracker < 71 && locationTracker > 9 && locationTracker % 10 === 0) {

    if (playerNumber === 1) {

      square.y = square.y+84;

      database.ref('info/player1/').update({

        location: locationTracker + 1

      });

      database.ref('info/player1/').update({

        moved: false

      });

    }

    if (playerNumber === 2) {

      square.y = square.y+84;

      database.ref('info/player2/').update({

        location: locationTracker + 1

      });

      database.ref('info/player2/').update({

        moved: false

      });

    }

  }

  if (locationTracker === 18 || locationTracker === 28 || locationTracker === 38 || locationTracker === 48 || locationTracker === 58 || locationTracker === 68 || locationTracker === 78) {

    if (playerNumber === 1) {

      square.y = square.y-84;

      database.ref('info/player1/').update({

        location: locationTracker - 1

      });

      database.ref('info/player1/').update({

        moved: false

      });

    }

    if (playerNumber === 2) {

      square.y = square.y-84;

      database.ref('info/player2/').update({

        location: locationTracker - 1

      });

      database.ref('info/player2/').update({

        moved: false

      });

    }

  }

}




    

  









