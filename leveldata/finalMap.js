var finalMapData = 
{
    playerSpawn:{x:100, y:300},
  
  
    nextLevelBox:   {
        p1: {x:-99, y:-99},
        p2: {x:-99, y:-99},
        p3: {x:-99, y:-99},
        p4: {x:-99, y:-99}
    }, 

    enemySpawns:[
        {
            x:750,
            y:200
        }
    ],
    boundingBoxes: [
        {
            n:1,
            p1: {x:0, y:0},
            p2: {x:0, y:1500},
            p3: {x:44, y:1500},
            p4: {x:44, y:0}
        }, {
            n:2,
            p1: {x:0, y:1456},
            p2: {x:0, y:1500},
            p3: {x:1500, y:1500},
            p4: {x:1500, y:1456}
        }, {
            n:3,
            p1: {x:1460, y:0},
            p2: {x:1460, y:1500},
            p3: {x:1500, y:1500},
            p4: {x:1500, y:0}
        }, {
            n:4,
            p1: {x:0, y:0},
            p2: {x:0, y:148},
            p3: {x:1500, y:148},
            p4: {x:1500, y:0}
        }
    ]
};

function loadFinalMapData(){
    return finalMapData;
}