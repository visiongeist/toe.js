(function ($, touch, window, undefined) {

    var namespace = 'tap', cfg = {
        distance: 10,
        duration: 300,
        finger: 1
    };

    touch.track(namespace, {
        touchstart: function (event, state, start) {
            state[namespace] = {
                finger: start.point.length
            };
            var $target = $(event.target);
            $target.data('touched', true);
            setTimeout(function() {
                $target.data('touched', false);
            }, 350);
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

            // check if the tap was valid
            if (duration < opt.duration && distance < opt.distance) {
                // fire if the amount of fingers match
                if (state[namespace].finger === opt.finger) {
                    $(event.target).trigger(
                        $.Event(namespace, touch.addEventParam(state.start, state[namespace]))
                    );
                }
            }
            // this comes from jquery.event.tap (https://github.com/stephband/jquery.event.tap)
            // Android only cancels mouse events if preventDefault has been
            // called on touchstart. We can't do that. That stops scroll and other
            // gestures. Pants. Also, the default Android browser sends simulated
            // mouse events whatever you do. These browsers have something in common:
            // their touch identifiers are always 0.
            if (!state.amputateFlag && (event.originalEvent.changedTouches[0].identifier === 0)) {
                state.amputateFlag = true;
                var killEvent = function(event) {
                    if ($(event.target).data('touched')) {
                        if (event.type === 'click') {
                            $(event.target).data('touched', false);
                        }
                        return true;
                    } else {
                        //this is not working properly for contenteditables
                        event.stopPropagation();
                        event.stopImmediatePropagation();
                        event.preventDefault();
                    }

                };
                // It's extreme, but stopping simulated events in the capture phase is one
                // way of getting dumb browsers to appear not to emit them.
                document.addEventListener('mousedown', killEvent, true);
                document.addEventListener('mousemove', killEvent, true);
                document.addEventListener('mouseup', killEvent, true);
                document.addEventListener('click', killEvent, true);
            }
        }
    });

}(jQuery, jQuery.toe, this));