/**
 * Created by Maxime on 20/03/14.
 */
(function ( mf ) {
	mf.dom = mf.dom || {};

	function Viewport () {

	}

	mf.dom.Viewport = Viewport;

	// Determine if an element is in the visible viewport
	Viewport.isInViewport = function ( element ) {
		var rect = element.getBoundingClientRect();
		var html = document.documentElement;
		return ((rect.top >= 0)
			&& (rect.left >= 0)
			&& (rect.bottom <= (window.innerHeight || html.clientHeight))
			&& (rect.right <= (window.innerWidth || html.clientWidth))
			);
	};
})( mf = window.mf || {} );
