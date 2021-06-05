function ISchemeStar() {
	this.init = function(wrapper, xmlData, params) {

		return new modelNS.ISchemeStar({
			model: new modelNS.ISchemeStarModel({
				xmlData: xmlData,
				wrapper: wrapper,
				// basePath: basePath,
				params: params,
				restyling: true,
			})
		}).renderOnShow();

	};
}

modelNS.ISchemeStarModel = modelNS.BaseModel.extend({
	defaults: _.extend({}, modelNS.BaseModel.prototype.defaults, {}),
	initialize: function(options) {
    this.defaults.width = options.width; // > 600 ? options.width : 600;	// fix #8265
    this.defaults.height = options.height > 400 ? options.height : 400;
		this.options = options;
		modelNS.BaseModel.prototype.initialize.apply(this, [options]);
	},
	parseXML: function () {},
});


modelNS.ISchemeStar = modelNS.BaseModelView.extend({
	type: 'ischemestar',
	initialize: function(options) {
		modelNS.BaseModelView.prototype.initialize.apply(this, arguments);
		this.options = options.model.options;
		this.cachedContent = {};
	},

	render: function() {
		modelNS.BaseModelView.prototype.render.apply(this, arguments);

		var options = this.options,
			$wrapper = options.wrapper,
			DATA = options.xmlData,
			params = options.params;

		var $blocking = $('<div class="blocking-screen"></div>'),
			$popup = $('<div class="carousel-popup"></div>'),
			popupsData = [],
			popupCollection;

		var self = this;
		this.DATA = '';
		this.DEFAULT_WIDTH = 800;
		this.DEFAULT_HEIGHT = 600;
		this.MIN_WIDTH = 400;
		this.MIN_HEIGHT = 300;
		this.MAX_WIDTH = 1200;
		this.MAX_HEIGHT = 1000;
		this.ROTATION_RIGHT = 0;
		this.ROTATION_LEFT = 1;
		this.ROTATION_NONE = -1;
		this.POSITION_LEFT = 0;
		this.POSITION_NORMAL = 1;
		this.DEGREE = Math.PI / 180;
		this.DEFAULT_ELEMENT_WIDTH_SCALE = 0.2;
		this.DEFAULT_ELEMENT_HEIGHT_SCALE = 0.17;
		this.DEFAULT_CONTENT_WIDTH_SCALE = 0.25;
		this.DEFAULT_CONTENT_HEIGHT_SCALE = 0.25;
		this.BLOCK_COLORS = ['#0E6DAD', '#ECB888', '#EEEB8A', '#A8DBA0', '#A1CADC', '#E2DED3'];
		this.carouselBackground = $('<div class="carousel-background"></div>');
		this.carouselCanvas = $('<canvas class="carousel-canvas"></canvas>');
		this.overlay = $('<div class="carousel-overlay"></div>');
		this.carouselCircle = {};
		this.logging = false;
		this.moving = false;
		this.openAnimation = false;
		this.hideAnimation = false;
		this.rotated = false;
		this.rotationDiff = 0;
		this.position = this.POSITION_NORMAL;

		this.openedElement = null;
		// this.demoPlaying = false;	// ?? мешает если при старте должна быть обычная модель, и меняться при .startDemo
		this.demofinish = [];
		this.timers = {};

		var SHOW_CHILD_BLOCKS_TITLE = 'Показать дочерние элементы';
		var HIDE_CHILD_BLOCKS_TITLE = 'Скрыть дочерние элементы';

		this.jsonData = {
			settings: {
				width: this.DEFAULT_WIDTH,
				height: this.DEFAULT_HEIGHT
			},
			content: []
		};

		var translate = 'translate(0, 50px)'; // fix #8486

		this.init = function($wrapper, DATA, params) {

			// #12074 Модель может не рендериться в режиме создания скриншота, если есть превью (например m368077.jpg)
			if (!$wrapper.length) {
				return;
			}

			var self = this;
			this.params = params;
			this.DATA = $(typeof(DATA) == 'string' ? $.parseXML(DATA): DATA);
			this.log('Init Carousel...');
			this.$model = this.$el.addClass('ischeme scheme-star disable-select inline-blk overflow-hidden').appendTo($wrapper);
			this.parseCarousel();
			this.log('Settings...');
			this.log(JSON.stringify(this.jsonData.settings));
			this.carouselBackground.width(this.jsonData.settings.width);
			this.carouselBackground.height(this.jsonData.settings.height);
			this.$model.append(this.carouselBackground);
			this.carouselCanvas.width(this.jsonData.settings.width);
			this.carouselCanvas.height(this.jsonData.settings.height);
			this.carouselCanvas.attr('width', this.jsonData.settings.width);
			this.carouselCanvas.attr('height', this.jsonData.settings.height);
			this.$model.height(this.jsonData.settings.height);
			this.$model.width(this.jsonData.settings.width);
			$(this.$model.parents('table')[0]).attr('width', this.jsonData.settings.width + 'px');
			this.$model.append(this.carouselCanvas);

			if (this.jsonData.settings.main) this.$model.addClass('main');
			if (this.jsonData.settings.showtime) this.$model.addClass('showtime');

			this.carouselCircle.radius = (this.jsonData.settings.height - (this.jsonData.settings.elementHeight)) / 2;
			this.carouselCircle.center = {
				x: self.jsonData.settings.width / 2,
				y: self.jsonData.settings.height / 2
			};

			this.rect = this.$model[0].getBoundingClientRect();

			this.log('Radius: ' + this.carouselCircle.radius);
			this.log('Center: ' + this.carouselCircle.center.x + ' ' + this.carouselCircle.center.y);
			this.createCarousel();
            // this.$model.on('click', '.fakelink', function(e) {
			// 	var popupId = $(this).attr('popup');
			// 	if (popupId || '') {
			// 		var popup = popupCollection.get(popupId);
			// 		if (popup) {
			// 			self.$model.append(new modelNS.PopupView({ model: popup }).render().el);
			// 		}
			// 	}
			// });
			this.handlePopups();

			// после создания карусели перестраиваем формулы
			// PlayerCourse.updateMathJax();

			// предзагрузка изображений и инициализация MathType
			this.prepareContent();

			PlayerCourse.updateMathJax();

			// 'openblock' setting
			if (this.jsonData.settings.openblock) {
				var $open = this.getElementById(this.jsonData.settings.openblock);

				// if not fadein element
				if ($open.length) {
					this.openElement($open, this.getElementJson($open));
				}
			}

			return this;
		};

		this.log = function(msg) {
			if (this.logging) {
				console.log(msg);
			}
		};
		this.parseCarousel = function() {
			var XML = $(this.DATA);

			this.parseSettings(XML);

			this.log('Settings parsed...');
			this.log(JSON.stringify(this.jsonData));

			this.parseElements(XML);
			this.parsePopups(XML);

			if (this.jsonData.settings.showtime) this.showtimeOrder();

			this.log('XML parsed...');
		};
		this.parsePopups = function(xmlData) {
			var popups = xmlData.find('popup'),
				centralContent = this.jsonData.content[0],
				self = this;

			popups.each(function() {
				try {
					var id = $(this).attr('name'),
						width = $(this).attr('width'),
						height = $(this).attr('height'),
						content = courseML.getHTMLFromCourseML($(this));

					if (width) width -= 8; // fix jquery .popup() generate size +8px

					popupsData.push({ closableOnOverlayClick: true, id: id, content: content, width: width, height: height });
				}
				catch (e) {}
			});

			if (centralContent) {
				popupsData.push({
					closableOnOverlayClick: true,
					id: 'central',
					content: centralContent.content,
					width: centralContent.infoWidth && centralContent.infoWidth - 8 || this.jsonData.settings.contentBlockWidth || "auto", // fix jquery .popup() generate size +8px
					height: centralContent.infoHeight || this.jsonData.settings.contentBlockHeight,
					onClose: function() { self.closeCentralPopup() }
				});
			}

			if (popupsData.length != 0) {
				xmlData.find('popup').remove();
				this.popupCollection = popupCollection = new modelNS.PopupCollection(popupsData);
			}
		};
		this.parseSettings = function(xmlData) {
			var settingsData = xmlData.find('settings'),
				$ischeme = xmlData.find('ischeme'),
				settings = this.jsonData.settings;

			settings.showtime = $ischeme.attr('showtime') == 'true';

			settings['height'] = this.$model.data('height') && this.$model.data('height') != 0 ? this.$model.data('height') :
				settingsData.length != 0 && settingsData.find('height') && $(settingsData.find('height')[0]).text() != '' ?
				parseInt($(settingsData.find('height')[0]).text()) :
				($ischeme.attr('height') ? parseInt($ischeme.attr('height')): this.DEFAULT_HEIGHT);

			settings['width'] = this.$model.data('width') && this.$model.data('width') != 0 ? this.$model.data('width') :
				settingsData.length != 0 && (settingsData.find('width') || '') && $(settingsData.find('width')[0]).text() != '' ? parseInt($(settingsData.find('width')[0]).text()) :
				$ischeme.attr('width') || '' ? parseInt($ischeme.attr('width')): 800;

			settings.openblock = this.params.openblock || $ischeme.attr('openblock');

			// if (settings.height < this.DEFAULT_HEIGHT) settings.height = this.DEFAULT_HEIGHT;	// ??? fix #8176
			// if (settings.height < this.MIN_HEIGHT) settings.height = this.MIN_HEIGHT;
			// if (settings.width < this.MIN_WIDTH) settings.width = this.MIN_WIDTH;
			if (settings.width > this.MAX_WIDTH) settings.width = this.MAX_WIDTH;
			if (settings.height > this.MAX_HEIGHT) settings.height = this.MAX_HEIGHT;

			settings['elementHeight'] = settingsData.length != 0 && (settingsData.find('blockHeight') || '') && $(settingsData.find('blockHeight')[0]).text() != '' ? parseInt($(settingsData.find('blockHeight')[0]).text()) :
				$ischeme.attr('blockHeight') || '' ? parseInt($ischeme.attr('blockHeight')): Math.round(settings.height * this.DEFAULT_ELEMENT_HEIGHT_SCALE);

			settings['elementWidth'] = settingsData.length != 0 && (settingsData.find('blockWidth') || '') && $(settingsData.find('blockWidth')[0]).text() != '' ? parseInt($(settingsData.find('blockWidth')[0]).text()) :
				$ischeme.attr('blockWidth') || '' ? parseInt($ischeme.attr('blockWidth')): Math.round(settings.width * this.DEFAULT_ELEMENT_WIDTH_SCALE);

			settings['contentBlockHeight'] = settingsData.length != 0 && (settingsData.find('contentBlockHeight') || '') && $(settingsData.find('contentBlockHeight')[0]).text() != '' ? parseInt($(settingsData.find('contentBlockHeight')[0]).text()) :
				$ischeme.attr('contentBlockHeight') || '' ? parseInt($ischeme.attr('contentBlockHeight')): null;

			settings.contentBlockWidth = settingsData.length != 0 && (settingsData.find('contentBlockWidth') || '') && $(settingsData.find('contentBlockWidth')[0]).text() != '' ? parseInt($(settingsData.find('contentBlockWidth')[0]).text()) :
				$ischeme.attr('contentBlockWidth') || '' ? parseInt($ischeme.attr('contentBlockWidth')): ''; // Math.round(settings.width * this.DEFAULT_CONTENT_WIDTH_SCALE);

			//#8355  firsov
			settings.typeline = $ischeme.attr('typeline');
			if (settings.typeline == undefined) {
				settings.typeline = 'line';
			}
			//end #8355 firsov

			settings.main = $ischeme.attr('main') === 'true' || $ischeme.attr('main') === undefined;

			// var minHeight = settings.elementHeight * 3.8;	// ???????????
			// if (settings.height < minHeight) {
			// 	settings.height = minHeight;
			// }
			if (settings.contentBlockHeight > settings.height) { // - 75) { // ??? #8168
				settings.contentBlockHeight = settings.height; // - 75;	// ??? #8168
			}
			// var minWidth = settings.height + (parseInt(settings.contentBlockWidth) + 80);	// ?????
			// settings.width = minWidth;
		};

		this.fadeinCount = 1;
		this.currentFadein = 1;

		this.parseElements = function(xmlData) {

			var self = this;

			xmlData.find('block').each(function() {

				var $block = $(this),
					$name = $block.find('name'),
					$info = $block.find('info'),
					color = $block.attr('color'),
					parent = $block.attr('parent'),
					fadein = ($block.attr('fadein') || 0) * 1,
					order = ($name.attr('order') || $info.attr('order') || 0) *1;

				var blockJSON = {
						id: $block.attr('id'),
						title: self.xmlToString($name),
						titleAlign: $name.attr('align'),
						titleValign: $name.attr('valign'),
						content: $info.length ? self.xmlToString($info): '',
						parent: parent != 0 && parent || '',
						fadein: fadein,
						width: $block.attr('width'),
						height: $block.attr('height'),
						infoWidth: $info.attr('width'),
						infoHeight: $info.attr('height'),
						color: color,
						order: order,

						lightstart: $block.attr('lightstart'),
						lightend: $block.attr('lightend'),
						time: $name.attr('time'),
						endtime: $info.attr('endtime'),
						showInfoAtTime: $info.attr('time'),
					};

				if (!blockJSON.parent) {
					blockJSON.isCentral = true;
					self.centralColor = color || self.BLOCK_COLORS[0];
					blockJSON.color = self.centralColor;
				}

				if (blockJSON.fadein)
					if (self.fadeinCount < blockJSON.fadein) self.fadeinCount = blockJSON.fadein;

				self.jsonData.content.push(blockJSON);
			});
		};

		this.randomColor = function($element) {
			var elements = this.$model.find('.carousel-element.child').not('central'),
				count = elements.length,
				centralColorIndex = this.BLOCK_COLORS.indexOf(this.centralColor),
				colors = this.BLOCK_COLORS.slice();

			var minAngle = 0;
			elements.sort(function(a, b) {
				var contentA = parseFloat($(a).data('angle'));
				var contentB = parseFloat($(b).data('angle'));

				if (minAngle > contentA) minAngle = contentA;
				return (contentA < contentB) ? -1: (contentA > contentB) ? 1: 0;
			});

			var position;
			elements.each(function(i) {
				if ($element[0] == this) {
					position = i;
				}
			});

			var nextPosition = position + 1;
			var prevPosition = position - 1;
			if (prevPosition < 0) prevPosition = elements.length - 1;
			if (nextPosition >= elements.length) nextPosition = 0;

			// remove central color
			if (centralColorIndex >= 0) colors.splice(centralColorIndex, 1);

			var prevColor = $(elements[prevPosition]).attr('color'),
					prevColorIndex = colors.indexOf(prevColor);
			if (prevColorIndex >= 0) colors.splice(prevColorIndex, 1);

			var nextColor = $(elements[nextPosition]).attr('color'),
				nextColorIndex = colors.indexOf(nextColor);
			if (nextColorIndex >= 0) colors.splice(nextColorIndex, 1);

			var randomColor = colors[Math.floor(Math.random() * (colors.length - 1))];

			$element.attr('color', randomColor);
			// $element.css('background-color', randomColor);

			// $(elements[nextPosition]).css('border', '2px solid ' + randomColor);
			// $(elements[prevPosition]).css('border', '2px solid ' + randomColor);

			return randomColor;
		}

		this.xmlToString = function(xmlData) {
			this.log('XML to string...');
			this.log(xmlData[0]);

			var div = $('<div>'),
				nodeNameStart = '<' + xmlData[0].nodeName + '>',
				nodeNameEnd = '</' + xmlData[0].nodeName + '>';
			div.append(courseML.getHTMLFromCourseML(xmlData));
			this.log(div.html());
			var string = div.html();
			string = string.replace(nodeNameStart, '').replace(nodeNameEnd, '');
			return string;
		};

		this.createCarousel = function() {
			this.log('Create carousel...');
			if (this.jsonData.content || '') {
				var count = this.jsonData.content.length;
				for (var i = 0; i < this.jsonData.content.length; i++) {
					if ((this.jsonData.content[i].fadein || 1) >= 2)
						count--;
				}
				var index = 0;
				for (var i = 0; i < this.jsonData.content.length; i++) {
					if ((this.jsonData.content[i].fadein || 1) < 2) {
						index++;
						this.createCarouselElement(this.jsonData.content[i], index - 1, count - 1);
					}
				}
				this.$childs = this.$model.find('.carousel-element.child');
				this.redrawLines();
			}
		};

		this.redrawLines = function () {
			var $centers = this.$model.find('.carousel-element.child:not(".current"), .content-block.visible');
			this.drawLines(getElementsCenters($centers), this.carouselCanvas[0].getContext('2d'));
		};

		this.setAnimation = function(isActive) {
			this.animationActive = isActive;
		};

		this.getAnimation = function() {
			return this.animationActive;
		};

		function getElementsCenters(elements) {
			var centers = [];
			elements.each(function () { // OPTIMIZATION filter('[visible]') = this.$childs ?
				var $this = $(this);
				centers.push(getCenter($this));
			});
			return centers;
		};

		function getCenter($element) {
			//var wrapRect = self.rect, // #11418 Закомментировал
            // #11418 Если схема расположена во вкладке и она изначально не была активна, то self.rect будет иметь нулевые значения
			// и расчет будет неверным. Добавим получение актуальных значений при вычислении центра.
            var wrapRect = self.$model[0].getBoundingClientRect(),
				rect = $element[0].getBoundingClientRect(),
				// #12977 Используем параметр popupZoomScale, если модель открывается в ВО
				top = (rect.top - wrapRect.top) / (self.params.popupZoomScale ? self.params.popupZoomScale : CourseConfig.zoomScale),
				left = (rect.left - wrapRect.left) / (self.params.popupZoomScale ? self.params.popupZoomScale : CourseConfig.zoomScale),
				// top = parseFloat(top && top.replace('px', '')),
				// left = parseFloat(left && left.replace('px', '')),
				width = rect.width / (self.params.popupZoomScale ? self.params.popupZoomScale : CourseConfig.zoomScale),
				height = rect.height / (self.params.popupZoomScale ? self.params.popupZoomScale : CourseConfig.zoomScale),
				halfWidth = width/2,
				halfHeight = height/2;
				// width = parseFloat(width && width.replace('px', '')),
				// height = parseFloat(height && height.replace('px', ''));

			return {
				x: left + halfWidth,
				y: top + halfHeight,
				w: halfWidth,
				h: halfHeight,
				el: $element,
			};
		};


		this.reinitCarousel = function() {
			if (this.jsonData.content || '') {
				var count = this.jsonData.content.length;
				for (var i = 0; i < count; i++) {
					this.createCarouselElement(this.jsonData.content[i], i - 1, this.jsonData.content.length - 1);
				}
				this.redrawLines();
				// PlayerCourse.updateMathJax(); ??
			}
		};


		this.carouselElementContent = function(title) {
				var $tmp = $('<table class="content"><tr></tr></table>'),
					$tr = $tmp.find('tr'),
					$title = $('<td/>').append(title).appendTo($tr),
					$leftFigure = $title.find('.leftFigure'),
					$rightFigure = $title.find('.rightFigure'),
					$centerFigure = $title.find('.centerFigure');

				if ($leftFigure.length) $('<td/>').append($leftFigure).prependTo($tr);
				if ($rightFigure.length) $('<td/>').append($rightFigure).appendTo($tr);

				// #13835 (Исправление вертикального выравнивания). Закомментирован код ниже. Причина, код добавляет пустую строку вниз, вследствии занимает место внизу, вертикальное центрирование невозможно. Горизонтальное цетрирование работает без этого кода.
				/* if ($centerFigure.length) $tr.before($('<tr/>').append($('<td/>').append($centerFigure))); */
				return $tmp;
			},

		// создает плашку
		this.createCarouselElement = function(elementJSON, position, count) {
				var self = this;

				this.log('Create element...');
				this.log('Element json: ' + JSON.stringify(elementJSON));
				this.log(this.jsonData.settings);
				var $element = $('<div class="carousel-element"></div>'),
					$content = $('<div class="content"></div>'),
					children = elementJSON.children,
					width = elementJSON.width || this.jsonData.settings.elementWidth,
					height = elementJSON.height || this.jsonData.settings.elementHeight,
					id = elementJSON.id;
				$element.width(width);
				$element.height(height);
				$element.data({
					height: height,
					width: width,
				})
				$element.attr('elementid', id);

				if (elementJSON.hidden && (this.demoPlaying || params.activeDemo)) {
					$element.hide();
				} else {
					$element.attr('visible', '');
				}

				$content.html(this.carouselElementContent(elementJSON.title));
				$element.append(this.carouselElementContent(elementJSON.title));

				// Фирсов  ARCH #8331
				$element.find('>table')
					.attr('name-align', elementJSON.titleAlign)
					.attr('name-valign', elementJSON.titleValign);

				if (elementJSON.content) {
					$("<div class='btn-show-content'/>").appendTo($element);
					$element.addClass('has-content');
				}

				if ((elementJSON.parent == '') || elementJSON.parent == null) {
					if (this.fadeinCount > 1) {
						$element.append("<div class='btn-expand-childs' title='" + SHOW_CHILD_BLOCKS_TITLE + "'/>").click(function() {
							self.centralFadeOut();
						})
					}
					var position = {
							left: (this.jsonData.settings.width - $element.width()) / 2,
							top: (this.jsonData.settings.height - $element.height()) / 2,
					};
					$element.addClass('central');
					$element
						.css(position)
						.data(position);

					this.$central = $element;

					if (elementJSON.content) {
						// $("<div class='btn-show-content'/>").click(function(e) {
						// 	self.openCentralPopup(e);
						// }).appendTo(element);
						//ARCH #8377 firsov
						$element.click(function(e) {
							self.openCentralPopup(e);
						});

					}
					else {
						$element.css({ 'cursor': 'default' });
					}
				} else {
					// var angle = position * (2 * Math.PI / count) - 0.5 * Math.PI;
					var angle = -position * (2 * Math.PI / count) + 0.5 * Math.PI;	// по часовой стрелке, используется для showtime
					self.setElementPositionByAngle($element, angle);
					$element.addClass('child');
					$element.attr('data-count', count);
					$element.click(function(e) {
						e.preventDefault();
						e.stopPropagation();
						self.openElement(this, elementJSON);
					});
				}
				this.$model.append($element);

				// generate background color of element
				if (elementJSON.color) {
					$element.css({ 'background': elementJSON.color });	// #8950
					// element.attr('color', elementJSON.color);
				}
				else {
					self.randomColor($element);
				}

				// ?????
				var listenerCicles = 0;
				var completeListener = setInterval(function() {
					listenerCicles++;
					if (listenerCicles == 100) {
						clearTimeout(completeListener);
					}
					if ($content.height() == 0) {
						return;
					}
					clearTimeout(completeListener);
					if ($content.height() < $element.height()) {
						var top = (($element.height() - $content.height()) / 2) - 2;
						$content.css('top', top + 'px');
					}
				}, 10);
				return $element;
			};

		this.getElementJson = function($element) {
				var elementsJson = this.jsonData.content,
					id = $element.attr('elementid');
				for (var i = 0; i < elementsJson.length; i++) {
					if (elementsJson[i].id == id) return elementsJson[i];
				}
			},

			// opacity 0=>1
			this.showElement = function (elementJSON) {
				var self = this,
						$elem = this.getElementById(elementJSON.id);

				elementJSON.hidden = false;
				$elem.attr('visible', '');
				$elem.show(200, function () {
					self.redrawLines();
				});
			}

			// opacity 0
			this.hideElement = function (elementJSON) {
				var self = this,
					 	$elem = this.getElementById(elementJSON.id);

					 	$elem.hide().removeAttr('visible');

				this.redrawLines();
			}


			this.openElement = function(element, elementJSON) {
				if (this.isDemoPause()) return this.saveDemoMoment();

				this.openingElement = elementJSON;

				if (!element) element = this.getElementById(elementJSON.id);

				var $el = $(element);
				if (this.openAnimation || this.hideAnimation || this.moving) {
					return;
				}

				this.moving = true;
				$el.addClass('clicked');

				var callback = function() {

					// auto fadeout
					if (elementJSON.fadein > self.currentFadein) {
						self.currentFadein = elementJSON.fadein-1;
						self.centralFadeOut(function () {
								self.elementRotate(null, elementJSON)
						});
						return;
					}

					self.elementRotate($el, elementJSON);
				};

				// auto close opened element
				if (this.position == this.POSITION_LEFT) {
						this.moveElementsBack(callback, elementJSON);
						this.closeBlock();
				} else {
					callback();
				}
			}

		this.openCentralPopup = function(e) {

			if (this.openAnimation || this.hideAnimation || this.moving) {
				return;
			}

			e.preventDefault();
			e.stopPropagation();

			if (this.position == this.POSITION_LEFT) {
				this.moveElementsBack();
				this.closeBlock(function () {self.openCentralPopup(e)});	// #9445 если положить в moveElementsBack то не успевает скрыть контент
				return;
			}

			var central = $(e.target).hasClass('central') ? $(e.target): $($(e.target).parents('.central')[0]),
				top = central.css('top'),
				newTop = self.carouselCircle.center.y +
				self.carouselCircle.radius * Math.sin(-Math.PI / 2) -
				(self.jsonData.settings.elementHeight / 2);
			this.$model.find('.carousel-element:not(.central), .content-block:visible').addClass('faded-by-central').fadeOut(500);
			this.carouselCanvas.hide();
			central.data('top', top);
			central.css({ top: newTop }); // this.duration(500)
			setTimeout(function() {
				central.hide();
				// central.css({'top': top});
				showPopup('central');
			}, 300);
		}

		this.closeCentralPopup = function() {
			var central = $('.central'),
				top = central.data('top');

			this.$model.find('.faded-by-central').removeClass('faded-by-central').fadeIn(500);
			this.carouselCanvas.fadeIn(500);
			central.show();
			central.css({ top: top }); // duration(500));
		}

		/**
		 * Вращать к элементу
		 */
		this.elementRotate = function($element, elementJSON) {
			if (this.isDemoPause()) return this.saveDemoMoment();
			if (!this.openingElement) return;

			if (!$element) $element = this.getElementById(elementJSON.id);

			var angle = parseFloat($element.data('angle')),
				rotationAngle = angle >= 0 ? angle: 2 * Math.PI + angle,
				rotation = rotationAngle <= Math.PI && rotationAngle > 0 ? self.ROTATION_LEFT :
				rotationAngle > Math.PI && rotationAngle < 2 * Math.PI ? self.ROTATION_RIGHT :
				self.ROTATION_NONE;
			rotationAngle = rotationAngle <= Math.PI ? rotationAngle: 2 * Math.PI - rotationAngle;
			if (rotationAngle > Math.PI && rotationAngle < 2 * Math.PI) {
				rotationAngle = 2 * Math.PI - rotationAngle;
			}
			var callback = function() {

				// Отметить элемент текущим, он не будет смещен влево
				self.$model.find('.carousel-element.child').removeClass('current');
				$element.addClass('current');

				// auto visible, used in showtime
				if (elementJSON.hidden) self.showElement(elementJSON);

				// console.log(elementJSON, elementJSON.content)
				if (elementJSON.content) {

					self.openContent(elementJSON);
				} else {
					self.moving = false;
					self.onBlockOpened(elementJSON);	// !!
				}

			};

			self.rotate(rotation, rotationAngle, $element.attr('data-count'), callback);
		};

		this.openContent = function (elementJSON)	{
			var self = this;

			// только для демо
			if (this.demoPlaying && elementJSON.showInfoAtTime) {
				var time = elementJSON.showInfoAtTime * 1000,
						timeDiff = time - this.demoPlayTime();

				// this.moving = false;	// ??? другие анимации может сбить!
				if (timeDiff > 0) {
					this.moving = false;	// другие анимации?
					this.onBlockOpened(elementJSON);
					return;
				}
			}

			var $element = this.getElementById(elementJSON.id);
			this.moveElementsLeft(elementJSON, function() {
				self.openBlock($element, elementJSON);
			});
		}

		/**
		 * Cоздаmь и отобразить контент открытой плашки
		 */
		this.openBlock = function($element, elementJSON) {
			if (this.isDemoPause()) return this.saveDemoMoment();
			if (!this.openingElement) return;

			if (!$element) $element = this.getElementById(elementJSON.id);

			var contentHeight = elementJSON.infoHeight || self.jsonData.settings.contentBlockHeight,
				contentWidth = elementJSON.infoWidth || self.jsonData.settings.contentBlockWidth,
				modelWidth = this.jsonData.settings.width,
				modelHeight = this.jsonData.settings.height,
				startWidth = $element.css('width').replace('px', ''), // self.jsonData.settings.elementWidth,
				startHeight = $element.css('height').replace('px', ''), // self.jsonData.settings.elementHeight,
				top = $element.css('top').replace('px', '') * 1, // dont use .position() becose problem work with scale()
				left = $element.css('left').replace('px', '') * 1,
				count = this.$model.find('.carousel-element.child').length,
				$content = elementJSON.content ? this.cachedContent[elementJSON.id] : this.carouselElementContent(elementJSON.title),
				padding = 20;

			this.log('Open element');

			var $openedBlock,
					$close;

			if (this.$model.find('.content-block').length == 0) {
				$openedBlock = $('<div class="content-block visible"></div>')
					.appendTo(this.$model);

				$close = $('<div class="close-content-btn"></div>')
					.click(function() {
						if (!self.openingElement) {
							self.openingElement = $openedBlock; // ???
							self.moveElementsBack(null, elementJSON);
							self.closeBlock();
						}
					})
					.hide()	// показываем после того как блок открылся
					.appendTo($openedBlock);
			} else {
				$openedBlock = this.$model.find('.content-block').addClass('visible');
				$close = $openedBlock.find('.close-content-btn');
			}

			this.updateCenters();

			// контент разный, контейнер один и тот же
			$openedBlock.append($content.hide());

			// store init data for restoring in hide proccess
			$openedBlock.data({
				startWidth: startWidth,
				startHeight: startHeight,
				startLeft: left,
				startTop: top
			});

			// $openedBlock.html(''); // ? #10717
			// $openedBlock.find('.content').hide();

			$element.hide();
			this.log('Top position: ' + top);
			$openedBlock.css({
				'width': startWidth,
				'height': startHeight,
				'top': top,
				'left': left,
				'background-color': $element.css('background-color')
			});

			var $temp = $openedBlock.find('.content-temp');
			if (!$temp.length) {
				$temp = $('<div class="content content-temp"></div>')
					.appendTo($openedBlock);
			}

			// временный контейнер для просчета размеров -- переделать? Зачем временный когда можно использовать настоящий??
			// #12085 Пробовал использовать оригинальный контент. У блока появляются полосы прокрутки. Причин не выяснял.
			// Следует обратить внимание на высоту $openedBlock, когда в нем отображается $temp и сравнить с тем, когда его нет.
			$temp.html('').append($content.clone().show());

			if (!contentWidth) {
				var initWidth = $openedBlock.css('width'),
					initHeight = $openedBlock.css('height');

				$openedBlock.width('auto');
				$openedBlock.height(contentHeight ? contentHeight - padding * 2: "auto");

				// $temp.css('overflow', 'auto');	// 'auto' #8356
				$temp.show();

				contentWidth = $openedBlock.width();
				if (contentWidth > modelWidth / 2) contentWidth = modelWidth / 2;
				if (contentWidth < modelWidth / 3) contentWidth = modelWidth / 3;
				contentWidth += padding * 2;

				$temp.hide();

				$openedBlock.width(initWidth);
				$openedBlock.height(initHeight);
			}

			if (!contentHeight) {
				var initWidth = $openedBlock.css('width'),
					initHeight = $openedBlock.css('height'),
					padding = 20;

                $openedBlock.width('auto'); // #12085 Если сначала не указать auto, то в дальнейшем не получается установить width. Неизвестно почему.
				$openedBlock.width(contentWidth - padding * 2);
				$openedBlock.height('auto');

				$temp.show();

				// $openedBlock.css('left', 500);
				// return;

				contentHeight = $openedBlock.height() + padding * 2 - 20; // 20 padding-bottom #8356 #9291

				// if (contentHeight < startHeight) contentHeight = startHeight;	// #8356 высота ВО просчитывается неверно. Возможно, стоит какое-то значение по-умолчанию. Надо выставить его в 30 пикселей.
				if (contentHeight > modelHeight) contentHeight = modelHeight;

				$temp.hide();

				$openedBlock.width(initWidth);
				$openedBlock.height(initHeight);
			}

			// place opened block that it not go away from model borders
			var openLeft = left - (contentWidth - startWidth) / 2,
				maxLeft = modelWidth - contentWidth;
			if (openLeft > maxLeft) openLeft = maxLeft;
			$openedBlock.data('left', openLeft);

			var $img = $openedBlock.find('img'),
					imgCount = $img.length,
					loadedImgCount = 0;

			this.openAnimation = true;

			$openedBlock.attr({
				animate: 'open-block',
				duration: this.duration(300), // TODO:
			});

			// Анимация раскрытия в следующем такте
			setTimeout(function () {
				$openedBlock.css({
					width: contentWidth,
					height: contentHeight,
					padding: padding,
					left: openLeft,
					// left: left - (self.jsonData.settings.contentBlockWidth - self.jsonData.settings.elementWidth) / 2,
					top: self.carouselCircle.center.y - contentHeight / 2
				}).one('transitionend', function() {
					self.onBlockOpened(elementJSON, this);

					// после анимации развертывания - отображаем элементы
					$close.show();
					$content.show();
				});
			}, 0);

			// show demo
			// if (this.demoSpeed) setTimeout(function() {
			//
			// }, this.demoSlideTime);
		};

		/**
		 * Закрыть раскрытую плашку и скрыть демонстриуемый контент плашки
		 */
		this.closeBlock = function(callback) {
			if (this.isDemoPause()) return this.saveDemoMoment();
			if (!this.openingElement) return;

			if (!this.$model.find('.content-block').is(':visible')) return;	// old ??

			this.openedContent = null;

			this.hideAnimation = true;
			var count = this.$model.find('.carousel-element.child').length;
			var $contentBlock = this.$model.find('.content-block'),
				contentHeight = $contentBlock.outerHeight();
			this.log('Element height: ' + $contentBlock.position().top);

			// $contentBlock.html(''); ? #10717
			$contentBlock.find('.content').remove();
			$contentBlock.find('.close-content-btn').hide();

			// console.log(this.cachedContent["2"][0])
			// duration(400)
			$contentBlock.css({
				width: $contentBlock.data('startWidth'),
				height: $contentBlock.data('startHeight'),
				padding: 0,
				left: $contentBlock.data('startLeft'),
				top: $contentBlock.data('startTop')
			}).one('transitionend', function() {
				$contentBlock.removeClass('visible');
				self.$model.find('.carousel-element').show();
				self.$model.find('.carousel-element.child.current').removeClass('current');
				self.updateCenters();
				self.hideAnimation = false;
				if (callback || '') {
					callback();
				}
			});
		};


		this.setElementPositionByAngle = function($element, angle) {
			var width = $element.data('width'),
				height = $element.data('height'),
				a = (this.jsonData.settings.width - width) / 2,
				b = (this.jsonData.settings.height - height) / 2;
				// radius = Math.min(a, b);

			var left = this.carouselCircle.center.x +
				// radius * Math.cos(angle) -
				a * Math.cos(angle) -
				(width / 2),
				top = this.carouselCircle.center.y +
				// radius * Math.sin(angle) -
				b * Math.sin(angle) -
				(height / 2);

			$element.css({
				top: top,
				left: left
			}).data({
				angle: angle % (2 * Math.PI),
				left: left,
				top: top,
			});
		};

		// поварачивает карусель на определенный градус
		this.rotate = function(rotation, rotationAngle, count, callback) {

			if (rotation == this.ROTATION_NONE || Math.abs(rotationAngle) < 0.05) {
				if (callback) {
					callback();
				}
				return;
			}
			var self = this,
				ang = 0,
				canvas = self.carouselCanvas[0],
				ctx = canvas.getContext('2d');
			self.moving = true;

			var $elements = this.$childs;
			$elements.addClass('rotating');

			var prevTime = null,
					duration = 1200 * 400 / this.duration(400);

			cancelAnimationFrame(this.timers.rotate);
			this.$childs.stop();
			this.$central.stop();

			this.timers.rotate = requestAnimationFrame(function rotate(time) {
				if (!prevTime) {
					prevTime = time;
					return self.timers.rotate = requestAnimationFrame(rotate);
				}

				angleStep = (time - prevTime)/60*0.5; // 0.5 angle per 60ms

				var centers = getElementsCenters($elements);

				if ((rotation == self.ROTATION_RIGHT && ang >= rotationAngle) ||
					(rotation == self.ROTATION_LEFT && ang <= -rotationAngle)) {
					self.log('Rotation animation complete...');
					clearInterval(self.timers.rotate);
					self.rotated = true;
					if (callback || '') {
						$elements.removeClass('rotating');
						callback();
					}
					return;
				}
				if (rotationAngle - Math.abs(ang) < angleStep * self.DEGREE) {
					angleStep = (rotationAngle - Math.abs(ang)) / self.DEGREE;	// Math.round ?? #8755
				}

				// if (angleStep == 0) {	// ???	// #8755
				// 	angleStep = 1;
				// }

				ang = rotation == self.ROTATION_RIGHT ? ang + angleStep * self.DEGREE: ang - angleStep * self.DEGREE;

				// if (rotation == self.ROTATION_RIGHT && ang >= rotationAngle) angleStep = angleStep - Math.abs(rotationAngle - ang);	// ?? 8755
				// if (rotation == self.ROTATION_LEFT && ang <= -rotationAngle) angleStep = angleStep - Math.abs(rotationAngle - ang);  // ?? 8755

				$elements.each(function() {
					var angle = parseFloat($(this).data('angle'));
					angle = rotation == self.ROTATION_RIGHT ? angle + angleStep * self.DEGREE: angle - angleStep * self.DEGREE;
					self.setElementPositionByAngle($(this), angle);
				});
				self.drawLines(centers, ctx);

				self.timers.rotate = requestAnimationFrame(rotate);
			}, 0);
		};

		/**
		 * Вернуть смещенные влево плашки для демонстрации открытого блока - в позиции покругу
		 */
		this.moveElementsBack = function(callback, elementJSON) {
			if (this.isDemoPause()) return this.saveDemoMoment();
			if (!this.openingElement) {
				this.openingElement = this.openedElement;
				// return;	// ??	мешает при вызове из openCentral когда позиция POSITION_LEFT
			}

			var $elements = this.$model.find('.carousel-element.child').not('.current'),
				canvas = self.carouselCanvas[0],
				ctx = canvas.getContext('2d');

			this.moving = true;

			$elements.each(function(i) {
				$(this).attr('target-angle', $(this).attr('data-old-angle'));
				$(this).attr('data-old-angle', $(this).data('angle')); // ???
			});

			self.position = self.POSITION_LEFT;
			self.startDrawLines();

			var moveBlocks = function() {

				var $elements = self.$model.find('.carousel-element').not('.current'),
					complete = 0;

				$elements.each(function() {
					var $this = $(this);
					$this.css({
						left: $this.data('roundLeft'),
						top: $this.data('roundTop'),
						transform: translate + ' scale(1)',
					})
					$this.data('angle', $this.attr('target-angle'));
				});

				// #13473 Вынесенно из $elements.each. Из за небольшой разницы в продолжительности Transition между элементами, событие назначено на первый элемент. Исправлено отображенеи в ВО при переключении между элементами iScheme модели.
				$elements.first().one('transitionend', function () {
					self.moving = false;
					self.position = self.POSITION_NORMAL;

					if (callback) {
						callback();
					}

					// В следующем такте
					setTimeout(function () { self.stopDrawLines(); }, 0);
				});

					// 	step: function (now, tween) {
					// 		$this.data(tween.prop, now);
					// 	}

					// var scale = $this.data('scale') || 1;
					// $this.css('borderSpacing', 0).animate({
					// 	borderSpacing: 1
					// }, {
					// 	duration: self.duration(400),
					// 	step: function(now) {
					// 		$(this).css('transform', translate + ' scale(' + (scale + (1 - scale) * now) + ')');
					// 		$(this).data('scale', (scale + (1 - scale) * now));
					// 	},
					// 	queue: false,
					// 	complete: function() {
					// 		if (++complete == $elements.length) {
					//
					// 		}
					// 	}
					// });
			};
			// this.movingAnimation($elements, function() {

			moveBlocks();

			// });
		};

		this.centralFadeOut = function(callback) {
			this.currentFadein++;
			var addedElements = [];
			var addedIndexes = [];
			if (this.jsonData.content || '') {
				var count = this.jsonData.content.length;
				for (var i = 0; i < this.jsonData.content.length; i++) {
					if ((this.jsonData.content[i].fadein || 1) >= this.currentFadein)
						count--;
				}
				var index = 0;
				for (var i = 0; i < this.jsonData.content.length; i++) {
					if ((this.jsonData.content[i].fadein || 1) < this.currentFadein) {
						index++;
					}
					if ((this.jsonData.content[i].fadein || 1) == this.currentFadein) {
						var element = this.createCarouselElement(this.jsonData.content[i], index, count - 1);
						element.css('opacity', 0);
						// element.addClass('hidden');
						addedElements.push(element);
						addedIndexes.push(i);
						index++;
					}

				}
			}
			if (this.currentFadein == this.fadeinCount) $('.btn-expand-childs').hide();

			var elements = this.$model.find('.carousel-element.child'), // .not('.current'), // ??
				count = elements.length,
				canvas = self.carouselCanvas[0],
				ctx = canvas.getContext('2d');

			var minAngle = 0;
			elements.sort(function(a, b) {
				var contentA = parseFloat($(a).data('angle'));
				var contentB = parseFloat($(b).data('angle'));

				if (minAngle > contentA) minAngle = contentA;
				return (contentA < contentB) ? -1: (contentA > contentB) ? 1: 0;
			});

			elements.each(function(i) {
				var element = $(this),
					position = i,
					angle = position * (2 * Math.PI / count) + minAngle;
				element.attr('target-angle', angle % (2 * Math.PI));
				element.attr('data-old-angle', $(this).data('angle'));
				element.attr('data-count', count);
			});

			// OLD mthod draw? remove?
			// var drawBlocks = function() {
			// 	var left = self.jsonData.settings.elementWidth / 2;
			// 	left = Math.floor(left / 4) * 4;
			// 	var interval = setInterval(function() {
			// 		if (left == 0) {
			// 			clearInterval(interval);
			// 			for (var i = 0; i < addedElements.length; i++) {
			// 				addedElements[i].css('opacity', 1);
			// 				addedElements[i].removeClass('hidden');
			// 			}
			// 			var centers = getElementsCenters(self.$model.find('.carousel-element:not(\'.central\')'));
			// 			self.drawLines(centers, ctx);
			// 			return;
			// 		}
			// 		// var centers = getElementsCenters(self.$model.find('.carousel-element:not(\'.central\')').not(".hidden"));
			// 		// self.drawLines(centers, ctx, addedIndexes);
			// 		left -= 4;
			// 		console.log(left)
			// 	}, 2);
			// };

			this.movingAnimation(elements, function() {
				// self.position = self.POSITION_LEFT;

				// drawBlocks(); // OLD mthod draw? remove?

				for (var i = 0; i < addedElements.length; i++) {
					addedElements[i].css('opacity', 1);
					addedElements[i].removeClass('hidden');
				}

				if (callback) callback();
			});
		};

		/**
		 * Сместить плашки влево, для того что бы можно было раскрыть блок
		 */
		this.moveElementsLeft = function(elementJSON, callback) {

			if (this.isDemoPause()) return this.saveDemoMoment();
			if (!this.openingElement) return;	// ??

			var $elements = this.$model.find('.carousel-element.child').not('.current'),
				count = $elements.length * 2 - 2,
				contentWidth = elementJSON.infoWidth || self.jsonData.settings.contentBlockWidth,
				startWidth = self.jsonData.settings.elementWidth,
				startHeight = self.jsonData.settings.elementHeight;

			$elements.sort(function(a, b) {
				var contentA = parseFloat($(a).data('angle'));
				var contentB = parseFloat($(b).data('angle'));

				// #12706 Значение angle может быть больше нуля, т.к. плашки располагаются по кругу.
				// При сортировке angle у плашки будет самым большим, хотя плашка идет самой последней.
				// Если плашка имеет положительный угол, то нужно перевести этот угол в отрицательный эквивален(в случае движения против часовой стрелки)
				// Вычтем из положительного значения полный круг.
                if (contentA > 0) {
                    contentA -= 2 * Math.PI;
                }
                if (contentB > 0) {
                    contentB -= 2 * Math.PI;
                }

				return (contentA < contentB) ? -1: (contentA > contentB) ? 1: 0;
			});
			var lessZeroCount = 0;
			$elements.each(function(i) {
				if ($(this).data('angle') <= 0) {
					lessZeroCount += 1;
				}
			});
			$elements.each(function(i) {
				var $this = $(this),
					angle = $this.data('angle');

				$this.attr('data-old-angle', angle);

				if (i > lessZeroCount - 1) {
					i += count / 2 - lessZeroCount;
					angle = i * (2 * Math.PI / count) - 0.5 * Math.PI;
				}
				else {
					var pos = count - Math.abs(i - (lessZeroCount - 1));
					angle = -(2 * Math.PI - (pos * (2 * Math.PI / count) - 0.5 * Math.PI));
				}

				$this
					.attr('index', i)
					.css('z-index', i == 0 ? 400: 400 - (count - i))
					.attr('target-angle', angle)
					.data({
						roundLeft: $this.css('left'),
						roundTop: $this.css('top')
					});
			});

			var moveBlocks = function() {

				callback();

				// #12706 Из-за этой сортировки, когда плашки размещаются слева в столбике, не получается пройти по ним всем
				// кликая, к примеру, всегда по нижней. В определенный момент нижним элементом оказывается тот, который
				// уже был без прохождения полного круга.
				/*$elements.sort(function(a, b) {
					return parseInt($(a).css('top').replace('px')) < parseInt($(b).css('top').replace('px')) ? 1: -1;
				});*/

				var $openedBlock = self.$model.find('.content-block'),
					freeWidth = $openedBlock.data('left'),
					$central = self.$model.find('.carousel-element.central'),
					centralWidth = parseInt($central.css('width').replace('px', '')),
					// centralHeight = parseInt($central.css('height').replace('px', '')),
					// centralTop = parseInt($central.css('top').replace('px', '')),
					maxWidth = 0,
					fullHeight = 0,
					outset = 0;

				var transitionEndCount = 0;
				$elements.each(function() {
					maxWidth = Math.max(maxWidth, parseInt($(this).css('width').replace('px', '')));
					fullHeight += parseInt($(this).css('height').replace('px', ''));
                    $(this).one('transitionend', function() {
                        transitionEndCount++;
                        if (transitionEndCount == $elements.length) {
                            self.redrawLines();
                        }
                    });
				});

				var totalWidth = maxWidth + centralWidth,
					centralLeft = freeWidth * maxWidth / totalWidth,
					scale = freeWidth / totalWidth - 0.03; // outset beetween blocks;
				if (scale > 1) scale = 1;

				self.startDrawLines();

				// hack for scale animate
				$central
					.data({
						roundLeft: $central.css('left'),
						roundTop: $central.css('top'),
						scale: scale
					})
					.css('borderSpacing', 1)
					.css({
						left: centralLeft,
						// borderSpacing: scale,
						transform: translate + ' scale(' + scale + ')'
					}).one('transitionend', function() {
						self.stopDrawLines()
					});
					// {
					// 	duration: self.duration(400),
					// 	step: function(now, tween) {
					// 		if (now <= 1) {
					// 			$central.css('transform', translate + ' scale(' + now + ')');
					// 		}
					// 		$central.data(tween.prop, now);
					// 	},
					// 	complete: function() { self.stopDrawLines() }
					// });

				// be sure elements not come each on other
				if (fullHeight * scale > self.jsonData.settings.height) {
					scale = self.jsonData.settings.height / fullHeight - 0.03; // outset beetween blocks
				}

				outset = (self.jsonData.settings.height - fullHeight * scale) / ($elements.length + 1);
				// console.log(fullHeight * scale, outset, self.jsonData.settings.height)

				// place in top
				var t = 0;
				$elements
					.data('scale', scale)
					.each(function(i) {
						var $this = $(this),
							h = parseInt($this.css('height').replace('px', '')),
							w = parseInt($this.css('width').replace('px', ''));
						t += Math.round(h * scale);
						$this.css({
							top: Math.round(self.jsonData.settings.height - (t + outset * (i + 1))) - Math.round(h - h * scale) / 2,
							left: -Math.round(w - w * scale) / 2
						});
						// , {
						// 	duration: self.duration(400),
						// 	step: function (now, tween) {
						// 		$this.data(tween.prop, now);
						// 	}
						// });
					});

				$elements.css({
					transform: translate + ' scale(' + scale + ')',
				});

				// Старый вариант плавного масштабирования
				// $elements.data('scale', scale).css('borderSpacing', 1).animate({
				// 	borderSpacing: scale
				// }, {
				// 	duration: self.duration(400),
				// 	step: function(now) {
				// 		$(this).css('transform', translate + ' scale(' + now + ')');
				// 		$(this).data('scale', now);
				// 	},
				// 	queue: false
				// });
			};

			this.movingAnimation($elements, function() {
				self.position = self.POSITION_LEFT;
				moveBlocks();
			}, 1);

		};

		this.updateCenters = function () {
			this.$centers = this.$model.find('.carousel-element.child:visible, .content-block.visible');
		}

		this.startDrawLines = function() {
			var self = this,
				canvas = self.carouselCanvas[0],
				ctx = canvas.getContext('2d');

			this.stopDrawLines();
			this.updateCenters();

			this.timers.drawlines = requestAnimationFrame(function drawlines() {
				// var centers = getElementsCenters(self.$model.find('.carousel-element').not('.central')); // OPTIMIZATION
				var centers = getElementsCenters(self.$centers);
				self.drawLines(centers, ctx);
				self.timers.drawlines = requestAnimationFrame(drawlines);
			}, 0);
		};

		this.stopDrawLines = function() {
			cancelAnimationFrame(this.timers.drawlines);
			this.timers.drawlines = null;
		}

		this.movingAnimation = function($elements, callback, test) {
			self.moving = true;

			self.startDrawLines();

			var processing = 0;

			function complete() {
				self.moving = false;
				if (callback || '') {
					self.stopDrawLines();
					callback();
				}
			}

			// Это вроде коррекция, но работает очень не оптимизированно (для мобильных) и долго, появляется задержка перед открытием
			// Поидее это нужно что-бы прямые линии были в звезде
			// $elements.each(function() {
			// 	var $this = $(this),
			// 		angle = parseFloat($this.data('angle')),
			// 		targetAngle = parseFloat($this.attr('target-angle')),
			// 		angleDiff = parseFloat($this.attr('data-old-angle')) - parseFloat($this.attr('target-angle'));
			//
			// 	if ((angleDiff > 0 && angle <= targetAngle) ||
			// 		(angleDiff == 0 && angle == targetAngle) ||
			// 		(angleDiff < 0 && angle >= targetAngle)) {
			// 		return;
			// 	}
			//
			// 	processing++;
			//
			// 	$({ angle: angle }).animate({ angle: targetAngle }, {
			// 		duration: self.duration(400),
			// 		step: function() {
			// 			self.setElementPositionByAngle($this, this.angle);
			// 		},
			// 		complete: function() {
			// 			if (!--processing) complete();
			// 		}
			// 	});
			//
			// });

			// if no one block not need angle animation
			if (!processing) complete();

		};

		// #8355  firsov

		this.getBound = function(shape1, shape2) {
			shape1.width = shape1.w;
			shape1.height = shape1.h;
			shape2.width = shape2.w;
			shape2.height = shape2.h;
			shape1.center = {};
			shape1.center.x = shape1.x;
			shape1.center.y = shape1.y;
			shape2.center = {};
			shape2.center.x = shape2.x;
			shape2.center.y = shape2.y;
			var devisionShape2 = shape2.height / shape2.width;
			var devision = (shape2.center.y - shape1.center.y) / (shape2.center.x - shape1.center.x);
			var square1 = shape2.center.x - shape1.center.x;
			var square2 = shape2.center.y - shape1.center.y;
			if (devisionShape2 > Math.abs(devision) && square1 > 0) {
				return {
					x: shape2.center.x - (shape2.width),
					y: shape2.center.y - (shape2.width * devision)
				};
			}
			else if (devisionShape2 <= Math.abs(devision) && square2 > 0) {
				return {
					x: shape2.center.x - (shape2.height / devision),
					y: shape2.center.y - shape2.height
				};
			}
			else if (devisionShape2 < Math.abs(devision) && square2 < 0) {
				return {
					x: shape2.center.x + (shape2.height / devision),
					y: shape2.center.y + shape2.height
				};
			}
			else if (devisionShape2 >= Math.abs(devision) && square1 < 0) {
				return {
					x: shape2.center.x + shape2.width,
					y: shape2.center.y + (shape2.width * devision)
				};
			}
		};


		this.drawArrow = function(ctx, p1, p2) {
			ctx.save();
			var dist = Math.sqrt((p2[0] - p1[0]) * (p2[0] - p1[0]) + (p2[1] - p1[1]) * (p2[1] - p1[1]));
			ctx.beginPath();
			ctx.lineWidth = 1;
			//ctx.strokeStyle = '#0000ff';
			ctx.moveTo(p1[0], p1[1]);
			ctx.lineTo(p2[0], p2[1]);
			ctx.stroke();
			var angle = Math.acos((p2[1] - p1[1]) / dist);
			if (p2[0] < p1[0]) angle = 2 * Math.PI - angle;
			var size = 5;
			var sizeX = 6;
			var sizeY = 15;
			ctx.beginPath();
			ctx.translate(p2[0], p2[1]);
			ctx.rotate(-angle);
			ctx.fillStyle = '#1A6DA3';
			ctx.lineWidth = 1;
			//ctx.strokeStyle = '#ff0000';
			ctx.moveTo(0, -sizeY);
			ctx.lineTo(-sizeX, -sizeY);
			ctx.lineTo(0, 0);
			ctx.lineTo(sizeX, -sizeY);
			ctx.lineTo(0, -sizeY);
			ctx.closePath();
			ctx.fill();
			ctx.stroke();
			ctx.restore();
		}

		this.drawLines = function(centers, ctx, notDrawLines) {
			var $central = this.$central,
					scale = $central.data('scale') || 1,
					centralCenter = getCenter($central),
					centralWidth = $central.width();

			// #11418 Без этой строки соединительные линии начинают правильно соединяться в центре главного элемента
			//centralCenter.x -= (centralWidth - centralWidth*scale)/2;	// #8943


			var canvas = this.carouselCanvas[0];

			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.beginPath();
			ctx.strokeStyle = '#1A6DA3';
			ctx.lineWidth = 3;

			for (var pos = 0; pos < centers.length; pos++) {
				try {
					var center = centers[pos];
					// #8355  firsov
					if (this.jsonData.settings.typeline == 'arrow') {
						// рисуем стрелочки
						var soom = 1;
						if (center.el.data('scale') != undefined) {
							var center = centers[pos];
							soom = center.el.data('scale') * 1;
							center.w = center.w * soom;
							center.h = center.h * soom;
						}
						var s = this.getBound(centralCenter, center);
						this.drawArrow(ctx, [centralCenter.center.x, centralCenter.center.y], [s.x, s.y])
					}
					else {
						ctx.moveTo(centralCenter.x + 0.5, centralCenter.y + 0.5);
						ctx.lineTo(center.x, center.y);
						ctx.stroke();
					}


				}
				catch (e) {}
			}
			//ctx.stroke();
		};

		function popupInit() {
			var closeBtn = $('<div class="closeBtn"></div>');
			$popup.append('<div class="content"></div>');
			$popup.append(closeBtn);
			self.$model.append($blocking);
			self.$model.append($popup);
			closeBtn.click(function() {
				closePopup();
			});
		}

		function closePopup() {
			$blocking.hide();
			$popup.fadeOut('fast');
		}

		function showPopup(popupId) {
			var popup = popupCollection.get(popupId);

			//#8437
			// popup.width = 'auto'; // ???? #8814
			// popup.className = 'centerPopupScale';	// ???? #8814

			if (popup) {
				// var el = new modelNS.PopupView({ model: popup }).render().el;
				// self.$model.append(el);

				// call modern .popup() from restyling
				var settings = {};

				if (popup.get('height')) settings.height = popup.get('height');
				if (popup.get('width')) settings.width = popup.get('width');
				if (popup.get('onClose')) settings.close = popup.get('onClose');

				/* #13836 (Вложенный popup исправление). Закомментирован не актуальный метод popup, и добавлен рекомендуемый метод createPopup.
				// $('<div/>').html(popup.get('content')).popup(settings); */
				settings.content = popup.get('content');
				self.createPopup(settings);
			}

			// var popupModel = getPopup(popupId);
			// if (popupModel == null) {
			// 	return;
			// }
		}

		function getPopup(id) {
			for (var i = 0; i < popupsData.length; i++) {
				var popup = popupsData[i];
				if (popup.id === id) {
					return popup;
				}
			}
			return null;
		}

		var normalScale = function() {
			$(document.body).addClass('normal-scale');
		}

		var restoreScale = function() {
			$(document.body).removeClass('normal-scale');
		}

		this.demoMoments = [];

		this.waitAndOpenNext = function(ms) {
			var self = this;
			this.timers.next = this.timeout(function() { self.openNext() }, ms);
		}

		this.duration = function(ms, ops) {
			if (!ops) ops = {};
			if (!ops.min) ops.min = 50;
			if (!ops.max) ops.max = ms;

			var duration = this.demoPlaying ? ms / this.demoSpeed: ms;
			if (duration < ops.min) duration = ops.min;
			if (duration > ops.max) duration = ops.max;

			return duration;
		}

		this.onBlockOpened = function(elementJSON, element) {
			this.openedElement = elementJSON;
			this.openingElement = null;
			this.openAnimation = false;

			if (this.demoPlaying) {
				if (element) {	// popup
					if (!elementJSON.showInfoAtTime) this.waitAndOpenNext(this.duration(3000, { max: 10000, calc: element }));
				} else {
					this.openNext();
				}
			}
		}

		this.init($wrapper, DATA, params);
		this.$el = this.$model;

		return this;
	},


	prepareContent: function () {
		for (var i=0; i<this.jsonData.content.length; i++) {
			var elementJSON = this.jsonData.content[i];
			this.cachedContent[elementJSON.id] = $('<div class="content"></div>')
				.append(elementJSON.content)
				.hide()
				.appendTo(this.$model);
		}
	},

	/* ============ Режим демонстрации ============= */
	startDemo: function(fn) {
		modelNS.BaseModelView.prototype.startDemo.apply(this, arguments);

		if (this.jsonData.settings.showtime) this.showtime();

		var self = this;
		this.timers.start = setTimeout(function() { self.openNext() }, this.duration(this.demoFirstSlideAt, { max: 10000, min: 1000 }));
	},

	openNext: function() {
		var content = this.jsonData.content,
			curId = this.openedElement && this.openedElement.id,
			self = this;

		for (var c = 0; c < this.demoList.length; c++) {
			var json = this.demoList[c],
				id = json.id;

			if (!curId) {

				// <name time="..">
				if (json.lightstart) {
					this.timeout(function () {self.markElement(json)}, json.lightstart * 1000 - this.demoPlayTime());
				}

				// <name time="..">
				if (json.time) {
					var time = json.time * 1000,
							timeDiff = time - this.demoPlayTime();

					if (timeDiff > 0) return this.waitAndOpenNext(timeDiff);
				}

				// <info time="..">
				if (json.showInfoAtTime) {
					var time = json.showInfoAtTime * 1000,
							timeDiff = time - this.demoPlayTime();

					if (timeDiff > 0) {
						this.waitAndOpenElement(timeDiff, json);
					}
				}

				// <name endtime="..">
				if (json.endtime) {
					var time = json.endtime * 1000,
							timeDiff = time - this.demoPlayTime();

					this.timeout(function () {self.closeElement(json.id)}, timeDiff);
				}

				return this.openElement(null, json);
			}

			if (id == curId) curId = false;
		}

		this.onDemoFinish();
	},

	closeElement: function (id)
	{
		var curId = this.openedElement && this.openedElement.id,
				$close = this.$model.find('.close-content-btn');
		if (curId == id) $close.click();
	},

	demoOrder: function ()
	{
		modelNS.BaseModelView.prototype.demoOrder.apply(this, arguments);

		var content = this.jsonData.content,
				demoListObjects = [],
				demoListKeys = [],
				order = 0;

		this.demoFirstSlideAt = 2000;

		for (var c = 0; c < content.length; c++) {
			var json = content[c],
					time = json.time && json.time * 1000,
					order = json.order;
			if (order) {
				demoListObjects[order] = json;
				demoListKeys.push(order);
			}
			this.demoList.push(json);
			if (time && this.demoFirstSlideAt > time) this.demoFirstSlideAt = time;
		}

		if (!demoListKeys.length) return;

		demoListKeys.sort(function (a,b) {
		    return a - b;
		});

		this.demoList = [];
		for (var k=0; k<demoListKeys.length; k++) {
			var key = demoListKeys[k];
			this.demoList.push(demoListObjects[key]);
		}
	},

	getElementById: function (id)
	{
		return this.$model.find('[elementid="' + id + '"]');
	},

	waitAndOpenElement: function (ms, json)
	{
		var self = this;
		// 		json = this.openingElement || this.openedElement;

		this.timers.next = this.timeout(function() { self.openElement(null, json) }, ms);
	},

	showtimeOrder: function ()
	{
		var content = this.jsonData.content,
				elements = [],
				keys = [];

		for (var c = 0; c < content.length; c++) {
			var json = content[c],
			order = json.order;

			while (elements[order]) order += 0.001;

			elements[order] = json;
			keys.push(order);

			if (json.parent) json.hidden = true;
		}

		keys.sort(function (a,b) {
		    return a - b;
		});

		content = [];
		for (var k=0; k<keys.length; k++) {
			var key = keys[k];
			content.push(elements[key]);
		}

		this.jsonData.content = content;
	},

	showtime: function () {
		var content = this.jsonData.content;
		for (var c = 0; c < content.length; c++) {
			var json = content[c];
			if (json.hidden) this.hideElement(json);
		}
	},

	markElement: function (json) {
		var $elem = this.getElementById(json.id),
				color = $elem.attr('color'),
				self = this;

		if ($elem.find('.mark').length) return;

		var $mark = $('<div class="mark"/>').appendTo($elem);

		function blink ()
		{
			$elem
				.stop()
				.animate({'backgroundColor':shadeColor(color, 0.5)}, 500)
				.delay(500)
				.animate({'backgroundColor':color}, 500, function () {
					if (json.lightend && self.demoPlayTime() < json.lightend * 1000) {
							return blink();
					}
					return $mark.remove();
				})
		}

		blink();
	}
});
