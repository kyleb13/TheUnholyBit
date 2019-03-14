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
    "blue.png",             "officialLogo.png",     "completeGame.png",
    "blue.png",             "mageWalk-export.png",  "mageAttack-export.png","mageDying-export.png",
    "big_modball.png",      "blackbunbun.png",      "completeFinalMap.png"
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
    
    this.game.assetManager = AM;
    this.game.init(this.ctx);
    bossDead = false;
}

SceneManager.prototype.loadMenu = function() {
    var that = this;
    this.level = "menu";
    AM.downloadAll(function (){
        console.log("downloading");
        that.game.assetManager = AM;
        var data = loadMenuData();
        that.game.addEntity(new Background(that.game, AM.getAsset("./img/officialLogo.png"), data));
        var player = new Player(that.game, 
            AM.getAsset("./img/charwalk.png"), 
            AM.getAsset("./img/charshoot_loop.png"), 
            AM.getAsset("./img/charstand.png"), 
            AM.getAsset("./img/character_edited.png"), 
            AM.getAsset("./img/char_power.png"),
            data.playerSpawn.x, data.playerSpawn.y);
        var camera = new Camera(that.game, player, AM.getAsset("./img/officialLogo.png"), 6400, 6400);
        that.game.start(player, camera);
        that.game.crosshair = new Crosshair(that.game, AM.getAsset("./img/crosshair-export.png"));
        that.game.addEntity(player);    
        that.game.addEntity(new menuItem(that.game, 570, 600, "Start Game"));

    
    });
}
SceneManager.prototype.loadVillageMap = function(){
    this.level = "village";
    var that = this;
    this.game.entities = [];
    var data = loadVillageData();
    that.game.addEntity(new Background(that.game, AM.getAsset("./img/villagemap.png"), data));
    
    this.game.player.x = data.playerSpawn.x;
    this.game.player.y = data.playerSpawn.y;
    this.game.player.ammo = 200;
    this.game.player.health = 100;
    this.game.pointerx = this.game.player.x;
    this.game.pointery =  this.game.player.y;
    this.game.addEntity(this.game.player);
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


}

SceneManager.prototype.loadCastleMap = function(){
    bossDead = false;
    this.level = "castle";
    this.game.entities = [];
    audio.pause();
    audio = new Audio('./castlemusic.mp3');
    audio.volume = 0.10; // 75%
    audio.loop = true;
    var data = loadCastleData();
    this.game.addEntity(new Background(this.game, AM.getAsset("./img/castlemap.png"), data));
    this.game.player.x = data.playerSpawn.x;
    this.game.player.y = data.playerSpawn.y;
    /*this.game.player.x = 6000;
    this.game.player.y = 900;*/
    this.game.addEntity(this.game.player);
    this.game.addEntity(new Powerup(this.game, 2500,5300, "SlowTime"));
    this.game.addEntity(new mage(this.game, 10900, 2400));
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
            this.game.addEntity(new BlackBunny(this.game, AM.getAsset("./img/blackbunbun.png"), location.x, location.y)); 
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
    bossDead = false;
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



SceneManager.prototype.loadFinalBonusMap = function () {
    
    this.game.entities = [];
    this.level = "bonus";
    var data = loadFinalBonusData();
    this.game.addEntity(new Background(this.game, AM.getAsset("./img/completeFinalMap.png"), data));
   /*
    this.game.player.x = this.game.player.x;
    this.game.player.y = this.game.player.y;*/
    this.game.addEntity(this.game.player); 
    
    var box = data.nextLevelBox;

}



SceneManager.prototype.loadComplete = function() {
    this.level = "complete";
    this.game.entities = [];
    this.game.projectiles = [];
    
    var data = loadMenuData();

    this.game.addEntity(new Background(this.game, AM.getAsset("./img/completeGame.png"), data));
    this.game.player.x = data.playerSpawn.x;
    this.game.player.y = data.playerSpawn.y;
    this.game.addEntity(this.game.player);

    this.game.addEntity(new menuItem(this.game, 590, 600, " Replay ?"));
}


SceneManager.prototype.loadNextLevel = function() {
    if (this.level === "menu" || this.level === "complete") {
        this.loadVillageMap();
    } else if (this.level === "village") {
        this.loadCastleMap();
    } else if (this.level === "castle") {
        this.loadCaveMap();
    } else if(this.level === "cave"){
        this.loadFinalMap();
    } else if (this.level === "final") {
        this.loadFinalBonusMap();
    } else {
        this.loadComplete();
    }
    
    console.log(this.level);
}

SceneManager.prototype.reloadLevel = function () {
    this.game.player.dead = false;
    this.game.player.removeFromWorld = false;
    this.game.player.ammo = 200;
    this.game.player.health = 100;
    if (this.level === "village") {
        this.loadVillageMap();
    } else if (this.level === "castle") {
        this.loadCastleMap();
    } else if(this.level === "cave") {
        this.loadCaveMap();
    } else {
        this.loadFinalMap();
    }
}
