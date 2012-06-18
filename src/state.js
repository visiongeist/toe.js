(function ($, toe, window, undefined) {

    toe.state = {
        touches: {},
        events: {},
        timestamp: undefined,

        prevGesture: null,

        offset: {}
    };

    toe.clearState = function () {
        var state = toe.state;

        state.touches = {};
        state.events = {};
        state.timestamp = undefined;
    };

}(jQuery, toe, this));