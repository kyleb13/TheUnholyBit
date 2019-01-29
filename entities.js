function Player(game, walksheet, shootsheet, standsheet) {
    this.animation = new Animation(walksheet, 64, 64, 8, .12, 32, true, 1.5);
    this.shootanimation = new Animation(shootsheet,64,64, 7, .12, 28, true, 1.5);
    this.standanimation = new Animation(standsheet, 64, 64, 1, .12, 4, true, 1.5);
    this.maxSpeed = 200;
    this.xspeed = 0;
    this.yspeed = 0;
    this.changeTimer = 0;
    this.ctx = game.ctx;
    this.movedir = 3;
    this.boundingBox = {
        x:this.x, 
        y:this.y,
        width: 32,
        height: 65,
        offsetx:30,
        offsety:15
    }
    //this.shooting = false;
    Entity.call(this, game, 0, 500);
}

Player.prototype = new Entity();
Player.prototype.constructor = Player;

Player.prototype.update = function () {
    let time = this.game.clockTick;
    var px = this.game.pointerx;
    var py = this.game.pointery;
    var centerx = this.x + this.animation.frameWidth/2;
    var centery= this.y + this.animation.frameHeight/2;
    var xdiff = Math.abs(px - centerx);
    var ydiff = Math.abs(py - centery);

    //update direction character is pointing
    if(py< centery){//pointer is above character
        if(centerx > px && xdiff>ydiff){
            this.movedir = 1;
        } else if(ydiff>=xdiff){
            this.movedir = 0;
        } else{
            this.movedir = 3;
        }
    } else {
        if(centerx > px && xdiff>ydiff){
            this.movedir = 1;
        } else if(ydiff>=xdiff){
            this.movedir = 2;
        } else{
            this.movedir = 3;
        }
    }
    this.xspeed = 0;
    this.yspeed = 0;

    //update movement direction
    if(this.game.w) this.yspeed -=200;
    if(this.game.s) this.yspeed +=200;
    if(this.game.a) this.xspeed -=200;
    if(this.game.d) this.xspeed +=200;
    //slow down x and y if moving diagonally
    if(this.xspeed!==0 && this.yspeed !== 0){
        this.xspeed = (this.xspeed/1.48);
        this.yspeed = (this.yspeed/1.48);
    }

    this.x += time * this.xspeed;
    this.y += time * this.yspeed;
    this.boundingBox.x = this.x + this.boundingBox.offsetx;
    this.boundingBox.y = this.y + this.boundingBox.offsety;
    document.getElementById("debug-out2").innerHTML = `Player speed: x-${this.xspeed}, y-${this.yspeed} direction = ${this.movedir}`;
    Entity.prototype.update.call(this);
}

Player.prototype.draw = function () {
    // if(this.game.space || this.shootanimation.active){
    //    this.shootanimation.loop = this.game.space?true:false;
    //     this.shootanimation.drawFrameFromRow(this.game.clockTick, this.ctx, this.x, this.y-2, this.movedir);
    // } else {

    //     this.animation.drawFrameFromRow(this.game.clockTick, this.ctx, this.x, this.y, this.movedir);
    // }
    if(this.xspeed!==0 || this.yspeed!==0){
        this.animation.drawFrameFromRow(this.game.clockTick, this.ctx, this.x, this.y, this.movedir);
    }else {
        this.standanimation.drawFrameFromRow(this.game.clockTick, this.ctx, this.x, this.y, this.movedir);
    }
    
    if(this.game.showOutlines){
        this.ctx.strokeRect(this.boundingBox.x, this.boundingBox.y, this.boundingBox.width, this.boundingBox.height);
    }
    Entity.prototype.draw.call(this);
}

function Crosshair(game, spritesheet){
    this.game = game;
    this.ctx = game.ctx;
    this.sheet = spritesheet;
}

Crosshair.prototype.update = function() {};

Crosshair.prototype.draw = function() {
    this.ctx.drawImage(this.sheet, this.game.pointerx, this.game.pointery);
};