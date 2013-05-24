(function ($, touch, window, undefined) {

    var timer, abort,
        namespace = 'taphold', cfg = {
            distance: 20,
            duration: 500,
            finger: 1
        };

    touch.track(namespace, {
        touchstart: function (event, state, start) {
            var opt = $.extend(cfg, event.data);

            abort = false;
            state[namespace] = {
                finger: start.point.length
            };

            clearTimeout(timer);
            timer = setTimeout(function () {
                if (!abort && touch.active) {
                    if (state[namespace].finger === opt.finger) {
                        $(event.target).trigger($.Event(namespace, touch.addEventParam(start, state[namespace])));
                    }
                }
            }, opt.duration);
        },
        touchmove: function (event, state, move) {
            var opt = $.extend(cfg, event.data),
                distance;

            // if another finger was used then increment the amount of fingers used
            state[namespace].finger = move.point.length > state[namespace].finger ? move.point.length : state[namespace].finger;

            // calc
            distance = touch.calc.getDistance(state.start.point[0], move.point[0]);
            if (distance > opt.distance) { // illegal move
                abort = true;
            }
        },
        touchend: function (event, state, end) {
            abort = true;
            clearTimeout(timer);
        }
    });

}(jQuery, jQuery.toe, this));