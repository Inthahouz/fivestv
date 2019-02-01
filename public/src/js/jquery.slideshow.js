(function($, window){

	var Slideshow = function(element, options, callinit){

		var self = this;

		this.options = $.extend({
			speed 	    : 1000,
			method	    : 'animate', //method of animation (animate, transition, fx...)
			easing 	    : 'swing',
			auto        : true,
			interval    : 7000,
			stopOnClick : false,
			nav         : false, //show the bullet-navigation
			navw        : null, //selector || DOM element
			preview     : false,
			offset      : '10', //width of the preview
			control     : true, //show right and left arrow controls
			controlw    : $('.controls'), //selector || DOM element
			loop 	    : true,
			clone       : 1,
			limit       : [0, 0],
			direction   : 'ltr', //ltr || rtl || ttb || btt - (Left To Right, Right To left, Top to Bottom, Bottom To Top)
			reverse     : false,
			callsync    : function(){},
			callback    : function(){}
		}, options || {});

		this.$slideshow      = $(element);
		this.$slides         = this.$slideshow.children('.slide');
		this.$navw           = ($(this.options.navw).length) ? $(this.options.navw) : this.$slideshow.parent();
		this.$nav            = null;
		this.$bullets        = null;
		this.$controlw       = ($(this.options.controlw).length) ? $(this.options.controlw) : this.$slideshow.parent();
		this.$tolControl     = null;
		this.$borControl     = null;
		this.$tolPreview     = null;
		this.$borPreview     = null;

		this.nbSlides 	     = this.$slides.length;
		this.timer 		     = null;
		this.isSliding       = false;

		this.orientation     = "horizontal";
		this.attrToAnimate   = "left";

		if (this.options.direction == 'ttb' || this.options.direction == 'btt'){
			this.orientation   = "vertical";
			this.attrToAnimate = "top";
		}

		this.nextIncrement = null;
		this.prevIncrement = null;

		if (this.options.direction == 'ltr' || this.options.direction == 'ttb'){
			this.nextIncrement = +1;
			this.prevIncrement = -1;
		} else if (this.options.direction == 'rtl' || this.options.direction == 'btt'){
			this.nextIncrement = -1;
			this.prevIncrement = +1;
		}

		this.activeIndex = this.$slides.index(this.$slideshow.children('.slide.active'));

		if (this.activeIndex == -1) {
			if (this.options.direction == 'ltr' || this.options.direction == 'ttb') {
				this.activeIndex = 0;
			} else if (this.options.direction == 'rtl' || this.options.direction == 'btt') {
				this.activeIndex = this.nbSlides - 1;
			}
			this.$slides.eq(this.activeIndex).addClass('active');
		}

		this.navClass 	  = "slideshow-nav-" + this.orientation;
		this.bulletClass  = "slideshow-bullet";
		this.controlClass = "slideshow-button-" + this.orientation;
		this.previewClass = "slideshow-preview-" + this.orientation;

		this.callinit = typeof callinit != 'undefined' ? callinit : function(){};

		if (this.nbSlides < 2) return;
		this.init();
	}

	Slideshow.prototype = {

        init: function() {
            var self = this;

            self.buildDOM();
            self.uiManager();

            self.callinit.call(self);
            if (self.options.auto) { self.playSlide(); }
        },

        buildDOM: function() {

        	var self 	        = this,
        		$slideshow      = self.$slideshow,
        		$slides         = self.$slides,
        		$navw     = self.$navw,
        		$controlw = self.$controlw;

        	$slides.each(function(index) { $(this).css(self.attrToAnimate, index + '00%'); });
        	$slideshow.css(self.attrToAnimate, '-' + self.activeIndex + '00%');

        	if (self.options.nav){

        		self.$nav = $('<div class="' + self.navClass + '"></div>');

        		for (var i = 0; i < self.nbSlides; i++){
    				$('<span class="' + self.bulletClass + '"></span>').appendTo(self.$nav);
    			}

        		self.$nav.appendTo($navw);
        		self.$bullets = self.$nav.children('.' + self.bulletClass);
        		self.$bullets.eq(self.activeIndex).addClass('active');

			}

        	if (self.options.control){

        		self.$tolControl = $('<span class="' + self.controlClass + '-tol"></span>');
        		self.$borControl = $('<span class="' + self.controlClass + '-bor"></span>');
        		self.$tolControl.appendTo($controlw);
        		self.$borControl.appendTo($controlw);

        		if (!self.options.loop){
	    			if (self.activeIndex <= 0 + self.options.limit[0]) { self.$tolControl.addClass('disabled'); }
	    			else if (self.activeIndex >= self.nbSlides - 1 - self.options.limit[1]) { self.$borControl.addClass('disabled'); }
        		}

			}

        	if (self.options.preview){

        		self.$tolPreview = $('<a class="' + self.previewClass + '-tol"></a>'); //TODO configurer le href ?? + maj lors du slide
        		self.$borPreview = $('<a class="' + self.previewClass + '-bor"></a>'); //TODO configurer le href ?? + maj lors du slide
        		self.$tolPreview.appendTo(self.$slideshow.parent());
        		self.$borPreview.appendTo(self.$slideshow.parent());

        		if (!self.options.loop){
	    			if (self.activeIndex <= 0 + self.options.limit[0]) { self.$tolPreview.addClass('disabled'); }
	    			else if (self.activeIndex >= self.nbSlides - 1 - self.options.limit[1]) { self.$borPreview.addClass('disabled'); }
        		}

			}

        	if (self.options.loop){

				if (self.options.control || self.options.preview || self.options.direction == 'ltr' || self.options.direction == 'ttb' || self.options.clone > 1) {
					for (var i = 0; i < self.options.clone; i++) {
						var $cloneSlide = $slides.eq(i).clone().addClass('clone');
						$cloneSlide.css(self.attrToAnimate, (self.nbSlides + i) + '00%').removeClass('active');
						$cloneSlide.appendTo($slideshow);
					}
				}

				if (self.options.control || self.options.preview || self.options.direction == 'rtl' || self.options.direction == 'btt' || self.options.clone > 1) {
					for (var i = 1; i <= self.options.clone; i++) {
						var $cloneSlide = $slides.eq(-i).clone().addClass('clone');
						$cloneSlide.css(self.attrToAnimate, '-' + i + '00%').removeClass('active');
						$cloneSlide.prependTo($slideshow);
					}
				}

        	}
		},

        razDOM: function(){
            var self = this;
            self.$slides.css(self.attrToAnimate, 'initial');
            self.$slideshow.css(self.attrToAnimate, '0');
            if (self.$nav) self.$nav.remove();
            if (self.$tolControl) self.$tolControl.remove();
            if (self.$borControl) self.$borControl.remove();
            if (self.$tolPreview) self.$tolPreview.remove();
            if (self.$borPreview) self.$borPreview.remove();
            self.$slideshow.find('.clone').remove();
        },

		uiManager: function(){

			var self = this,
				$bullets	= self.$bullets,
				$tolControl = self.$tolControl,
				$borControl = self.$borControl,
				$tolPreview = self.$tolPreview,
				$borPreview = self.$borPreview;

			if (self.options.nav){
				$bullets.on('click', function(e){
                    e.preventDefault();
					if (!$(this).hasClass('active')){
						self.slideTo($bullets.index(this), true);
					}
				});
			}

			if (self.options.control){

				$tolControl.on('click', function(e){
                    e.preventDefault();
					if ((self.activeIndex > 0 || self.options.loop) && !self.isSliding) {
                        self.slideTo(self.activeIndex - 1, true);
					}
				});

				$borControl.on('click', function(e){
                    e.preventDefault();
					if ((self.activeIndex < self.nbSlides - 1 || self.options.loop) && !self.isSliding) {
						self.slideTo(self.activeIndex + 1, true);
					}
				});

			}

			if (self.options.preview){
				$tolPreview.on('click', function(e){
                    e.preventDefault();
					if ((self.activeIndex > 0 + self.options.limit[0] || self.options.loop) && !self.isSliding) {
						self.slideTo(self.activeIndex - 1, true);
					}
				}).on('mouseenter', function() {
					if ((self.activeIndex > 0 + self.options.limit[0] || self.options.loop) && !self.isSliding) {
						self.showPreview(-self.activeIndex*100 + parseInt(self.options.offset, 10) + '%', false);
					}
				}).on('mouseleave', function() {
					if ((self.activeIndex > 0 + self.options.limit[0] || self.options.loop) && !self.isSliding) {
						self.showPreview('-' + self.activeIndex + '00%', true);
					}
				});

				$borPreview.on('click', function(e){
                    e.preventDefault();
					if ((self.activeIndex < self.nbSlides - 1 - self.options.limit[1] || self.options.loop) && !self.isSliding) {
						self.slideTo(self.activeIndex + 1, true);
					}
				}).on('mouseenter', function(){
					if ((self.activeIndex < self.nbSlides - 1 - self.options.limit[1] || self.options.loop) && !self.isSliding) {
						self.showPreview(-self.activeIndex*100 - parseInt(self.options.offset, 10) + '%', false);
					}
				}).on('mouseleave', function(){
					if ((self.activeIndex < self.nbSlides - 1 - self.options.limit[1] || self.options.loop) && !self.isSliding) {
						self.showPreview('-' + self.activeIndex + '00%', true);
					}
				});
			}
		},

		showPreview: function(step, cleantimer){

			var self 	   = this,
				$slideshow = self.$slideshow,
				cleantimer = cleantimer || false,
				properties = {};
				properties[self.attrToAnimate] = step;

			if (cleantimer) { self.stopSlide(); }

			$slideshow.stop()[self.options.method](properties, self.options.speed, self.options.easing, function(){ //TODO speed/easing specifique pour la preview ???
				if (cleantimer && self.options.auto) { self.playSlide(); }
			});

		},

		playSlide: function(){

			var self = this;
			clearInterval(self.timer);
			self.timer = setInterval(function() { self.slideNext(false); }, self.options.interval);

		},

		stopSlide: function(){

			var self = this;
			clearInterval(self.timer);

		},

		slideTo: function(newIndex, cleantimer, useanim){

			var self 		= this,
				$slideshow  = self.$slideshow,
				$slides     = self.$slides,
				$bullets	= self.$bullets,
				$tolControl = self.$tolControl,
				$borControl = self.$borControl,
				$tolPreview = self.$tolPreview,
				$borPreview = self.$borPreview,
				cleantimer  = cleantimer || false,
				useanim     = (typeof useanim != 'undefined') ? useanim : true,
				slidespeed  = (useanim) ? self.options.speed : 0,
				newPosition = null,
                slideIndex = newIndex,
				properties  = {};

			if (!self.isSliding && newIndex != self.activeIndex){

				if (cleantimer) { self.stopSlide(); }
				self.isSliding = true;

				if (self.options.loop && newIndex == -1){
					newIndex = self.nbSlides - 1;
					newPosition = "+=100%";
				} else if (self.options.loop && newIndex == self.nbSlides){
					newIndex = 0;
					newPosition = "-=100%";
				} else {
					newPosition = '-' + newIndex + '00%';
				}

                if (!self.options.loop){
                    if (newIndex <= 0 + self.options.limit[0]){
                        slideIndex = 0 + self.options.limit[0];
                        newPosition = '-' + (0 + self.options.limit[0]) + '00%';
                    }
                    if (newIndex >= self.nbSlides - 1 - self.options.limit[1]) {
                        slideIndex = self.nbSlides - 1 - self.options.limit[1];
                        newPosition = '-' + (self.nbSlides - 1 - self.options.limit[1]) + '00%';
                    }
                } else {
                    slideIndex = newIndex;
                }

                properties[self.attrToAnimate] = newPosition;

                if (self.options.nav){
                    $bullets.removeClass('active');
                    $bullets.eq(newIndex).addClass('active');
                }

                if (self.options.control){
                    $tolControl.add($borControl).add($tolPreview).add($borPreview).removeClass('disabled');

                    if (!self.options.loop && newIndex <= 0 + self.options.limit[0]) {
                        $tolControl.add($tolPreview).addClass('disabled');
                    } else if (!self.options.loop && newIndex >= self.nbSlides - 1 - self.options.limit[1]){
                        $borControl.add($borPreview).addClass('disabled');
                    }
                }

                self.options.callsync($slides, self.activeIndex, newIndex);

				$slideshow.stop()[self.options.method](properties, slidespeed, self.options.easing, function(){

					$slideshow.css(self.attrToAnimate, '-' + slideIndex + '00%');
					self.options.callback($slides, self.activeIndex, newIndex);
					$slides.eq(self.activeIndex).removeClass('active');
					$slides.eq(newIndex).addClass('active');
					self.activeIndex = newIndex;
					self.isSliding   = false;

					if (cleantimer && self.options.auto && !self.options.stopOnClick) { self.playSlide() }

				});
			}
		},

		slideNext: function(cleantimer){

			var self 		= this,
				cleantimer  = (typeof cleantimer != 'undefined') ? cleantimer : true;

			if (!self.options.loop && self.options.reverse && (self.activeIndex + self.nextIncrement == -1 + self.options.limit[0] || self.activeIndex + self.nextIncrement == self.nbSlides - self.options.limit[1])) {
				self.reverseDirection();
			}

			if (self.options.loop || (self.activeIndex + self.nextIncrement != -1 + self.options.limit[0] && self.activeIndex + self.nextIncrement != self.nbSlides - self.options.limit[1])) {
				self.slideTo(self.activeIndex + self.nextIncrement, cleantimer);
			}

		},

		slidePrev: function(cleantimer){

			var self 		= this,
				cleantimer  = (typeof cleantimer != 'undefined') ? cleantimer : true;

			if (!self.options.loop && self.options.reverse && (self.activeIndex + self.prevIncrement == -1 + self.options.limit[0] || self.activeIndex + self.prevIncrement == self.nbSlides - self.options.limit[1])) {
				self.reverseDirection();
			}

			if (self.options.loop || (self.activeIndex + self.prevIncrement != -1 + self.options.limit[0] && self.activeIndex + self.prevIncrement != self.nbSlides - self.options.limit[1])) {
				self.slideTo(self.activeIndex + self.prevIncrement, cleantimer);
			}

		},

		reverseDirection: function(){

			var self 	  = this,
				direction = null;

			switch (self.options.direction){
				case 'ltr':
					direction = 'rtl';
					break;
				case 'rtl':
					direction = 'ltr';
					break;
				case 'ttb':
					direction = 'btt';
					break;
				case 'btt':
					direction = 'ttb';
					break;
				default:
					direction = 'ltr';
					break;
			}

			self.options.direction = direction;

			if (self.options.direction == 'ltr' || self.options.direction == 'ttb'){
				self.nextIncrement = +1;
				self.prevIncrement = -1;
			} else if (self.options.direction == 'rtl' || self.options.direction == 'btt'){
				self.nextIncrement = -1;
				self.prevIncrement = +1;
			}
		},

		setLimits: function(limitLeft, limitRight){

			var self = this;
			self.options.limit = [limitLeft, limitRight];

			if (!self.options.loop){
				if (self.activeIndex < 0 + self.options.limit[0]){
					self.slideTo(0 + self.options.limit[0]);
				} else if (self.activeIndex > self.nbSlides - self.options.limit[1]){
					self.slideTo(self.nbSlides - self.options.limit[1]);
				}
			}

		},

        destroy: function(){

            var self = this;
            self.stopSlide();
            self.razDOM();
            self.$slideshow.removeData('slideshow');

        },

        refresh: function(){

            var self = this;

            self.stopSlide();

            self.$slides = self.$slideshow.children('.slide');
            self.nbSlides = self.$slides.length;

            self.razDOM();
            self.buildDOM();
            self.uiManager();

            if (self.options.auto) { self.playSlide() }

        }
	};

	$.fn.slideshow = function(options, callinit){

		return this.each(function(){

			var $self = $(this);
            if ($self.data('slideshow')) return;

            var instance = new Slideshow(this, options, callinit);
            $self.data('slideshow', instance);

        });

	};

	window.Slideshow = Slideshow;

})(jQuery, window, undefined);
