
let canvas;

let firstTable;
let secondTable;

let date;
let home;
let school;
let work;
let sleep;
let friends;
let commute;
let walk;

//different chart data
let location2020;
let location2019;
let work2020;
let data2020;
let home2019;
let work2019;
let data2019;

//chart arrays...location is updated with new data after button presses
let dateArray2020 = [];
let dateArray2019 = [];
let locationArray2020 =[];
let locationArray2019 =[];

//location labels variables
let locationTitle2020;
let locationTitle2019;

//buttons

let workButton;
let homeButton;
let friendsButton;

let slider;

let schoolArray =[];
let workArray =[];
let sleepArray =[];
let friendsArray =[];
let commuteArray =[];
let walkArray =[];


let maxValue;
let stepSizeValue;

//PRELOAD////////////////////////////////////////////////////////////////////////////////

function preload () {

  firstTable = loadTable('csv/firsttable.csv', 'csv', 'header');
  secondTable = loadTable('csv/secondtable.csv', 'csv', 'header');

}
////////////////////////////////////////////////////////////////////////////////

function setup() {
  noCanvas();
  
  //create the buttons. when pressed they trigger their functions

  
  workButton = createButton("Work");
  workButton.mousePressed(workCompare);
  workButton.id('workButton');
  
  homeButton = createButton("Home");
  homeButton.mousePressed(homeCompare);
  homeButton.id('homeButton');
  
  friendsButton = createButton("Friends");
  friendsButton.mousePressed(friendsCompare);
  friendsButton.id('friendsButton');
  
  commuteButton = createButton("Commute");
  commuteButton.mousePressed(commuteCompare);
  commuteButton.id('commuteButton');

  locationTitle2019 = "";
  locationTitle2020 = "";
  
  colorMode(HSB);
  slider = createSlider(0, 255, 0);
  slider.style('width', '90%');
  slider.style('background', 'red');
  slider.id('slider');

  //load the dates first
  for (var i= 0; i < firstTable.getRowCount(); i++){

    date2019 = firstTable.getString(i, 'date');
    dateArray2019.push(date2019);


  }

  for (var i= 0; i < secondTable.getRowCount(); i++){

    date2020 = secondTable.getString(i, 'date');
    dateArray2020.push(date2020);

  }
  print(location2020)

  loadGraph();
  loadGraph2();

}

//clear the location arrays, update with new data, then call the chart functions to display new data
function workCompare(){
  maxValue = 200;
  stepSize= 50;
  locationArray2019.splice(0, locationArray2019.length);
  locationArray2020.splice(0, locationArray2020.length);

  for (var i= 0; i < firstTable.getRowCount(); i++){

    location2019 = firstTable.getNum(i, 'work');
    locationArray2019.push(location2019);

  }

  for (var i= 0; i < secondTable.getRowCount(); i++){

    location2020 = secondTable.getNum(i, 'work');
    locationArray2020.push(location2020);

  }

    //update the label text
  locationTitle2019 = "Hours at work";
  locationTitle2020 = "Hours at work";
  loadGraph();
  loadGraph2();

}

//clear the location arrays, update with new data, then call the chart functions to display new data
function homeCompare(){
  maxValue = 800;
  stepSize= 100;
  
  locationArray2019.splice(0, locationArray2019.length);
  locationArray2020.splice(0, locationArray2020.length);
  for (var i= 0; i < firstTable.getRowCount(); i++){

    location2019 = firstTable.getNum(i, 'home');

    locationArray2019.push(location2019);

  }

  for (var i= 0; i < secondTable.getRowCount(); i++){

    location2020 = secondTable.getNum(i, 'home');

    locationArray2020.push(location2020);


  }
  //update the label text
  locationTitle2019 = "Hours at home";
  locationTitle2020 = "Hours at home";
  loadGraph();
  loadGraph2();

}

//clear the location arrays, update with new data, then call the chart functions to display new data
function friendsCompare(){
  maxValue = 40;
  stepSize= 5;
  locationArray2019.splice(0, locationArray2019.length);
  locationArray2020.splice(0, locationArray2020.length);

  for (var i= 0; i < firstTable.getRowCount(); i++){

    location2019 = firstTable.getNum(i, 'friends');
    locationArray2019.push(location2019);

  }

  for (var i= 0; i < secondTable.getRowCount(); i++){

    location2020 = secondTable.getNum(i, 'friends');
    locationArray2020.push(location2020);

  }

    //update the label text
  locationTitle2019 = "Hours with friends";
  locationTitle2020 = "Hours with friends";
  loadGraph();
  loadGraph2();

}

//clear the location arrays, update with new data, then call the chart functions to display new data
function commuteCompare(){
  maxValue = 50;
  stepSize= 5;
  locationArray2019.splice(0, locationArray2019.length);
  locationArray2020.splice(0, locationArray2020.length);

  for (var i= 0; i < firstTable.getRowCount(); i++){

    location2019 = firstTable.getNum(i, 'commute');
    locationArray2019.push(location2019);

  }

  for (var i= 0; i < secondTable.getRowCount(); i++){

    location2020 = secondTable.getNum(i, 'commute');
    locationArray2020.push(location2020);

  }

    //update the label text
  locationTitle2019 = "Hours commuting";
  locationTitle2020 = "Hours commuting";
  loadGraph();
  loadGraph2();

}

////////////////////////////////////////////////////////////////////////////////

function draw() {

  let val = slider.value();
  background(val, 100, 100, 1);

}


////////////////////////////////////////////////////////////////////////////////

//graph 1
function loadGraph(){
  let ctx = document.getElementById('firstTable').getContext('2d');

  let firstTable = new Chart (ctx, {
    type: 'line',
    data: {
      labels: dateArray2019,
      datasets: [{
        label: locationTitle2019,
        fill: false,
        data: locationArray2019,
        backgroundColor: 'rgba(255, 99, 132, 0.1)',

        borderColor: 'rgba(255, 99, 132, 0.75)',
        borderWidth: 1

      }]
    },

    options: {
            
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            min: 0,
            max: maxValue,
            stepSize: stepSizeValue,
          }
        }]
      },
      
      legend: {
          display: true,
          position: 'bottom',
          align: 'start',
          labels: {
            color: 'rgb(255, 99, 132)'
          }
      },
      
      plugins: {
            
      }
    }
  })
}

//graph 2
function loadGraph2(){
  
  let ctx = document.getElementById('secondTable').getContext('2d');
  
  let secondTable = new Chart (ctx, {
    
    type: 'line',
    data: {
      labels: dateArray2020,
      datasets: [{
        label: locationTitle2020,
        fill: false,
        data: locationArray2020,
        backgroundColor: 'rgba(255, 99, 132, 0.1)',
        borderColor: 'rgba(255, 99, 132, 0.75)',
        borderWidth: 1
      }]
    },

    options: {
            
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            min: 0,
            max: maxValue,
            stepSize: stepSizeValue,
          }
        }]
      },
      
      legend: {
          display: true,
          position: 'bottom',
          align: 'end',
          labels: {
            color: 'rgb(255, 99, 132)'
          }
      },
      
      plugins: {
            
      }
    }

  })
}




