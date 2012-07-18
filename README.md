# toe.js

toe.js is a tiny library based on [jQuery](http://jquery.com) to enable sophisticated gestures on touch devices.

## Why toe.js

The goal of toe.js is
* Smooth integration into jQuery's event handling
* Fast responding events to give the user a better experience
* Extensible, hooks allow new touch events to be part of toe and use existing functionality
* Customizable through [grunt](https://github.com/cowboy/grunt). The build process allows you to remove not needed gestures
* Tiny overhead (1649 bytes gzipped by version 1.0)

## Available events (v. 1.0)

* tap
* doubletap (Attention: If you bind doubletap AND tap to the same element then the tap event will be called deferred)
* taphold
* swipe (all directions)
* transformstart, transform, transformend (scale and rotation)

Coming soon: fancy drag and drop

## Usage

Use the default jQuery event binding to bind a toe.js event
	
	$('div.myElem').on('tap', $.noop);
	
Like all jQuery events tap will provide you the original event fired by the browser.

	$('div.myElem').on('tap', function (event) {
		var original = event.originalEvent;
	});
	
Most of the events support multiple fingers. So if you want to find out the amount of fingers used by a gesture, just look into the TouchList of the original event.

	$('div.myElem').on('tap', function (event) {
		var original = event.originalEvent,
			touches = original.touches.length > 0 ? original.touches : original.changedTouches;
		
		if (touches.length === 2) {
			// do something if the user tapped with two fingers
		}
	});
	
Default eventing behavior will not be influenced by the default toe.js events. So in case you want to catch to a swipe event in a scrollable direction then you have to stop the the default behavior on your own.

	$('div.myElem').on('touchstart touchmove touchend', function (event) {
		event.preventDefault();
	});

	$('div.myElem').on('swipe', function (event) {
		
	});
	
How to extend toe.js? I'll provide a simple template as soon as possible!

## Events

### tap, doubletap, taphold

The "tap" event is somehow similar to a click event with a pointer device so there is nothing more to say about it. "doubletap" is the touch equivalent for double click. If there two taps in a short time period then the "doubletap" event is triggered (Attention: If you bind "doubletap" AND "tap" to the same element then the "tap" event will be called deferred)
"taphold" is triggered if the user starts touching the target and keeps his finger on it for a certain amount of time (default: 500ms)

### swipe

The swipe event can be occur in any direction on the element. 

	$('div.myElem').on('swipe', function (event) {
		if(event.direction === 'up') { // or right, down, left
		
		}
	});
	
	
### transformstart, transform, transformend

This event is also known as pinch event. It allows the user to use two fingers moving away from or towards each other. The user will be able to signalize a scale or rotation of an object. All three events will deliver the center of the pinch, the rotation and the scale.

	$('div.myElem').on('transform', function (event) {
		var center = event.center, //center.pageX and center.pageY
			scale = event.scale,
			rotation = event.rotation; //in deegres
		
		// do sth
		
	});

## Custom build

Toe.js is a modular library. In order you do not want to use all events just clone this repo and remove the unwanted gestures under src/gestures. The grunt script does the rest for you.
	
## Extensibility 

Coming soon...

## Thanks

to the developers of all related libraries which inspired me: jQuery mobile, Hammer.JS, jGestures and TouchSwipe.
	

