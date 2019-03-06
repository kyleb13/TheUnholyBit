
function SceneManager(){

    var canvas = document.getElementById("gameWorld");
    this.ctx = canvas.getContext("2d");
    canvas.onclick = function() {
        canvas.requestPointerLock();
    };

    this.game = new GameEngine();
    this.level;
}

SceneManager.prototype.loadVillageMap = function(){
    this.level = "village";
    AM.queueDownload("./img/crosshair-export.png");
    AM.queueDownload("./img/explosion.png");
    AM.queueDownload("./img/villagemap.png");
    AM.queueDownload("./img/charwalk.png");
    AM.queueDownload("./img/char_power.png");
    AM.queueDownload("./img/charstand.png");
    AM.queueDownload("./img/charshoot_loop.png");
    AM.queueDownload("./img/character_edited.png");
    AM.queueDownload("./img/arrow.png");
    AM.queueDownload("./img/arrowPile.png");
    AM.queueDownload("./img/heart.png");
    AM.queueDownload("./img/HoodedRanger.png");

    AM.queueDownload("./img/bunbun.png");
    AM.queueDownload("./img/fireball.png");
    AM.queueDownload("./img/MageGirl.png");

    AM.queueDownload("./img/movement.png");
    AM.queueDownload("./img/shadowLeft.png");
    AM.queueDownload("./img/shadowRight.png");
    AM.queueDownload("./img/modball.png");
    AM.queueDownload("./img/normalArcher.png");
    var that = this;
    AM.downloadAll(function (){
        console.log("downloading");
        that.game.assetManager = AM;
        that.game.init(that.ctx);
        var data = loadVillageData();
        that.game.addEntity(new Background(that.game, AM.getAsset("./img/villagemap.png"), data));
        
        var player = new Player(that.game, AM.getAsset("./img/charwalk.png"), AM.getAsset("./img/charshoot_loop.png"), AM.getAsset("./img/charstand.png"), AM.getAsset("./img/character_edited.png"), AM.getAsset("./img/char_power.png"));
        var camera = new Camera(that.game, player, AM.getAsset("./img/villagemap.png"), 6400, 6400);
        that.game.start(player, camera);
        that.game.crosshair = new Crosshair(that.game, AM.getAsset("./img/crosshair-export.png"));
        that.game.addEntity(player);
         that.game.addEntity(new RangeEnemy(that.game, AM.getAsset("./img/HoodedRanger.png"), 1000, 1000, ArrowType, "arrow", "HoodedArcher"));

        
        /*
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
        */
        that.game.addEntity(new shadowBoss(that.game,AM.getAsset("./img/movement.png"), AM.getAsset("./img/shadowLeft.png"),AM.getAsset("./img/shadowRight.png")));
        console.log("All Done!");
    });

}

SceneManager.prototype.loadNextLevel = function() {
    if (this.level === "village") {
        this.loadCaveMap();
    } 
}

SceneManager.prototype.loadCaveMap = function() {
    this.level = "cave";
    this.game.entities = [];
    AM.queueDownload("./img/cavemap.png");
    AM.queueDownload("./img/HoodedRanger.png");
    var that = this;
    AM.downloadAll(function (){
        var data = loadCaveData();
        that.game.addEntity(new Background(that.game, AM.getAsset("./img/cavemap.png"), data));
        that.game.player.x = 400;
        that.game.player.y = 400;
        that.game.addEntity(that.game.player);
        that.game.pointerx = that.game.player.x;
        that.game.pointery =  that.game.player.y;
    });
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
