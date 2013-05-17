(function(mf){
	mf.geom = mf.geom || {};
	mf.geom.projections = mf.geom.projections || {};
	
	/*
	 * GallCalculator Class
	 */
	var GallCalculator = function(x0, y0, width360) {
		this.w = width360;
		this.x0 = x0;
		this.y0 = y0;
		
		this.setPhi0(45);
	};
	
	mf.geom.projections.GallCalculator = GallCalculator;

	GallCalculator.prototype.setPhi0 = function(phi0) {
		this.phi0 = phi0;
		this.cosphi0 = Math.cos(this.phi0 * (Math.PI / 180));
		this.r = (180 / Math.PI) * (this.w / 360) / this.cosphi0;
	}

	GallCalculator.prototype.getXY = function(lat, lng) {
		var x = this.x0 + (lng * (Math.PI / 180)) * this.r * this.cosphi0;
		var y = this.y0 - this.r * (1 + this.cosphi0) * Math.tan((lat * (Math.PI / 180)) / 2);
		
		return ({
			x: x,
			y: y,
			lat: lat,
			lng: lng
		});
	};

	GallCalculator.prototype.getLatLng = function (x, y) {
		var lng = (360 / this.w) * (x - this.x0);
		var lat = (180 / Math.PI) * 2 * Math.atan((this.y0 - y) / (this.r * (1 + this.cosphi0)));
		
		return ({
			x: x,
			y: y,
			lat: lat,
			lng: lng
		});
	};
})(mf = window.mf || {});
