(function ($, touch, window, undefined) {

    var namespace = 'drag', cfg = {
        distance: 20, // minimum
        direction: 'all'
    };

    var previousPoint = {x: 0, y: 0};
    var isDragging = false;

    touch.track(namespace, {
        touchstart: function (event, state, start) {
            state[namespace] = {
                finger: start.point.length
            };
            previousPoint.x = start.point[0].x;
            previousPoint.y = start.point[0].y;
            isDragging = false;
        },
        touchmove: function (event, state, move) {
            var opt = $.extend(cfg, event.data);

            // if another finger was used then increment the amount of fingers used
            state[namespace].finger = move.point.length > state[namespace].finger ? move.point.length : state[namespace].finger;
            state[namespace].distance = touch.calc.getDistance(state.start.point[0], move.point[0]);
            state[namespace].angle = touch.calc.getAngle(state.start.point[0], move.point[0]);
            state[namespace].direction = touch.calc.getDirection(state[namespace].angle);
            state[namespace].deltaX = move.point[0].x - previousPoint.x;
            state[namespace].deltaY = move.point[0].y - previousPoint.y;

            previousPoint.x = move.point[0].x;
            previousPoint.y = move.point[0].y;

            if (state[namespace].distance > opt.distance) {
                if (!isDragging) {
                    $(event.target).trigger($.Event(namespace+"start", touch.addEventParam(state.start)));
                    isDragging = true;
                }
                $(event.target).trigger($.Event(namespace, touch.addEventParam(move, state[namespace])));
            }

        },
        touchend: function (event, state, end) {
            previousPoint.x = 0;
            previousPoint.y = 0;         
            if (isDragging) {
                $(event.target).trigger($.Event(namespace+"stop", touch.addEventParam(end)));
                isDragging = false;
            }
        }
    });

}(jQuery, jQuery.toe, this));
