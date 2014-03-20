(function ( exports, $ ) {
	var mf = exports.mf = exports.mf || {};
	mf.animation = mf.animation || {};

	/**
	 * TimeLine
	 *
	 * @param options :
	 * - length (in milli-seconds)
	 */
	function TimeLine ( options ) {
		this.options = $.extend( {
			length : 1
		}, options );

		this.time = 0;
		this.length = this.options.length;

		this.easing = {
			easingFunction : mf.utils.Maths.easeOutQuad, // Easing function
			startTime : 0,  // Start time
			duration : 0,   // Easing duration
			startValue : 0, // Start value to ease from
			endValue : 0,   // End value to ease to

			on : false
		};
	}

	mf.animation.TimeLine = TimeLine;

	TimeLine.TIME_CHANGED = "eventTimeChanged";
	TimeLine.PLAY = "eventPlay";
	TimeLine.STOP = "eventStop";

	/**
	 * (private) function used to interpolate time with requestAnimationFrame
	 */
	TimeLine.prototype.ease = function () {
		if ( this.easing.on ) {
			var t = Date.now() - this.easing.startTime;
			var d = this.easing.duration;

			if ( t >= d ) {
				this.easing.on = false;

				this.setTime( this.easing.endValue );
			}
			else {
				this.setTime( this.easing.easingFunction( t, this.easing.startValue, this.easing.endValue - this.easing.startValue, d ) );

				requestAnimationFrame( delegate( this.ease, this ) );
			}
		}
	};

	/**
	 * Move playhead to time
	 *
	 * @param t : time
	 * @param options :
	 * - duration in milliseconds : default 1000
	 * - easing : easing function : default easeOutQuad
	 */
	TimeLine.prototype.moveToTime = function ( t, options ) {
		options = $.extend( {
			duration : Math.min( 1000, Math.abs( t - this.time ) ),
			easing : mf.utils.Maths.easeOutQuad
		}, options );

		this.easing.startTime = Date.now();
		this.easing.duration = options.duration;
		this.easing.startValue = this.time;
		this.easing.endValue = t;
		this.easing.easingFunction = options.easing;

		if ( !this.easing.on ) {
			this.easing.on = true;
			requestAnimationFrame( delegate( this.ease, this ) );
		}
	};

	/**
	 * Set the time and trigger the TimeLine.TIME_CHANGED event
	 *
	 * @param t : time
	 */
	TimeLine.prototype.setTime = function ( t ) {
		if ( t != this.time ) {
			this.time = t;

			$( this ).trigger( TimeLine.TIME_CHANGED );
		}
	};

	/**
	 * Start the playhead, linear time-based play
	 */
	TimeLine.prototype.play = function () {
		$( this ).trigger( TimeLine.PLAY );

		this.moveToTime( this.length, {
			duration : this.length - this.time,
			easing : mf.utils.Maths.easeLinear
		} );
	};

	/**
	 * Stop the playing
	 */
	TimeLine.prototype.stop = function ( t ) {
		if ( typeof t != "undefined" ) {
			this.setTime( t );
		}

		$( this ).trigger( TimeLine.STOP );

		this.easing.on = false;
	};
})( this, jQuery );
