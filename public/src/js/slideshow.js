(function($, window, undefined) {

    'use strict';

    var slideshow = {

        init: function() {

			this.body = $('body');
			this.startSlideshow();

        },

        startSlideshow: function() {

			this.body.find('.slideshow').each(function() {

				var $slideshow = $(this),
					$figcaption = $slideshow.parents('.section-slideshow').find('.figcaption'),
					$nav = $slideshow.parents('.section-slideshow').find('.nav'),
				 	speed = ( typeof $slideshow.data('speed') != 'undefined') ? $slideshow.data('speed') : 1000;

				$slideshow.slideshow({
					speed: speed,
					controlw: $slideshow.parents('.section-slideshow').find('.controls'),
					callsync: function($slides, oldIndex, newIndex) {},
					callback: function($slides, oldIndex, newIndex) {

						var $oldSlide = $slides.eq(oldIndex),
							$newSlide = $slides.eq(newIndex);

						$figcaption.find('li:eq('+ oldIndex +')').removeClass('active');
						$figcaption.find('li:eq('+ newIndex +')').addClass('active');
						$nav.find('li:eq('+ oldIndex +')').removeClass('active');
						$nav.find('li:eq('+ newIndex +')').addClass('active');

					}
				}, function() {

					var $slideshow = this.$slideshow,
						$nav = $slideshow.parents('.section-slideshow').find('.nav');

					// controls
					$slideshow.parents('.section-slideshow').find('.controls').hover(
						function(){ $(this).parents('.section-slideshow').find('.slideshow').data('slideshow').stopSlide() },
						function(){ $(this).parents('.section-slideshow').find('.slideshow').data('slideshow').playSlide() }
					);

					// navigation
					if( $nav.length > 0 ){

						for( var i = 0, j = $nav[0].childElementCount; i < j; i++ ){

							(function(i){

								$($nav[0].children[i]).click( function(){

									var $currentSlideshow = $(this).parent('.nav').siblings('.within').find('.slideshow');

									$currentSlideshow.data('slideshow').stopSlide();
									$currentSlideshow.data('slideshow').slideTo(i);

								});

							})(i);

						}

						$nav.hover(
							function(){ $(this).parents('.section-slideshow').find('.slideshow').data('slideshow').stopSlide() },
							function(){ $(this).parents('.section-slideshow').find('.slideshow').data('slideshow').playSlide() }
						);

					}

					$slideshow.on('touchstart.al-fakher MSPointerDown.al-fakher', function(event){
						//event.preventDefault();

						var $this = $(this),
							touch = (window.navigator.msPointerEnabled) ? event.originalEvent : event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];

						$this.data('x', touch.pageX);

						var endSwipe = function(event){

							var touch = (window.navigator.msPointerEnabled) ? event.originalEvent : event.originalEvent.touches[0] || event.originalEvent.changedTouches[0],
								deltaX = $this.data('x') - touch.pageX;

							if (Math.abs(deltaX) > 100){
								if (deltaX > 0) {
									$slideshow.data('slideshow').slideNext();
								} else if (deltaX < 0){
									$slideshow.data('slideshow').slidePrev();
								}
							}

							$(document).off('.al-fakher', endSwipe);
						}

						// $(document).on('touchend.al-fakher MSPointerUp.al-fakher', endSwipe);
					});

					$(document).keydown(function(e){
					    switch((e.keyCode ? e.keyCode : e.which)){
					        case 37:
					            $slideshow.data('slideshow').slidePrev();
					        break;
					        case 39:
					            $slideshow.data('slideshow').slideNext();
					        break;
						}
					});
				});

			});

        }

    }

    slideshow.init();

})(jQuery, window);