/*
 * POODLE - Flickr Gallery Global JS
 * @version 1.0
 * @author Team Poodle
 * @requires jQuery Core 1.7.2 - http://www.jquery.com/
*/

var FLICKR = window.FLICKR || {};

FLICKR.getImages = (function(){

	var photoSetURL = 'http://api.flickr.com/services/feeds/groups_pool.gne?id=83376903@N00&format=json&jsoncallback=?';
	
	var createImgDomNode = function(imageUrl){
		var imageNode = '<img src="' + imageUrl + '"/>';
		$('body').append(imageNode);
	};

	var requestPhotos = function(){
		$.ajax({
			url: photoSetURL,
			dataType: 'jsonp',
			success: function(data){

				var photoArr = data.items;

				for (i in photoArr){
					createImgDomNode(data.items[i].media.m);
				}


			}
		});
	};

	return{
		init: function(){
			requestPhotos();
		}
	};

}());

$(document).ready(function(){
	FLICKR.getImages.init();
});