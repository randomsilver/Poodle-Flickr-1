/*
 * POODLE - Flickr Gallery Global JS
 * @version 1.0
 * @author Team Poodle
 * @requires jQuery Core 1.7.2 - http://www.jquery.com/
*/

var FLICKR = window.FLICKR || {};

FLICKR.getImages = (function(){

	var createImgDomNode = function(imageUrl){
		var imageNode = '<img src="' + imageUrl + '" id="image'+ i +'"/>';
		$('#image-gallery').append(imageNode, i);
	};

	var requestPhotos = function(){
		var AUTH_TOKEN = '72157630111491400-e73df37bd10f1fc8',
			API_KEY = 'efa327fa27e64f3a0692c3ffb7f8ed5c',
			API_SIG = '0f8a80506649f998ba312e8df70e1f6d',
			GROUP_ID = '62496320%40N00',
			photoSetURL,
			showOnPage = 8,
			photoString = '';
        
        var photoSetURL = 'http://api.flickr.com/services/rest/?method=flickr.groups.pools.getPhotos&api_key='
        					+ API_KEY + '&group_id=' + GROUP_ID +'&per_page=' + showOnPage + '&format=json'
        					+ '&nojsoncallback=1&auth_token=' + AUTH_TOKEN + '&api_sig=' + API_SIG;
		
		$.ajax({
			url: photoSetURL,
			dataType: 'json',
			success: function(data){

				$.each(data.photos.photo, function(i, rPhoto){
					var basePhotoURL = 'http://farm' + rPhoto.farm + '.static.flickr.com/' + rPhoto.server + '/' + rPhoto.id + '_' + rPhoto.secret,  
						thumbPhotoURL = basePhotoURL + '_s.jpg',
						mediumPhotoURL = basePhotoURL + '.jpg';

					photoString = photoString + '<a ' + 'title="' + rPhoto.title + '" href="'+ mediumPhotoURL +'"><img src="' + thumbPhotoURL + '" alt="' + rPhoto.title + '"/></a>';           
				});
				 
				$(photoString).appendTo("#flickr-gallery");

			}
		});
	};

	return{
		init: function(){
			requestPhotos();
			FLICKR.addFilter.init();
		}
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

$(document).ready(function(){
	FLICKR.getImages.init();
});