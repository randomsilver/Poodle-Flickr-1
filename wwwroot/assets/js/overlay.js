Overlay = (function(){
	
	function Overlay( options ) {
		this.overlay = null;
		this.options = options;
		this.container = options.container || 'body';
	}
	
	Overlay.prototype = {
		show: function() {
			
			if ( this.overlay === null ) {
				this.overlay = $('<div class="ui-overlay"></div>');
				this.overlay.hide();
				this.overlay.appendTo( this.container );
				this.overlay.css('filter', 'alpha(opacity=70)');
			}
			
			if ( this.options.content ) {
				this.overlay.append( this.options.content );
			}
		
		    //this.adjustHeight();
		
		    $(this.overlay).fadeIn();
	    },
	    
	    hide: function() {
	        $(this.overlay).fadeOut();
	    },
	    
	    hideInstantly: function() {
            $(this.overlay).css('display', 'none');
	    },

	    adjustHeight: function() {
            var top = 0,
            height = $(this.container).height();
            
            if ( typeof this.options.topMargin !== 'undefined' ) {
                height = height - this.options.topMargin;
                $(this.overlay).css('top', this.options.topMargin);
	        } 
	        $(this.overlay).width($(this.container).width());
	        $(this.overlay).height( height );
	    }
	};
	
	return Overlay;
	
}());