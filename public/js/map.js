//VARIABLEN


const canvas = document.getElementById("map");
const canvas2 = document.getElementById("highlight");
const canvas3 = document.getElementById("ressourcen");
const canvas4 = document.getElementById("hover");
const canvas5 = document.getElementById("player");
const canvas6 = document.getElementById("buildings");
const canvas7 = document.getElementById("mouseCanvas");

const ctx = canvas.getContext("2d");
const htx = canvas2.getContext("2d");
const rtx = canvas3.getContext("2d");
const otx = canvas4.getContext("2d");
const ptx = canvas5.getContext("2d");
const btx = canvas6.getContext("2d");
const mtx = canvas7.getContext("2d");

const a = (2 * Math.PI) / 6;
const r =  16;
const mapTiles = [];
var mountainTops= "#DFE2DF";
var mountainTopsShadow="#707170";
var mountains = "#8E9489";
var mountainsShadow = "#474A45";
var woods = "#367B28";
var woodsShadow = "#1B3E14";
var water = "#1469e1";
var waterShadow = "#0A3571";
var corn = "#FFDB70";
var cornShadow = "#806E38";
var field = "#b6ca53";
var fieldShadow = "#5B652A";
var defaultColor = "#160F29";
const WALD = 1;
const KORN = 2;
const BERG = 3;
const FELD = 4;
const WASSER = 5;
const BERGKUPPEL = 6;
rtx.fillStyle=defaultColor;
htx.strokeStyle="#f34213";
htx.lineWidth=5;
otx.lineWidth=3;
btx.lineWidth=2;

var playerArr = [];
const buildingArr = [];
var isBuilding=false;

var elem = document.getElementById("map"),
  elemLeft = elem.offsetLeft + elem.clientLeft,
  elemTop = elem.offsetTop + elem.clientTop,
  context = elem.getContext("2d");

var mouseIsDown=false;

//verhinder context menu

document.addEventListener('contextmenu', event => event.preventDefault());

//event listener für Maus

canvas7.addEventListener('mousedown', function() {
  mouseIsDown = false;
  var holdWait=setTimeout(function() {
      console.log("hold")
      mouseIsDown=true;    
  }, 200);
});
canvas7.addEventListener('click', (e) => {
  console.log(mouseIsDown);
  if(!mouseIsDown)
  {
    let id=getCursorPosition(canvas3, e);  
    var idx=id[0];
    var idy=id[1];
    highlightTile(idx,idy);
    console.log(mapTiles[idx][idy]);
    if (mapTiles[idx][idy].walkable) 
    {
      playerOne.setDestinationYX([idx, idy])
      playerOne.setWalking(true)
      //if (playerOne.walking) {console.log("success")}
      console.log("Set Player destination at X, Y: " + idy + ", " + idx)
    }
  }
});
canvas7.onmousemove = function(e){
  let id=getCursorPosition(canvas3, e); 
  var idx=id[0];
  var idy=id[1];
  hoverTile(idx,idy);
}
canvas7.addEventListener('contextmenu', function(e) {
  let id=getCursorPosition(canvas3, e);  
  var idx=id[0];
  var idy=id[1];
  build(mapTiles[idx][idy],playerArr[0]);
})

//INITIALISIERUNG
drawGrid(canvas.width, canvas.height);
function init() {
  
  //clear
  //von max
  spawnTile = [10, 10];
  while(!mapTiles[spawnTile[0]][spawnTile[1]].walkable) {
    spawnTile = [Math.floor(Math.random() * 40) + 5, Math.floor(Math.random() * 80) + 10]
  }
  console.log("Spawn at X, Y: " + spawnTile[1] + ", " + spawnTile[0])
  playerOne = new Player ("player", spawnTile[1], spawnTile[0]);
  //Im MP würde jeder spieler geadded werden, also bisher nur ein Kompatibilitäts ding
  playerArr = [playerOne]; 
  playerOne.drawPlayer(playerOne.XY);
  tick();
}

function tick() {
  buildingArr.forEach(function(e){
    eTile=e.tile;
    if (eTile.ress > 0) {
      eTile.ress--;
      e.player.increaseRessource(eTile.tera);
      updateTile(eTile.idx,eTile.idy);
    }
  })
  playerArr.forEach(function(player){

    if (player.walking) {
      //console.log("Player moving wird ausgelöst")
      playerMove = pathfindingNextTileXY(calcDistanceXY(player.destinationYX))
    
      //console.log((playerMove[0] != 0) || (playerMove[1] != 0))
    
      targetTile = mapTiles[player.posY + playerMove[1]][player.posX + playerMove[0]];

        if (targetTile.walkable) {
          player.moveTo(targetTile.idxy)
      }
        else {
          player.setWalking(false)
          console.log("Unpassable Terrain, pathfinding stopped")
    }
  }
    else {
    playerTile = mapTiles[player.posY][player.posX];
    if (playerTile.ress > 0) {
      playerTile.ress--;
      player.increaseRessource(playerTile.tera);
      updateTile(player.posY,player.posX);
    }
    //else {console.log("No ressources on this tile left")}
  }
})
  updateUI();
  setTimeout(tick, 500);
}

//CURSOR POSITION


function getCursorPosition(canvas, event) {
  const rect = canvas.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  let xA = 0;
  let yA = 0;
  let closest = null;
  let diff=1000000;
   
   for(var i=0; i<51;i++)
   {
    for(var j=0; j<105; j++)
    {
      xA=Math.abs(mapTiles[i][j].x-x);
      yA=Math.abs(mapTiles[i][j].y-y);
      if(xA+yA<diff)
      {
        diff=xA+yA;
        closest=mapTiles[i][j];
      }
    }
   }
  return [closest.idx,closest.idy];
}

//TILES HIGHLIGHTEN


function hoverTile(idx,idy)
{
  x=mapTiles[idx][idy].x;
  y=mapTiles[idx][idy].y;
  otx.clearRect(0,0,canvas.width, canvas.height);
  otx.beginPath();
  for (let i = 0; i < 6; i++) {
    otx.lineTo(x + r * Math.cos(a * i), y + r * Math.sin(a * i));
  }
  otx.closePath();
  otx.stroke();
}
function highlightTile(idx,idy)
{
  x=mapTiles[idx][idy].x;
  y=mapTiles[idx][idy].y;
  htx.clearRect(0,0,canvas.width, canvas.height);
  htx.beginPath();
  for (let i = 0; i < 6; i++) {
    htx.lineTo(x + r * Math.cos(a * i), y + r * Math.sin(a * i));
  }
  htx.closePath();
  htx.stroke();

}

//TILE UPDATEN


function updateTile(idx,idy)
{
  x=mapTiles[idx][idy].x;
  y=mapTiles[idx][idy].y;
  rtx.clearRect(x-8, y-14, 16, 12);

  switch (mapTiles[idx][idy].tera) {
    case 1:
      rtx.fillText(''+mapTiles[idx][idy].ress,x-5,y-5);          
      break;
    case 2:
      rtx.fillText(''+mapTiles[idx][idy].ress,x-5,y-5);
      break;
    case 3:
      rtx.fillText(''+mapTiles[idx][idy].ress,x-5,y-5);
      break;
    default:
  }
}

//GRID MIT DATEN FÜLLEN


function drawGrid(width, height) 
{  
  
  let rand=Math.random()*100;
  for (
    let i = 0, y = r; 
    y + r * Math.sin(a) < height; 
    y += r * Math.sin(a)
    ) 
    {
      
      var mapTile=[];
      for (
        let x = r, j = 0;
        x + r * (1 + Math.cos(a)) < width;
        x += r * (1 + Math.cos(a)), y += (-1) ** j++ * r * Math.sin(a)
      ) 
      {
        
      let extra=0;
      let nx=x/width-0.5;
      let ny=y/height-0.5;
      let help2=0;
      let help=ImprovedNoise.noise(5*nx,5*ny,rand);      
      let elevation=help*33;
      if(help<-0.6)
      {
        helpTera=BERGKUPPEL;
      } 
      else if(help<-0.45)
       {
        helpTera=BERG;
       }
       else if(help<-0.35)
       {
        helpTera=WALD;
       }
       else if(help<0.1)
       {
        help2=ImprovedNoise.noise(15*nx,15*ny,1);
        if(help2<-0.1)
        {
          helpTera=KORN;
        }
        else if(help2<0.4)
        {
          helpTera=FELD;
        }
        else if(help2<0.45)
        {
          helpTera=BERG;
          extra=24;
        }
        else{
          helpTera=WALD;
          extra=24;
        }
       }
       else
       {  
          helpTera=WASSER;
          elevation=4+Math.random();
       }
        newtile = new tile(
          i,
          j,
          x+elevation,
          y+elevation*2,          
          helpTera,
          Math.floor(Math.random() * (48))+16+extra,
        ); 
        mapTile[j]=newtile;         
      }
      mapTiles[i] = mapTile; 
      i++;
    }
    drawMap(width, height);
}

//GRID MALEN


function drawMap(width, height)
{
  for(var i=0; i<51;i++)
   {
    for(var j=0; j<105; j++)
    {
      tile=mapTiles[i][j];
      x=tile.x;
      y=tile.y;
      switch (tile.tera) 
      {
        case 1:
          ctx.fillStyle=woodsShadow;
          drawHexagon(x+7, y+12);
          ctx.fillStyle = woods;
          drawHexagon(x, y, tile.tera);
          rtx.fillText(''+tile.ress,x-5,y-5);          
          break;
        case 2:
          ctx.fillStyle=cornShadow;
          drawHexagon(x+7, y+12);
          ctx.fillStyle = corn;
          drawHexagon(x, y, tile.tera);        
          rtx.fillText(''+tile.ress,x-5,y-5);   
          break;
        case 3:
          ctx.fillStyle=mountainsShadow;
          drawHexagon(x+7, y+12);
          ctx.fillStyle = mountains;
          drawHexagon(x, y, tile.tera);
          rtx.fillText(''+tile.ress,x-5,y-5);
          break;
        case 4:
          ctx.fillStyle=fieldShadow;
          drawHexagon(x+7, y+12);
          ctx.fillStyle = field;
          drawHexagon(x, y, tile.tera);
          tile.ress=0;
          break;
        case 5:
          ctx.strokeStyle=waterShadow;
          ctx.fillStyle=waterShadow;
          drawHexagon(x+7, y+12);
          ctx.fillStyle = water;
          ctx.strokeStyle=water;
          drawHexagon(x, y, tile.tera);
          tile.ress=0;
          break;
        case 6:                 
          ctx.strokeStyle=mountainTopsShadow;
          ctx.fillStyle=mountainTopsShadow;
          drawHexagon(x+7, y+12);
          console.log(mountainTops);
          ctx.strokeStyle=mountainTops;
          ctx.fillStyle = mountainTops;   
          drawHexagon(x, y, tile.tera);
          tile.ress=0;
          break;
        default:
          ctx.fillStyle = defaultColor;
          drawHexagon(x, y, tile.tera);
          tile.ress=0;
      }
    }  
  }
}
function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}
function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}
function clampColor(color)
{
  if(color>255)
  {
    color=255;
  }
  if(color<0)
  {
    color=0;
  }
  return color;
}
function drawHexagon(x, y, tera) {
  //fillStyle zu String
  let fillString=ctx.fillStyle.toString();
  //Hex to RGB
  let red=hexToRgb(fillString).r;
  let green=hexToRgb(fillString).g;
  let blue=hexToRgb(fillString).b;
  let randomColorFactor=0;
  switch(tera)
  {
    case 1://WALD
      randomColorFactor=40;
      break;
    case 2://KORN
      randomColorFactor=10;
      green+=Math.floor(Math.random() * -30);
      blue+=Math.floor(Math.random() * -30);
      break;
    case 3://BERG
      randomColorFactor=30;
      break;
    case 4://WIESE
      randomColorFactor=10;
      red+=Math.floor(Math.random() * 20)-10;
      green+=Math.floor(Math.random() * 20)-10;
      blue+=Math.floor(Math.random() * 20)-10;
      break;
    case 5://WASSER
      randomColorFactor=10;
      break;
    case 6://SCHNEE
      randomColorFactor=10;
      break;
  }
  let randomBrightness=Math.floor(Math.random() * randomColorFactor)-randomColorFactor/2;
  //randomize and clamp colors
  red+=randomBrightness;
  red=clampColor(red);
  
  green+=randomBrightness;
  green=clampColor(green);

  blue+=randomBrightness;
  blue=clampColor(blue);
  console.log(red);
  //RGB to Hex in fillStyle
  ctx.fillStyle=rgbToHex(red,green,blue);

  //Draw Hexagon
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    ctx.lineTo(x + r * Math.cos(a * i), y + r * Math.sin(a * i));
  }
  ctx.closePath();
  ctx.stroke();
  ctx.fill();  

  //Reset strokeStyle
  ctx.strokeStyle=defaultColor;
}

//PLAYER FUNKTIONEN

function movePlayer(targetPlayer, targetID) {  
  targetPlayer.moveTo(targetID)
}

//edited by Max
function calcDistanceXY(targetYX) {
  console.log("Player Position X, Y: " + playerOne.posX + ", " + playerOne.posY)
  deltaX = targetYX[1] - playerOne.posX
  deltaY = targetYX[0] - playerOne.posY
  console.log("Distance to Tile X, Y:  " + deltaX + ", " + deltaY)
  return [deltaX, deltaY]
}

//edited by Max
function pathfindingNextTileXY(deltaXY) {
  
  //stattdessen eine funktion loopen die nur noch eine direction erlaubt?
  
  //Case PNT-Y: Bewegung auf Y Achse
  if (deltaXY[0] == 0) {
    if (deltaXY[1] == 0) {
      console.log("PNT: Arrived at destination")
      return [0, 0]
    } else {
      //console.log("pnt1 " + [0, (deltaXY[1]/Math.abs(deltaXY[1]))])
      return [0, (deltaXY[1]/Math.abs(deltaXY[1]))]
    }
  }

  //Case PNT-X: Bewegung auf X Achse
  else if (deltaXY[1] == 0) {
      //console.log("pnt2 " + [(deltaXY[0]/Math.abs(deltaXY[0])), 0])
      return [(deltaXY[0]/Math.abs(deltaXY[0])), 0]
  } 

  //Case PNT-Z: Bewegung auf "Z" Achse

  //NEUE IDEE: cases 1,1;-1,-1;1,-1;-1,1

  //Gerade ist free nach oben.
  else if (playerOne.posX % 2 == 0) {
    if (deltaXY[1] < 0) { 
      //console.log("pnt3 " + [(deltaXY[0]/Math.abs(deltaXY[0])), 0])
      return [(deltaXY[0]/Math.abs(deltaXY[0])), -1]
    }
    else {
      //console.log("pnt4 " + [(deltaXY[0]/Math.abs(deltaXY[0])), 1])
      return [(deltaXY[0]/Math.abs(deltaXY[0])), 0]
    }

    
  }

  else {
    if (deltaXY[1] > 0) {
      //console.log("pnt5 " + [(deltaXY[0]/Math.abs(deltaXY[0])), -1])
      return [(deltaXY[0]/Math.abs(deltaXY[0])), 1]
    }
    else {
      //console.log("pnt6 " + [(deltaXY[0]/Math.abs(deltaXY[0])), 0])
      return [(deltaXY[0]/Math.abs(deltaXY[0])), 0]
    }
  }
}

//Building Funktionen

function build(tile, player)
{
  isBuilding=false;
  for(iterable of buildingArr)
  {
    if(iterable.tile==tile)
    {
      isBuilding=true;
      console.log("schon bebaut");
    }
  }
  if(!isBuilding&&isNearPlayer(tile, player)==true)
  {
    let kannBauen=false;
    switch(tile.tera)
    {
      case 1:
        if(player.ressourceWALD>=5&&player.ressourceKORN>=10)
        { 
          kannBauen=true;
          player.ressourceWALD-=5;
          player.ressourceKORN-=10;
        }
        break;
      case 2:
        if(player.ressourceWALD>=10&&player.ressourceKORN>=5&&player.ressourceBERG>=10)
        {
          kannBauen=true;
          player.ressourceWALD-=10;
          player.ressourceKORN-=5;
          player.ressourceBERG-=10;
        }
        break;
      case 3:
        if(player.ressourceWALD>=30&&player.ressourceKORN>=20)
        {
          kannBauen=true;
          player.ressourceWALD-=30;
          player.ressourceKORN-=20;
        }          
        break;
      case 5:
        if(player.ressourceWALD>=5)
        { 
          tile.walkable=true;
          kannBauen=true;
          player.ressourceWALD-=5;
        }
        break;
    }
    if(kannBauen)
    {
      let build1=new building(tile.x,tile.y,tile.tera, player, tile);
      build1.drawBuild(btx);
      buildingArr.push(build1);
    }
    else
    {
      console.log("Nicht genug Ressourcen");
    }
    
  }    
}
function isNearPlayer(tile, player)
{
  if(tile.idx==player.posY&&tile.idy==player.posX)
  {
    return true;
  }
  else
  {
      if(Math.abs(tile.idx-player.posY)<2 && Math.abs(tile.idy-player.posX)<2)
      {
        if(player.posX%2==0)
        {
          console.log("TEST");
          if(tile.idx==player.posY+1&&tile.idy==player.posX-1)
          {
            return false;
          }
          if(tile.idx==player.posY+1&&tile.idy==player.posX+1)
          {
            return false;
          }
        }
        else
        {
          console.log("TEST2")
          if(tile.idx==player.posY-1&&tile.idy==player.posX-1)
          {
            return false;
          }
          if(tile.idx==player.posY-1&&tile.idy==player.posX+1)
          {
            return false;
          }
        }
        return true;
      }    
    
  }
  return false;
}


//BACKLOG
//QUELLE: 
//BERG RANDOM WASSER: CHECK NACHBARN, WENN TIEFER AUCH WASSER
//WASSER HELLIGKEIT AUF HÖHE BASIERT, VOR ALLEM AN UFER
//GOLDMINE NEUE RESSOURCE, RESSOURCE DIE ZEIT ERHÖHT?
//WALDBRÄNDE, BREITEN SICH AUS, MACHEN FELDER UNPASSIERBAR
//FOG OF WAR, SCHWARZES CANVAS MIT RADIEREN UM SPIELER
//WOLKEN DIE DRÜBERZIEHEN (PNGS DIE FLIEGEN WUUUUHUUUU)
//HIDDEN SECRETS AUF FELDERN BEI LAUFEN