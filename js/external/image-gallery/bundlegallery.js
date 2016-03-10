/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var helper = __webpack_require__(1);
	var tagName = 'image-gallery';
	var getImageUrls = __webpack_require__(2);
	var setupGalleryUI = __webpack_require__(3);
	var registerEventHandlers = __webpack_require__(6);
	__webpack_require__(7);

	module.exports = helper.registerElement(tagName, HTMLElement.prototype, null, attachedCallback);

	function attachedCallback() {
	    var el = this;
	    var imageUrls = getImageUrls(el);
	    var ui = setupGalleryUI(el, imageUrls);
	    registerEventHandlers(el, ui);
	}


/***/ },
/* 1 */
/***/ function(module, exports) {

	
	module.exports = {
	    registerElement: function(tagName, proto, createdCallback, attachedCallback) {
	        var constructor = document.createElement(tagName).constructor;

	        if (constructor !== HTMLElement && constructor !== HTMLUnknownElement) {
	            // The element is already registered.
	            // We must not register it again, because an exception is thrown otherwise.
	            // Unknown elements have either HTMLElement or HTMLUnknownElement (Safari) as constructor.

	            return constructor;
	        }

	        return document.registerElement(tagName, {
	            prototype: Object.create(proto, {
	                createdCallback: { value: createdCallback },
	                attachedCallback: { value: attachedCallback }
	            })
	        });
	    }
	};

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = function (galleryElement) {
	    return [].slice.call(galleryElement.querySelectorAll('a, img')).map(function(el) {
	        return el.href || el.src || el.getAttribute('data-src') || el.getAttribute('data-src2');
	    });
	};

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var animation = __webpack_require__(4);
	var calcUIValues = __webpack_require__(5);

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

/***/ },
/* 4 */
/***/ function(module, exports) {

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

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = function(posX, width, imagesCount) {

	    var left, right, tx;
	    var maxWidth = imagesCount * width;

	    posX = (posX | 0) % maxWidth;

	    if (posX < 0) {
	        posX = imagesCount * width + posX;
	    }

	    tx = posX % width;
	    left = Math.floor((posX - tx) / width) % imagesCount;
	    right = (left + 1) % imagesCount;

	    return {
	        leftImage: left,
	        rightImage: right,
	        translateX: -tx,
	        currentImage: (imagesCount + Math.floor(posX / width) % imagesCount) % imagesCount
	    };
	};

/***/ },
/* 6 */
/***/ function(module, exports) {

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

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(8);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(10)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/sass-loader/index.js!./image-gallery.scss", function() {
				var newContent = require("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/sass-loader/index.js!./image-gallery.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(9)();
	// imports


	// module
	exports.push([module.id, "/*\r\n# Image Gallery\r\n\r\n```\r\n@import \"/js/external/image-gallery\";\r\n...\r\n\r\n```\r\n*/\nimage-gallery {\n  backface-visibility: hidden;\n  overflow: hidden;\n  display: block;\n  position: relative;\n  height: 100%;\n  background: transparent center center no-repeat url(\"data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2032%2032%22%20width%3D%2248%22%20height%3D%2248%22%20fill%3D%22%23ff7500%22%3E%3Cpath%20opacity%3D%22.25%22%20d%3D%22M16%200a16%2016%200%200%200%200%2032%2016%2016%200%200%200%200-32m0%204a12%2012%200%200%201%200%2024%2012%2012%200%200%201%200-24%22%2F%3E%3Cpath%20d%3D%22M16%200a16%2016%200%200%201%2016%2016h-4A12%2012%200%200%200%2016%204z%22%3E%3CanimateTransform%20attributeName%3D%22transform%22%20type%3D%22rotate%22%20from%3D%220%2016%2016%22%20to%3D%22360%2016%2016%22%20dur%3D%220.8s%22%20repeatCount%3D%22indefinite%22%2F%3E%3C%2Fpath%3E%3C%2Fsvg%3E\"); }\n  image-gallery .slider {\n    height: 100%;\n    width: 200%; }\n    image-gallery .slider > div {\n      position: absolute;\n      top: 0;\n      width: 50%;\n      height: 100%;\n      background-size: cover;\n      background-position: center center;\n      background-repeat: no-repeat; }\n    image-gallery .slider [data-left], image-gallery .slider [data-right] {\n      z-index: 2;\n      opacity: 1; }\n    image-gallery .slider [data-right], image-gallery .slider [data-right-loading-indicator] {\n      left: 50%; }\n  image-gallery .gallery-prev, image-gallery .gallery-next {\n    background: transparent center center no-repeat url(\"data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2226%22%20height%3D%2250%22%20viewBox%3D%220%200%2026%2050%22%3E%3Cpath%20d%3D%22M23.5%202.5l1.4%201.5-20.999%2021%2020.999%2021-1.4%201.5-22.4-22.5z%22%20opacity%3D%22.5%22%2F%3E%3Cpath%20fill%3D%22%23fff%22%20d%3D%22M23.5%202.5l1.4%201.5-20.999%2021%2020.999%2021-1.4%201.5-22.4-22.5z%22%2F%3E%3C%2Fsvg%3E\");\n    -webkit-tap-highlight-color: transparent;\n    width: 60px;\n    position: absolute;\n    top: 0;\n    left: 0;\n    bottom: 0;\n    border: 0;\n    outline: 0;\n    z-index: 1;\n    cursor: pointer;\n    transition: all 0.5s; }\n  image-gallery .gallery-next {\n    right: 0;\n    left: auto;\n    transform: rotate(-180deg);\n    transition: all 0.5s; }\n  image-gallery .gallery-next:hover {\n    background-color: rgba(244, 244, 244, 0.2); }\n  image-gallery .gallery-prev:hover {\n    background-color: rgba(244, 244, 244, 0.2); }\n  image-gallery [data-counter] {\n    color: #fff;\n    position: absolute;\n    bottom: 10px;\n    width: 100%;\n    left: 0;\n    text-align: center;\n    padding: 0;\n    text-shadow: 1px 1px #000;\n    z-index: 1; }\n", ""]);

	// exports


/***/ },
/* 9 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ }
/******/ ]);