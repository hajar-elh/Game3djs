const canvas = document.getElementById("canvas");
const btn = document.getElementById("btn");
const command = document.getElementById("command");


window.onload = function () {
    //Creating Engine of BABYLON JS
    const engine = new BABYLON.Engine(canvas, true);
    //Creating  BASIC ELEMENTS FOR 3D Enivorment 
    const scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3.White;
    //Camera Setup
    var camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 5, Math.PI / 4, 10, BABYLON.Vector3.Zero(), scene);
    camera.lowerRadiusLimit = 4;
    camera.upperRadiusLimit = 30;
    camera.setTarget(new BABYLON.Vector3(1, -1, -1));
    //Light Setup
    const hemiLight = new BABYLON.HemisphericLight("hemiLight", new BABYLON.Vector3(-2, 5, -2), scene);
    const light = new BABYLON.PointLight("pointLight", new BABYLON.Vector3(15, 5, -5), scene);
    light.intensity = 0.75;

    //Creating A Prototype FOR BOX
    const proto = BABYLON.MeshBuilder.CreateBox("proto", {
        size: 1
    }, scene);
    proto.material = new BABYLON.StandardMaterial("material");
    proto.material.diffuseColor = new BABYLON.Color3(0.2, 0.55, 0.89);
    proto.isVisible = false;
    //Creating Boxes 1-2-3 4-5-6 7-8-9 
    const boxPositions = [
        [0, 0, 0],
        [1.1, 0, 0],
        [2.2, 0, 0],
        [0, 0, -1.1],
        [1.1, 0, -1.1],
        [2.2, 0, -1.1],
        [0, 0, -2.2],
        [1.1, 0, -2.2],
        [2.2, 0, -2.2]
    ];
    let boxPos = function (fieldmesh, order) {
        fieldmesh.position = new BABYLON.Vector3(boxPositions[order][0], boxPositions[order][1], boxPositions[order][2]);
    }
    const box0 = proto.createInstance("box0");
    boxPos(box0, 0);
    const box1 = proto.createInstance("box1");
    boxPos(box1, 1);
    const box2 = proto.createInstance("box2");
    boxPos(box2, 2);
    const box3 = proto.createInstance("box3");
    boxPos(box3, 3);
    const box4 = proto.createInstance("box4");
    boxPos(box4, 4);
    const box5 = proto.createInstance("box5");
    boxPos(box5, 5);
    const box6 = proto.createInstance("box6");
    boxPos(box6, 6);
    const box7 = proto.createInstance("box7");
    boxPos(box7, 7);
    const box8 = proto.createInstance("box8");
    boxPos(box8, 8);

    // CREATE GAME PIECES (O AND X)
    // 1. FOR O
    const torus = BABYLON.MeshBuilder.CreateTorus("torus", {
        thickness: 0.20,
        diameter: 0.75,
        tessellation: 32
    }); // "O" 
    torus.material = new BABYLON.StandardMaterial("torusmaterial");
    torus.material.diffuseColor = new BABYLON.Color3(0.1, 0.9, 0.25);
    torus.isVisible = false;//Initial False to not make it display able
    // 2. FOR X
    let cylinder = BABYLON.MeshBuilder.CreateCylinder('cylinder', {
        height: 1,
        diameter: 0.2
    }, scene);
    let newcylinder = cylinder.clone();
    newcylinder.rotation.x = -Math.PI / 2;;
    const mesh = BABYLON.Mesh.MergeMeshes([cylinder, newcylinder]); // "X"
    mesh.rotation.y = Math.PI / 4;
    mesh.rotation.z = -Math.PI / 2;
    mesh.position.y = 0.1;
    mesh.material = new BABYLON.StandardMaterial("meshmaterial");
    mesh.material.diffuseColor = new BABYLON.Color3(0.1, 0.8, 0.9);
    mesh.isVisible = false; //Initial False to not make it display able

    //Start Game Logic
    let currentPlayer = "X"; // Player 01 -> X AND Player 02 -> O
    let gameActive = false;
    var gameState = ["", "", "", "", "", "", "", "", ""]

    //WINNING CONDITIONS
    const winningConditions = [
        [0, 1, 2], // Horizontal Row 1
        [3, 4, 5], // Horizontal Row 2
        [6, 7, 8], // Horizontal Row 3
        [0, 3, 6], // Vertical Col 1
        [1, 4, 7], // Vertical Col 2
        [2, 5, 8], // Vertical Col 3
        [0, 4, 8], // Diagonal 01
        [2, 4, 6] // Diagonal 02
    ];
    //CHECKING Winning Conditions
    function handleResultValidation() {
        for (let i = 0; i <= 7; i++) {
            const winCondition = winningConditions[i];
            let a = gameState[winCondition[0]];
            let b = gameState[winCondition[1]];
            let c = gameState[winCondition[2]];
            if (a === '' || b === '' || c === '') {
                continue;
            }
            if (a === b && b === c) {
                gameActive = false;
                btn.textContent = "Start a New Game";
                command.textContent = "Player " + (a === "X" ? "01" : "02") + " Won the Match";
                return;
            }
        }
        let roundDraw = !gameState.includes("");
        if (roundDraw) {
            btn.textContent = "Start a New Game";
            command.textContent = "Rare case - DRAW!"; //Draw the Match
            gameActive = false;
            return;
        }
    }

    // MAIN PART
    scene.onPointerDown = function (event, pickResult) {
        if (gameActive) {
            if (pickResult.hit) {
                //Player 01 Play Check
                if (currentPlayer == "X") {
                    if (pickResult.pickedMesh.name.includes("box")) {
                        var boxIndex = parseInt(pickResult.pickedMesh.name.charAt(pickResult.pickedMesh.name.length - 1), 10);
                        if (!gameState[boxIndex]) {
                            //ADDING Piece of x TO SCENE
                            var turnMesh = mesh.createInstance("meshmain");
                            turnMesh.position = new BABYLON.Vector3(boxPositions[boxIndex][0], boxPositions[boxIndex][1] + 0.5, boxPositions[boxIndex][2]);
                            gameState[boxIndex] = currentPlayer;
                            let numbers = gameState;
                            let result = true;
                            for (let i = 0; i < numbers.length; i++) {
                                if (numbers[i] == "") {
                                    result = false;
                                    break;
                                }
                            }
                            if (gameActive) {
                                if (!result) {
                                    currentPlayer = currentPlayer === "X" ? "O" : "X"; // Changing Player
                                }
                            }
                        }
                    }
                }
                //Player 02 Play Check
                else if (currentPlayer == "O") {
                    if (pickResult.pickedMesh.name.includes("box")) {
                        var oMove = parseInt(pickResult.pickedMesh.name.charAt(pickResult.pickedMesh.name.length - 1), 10);
                        if (!gameState[oMove]) {
                            //ADDING Piece of O TO SCENE
                            var turnMesh = torus.createInstance("torusmain")
                            turnMesh.position = new BABYLON.Vector3(boxPositions[oMove][0], boxPositions[oMove][1] + 0.5, boxPositions[oMove][2]);
                            gameState[oMove] = currentPlayer;
                            let numbers = gameState;
                            let result = true;
                            for (let i = 0; i < numbers.length; i++) {
                                if (numbers[i] == "") {
                                    result = false;
                                    break;
                                }
                            }
                            if (gameActive) {
                                if (!result) {
                                    currentPlayer = currentPlayer === "X" ? "O" : "X"; //Changing Player
                                }
                            }
                        }
                    }
                }
                //Updating Command
                command.textContent = "Now is the turn of Player " + (currentPlayer == "X" ? "01" : "02") + " ( " + currentPlayer + " )";
                //Checking that any Player win or not 
                handleResultValidation();
            }
        }
    };

    //ADDING EVENT OF BUTTON TO Start A New Game
    btn.addEventListener('click', event => {
        if (!gameActive) {
            gameActive = true;
            currentPlayer = "X"; //Start Game From Player 01
            gameState = ["", "", "", "", "", "", "", "", ""];
            btn.textContent = "Game is Started";
            command.textContent = "Now is the turn of Player " + (currentPlayer == "X" ? "01" : "02") + " ( " + currentPlayer + " )";
            for (let i = 0; i < scene.meshes.length; i++) {
                if (scene.getMeshByName("torusmain")) {
                    scene.getMeshByName("torusmain").dispose();
                }
                if (scene.getMeshByName("meshmain")) {
                    scene.getMeshByName("meshmain").dispose();
                }
            }
        }
    });

    //Rendering Scene IN Loop
    engine.runRenderLoop(function () {
        scene.render();
    });
}