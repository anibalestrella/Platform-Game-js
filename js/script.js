// Module aliases
const { Engine, Render, Runner, Bodies, Composite, World, Body, Events } = Matter;

// Create an engine
const engine = Engine.create();
const world = engine.world;

// Create a renderer
const render = Render.create({
    element: document.body,
    engine: engine,
    canvas: document.getElementById('gameCanvas'),
    options: {
        width: 800,
        height: 600,
        wireframes: false,
        background: '#f0f0f0'
    }
});

Render.run(render);
const runner = Runner.create();
Runner.run(runner, engine);

// Load player sprite
const playerSprite = new Image();
playerSprite.src = 'assets/images/player.png';

const playerFrames = {
    idle: { x: 0, y: 0, width: 50, height: 50 },
    walk: [
        { x: 50, y: 0, width: 50, height: 50 },
        { x: 100, y: 0, width: 50, height: 50 }
    ],
    jump: { x: 150, y: 0, width: 50, height: 50 }
};

let currentFrameIndex = 0;
let frameCount = 0;

// Player object
const player = Bodies.rectangle(50, 550, 50, 50, {
    inertia: Infinity, // Prevent rotation
    render: {
        sprite: playerFrames.idle
    }
});
World.add(world, player);

// Levels
const levels = [
    // Level 1
    [
        Bodies.rectangle(400, 590, 810, 60, { isStatic: true }),
        Bodies.rectangle(200, 500, 200, 20, { isStatic: true }),
        Bodies.rectangle(400, 400, 200, 20, { isStatic: true }),
        Bodies.rectangle(650, 300, 100, 20, { isStatic: true })
    ],
    // Level 2
    [
        Bodies.rectangle(400, 590, 810, 60, { isStatic: true }),
        Bodies.rectangle(100, 450, 150, 20, { isStatic: true }),
        Bodies.rectangle(300, 350, 200, 20, { isStatic: true }),
        Bodies.rectangle(600, 250, 150, 20, { isStatic: true }),
        Bodies.rectangle(750, 150, 50, 20, { isStatic: true })
    ],
    // Level 3
    [
        Bodies.rectangle(400, 590, 810, 60, { isStatic: true }),
        Bodies.rectangle(300, 500, 150, 20, { isStatic: true }),
        Bodies.rectangle(500, 400, 150, 20, { isStatic: true }),
        Bodies.rectangle(350, 300, 100, 20, { isStatic: true }),
        Bodies.rectangle(600, 200, 150, 20, { isStatic: true })
    ],
    // Level 4
    [
        Bodies.rectangle(400, 590, 810, 60, { isStatic: true }),
        Bodies.rectangle(250, 550, 100, 20, { isStatic: true }),
        Bodies.rectangle(450, 450, 200, 20, { isStatic: true }),
        Bodies.rectangle(150, 350, 200, 20, { isStatic: true }),
        Bodies.rectangle(500, 250, 150, 20, { isStatic: true }),
        Bodies.rectangle(300, 150, 100, 20, { isStatic: true })
    ]
];

let currentLevel = 0;
let platforms = levels[currentLevel];

// Add initial platforms to the world
World.add(world, platforms);

// Event listeners for keyboard input
document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

function keyDown(event) {
    // Apply forces to the player based on key press
    if (event.key === 'ArrowRight' || event.key === 'Right') {
        Body.setVelocity(player, { x: 5, y: player.velocity.y });
        player.render.sprite = playerFrames.walk[currentFrameIndex];
    } else if (event.key === 'ArrowLeft' || event.key === 'Left') {
        Body.setVelocity(player, { x: -5, y: player.velocity.y });
        player.render.sprite = playerFrames.walk[currentFrameIndex];
    } else if ((event.key === 'ArrowUp' || event.key === 'Up') && player.position.y >= 550) {
        Body.setVelocity(player, { x: player.velocity.x, y: -10 });
        player.render.sprite = playerFrames.jump;
    }
}

function keyUp(event) {
    // Stop horizontal movement when key is released
    if (event.key === 'ArrowRight' || event.key === 'Right' || event.key === 'ArrowLeft' || event.key === 'Left') {
        Body.setVelocity(player, { x: 0, y: player.velocity.y });
        player.render.sprite = playerFrames.idle;
    }
}

// Check if player reached the end of the level
Events.on(engine, 'beforeUpdate', () => {
    if (player.position.x > 800) {
        nextLevel();
    }

    // Update player sprite animation
    frameCount++;
    if (frameCount >= 10) {
        frameCount = 0;
        currentFrameIndex = (currentFrameIndex + 1) % playerFrames.walk.length;
        if (player.velocity.x !== 0) {
            player.render.sprite = playerFrames.walk[currentFrameIndex];
        }
    }
});

function nextLevel() {
    // Advance to the next level or loop back to the first level
    currentLevel = (currentLevel + 1) % levels.length;
    platforms.forEach(platform => World.remove(world, platform));
    platforms = levels[currentLevel];
    World.add(world, platforms);
    Body.setPosition(player, { x: 50, y: 550 });
}

// Main game loop
function gameLoop() {
    // Request next frame
    requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();
