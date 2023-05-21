class tile{
    constructor(idx=0, idy=0, idz=0, x, y, tera, ress){
        this._initRess=ress,
        this._idx=idx,
        this._idy=idy,
        this._idz=idz,
        this._x=x,
        this._y=y,
        this._tera=tera,
        this._ress=ress,
        this._steps=0;
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
      get idz(){
        return this._idz;
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
      get steps(){
        return this._steps;
      }
      set steps(n)
      {
        this._steps=n;
      }
      //added by Max
      get walkable(){
        return this._walkable;
      }
      set walkable(bool){
        this._walkable = bool;
      }
      get idxyz() {
        return [this._idx, this._idy, this._idz]
      }
} 