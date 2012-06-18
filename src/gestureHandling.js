(function ($, toe, window, undefined) {

    toe.gestures = {
        start: [],
        move: [],
        end: []
    };

    toe.add = function (timing, gesture, func, priority) {
        var i,
            exec = toe.gestures[timing],
            tmp,
            inserted = false;

        if (priority) {
            for(i = 0; i < exec.length; i++) {
                tmp = exec[i];

                if(tmp.priority && tmp.priority < priority) {
                    continue;
                }

                exec.splice(i, 0, {
                    gesture: gesture,
                    func: func,
                    priority: undefined
                });
                inserted = true;
            }
        }

        if(!priority || !inserted) {
            exec.push({
                gesture: gesture,
                func: func,
                priority: undefined
            });
        }
    };

    toe.exec = function (timing, event) {
        var gestures,
            i;

        gestures = toe.gestures[timing];
        for (i = 0; i < gestures.length; i++) {
            gestures[i].func(event);
        }
    };

}(jQuery, toe, this));