const CONFIG = {
    CANVAS: {
        WIDTH: 800,
        HEIGHT: 600
    },
    PLAYER: {
        SPEED: 5,
        SIZE: 30,
        INITIAL_ENERGY: 100,
        ENERGY_DECAY_RATE: 0.1,
        SHOOT_COST: 2
    },
    PROJECTILE: {
        SPEED: 7,
        SIZE: 3,
        COLOR: '#ff0000'
    },
    ASTEROID: {
        MIN_SIZE: 20,
        MAX_SIZE: 50,
        MIN_SPEED: 1,
        MAX_SPEED: 3,
        SPAWN_RATE: 60
    },
    POWERUP: {
        TYPES: [ 'energy', 'invincibility', 'rapidFire' ],
        SPAWN_RATE: 500,
        DURATION: 5000
    },
    DIFFICULTY: {
        INCREASE_RATE: 0.1,
        LEVEL_THRESHOLD: 1000
    },
    CONTROLS: {
        KEYBOARD: {
            LEFT: [ 'ArrowLeft', 'a', 'A' ],
            RIGHT: [ 'ArrowRight', 'd', 'D' ],
            SHOOT: [ ' ' ],
            PAUSE: [ 'p', 'P' ],
            MUTE: [ 'm', 'M' ]
        },
        GAMEPAD: {
            MOVE_AXIS: 0,
            SHOOT_BUTTON: 0
        }
    }
};