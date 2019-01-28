function Player(game, walksheet, shootsheet) {
    this.animation = new Animation(walksheet, 64, 64, 8, .12, 32, true, 1.5);
    this.shootanimation = new Animation(shootsheet,64,64, 7, .12, 28, true, 1.5);
    this.walksheet = walksheet;
    this.shootsheet = shootsheet;
    this.shootanimation.rowMode();
    this.animation.rowMode();
    this.maxSpeed = 200;
    this.xspeed = 200;
    this.yspeed = 0;
    this.changeTimer = 0;
    this.ctx = game.ctx;
    this.movedir = 3;
    //this.shooting = false;
    Entity.call(this, game, 0, 500);
}

Player.prototype = new Entity();
Player.prototype.constructor = Player;

Player.prototype.update = function () {
    Entity.prototype.update.call(this);
}

Player.prototype.draw = function () {
    // if(this.game.space || this.shootanimation.active){
    //    this.shootanimation.loop = this.game.space?true:false;
    //     this.shootanimation.drawFrameFromRow(this.game.clockTick, this.ctx, this.x, this.y-2, this.movedir);
    // } else {

    //     this.animation.drawFrameFromRow(this.game.clockTick, this.ctx, this.x, this.y, this.movedir);
    // }
    this.animation.drawFrameFromRow(this.game.clockTick, this.ctx, this.x, this.y, this.movedir);
    Entity.prototype.draw.call(this);
}