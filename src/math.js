(function ($, toe, window, undefined) {
    /**
     * angle to direction define, getDirectionFromAngle
     * @param  float    angle
     * @return string   direction
     */
    toe.getDirection = function (angle)
    {
       if (angle < -45 && angle > -135) {
           return 'top';
       } else if (angle >= -45 && angle <= 45) {
           return 'right';
       } else if (angle >= 45 && angle < 135) {
           return 'down';
       } else if (angle >= 135 || angle <= -135) {
           return 'left';
       }
    };

    /**
     * @private
     * @param {Object} pos1
     * @param {Number} pos1.pageX
     * @param {Number} pos1.pageY
     * @param {Object} pos2
     * @param {Number} pos2.pageX
     * @param {Number} pos2.pageY
     * @return {Number} angle between pos1 and pos2
     */
    toe.getAngle = function (pos1, pos2)
    {
        return Math.atan2(pos2.pageY - pos1.pageY, pos2.pageX - pos1.pageX) * 180 / Math.PI;
    };

    /**
     * @private
     * @param {Object[]} start must contain the position of two fingers
     * @param {Number} start[].pageX
     * @param {Number} start[].pageY
     * @param {Object[]} move must contain the position of two fingers
     * @param {Number} move[].pageX
     * @param {Number} move[].pageY
     * @return {Number} scale size between two fingers
     */
    toe.calculateScale = function (start, move)
    {
        if(start.length === 2 && move.length === 2) { // needs to have the position of two fingers
            return (Math.sqrt(Math.pow(move[0].pageX - move[1].pageX, 2) + Math.pow(move[0].pageY - move[1].pageY, 2)) / Math.sqrt(Math.pow(start[0].pageX - start[1].pageX, 2) + Math.pow(start[0].pageY - start[1].pageY, 2)));
        }

        return 0;
    };

    /**
     * @private
     * @param {Object[]} start must contain the position of two fingers
     * @param {Number} start[].pageX
     * @param {Number} start[].pageY
     * @param {Object[]} move must contain the position of two fingers
     * @param {Number} move[].pageX
     * @param {Number} move[].pageY
     * @return {Number} rotation degrees between two fingers
     */
    toe.calculateRotation = function (start, move)
    {
        if(start.length === 2 && move.length === 2) {
            return ((Math.atan2(move[0].pageY - move[1].pageY, move[0].pageX - move[1].pageX) * 180 / Math.PI) - (Math.atan2(start[0].pageY - start[1].pageY, start[0].pageX - start[1].pageX) * 180 / Math.PI));
        }

        return 0;
    };

    /**
     * @private
     * @param {TouchEvent} startTouch
     * @param {TouchEvent} moveTouch
     * @return {Number} maximum distance the finger moved
     */
    toe.calculateDistance = function (startTouch, moveTouch)
    {   try{
        return Math.sqrt(Math.pow(moveTouch.pageX - startTouch.pageX, 2) + Math.pow(moveTouch.pageY - startTouch.pageY, 2));
        } catch(err) {console.log('Err in cd: ' + err);}
    };

}(jQuery, toe, this));