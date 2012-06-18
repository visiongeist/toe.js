(function ($, toe, window, undefined) {
    var config = toe.config = $.extend(toe.config, {
            swipe_time: 300,
            swipe_min_distance: 30
        }),
        state = toe.state,
        gestures = toe.gestures;

    /**
     *
     * @param event
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

        distance = toe.calculateDistance(state.touches.start[0], state.touches.move[0]);
        if((config.swipe_time > duration) && (distance > config.swipe_min_distance)) {

            angle = toe.getAngle(state.touches.start[0], state.touches.move[0]);
            direction = toe.getDirection(angle);

            state.gesture = 'swipe';
            $(event.target).trigger($.Event('swipe', {
                originalEvent   : event.originalEvent,
                direction       : direction
            }));
        }
    }

    toe.add('end', 'swipe', swipe);

}(jQuery, toe, this));