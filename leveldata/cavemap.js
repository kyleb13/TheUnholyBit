var leveldata = 
`{
    "playerSpawn":{"x":100, "y":300},
    "enemySpawns":[
        {
            
        }
    ],
    "boundingBoxes": [
        {
            "n":1,
            "p1": {"x":0, "y":0},
            "p2": {"x":0, "y":200},
            "p3": {"x":5606, "y":200},
            "p4": {"x":5606, "y":0}
        }
    ]
}`;

function loadCaveData(){
    console.log("loading level data");
    return JSON.parse(leveldata);
}