var touchMovement = {

    isMoving: false,

    touchstart: function(e) {
        touchMovement.start = {
            time: now(),
            coords: getEventCoords(e)
        };

        touchMovement.isMoving = true;

        touchMovement.waypoints = [];

        touchMovement.end = {};

        touchMovement.isScrolling = false;
    },

    touchmove: function(e) {
        var coords = getEventCoords(e);
        touchMovement.waypoints.push(coords);

        var dx = Math.abs(touchMovement.start.coords.x - coords.x);
        var dy = Math.abs(touchMovement.start.coords.y - coords.y);
        touchMovement.isScrolling = touchMovement.isScrolling || (dx < dy);
    },

    touchend: function(e) {
        touchMovement.isMoving = false;
        this.end.time = now();
        this.end.coords = (this.waypoints.length && this.waypoints[this.waypoints.length - 1]) || this.start.coords;
    },

    wasClick: function() {
        return (touchMovement.end.time - touchMovement.start.time) < 250
            && Math.abs(touchMovement.end.coords.x - touchMovement.start.coords.x) < 10
            && Math.abs(touchMovement.end.coords.y - touchMovement.start.coords.y) < 10;
    },

    isSecondTapWithinShortTime: function() {
        return touchMovement.end && touchMovement.end.time && (now() - touchMovement.end.time < 300)
    }
};

module.exports = function(el, ui) {
    function addListeners(el, evt) {
        window.addEventListener('touchmove', onTouchMove);
        el.addEventListener('touchend', onTouchEnd);
        el.addEventListener('touchcancel', onTouchEnd);
    }

    function removeListeners(el) {
        window.removeEventListener('touchmove', onTouchMove);
        el.removeEventListener('touchend', onTouchEnd);
        el.removeEventListener('touchcancel', onTouchEnd);
    }

    el.addEventListener('touchstart', onTouchStart);

    ui.btnNext.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        ui.go(1);
    });

    ui.btnPrev.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        ui.go(-1);
    });

    function onTouchStart(e) {
        if (touchMovement.isMoving) {
            return;
        }

        touchMovement.touchstart(e);

        if (touchMovement.isSecondTapWithinShortTime()) {
            e.preventDefault();
            e.stopPropagation();
            touchMovement.touchend(e);
            removeListeners(el);
            return;
        }

        addListeners(el, e);
    }

    function onTouchMove(e) {
        touchMovement.touchmove(e);

        if (touchMovement.isScrolling) {
            removeListeners(el);
            touchMovement.touchend(e);
            ui.go(0);
            return;
        }

        e.preventDefault();
        e.stopPropagation();

        if (!touchMovement.waypoints || !touchMovement.waypoints.length) {
            return;
        }

        var dx = touchMovement.start.coords.x - touchMovement.waypoints[touchMovement.waypoints.length - 1].x;

        ui.updateRelativeToCurrentImage(dx);
    }

    function onTouchEnd(e) {
        touchMovement.touchend(e);
        removeListeners(el);

        var dx = (touchMovement.start.coords.x - touchMovement.end.coords.x) | 0;

        if (!dx) {
            return;
        }else if (dx > ui.width / 15) {
            ui.go(1);
        } else if (dx < -1 * ui.width / 15) {
            ui.go(-1);
        } else {
            ui.go(0);
        }
    }
};

function getEventCoords(e) {
    var touch = e.touches && e.touches[0];

    return {
        x: e.clientX || (touch && touch.clientX),
        y: e.clientY || (touch && touch.clientY)
    };
}

function now() {
    return (window.performance && performance.now && performance.now()) || (Date.now && Date.now()) || +new Date();
}