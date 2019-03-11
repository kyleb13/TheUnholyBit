var bossDead = false;
var assets = [
    "crosshair-export.png", "explosion.png",        "villagemap.png",       "charwalk.png",
    "char_power.png",       "charstand.png",        "charshoot_loop.png",   "character_edited.png",
    "arrow.png",            "charwalk.png",         "crosshair-export.png", "enemyArrow.png",
    "arrowPile.png",        "stoneDirection.png",   "heart.png",            "villagemap.png",
    "HoodedRanger.png",     "trapdoor.png",         "bunbun.png",           "fireball.png",
    "MageGirl.png",         "movement.png",         "shadowLeft.png",       "shadowRight.png",
    "modball.png",          "normalArcher.png",     "cavemap.png",          "hourglass.png",
    "magicSkel.png",        "arrowSkel.png",        "finalBossMap.png",     "carrot.png",
    "bossBun-export.png",   "castlemap.png",        "KnightArcher.png",     "KnightMage.png",
    "blue.png"
];
function SceneManager(){

    var canvas = document.getElementById("gameWorld");
    this.ctx = canvas.getContext("2d");
    canvas.onclick = function() {
        canvas.requestPointerLock();
    };

    assets.forEach((asset) => {
        AM.queueDownload("./img/" + asset);
    });

    this.game = new GameEngine();
    this.level;
}

SceneManager.prototype.loadVillageMap = function(){
    this.level = "village";
    var that = this;
    AM.downloadAll(function (){
        console.log("downloading");
        that.game.assetManager = AM;
        that.game.init(that.ctx);
        var data = loadVillageData();
        that.game.addEntity(new Background(that.game, AM.getAsset("./img/villagemap.png"), data));
        
        var player = new Player(that.game, 
            AM.getAsset("./img/charwalk.png"), 
            AM.getAsset("./img/charshoot_loop.png"), 
            AM.getAsset("./img/charstand.png"), 
            AM.getAsset("./img/character_edited.png"), 
            AM.getAsset("./img/char_power.png"),
            data.playerSpawn.x, data.playerSpawn.y);
        var camera = new Camera(that.game, player, AM.getAsset("./img/villagemap.png"), 6400, 6400);
        that.game.start(player, camera);
        that.game.crosshair = new Crosshair(that.game, AM.getAsset("./img/crosshair-export.png"));
        that.game.addEntity(player);    
        
        for(var i = 0; i<data.enemySpawns.length; i++){
            var location = data.enemySpawns[i];
            var enemyPercentage = Math.random(); 
            if (enemyPercentage >= 0.0 && enemyPercentage <= 0.45) {
                that.game.addEntity(new RangeEnemy(that.game, AM.getAsset("./img/normalArcher.png"), location.x, location.y, ArrowType, "arrow"));
            } else if(enemyPercentage > 0.45 && enemyPercentage <= 0.85) {
                that.game.addEntity(new RangeEnemy(that.game, AM.getAsset("./img/MageGirl.png"), location.x, location.y, MagicType, "magic"));
            } else if (enemyPercentage > 0.85 && enemyPercentage <= 1) { 
                that.game.addEntity(new Bunny(that.game, AM.getAsset("./img/bunbun.png"), location.x, location.y)); 
                that.game.addEntity(new Bunny(that.game, AM.getAsset("./img/bunbun.png"), location.x+35, location.y)); 
                that.game.addEntity(new Bunny(that.game, AM.getAsset("./img/bunbun.png"), location.x+70, location.y)); 
            } else {
                that.game.addEntity(new RangeEnemy(that.game, AM.getAsset("./img/normalArcher.png"), location.x, location.y, ArrowType, "arrow"));
            }
        }
        console.log("NEW!!!!!!!!!!!!1");
        if (data.powerUpSpawns) {
            for (var i = 0; i<data.powerUpSpawns.length; i ++) {
                var location = data.powerUpSpawns[i];
                if ( i < 3) {
                    that.game.addEntity(new Powerup(that.game, location.x, location.y, "ammo"));
                } else {
                    that.game.addEntity(new Powerup(that.game, location.x, location.y, "HP"));
                }
            }
        }
        
        that.game.addEntity(new shadowBoss(that.game,AM.getAsset("./img/movement.png"), AM.getAsset("./img/shadowLeft.png"),AM.getAsset("./img/shadowRight.png")));
        console.log("All Done!");
    });

}

SceneManager.prototype.loadCastleMap = function(){
    this.level = "castle";
    this.game.entities = [];
    audio.pause();
    audio = new Audio('./caveMusic.mp3');
    audio.volume = 0.10; // 75%
    audio.loop = true;
    var data = loadCastleData();
    this.game.addEntity(new Background(this.game, AM.getAsset("./img/castlemap.png"), data));
    this.game.player.x = data.playerSpawn.x;
    this.game.player.y = data.playerSpawn.y;
    /*this.game.player.x = 6000;
    this.game.player.y = 900;*/
    this.game.addEntity(this.game.player);
    this.game.addEntity(new TrapDoor(this.game));
    this.game.pointerx = this.game.player.x;
    this.game.pointery =  this.game.player.y;
    for(var i = 0; i<data.enemySpawns.length; i++){
        var location = data.enemySpawns[i];
        var enemyPercentage = Math.random(); 
        if (enemyPercentage >= 0.0 && enemyPercentage <= 0.45) {
            this.game.addEntity(new RangeEnemy(this.game, AM.getAsset("./img/KnightArcher.png"), location.x, location.y, ArrowType, "arrow"));
        } else if(enemyPercentage > 0.45 && enemyPercentage <= 0.85) {
            this.game.addEntity(new RangeEnemy(this.game, AM.getAsset("./img/KnightMage.png"), location.x, location.y, MagicType, "magic"));
        } else if (enemyPercentage > 0.85 && enemyPercentage <= 1) { 
            this.game.addEntity(new Bunny(this.game, AM.getAsset("./img/bunbun.png"), location.x, location.y)); 
            this.game.addEntity(new Bunny(this.game, AM.getAsset("./img/bunbun.png"), location.x+35, location.y)); 
            this.game.addEntity(new Bunny(this.game, AM.getAsset("./img/bunbun.png"), location.x+70, location.y)); 
        } else {
            this.game.addEntity(new RangeEnemy(this.game, AM.getAsset("./img/magicSkel.png"), location.x, location.y, MagicType, "magic", "AdvMagic"));
        }
    }
    if (data.powerUpSpawns) {
        for (var i = 0; i<data.powerUpSpawns.length; i ++) {
            var location = data.powerUpSpawns[i];
            if ( i < 3) {
                this.game.addEntity(new Powerup(this.game, location.x, location.y, "ammo"));
            } else {
                this.game.addEntity(new Powerup(this.game, location.x, location.y, "HP"));
            }
        }
    }
}

SceneManager.prototype.loadNextLevel = function() {
    if (this.level === "village") {
        this.loadCastleMap();
        console.log(this.level);
    } else if (this.level === "castle") {
        this.loadCaveMap();
    } else if(this.level === "cave"){
        this.loadFinalMap();
    }
}

SceneManager.prototype.loadCaveMap = function() {
    this.level = "cave";
    this.game.entities = [];
    audio.pause();
    audio = new Audio('./caveMusic.mp3');
    audio.volume = 0.10; // 75%
    audio.loop =true;

    var data = loadCaveData();
    this.game.addEntity(new Background(this.game, AM.getAsset("./img/cavemap.png"), data));
    this.game.player.x = 400;
    this.game.player.y = 400;
    /*this.game.player.x = 6000;
    this.game.player.y = 900;*/
    this.game.addEntity(this.game.player);
    this.game.pointerx = this.game.player.x;
    this.game.pointery =  this.game.player.y;
    for(var i = 0; i<data.enemySpawns.length; i++){
        var location = data.enemySpawns[i];
        var enemyPercentage = Math.random(); 
        if (enemyPercentage >= 0.0 && enemyPercentage <= 0.45) {
            this.game.addEntity(new RangeEnemy(this.game, AM.getAsset("./img/HoodedRanger.png"), location.x, location.y, ArrowType, "arrow", "HoodedArcher"));
        } else if(enemyPercentage > 0.45 && enemyPercentage <= 0.85) {
            this.game.addEntity(new RangeEnemy(this.game, AM.getAsset("./img/magicSkel.png"), location.x, location.y, MagicType, "magic", "AdvMagic"));
        } else if (enemyPercentage > 0.85 && enemyPercentage <= 1) { 
            this.game.addEntity(new RangeEnemy(this.game, AM.getAsset("./img/arrowSkel.png"), location.x, location.y, ArrowType, "arrow", "HoodedArcher"));
        } else {
            this.game.addEntity(new RangeEnemy(this.game, AM.getAsset("./img/magicSkel.png"), location.x, location.y, MagicType, "magic", "AdvMagic"));
        }
    }
    if (data.powerUpSpawns) {
        for (var i = 0; i<data.powerUpSpawns.length; i ++) {
            var location = data.powerUpSpawns[i];
            if ( i < 3) {
                this.game.addEntity(new Powerup(this.game, location.x, location.y, "ammo"));
            } else {
                this.game.addEntity(new Powerup(this.game, location.x, location.y, "HP"));
            }
        }
    }
}

SceneManager.prototype.loadFinalMap = function() {
 this.level = "final";
    this.game.entities = [];
    audio.pause();
    audio = new Audio('./finalMusic.mp3');
    audio.volume = 0.10; // 75%
    audio.loop = true;

    var data = loadFinalMapData();
    this.game.addEntity(new Background(this.game, AM.getAsset("./img/finalBossMap.png"), data));
    this.game.player.x = 750;
    this.game.player.y = 1200;

    this.game.addEntity(this.game.player);
    this.game.pointerx = this.game.player.x;
    this.game.pointery =  this.game.player.y;
    
    
    var location = data.enemySpawns[0];

    this.game.addEntity(new FinalRabbitDestination(this.game, AM.getAsset("./img/bossBun-export.png"), location.x, location.y)); 
         
}
/*
AM.queueDownload("./img/crosshair-export.png");
//AM.queueDownload("./img/villagemap.png");
AM.queueDownload("./img/castlemap.png");
AM.queueDownload("./img/charwalk.png");
AM.queueDownload("./img/charstand.png");
AM.queueDownload("./img/charshoot_loop.png");
AM.queueDownload("./img/character_edited.png");
AM.queueDownload("./img/arrow.png");
AM.queueDownload("./img/arrowPile.png");
AM.queueDownload("./img/heart.png");

AM.queueDownload("./img/bunbun.png");
AM.queueDownload("./img/normalArcher.png");
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
AM.queueDownload("./img/normalArcher.png");*/
