(function ( exports, $ ) {
	var mf = exports.mf = exports.mf || {};
	mf.animation = mf.animation || {};

	/**
	 * Sequencer
	 */
	function Sequencer () {
		this.length = 0;
		this.animations = [];
	}

	mf.animation.Sequencer = Sequencer;

	/**
	 * Register an animation object
	 *
	 * @param animation
	 * - start : start time : default : current end time
	 * - duration : length of animation segment
	 * - animate : function called during animation
	 * - animateIn : function called once when entering the animation timeline
	 * - animateOut : function called once when leaving the animation timeline
	 *
	 * @return
	 */
	Sequencer.prototype.register = function ( animation ) {
		animation = $.extend( {
			start : this.length,
			duration : 100,
			animate : undefined,
			animateIn : undefined,
			animateOut : undefined,
			started : false
		}, animation );

		this.animations.push( animation );

		this.length = Math.max( this.length, animation.start + animation.duration );

		return animation;
	};

	/**
	 * Process animations
	 */
	Sequencer.prototype.process = function ( t ) {
		var dt, animation;

		// Process Animate Out
		for ( var i = 0, l = this.animations.length; i < l; i++ ) {
			animation = this.animations[i];
			dt = t - animation.start;

			if ( animation.started && ((dt < 0) || (dt >= animation.duration)) ) {
				if ( typeof animation.animateOut == "function" ) {
					animation.animateOut( dt, animation.duration );
				}
				animation.started = false;
			}
		}

		// Process Animate In
		for ( var i = 0, l = this.animations.length; i < l; i++ ) {
			animation = this.animations[i];
			dt = t - animation.start;

			if ( !animation.started && (dt >= 0) && (dt < animation.duration) ) {
				if ( typeof animation.animateIn == "function" ) {
					animation.animateIn( dt, animation.duration );
				}
				animation.started = true;
			}
		}

		// Process Animate
		for ( var i = 0, l = this.animations.length; i < l; i++ ) {
			animation = this.animations[i];
			dt = t - animation.start;

			if ( (dt >= 0) && (dt < animation.duration) ) {
				if ( typeof animation.animate == "function" ) {
					animation.animate( dt, animation.duration );
				}
			}
		}
	};
})( this, jQuery );
