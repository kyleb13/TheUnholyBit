

midPoint = {x:5275, y:1965};



function generateRandomNumber(min , max) 
{
    return Math.random() * (max-min) + min ;
} 

function distance(a, b) {
    var dx = a.x - b.x;
    var dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
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



function shiftDirectionBoss(ent1, ent2) {
    var enemyX = ent2.x;
    var centerx = ent1.x;
    var xdiff = centerx-enemyX;

    if(xdiff>0){
        ent1.direction = "right";
    } else {
        ent1.direction = "left"; 
    }
   
}


function shadowBoss(game,movementsheet,attackLsheet,attackRsheet) {
    this.animation = new Animation(movementsheet,82,75,17,.09,17,true,2);
    this.attackAnimations = [];
    this.attackAnimations["left"] = new Animation(attackLsheet,82,75,31,.08,31,true,2);
    this.attackAnimations["right"] = new Animation(attackRsheet,82,75,31,.08,31,true,2);
    this.attackVision = 200;
    this.attackL = false;
    this.attackR = false;
    this.attack = false;
    this.ctx = game.ctx;
    this.speed = 10;
    this.location = false;
    this.endPoint = {x:6200, y:2055};
    this.startPoint = {x:4700, y:1875};
    this.velocity = { x: generateRandomNumber(this.startPoint.x , this.endPoint.x) , 
        y: generateRandomNumber(this.startPoint.y , this.endPoint.y)};
    var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
    if (speed > maxSpeed) {
        
        var ratio = maxSpeed / speed;
        this.velocity.x *= ratio;
        this.velocity.y *= ratio;
    }

    this.boxes = true;

   
    
    this.boundingBox = {
        x:this.x, 
        y:this.y,
        width: 85,
        height: 110,
        offsetx:35,
        offsety:25
    }

    
    this.visualBox = {
        x:this.x, 
        y:this.y,
        width: 1200,
        height: 1200,
        offsetx:-540,
        offsety:-550
    }

    this.attackBox = {
        x:this.x, 
        y:this.y,
        width: 700,
        height: 700,
        offsetx:-270,
        offsety:-270
    }
    this.followPoint = {x:0, y:0};
    this.direction = "right";
    this.following = false;
    this.isdead = false;

    Entity.call(this, game, 5600, 1797);

    var that = this;
    for (var index in this.attackAnimations) {
        this.attackAnimations[index].setCallbackOnFrame(16, {}, () => {
            var x = that.x;
            var y = that.y;
            switch(that.direction){
                case "left":
                    y += 25;
                    break;
                case "right":
                    y += 30;
                    x+=25;
                    break;  
            }
            that.game.addProjectile( 
                new Projectile( that.game,
                {
                    img:that.game.assetManager.getAsset("./img/modball.png"), 
                    width:26, 
                    height:17,
                    path:"./img/modball.png"
                }, 300, //speed
                {//start point
                    x:x, 
                    y:y
                }, 
                {//end Point
                    x:(that.game.player.center()).x, 
                    y:(that.game.player.center()).y
                }, generateRandomNumber(4 , 14), "Boss", 10));//lifetime   

                that.game.addProjectile( 
                new Projectile( that.game,
                {
                    img:that.game.assetManager.getAsset("./img/modball.png"), 
                    width:26, 
                    height:17,
                    path:"./img/modball.png"
                }, 300, //speed
                {//start point
                    x:x, 
                    y:y
                }, 
                {//end Point
                    x:(that.game.player.center()).x + generateRandomNumber(1 , 10) , 
                    y:(that.game.player.center()).y + generateRandomNumber(1 , 10) , 
                }, generateRandomNumber(2 , 12), "Boss", 10));//lifetime  

                that.game.addProjectile( 
                    new Projectile( that.game,
                    {
                        img:that.game.assetManager.getAsset("./img/modball.png"), 
                        width:26, 
                        height:17,
                        path:"./img/modball.png"
                    }, 300, //speed
                    {//start point
                        x:x, 
                        y:y
                    }, 
                    {//end Point
                        x:(that.game.player.center()).x - generateRandomNumber(1 , 10), 
                        y:(that.game.player.center()).y - generateRandomNumber(1 , 10)
                    }, generateRandomNumber(3 , 10), "Boss", 10));//lifetime  

                    that.game.addProjectile( 
                        new Projectile( that.game,
                        {
                            img:that.game.assetManager.getAsset("./img/modball.png"), 
                            width:26, 
                            height:17,
                            path:"./img/modball.png"
                        }, 300, //speed
                        {//start point
                            x:x + 100, 
                            y:y 
                        }, 
                        {//end Point
                            x:(that.game.player.center()).x + 100 , 
                            y:(that.game.player.center()).y , 
                        }, generateRandomNumber(0 , 12), "Boss", 10));//lifetime 
                        
                        that.game.addProjectile( 
                            new Projectile( that.game,
                            {
                                img:that.game.assetManager.getAsset("./img/modball.png"), 
                                width:26, 
                                height:17,
                                path:"./img/modball.png"
                            }, 300, //speed
                            {//start point
                                x:x + 50, 
                                y:y
                            }, 
                            {//end Point
                                x:(that.game.player.center()).x +  50, 
                                y:(that.game.player.center()).y  , 
                            }, generateRandomNumber(0 , 10), "Boss", 10));//lifetime  

                            that.game.addProjectile( 
                                new Projectile( that.game,
                                {
                                    img:that.game.assetManager.getAsset("./img/modball.png"), 
                                    width:26, 
                                    height:17,
                                    path:"./img/modball.png"
                                }, 300, //speed
                                {//start point
                                    x:x - 50, 
                                    y:y
                                }, 
                                {//end Point
                                    x:(that.game.player.center()).x - 50 , 
                                    y:(that.game.player.center()).y , 
                                }, generateRandomNumber(0 , 12), "Boss", 10));//lifetime  

                                that.game.addProjectile( 
                                    new Projectile( that.game,
                                    {
                                        img:that.game.assetManager.getAsset("./img/modball.png"), 
                                        width:26, 
                                        height:17,
                                        path:"./img/modball.png"
                                    }, 300, //speed
                                    {//start point
                                        x:x - 100, 
                                        y:y
                                    }, 
                                    {//end Point
                                        x:(that.game.player.center()).x - 100 , 
                                        y:(that.game.player.center()).y , 
                                    }, generateRandomNumber(0 , 12), "Boss", 10));//lifetime  

                                
                
            
        
        });
    }
    this.health = 1000;
    this.healthBar = new HealthBar(game, this, 80, -10);
}

shadowBoss.prototype = new Entity();
shadowBoss.prototype.constructor = shadowBoss;

shadowBoss.prototype.center = function() {
    var centerx = this.x + this.animation.frameWidth/2;
    var centery= this.y + this.animation.frameHeight/2;
    return {x:centerx, y:centery};
}


shadowBoss.prototype.update = function () {

    if (this.health < 1) {
        this.isdead = true;
        this.attacking = false;
        this.following = false;
    }

    Entity.prototype.update.call(this);
    
    this.boundingBox.x = this.x + this.boundingBox.offsetx;
    this.boundingBox.y = this.y + this.boundingBox.offsety;

    this.visualBox.x = this.x + this.visualBox.offsetx;
    this.visualBox.y = this.y + this.visualBox.offsety;

    this.attackBox.x = this.x + this.attackBox.offsetx;
    this.attackBox.y = this.y + this.attackBox.offsety;

    var ent = this.game.player;

    if (collide(this, ent)) {
        console.log("Player collide");
        var temp = { x: this.velocity.x, y: this.velocity.y };

        tempVelocityX = temp.x * friction;
        tempVelocityY = temp.y * friction;

        ent.x += 20 * tempVelocityX * this.game.clockTick;
        ent.y += 20 * tempVelocityY * this.game.clockTick;
    }

    if (collide({boundingBox: this.visualBox}, ent)) {
        this.following = true;
        var dist = distance(this, ent);
        this.followPoint = ent;
        if (collide(ent, {boundingBox: this.attackBox})) {
            this.attack = true;
            this.following =false;
        }
    }else {
        this.following = false;
    }
    if(this.following){
        this.attack = false;
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
    shiftDirectionBoss(this, ent);

    this.healthBar.update();
}

shadowBoss.prototype.draw = function () {

    if(this.following){
        this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    } else if(this.isdead){
        this.removeFromWorld = true;
       
    }
    else if(this.attack){
        this.attackAnimations[this.direction].drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
       
    }
    this.ctx.strokeStyle = "red";
    this.ctx.strokeRect(this.boundingBox.x, this.boundingBox.y, this.boundingBox.width, this.boundingBox.height);
    this.ctx.strokeStyle = "black";
    this.ctx.strokeRect(this.attackBox.x, this.attackBox.y, this.attackBox.width, this.attackBox.height);
    this.ctx.strokeStyle = "blue";
    this.ctx.strokeRect(this.visualBox.x, this.visualBox.y, this.visualBox.width, this.visualBox.height);
    this.healthBar.draw();
    Entity.prototype.draw.call(this);
}



var friction = 1;
var acceleration = 1000000;
var maxSpeed = 100;


///////////////////////////////////////////////////////////////////////////////

function mage(game, walksheet, magicsheet, deathsheet) {

    this.walkAnimations = [];
    this.attackAnimations =[];


    this.walkAnimations["up"] = new Animation2 (walksheet, 0, 0, 64, 64, 0.1, 9, true, false);
    this.walkAnimations["left"] = new Animation2 (walksheet, 0, 64, 64, 64, 0.1, 9, true, false);
    this.walkAnimations["down"] = new Animation2 (walksheet, 0, 128, 64, 64, 0.1, 9, true, false);
    this.walkAnimations["right"] = new Animation2 (walksheet, 0, 192, 64, 64, 0.1, 9, true, false);

    this.attackAnimations["up"] = new Animation2 (magicsheet, 0, 0, 64, 64, 0.2, 7, true, false);
    this.attackAnimations["left"] = new Animation2 (magicsheet, 0, 64, 64, 64, 0.2, 7, true, false);
    this.attackAnimations["down"]= new Animation2 (magicsheet, 0, 128, 64, 64, 0.2, 7, true, false);
    this.attackAnimations["right"] = new Animation2 (magicsheet, 0, 192, 64, 64, 0.2, 7, true, false);

    this.DyingAnimation = new Animation2(deathsheet, 0, 0, 64, 64, 0.1, 6, false, false);

 
    this.attackVision = 200;
    this.attackL = false;
    this.attackR = false;
    this.attack = false;
    this.ctx = game.ctx;
    this.speed = 10;
    this.location = false;
    this.endPoint = {x:6200, y:2055};
    this.startPoint = {x:4700, y:1875};
    this.velocity = { x: generateRandomNumber(this.startPoint.x , this.endPoint.x) , 
        y: generateRandomNumber(this.startPoint.y , this.endPoint.y)};
    var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
    if (speed > maxSpeed) {
        
        var ratio = maxSpeed / speed;
        this.velocity.x *= ratio;
        this.velocity.y *= ratio;
    }

    this.boxes = true;

   
    
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
        width: 1300,
        height: 1300,
        offsetx:-645,
        offsety:-650
    }

    this.attackBox = {
        x:this.x, 
        y:this.y,
        width: 900,
        height: 900,
        offsetx:-440,
        offsety:-450
    }
    this.followPoint = {x:0, y:0};
    this.direction = "right";
    this.following = false;
    this.isdead = false;

    Entity.call(this, game, 5600, 1797);

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
            that.game.addProjectile( 
                new Projectile( that.game,
                {
                    img:that.game.assetManager.getAsset("./img/mage_attack2.png"), 
                    width:85, 
                    height:195,
                    path:"./img/mage_attack2.png"
                }, 300, //speed
                {//start point
                    x:(that.game.player.center()).x - 50, 
                    y:y
                }, 
                {//end Point
                    x:(that.game.player.center()).x, 
                    y:(that.game.player.center()).y
                }, generateRandomNumber(4 , 14), "Boss", 10));//lifetime       


                that.game.addProjectile( 
                    new Projectile( that.game,
                    {
                        img:that.game.assetManager.getAsset("./img/mage_attack2.png"), 
                        width:85, 
                        height:195,
                        path:"./img/mage_attack2.png"
                    }, 300, //speed
                    {//start point
                        x: (that.game.player.center()).x + 50, 
                        y:y
                    }, 
                    {//end Point
                        x:(that.game.player.center()).x, 
                        y:(that.game.player.center()).y
                    }, generateRandomNumber(4 , 14), "Boss", 10));//lifetime       


                    that.game.addProjectile( 
                        new Projectile( that.game,
                        {
                            img:that.game.assetManager.getAsset("./img/mage_attack2.png"), 
                            width:85, 
                            height:195,
                            path:"./img/mage_attack2.png"
                        }, 300, //speed
                        {//start point
                            x: x, 
                            y:y
                        }, 
                        {//end Point
                            x:(that.game.player.center()).x, 
                            y:(that.game.player.center()).y
                        }, generateRandomNumber(4 , 14), "Boss", 10));//lifetime    

               
        
        });
    }
    this.health = 1000;
    this.healthBar = new HealthBar(game, this, 80, -10);
   
}


mage.prototype = new Entity();
mage.prototype.constructor = mage;

mage.prototype.update = function () {
    if (this.health < 1) {
        this.isdead = true;
        this.attacking = false;
        this.following = false;
    }

    Entity.prototype.update.call(this);
    
    this.boundingBox.x = this.x + this.boundingBox.offsetx;
    this.boundingBox.y = this.y + this.boundingBox.offsety;

    this.visualBox.x = this.x + this.visualBox.offsetx;
    this.visualBox.y = this.y + this.visualBox.offsety;

    this.attackBox.x = this.x + this.attackBox.offsetx;
    this.attackBox.y = this.y + this.attackBox.offsety;

    var ent = this.game.player;

    if (collide(this, ent)) {
        console.log("Player collide");
        var temp = { x: this.velocity.x, y: this.velocity.y };

        tempVelocityX = temp.x * friction;
        tempVelocityY = temp.y * friction;

        ent.x += 20 * tempVelocityX * this.game.clockTick;
        ent.y += 20 * tempVelocityY * this.game.clockTick;
    }

    if (collide({boundingBox: this.visualBox}, ent)) {
        this.following = true;
        var dist = distance(this, ent);
        this.followPoint = ent;
        if (collide(ent, {boundingBox: this.attackBox})) {
            this.attack = true;
            this.following =false;
        }
    }else {
        this.following = false;
    }
    if(this.following){
        this.attack = false;
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

    this.healthBar.update();
}

mage.prototype.draw = function () {

    if (this.attack && !this.dead) {
        this.attackAnimations[this.direction].drawFrame(this.game.clockTick, this.ctx, this.x, this.y, 1.5);
    } else if (this.following&& !this.dead) {
        this.walkAnimations[this.direction].drawFrame(this.game.clockTick, this.ctx, this.x, this.y, 1.5);
    }

    
    if (this.dead) {
        this.DyingAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, 1.5, this);
    }
    this.healthBar.draw();
    this.ctx.strokeStyle = "red";
    this.ctx.strokeRect(this.boundingBox.x, this.boundingBox.y, this.boundingBox.width, this.boundingBox.height);
    this.ctx.strokeStyle = "black";
    this.ctx.strokeRect(this.attackBox.x, this.attackBox.y, this.attackBox.width, this.attackBox.height);
    this.ctx.strokeStyle = "blue";
    this.ctx.strokeRect(this.visualBox.x, this.visualBox.y, this.visualBox.width, this.visualBox.height);
    Entity.prototype.draw.call(this);
  
}

////////////////////////////////////////////////////////////////////////////

function kingBunny(game,spritesheet) {




    this.walkAnimations = [];
    this.deathAnimations = [];
    this.attackAnimations = [];
 
    
    this.walkAnimations["down"] = new Animation2(spritesheet, 0, 0, 48, 64, 0.1, 7, true, false);
    this.walkAnimations["up"] = new Animation2(spritesheet, 0, 64, 48, 64, 0.1, 7, true, false);
    this.walkAnimations["right"] = new Animation2(spritesheet, 0, 128, 48, 64, 0.1, 7, true, false);
    this.walkAnimations["left"] = new Animation2(spritesheet, 0, 192, 48, 64, 0.1, 7, true, false);

    this.attackAnimations["down"] = new Animation2(spritesheet, 96, 0, 48, 64, 0.2, 1, false, false);
    this.attackAnimations["up"] = new Animation2(spritesheet, 96, 64, 48, 64, 0.2, 1, false, false);
    this.attackAnimations["right"] = new Animation2(spritesheet, 96, 128, 48, 64, 0.2, 1, false, false);
    this.attackAnimations["left"] = new Animation2(spritesheet, 96, 192, 48, 64, 0.2, 1, false, true);
 
    this.deathAnimations["down"] = new Animation2(spritesheet, 288, 0, 48, 64, 0.1, 3, false, false);
    this.deathAnimations["up"] = new Animation2(spritesheet, 288, 64, 48, 64, 0.1, 3, false, false);
    this.deathAnimations["right"] = new Animation2(spritesheet, 288, 128, 48, 64, 0.1, 3, false, false);
    this.deathAnimations["left"] = new Animation2(spritesheet, 288, 192, 48, 64, 0.1, 3, false, true);


 
    this.attackVision = 200;
    this.attackL = false;
    this.attackR = false;
    this.attack = false;
    this.ctx = game.ctx;
    this.speed = 10;
    this.location = false;
    this.endPoint = {x:6200, y:2055};
    this.startPoint = {x:4700, y:1875};
    this.velocity = { x: generateRandomNumber(this.startPoint.x , this.endPoint.x) , 
        y: generateRandomNumber(this.startPoint.y , this.endPoint.y)};
    var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
    if (speed > maxSpeed) {
        
        var ratio = maxSpeed / speed;
        this.velocity.x *= ratio;
        this.velocity.y *= ratio;
    }

    this.boxes = true;

   
    
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
        width: 1300,
        height: 1300,
        offsetx:-645,
        offsety:-650
    }

    this.attackBox = {
        x:this.x, 
        y:this.y,
        width: 900,
        height: 900,
        offsetx:-440,
        offsety:-450
    }
    this.followPoint = {x:0, y:0};
    this.direction = "right";
    this.following = false;
    this.isdead = false;

    Entity.call(this, game, 5600, 1797);

    var that = this;
    for (var index in this.attackAnimations) {
        this.attackAnimations[index].setCallbackOnFrame(1, {}, () => {
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
            that.game.addProjectile( 
                new Projectile( that.game,
                {
                    img:that.game.assetManager.getAsset("./img/carrot1.png"), 
                    width:85, 
                    height:195,
                    path:"./img/carrot1.png"
                }, 300, //speed
                {//start point
                    x:(that.game.player.center()).x - 50, 
                    y:y
                }, 
                {//end Point
                    x:(that.game.player.center()).x, 
                    y:(that.game.player.center()).y
                }, generateRandomNumber(4 , 14), "Boss", 10));//lifetime       


                that.game.addProjectile( 
                    new Projectile( that.game,
                    {
                        img:that.game.assetManager.getAsset("./img/carrot1.png"), 
                        width:85, 
                        height:195,
                        path:"./img/carrot1.png"
                    }, 300, //speed
                    {//start point
                        x: (that.game.player.center()).x + 50, 
                        y:y
                    }, 
                    {//end Point
                        x:(that.game.player.center()).x, 
                        y:(that.game.player.center()).y
                    }, generateRandomNumber(4 , 14), "Boss", 10));//lifetime       


                    that.game.addProjectile( 
                        new Projectile( that.game,
                        {
                            img:that.game.assetManager.getAsset("./img/carrot1.png"), 
                            width:85, 
                            height:195,
                            path:"./img/carrot1.png"
                        }, 300, //speed
                        {//start point
                            x: x, 
                            y:y
                        }, 
                        {//end Point
                            x:(that.game.player.center()).x, 
                            y:(that.game.player.center()).y
                        }, generateRandomNumber(4 , 14), "Boss", 10));//lifetime    

               
        
        });
    }
    this.health = 1000;
    this.healthBar = new HealthBar(game, this, 80, -10);
   
}


kingBunny.prototype = new Entity();
kingBunny.prototype.constructor = kingBunny;

kingBunny.prototype.update = function () {
    if (this.health < 1) {
        this.isdead = true;
        this.attacking = false;
        this.following = false;
    }

    Entity.prototype.update.call(this);
    
    this.boundingBox.x = this.x + this.boundingBox.offsetx;
    this.boundingBox.y = this.y + this.boundingBox.offsety;

    this.visualBox.x = this.x + this.visualBox.offsetx;
    this.visualBox.y = this.y + this.visualBox.offsety;

    this.attackBox.x = this.x + this.attackBox.offsetx;
    this.attackBox.y = this.y + this.attackBox.offsety;

    var ent = this.game.player;

    if (collide(this, ent)) {
        console.log("Player collide");
        var temp = { x: this.velocity.x, y: this.velocity.y };

        tempVelocityX = temp.x * friction;
        tempVelocityY = temp.y * friction;

        ent.x += 20 * tempVelocityX * this.game.clockTick;
        ent.y += 20 * tempVelocityY * this.game.clockTick;
    }

    if (collide({boundingBox: this.visualBox}, ent)) {
        this.following = true;
        var dist = distance(this, ent);
        this.followPoint = ent;
        if (collide(ent, {boundingBox: this.attackBox})) {
            this.attack = true;
            this.following =false;
        }
    }else {
        this.following = false;
    }
    if(this.following){
        this.attack = false;
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

    this.healthBar.update();
}

kingBunny.prototype.draw = function () {

    if (this.attack && !this.dead) {
        this.attackAnimations[this.direction].drawFrame(this.game.clockTick, this.ctx, this.x, this.y, 1.5);
    } else if (this.following&& !this.dead) {
        this.walkAnimations[this.direction].drawFrame(this.game.clockTick, this.ctx, this.x, this.y, 1.5);
    }

    
    if (this.dead) {
        this.DyingAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, 1.5, this);
    }
    this.healthBar.draw();
    this.ctx.strokeStyle = "red";
    this.ctx.strokeRect(this.boundingBox.x, this.boundingBox.y, this.boundingBox.width, this.boundingBox.height);
    this.ctx.strokeStyle = "black";
    this.ctx.strokeRect(this.attackBox.x, this.attackBox.y, this.attackBox.width, this.attackBox.height);
    this.ctx.strokeStyle = "blue";
    this.ctx.strokeRect(this.visualBox.x, this.visualBox.y, this.visualBox.width, this.visualBox.height);
    Entity.prototype.draw.call(this);
  
}





