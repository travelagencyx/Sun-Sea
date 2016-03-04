function loadImages() {
    var images = Array.prototype.slice.call(document.querySelectorAll('img[data-src]'));

    images.forEach(function(image) {
        if (image.src === '') {
            image.src = image.getAttribute('data-src');
        }
    });
}

if (document.readyState === "complete") {
    loadImages();
} else {
    window.addEventListener('load', loadImages);
}

module.exports = {
    load: loadImages
};