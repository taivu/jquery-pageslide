(function($){
  $.fn.pageSlide = function(options) {
    
    settings = $.extend({
		    width:          "300px", // Accepts fixed widths
		    duration:       "normal", // Accepts standard jQuery effects speeds (i.e. fast, normal or milliseconds)
		    direction:      "left", // default direction is left.
		    modal:          false, // if true, the only way to close the pageslide is to define an explicit close class. 
		    start:          function(){},
		    stop:           function(){},
		    complete:       function(){}
		}, options);
		
		// these are the minimum css requirements for the pageslide elements introduced in this plugin.
		
		pageslide_slide_wrap_css = {
		  position: 'fixed',
      width: '0',
      top: '0',
      height: '100%',
      zIndex:'1'
		};
		
		pageslide_body_wrap_css = {
		  position: 'relative'
		};
		
		pageslide_blanket_css = { 
	    position: 'absolute',
	    top: '0px',
	    left: '0px',
	    height: '100%',
	    width: '100%', 
	    opacity: '0.0',
	    backgroundColor: 'black',
	    zIndex: '0',
	    display: 'none'
	  };
		
		function _initialize() {
      // Create and prepare elements for pageSlide
      var psBodyWrap = document.createElement("div");
      $(psBodyWrap).css(pageslide_body_wrap_css);
      $(psBodyWrap).attr("id","pageslide-body-wrap").width( $("body").width() );
    
      var psSlideContent = document.createElement("div");
      $(psSlideContent).attr("id","pageslide-content").width( settings.width );
    
      var psSlideWrap = document.createElement("div");
      $(psSlideWrap).css(pageslide_slide_wrap_css);
      $(psSlideWrap).attr("id","pageslide-slide-wrap").append( psSlideContent );
      
      // introduce the blanket if modal option is set to true.
      if (settings.modal == true) {
        var psSlideBlanket = document.createElement("div");
        $(psSlideBlanket).css(pageslide_blanket_css);
        $(psSlideBlanket).attr("id","pageslide-blanket");
      }
      
      // Wrap and append so that we have the slide containers
	    $("body").contents().wrapAll( psBodyWrap );
	    $("body").append( psSlideBlanket );
	    $("body").append( psSlideWrap );
    
	    $("#pageslide-slide-wrap").click(function(){ return false; });

      
	    // If a user clicks the document, we should hide the pageslide
	    // and override that click functionality for the slide pane itself
	    if (settings.modal != true) {
	      $(document).click(function(elm) { _closeSlide(elm); });
	    }
	    
	    // Callback events for window resizing
	    $(window).resize(function(){
        $("#pageslide-body-wrap").width( $("body").width() );
      });
	  };
	  
		function _openSlide(elm) {
		  _showBlanket();
		  settings.start();
		  // decide on a direction
		  if (settings.direction == "right") {
		    direction = {right:"-"+settings.width};
		    $("#pageslide-slide-wrap").css({left:0});
		  } 
		  else {
		    direction = {left:"-"+settings.width};
		    $("#pageslide-slide-wrap").css({right:0});
		    
		  };
		  
    	$("#pageslide-slide-wrap").animate({width: settings.width}, settings.duration);
		  $("#pageslide-body-wrap").animate(direction, settings.duration, function() {
		    settings.stop();
	      $.ajax({
  		      type: "GET",
  		      url: $(elm).attr("href"),
  		      success: function(data){
  		        $("#pageslide-content").html(data)
  		          .queue(function(){
  		            $(this).dequeue();
  		            // add hook for a close button
  		            $(this).find('.pageslide-close').click(function(elm){
  		              _closeSlide(elm);
  		              $(this).find('pageslide-close').unbind('click');
  		            });
  		            settings.complete();
  		          });
  		      }
  		    });
		  });
		};
		
		function _closeSlide(elm) {
		  if ($(elm)[0].button != 2) { // if not right click.
		    _hideBlanket();
  		  settings.start();
  		  direction = (settings.direction == "left") ? {left: "0"} : {right: "0"};
  		  $("#pageslide-body-wrap").animate(direction, settings.duration);
  	    $("#pageslide-slide-wrap").animate({width: "0"}, settings.duration, function() {
  	      $("#pageslide-content").empty();
          settings.stop();
          settings.complete();
        });
      }
		};
		
		// this is used to activate the modal blanket, if the modal setting is defined as true.
		function _showBlanket() {
	    if(settings.modal == true) {
	      $("#pageslide-blanket").toggle().animate({opacity:'0.8'}, 'fast','linear');
	    }
	  };
	  
	  // this is used to deactivate the modal blanket, if the modal setting is defined as true.
	  function _hideBlanket(){
	    if (settings.modal == true) {
  	    $("#pageslide-blanket").animate({opacity:'0.0'}, 'fast','linear',function(){
  	      $(this).toggle();
  	    });
	    }
	  };
	  
		
    // Initalize pageslide, if it hasn't already been done.
    if($("#pageslide-body-wrap").length == 0) _initialize();
    
    return this.each(function(){
      $(this).unbind("click").bind("click", function(){
    	  _openSlide(this);
    	  return false;
    	});
    });
    
  };
})(jQuery);