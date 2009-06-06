(function($){
  $.fn.pageSlide = function(options) {
    
    settings = $.extend({
		    width:          "300px", // Accepts fixed widths
		    duration:       "normal", // Accepts standard jQuery effects speeds (i.e. fast, normal or milliseconds)
		    direction:      "left", // default direction is left.
		    start:          function(){},
		    stop:           function(){},
		    complete:       function(){}
		}, options);
		
		function _initialize() {
      // Create and prepare elements for pageSlide
      var psBodyWrap = document.createElement("div");
      $(psBodyWrap).attr("id","pageslide-body-wrap").width( $("body").width() );
    
      var psSlideContent = document.createElement("div");
      $(psSlideContent).attr("id","pageslide-content").width( settings.width );
    
      var psSlideWrap = document.createElement("div");
      $(psSlideWrap).attr("id","pageslide-slide-wrap").append( psSlideContent );
      
      // Wrap and append so that we have the slide containers
	    $("body").contents().wrapAll( psBodyWrap );
	    $("body").append( psSlideWrap );
      
	    $("#pageslide-slide-wrap").click(function(){ return false; });
	    
	    // If a user clicks the document, we should hide the pageslide
	    // and override that click functionality for the slide pane itself
	    $(document).click(function() {
	      _closeSlide();
	    });
	    
	    // Callback events for window resizing
	    $(window).resize(function(){
        $("#pageslide-body-wrap").width( $("body").width() );
      });
	  };
		
		
		function _openSlide(elm) {
		  settings.start();
		  // decide on a direction
		  if (settings.direction == "right") {
		    direction = {right:"-"+settings.width};
		    $("#pageslide-slide-wrap").css({left:0});
		  } 
		  else {
		    direction = {left:"-"+settings.width};
		    $("#pageslide-slide-wrap").css({right:0});
		    
		  }
		  
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
  		            $(this).find('.pageslide-close').click(function(){
  		              _closeSlide();
  		              $(this).find('pageslide-close').unbind('click');
  		            });
  		            settings.complete();
  		          });
  		      }
  		    });
		  });
		};
		
		function _closeSlide(elm) {
		  settings.start();
		  direction = (settings.direction == "left") ? {left: "0"} : {right: "0"};
		  $("#pageslide-body-wrap").animate(direction, settings.duration);
	    $("#pageslide-slide-wrap").animate({width: "0"}, settings.duration, function() {
	      $("#pageslide-content").empty();
        settings.stop();
        settings.complete();
      });
		}
		
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