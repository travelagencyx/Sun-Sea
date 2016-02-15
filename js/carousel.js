var carouselModule = (function (){
	var _args = {};
	var _carouselSelector;
	var _imgArr = [];
	var _count = 0;
	
	//Fade out function
	function fadeout(){
	document.querySelector('.' + _carouselSelector).style.opacity = 0;
	}

	var position = 0; //position is set to zero

	function slidingImages() {
	if ( document.images ) {
		if ( position < _count ) {
			imageSrc(position); // call the image source
			position += 1;
		} else {
			imageSrc(0);
			position = 1;
		}
	}
	setTimeout(fadeout, 4500);
	setTimeout(slidingImages, 5000);
	}

	function imageSrc(position) {
	document.querySelector('.' + _carouselSelector).style.backgroundImage  = _imgArr[position];
	document.querySelector('.' + _carouselSelector).style.opacity = 1;
	}
	
	return{
	//First argument - array of images; Second argument - carousel class example: 'accommodationcarousel'
		init: function(Args){
		_args=Args;
		_imgArr = _args[0];
		_carouselSelector = _args[1];
		_count = _imgArr.length; // assign images array length
		},
		slidingImages: slidingImages
	};
})();