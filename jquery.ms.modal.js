(function($) {
	$.fn.keyPressed = function(keyCode, onKeyEvent) {
		return $(this).each(function(idx, e) {
			$(e).keyup(function(event) {
				function onMatch(){
					event.preventDefault();
					if (onKeyEvent && typeof onKeyEvent == 'function') onKeyEvent(e);
				}
				if($.isArray(keyCode) && $.inArray(event.keyCode, keyCode) >= 0){
					onMatch();
					return this;
				}
				if (typeof keyCode == 'number' && event.keyCode == keyCode) {
					onMatch();
					return this;
				}
			});
		});
	}
	
	$.popup = {
		defaults:{
			overlayId : 'jcemodal-overlay',
			overlayZIndex:100
		},
		events:{},
		fixPosition:function(e){
                        var w = $(window);
                        e.css({
                            'top':w.height()/2-e.height()/2,
                            'left':w.width()/2-e.width()/2,
                            'position':'absolute'
                        });
		},
		bindEvents:function(e, events){
			$(window).resize(function(){
				$.popup.fixPosition(e);
				$.popup.overlay.get().css('width', $(document).width()).css('height', $(document).height());
			}).scroll(function(){
				$.popup.fixPosition(e);
			});
			
			e.find('[func*=click_]').click(function(){
				var funcName = $(this).attr('func');
				if(typeof $.popup.events[funcName] == 'function'){
					$.popup.events[funcName]();
				}
				e.close();
			});
			
			$(document).keyPressed([13, 27], function(){
				e.close();
			});
		}
	};

	$.popup.overlay = {
		get:function(){
			return $('#' + $.popup.defaults.overlayId);
		},
		show:function(){
			$("<div/>").attr('id', $.popup.defaults.overlayId).css({
				background : 'rgb(0,0,0)',
				width : $(document).width(),
				height : $(document).height(),
				position : 'absolute',
				opacity : '0.5',
				'top' : '0',
				'left' : '0',
				'z-index' : $.popup.defaults.overlayZIndex
			}).appendTo('body');
		},
		hide:function(){
			$.popup.overlay.get().remove();
		}
	};
	
	$.fn.popup = function(events) {
		var e = this;
		$.popup.overlay.show();
		$.popup.fixPosition(this);
		this.css('z-index', $.popup.defaults.overlayZIndex+1).show();
		$.popup.events = events == null ? {} : events;
		$.popup.bindEvents(this);
		return this;
	};

	$.fn.close = function() {
		$.popup.overlay.hide();
		this.hide();
		return this;
	};
})(jQuery);


