/*
 *  Core & Polyfills
 */
(function(exports) {
    // Delegate
    if (typeof exports.delegate == "undefined") {
        exports.delegate = function(method, instance) {
            return function() {
                return method.apply(instance, arguments);
            };
        };
    }
    // Date.now Polyfill
    exports.Date.now = exports.Date.now || function() {
        return new Date().getTime();
    };
    // Console.log minimalist Polyfill
    if (typeof exports.console == "undefined") exports.console = {};
    if (typeof exports.console.log != "function") exports.console.log = function(msg) {};
    // requestAnimationFrame polyfill by Erik Möller, fixes from Paul Irish and Tino Zijdel
    (function(exports) {
        var lastTime = 0;
        var vendors = [ "ms", "moz", "webkit", "o" ];
        for (var x = 0; x < vendors.length && !exports.requestAnimationFrame; ++x) {
            exports.requestAnimationFrame = exports[vendors[x] + "RequestAnimationFrame"];
            exports.cancelAnimationFrame = exports[vendors[x] + "CancelAnimationFrame"] || exports[vendors[x] + "CancelRequestAnimationFrame"];
        }
        if (exports.requestAnimationFrame === undefined) {
            exports.requestAnimationFrame = function(callback, element) {
                var currTime = Date.now(), timeToCall = Math.max(0, 16 - (currTime - lastTime));
                var id = exports.setTimeout(function() {
                    callback(currTime + timeToCall);
                }, timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };
        }
        exports.cancelAnimationFrame = exports.cancelAnimationFrame || function(id) {
            exports.clearTimeout(id);
        };
    })(exports);
})(this);

(function(exports) {
    var mf = exports.mf = exports.mf || {};
    mf.utils = mf.utils || {};
    function Maths() {}
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
    Maths.easeLinear = function(t, b, c, d) {
        return b + c * (t / d);
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
    Maths.easeOutQuad = function(t, b, c, d) {
        t = t / d;
        return -c * t * (t - 2) + b;
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
    Maths.easeOutElastic = function(t, b, c, d, a, p) {
        if (t == 0) {
            return b;
        }
        t = t / d;
        if (t == 1) {
            return b + c;
        }
        var s = 0;
        if (p != 0) {
            p = d * .3;
        }
        if (a < Math.abs(c)) {
            a = c;
            s = p / 4;
        } else {
            s = p / (2 * Math.PI) * Math.asin(c / a);
        }
        return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
    };
    /**
	 * Return positions on a linear bézier curve
	 *
	 * @param    t    current time
	 * @param    p0    start point
	 * @param    p1    end point
	 * @return
	 */
    Maths.bezierLinear = function(t, p0, p1) {
        var t1 = 1 - t;
        var x = t1 * p0.x + t * p1.x;
        var y = t1 * p0.y + t * p1.y;
        return new mf.geom.Vector2D(x, y);
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
    Maths.bezierQuad = function(t, p0, p1, p2) {
        var t1 = 1 - t;
        var x = t1 * t1 * p0.x + 2 * t1 * t * p1.x + t * t * p2.x;
        var y = t1 * t1 * p0.y + 2 * t1 * t * p1.y + t * t * p2.y;
        return new mf.geom.Vector2D(x, y);
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
    Maths.bezierCubic = function(t, p0, p1, p2, p3) {
        var t1 = 1 - t;
        var x = t1 * t1 * t1 * p0.x + 3 * t1 * t1 * t * p1.x + 3 * t1 * t * t * p2.x + t * t * t * p3.x;
        var y = t1 * t1 * t1 * p0.y + 3 * t1 * t1 * t * p1.y + 3 * t1 * t * t * p2.y + t * t * t * p3.y;
        return new mf.geom.Vector2D(x, y);
    };
    /**
	 * Return positions on a bézier curve
	 *
	 * @param    t        current time
	 * @param    points    points array
	 * @return
	 */
    Maths.bezierCasteljau = function(t, points) {
        var i, j;
        if (points.length == 1) {
            points = points[0];
        }
        var output = [];
        for (i = 0; i < points.length; i++) {
            output.push(new mf.geom.Vector2D(points[i].x, points[i].y));
        }
        for (i = 1; i < points.length; i++) {
            for (j = 0; j < points.length - i; j++) {
                output[j].x = (1 - t) * output[j].x + t * output[j + 1].x;
                output[j].y = (1 - t) * output[j].y + t * output[j + 1].y;
            }
        }
        return output[0];
    };
    /**
	 * Return the distance in meters between 2 coordinates
	 */
    Maths.geoDistance = function(lat1, long1, lat2, long2, radius) {
        if (typeof radius == "undefined") radius = 6378137;
        lat1 *= Math.PI / 180;
        long1 *= Math.PI / 180;
        lat2 *= Math.PI / 180;
        long2 *= Math.PI / 180;
        var i = Math.cos(lat1) * Math.cos(lat2) * Math.cos(long1) * Math.cos(long2) + Math.cos(lat1) * Math.sin(long1) * Math.cos(lat2) * Math.sin(long2) + Math.sin(lat1) * Math.sin(lat2);
        var j = Math.acos(i);
        if (isNaN(j)) {
            j = 0;
        }
        return radius * j;
    };
})(this);

(function(exports) {
    var mf = exports.mf = exports.mf || {};
    mf.dom = mf.dom || {};
    function Viewport() {}
    mf.dom.Viewport = Viewport;
    /**
	 * Determine if an element is in the visible viewport
	 *
	 * @param element
	 * @returns {boolean}
	 */
    Viewport.isInViewport = function(element) {
        var rect = element.getBoundingClientRect();
        var html = document.documentElement;
        return rect.top >= 0 && rect.left >= 0 && rect.bottom <= (window.innerHeight || html.clientHeight) && rect.right <= (window.innerWidth || html.clientWidth);
    };
})(this);

(function(exports, $) {
    var mf = exports.mf = exports.mf || {};
    mf.animation = mf.animation || {};
    /**
	 * TimeLine
	 *
	 * @param options :
	 * - length (in milli-seconds)
	 */
    function TimeLine(options) {
        this.options = $.extend({
            length: 1
        }, options);
        this.time = 0;
        this.length = this.options.length;
        this.easing = {
            easingFunction: mf.utils.Maths.easeOutQuad,
            // Easing function
            startTime: 0,
            // Start time
            duration: 0,
            // Easing duration
            startValue: 0,
            // Start value to ease from
            endValue: 0,
            // End value to ease to
            on: false
        };
    }
    mf.animation.TimeLine = TimeLine;
    TimeLine.TIME_CHANGED = "eventTimeChanged";
    TimeLine.PLAY = "eventPlay";
    TimeLine.STOP = "eventStop";
    /**
	 * (private) function used to interpolate time with requestAnimationFrame
	 */
    TimeLine.prototype.ease = function() {
        if (this.easing.on) {
            var t = Date.now() - this.easing.startTime;
            var d = this.easing.duration;
            if (t >= d) {
                this.easing.on = false;
                this.setTime(this.easing.endValue);
            } else {
                this.setTime(this.easing.easingFunction(t, this.easing.startValue, this.easing.endValue - this.easing.startValue, d));
                requestAnimationFrame(delegate(this.ease, this));
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
    TimeLine.prototype.moveToTime = function(t, options) {
        options = $.extend({
            duration: Math.min(1e3, Math.abs(t - this.time)),
            easing: mf.utils.Maths.easeOutQuad
        }, options);
        this.easing.startTime = Date.now();
        this.easing.duration = options.duration;
        this.easing.startValue = this.time;
        this.easing.endValue = t;
        this.easing.easingFunction = options.easing;
        if (!this.easing.on) {
            this.easing.on = true;
            requestAnimationFrame(delegate(this.ease, this));
        }
    };
    /**
	 * Set the time and trigger the TimeLine.TIME_CHANGED event
	 *
	 * @param t : time
	 */
    TimeLine.prototype.setTime = function(t) {
        if (t != this.time) {
            this.time = t;
            $(this).trigger(TimeLine.TIME_CHANGED);
        }
    };
    /**
	 * Start the playhead, linear time-based play
	 */
    TimeLine.prototype.play = function() {
        $(this).trigger(TimeLine.PLAY);
        this.moveToTime(this.length, {
            duration: this.length - this.time,
            easing: mf.utils.Maths.easeLinear
        });
    };
    /**
	 * Stop the playing
	 */
    TimeLine.prototype.stop = function(t) {
        if (typeof t != "undefined") {
            this.setTime(t);
        }
        $(this).trigger(TimeLine.STOP);
        this.easing.on = false;
    };
})(this, jQuery);

(function(exports, $) {
    var mf = exports.mf = exports.mf || {};
    mf.animation = mf.animation || {};
    /**
	 * ScrollLine
	 *
	 * @param options :
	 * - (inherited) length (in milli-seconds)
	 * - height : height of scroll, default 5000
	 * - touchEnabled : enable scroll simulation on touch devices : default false
	 * - touchHeight
	 */
    function ScrollLine(options) {
        delegate(mf.animation.TimeLine, this)(options);
        this.options = $.extend({
            touchEnabled: false,
            touchHeight: 700,
            height: 5e3,
            minScrollGap: 3
        }, this.options);
        this.time = 0;
        this.length = this.options.length;
        this.options.touchEnabled = this.options.touchEnabled && "ontouchstart" in document.documentElement;
        this.touch = {};
        if (this.options.touchEnabled) {
            console.log("Scrollline touch");
            document.addEventListener("touchstart", delegate(this.onTouchStart, this));
            document.addEventListener("touchmove", delegate(this.onTouchMove, this));
            document.addEventListener("touchend", delegate(this.onTouchEnd, this));
        } else {
            console.log("Scrollline scroll " + this.options.height);
            $("body").height(this.options.height);
            $(window).scroll(delegate(this.onScroll, this));
        }
    }
    mf.animation.ScrollLine = ScrollLine;
    ScrollLine.prototype = new mf.animation.TimeLine();
    /**
	 * Move playhead to time
	 *
	 * @param t : time
	 * @param options :
	 * - (inherited) duration in milliseconds : default 1000
	 * - (inherited) easing : easing function : default easeOutQuad
	 * - moveScrollbar: move the scrollbar to the requested value : default true
	 */
    ScrollLine.prototype.moveToTime = function(t, options) {
        options = $.extend({
            moveScrollbar: true
        }, options);
        delegate(mf.animation.TimeLine.prototype.moveToTime, this)(t, options);
        if (options.moveScrollbar && t != this.time) {
            this.updateScrollbar(t);
        }
    };
    /**
	 * Move scrollbar to time
	 *
	 * t: time
	 */
    ScrollLine.prototype.updateScrollbar = function(t) {
        var h = window.innerHeight || document.documentElement.clientHeight;
        $(window).scrollTop(Math.ceil((this.options.height - h) * (t / this.length)));
    };
    /**
	 * Start the playhead, linear time-based play
	 * Prevent moving the scrollbar
	 */
    ScrollLine.prototype.play = function() {
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
    ScrollLine.prototype.onScroll = function() {
        var h = window.innerHeight || document.documentElement.clientHeight;
        var t = Math.round(this.length * $(window).scrollTop() / (this.options.height - h));
        if (Math.abs(t - this.time) <= this.options.minScrollGap) {
            return;
        }
        this.moveToTime(t, {
            moveToTime: false
        });
    };
    /**
	 * React on touchstart event
	 *
	 * Starts the scroll simulation
	 */
    ScrollLine.prototype.onTouchStart = function(e) {
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
    ScrollLine.prototype.onTouchMove = function(e) {
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
    ScrollLine.prototype.onTouchEnd = function(e) {
        if (Math.abs(this.touch.lastDY) > this.options.minScrollGap) {
            var t = Math.max(0, Math.min(this.length, Math.round(this.time + this.length * (-10 * this.touch.lastDY / this.options.touchHeight))));
            this.moveToTime(t, false);
        }
    };
})(this, jQuery);

(function(exports, $) {
    var mf = exports.mf = exports.mf || {};
    mf.animation = mf.animation || {};
    /**
	 * Sequencer
	 */
    function Sequencer() {
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
    Sequencer.prototype.register = function(animation) {
        animation = $.extend({
            start: this.length,
            duration: 100,
            animate: undefined,
            animateIn: undefined,
            animateOut: undefined,
            started: false
        }, animation);
        this.animations.push(animation);
        this.length = Math.max(this.length, animation.start + animation.duration);
        return animation;
    };
    /**
	 * Process animations
	 */
    Sequencer.prototype.process = function(t) {
        var dt, animation;
        // Process Animate Out
        for (var i = 0, l = this.animations.length; i < l; i++) {
            animation = this.animations[i];
            dt = t - animation.start;
            if (animation.started && (dt < 0 || dt >= animation.duration)) {
                if (typeof animation.animateOut == "function") {
                    animation.animateOut(dt, animation.duration);
                }
                animation.started = false;
            }
        }
        // Process Animate In
        for (var i = 0, l = this.animations.length; i < l; i++) {
            animation = this.animations[i];
            dt = t - animation.start;
            if (!animation.started && dt >= 0 && dt < animation.duration) {
                if (typeof animation.animateIn == "function") {
                    animation.animateIn(dt, animation.duration);
                }
                animation.started = true;
            }
        }
        // Process Animate
        for (var i = 0, l = this.animations.length; i < l; i++) {
            animation = this.animations[i];
            dt = t - animation.start;
            if (dt >= 0 && dt < animation.duration) {
                if (typeof animation.animate == "function") {
                    animation.animate(dt, animation.duration);
                }
            }
        }
    };
})(this, jQuery);

(function(exports) {
    var mf = exports.mf = exports.mf || {};
    mf.geom = mf.geom || {};
    /**
	 * Constructor
	 */
    function Vector2D(x, y) {
        this.x = x;
        this.y = y;
    }
    mf.geom.Vector2D = Vector2D;
    var p = Vector2D.prototype;
    /**
	 * Add a Vector2D to this and return a new Vector2D as result
	 *
	 * @param    v
	 * @return
	 */
    p.addVector = function(v) {
        return new Vector2D(this.x + v.x, this.y + v.y);
    };
    /**
	 * Substract a Vector2D to this and return a new Vector2D as result
	 *
	 * @param    v
	 * @return
	 */
    Vector2D.prototype.substractVector = function(v) {
        return new Vector2D(this.x - v.x, this.y - v.y);
    };
    /**
	 * Multiply this by a number and return a new Vector2D as result
	 *
	 * @param    s
	 * @return
	 */
    Vector2D.prototype.multiply = function(s) {
        return new Vector2D(s * this.x, s * this.y);
    };
    /**
	 * The norm of the Vector2D
	 *
	 * @return
	 */
    Vector2D.prototype.norm = function() {
        return Math.sqrt(this.norm2());
    };
    /**
	 * The squared norm of the Vector2D
	 *
	 * @return
	 */
    Vector2D.prototype.norm2 = function() {
        return this.x * this.x + this.y * this.y;
    };
    /**
	 * Scalar product
	 *
	 * @param    v Vector2D
	 * @return
	 */
    Vector2D.prototype.scalarProduct = function(v) {
        return this.x * v.x + this.y * v.y;
    };
    /**
	 * Dot product
	 *
	 * @param    v
	 * @return
	 */
    Vector2D.prototype.dotProduct = function(v) {
        return this.x * v.y - this.y * v.x;
    };
    /****************************************************************************************************
	 * STATIC METHODS
	 ****************************************************************************************************/
    /**
	 * Intersection point between Vectors
	 *
	 * @param    o1    Vector1 Origin
	 * @param    v1    Vector1 Direction
	 * @param    o2    Vector2 Origin
	 * @param    v2    Vector2 Direction
	 *
	 * @return
	 */
    Vector2D.intersection = function(o1, v1, o2, v2) {
        return o1.addVector(v1.multiply(Vector2D.intersectionRatio(o1, v1, o2, v2)));
    };
    /**
	 * Intersection ratio (of the Vector1) between Vectors
	 *
	 * @param    o1    Vector1 Origin
	 * @param    v1    Vector1 Direction
	 * @param    o2    Vector2 Origin
	 * @param    v2    Vector2 Direction
	 *
	 * @return
	 */
    Vector2D.intersectionRatio = function(o1, v1, o2, v2) {
        return o2.substractVector(o1).dotProduct(v2) / v1.dotProduct(v2);
    };
    /**
	 * Orthogonal projection of a point on a Vector
	 *
	 * @param    a    Projected point
	 * @param    o    Vector Origin
	 * @param    v    Vector Direction
	 *
	 * @return
	 */
    Vector2D.projection = function(a, o, v) {
        return o.addVector(v.multiply(Vector2D.projectionRatio(a, o, v)));
    };
    /**
	 * Orthogonal projection ratio (of the Vector) of a point on a Vector
	 *
	 * @param    a    Projected point
	 * @param    o    Vector Origin
	 * @param    v    Vector Direction
	 *
	 * @return
	 */
    Vector2D.projectionRatio = function(a, o, v) {
        return v.scalarProduct(a.substractVector(o)) / v.norm2();
    };
    /**
	 * Intersection between a Vector and a Polygon
	 *
	 * @param    o        Vector Origin
	 * @param    v        Vector Direction
	 * @param    points    Polygon points
	 *
	 * @return    Object with 3 arrays
	 *    intersections    Intersections (2 max)
	 *    polyIn            Polygon containing the first point of the original polygon
	 *    polyOut            Polygon not containing the first point of the original polygon
	 */
    Vector2D.intersectPoly = function(o, v, points) {
        var polyIn = [];
        var polyOut = [];
        var intersections = [];
        var found = 0;
        for (var i = 0; i < points.length; i++) {
            var p1 = points[i];
            var p2 = points[(i + 1) % points.length];
            var p1p2 = p2.substractVector(p1);
            switch (found) {
              case 0:
              case 2:
                polyIn.push(p1);
                break;

              case 1:
                polyOut.push(p1);
                break;
            }
            var r = Vector2D.intersectionRatio(p1, p1p2, o, v);
            if (r >= 0 && r < 1 && found < 2) {
                found++;
                var intersection = p1.addVector(p1p2.multiply(r));
                intersections.push(intersection);
                polyIn.push(intersection);
                polyOut.push(intersection);
            }
        }
        return {
            intersections: intersections,
            polyIn: polyIn,
            polyOut: polyOut
        };
    };
})(this);

(function(exports) {
    var mf = exports.mf = exports.mf || {};
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
        this.r = 180 / Math.PI * (this.w / 360) / this.cosphi0;
    };
    GallCalculator.prototype.getXY = function(lat, lng) {
        var x = this.x0 + lng * (Math.PI / 180) * this.r * this.cosphi0;
        var y = this.y0 - this.r * (1 + this.cosphi0) * Math.tan(lat * (Math.PI / 180) / 2);
        return {
            x: x,
            y: y,
            lat: lat,
            lng: lng
        };
    };
    GallCalculator.prototype.getLatLng = function(x, y) {
        var lng = 360 / this.w * (x - this.x0);
        var lat = 180 / Math.PI * 2 * Math.atan((this.y0 - y) / (this.r * (1 + this.cosphi0)));
        return {
            x: x,
            y: y,
            lat: lat,
            lng: lng
        };
    };
})(this);

(function(exports) {
    var mf = exports.mf = exports.mf || {};
    mf.geom = mf.geom || {};
    mf.geom.projections = mf.geom.projections || {};
    /*
	 * MercatorCalculator Class
	 */
    var MercatorCalculator = function(x0, y0, width360) {
        this.w = width360;
        this.x0 = x0;
        this.y0 = y0;
    };
    mf.geom.projections.MercatorCalculator = MercatorCalculator;
    MercatorCalculator.prototype.getXY = function(lat, lng) {
        var x = this.x0 + this.w * lng / 360;
        var y = this.y0 - this.w / (2 * Math.PI) * Math.log(Math.tan(Math.PI / 4 + lat * (Math.PI / 180) / 2));
        return {
            x: x,
            y: y,
            lat: lat,
            lng: lng
        };
    };
    MercatorCalculator.prototype.getLatLng = function(x, y) {
        var lng = 360 / this.w * (x - this.x0);
        var lat = 180 / Math.PI * (2 * Math.atan(Math.exp((this.y0 - y) * (2 * Math.PI) / this.w)) - Math.PI / 2);
        return {
            x: x,
            y: y,
            lat: lat,
            lng: lng
        };
    };
})(this);

(function(exports) {
    var mf = exports.mf = exports.mf || {};
    mf.utils = mf.utils || {};
    function lpad(str, size, char) {
        if (typeof char === "undefined") {
            char = "0";
        }
        while (str.length < size) {
            str = char + str;
        }
        return str;
    }
    /**
	 * Constructor
	 */
    function Color(r, g, b) {
        this.r = Math.max(0, Math.min(255, Math.round(r)));
        this.g = Math.max(0, Math.min(255, Math.round(g)));
        this.b = Math.max(0, Math.min(255, Math.round(b)));
    }
    mf.utils.Color = Color;
    /**
	 * Return HTML Hex code for color
	 *
	 * @returns {string}
	 */
    Color.prototype.toHTML = function() {
        return "#" + lpad(this.r.toString(16), 2) + lpad(this.g.toString(16), 2) + lpad(this.b.toString(16), 2);
    };
    /**
	 * Desaturate color
	 *
	 * @param ratio (0 - 1)
	 * @returns {Color}
	 */
    Color.prototype.desaturate = function(ratio) {
        var rwgt = .3086;
        var gwgt = .6094;
        var bwgt = .082;
        var r = (1 - ratio + ratio * rwgt) * this.r + ratio * gwgt * this.g + ratio * bwgt * this.b;
        var g = ratio * rwgt * this.r + (1 - ratio + ratio * gwgt) * this.g + ratio * bwgt * this.b;
        var b = ratio * rwgt * this.r + ratio * gwgt * this.g + (1 - ratio + ratio * bwgt) * this.b;
        return new Color(r, g, b);
    };
    /**
	 * Return a Color from HSB values
	 *
	 * @param    h    (0 - 360)
	 * @param    s    (0 - 100)
	 * @param    v    (0 - 100)
	 * @return
	 */
    Color.hsb = function(h, s, v) {
        var r = 0, g = 0, b = 0;
        h = h % 360;
        s /= 100;
        v /= 100;
        h /= 60;
        var i = Math.floor(h);
        var f = h - i;
        var p = v * (1 - s);
        var q = v * (1 - s * f);
        var t = v * (1 - s * (1 - f));
        if (i == 0) {
            r = v;
            g = t;
            b = p;
        } else if (i == 1) {
            r = q;
            g = v;
            b = p;
        } else if (i == 2) {
            r = p;
            g = v;
            b = t;
        } else if (i == 3) {
            r = p;
            g = q;
            b = v;
        } else if (i == 4) {
            r = t;
            g = p;
            b = v;
        } else if (i == 5) {
            r = v;
            g = p;
            b = q;
        }
        r = Math.floor(r * 255);
        g = Math.floor(g * 255);
        b = Math.floor(b * 255);
        return new Color(r, g, b);
    };
    /**
	 * deprecated function name
	 *
	 * @type {Function}
	 */
    Color.prototype.getNBTransform = Color.prototype.desaturate;
})(this);