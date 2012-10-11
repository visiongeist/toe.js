/**
 * Contains all registered gestures
 * @type {Object}
 * @type {Object[]) start
 * @type {Object[]) move
 * @type {Object[]) end
 */
var gestures = {
	start:[],
	move:[],
	end:[],
	none:[]
};

/**
 * Add new gesture
 *
 * @param {String} timing can be either 'start', 'move' or 'end' of the touch behavior
 * @param {String} gesture name of the gesture
 * @param {Function} func to be called at the given timing
 * @param {Number} priority if necessary for calling order or undefined
 */
gestures.add = function (timing, gesture, func, priority) {
	var i,
		tmp,
		inserted = false;

	if (priority) {
		for (i = 0; i < gestures[timing].length; i++) {
			tmp = gestures[timing][i];

			if (tmp.priority && tmp.priority < priority) {
				continue;
			}

			gestures[timing].splice(i, 0, {
				gesture:gesture,
				func:func,
				priority:undefined
			});
			inserted = true;
		}
	}

	if (!priority || !inserted) {
		gestures[timing].push({
			gesture:gesture,
			func:func,
			priority:undefined
		});
	}

	registerSpecialEvent(gesture);
};

/**
 * @private
 * @param timing
 * @param event
 */
gestures.exec = function (timing, event) {
	var i;

	for (i = 0; i < gestures[timing].length; i++) {
		gestures[timing][i].func(event);
	}
};