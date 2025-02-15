class Player
{
    constructor ( x, y )
    {
        this.x = x;
        this.y = y;
        this.size = CONFIG.PLAYER.SIZE;
        this.speed = CONFIG.PLAYER.SPEED;
        this.energy = CONFIG.PLAYER.INITIAL_ENERGY;
        this.isInvincible = false;
        this.weapons = {
            standard: {
                damage: 1,
                cooldown: 250,
                lastShot: 0
            },
            rapid: {
                damage: 0.5,
                cooldown: 100,
                lastShot: 0
            }
        };
        this.currentWeapon = 'standard';
    }

    update ( controls )
    {
        if ( controls.left ) this.x -= this.speed;
        if ( controls.right ) this.x += this.speed;

        // Keep player in bounds
        this.x = Math.max( this.size, Math.min( CONFIG.CANVAS.WIDTH - this.size, this.x ) );

        // Energy decay
        if ( !this.isInvincible )
        {
            this.energy -= CONFIG.PLAYER.ENERGY_DECAY_RATE;
        }
    }

    draw ( ctx )
    {
        ctx.save();
        ctx.translate( this.x, this.y );

        // Draw ship
        ctx.fillStyle = this.isInvincible ? '#ffff00' : '#00ff00';
        ctx.beginPath();
        ctx.moveTo( 0, -this.size );
        ctx.lineTo( -this.size, this.size );
        ctx.lineTo( this.size, this.size );
        ctx.closePath();
        ctx.fill();

        // Draw energy shield effect when invincible
        if ( this.isInvincible )
        {
            ctx.strokeStyle = '#ffff00';
            ctx.beginPath();
            ctx.arc( 0, 0, this.size + 5, 0, Math.PI * 2 );
            ctx.stroke();
        }

        ctx.restore();
    }

    shoot ()
    {
        const weapon = this.weapons[ this.currentWeapon ];
        const now = Date.now();

        if ( now - weapon.lastShot >= weapon.cooldown && this.energy >= CONFIG.PLAYER.SHOOT_COST )
        {
            this.energy -= CONFIG.PLAYER.SHOOT_COST;
            weapon.lastShot = now;
            return new Projectile( this.x, this.y - this.size, weapon.damage );
        }
        return null;
    }
}

class Asteroid
{
    constructor ()
    {
        this.size = Utils.random( CONFIG.ASTEROID.MIN_SIZE, CONFIG.ASTEROID.MAX_SIZE );
        this.x = Utils.random( this.size, CONFIG.CANVAS.WIDTH - this.size );
        this.y = -this.size;
        this.speed = Utils.random( CONFIG.ASTEROID.MIN_SPEED, CONFIG.ASTEROID.MAX_SPEED );
        this.rotation = 0;
        this.rotationSpeed = Utils.random( -0.02, 0.02 );
        this.vertices = this.generateVertices();
    }

    generateVertices ()
    {
        const vertices = [];
        const segments = 8;
        for ( let i = 0; i < segments; i++ )
        {
            const angle = ( i / segments ) * Math.PI * 2;
            const radius = this.size * Utils.random( 0.8, 1.2 );
            vertices.push( {
                x: Math.cos( angle ) * radius,
                y: Math.sin( angle ) * radius
            } );
        }
        return vertices;
    }

    update ()
    {
        this.y += this.speed;
        this.rotation += this.rotationSpeed;
        return this.y - this.size > CONFIG.CANVAS.HEIGHT;
    }

    draw ( ctx )
    {
        ctx.save();
        ctx.translate( this.x, this.y );
        ctx.rotate( this.rotation );

        ctx.fillStyle = '#808080';
        ctx.beginPath();
        ctx.moveTo( this.vertices[ 0 ].x, this.vertices[ 0 ].y );
        for ( let i = 1; i < this.vertices.length; i++ )
        {
            ctx.lineTo( this.vertices[ i ].x, this.vertices[ i ].y );
        }
        ctx.closePath();
        ctx.fill();

        ctx.restore();
    }
}

class Projectile
{
    constructor ( x, y, damage = 1 )
    {
        this.x = x;
        this.y = y;
        this.size = CONFIG.PROJECTILE.SIZE;
        this.speed = CONFIG.PROJECTILE.SPEED;
        this.damage = damage;
    }

    update ()
    {
        this.y -= this.speed;
        return this.y + this.size < 0;
    }

    draw ( ctx )
    {
        ctx.fillStyle = CONFIG.PROJECTILE.COLOR;
        ctx.beginPath();
        ctx.arc( this.x, this.y, this.size, 0, Math.PI * 2 );
        ctx.fill();
    }
}