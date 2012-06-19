define(function () {
    var util = {};
    /**
     *
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
     * @param eventName
     * @return {Array[]|Boolean}
     */
    util.hasEvent = function ($target, event) {
        if(jQuery.isFunction(event)) {
            //TODO find function
        } else { // assume it's the event name (String)
            return !!!$target.data('events')[event];
        }
    };

    return util;
});