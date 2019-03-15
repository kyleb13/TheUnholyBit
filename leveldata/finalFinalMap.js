var finalBonusMapData = 
{
    nextLevelBox:  {
        x: 730, 
        y:90,
        width:93,
        height:60
    }, 

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
            p3: {x:725, y:148},
            p4: {x:725, y:0}
        }, {
            n:5,
            p1: {x:830, y:0},
            p2: {x:830, y:148},
            p3: {x:1500, y:148},
            p4: {x:1500, y:0}
        }
    ]
};

function loadFinalBonusData() {
    return finalBonusMapData;
}