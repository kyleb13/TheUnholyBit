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
    this.velocity = { x: 200, y: 200 };
    this.boundingBox = {
        x:this.x, 
        y:this.y,
        width: 32,
        height: 65,
        offsetx:30,
        offsety:15
    }
    Entity.call(this, game, 400, 400);
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
            }, 5, "Player"));//lifetime
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
        if (!this.xspeed !== 0 || !this.yspeed !== 0) {
            for (var i = 0; i < this.game.entities.length; i++) {
                var ent = this.game.entities[i];
                if (ent instanceof Bunny && collide(this, ent)) {
                    tempVelocityX = ent.velocity.x * friction;
                    tempVelocityY = ent.velocity.y * friction;

                    ent.x -= 2 * tempVelocityX * this.game.clockTick;   
                    ent.y -= 2 * tempVelocityY * this.game.clockTick;
                  /*  ent.x -=  20;
                    ent.y -= this.yspeed;*/
                }
            
            }
        }
    } else if(this.game.lclick){
        this.xspeed = 0;
        this.yspeed = 0;
    }

    this.boundingBox.x = this.x + this.boundingBox.offsetx;
    this.boundingBox.y = this.y + this.boundingBox.offsety;
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
}

Crosshair.prototype.update = function() {
    this.game.pointerx += this.game.player.xspeed * this.game.clockTick;
    this.game.pointery += this.game.player.yspeed * this.game.clockTick;
};

Crosshair.prototype.draw = function() {
    this.ctx.drawImage(this.sheet, this.game.pointerx-7, this.game.pointery-7);
    this.ctx.strokeRect(this.game.pointerx, this.game.pointery, 2, 2);
};

function Projectile(game, spritesheet, speed, start, end, lifetime, shooter){
    this.shooter = shooter;
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
    
    this.boundingBox = {
        x:this.x, 
        y:this.y,
        width: 31,
        height: 4,
        offsetx:3,
        offsety:12
    }
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
        console.log("Xspeed: " + this.xspeed);
        console.log("Yspeed: " + this.yspeed);
    }
    this.sheet = Entity.prototype.rotateAndCache(spritesheet, theta);
    var temp = Entity.prototype.rotateAndCache(this.boundingBox, theta);
    this.rotatedBoundingBox = temp.img;
    Entity.call(this, game, start.x, start.y);
}

Projectile.prototype = new Entity();
Projectile.prototype.constructor = Projectile;

Projectile.prototype.update = function() {
    
    this.boundingBox.x = this.x + this.boundingBox.offsetx;
    this.boundingBox.y = this.y + this.boundingBox.offsety;

    let time = this.game.clockTick;
    this.timer += time;
    if(this.timer < this.lifetime){

        for (var i = 0; i < this.game.entities.length; i++) {
            var ent = this.game.entities[i];
            if (this.shooter !== "Player" && ent instanceof Player && collide(this, ent)) {
                this.handleCollision(ent);
            } else if (this.shooter === "Player" 
                        && (ent instanceof Bunny || ent instanceof RangeEnemy)
                        && collide(this, ent)) {
                this.handleCollision(ent);
            }
        }
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
    this.ctx.drawImage(this.rotatedBoundingBox, x, y);

}

Projectile.prototype.handleCollision = function(ent) {
    tempVelocityX = this.xspeed * friction;
    tempVelocityY = this.yspeed * friction;
     
    ent.x += 7 * tempVelocityX * this.game.clockTick;   
    ent.y += 7 * tempVelocityY * this.game.clockTick;
    this.removeFromWorld = true;
}