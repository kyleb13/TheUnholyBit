function Player(game, walksheet, shootsheet, standsheet) {
    this.animation = new Animation(walksheet, 64, 64, 8, .12, 32, true, 1.5);
    this.shootanimation = new Animation(shootsheet,64,64, 7, .05, 28, true, 1.5);
    this.standanimation = new Animation(standsheet, 64, 64, 1, .12, 4, true, 1.5);
    this.shootanimation.rowMode();
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
    Entity.call(this, game, 800, 800);
    var that = this;
    this.shootanimation.setCallbackOnFrame(6, {}, () =>{
        var x = that.x;
        var y = that.y;
        //change direction arrows come from based on
        //direction character is facing
        switch(that.movedir){
            case 0:
                x += 42;
                y -= 5;
                break;
            case 1:
                y += 44;
                x +=8;
                break;
            case 2:
                y += 75;
                x+=40;
                break;
            case 3:
                x +=46;
                y += 42;
                break;
        }
        that.game.addProjectile(new Projectile(that.game, 
            {
                img:that.game.assetManager.getAsset("./img/arrow.png"), 
                width:31, 
                height:5
            }, 300, //speed
            {//start point
                x:x, 
                y:y
            }, 
            {//end Point
                x:that.game.pointerx, 
                y:that.game.pointery
            }, 5));//lifetime
    });
}

Player.prototype = new Entity();
Player.prototype.constructor = Player;

Player.prototype.update = function () {
    var px = this.game.pointerx;
    var py = this.game.pointery;
    var center = this.center();
    var centerx = center.x;
    var centery= center.y;
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
    if(!this.game.lclick && !this.shootanimation.active) {
        let time = this.game.clockTick;
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
    } else if(this.game.lclick){
        this.xspeed = 0;
        this.yspeed = 0;
    }
    Entity.prototype.update.call(this);
}

Player.prototype.draw = function () {
    if(this.game.lclick || this.shootanimation.active){
        this.shootanimation.loop = this.game.lclick?true:false;
        this.shootanimation.drawFrameFromRow(this.game.clockTick, this.ctx, this.x, this.y, this.movedir);
    } else {
        if(this.xspeed!==0 || this.yspeed!==0){
            this.animation.drawFrameFromRow(this.game.clockTick, this.ctx, this.x, this.y, this.movedir);
        }else {
            this.standanimation.drawFrameFromRow(this.game.clockTick, this.ctx, this.x, this.y, this.movedir);
        }
    }
    if(this.game.showOutlines){
        this.ctx.strokeRect(this.boundingBox.x, this.boundingBox.y, this.boundingBox.width, this.boundingBox.height);
    }
    Entity.prototype.draw.call(this);
}

Player.prototype.center = function() {
    var centerx = this.x + this.animation.frameWidth/2;
    var centery= this.y + this.animation.frameHeight/2;
    return {x:centerx, y:centery};
}

function Crosshair(game, spritesheet){
    this.game = game;
    this.ctx = game.ctx;
    this.sheet = spritesheet;
    this.removeFromWorld = false;
    this.game.pointerx = this.game.player.x;
    this.game.pointery = this.game.player.y;
}

Crosshair.prototype.update = function() {
    this.game.pointerx += this.game.player.xspeed * this.game.clockTick;
    this.game.pointery += this.game.player.yspeed * this.game.clockTick;
};

Crosshair.prototype.draw = function() {
    this.ctx.drawImage(this.sheet, this.game.pointerx-7, this.game.pointery-7);
    this.ctx.strokeRect(this.game.pointerx, this.game.pointery, 2, 2);
};

//the spritesheet should be packaged in a json object with the width and height
function Projectile(game, spritesheet, speed, start, end, lifetime){
    this.game = game;
    this.ctx = game.ctx;
    this.xspeed = 0;
    this.yspeed = 0;
    var theta = 0;
    this.timer = 0;
    this.lifetime = lifetime;
    var dx = end.x - start.x;
    var dy = end.y - start.y;
    var pi = Math.PI;
    //determine x and y speed based on calculated angle
    if(dx === 0){
        this.yspeed = dy<0?speed:-speed;
        theta = dy<0?(4*pi)/3:pi/2;
    } else if(dy === 0){
        this.xspeed = dx>0?speed:-speed;
        theta = dx>0?pi:0;
    } else {
        theta = Math.atan(Math.abs(dy/dx));
        if(dy>0 && dx < 0) {
            theta = pi + theta;
        } else if(dy>0) {
            theta = 2*pi - theta;
        } else if(dx<0){
            theta = pi-theta;
        }
        this.xspeed = speed*Math.cos(theta);
        this.yspeed = -speed*Math.sin(theta);
    }
    //document.getElementById("debug-out2").innerHTML = `Arrow endpoint: x-${end.x}, y-${end.y}`;
    this.sheet = Entity.prototype.rotateAndCache(spritesheet, theta);
    Entity.call(this, game, start.x, start.y);
}

Projectile.prototype = new Entity();
Projectile.prototype.constructor = Projectile;

Projectile.prototype.update = function() {
    let time = this.game.clockTick;
    this.timer += time;
    if(this.timer < this.lifetime){
        this.x += time * this.xspeed;
        this.y += time * this.yspeed;
    } else {
        this.removeFromWorld = true;
    }
} 

Projectile.prototype.draw = function(){
    var x = this.x - this.sheet.center.x;
    var y = this.y - this.sheet.center.y;
    this.ctx.drawImage(this.sheet.img, x, y);
    //this.ctx.strokeRect(this.x, this.y, 2, 2);
}