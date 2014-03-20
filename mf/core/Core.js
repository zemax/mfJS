/*
 *  Core & Polyfills
 */
(function ( exports ) {
	// Delegate
	if ( typeof exports.delegate == 'undefined' ) {
		exports.delegate = function ( method, instance ) {
			return function () {
				return method.apply( instance, arguments );
			};
		};
	}

	// Date.now Polyfill
	exports.Date.now = (exports.Date.now || function () { return (new Date()).getTime(); });

	// Console.log minimalist Polyfill
	if ( typeof exports.console == 'undefined' ) exports.console = {};
	if ( typeof exports.console.log != 'function' ) exports.console.log = function ( msg ) {};

	// requestAnimationFrame polyfill by Erik Möller, fixes from Paul Irish and Tino Zijdel
	(function (exports) {
		var lastTime = 0;
		var vendors = [ 'ms', 'moz', 'webkit', 'o' ];

		for ( var x = 0; x < vendors.length && !exports.requestAnimationFrame; ++x ) {
			exports.requestAnimationFrame = exports[ vendors[ x ] + 'RequestAnimationFrame' ];
			exports.cancelAnimationFrame = exports[ vendors[ x ] + 'CancelAnimationFrame' ] || exports[ vendors[ x ] + 'CancelRequestAnimationFrame' ];
		}

		if ( exports.requestAnimationFrame === undefined ) {
			exports.requestAnimationFrame = function ( callback, element ) {
				var currTime = Date.now(), timeToCall = Math.max( 0, 16 - ( currTime - lastTime ) );
				var id = exports.setTimeout( function () { callback( currTime + timeToCall ); }, timeToCall );
				lastTime = currTime + timeToCall;
				return id;
			};
		}

		exports.cancelAnimationFrame = exports.cancelAnimationFrame || function ( id ) { exports.clearTimeout( id ); };
	}(exports));
})( this );
