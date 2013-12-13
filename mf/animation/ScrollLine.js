(function(mf){
	mf.animation = mf.animation || {};
	
	/**
	 * ScrollLine
	 * 
	 * @param options :
	 * - (inherited) length (in milli-seconds)
	 * - height : height of scroll, default 5000
	 * - touchEnabled : enable scroll simulation on touch devides : default false
	 * - touchHeight
	 */
	function ScrollLine(options) {
		delegate(mf.animation.TimeLine, this)(options);
		
		this.options = $.extend({
			touchEnabled: false,
			touchHeight: 700,
			height: 5000,
			minScrollGap: 3
		}, this.options);
		
		this.time = 0;
		this.length = this.options.length;
		
		this.options.touchEnabled = (this.options.touchEnabled && ('ontouchstart' in document.documentElement));
		
		this.touch = {};
		
		if (this.options.touchEnabled) {
			console.log("Scrollline touch");
			
			document.addEventListener("touchstart", delegate(this.onTouchStart, this));
			document.addEventListener("touchmove",  delegate(this.onTouchMove, this));
			document.addEventListener("touchend",   delegate(this.onTouchEnd, this));
		}
		else {
			console.log("Scrollline scroll " + this.options.height);
			
			$("body").height(this.options.height);
			$(window).scroll(delegate(this.onScroll, this));
		}
	}
	
	mf.animation.ScrollLine = ScrollLine;
	
	ScrollLine.prototype = new mf.animation.TimeLine();
	
	var p = ScrollLine.prototype;
	
	/**
	 * Move playhead to time
	 * 
	 * @param t : time 
	 * @param options : 
	 * - (inherited) duration in milliseconds : default 1000
	 * - (inherited) easing : easing function : default easeOutQuad
	 * - moveScrollbar: move the scrollbar to the requested value : default true
	 */
	p.moveToTime = function(t, options) {
		options = $.extend({
			moveScrollbar:true
		}, options);
		
		delegate(mf.animation.TimeLine.prototype.moveToTime, this)(t, options);
		
		if (options.moveScrollbar && (t != this.time)) {
			this.updateScrollbar(t);
		}
	};
	
	/**
	 * Move scrollbar to time
	 * 
	 * t: time 
	 */
	p.updateScrollbar = function(t) {
		var h = window.innerHeight || document.documentElement.clientHeight;
		$(window).scrollTop(Math.ceil((this.options.height - h) * (t / this.length)));
	};
	
	/**
	 * Start the playhead, linear time-based play
	 * Prevent moving the scrollbar
	 */
	p.play = function() {
		$(this).trigger(mf.animation.TimeLine.PLAY);
		
		this.moveToTime(this.length, {
			duration: this.length - this.time,
			easing: mf.utils.Maths.easeLinear,
			moveScrollbar: false
		});
	};
	
	/**
	 * React on scroll event
	 */
	p.onScroll = function() {
		var h = window.innerHeight || document.documentElement.clientHeight;
		var t = Math.round(this.length * $(window).scrollTop() / (this.options.height - h));
		
		if (Math.abs(t - this.time) <= this.options.minScrollGap) {
			return;
		}
		
		this.moveToTime(t, {moveToTime: false});
	};
	
	/**
	 * React on touchstart event
	 * 
	 * Starts the scroll simulation
	 */
	p.onTouchStart = function(e) {
		e.preventDefault();
		e.stopImmediatePropagation();
		
		this.touch.startY = e.touches[0].pageY;
		this.touch.startTime = this.time;
	};
	
	/**
	 * React on touchmove event
	 * 
	 * Simulate scroll
	 */
	p.onTouchMove = function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        
        var y = e.touches[0].pageY;
        
        this.touch.lastDY = y - this.touch.lastY;
        this.touch.lastY = y;
        
        var dy = y - this.touch.startY;
        
        var t = Math.max(0, Math.min(this.length, Math.round(this.touch.startTime + this.length * (-dy / this.options.touchHeight))));
        
        this.setTime(t, false);
    };
	
    /**
	 * React on touchend event
	 * 
	 * Simulate scroll momentum
	 */
	p.onTouchEnd = function(e) {
		if (Math.abs(this.touch.lastDY) > this.options.minScrollGap) {
			var t = Math.max(0, Math.min(this.length, Math.round(this.time + this.length * (-10 * this.touch.lastDY / this.options.touchHeight))));
	        
			this.moveToTime(t, false);
		}
	};
})(mf = window.mf || {});