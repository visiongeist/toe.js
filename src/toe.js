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