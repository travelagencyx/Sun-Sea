var animation = require('./animation');
var calcUIValues = require('./calculateUIValuesForGalleryPosition');

var html =  '<div data-counter></div>' +
            '<div class="slider">' +
                '<div data-left></div>' +
                '<div data-right></div>' +
            '</div>' +
            '<button class="gallery-prev"></button>' +
            '<button class="gallery-next"></button>';

module.exports = function(galleryElement, images) {
    galleryElement.innerHTML = html;

    var width = galleryElement.clientWidth;

    var currentImage = 0;

    var self = {
        left: galleryElement.querySelector('[data-left]'),
        right: galleryElement.querySelector('[data-right]'),
        slider: galleryElement.querySelector('.slider'),
        counter: galleryElement.querySelector('[data-counter]'),

        btnNext: galleryElement.querySelector('.gallery-next'),
        btnPrev: galleryElement.querySelector('.gallery-prev'),

        currentX: 0,
        targetX: 0,
        width: width,

        go: function(deltaImages) {
            currentImage += deltaImages;
            self.targetX = currentImage * width;
            self.animateTo();
        },

        animateTo: function() {
            var from = self.currentX;
            var to = self.targetX;
            var duration = 200 * Math.abs(to - from) / width;

            animation.animateValue(from, to, duration, function(x) {
                self.currentX = x;
                self.update(x);
            });
        },

        updateRelativeToCurrentImage: function(x) {
            self.currentX = self.targetX + x;
            self.update(self.currentX);
        },

        update: function(x) {
            var values = calcUIValues(x, width, images.length);
            bgimage(this.left, images[values.leftImage]);
            bgimage(this.right, images[values.rightImage]);
            translateX(this.slider, values.translateX);
            this.counter.innerHTML = (1 + values.currentImage) + ' / ' + images.length;
        }
    };

    self.update(0);

    return self;
};

function bgimage(el, url) {
    if (el && url) {
        el.style.backgroundImage = 'url("' + url + '")';
    }
}

function translateX(el, x) {
    if (el) {
        el.style.webkitTransform =
            el.style.msTransform =
                el.style.mozTransform =
                    el.style.oTransform =
                        el.style.transform =
                            'translateX(' + (x | 0) + 'px)';
    }
}