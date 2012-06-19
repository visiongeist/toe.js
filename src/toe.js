require(['util', 'state', 'gestures'], function (util, state, gestures) {

    var isTouch = !!('ontouchstart' in window) ? 1 : 0,
        gesture;

    function touchstart(event) {
        var $target = $(event.target);

        state.clearState();

        state.touches.start = util.getTouches(event);
        state.events.start = event;
        state.timestamp = new Date().getTime();

        state.events.start = event;

        state.offset = $target.offset();

        gestures.exec('start', event);
    }

    function touchmove(event) {
        if(!state.timestamp) {
            return;
        }

        state.touches.move = util.getTouches(event);
        state.events.move = event;

        gestures.exec('move', event);
    }

    function touchend(event) {
        if(!state.timestamp) {
            return;
        }

        state.touches.end = util.getTouches(event);
        state.events.end = event;

        gestures.exec('end', event);

        state.prevGesture = state.gesture;
        state.clearState();
    }

    if (isTouch) { // event binding will just work on touch devices

        /*for (i = 0; i < gestures[timing].length; i++) {
            gestures[timing][i].func(event);
        }*/


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

});