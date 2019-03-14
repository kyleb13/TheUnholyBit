var menuData = 
{
    playerSpawn:{x:660, y:490},
    
    nextLevelBox:{
        x: -99, 
        y:-99,
        width:0,
        height:0
    },
    boundingBoxes: [
        {
            n:1,
            p1: {x:1400, y:900},
            p2: {x:1400, y:0},
            p3: {x:0, y:0},
            p4: {x:0, y:900}
        }
    ]
};


function loadMenuData(){
    console.log("loading menu data");
    return menuData;
}


function menuItem (game, x, y, name) {
    this.name = name;
    this.game = game;
    this.ctx = game.ctx;

    this.boundingBox = {
        x: x-10, 
        y:y,
        width: 230,
        height: 50,
        offsetx:0,
        offsety:-40
    }
    if (name === "Start Game") {

    }/* else {
        
        this.boundingBox = {
            x: x-10, 
            y:y,
            width: 230,
            height: 50,
            offsetx:15,
            offsety:-210
        }
    }*/
    Entity.call(this, game, x, y);
}

menuItem.prototype.update = function() {
        // for (var i = 0; i < this.game.projectiles.length; i++) {
        //     var ent = this.game.projectiles[i];
        //     if (collide(this, ent)) {
        //         sceneManager.loadNextLevel();
        //         ent.removeFromWorld = true; 
        //     } 

        // }

}

menuItem.prototype.doAThing = function() {
    sceneManager.loadNextLevel();
    this.removeFromWorld = true;
}

menuItem.prototype.draw = function() {
    
    this.ctx.fillStyle = "white";
    
    this.ctx.font = "50px Matura MT Script Capitals"; 
    
    this.ctx.fillText(this.name, this.x, this.y);
    if (this.name === "Start Game") {
    
        this.ctx.font = "24px Bahnschrift Condensed";
        this.ctx.fillText("* Shoot \"Start Game\" to start game.*", 550, 660);
        this.ctx.font = "40px Bahnschrift";
        this.ctx.fillText(`***Shoot: Left Click, M = mute sounds***`, 350, 700);
        this.ctx.fillText(`***Control: W = up, S = down, D = right, A = left***`, 300, 750);
        
    } else {
        this.ctx.font = "24px Bahnschrift Condensed";
        this.ctx.fillText("* Shoot \"Replay\" to restart the game. *", 550, 660);
     
    }
    
    if(this.game.showOutlines){
        this.ctx.strokeRect(this.boundingBox.x+this.boundingBox.offsetx, 
        this.boundingBox.y+this.boundingBox.offsety, this.boundingBox.width, this.boundingBox.height);
    }   
}