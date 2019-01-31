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
}

Animation2.prototype.drawFrame = function (tick, ctx, x, y, scaleBy) {
    var scaleBy = scaleBy || 1;
    this.elapsedTime += tick;
    if (this.loop) {
        if (this.isDone()) {
            this.elapsedTime = 0;
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

// no inheritance
function Background(game, spritesheet) {
    this.x = 0;
    this.y = 0;
    this.spritesheet = spritesheet;
    this.game = game;
    this.ctx = game.ctx;
};

Background.prototype.draw = function () {
    this.ctx.drawImage(this.spritesheet,
                   this.x, this.y);
};

Background.prototype.update = function () {
};
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



function arrowSkeleton(game, spritesheet) {

    this.walkAnimations = [];
    this.attackAnimations =[];
    this.standingAnimations = [];

    this.walkAnimations["up"] = new Animation2 (spritesheet, 0, 512, 64, 64, 0.1, 8, true, false);
    this.walkAnimations["left"] = new Animation2 (spritesheet, 0, 576, 64, 64, 0.1, 8, true, false);
    this.walkAnimations["down"] = new Animation2 (spritesheet, 0, 640, 64, 64, 0.1, 8, true, false);
    this.walkAnimations["right"] = new Animation2 (spritesheet, 0, 704, 64, 64, 0.1, 8, true, false);

    this.attackAnimations["up"] = new Animation2 (spritesheet, 0, 1025, 64, 64, 0.05, 13, true, false);
    this.attackAnimations["left"] = new Animation2 (spritesheet, 0, 1089, 64, 64, 0.05, 13, true, false);
    this.attackAnimations["down"]= new Animation2 (spritesheet, 0, 1153, 64, 64, 0.05, 13, true, false);
    this.attackAnimations["right"] = new Animation2 (spritesheet, 0, 1217, 64, 64, 0.05, 13, true, false);

    this.standingAnimations["up"] = new Animation2 (spritesheet, 0, 512, 64, 64, 0.1, 1, true, false);
    this.standingAnimations["left"] = new Animation2 (spritesheet, 0, 576, 64, 64, 0.1, 1, true, false);
    this.standingAnimations["down"] = new Animation2 (spritesheet, 0, 640, 64, 64, 0.1, 1, true, false);
    this.standingAnimations["right"] = new Animation2 (spritesheet, 0, 704, 64, 64, 0.1, 1, true, false);
    
    this.DyingAnimation = new  Animation2 (spritesheet, 0, 1280, 64, 64, 0.1, 62, true, false);

    this.attacking = false;
    this.direction = "down";
    this.ctx = game.ctx;
    this.radius = 20;
    this.visualRadius = 275;
    this.attackRadius = 100;
    this.velocity = { x: Math.random() * 1000, y: Math.random() * 1000 };
    var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
    if (speed > maxSpeed) {
        var ratio = maxSpeed / speed;
        this.velocity.x *= ratio;
        this.velocity.y *= ratio;
    }
    Entity.call(this, game, 400, 400);
}

arrowSkeleton.prototype = new Entity();
arrowSkeleton.prototype.constructor = arrowSkeleton;


arrowSkeleton.prototype.collide = function (other) {
    return distance(this, other) < this.radius + other.radius;
};

arrowSkeleton.prototype.collideLeft = function () {
    return (this.x - this.radius) < 0;
};

arrowSkeleton.prototype.collideRight = function () {
    return (this.x + this.radius) > 800;
};

arrowSkeleton.prototype.collideTop = function () {
    return (this.y - this.radius) < 0;
};

arrowSkeleton.prototype.collideBottom = function () {
    return (this.y + this.radius) > 650;
};

arrowSkeleton.prototype.update = function () {   
    Entity.prototype.update.call(this);
    /*if (this.collideLeft() || this.collideRight()) {
        this.velocity.x = -this.velocity.x * friction;
        if (this.collideLeft()) this.x = this.radius;
        if (this.collideRight()) this.x = 800 - this.radius;
        this.x += this.velocity.x * this.game.clockTick;
        this.y += this.velocity.y * this.game.clockTick;
    }

    if (this.collideTop() || this.collideBottom()) {
        this.velocity.y = -this.velocity.y * friction;
        if (this.collideTop()) this.y = this.radius;
        if (this.collideBottom()) this.y = 650 - this.radius;
        this.x += this.velocity.x * this.game.clockTick;
        this.y += this.velocity.y * this.game.clockTick;
    }*/
    
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

        if (ent != this && this.collide({ x: ent.x, y: ent.y, radius: this.visualRadius }) && ent instanceof Bunny) {
            if (this instanceof arrowSkeleton) {
                if (ent != this && this.collide({ x: ent.x, y: ent.y, radius: this.attackRadius })) {
                    this.attacking = true;
                } 
                shiftDirection(this, ent);
            }
        }
    }
}


arrowSkeleton.prototype.draw = function () {
    if(!this.attacking) {
        this.standingAnimations[this.direction].drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    }else {
        this.attackAnimations[this.direction].drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    }
    
    Entity.prototype.draw.call(this);
}


function magicSkeleton(game, spritesheet) {
    this.walkAnimations = [];
    this.attackAnimations =[];
    this.standingAnimations = [];

    this.walkAnimations["up"] = new Animation2
(spritesheet, 0, 512, 64, 64, 0.1, 8, true, false);
    this.walkAnimations["left"] = new Animation2
(spritesheet, 0, 576, 64, 64, 0.1, 8, true, false);
    this.walkAnimations["down"] = new Animation2
(spritesheet, 0, 640, 64, 64, 0.1, 8, true, false);
    this.walkAnimations["right"] = new Animation2
(spritesheet, 0, 704, 64, 64, 0.1, 8, true, false);

    this.attackAnimations["up"] = new Animation2
(spritesheet, 0, 0, 64, 64, 0.08, 7, true, false);
    this.attackAnimations["left"] = new Animation2
(spritesheet, 0, 64, 64, 64, 0.08, 7, true, false);
    this.attackAnimations["down"]= new Animation2
(spritesheet, 0, 128, 64, 64, 0.08, 7, true, false);
    this.attackAnimations["right"] = new Animation2
(spritesheet, 0, 192, 64, 64, 0.08, 7, true, false);

    this.standingAnimations["up"] = new Animation2
(spritesheet, 0, 512, 64, 64, 0.1, 1, true, false);
    this.standingAnimations["left"] = new Animation2
(spritesheet, 0, 576, 64, 64, 0.1, 1, true, false);
    this.standingAnimations["down"] = new Animation2
(spritesheet, 0, 640, 64, 64, 0.1, 1, true, false);
    this.standingAnimations["right"] = new Animation2
(spritesheet, 0, 704, 64, 64, 0.1, 1, true, false);

    this.DyingAnimation = new  Animation2
(spritesheet, 0, 1280, 64, 64, 0.1, 6, true, false);

    this.ctx = game.ctx;
    this.radius = 20;
    this.attackRadius = 100;
    this.visualRadius = 275;
    this.attacking = false;
    this.direction = "down";

    this.velocity = { x: Math.random() * 1000, y: Math.random() * 1000 };
    var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
    if (speed > maxSpeed) {
        var ratio = maxSpeed / speed;
        this.velocity.x *= ratio;
        this.velocity.y *= ratio;
    }
    Entity.call(this, game, 200, 200);
}

magicSkeleton.prototype.collide = function (other) {
    return distance(this, other) < this.radius + other.radius;
};

magicSkeleton.prototype.collideLeft = function () {
    return (this.x - this.radius) < 0;
};

magicSkeleton.prototype.collideRight = function () {
    return (this.x + this.radius) > 800;
};

magicSkeleton.prototype.collideTop = function () {
    return (this.y - this.radius) < 0;
};

magicSkeleton.prototype.collideBottom = function () {
    return (this.y + this.radius) > 650;
};

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


magicSkeleton.prototype.update = function () {   
    Entity.prototype.update.call(this);
    /*if (this.collideLeft() || this.collideRight()) {
        this.velocity.x = -this.velocity.x * friction;
        if (this.collideLeft()) this.x = this.radius;
        if (this.collideRight()) this.x = 800 - this.radius;
        this.x += this.velocity.x * this.game.clockTick;
        this.y += this.velocity.y * this.game.clockTick;
    }

    if (this.collideTop() || this.collideBottom()) {
        this.velocity.y = -this.velocity.y * friction;
        if (this.collideTop()) this.y = this.radius;
        if (this.collideBottom()) this.y = 650 - this.radius;
        this.x += this.velocity.x * this.game.clockTick;
        this.y += this.velocity.y * this.game.clockTick;
    }*/
    
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

        if (ent != this && this.collide({ x: ent.x, y: ent.y, radius: this.visualRadius }) && ent instanceof Bunny) {
            if (this instanceof magicSkeleton) {
                if (ent != this && this.collide({ x: ent.x, y: ent.y, radius: this.attackRadius })) {
                    this.attacking = true;
                } 
                shiftDirection(this, ent);
            }
        }
    }

}
magicSkeleton.prototype.draw = function () {
    if(!this.attacking) {
        this.standingAnimations[this.direction].drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    }else {
        this.attackAnimations[this.direction].drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    }
    
    Entity.prototype.draw.call(this);
}



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
    Entity.call(this, game, 0, 200);
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

    if (this.collideLeft() || this.collideRight()) {
        this.velocity.x = -this.velocity.x * friction;
        if (this.collideLeft()) { 
            this.x = this.radius;
            this.direction = "right";
        }
        if (this.collideRight()) {
            this.x = 800 - this.radius;
            this.direction = "left";
        }
        this.x += this.velocity.x * this.game.clockTick;
        this.y += this.velocity.y * this.game.clockTick;
    }

    if (this.collideTop() || this.collideBottom()) {
        this.velocity.y = -this.velocity.y * friction;
        if (this.collideTop()) {
            this.y = this.radius;
            this.direction = "down";
        }
        if (this.collideBottom()) {
            this.y = 650 - this.radius;
            this.direction = "up";
        }
            
        this.x += this.velocity.x * this.game.clockTick;
        this.y += this.velocity.y * this.game.clockTick;
    }
    

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
 
        if (ent != this && this.collide({ x: ent.x, y: ent.y, radius: this.visualRadius })
                                             && ent instanceof magicSkeleton) {
            var dist = distance(this, ent);
            if (this instanceof Bunny && dist > this.radius + ent.radius + 10) {
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
    this.walkAnimations[this.direction].drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
}

function Fireball(game, spritesheet, x, y) {
    this.animation = new Animation2
(spritesheet, 0, 0, 64, 64, 0.1, 8, true, false);

    this.speed = 200;
    this.ctx = game.ctx;
    this.remove = false;
    Entity.call(this, game, x, y);
}

Fireball.prototype = new Entity();
Fireball.prototype.constructor = Fireball;

Fireball.prototype.update = function () {
    this.x -= this.game.clockTick * this.speed;

    if (this.x < 30) {
        this.remove = true;
    }

    if (this.remove) {
        this.removeFromWorld = true;
    }
    Entity.prototype.update.call(this);
}

Fireball.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, 1);
    Entity.prototype.draw.call(this);
}



// the "main" code begins here
var friction = 1;
var acceleration = 1000000;
var maxSpeed = 150;
