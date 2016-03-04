module.exports = function (galleryElement) {
    return [].slice.call(galleryElement.querySelectorAll('a, img')).map(function(el) {
        return el.href || el.src || el.getAttribute('data-src') || el.getAttribute('data-src2');
    });
};