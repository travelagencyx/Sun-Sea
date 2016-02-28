var toArray = function (obj) {
    return Array.prototype.slice.call(obj);
};

var hasClass = function (el, className) {
    if (!className) return false;
    if (el.classList) {
        return el.classList.contains(className);
    } else {
        return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
    }
};

var addClass = function (el, className) {
    if (!className) return;

    if (el.classList) {
        el.classList.add(className);
    } else {
        el.className += ' ' + className;
    }
};

var removeClass = function (el, className) {
    if (!className) return;

    if (el.classList) {
        el.classList.remove(className);
    } else {
        el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }
};

var triggerCustomEvent = function (eventType, data) {
    var event;
    event = document.createEvent('CustomEvent');
    event.initCustomEvent(eventType, true, true, { data: data });
    document.dispatchEvent(event);
};

var isDesktop = function() {
    return window.innerWidth >= 1024;
}

// Carousel
var Carousel = function(container) {
    var strip = container.querySelector('.strip');
    var slides = toArray(container.querySelectorAll('.strip .slide'));

    fixImageSize();

    var slideSize = isDesktop() ? 240 : container.getAttribute('data-slide-size') ? parseInt(container.getAttribute('data-slide-size'), 10) : container.offsetWidth;
    var imageSize = isDesktop() ? 200:  container.getAttribute('data-image-size') ? parseInt(container.getAttribute('data-image-size'), 10) : slideSize;
    var visibleSlidesCount = getVisibleSlidesCount();
    var leftOffset = (container.offsetWidth > slideSize) ? ((container.offsetWidth - slideSize) / 2) : 0;
    var images = toArray(container.querySelectorAll('.strip .image'));
    var gallery = container.querySelector('.gallery');
    var index = 1;
    var carouselSize = slides.length;
    var isMoving = false;
    var counter = container.querySelector('.counter');
    var renderCounter = counter && slides.length >= 1;
    var hasSentTracking = false;
    var prevTrigger, nextTrigger, preloadElement, i;


    var tooBig = container.getAttribute('data-max-window-size') && window.innerWidth > container.getAttribute('data-max-window-size');
    if (carouselSize < 2 || tooBig) {
        loadImg(0);

        if (tooBig) {
            for (i = 1; i < slides.length; i++) {
                loadImg(i);
            }
        }
        return;
    }

    if (slides.length * slideSize < container.offsetWidth) {
        for (i = 0; i < slides.length; i++) {
            loadImg(i);
            slides[i].style.left = (i * slideSize) + 'px';
            slides[i].style.width = slideSize + 'px';
            images[i].style.width = imageSize + 'px';
        }
        strip.style.left = Math.round((container.offsetWidth - (slides.length * slideSize)) / 2) + 'px';
        return;
    }

    var strips = (slides.length + 2 * visibleSlidesCount);
    strip.style.width = (strips * slideSize) + 'px';

    // preload elements -> visibleSlides left and right
    preloadElement = document.createElement('div');
    var imagesToPreload = Math.min(slides.length, visibleSlidesCount);
    for (i = 0; i < imagesToPreload; i++) {
        preloadElement.innerHTML = slides[slides.length - (i + 1)].outerHTML;
        strip.insertBefore(preloadElement.firstChild, strip.firstChild);

        preloadElement.innerHTML = slides[i].outerHTML;
        strip.appendChild(preloadElement.firstChild);
    }

    slides = toArray(container.querySelectorAll('.strip .slide'));
    images = toArray(container.querySelectorAll('.strip .image'));
    for (i = 0; i < slides.length; i++) {
        slides[i].style.left = ((i - visibleSlidesCount) * slideSize) + 'px';
        slides[i].style.width = slideSize + 'px';
        images[i].style.width = imageSize + 'px';
    }
    strip.style.left = leftOffset + 'px';

    renderVisibleSlides(0);

    updateCounter();
    initButtons();

    function fixImageSize() {
        if (slides.length > 0 && slides[0].querySelector('img')) {
            var img = slides[0].querySelector('img');
            img.style.display = 'none';
            img.style.width = container.offsetWidth + 'px';
            img.style.height = strip.offsetHeight + 'px';
            img.style.display = 'block';
        }
    };

    function initButtons() {
        var galleryContainer = gallery ? gallery : container;
        prevTrigger = document.createElement('button');
        prevTrigger.className = 'previous-nav';

        nextTrigger = document.createElement('button');
        nextTrigger.className = 'next-nav';

        galleryContainer.appendChild(prevTrigger);
        galleryContainer.appendChild(nextTrigger);
    };

    function getVisibleSlidesCount() {
        if (container.offsetWidth === slideSize)
            return 1;

        var remaining = (container.offsetWidth - slideSize);
        var fittingSlides = Math.floor((remaining / 2) / slideSize);

        return 2 * fittingSlides + 3;
    }

    function renderVisibleSlides(offset) {
        var slidesToRender = getVisibleSlides(offset);
        for (var k = 0; k < slidesToRender.length; k++) {
            loadImg(slidesToRender[k]);
        }
    }

    function getVisibleSlides(offset) {
        var slidesToRender = [];
        var startPoint = -parseInt(getCurrentPosition() + leftOffset) + offset;
        var endPoint = startPoint + container.offsetWidth;

        for (var k = 0; k < slides.length; k++) {
            var renderStartPoint = parseInt(slides[k].style.left);
            var renderEndPoint = renderStartPoint + slideSize;
            if (renderStartPoint > endPoint) {
                return slidesToRender;
            }
            else if (renderEndPoint > startPoint) {
                slidesToRender.push(k);
            }
        }
        return slidesToRender;
    };

    function loadImg(imgIndex) {
        var tablet = 480;
        var slide = slides[imgIndex];
        var image = images[imgIndex];
        if (image && slide.className.indexOf('loading') === -1 && !image.style.backgroundImage && image.getAttribute('data-image')) {
            addClass(slide, 'loading');

            var img = new Image();
            var imageUrl = image.getAttribute('data-image');

            if ((slideSize > tablet) && (imageUrl.indexOf('images-big') === -1)) {
                imageUrl = imageUrl.replace('images', 'images-big');
            }

            img.setAttribute('src', imageUrl);
            img.onload = function(vals) {
                removeClass(slide, 'loading');
                image.style.backgroundImage = 'url(' + imageUrl + ')';
            };
        }
    };

    function updateCounter() {
        if (renderCounter) {
            var counterTxt = counter.attributes['data-txt'] ? counter.attributes['data-txt'].value : '{0}/{1}';
            counter.innerHTML = counterTxt.replace('{0}', index).replace('{1}', carouselSize);
        }
    }

    var classes = {
        touching: 'is-touching'
    };

    var nextSlide = function() {
        handleNextSelection(1);
    };

    var previousSlide = function() {
        handlePreviousSelection(1);
    };

    var handleNextSelection = function (slidesToShift) {
        var speed = index === carouselSize ? 0 : 300;
        index = getNextIndex(slidesToShift);
        translate(strip, -((index - 1) * slideSize), speed);

        renderVisibleSlides(0);
        updateCounter();

        if (hasSentTracking === false) {
            triggerCustomEvent('gallery-paging', container);
            hasSentTracking = true;
        }
    };

    var getNextIndex = function(slidesToShift) {
        if ((index + slidesToShift) > carouselSize) {
            return index + slidesToShift - carouselSize;
        } else {
            return index + slidesToShift;
        }
    };

    var handlePreviousSelection = function (slidesToShift) {
        var speed = index === 1 ? 0 : 300;
        index = getPreviousIndex(slidesToShift);
        translate(strip, -((index - 1) * slideSize), speed);
        renderVisibleSlides(0);
        updateCounter();
        if (hasSentTracking === false) {
            triggerCustomEvent('gallery-paging', container);
            hasSentTracking = true;
        }
    };

    var getPreviousIndex = function (slidesToShift) {
        if ((index - slidesToShift) < 1) {
            return carouselSize + 1 - slidesToShift;
        } else {
            return index - 1;
        }
    };

    function getCurrentPosition() {
        return -((index - 1) * slideSize);
    };

    function translate(slide, offsetFromPosition, speed) {
        slide.style.webkitTransitionDuration =
            slide.style.MozTransitionDuration =
                slide.style.msTransitionDuration =
                    slide.style.OTransitionDuration =
                        slide.style.transitionDuration = speed + 'ms';

        slide.style.webkitTransform =
            slide.style.MozTransform =
                slide.style.msTransform =
                    slide.style.OTransform = 'translateX(' + offsetFromPosition + 'px)';
    };


    var bindEvents = function() {
        var clickEvents = function() {

            // Speed up 'click' on touch devices
            if (prevTrigger && nextTrigger) {
                if ('ontouchstart' in window) {
                    prevTrigger.addEventListener('touchstart', function (e) {
                        renderVisibleSlides(-slideSize);
                        e.preventDefault();
                    }, false);

                    nextTrigger.addEventListener('touchstart', function (e) {
                        renderVisibleSlides(slideSize);
                        e.preventDefault();
                    }, false);

                    prevTrigger.addEventListener('touchend', previousSlide);
                    nextTrigger.addEventListener('touchend', nextSlide);
                }

                prevTrigger.addEventListener('click', function (e) {
                    renderVisibleSlides(-slideSize);
                    previousSlide(e);
                });

                nextTrigger.addEventListener('click', function (e) {
                    renderVisibleSlides(slideSize);
                    nextSlide(e);
                });
            }
        };

        var touchEvents = function() {
            var vars = {
                start: {},
                delta: {},
                isScrolling: undefined,
                direction: null
            };

            var start = function (e) {
                var touches = e.touches[0];
                vars.start = {
                    x: touches.pageX,
                    y: touches.pageY,
                    time: +new Date()
                };

                vars.delta = {};
                vars.isScrolling = undefined;
            };

            var move = function (e) {
                // Ensure swiping with one touch and not pinching
                if (e.touches.length > 1 || e.scale && e.scale !== 1) return;
                addClass(container, classes.touching);
                isMoving = true;
                var touches = e.touches[0];
                vars.delta = {
                    x: touches.pageX - vars.start.x,
                    y: touches.pageY - vars.start.y
                };

                renderVisibleSlides(-vars.delta.x);

                if (typeof vars.isScrolling === 'undefined') {
                    vars.isScrolling = !!(vars.isScrolling || Math.abs(vars.delta.x) < Math.abs(vars.delta.y));
                }

                // If user is not trying to scroll vertically
                if (!vars.isScrolling) {
                    e.preventDefault(); // Prevent native scrolling

                    translate(strip, getCurrentPosition() + vars.delta.x, 0);
                }
            };

            var end = function () {
                if (!isMoving) return;

                var duration = +new Date() - vars.start.time;

                // Determine if slide attempt triggers next/prev slide
                var isChangeSlide = Number(duration) < 250 && Math.abs(vars.delta.x) > 20 || Math.abs(vars.delta.x) > slideSize / 2;
                var direction = vars.delta.x < 0 ? 'next' : 'previous';
                var speed = 300;

                // If not scrolling vertically
                if (!vars.isScrolling) {
                    if (isChangeSlide) {
                        vars.direction = direction;
                        var slidesToShift = vars.delta.x > 0 ? parseInt(vars.delta.x / slideSize, 10) + 1 : parseInt(vars.delta.x / slideSize, 10) - 1;

                        translate(strip, getCurrentPosition() + (slidesToShift * slideSize), speed);
                        setTimeout(transitionEnd.bind(this, Math.abs(slidesToShift)), speed);
                    } else {
                        // Slides return to original position
                        translate(strip, getCurrentPosition(), speed);
                    }
                }

                isMoving = false;
            };

            var transitionEnd = function (slidesToShift) {
                if (vars.direction) {
                    if (vars.direction == 'next') {
                        handleNextSelection(slidesToShift);
                    } else {
                        handlePreviousSelection(slidesToShift);
                    }

                    removeClass(container, classes.touching);
                }
            };

            if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
                container.addEventListener('touchstart', start, false);
                container.addEventListener('touchmove', move, false);
                container.addEventListener('touchend', end, false);
            }
        };

        clickEvents();
        touchEvents();
    };

    bindEvents();
};
var galleries = document.querySelectorAll('.carouselv2');
for (var i = 0; i < galleries.length; i++) {
    new Carousel(galleries[i]);
}
