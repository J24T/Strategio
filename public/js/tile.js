class tile{
    constructor(idx, idy,x,y,tera, ress){
        this._initRess=ress,
        this._idx=idx,
        this._idy=idy,
        this._x=x,
        this._y=y,
        this._tera=tera,
        this._ress=ress;
        if (tera < 5 && tera > 0){
          this._walkable = true
        }
        else {this._walkable = false}
      }
      get y(){
        return this._y;
      }
      get x(){
        return this._x;
      }
      get tera(){
        return this._tera;
      }
      get idx(){
        return this._idx;
      }
      get idy(){
        return this._idy;
      }
      get ress(){
        return this._ress;
      }
      set ress(n){
        this._ress=n;
      }
      set tera(n){
        this._tera=n;
      }
      //added by Max
      get walkable(){
        return this._walkable;
      }
      set walkable(bool){
        this._walkable = bool;
      }
      get idxy() {
        return [this._idy, this._idx]
      }
} 