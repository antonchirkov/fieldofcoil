function Ruler(data, wrapper, basePath) {
	var _this = this,
		DEFAULT_WIDTH = 8,
		ANGLE_PITCH = {top: 90, left: 180, bottom: 270, right: 0},
		rulerWidth,
		hasRuler = true,
		hasProtractor = false,
		protractorInitialized = false,
		rulerInitialized = false,
		protractorPos = 'top',
		step = 42,
	    $wrapper = $(wrapper),
	    $controlWrapper = $('<div class="interactive-ruler"></div>'),
	    $rulerLink = $('<div class="ruler-link"></div>'),
	    $protractorLink = $('<div class="protractor-link"></div>'),
	    $controlPanel = $('<div class="control-panel"></div>'),
	    $protractor = $('<div class="interactive-ruler-protractor"><div class="back"></div></div>'),
	    $protractorRotatable = $('<div class="interactive-ruler-protractor-rotatable"><div class="black-back"></div></div>'),
	    $protractorLabel = $('<div class="interactive-ruler-protractor-label">0<sup>°</sup></div>'),
	    $ruler = $('<div class="interactive-ruler-ruler"></div>'),
	    $rulerRotate = $('<div class="ruler-rotate"></div>'),
	    $rulerRotatable = $('<div class="ruler-rotatable"></div>'),
	    $rulerLeft = $('<div class="ruler-left"></div>'),
	    $rulerRight = $('<div class="ruler-right"></div>'),
	    logging = false;
	
	function log(msg) {
		if (logging) {
			console.log(msg);
		}
	}
	
	this.init = function() {
		log('Ruler init');
		parseXml(data);
		if (hasRuler) {
			$controlPanel.append($rulerLink);
			$rulerLink.click(function() {
				$protractor.hide();
				if (!$ruler.is(':visible')) {
					$ruler.show();
					initRuler();
				} else {
					$ruler.hide();
				}
			});
		}
		if (hasProtractor) {
			$controlPanel.append($protractorLink);
			$protractor.addClass(protractorPos);
			$protractorLink.click(function() {
				$ruler.hide();
				if (!$protractor.is(':visible')) {
					$protractor.show();
					$protractor.css({'left': 'auto', 'top': 'auto'});
					initProtractor();
				} else {
					$protractor.hide();
				}
			});
		}
		$controlWrapper.append($controlPanel);
		$ruler.css('width', (rulerWidth * step) + 'px');
		$rulerRotatable.append($rulerLeft);
		$rulerRotatable.append($rulerRight);
		$ruler.append($rulerRotatable);
		$wrapper.append($ruler);
		$protractor.append($protractorLabel);
		$protractor.append($protractorRotatable);
		$wrapper.append($protractor);
		$wrapper.css({'padding': '4px', 'position': 'relative'});
		if (hasProtractor && hasRuler) {
			$wrapper.width(150);
		} 
 		$wrapper.append($controlWrapper);
		$wrapper.width($controlWrapper.outerWidth());
		$wrapper.height($controlWrapper.outerHeight());
	};
	
	function initRuler() {
		$ruler.css({'left': 'auto', 'top': 'auto'});
		$rulerRotatable.css({'-moz-transform': 'none',
							  '-webkit-transform': 'none',
							  '-o-transform': 'none',
							  'transform': 'none'});
		if (rulerInitialized) {
			$rulerRotatable.rotatable('destroy');
		}
		$ruler.css('opacity', '0');
		log('Init marks ' + rulerWidth);
		for (var i = 0; i < rulerWidth * 10 + 1; i++) {
			initMark({
				pos: i / 10
			});
		} 
		$rulerRotatable.rotatable();
		$ruler.draggable({
			drag: function() {
                //$(document).scrollTop(0);
				$(document).scrollLeft(0);
                //$('#slide').scrollTop(0);
				$('#slide').scrollLeft(0);
			},
			stop: function() {
                //$(document).scrollTop(0);
				$(document).scrollLeft(0);
                //$('#slide').scrollTop(0);
				$('#slide').scrollLeft(0);
			}, 
			start: function() {
                //$(document).scrollTop(0);
				$(document).scrollLeft(0);
                //$('#slide').scrollTop(0);
				$('#slide').scrollLeft(0);
			}
		});
		setTimeout(function() {
			$ruler.css('opacity', '1');
			rulerInitialized = true;
            if (window.navigator.userAgent.indexOf('MSIE') > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
                $ruler.bind('click', function (e) {
                    setTimeout(function () {
                        //$(document).scrollTop(0);
                        $(document).scrollLeft(0);
                        //$('#slide').scrollTop(0);
                        $('#slide').scrollLeft(0);
                    }, 1);
                });
            }
		}, 100);
	}
	
	function calculateAngle(rads) {
		var angle = Math.round(rads * (180 / Math.PI));
		if (angle < 0) {
			angle = 360 + angle;
		}
		angle = angle + ANGLE_PITCH[protractorPos];
		if (angle > 360) {
			angle = Math.round(angle % 360);
		}
		if (angle == 360) {
			angle = 0;
		}
		return angle;
	}
	
	function calculateLabel(rads) {
		var angle = calculateAngle(rads);
		$protractorLabel.html(angle + '<sup>°</sup>');
		dx = Math.cos(rads) >= 0 ? 0 : -$protractorLabel.outerWidth();
		dy = Math.sin(rads) >= 0 ? 0 : -$protractorLabel.outerHeight();
		$protractorLabel.css({left: (78 + 150 * Math.cos(rads) + dx) + 'px',
							  top: (78 + 150 * Math.sin(rads) + dy) + 'px'} );
	} 
	
	function initProtractor() {
		if (protractorInitialized) {
			return;
		}
		var rad = protractorPos == 'top' ? -1.57315 :
				  protractorPos == 'left' ? -3.14168 :
				  protractorPos == 'bottom' ? -4.71148 : 0;
		calculateLabel(rad);
		$protractorRotatable.rotatable({
			angle: rad,
			rotate: function(event, ui) {
				calculateLabel(ui.angle.current);
            },
			stop: function(event, ui) {
				calculateLabel(ui.angle.current);
            },
			rotationCenterX: 0, 
            rotationCenterY: 0
		});
		$protractor.draggable({
			drag: function() {
				$(document).scrollTop(0);
				$(document).scrollLeft(0);
				$('#slide').scrollTop(0);
				$('#slide').scrollLeft(0);
			},
			stop: function() {
				$(document).scrollTop(0);
				$(document).scrollLeft(0);
				$('#slide').scrollTop(0);
				$('#slide').scrollLeft(0);
			},
			start: function() {
				$(document).scrollTop(0);
				$(document).scrollLeft(0);
				$('#slide').scrollTop(0);
				$('#slide').scrollLeft(0);
			}
		});
        if (window.navigator.userAgent.indexOf('MSIE') > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
            $protractor.bind('click', function (e) {
                setTimeout(function () {
                    $(document).scrollTop(0);
                    $(document).scrollLeft(0);
                    $('#slide').scrollTop(0);
                    $('#slide').scrollLeft(0);
                }, 1);
            });
        }
		protractorInitialized = true;
	}
		
	function initMark(options) {
		log('Init mark ' + options.pos);
		var pos = options.pos,
		    $mark = $('<div class="mark"></div>'),
		    $label = $('<div class="label"></div>');
		$mark.css('left', (pos * step) + 'px');
		if (pos % 1 == 0) {
			$mark.addClass('main');
			$label.append(pos);
			$mark.append($label);
			setTimeout(function() {
				$label.css('left', -($label.width() / 2 - 1) + 'px');
			}, 100);
		} else
		if ((pos * 10) % 5 == 0) {
			$mark.addClass('medium');
		}
		$rulerRotatable.append($mark);
		
	}
	
	function parseXml(xml) {
		try {
			var ruler = $('<root>' + xml + '</root>').find('iline');
			protractorPos = ruler.attr('zeropos') || '' ? ruler.attr('zeropos') : 'top'; 
			rulerWidth = ruler.attr('max') || '' ? ruler.attr('max') : DEFAULT_WIDTH; 
			hasRuler = ruler.attr('ruler') || '' ? ruler.attr('ruler') === 'true' : true; 
			hasProtractor = ruler.attr('protractor') || '' ? ruler.attr('protractor') === 'true' : false;
			step = ruler.attr('step') || '' ? parseInt(ruler.attr('step')) : 42;
			return true;
		} catch (e) {
			return false;
		}
	}
}
