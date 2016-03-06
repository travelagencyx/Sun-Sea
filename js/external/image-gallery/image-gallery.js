var helper = require('./customElementHelper');
var tagName = 'image-gallery';
var getImageUrls = require('./retrieveImageUrlsFromElement');
var setupGalleryUI = require('./setupGalleryUI');
var registerEventHandlers = require('./registerEventHandlers');
require("./image-gallery.scss");

module.exports = helper.registerElement(tagName, HTMLElement.prototype, null, attachedCallback);

function attachedCallback() {
    var el = this;
    var imageUrls = getImageUrls(el);
    var ui = setupGalleryUI(el, imageUrls);
    registerEventHandlers(el, ui);
}
