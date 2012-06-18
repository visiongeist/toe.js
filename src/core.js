(function ($, toe, window, undefined) {

    var isTouch = !!('ontouchstart' in window) ? 1 : 0;

    toe.config = {};

    function touchstart(event) {
        var $target = $(event.target),
            state = toe.state;

        toe.clearState();

        state.touches.start = toe.getTouches(event);
        state.events.start = event;
        state.timestamp = new Date().getTime();

        state.events.start = event;

        state.offset = $target.offset();

        toe.exec('start', event);
    }

    function touchmove(event) {
        var state = toe.state;

        if(!state.timestamp) {
            return;
        }

        state.touches.move = toe.getTouches(event);
        state.events.move = event;

        toe.exec('move', event);
    }

    function touchend(event) {
        var state = toe.state;

        if(!state.timestamp) {
            return;
        }

        state.touches.end = toe.getTouches(event);
        state.events.end = event;

        toe.exec('end', event);

        state.prevGesture = state.gesture;
        toe.clearState();
    }

    if (isTouch) { // event binding will just work on touch devices
        $.each(['taphold'/*,'tap','doubletap','transformstart','transform','transformend','swipe'*/], function (i, event) {
            $.event.special[event] = {


                setup: function(data, namespaces, eventHandler) {
                    //TODO avoid double binding

                    $(this).on('touchstart', $.proxy(touchstart, this));
                    $(this).on('touchmove', $.proxy(touchmove, this));
                    $(this).on('touchend touchcancel', $.proxy(touchend, this));
                }
            };
        });
    }

}(jQuery, toe, this));