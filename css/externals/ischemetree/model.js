function InteractiveScheme() {
	this.init = function($wrapper, xmlData, params) {
		return new modelNS.InteractiveScheme({
					wrapper: $wrapper,
					xmlData: xmlData,
					params: params
				}).renderOnShow();
	};
}

modelNS.InteractiveScheme = modelNS.BaseModelView.extend({
	initialize: function(options) {
		this.options = options;
		this.model = options; // немного стандартизируем, в будущем переделать конечно надо на нормальную модель
	},
	render: function() {
		var response = decodeURIComponent(CourseConfig.items[CourseConfig.currentSlide].response).replace(/^"/g, '').replace(/"$/g, '');

		var options = this.options,
			wrapper = options.wrapper,
			// #10829 Логику редактируемой схемы включаем только если в оригинальном xml editable включен
			editable = $(options.xmlData).attr('editable'),
			// #10829 Если схема была отображена при обновлении страницы и есть данные с сервера, то используем их.
			// Если схема была обновлена в процессе редактирования, то берем данные, которые пришли.
			xmlData = editable && !options.params.isRerender && response ? $($.parseXML(response)) : options.xmlData,
			params = options.params,
			self = this;

		// #12290 Если установлен параметр global и переменная уже существует, то используем данные схемы из этой переменной
		// Если переменной еще нет, то сохраняем в нее схему
		if (params.global != void 0) {
			if (globalParam['scheme' + params.jsID] != void 0) {
                xmlData = globalParam['scheme' + params.jsID];
			} else {
                globalParam['scheme' + params.jsID] = xmlData;
			}
		}

		this.openedBlock = null;
		this.content = [];

		var $model = this.$el.appendTo(wrapper),
			content$ = $('<div class="content" unselectable="on"></div>'),
			preloader$ = $('<div class="preloader" unselectable="on"></div>'),
			$scheme = $('<div id="scheme" unselectable="on"></div>'),
			schemeOverlay$ = $('<div class="scheme-overlay"></div>'),
			$blocking = $('<div class="blocking-screen"></div>'),
			popupsData = [],
			popupCollection,
			preloader$ = $('.preloader', $model),
			popup1created = false,
			editMode = false,
			debugMode = false,
			jsonData = {
				settings: {},
				content: {},
				popups: {}
			};
		$model.addClass('physicon-model scheme base-model');
		$model.append(content$);
		$model.append(preloader$);
		$model.append(schemeOverlay$);
		content$.append($scheme);

		if (jsonData.settings.main) $model.addClass('main');

		// #12166 Повторение функционала стандартного попапа
		$('#block-popup').remove();
		$('body').append('<div id="block-popup" />');
        $('#block-popup').popup({
            minHeight: 20,
            modal: true,
            autoOpen: false,
            resizable: false,
            closeOnEscape: true,
            closeText: RES.close,
            draggable: false,
            show: {
                effect: 'scale',
                duration: 200
            },
            open: function () {
                if (PageInfo.isAndroid) {
                    $('.ui-widget-overlay').on('touchmove', function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                    });
                }
            },
        });

        var findBlock = function(json, id) {
			if ((json.id || '') && json.id == id) {
				return json;
			}
			var childs = json.childs;
			var block = null;
			for (var i = 0; i < childs.length; i++) {
				var result = findBlock(childs[i], id);
				if (result != null) {
					return result;
				}
			}
		};

		function parsePopups(xmlData) {
			var popups = xmlData.find('popup');
			popups.each(function() {
				try {
					var id = $(this).attr('name'),
						width = $(this).attr('width'),
						height = $(this).attr('height'),
						content = courseML.getHTMLFromCourseML($(this), params);
					popupsData.push({ id: id, content: content, width: width, height: height });
				}
				catch (e) {}
			});
			self.popupCollection = popupCollection = new modelNS.PopupCollection(popupsData);
		}

		function showInnerPopup(popupId) {
			var popupModel = getPopup(popupId);
			if (popupModel == null) {
				return;
			}
			if ($popup.is(':visible')) {
				closePopup();
			}
			var $content = $popup.find('.content');
			$content.html('');
			$popup.removeAttr('style');
			$blocking.show();
			$blocking.click(function() {
				closePopup();
			});
			$content.append(popupModel.content);
			if (popupModel.width || '') {
				$popup.width(popupModel.width);
			}
			if (popupModel.height || '') {
				$popup.width(popupModel.height);
			}
			setTimeout(function() {
				var top = ($model.height() - $popup.height()) / 2,
					left = ($model.width() - $popup.width()) / 2;
				$popup.css('top', top + 'px');
				$popup.css('left', left + 'px');
				$popup.fadeIn('slow');
				$content.scrollTop(0);
			}, 300);
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

		var blockToJSON = function(block) {
			var json = {},
				popupWidth = jsonData.settings.popupWidth,
				$name = block.find('name').first();
			json.id = block.attr('id');
			json.color = block.attr('color');
			json.childs = [];
			json.smallBlock = {};
			json.smallBlock.title = courseML.getHTMLFromCourseML(block.find('name'), params) || '';
			json.smallBlock.width = block.attr('width');
			json.smallBlock.height = block.attr('height');
			json.smallBlock.valign = $name.attr('valign') || 'middle';
			json.smallBlock.time = $name.attr('time');
			json.lightstart = block.attr('lightstart');
			json.lightend = block.attr('lightend');
			json.order = $name.attr('order');

			if ($(block.find('name').get(0)).attr('img') || '') {
				json.smallBlock.customData = { image: $(block.find('name').get(0)).attr('img')};
			}
			if (block.find('info').length != 0) {
				var infoBlk = block.find('info').first();
				json.bigBlock = {};
				json.bigBlock.width = infoBlk.attr('width') || popupWidth;
				json.bigBlock.height = infoBlk.attr('height') || '';
				json.bigBlock.title = json.smallBlock.title;
				json.bigBlock.content = infoBlk;
				json.bigBlock.id = json.id;
				if (json.smallBlock.customData || '') {
					json.bigBlock.customData = { image: $(block.find('name')[0]).attr('img') };
				}
				json.bigBlock.time = infoBlk.attr('time');
				if (!json.order) json.order = infoBlk.attr('order');
				json.endtime = infoBlk.attr('endtime');
			}

			self.content.push(json);
			json.parent = block.attr('parent');

			if ((block.attr('parent') || '') && block.attr('parent') != 0) {
				var parent = findBlock(jsonData.content, block.attr('parent'));
				if (parent || '') {
					parent.childs.push(json);
				}
			}
			else {
				jsonData.content = json;
			}
		};

		var parseData = function(xmlData) {
			var $xml = $(typeof(xmlData) == 'string' ? $.parseXML(xmlData) : xmlData),
				ischeme = $xml.find('ischeme'),
				settings = $xml.find('settings');

			jsonData.settings.width = settings.length != 0 && settings.find('width').length != 0 ? parseInt(settings.find('width').text()) :
				ischeme.attr('width') || '' ? ischeme.attr('width') : $model.width() != 0 ? $model.width() : 800;
			jsonData.settings.height = settings.length != 0 && settings.find('height').length != 0 ? parseInt(settings.find('height').text()) :
				ischeme.attr('height') || '' ? ischeme.attr('height') : $model.height() != 0 ? $model.height() : 600;

			if (jsonData.settings.width > 1200) jsonData.settings.width = 1200;
			if (jsonData.settings.height > 1000) jsonData.settings.height = 1000;
			// if (jsonData.settings.width < 400) jsonData.settings.width = 400;	// #8331
			// if (jsonData.settings.height && jsonData.settings.height < 300) jsonData.settings.height = 300;	// #8942

			jsonData.settings.smallBlockWidth = settings.length != 0 && settings.find('blockWidth').length != 0 ? parseInt(settings.find('blockWidth').text()) :
				ischeme.attr('blockWidth') || '' ? ischeme.attr('blockWidth') : 200;
			jsonData.settings.smallBlockHeight = settings.length != 0 && settings.find('blockHeight').length != 0 ? parseInt(settings.find('blockHeight').text()) :
				ischeme.attr('blockHeight') || '' ? ischeme.attr('blockHeight') : 200;
			jsonData.settings.popupWidth = settings.length != 0 && settings.find('contentBlockWidth').length != 0 ? parseInt(settings.find('contentBlockWidth').text()) :
				ischeme.attr('contentBlockWidth') || '' ? ischeme.attr('contentBlockWidth') : "auto";
			jsonData.settings.openedBlocks = settings.length != 0 && settings.find('opennedBlocks') != 0 ? settings.find('opennedBlocks').text().split(',') :
				ischeme.attr('opennedBlocks') || '' ? ischeme.attr('opennedBlocks').split(',') : [];
			//#8355  firsov
			jsonData.settings.typeline = ischeme.attr('typeline');
			if (jsonData.settings.typeline == undefined) {
				jsonData.settings.typeline = 'line';
			}
			//end #8355 firsov

			jsonData.settings.main = ischeme.attr('main') === 'true' || ischeme.attr('main') === undefined;

			jsonData.settings.showtime = ischeme.attr('showtime') === 'true';


			$xml.find('block').each(function() {

				blockToJSON($(this));
			});

			// showblock
			var showblock = params.showblock || ischeme.attr('showblock');

			// recurcive showblock for root
			function apply_showblock (blocks) {
				for (var i=0; i<blocks.length; i++) {
					var block = blocks[i],
							id = block.id;
					if (showblock == id) {
							return jsonData.settings.openedBlocks.push(id);
					}
					if (block.childs) {
						if (apply_showblock(block.childs)) {
							return jsonData.settings.openedBlocks.push(id);
						};
					}
				}
			}
			apply_showblock([jsonData.content]);

			// function isOpenedBlock (block)
			// {
			// 	if (block.id) {
			// 		if (block.id == showblock || isOpenedBlock(block.childs)) {
			// 			if (jsonData.settings.openedBlocks.indexOf(block.id)<0) {
			// 				jsonData.settings.openedBlocks.push(block.id);
			// 			}
			// 			return true;
			// 		}
			// 	} else { // argument is .childs
			// 		for (var i=0; i<block.lenght; i++) {
			// 			return isOpenedBlock(block[i]);
			// 		}
			// 	}
			// }
			// if (showblock) isOpenedBlock(jsonData.content);

			// openblock
			var openblock = params.openblock || ischeme.attr('openblock');
			function apply_openblock (blocks) {
				for (var i=0; i<blocks.length; i++) {
					var block = blocks[i],
							data = block.bigBlock,
							id = block.id;
					if (openblock == id) {
							showPopup(data.title, data.content, data.width, data.height || '', data.color, data.customData);
							return true;
					}
					if (block.childs) {
						if (apply_openblock(block.childs)) return true;
					}
				}
			}
			apply_openblock([jsonData.content]);

			parsePopups($xml);

			return jsonData;
		};

		////////////////////////////////////////////////////////////////
		// methods /////////////////////////////////////////////////////
		////////////////////////////////////////////////////////////////

		var showPopup = function(data) {

				var popup = {
						id: data.id,
						content: data.popupContent || courseML.getHTMLFromCourseML(data.content, params),
						closableOnOverlayClick: true,
						// autoWidth: data.width == 'auto', // устаревшее
						width: data.width == data.width*1 ? (data.width - 8) : data.width, // 8px - compensation, popup in 8px biggest
						height: data.height || 'auto', // data.height || '',
						// title: data.title,	// 9760#note-3
						color: '#FFD7B4',
						className: jsonData.settings.showtime && self.demoPlaying && 'showtime',
            			draggable: false, // #10829 - #10913 ВО не должны перетаскиваться
					},
					popupModel = new modelNS.Popup(popup);
				// var popup = new modelNS.PopupView({ model: popupModel });
				// $model.append(popup.render().el);

				// #13445(1) - раскомментированно ниже. Для работоспособности вложенных popup окон. (createPopup - основной и рекомендуемый метод для popup).
				popup.customMaxHeight = data.customMaxHeight;
				self.createPopup(popup); //#12166 Будем испоьзовать стандартное ВО

				// #13445(2) - закомментированно ниже.
				/* // #12166
                $('#block-popup').html(popup.content).attr('popup-id', popup.id);
				$('#block-popup').popup('option', 'width', popup.width);
                $('#block-popup').popup('option', 'height', popup.height);
                // #12484 Передаем свой max-height для ВО
				$('#block-popup').popup('option', 'customMaxHeight', data.customMaxHeight);
				$('#block-popup').popup('open'); */
			},

			customSmallBlockRenderer = function(data) {
				var $tmp = $('<div><table class="block-text-wrapper"><tr></tr></table></div>'),
					$tr = $tmp.find('tr'),
					$title = $('<td/>').append(data.title).appendTo($tr),
					$leftFigure = $title.find('.leftFigure'),
					$rightFigure = $title.find('.rightFigure'),
					$centerFigure = $title.find('.centerFigure');

				// firsov ARCH #8331
				if (data.valign != undefined) {
					$title.css('vertical-align', data.valign);
				}

				//	commented becose of #8965
				if ($leftFigure.length) $('<td/>').append($leftFigure).prependTo($tr);
				if ($rightFigure.length) $('<td/>').append($rightFigure).appendTo($tr);
				// if ($centerFigure.length) $tr.before($('<tr/>').append($('<td/>').append($centerFigure)));	// #8965

				//ARCH #8370 firsov

				$($tmp.find('.block-text-wrapper').find('td')[2]).css('width', '100%');
				return $tmp.html();

				// return '<div class="block-text-wrapper">' +
				//        (data.customData.image ? '<img class="small-icon" src="' + data.customData.image + '"/>' : '') +
				// 	   '<span unselectable="on">'+data.title+'</span>' +
				// 	   '</div>';
			},

			customBigBlockRenderer = function(data) {
				return '';
			},

			linkHandler = function(id) {
				var popupData = data.popups[id];
				if (popupData !== undefined) {
					showPopup(popupData);
				}
			};

		this.initScheme = function(xmlData) {
			var data = this.data,
				settings = data.settings || {},
				small_blk_height = settings.smallBlockHeight;

			if (data.settings.width) $model.width(data.settings.width);
			if (data.settings.height) $model.height(data.settings.height);

			jQuery.fx.off = !true;

			$scheme.scheme({
				data: data.content,
				smallBlockWidth: settings.smallBlockWidth,
				smallBlockHeight: settings.smallBlockHeight,
				smallBlockHorizontalGap: settings.smallBlockHorizontalGap,
				smallBlockVerticalGap: settings.smallBlockVerticalGap,
				smallBlockColors: settings.smallBlockColors,
				smallBlockRenderer: customSmallBlockRenderer,
				bigBlockRenderer: customBigBlockRenderer,
				linkHandler: linkHandler,
				openedBlocks: settings.openedBlocks,
				typeline: settings.typeline,
				main: settings.main,
				xmlData: xmlData, // #10829 По атрибуту editable узнаем, нужно ли выводить значок начала редактирования
				params: params, // #10829 Из этого объекта мы получим jsID модели схемы в виджете
				wrapper: wrapper, //#10829 Для ререндеринга схемы
				showblockcontent: function(e, data) {
					//console.log(data)
					showPopup(data);
				},
				datachange: function() {
					preloader$.hide();
				},
				onblockopened: function(json) {
					self.onBlockOpened(json);
				}
			});
		};

		this.data = parseData(xmlData);

		this.renderPopups();

		this.initScheme(xmlData);

		this.timers = {};

		// если на слайд перешли из режима демо
		if (params.activeDemo) {
			if (this.data.settings.showtime) this.showtime();
		}

		return this;
	},

	renderPopups: function ()	{
		this.$popups = $('<div/>').hide().appendTo(this.$el);
		this.renderPopup(this.data.content);
		PlayerCourse.updateMathJax();
	},

	renderPopup: function (block) {
		if (block.bigBlock) block.bigBlock.popupContent = $('<div/>')
			.append(courseML.getHTMLFromCourseML(block.bigBlock.content, this.options.params))
			.appendTo(this.$popups);

		for (var i=0; i<block.childs.length; i++) {
			this.renderPopup(block.childs[i]);
		}
	},

	startDemo: function(fn) {
		modelNS.BaseModelView.prototype.startDemo.apply(this, arguments);

		if (this.data.settings.showtime) this.showtime();

		this.openNext();
	},

	openNext: function() {
		if (this.isDemoPause()) return this.saveDemoMoment();

		var curId = this.openedBlock && this.openedBlock.id,
				showtime = this.data.settings.showtime;

		for (var c = 0; c < this.demoList.length; c++) {
			var json = this.demoList[c],
				id = json.id;
			if (!curId) {

				// <name time="..">
				if (json.smallBlock.time) {
					var time = json.smallBlock.time * 1000,
							timeDiff = time - this.demoPlayTime();

					if (timeDiff > 0) return this.waitAndOpenNext(timeDiff);
				}

				this.closeDemoBlock();

				// open next block
				if (!this.openBlock(id)) {
					// this.openedBlock = json;
					// this.waitAndOpenPopup(json);
					this.onBlockOpened({id:showtime ? json.parent : json.id});
				}
				return;
			}

			if (id == curId) curId = false;
		}

		// this.closeDemoBlock();	// только по endtime закрываем последний блок #8869
		this.onDemoFinish();
	},


	openBlock: function(id) {
		if (this.isDemoPause()) return this.saveDemoMoment();

		if (!id) return;	// ??

		if (!this.openingBlockId) {
			this.markBlock(id);
			this.openingBlockId = id;
		}

		// если showtime включен, то логика меняется, и OpenBlock открывает не дочерние блоки, а сам блок
		// TODO: только для демо режима?
		// TODO: если родитель со множеством дочерних, то не поддержится?
		if (this.data.settings.showtime) {
			var json = this.getBlockJson(id),
					parent = this.getBlockJson(json.parent),
					self = this;
			if (!parent) {	// root
				this.getBlockById(json.id).slideDown(function () {
					self.onBlockOpened({id:json.parent});
				});
				// this.openedBlock = json;
				// this.openingBlockId = null;
				// if (json.bigBlock) {	// if root have popup
				// 	this.waitAndShowPopup(json);
				// } else {
				// 	this.openNext();
				// }
				// if (!json.bigBlock)
				return true;
			}
			id = parent.id;
		}

		// open by expand block and show childs
		var $expand = this.getBlockById(id).find('.btn-expand-childs').not('.expanded');
		if ($expand.length) {
			$expand.click();
			return true;
		}
	},

	onBlockOpened: function(json) {
		var showtime = this.data.settings.showtime && this.demoPlaying,
				openingJson = this.getBlockJson(this.openingBlockId);

		if (json.id == (showtime ? openingJson.parent : this.openingBlockId)) {	// события также срабатывает для дочерних, фильтруем

			this.openedBlock = openingJson;

			this.openingBlockId = null;
		}

		if (this.demoPlaying) {
			this.waitAndShowPopup(this.openedBlock);
			if (this.demoOrdered) this.openNext();
		}
	},

	closeDemoBlock: function () {
		// close popup
		// $('.model-popup .ui-dialog-titlebar-close').click();
		closePopup();

		this.unmarkAll();
	},

	unmarkAll: function () {
		// remove demonstarate mark
		this.$el.find('.block-small').removeClass('demonstrate');
	},

	getBlockJson: function (id) {
		for (var i=0; i<this.content.length; i++) {
			if (this.content[i].id == id) {
				return this.content[i];
			}
		}
	},

	waitAndOpenNext: function(ms) {
		var self = this;
		this.timers.next = this.timeout(function() { self.openNext() }, ms);
	},

	markBlock: function (id) {
		var json = this.getBlockJson(id),
				$el = this.getBlockById(id),
				color = $el.attr('color'),
				self = this;

		if ($el.find('.mark').length) return;

		if (json.lightstart) {
			var time = json.lightstart * 1000,
					timeDiff = time - this.demoPlayTime();

			if (timeDiff > 0) return this.timeout(function () {self.markBlock(id)}, timeDiff);
		} else {
			if (this.demoOrdered) return;	// для моделей с order не используем автоподсветку при открытии
		}

		var $mark = $('<div class="mark"/>').appendTo($el);

		function blink ()
		{
			$el.find('.block-container')
				.stop()
				.animate({'backgroundColor':shadeColor(color, 0.5)}, 500)
				.delay(500)
				.animate({'backgroundColor':color}, 500, function () {
					if (json.lightend && self.demoPlayTime() < json.lightend * 1000) {
							return blink();
					}
					return $mark.remove();
				});
		}

		blink();
	},

	getBlockById: function(id) {
		return this.$el.find('.block-small[blockid="' + id + '"]');
	},

	// if need open parent block first, then show popup
	waitAndOpenPopup: function (json, ms) {
		var self = this;

		if (this.openBlock(json.parent)) {
			return;
		}

		this.waitAndShowPopup(json, ms);
	},

	// only show popup
	waitAndShowPopup: function(json, ms) {
		var self = this;

		if (!ms) ms = this.duration(2000, { max: 10000, calc: this.getBlockById(json.id) });

		this.timers.popup = this.timeout(function() { self.showPopup(json) }, ms);
	},

	showPopup: function(json) {
		if (this.isDemoPause()) return this.saveDemoMoment();

		var self = this;

		// возможно дочерний уже открыт, тогда только Popup будет открывать и событие .onBlockOpened не сработает
		// this.openingBlockId = null;	// обнуляем до showPopup в onBlockOpened, onBlockOpened - обязателен

		if (!json.bigBlock) {
			if (!this.demoOrdered) this.openNext();
			return;
		}

		// <info time="..">
		if (json.bigBlock.time) {
			var time = json.bigBlock.time * 1000,
					timeDiff = time - this.demoPlayTime();

			if (timeDiff > 0) return this.waitAndShowPopup(json, timeDiff);
		}

		// <info time="..">
		if (json.endtime) {
			var time = json.endtime * 1000,
					timeDiff = time - this.demoPlayTime();

			this.timers.closepopup = this.timeout(function () {self.closePopup(json.id)}, timeDiff);
		}

		var self = this,
			$zoomer = this.getBlockById(json.id).find('.btn-show-content');

		if ($zoomer.length) {
			$zoomer.click();
			if (!this.demoOrdered) this.timers.opennext = this.timeout(function() {
				self.waitAndOpenNext(self.duration(2000, { max: 10000, calc: ".mCSB_container" }))
			}, 500);
		}
	},

	demoOrder: function () {
		modelNS.BaseModelView.prototype.demoOrder.apply(this, arguments);

		var content = this.content,
				demoListObjects = [],
				demoListKeys = [];

		for (var c = 0; c < content.length; c++) {
			var json = content[c],
					order = json.order*1;
			if (order) {
				while(demoListObjects[order]) order += 0.001;
				demoListObjects[order] = json;
				demoListKeys.push(order);
			} else {
				this.demoList.push(json);
			}
		}

		if (!demoListKeys.length) return;

		this.demoOrdered = true;

		demoListKeys.sort(function (a,b) {
		    return a - b;
		});
		// console.log(demoListKeys);

		this.demoList = [];
		for (var k=0; k<demoListKeys.length; k++) {
			var key = demoListKeys[k];
			this.demoList.push(demoListObjects[key]);
		}
	},

	showtime: function () {
		this.$el.addClass('showtime');

		var rootBlock = this.content[0];	// TODO: better way found root

		if (rootBlock.order) {	// parent obj
			var $block = this.getBlockById(rootBlock.id);
			// $block.find('.block-container')
			// 	.css({
			// 		width : $block.width(),
			// 		height : $block.height(),
			// 	});
			$block.hide();
		}
	}

});
