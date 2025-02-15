class Effects
{
    constructor ()
    {
        this.particles = [];
    }

    createExplosion ( x, y, color = '#ff0000', count = 20 )
    {
        for ( let i = 0; i < count; i++ )
        {
            const angle = ( i / count ) * Math.PI * 2;
            const speed = Utils.random( 2, 5 );
            this.particles.push( {
                x,
                y,
                vx: Math.cos( angle ) * speed,
                vy: Math.sin( angle ) * speed,
                size: Utils.random( 1, 3 ),
                color,
                life: 1
            } );
        }
    }

    update ()
    {
        this.particles = this.particles.filter( particle =>
        {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life -= 0.02;
            return particle.life > 0;
        } );
    }

    draw ( ctx )
    {
        this.particles.forEach( particle =>
        {
            ctx.fillStyle = particle.color + Math.floor( particle.life * 255 ).toString( 16 ).padStart( 2, '0' );
            ctx.fillRect( particle.x, particle.y, particle.size, particle.size );
        } );
    }
}
