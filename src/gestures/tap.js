(function (gestures, state, calc, util) {

    var config = {
            tap_double_max_interval: 300,
            tap_max_distance: 10,
            tap_distance: 20,

            hold_timeout: 500
        },
        distance,
        prevTapPos,
        prevTapEndTime,
        holdTimer;

    /**
     *
     * @param {jQuery.Event} event
     */
    function tap(event)
    {
        var timestamp = new Date().getTime(),
            duration = timestamp - state.timestamp,
            $target = $(event.target);

        if (config.hold_timeout < duration) { // if the hold was already fired do not fire a tap
            return;
        }

        event = state.events.start.originalEvent;

        if (!doubletap(event)) {
            distance = state.touches.move ? calc.getDistance(state.touches.start[0], state.touches.move[0]) : 0;

            if (distance < config.tap_max_distance) {
                state.gesture = 'tap';

                prevTapEndTime = timestamp;
                prevTapPos = state.touches.start;

                if (util.hasEvent($target, 'doubletap')) { // doubletap event is bound to the target
                    setTimeout(function() { // the tap event will be delayed because there might be a double tap
                        if(prevTapPos && state.prevGesture !== 'doubletap' && ((new Date().getTime() - prevTapEndTime) > config.tap_double_max_interval)) {
                            $target.trigger($.Event('tap', {
                                originalEvent: event
                            }));
                        }
                    }, config.tap_double_max_interval);
                } else {
                    $target.trigger($.Event('tap', {
                        originalEvent: event
                    }));
                }
            }
        }
    }

    /**
     *
     * @param {jQuery.Event} event
     * @return {Boolean} true if doubletap was recognized
     */
    function doubletap(event) {
        if (prevTapPos && state.prevGesture === 'tap' && (state.timestamp - prevTapEndTime) < config.tap_double_max_interval)
        {
            if (prevTapPos && state.touches.start && (calc.getDistance(prevTapPos[0], state.touches.start[0]) < config.tap_distance)) {

                state.gesture = 'doubletap';
                prevTapEndTime = null;

                $(event.target).trigger($.Event('doubletap', {
                    originalEvent: event
                }));

                return true;
            }
        }
        return false;
    }

    /**
     *
     * @param {jQuery.Event} event
     */
    function taphold(event)
    {
        state.gesture = 'taphold';
        clearTimeout(holdTimer);

        holdTimer = setTimeout(function() {
            if (state.touches.start && !state.touches.end) { // touch event already completed
                distance = state.touches.move ? calc.getDistance(state.touches.start[0], state.touches.move[0]) : 0;

                if (distance < config.tap_max_distance && state.gesture === 'taphold') {
                    $(event.target).trigger($.Event('taphold', {
                        originalEvent: state.events.start ? state.events.start.originalEvent : event.originalEvent
                    }));
                }
            }
        }, config.hold_timeout);

    }

    gestures.add('end', 'tap', tap);
	gestures.add('none', 'doubletap', $.noop);
    gestures.add('start', 'taphold', taphold);

}(gestures, state, calc, util));