AFRAME.registerComponent('smooth-rotation', {
  init: function () {
    var object = this.el;
    var touchStartX = 0;
    var touchStartY = 0;
    var mouseX = 0;
    var isMouseDown = false;
    var stepTouch = 0.08;
    var stepWheel = 0.04;

    // Set up initial state
    object.object3D.rotation.y = 0;

    // Function to smoothly rotate the object based on touch events
    var smoothRotate = function(delta, step) {
        if (delta !== undefined) {
            if (delta > 0) {
                object.object3D.rotation.y += step; // Rotate right
            } else {
                object.object3D.rotation.y -= step; // Rotate left
            }
        }
    };

    // Function to handle touchstart or mousedown event
    var onTouchStart = function(event) {
        if (event.touches) {
            touchStartX = event.touches[0].clientX;
            touchStartY = event.touches[0].clientY;
        } else {
            mouseX = event.clientX;
            isMouseDown = true;
        }
    };

    // Function to handle touchmove or mousemove event
    var onTouchMove = function(event) {
        if (!isMouseDown) return; // Ignore if mouse is not down
        var deltaX;
        if (event.touches) {
            var touchEndX = event.changedTouches[0].clientX;
            deltaX = touchEndX - touchStartX;
            // Reset touchStartX for next touch event
            touchStartX = touchEndX;
        } else {
            deltaX = event.clientX - mouseX;
            mouseX = event.clientX;
        }

        // Smoothly rotate based on mouse or touch movement
        smoothRotate(deltaX, stepWheel);
    };

    // Function to handle mouseup event
    var onMouseUp = function(event) {
        isMouseDown = false;
    };

    // Function to handle wheel event
    var onWheel = function(event) {
        smoothRotate(event.deltaY, stepWheel);
    };

    // Add event listeners for touch or mouse events and wheel events
    window.addEventListener('touchstart', onTouchStart);
    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('wheel', onWheel);
    window.addEventListener('mousedown', onTouchStart);
    window.addEventListener('mousemove', onTouchMove);
    window.addEventListener('mouseup', onMouseUp);
  }
});