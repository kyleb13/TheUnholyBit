window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (/* function */ callback, /* DOMElement */ element) {
                window.setTimeout(callback, 1000 / 60);
            };
})();

var pointerLocked = false;
var timeSlowed = false;
var audio = new Audio('./villageMusic.mp3');
audio.volume = 0.10; // 75%
audio.loop = true;


//function canvasLoaded(){

//}


function GameEngine() {
    this.entities = [];
    this.projectiles = [];
    this.ctx = null;
    this.surfaceWidth = null;
    this.surfaceHeight = null;
    this.w = false;
    this.a = false;
    this.s = false;
    this.d = false;
    this.p = false;
    this.mute = false;
    this.lclick = false;
    this.pclick = false;
    this.change = false;
    this.pointerx = 50;
    this.pointery = 50;
    this.pointerLocked = false;
    this.showOutlines = true;
    this.showOutlines = false;
    this.muteBackgroundMusic = false;
    this.camera = null;
    this.player = null;
}

GameEngine.prototype.init = function (ctx) {
    this.ctx = ctx;
    this.surfaceWidth = this.ctx.canvas.width;
    this.surfaceHeight = this.ctx.canvas.height;
    this.rect = this.ctx.canvas.getBoundingClientRect();
    this.timer = new Timer();
    this.startInput();
    console.log('game initialized');
}

GameEngine.prototype.start = function (player, camera) {
    this.player = player;
    this.camera = camera;
    var that = this;
    var canvas = this.ctx.canvas;
    var mousePositionUpdate = function(e) {
        if(that.pointerLocked){
            var dx = e.movementX;
            var dy = e.movementY;
            if(that.pointerx + dx>that.player.x - canvas.width/2 && that.pointerx + dx<that.player.x + canvas.width/2){
                that.pointerx += dx;
            }
            if(that.pointery + dy>that.player.y - canvas.height/2 && that.pointery + dy<that.player.y + canvas.height/2){
                that.pointery += dy;
            }
        }
        
    }
    document.addEventListener('pointerlockchange', () => {
        if(document.pointerLockElement === canvas){
            document.addEventListener("mousemove", mousePositionUpdate);
            that.pointerLocked = true;
            pointerLocked = true;
            if (audio.play && !this.mute) audio.play();

        } else {
            document.removeEventListener("mousemove", mousePositionUpdate);
            that.pointerLocked = false;
            pointerLocked = false;
            that.w = false;
            that.a = false;
            that.s = false;
            that.d = false;
            that.lclick = false;
            audio.pause();
        }
    });
/*
    document.getElementById("myBtn").addEventListener("click", function(){
        this.style.backgroundColor = "red";
      });
      */
      console.log("starting game");
    (function gameLoop() {
        that.loop();
        requestAnimFrame(gameLoop, that.ctx.canvas);
    })();
}

GameEngine.prototype.getBackground = function(){
    for(var i = 0; i<this.entities.length; i++){
        var ent = this.entities[i];
        if(ent instanceof Background) return ent;
    }
}

GameEngine.prototype.startInput = function () {
    console.log('Starting input');
    var that = this;
    var getXandY = function(evt) {
        return {
            x: (evt.clientX - that.rect.left) / (that.rect.right - that.rect.left)* that.ctx.canvas.width,
            y: (evt.clientY - that.rect.top) / (that.rect.bottom - that.rect.top) * that.ctx.canvas.height
        };
    }

    this.ctx.canvas.addEventListener("mousedown", (e) => {
        that.lclick = true;
    });

    this.ctx.canvas.addEventListener("mouseup", (e) => {
        that.lclick = false;
    });

    this.ctx.canvas.addEventListener("keydown", (e) => {
        that.handleInputs(e.code, true);
        if(e.code === "KeyM"){
            this.mute = !this.mute;
            if(this.mute){
                audio.pause();
            } else {
                audio.play();
            }
        }
        if(e.code === "KeyN") {
            sceneManager.loadNextLevel();
        } 
    });
    this.ctx.canvas.addEventListener("keyup", (e) => {
        that.handleInputs(e.code, false);
    });
    // this.ctx.canvas.addEventListener("keypress", (e) => {
        
    // });

}

GameEngine.prototype.handleInputs = function(keycode, value){
    switch(keycode){
        case "KeyW":
            this.w = value;
            break;
        case "KeyA":
            this.a = value;
            break;
        case "KeyS":
            this.s = value;
            break;
        case "KeyD":
            this.d = value;
            break;   
        case "KeyP":
            this.p = value;
            break;   
            
    }   
}

GameEngine.prototype.addEntity = function (entity) {
    console.log('added entity');
    this.entities.push(entity);
}
GameEngine.prototype.addProjectile = function (entity) {
    console.log('added projectile');
    this.projectiles.push(entity);
}

GameEngine.prototype.draw = function () {
    this.ctx.clearRect(0, 0, this.surfaceWidth, this.surfaceHeight);
    this.ctx.save();
    this.camera.draw();
    for (var i = 0; i < this.entities.length; i++) {
        if(!this.entities[i].removeFromWorld){
            this.entities[i].draw(this.ctx);
        }
    }
    for (var i = 0; i < this.projectiles.length; i++) {
        if(!this.projectiles[i].removeFromWorld){
            this.projectiles[i].draw(this.ctx);
        }
    }
    if(timeSlowed) {
        this.ctx.globalAlpha = .2;
        this.ctx.drawImage(AM.getAsset("./img/blue.png"), this.player.x-700, this.player.y-350);
        this.ctx.globalAlpha = 1;
    }
    if(this.crosshair) this.crosshair.draw();
    this.ctx.restore();
}

GameEngine.prototype.update = function () {
    this.camera.update();
    for (var i = 0; i < this.entities.length; i++) {
        var entity = this.entities[i];
        if(!entity.removeFromWorld){
            entity.update();
        }
    }
    for (var i = 0; i < this.projectiles.length; i++) {
        var entity = this.projectiles[i];
        if(!entity.removeFromWorld){
            entity.update();
        }
    }
}

GameEngine.prototype.loop = function () {
    this.clockTick = this.timer.tick();
    this.update();
    this.draw();
}

function Timer() {
    this.gameTime = 0;
    this.maxStep = 0.05;
    this.wallLastTimestamp = 0;
    this.slowTimer = 0;
}

Timer.prototype.tick = function () {
    if(pointerLocked){
        var wallCurrent = Date.now();
        var wallDelta = (wallCurrent - this.wallLastTimestamp) / 1000;
        this.wallLastTimestamp = wallCurrent;

        var gameDelta = Math.min(wallDelta, this.maxStep);
        this.gameTime += gameDelta;
        if(timeSlowed){
            this.slowTimer += gameDelta;
            if(this.slowTimer>=12) {
                timeSlowed = false;
                this.slowTimer = 0;
            }
            return gameDelta/2;
        } else {
            return gameDelta;
        }
        
    } else {
        return 0;
    }
}

function Entity(game, x, y) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.removeFromWorld = false;
}

Entity.prototype.update = function () {
}

Entity.prototype.draw = function (ctx) {
    if (this.game.showOutlines && this.radius) {
        this.game.ctx.beginPath();
        this.game.ctx.strokeStyle = "green";
       // this.game.ctx.arc(this.centerx, this.centery, this.radius.r, 0, Math.PI * 2, false);
        
        this.game.ctx.arc(this.x+this.radius.offsetx, this.y+this.radius.offsety, this.radius.r, 0, Math.PI * 2, false);
        this.game.ctx.stroke();
        this.game.ctx.closePath();
    }
}

Entity.prototype.rotateAndCache = function (image, angle) {
    var offscreenCanvas = document.createElement('canvas');
    var size = Math.max(image.width, image.height);
    offscreenCanvas.width = size;
    offscreenCanvas.height = size;
    var offscreenCtx = offscreenCanvas.getContext('2d');
    offscreenCtx.save();
    offscreenCtx.translate(size / 2, size / 2);
    offscreenCtx.rotate(-angle);
    offscreenCtx.translate(0, 0);
    if (!image.hasOwnProperty("img")) {
        var r = getRotatedRect(image);
        offscreenCtx.strokeRect(r.x, r.y, r.w, r.h);
    } else {
        offscreenCtx.drawImage(image.img, -(image.width / 2), -(image.height / 2));
    }
    offscreenCtx.restore();
    return {img:offscreenCanvas, center:{x:size/2, y:size/2}};
    //return offscreenCanvas;
}

function getRotatedRect(boundingBox) {
    return {
      x: boundingBox.width / -2,
      y: boundingBox.height / -2,
      w: boundingBox.width,
      h: boundingBox.height
    };
}