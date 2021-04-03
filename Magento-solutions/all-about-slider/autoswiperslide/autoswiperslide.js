define(['jquery','Amasty_ShopbyBase/js/swiper.min'],function($) {
	'use strict';
	$.widget('mage.autoslider',{
		options: {
			mediaQueryString: '(min-width: 768px)',
			swiperoptions: {}
		},
		
		tempswiperinstance: null,

		_create: function() {
			var mqstring = this.options.mediaQueryString, 
				self = this,
				mql = window.matchMedia(mqstring);
			mql.addEventListener("change", function(){self._breakpointcheck(self,mql)});
			var change = new Event('change');
			mql.dispatchEvent(change);
		},
		_enableSwiper: function() {
			var self = this;
			if(this.element) {
				this.tempswiperinstance = new Swiper(self.element, self.options.swiperoptions);	
			}
		},


		_breakpointcheck: function(self,mql) {
			if (mql.matches) {
			  	if (self.tempswiperinstance) {
			  		console.log(self.tempswiperinstance);
			      	self.tempswiperinstance.destroy();
		      	  	$(self.element).find('.swiper-wrapper').removeAttr('style');
	        		$(self.element).find('.swiper-slide').removeAttr('style');      
			      }
			    return;  
			} else {
			   
			    return self._enableSwiper();
			}
		}
	})
	return $.mage.autoslider;
})