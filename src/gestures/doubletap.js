(function ($, touch, window, undefined) {

    var clientWidth = document.documentElement.clientWidth;
    var clientHeight = document.documentElement.clientHeight;
    var averageScreenLength = Math.sqrt(clientWidth * clientHeight);
    var relativeDistance = (2 / 100) * averageScreenLength;

    var previousTouch = {timestamp: 0, point: null};

    var namespace = 'doubletap', cfg = {
        distance: 80,
        duration: 500,
        interval: 600,
        finger: 1
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

            // check if the tap was valid
            if (duration < opt.duration && distance < opt.distance) {
                // fire if the amount of fingers match

                if (state[namespace].finger === opt.finger) {

                    var currentTime = new Date();
                    var timeDelta = null;
                    var touchPointDelta = null;

                    if (previousTouch.timestamp < currentTime.getTime()) {
                        timeDelta = currentTime.getTime() - previousTouch.timestamp;
                    }

                    if (previousTouch.point != null) {
                        touchPointDelta = touch.calc.getDistance(previousTouch.point, end.point[0]);
                    }

                    if (timeDelta != null && touchPointDelta != null) {
                        if (timeDelta > 0 && timeDelta < opt.interval && distance < opt.distance) {
                            $(event.target).trigger(
                                $.Event(namespace, touch.addEventParam(state.start, state[namespace]))
                            );
                        }
                    }

                    previousTouch.timestamp = currentTime.getTime();
                    previousTouch.point = end.point[0];
                }
            }
        }
    });

}(jQuery, jQuery.toe, this));
