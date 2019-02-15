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

Animation2.prototype.drawFrame = function (tick, ctx, x, y, scaleBy) {
    var scaleBy = scaleBy || 1;
    this.elapsedTime += tick;
    var frame = this.currentFrame();
    if(this.callbackEnabled && frame === this.callbackFrame && !this.callbackDone){
        this.callbackDone = true;
        this.callback(this.callbackArgs);
    }
    if (this.loop) {
        if (this.isDone()) {
            this.elapsedTime = 0;
            this.callbackDone = false;
        }
        
    } else if (this.isDone()) {
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

// // no inheritance
// function Background(game, spritesheet) {
//     this.x = 0;
//     this.y = 0;
//     this.spritesheet = spritesheet;
//     this.game = game;
//     this.ctx = game.ctx;
// };

// Background.prototype.draw = function () {
//     this.ctx.drawImage(this.spritesheet,
//                    this.x, this.y);
// };

// Background.prototype.update = function () {
// };
function shiftDirection(ent1, ent2) {
    var enemyX = ent2.x;
    var enemyY = ent2.y;
    var centerx = ent1.x;
    var centery= ent1.y;
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



function RangeSkeleton(game, spritesheet, spawnX, spawnY, type, projectile) {

    this.walkAnimations = [];
    this.attackAnimations =[];
    this.standingAnimations = [];

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
            switch(that.direction){
                    case "up":
                        x += 35;
                        y -= 15;
                        break;
                    case "left":
                        y += 25;
                        break;
                    case "right":
                        y += 30;
                        x+=25;
                        break;
                    case "down":
                        x +=30;
                        y += 30;
                        break;
                }
                addProjectile(that, x, y, projectile);
                });
    }
    this.standingAnimations["up"] = new Animation2 (spritesheet, 0, 512, 64, 64, 0.1, 1, true, false);
    this.standingAnimations["left"] = new Animation2 (spritesheet, 0, 576, 64, 64, 0.1, 1, true, false);
    this.standingAnimations["down"] = new Animation2 (spritesheet, 0, 640, 64, 64, 0.1, 1, true, false);
    this.standingAnimations["right"] = new Animation2 (spritesheet, 0, 704, 64, 64, 0.1, 1, true, false);
    
    this.DyingAnimation = new  Animation2 (spritesheet, 0, 1280, 64, 64, 0.1, 62, true, false);

    this.following = {x:0, y:0};
    this.attacking = false;
    this.direction = "down";
    this.ctx = game.ctx;
    this.radius = 20;
    this.visualRadius = 350;
    this.attackRadius = 300;
    this.velocity = { x: Math.random() * 1000, y: Math.random() * 1000 };
    var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
    if (speed > maxSpeed) {
        var ratio = maxSpeed / speed;
        this.velocity.x *= ratio;
        this.velocity.y *= ratio;
    }
    Entity.call(this, game, spawnX, spawnY);
}

RangeSkeleton.prototype = new Entity();
RangeSkeleton.prototype.constructor = RangeSkeleton;

function addProjectile(that, x, y, type) {  
    var img;
    var height;
    var width;
    var center = that.following.center();
    if (type === "arrow") {
        img = that.game.assetManager.getAsset("./img/arrow.png")
        width = 31;
        height = 5;
    } else {
        img = that.game.assetManager.getAsset("./img/fireball.png")
        width = 26;
        height = 17;
        y = y + 20;
    } 
     that.game.addEntity(new Projectile(that.game, 
    {
        img, 
        width, 
        height
    }, 300, //speed
    {//start point
        x:x, 
        y:y
    }, 
    {//end Point
        x:center.x, 
        y:center.y
    }, 5));//lifetime
}
RangeSkeleton.prototype.collide = function (other) {
    return distance(this, other) < this.radius + other.radius;
};

RangeSkeleton.prototype.collideLeft = function () {
    return (this.x - this.radius) < 0;
};

RangeSkeleton.prototype.collideRight = function () {
    return (this.x + this.radius) > 800;
};

RangeSkeleton.prototype.collideTop = function () {
    return (this.y - this.radius) < 0;
};

RangeSkeleton.prototype.collideBottom = function () {
    return (this.y + this.radius) > 650;
};

RangeSkeleton.prototype.update = function () {   
    Entity.prototype.update.call(this);
    
    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
      /*  if (ent !== this && this.collide(ent)) {
            var temp = { x: this.velocity.x, y: this.velocity.y };

            var dist = distance(this, ent);
            var delta = this.radius + ent.radius - dist;
            var difX = (this.x - ent.x)/dist;
            var difY = (this.y - ent.y)/dist;

            this.x += difX * delta / 2;
            this.y += difY * delta / 2;
            ent.x -= difX * delta / 2;
            ent.y -= difY * delta / 2;

            this.velocity.x = ent.velocity.x * friction;
            this.velocity.y = ent.velocity.y * friction;
            ent.velocity.x = temp.x * friction;
            ent.velocity.y = temp.y * friction;
            this.x += this.velocity.x * this.game.clockTick;
            this.y += this.velocity.y * this.game.clockTick;
            ent.x += ent.velocity.x * this.game.clockTick;
            ent.y += ent.velocity.y * this.game.clockTick;
        }*/

        if (ent != this && this.collide({ x: ent.x, y: ent.y, radius: this.visualRadius }) && ent instanceof Player) {
            if (this instanceof RangeSkeleton) {
                this.following = ent;
                if (ent != this && this.collide({ x: ent.x, y: ent.y, radius: this.attackRadius })) {
                    this.attacking = true;
                } else {
                    this.attacking = false;
                }
            } 
                shiftDirection(this, ent);
        }
    }
}



RangeSkeleton.prototype.draw = function () {
    if(!this.attacking) {
        this.standingAnimations[this.direction].drawFrame(this.game.clockTick, this.ctx, this.x, this.y, 1.5);
    }else {
        this.attackAnimations[this.direction].drawFrame(this.game.clockTick, this.ctx, this.x, this.y, 1.5);
       // this.attacking = false;
    }
    
    Entity.prototype.draw.call(this);
}


/*
function collide(ent1, ent2) {
    return distance(ent1, ent2) < ent1.radius + ent2.radius;
}
function collideLeft (entity) {
    return (entity.x - entity.radius) < 650;
}
function collideRight(entity) {
    return (entity.x + entity.radius) > 800;
}
function collideTop (entity) {
    return (entity.y - entity.radius) < 0;
}
function collideBottom (entity) {
    return (entity.y + entity.radius) > 650;
}*/


function Bunny(game, spritesheet) {
    this.walkAnimations = [];
    
    this.walkAnimations["down"] = new Animation2
(spritesheet, 0, 0, 48, 64, 0.1, 7, true, false);
    this.walkAnimations["up"] = new Animation2
(spritesheet, 0, 64, 48, 64, 0.1, 7, true, false);
    this.walkAnimations["right"] = new Animation2
(spritesheet, 0, 128, 48, 64, 0.1, 7, true, false);
    this.walkAnimations["left"] = new Animation2
(spritesheet, 0, 192, 48, 64, 0.1, 7, true, false);
    
    this.direction = "right";
    this.visualRadius = 800;
    this.radius = 20;
    this.runBack = false;
    this.ctx = game.ctx;
    
    this.velocity = { x: Math.random() * 1000, y: Math.random() * 1000 };
    var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
    //this.speed = 100;
    if (speed > maxSpeed) {
        var ratio = maxSpeed / speed;
        this.velocity.x *= ratio;
        this.velocity.y *= ratio;
    }
    Entity.call(this, game, 0, 100);
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

    this.x += this.velocity.x * this.game.clockTick;
    this.y += this.velocity.y * this.game.clockTick;

    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        if (ent !== this && this.collide(ent)) {
            var temp = { x: this.velocity.x, y: this.velocity.y };

            var dist = distance(this, ent);
            var delta = this.radius + ent.radius - dist;
            var difX = (this.x - ent.x)/dist;
            var difY = (this.y - ent.y)/dist;

            this.x += difX * delta / 2;
            this.y += difY * delta / 2;
            ent.x -= difX * delta / 2;
            ent.y -= difY * delta / 2;

            this.velocity.x = ent.velocity.x * friction;
            this.velocity.y = ent.velocity.y * friction;
            ent.velocity.x = temp.x * friction;
            ent.velocity.y = temp.y * friction;
            this.x += this.velocity.x * this.game.clockTick;
            this.y += this.velocity.y * this.game.clockTick;
            ent.x += ent.velocity.x * this.game.clockTick;
            ent.y += ent.velocity.y * this.game.clockTick;
        }
 
        if (ent != this && this.collide({ x: ent.x, y: ent.y, radius: this.visualRadius }) && ent instanceof Player ) {
            var dist = distance(this, ent);
            if (this instanceof Bunny) {
                shiftDirection(this, ent);
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
            }
        }
    }
    this.velocity.x -= (1 - friction) * this.game.clockTick * this.velocity.x;
    this.velocity.y -= (1 - friction) * this.game.clockTick * this.velocity.y; 

    Entity.prototype.update.call(this);
}

Bunny.prototype.draw = function () {
    this.walkAnimations[this.direction].drawFrame(this.game.clockTick, this.ctx, this.x, this.y, 1.5);
    Entity.prototype.draw.call(this);
}


// the "main" code begins here
var friction = 1;
var acceleration = 1000000;
var maxSpeed = 100;
