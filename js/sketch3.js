var canvas;
var allModes = ['likely_car', 'likely_bus', 'likely_metro', 'likely_metro_and_bus', 'likely_unknown'];
var modeStrings = ['Car', 'Bus', 'Metro', 'Metro and bus', 'Non-motorized'];
//var allModes = ['Auto','Bus','Metro','Mixed public','Active'];
var modes = allModes;
var sectors = {
  'Northeast': ['La Reina', 'Las Condes', 'Lo Barnechea', 'Ñuñoa', 'Providencia', 'Vitacura'],
  'Northwest': ['Cerro Navia', 'Lo Prado', 'Pudahuel', 'Quinta Normal', 'Renca'],
  'Center': ['Santiago'],
  'North': ['Conchalí', 'Huechuraba', 'Independencia', 'Recoleta'],
  'South': ['El Bosque', 'La Cisterna', 'La Granja', 'La Pintana', 'Lo Espejo', 'Pedro Aguirre Cerda', 'San Bernardo', 'San Joaquín', 'San Miguel', 'San Ramón'],
  'Southeast': ['La Florida', 'Macul', 'Peñalolén', 'Puente Alto'],
  'Southwest': ['Cerrillos', 'Estación Central', 'Maipú', 'Padre Hurtado']
}
var rotAxis, rotAngle = 0;
var R = 150000;
var mapBox;
var sectorSel;
var modeSel;
var minFlow;
var thickness;
var p;
var municipalFlows = {};
var roboto, robotoLight, robotoRegular, font2;


function preload() {
  data = loadJSON('data/home_mode_work.json');
  centroids = loadJSON('data/zone_centroids_com.json');
  zones = loadJSON('data/municipalities.json');
  roboto = loadFont('Roboto/Roboto-Bold.ttf');
  robotoLight = loadFont('Roboto/Roboto-Light.ttf');
  robotoRegular = loadFont('Roboto/Roboto-Regular.ttf');
  fontRI = loadFont('Roboto/Roboto-RegularItalic.ttf');
  //font2 = loadFont('Oswald/Oswald-Medium.ttf');
}

function fillHsluv(h, s, l, a) {
  var rgb = hsluv.hsluvToRgb([h, s, l]);
  fill(rgb[0] * 255, rgb[1] * 255, rgb[2] * 255, a);
}

function strokeHsluv(h, s, l, a) {
  var rgb = hsluv.hsluvToRgb([h, s, l]);
  stroke(rgb[0] * 255, rgb[1] * 255, rgb[2] * 255, a);
}

function angleBetween(a, b) { // a, b points on cartesian plane; E = 3PI/4, N = 2PI
  var angle = atan2(b.x - a.x, b.y - a.y);
  return angle;
}

function latLonToCartesian(latLng) {
  var lat = latLng[0] + 33.72, //33.66
    lon = latLng[1] + 70.375; //70.54
  return {
    'x': R * cos(radians(lat)) * sin(radians(lon)) * .85 + 600,
    'y': -R * sin(radians(lat)) + 600,
    'z': R * cos(radians(lat)) * cos(radians(lon)) - (R - 300)
  };
}

function capitalize(string) {
  if (typeof string == undefined) return;
  var firstLetter = string[0] || string.charAt(0);
  return firstLetter ? firstLetter.toUpperCase() + string.substr(1) : '';
}

function createMenu() {
  createP('<em>Visual representation</em>').parent('#menu').style('line-height', '15px');
  createP('<small>Edge form</small>').parent('#menu');
  var arce = createButton('Arc').parent('#menu');
  arce.mousePressed(function() {
    sinusoidal = false;
    arce.style('background', 'gray'), sine.style('background', 'black');
  })
  var sine = createButton('Sine').parent('#menu');
  sine.style('background','gray');
  sine.mousePressed(function() {
    sinusoidal = true;
    sine.style('background', 'gray'), arce.style('background', 'black');
  })
  createP('<small>Magnitude circles</small>').parent('#menu');
  var dropsOn = createButton('On').parent('#menu');
  dropsOn.mousePressed(function() {
    showDrops = true;
    dropsOn.style('background', 'gray'), dropsOff.style('background', 'black');
  })
  var dropsOff = createButton('Off').parent('#menu');
  dropsOff.style('background', 'gray');
  dropsOff.mousePressed(function() {
    showDrops = false;
    dropsOff.style('background', 'gray'), dropsOn.style('background', 'black');
  })
  createP('<small>Color by</small>').parent('#menu');
  var colorByModeButton = createButton('Mode').parent('#menu');
  colorByModeButton.style('background','gray');
  colorByModeButton.mousePressed(function() {
    colorByDistance = false, colorByDist.style('background', 'black');
    if (!colorByMode) colorByMode = true, colorByModeButton.style('background', 'gray');
    else colorByMode = false, colorByModeButton.style('background', 'black');
  })
  var colorByDist = createButton('Distance').parent('#menu');
  colorByDist.mousePressed(function() {
    colorByMode = false, colorByModeButton.style('background', 'black');
    if (!colorByDistance) colorByDistance = true, colorByDist.style('background', 'gray');
    else colorByDistance = false, colorByDist.style('background', 'black');
  })
  createP('<small>Curvedness</small>').parent('#menu');
  weight = createSlider(0, 4, 3, .1).class('slider').parent('#menu');
  createP('<small>Thickness</small>').parent('#menu');
  thickness = createSlider(0, .015, .01, .001).class('slider').parent('#menu');

  createP('<em><br>Data filters</em>').parent('#menu').style('font-style', 'bold').style('line-height', '15px');
  createP('<small>Minimum flow magnitude</small>').parent('#menu');
  minFlow = createSlider(4, 44, 20).class('slider').parent('#menu');
  createP('<small>Mode</small>').parent('#menu');
  var modeSel = createSelect().parent('#menu').style('border', 'white').style('font-size', '8pt').style('font-family', 'arial').style('text-align', 'left');
  modeSel.option('All');
  for (var s in modeStrings) modeSel.option(modeStrings[s]);
  modeSel.changed(function() {
    if (modeSel.value() === 'All') modes = allModes;
    else modes = [allModes[modeStrings.indexOf(modeSel.value())]];
    draw_();
  })
  createP('<small>Sector</small>').parent('#menu');
  var sectorSel = createSelect().parent('#menu').style('border', 'white').style('font-family', 'arial').style('font-size', '8pt');
  sectorSel.option('All');
  for (var s in Object.keys(sectors)) sectorSel.option(Object.keys(sectors)[s]);
  sectorSel.changed(function() {
    if (sectorSel.value() === 'All') selectedSector = null;
    else selectedSector = sectorSel.value();
    draw_();
  })

  createP('<em><br>Layers</em>').parent('#menu').style('line-height', '15px');
  createP('<small>Map</small>').parent('#menu');
  mapOn = createButton('On').parent('#menu');
  mapOn.style('background','gray');
  mapOn.mousePressed(function() {
    showMap = true;
    mapOn.style('background', 'gray'), mapOff.style('background', 'black');
  });
  mapOff = createButton('Off').parent('#menu');
  
  mapOff.mousePressed(function() {
    showMap = false;
    mapOff.style('background', 'gray'), mapOn.style('background', 'black');
  });

  createP('<em><br>Output</em>').parent('#menu').style('line-height', '15px');
  var shoot = createButton('Save Image').parent('#menu');;
  shoot.mousePressed(function() {
    saveCanvas('ModalFlow');
  })
}

function getFlows(d) {
  var flows = {};
  c = 0, t = 0;
  for (var z1 in data) {
    if (centroids[z1]) {
      var originMunicipality = centroids[z1][1];
      if (!municipalFlows[originMunicipality]) municipalFlows[originMunicipality] = {};
      for (var i in modes) {
        if (!municipalFlows[originMunicipality][modes[i]]) municipalFlows[originMunicipality][modes[i]] = {};
        for (var z2 in data[z1][modes[i]]) {
          var destinyMunicipality = centroids[z2][1];
          if (!municipalFlows[originMunicipality][modes[i]][destinyMunicipality]) municipalFlows[originMunicipality][modes[i]][destinyMunicipality] = 0;
          municipalFlows[originMunicipality][modes[i]][destinyMunicipality] += data[z1][modes[i]][z2];
          if (centroids[z2] && data[z1][modes[i]][z2] > d) {
            if (!flows[z1]) flows[z1] = {};
            if (!flows[z1][modes[i]]) flows[z1][modes[i]] = {};
            flows[z1][modes[i]][z2] = data[z1][modes[i]][z2];
            c++;
            t += data[z1][modes[i]][z2];
          }
        }
      }
    }
  }
  p = flows;
  //print(municipalFlows);
}

function drawLegend() {
  noStroke(), fill('white'), textSize(40), textFont(roboto);
  text('ModalFlow', 100, 50);
  textSize(14), textFont(robotoRegular);
  text('Visualizing ' + int(t) + ' trips in ' + c + ' relations', 103, 75);
  text('modes', 100, 780)
  for (var m in allModes) {
    if (colorByMode) fillHsluv(360 / allModes.length * allModes.indexOf(allModes[m]), 100, 70, 255);
    else if (colorByDistance) fill('gray');
    else fill('white');
    if (modes.indexOf(allModes[m]) < 0) fill('black');
    ellipse(104, 16 * m + 800, 8, 8);
    fill('white'), textFont(robotoLight), textSize(11);
    text(modeStrings[m], 120, 16 * m + 804);
  }
  stroke('white'), strokeWeight(1);
  line(width-100,100,width-100,140);
  fill('white'), noStroke(), textAlign(CENTER), textSize(14);
  text('S',width-100,160);

  textAlign(LEFT), textSize(14), textFont(robotoRegular),noStroke();
  text('flows', 100, 900)
  var y = 950;
  var x = 100;
  var u = 1;
  var dx = 100;
  if (sinusoidal) u = -1.2;
  noFill(), stroke('white'), strokeWeight(1);
  beginShape();
  curveVertex(x, y + 200 * abs(u));
  curveVertex(x, y);
  curveVertex(x + dx, y);
  curveVertex(x + dx, y + 200 * u);
  endShape();

  beginShape();
  curveVertex(x, y - 200 * abs(u));
  curveVertex(x, y);
  curveVertex(x + dx, y);
  curveVertex(x + dx, y - 200 * u);
  endShape();
  fill('white');
  triangle(x, y, x + 4, y - 2 * u, x, y - 5 *u)
  triangle(x + dx, y, x + dx - 4, y + 2, x + dx, y + 5 )

  noStroke(), fill('white'), textFont(robotoLight), textSize(11);

  text('outgoing', x + dx + 10, y - 10);
  text('incoming', x + dx + 10, y + 15);
  
  if (showDrops) {
    noStroke(), fill(255, 100);
    ellipse(x + dx / 2, y, 22, 22);
    stroke(255, 100);
    line(x + dx / 2, y + 11, x + dx / 2, y + 34);
    noStroke(), fill('white'), textFont(robotoLight), textSize(11), textAlign(CENTER);
    text('flow magnitude', x + dx / 2, y + 50);
  }

  textSize(18), fill('white'), textFont(fontRI), textAlign(LEFT);
  text("Santiago, CL", width - 300, y);
}

function drawMap() {
  for (var i in zones.features) {
    var zone = zones.features[i];
    var id = zones.features[i].id;
    geometry = zones.features[i].geometry.coordinates;
    noFill(), stroke(200), strokeWeight(1);
    if (zones.features[i].geometry.type === 'MultiPolygon') {
      for (var j = 0; j < geometry.length; j++) {
        beginShape();
        for (var q in geometry[j][0]) {
          var pos = latLonToCartesian([geometry[j][0][q][1], geometry[j][0][q][0]]);
          vertex(pos.x, pos.y);
        }
        endShape(CLOSE);
      }
    } else {
      beginShape();
      for (var q in geometry[0]) {
        var pos = latLonToCartesian([geometry[0][q][1], geometry[0][q][0]]);
        vertex(pos.x, pos.y);
      }
      endShape(CLOSE);
    }
  }
}
/*
function draw() {
  if (keyIsDown(68)) rotAngle += HALF_PI / 30;
  if (keyIsDown(65)) rotAngle -= HALF_PI / 30;
  if (keyIsDown(87)) R += 1000;
  if (keyIsDown(83)) R -= 1000;
}

function keyPressed() {
  if (keyCode == 32) draw_();
  if (keyCode == 77) showMap = !showMap;
  if (keyCode == 80) save();
}
*/
////////////////////////////////////////////
var minFlow;
var selectedSector = null;
var selectedMode = null;
var weight;
var showMap = true;
var showDrops = false;
var sinusoidal = true;
var colorByDistance = false;
var colorByMode = true;
var c = 0;
var t = 0;

function setup() {
  createCanvas(1080, 1080);
  ellipseMode(CENTER);
  pixelDensity(2);
  createMenu();  
  draw_();
}

function keyReleased() {
  draw_();
}

function mouseReleased() {
  draw_();
}

function draw_() {
  clear();
  getFlows(minFlow.value());
  background(0);
  drawLegend();
  translate(width / 2, height / 2);
  //rotAxis = myMap.latLonToCartesian({'lat':-33.66,'lon':-70.45});
  rotAxis = {
    'x': 300,
    'y': 300
  };

  for (var z1 in p) {
    if (centroids[z1]) {
      var pos1 = latLonToCartesian(centroids[z1][0]);
      for (var i in modes) {
        for (var z2 in p[z1][modes[i]]) {

          //fillHsluv(360/modes.length*i,100,70);
          noFill();
          if (centroids[z2][0]) {
            var pos2 = latLonToCartesian(centroids[z2][0]);
            var flow = p[z1][modes[i]][z2];
            strokeWeight(flow * thickness.value()); //.01
            //strokeWeight(.5);
            push();
            translate(rotAxis.x, rotAxis.y);
            var angle1 = angleBetween(rotAxis, pos1),
              angle2 = angleBetween(rotAxis, pos2);
            var d1 = dist(pos1.x, pos1.y, rotAxis.x, rotAxis.y),
              d2 = dist(pos2.x, pos2.y, rotAxis.x, rotAxis.y);
            var x1 = d1 * sin(angle1 + rotAngle),
              y1 = d1 * cos(angle1 + rotAngle),
              x2 = d2 * sin(angle2 + rotAngle),
              y2 = d2 * cos(angle2 + rotAngle);
            var angle = angleBetween(pos2, pos1);
            var dt = dist(pos1.x, pos1.y, pos2.x, pos2.y);
            if (!selectedSector || sectors[selectedSector].indexOf(centroids[z1][1]) >= 0 || sectors[selectedSector].indexOf(centroids[z2][1]) >= 0)
              if (colorByDistance) strokeHsluv(constrain(dt / 1.5, 0, 360), 100, 70, 255);
              else if (colorByMode) strokeHsluv(360 / allModes.length * allModes.indexOf(modes[i]), 100, 75, 255);
              else stroke('white');
            else strokeHsluv(0, 0, 70, 20);
            //color by distance

            var modeW = (weight.value() * i) * 2;
            beginShape();
            if (sinusoidal) curveVertex(x1, y1 + (weight.value() * dt + modeW));
            else curveVertex(x1 - (weight.value() * dt + modeW) * cos(angle), y1 + (weight.value() * dt + modeW) * sin(angle)); // add rotation one variablus + radius maybe eliminate translate
            curveVertex(x1, y1);
            curveVertex(x2, y2);
            if (sinusoidal) curveVertex(x2, y2 - (weight.value() * dt + modeW));
            else curveVertex(x2 - (weight.value() * dt + modeW) * cos(angle), y2 + (weight.value() * dt + modeW) * sin(angle));
            //ellipse(0, -dt / 2, dt, dt);
            endShape();
            //noStroke(), fillHsluv(dt,100,70,20);
            noStroke();

            if (!selectedSector || sectors[selectedSector].indexOf(centroids[z1][1]) >= 0 || sectors[selectedSector].indexOf(centroids[z2][1]) >= 0)
              if (colorByDistance) fillHsluv(constrain(dt / 1.5, 0, 360), 100, 70, 20);
              else if (colorByMode) fillHsluv(360 / allModes.length * allModes.indexOf(modes[i]), 100, 70, 40);
              else fill(255,40);
            else fillHsluv(0, 0, 70, 10);

            if (showDrops) ellipse((x1 + x2) / 2, (y1 + y2) / 2, sqrt(flow) * 2, sqrt(flow) * 2);
            //ellipse((pos2.x-pos1.x)*b, (pos2.y-pos1.y)*b,c,c);
            pop();
          }
        }
      }
    }
  }
  if (showMap) drawMap();
}