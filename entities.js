function Player(game, walksheet, shootsheet, standsheet, wholesheet, powerupsheet, px, py) {
    //function Animation(spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale)
    this.animation = new Animation(walksheet, 64, 64, 8, .06, 32, true, 1.5);
    this.shootanimation = new Animation(AM.getAsset("./img/charshootwalk.png"),64,64, 7, .055, 28, true, 1.5);
    this.stillshootanimation = new Animation(AM.getAsset("./img/charshoot_loop.png"),64,64, 7, .055, 28, true, 1.5);
    this.standanimation = new Animation(standsheet, 64, 64, 1, .12, 4, true, 1.5);
    this.deathanimation =  new Animation2(wholesheet, 0, 1280, 64, 64, 0.1, 6, false, false);  
    this.powerupanimation = new Animation(powerupsheet, 64, 64, 7, .075, 28, true, 1.5);
    this.parryanimation = new Animation(AM.getAsset("./img/parrysheet.png"), 64, 64, 1, .01, 4, true, 1.5);
    this.usingPU = false;
    this.shootanimation.rowMode();
    this.stillshootanimation.rowMode();
    this.powerupanimation.rowMode();
    this.parryanimation.rowMode();
    this.explosionanimation = new Animation(AM.getAsset("./img/explosion.png"), 200, 200, 9, .01, 81, false, 4);
    this.shootmaxSpeed = 200;
    this.walkmaxSpeed = 300;
    this.acceleration = 80;
    this.xspeed = 0;
    this.yspeed = 0;
    this.ammo = 200;
    this.health = 100;
    this.powerUp;
    this.changeTimer = 0;
    this.powerUpTimer = 0;
    this.parryUseTimer = 0;
    this.parryCooldownTimer = 0;
    this.parryUseMax = .22;
    this.parryCoolMax = .75;
    this.parrying = false;
    this.canParry = true;
    this.ctx = game.ctx;
    this.movedir = 3;
    this.velocity = { x: 200, y: 200 };
    this.moveRestrictions = {left:false, right:false, up:false, down:false};
    this.boundingBox = {
        x:this.x, 
        y:this.y,
        width: 32,
        height: 65,
        offsetx:30,
        offsety:15
    }
   Entity.call(this, game, px, py);
    // Entity.call(this, game, 5600, 2797);
    var that = this;
    this.shootanimation.setCallbackOnFrame(6, {}, () =>{
        var x = that.x;
        var y = that.y;
        var x2= x;
        var y2 = y;
        var x3 = x;
        var y3 = y;
        var pspeed = 600;
        var pdamage = 25;
        //change direction arrows come from based on
        //direction character is facing
        switch(that.movedir){
            case 0:
                x += 50;
                y -= 5;
                x2 -= 10 - 50;
                x3 += 10 + 50;
              
                break;
            case 1:
                y += 44;
                x +=8;
                
                y2 += 25;
                y3 += 40;
                break;
            case 2:
                y += 75;
                x+=40;
                x2 -= 10 - 40;
                x3 += 10 + 40;
                y2 += 75;
                y3 += 75;
                
                break;
            case 3:
                x +=46;
                y += 42;
                y2 -= 10 -42;
                y3 += 10 +42;
                x2+=46;
                x3+=46;
                
                break;
        }
        if (this.ammo > 0) {
            that.ammo -=1;
            
            that.game.addProjectile(new Projectile(that.game, 
                {
                    img:that.game.assetManager.getAsset("./img/arrow.png"), 
                    width:31, 
                    height:5
                }, pspeed, //speed
                {//start point
                    x:x, 
                    y:y
                }, 
                {//end Point
                    x:that.game.pointerx, 
                    y:that.game.pointery
                }, 5, "Player", pdamage));//lifetime*/
                
                //triple shot

                if (that.TripleShot) {
                    that.game.addProjectile(new Projectile(that.game, 
                        {
                            img:that.game.assetManager.getAsset("./img/arrow.png"), 
                            width:31, 
                            height:5
                        }, pspeed, //speed
                        {//start point
                            x:x2, 
                            y:y2
                        }, 
                        {//end Point
                            x:that.game.pointerx, 
                            y:that.game.pointery
                        }, 5, "Player", pdamage));//lifetime
    
                        that.game.addProjectile(new Projectile(that.game, 
                            {
                                img:that.game.assetManager.getAsset("./img/arrow.png"), 
                                width:31, 
                                height:5
                            }, pspeed, //speed
                            {//start point
                                x:x3, 
                                y:y3
                            }, 
                            {//end Point
                                x:that.game.pointerx, 
                                y:that.game.pointery
                            }, 5, "Player", pdamage)); //lifetime*/
                        }  
                }
               
    });
    this.stillshootanimation.setCallbackOnFrame(6, {}, () =>{
        var x = that.x;
        var y = that.y;
        var x2= x;
        var y2 = y;
        var x3 = x;
        var y3 = y;
        var pspeed = 600;
        var pdamage = 25;
        //change direction arrows come from based on
        //direction character is facing
        switch(that.movedir){
            case 0:
                x += 50;
                y -= 5;
                x2 -= 10 - 50;
                x3 += 10 + 50;
              
                break;
            case 1:
                y += 44;
                x +=8;
                
                y2 += 25;
                y3 += 40;
                break;
            case 2:
                y += 75;
                x+=40;
                x2 -= 10 - 40;
                x3 += 10 + 40;
                y2 += 75;
                y3 += 75;
                
                break;
            case 3:
                x +=46;
                y += 42;
                y2 -= 10 -42;
                y3 += 10 +42;
                x2+=46;
                x3+=46;
                
                break;
        }
        if (this.ammo > 0) {
            that.ammo -=1;
            
            that.game.addProjectile(new Projectile(that.game, 
                {
                    img:that.game.assetManager.getAsset("./img/arrow.png"), 
                    width:31, 
                    height:5
                }, pspeed, //speed
                {//start point
                    x:x, 
                    y:y
                }, 
                {//end Point
                    x:that.game.pointerx, 
                    y:that.game.pointery
                }, 5, "Player", pdamage));//lifetime*/
                
                //triple shot

                if (that.TripleShot) {
                    that.game.addProjectile(new Projectile(that.game, 
                        {
                            img:that.game.assetManager.getAsset("./img/arrow.png"), 
                            width:31, 
                            height:5
                        }, pspeed, //speed
                        {//start point
                            x:x2, 
                            y:y2
                        }, 
                        {//end Point
                            x:that.game.pointerx, 
                            y:that.game.pointery
                        }, 5, "Player", pdamage));//lifetime
    
                        that.game.addProjectile(new Projectile(that.game, 
                            {
                                img:that.game.assetManager.getAsset("./img/arrow.png"), 
                                width:31, 
                                height:5
                            }, pspeed, //speed
                            {//start point
                                x:x3, 
                                y:y3
                            }, 
                            {//end Point
                                x:that.game.pointerx, 
                                y:that.game.pointery
                            }, 5, "Player", pdamage)); //lifetime*/
                        }  
                }
               
    });


    this.radius  = {
        x: this.x,
        r: 700,
        offsetx: 0,
        offsety: 53
    };
    this.putimerMax = 30;
    this.canUsePU = true;
    this.TripleShot = false;
    this.tpTimer = 0;
    this.healthBar = new HealthBar(game, this, 46, -10);
}

Player.prototype = new Entity();
Player.prototype.constructor = Player;

Player.prototype.update = function () {

    this.moveRestrictions = {left:false, right:false, up:false, down:false};
    var px = this.game.pointerx;
    var py = this.game.pointery;
    var center = this.center();
    var centerx = center.x;
    var centery= center.y;
    var xdiff = Math.abs(px - centerx);
    var ydiff = Math.abs(py - centery);
    // var player = this;
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
    if(this.game.space && this.canParry) this.parrying = true;

    let time = this.game.clockTick;
    if (!this.canUsePU) {
        this.powerUpTimer += time;
        this.canUsePU = this.powerUpTimer>this.putimerMax?true:false;
    } 

    if (this.TripleShot) {
        this.tpTimer += time; 
        this.TripleShot = this.tpTimer>6 ? false:true;
    } else {
        this.tpTimer = 0;
    }

    if(this.parrying){
        this.parryUseTimer += time;
        if(this.parryUseTimer>this.parryUseMax) {
            this.parrying = false;
            this.canParry = false;
            this.parryUseTimer = 0;
        }
    } else if(!this.canParry){
        this.parryCooldownTimer += time;
        if(this.parryCooldownTimer > this.parryCoolMax){
            this.canParry = true;
            this.parryCooldownTimer = 0;
        }
    }

    //if(!this.game.lclick && !this.shootanimation.active) {
        if(timeSlowed) time *=2;
        // this.xspeed = 0;
        // this.yspeed = 0;
        var maxspeed = this.shootanimation.active?this.shootmaxSpeed:this.walkmaxSpeed;
        var accel = 0;
        if(this.game.w || this.game.s || this.game.a || this.game.d){
            accel = xor(this.game.w, this.game.s) && xor(this.game.a, this.game.d)?this.acceleration/2:this.acceleration;
            if(this.game.w) this.yspeed += -accel;
            if(this.game.s && !this.game.w) this.yspeed += accel;
            if(this.game.a) this.xspeed += -accel;
            if(this.game.d) this.xspeed += accel;
        } else {
            //we need to decelerate
            this.xspeed  =0;
            this.yspeed = 0;
        }
        
        var speed = Math.sqrt(this.xspeed * this.xspeed + this.yspeed * this.yspeed);
        //slow down x and y if moving diagonally
        if(speed >= maxspeed){
            var ratio = maxspeed / speed;
            this.xspeed *= ratio;
            this.yspeed *= ratio;
        }
        //document.getElementById("debug-out").innerHTML = `acceleration: ${accel}`;
        if (!this.xspeed !== 0 || !this.yspeed !== 0) {
            for (var i = 0; i < this.game.entities.length; i++) {
                var ent = this.game.entities[i];
                if ((ent instanceof Bunny || ent instanceof RangeEnemy) 
                    && this.insideOfRadius(ent) && !ent.removeFromWorld) {
                    /*console.log(ent.constructor.name)    */
                    if (ent instanceof Bunny && collide(this, ent)) {
                        tempVelocityX = ent.velocity.x * friction;
                        tempVelocityY = ent.velocity.y * friction;
                        ent.x -= 2 * tempVelocityX * this.game.clockTick;   
                        ent.y -= 2 * tempVelocityY * this.game.clockTick;
                    }

                } else if(ent instanceof Background) {
                    if ( collide({boundingBox: ent.nextLevelBox}, this)) {
                        console.log("boundBox");
                    }


                    if(bossDead && collide({boundingBox: ent.nextLevelBox}, this)) { 
                        console.log("truuuu");
                        sceneManager.loadNextLevel();          
                    }
                    LevelBoundingBoxCollsion(ent, this);
                }
            
            }
            if((!this.moveRestrictions.left && this.xspeed<0) || (!this.moveRestrictions.right && this.xspeed>0)){
                this.x += time * this.xspeed;
                this.game.pointerx += this.xspeed * time;
            }
            if((!this.moveRestrictions.up && this.yspeed<0) || (!this.moveRestrictions.down && this.yspeed>0)){
                this.y += time * this.yspeed;
                this.game.pointery += this.game.player.yspeed * time;
            }
        }
        
    //} 
    

    if(this.health < 1) {
        this.dead = true;
    }

    this.boundingBox.x = this.x + this.boundingBox.offsetx;
    this.boundingBox.y = this.y + this.boundingBox.offsety;
    this.healthBar.update();
    Entity.prototype.update.call(this);
}


Player.prototype.draw = function () {
    var time = this.game.clockTick;
    if(timeSlowed) time *= 2;
    if(this.parrying){
        this.parryanimation.drawFrameFromRow(time, this.ctx, this.x, this.y, this.movedir);
    }else if(this.usingPU || this.powerupanimation.active || this.explosionanimation.active) { 
        this.powerupanimation.loop = this.usingPU?true:false
        this.powerupanimation.drawFrameFromRow(time, this.ctx, this.x, this.y, this.movedir);
        this.usingPU = false;
    }
    if(this.game.lclick || this.shootanimation.active|| this.stillshootanimation.active){
        if(this.xspeed!==0 || this.yspeed!==0){
            this.shootanimation.loop = this.game.lclick?true:false;
            if(this.stillshootanimation.active){
                this.stillshootanimation.active = false;
                this.shootanimation.active = true;
                this.shootanimation.elapsedTime = this.stillshootanimation.elapsedTime; 
            }
            this.shootanimation.drawFrameFromRow(time, this.ctx, this.x, this.y, this.movedir);
        } else {
            this.stillshootanimation.loop = this.game.lclick?true:false;
            if(this.shootanimation.active){
                this.shootanimation.active = false;
                this.stillshootanimation.active = true;
                this.stillshootanimation.elapsedTime = this.shootanimation.elapsedTime; 
            }
            this.stillshootanimation.drawFrameFromRow(time, this.ctx, this.x, this.y, this.movedir);
        }
        
    } else if(this.xspeed!==0 || this.yspeed!==0){
        this.animation.drawFrameFromRow(time, this.ctx, this.x, this.y, this.movedir);
    } else if(!this.dead){
        this.standanimation.drawFrameFromRow(time, this.ctx, this.x, this.y, this.movedir);
    }
    if(this.game.showOutlines){
        this.ctx.strokeRect(this.boundingBox.x, this.boundingBox.y, this.boundingBox.width, this.boundingBox.height);
    }
    this.ctx.font = "24px Arial";
    this.ctx.fillStyle = "red";
    this.ctx.fillText(`Ammo: ${this.ammo}`, this.x+550, this.y+300);
   // this.ctx.fillStyle = "black";
    if (!this.canUsePU) this.ctx.fillStyle = "black";
    
    if (this.powerUp) {
        this.ctx.fillRect(this.x-675, this.y+295, this.powerUp.sheet.width, this.powerUp.sheet.height);
        this.ctx.drawImage(this.powerUp.sheet, this.x-675, this.y+295);     
    }
    if (this.dead) {
        this.deathanimation.drawFrame(time, this.ctx, this.x, this.y, 1.5, this); 
    }
    this.healthBar.draw();
    this.game.crosshair.draw();
    Entity.prototype.draw.call(this);
}

Player.prototype.usePowerUp = function () {
   if (this.powerUp && this.canUsePU) { 
        if (this.powerUp.type === "Bomb") {
            this.game.addEntity(new Explosion(this.x, this.y, this.game));
          
        } else if (this.powerUp.type === "SlowTime") {
            timeSlowed = true;
        } else {
            this.TripleShot = true;
        }
    }
    this.canUsePU = false;
    this.powerUpTimer = 0;
    
}
Player.prototype.center = function() {
    var centerx = this.x + this.animation.frameWidth/2;
    var centery= this.y + this.animation.frameHeight/2;
    return {x:centerx, y:centery};
}
Player.prototype.insideOfRadius = function (other) {
    return distance(other, this) < (this.radius.r);
}



function Explosion (x, y, game) {

    Entity.call(this, game, x, y);
    this.boundingBox = {
        x:-99, 
        y:-99,
        width: 0,
        height: 0,
        offsetx:0,
        offsety:0
    };
    this.explosionRange = {
        r: 400,
        offsetx: 10,
        offsety: 53
    };
    this.game = game;
    this.explosionanimation = new Animation(AM.getAsset("./img/explosion.png"), 200, 200, 9, .01, 74, false, 4);
    this.ctx = this.game.ctx;
    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        if (!(ent instanceof Player) 
                    && this.explosionDistance(ent) && !ent.removeFromWorld && ent.health) {
                        ent.health -= 100;
        }
    }

    var that = this;
    this.explosionanimation.setCallbackOnFrame(74, {}, () =>{
        that.removeFromWorld = true;
    });
}

Explosion.prototype.update = function () {
  
}

Explosion.prototype.explosionDistance = function (other) {
    return distance(other, this) < (this.explosionRange.r);
}
Explosion.prototype.draw = function () {
    this.explosionanimation.drawFrame(this.game.clockTick, this.ctx, this.x-365, this.y-379, 1.5, this);
}
function Powerup (game, x, y, type) {
    this.game = game;
    this.type = type;
    this.ctx = game.ctx;
    this.x = x;
    this.y = y;
    this.removeFromWorld = false;
    var spritesheet;
    if (type === "ammo") {
        spritesheet = game.assetManager.getAsset("./img/arrowPile.png");
        this.boundingBox = {
            x:this.x, 
            y:this.y,
            width: 32,
            height: 16,
            offsetx:3,
            offsety:12
        }
    } else if (type === "HP"){
        spritesheet = game.assetManager.getAsset("./img/heart.png");
        this.boundingBox = {
            x:this.x, 
            y:this.y,
            width: 32,
            height: 32,
            offsetx:3,
            offsety:12
        };

    } else if(type === "SlowTime"){
        spritesheet = AM.getAsset("./img/hourglass.png");
        this.boundingBox = {
            x:this.x, 
            y:this.y,
            width: 30,
            height: 48,
            offsetx:0,
            offsety:0
        };
    } else if (type === "TripleShot") {
        spritesheet = AM.getAsset("./img/TripleShot.png");
        this.boundingBox = {
            x:this.x, 
            y:this.y,
            width: 25,
            height: 24,
            offsetx:0,
            offsety:0
        };
    } else if (type === "Bomb") {
        spritesheet = AM.getAsset("./img/bomb.png");
        this.boundingBox = {
            x:this.x, 
            y:this.y,
            width: 25,
            height: 24,
            offsetx:0,
            offsety:0
        };
    }
    this.sheet = spritesheet;
    Entity.call(this, game, x, y);
}

Powerup.prototype.update = function() {
    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        if (ent instanceof Player) {
            if (collide({boundingBox: this.boundingBox}, ent)) {
                this.removeFromWorld = true;
                if (this.type === "ammo") {
                    ent.ammo += 30;
                } else if (this.type === "HP") {
                    if (ent.health + 15 > 100) {
                        ent.health = 100;
                    } else {
                        ent.health += 15;
                    }
                } else {
                    if (ent.powerUp) {
                        ent.tpTimer = 0;
                        ent.canUsePU = true;
                    }
                    ent.powerUp = this;

                } 
            }

            
        }
    }
}

Powerup.prototype.draw = function() {
    this.ctx.drawImage(this.sheet, this.x, this.y);
    if (this.game.showOutlines) {
        this.ctx.strokeRect(this.boundingBox.x, this.boundingBox.y, this.boundingBox.width, this.boundingBox.height);
    }
   
}
function StoneDirection (game, x, y) {
    this.game = game;
    this.ctx = game.ctx;
    this.x = x;
    this.y = y;
    this.boundingBox = {
        x:-99, 
        y:-99,
        width: 32,
        height: 32,
        offsetx:3,
        offsety:12
    }
    this.sheet =  game.assetManager.getAsset("./img/stoneDirection.png");
    Entity.call(this, game, x, y);
}

StoneDirection.prototype.update = function() {
   
}

StoneDirection.prototype.draw = function() {
    this.ctx.drawImage(this.sheet, this.x, this.y);

   
}

function Projectile(game, spritesheet, speed, start, end, lifetime, shooter, damage){
    var shootaudio;
    this.boundingBox;
    var x;
    var y;
    var width;
    var height;
    var offx;
    var offy;
    this.onDestroy = null;
    this.shooter = shooter;
    this.game = game;
    this.ctx = game.ctx;
    this.xspeed = 0;
    this.yspeed = 0;
    this.timer = 0;
    this.lifetime = lifetime;
    this.damage = damage;
    //controlled should only be set if a projectile's position
    //update is controlled by another class (ie MultiStageAttack)
    this.controlled = false;
    this.speed = speed;
/*
    this.boundingBox = {
        x:this.x, 
        y:this.y,
        width: 31,
        height: 4,
        offsetx:3,
        offsety:12
    }
*/
    //determine x and y speed based on calculated angle
    var theta = 0;
    var dx = end.x - start.x;
    var dy = end.y - start.y;
    var pi = Math.PI;
    if(dx === 0){
        this.yspeed = dy<0?speed:-speed;
        theta = dy<0?(3*pi)/2:pi/2;
    } else if(dy === 0){
        this.xspeed = dx>0?speed:-speed;
        theta = dx>0?0:pi;
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
       /* console.log("Xspeed: " + this.xspeed);
        console.log("Yspeed: " + this.yspeed);*/
    }
    Entity.call(this, game, start.x, start.y);

    if (spritesheet.img === game.assetManager.getAsset('./img/enemyArrow.png') 
        || spritesheet.img === game.assetManager.getAsset('./img/arrow.png')) {
        shootaudio = new Audio('arrow_shooting.mp3');
        x = this.x + 3;
        y = this.y + 12;
        width = 31;
        height = 4;
        offx = 3;
        offy = 12;
    
    } else if (spritesheet.img === game.assetManager.getAsset('./img/fireball.png') 
    || spritesheet.img === game.assetManager.getAsset('./img/modball.png')) {
        shootaudio = new Audio('fireball_shooting.mp3');
        x = this.x;
        y = this.y;
        width = 26;
        height = 17;
        offx = 0;
        offy = 0;
    } else  if(spritesheet.img === game.assetManager.getAsset("./img/big_modball.png")){
        shootaudio = new Audio('fireball_shooting.mp3');
        x = this.x;
        y = this.y;
        width = 175;
        height = 175;
        offx = 0;
        offy = 0;
    } else{
        shootaudio = new Audio('carrot_shooting.mp3');
        x = this.x;
        y = this.y;
        width = 49;
        height = 5;
        offx = 0;
        offy = 0;
    }

    this.boundingBox = {
        p1:{x:x, y:y},
        p2:{x:x, y:y + height},
        p3:{x:x+width, y:y + height},
        p4:{x:x+width, y:y},
        offsetx:offx,
        offsety:offy
    };
    if(!game.mute){
        shootaudio.volume = 0.10; // 75%
        shootaudio.play();
    }
    this.originalBox = {
        p1:{x:x, y:y},
        p2:{x:x, y:y + height},
        p3:{x:x+width, y:y + height},
        p4:{x:x+width, y:y},
        offsetx:offx,
        offsety:offy
    };
    this.width = width;
    this.height = height;
    this.originalSheet = spritesheet;
    this.originalTheta = theta;
    this.sheet = Entity.prototype.rotateAndCache(spritesheet, theta);
    var temp = Entity.prototype.rotateAndCache(this.boundingBox, theta);
    this.rotatedBoundingBox = temp.img;
    rotateBoundingBox(this, theta);
}

Projectile.prototype = new Entity();
Projectile.prototype.constructor = Projectile;

Projectile.prototype.changeDirection = function(start, end){
    var speed = this.speed;
    var theta = 0;
    var dx = end.x - start.x;
    var dy = end.y - start.y;
    var pi = Math.PI;
    if(dx === 0){
        this.yspeed = dy<0?speed:-speed;
        theta = dy<0?(3*pi)/2:pi/2;
    } else if(dy === 0){
        this.xspeed = dx>0?speed:-speed;
        theta = dx>0?0:pi;
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
       /* console.log("Xspeed: " + this.xspeed);
        console.log("Yspeed: " + this.yspeed);*/
    }
    var b = this.originalBox;
    this.boundingBox = {
        p1:{x:b.p1.x, y:b.p1.y},
        p2:{x:b.p2.x, y:b.p2.y},
        p3:{x:b.p3.x, y:b.p3.y},
        p4:{x:b.p4.x, y:b.p4.y},
        offsetx:b.offsetx,
        offsety:b.offsety
    };
    this.sheet = Entity.prototype.rotateAndCache(this.originalSheet, theta);
    var temp = Entity.prototype.rotateAndCache(this.boundingBox, theta);
    this.rotatedBoundingBox = temp.img;
    rotateBoundingBox(this, theta);
}

Projectile.prototype.setOnDestroy = function(func) {
    this.onDestroy = func;
}

Projectile.prototype.update = function() {

    let time = this.game.clockTick;
    this.timer += time;
    if(this.timer < this.lifetime){
        for (var i = 0; i < this.game.entities.length; i++) {
            var ent = this.game.entities[i];
            if (!ent.removeFromWorld) {
                if (this.shooter !== "Player" && ent instanceof Player && projectileCollide(this, ent)) {
                    this.handleCollision(ent);
                } else if (this.shooter === "Player" 
                                        && (ent instanceof Bunny || ent instanceof shadowBoss 
                                            || ent instanceof RangeEnemy || ent instanceof FinalRabbitDestination
                                            || ent instanceof mage || ent instanceof menuItem || ent instanceof BlackBunny)
                                        && projectileCollide(this, ent)) {
                    this.handleCollision(ent);
                } else if (ent instanceof Background) {
                    LevelBoundingBoxCollsion(ent, this);
                }
            }
        }
        var dx = time*this.xspeed;
        var dy = time*this.yspeed;
        this.x += dx;
        this.y += dy;
        var box = this.boundingBox;
        box.p1 = {x:box.p1.x + dx, y:box.p1.y + dy};
        box.p2 = {x:box.p2.x + dx, y:box.p2.y + dy};
        box.p3 = {x:box.p3.x + dx, y:box.p3.y + dy};
        box.p4 = {x:box.p4.x + dx, y:box.p4.y + dy};
    } else {
        this.removeFromWorld = true;
    }
    if(this.onDestroy && this.removeFromWorld) this.onDestroy();
} 

Projectile.prototype.controlledUpdate = function(update, index, time, args) {
    this.timer += time;
    if(this.timer < this.lifetime){
        for (var i = 0; i < this.game.entities.length; i++) {
            var ent = this.game.entities[i];
            if (!ent.removeFromWorld) {
                if (this.shooter !== "Player" && ent instanceof Player && projectileCollide(this, ent)) {
                    this.handleCollision(ent);
                } else if (this.shooter === "Player" 
                                        && (ent instanceof Bunny || ent instanceof shadowBoss 
                                            || ent instanceof RangeEnemy || ent instanceof FinalRabbitDestination
                                            || ent instanceof mage || ent instanceof menuItem || ent instanceof BlackBunny)
                                        && projectileCollide(this, ent)) {
                    this.handleCollision(ent);
                } else if (ent instanceof Background) {
                    LevelBoundingBoxCollsion(ent, this);
                }
            }
        }
        var x = this.x;
        var y = this.y;
        update(this, index, time, args);
        var dx = this.x - x;
        var dy = this.y - y;
        var box = this.boundingBox;
        box.p1 = {x:box.p1.x + dx, y:box.p1.y + dy};
        box.p2 = {x:box.p2.x + dx, y:box.p2.y + dy};
        box.p3 = {x:box.p3.x + dx, y:box.p3.y + dy};
        box.p4 = {x:box.p4.x + dx, y:box.p4.y + dy};
    } else{
        this.removeFromWorld = true;
    }
    if(this.onDestroy && this.removeFromWorld) this.onDestroy();
}

Projectile.prototype.draw = function(){
    var x = this.x - this.sheet.center.x;
    var y = this.y - this.sheet.center.y;
    this.ctx.drawImage(this.sheet.img, x, y);
}

Projectile.prototype.handleCollision = function(ent) {
    if (ent instanceof Bunny || ent instanceof RangeEnemy) {    
        tempVelocityX = this.xspeed * friction;
        tempVelocityY = this.yspeed * friction;
        
        ent.x += 4 * tempVelocityX * this.game.clockTick;   
        ent.y += 4 * tempVelocityY * this.game.clockTick;
        
        
    }   

    if(ent instanceof Player && ent.parrying){
        this.xspeed = -this.xspeed * 1.5;
        this.yspeed = -this.yspeed * 1.5; 
        this.shooter = "Player";
        this.damage *= 3;
        this.sheet = Entity.prototype.rotateAndCache(this.originalSheet, this.originalTheta + Math.PI);
        rotateBoundingBox(this, Math.PI);
    } else if(ent.health){
        ent.health = ent.health - this.damage;
    }

    if(ent instanceof menuItem) ent.doAThing();
    
    if(!ent.parrying) this.removeFromWorld = true;
}

function rotateBoundingBox(proj, theta){
    var sin = Math.sin(-theta);
    var cos = Math.cos(-theta);
    var bb = proj.boundingBox;
    var cx = bb.p1.x + (bb.p4.x - bb.p1.x)/2;
    var cy = bb.p1.y + (bb.p2.y - bb.p1.y)/2; 
    var x1 = bb.p1.x - cx;
    var x2 = bb.p4.x - cx;
    var y1 = bb.p1.y - cy;
    var y2 = bb.p2.y - cy;
    //move to origin, rotate, translate to projectile xy
    bb.p1 = {x:x1*cos + y1*(-sin) +proj.x , y:x1*sin + y1*cos +proj.y};
    bb.p2 = {x:x1*cos + y2*(-sin) +proj.x , y:x1*sin + y2*cos +proj.y};
    bb.p3 = {x:x2*cos + y2*(-sin) +proj.x , y:x2*sin + y2*cos +proj.y};
    bb.p4 = {x:x2*cos + y1*(-sin) +proj.x , y:x2*sin + y1*cos +proj.y};


}


function projectileCollide(me, ent) {
    if ( !(me instanceof Background || me instanceof Crosshair)
      && !(ent instanceof Background || ent instanceof Crosshair)) {
          var box = me.boundingBox;
        var left = lineRect(box.p1.x, box.p1.y, box.p2.x, box.p2.y,
            ent.boundingBox.x, ent.boundingBox.y, 
            ent.boundingBox.width, ent.boundingBox.height);
        if(left) return true;
        var bottom = lineRect(box.p2.x, box.p2.y, box.p3.x, box.p3.y,
            ent.boundingBox.x, ent.boundingBox.y,
            ent.boundingBox.width, ent.boundingBox.height);
        if(bottom) return true;
        var right = lineRect(box.p3.x, box.p3.y, box.p4.x, box.p4.y,
            ent.boundingBox.x, ent.boundingBox.y,
            ent.boundingBox.width, ent.boundingBox.height);
        if(right) return true;
        var top = lineRect(box.p4.x, box.p4.y, box.p1.x, box.p1.y,
            ent.boundingBox.x, ent.boundingBox.y,
            ent.boundingBox.width, ent.boundingBox.height);
        if(top) return true;
    }
    return false;
}

function projectileLevelCollision(box, proj) {
    var pbox = proj.boundingBox;
    if(!box.halfHeight){
        var blist = [{s:box.p1, e:box.p2}, {s:box.p2, e:box.p3}, {s:box.p3, e:box.p4}, {s:box.p4, e:box.p1}];
        for(var i = 0; i<blist.length; i++){
            var line = blist[i];
            var l = lineLine(pbox.p1.x, pbox.p1.y, pbox.p2.x, pbox.p2.y, line.s.x, line.s.y, line.e.x, line.e.y);
            // if(l){
            //     console.log("left");
            //     lineLine(line.s.x, line.s.y, line.e.x, line.e.y, pbox.p1.x, pbox.p1.y, pbox.p2.x, pbox.p2.y);
            // }
            var d = lineLine(pbox.p2.x, pbox.p2.y, pbox.p3.x, pbox.p3.y, line.s.x, line.s.y, line.e.x, line.e.y);
            // if(d){
            //     console.log("down");
            //     lineLine(line.s.x, line.s.y, line.e.x, line.e.y, pbox.p2.x, pbox.p2.y, pbox.p3.x, pbox.p3.y);
            // }
            var r = lineLine(pbox.p3.x, pbox.p3.y, pbox.p4.x, pbox.p4.y, line.s.x, line.s.y, line.e.x, line.e.y);
            // if(r){
            //     console.log("right");
            //     lineLine(line.s.x, line.s.y, line.e.x, line.e.y, pbox.p2.x, pbox.p2.y, pbox.p3.x, pbox.p3.y);
            // }
            var u = lineLine(pbox.p4.x, pbox.p4.y, pbox.p1.x, pbox.p1.y, line.s.x, line.s.y, line.e.x, line.e.y);
            // if(l){
            //     console.log("up");
            //     lineLine(line.s.x, line.s.y, line.e.x, line.e.y, pbox.p4.x, pbox.p4.y, pbox.p1.x, pbox.p1.y);
            // }
            if(l || d || r || u) return true;
        }
    }
    return false;
}


function handleBoxCollision (ent, box){
    var hitboxlines = [
            {x:ent.boundingBox.x, y:ent.boundingBox.y}, 
            {x:ent.boundingBox.x, y:ent.boundingBox.y+ent.boundingBox.height},
            {x:ent.boundingBox.x+ent.boundingBox.width, y:ent.boundingBox.y+ent.boundingBox.height},
            {x:ent.boundingBox.x+ent.boundingBox.width, y:ent.boundingBox.y}
    ];

    var bl = [
        {x:box.p1.x, y:box.p1.y}, 
        {x:box.p2.x, y:box.p2.y},
        {x:box.p3.x, y:box.p3.y},
        {x:box.p4.x, y:box.p4.y}
    ];

    var isSteep = function(p1, p2){
        if(p1.x!==p2.x && p1.y!==p2.y) return true;
        else return false;
    }

    for(var a=1; a<=hitboxlines.length; a++){
        var p1 = hitboxlines[a-1];
        var p2 = hitboxlines[a%4];
        var l = lineLine(p1.x, p1.y, p2.x, p2.y, bl[0].x, bl[0].y, bl[1].x, bl[1].y);
        var d = lineLine(p1.x, p1.y, p2.x, p2.y, bl[1].x, bl[1].y, bl[2].x, bl[2].y);
        var r = lineLine(p1.x, p1.y, p2.x, p2.y, bl[2].x, bl[2].y, bl[3].x, bl[3].y);
        var u = lineLine(p1.x, p1.y, p2.x, p2.y, bl[3].x, bl[3].y, bl[0].x, bl[0].y);
        if(l){
            ent.moveRestrictions.right = true;
            if(isSteep(bl[0], bl[1])){
                if(a==2) ent.moveRestrictions.down = true;
                else if(a==4) ent.moveRestrictions.up = true;
            }
        }
        if(r){
            ent.moveRestrictions.left = true;
            if(isSteep(bl[2], bl[3])){
                if(a==2) ent.moveRestrictions.down = true;
                else if(a==4) ent.moveRestrictions.up = true;
            }
        }
        if(d){
            ent.moveRestrictions.up = true;
            if(isSteep(bl[1], bl[2])){
                if(a==1) ent.moveRestrictions.left = true;
                else if(a==3) ent.moveRestrictions.right = true;
            }
        }
        if(u){
            ent.moveRestrictions.down = true;
            if(isSteep(bl[3], bl[0])){
                if(a==1) ent.moveRestrictions.left = true;
            else if(a==3) ent.moveRestrictions.right = true;
            }
        }
    }
   // document.getElementById("debug-out").innerHTML = `left:${this.moveRestrictions.left}, right:${this.moveRestrictions.right}, up:${this.moveRestrictions.up}, down:${this.moveRestrictions.down}`
}

function LevelBoundingBoxCollsion(background, ent) {
    background.boundingBoxes.forEach((box) => {
        if(!(ent instanceof Projectile) /*|| (ent instanceof Projectile && !box.halfHeight)*/){
            var left = lineRect(box.p1.x, box.p1.y, box.p2.x, box.p2.y,
                ent.boundingBox.x, ent.boundingBox.y, 
                ent.boundingBox.width, ent.boundingBox.height);
            var bottom = lineRect(box.p2.x, box.p2.y, box.p3.x, box.p3.y,
                ent.boundingBox.x, ent.boundingBox.y,
                ent.boundingBox.width, ent.boundingBox.height);
            var right = lineRect(box.p3.x, box.p3.y, box.p4.x, box.p4.y,
                ent.boundingBox.x, ent.boundingBox.y,
                ent.boundingBox.width, ent.boundingBox.height);
            var top = lineRect(box.p4.x, box.p4.y, box.p1.x, box.p1.y,
                ent.boundingBox.x, ent.boundingBox.y,
                ent.boundingBox.width, ent.boundingBox.height);
            if ( left|| bottom || right || top) {
                if (ent instanceof Player){
                    handleBoxCollision(ent, box);
                } else if (ent instanceof Bunny || ent instanceof RangeEnemy
                        || ent instanceof FinalRabbitDestination || ent instanceof shadowBoss || 
                        ent instanceof BlackBunny) {            
                    //handleBoxCollision(ent, box);
                    if (top) {
                        ent.y -= 1;
                        ent.velocity.y = -ent.velocity.y; 
                    } if (right) {
                        ent.x += 1;
                        ent.velocity.x = -ent.velocity.x;
                    } if (left) {
                        ent.x -= 1;
                        ent.velocity.x = -ent.velocity.x;
                    } if(bottom) {
                        ent.y += 1;
                        ent.velocity.y = -ent.velocity.y
                    }
        
                }
                
            }
        } else if(projectileLevelCollision(box, ent)){
            ent.removeFromWorld = true;
        }
    });
    return false;
}

function TrapDoor(game){
    this.ctx = game.ctx;
    this.x = 11050;
    this.y = 1782;
    this.boundingBox = {
        x:-99, 
        y:-99,
        width: 32,
        height: 32,
        offsetx:3,
        offsety:12
    }
}

TrapDoor.prototype.update = function(){}

TrapDoor.prototype.draw = function(){
    this.ctx.drawImage(AM.getAsset("./img/trapdoor.png"), this.x, this.y);
}


