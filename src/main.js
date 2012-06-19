/*!
 * toe.js
 * version 0.7
 * author: Damien Antipa
 * https://github.com/
 */
require(['jquery', 'toe'], function () {
    // load all gestures
    require(['/gestures/tap', '/gestures/swipe', '/gestures/transform'], $.noop);
});