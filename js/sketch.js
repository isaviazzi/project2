
let canvas;

let namesArray;
let nameButton;
let randomNameNumber;
let nameP;


function preload () {
  namesArray = loadStrings("assets/names.txt");
}

function setup() {

  canvas = createCanvas(windowWidth, windowHeight);
  canvas.position(0, 0);
  canvas.style("z-index", "-1");
  
  nameP = createP("");
  nameP.position(30, 200);
  
  nameButton = createButton("Random Name");
  nameButton.mousePressed(randName);

}

function randName(){
  randNameNumber = int(random(namesArray.length));
  nameP.html(namesArray[randNameNumber]);
  

}

function draw() {

  background(255);

}
