class Player {
    constructor(name, posX, posY){
            this._name = name,
            this._playerColor = "#FF0000",

            
            this._posX = posX,
            this._posY = posY,
                       
            this._width = 16,
            this._height = 16

            this._ressourceWALD = 0,
            this._ressourceKORN = 0,
            this._ressourceBERG = 0,


            this._walking = false,
            this._destinationX = posX,
            this._destinationY = posY
            
    }

    get name() {
        return this._name;
    }
    get posX() {
        return this._posX;
    }
    get posY() {
        return this._posY;
    }
    get X() {
        return mapTiles[this._posY][this._posX].x;
    }
    get Y() {
        return mapTiles[this._posY][this._posX].y;
    }
    get XY() {
        return [mapTiles[this._posY][this._posX].x, mapTiles[this._posY][this._posX].y];
    }
    get ressourceWALD() {
        return this._ressourceWALD
    }
    get ressourceKORN() {
        return this._ressourceKORN
    }
    get ressourceBERG() {
        return this._ressourceBERG
    }
    set ressourceWALD(n) {
        this._ressourceEINS=n;
    }
    set ressourceKORN(n) {
        this._ressourceZWEI=n;
    }
    set ressourceBERG(n) {
        this._ressourceDREI=n;
    }
    get destinationYX() {
        return [this._destinationY, this._destinationX]
    }
    get walking() {
        return this._walking
    }

    setDestinationXY(target) {
        this._destinationX = target[0],
        this._destinationY = target[1]
    }
    
    setDestinationYX(target) {
        this._destinationX = target[1],
        this._destinationY = target[0]
    }
    setWalking(bool) {
        this._walking = bool
    }

    increaseRessource(teraValue) {
        switch (teraValue) {
            case 1:
                this._ressourceWALD++;
                //console.log("WALD: " + this._ressourceWALD);
                break;
            case 2:
                this._ressourceKORN++;
                //console.log("KORN: " + this._ressourceKORN);
                break;
            case 3:
                this._ressourceBERG++;
                //console.log("BERG: " + this._ressourceBERG);
                break;
            default:
                //console.log("NoRessource: NULL")
                break;
        }
    }


    drawPlayer(tileCoordinates) {
        ptx.fillStyle = this._playerColor;
        ptx.fillRect(tileCoordinates[0] - (this._width / 2), tileCoordinates[1] - (this._width / 2), this._width, this._height);
        
    }
    
    //muss überarbeitet werden sobald wir das server side berechnen lassen für MP
    moveTo(newPosXY) {
        //Neu: Tiles werden bei Spieler nicht mehr walkable
        //Warnung: Wenn Spieler verschwinden muss walkablity wieder resettet weden

        mapTiles[this.posY][this.posX].walkable = true

        var tileCoordinates = this.XY;
        //ptx.clearRect(tileCoordinates[0] - (this._width / 2), tileCoordinates[1] - (this._width / 2), this._width, this._height);
        ptx.clearRect(0,0,canvas5.width, canvas5.height)
        this._posX = newPosXY[0]; this._posY = newPosXY[1];
        
        mapTiles[this.posY][this.posX].walkable = false        
        var tileCoordinates = this.XY;
        this.drawPlayer(tileCoordinates);        
    }

    //hexgrid movement
    //Ist X gerade kann er sich kostenlos beim x ändern nach oben bewegen, bei x ungerade nach unten. 


}