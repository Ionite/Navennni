angular.module('starter.directives', [], function() {})

/**
 * When window resizes, this directive calls .onWindowResize() 
 * on the scope where this diretive is used.
 */
.directive('onWindowResize', ['$window', function($window) {
	return {
		link: function(scope, elem, attrs) {
			angular.element($window).bind('resize', function() {
				scope.onWindowResize();
				scope.$apply();
			})
		}
	}
}])

/* -- ng-x etc. for SVG and angular binding -- */
.directive('ngX', function() {
	return function(scope, elem, attrs) {
		attrs.$observe('ngX', function(x) {
			elem.attr('x', x);
		});
	};
})
.directive('ngY', function() {
	return function(scope, elem, attrs) {
		attrs.$observe('ngY', function(y) {
			elem.attr('y', y);
		});
	};
})
.directive('ngWidth', function() {
	return function(scope, elem, attrs) {
		attrs.$observe('ngWidth', function(width) {
			elem.attr('width', width);
		});
	};
})
.directive('ngHeight', function() {
	return function(scope, elem, attrs) {
		attrs.$observe('ngHeight', function(height) {
			elem.attr('height', height);
		});
	};
})
/* -- ellipse -- */
.directive('ngCx', function() {
	return function(scope, elem, attrs) {
		attrs.$observe('ngCx', function(x) {
			elem.attr('cx', x);
		});
	};
})
.directive('ngCy', function() {
	return function(scope, elem, attrs) {
		attrs.$observe('ngCy', function(y) {
			elem.attr('cy', y);
		});
	};
})
.directive('ngRx', function() {
	return function(scope, elem, attrs) {
		attrs.$observe('ngRx', function(x) {
			elem.attr('rx', x);
		});
	};
})
.directive('ngRy', function() {
	return function(scope, elem, attrs) {
		attrs.$observe('ngRy', function(y) {
			elem.attr('ry', y);
		});
	};
})
/* -- fill and stroke -- */
.directive('ngFill', function() {
	return function(scope, elem, attrs) {
		attrs.$observe('ngFill', function(fill) {
			elem.attr('fill', fill);
		});
	};
})
.directive('ngStroke', function() {
	return function(scope, elem, attrs) {
		attrs.$observe('ngStroke', function(stroke) {
			elem.attr('stroke', stroke);
		});
	};
})
.directive('ngStrokeWidth', function() {
	return function(scope, elem, attrs) {
		attrs.$observe('ngStrokeWidth', function(strokeWidth) {
			elem.attr('stroke-width', strokeWidth);
		});
	};
})
.directive('ngStrokeDasharray', function() {
	return function(scope, elem, attrs) {
		attrs.$observe('ngStrokeDasharray', function(strokeDasharray) {
			elem.attr('stroke-dasharray', strokeDasharray);
		});
	};
})
/* -- x1, y1, x2, y2 for eg. <line> -- */
.directive('ngX1', function() {
	return function(scope, elem, attrs) {
		attrs.$observe('ngX1', function(x1) {
			elem.attr('x1', x1);
		});
	};
})
.directive('ngY1', function() {
	return function(scope, elem, attrs) {
		attrs.$observe('ngY1', function(y1) {
			elem.attr('y1', y1);
		});
	};
})
.directive('ngX2', function() {
	return function(scope, elem, attrs) {
		attrs.$observe('ngX2', function(x2) {
			elem.attr('x2', x2);
		});
	};
})
.directive('ngY2', function() {
	return function(scope, elem, attrs) {
		attrs.$observe('ngY2', function(y2) {
			elem.attr('y2', y2);
		});
	};
})
/* -- transform -- */
.directive('ngTransform', function() {
	return function(scope, elem, attrs) {
		attrs.$observe('ngTransform', function(transform) {
			elem.attr('transform', transform);
		});
	};
})

;
