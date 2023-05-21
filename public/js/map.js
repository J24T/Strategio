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

const mapTiles = []
const mapTilesNoXYZ = []

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
      mouseIsDown=true;    
  }, 200);
});
canvas7.addEventListener('click', (e) => {
  if(!mouseIsDown)
  {
    let id=getCursorPosition(canvas3, e);  
    var idx=id[0];
    var idy=id[1];
    var idz=id[2];
    highlightTile(idx,idy,idz);
    if (mapTiles[idx][idy][idz].walkable) 
    {
      playerOne.setDestinationXYZ([idx, idy, idz])
      start=mapTiles[playerOne.posX][playerOne.posY][playerOne.posZ]
      ziel=mapTiles[playerOne.destinationXYZ[0]][playerOne.destinationXYZ[1]][playerOne.destinationXYZ[2]]
      let path=getPath(start, ziel)
      if(path!="None")
      {
        playerOne.path=getPath(start, ziel)
        playerOne.setWalking(true)
      }
    }
  }
});
canvas7.onmousemove = function(e){
  let id=getCursorPosition(canvas3, e); 
  var idx=id[0];
  var idy=id[1];
  var idz=id[2];
  hoverTile(idx,idy,idz);
}
canvas7.addEventListener('contextmenu', function(e) {
  let id=getCursorPosition(canvas3, e);  
  var idx=id[0];
  var idy=id[1];
  build(mapTiles[idx][idy][idz],playerArr[0]);
})

//INITIALISIERUNG
drawGrid(canvas.width, canvas.height);
function setSpawn()
{
  spawn=Math.floor(Math.random()*mapTilesNoXYZ.length)
  zaehler=0
  for(let i of mapTilesNoXYZ)
  {
    if(zaehler==spawn)
    {
      if(i.walkable)
      {
        return [i.idx, i.idy, i.idz];
      }
      else
      {
        return setSpawn()
      }
    }
    zaehler++    
  }
}
function init() {
  
  //clear
  //von max
  spawnTile=setSpawn()
  playerOne = new Player ("player", spawnTile[0], spawnTile[1], spawnTile[2]);
  
  
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
  playerArr.forEach(function(player)
  {
    if (player.walking) 
    {
      if(player.path.length>0)
      {
        player.moveTo(player.path[0].idxyz)
        player.path.shift()
      }
      else
      {
        player.walking=false
      }
    }
    else 
    {
      playerTile = mapTiles[player.posX][player.posY][player.posZ];
      if (playerTile.ress > 0) 
      {
        playerTile.ress--;
        player.increaseRessource(playerTile.tera);
        updateTile(player.posX,player.posY,player.posZ);
      }
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
  for(let i of mapTilesNoXYZ)
  {
    xA=Math.abs(i.x-x);
    yA=Math.abs(i.y-y);
    if(xA+yA<diff)
    {
      diff=xA+yA;
      closest=i
    }
  }
  return [closest.idx,closest.idy, closest.idz];
}

//TILES HIGHLIGHTEN

function hoverTile(idx,idy,idz)
{
  x=mapTiles[idx][idy][idz].x;
  y=mapTiles[idx][idy][idz].y;
  otx.clearRect(0,0,canvas.width, canvas.height);
  otx.beginPath();
  for (let i = 0; i < 6; i++) 
  {
    otx.lineTo(x + r * Math.cos(a * i), y + r * Math.sin(a * i));
  }
  otx.closePath();
  otx.stroke();
}
function highlightTile(idx,idy,idz)
{
  x=mapTiles[idx][idy][idz].x;
  y=mapTiles[idx][idy][idz].y;
  htx.clearRect(0,0,canvas.width, canvas.height);
  htx.beginPath();
  for (let i = 0; i < 6; i++) {
    htx.lineTo(x + r * Math.cos(a * i), y + r * Math.sin(a * i));
  }
  htx.closePath();
  htx.stroke();
}

//TILE UPDATEN

function updateTile(idx,idy, idz)
{
  x=mapTiles[idx][idy][idz].x;
  y=mapTiles[idx][idy][idz].y;
  rtx.clearRect(x-8, y-14, 16, 12);

  switch (mapTiles[idx][idy][idz].tera) {
    case 1:
      rtx.fillText(''+mapTiles[idx][idy][idz].ress,x-5,y-5);          
      break;
    case 2:
      rtx.fillText(''+mapTiles[idx][idy][idz].ress,x-5,y-5);
      break;
    case 3:
      rtx.fillText(''+mapTiles[idx][idy][idz].ress,x-5,y-5);
      break;
    default:
  }
}

//GRID 

function drawGrid(width, height) 
{  
  let rand=Math.random()*100;
  for (let i = 0, y = r; y + r * Math.sin(a) < height; y += r * Math.sin(a)) 
  {   
    let idx=0
    let idy=0
    let idz=0
    for (let x = r, j = 0; x + r * (1 + Math.cos(a)) < width; x += r * (1 + Math.cos(a)), y += (-1) ** j++ * r * Math.sin(a))       
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
      if(j==0)
      {
        idx=100
        idy=100-i
        idz=100+i
      }
      else
        if(j%2==0)
        {
          idx=idx+1
          idy=idy
          idz=idz-1
        }
        else
        {
          idx=idx+1
          idy=idy-1
          idz=idz
        }
      newtile = new tile(
        idx,
        idy,
        idz,
        x+elevation,
        y+elevation*2,
        helpTera,
        Math.floor(Math.random() * (48))+16+extra,
      );
      drawMap(newtile);
      if(typeof mapTiles[idx] == 'undefined')
      {
        mapTiles[idx]=[];
      }
      if(typeof mapTiles[idx][idy] == 'undefined')
      {
        mapTiles[idx][idy]=[];
      }
      mapTiles[idx][idy][idz]=newtile;   
      mapTilesNoXYZ.push(newtile);   
    }
    i++;
  }
}
//GRID MALEN

function drawMap(tile)
{
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
//pathfinding
function getPath(start, ziel)
{
  let surrounding=[]
  let pathfind=[]
  start.steps=0
  pathfind.push(start)  
  for(let tile of getSurrounding(start))
  {        
    tile.steps=start.steps+1
    surrounding.push(tile)
  }
  var distance=Infinity
  var next=null
  for(let tile of surrounding)
  {
    if(getDistance(tile, ziel)+tile.steps<distance)
    {
      distance=getDistance(tile, ziel)+tile.steps
      next=tile
    }
  }
  pathfind.push(next)
  surrounding.splice(surrounding.indexOf(next),1) 
  if(getDistance(next, ziel)==0)
  {
    return [next]
  }
  else{
    return getPathR(next, ziel, surrounding, pathfind)
  }
}
//Recursive pathfinding
function getPathR(start, ziel, surrounding, pathfind)
{
  for(let tile of getSurrounding(start))
  {
    if(!surrounding.includes(tile) && !pathfind.includes(tile))
    {
      tile.steps=start.steps+1
      surrounding.push(tile)
    }
  }
  var distance=Infinity
  var next=null
  for(let tile of surrounding)
  {
    if(getDistance(tile, ziel)+tile.steps<distance)
    {
      distance=getDistance(tile, ziel)+tile.steps
      next=tile
    }
  }
  if(next==null)
  {
    return "None"
  }
  /*
  var anzahlGleicherDistanz=0
  for(let tile of surrounding)
  {
    if(getDistance(tile, ziel)+tile.steps==distance)
    {
      anzahlGleicherDistanz++
    }
  }
  if(anzahlGleicherDistanz>1)
  {
    var stepsMade=0
    for(let tile of surrounding)
    {
      if(getDistance(tile, ziel)+tile.steps==distance && tile.steps>stepsMade)
      {
        stepsMade=tile.steps
        next=tile
      }
    }
  }
  */
  pathfind.push(next)
  surrounding.splice(surrounding.indexOf(next),1) 
  if(getDistance(next, ziel)==0)
  {
    let finalPath=[]
    finalPath.push(next)
    for(let i=pathfind.length-1; i>=2; i--)
    {
      stepsMade=finalPath[finalPath.length-1].steps
      for(let tile of getSurrounding(finalPath[finalPath.length-1]))
      {
        if(pathfind.includes(tile))
        {
          if(tile.steps==stepsMade-1)
          {              
            stepsMade=tile.steps
            next=tile
          }
        }
      }      
      finalPath.push(next)
    }
    console.log(finalPath.length)
    finalPath = [...new Set(finalPath)];
    return finalPath.reverse() 
  }
  else
  {
    return getPathR(next, ziel, surrounding,pathfind)
  }
}

function getSurrounding(tile)
{
  tiles=[]
  x=tile.idx
  y=tile.idy
  z=tile.idz
  if(tileExists(x-1, y+1, z) && mapTiles[x-1][y+1][z].walkable)
    tiles.push(mapTiles[x-1][y+1][z])

  if(tileExists(x,y+1,z-1) && mapTiles[x][y+1][z-1].walkable)
    tiles.push(mapTiles[x][y+1][z-1])

  if(tileExists(x+1,y,z-1) && mapTiles[x+1][y][z-1].walkable)
    tiles.push(mapTiles[x+1][y][z-1])

  if(tileExists(x+1,y-1,z) && mapTiles[x+1][y-1][z].walkable)
    tiles.push(mapTiles[x+1][y-1][z])

  if(tileExists(x,y-1,z+1) && mapTiles[x][y-1][z+1].walkable)
    tiles.push(mapTiles[x][y-1][z+1])

  if(tileExists(x-1,y,z+1) && mapTiles[x-1][y][z+1].walkable)
    tiles.push(mapTiles[x-1][y][z+1])
  if(tile.steps%2==0)
  {
    return tiles.reverse()
  }
  else
  {
    return tiles
  }
}
function tileExists(x,y,z)
{
  if(typeof mapTiles[x]=='undefined')
  {
    return false
  }
  else if(typeof mapTiles[x][y]=='undefined')
  {
    return false
  }
  else if(typeof mapTiles[x][y][z]=='undefined')
  {
    return false
  }
  else
  {
    return true
  }
}
function getDistance(start, ziel)
{
  return Math.max(Math.abs(start.idx-ziel.idx), Math.abs(start.idy-ziel.idy), Math.abs(start.idz-ziel.idz))
}
//edited by Max
function calcDistanceXYZ(targetXYZ) {
  deltaX = Math.abs(targetXYZ[0] - playerOne.posX)
  deltaY = Math.abs(targetXYZ[1] - playerOne.posY)
  deltaZ = Math.abs(targetXYZ[2] - playerOne.posZ)
  return [deltaX, deltaY, deltaZ]
}

//edited by Max


//Building Funktionen

function build(tile, player)
{
  isBuilding=false;
  for(iterable of buildingArr)
  {
    if(iterable.tile==tile)
    {
      isBuilding=true;
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