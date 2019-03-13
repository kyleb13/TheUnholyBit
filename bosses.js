

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
    var centerx = ent1.x + ent1.attackAnimations["right"].frameWidth/2;;
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
    
    this.velocity = { x: generateRandomNumber(this.startPoint.x , this.endPoint.x), 
        y: generateRandomNumber(this.startPoint.y , this.endPoint.y)};
    var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
    if (speed > bossMaxSpeed) {
        
        var ratio = bossMaxSpeed / speed;
        this.velocity.x *= ratio;
        this.velocity.y *= ratio;
    }

    this.boxes = true;

    projectile = [];
   
    
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
        width: 1000,
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
                }, 325, //speed
                {//start point
                    x:x, 
                    y:y
                }, 
                {//end Point
                    x:(that.game.player.center()).x, 
                    y:(that.game.player.center()).y
                }, generateRandomNumber(4 , 14), "Boss", 20));//lifetime   
                that.game.addProjectile( 
                new Projectile( that.game,
                {
                    img:that.game.assetManager.getAsset("./img/modball.png"), 
                    width:26, 
                    height:17,
                    path:"./img/modball.png"
                }, 325, //speed
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
                    }, 325, //speed
                    {//start point
                        x:x, 
                        y:y
                    }, 
                    {//end Point
                        x:(that.game.player.center()).x - generateRandomNumber(1 , 10), 
                        y:(that.game.player.center()).y - generateRandomNumber(1 , 10)
                    }, generateRandomNumber(3 , 10), "Boss", 20));//lifetime  

                    that.game.addProjectile( 
                        new Projectile( that.game,
                        {
                            img:that.game.assetManager.getAsset("./img/modball.png"), 
                            width:26, 
                            height:17,
                            path:"./img/modball.png"
                        }, 325, //speed
                        {//start point
                            x:x + 100, 
                            y:y 
                        }, 
                        {//end Point
                            x:(that.game.player.center()).x + 100 , 
                            y:(that.game.player.center()).y , 
                        }, generateRandomNumber(0 , 12), "Boss", 20));//lifetime 
                        
                        that.game.addProjectile( 
                            new Projectile( that.game,
                            {
                                img:that.game.assetManager.getAsset("./img/modball.png"), 
                                width:26, 
                                height:17,
                                path:"./img/modball.png"
                            }, 325, //speed
                            {//start point
                                x:x + 50, 
                                y:y
                            }, 
                            {//end Point
                                x:(that.game.player.center()).x +  50, 
                                y:(that.game.player.center()).y  , 
                            }, generateRandomNumber(0 , 10), "Boss", 20));//lifetime  

                            that.game.addProjectile( 
                                new Projectile( that.game,
                                {
                                    img:that.game.assetManager.getAsset("./img/modball.png"), 
                                    width:26, 
                                    height:17,
                                    path:"./img/modball.png"
                                }, 325, //speed
                                {//start point
                                    x:x - 50, 
                                    y:y
                                }, 
                                {//end Point
                                    x:(that.game.player.center()).x - 50 , 
                                    y:(that.game.player.center()).y , 
                                }, generateRandomNumber(0 , 12), "Boss", 20));//lifetime  

                                that.game.addProjectile( 
                                    new Projectile( that.game,
                                    {
                                        img:that.game.assetManager.getAsset("./img/modball.png"), 
                                        width:26, 
                                        height:17,
                                        path:"./img/modball.png"
                                    }, 325, //speed
                                    {//start point
                                        x:x - 100, 
                                        y:y
                                    }, 
                                    {//end Point
                                        x:(that.game.player.center()).x - 100 , 
                                        y:(that.game.player.center()).y , 
                                    }, generateRandomNumber(0 , 12), "Boss", 20));//lifetime  
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
        console.log("D E D");
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
        
        shiftDirectionBoss(this, ent);
        this.following = true;
        var dist = distance(this, ent);
        this.followPoint = ent;

    } else {
        this.following = false;
    }
    if(this.following){
        this.attack = true;
        var difX = (ent.x - this.x)/dist;
        var difY = (ent.y - this.y)/dist;
        this.velocity.x += difX * acceleration  / (dist*dist);
        this.velocity.y += difY * acceleration / (dist*dist);
        var speed = Math.sqrt(this.velocity.x*this.velocity.x + this.velocity.y*this.velocity.y);
        if (speed > bossMaxSpeed) {
            var ratio = bossMaxSpeed / speed;
            this.velocity.x *= ratio;
            this.velocity.y *= ratio;
        }
        
        this.x += this.velocity.x * this.game.clockTick;
        this.y += this.velocity.y * this.game.clockTick;
    }

    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        if (ent instanceof Background) {
            LevelBoundingBoxCollsion(ent, this);
        }
    }

    this.healthBar.update();
}

shadowBoss.prototype.draw = function () {

    if(this.isdead){
        console.log("is it?");
        this.removeFromWorld = true;
        bossDead = true;
        this.game.addEntity(new StoneDirection(this.game, 5450, 1400));
    
    }
    else if(this.attack){
        this.attackAnimations[this.direction].drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
       
    } else {
        this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    }
    if (this.game.showOutlines) {
        this.ctx.strokeStyle = "red";
        this.ctx.strokeRect(this.boundingBox.x, this.boundingBox.y, this.boundingBox.width, this.boundingBox.height);
        this.ctx.strokeStyle = "black";
    //    this.ctx.strokeRect(this.attackBox.x, this.attackBox.y, this.attackBox.width, this.attackBox.height);
        this.ctx.strokeStyle = "blue";
        this.ctx.strokeRect(this.visualBox.x, this.visualBox.y, this.visualBox.width, this.visualBox.height);
        
    }
    this.healthBar.draw();
    Entity.prototype.draw.call(this);
    
}



var friction = 1;
var acceleration = 1000000;
var bossMaxSpeed = 50;


function FinalRabbitDestination(game, spritesheet, x, y) {
    
    this.walkAnimations = [];
    this.walkAnimations["down"] = new Animation2(spritesheet, 0, 16, 384, 512, 0.2, 7, true, false);
    this.walkAnimations["up"] = new Animation2(spritesheet, 0, 512, 384, 512, 0.2, 7, true, false);
    this.walkAnimations["right"] = new Animation2(spritesheet, 0, 1024, 384, 512, 0.2, 7, true, false);
    this.walkAnimations["left"] = new Animation2(spritesheet, 0, 1536, 384, 512, 0.2, 7, true, false);

    this.attackAnimations = [];
    this.attackAnimations["down"] = new Animation2(spritesheet, 0, 16, 384, 512, 0.2, 7, true, false);
    this.attackAnimations["up"] = new Animation2(spritesheet, 0, 512, 384, 512, 0.2, 7, true, false);
    this.attackAnimations["right"] = new Animation2(spritesheet, 0, 1024, 384, 512, 0.2, 7, true, false);
    this.attackAnimations["left"] = new Animation2(spritesheet, 0, 1536, 384, 512, 0.2, 7, true, false);
    this.direction = "right";
    

    this.deathAnimations = [];
    this.deathAnimations["down"] = new Animation2(spritesheet, 288, 0, 384, 512, 0.1, 3, false, false);
    this.deathAnimations["up"] = new Animation2(spritesheet, 288, 64, 48, 64, 0.1, 3, false, false);
    this.deathAnimations["right"] = new Animation2(spritesheet, 288, 128, 48, 64, 0.1, 3, false, false);
    this.deathAnimations["left"] = new Animation2(spritesheet, 288, 192, 48, 64, 0.1, 3, false, true);
    
    this.health = 3000;
    this.healthBar = new HealthBar(game, this, 46, -10);
    Entity.call(this, game, x, y);
    this.dead = false;
    this.game = game;
    
    this.attacking = false;
    this.ctx = game.ctx;
    this.followPoint = {x: 0, y: 0};
    this.moveRestrictions = {left:false, right:false, up:false, down:false};
    this.velocity = { x: Math.random() * 1000, y: Math.random() * 1000 };
    this.maxSpeed = 100;
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
        width: 230,
        height: 230,
        offsetx:70,
        offsety:150
    }

    this.visualBox = {
        x:this.x, 
        y:this.y,
        width: 5000,
        height: 5000,
        offsetx:-2000,
        offsety:-2000
    }

    this.attackBox = {
        x:this.x, 
        y:this.y,
        width: 1300,
        height: 700,
        offsetx:-600,
        offsety:-30
    }
    this.dead = false;  
    this.acceleration = 100;

    
    var that = this;
    for (var index in this.attackAnimations) {   
        this.attackAnimations[index].setCallbackOnFrame(3, {}, () => {
            var x = that.x;
            var y = that.y;
            FinalRabbitAttack(x, y, that)
            /*
            switch(that.direction){
                case "up":
                    x += that.attackAnimations["up"].frameWidth/2;
                    y +=  that.attackAnimations["up"].frameHeight/2;
                    break;
                case "left":
                    y += that.attackAnimations["left"].frameHeight/2;
                    x += that.attackAnimations["left"].frameWidth/2;
                    break;
                case "right":
                    y += that.attackAnimations["right"].frameHeight/2;
                    x += that.attackAnimations["right"].frameWidth/2;
                    break;
                case "down":       
                    y += that.attackAnimations["down"].frameHeight/2;
                    x += that.attackAnimations["down"].frameWidth/2;
                    break;
            }
            addProjectile(that, x, y, "carrot", "Enemy", 20);*/
        });
    }
}

FinalRabbitDestination.prototype = new Entity();
FinalRabbitDestination.prototype.constructor = FinalRabbitDestination;

FinalRabbitDestination.prototype.update = function () { 
    this.moveRestrictions = {left:false, right:false, up:false, down:false};
    this.boundingBox.x = this.x + this.boundingBox.offsetx;
    this.boundingBox.y = this.y + this.boundingBox.offsety;

    this.visualBox.x = this.x + this.visualBox.offsetx;
    this.visualBox.y = this.y + this.visualBox.offsety;


    this.attackBox.x = this.x + this.attackBox.offsetx;
    this.attackBox.y = this.y + this.attackBox.offsety;

    if (this.health < 1) {
        console.log("D E D");
        this.dead = true;
    }

    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        if (ent instanceof Player && collide(ent, {boundingBox: this.visualBox })) {
            this.attacking = false;
            this.maxSpeed = 100;
            var dist = distance(this, ent);
            shiftDirection(this, ent);
            if (collide(ent, {boundingBox: this.attackBox})) {
                this.attacking = true;
                this.maxSpeed = 50;
                var difX = (ent.x - this.x)/dist;
                var difY = (ent.y - this.y)/dist;
                this.velocity.x += difX * acceleration  / (dist*dist);
                this.velocity.y += difY * acceleration  / (dist * dist);
                
                var speed = Math.sqrt(this.velocity.x*this.velocity.x + this.velocity.y*this.velocity.y);
                    if (speed > this.maxSpeed) {
                    var ratio = this.maxSpeed / speed;
                    this.velocity.x *= ratio;
                    this.velocity.y *= ratio;
                    }
            } else {
                var difX = (ent.x - this.x)/dist;
                var difY = (ent.y - this.y)/dist;
                this.velocity.x += difX * acceleration  / (dist*dist);
                this.velocity.y += difY * acceleration  / (dist * dist);
                var speed = Math.sqrt(this.velocity.x*this.velocity.x + this.velocity.y*this.velocity.y);
                    if (speed > this.maxSpeed) {
                    var ratio = this.maxSpeed / speed;
                    this.velocity.x *= ratio;
                    this.velocity.y *= ratio;
                } 
            }
    
            this.followPoint = ent;
            let time = this.game.clockTick;
           
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


FinalRabbitDestination.prototype.draw = function () { 
    if (this.attacking) {
        this.attackAnimations[this.direction].drawFrame(this.game.clockTick, this.ctx, this.x, this.y, 1);
    } else if (this.dead) {
        this.deathAnimations[this.direction].drawFrame(this.game.clockTick, this.ctx, this.x, this.y, 1, this);
    } else {
        this.walkAnimations[this.direction].drawFrame(this.game.clockTick, this.ctx, this.x, this.y, 1);
    }
   if (this.game.showOutlines) {
        this.ctx.strokeRect(this.boundingBox.x, this.boundingBox.y, this.boundingBox.width, this.boundingBox.height);
        this.ctx.strokeRect(this.visualBox.x, this.visualBox.y, this.visualBox.width, this.visualBox.height);
        this.ctx.strokeRect(this.attackBox.x, this.attackBox.y, this.attackBox.width, this.attackBox.height);
    }
    this.healthBar.draw();
    Entity.prototype.draw.call(this);
    
}


function FinalRabbitAttack(x, y, that) {

    var x2= x;
    var y2 = y;
    var x3 = x;
    var y3 = y;
    var x4= x;
    var y4 = y;
    var x5 = x;
    var y5 = y;
    var dir;
  switch(that.direction){
                case "up":
                    x += that.attackAnimations["up"].frameWidth/2;
                    y += that.attackAnimations["up"].frameHeight/2;
                
                    x2 += that.attackAnimations["up"].frameWidth/2 + 30;
                    y2 += that.attackAnimations["up"].frameHeight/2;

                    x3 += that.attackAnimations["up"].frameWidth/2 - 30;
                    y3 += that.attackAnimations["up"].frameHeight/2;

                    x4 += that.attackAnimations["up"].frameWidth/2 + 60;
                    y4 += that.attackAnimations["up"].frameHeight/2;
                    
                    x5 += that.attackAnimations["up"].frameWidth/2 - 60;
                    y5 += that.attackAnimations["up"].frameHeight/2;
                    dir = "up";
                    break;
                case "left":
                    x += that.attackAnimations["left"].frameWidth/2;
                    y += that.attackAnimations["left"].frameHeight/2;
                    
                    x2 += that.attackAnimations["left"].frameWidth/2;
                    y2 += that.attackAnimations["left"].frameHeight/2 + 40;

                    x3 += that.attackAnimations["left"].frameWidth/2;
                    y3 += that.attackAnimations["left"].frameHeight/2- 30;

                    x4 += that.attackAnimations["left"].frameWidth/2;        
                    y4 += that.attackAnimations["left"].frameHeight/2 + 60;

                    
                    x5 += that.attackAnimations["left"].frameWidth/2;
                    y5 += that.attackAnimations["left"].frameHeight/2 - 60;
                    dir = "left";
                    break;
                case "right":
                    y += that.attackAnimations["right"].frameHeight/2;
                    x += that.attackAnimations["right"].frameWidth/2;

                    x2 += that.attackAnimations["right"].frameWidth/2;
                    y2 += that.attackAnimations["right"].frameHeight/2 + 30;

                    x3 += that.attackAnimations["right"].frameWidth/2;
                    y3 += that.attackAnimations["right"].frameHeight/2- 30;

                    x4 += that.attackAnimations["right"].frameWidth/2;        
                    y4 += that.attackAnimations["right"].frameHeight/2 + 60;

                    
                    x5 += that.attackAnimations["right"].frameWidth/2;
                    y5 += that.attackAnimations["right"].frameHeight/2 - 60;
                    dir = "right";
                    break;
                case "down":
                
                    x += that.attackAnimations["down"].frameWidth/2;
                    y += that.attackAnimations["down"].frameHeight/2;
                   
                    x2 += that.attackAnimations["down"].frameWidth/2 + 30;
                    y2 += that.attackAnimations["down"].frameHeight/2;

                    x3 += that.attackAnimations["down"].frameWidth/2 - 30;
                    y3 += that.attackAnimations["down"].frameHeight/2;

                    x4 += that.attackAnimations["down"].frameWidth/2 + 60;
                    y4 += that.attackAnimations["down"].frameHeight/2;
                    
                    x5 += that.attackAnimations["down"].frameWidth/2 - 60;
                    y5 += that.attackAnimations["down"].frameHeight/2;
                    dir = "down";
                    break;
            }
            var yOffset = 0;
            if (dir === "left" || dir === "right") {
                 yOffset = 120;
            } 

            that.game.addProjectile( 
                new Projectile(that.game,
                {
                    img:that.game.assetManager.getAsset("./img/carrot.png"), 
                    width: 49,
                    height: 28
                }, 325, //speed
                {//start point
                    x:x, 
                    y:y
                }, 
                {//end Point
                    x:that.followPoint.center().x, 
                    y:that.followPoint.center().y , 
                }, 5, "Boss", 20));//lifetime  

              that.game.addProjectile( 
                new Projectile( that.game,
                {
                    img:that.game.assetManager.getAsset("./img/carrot.png"), 
                    width: 49,
                    height: 28
                }, 325, //speed
                {//start point
                    x:x2, 
                    y:y2
                }, 
                {//end Point
                    x:that.followPoint.center().x+120, 
                    y:that.followPoint.center().y+ yOffset 
                }, 5, "Boss", 20));//lifetime  

                that.game.addProjectile( 
                    new Projectile( that.game,
                    {
                        img:that.game.assetManager.getAsset("./img/carrot.png"), 
                        width: 49,
                        height: 28
                    }, 325, //speed
                    {//start point
                        x:x3, 
                        y:y3
                    }, 
                    {//end Point
                        x:that.followPoint.center().x - 120, 
                        y:that.followPoint.center().y- yOffset 
                    }, 5, "Boss", 20));//lifetime 
              
                    that.game.addProjectile( 
                        new Projectile( that.game,
                        {
                            img:that.game.assetManager.getAsset("./img/carrot.png"), 
                            width: 49,
                            height: 28
                        }, 325, //speed
                        {//start point
                            x:x4, 
                            y:y4
                        }, 
                        {//end Point
                            x:that.followPoint.center().x + 220, 
                            y:that.followPoint.center().y+ yOffset + 120
                        }, 5, "Boss", 20));//lifetime 

                    that.game.addProjectile( 
                        new Projectile( that.game,
                        {
                            img:that.game.assetManager.getAsset("./img/carrot.png"), 
                            width: 49,
                            height: 28
                        }, 325, //speed
                        {//start point
                            x:x5, 
                            y:y5
                        }, 
                        {//end Point
                            x:that.followPoint.center().x - 220, 
                            y:that.followPoint.center().y- yOffset - 120
                        }, 5, "Boss", 20));//lifetime 
                    

}

function fanningShotPoints(start, end){
    var slope = (end.y - start.y)/(end.x - start.x);
    if(isFinite(slope) && slope != 0){
        var normal = -slope; 
    }

}

function mage(game, x, y){
    //function Animation(spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale)
    // this.walkAnimation = new Animation(AM.getAsset("./img/mageWalk-export.png"), 64, 64, 8, .12, 32, true, 1);
    this.attackAnimation = new Animation(AM.getAsset("./img/mageAttack-export.png"), 192, 192, 7, .12, 28, true, 1);
    this.deathAnimation = new Animation(AM.getAsset("./img/mageDying-export.png"), 192, 192, 6, .12, 6, false, 1);
    this.walkAnimation = new Animation(AM.getAsset("./img/mageWalk-export.png"), 192, 192, 8, .12, 32, true, 1);
    this.walkAnimation.rowMode();
    this.attackAnimation.rowMode();

    var that = this;
    this.deathAnimation.setCallbackOnFrame(6, [], function(){
        that.removeFromWorld = true;
    });

    this.attackAnimation.setCallbackOnFrame(6, [], function() {
        var x = that.x + 96;
        var y = that.y + 96;
        that.game.addProjectile( 
            new Projectile(that.game,
            {
                img:that.game.assetManager.getAsset("./img/big_modball.png"), 
                width: 175,
                height: 175
            }, 225, //speed
            {//start point
                x:x-96, 
                y:y-96
            }, 
            {//end Point
                x:that.followPoint.center().x, 
                y:that.followPoint.center().y , 
            }, 5, "Boss", 20));//lifetime  
    });


    this.movedir = 2;
    this.health = 2000;
    this.healthBar = new HealthBar(game, this, 66, -10);
    Entity.call(this, game, x, y);
    this.dead = false;
    this.game = game;
    this.levelBoxes = game.getBackground().boundingBoxes;
    this.attacking = false;
    this.ctx = game.ctx;
    this.followPoint = {x: 0, y: 0};
    this.moveRestrictions = {left:false, right:false, up:false, down:false};
    this.velocity = { x: Math.random() * 1000, y: Math.random() * 1000 };
    this.maxSpeed = 150;
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
        width: 96,
        height: 152,
        offsetx:48,
        offsety:30
    }

    this.visualBox = {
        x:this.x, 
        y:this.y,
        width: 2800,
        height: 1600,
        offsetx:-1400,
        offsety:-800
    }

    this.attackBox = {
        x:this.x + 96, 
        y:this.y + 96,
        width: 1400,
        height: 796,
        offsetx:-560,
        offsety:-250
    }
    this.dead = false;  
    this.removeFromWorld = false;
    this.acceleration = 100;
}

mage.prototype = new Entity();
mage.prototype.constructor = mage;

mage.prototype.update = function () {
    this.moveRestrictions = {left:false, right:false, up:false, down:false};
    this.boundingBox.x = this.x + this.boundingBox.offsetx;
    this.boundingBox.y = this.y + this.boundingBox.offsety;

    this.visualBox.x = this.x + this.visualBox.offsetx;
    this.visualBox.y = this.y + this.visualBox.offsety;


    this.attackBox.x = this.x + this.attackBox.offsetx;
    this.attackBox.y = this.y + this.attackBox.offsety;

    if(this.health <= 0) {
        this.dead = true;
    }
    var centerx = this.x + 96;
    var centery= this.y + 96;
    var px = this.game.player.x;
    var py = this.game.player.y;
    var xdiff = Math.abs(px - centerx);
    var ydiff = Math.abs(py - centery);
    var ent = this.game.player;
    if (collide(ent, {boundingBox: this.visualBox }) ) {
        this.attacking = false;
        this.maxSpeed = 100;
        var dist = distance(this, ent);
        if (collide(ent, {boundingBox: this.attackBox})) {
            this.attacking = true;
        }
        var difX = (ent.x - this.x)/dist;
        var difY = (ent.y - this.y)/dist;
        this.velocity.x += difX * acceleration  / (dist*dist);
        this.velocity.y += difY * acceleration  / (dist * dist);
        var speed = Math.sqrt(this.velocity.x*this.velocity.x + this.velocity.y*this.velocity.y);
        if (speed > this.maxSpeed) {
            var ratio = this.maxSpeed / speed;
            this.velocity.x *= ratio;
            this.velocity.y *= ratio;
        }

        this.followPoint = ent;
        let time = this.game.clockTick;
        if(!this.attacking){
            if((!this.moveRestrictions.left && this.velocity.x<0) || (!this.moveRestrictions.right && this.velocity.x>0)){
                this.x += time * this.velocity.x;
            }
            if((!this.moveRestrictions.up && this.velocity.y<0) || (!this.moveRestrictions.down && this.velocity.y>0)){
                this.y += time * this.velocity.y;
            }
        }
    }
    
    if(centery > py){
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
    
    this.healthBar.update();
    Entity.prototype.update.call(this);
}

mage.prototype.draw = function () {

    if(this.attacking & !this.dead) {
        this.attackAnimation.drawFrameFromRow(this.game.clockTick, this.ctx, this.x, this.y, this.movedir)
    } else if(this.dead){
        this.deathAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    } else {
        this.walkAnimation.drawFrameFromRow(this.game.clockTick, this.ctx, this.x, this.y, this.movedir);
    }

    
    if (this.game.showOutlines) {
        this.ctx.strokeRect(this.boundingBox.x, this.boundingBox.y, this.boundingBox.width, this.boundingBox.height);
        this.ctx.strokeRect(this.visualBox.x, this.visualBox.y, this.visualBox.width, this.visualBox.height);
        this.ctx.strokeRect(this.attackBox.x, this.attackBox.y, this.attackBox.width, this.attackBox.height);
    }
    this.healthBar.draw();

    
}