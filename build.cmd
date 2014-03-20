:: dir /s /b /o:gn
@echo off
set files=mf\core\Core.js mf\utils\Maths.js mf\dom\Viewport.js mf\animation\TimeLine.js mf\animation\ScrollLine.js mf\animation\Sequencer.js mf\geom\Vector2D.js mf\geom\projections\Gall.js mf\geom\projections\Mercator.js mf\utils\Color.js

uglifyjs -m -o mf.min.js %files% & uglifyjs -b --comments all -o mf.js %files%
