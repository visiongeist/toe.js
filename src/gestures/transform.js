(function ($, touch, window, undefined) {

    $.event.special.transform = (function () {

        var cfg = {
                scale: 0.1, // minimum
                rotation: 15
            },
            started;

        return touch.track({
            touchstart: function (event, state, start) {
                started = false;
            },
            touchmove: function (event, state, move) {
                var opt = $.extend(cfg, event.data);
                
                if (move.point.length !== 2) {
                    state.move.pop();
                    return;
                }

                if (state.start.point.length !== 2 && move.point.length === 2) { // in case the user failed to start with 2 fingers
                    state.start = $.extend({}, move);
                }

                state.rotation = touch.calc.getRotation(state.start, move);
                state.scale = touch.calc.getScale(state.start, move);

                if (Math.abs(1-state.scale) > opt.scale || Math.abs(state.rotation) > opt.rotation) {
                    if(!started) {
                        $(event.target).trigger($.Event('transformstart', state));
                        started = true;
                    }

                    $(event.target).trigger($.Event('transform', state));
                }
            },
            touchend: function (event, state, end) {
                if(started) {
                    started = false;

                    if (end.point.length !== 2) { // in case the user failed to start with 2 fingers
                        state.end = $.extend({}, state.move[state.move.length - 1]);
                    }

                    state.rotation = touch.calc.getRotation(state.start, state.end);
                    state.scale = touch.calc.getScale(state.start, state.end);

                    $(event.target).trigger($.Event('transformend', state));
                }
            }
        });
    }());

}(jQuery, jQuery.toe, this));