var AM = new AssetManager();

var ArrowType = {x:0, y:1025, w:64, h:64, d:0.09, f:13, l:true, r:false};
var MagicType = {x:0, y:0, w:64, h:64, d:0.09, f:7, l:true, r:false};

function Animation(spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {
    this.spriteSheet = spriteSheet;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.sheetWidth = sheetWidth;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.scale = scale;
    this.active = false;
    this.callbackEnabled = false;
    this.callbackFrame = -1;
    this.callback = null;
    this.callbackArgs = null;
    this.callbackDone = false;
}

Animation.prototype.setCallbackOnFrame = function(frame,args,callback){
    this.callbackEnabled = true;
    this.callbackFrame = frame;
    this.callback = callback;
    this.callbackArgs = args;
}

Animation.prototype.rowMode = function(){
    this.totalTime = this.frameDuration * this.sheetWidth;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y) {
    this.active = true;
    this.elapsedTime += tick;
    var frame = this.currentFrame();
    if(this.callbackEnabled && frame === this.callbackFrame && !this.callbackDone){
        this.callbackDone = true;
        this.callback(this.callbackArgs);
    }
    if (this.isDone()) {
        if (this.loop){
            this.elapsedTime = 0;
            this.callbackDone = false;
            this.elapsedTime = 0;
        } else {
            this.active = false;
        }
        
    }
    
    var xindex = 0;
    var yindex = 0;
    xindex = frame % this.sheetWidth;
    yindex = Math.floor(frame / this.sheetWidth);

    ctx.drawImage(this.spriteSheet,
                 xindex * this.frameWidth, yindex * this.frameHeight,  // source from sheet
                 this.frameWidth, this.frameHeight,
                 x, y,
                 this.frameWidth * this.scale,
                 this.frameHeight * this.scale);
}

//draw frames from specified row
Animation.prototype.drawFrameFromRow = function (tick, ctx, x, y, row) {
    this.active = true;
    this.elapsedTime += tick;
    var frame = this.currentFrameFixedRow();
    if(this.callbackEnabled && frame === this.callbackFrame && !this.callbackDone){
        this.callbackDone = true;
        this.callback(this.callbackArgs);
    }
    if (this.isDone()) {
        if (this.loop){
            this.callbackDone = false;
            this.elapsedTime = 0;
        } else {
            this.active = false;
        }
        
    }
    // var imgheight =  (this.frames/this.sheetWidth)*this.frameHeight;
    var yidx = this.frameHeight*row;
    ctx.drawImage(this.spriteSheet,
                frame * this.frameWidth, yidx,  // source from sheet
                this.frameWidth, this.frameHeight,
                x, y,
                this.frameWidth * this.scale,
                this.frameHeight * this.scale);
}


Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

//take sprites from one particular row
Animation.prototype.currentFrameFixedRow = function () {
    return Math.floor(this.elapsedTime / this.frameDuration)%this.sheetWidth;
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

function Background(game, spritesheet) {
    
    this.x = 0;
    this.y = 0;
    this.spritesheet = spritesheet;
    this.game = game;
    this.ctx = game.ctx;
    //console.log(loadVillageData());
    console.log("making background");
    var data = loadVillageData();
    this.boundingBoxes = data.boundingBoxes;
    // for(var i = 0; i<data.enemySpawns.length; i++){
    //     var location = data.enemySpawns[i];
    //     var enemyPercentage = Math.random(); 
    //     if (enemyPercentage >= 0.0 && enemyPercentage <= 0.3) {
    //         game.addEntity(new RangeEnemy(game, AM.getAsset("./img/normalArcher.png"), location.x, location.y, ArrowType, "arrow"));
    //     } else if(enemyPercentage > 0.3 && enemyPercentage <= 6.0) {
    //         game.addEntity(new RangeEnemy(game, AM.getAsset("./img/MageGirl.png"), location.x, location.y, MagicType, "magic"));
    //     } else if (enemyPercentage > 6.0 && enemyPercentage <=0.9) { 
    //         game.addEntity(new Bunny(game, AM.getAsset("./img/bunbun.png"), location.x, location.y)); 
    //     } else {
    //         game.addEntity(new RangeEnemy(game, AM.getAsset("./img/normalArcher.png"), location.x, location.y, ArrowType, "arrow"));
    //     }
    // }
    // data.enemySpawns.forEach((location) => {

        
    // });
    this.ctx = game.ctx;
};

Background.prototype.draw = function () {
    this.ctx.drawImage(this.spritesheet,
                   this.x, this.y);
    var that = this;
    this.ctx.font = "24px Arial";
    this.ctx.fillStyle = "black";
    this.ctx.fillText(`Shoot: Left Click, M = mute sounds`, 1000, 924);
    this.ctx.fillText(`Control: W = up, S = down, D = right, A = left`, 1000, 900);
    if(this.game.showOutlines) {
        this.boundingBoxes.forEach((box) => {
            that.ctx.moveTo(box.p1.x, box.p1.y);
            that.ctx.lineTo(box.p2.x, box.p2.y);
            that.ctx.lineTo(box.p3.x, box.p3.y);
            that.ctx.lineTo(box.p4.x, box.p4.y);
            that.ctx.lineTo(box.p1.x, box.p1.y);
            that.ctx.stroke();
            that.ctx.fillText(`${box.n}(1)`, box.p1.x-5, box.p1.y-5);
            that.ctx.fillText(`${box.n}(2)`, box.p2.x-5, box.p2.y-5);
            that.ctx.fillText(`${box.n}(3)`, box.p3.x+5, box.p3.y+5);
            that.ctx.fillText(`${box.n}(4)`, box.p4.x+5, box.p4.y+5);
        });
    }
};

Background.prototype.update = function () {
};

function Camera(game, obj, background, width, height){
    this.game = game;
    this.ctx = game.ctx;
    //var center = obj.center();
    this.obj = obj;
    this.background = background;
    this.worldWidth=width;
    this.worldHeight=height;
    this.frameWidth = this.ctx.canvas.width;
    this.frameHeight = this.ctx.canvas.height;
    this.x =  0;
    this.y = 0;
    // console.log(`width ${this.frameWidth}, height ${this.frameHeight}`);
}

Camera.prototype.update = function(){
    // this.x = this.obj.x - this.frameWidth/2;
    // this.y = this.obj.y - this.frameHeight/2;
}

Camera.prototype.draw = function() {
    this.ctx.setTransform(1,0,0,1,0,0);
    var camX = -this.obj.x + this.ctx.canvas.width/2;
    var camY = -this.obj.y + this.ctx.canvas.height/2
    this.ctx.translate( camX, camY );	
}



AM.queueDownload("./img/crosshair-export.png");
AM.queueDownload("./img/villagemap.png");
AM.queueDownload("./img/charwalk.png");
AM.queueDownload("./img/charstand.png");
AM.queueDownload("./img/charshoot_loop.png");
AM.queueDownload("./img/character_edited.png");
AM.queueDownload("./img/arrow.png");
AM.queueDownload("./img/arrowPile.png");
AM.queueDownload("./img/heart.png");

AM.queueDownload("./img/bunbun.png");
AM.queueDownload("./img/napper.png");
AM.queueDownload("./img/yap.png");
AM.queueDownload("./img/arrowSkel.png");
AM.queueDownload("./img/magicSkel.png");
AM.queueDownload("./img/fireball.png");

AM.queueDownload("./img/HoodedRanger.png");
AM.queueDownload("./img/MageGirl.png");

AM.queueDownload("./img/KnightArcher.png");
AM.queueDownload("./img/KnightMage.png");
AM.queueDownload("./img/movement.png");
AM.queueDownload("./img/shadowLeft.png");
AM.queueDownload("./img/shadowRight.png");
AM.queueDownload("./img/modball.png");
AM.queueDownload("./img/normalArcher.png");
AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    
    var ctx = canvas.getContext("2d");
    canvas.onclick = function() {
        canvas.requestPointerLock();
    };
    var gameEngine = new GameEngine();
    gameEngine.assetManager = AM;
    
    gameEngine.init(ctx);

    var player = new Player(gameEngine, AM.getAsset("./img/charwalk.png"), AM.getAsset("./img/charshoot_loop.png"), AM.getAsset("./img/charstand.png"), AM.getAsset("./img/character_edited.png"));
    var camera = new Camera(gameEngine, player, AM.getAsset("./img/villagemap.png"), 6400, 6400);
   // var powerup = new Powerup (gameEngine, 400, 900,  AM.getAsset("./img/arrowPile.png"))
   // gameEngine.addEntity(powerup);
    gameEngine.start(player, camera);
    gameEngine.crosshair = new Crosshair(gameEngine, AM.getAsset("./img/crosshair-export.png"));
    gameEngine.addEntity(new Background(gameEngine, AM.getAsset("./img/villagemap.png")));
    gameEngine.addEntity(player);
    // gameEngine.addEntity(new Bunny(gameEngine, AM.getAsset("./img/bunbun.png"))); 
    //gameEngine.addEntity(new RangeEnemy(gameEngine, AM.getAsset("./img/normalArcher.png"), 1000, 950, ArrowType, "arrow"));
  // gameEngine.addEntity(new RangeEnemy(gameEngine, AM.getAsset("./img/magicSkel.png"), 1100, 950, MagicType, "magic"));
  /*  gameEngine.addEntity(new RangeEnemy(gameEngine, AM.getAsset("./img/HoodedRanger.png"), 200, 600, ArrowType, "arrow"));
    gameEngine.addEntity(new RangeEnemy(gameEngine, AM.getAsset("./img/MageGirl.png"), 100, 600, MagicType, "magic"));
    gameEngine.addEntity(new RangeEnemy(gameEngine, AM.getAsset("./img/KnightArcher.png"), 600, 600, ArrowType, "arrow"));
    gameEngine.addEntity(new RangeEnemy(gameEngine, AM.getAsset("./img/KnightMage.png"), 500, 600, MagicType, "magic"));
    */
    // gameEngine.addEntity(new Crosshair(gameEngine, AM.getAsset("./img/crosshair-export.png")));
    var data = loadVillageData();
    for(var i = 0; i<data.enemySpawns.length; i++){
        var location = data.enemySpawns[i];
        var enemyPercentage = Math.random(); 
        if (enemyPercentage >= 0.0 && enemyPercentage <= 0.45) {
            gameEngine.addEntity(new RangeEnemy(gameEngine, AM.getAsset("./img/normalArcher.png"), location.x, location.y, ArrowType, "arrow"));
        } else if(enemyPercentage > 0.45 && enemyPercentage <= 0.85) {
            gameEngine.addEntity(new RangeEnemy(gameEngine, AM.getAsset("./img/MageGirl.png"), location.x, location.y, MagicType, "magic"));
        } else if (enemyPercentage > 0.85 && enemyPercentage <= 1) { 
            gameEngine.addEntity(new Bunny(gameEngine, AM.getAsset("./img/bunbun.png"), location.x, location.y)); 
            gameEngine.addEntity(new Bunny(gameEngine, AM.getAsset("./img/bunbun.png"), location.x+35, location.y)); 
            gameEngine.addEntity(new Bunny(gameEngine, AM.getAsset("./img/bunbun.png"), location.x+70, location.y)); 
        } else {
            gameEngine.addEntity(new RangeEnemy(gameEngine, AM.getAsset("./img/normalArcher.png"), location.x, location.y, ArrowType, "arrow"));
        }
    }
    console.log("NEW!!!!!!!!!!!!1");
    for (var i = 0; i<data.powerUpSpawns.length; i ++) {
        var location = data.powerUpSpawns[i];
        if ( i < 3) {
            gameEngine.addEntity(new Powerup(gameEngine, location.x, location.y, "ammo"));
        } else {
            gameEngine.addEntity(new Powerup(gameEngine, location.x, location.y, "HP"));
        }
    }
	gameEngine.addEntity(new shadowBoss(gameEngine,AM.getAsset("./img/movement.png"), AM.getAsset("./img/shadowLeft.png"),AM.getAsset("./img/shadowRight.png")));
	    console.log("All Done!");
});