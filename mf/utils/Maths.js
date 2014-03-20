(function ( mf ) {
	mf.utils = mf.utils || {};

	function Maths () {

	}

	mf.utils.Maths = Maths;

	/**
	 * Linear easing
	 *
	 * @param    t    current time
	 * @param    b    start value
	 * @param    c    difference between start and end values
	 * @param    d    duration
	 * @return
	 */
	Maths.easeLinear = function ( t, b, c, d ) {
		return (b + c * (t / d));
	};

	/**
	 * Quadratic Out Easing
	 *
	 * @param    t    current time
	 * @param    b    start value
	 * @param    c    difference between start and end values
	 * @param    d    duration
	 * @return
	 */
	Maths.easeOutQuad = function ( t, b, c, d ) {
		t = t / d;
		return (-c * t * (t - 2) + b);
	};

	/**
	 * Elastic Out easing
	 *
	 * @param    t    current time
	 * @param    b    start value
	 * @param    c    difference between start and end values
	 * @param    d    duration
	 * @param    a    amplitude
	 * @param    p    period
	 * @return
	 */
	Maths.easeOutElastic = function ( t, b, c, d, a, p ) {
		if ( t == 0 ) {
			return (b);
		}

		t = t / d;
		if ( t == 1 ) {
			return (b + c);
		}

		var s = 0;
		if ( p != 0 ) {
			p = d * 0.3;
		}
		if ( a < Math.abs( c ) ) {
			a = c;
			s = p / 4;
		} else {
			s = p / (2 * Math.PI) * Math.asin( c / a );
		}

		return (a * Math.pow( 2, -10 * t ) * Math.sin( (t * d - s) * (2 * Math.PI) / p ) + c + b);
	};

	/**
	 * Return positions on a linear bézier curve
	 *
	 * @param    t    current time
	 * @param    p0    start point
	 * @param    p1    end point
	 * @return
	 */
	Maths.bezierLinear = function ( t, p0, p1 ) {
		var t1 = (1 - t);
		var x = t1 * p0.x + t * p1.x;
		var y = t1 * p0.y + t * p1.y;
		return (new mf.geom.Vector2D( x, y ));
	};

	/**
	 * Return positions on a quadratic bézier curve
	 *
	 * @param    t    current time
	 * @param    p0    start point
	 * @param    p1    control point
	 * @param    p2    end point
	 * @return
	 */
	Maths.bezierQuad = function ( t, p0, p1, p2 ) {
		var t1 = (1 - t);
		var x = (t1 * t1) * p0.x + (2 * t1 * t) * p1.x + (t * t) * p2.x;
		var y = (t1 * t1) * p0.y + (2 * t1 * t) * p1.y + (t * t) * p2.y;
		return (new mf.geom.Vector2D( x, y ));
	};

	/**
	 * Return positions on a cubic bézier curve
	 *
	 * @param    t    current time
	 * @param    p0    start point
	 * @param    p1    control point
	 * @param    p2    control point
	 * @param    p3    end point
	 * @return
	 */
	Maths.bezierCubic = function ( t, p0, p1, p2, p3 ) {
		var t1 = (1 - t);
		var x = (t1 * t1 * t1) * p0.x + (3 * t1 * t1 * t) * p1.x + (3 * t1 * t * t) * p2.x + (t * t * t) * p3.x;
		var y = (t1 * t1 * t1) * p0.y + (3 * t1 * t1 * t) * p1.y + (3 * t1 * t * t) * p2.y + (t * t * t) * p3.y;
		return (new mf.geom.Vector2D( x, y ));
	};

	/**
	 * Return positions on a bézier curve
	 *
	 * @param    t        current time
	 * @param    points    points array
	 * @return
	 */
	Maths.bezierCasteljau = function ( t, points ) {
		var i, j;

		if ( points.length == 1 ) {
			points = points[0];
		}

		var output = [];
		for ( i = 0; i < points.length; i++ ) {
			output.push( new mf.geom.Vector2D( points[i].x, points[i].y ) );
		}

		for ( i = 1; i < points.length; i++ ) {
			for ( j = 0; j < points.length - i; j++ ) {
				output[j].x = (1 - t) * output[j].x + t * output[j + 1].x;
				output[j].y = (1 - t) * output[j].y + t * output[j + 1].y;
			}
		}

		return (output[0]);
	};

	/**
	 * Return the distance in meters between 2 coordinates
	 */
	Maths.geoDistance = function ( lat1, long1, lat2, long2, radius ) {
		if ( typeof radius == "undefined" ) radius = 6378137;

		lat1 *= (Math.PI / 180);
		long1 *= (Math.PI / 180);
		lat2 *= (Math.PI / 180);
		long2 *= (Math.PI / 180);

		var i = (Math.cos( lat1 ) * Math.cos( lat2 ) * Math.cos( long1 ) * Math.cos( long2 ) + Math.cos( lat1 ) * Math.sin( long1 ) * Math.cos( lat2 ) * Math.sin( long2 ) + Math.sin( lat1 ) * Math.sin( lat2 ));
		var j = (Math.acos( i ));

		if ( isNaN( j ) ) {
			j = 0;
		}

		return (radius * j);
	};
})( mf = window.mf || {} );
