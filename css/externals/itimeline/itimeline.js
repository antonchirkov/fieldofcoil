
function Timeline(xmlData, wrapper, basePath, params) {
	this.init = function() {
		return new modelNS.Timeline({model: new modelNS.TimelineModel({
				xmlData: xmlData,
				wrapper: wrapper,
				basePath: basePath,
				params: params,
				restyling: "title"
			})
		}).renderOnShow();
	};
}


modelNS.TimelineModel = modelNS.BaseModel.extend({
	initialize: function(options) {
		modelNS.BaseModel.prototype.initialize.apply(this, arguments);
	},

	parseXML: function(xmlData) {
		modelNS.BaseModel.prototype.parseXML.apply(this, arguments);

		var $itimeline = this.$root,
				dates = $itimeline.find('dates'),
				$settings = $itimeline.find('settings'),
				$events = $itimeline.find('events'),
				blockWidth = $itimeline.attr('blockWidth'),
				blockHeight = $itimeline.attr('blockHeight'),
				params = this.params,
				settings = {},
				self = this;

		settings.formattedType = true;

		settings.width = $itimeline.attr('width');
		settings.height = $itimeline.attr('height');

		settings.eventPopupWidth = $events.attr('width');
		settings.eventPopupHeight = $events.attr('height');

		if (dates.length != 0) {
			var format = '00.00.yyyy',
				bigFormat = '00.00.yyyy',
		    start = params.start || dates.find('start').text(),
		    end = params.end || dates.find('end').text(),
		    smallRange = params.range || parseInt(dates.find('range').text()) || 5,
		    def = dates.find('default').length != 0 ? dates.find('default').text() : start;
		    step = '00.00.0001',
		    range = 10;
			dates.find('format').each(function() {
				if ($(this).attr('type') == 'small') {
					// format = $(this).text();
				}
				if ($(this).attr('type') == 'large') {
					bigFormat = $(this).text();
				}
				if (!($(this).attr('type') || '')) {
					format = $(this).text();
					bigFormat = format;
				}
			});
			if (params.format) bigFormat = format = params.format;

			dates.find('step').each(function() {
				if ($(this).attr('type') == 'small') {
					step = $(this).text();
				}
				if ($(this).attr('type') == 'large') {
					//range = parseInt($(this).text()); // #11870 Закомментил
                    range = $(this).text(); // #11870 На глобальной риске шаги могут фомироваться не только из целого числа, но из формата dd.mm.yyyy
				}
			});
			if (params.stepSmall) step = params.stepSmall;
			if (params.stepLarge) range = params.stepLarge;


			settings['dimension'] = dates.attr('dimension');
			settings['step'] = step;
			settings['smallRange'] = smallRange + 1;	// 8443, При указании значения в range = 10, на синей линейке при старте модели показывается 9 дат. Число должно совпадать.
			settings['format'] = format;
			settings['bigFormat'] = bigFormat;
			settings['dates'] = [];
			settings['def'] = def;
			settings['switchersInRow'] = $settings.attr('switchersinrow') || '' ? $settings.attr('switchersinrow') : 2;

			settings.scale = $settings.attr('scale');
			settings.slider = {range : range};
			settings.startDate = start && modelNS.DateUtils.getDate(start);
			settings.endDate = end && modelNS.DateUtils.getDate(end);
			console.log(start, modelNS.DateUtils.getDate(start))

			this.datesOrder = {};

			if ($itimeline.find('date').length != 0) {	// #8368 data => date
				settings.hasDateDisplay = false;
				$itimeline.find('date').each(function(i) {
					var $date = $(this),
							display = $date.attr('display') == 'true',
							id = modelNS.DateUtils.getDate($date.attr('id')).getTime();
					settings.dates.push({
						id : id,
						label : $date.text(),
						display : display
					});


					if (display) settings.hasDateDisplay = true;
					self.datesOrder[id] = i;
				});
				settings.formattedType = false;
			} else {
                settings.hasDateDisplay = true; // #11870 Для отображения дат на слайдере
				// #11870 Если <step type="large"> пришел в виде даты
                if (settings.slider.range.indexOf('.') != -1) {
                	var currentSliderDate = settings.startDate;
                	settings.sliderDates = [];
                	while (currentSliderDate < settings.endDate) {
                        settings.sliderDates.push({
                            id: currentSliderDate.getTime(),
                            label: settings.formattedType ? modelNS.DateUtils.getDateValue(currentSliderDate, settings.bigFormat) : currentSliderDate,
                            display: true // Чтобы отображались метки на слайдере
                        });
                        currentSliderDate = modelNS.DateUtils.getNextDate(currentSliderDate, settings.slider.range);
					}
					// Добавим еще один элемент превышающий конечную дату.
                    settings.sliderDates.push({
                        id: currentSliderDate.getTime(),
                        label: settings.formattedType ? modelNS.DateUtils.getDateValue(currentSliderDate, settings.bigFormat) : currentSliderDate,
						display: true // Чтобы отображались метки на слайдере
                    });
				} else {
                    // #11870 Здесь, возможно, потребуется поддержка целочисленного значения в <step type="large">
				}
                var currentDate = settings.startDate,
                    i = 0,
                    endDate = settings.endDate;
                while(true) {

                    var id = currentDate.getTime();

                    settings.dates.push({
                        id: id,
                        label: settings.formattedType ? modelNS.DateUtils.getDateValue(currentDate, settings.bigFormat) : currentDate,
                    });

                    self.datesOrder[id] = i;

                    if (currentDate > endDate) {
                        break;
                    }

                    currentDate = modelNS.DateUtils.getNextDate(currentDate, settings.step);

                    i++;
                }

                // #11870 Данная логика изменена выше. Со временем можно удалить
				/*var currentDate = settings.startDate, i = 0, max, endDate = settings.endDate;
				while(true) {
					var isYearsToEnd = currentDate > endDate;

					if (!max && isYearsToEnd) {
						max = Math.ceil(settings.dates.length / settings.slider.range) * settings.slider.range + 1;
					}

					if (isYearsToEnd && i >= max
						|| isNaN(currentDate)
						|| i == 1000
					) {
						break;
					}

					var id = currentDate.getTime();

					settings.dates.push({
						id: id,
						label: settings.formattedType ? modelNS.DateUtils.getDateValue(currentDate, settings.bigFormat) : currentDate,
					});

					self.datesOrder[id] = i;

					currentDate = modelNS.DateUtils.getNextDate(currentDate, settings.step);

					i++;
				}*/
			}
			settings.start = self.getDateIndex(start);
			settings.slider['start'] = 0;
			settings.slider['end'] = settings.dates.length - 1;	// ??
		}

		// Парсинг категорий
		settings.categories = [];
		settings.noswitchers = $($itimeline.find('categories').get(0)).attr('noswitchers') === 'true';
		$itimeline.find('category').each(function(i) {
			if (i >= 5) {
				return;
			}

			var id = $(this).attr('id'),
					hidetoggle = (params.hidetoggle || "").split(';');

			//ARCH #8409 firsov
			var category = {
					id: id,
					title: $(this).attr('title'),
					color: $(this).attr('color'),
					toggle: hidetoggle.indexOf(id)>=0 ? false : $(this).attr('toggle')=="false" ? false : true,
					data: []
				};
			//end ARCH #8409 firsov

			$itimeline.find('event[category="' + category.id + '"]').each(function() {
				var $event = $(this),
						$content = $event.find('content'), // ", facts" ???
						end = $event.attr('end'),
						event = {
							start: modelNS.DateUtils.getDate($event.attr('start')).getTime(),
							end: end && modelNS.DateUtils.getDate(end).getTime(),
							title: self.getHTML($event.find('title').first()),
							popupWidth: $content.attr('width'),
							popupHeight: $content.attr('height'),
							width: $event.attr('width') || blockWidth,
							height: $event.attr('height') || blockHeight,
							events: []
						};

				$event.find('fact').each(function() {
					var $fact = $(this),
						fact = {
								width: $fact.attr('width'),
								height: $fact.attr('height'),
								title: self.getHTML($fact.find('title').first()),
								description: self.getHTML($fact.find('description').first())
							};
					event.events.push(fact);
				});

				category.data.push(event);
			});

			settings.categories.push(category);
					//console.log(category)

		});
		// CATEGORY_HEIGHT = 400 / settings.categories.length;

		this.settings = settings;

		// $itimeline = null;
	},

	getDateIndex: function (id) {
		// #11870 Если пришедшая дата не содержится в dateOrder, то используем индекс той даты, которая является
		// ближайшей предшествующей. Именно предшествующей, чтобы плашка в некоторых ситуациях не уезжала влево.
		var dateDiff = 0; // Если дата не будет найдена в datesOrder, то нельзя будет просто использовать ближайшую меньшую дату. Нужно будет высчитать процент смещения.
		if (this.datesOrder[id] == void 0) {
			id = parseInt(id);
			var datesOrderAr = Object.keys(this.datesOrder);
			// Получаем меньшую ближайшую дату
			var nearestSmallerDate = datesOrderAr.reduce(function(a, b) {
				if (Math.abs(parseInt(b) - id) < Math.abs(parseInt(a) - id) && id >= parseInt(b)) {
					return b;
				}
            	return a;
			});
			// Большая ближайшая дата
			var nearestBiggerDate = datesOrderAr[datesOrderAr.indexOf(nearestSmallerDate) + 1];
			var diff = nearestBiggerDate - nearestSmallerDate; // Разница между двумя ближайшими датами
			dateDiff = (id - nearestSmallerDate) / diff; // Получаем дополнительное смещение индекса, чтобы потом правильно посчитался left события в ленте

			id = nearestSmallerDate;
		}

		return this.datesOrder[id] + dateDiff; // #11870 Прибавляем смещение

		// if (formattedType) {
		// 	var fooDate = new Date(date);	// .replace(/\./gi,'/') // old, not work after we prepare with Date.parse
		// 	if (fooDate) {
		// 		return fooDate.getFullYear();
		// 	}
		// 	if (parseInt(date) != 'NaN') {
		// 		return parseInt(date);
		// 	} else {
		// 		return -1;
		// 	}
		// }
		// for (var i = 0; i < settings.dates.length; i++) {
		// 	if (settings.dates[i] == date) {
		// 		return i;
		// 	}
		// }
		// return -1;
	},

	getHTML: function ($obj) {
		return courseML.getHTMLFromCourseML($obj, {imgPath: this.params.jsID + '/'})
	},

});

modelNS.Timeline  = modelNS.BaseModelView.extend({
	initialize: function(options) {
		modelNS.BaseModelView.prototype.initialize.apply(this, arguments);
		this.options = options;
	},
	render: function () {
		modelNS.BaseModelView.prototype.render.apply(this, arguments);

		this.$el.addClass('timeline base-model mark16');

		// $wrapper = $(container),
		    // $el = $('<div class="timeline base-model mark16"></div>'),
		var $el = this.$el,
				$blocking = $('<div class="blocking-screen"></div>'),
				$eventsArea = $('<div class="events-area"></div>'),
				$events = $('<div class="events"></div>'),
		    $eventsSlider = $('<div class="event-slider"></div>'),
		    $switchers = $('<div class="switchers-wrapper"></div>'),
		    $this = this,
				$sliderArea = $('<div class="slider-area"></div>'),
				$popup = $('<div class="timeline-popup"><div class="popup-title"/><div class="popup-body"></div></div>'),
				$popupBody = $popup.find('.popup-body'),
			// $itimeline = $($.parseXML(xmlData)),
		    settings = this.model.settings,
		    sliderView = null,
		    MIN_WIDTH = 600,
		    CATEGORY_HEIGHT = 100,
				DEFAULT_HEIGHT = 600,
				DEFAULT_WIDTH = 800,
				DEFAULT_EVENT_WIDTH = 350,
				POPUP_DEFAULT_HEIGHT = 450,
			// POPUP_DEFAULT_WIDTH = "auto",
		    eventsPixelPerDate = 0,
		    animation = false,
		    COLORS = ['#0BBCCC', '#6FD04F', '#E8BB3E', '#DB5450', '#A563C5'],
				logging = false,
				model = this.model,
				params = model.params,
				// maxPosible = 0,		// old
				atTheFarRight = 0,
				eventHeight = 0; // #12815 Служит для сохранения высоты самой выской плашки, чтобы потом сделать их все одинаковыми

		// #11121 fix skining
		// $popup
		// 	.addClass('courseml')
		// 	.attr('skin', CourseConfig.templateSkin);


		this.log = function(msg) {
			if (logging) {
				console.log(msg);
			}
		};

		this.handlePopups($popup);

		$('#popup').unbind('click'); //#11857
        this.handlePopups($('#popup')); //#11857

		this.components = {};

		// Переключатель событий
		function Switcher(params) {
			if (params.color || '') {
				COLORS[params.category] = params.color;
			}
			var layout = $('<div class="switcher-layout"></div>'),
			    titleHandler = $('<div class="switcher-title font14"></div>'),
			    switcher = $('<div class="switcher category' + params.category + '"></div>'),
			    button = $('<div class="switcher-button"></div>'),
			    settings = {
						color: COLORS[params.category],
						title: '',
						click: null,
						checked: true
					},
			    switcherContext = this;

			switcher.append('<div class="plus">+</div>');
			switcher.append('<div class="minus">-</div>');
			switcher.append(button);
			layout.append(switcher);
			layout.append(titleHandler);
			if (params || '') {
				if (params.color || '') {
					settings.color = params.color;
				}
				if (params.title || '') {
					settings.title = params.title;
				}
				if (params.click || '') {
					settings.click = params.click;
				}
				if (params.checked || '') {
					settings.checked = params.checked;
				}
			}

			switcher.css('background-color', settings.color);
			button.css('left', settings.checked ? '33px' : '0px');
			switcher.addClass(settings.checked ? 'checked' : '');
			titleHandler.append(settings.title);
			switcher.click(function() {
				if ($(this).hasClass('disabled')) {
					return;
				}
				var isChecked = $(this).hasClass('checked');
				if ($switchers.find('.switcher.checked').length == 1 && isChecked) {
					return;
				}
				var slider = $($(this).find('.switcher-button')[0]),
				    sliderStartPosition = Math.round(slider.position().left);
				if (isChecked) {
					slider.css({'left': 0, 'right': 'auto'});
					$(this).removeClass('checked');
				} else {
					slider.css({'right': 0, 'left': 'auto'});
					$(this).addClass('checked');
				}
				switchCategory(params, isChecked);
			});
	        return layout;
		};

		function switchCategory(params, isChecked) {
			if (!isChecked) {
				showCategory(params.category);
			} else {
				hideCategory(params.category);
			}
		}

		function hideCategory ( index ) {
			settings.categories[index].hidden = true;
			$el.find('.category-background.category' + index).hide();
			$el.find('.event-layout.category' + index).hide();
			resizeCategories();
		}

		function showCategory (index) {
			settings.categories[index].hidden = false;
			$el.find('.category-background.category' + index).show();
			$el.find('.event-layout.category' + index).show();
			resizeCategories();
		}

		function Event(params) {
			// var year = getDateIndex(params.year);
			//
			// if (year == -1) {	// ??
			// 	return null;
			// }

			var $event = $('<div class="event-layout category' + params.category + '"></div>').attr('events', params.events.length),
					content = $('<div class="content"></div>'), // #11596 Удален .font14
			    eventPointer = $('<div class="event-pointer"></div>'),
			    colorPanel = $('<div class="event-color-panel"></div>'),
			    eventsCountCircle = $('<div class="events-count-circle"></div>'),
			    eventMarkLine = $('<div class="event-markline"></div>'),
			    // min = parseInt(settings.slider.start) || settings.start,
					start = params.start,
					index = model.getDateIndex(start),
			    left = (index * eventsPixelPerDate + eventsPixelPerDate / 2);
			colorPanel.css('background', COLORS[params.category]);
			$event.css('background', shadeColor(COLORS[params.category], 0.8));
			eventPointer.css({'background-color': COLORS[params.category]});
			$event.append(colorPanel).append(content);
			content.hide();
			$event.append(eventPointer);
			$event.append(eventMarkLine);

	    $event.css({left: left + 'px'});

			if (params.width) $event.attr('width', params.width);
			if (params.height) $event.attr('height', params.height);

	    if (typeof params.end != 'undefined') {
	    	var end = params.end;

	    	// if (end != year && end > year && end - year != 1) {
		    	$event.attr('end', end);
		    	$event.attr('start', start);
		    	var eventMarkLineEnd = $('<div class="event-markline end"></div>'),
		    		eventPointerEnd = $('<div class="event-pointer end"></div>'),
		    		periodLine = $('<div class="event-periodline"></div>');
		    	eventPointerEnd.css({'background-color': COLORS[params.category]});
		    	periodLine.css({'background-color': COLORS[params.category]});
		    	$event.append(eventMarkLineEnd).append(eventPointerEnd).append(periodLine);
	    	// }
	    }

			content.append(params.title);
			var leftFigure = content.find('.leftFigure');

			if (leftFigure.length) { // #8387
					leftFigure.find('td').first().parent().append($('<td>').append(content.find("p")))
			}


		    if ((params.events || '') && params.events.length > 0) {
		    	eventsCountCircle.css('background', COLORS[params.category]);
		    	eventsCountCircle.append(params.events.length);
		    	$event.append(eventsCountCircle);
		    }
		    $event.click(function() {
		    	if (animation) {
					return;
				}
		    	var that = this,
		    	    overlayed = false;
		    	// $el.find('.event-layout.category' + params.category).each(function() {
		    	// 	if (isObjOnObj(that, this)) {
		    	// 		overlayed = true;
		    	// 	}
		    	// });
		    	// $el.find('.event-layout.category' + params.category).not(this).css('z-index', 2);
		    	// if (overlayed && $(this).css('z-index') != 100) {
		    	// 	$(this).css('z-index', 100);
		    	// } else {
		    		showPopup(params);
		    	// }
		    });

				$event.data('left', left);
				$events.append($event);

				return $event;
		};

		this.init = function() {
			var scale = 1;

			// POPUP_DEFAULT_WIDTH = $el.width() - 26  > POPUP_DEFAULT_WIDTH ? POPUP_DEFAULT_WIDTH : ($el.width() - 26) * 0.9;
			$el.append($blocking);
			initZoomScales();

			$el.width(settings.width);
			$el.height(settings.height);

			$el.click(function(e) {
				if (animation) {
					return;
				}
				if ($(e.target).hasClass('timeline-popup') ||
					$(e.target).parents('.timeline-popup').length != 0) {
					return;
				}
				if ($popup.is(':visible') && !$(e.target).parent().hasClass('event') &&
						!$(e.target).hasClass('button')) {
					closePopup();
				}
			});
			if (!settings.noswitchers) {
				renderSwitchers();
			}

			// compensassion:
			// 64, 42 - bottom sliders
			// 10 - top padding events area
			CATEGORY_HEIGHT = ((settings.height || DEFAULT_HEIGHT) - $switchers.height() - 68 - 42 - 10) / settings.categories.length;

			renderEvents();
	    renderSlider();
	    renderTimeBar();
	    popupInit();

			// масштаб шкалы загружаемый по умолчанию (0-3)
			if (settings.scale !== undefined) setDatesScaleIndex(settings.scale*1);

	    setTimeout(function() {
	    	// $el.height($sliderArea.outerHeight() + $eventsArea.height() + $eventsSlider.height() + $switchers.height() + 40);
	    	// $wrapper.height($el.height() * scale);
	    	// $blocking.width($el.width());
	    	// $blocking.height($el.height());
	    	$el.removeClass('hidden');
	    	resizeCategories();
	    	scrollDates(this.defaultSliderValue);
	    	makeUnselectable($el.get(0));
	    	$(document).focus();
	    	$(document).keyup(function(e) {
	    	    if (e.keyCode == 27) {
	    	    	try {
	    	    		closePopup();
	    	    	} catch(e) {}
	    	    }
	    	});
	    	// $(document).click(function(e) {
	  	  //    	try {
	  	  //    		if ($(e.target).parents('.base-model').length == 0) {
	  	  //    			closePopup();
	  	  //    		}
	  	  //   	} catch(e) {}
	    	// });

	    }, 500);
		};

		function popupInit() {
			var closeBtn = $('<div class="closeBtn"></div>');
			// 	$content = $('<div class="content"></div>');
			// $popup.append($content);
			$popup.append(closeBtn);

			// $el.append($popup);	// #8410 Необходимо отвязать размеры всплывающих окон от размера модели
			$(document.body).append($popup);

		  closeBtn.click(function() {
	    	closePopup();
	    });

			$blocking.click(function () {
				closePopup();
			});
		}

		function closePopup() {
			animation = true;
			$blocking.hide();
			$(document.body).removeClass('popup-opened');
			//$popup.fadeOut('fast'); //#11192
            PlayerCourse.closePopup(); // #11192
			setTimeout(function() {
				animation = false;
			}, 200);
			stopAudio();
		}

		function stopAudio() {
			$popup.find('audio').each(function () {
				this.pause();
			});
		}

		function showPopup(params) {
			var events = params.events;

			if (!events.length) return;

			animation = true;

			var width = params.popupWidth || settings.eventPopupWidth,
					height = params.popupHeight || settings.eventPopupHeight || 'auto',
					titleHeight = $popup.find('.popup-title').height(),
					maxHeight = $(document.body).height() - 20*2;	// 20*2 outset from top and bottom
					//maxWidth = $(document.body).width() - 20*2;	// 20*2 outset's // #12938 Закомментил
					// #12938 Если у ВО плашки не указано width, то максимальная ширина не будет превышать ширину модели
            		maxWidth = params.popupWidth == void 0 ? $this.model.width - 10*2 : $(document.body).width() - 20*2;	// 20*2 outset's

			$popup.data("params", params);
			//$popup.show(); //#11192
			//$popup.css('opacity', '0'); // #11192

			//$blocking.show(); // #11192
			$(document.body).addClass('popup-opened');

			$popup.find('.switcherspanel').remove();
			// $popup.find(".popup-title").html("").width(width);
			$popup.find(".popup-body").html("");

			var $content = $('<div class="content"/>').appendTo($popupBody);

			$popup.find(".content").width(width);

			if (events.length == 1) {
				$popup.find(".popup-title")
					.html('')
					.append($('<h3>'+events[0].title+'</h3>'))
				$content.html(events[0].description);
			} else {
				$popup.find(".popup-title").html('');
				$content.html('');
			}

			calculatePopupSize();

			// $popup.css({opacity:0, left:0, top:0}); // #11192

			// this.uiDialog.find('img').on("load", function () { // loadedmetadata, loadeddata, canplay
			// 		console.log(11)
			// });

			var timeout = setTimeout(function() {
				$content.scrollTop(0);
				if (events.length == 1) {
					// $content.find('img').each(function() {
					// 	imageResize(this);
					// });
					// $content.css({'max-height': ($el.height() * 0.9) + 'px'});
					// if ($content.get(0).scrollHeight > $popup.height() && $content.width() < POPUP_DEFAULT_WIDTH) {
					// 	var scale = $content.get(0).scrollHeight / $content.height(),
					// 		width = $content.width() * scale < POPUP_DEFAULT_WIDTH ? $content.width() * scale : POPUP_DEFAULT_WIDTH;
					// 	$content.width(width);
					// 	$content.css('height', 'auto');
					// }
				} else {
					var switchers = $('<div class="switcherspanel"></div>'),
						$tabs = $('<div class="tabs"/>').appendTo($content),
						prev = $('<div class="prev"/>').appendTo($popup.find(".popup-body")),
						next = $('<div class="next"/>').appendTo($popup.find(".popup-body"));
						// switcherWidth = ($popup.width() + 26) / events.length;

					// centering in middle prev and next
					prev.css("margin-top", -13+titleHeight/2);	// 13 half of height button compensation
					next.css("margin-top", -13+titleHeight/2);

					$popup.find(".popup-title").append(switchers);

					prev.click(function() {
						if (!$(this).hasClass('enabled')) {
							return;
						}
						var activeSwitcher = $popup.find('.switcher.active'),
							pos = parseInt(activeSwitcher.attr('pos')) - 1,
							prevTab = $popup.find('.switcher[pos="' + pos + '"]');
                        prevTab.click();

						// Добавим такой же функционал для ВО виджета
						// Т.к. старое окно клонируется с событиями, то нужно добавить функционал для виджета ВО
						// Иначе ВО с переключателями не работает
                        var activeSwitcherWidget = $('#popup').find('.switcher.active'),
                            posWidget = parseInt(activeSwitcherWidget.attr('pos')) - 1,
                            prevTabWidget = $('#popup').find('.switcher[pos="' + posWidget + '"]');
                        prevTabWidget.click();
					});

					next.click(function() {
						if (!$(this).hasClass('enabled')) {
							return;
						}
						var activeSwitcher = $popup.find('.switcher.active'),
								pos = parseInt(activeSwitcher.attr('pos')) + 1,
								nextTab = $popup.find('.switcher[pos="' + pos + '"]');
						nextTab.click();

                        // Добавим такой же функционал для ВО виджета
                        // Т.к. старое окно клонируется с событиями, то нужно добавить функционал для виджета ВО
                        // Иначе ВО с переключателями не работает
                        var activeSwitcherWidget = $('#popup').find('.switcher.active'),
                            posWidget = parseInt(activeSwitcherWidget.attr('pos')) + 1,
                            nextTabWidget = $('#popup').find('.switcher[pos="' + posWidget + '"]');
                        nextTabWidget.click();
					});

					for (var i = 0; i < events.length; i++) {
						var event = events[i],
						    switcher = $('<div class="switcher" pos="' + i + '">' + event.title + '</div>'),
						    tab = $('<div class="tab" pos="' + i + '">' + event.description + '</div>');
						if (i == 0)  {
							switcher.addClass('active');
							tab.addClass('active');
							switcher.addClass('roundedleft');
						}
						// switcher.width(switcherWidth);

						switchers.append(switcher);
						$tabs.append(tab);

						switcher.click(function() {
							var pos = $(this).attr('pos'),
								switchers = $popup.find('.switcher'),
								tabs = $content.find('.tab'),
							    tab = $content.find('.tab[pos="' + pos + '"]');
							tabs.removeClass('active');
							switchers.removeClass('active');
							$(this).addClass('active');
							tab.addClass('active');

                            // Добавим такой же функционал для ВО виджета
                            // Т.к. старое окно клонируется с событиями, то нужно добавить функционал для виджета ВО
                            // Иначе ВО с переключателями не работает
							var switchersWidget = $('#popup').find('.switcher'),
                                tabsWidget = $('#popup .popup-body .content').find('.tab'),
                                tabWidget = $('#popup .popup-body .content').find('.tab[pos="' + pos + '"]');
                            tabsWidget.removeClass('active');
                            switchersWidget.removeClass('active');
                            $(this).addClass('active');
                            tabWidget.addClass('active');

							calculateNav();
							$content.scrollTop(0);
							$tabs.scrollTop(0);
						});
					}

					calculateNav();

				}

				function showAfterContentReady () {
					$switcher = $popup.find(".switcher");

					// #11192 Подготовка ВО для открытия через виджет
                    // Была проблема при открытии окна (ctrl + shift + u). Удаляем из контейнера все кроме ВО.
                    $('#popup').children().remove();
                    $('#popup').addClass('timeline-popup');
					$('#popup').popup('option', 'zoomScale', 1);

					// #12843 Удаляем класс timeline-popup у #popup при закрытии
					// Виджет сам заботится о единичной регистрации события, поэтому предварительно удалять его не нужно
                    $('#popup').popup({
                        close: function(event, ui) {
                            $(event.target).removeClass('timeline-popup');
                        }
                    });

					// calculate popup with no switchers
					if (!$switcher.length) {
						calculatePopupSize();
						centeringPopup ();
						//$popup.fadeIn('slow'); // #11192
                    	$('#popup').append($popup.clone(true)); // #12100
                        $('#popup').popup('option', 'zoomScale', CourseConfig.zoomScale); // #12843
                        PlayerCourse.openPopup(); // #11192
						return;
					}

					// calculate evry tab size
					$popup.find(".switcher").each(function () {
						$(this).click();
						calculatePopupSize();
					});

					// back to 1st tab
					$popup.find(".switcher[pos='0']").click();
                    // #12100 Вставляем старое окно в новое после того, как были произведены все расчеты
                    $('#popup').append($popup.clone(true));

					centeringPopup ();
					//$popup.fadeIn('slow'); // #11192
                    $('#popup').popup('option', 'zoomScale', CourseConfig.zoomScale); // #12843
                    PlayerCourse.openPopup(); // #11192
				}

				var $imgs = $content.find('img');

				// TODO Оптимизировать. Функция вызывается для каждой картинки
				// do stuff after all images loaded
				if ($imgs.length) {
                    // #12100 Когда все картинки загрузятся, отобразить окно
                    var imagesLength = $imgs.length;
                    $imgs.each(function() {
                    	if (this.complete) { // #12380 Если картинка уже загружена, то не вешаем на нее load, а сразу обрабатываем
                            if (--imagesLength === 0) {
                                showAfterContentReady();
                            }
						} else {
                            $(this).load(function() {
                                if (--imagesLength === 0) {
                                    showAfterContentReady();
                                }
                            })
						}
                    });
				} else {
					showAfterContentReady();
				}

				$el.find('.event-layout').css('z-index', 2);
				clearTimeout(timeout);
				animation = false;
				$popup.focus();

			}, 400);

			function centeringPopup () {
				var left = ($popup.parent().width() - $popup.outerWidth()) / 2,
						top = ($popup.parent().height() - $popup.outerHeight()) / 2;

				$popup.css({'top': top + 'px', 'left': left + 'px', opacity:1});
			}

			function calculatePopupSize () {
				var $popupBody = $popup.find(".popup-body"),
						$popupContent = $popup.find(".content"),
						$popupTitle = $popup.find(".popup-title"),
						$tabs = $popup.find(".popup-title .switcherspanel .switcher");

				$popup.width("auto");
				$popup.height("auto");
				$popupBody.css({height : "auto", width: "auto"});
				$popupContent.css({height : "auto", width: "auto"});
				$popupTitle.css("width", "auto");
				$tabs.width("auto");

				var popupHeight = (params.popupHeight || settings.eventPopupHeight) *1,
						popupWidth = (params.popupWidth || settings.eventPopupWidth) *1;

				// auto width
				if (!popupWidth) {
					popupWidth = $popup.width();

					if (popupWidth > maxWidth) {
						$popup.width(maxWidth);
						popupWidth = $popup.width();
					}

					// with switchers show max width of tab
					if (popupWidth < params.popupMaxWidth) {
						popupWidth = params.popupMaxWidth;
					} else {
						params.popupMaxWidth = popupWidth;
					}

					if ($tabs.length) {	// ??
							$popupContent.css("width", popupWidth);
					}
                    $('#popup').popup('option', 'width', popupWidth);// #11192
				} else {
                    $('#popup').popup('option', 'width', popupWidth);// #11192
				}

                // #11855 Перенесено из конца данной функции. После расчета ширины табов, текст может перенестись
				// на другую строку и высота изменится. Чтобы рассчитать высоту правильно, изменим ширину табов до
				// расчетов высоты окна.
                $tabs.width(popupWidth / $tabs.length);

				// auto height
				if (!popupHeight) {
					popupHeight = $popup.height();
					if (popupHeight > maxHeight) {
						$popup.height(maxHeight);
						popupHeight = $popup.height();
					}

					// with switchers show max width of tab
					if (popupHeight < params.popupMaxHeight) {
						popupHeight = params.popupMaxHeight;
					} else {
						params.popupMaxHeight = popupHeight;
					}

					if ($tabs.length) {
						setPopupHeight(popupHeight);
					}
					// #11192 Устанавливаем 'auto', т.к. расчет положения ВО идет в виджете
					// Не используем popupHeight, т.к. расчет идет по другому принципу из-за этого появляется скролл в ВО
                    $('#popup').popup('option', 'height', 'auto'); // #11192
				} else {
					setPopupHeight(popupHeight);
                    // #11192 Устанавливаем 'auto', т.к. расчет положения ВО идет в виджете
                    // Не используем popupHeight, т.к. расчет идет по другому принципу из-за этого появляется скролл в ВО
                    $('#popup').popup('option', 'height', 'auto');// #11192
				}

				$popupTitle.css("width", popupWidth);
                $('#popup').find(".popup-title").css("width", popupWidth);// Для ВО, открывающегося через виджет
				// $popupBody.css({height: popupBodyHeight, width:popupWidth});
				// $popupContent.css("height", popupBodyHeight - 20*2);	// 20*2 top and bottom paddings compensation
			}
		}

		function setPopupHeight (height) {
            $popup.addClass('timeline-popup_show'); // #11855 Временно отобразим старое ВО для правильных рассчетов
			var $popupBody = $popup.find(".popup-body"),
					$popupContent = $popup.find(".content"),
					titleHeight = $popup.find('.popup-title').height(),
					bodyHeight = height - titleHeight;
            $popup.removeClass('timeline-popup_show'); // #11855

			$popup.height(height);
			$popupBody.css({height: bodyHeight});

			// #11825 Используем flexbox для выравнивания, поэтому высоту контенту задавать не нужно
			//$popupContent.css("height", bodyHeight - 20*2); // body padding compensation
		}

		function calculateNav() {
			var	switchers = $popup.find('.switcher'),
				activeSwitcher = $popup.find('.switcher.active'),
				pos = activeSwitcher.attr('pos'),
			    next = $popup.find('.next'),
			    prev = $popup.find('.prev');
			if (pos == 0) {
				prev.removeClass('enabled');
				next.addClass('enabled');
			} else if (pos == switchers.length - 1) {
				next.removeClass('enabled');
				prev.addClass('enabled');
			} else {
				next.addClass('enabled');
				prev.addClass('enabled');
			}

            // Добавим такой же функционал для ВО виджета
            // Т.к. старое окно клонируется с событиями, то нужно добавить функционал для виджета ВО
            // Иначе ВО с переключателями не работает
            var	switchersWidget = $('#popup').find('.switcher'),
                activeSwitcherWidget = $('#popup').find('.switcher.active'),
                posWidget = activeSwitcherWidget.attr('pos'),
                nextWidget = $('#popup').find('.next'),
                prevWidget = $('#popup').find('.prev');
            if (posWidget == 0) {
                prevWidget.removeClass('enabled');
                nextWidget.addClass('enabled');
            } else if (posWidget == switchersWidget.length - 1) {
                nextWidget.removeClass('enabled');
                prevWidget.addClass('enabled');
            } else {
                nextWidget.addClass('enabled');
                prevWidget.addClass('enabled');
            }
		}

		function imageResize(image, w, h) {
			var width = image.width || '' ? image.width : image.naturalWidth,
			    height = image.height || '' ? image.height : image.naturalHeight;
			$(image).removeAttr('width').removeAttr('height');
			if (!(w || '')) {
				w = $(image).parents().hasClass('tab') ? $popup.width() - 124 : $popup.width() - 24;
			}
			if (!(h || '')) {
				h = 350;
			}
			if (image.naturalWidth >= image.naturalHeight) {
				$(image).attr('style', 'width: ' + (width > w ? w : width) + 'px;');
			} else {
				$(image).attr('style', 'height: ' + (height > h ? h : height) + 'px;');
			}
		}

		function renderSwitchers() {
			if (settings == undefined || settings.categories == undefined) {
				return;
			}
			var	switcher = null,
				category = null;
			$el.append($switchers);
			for (var i = 0; i < settings.categories.length; i++) {
				category = settings.categories[i];
				// ARCH #8409 firsov

					switcher = new Switcher({
						category: i,
						id: category.id,
						title: category.title,
						color: category.color
					});
					if(!category.toggle){
						switcher.css('display','none')
					}

					$switchers.append(switcher);
					if (!(settings.switchersInRow || '')) {
						settings.switchersInRow = 2;
					}
					switcher.css('width', (100 / settings.switchersInRow) + '%');
					switcher.find('.switcher-title').width(switcher.width() - switcher.find('.switcher').width() - 18);
					// end ARCH #8409 firsov
			}
		}

		function renderEvents() {
			$el.append($eventsArea);
			eventsPixelPerDate = Math.round(($eventsArea.width() - 24) / settings.smallRange);
			$eventsArea.height(CATEGORY_HEIGHT * settings.categories.length);
			$eventsArea.append($events);
			$events.width((settings.slider.end - settings.slider.start) * eventsPixelPerDate);
			$(settings.categories).each(function(i) {
				var $categoryBack = $('<div class="category-background category' + i + '"></div>');
				$categoryBack.css({'background': shadeColor(this.color || COLORS[i] , 0.5)});
				$events.append($categoryBack);
				$(this.data).each(function(k) {
					this.category = i;
					if (settings.endDate && modelNS.DateUtils.getDate(this.start) > settings.endDate) {
						console.log('event.startDate > settings.endDate', this.title);
						return;
					}
					if (settings.startDate && modelNS.DateUtils.getDate(this.start) < settings.startDate) {
						console.log('event.startDate < settings.startDate', this.title);
						return;
					}
					new Event(this);
				});
				if (this.hidden) {
					hideCategory( i );
				}
			});
		}

		function resizeCategories() {
			var activeCount = !settings.noswitchers ? $switchers.find('.switcher.checked').length : settings.categories.length,
				catHeight = $eventsArea.height() / activeCount,
				j = 0;
			// maxPosible = 0;	// old
			atTheFarRight = 0;
			$(settings.categories).each(function(i) {
				var categoryTop = j * catHeight,
				    $categoryBack = $eventsArea.find('.category-background.category' + i);
				$categoryBack.css({'top': categoryTop + 'px', 'height': catHeight});
				resizeEvents({categoryID: i, index: j, catHeight: catHeight});
				$('.timeline .event-layout .content').not('[withcustomheight="true"]').height(eventHeight); // #12815 После расчета высот всех плашек задаем им самую большую высоту
				if ($categoryBack.is(':visible')) {
					j++;
				}
			});

			// setLastEventInMaxSliderRight();
		}

		// function setLastEventInMaxSliderRight ()	// #8561		// old
		// {
		// 	sliderView.model.maxPosible = maxPosible;
		// 	var originWidth = settings.width-40, 	// 40 - margins compensation
		// 			sliderVisibleWidth = sliderView.model.maxPosible/sliderView.model.max*originWidth;
		// 	sliderView.scale.width(sliderVisibleWidth);
		// 	sliderView.sliderRight.css('margin-right', originWidth - sliderVisibleWidth);
		// 	if (sliderView.getValue() > maxPosible) sliderView.setValue(maxPosible);
		//
		// 	// скрыть метки которые вылазиют за пределы
		// 	sliderView.scale.find('.markLine').each(function () {
		// 		if (this.style.left.replace('px', '')*1 > sliderVisibleWidth) this.style.display = 'none';
		// 	});
		// }

		function resizeEvents(params) {
			$eventsArea.find('.event-layout.category' + params.categoryID).each(function() {
				var _this = this,
					h = params.catHeight - 16,
					top = params.index * params.catHeight,
					$event = $(this),
					width = $event.attr('width') || DEFAULT_EVENT_WIDTH,
					height = $event.attr('height');

				if (Math.floor(params.catHeight / CATEGORY_HEIGHT) != 1 ||
					settings.categories.length == 1) {
					h = params.catHeight * 0.6;
					top = (params.index * params.catHeight) +  params.catHeight * 0.2;
				}

				var w = 0;
				if ($event.attr('end')) {
					var end = $event.attr('end'),
							year = $event.attr('year');
					if (end != year && end > year && end - year != 1) {
			    		w = (end - year) * eventsPixelPerDate + 83;
			    }
					var endX = eventsPixelPerDate*model.getDateIndex(end) - $event.data('left')  + 40;	// 40 - left outset compensation

					$event.find('.event-periodline').css({width:endX});
					$event.find('.event-markline.end').css({left:endX + 40});	// stasrt left compensassion
					$event.find('.event-pointer.end').css({left:endX + 40});

					w = Math.max(w, endX+83); // Плашки должны быть не уже чем линии периода, переписка [IN_Imumk-Player3] Новинки
				}

				if (width<w) {
					width = w;
				}

				if (!height) {
					height = h;
				}

		    $event.css({
					width: width,
					height: height,
			    top: top,
				});
				var content = $event.find('.content');
				if (content.is(':visible')) {
					content.hide();
				}
	 		    // setTimeout(function() {	// ???

                	//#12815 закомментил
				    //content.css({'height': content.parent().height() - 16 + 'px'});	// 16px - padding;
					content.css('height', 'auto'); // #12815
				    content.show();

						$event.css('height', 'auto');
						// #12815 Если высота текущей плашки больше предыдущих и у этой плашки не установлено
						// своей высоты, то обновляем общую высоту.
						if (eventHeight < content.parent().height() && !$event.attr('height')) {
							eventHeight = content.parent().height();
						}
						// #12815 Если у события есть своя высота, то устанавливаем ее независимо от остальных
						// и добавляем атрибут, чтобы не задавать ему общую высоту.
						if ($event.attr('height')) {
                            content.css({'height': $event.attr('height') - 16 + 'px'}).attr('withcustomheight', 'true');
						}
						// $event.find('.event-markline').css({top: 'auto', height: ($eventsArea.height() - h - top) + 'px'});
				// }, 600);

				// var eventRightYear = Math.ceil(($event.data('left') + w - settings.width + 20)/eventsPixelPerDate);	// 20 left outset compensation
				// if (maxPosible < eventRightYear) maxPosible = eventRightYear; 	// old


				var right = $event.data('left') + $event.width();
				if (atTheFarRight < right) atTheFarRight = right;

				// console.log($event.data('left') + w - settings.width)/eventsPixelPerDate);
			});
		}

		function scrollDates(index) {
            // #11870 Используем метки для слайдера
			var sliderDates = settings.sliderDates ? settings.sliderDates : settings.dates;
			var maxEventsAreaLeft = atTheFarRight - settings.width + 40 + 20, // 40 - left compensation, 20 - right compensation
					//pixelsPerIndex = maxEventsAreaLeft/(settings.dates.length-1), // #11870 Закомментил
                	pixelsPerIndex = maxEventsAreaLeft/(sliderDates.length-1), // #11870
					left = -pixelsPerIndex*index;

			// var left = -(index - settings.slider.start) * settings.eventsSlider.pixelsPerDate;

			$('.eventDates, .events-area .events').css({
				left: left
			}, 40);
		}

		function renderSlider() {
			$el.append($sliderArea);
			 // hasSliderDates = settings.sliderDates.length,
					// dates = hasSliderDates ? settings.sliderDates : settings.dates,

			// #11870 Если установлены даты конкретно для слайдера через <step type="large">, то используем их
			var sliderDates = settings.sliderDates ? settings.sliderDates : settings.dates;
			var dates = [];
					// end = sourceDates.length - 1;

			// for (var i = 0; i < sourceDates.length; i++) {
			// 	dates.push(getDateValue(sourceDates[i], settings.bigFormat));
			// }

			// #11870 Закомментил
			/*for (var i = 0; i < settings.dates.length; i++) {
				var date = settings.dates[i];
				dates.push(settings.hasDateDisplay ? date.display ? date.label : '' : date.label);
			}*/
			// #11870
            for (var i = 0; i < sliderDates.length; i++) {
                var date = sliderDates[i];
                dates.push(settings.hasDateDisplay ? date.display ? date.label : '' : date.label);
            }

			// if (hasSliderDates) {
			// 	settings.slider.range = 1;
			// }

			var parent = $sliderArea;
			if (settings.dimension) {
				var layout = new modelNS.DualVerticalLayout({
						parent: $sliderArea
					}),
					dim = $('<div class="dimension">' + settings.dimension + '</div>');
				layout.render();
				layout.$secondPane.append(dim);
				layout.resize(null, null, dim.width() + 16, null);
				parent = layout.$firstPane;
			}

			if (settings.hasDateDisplay) settings.slider.range = 1;

			// когда шаг на слайдере не соответствует сгенереным датам
			// var max = Math.ceil(dates.length / settings.slider.range) * settings.slider.range + 1;
			// old var max = Math.floor(end / settings.slider.range) * settings.slider.range + 1;

			// auto fill missed dates, when range auto calculated depend from large step
			// while (sourceDates.length < max) {
			// 	var lastIndex = sourceDates.length-1,
			// 			nextDate = getNextDate(sourceDates[lastIndex]);
			//
			// 	sourceDates.push(nextDate);
			// 	dates.push(getDateValue(nextDate, settings.bigFormat));
			// }

			var max = dates.length;

			// settings.slider.end = max - 1;

            this.defaultSliderValue = getDefaultSliderValue(sliderDates);

			var sliderModel = new modelNS.SliderModel({
				parent: parent,
				min: 0,
				max: max,
				dates: dates,
				value: this.defaultSliderValue,
				range: settings.slider.range || 1,
				marksAtBottom: true,
			});
			sliderView = new modelNS.HorizontalSlider({model: sliderModel});
			sliderView.render();
			sliderView.listenTo(sliderView, 'Slide', onSliderChange);
			sliderView.listenTo(sliderView, 'Change', onSliderChange);
		}

		function onSliderChange(ui) {
			 closePopup();
			 scrollDates(ui.value);
		}

		// function onDatesScalling (e)
		// {
		// 	var $scale = $eventsSlider.find('.eventDatesBackground'),
		// 			offset = $scale.offset(),
		// 			left = e.pageX - offset.left,
		// 			width = $scale.width(),
		// 			scale = left/width;
		//
		// 			setDatesScalling(scale)
		// }

		function setScallingIndicator (scale) {
			var $indicator = $eventsSlider.find('.scalingIndicator'),
					$scale = $eventsSlider.find('.eventDatesBackground'),
					width = $scale.width();

					$indicator.css({width : scale / CourseConfig.zoomScale * width});
		}

		function setDatesScalling (scale) {
				settings.smallRange = Math.round(scale * settings.dates.length)

				// refresh events area
				$events.html('');
				renderEvents();
				$eventsSlider.before($eventsArea);

				// refresh events slider
				$eventsSlider.html('');
				renderTimeBar();

				resizeCategories();

				scrollDates(sliderView.getValue());
		}

		function renderTimeBar() {
			$sliderArea.before($eventsSlider);
			var datesWrapper = $('<div class="datesWrapper"></div>').appendTo($eventsSlider),
					$background = $('<div class="eventDatesBackground"/>')
						.width(datesWrapper.width() - 48)
						.appendTo(datesWrapper),
			    $dates = $('<div class="eventDates"></div>')
						// .click(function (e) { onDatesScalling(e) })
						.appendTo(datesWrapper),
			    min = parseInt(settings.slider.start),
			    leftButton = $('<div class="button left" title="Прокрутка влево"></div>').appendTo(datesWrapper),
			    minusButton = $('<div class="button minus" title="Уменьшить масштаб"><span class="verdana">–</span></div>').appendTo(datesWrapper),
			    plusButton = $('<div class="button plus" title="Увеличить масштаб">+</div>').appendTo(datesWrapper),
					rightButton = $('<div class="button right" title="Прокрутка вправо"></div>').appendTo(datesWrapper);

			var pixelsPerDate = Math.round((datesWrapper.width() - 24) / settings.smallRange);
			settings['eventsSlider'] = {pixelsPerDate: pixelsPerDate};
			// for (var year = settings.slider.start; year <= settings.slider.end; year++) {
			// 	$dates.append('<div class="markLine" style="left: ' + ((year - min) * pixelsPerDate + pixelsPerDate / 2 + 12) + 'px"></div>');
			// 	var txt = getDateValue(settings.dates[parseInt(year)], settings.format).replace(/ /g, '&nbsp;');
			// 	    $mark = $('<div class="mark" id="year_' + year + '">' + txt + '</div>'),
			// 	    left = (year - min) * pixelsPerDate + pixelsPerDate / 2 + 40;	// 40 - compensation mark-line left
			// 	appendMark($dates, txt, $mark, left);
			// }

			for (var i=0; i<settings.dates.length; i++) {
				var left = i * pixelsPerDate + pixelsPerDate / 2,
						date = settings.dates[i],
						txt = date.label.toString().replace(/ /g, '&nbsp;'),
						$mark = $('<div class="mark" eventid="' + date.id + '">' + txt + '</div>');

				$dates.append('<div class="markLine" style="left: ' + (left + 12) + 'px"></div>');

				appendMark($dates, txt, $mark, left + 40); // 40 - compensation start left outset
			}

			// scale indicator
			$('<div class="scalingIndicator"/>')
				.appendTo($background);
			setScallingIndicator(settings.smallRange/settings.dates.length);

			// auto hide some marks if need
			autoHideMarks();

			leftButton.click(function() {
				sliderMove('left');
			});
			rightButton.click(function() {
				sliderMove('right');
			});
			plusButton.click(function() {	// приближает нас, дат меньше в полосе
				sliderDatesScaleDown();
			});
			minusButton.click(function() {
				sliderDatesScaleUp();
			});
		}

		function setDatesScaleIndex (index) {
			if (index >= $this.scaleSmallRanges.length) return;
			if (index < 0) return;

			// var $minus = $eventsSlider.find('.minus');

			$this.currentScaleIndex = index;

			settings.smallRange = $this.scaleSmallRanges[$this.currentScaleIndex];
			setDatesScalling (settings.smallRange / settings.dates.length);
		}

		function sliderDatesScaleUp () {
			setDatesScaleIndex($this.currentScaleIndex + 1);
		}

		function sliderDatesScaleDown () {
			setDatesScaleIndex($this.currentScaleIndex - 1);
		}

		function autoHideMarks() {
			$el.find('.mark').show();

			var prevRight = -100;
			for (var i=0; i<settings.dates.length; i++) {
				var date = settings.dates[i],
						$mark = $el.find('[eventid="' + date.id + '"]'),
						left = ($mark.css('left')||'').replace('px', '')*1;

				if (prevRight > left) {
					$mark.hide();
				} else {
					prevRight = left + $mark.width() + 5;
				}
			}
		}

		// function autoHideMarks (k) {	// old, bad work with custom data
		// 	if (!k) k = 1;
		// 	if (settings.eventsSlider.pixelsPerDate * k < $("#year_"+settings.slider.start).width() + 5) {
		// 		if (k == Math.pow(10, Math.round(Math.log10(k)))) { // 1, 10, 100
		// 			k += k;
		// 		} else if (k/2 == Math.pow(10, Math.round(Math.log10(k)))) {	// 2, 20, 200
		// 			k = k/2*10/2;
		// 		} else {
		// 			k = k*2;
		// 		}
		// 		return autoHideMarks(k);
		// 	}
		//
		// 	var min = parseInt(settings.slider.start);
		// 	for (var year = settings.slider.start; year <= settings.slider.end; year++) {
		// 		var txt = getDateValue(settings.dates[parseInt(year)], settings.format).replace(/ /g, '&nbsp;'),
		// 				mark = parseInt(txt),
		// 				filter = mark == txt ? mark : year;
		//
		// 		if (filter%k) $("#year_" + year).hide();
		// 	}
		// }

		function appendMark(dates, text, mark, left) {
			dates.append(mark);
			// setTimeout(function() {
				var pitch = mark.width() / 2,
						markLeft = left - pitch;
				if (markLeft < 50) {	// #11300 - #9290 у самой левой риски название убегает за видимую область. Исправил с 60 на 50. Места с левого края для первой риски еще имеется и нет препятствий для отображения второй.
					markLeft = 50;
				}
				mark.css('left', markLeft + 'px');
			// }, 30);
		}

		function calculateBlueBackground() {
			var margin = $el.width() * 0.05,
			    blueBlack = $el.find('.blue-slider-back');
			blueBlack.width(parseInt($el.find('.ui-slider-handle').css('left').replace('px','')));
		}

		function sliderMove(direction) {
			var val = sliderView.getValue();
			if (direction == 'left' && val != parseInt(settings.slider.start)) {
				val -= 1;
			}
			if (direction == 'right' && val < sliderView.getMax()) {
				val += 1;
			}
			if (sliderView.setValue(val)) {
				scrollDates(val);
			}
		}

		function shadeColor(color, percent) {
		    var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
		    return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
		}

		function isObjOnObj(a,b){
		    var al = parseInt($(a).css('left').replace('px', ''));
		    var ar = al + $(a).width();
		    var bl = parseInt($(b).css('left').replace('px', ''));
		    var br = bl + $(b).width();

		    if(bl > ar || br < al){return false;}//overlap not possible

		    if(bl > al && bl < ar){return true;}
		    if(br > al && br < ar && $(b).css('z-index') == 100){return true;}

		    return false;
		}

		function initZoomScales () {
			$this.scaleSmallRanges = [settings.smallRange/2, settings.smallRange, settings.smallRange*2, settings.smallRange*4];
			if ($this.scaleSmallRanges[0] < 1) settings.scaleSmallRanges[0] = 1;
			$this.currentScaleIndex = 1;
		}

		function makeUnselectable(node) {
			if (node.nodeType == 1) {
				node.setAttribute("unselectable", "on");
			}
			var child = node.firstChild;
			while (child) {
				makeUnselectable(child);
				child = child.nextSibling;
			}
		}

        /**
		 * Получение номера метки на слайдере, куда будет установлен ползунок. Если есть значение, пришедшее из элемента
		 * <default>, то проверяется совпадение со значениями из массива sliderDates. Если совпадение найдено, то ползунок
		 * устанавливается на эту дату, если нет, то в начало.
         * @param {array} sliderDates Массив с объектами данных о дате для каждой метки на слайдере
         * @returns {number} Номер метки слайдера, на которой будет установлен ползунок
         */
		function getDefaultSliderValue(sliderDates) {
			var sliderValue = 0;
            if (settings.def !== void 0) {
                var defaultTimeValue = modelNS.DateUtils.getDate(settings.def).getTime();
                sliderDates.forEach(function(item, index) {
                    if (item.id == defaultTimeValue) {
                        sliderValue = index;
                    }
                });
            }
            return sliderValue;
		}

		// todo: optimize
		this.init();
	}
});

modelNS.DateUtils = {
	getDate: function (formattedDate) {
		var splittedDate = null;
		if (typeof(formattedDate) == 'string') {
            splittedDate = formattedDate.split('.');
			formattedDate = formattedDate.replace(/\./gi, '/');	// ie read only dd/mm/yyyy
			if (formattedDate.length < 4) formattedDate = ('00000' + formattedDate).slice(-4);	// 9 => 0009, for ie support Date.parse
		}

		// #11870 Разбиваем дату на компоненты перед созданием объекта Date. Если приходит строка dd/mm/yyyy,
		// то к значению приюавляется 2:30:17, а если сразу приходит объект Date, представляющий ту же дату,
		// то такого артефакта нет.
		var day = new Date(formattedDate).getDate();
		var month = new Date(formattedDate).getMonth();
        var year = new Date(formattedDate).getFullYear();

        //var date = new Date(formattedDate); //#11870 Закомментил
		var date = new Date(year, month, day); // #11870

		if (typeof(formattedDate) == 'string' && formattedDate.indexOf("-") == 0) {
			if (splittedDate[2] >= 0 && splittedDate[2] < 100) {
                date.setYear(-parseInt(splittedDate[2])-1);
			} else {
                date.setYear(-date.getFullYear()-1);
			}
		} else if (year >= 0 && year < 100) {
			year = year < 10 ? '000' + year : '00' + year;
			month += 1;
            month = month < 10 ? '0' + month : month;
			day = day < 10 ? '0' + day : day;
			date = new Date(year + '-' + month + '-' + day);
		}
		return date;
	},

	getDateValue: function (date, format) {
		var formattedDate = this.getFormattedDate(date);

		// try {
			var splitFormat = format.split('.'),
				splitDate = formattedDate.split('.'),
				day = parseInt(splitFormat[0]) != 0,
				month = parseInt(splitFormat[1]) != 0,
				year = parseInt(splitFormat[2]) != 0;
			if (!day && !month && !year) {
				year = true;
			}
			var prefix = '';
			if (splitDate[2] < 0) {
				splitDate[2] = splitDate[2] * -1;
				prefix = " до н.э.";
			}
			var label = (day ? splitDate[0] + '.' : '') +
						 (month ? splitDate[1] + '.' : '') +
						 (year ? splitDate[2] : '');

			return label + prefix;
		// } catch(e) {
		// 	return 'none';
		// }
	},

	getFormattedDate: function (date) {
		return (date.getDate() < 10 ? ('0' + date.getDate()) : (date.getDate())) + '.' +
				 (date.getMonth() < 10 ? ('0' + date.getMonth()) : (date.getMonth())) + '.' +
				 date.getFullYear();
	},

	getNextDate: function (date, step) {
		var splitStep = step.split('.'),
			day = parseInt(splitStep[0]) != 0 ? parseInt(splitStep[0]) : 0,
			month = parseInt(splitStep[1]) != 0 ? parseInt(splitStep[1]) : 0,
            year = parseInt(splitStep[2]) != 0 ? parseInt(splitStep[2]) : 0,

			newDate = modelNS.DateUtils.getDate(date);

	    newDate.setDate(newDate.getDate() + day);
        newDate.setMonth(newDate.getMonth() + month);
        newDate.setFullYear(newDate.getFullYear() + year);
      // return getFormattedDate(newDate); // TODO: ?? <format/>
			return newDate;
	}
}
