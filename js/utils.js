const Utils = {
    random: ( min, max ) => Math.random() * ( max - min ) + min,

    distance: ( x1, y1, x2, y2 ) =>
    {
        const dx = x2 - x1;
        const dy = y2 - y1;
        return Math.sqrt( dx * dx + dy * dy );
    },

    collision: ( obj1, obj2 ) =>
    {
        return Utils.distance( obj1.x, obj1.y, obj2.x, obj2.y ) < ( obj1.size + obj2.size );
    },

    createStarField: ( count, width, height ) =>
    {
        const stars = [];
        for ( let i = 0; i < count; i++ )
        {
            stars.push( {
                x: Math.random() * width,
                y: Math.random() * height,
                size: Math.random() * 2 + 1,
                speed: Math.random() * 2 + 1
            } );
        }
        return stars;
    },

    drawStarField: ( ctx, stars, width, height ) =>
    {
        ctx.fillStyle = '#ffffff';
        stars.forEach( star =>
        {
            ctx.beginPath();
            ctx.arc( star.x, star.y, star.size, 0, Math.PI * 2 );
            ctx.fill();

            star.y += star.speed;
            if ( star.y > height )
            {
                star.y = 0;
                star.x = Math.random() * width;
            }
        } );
    }
};