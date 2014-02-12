/*!
 * toe.js
 * version 3.0.5
 * author: Damien Antipa
 * https://github.com/dantipa/toe.js
 */
(function ($, window, undefined) {

    var state,
        gestures = {},
        isTouch = 'ontouchstart' in window,
        touch = { /** @lends $.toe */

            /**
             * flag to indicate if the touch handling is
             * @type {Boolean}
             */
            active: false,

            /**
             * turns on the tracking of touch events
             * will implicitly be called when including
             */
            on: function () {
                $(document).on('touchstart MSPointerDown pointerdown', touchstart)
                    .on('touchmove MSPointerMove MSPointerHover pointermove', touchmove)
                    .on('touchend touchcancel MSPointerUp MSPointerCancel pointerup pointercancel', touchend);

                touch.active = true;
            },

            /**
             * turns off the tracking of touch events
             */
            off: function () {
                $(document).off('touchstart MSPointerDown pointerdown', touchstart)
                    .off('touchmove MSPointerMove MSPointerHover pointermove ', touchmove)
                    .off('touchend touchcancel MSPointerUp MSPointerCancel pointerup pointercancel', touchend);

                touch.active = false;
            },

            /**
             * track new gesture
             *
             * @param  {String} namespace for the gesture
             * @param  {Object} gesture handlers for the touch events
             * @param  {Function} gesture.touchstart
             * @param  {Function} gesture.touchmove
             * @param  {Function} gesture.touchend
             */
            track: function (namespace, gesture) {
                gestures[namespace] = gesture;
            },

            /**
             * returns normalized event parameters
             * @param  {Event} event
             * @param  {Object} extra additional parameters to add
             * @return {Object}
             */
            addEventParam: function (event, extra) {
                var $t = $(event.target),
                    pos = $t.offset(),
                    param = {
                        pageX: event.point[0].x,
                        pageY: event.point[0].y,
                        offsetX: pos.left - event.point[0].x,
                        offsetY: pos.top - event.point[0].y
                    };

                return $.extend(param, extra);
            },

            /**
             * normalizes a Event object for internal usage
             * @param  {Event} event original event object
             * @return {Object}
             */
            Event: function (event) { // normalizes and simplifies the event object
                var normalizedEvent = {
                    type: event.type,
                    timestamp: new Date().getTime(),
                    target: event.target,   // target is always consistent through start, move, end
                    point: []
                };

                var points = [];
                // Touch
                if (event.type.indexOf('touch') > -1) {
                    points = event.changedTouches || event.originalEvent.changedTouches || event.touches || event.originalEvent.touches;
                } else
                // MSPointer
                if (event.type.match(/.*?pointer.*?/i)) {
                    points = [event.originalEvent];
                }

                $.each(points, function (i, e) {
                    normalizedEvent.point.push({x: e.pageX, y: e.pageY});
                });

                return normalizedEvent;
            },

            /**
             * creates cross event a new state object
             * @param  {Object} start point object
             * @return {Object}
             */
            State: function (start) {
                var p = start.point[0];

                return {
                    start: start,
                    move: [],
                    end: null
                };
            },

            /**
             * Math methods for point arithmetic
             * @type {Object}
             */
            calc: {
                /**
                 * calculates the passed time between two points
                 * @param  {Object} start
                 * @param  {Object} end
                 * @return {Number} passed time in ms
                 */
                getDuration: function (start, end) {
                    return end.timestamp - start.timestamp;
                },

                /**
                 * calculates the distance between two points
                 * @param  {Object} start
                 * @param  {Object} end
                 * @return {Number} distance in px
                 */
                getDistance: function (start, end) {
                    return Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
                },

                /**
                 * calculates the angle between two points
                 * @param  {Object} start
                 * @param  {Object} end
                 * @return {Number} in degree
                 */
                getAngle: function (start, end) {
                    return Math.atan2(end.y - start.y, end.x - start.x) * 180 / Math.PI;
                },

                /**
                 * returns the direction of a movement based on an angle
                 * @param  {Number} angle
                 * @return {String} 'up', 'down', 'left', 'right' or 'unknown'
                 */
                getDirection: function (angle) {
                    return angle < -45 && angle > -135 ? 'up' :
                        angle >= -45 && angle <= 45 ? 'right' :
                            angle >= 45 && angle < 135 ? 'down' :
                                angle >= 135 || angle <= -135 ? 'left' :
                                    'unknown';
                },

                /**
                 * returns the scale of a transformation
                 * @param  {Object} start
                 * @param  {Object} move
                 * @return {Number}
                 */
                getScale: function (start, move) {
                    var sp = start.point,
                        mp = move.point;

                    if (sp.length === 2 && mp.length === 2) { // needs to have the position of two fingers
                        return (Math.sqrt(Math.pow(mp[0].x - mp[1].x, 2) + Math.pow(mp[0].y - mp[1].y, 2)) / Math.sqrt(Math.pow(sp[0].x - sp[1].x, 2) + Math.pow(sp[0].y - sp[1].y, 2))).toFixed(2);
                    }

                    return 0;
                },

                /**
                 * calculates the rotation angle
                 * @param  {Object} start
                 * @param  {Object} move
                 * @return {Number} in degree
                 */
                getRotation: function (start, move) {
                    var sp = start.point,
                        mp = move.point;

                    if (sp.length === 2 && mp.length === 2) {
                        return ((Math.atan2(mp[0].y - mp[1].y, mp[0].x - mp[1].x) * 180 / Math.PI) - (Math.atan2(sp[0].y - sp[1].y, sp[0].x - sp[1].x) * 180 / Math.PI)).toFixed(2);
                    }

                    return 0;
                }
            }

        }; // touch obj

    /**
     * loops over all gestures
     * @private
     * @param  {String} type the handler's name
     * @param  {Event} event
     * @param  {Object} state
     * @param  {Obejcect} point
     */
    function loopHandler(type, event, state, point) {
        $.each(gestures, function (i, g) {
            g[type].call(this, event, state, point);
        });
    }

    /**
     * @private
     * @param  {Object} event
     */
    function touchstart(event) {
        var start = touch.Event(event);
        state = touch.State(start); // create a new State object and add start event

        loopHandler('touchstart', event, state, start);
    }

    /**
     * @private
     * @param  {Object} event
     */
    function touchmove(event) {
        if (!state) { return; }

        var move = touch.Event(event);
        state.move.push(move);

        loopHandler('touchmove', event, state, move);
    }

    /**
     * @private
     * @param  {Object} event
     */
    function touchend(event) {
        var end = touch.Event(event);
        state.end = end;

        loopHandler('touchend', event, state, end);
    }

    touch.on();

    // add to namespace
    $.toe = touch;

}(jQuery, this));