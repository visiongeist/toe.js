define(function () {

    var gestures = {
        start: [],
        move: [],
        end: []
    };

    gestures.add = function (timing, gesture, func, priority) {
        var i,
            tmp,
            inserted = false;

        if (priority) {
            for(i = 0; i < gestures[timing].length; i++) {
                tmp = gestures[timing][i];

                if(tmp.priority && tmp.priority < priority) {
                    continue;
                }

                gestures[timing].splice(i, 0, {
                    gesture: gesture,
                    func: func,
                    priority: undefined
                });
                inserted = true;
            }
        }

        if(!priority || !inserted) {
            gestures[timing].push({
                gesture: gesture,
                func: func,
                priority: undefined
            });
        }
    };

    gestures.exec = function (timing, event) {
        var i;

        for (i = 0; i < gestures[timing].length; i++) {
            gestures[timing][i].func(event);
        }
    };

    return gestures;

});