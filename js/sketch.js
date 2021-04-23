
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

let dateArray;
let homeArray =[];
let schoolArray =[];
let workArray =[];
let sleepArray =[];
let friendsArray =[];
let commuteArray =[];
let walkArray =[];

//PRELOAD////////////////////////////////////////////////////////////////////////////////

function preload () {

  firstTable = loadTable('csv/firsttable.csv', 'csv', 'header');
  secondTable = loadTable('csv/secondtable.csv', 'csv', 'header');

}
////////////////////////////////////////////////////////////////////////////////

function setup() {
// noCanvas();
  canvas = createCanvas(500, 500);
  canvas.id("p5canvas");
  canvas.position(0, 0);
  canvas.style("z-index", "-1");
  background(0);

  // selectMenu = createSelect();

  // print(firstTable.getString(0, 1));

  for (var i= 0; i < firstTable.getRowCount(); i++){

    home = firstTable.getNum(i, 'home');
    date = firstTable.getString(i, 'date');
    
    
    
    
    
    // startDate = myTable.getString(i, 1);
    // selectMenu.option(startDate);
    // startDateArray.push(myTable.getString(i, 1));

    // if(theLocation.includes("home")){
    //   theLocationArray.push(theLocation);
    //   startDateArray.push(startDate);
    //   durationArray.push(duration);
    // }



  }
print(dateArray)
loadGraph();

}

////////////////////////////////////////////////////////////////////////////////

function draw() {


}


////////////////////////////////////////////////////////////////////////////////

function loadGraph(){
  let ctx = document.getElementById('firstTable').getContext('2d');

  let firstTable = new Chart (ctx, {
    type: 'line',
    data: {
        labels: home,
        datasets: [{
            label: 'home',
            fill: false,
            data: homeArray,
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
// function loadGraph(){
//   let ctx = document.getElementById('secondTable').getContext('2d');
// 
//   let secondTable = new Chart (ctx, {
//     type: 'bar',
//     data: {
//         labels: schoolArray,
//         datasets: [{
//             label: 'school',
//             fill: false,
//             data: schoolArray,
//             backgroundColor: 'rgba(255, 99, 132, 0.1)',
// 
//             borderColor: 'rgba(255, 99, 132, 0.75)',
//             borderWidth: 1
// 
// 
//         }]
//     },
// 
//     options: {
//       scales: {
//         yAxes: [{
//           ticks: {
//             beginAtZero: true
//           }
//         }]
//       }
//     }
// 
//   })
// }




