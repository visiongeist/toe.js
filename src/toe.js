/*!
* toe.js
* version 3.0.1
* author: Damien Antipa
* https://github.com/dantipa/toe.js
*/
(function ($, window, undefined) {

    var state, gestures = {}, touch = {

        on: function () {
            $(document).on('touchstart', touchstart)
                .on('touchmove', touchmove)
                .on('touchend touchcancel', touchend);
        },

        off: function () {
            $(document).off('touchstart', touchstart)
                .off('touchmove', touchmove)
                .off('touchend touchcancel', touchend);
        },

        track: function (namespace, gesture) {
            gestures[namespace] = gesture;
        },

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

        Event: function (event) { // normalizes and simplifies the event object
            var normalizedEvent = {
                type: event.type,
                timestamp: new Date().getTime(),
                target: event.target,   // target is always consistent through start, move, end
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

            return {   // TODO add screenX etc.
                start: start,
                move: [],
                end: null
            };
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

    }; // touch obj

    function loopHandler(type, event, state, point) {
        $.each(gestures, function (i, g) {
            g[type].call(this, event, state, point);
        });
    }

    function touchstart(event) {
        var start = touch.Event(event);
        state = touch.State(start); // create a new State object and add start event

        loopHandler('touchstart', event, state, start);
    }

    function touchmove(event) {
        var move = touch.Event(event);
        state.move.push(move);

        loopHandler('touchmove', event, state, move);
    }

    function touchend(event) {
        var end = touch.Event(event);
        state.end = end;

        loopHandler('touchend', event, state, end);
    }

    touch.on();

    // add to namespace
    $.toe = touch;

}(jQuery, this));