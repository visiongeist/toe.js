(function ($, toe, window, undefined) {
    var config = toe.config = $.extend(toe.config, {
            tap_double_max_interval: 300,
            tap_max_distance: 10,
            tap_distance: 20,

            hold_timeout: 500
        }),
        state = toe.state,
        gestures = toe.gestures,
        distance,
        prevTapPos,
        prevTapEndTime,
        holdTimer;

    /**
     *
     * @param event
     * @return {*}
     */
    function tap(event)
    {
        var timestamp = new Date().getTime(),
            duration = timestamp - state.timestamp,
            $target = $(event.target);

        if(config.hold_timeout < duration) { // if the hold was already fired do not fire a tap
            return;
        }

        if(!doubletap(event)) {
            distance = state.touches.move ? toe.calculateDistance(state.touches.start[0], state.touches.move[0]) : 0;

            if(distance < config.tap_max_distance) {
                state.gesture = 'tap';
                prevTapEndTime = timestamp;
                prevTapPos = state.touches.start;

                if($target.data('events').doubletap) { // doubletap event is bound to the target

                    setTimeout(function() { // the tap event will be delayed because there might be a double tap
                        if(prevTapPos && state.prevGesture === 'tap' && (state.timestamp - prevTapEndTime) < config.tap_double_max_interval) {
                            $target.trigger($.Event('tap', {
                                originalEvent: state.events.start.originalEvent
                            }));
                        }
                    }, config.tap_double_max_interval + 1);
                } else {

                    $target.trigger($.Event('tap', {
                        originalEvent: state.events.start.originalEvent
                    }));
                }
            }
        }
    }

    function doubletap(event) {
        if (prevTapPos && state.prevGesture === 'tap' && (state.timestamp - prevTapEndTime) < config.tap_double_max_interval)
        {
            if(prevTapPos && state.touches.start && (toe.calculateDistance(prevTapPos[0], state.touches.start[0]) < config.tap_distance)) {

                state.gesture = 'doubletap';
                prevTapEndTime = null;

                $(event.target).trigger($.Event('doubletap', {
                    originalEvent: state.events.start.originalEvent
                }));

                return true;
            }
        }
        return false;
    }

    function taphold(event)
    {
        state.gesture = 'taphold';
        clearTimeout(holdTimer);

        holdTimer = setTimeout(function() {
            if(state.gesture === 'taphold') {
                $(event.target).trigger($.Event('taphold', {
                    originalEvent: state.events.start.originalEvent
                }));
            }
        }, config.hold_timeout);

    }

    toe.add('end', 'tap', tap);
    toe.add('start', 'taphold', taphold);

}(jQuery, toe, this));