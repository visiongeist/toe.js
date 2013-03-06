(function ($, touch, window, undefined) {

    $.event.special.taphold = (function () {

        var timer,
            abort,
            cfg = {
                distance: 20,
                duration: 500,
                finger: 1
            };

        return touch.track({
            touchstart: function (event, state, start) {
                var opt = $.extend(cfg, event.data);

                abort = false;
                state.finger = start.point.length;

                clearTimeout(timer);
                timer = setTimeout(function () {
                    if (!abort) { 
                        if (state.finger === opt.finger) {
                            $(event.target).trigger($.Event('taphold', state));
                        }
                    }
                }, opt.duration);
            },
            touchmove: function (event, state, move) {
                var opt = $.extend(cfg, event.data),
                    distance;

                // if another finger was used then increment the amount of fingers used
                state.finger = move.point.length > state.finger ? move.point.length : state.finger;

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
    }());

}(jQuery, jQuery.toe, this));