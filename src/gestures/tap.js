(function ($, touch, window, undefined) {

    $.event.special.tap = (function () {

        var cfg = {
                distance: 10,
                duration: 300,
                finger: 1
            };

        return touch.track({
            touchstart: function (event, state, start) {
                state.finger = start.point.length;
            },
            touchmove: function (event, state, move) {
                // if another finger was used then increment the amount of fingers used
                state.finger = move.point.length > state.finger ? move.point.length : state.finger;
            },
            touchend: function (event, state, end) {
                var opt = $.extend(cfg, event.data), 
                    duration,
                    distance;

                // calc
                duration = touch.calc.getDuration(state.start, end);
                distance = touch.calc.getDistance(state.start.point[0], end.point[0]);

                // check if the tap was valid
                if (duration < opt.duration && distance < opt.distance) {
                    // fire if the amount of fingers match
                    if (state.finger === opt.finger) {
                        $(event.target).trigger($.Event('tap', state));
                    }
                }
            }
        });
    }());

}(jQuery, jQuery.toe, this));