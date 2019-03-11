var AM = new AssetManager();

var ArrowType = {x:0, y:1025, w:64, h:64, d:0.09, f:13, l:true, r:false};
var MagicType = {x:0, y:0, w:64, h:64, d:0.17, f:7, l:true, r:false};

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

function Background(game, spritesheet, data) {
    
    this.x = 0;
    this.y = 0;
    this.spritesheet = spritesheet;
    this.game = game;
    this.ctx = game.ctx;
    this.boundingBoxes = data.boundingBoxes;
    this.nextLevelBox = data.nextLevelBox

    this.ctx = game.ctx;
};

Background.prototype.draw = function () {
    this.ctx.drawImage(this.spritesheet,
                   this.x, this.y);
    var that = this;

    if (this.spritesheet === AM.getAsset("./img/villagemap.png")) {
        this.ctx.font = "24px Arial";
        this.ctx.fillStyle = "black";
        this.ctx.fillText(`Shoot: Left Click, M = mute sounds`, 1000, 924);
        this.ctx.fillText(`Control: W = up, S = down, D = right, A = left`, 1000, 900);
    }
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
    }/* if (this.game.showOutlines) {
            that.ctx.moveTo(this.nextLevelBox.p1.x, this.nextLevelBox.p1.y);
            that.ctx.lineTo(this.nextLevelBox.p2.x, this.nextLevelBox.p2.y);
            that.ctx.lineTo(this.nextLevelBox.p3.x, this.nextLevelBox.p3.y);
            that.ctx.lineTo(this.nextLevelBox.p4.x, this.nextLevelBox.p4.y);
            that.ctx.lineTo(this.nextLevelBox.p1.x, this.nextLevelBox.p1.y);
            that.ctx.stroke();
    }*/
};

Background.prototype.update = function () {
};

function Camera(game, obj, width, height){
    this.game = game;
    this.ctx = game.ctx;
    //var center = obj.center();
    this.obj = obj;
    this.worldWidth=width;
    this.worldHeight=height;
    this.frameWidth = this.ctx.canvas.width;
    this.frameHeight = this.ctx.canvas.height;
    this.removeFromWorld = false;
    this.x =  obj.x;
    this.y = obj.y;
    // console.log(`width ${this.frameWidth}, height ${this.frameHeight}`);
}

Camera.prototype.update = function(){
    // this.x = this.obj.x - this.frameWidth/2;
    // this.y = this.obj.y - this.frameHeight/2;
}

Camera.prototype.draw = function() {
    this.ctx.setTransform(1,0,0,1,0,0);
    var camX = -this.obj.x + this.ctx.canvas.width/2;
    var camY = -this.obj.y + this.ctx.canvas.height/2;
    this.ctx.translate( camX, camY );	
}

var sceneManager;
  

function oncanvasload(){
    sceneManager = new SceneManager();
    sceneManager.loadVillageMap();
}
