function Animation2(spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse) {
    this.spriteSheet = spriteSheet;
    this.startX = startX;
    this.startY = startY;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.reverse = reverse;
    this.callbackEnabled = false;
    this.callbackFrame = -1;
    this.callback = null;
    this.callbackArgs = null;
    this.callbackDone = false;
}

    
function distance(a, b) {
    var dx = a.x - b.x;
    var dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
}


Animation2.prototype.setCallbackOnFrame = function(frame,args,callback){
    this.callbackEnabled = true;
    this.callbackFrame = frame;
    this.callback = callback;
    this.callbackArgs = args;
}

Animation2.prototype.drawFrame = function (tick, ctx, x, y, scaleBy, ent) {
    var scaleBy = scaleBy || 1;

    this.elapsedTime += tick;
    var frame = this.currentFrame();
    if(this.callbackEnabled && frame === this.callbackFrame && !this.callbackDone){
        this.callbackDone = true;
        this.callback(this.callbackArgs);
    }

    var itemPercentage = Math.random(); 
    var dropType;
    if (itemPercentage > 0.5 && itemPercentage < 0.75) {
        dropType = "ammo";
    } else if(itemPercentage > 0.75 && itemPercentage <= 1.0) {
        dropType = "HP";
    }

    if (this.loop) {
        if (this.isDone()) {
            this.elapsedTime = 0;
            this.callbackDone = false;
            
            if (ent !== undefined) {
                ent.removeFromWorld = true;
                if (ent instanceof Player) {
                    sceneManager.reloadLevel();
                } else if (ent instanceof FinalRabbitDestination) {
                    sceneManager.loadNextLevel();
                } else {
                    if (dropType !== undefined) {          
                        ent.game.addEntity(new Powerup(ent.game, ent.x, ent.y, dropType));
                    }    
                }
                
            }
        }
        
    } else if (this.isDone()) {
        if (ent !== undefined) {
           ent.removeFromWorld = true;   
           if (ent instanceof Player) {
            sceneManager.reloadLevel();
            } else if (ent instanceof FinalRabbitDestination) {
                sceneManager.loadNextLevel();
            }  else {
                if (dropType !== undefined) {
                    ent.game.addEntity(new Powerup(ent.game, ent.x, ent.y, dropType));
                }
             }
        }
        return;
    }

    var index = this.reverse ? this.frames - this.currentFrame() - 1 : this.currentFrame();
    var vindex = 0;
    if ((index + 1) * this.frameWidth + this.startX > this.spriteSheet.width) {
        index -= Math.floor((this.spriteSheet.width - this.startX) / this.frameWidth);
        vindex++;
    }
    while ((index + 1) * this.frameWidth > this.spriteSheet.width) {
        index -= Math.floor(this.spriteSheet.width / this.frameWidth);
        vindex++;
    }

    var locX = x;
    var locY = y;
    var offset = vindex === 0 ? this.startX : 0;
    ctx.drawImage(this.spriteSheet,
                  index * this.frameWidth + offset, vindex * this.frameHeight + this.startY,  // source from sheet
                  this.frameWidth, this.frameHeight,
                  locX, locY,
                  this.frameWidth * scaleBy,
                  this.frameHeight * scaleBy);
}

Animation2.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation2.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

Animation2.prototype.drawFrameFromRow = function (tick, ctx, x, y, row) {
    this.elapsedTime += tick;
    if (this.isDone()) {
        if (this.loop) this.elapsedTime = 0;
    }
    var frame = this.currentFrameRow();
    var yindex = this.frameHeight * row;

    ctx.drawImage(this.spriteSheet,
                 frame * this.frameWidth, yindex,  // source from sheet
                 this.frameWidth, this.frameHeight,
                 x, y,
                 this.frameWidth * this.scale,
                 this.frameHeight * this.scale);
}
Animation2.prototype.currentFrameRow = function () {
    return Math.floor(this.elapsedTime / this.frameDuration)%this.sheetWidth;
}

function shiftDirection(ent1, ent2) {
    var enemyX = ent2.x;
    var enemyY = ent2.y;
    var centerx =ent1.x + ent1.walkAnimations["right"].frameWidth/2;
    var centery= ent1.y + ent1.walkAnimations["right"].frameWidth/2;
    var xdiff = Math.abs(enemyX - centerx);
    var ydiff = Math.abs(enemyY - centery);

    //update direction character is pointing
    if(enemyY< centery){//pointer is above character
        if(centerx > enemyX && xdiff>ydiff){
            ent1.direction = "left";
        } else if(ydiff>=xdiff){
            ent1.direction = "up";
        } else{
            ent1.direction = "right";
        }
    } else {
        if(centerx > enemyX && xdiff>ydiff){
            ent1.direction = "left";
        } else if(ydiff>=xdiff){
            ent1.direction = "down";
        } else{
            ent1.direction = "right";
        }
    }
}

function AdvancedAttacks(x, y, that) {
        var x2= x;
        var y2 = y;
        var x3 = x;
        var y3 = y;

      switch(that.direction){
                    case "up":
                        x += 35;
                        y -= 15;
                        x2 -= 10;
                        x3 += 10;
                        break;
                    case "left":
                        y += 55;
                        y2 += 25;
                        y3 += 40;
                        break;
                    case "right":
                    
                        x+=25;
                        y += 30;
                        y2 -= 10;
                        y3 += 10;
                        x2+=25;
                        x3+=25;
                        break;
                    case "down":
                        x +=30;
                        y += 30;
                        x2 -= 10;
                        x3 += 10;
                        y2 += 30;
                        y3 += 30;
                        break;
                }

                if (that.species === "HoodedArcher") {
                    addProjectile(that, x, y, "arrow", "Enemy", 5);
                    addProjectile(that, x2, y2, "arrow", "Enemy", 5);
                    addProjectile(that, x3, y3, "arrow", "Enemy", 5);
                } else {
                    addProjectile(that, x, y, "magic", "Enemy", 10);
                    addProjectile(that, x2, y2, "magic", "Enemy", 10);
                    addProjectile(that, x3, y3, "magic", "Enemy", 10);
                }
                
}

function RangeEnemy(game, spritesheet, spawnX, spawnY, type, projectile, species) {

    this.walkAnimations = [];
    this.attackAnimations =[];
    this.standingAnimations = [];
    this.species = species;
    this.walkAnimations["up"] = new Animation2 (spritesheet, 0, 512, 64, 64, 0.1, 8, true, false);
    this.walkAnimations["left"] = new Animation2 (spritesheet, 0, 576, 64, 64, 0.1, 8, true, false);
    this.walkAnimations["down"] = new Animation2 (spritesheet, 0, 640, 64, 64, 0.1, 8, true, false);
    this.walkAnimations["right"] = new Animation2 (spritesheet, 0, 704, 64, 64, 0.1, 8, true, false);

    this.attackAnimations["up"] = new Animation2 (spritesheet, type.x, type.y, type.w, type.h, type.d, type.f, type.l, type.r);
    this.attackAnimations["left"] = new Animation2 (spritesheet, type.x, type.y+64, type.w, type.h, type.d, type.f, type.l, type.r);
    this.attackAnimations["down"]= new Animation2 (spritesheet, type.x, type.y+128, type.w, type.h, type.d, type.f, type.l, type.r);
    this.attackAnimations["right"] = new Animation2 (spritesheet, type.x, type.y+192, type.w, type.h, type.d, type.f, type.l, type.r);

    var that = this;
    for (var index in this.attackAnimations) {   
        this.attackAnimations[index].setCallbackOnFrame(6, {}, () => {
            var x = that.x;
            var y = that.y;

            if (that.species === "HoodedArcher" || that.species === "AdvMagic") {
              AdvancedAttacks(x, y, that)
            } else {
                    switch(that.direction){
                    case "up":
                        x += 35;
                        y -= 15;
                        break;
                    case "left":
                        y += 35;
                        break;
                    case "right":
                        y += 35;
                        x+=25;
                        break;
                    case "down":
                        x +=30;
                        y += 30;
                        break;
                }
                var dmg = 13;
                if (projectile === "magic") {
                    dmg += 5;
                }

                addProjectile(that, x, y, projectile, "Enemy", dmg)
            }         
        });
    }
    this.standingAnimations["up"] = new Animation2 (spritesheet, 0, 512, 64, 64, 0.1, 1, true, false);
    this.standingAnimations["left"] = new Animation2 (spritesheet, 0, 576, 64, 64, 0.1, 1, true, false);
    this.standingAnimations["down"] = new Animation2 (spritesheet, 0, 640, 64, 64, 0.1, 1, true, false);
    this.standingAnimations["right"] = new Animation2 (spritesheet, 0, 704, 64, 64, 0.1, 1, true, false);

    this.DyingAnimation = new Animation2(spritesheet, 0, 1280, 64, 64, 0.1, 6, false, false);

    this.boundingBox = {
        x:this.x, 
        y:this.y,
        width: 32,
        height: 65,
        offsetx:32,
        offsety:24
    }

    this.visualBox = {
        x:this.x, 
        y:this.y,
        width: 1500,
        height: 1300,
        offsetx:-695,
        offsety:-650
    }

    this.attackBox = {
        x:this.x, 
        y:this.y,
        width: 1000,
        height: 500,
        offsetx:-500,
        offsety:-210
    }
    this.followPoint = {x:0, y:0};
    this.following = false;
    this.attacking = false;
    this.direction = "down";
    this.ctx = game.ctx;

    
    this.moveRestrictions = {left:false, right:false, up:false, down:false};
    this.velocity = { x: Math.random() * 1000, y: Math.random() * 1000 };
    var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
    if (speed > maxSpeed) {
        var ratio = maxSpeed / speed;
        this.velocity.x *= ratio;
        this.velocity.y *= ratio;
    }
    this.health = 100;
    this.healthBar = new HealthBar(game, this, 46, -10);
    Entity.call(this, game, spawnX, spawnY);
}

RangeEnemy.prototype = new Entity();
RangeEnemy.prototype.constructor = RangeEnemy;

RangeEnemy.prototype.center = function() {
    var centerx = this.x + 64/2;
    var centery= this.y + 64/2;
    return {x:centerx, y:centery};
}

function addProjectile(that, x, y, type, shooter, damage) {  
    var img;
    var height;
    var width;
    
    var dmg = damage
    var center = that.followPoint.center();
    if (type === "arrow") {
        img = that.game.assetManager.getAsset("./img/enemyArrow.png")
        width = 31;
        height = 5;
        
    } else if (type === "magic") {
        img = that.game.assetManager.getAsset("./img/fireball.png")
        width = 26;
        height = 17;
        y = y + 20;
    } else if (type === "carrot") {
        img = that.game.assetManager.getAsset("./img/carrot.png")
        width = 49;
        height = 28;
    }
     that.game.addEntity(new Projectile(that.game, 
    {
        img, 
        width, 
        height
    }, 350, //speed
    {//start point
        x:x, 
        y:y
    }, 
    {//end Point
        x:center.x, 
        y:center.y
    }, 5, shooter, dmg));//lifetime
}
RangeEnemy.prototype.collide = function (other) {
    return distance(this, other) < this.radius + other.radius;
};

RangeEnemy.prototype.collideLeft = function () {
    return (this.x - this.radius) < 0;
};

RangeEnemy.prototype.collideRight = function () {
    return (this.x + this.radius) > 800;
};

RangeEnemy.prototype.collideTop = function () {
    return (this.y - this.radius) < 0;
};

RangeEnemy.prototype.collideBottom = function () {
    return (this.y + this.radius) > 650;
};

RangeEnemy.prototype.update = function () {   
    Entity.prototype.update.call(this);
    
    this.moveRestrictions = {left:false, right:false, up:false, down:false};
    this.boundingBox.x = this.x + this.boundingBox.offsetx;
    this.boundingBox.y = this.y + this.boundingBox.offsety;

    this.visualBox.x = this.x + this.visualBox.offsetx;
    this.visualBox.y = this.y + this.visualBox.offsety;

    this.attackBox.x = this.x + this.attackBox.offsetx;
    this.attackBox.y = this.y + this.attackBox.offsety;
    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        if (ent instanceof Player && !ent.removeFromWorld) {
            if (collide({boundingBox: this.visualBox}, ent)) {
                this.following = true;
                var dist = distance(this, ent);
                this.followPoint = ent;

                let time = this.game.clockTick;
                if (collide(ent, {boundingBox: this.attackBox})) {
                    this.attacking = true;
                    if (collide(this, ent)) {
                        var temp = { x: this.velocity.x, y: this.velocity.y };
        
                        tempVelocityX = temp.x * friction;
                        tempVelocityY = temp.y * friction;
        
                        ent.x -= 20 * tempVelocityX * this.game.clockTick;
                        ent.y -= 20 * tempVelocityY * this.game.clockTick;
                    }
                } else {
                    this.attacking = false;
                    var difX = (ent.x - this.x)/dist;
                    var difY = (ent.y - this.y)/dist;
                    this.velocity.x += difX * acceleration / (dist*dist);
                    this.velocity.y += difY * acceleration / (dist * dist);
                    var speed = Math.sqrt(this.velocity.x*this.velocity.x + this.velocity.y*this.velocity.y);
                    if (speed > maxSpeed) {
                        var ratio = maxSpeed / speed;
                        this.velocity.x *= ratio;
                        this.velocity.y *= ratio;
                    }
                    
                    this.x += this.velocity.x * this.game.clockTick;
                this.y += this.velocity.y * this.game.clockTick;
                }
                shiftDirection(this, ent);
            } else if (!collide({boundingBox: this.visualBox}, ent)) {
                this.following = false;
            } 
    
        } else if(ent instanceof Background) {
            LevelBoundingBoxCollsion(ent, this)
        }
        
    }
    this.healthBar.update();

    if (this.health < 1) {
        this.dead = true;
        this.attacking = false;
        this.following = false;
    }
}



RangeEnemy.prototype.draw = function () {
    if (this.attacking && !this.dead) {
        this.attackAnimations[this.direction].drawFrame(this.game.clockTick, this.ctx, this.x, this.y, 1.5);
    } else if (this.following&& !this.dead) {
        this.walkAnimations[this.direction].drawFrame(this.game.clockTick, this.ctx, this.x, this.y, 1.5);
    } else if (!this.attacking && !this.following && !this.dead) {
        this.standingAnimations[this.direction].drawFrame(this.game.clockTick, this.ctx, this.x, this.y, 1.5);
    } 

    
    if (this.dead) {
        this.DyingAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, 1.5, this);
    }
    this.healthBar.draw();
    if (this.game.showOutlines) {
        this.ctx.strokeRect(this.boundingBox.x, this.boundingBox.y, this.boundingBox.width, this.boundingBox.height);
        this.ctx.strokeRect(this.attackBox.x, this.attackBox.y, this.attackBox.width, this.attackBox.height);
        this.ctx.strokeRect(this.visualBox.x, this.visualBox.y, this.visualBox.width, this.visualBox.height);
    }
    Entity.prototype.draw.call(this);
}



function collide(ent1, ent2) {
    if ( !(ent1 instanceof Background || ent1 instanceof Crosshair)
      && !(ent2 instanceof Background || ent2 instanceof Crosshair)) {
        return (ent1.boundingBox.x < ent2.boundingBox.x + ent2.boundingBox.width
            && ent1.boundingBox.x + ent1.boundingBox.width > ent2.boundingBox.x 
            && ent1.boundingBox.y < ent2.boundingBox.y + ent2.boundingBox.height 
            && ent1.boundingBox.height + ent1.boundingBox.y > ent2.boundingBox.y);
    }
    return false;
}

function Bunny(game, spritesheet, x, y) {
    this.walkAnimations = [];
    this.deathAnimations = [];
    this.maxSpeed = 175;
    
    this.walkAnimations["down"] = new Animation2(spritesheet, 0, 0, 48, 64, 0.1, 7, true, false);
    this.walkAnimations["up"] = new Animation2(spritesheet, 0, 64, 48, 64, 0.1, 7, true, false);
    this.walkAnimations["right"] = new Animation2(spritesheet, 0, 128, 48, 64, 0.1, 7, true, false);
    this.walkAnimations["left"] = new Animation2(spritesheet, 0, 192, 48, 64, 0.1, 7, true, false);
 
    this.deathAnimations["down"] = new Animation2(spritesheet, 288, 0, 48, 64, 0.1, 3, false, false);
    this.deathAnimations["up"] = new Animation2(spritesheet, 288, 64, 48, 64, 0.1, 3, false, false);
    this.deathAnimations["right"] = new Animation2(spritesheet, 288, 128, 48, 64, 0.1, 3, false, false);
    this.deathAnimations["left"] = new Animation2(spritesheet, 288, 192, 48, 64, 0.1, 3, false, false);
    
    this.direction = "right";
    this.visualRadius = 800;
    this.ctx = game.ctx;
    
    this.moveRestrictions = {left:false, right:false, up:false, down:false};
    this.velocity = { x: Math.random() * 1000, y: Math.random() * 1000 };
    var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
    if (speed > this.maxSpeed) {
        var ratio = this.maxSpeed / speed;
        this.velocity.x *= ratio;
        this.velocity.y *= ratio;
    }
    Entity.call(this, game, x, y);
    
    this.boundingBox = {
        x:this.x, 
        y:this.y,
        width: 40,
        height: 40,
        offsetx:15,
        offsety:32
    }

    this.visualBox = {
        x:this.x, 
        y:this.y,
        width: 1500,
        height: 1500,
        offsetx:-700,
        offsety:-850
    }
    this.dead = false;
    this.health = 75;
    this.healthBar = new HealthBar(game, this, 46, -10);

}

Bunny.prototype = new Entity();
Bunny.prototype.constructor = Bunny;

Bunny.prototype.collide = function (other) {
    return distance(this, other) < this.radius + other.radius;
};

Bunny.prototype.collideLeft = function () {
    return (this.x - this.radius) < 0;
};

Bunny.prototype.collideRight = function () {
    return (this.x + this.radius) > 800;
};

Bunny.prototype.collideTop = function () {
    return (this.y - this.radius) < 0;
};

Bunny.prototype.collideBottom = function () {
    return (this.y + this.radius) > 650;
};

Bunny.prototype.update = function () {

    this.moveRestrictions = {left:false, right:false, up:false, down:false};
    this.boundingBox.x = this.x + this.boundingBox.offsetx;
    this.boundingBox.y = this.y + this.boundingBox.offsety;

    this.visualBox.x = this.x + this.visualBox.offsetx;
    this.visualBox.y = this.y + this.visualBox.offsety;

    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        if (collide(ent, {boundingBox: this.visualBox }) && ent instanceof Player ) {
            
        let time = this.game.clockTick;
            var dist = distance(this, ent);
                shiftDirection(this, ent);
                var difX = (ent.x - this.x)/dist;
                var difY = (ent.y - this.y)/dist;
                this.velocity.x += difX * acceleration / (dist*dist);
                this.velocity.y += difY * acceleration / (dist * dist);
                var speed = Math.sqrt(this.velocity.x*this.velocity.x + this.velocity.y*this.velocity.y);
                if (speed > this.maxSpeed) {
                    var ratio = this.maxSpeed / speed;
                    this.velocity.x *= ratio;
                    this.velocity.y *= ratio;
                }
                
                if (ent instanceof Player && collide(this, ent)) {
                    var temp = { x: this.velocity.x, y: this.velocity.y };

                    tempVelocityX = temp.x * friction;
                    tempVelocityY = temp.y * friction;
                    

                   this.x -= 10 * tempVelocityX * this.game.clockTick;
                   this.y -= 10 * tempVelocityY * this.game.clockTick;
                    ent.health -= 5;
                }
                if((!this.moveRestrictions.left && this.velocity.x<0) || (!this.moveRestrictions.right && this.velocity.x>0)){
                    this.x += time * this.velocity.x;
                }
                if((!this.moveRestrictions.up && this.velocity.y<0) || (!this.moveRestrictions.down && this.velocity.y>0)){
                    this.y += time * this.velocity.y;
                }  
                
            
        } else if (ent instanceof Background) {
            LevelBoundingBoxCollsion(ent, this);
        }
    }

    if (this.health < 1) {
        this.dead = true;
    }

    
    this.healthBar.update();
    Entity.prototype.update.call(this);
}

Bunny.prototype.draw = function () {
  
    if(this.dead){
        this.deathAnimations[this.direction].drawFrame(this.game.clockTick, this.ctx, this.x, this.y, 1.5, this);
    } else {
        this.walkAnimations[this.direction].drawFrame(this.game.clockTick, this.ctx, this.x, this.y, 1.5);
    }
    if (this.game.showOutlines) {
        this.ctx.strokeRect(this.boundingBox.x, this.boundingBox.y, this.boundingBox.width, this.boundingBox.height);
        this.ctx.strokeRect(this.visualBox.x, this.visualBox.y, this.visualBox.width, this.visualBox.height);
    }
    Entity.prototype.draw.call(this);
    
    this.healthBar.draw();
}

function BlackBunny(game, spritesheet, x, y) {
    this.walkAnimations = [];
    this.deathAnimations = [];
    this.maxSpeed = 175;
    
    this.walkAnimations["down"] = new Animation2(spritesheet, 0, 0, 48, 64, 0.1, 7, true, false);
    this.walkAnimations["up"] = new Animation2(spritesheet, 0, 64, 48, 64, 0.1, 7, true, false);
    this.walkAnimations["right"] = new Animation2(spritesheet, 0, 128, 48, 64, 0.1, 7, true, false);
    this.walkAnimations["left"] = new Animation2(spritesheet, 0, 192, 48, 64, 0.1, 7, true, false);
 
    this.deathAnimations["down"] = new Animation2(spritesheet, 288, 0, 48, 64, 0.1, 3, false, false);
    this.deathAnimations["up"] = new Animation2(spritesheet, 288, 64, 48, 64, 0.1, 3, false, false);
    this.deathAnimations["right"] = new Animation2(spritesheet, 288, 128, 48, 64, 0.1, 3, false, false);
    this.deathAnimations["left"] = new Animation2(spritesheet, 288, 192, 48, 64, 0.1, 3, false, true);
    
    this.direction = "right";
    this.visualRadius = 1200;
    this.attackRadius = 700;
    this.ctx = game.ctx;
    this.attacking = false;
    this.attackTimer = 0;
    this.moveRestrictions = {left:false, right:false, up:false, down:false};
    this.velocity = { x: Math.random() * 1000, y: Math.random() * 1000 };
    var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
    if (speed > this.maxSpeed) {
        var ratio = this.maxSpeed / speed;
        this.velocity.x *= ratio;
        this.velocity.y *= ratio;
    }
    Entity.call(this, game, x, y);
    
    this.boundingBox = {
        x:this.x, 
        y:this.y,
        width: 40,
        height: 40,
        offsetx:15,
        offsety:32
    }

    this.visualBox = {
        x:this.x, 
        y:this.y,
        width: 1900,
        height: 1500,
        offsetx:-900,
        offsety:-850
    }
    this.attackBox = {
        x:this.x, 
        y:this.y,
        width: 1400,
        height: 700,
        offsetx:-700,
        offsety:-350
    }
    this.dead = false;
    this.health = 100;
    this.healthBar = new HealthBar(game, this, 46, -10);

}

BlackBunny.prototype = new Entity();
BlackBunny.prototype.constructor = BlackBunny;

BlackBunny.prototype.collide = function (other) {
    return distance(this, other) < this.radius + other.radius;
};

BlackBunny.prototype.collideLeft = function () {
    return (this.x - this.radius) < 0;
};

BlackBunny.prototype.collideRight = function () {
    return (this.x + this.radius) > 800;
};

BlackBunny.prototype.collideTop = function () {
    return (this.y - this.radius) < 0;
};

BlackBunny.prototype.collideBottom = function () {
    return (this.y + this.radius) > 650;
};

BlackBunny.prototype.update = function () {
    let time = this.game.clockTick;
    this.moveRestrictions = {left:false, right:false, up:false, down:false};
    this.boundingBox.x = this.x + this.boundingBox.offsetx;
    this.boundingBox.y = this.y + this.boundingBox.offsety;

    this.visualBox.x = this.x + this.visualBox.offsetx;
    this.visualBox.y = this.y + this.visualBox.offsety;
    this.attackBox.x = this.x + this.attackBox.offsetx;
    this.attackBox.y = this.y + this.attackBox.offsety;

    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        if (collide(ent, {boundingBox: this.visualBox }) && ent instanceof Player ) {
            var mspeed = this.maxSpeed;
            this.attacking = false;
            if(collide(ent, {boundingBox: this.attackBox})){
                mspeed/=2;
                this.attacking = true;
            }
            var dist = distance(this, ent);
            shiftDirection(this, ent);
            var difX = (ent.x - this.x)/dist;
            var difY = (ent.y - this.y)/dist;
            this.velocity.x += difX * acceleration / (dist*dist);
            this.velocity.y += difY * acceleration / (dist * dist);
            var speed = Math.sqrt(this.velocity.x*this.velocity.x + this.velocity.y*this.velocity.y);
            if (speed > mspeed) {
                var ratio = mspeed / speed;
                this.velocity.x *= ratio;
                this.velocity.y *= ratio;
            }
            
            if (ent instanceof Player && collide(this, ent)) {
                var temp = { x: this.velocity.x, y: this.velocity.y };

                tempVelocityX = temp.x * friction;
                tempVelocityY = temp.y * friction;
                

                this.x -= 10 * tempVelocityX * this.game.clockTick;
                this.y -= 10 * tempVelocityY * this.game.clockTick;
                ent.health -= 5;
            }
            if((!this.moveRestrictions.left && this.velocity.x<0) || (!this.moveRestrictions.right && this.velocity.x>0)){
                this.x += time * this.velocity.x;
            }
            if((!this.moveRestrictions.up && this.velocity.y<0) || (!this.moveRestrictions.down && this.velocity.y>0)){
                this.y += time * this.velocity.y;
            }  
                
            
        } else if (ent instanceof Background) {
            LevelBoundingBoxCollsion(ent, this);
        }
    }

    if (this.health < 1) {
        this.dead = true;
    }

    if(this.attacking && this.attackTimer>=1){
        this.attack();
        this.attackTimer = 0;
    } else if(this.attackTimer<1){
        this.attackTimer += time;
    }

    
    this.healthBar.update();
    Entity.prototype.update.call(this);
}

BlackBunny.prototype.attack = function(){
    var x = this.x + 32;
    var y = this.y + 50;
    var x1, y1, x2, y2, x3, y3;
    if(this.direction === "up"){
        x1 = x;
        y1 = y+5;
        x2 = x+5;
        y2 = y-5;
        x3 = x-5;
        y3 = y-5;
    } else if(this.direction === "down"){
        x1 = x;
        y1 = y-5;
        x2 = x+5;
        y2 = y+5;
        x3 = x-5;
        y3 = y+5;
    } else if(this.direction === "left"){
        x1 = x-5;
        y1 = y;
        x2 = x-5;
        y2 = y+5;
        x3 = x-5;
        y3 = y-5;
    } else {//right
        x1 = x+5;
        y1 = y;
        x2 = x+5;
        y2 = y+5;
        x3 = x+5;
        y3 = y-5;
    }
    this.game.addProjectile(
        new Projectile( this.game,
            {
                img:this.game.assetManager.getAsset("./img/modball.png"), 
                width:26, 
                height:17,
                path:"./img/modball.png"
            }, 325, //speed
            {//start point
                x:x, 
                y:y
            }, 
            {//end Point
                x:x1, 
                y:y1
            }, 10, "Enemy", 15)
    );
    this.game.addProjectile(
        new Projectile( this.game,
            {
                img:this.game.assetManager.getAsset("./img/modball.png"), 
                width:26, 
                height:17,
                path:"./img/modball.png"
            }, 325, //speed
            {//start point
                x:x, 
                y:y
            }, 
            {//end Point
                x:x2, 
                y:y2
            }, 10, "Enemy", 10)
    );
    this.game.addProjectile(
        new Projectile( this.game,
            {
                img:this.game.assetManager.getAsset("./img/modball.png"), 
                width:26, 
                height:17,
                path:"./img/modball.png"
            }, 325, //speed
            {//start point
                x:x, 
                y:y
            }, 
            {//end Point
                x:x3, 
                y:y3
            }, 10, "Enemy", 10)
    );
}

BlackBunny.prototype.draw = function () {
  
    if(this.dead){
        this.deathAnimations[this.direction].drawFrame(this.game.clockTick, this.ctx, this.x, this.y, 1.5, this);
    } else {
        this.walkAnimations[this.direction].drawFrame(this.game.clockTick, this.ctx, this.x, this.y, 1.5);
    }
    if (this.game.showOutlines) {
        this.ctx.strokeRect(this.boundingBox.x, this.boundingBox.y, this.boundingBox.width, this.boundingBox.height);
        this.ctx.strokeStyle = "black";
        this.ctx.strokeRect(this.visualBox.x, this.visualBox.y, this.visualBox.width, this.visualBox.height);
        this.ctx.strokeStyle = "red"
        this.ctx.strokeRect(this.attackBox.x, this.attackBox.y, this.attackBox.width, this.attackBox.height);
    }
    this.ctx.strokeStyle = "black"
    //this.ctx.strokeRect(this.x+32, this.y + 50, 2, 2);
    Entity.prototype.draw.call(this);
    
    this.healthBar.draw();
}



// the "main" code begins here
var friction = 1;
var acceleration = 1000000;
var maxSpeed = 150;


// LINE/RECTANGLE
function lineRect(x1, y1, x2, y2, rx, ry, rw, rh) {

    // check if the line has hit any of the rectangle's sides
    // uses the Line/Line function below
    var left =   lineLine(x1,y1,x2,y2, rx,ry,rx, ry+rh);
    var right =  lineLine(x1,y1,x2,y2, rx+rw,ry, rx+rw,ry+rh);
    var top =    lineLine(x1,y1,x2,y2, rx,ry, rx+rw,ry);
    var bottom = lineLine(x1,y1,x2,y2, rx,ry+rh, rx+rw,ry+rh);
    // if(bottom){
    //     bottom = lineLine(x1,y1,x2,y2, rx,ry+rh, rx+rw,ry+rh);
    // }
  
    // if ANY of the above are true, the line
    // has hit the rectangle
    if (left || right || top || bottom) {
      return true;
    }
    return false;
  }
  
  
function lineLine(x1,y1,x2,y2,x3,y3,x4,y4){
    var m1 = (y2-y1)/(x2-x1);
    var m2 = (y4-y3)/(x4-x3);
    //lines aren't parallel
    if(m1!=0 && isFinite(m1) && m2 != 0 && isFinite(m2)){
        if(m1!==m2 && m1!=-m2){
            //point of intersection
            var xi = (m1*x1-m2*x3-y1+y3)/(m1-m2);
            var yi = m1*(xi-x1)+y1;
            var xstart = Math.min(x1, x2);
            var ystart = Math.min(y1, y2);
            var xend = Math.max(x1, x2);
            var yend = Math.max(y1, y2);
            var xs2 = Math.min(x3, x4);
            var ys2 = Math.min(y3, y4);
            var xe2 = Math.max(x3, x4);
            var ye2 = Math.max(y3, y4);

            //check if intersection point lies in the range of the line segment
            if(xstart<=xi && xi<=xend && ystart<=yi && yi<=yend
                && xs2<=xi && xi<=xe2 && ys2<=yi && yi<=ye2){
                return true;
            } else {
                return false;
            }
        } else if(y1-(m1*x1) === y3-(m2*x3)){
            //lines are parallel and have same y-intercept, so they
            //must be the same line
            return true;
        } else {
            return false;
        }
    } else {
        //both vertical
        /*if(!isFinite(m1) && !isFinite(m2)){
            //if they share any x values, they are intersecting
            var ymin = Math.min(y1, y2);
            var ymax = Math.max(y1, y2);
            if(x1===x3 && (y3>ymin && y3<ymax) || (y4>ymin && y4<ymax)) return true
            else return false;
        } else if(m1==0 && m2 == 0){
            //both horizontal
            var xmin = Math.min(x1, x2);
            var xmax = Math.max(x1, x2);
            if(y1===y3 && (x3>xmin && x3<xmax) || (x4>xmin && x4<xmax))return true
            else return false;
        } else*/ if(!isFinite(m1) && m2===0){
            //l1 vertical and l2 horizontal
            return verticalHorizontal(x1, Math.min(y1, y2), Math.max(y1, y2), y3, Math.min(x3, x4), Math.max(x3, x4));
        } else if(m1==0 && !isFinite(m2)){
            //l2 vertical and l1 horizontal
            return verticalHorizontal(x3, Math.min(y4, y3), Math.max(y4, y3), y1, Math.min(x2, x1), Math.max(x2, x1));
        } else if(m1==0) {
            //l1 horizontal and l2 diagonal
            return horizontalDiagonal(y1, Math.min(x1, x2), Math.max(x1, x2), x3, y3, x4, y4);
        } else if(m2==0){
            //l2 horizontal and l1 diagonal
            return horizontalDiagonal(y3, Math.min(x3, x4), Math.max(x3, x4), x1, y1, x2, y2);
        } else if(!isFinite(m1)){
            //l1 vertical and l2 diagonal
            return verticalDiagonal(x1, Math.min(y1, y2), Math.max(y1, y2), x3, y3, x4, y4);
        } else {
            //l2 vertical and l1 diagonal
            return verticalDiagonal(x3, Math.min(y3, y4), Math.max(y3, y4), x1, y1, x2, y2);
        }
    }
}

function verticalHorizontal(vx, y1, y2, hy, x1, x2){
    if(x1<=vx && vx<=x2 && y1<= hy && hy<=y2) return true;
    else return false;
}

function horizontalDiagonal(hy, x1, x2, x3, y3, x4, y4){
    var starty = Math.min(y3,y4);
    var endy = Math.max(y3,y4);
    var m2 = (y4-y3)/(x4-x3);
    var xi = (hy+(m2*x3)-y3)/m2;
    if(starty<=hy && hy<= endy && x1<=xi && xi<=x2) return true;
    else return false;
}

function verticalDiagonal(vx, y1, y2, x3, y3, x4, y4){
    var startx = Math.min(x3,x4);
    var endx = Math.max(x3,x4);
    var m2 = (y4-y3)/(x4-x3);
    var yi = (m2*vx) - (m2*x3) + y3;
    if(startx<=vx && vx<= endx && y1<=yi & yi<=y2) return true;
    else return false;
}

