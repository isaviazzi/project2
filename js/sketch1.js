
let canvas;
let myTable;
let time;
let virusTable;
let selectMenu;
let startDate;

let activity;
let location;
let duration;

let timeArray =[];
let startDateArray =[];
let endDateArray =[];
let startTimeArray =[];
let endTimeArray =[];
let durationArray =[];
let activityArray =[];
let locationArray =[];

//PRELOAD////////////////////////////////////////////////////////////////////////////////

function preload () {

  myTable = loadTable('csv/table.csv', 'csv', 'header');
  virusTable = loadTable('csv/worldCovidData.csv', 'csv', 'header');

}
////////////////////////////////////////////////////////////////////////////////

function setup() {
// noCanvas();
   canvas = createCanvas(windowWidth, windowHeight);
  // canvas.id("myChart");
  canvas.position(0, 0);
  canvas.style("z-index", "-1");
  background(0);

  // selectMenu = createSelect();

  // print(myTable.getString(0, 1));

  for (var i= 0; i < myTable.getRowCount(); i++){

    location = myTable.getString(i, 'location');
    duration = myTable.getNum(i, 'duration');
    startDate = myTable.getString(i, 'startDate');
    // startDate = myTable.getString(i, 1);
    // selectMenu.option(startDate);
    // startDateArray.push(myTable.getString(i, 1));

    if(location.includes("Home")){
      locationArray.push(location);
      startDateArray.push(startDate);
      durationArray.push(duration);
    }



  }
print(durationArray)
loadGraph();

}

////////////////////////////////////////////////////////////////////////////////

function draw() {


}


////////////////////////////////////////////////////////////////////////////////

function loadGraph(){
  let ctx = document.getElementById('myChart').getContext('2d');

  let myChart = new Chart (ctx, {
    type: 'bar',
    data: {
        labels: startDateArray,
        datasets: [{
            label: 'duration',
            fill: false,
            data: durationArray,
            backgroundColor: 'rgba(255, 99, 132, 0.1)',

            borderColor: 'rgba(255, 99, 132, 0.75)',
            borderWidth: 1


        }]
    },

    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }

  })
}





