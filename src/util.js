/**
 * Utility
 * @type {Object}
 */
var util = {};

/**
 * tries to get the touches from a jQuery(!) touch event
 * @param event
 * @return {TouchEvent[]}
 */
util.getTouches = function (event) {
    return event.originalEvent.touches.length > 0 ?
        $.extend(true, {}, event.originalEvent.touches) :
        (event.originalEvent.changedTouches.length > 0 ?
            $.extend(true, {}, event.originalEvent.changedTouches) :
            []
            );
};

/**
 *
 * @param $target
 * @param {String} event event name which should be tested against $target
 * @return {Boolean}
 */
util.hasEvent = function ($target, event) {
   return $target.data('events') ? $target.data('events')[event] : 0;
};