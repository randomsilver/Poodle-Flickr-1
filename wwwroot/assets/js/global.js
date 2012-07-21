/*
 * POODLE - Flickr Gallery Global JS
 * @version 1.0
 * @author Team Poodle
 * @requires jQuery Core 1.7.2 - http://www.jquery.com/
*/

var FLICKR = window.FLICKR || {};

FLICKR.imageContainer = '#flickr-gallery';
FLICKR.imageCount = 0;
FLICKR.pages = 1;
FLICKR.currentPage = 1;
FLICKR.overlay = new Overlay({
						container:'body',
						content: ''
					 });

FLICKR.images = (function(){

	var renderPhotos = function( data ) {
		var photoString = '';
		
		$.each(data.photos.photo, function(i, rPhoto){
			var basePhotoURL = 'http://farm' + rPhoto.farm + '.static.flickr.com/' + rPhoto.server + '/' + rPhoto.id + '_' + rPhoto.secret,  
				thumbPhotoURL = basePhotoURL + '_n.jpg',
				mediumPhotoURL = basePhotoURL + '.jpg';

			FLICKR.imageCount = FLICKR.imageCount + 1;
			photoString = photoString + '<a ' + 'title="' + rPhoto.title + '" href="'+ mediumPhotoURL +'"><img class="flickr-img" id="flickr-img-' + FLICKR.imageCount + '" src="' + thumbPhotoURL + '" alt="' + rPhoto.title + '"/></a>';           
		});
		
		$('<div class="page" id="page-' + FLICKR.pages + '">' + photoString + '</div>').appendTo(FLICKR.imageContainer);
	};
	
	var requestPhotos = function( page, callback ){
		var API_KEY = '3d979b1c03c5752ff713cb9446f74410',
			GROUP_ID = '62496320%40N00',
			photoSetURL,
			showOnPage = 18,
        	page = page || 1;
        		
        photoSetURL = 'http://api.flickr.com/services/rest/?method=flickr.groups.pools.getPhotos&api_key=' + API_KEY + 
        			   '&group_id=' + GROUP_ID +'&page=' + page + '&per_page=' + showOnPage + '&format=json&nojsoncallback=1';
		
        // increasing total amount of pages in gallery
		FLICKR.pages = page;
		
        $.ajax({
			url: photoSetURL,
			dataType: 'json',
			success: function(data) {
				
				//rendering photos
				renderPhotos( data );
				
				// image montage
				FLICKR.montage.init( $('#page-' + FLICKR.pages), callback );
				
				//FLICKR.detectfaces.init();
			}
		});
	};

	return{
		init: function(){
			
			// showing loading dialog
			FLICKR.overlay.show();
			$('#loading').show();
			
			var callback = function() {
				$('#loading').hide();
				FLICKR.overlay.hide();
			};
			
			// loading first 18 photos
			requestPhotos( FLICKR.pages, callback );
			
			FLICKR.addFilter.init();
		},
		loadPhotos: requestPhotos
	};

}());

FLICKR.addFilter = (function(){
	
	var bindFliterListener = function(){
	
		var image = Caman("#localImg", function () {});
		
		function render(filter) {
			image.revert(function () {
				image[filter]().render();
			});
		};
			
		$('#filter-selection a').on('click', function(e){			
			e.preventDefault();
			
			var filter = $(this).attr('class');
			render(filter);
		});
		
	};
	
	return{
		init: function(){
			Caman.remoteProxy = Caman.IO.useProxy('php');
			bindFliterListener();
		}
	}
})();

FLICKR.detectfaces = (function(){
	
	init = function() {
		console.log($(FLICKR.imageContainer + ' #flickr-img-9'))
		
		$('img').each(function(index, image) {
			
			console.log(image)
			var coords = $(image).faceDetection({
				complete: function() {
					console.log('Fadedetection completed!');
				},
				error:function(img, code, message) {
					console.log('Error: '+message);
				}
			});
			
			for (var i = 0; i < coords.length; i++) {
				$('<div>', {
					'class':'face',
					'css': {
						'position':	'absolute',
						'left':		coords[i].positionX +5+'px',
						'top':		coords[i].positionY +5+'px',
						'width': 	coords[i].width		+'px',
						'height': 	coords[i].height	+'px'
					}
				})
				.appendTo('.container');
			}
		});
	};
	
	return {
		init: init
	};
	
})();

FLICKR.montage = (function(){
	
 	init = function( imageContainer, callback ) {
 		var $container 	= imageContainer || $(FLICKR.imageContainer),
 			$imgs		= $container.find('img').hide(),
 			totalImgs	= $imgs.length,
 			coords		= '',
 			cnt			= 0;

 		$imgs.each(function(i) {
 			var $img	= $(this);
 			$('<img/>').load(function() {
 				++cnt;
 				if( cnt === totalImgs ) {
 					$imgs.show();
 					$container.montage({
 						liquid 	: false,
 						fillLastRow : true,
 						margin: 5,
 						fixedHeight : 140,
 						minw : 100
// 						alternateHeight	: true,
// 						alternateHeightRange : {
// 							min	: 100,
// 							max	: 240
// 						}
 					});
 					if ( typeof callback === 'function' ) {
 						callback();
 					}
 				}
 			}).attr('src',$img.attr('src'));
 		});
 		
 	}
	
 	return {
 		init: init
 	}

})();

FLICKR.gallery = (function(){
	var rotatingTimeout = null,
		pageWidth = 940,
		galleryContainer = $( FLICKR.imageContainer );
	
	getCurrentPage = function() {
		return FLICKR.currentPage;
	};
	
	getTotalPages = function() {
		return FLICKR.pages;
	};
	
	moveToNextPage = function() {
		if ( FLICKR.pages > FLICKR.currentPage ) {
			FLICKR.currentPage = FLICKR.currentPage + 1;
			movePage();
			return FLICKR.currentPage;
		} else {
			return false;
		}
	};
	
	moveToPreviousPage = function() {
		if ( FLICKR.currentPage > 1 ) {
			FLICKR.currentPage = FLICKR.currentPage - 1;
			movePage();
			return FLICKR.currentPage;
		} else {
			return false;
		}
	};
	
	movePage = function() {
		clearTimeout( rotatingTimeout );
		var newLeftPos = getCurrentPage() * pageWidth - pageWidth;
		moveSlider( newLeftPos );
	};
	
	moveSlider = function( position ) {
		var cssTransformStart = 'rotateY(15deg) translateX('+ (-position) +'px)',
			cssTransformEnd = 'rotateY(0deg) translateX('+ (-position) +'px)';
		
		//galleryContainer.addClass('animate-sliding')
		galleryContainer.css({
			'-webkit-transform': cssTransformStart,
			'-moz-transform': cssTransformStart
		});
		rotatingTimeout = setTimeout(function(){
			galleryContainer.css({
				'-webkit-transform': cssTransformEnd,
				'-moz-transform': cssTransformEnd
			});
		}, 800);
	};
	
	return {
		getCurrentPage: getCurrentPage,
		getTotalPages: getTotalPages,
		moveToNextPage: moveToNextPage,
		moveToPreviousPage: moveToPreviousPage
	};
	
})();

FLICKR.eventHandlers = (function(){
	init = function() {
		
		$('.forward').click(function() {
			var callback,
				nextPageToLoad,
				movedToNextPage = FLICKR.gallery.moveToNextPage();
			
			// if we clicked forward and we are located on the last page then we need to preload next page from FLICKR
			if ( movedToNextPage === false ) {
				
				// showing overlay
				FLICKR.overlay.show();
				$('#loading').show();
				
				pageToLoad = FLICKR.gallery.getTotalPages() + 1;
				callback = function() {
					$('#loading').hide();
					FLICKR.overlay.hide();
					FLICKR.gallery.moveToNextPage();
				};
		
				// loading next page from flickr
				FLICKR.images.loadPhotos( pageToLoad, callback);
			}
		});
		
		$('.back').click(function() {
			FLICKR.gallery.moveToPreviousPage();
		});
	};
	
 	return {
 		init: init
 	};

})();


$(document).ready(function(){
	FLICKR.images.init();
	FLICKR.eventHandlers.init();
});