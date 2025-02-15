// Initialize canvas
const canvas = document.getElementById( 'gameCanvas' );
const ctx = canvas.getContext( '2d' );
canvas.width = CONFIG.CANVAS.WIDTH;
canvas.height = CONFIG.CANVAS.HEIGHT;

// Game state
let player = new Player( CONFIG.CANVAS.WIDTH / 2, CONFIG.CANVAS.HEIGHT - 100 );
let asteroids = [];
let projectiles = [];
let effects = new Effects();
let stars = Utils.createStarField( 100, CONFIG.CANVAS.WIDTH, CONFIG.CANVAS.HEIGHT );
let gameActive = false;
let lastAsteroidSpawn = 0;
let score = 0;
let highScore = localStorage.getItem( 'highScore' ) || 0;

function gameLoop ()
{
    if ( !gameActive ) return;

    // Clear canvas
    ctx.clearRect( 0, 0, CONFIG.CANVAS.WIDTH, CONFIG.CANVAS.HEIGHT );

    // Draw star background
    Utils.drawStarField( ctx, stars, CONFIG.CANVAS.WIDTH, CONFIG.CANVAS.HEIGHT );

    // Update and draw player
    player.update( controls );
    player.draw( ctx );

    // Spawn asteroids
    if ( Date.now() - lastAsteroidSpawn > CONFIG.ASTEROID.SPAWN_RATE )
    {
        asteroids.push( new Asteroid() );
        lastAsteroidSpawn = Date.now();
    }

    // Update and draw asteroids
    asteroids = asteroids.filter( asteroid =>
    {
        const isOffscreen = asteroid.update();
        asteroid.draw( ctx );
        return !isOffscreen;
    } );

    // Update and draw projectiles
    projectiles = projectiles.filter( projectile =>
    {
        const isOffscreen = projectile.update();
        projectile.draw( ctx );
        return !isOffscreen;
    } );

    // Update and draw effects
    effects.update();
    effects.draw( ctx );

    // Collision detection
    asteroids = asteroids.filter( asteroid =>
    {
        // Check projectile collisions
        let asteroidDestroyed = false;
        projectiles = projectiles.filter( projectile =>
        {
            if ( Utils.collision( asteroid, projectile ) )
            {
                effects.createExplosion( asteroid.x, asteroid.y );
                asteroidDestroyed = true;
                score += 100;
                document.getElementById( 'score' ).textContent = score;
                return false;
            }
            return true;
        } );

        // Check player collision
        if ( !player.isInvincible && Utils.collision( asteroid, player ) )
        {
            gameOver();
            return false;
        }

        return !asteroidDestroyed;
    } );

    // Update HUD
    document.getElementById( 'energy-level' ).style.width = `${ player.energy }%`;

    // Game over check
    if ( player.energy <= 0 )
    {
        gameOver();
        return;
    }

    requestAnimationFrame( gameLoop );
}

function gameOver ()
{
    gameActive = false;
    if ( score > highScore )
    {
        highScore = score;
        localStorage.setItem( 'highScore', highScore );
    }
    document.getElementById( 'final-score' ).textContent = `Final Score: ${ score }`;
    document.getElementById( 'game-over' ).classList.remove( 'hidden' );
    document.getElementById( 'hud' ).classList.add( 'hidden' );

    // Add this to the gameOver function
    submitScore( score );
}

async function submitScore ( score )
{
    try
    {
        const response = await fetch( 'http://localhost:5000/api/scores', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify( {
                name: playerName, // You'll need to get this from the player
                score: score
            } )
        } );
        const data = await response.json();
        console.log( 'Score submitted:', data );
    } catch ( error )
    {
        console.error( 'Error submitting score:', error );
    }
}

// Modify start-game click handler
document.getElementById( 'start-game' ).addEventListener( 'click', () =>
{
    document.getElementById( 'main-menu' ).classList.add( 'hidden' );
    document.getElementById( 'hud' ).classList.remove( 'hidden' );

    // Reset game state
    player = new Player( CONFIG.CANVAS.WIDTH / 2, CONFIG.CANVAS.HEIGHT - 100 );
    asteroids = [];
    projectiles = [];
    effects = new Effects();
    score = 0;
    document.getElementById( 'score' ).textContent = '0';
    document.getElementById( 'highScore' ).textContent = highScore;
    gameActive = true;

    // Start game loop
    gameLoop();
} );

document.getElementById( 'try-again' ).addEventListener( 'click', () =>
{
    document.getElementById( 'game-over' ).classList.add( 'hidden' );
    document.getElementById( 'start-game' ).click();
} );

document.getElementById( 'back-to-menu' ).addEventListener( 'click', () =>
{
    document.getElementById( 'game-over' ).classList.add( 'hidden' );
    document.getElementById( 'main-menu' ).classList.remove( 'hidden' );
} );