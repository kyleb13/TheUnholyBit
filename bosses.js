

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



function shiftDirection(ent1, ent2) {
    var enemyX = ent2.x;
    var centerx = ent1.x;
    var xdiff = centerx-enemyX;

    if(xdiff>0){
        ent1.direction = "right";
    } else {
        ent1.direction = "left"; 
    }
    //console.log(`xdiff:${xdiff}, dir:${ent1.direction}`);
    // //update direction character is pointing
    // if(enemyY< centery){
    //     if(centerx > enemyX && xdiff>ydiff){
    //         ent1.direction = "left";
    //     } else{
    //         ent1.direction = "right";
    //     }
    // } else {
    //     if(centerx > enemyX && xdiff>ydiff){
    //         ent1.direction = "left";
    //     }  else{
    //         ent1.direction = "right";
    //     }
    // }
}


function shadowBoss(game,movementsheet,attackLsheet,attackRsheet) {
    this.animation = new Animation(movementsheet,82,75,17,.09,17,true,2);
    //this.RAanimation =  new Animation(attackRsheet,82,75,31,.1,31,true,2);
    //this.LAanimation = new Animation(attackLsheet,82,75,31,.1,31,true,2);
    this.attackAnimations = [];
    this.attackAnimations["left"] = new Animation(attackLsheet,82,75,31,.1,31,true,2);
    this.attackAnimations["right"] = new Animation(attackRsheet,82,75,31,.1,31,true,2);
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
    this.lastY = this.y;

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
                }, 5, "Boss", 25));//lifetime   
        });
    }
    
}

shadowBoss.prototype = new Entity();
shadowBoss.prototype.constructor = shadowBoss;

shadowBoss.prototype.center = function() {
    var centerx = this.x + this.animation.frameWidth/2;
    var centery= this.y + this.animation.frameHeight/2;
    return {x:centerx, y:centery};
}


shadowBoss.prototype.update = function () {
    Entity.prototype.update.call(this);
    
    this.boundingBox.x = this.x + this.boundingBox.offsetx;
    this.boundingBox.y = this.y + this.boundingBox.offsety;

    this.visualBox.x = this.x + this.visualBox.offsetx;
    this.visualBox.y = this.y + this.visualBox.offsety;

    this.attackBox.x = this.x + this.attackBox.offsetx;
    this.attackBox.y = this.y + this.attackBox.offsety;

    var ent = this.game.player;
    if (collide({boundingBox: this.visualBox}, ent)) {
        this.following = true;
        var dist = distance(this, ent);
        this.followPoint = ent;
        if (collide(ent, {boundingBox: this.attackBox})) {
        //if(dist <= this.attackVision){
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
/*
    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        if (ent instanceof Player) {
            /*
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
                //if (collide(ent, {boundingBox: this.attackBox})) {
                if(dist <= this.attackVision){
                    this.attack = true;
                    this.following =false;
                    /*if(this.x > ent.x){
                        this.attackR = true;
                    }
                    if(this.x < ent.x){
                        this.attackL = true;
                    }
                    
                } else {
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
            } else if (!collide({boundingBox: this.visualBox}, ent)) {
                this.following = false;
            } 
    
        } 
        
       
    }*/
}

shadowBoss.prototype.draw = function () {
    
/*
    if(this.attackR) {
        this.RAanimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
            
    }else if(this.attackL) {
        this.LAanimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);

    }else {
        this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    }*/

    if(this.following){
        this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    }
    else if(this.attack){
        this.attackAnimations[this.direction].drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
       
    }
    this.ctx.strokeStyle = "red";
    this.ctx.strokeRect(this.boundingBox.x, this.boundingBox.y, this.boundingBox.width, this.boundingBox.height);
    this.ctx.strokeStyle = "black";
    this.ctx.strokeRect(this.attackBox.x, this.attackBox.y, this.attackBox.width, this.attackBox.height);
    this.ctx.strokeStyle = "blue";
    this.ctx.strokeRect(this.visualBox.x, this.visualBox.y, this.visualBox.width, this.visualBox.height)
    Entity.prototype.draw.call(this);
}

function addProjectile(that, x, y, shooter) {  
    var img;
    var height;
    var width;
    var center = that.followPoint.center();
    
    img = that.game.assetManager.getAsset("./img/modball.png")
    width = 26;
    height = 17;
    y = y + 20;
    
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
    }, 5, shooter));//lifetime
}



var friction = 1;
var acceleration = 1000000;
var maxSpeed = 100;


function projectile(image,x,y){


}

/////////////////////////////////////////////////////////////////
/*
shadowBoss.prototype.update = function () {
    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        if (ent != this && ent instanceof Player) {
            if (this instanceof shadowBoss) {
                dis = distance(this,ent);
                if (ent != this && dis <= this.attackVision ) {
                    this.attack = true;
                    this.location = false;
                } else {
                    this.location = true;
                    this.attack = false;
                    this.x += this.game.clockTick * this.speed;
                    this.y += this.game.clockTick * this.speed;
                    if(this.x > this.endPoint.x){
                        this.x = this.startPoint.x + Math.floor(Math.random() * 100);
                    }
                    if(this.y > this.endPoint.y){
                        this.y = this.startPoint.y + Math.floor(Math.random() * 100);
                    }
                }
            } 
        }
    }
    
    
    console.log("the x value",this.x);
    console.log("the y value",this.y);

    Entity.prototype.update.call(this);
}*/

/////////////////////////////////////////////////////////////////////////////////////
/*
shadowBoss.prototype.update = function () {

    this.boundingBox.x = this.x + this.boundingBox.offsetx;
    this.boundingBox.y = this.y + this.boundingBox.offsety;

    this.visualBox.x = this.x + this.visualBox.offsetx;
    this.visualBox.y = this.y + this.visualBox.offsety;

    this.attackBox.x = this.x + this.attackBox.offsetx;
    this.attackBox.y = this.y + this.attackBox.offsety;
    
    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        if (ent instanceof Player) {
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
                    if(this.x > ent.x){
                        this.attackR = true;
                    }else if(this.x < ent.x){
                        this.attackL = true;
                    }else if((this. x === ent.x && this.y > this.y)  || (this.x === ent.x && this.y < ent.y)){}
                    
                } else {
                    this.attackL = false;
                    this.attackR = false;
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
    
        } 
        







        var ent = this.game.entities[i];
        if (ent != this && ent instanceof Player) {
            if (this instanceof shadowBoss) {
                dis = distance(this,ent);
                    
                         
                } else {
                    this.location = true;
                    console.log("the x value",this.x);
                    console.log("the y value",this.y);
                    this.x += this.game.clockTick * this.velocity.x;
                    this.y += this.game.clockTick * this.velocity.y;
                    if(this.x > this.endPoint.x){
                        
                        this.x = ent.x -  300;
                    }
                    if(this.y > this.endPoint.y){
                        this.y = ent.y - 300;
                    }
                }
            } 
        }
    }

   
    console.log("the velocity x value",this.velocity.x);
    console.log("the velocity x value",this.velocity.y);

    console.log("player x value",ent.x);
    console.log("player y value",ent.y);
   // console.log("player velocity x value",ent.velocity.x);
   // console.log("player velocity y value",ent.velocity.y);


    Entity.prototype.update.call(this);
}-*/