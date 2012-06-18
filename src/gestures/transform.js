(function ($, toe, window, undefined) {
    var config = toe.config = $.extend(toe.config, {
            scale_treshold     : 0.1,
            rotation_treshold  : 15 // °
        }),
        state = toe.state,
        gestures = toe.gestures,
        started = false;

    /**
     *
     * @param event
     * @return {Boolean}
     */
    function transform(event)
    {
        var rotation,
            scale,
            $target = $(event.target);

        if(state.touches.move.length !== 2) {
            return;
        }

        rotation = toe.calculateRotation(state.touches.start, state.touches.move);
        scale = toe.calculateScale(state.touches.start, state.touches.move);

        if(state.gesture === 'transform' || Math.abs(1-scale) > config.scale_treshold || Math.abs(rotation) > config.rotation_treshold) {
            state.gesture = 'transform';

            state.touches.center = {  x: ((state.touches.move[0].pageX + state.touches.move[1].pageX) / 2) - state.offset.left,
                y: ((state.touches.move[0].pageY + state.touches.move[1].pageY) / 2) - state.offset.top };

            if(!started) {
                $target.trigger($.Event('transformstart', {
                    originalEvent: event.originalEvent,
                    center: state.touches.center,
                    scale: scale,
                    rotation: rotation
                }));
                started = true;
            }

            $target.trigger($.Event('transform', {
                originalEvent: event.originalEvent,
                center: state.touches.center,
                scale: scale,
                rotation: rotation
            }));
        }
    }

    function transformend(event)
    {
        var rotation,
            scale,
            $target = $(event.target);

        if(state.gesture === 'transform') {
            rotation = toe.calculateRotation(state.touches.start, state.touches.move);
            scale = toe.calculateScale(state.touches.start, state.touches.move);

            $target.trigger($.Event('transformend', {
                originalEvent: event.originalEvent,
                center: state.touches.center,
                scale: scale,
                rotation: rotation
            }));

            started = false;
        }
    }

    toe.add('move', 'transform', transform);
    toe.add('end', 'transformend', transformend);
}(jQuery, toe, this));