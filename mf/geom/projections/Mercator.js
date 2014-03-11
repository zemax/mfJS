(function ( mf ) {
	mf.geom = mf.geom || {};
	mf.geom.projections = mf.geom.projections || {};

	/*
	 * MercatorCalculator Class
	 */
	var MercatorCalculator = function ( x0, y0, width360 ) {
		this.w = width360;
		this.x0 = x0;
		this.y0 = y0;
	};

	mf.geom.projections.MercatorCalculator = MercatorCalculator;

	MercatorCalculator.prototype.getXY = function ( lat, lng ) {
		var x = this.x0 + this.w * lng / 360;
		var y = this.y0 - (this.w / (2 * Math.PI)) * Math.log( Math.tan( (Math.PI / 4) + lat * (Math.PI / 180) / 2 ) );

		return ({
			x : x,
			y : y,
			lat : lat,
			lng : lng
		});
	};

	MercatorCalculator.prototype.getLatLng = function ( x, y ) {
		var lng = (360 / this.w) * (x - this.x0);
		var lat = (180 / Math.PI) * (2 * Math.atan( Math.exp( (this.y0 - y) * (2 * Math.PI) / this.w ) ) - (Math.PI / 2));

		return ({
			x : x,
			y : y,
			lat : lat,
			lng : lng
		});
	};
})( mf = window.mf || {} );
