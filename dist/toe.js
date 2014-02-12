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
(function ($, touch, window, undefined) {

    var namespace = 'swipe', cfg = {
        distance: 40, // minimum
        duration: 1200, // maximum
        direction: 'all'
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

            // check if the swipe was valid
            if (duration < opt.duration && distance > opt.distance) {

                state[namespace].angle = touch.calc.getAngle(state.start.point[0], end.point[0]);
                state[namespace].direction = touch.calc.getDirection(state[namespace].angle);

                // fire if the amount of fingers match
                if (opt.direction === 'all' || state[namespace].direction === opt.direction) {
                    $(event.target).trigger($.Event(namespace, touch.addEventParam(state.start, state[namespace])));
                }
            }
        }
    });

}(jQuery, jQuery.toe, this));
(function ($, touch, window, undefined) {

    var clientWidth = document.documentElement.clientWidth;
    var clientHeight = document.documentElement.clientHeight;
    var averageScreenLength = Math.sqrt(clientWidth * clientHeight);
    var relativeDistance = (2 / 100) * averageScreenLength;
    var namespace = 'tap', cfg = {
        distance: relativeDistance,
        duration: 300,
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
                    $(event.target).trigger(
                        $.Event(namespace, touch.addEventParam(state.start, state[namespace]))
                    );
                }
            }
        }
    });

}(jQuery, jQuery.toe, this));
(function ($, touch, window, undefined) {

    var timer, abort,
        namespace = 'taphold', cfg = {
            distance: 20,
            duration: 500,
            finger: 1
        };

    touch.track(namespace, {
        touchstart: function (event, state, start) {
            var opt = $.extend(cfg, event.data);

            abort = false;
            state[namespace] = {
                finger: start.point.length
            };

            clearTimeout(timer);
            timer = setTimeout(function () {
                if (!abort && touch.active) {
                    if (state[namespace].finger === opt.finger) {
                        $(event.target).trigger($.Event(namespace, touch.addEventParam(start, state[namespace])));
                    }
                }
            }, opt.duration);
        },
        touchmove: function (event, state, move) {
            var opt = $.extend(cfg, event.data),
                distance;

            // if another finger was used then increment the amount of fingers used
            state[namespace].finger = move.point.length > state[namespace].finger ? move.point.length : state[namespace].finger;

            // calc
            distance = touch.calc.getDistance(state.start.point[0], move.point[0]);
            if (distance > opt.distance) { // illegal move
                abort = true;
            }
        },
        touchend: function (event, state, end) {
            abort = true;
            clearTimeout(timer);
        }
    });

}(jQuery, jQuery.toe, this));
(function ($, touch, window, undefined) {

    var namespace = 'transform', cfg = {
            scale: 0.1, // minimum
            rotation: 15
        },
        started;

    touch.track(namespace, {
        touchstart: function (event, state, start) {
            started = false;
            state[namespace] = {
                start: start,
                move: []
            };
        },
        touchmove: function (event, state, move) {
            var opt = $.extend(cfg, event.data);

            if (move.point.length !== 2) {
                return;
            }

            state[namespace].move.push(move);

            if (state[namespace].start.point.length !== 2 && move.point.length === 2) { // in case the user failed to start with 2 fingers
                state[namespace].start = $.extend({}, move);
            }

            state[namespace].rotation = touch.calc.getRotation(state[namespace].start, move);
            state[namespace].scale = touch.calc.getScale(state[namespace].start, move);

            if (Math.abs(1 - state[namespace].scale) > opt.scale || Math.abs(state[namespace].rotation) > opt.rotation) {
                if (!started) {
                    $(event.target).trigger($.Event('transformstart', state[namespace]));
                    started = true;
                }

                $(event.target).trigger($.Event('transform', state[namespace]));
            }
        },
        touchend: function (event, state, end) {
            if (started) {
                started = false;

                if (end.point.length !== 2) { // in case the user failed to end with 2 fingers
                    state.end = $.extend({}, state[namespace].move[state[namespace].move.length - 1]);
                }

                state[namespace].rotation = touch.calc.getRotation(state[namespace].start, state.end);
                state[namespace].scale = touch.calc.getScale(state[namespace].start, state.end);

                $(event.target).trigger($.Event('transformend', state[namespace]));
            }
        }
    });

}(jQuery, jQuery.toe, this));