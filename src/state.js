/**
 * current state of the runnign gesture
 *
 * @type {Object}
 * @type {Object} touches touches contains the TouchList objects of touchstart, touchmove and touchend
 * @type {TouchList[]} touches.start
 * @type {TouchList[]} touches.move
 * @type {TouchList[]} touches.end
 * @type {Object} events contains the TouchEvents of the current gestures
 * @type {TouchEvent} events.start
 * @type {TouchEvent} events.move
 * @type {TouchEvent} events.end
 * @type {Number} timestamp the time when the gesture started (ontouchstart)
 * @type {Object} offset the document offset of the current event target
 * @type {Number} offset.top
 * @type {Number} offset.left
 */
var state = {
    touches: {},
    events: {},
    timestamp: undefined,

    prevGesture: null,

    offset: {}
};

/**
 * resets the gesture the inital values
 */
state.clearState = function () {
    state.touches = {};
    state.events = {};
    state.timestamp = undefined;
};