
let canvas;
let myTable;
let time;
let virusTable;
let selectMenu;
let startDate;

let activity;

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

  canvas = createCanvas(windowWidth, windowHeight);
  canvas.id("myChart");
  canvas.position(0, 0);
  canvas.style("z-index", "-1");
  
  selectMenu = createSelect();
  
  // print(myTable.getString(0, 1));
  
  for (var i= 0; i < table.getRowCount(); i++){
    
    activity = myTable.getString(i, 'activity');
    
    // startDate = myTable.getString(i, 1);
    // selectMenu.option(startDate);
    // startDateArray.push(myTable.getString(i, 1));
    
    if(time.includes("Home")){
      activityArray.push(activity);
      durationArray.push(myTable.getNum(i, 'activity'))
    }
  
  loadGraph();
  
  }
  


}

////////////////////////////////////////////////////////////////////////////////

function draw() {


}


////////////////////////////////////////////////////////////////////////////////

function loadGraph(){
  let ctx = document.getElementById('myChart)').getContext('2d');
  
  let myChart = new Chart (ctx, {
    type: 'line';
    data: {
        labels: activityArray
        datasets [{
            label: 'duration'
            fill: false,
            data: durationArray,
            backgroungColor: rgba(255, 99, 132, 0.2),
            
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
        
            
        }]
    },
    
    options: {
      scales {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }
    
  })
}




