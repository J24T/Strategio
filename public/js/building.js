class building{
    
    constructor(posX, posY, type, player, tile)
    {
        this._posX=posX;
        this._posY=posY;
        this._player=player;
        this._tile=tile;
        switch(type)
        {
            case 1:
                this._type="sawmill";
                break;
            case 2:
                this._type="farm";
                break;
            case 3:
                this._type="mine";
                break;
            case 4:
                this._type="house";
                break;
            case 5:
                this._type="bridge";
                break;
        }
    }
    get player()
    {
        return this._player;
    }
    get tile()
    {
        return this._tile;
    }
    get posX()
    {
        return this._posX;
    }
    get posY()
    {
        return this._posY;
    }
    get type()
    {
        return this._type;
    }
    drawBuild(btx)
    {
        switch(this.type)
        {
            case "sawmill":
                btx.strokeStyle="#6c4b00";
                btx.fillStyle="#a37000";
                btx.beginPath();
                btx.arc(this.posX-6,this.posY+8,8,0,2*Math.PI);
                btx.fill();
                break;
            case "farm":
                btx.strokeStyle="#ffffff";
                btx.fillStyle="#b50303";                            
                btx.beginPath();
                btx.rect(this.posX-12,this.posY+1,13,13);
                btx.fill();
                btx.lineWidth=1;
                btx.moveTo(this.posX-12, this.posY+1)
                btx.lineTo(this.posX+1, this.posY+14);
                btx.moveTo(this.posX+1, this.posY+1)
                btx.lineTo(this.posX-12, this.posY+14);
                btx.stroke();
                break;
            case "mine":
                btx.strokeStyle="#495a4f";
                btx.fillStyle="#b0bfb5";
                btx.beginPath();
                for (let i = 0; i < 6; i++) 
                {
                    btx.lineTo(this.posX-22 + r-8 * Math.cos(a * i), this.posY-8 + r-8 * Math.sin(a * i));
                }
                btx.fill();
                break;
            case "house":
                /*btx.strokeStyle="#ffffff";
                btx.fillStyle="#ffffff";
                btx.beginPath();
                btx.rect(this.posX-8,this.posY-8,16,16);
                btx.fill();*/
                break;
            case "bridge":
                btx.strokeStyle="#a37b7b";
                btx.fillStyle="#785554";
                btx.beginPath();
                for (let i = 0; i < 6; i++) {
                    btx.lineTo(this.posX + r * Math.cos(a * i), this.posY + r * Math.sin(a * i));
                  }
                btx.fill();
                break;
        }
        btx.closePath();        
        btx.stroke();
        
        btx.lineWidth=2;
    }
}