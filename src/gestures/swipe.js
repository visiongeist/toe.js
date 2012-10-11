(function (gestures, state, calc) {

    var config = {
            swipe_time: 300,
            swipe_min_distance: 30
        };

    /**
     *
     * @param {jQuery.Event} event
        */
    function swipe(event)
    {
        var duration = new Date().getTime() - state.timestamp,
            angle,
            direction,
            distance;

        if(!state.touches.move) {
            return;
        }

        distance = calc.getDistance(state.touches.start[0], state.touches.move[0]);
        if((config.swipe_time > duration) && (distance > config.swipe_min_distance)) {

            angle = calc.getAngle(state.touches.start[0], state.touches.move[0]);
            direction = calc.getDirection(angle);

            state.gesture = 'swipe';
            $(event.target).trigger($.Event('swipe', {
                originalEvent   : event.originalEvent,
                direction       : direction
            }));
        }
    }

    gestures.add('end', 'swipe', swipe);

}(gestures, state, calc));