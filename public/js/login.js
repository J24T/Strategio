

var spieler;
var helpToggle=false;
function show()
{   
    document.getElementById("ovrly").style.display="block";
    document.getElementById("login").style.display="block";
    document.getElementById("guiDiv").style.display="none";
}
function closeForm(a) 
{
    
    document.getElementById('timer').innerHTML =  05 + ":" + 00;
    startTimer(); 
    init(); 
    let element = document.getElementById("guiDiv");
    while (element.firstChild) 
    {
        element.removeChild(element.firstChild);
    }
    spieler=document.getElementById("nameInput").value;
    document.getElementById("guiDiv").appendChild(document.createTextNode(innerHTML=spieler));
    document.getElementById("guiDiv").appendChild(document.createElement("br"));
    document.getElementById("guiDiv").appendChild(document.createElement("br"));
	  
    
    var holz=document.createTextNode(innerHTML="Holz: "+playerArr[0].ressourceWALD); 
    document.getElementById("guiDiv").appendChild(holz);
    document.getElementById("guiDiv").appendChild(document.createElement("br"));  

    var weizen=document.createTextNode(innerHTML="Weizen: "+playerArr[0].ressourceKORN); 
    document.getElementById("guiDiv").appendChild(weizen);
    document.getElementById("guiDiv").appendChild(document.createElement("br"));

    var stein=document.createTextNode(innerHTML="Stein: "+playerArr[0].ressourceBERG); 
    document.getElementById("guiDiv").appendChild(stein);
    document.getElementById("guiDiv").appendChild(document.createElement("br"));    

    var score=document.createTextNode(innterHTML="Score: "+(playerArr[0].ressourceWALD*2+playerArr[0].ressourceKORN+playerArr[0].ressourceBERG*5));
    document.getElementById("guiDiv").appendChild(score);

    document.getElementById("guiDiv").appendChild(document.createElement("br"));
    document.getElementById("guiDiv").appendChild(document.createElement("br"));
    document.getElementById("guiDiv").appendChild(document.createTextNode(innerHTML="F1: Hilfe"));

    document.getElementById("ovrly").style.display="none";
    document.getElementById("login").style.display="none";
    document.getElementById("guiDiv").style.display="block";
}
function updateUI()
{
  let element = document.getElementById("guiDiv");
    while (element.firstChild) 
    {
        element.removeChild(element.firstChild);
    }
    
  document.getElementById("guiDiv").appendChild(document.createTextNode(innerHTML=spieler));
  document.getElementById("guiDiv").appendChild(document.createElement("br"));
  document.getElementById("guiDiv").appendChild(document.createElement("br"));

  var holz=document.createTextNode(innerHTML="Holz: "+playerArr[0].ressourceWALD); 
    document.getElementById("guiDiv").appendChild(holz);
    document.getElementById("guiDiv").appendChild(document.createElement("br")); 

    var weizen=document.createTextNode(innerHTML="Weizen: "+playerArr[0].ressourceKORN); 
    document.getElementById("guiDiv").appendChild(weizen);
    document.getElementById("guiDiv").appendChild(document.createElement("br"));

    var stein=document.createTextNode(innerHTML="Stein: "+playerArr[0].ressourceBERG); 
    document.getElementById("guiDiv").appendChild(stein);
    document.getElementById("guiDiv").appendChild(document.createElement("br"));

    var score=document.createTextNode(innterHTML="Score: "+(playerArr[0].ressourceWALD*2+playerArr[0].ressourceKORN+playerArr[0].ressourceBERG*5));
    document.getElementById("guiDiv").appendChild(score);

    document.getElementById("guiDiv").appendChild(document.createElement("br"));
    document.getElementById("guiDiv").appendChild(document.createElement("br"));
    document.getElementById("guiDiv").appendChild(document.createTextNode(innerHTML="F1: Hilfe"));
}
function gameOver()
{
  console.log("oha das is nich gut")
  show();
}
function helpScreen()
{
  if(!helpToggle)
  {
    document.getElementById("help").style.display="block";
    helpToggle=true;
  }
  else
  {
    document.getElementById("help").style.display="none";
    helpToggle=false;
  }  
}



function startTimer() {
  var presentTime = document.getElementById('timer').innerHTML;
  var timeArray = presentTime.split(/[:]+/);
  var m = timeArray[0];
  var s = checkSecond((timeArray[1] - 1));
  if(s==59){m=m-1}
  if(m<0){
    gameOver();
    return;
  }
  
  document.getElementById('timer').innerHTML = m + ":" + s;
  setTimeout(startTimer, 1000);  
}

function checkSecond(sec) {
  if (sec < 10 && sec >= 0) {sec = "0" + sec}; // add zero in front of numbers < 10
  if (sec < 0) {sec = "59"};
  return sec;
}
