function HealthBar(game, entity, centerX, yoffset){
    this.game = game;
    this.ctx = game.ctx;
    this.entity = entity;
    this.centerx = centerX;
    this.barMax = entity.health;
    this.barCurrent = entity.health;
    this.yoffset = yoffset;
}

HealthBar.prototype.update = function () {
    this.barCurrent = this.entity.health;
    if(this.barCurrent <0){
        this.barCurrent = 0;
    } 
}

HealthBar.prototype.draw = function() {
    var xoffset = this.centerx - (this.barMax/2);
    this.ctx.fillStyle = "red";
    this.ctx.font = "12px Arial";
    this.ctx.fillRect(this.entity.x + xoffset, this.entity.y + this.yoffset, this.barCurrent, 10); 
    this.ctx.fillText(this.barCurrent, this.entity.x+ this.centerx -8, this.entity.y + this.yoffset);
    this.ctx.strokeRect(this.entity.x + xoffset, this.entity.y + this.yoffset, this.barMax, 10);
    //uncomment next line if you want to see where the bar is centered 
    //this.ctx.strokeRect(this.entity.x + this.centerx, this.entity.y, 1, 1); 
}

function Crosshair(game, spritesheet){
    this.game = game;
    this.ctx = game.ctx;
    this.sheet = spritesheet;
    this.removeFromWorld = false;
    this.game.pointerx = this.game.player.x;
    this.game.pointery = this.game.player.y;
}

// Crosshair.prototype.update = function() {
//     this.game.pointerx += this.game.player.xspeed * this.game.clockTick;
//     this.game.pointery += this.game.player.yspeed * this.game.clockTick;
// };

Crosshair.prototype.draw = function() {
    this.ctx.drawImage(this.sheet, this.game.pointerx-14, this.game.pointery-14);
    //this.ctx.strokeRect(this.game.pointerx, this.game.pointery, 2, 2);
};

