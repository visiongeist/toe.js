define(function () {

    var state = {
        touches: {},
        events: {},
        timestamp: undefined,

        prevGesture: null,

        offset: {}
    };

    state.clearState = function () {
        state.touches = {};
        state.events = {};
        state.timestamp = undefined;
    };

    return state;

});