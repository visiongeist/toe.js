/*!
 * toe.js
 * version 2.0.0
 * author: Damien Antipa
 * https://github.com/dantipa/toe.js
 */

 (function ($, window, undefined) {

    var touch = {

        Event: function (event) {
            var normalizedEvent = {
                timestamp: new Date().getTime(),
                target: event.target,
                point: []
            }, points = event.changedTouches || 
                        event.originalEvent.changedTouches || 
                        event.touches || 
                        event.originalEvent.touches;

            $.each(points, function (i, e) {
                normalizedEvent.point.push({
                    x: e.pageX,
                    y: e.pageY
                });
            });

            return normalizedEvent;
        },

        State: function (start) {
            var p = start.point[0];

            return {
                start: start,
                move: [],
                end: null,
                pageX: p.x,
                pageY: p.y
            };
        },

        track: function (gesture) {
            var state,
                touchstart = function (event) {
                    var start = touch.Event(event);
                    state = touch.State(start); // create a new State object and add start event

                    gesture.touchstart(event, state, start);
                },
                touchmove = function (event) {
                    var move = touch.Event(event);
                    state.move.push(move);

                    gesture.touchmove(event, state, move);
                },
                touchend = function (event) {
                    var end = touch.Event(event);
                    state.end = end;

                    gesture.touchend(event, state, end);
                };

            gesture.setup = function (data, namespaces, eventHandle) {
                $(this).on('touchstart', data, touchstart)
                    .on('touchmove', data, touchmove)
                    .on('touchend touchcancel', data, touchend);
            };

            gesture.teardown = function () {
                $(this).off('touchstart', touchstart)
                    .off('touchmove', touchmove)
                    .off('touchend touchcancel', touchend);
            };

            return gesture;
        },

        calc: {
            getDuration: function (start, end) {
                return end.timestamp - start.timestamp;
            },

            getDistance: function (start, end) {
                return Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
            },

            getAngle: function (start, end) {
                return Math.atan2(end.y - start.y, end.x - start.x) * 180 / Math.PI;
            },

            getDirection: function (angle) {
                return angle < -45 && angle > -135 ? 'top':
                    angle >= -45 && angle <= 45 ? 'right':
                    angle >= 45 && angle < 135 ? 'down':
                    angle >= 135 || angle <= -135 ? 'left':
                    'unknown';
            },

            getScale: function (start, move) {
                var sp = start.point,
                    mp = move.point;

                if(sp.length === 2 && mp.length === 2) { // needs to have the position of two fingers
                    return (Math.sqrt(Math.pow(mp[0].x - mp[1].x, 2) + Math.pow(mp[0].y - mp[1].y, 2)) / Math.sqrt(Math.pow(sp[0].x - sp[1].x, 2) + Math.pow(sp[0].y - sp[1].y, 2))).toFixed(2);
                }

                return 0;
            },

            getRotation: function (start, move) {
                var sp = start.point,
                    mp = move.point;

                if(sp.length === 2 && mp.length === 2) {
                    return ((Math.atan2(mp[0].y - mp[1].y, mp[0].x - mp[1].x) * 180 / Math.PI) - (Math.atan2(sp[0].y - sp[1].y, sp[0].x - sp[1].x) * 180 / Math.PI)).toFixed(2);
                }

                return 0;
            }
        }
    };

    // add to namespace
    $.toe = touch;

 }(jQuery, this));
(function ($, touch, window, undefined) {

    $.event.special.swipe = (function () {

        var cfg = {
                distance: 40, // minimum
                duration: 300, // maximum
                direction: 'all',
                finger: 1
            };

        return touch.track({
            touchstart: function (event, state, start) {
                state.finger = state.start.point.length;
            },
            touchmove: function (event, state, move) {
                // if another finger was used then increment the amount of fingers used
                state.finger = move.point.length > state.finger ? move.point.length : state.finger;
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

                    state.angle = touch.calc.getAngle(state.start.point[0], end.point[0]);
                    state.direction = touch.calc.getDirection(state.angle);

                    // fire if the amount of fingers match
                    if (state.finger === opt.finger && (opt.direction === 'all' || state.direction === opt.direction)) {
                        $(event.target).trigger($.Event('swipe', state));
                    }
                }
            }
        });
    }());

}(jQuery, jQuery.toe, this));
(function ($, touch, window, undefined) {

    $.event.special.tap = (function () {

        var cfg = {
                distance: 10,
                duration: 300,
                finger: 1
            };

        return touch.track({
            touchstart: function (event, state, start) {
                state.finger = start.point.length;
            },
            touchmove: function (event, state, move) {
                // if another finger was used then increment the amount of fingers used
                state.finger = move.point.length > state.finger ? move.point.length : state.finger;
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
                    if (state.finger === opt.finger) {
                        $(event.target).trigger($.Event('tap', state));
                    }
                }
            }
        });
    }());

}(jQuery, jQuery.toe, this));
(function ($, touch, window, undefined) {

    $.event.special.taphold = (function () {

        var timer,
            abort,
            cfg = {
                distance: 20,
                duration: 500,
                finger: 1
            };

        return touch.track({
            touchstart: function (event, state, start) {
                var opt = $.extend(cfg, event.data);

                abort = false;
                state.finger = start.point.length;

                clearTimeout(timer);
                timer = setTimeout(function () {
                    if (!abort) { 
                        if (state.finger === opt.finger) {
                            $(event.target).trigger($.Event('taphold', state));
                        }
                    }
                }, opt.duration);
            },
            touchmove: function (event, state, move) {
                var opt = $.extend(cfg, event.data),
                    distance;

                // if another finger was used then increment the amount of fingers used
                state.finger = move.point.length > state.finger ? move.point.length : state.finger;

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
    }());

}(jQuery, jQuery.toe, this));
(function ($, touch, window, undefined) {

    $.event.special.transform = (function () {

        var cfg = {
                scale: 0.1, // minimum
                rotation: 15
            },
            started;

        return touch.track({
            touchstart: function (event, state, start) {
                started = false;
            },
            touchmove: function (event, state, move) {
                var opt = $.extend(cfg, event.data);
                
                if (move.point.length !== 2) {
                    state.move.pop();
                    return;
                }

                if (state.start.point.length !== 2 && move.point.length === 2) { // in case the user failed to start with 2 fingers
                    state.start = $.extend({}, move);
                }

                state.rotation = touch.calc.getRotation(state.start, move);
                state.scale = touch.calc.getScale(state.start, move);

                if (Math.abs(1-state.scale) > opt.scale || Math.abs(state.rotation) > opt.rotation) {
                    if(!started) {
                        $(event.target).trigger($.Event('transformstart', state));
                        started = true;
                    }

                    $(event.target).trigger($.Event('transform', state));
                }
            },
            touchend: function (event, state, end) {
                if(started) {
                    started = false;

                    if (end.point.length !== 2) { // in case the user failed to start with 2 fingers
                        state.end = $.extend({}, state.move[state.move.length - 1]);
                    }

                    state.rotation = touch.calc.getRotation(state.start, state.end);
                    state.scale = touch.calc.getScale(state.start, state.end);

                    $(event.target).trigger($.Event('transformend', state));
                }
            }
        });
    }());

}(jQuery, jQuery.toe, this));