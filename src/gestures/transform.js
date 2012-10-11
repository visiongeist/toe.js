(function (gestures, state, calc) {

    var config = {
            scale_treshold     : 0.1,
            rotation_treshold  : 15 // °
        },
        started = false,
        center;

    /**
     *
     * @param {jQuery.Event} event
     */
    function transform(event)
    {
        var rotation,
            scale,
            $target = $(event.target);

        if(state.touches.move.length !== 2) {
            return;
        }

        rotation = calc.getRotation(state.touches.start, state.touches.move);
        scale = calc.getScale(state.touches.start, state.touches.move);

        if(state.gesture === 'transform' || Math.abs(1-scale) > config.scale_treshold || Math.abs(rotation) > config.rotation_treshold) {
            state.gesture = 'transform';

            center = {  pageX: ((state.touches.move[0].pageX + state.touches.move[1].pageX) / 2) - state.offset.left,
                pageY: ((state.touches.move[0].pageY + state.touches.move[1].pageY) / 2) - state.offset.top };

            if(!started) {
                $target.trigger($.Event('transformstart', {
                    originalEvent: event.originalEvent,
                    center: center,
                    scale: scale,
                    rotation: rotation
                }));
                started = true;
            }

            $target.trigger($.Event('transform', {
                originalEvent: event.originalEvent,
                center: center,
                scale: scale,
                rotation: rotation
            }));
        }
    }

    /**
     *
     * @param {jQuery.Event} event
     */
    function transformend(event)
    {
        var rotation,
            scale,
            $target = $(event.target);

        if(state.gesture === 'transform') {
            rotation = calc.getRotation(state.touches.start, state.touches.move);
            scale = calc.getScale(state.touches.start, state.touches.move);

            $target.trigger($.Event('transformend', {
                originalEvent: event.originalEvent,
                center: center,
                scale: scale,
                rotation: rotation
            }));

            started = false;
        }
    }

    gestures.add('move', 'transform', transform);
    gestures.add('end', 'transformend', transformend);

}(gestures, state, calc));