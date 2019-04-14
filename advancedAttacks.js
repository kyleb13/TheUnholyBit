
/*
    Controller class for a multistage attack involving multiple projectiles. Projectiles, stageUpdates,
and timers should all be arrays. Projectiles should have all the projectiles involved in the attack,
stageUpdates should have functions that controls how individual projectiles update at various stages,
and timers has the time at which stages should change. destroyTimer has the time at which the attack 
should end (or be removed), and args is function arguments that should be passed every time (args will
be up to you, use it for update logic specific to your attack). See the Shadow Boss's class for an example
of this classes usage
*/
function MultiStageAttack(game, projectiles, stageUpdates, timers, destroyTimer, args){
    this.game = game;
    this.ctx = game.ctx;
    this.projectiles = projectiles;
    this.updates = stageUpdates;
    this.stage = 0;
    this.timers = timers;
    this.endTime = destroyTimer;
    this.fargs = args;
    this.curtime = 0;
    for(var i = 0; i<projectiles.length; i++){
        projectiles[i].controlled = true;
        game.addProjectile(projectiles[i]);
    }
    this.removeFromWorld = false;
    this.active = true;
}

MultiStageAttack.prototype.update = function(){
    var time = this.game.clockTick;
    this.curtime += time;
    if(this.curtime > this.endTime){
        this.projectiles.forEach(prj => {prj.removeFromWorld = true;});
        this.active = false;
        this.removeFromWorld = true;
    } else if(this.timers[this.stage] && this.curtime > this.timers[this.stage]){
        this.stage++;
    }

    for(var i = 0; i<this.projectiles.length; i++){
        var proj = this.projectiles[i];
        if(!proj.removeFromWorld) proj.controlledUpdate(this.updates[this.stage], i, time, this.fargs);
    }

}

MultiStageAttack.prototype.draw = function(ctx){

}


/*
    Dummy class meant for use with the MultiStageAttack. 
    If you want to do something more advanced than moving one set
    of projectiles (like spawning new projectiles every update),
    add this as a projectile to multistageattack and do what you need to in the
    update function
*/
function dummyProjectile(){
    this.removeFromWorld = false;
    this.controlled = true;
}

dummyProjectile.prototype.controlledUpdate = function(update, index, time, args) {
    update(this, index, time, args);
}

dummyProjectile.prototype.draw = function(ctx) {

}

function projectileBurst(that, start, asset, width, height, damage, lifetime, additionalBurst, theta = 0, speed = 325){
    var theStart = 
    {//start point
        x:start.x, 
        y:start.y
    };
    //thePoints
    var points = [
        {x:start.x+1, y:start.y},
        {x:start.x+1, y:start.y+1},
        {x:start.x, y:start.y+1},
        {x:start.x-1, y:start.y+1},
        {x:start.x-1, y:start.y},
        {x:start.x-1, y:start.y-1},
        {x:start.x, y:start.y-1},
        {x:start.x+1, y:start.y-1},
        {x:start.x+2, y:start.y-1},
        {x:start.x+1, y:start.y-2},
        {x:start.x-1, y:start.y-2},
        {x:start.x-2, y:start.y-1},
        {x:start.x-2, y:start.y+1},
        {x:start.x-1, y:start.y+2},
        {x:start.x+1, y:start.y+2},
        {x:start.x+2, y:start.y+1}
    ];
    var max = !additionalBurst ? 8 : 16;
    var sin = Math.sin(-theta);
    var cos = Math.cos(-theta);
    for(var i = 0; i<max; i++){
        if(theta != 0){
            var xdiff = points[i].x - start.x;
            var ydiff = points[i].y - start.y;
            points[i].x = (xdiff*cos - ydiff*sin) + start.x;
            points[i].y = (xdiff*sin + ydiff*cos) + start.y;
            
        }
        that.game.addProjectile(
            new Projectile( that.game,
                {
                    img:asset, 
                    width:width, 
                    height:height
                }, speed, //speed
                theStart, 
                points[i]
                , lifetime, "Boss", damage)
        );
    }
}