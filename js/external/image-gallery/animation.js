var raf = window.requestAnimationFrame || setTimeout;

var isiOS = /iP(hone|od|ad)/.test(navigator.platform);

function iOSversion() {
    var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
    return parseInt(v[1], 10);
}

if (isiOS && iOSversion() <= 7) {
    raf = setTimeout;
}


var now = function() {
    return Date.now();
};

var animations = {};
var aid = 0;

module.exports = {
    animateValue: function(start, end, duration, callback) {
        var startTime = now();
        var id = aid++;

        raf(function doit() {
            if (animations[id]) { return; }
            var dt = now() - startTime;

            if (dt > duration) {
                animations[id] = true;
                return callback(end);
            }

            callback(start + easeInOutQuint(dt / duration) * (end - start));

            raf(doit);
        });

        return id;
    },

    cancelAnimation: function() {
        animations[id] = true;
    }
};

// more easings here: https://gist.github.com/gre/1650294
function easeInOutQuint(t) {
    return t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t
}