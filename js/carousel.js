var carouselModule = (function (){
	var _args = {};
	var _carouselSelector;
	var _imgArr = [];
	var _count = 0;
	var fadetimeout;
	var slidetimeout;
	
	
	//Fade out function
	function fadeout(){
		_carouselSelector.style.opacity = 0;
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
		fadetimeout = setTimeout(fadeout, 5500);
		slidetimeout = setTimeout(slidingImages, 6000);
	}

	function imageSrc(position) {
		_carouselSelector.style.backgroundImage  = _imgArr[position];
		_carouselSelector.style.opacity = 1;
	}
	
	

	return{
	//First argument - array of images; Second argument - carousel class example: 'accommodationcarousel'
		init: function(Args){
		_args=Args;
		_imgArr = _args[0];
		_carouselSelector = document.querySelector('.' + _args[1]);
		_count = _imgArr.length; // assign images array length
		_carouselSelector.addEventListener("mouseover", function(){ clearTimeout(fadetimeout);});
		_carouselSelector.addEventListener("mouseover", function(){ clearTimeout(slidetimeout);});	
		_carouselSelector.addEventListener("mouseout", function(){ fadetimeout = setTimeout(fadeout, 5500);});
		_carouselSelector.addEventListener("mouseout", function(){ slidetimeout = setTimeout(slidingImages, 6000);});
		},
		slidingImages: slidingImages
	};
})();