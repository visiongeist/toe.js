(function ($, touch, window, undefined) {

    var namespace = 'transform', cfg = {
            scale: 0.1, // minimum
            rotation: 15
        },
        started;

    touch.track(namespace, {
        touchstart: function (event, state, start) {
            started = false;
            state[namespace] = {
                start: start,
                move: []
            };
        },
        touchmove: function (event, state, move) {
            var opt = $.extend(cfg, event.data);

            if (move.point.length !== 2) {
                return;
            }

            state[namespace].move.push(move);

            if (state[namespace].start.point.length !== 2 && move.point.length === 2) { // in case the user failed to start with 2 fingers
                state[namespace].start = $.extend({}, move);
            }

            state[namespace].rotation = touch.calc.getRotation(state[namespace].start, move);
            state[namespace].scale = touch.calc.getScale(state[namespace].start, move);

            if (Math.abs(1 - state[namespace].scale) > opt.scale || Math.abs(state[namespace].rotation) > opt.rotation) {
                if (!started) {
                    $(event.target).trigger($.Event('transformstart', state[namespace]));
                    started = true;
                }

                $(event.target).trigger($.Event('transform', state[namespace]));
            }
        },
        touchend: function (event, state, end) {
            if (started) {
                started = false;

                if (end.point.length !== 2) { // in case the user failed to end with 2 fingers
                    state.end = $.extend({}, state[namespace].move[state[namespace].move.length - 1]);
                }

                state[namespace].rotation = touch.calc.getRotation(state[namespace].start, state.end);
                state[namespace].scale = touch.calc.getScale(state[namespace].start, state.end);

                $(event.target).trigger($.Event('transformend', state[namespace]));
            }
        }
    });

}(jQuery, jQuery.toe, this));