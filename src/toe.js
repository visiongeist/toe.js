/*!
 * toe.js
 * version 1.2
 * author: Damien Antipa
 * https://github.com/dantipa/toe.js
 */
var isTouch = !!('ontouchstart' in window),
    $proxyStart, $proxyMove, $proxyEnd;

/**
 *
 * @param {jQuery.Event} event
 */
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

/**
 *
 * @param {jQuery.Event} event
 */
function touchmove(event) {
    if(!state.timestamp) {
        return;
    }

    state.touches.move = util.getTouches(event);
    state.events.move = event;

    gestures.exec('move', event);
}

/**
 *
 * @param {jQuery.Event} event
 */
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

$proxyStart = $.proxy(touchstart, this);
$proxyMove = $.proxy(touchmove, this);
$proxyEnd = $.proxy(touchend, this);

function eventSetup(data, namespaces, eventHandler) {
    var $this = $(this),
        toe = $this.data('toe') || 0;

    if (toe === 0) {
        $this.on('touchstart', $proxyStart);
        $this.on('touchmove', $proxyMove);
        $this.on('touchend touchcancel', $proxyEnd);
    }

    $this.data('toe', ++toe);
}

function eventTeardown(namespace) {
    var $this = $(this),
        toe = $this.data('toe') || 0;

    $this.data('toe', --toe);

    if (toe === 0) {
        $this.off('touchstart', $proxyStart);
        $this.off('touchmove', $proxyMove);
        $this.off('touchend touchcancel', $proxyEnd);
    }
}

function registerSpecialEvent(eventName) {
	if (isTouch) { // event binding will just work on touch devices
		$.event.special[eventName] = {
			setup: eventSetup,
			teardown: eventTeardown
		};
	}
}