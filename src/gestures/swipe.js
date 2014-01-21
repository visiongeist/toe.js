(function ($, touch, window, undefined) {

    var namespace = 'swipe', cfg = {
        distance: 40, // minimum
        duration: 1200, // maximum
        direction: 'all'
    };

    touch.track(namespace, {
        touchstart: function (event, state, start) {
            state[namespace] = {
                finger: start.point.length
            };
        },
        touchmove: function (event, state, move) {
            // if another finger was used then increment the amount of fingers used
            state[namespace].finger = move.point.length > state[namespace].finger ? move.point.length : state[namespace].finger;
        },
        touchend: function (event, state, end) {
            var opt = $.extend(cfg, event.data),
                duration,
                distance;

            // calc
            duration = touch.calc.getDuration(state.start, end);
            distance = touch.calc.getDistance(state.start.point[0], end.point[0]);

            // check if the swipe was valid
            if (duration < opt.duration && distance > opt.distance) {

                state[namespace].angle = touch.calc.getAngle(state.start.point[0], end.point[0]);
                state[namespace].direction = touch.calc.getDirection(state[namespace].angle);

                // fire if the amount of fingers match
                if (opt.direction === 'all' || state[namespace].direction === opt.direction) {
                    $(event.target).trigger($.Event(namespace, touch.addEventParam(state.start, state[namespace])));
                }
            }
        }
    });

}(jQuery, jQuery.toe, this));