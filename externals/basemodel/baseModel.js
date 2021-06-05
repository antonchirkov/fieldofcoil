// TODO: requirejs ??
// или там что-то было у тегов скрипт .async ?

var modelNS = modelNS || {},
		baseModelLang = {
			ru : {
				prev: 'Перемотка назад',
				play: 'Старт',
				pause: 'Пауза',
				stop: 'Стоп',
				next: 'Перемотка вперёд',
				film: 'Фильм',
			},
			en : {
				prev: 'Fast Forward',
				play: 'Play',
				pause: 'Pause',
				stop: 'Stop',
				next: 'Rewind',
				film: 'Video',
			}
		};

(function() {

	modelNS.debugging = true;

	modelNS.log = function(msg) {
		if (modelNS.debugging) {
			console.log(msg);
		}
	};

	modelNS.langs = [];

	/* регистрирует языковые данные по типу .addLangs({'ru': {name:'Имя'}})
	 * что бы потом получить язык в соответствии настроек плеера,
	 * нужно использовать modelNS.lang('name')
	 */
	modelNS.addLangs = function (langs)
	{
		for (var lg in langs) {
			if (!this.langs[lg]) {
				this.langs[lg] = langs[lg];
			} else {
				for (var name in langs[lg]) {
					this.langs[lg][name] = langs[lg][name];
				}
			}
		}
	}

	/* получить язык в соответствии настроек плеера */
	modelNS.lang = function (name)
	{
		return this.langs[window.language||'ru'][name] || name;
	}

	modelNS.View = Backbone.View.extend({
		initialize: function(options) {
			this.selectable = options.selectable;
			this.popups = [];
		},
		render: function () {
			if (this.selectable !== undefined) {
				this.setSelectable(this.selectable);
			}
		},
		setSelectable: function (selectable) {
			if (!selectable) {
				this.$el.get(0).onselectstart = function(e) {
					if (e.target.nodeName !== 'INPUT') {	// фикс "Текст в поле ввода нельзя выделить мышью"
						return false;
					}
				};
			}
		},

		// Включить прослушивание открытия ВО из ВО
		handlePopups: function ($el) {
			var self = this,
					popupCollection = this.model && this.model.popupCollection || this.popupCollection, // old support
					$el = $el || this.$el;

			return $el.on('click', '[popup]', function (e) {
				var $el = $(this),
						popup = $el.attr('popup'),
						model = popupCollection.get(popup),
						content = model.get('content');

					// когда wrapper[popup]
					e.preventDefault();
					e.stopPropagation();

					self.createPopup(model.attributes);
			});
		},

		// новый способ создание попапов используя надстройку над jquery .popup()
		createPopup: function (popup, event) {
			var $popup = $('<div/>')
						.html(popup.popupContent || popup.content)
						.popup($.extend({
							removeOnClose: true // при использовании createPopup поддержка старого метода при закрытии удаляем из дом
						}, popup));

			this.handlePopups($popup);
			PlayerCourse.updateMathJax();

			this.trigger("Popup", event, popup);

			return $popup;
		},

		/**
		 * Открывает и кэширует всплывающее окно
		 */
		openPopup: function (popup) {
			if (!this.popups[popup.id]) {
				this.popups[popup.id] = this.createPopup($.extend({
					removeOnClose: false // при использовании openPopup не удаляем по закрытию
				}, popup));
			}
			this.popups[popup.id].popup();
			return this.popups[popup.id];
		},
	});

	/* регистрация базового языка */
	modelNS.addLangs(baseModelLang);

	modelNS.events = $.extend({}, Backbone.Events);

	modelNS.BaseModel = Backbone.Model.extend({
		defaults: {
			width: 800,
			height: 600,
			scalable: true
		},
		initialize: function(options) {
			this.options = options;

			this.restyling = options.restyling !== undefined ? options.restyling : this.restyling;
			modelNS.restyling = this.restyling; // restyling mode

			this.defaults = options.defaults || this.defaults;
			this.params = options.params;
			this.xmlData = options.xmlData;
			this.dataJSON = this.parseXML(options.xmlData);
			this.wrapper = $(options.wrapper || options.parent);
			this.basePath = options.basePath;

			// old support
			if (!this.restyling) {
				this.width = ((options.width || '') && options.width > this.defaults.width) ? options.width : this.defaults.width;
				var scale = this.width / this.defaults.width;
				this.height = this.defaults.height * scale;
				this.calculateSize();
			}

			if (this.restyling) {
				if (this.width) {
					this.wrapper.css({width: this.width});
				} else {
					this.width = this.wrapper.width();
				}
				if (this.height) {
					this.wrapper.css({height: this.height});
				} else {
					this.height = this.wrapper.height();
				}
			}
		},
		calculateSize: function() {
			if (typeof(this.options.scalable) === 'boolean' && !this.options.scalable) {
				this.defaults.width = this.width;
				this.defaults.height = this.height;
				this.defaults.scalable = false;
			}
			this.scale = this.width / this.defaults.width;
			if (this.scale == 1) {
				this.scale = this.height / this.defaults.height;
				if (this.scale != 1) {
					this.width = this.defaults.width * this.scale;
				}
			}
			else {
				this.height = this.defaults.height * this.scale;
			}
		},
		parseXML: function(xmlData) {
			if (!xmlData) {
				return null;
			}

			if (this.restyling) {
			 	var $xml = $(typeof(xmlData) == 'string' ? $.parseXML(xmlData) : xmlData),
						$root = $xml.children(0),
						height = $root.attr('height') || this.defaults.height,
						width = $root.attr('width') || this.defaults.width;

				this.$root = $root;

				if (width) this.width = width;
				if (height) this.height = height;

				this.name = $root[0].tagName;
			}

			this.popupCollection = new modelNS.PopupCollection(this.parsePopups(this.$root));

			return null;
		},
		parsePopups: function ($xml) {
			var popups = [];
			$xml.find('popup').each(function() {
				var id = $(this).attr('id') || '' ? $(this).attr('id') : $(this).attr('name'),
					width = $(this).attr('width'),
                    height = $(this).attr('height'),
				content = courseML.getHTMLFromCourseML($(this));
                popups.push({
                    closableOnOverlayClick: true,
                    id: id,
                    width: width,
                    height: height,
                    content: content
                });
			});
			return popups
		},
		// обновляем xml, обновляя содержимое тегов <write>
		reinit: function () {
			this.initialize(this.options);
		}
	});

	modelNS.BaseModelView = modelNS.View.extend({
		className: 'base-model',
		initialize: function(options) {
			modelNS.View.prototype.initialize.apply(this, arguments);
			this.model = options.model;
			this.popupCollection = new modelNS.PopupCollection(); // старое
		},
		render: function() {
			var self = this;

			modelNS.View.prototype.render.apply(this, arguments);

			if (this.model.restyling) {
				this.$el.addClass('im-model model-blue ' + this.model.name);

				// включение в моделе увеличение высоты заголовков в режиме board
				if (typeof this.model.restyling == 'string') {
					if (this.model.restyling.indexOf('title')>=0) {
						this.$el.attr("skin-title", "");
					}
				}
			}

			this.resize();
			this.model.wrapper.append(this.$el);

			// В следующем такте срабатывает событие о том что модель отрисована
			setTimeout(function () {
				PlayerCourse.trigger('modelRendered', [self]);
			}, 0);

			return this;
		},

		// рендеринг после отображения что бы правильно расчитать размеры
		renderOnShow: function () {
			var $wrapper = this.model.wrapper,
					$tabs = $wrapper.parents(".tabs"),
					self = this;;

			// если в табах то рендерим не сразу
			if (!$wrapper.is(':visible') && $tabs.length) {
				$tabs.on( "tabsactivate", function( event, ui ) {
					if ($wrapper.is(':visible') && !self.$el.is(':visible')) {
						self.render();
					}
				});
			} else {
				this.render();
			}

			return this;
		},

		// обновлять модель при изменении globalParam
		// например в другом табе на том же самом слайде
		// поидее не актуально после смены слайда
		// TODO: возможно при смене слайда нужно отключать этот listener ?
		reloadOnGlobalParamUpdated: function () {
			var self = this;

			if (!this.listenerGlobalParam) this.listenerGlobalParam = $(document).on( "globalParamsUpdated", function () {
				// только если на текущем слайде
				// считаем что если модель в древе body> тогда она на текущем слайде
				if (self.$el && self.$el.parents('body').length) {
					self.model.reinit();
					self.reload();
				} else {
					// TODO: прерывать прослушивание, так как слайд изменен
				}
			});
		},
		resize: function() {
			if (this.model.restyling) {
				this.$el.width(this.model.width);
				this.$el.height(this.model.height);
			} else {	// old support
				this.model.wrapper.width(this.model.width);
				this.model.wrapper.height(this.model.height);
				this.$el.width(this.model.defaults.width);
				this.$el.height(this.model.defaults.height);

				if (this.model.scale != 1) {
					this.$el.css({
						'-moz-transform': 'scale(' + this.model.scale + ')',
						'-webkit-transform': 'scale(' + this.model.scale + ')',
						'-o-transform': 'scale(' + this.model.scale + ')',
						'transform': 'scale(' + this.model.scale + ')'
					});
				}
			}
		},

		// Старый способ отображения popup
		showPopup: function(model) {
			if (model.popup || '') {
				var popup = this.popupCollection.get(model.popup);
				if (popup) {
					popup.set({ parent: this.$el });
					this.$el.append(new modelNS.PopupView({ model: popup }).render().el);
				}
			}
		},

		closePopup: function (id)
		{
			if (id && !$('[popup="'+id+'"]').length) return;
			closePopup();
		},

		// сохранить ответ
		saveAnswer: function() {},

		// загрузить ответ
		loadAnswer: function() {},

		// 0 - 100 баллов
		answerScore: function() {},

		// правильный ли ответ
		checkAnswer: function() { return this.answerScore() == 100; },

		// показывает правильный ответ в моделе
		showSolution: function() {},

		// приведение в изначальное состояние
		reload: function() {
			// close popup
			$('.model-popup .ui-dialog-titlebar-close').click();

			// clear timeouts
			if (this.timers) {
				for (var t in this.timers) {
					clearTimeout(this.timers[t]);
					clearInterval(this.timers[t]);
					cancelAnimationFrame(this.timers[t]);
				}
			}

			// re-render
			this.$el.html("").remove();
			this.render();
		},

		// ======== DEMO BLOCK =============

		demoSpeed: 1,

		// проиграть демо
		playDemo: function(fn) {
			if (!this.demoPaused) {
				this.startDemo(this.demoDuration, fn);
			}
			else {
				this.unpauseDemo();
			}
		},

		// старт проигрывания демо
		startDemo: function(duration, callback) {	// TODO: время проигрывания,
			this.demoPlaying = true;
			this.demoStartedAt = Date.now();
			this.demoDuration = duration;

			if (callback) this.onDemoFinish(callback);

			this.demoOrder();
		},

		// сколько прошло времени со старта демонстрации
		demoPlayTime : function () {return Date.now() - this.demoStartedAt},

		// осортировать воспроизведение демки
		demoOrder : function () {this.demoList = []},

		// приостановить демо
		pauseDemo: function() { if (this.demoPlaying) this.demoPaused = true },

		// снять паузу с проигрывания демо
		unpauseDemo: function() {
			this.demoPaused = false;
			if (this.demoMoments)
				for (var i = 0; i < this.demoMoments.length; i++) {
					this.demoMoments[i][0].apply(this, this.demoMoments[i][1])
				}
			this.demoMoments = [];
		},

		// проверяет установлена ли пауза в демо
		isDemoPause: function() {
			return this.demoPlaying && this.demoPaused;
		},

		// сохранить вызывающую функцию с ее параметрами, дает возможность ее полностью повторить
		saveDemoMoment: function() {
			if (!this.demoMoments) this.demoMoments = [];
			this.demoMoments.push([arguments.callee.caller, arguments.callee.caller.arguments]);
			return true;
		},

		// ускорить процесс
		speedupDemo: function() { this.setDemoSpeed(this.demoSpeed * 1.3) },

		// замедлить процесс
		slowdownDemo: function() { this.setDemoSpeed(this.demoSpeed / 1.3) },

		// установить скорость проигрывания демки
		setDemoSpeed: function(speed) { this.demoSpeed = speed },

		// остановить демо и сбросить в начало
		resetDemo: function() {
			this.demofinish = [];
			this.reload();
		},

		// событие по окончанию демо
		onDemoFinish: function(fn) {
			if (!this.demofinish) this.demofinish = [];

			if (fn) {
				this.demofinish.push(fn);
			}
			else {

				// <info time="..">
				if (this.demoDuration) {
					var self = this,
							timeDiff = this.demoDuration*1 - this.demoPlayTime();

					if (timeDiff>0) return setTimeout(function () {self.onDemoFinish()}, timeDiff);
				}

				for (var i = 0; i < this.demofinish.length; i++) {
					this.demofinish[i].apply(this);
				}
			}
		},

		// длительность эффекта, с учетом состояния модели
		duration: function(ms, ops) {
			if (!ops) ops = {};
			if (!ops.min) ops.min = 50;
			if (!ops.max && !ops.calc) ops.max = ms;

			var duration = ms;

			if (this.demoPlaying) {

				// calc duration
				if (ops.calc) {
					var $calc = $(ops.calc);

					if ($calc.length) {
						var $imgs = $calc.find('img'),
							lineHeight = ($calc.css('lineHeight') || '').replace('px', '') * 1,
							msPop = $imgs.length * 1000;

						$calc.addClass('calculating-duration');
						msPop += Math.ceil($calc.height() / lineHeight) * 0.5 * 1000; // 0.5s for evry line text
						$calc.removeClass('calculating-duration');

						if (msPop > ms) duration = msPop;
					}
				}

				duration = duration / this.demoSpeed;
				if (duration < ops.min) duration = ops.min;
				if (ops.max && duration > ops.max) duration = ops.max;
			}

			return duration;
		},

		// ======== DEMO BLOCK =============


		// Задать таймаут с учетом того что модель могла быть уничтожена (слайд был переключен)
		timeout : function (callback, time)
		{
			var self = this;
			return setTimeout(function () {
				if (!self.$el.is(':visible')) return;
				callback();
			}, time);
		}

	});

	/* ------------------------------- BaseLayouts  ---------------------------------------*/

	modelNS.SingleLayout = modelNS.View.extend({
		className: 'single-layout',
		initialize: function(options) {
			this.options = options || {};

			if (!options) {
				return;
			}

			modelNS.View.prototype.initialize.apply(this, arguments);

			this.cls = options.cls;
			this.parent = options.parent;
			this.hasTitleBar = typeof options.hasTitleBar != 'undefined' ? Boolean(options.hasTitleBar) : false;
			this.title = options.title;
			this.width = options.width;
			this.height = options.height;
			this.hasPadding = options.hasPadding;
			this.align = typeof options.align != 'undefined' ? options.align : 'center';
			this.border = options.border === undefined || options.border;
			this.overflow = options.overflow;

			this.verticalAlign = options.verticalAlign;
			this.hasContent = options.hasContent;	// verticalAlign work only with content
			this.columns = options.columns;
			this.selectable = options.selectable || false; // by default single layout not selectable

			this.titleWidth = options.titleWidth;
		},
		render: function() {
			modelNS.View.prototype.render.apply(this, arguments);
			if (this.hasPadding) {
				this.$el.addClass('has-padding');
			}
			if (this.hasPadding === false) {
				this.$el.addClass('no-padding');
			}
			if (this.parent) {
				this.parent.append(this.$el);
			}
			if (this.cls) {
				this.$el.addClass(this.cls);
			}
			if (this.width) {
				this.$el.width(this.width);
			}
			if (this.height) {
				this.$el.height(this.height);
			}
			if (!this.titleBar && this.hasTitleBar && this.title		// old support
				|| modelNS.restyling && this.title
			) {
				this.renderTitleBar(this.title, this.align);
			}
			if (this.hasContent || this.verticalAlign) {
				if (!this.$content) {
					this.$el.addClass('has-content')
					this.$contentWrap = $('<div class="pane-content-wrap"/>').appendTo(this.$el);
					this.$content = $('<div class="pane-content"/>').appendTo(this.$contentWrap);
					if (!this.hasContent) this.$el.addClass('nopadding');	// если не указан контент, тогда отступов нет, он используется только для valign
				}
				if (this.columns) this.$content.attr("columns", this.columns);
			} else {
				this.$content = this.$el;
			}
			if (this.options.content) {
				this.$content.append(this.options.content);
			}
			if (!this.border) {
				this.$el.addClass('no-border');
			}
			if (this.overflow) {
				this.$el.addClass('overflow-' + this.overflow);
			}
			if (this.verticalAlign) {
				this.$content.css({
					display: 'table-cell',
					width: this.$el.width(),
					height: this.$contentWrap.height(),
					verticalAlign: this.verticalAlign
				});
			}
			return this;
		},
		renderTitleBar: function(title, align) {
			if (modelNS.restyling) {
				this.$el.addClass('has-title');
			}
			if (!title) {
				if (this.titleBar) {
					this.titleBar.remove();
					this.titleBar = null;
				}
				return;
			}
			this.titleBar = $('<div class="title-bar"></div>');
			this.titleSpan = $('<span></span>');
			// this.titleSpan.append(title);
			this.titleBar.append(this.titleSpan);
			this.$el.append(this.titleBar);
			this.titleBar.css({ 'text-align': align });
			this.$head = this.titleBar;
			if (!modelNS.restyling) this.titleBarResize();	// old support
			if (title) this.setTitle(title);
		},
		setTitle: function(title, align) {
			if (!this.titleBar) {
				this.renderTitleBar(title, align);
			}
			else {
				// автоматическая всплывающая подсказка
				if (this.titleWidth) {
					this.titleSpan.width('auto');
				}

				this.titleSpan.html(title);
				this.titleBar.css({ 'text-align': align });

				// автоматическая всплывающая подсказка
				//if (this.titleSpan.width() > this.titleWidth) { //#10899
                if (this.titleSpan.width() > this.titleWidth && (this.titleSpan.width() > this.titleWidth + 150)) { // #10899 Добавлена проверка на необходимость всплывающей подсказки даже если слева освобождено место и заголовок смещен влево.
					if (this.titleSpan.tooltip( "instance" )) {
						//this.titleSpan.attr('title', title).tooltip('enable'); // #11037 Закомментил
                        this.titleSpan.tooltip('enable').attr('title', title); // #11037 Нужно сначала вызвать tooltip, чтобы подсказка корректно записалась
					} else {
						//this.titleSpan.attr('title', title).tooltip(); // #11037 Закомментил
                        this.titleSpan.tooltip().attr('title', title); // #11037 Нужно сначала вызвать tooltip, чтобы подсказка корректно записалась
					}
				} else {
					if (this.titleSpan.tooltip( "instance" )) {
						this.titleSpan.tooltip('disable');
					}
				}

				// автоматическая всплывающая подсказка
				if (this.titleWidth) {
					//this.titleSpan.width(this.titleWidth); // #10899
					// #10899 Если заголовок шире, то убираем отступ слева, чтобы было видно больше текста
                    if (this.titleSpan.width() > this.titleWidth) {// #10899
                        this.titleSpan.width(this.titleWidth + 150);// #10899
                        this.titleBar.css({'padding-left': '10px'});// #10899
                    } else {// #10899
                        this.titleSpan.width(this.titleWidth);// #10899
                        this.titleBar.css({'padding-left': '160px'});// #10899
                    }// #10899
				}
			}
		},
		titleBarResize: function() {
			this.titleBar.width(this.$el.width() - (this.hasPadding ? 8 : 0));
			this.trigger('ResizeTitleBar');
		}
	});

	modelNS.DualVerticalLayout = modelNS.View.extend({
		className: 'dual-vertical-layout',
		initialize: function(options) {
			// TODO: плохо что глобальный
			options = $.extend(options, options[window.templateSkin]);

			modelNS.View.prototype.initialize.apply(this, arguments);
			this.options = options;
			if (options.hasPadding === undefined) this.options.hasPadding = true;
		},
		render: function() {
			modelNS.View.prototype.render.apply(this, arguments);
			if (!this.options.parent) {
				return;
			}
			if (this.options.cls) {
				this.$el.addClass(this.options.cls);
			}
			this.options.parent.append(this.$el);
			this.$firstPane = $('<div class="first-pane"></div>');
			this.$secondPane = $('<div class="second-pane"></div>');
			this.$el.append(this.$firstPane);
			this.$el.append(this.$secondPane);
			if (typeof this.options.nopadding != 'undefined' && Boolean(this.options.nopadding) == true) {
				this.$firstPane.addClass('nopadding');
				this.$secondPane.addClass('nopadding');
			}
			if (this.options.firstPaneWidth && this.options.secondPaneWidth) {
				this.$firstPane.outerWidth(this.options.firstPaneWidth);
				this.$secondPane.outerWidth(this.options.secondPaneWidth);
			}
			else
			if (this.options.firstPaneWidth) {
				this.$firstPane.outerWidth(this.options.firstPaneWidth);
				this.$secondPane.outerWidth(this.$el.width() - this.$firstPane.outerWidth());
			}
			else
			if (this.options.secondPaneWidth) {
				this.$secondPane.outerWidth(this.options.secondPaneWidth);
				this.$firstPane.outerWidth(this.$el.width() - this.$secondPane.outerWidth());
			}
			if (this.options.cls) {
				this.$el.addClass(this.options.cls);
			}
			if (!this.options.hasPadding) {
				this.$el.addClass('no-padding');
			}
			return this;
		},
		resize: function(width1, height1, width2, height2) {
			if (width1 != null) {
				this.$firstPane.outerWidth(width1);
				this.$secondPane.outerWidth(this.$el.width() - this.$firstPane.outerWidth());
			}
			if (height1 != null) {
				this.$firstPane.outerHeight(height1);
			}
			if (width2 != null) {
				this.$secondPane.outerWidth(width2);
				this.$firstPane.outerWidth(this.$el.width() - this.$secondPane.outerWidth());
			}
			if (height1 != null) {
				this.$secondPane.outerHeight(height2);
			}
		}
	});

	modelNS.DualHorizontalLayout = Backbone.View.extend({
		className: 'dual-horizontal-layout',
		initialize: function(options) {
			// TODO: плохо что глобальный
			options = $.extend(options, options[window.templateSkin]);

			this.options = options;
		},
		render: function() {
			if (!this.options.parent) {
				return;
			}
			this.options.parent.append(this.$el);
			this.$topPane = $('<div class="top-pane"></div>');
			this.$bottomPane = $('<div class="bottom-pane"></div>');
			this.$el.append(this.$topPane);
			this.$el.append(this.$bottomPane);
			if (typeof this.options.nopadding != 'undefined' && Boolean(this.options.nopadding) == true) {
				this.$topPane.addClass('nopadding');
				this.$bottomPane.addClass('nopadding');
			}
			if (this.options.topPaneHeight) {
				this.$topPane.outerHeight(this.options.topPaneHeight);
				this.$bottomPane.outerHeight(this.options.parent.height() - this.$topPane.outerHeight());
			}
			if (this.options.bottomPaneHeight) {
				this.bottomPaneHeight(this.options.bottomPaneHeight);
			}
			if (this.options.cls) {
				this.$el.addClass(this.options.cls);
			}
			return this;
		},
		bottomPaneHeight: function (height)
		{
			this.$bottomPane.outerHeight(height);
			this.$topPane.outerHeight(this.options.parent.height() - this.$bottomPane.outerHeight());
		}
	});

	modelNS.MultipleColumnLayout = Backbone.View.extend({
		className: 'multiple-columns-layout',
		initialize: function(options) {
			this.options = options;
		},
		render: function() {
			if (!this.options.parent) {
				return;
			}
			this.options.parent.append(this.$el);
			this.columns = [];
			for (var i = 0; i < this.options.columns.length; i++) {
				var column = this.options.columns[i],
					columnView = $('<div class="column"></div>');
				this.columns.push(columnView);
				this.$el.append(columnView);
				columnView.width(column.width);
				columnView.height(column.height);
			}
			return this;
		},
		getColumn: function(index) {
			return this.columns[index];
		}
	});

	modelNS.Label = Backbone.View.extend({
		className: 'label',
		initialize: function(options) {
			this.text = options.text;
			this.width = options.width;
			this.height = options.height;
		},
		render: function() {
			this.$el.css({
				'width': (this.width ? this.width + 'px' : '100%'),
				'height': (this.height ? this.height + 'px' : '100%'),
				'line-height': (this.height ? this.height + 'px' : '100%')
			});
			this.$el.append(this.text);
			return this;
		}
	});


	/* ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||*/
	/* ------------------------------------------ Player Controls --------------------------------------*/

	modelNS.PlayerControls = Backbone.View.extend({
		className: 'player-controls',
		tagName: 'ul',

		events: {
			'click .play:not(.disable)': 'onPlay',
			'click .pause:not(.disable)': 'onPause',
			'click .next:not(.disable)': 'onNext',
			'click .prev:not(.disable)': 'onPrev',
			'click .film:not(.disable)': 'onFilm',
			'click .stop:not(.disable)': 'onStop',
		},

		initialize: function(options) {
			this.parent = options.parent;
			this.options = options;

			this.on("Play", this.play);
			this.on("Pause", this.pause);
			this.on("Stop", this.stop);
			this.on("Film", this.film);
			this.on("Next", this.next);
			this.on("Prev", this.prev);
		},
		render: function() {

			this.$prev = $('<li data-id="Prev" class="prev" title="'+modelNS.lang('prev')+'"></li>').appendTo(this.$el);
			this.$play = $('<li data-id="Play" class="play" title="'+modelNS.lang('play')+'"></li>').appendTo(this.$el);
			this.$pause = $('<li data-id="Pause" style="display:none" class="pause" title="'+modelNS.lang('pause')+'"></li>').appendTo(this.$el);
			this.$stop = $('<li data-id="Stop" class="stop" title="'+modelNS.lang('stop')+'"></li>').appendTo(this.$el);
			this.$film = $('<li data-id="Film" style="display:none" class="film" title="'+modelNS.lang('film')+'"></li>').appendTo(this.$el);
			this.$next = $('<li data-id="Next" class="next" title="'+modelNS.lang('next')+'"></li>').appendTo(this.$el);

			this.$el.appendTo(this.parent);

			if (this.options.film) this.$film.show();

			return this;
		},

		onPause: function () { this.trigger('Pause') },
		onPlay: function () {	this.trigger('Play') },
		onNext: function () { this.trigger('Next') },
		onStop: function () { this.trigger('Stop') },
		onPrev: function () { this.trigger('Prev') },
		onFilm: function () {	this.trigger('Film') },

		/**
		 * Перемотать в начало
		 */
		prev: function () {
			this.showPlay();
			this.deactivateFilm();
		},

		/**
		 * Перемотать в конец
		 */
		next: function () {
			this.showPlay();
			this.deactivateFilm();
		},

		/**
		 * Начать проигрывание
		 */
		play: function () {	this.showPause() },

		/**
		 * Поставить паузу
		 */
		pause: function () { this.showPlay() },

		/**
		 * Остановить проигрывание
		 */
		stop: function () {
			this.showPlay();
			this.deactivateFilm();
		},

		/**
		 * Переключение режима фильма
		 */
		film: function () { this.toggleFilm() },

		isPaused: function () {
			return this.$play.is(':visible');
		},

		isFilm: function () {
			return this.$film.hasClass('active');
		},

		showPlay: function () {
			this.$pause.hide();
			this.$play.show();
		},

		showPause: function () {
			this.$pause.show();
			this.$play.hide();
		},

		toggleFilm: function () {
			this.isFilm() ? this.deactivateFilm() : this.activateFilm();
		},

		activateFilm: function () {
			this.$film.addClass('active')
		},

		deactivateFilm: function () {
			this.$film.removeClass('active');
		},

		start: function () {
			this.showPlay();
			this.$play.removeClass('disable');
			this.$next.removeClass('disable');
		},

		end: function () {
			this.showPlay();
			this.$play.addClass('disable');
			this.$next.addClass('disable');
		},

	});


	/* ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||*/
	/* ------------------------------------------ Popup --------------------------------------*/

	modelNS.Popup = Backbone.Model.extend({
		initialize: function(options) {
			this.id = options.id;
			this.className = options.className;
			this.width = options.width;
			this.height = options.height;
			this.content = options.content;
			this.hasBackground = options.hasBackground != undefined ? options.hasBackground : true;
			this.top = options.top || null;
			this.right = options.right || null;
			this.left = options.left || null;
			this.position = options.position;
			this.hasTitle = options.hasTitle; // !== undefined ? options.hasTitle : false;
			this.title = options.title || null;
			this.closableOnOverlayClick = options.closableOnOverlayClick != undefined ? options.closableOnOverlayClick : false;
			this.autoWidth = options.autoWidth != undefined ? options.autoWidth : false;
			this.maxWidth = options.maxWidth;
			this.maxHeight = options.maxHeight;
			this.buttons = options.buttons || [];
			this.color = options.color;
			this.onClose = options.onClose;
		}
	});
	modelNS.PopupCollection = Backbone.Collection.extend({
		model: modelNS.Popup
	});

	modelNS.PopupView = Backbone.View.extend({
		className: 'model-popup-wrapper',
		events: {
			'click .closeBtn': 'closePopupOnCloseBtn'
		},
		initialize: function(options) {
			this.model = options.model;
			this.keys = { 37: 1, 38: 1, 39: 1, 40: 1 };
			this.popup = $('<div class="model-popup"></div>');
		},
		render: function() {
			this.disableScroll();
			this.popupInit();
			this.$el.parent();
			return this;
		},
		preventDefault: function(e) {
			e = e || window.event;
			if (e.preventDefault)
				e.preventDefault();
			var target = e.target;
			var content = target.className.indexOf('ui-widget-content') != -1 ? $(target) :
				$(target).parents('.ui-widget-content').length != 0 ? $($(target).parents('.ui-widget-content').get(0)) : null;
			if (content != null) {
				content.get(0).scrollTop = content.get(0).scrollTop - e.wheelDelta;
			}
			e.returnValue = false;
		},
		preventDefaultForScrollKeys: function(e) {
			if (this.keys && this.keys[e.keyCode]) {
				this.preventDefault(e);
				return false;
			}
		},
		disableScroll: function() {
			if (window.addEventListener) // older FF
				window.addEventListener('DOMMouseScroll', this.preventDefault, false);
			window.onwheel = this.preventDefault; // modern standard
			window.onmousewheel = document.onmousewheel = this.preventDefault; // older browsers, IE
			window.ontouchmove = this.preventDefault; // mobile
			document.onkeydown = this.preventDefaultForScrollKeys;
			this.el.onwheel = null;
		},
		enableScroll: function() {
			if (window.removeEventListener)
				window.removeEventListener('DOMMouseScroll', this.preventDefault, false);
			window.onmousewheel = document.onmousewheel = null;
			window.onwheel = null;
			window.ontouchmove = null;
			document.onkeydown = null;
		},
		popupInit: function() {
			var $this = this;

			this.popup.append(this.model.content);
			this.$el.attr("popup", this.model.id);

			// #8575	после загурзки  размеров видео попап снова центрируем
			this.popup.find('video').on("loadedmetadata", function() { // loadedmetadata, loadeddata, canplay
				if ($this.dialogInitialized) {
					$this.popup.dialog({ position: { my: 'center', at: 'center', of: window } });
				}
			});

			setTimeout(function() {

				// #8422
				$(document.body).append($this.$el);
				$this.popup.dialog({
					dialogClass: 'model-popup ' + ($this.model.className || ''),
					position: $this.model.position ? $this.model.position : $this.$el.height() < $(window).height() ? {
						my: ($this.model.top || '' ? "top" : "center"),
						at: ($this.model.top || '' ? 'bottom-' + $this.model.top : "center"),
						of: $this.$el.get(0)
					} : { my: "center", at: "center", of: window },
					appendTo: $this.$el,
					modal: $this.model.hasBackground,
					resizable: false,
					draggable: false,
					title: $this.model.hasTitle ? $this.model.title : '',
					close: function() {
						$this.closePopupOnCloseBtn();
					},
					width: $this.model.autoWidth ? 'auto' : $this.model.width || '' ? parseInt($this.model.width) + 8 : $this.$el.width() * 0.9,
					minWidth: 200,
					maxWidth: $this.$el.width() * 0.9,
					height: $this.model.height || 'auto',
					maxHeight: $this.$el.height() < $(window).height() ?
						$this.$el.height() * 0.92 : $(window).height() * 0.92,
					minHeight: 0
				});

				// fix show title
				if ($this.model.hasTitle) {
					$this.$el.find('.ui-dialog-title').show();
				}
				else {
					$this.$el.find('.ui-dialog-titlebar').css('height','0px');

				}
				//	alert();
				// #8164
				// if ($(".model-wrp").length) $(".model-wrp").append($('.ui-widget-overlay'));
				$('.model-popup-wrapper').parent().addClass('model-popup-wrapper-parent');
				// $(document.body).append($('.ui-widget-overlay'));
				$(document.body).addClass('popup-opened');

				if ($this.model.maxWidth) $('.ui-dialog').css('max-width', $this.model.maxWidth);
				if ($this.model.maxHeight) $('.ui-dialog').css('max-height', $this.model.maxHeight);

				$this.$el.find('.ui-dialog-content').mCustomScrollbar({
					theme: "3d-thick-dark"
				});
				if ($this.$el.find('.mCSB_scrollTools_vertical').is(':visible')) {
					$this.popup.dialog('option', 'width', $this.popup.width() + 22);
					$this.popup.find('.mCSB_container').css({ 'margin-right': '22px' });
				}
				else {
					$this.popup.find('.mCSB_container').css({ 'margin-right': '0px' });
				}
				if ($this.model.get('buttons')) {
					$this.popup.dialog('option', 'buttons', $this.model.get('buttons'));
				}
				if ($this.model.closableOnOverlayClick) {
					$this.$el.find(".ui-widget-overlay").click(function() {
						$this.closePopup();
					});
				}

				$this.dialogInitialized = true;

				$this.trigger('PopupShowed');
				PlayerCourse.updateMathJax();
				$this.popup.attr('tabindex', -1).focus();
			}, 300);
		},
		closePopupOnCloseBtn: function() {
			this.trigger('PopupClosedOnCloseBtn');
			// if (this.model.onClose) this.model.onClose();	// 2 раза срабатывание .onClose при щелчке по кнопке закрыть ВО
			this.closePopup(true);
		},
		closePopup: function(closedOnCloseBtn) {
			if (this.model.onClose) this.model.onClose();	// TODO: make as trigger
			if (!closedOnCloseBtn) {
				this.trigger('PopupClosed');
			}
			try {
				this.popup.dialog('destroy');
			}
			catch (e) {}
			this.remove();
			this.unbind();
			this.enableScroll();

			$(document.body).removeClass('popup-opened');
		}
	});

	/* ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||*/
	/* ----------------------------- SingleImage and ImageCollection -------------------------*/

	modelNS.SVGElement = Backbone.Model.extend({
		initialize: function(options) {
			this.svgregion = options.svgregion;
			this.link = options.link;
		}
	});

	modelNS.SVGElementCollection = Backbone.Collection.extend({
		model: modelNS.SVGElement
	});

	modelNS.SingleImage = Backbone.Model.extend({
		initialize: function(options) {
			this.options = options;
			this.customSizes = options.customSizes;
			this.id = options.id;
			this.url = options.url;
			this.preview = options.preview;
			this.title = options.title;
			this.popup = options.popup;
			this.width = options.width;
			this.height = options.height;
			this.hasTitleBar = typeof options.hasTitleBar !== "undefined" ? Boolean(options.hasTitleBar) : false;
			this.hasPadding = typeof options.hasPadding !== "undefined" ? Boolean(options.hasPadding) : true;
			this.elements = options.elements;
			this.zoomEnabled = typeof options.zoomEnabled !== "undefined" ? Boolean(options.zoomEnabled) : false;
			this.set({ 'currentZoom': typeof options.currentZoom !== "undefined" ? options.currentZoom : 1 });
			this.maxZoom = options.maxZoom || 2;
			this.zoomStep = options.zoomStep || 1;
			this.zoomControl = typeof options.zoomControl !== "undefined" ? Boolean(options.zoomControl) : false;
			this.draggable = typeof options.draggable !== "undefined" ? Boolean(options.draggable) : false;
			this.cls = options.cls;
			this.copyright = options.copyright;

			// доступный зум определяется автоматически
			this.zoomAvailableAuto = options.zoomAvailableAuto;
		}
	});

	modelNS.ImageCollection = Backbone.Collection.extend({
		model: modelNS.SingleImage
	});

	modelNS.SingleImageView = Backbone.View.extend({
		className: 'single-image',
		events: {
			'click': 'onClick',
			'click img': 'onImageClick',
			'click svg': 'onImageClick',
			'click .title-exit-arrow': 'onExitClick',
			'click .title-comment': 'onTitleClick',
			'click .image-copyright a': 'onCopyClick',
		},
		initialize: function(options) {
			this.model = options.model;
			this.zoomMatrix = [];
			this.listenTo(this.model, 'change:currentZoom', this.zoomImage);
			this.listenTo(this.model, 'change:url', this.loadImage);
			this.cls = options.cls;
			this.skipPreview = options.skipPreview ? Boolean(options.skipPreview) == true : false;
		},
		render: function() {
			var $this = this;
			if (this.cls) this.$el.addClass(this.cls);
			if (this.model.cls) this.$el.addClass(this.model.cls);
			this.$el.height(this.model.height);
			this.$el.width(this.model.width);
			this.$el.attr("image", this.model.id);
			if (!this.model.zoomAvailableAuto) {
				this.calcZoomMatrix();
			}
			this.loadImage();
			return this;
		},
		loadImage: function() {
			this.clear();
			var $this = this;
			if (!this.model.hasPadding) {
				this.$el.addClass('no-padding');
			}
			if (this.model.url.indexOf('.svg') == -1) {
				var src = this.skipPreview == false ? (this.model.get('preview') || this.model.get('url')) : this.model.get('url');
				this.img = $('<img src="' + src + '"/>');
				this.img.addClass('hidden-element');
				if (this.model.draggable) {
					this.imageWrapper = $('<div class="imageWrapper"></div>');
					this.imageWrapper.width(this.$el.width());
					this.imageWrapper.height(this.$el.height());
					this.imageWrapper.append(this.img);
					this.$el.append(this.imageWrapper);
				}
				else {
					this.$el.append(this.img);
				}
				this.img.on('load', function(e) {
					$this.onImageLoaded($this);
				});
				this.img.on('error', function(e) {
					$this.onImageError($this, src);
				});
			}
			else {
				this.loadSVG();
			}
		},
		loadSVG: function() {
			var $this = this,
				url = this.model.url,
				script = document.createElement('script');
				this.svgID = url.substring(url.lastIndexOf('/') + 1, url.lastIndexOf('.')),
				script.type = 'text/javascript';
				script.id = 'svgimage_' + this.svgID;
				script.src = url.replace('.svg', '.js');

			// загрузка через setInterval переделана в onlaod, т.к. нет необходимости поддерживать ie9
			script.onload = function() {
				$this.onImageLoaded($this);
                // #11634 Пока закомментировал эту строку, потому что данный скрипт удаляется из документа еще в
                // функции $this.onImageLoaded($this) и здесь появляется ошибка.
				//script.parentNode.removeChild(script);
			};

			// ошибка изображения
			script.onerror = function () {
				alert(RES.errorContentFile + '..' + url.slice(-90));
				script.parentNode.removeChild(script);
			}

			var firstScript = document.getElementsByTagName('script')[0];
			firstScript.parentNode.insertBefore(script, firstScript);
		},
		resize: function(width, height) {
			if (width || '') {
				this.$el.width(width);
			}
			else {
				this.$el.width(this.$el.parent().width());
			}
			if (height || '') {
				this.height(height);
			}
			if (this.model.hasTitleBar) {
				this.titleBarResize();
			}
			if (this.model.draggable) {
				this.defineDraggableArea();
			}
		},
		titleBarResize: function() {
			this.titleBar.width(this.$el.width() - (this.model.hasPadding == 'true' ? 8 : 0));
		},
		onImageError: function($this, src) {
			this.clear();
			this.$el.append('<div class="image-not-found"><div>Изображение не найдено</div></div>');
			this.trigger('ImageError', this.model);
			alert(RES.errorContentFile + src);
		},
		onImageLoaded: function(view) {
			var $model = this;
			if (!this.titleBar && this.model.hasTitleBar && this.model.title) {
				this.titleBar = $('<div class="title-bar"></div>');
				this.titleBar.html('<span class="title-exit-arrow"></span><span class="title-text">' + this.model.title + '</span><span class="title-comment"></span>');
				this.$el.append(this.titleBar);
				this.titleBarResize();
			}
			if (this.model.copyright) {
				this.$el.append('<i class="image-copyright"><a></a></i>');
			}
			if (this.model.url.indexOf('.svg') != -1) {
				var svgImage = svgData[this.svgID];
				svgImage = svgImage.replace(/_x5F_/g, '_');
				this.imageWrapper = $('<div class="imageWrapper"></div>');
				this.$el.append(this.imageWrapper);

                var svgElement = $($('<div>' + svgImage + '</div>').find('svg')[0]); // #11636 Получаем чистый элемент svg
                this.imageWrapper.append(svgElement); // #11636 Вставляем его в блок

				//this.imageWrapper.append(svgImage); // #11636 Закомментил
				//var svgElement = $($('<div>' + svgImage + '</div>').find('svg')[0]); // #11636 Закомментил
				try {
					this.svgSettings = { width: svgElement.attr('width').replace('px', ''), height: svgElement.attr('height').replace('px', ''), viewBox: svgElement.get(0).viewBox };
					this.imageWrapper.width(svgElement.attr('width').replace('px', ''));
					this.imageWrapper.height(svgElement.attr('height').replace('px', ''));
				}
				catch (e) {}
				svgData[this.svgID] = null;
				$(document).find('script[id="svgimage_' + this.svgID + '"]').remove();
				this.model.get('elements').each(this.bindElement, $model);
				this.imageWrapper.find('svg text').each(function() {
					if ($(this).attr('font-family') == '\'TrebuchetMS\'') {
						$(this).attr('font-family', 'Trebuchet MS');
					}
					if ($(this).attr('font-family') == '\'TrebuchetMS-Italic\'') {
						$(this).attr('font-family', 'Trebuchet MS');
						$(this).attr('font-style', 'italic');
					}
				});
			}
			if (this.model.zoomEnabled) {
				var index = this.getZoomIndex(this.model.get('currentZoom'));
				this.zoomImage(index != -1 ? index : 1);
				this.listenTo(this.zoomSlider, 'Change', this.onZoomChange);
			}
			if (this.model.zoomControl && !this.zoomSlider) {
				if (this.model.zoomAvailableAuto) {
					this.calcZoomMatrix();
				}
				this.sliderModel = new modelNS.SliderModel({
					parent: this.$el,
					min: 1,
					step: this.model.zoomStep,
					max: this.model.maxZoom,
					dates: [],
					value: this.getZoomIndex(this.model.get('currentZoom'))
				});
				this.zoomSlider = new modelNS.VerticalSliderView({ model: this.sliderModel });
				this.zoomSlider.render();
				this.listenTo(this.zoomSlider, 'Slide', this.onZoomSliderChange);
			}
			if (this.model.draggable) {
				if (this.model.url.indexOf('.svg') == -1) {
					this.img.addClass('draggable');
				}
				this.defineDraggableArea();
			}
			if (this.img) {
				this.img.css({ 'left': 0, 'top': 0 });
				this.img.removeClass('hidden-element');
			}
			view.trigger('ImageLoaded', this.model, view);
		},
		onZoomSliderChange: function(ui) {
			this.model.set('currentZoom', ui.value);
		},
		defineDraggableArea: function() {
			var _this = this;
			setTimeout(function() {
				var element = _this.imageWrapper;
				if (!element) {
					return;
				}
						// elWidth = _this.imageWrapper.width(),
						// elHeight = _this.imageWrapper.height(),
						// offset = _this.$el.offset(),
						// offsetLeft = offset.left,
						// offsetTop = offset.top,

				var minTop = -_this.imageWrapper.height() + _this.$el.height(),
						minLeft = -_this.imageWrapper.width() + _this.$el.width(),
						maxTop = 0,
						maxLeft = 0;

						// minLeft = CourseConfig.zoomScale;

				element.draggable({
					// containment: [offsetLeft - elWidth + _this.$el.width() + 2,
					// 	offsetTop - elHeight + _this.$el.height() + 2,
					// 	offsetLeft,
					// 	offsetTop
					// ],
					zoomfix: false,

					drag: function(event, ui) {
						// console.log(ui.position, minLeft, ui.position.left * CourseConfig.zoomScale)
						if (ui.position.left < minLeft) {
								ui.position.left = minLeft;
						}

						if (ui.position.left > maxLeft) {
							ui.position.left = maxLeft;
						}

						if (ui.position.top < minTop) {
								ui.position.top = minTop;
						}

						if (ui.position.top > maxTop) {
							ui.position.top = maxTop;
						}

						_this.trigger('Drag', ui.position);
					},
					stop: function(e, ui) {
						setTimeout(function() {
							_this.trigger('DragStop', e, ui);
						}, 200);
					},
					start: function(e, ui) {
						_this.trigger('DragStart', e, ui);
					}
				});
			}, 400);

		},
		getZoomIndex: function(zoom) {
			try {
				zoom = zoom.replace(',', '.');
			}
			catch (e) {}
			for (var i = 0; i < this.scales; i++) {
				if (zoom == this.zoomMatrix[i]) {
					return i + 1;
				}
			}
			return -1;
		},
		calcZoomMatrix: function () {
			this.maxZoom = this.model.maxZoom;

			if (this.model.zoomAvailableAuto) {
				var naturalWidth = this.img.get(0).naturalWidth,
					naturalHeight = this.img.get(0).naturalHeight,
					scaleWidthK = this.$el.width()/naturalWidth,
					scaleHeightK = this.$el.height()/naturalHeight,
					scaleKmin = Math.max(scaleWidthK, scaleHeightK);

					this.maxZoom = Math.min(Math.floor(1/scaleKmin*2)/2, 3); // округляем до .5 в меньшую сторону

					if (this.maxZoom == 1) {
						this.model.zoomEnabled = false;
						this.maxZoom = 3;
					}
			}
			if (this.model.zoomEnabled) {
				this.scales = (this.maxZoom - 1) / this.model.zoomStep + 1;
				this.zoomMatrix.push(1);
				for (var i = 1; i < this.scales; i++) {
					this.zoomMatrix.push(1 + i * this.model.zoomStep);
				}
			}
		},
		zoomImage: function(zoomIndex) {
			if (this.img) {
				// fix #10700 Размер изображения не соответствует модели, оно не таскаемое
				// var naturalWidth = this.img.get(0).naturalWidth,
				// 	naturalHeight = this.img.get(0).naturalHeight,
				// 	scaledWidth = Math.floor(naturalWidth / this.zoomMatrix[this.scales - 1] * this.zoomMatrix[zoomIndex - 1]),
				// 	scaledHeight = Math.floor(naturalHeight / this.zoomMatrix[this.scales - 1] * this.zoomMatrix[zoomIndex - 1]);
				// if (scaledWidth < this.$el.width()) {
				// 	var scale = this.$el.width() / scaledWidth;
				// 	scaledWidth = this.$el.width();
				// 	scaledHeight = scaledHeight * scale;
				// }
				// else
				// if (scaledHeight < this.$el.height()) {
				// 	var scale = this.$el.height() / scaledHeight;
				// 	scaledHeight = this.$el.height();
				// 	scaledWidth = scaledWidth * scale;
				// }

				// #10700 Размер изображения не соответствует модели, оно не таскаемое
				var naturalWidth = this.img.get(0).naturalWidth,
					naturalHeight = this.img.get(0).naturalHeight,
					scaleWidthK = this.$el.width()/naturalWidth,
					scaleHeightK = this.$el.height()/naturalHeight,
					scaleKmin = Math.max(scaleWidthK, scaleHeightK),
					countSteps = ((this.maxZoom||3)-1)/0.5,
					scaleK = (1-scaleKmin) / countSteps * (zoomIndex-1) + scaleKmin, // 1 - натуральные размеры, делим на количество шагов
					scaledWidth = naturalWidth * scaleK,
					scaledHeight = naturalHeight * scaleK;

				this.scaleK = scaleK;
				this.imageWrapper.width(scaledWidth);
				this.imageWrapper.height(scaledHeight);
				this.img.width(scaledWidth);
				this.img.height(scaledHeight);
				this.defineDraggableArea();
			}
			else {
				var zoom = this.zoomMatrix[this.model.get('currentZoom') - 1] || 1,
					$this = this;
				if (!this.svgSettings) {
					return;
				}
				this.$el.find('svg').each(function() {
					$(this).attr({
						'width': $this.svgSettings.width * zoom,
						'height': $this.svgSettings.height * zoom
					});

				});
				this.imageWrapper.width($this.svgSettings.width * zoom);
				this.imageWrapper.height($this.svgSettings.height * zoom);
				this.defineDraggableArea();
			}
			if (this.imageWrapper.css('left').replace('px', '') < this.$el.width() - this.imageWrapper.width()) {
				this.imageWrapper.css('left', (this.$el.width() - this.imageWrapper.width()) + 'px');
			}
			if (this.imageWrapper.css('top').replace('px', '') < this.$el.height() - this.imageWrapper.height()) {
				this.imageWrapper.css('top', (this.$el.height() - this.imageWrapper.height()) + 'px');
			}
		},
		bindElement: function(element) {
			var $model = this;
			this.$el.find('#' + element.svgregion).first().attr('class', 'pointer-events-enabled');
			this.$el.find('#' + element.svgregion).first().click(function() {
				$model.onElementClick(element);
			});
		},
		getImage: function() {
			if (this.img) {
				return this.img;
			}
			return $(this.$el.find('svg').get(0));
		},
		getImageWrapper: function() {
			if (this.imageWrapper) {
				return this.imageWrapper;
			}
			return null;
		},
		clear: function() {
			this.$el.find('.image-not-found').remove();
			if (this.imageWrapper) {
				this.imageWrapper.remove();
			}
			this.$el.find('svg').remove();
			this.$el.find('img').remove();
		},
		onElementClick: function(element) {
			this.trigger('ElementClick', element);
		},
		onClick: function(e) {
			var model = this.model.clone();
			this.trigger('ItemClick', model, e);
		},
		onImageClick: function(e) {
			var model = this.model.clone();
			this.trigger('ImageClick', model, e);
		},
		onExitClick: function(e) {
			var model = this.model.clone();
			this.trigger('ExitClick', model, e);
		},
		onTitleClick: function() {
			this.trigger('ImageTitleClick', this.model);
		},
		onCopyClick: function ()
		{
			$('<div/>').html(this.model.copyright).popup({height:'auto'});
			this.trigger('ImageCopyClick', this.model);
		}
	});

	/* ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||*/
	/* ----------------------------- Button ------------------------------------------*/
	modelNS.Button = Backbone.View.extend({
		className: 'model-button',
		events: {
			'click': 'onClick'
		},
		initialize: function(options) {
			this.options = options;
			this.$parent = $(options.parent);
		},
		render: function() {
			this.setTitle(this.options.title || '');
			if (this.options.width) {
				this.$el.width(this.options.width);
			}
			if (this.options.height) {
				this.$el.height(this.options.height);
			}
			if (this.options.cls) {
				this.$el.addClass(this.options.cls);
			}
			if (this.options.tooltip) {
				this.$el.attr('title', this.options.tooltip);
			}
			if (this.options.active != undefined && Boolean(this.options.active) == true) {
				this.$el.addClass('active');
			}
			if (this.options.disabled != undefined && Boolean(this.options.disabled) == true) {
				this.$el.addClass('disabled');
			}
			if (this.$parent) {
				this.$parent.append(this.$el);
			}
			return this;
		},
		setTitle: function (title)
		{
			this.$el.html(title);
		},
		onClick: function() {
			if (this.$el.hasClass('disabled')) {
				return;
			}
			this.trigger('ButtonClicked', this);
		},
		disable: function() {
			this.$el.addClass('disabled');
		},
		enable: function() {
			this.$el.removeClass('disabled');
		},
		setActive: function(isActive) {
			if (isActive) {
				this.$el.addClass('active');
			}
			else {
				this.$el.removeClass('active');
			}
		}
	});


	/* ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||*/
	/* ----------------------------- Gallery images ------------------------------------------
	 * To initialize gallery, create new object GalleryView and pass json-object, containing
	 * following parameters:
	 *    multipleRows: boolean -> shows if galery has multiple rows. False for single row;
	 *    imagesInRow: int -> count of images in one row, if parameter multipleRows is true;
	 *    parent: jQuery object -> define element to render, can't be false; */

	modelNS.GalleryView = Backbone.View.extend({
		className: 'gallery-view',
		initialize: function(options) {
			this.options = options;
			if (!this.options || !this.options.parent || !this.options.pictures) {
				return;
			}
			this.firstRender = true;
			this.items = [];
			this.$el.addClass('hidden-element');
			this.options.imagesInRow = this.options.imagesInRow || 4;
			this.galleryCollection = new modelNS.ImageCollection();
			this.loadedImages = 0;
			for (var i = 0; i < this.options.pictures.length; i++) {
				var item = new modelNS.SingleImage(this.options.pictures[i]);
				this.galleryCollection.add(item);
			}
			this.listenTo(this, 'AllImagesLoaded', this.allImagesLoaded);
			this.listenTo(this, 'ViewRendered', this.viewRendered);
		},
		render: function() {
			if (!this.options || !this.options.parent || !this.options.pictures) {
				return;
			}
			if (this.options.cls) {
				this.$el.addClass(this.options.cls);
			}
			if (this.firstRender) {
				this.options.parent.append(this.el);
				this.firstRender = false;
			}
			if (this.options.width) {
				this.$el.width(this.options.width);
			}
			if (this.options.scalableWidth == undefined) {
				this.options.scalableWidth = true;
			}
			this.$el.html('');
			this.loadedImages = 0;
			this.calculateImages(this.options.imagesInRow);
			this.galleryCollection.each(this.addItem, this);
			return this;
		},
		calculateImages: function(imagesInRow) {
			var inRow = imagesInRow == 'auto' ? 2 : imagesInRow;
			this.currentImagesInRow = this.currentImagesInRow || 1;
			if (this.options.multipleLines) {
				this.rowsCount = this.galleryCollection.length % inRow == 0 ?
					this.galleryCollection.length / inRow :
					Math.floor(this.galleryCollection.length / inRow) + 1;
				this.itemHeight = this.$el.height() / this.rowsCount;
			}
			else {
				this.rowsCount = 1;
				this.itemHeight = this.$el.height();
			}
		},
		calculateRows: function() {
			var $this = this,
				maxWidth = 0,
				rowsHeight = 0;
			this.$el.find('.row').each(function(i) {
				var width = 0;
				$(this).find('.single-image').each(function() {
					width += $(this).outerWidth(true); // true - include margins
				});
				if (width > maxWidth) {
					maxWidth = width;
				}
				var inRow = $this.options.imagesInRow == 'auto' ? $this.currentImagesInRow : $this.options.imagesInRow;
				if (inRow != 1) {
					if ($this.options.scalableWidth == true) {

						var scale = $this.$el.width() / width;
						if (width > $this.$el.width() || $(this).outerHeight() * scale - 2 < $this.$el.height() / 2) {
							$(this).find('.single-image').each(function(i) {
								//$(this).outerWidth($(this).outerWidth(true) * scale - 2);
								//$(this).outerHeight($(this).outerHeight(true) * scale - 2);
                                $(this).outerWidth($(this).outerWidth() * scale - 2); // #11360 Не считаем margin
                                $(this).outerHeight($(this).outerHeight() * scale - 2); // #11360 Не считаем margin
							});
							width = 0;
							$(this).find('.single-image').each(function() {
								//width += $(this).outerWidth(true);
                                width += $(this).outerWidth();// #11360 Не считаем margin
							});
						}
					}
				}
				else {
					if (width > $this.$el.width()) {
						$this.$el.addClass('scroll-x');
					}
				}
				width = $(this).width();

				var margin = !$this.options.align ? ($this.$el.width() - width) / 2 :
					$this.options.align == 'right' || 'left' ? $this.$el.width() - width :
					0;
				if (margin - 1 > 0) {
					$(this).css({
						'margin': $this.options.align == 'right' ? ('0 0 0 ' + (margin - 2) + 'px') :
							($this.options.align == 'left' ? ('0 ' + (margin - 2) + 'px' + ' 0 0') :
								'0 ' + (margin / 2 - 1) + 'px')
					});
				}
				rowsHeight += $(this).height();
			});
			var padding = !this.options.verticalAlign ? (this.$el.height() - rowsHeight) / 2 :
				this.options.verticalAlign && this.options.verticalAlign == 'bottom' ? this.$el.height() - rowsHeight : 0;

			if (padding > 0) {
				this.$el.css('padding', !this.options.verticalAlign ? padding + 'px 0' : padding + 'px 0 0 0');
			}
			if (this.options.imagesInRow == 'auto') {
				if (maxWidth / this.$el.width() < 0.5 || rowsHeight > this.$el.height()) {
					this.currentImagesInRow += 1;
					this.render();
				}
				else {
					this.trigger('ViewRendered');
				}
			}
			else {
				this.trigger('ViewRendered');
			}
		},
		getItems: function() {
			return this.items;
		},
		addItem: function(model, i) {

			model.height = this.options.customSizes ? this.options.pictures[i].height : this.itemHeight;
			model.width = this.options.customSizes ? this.options.pictures[i].width : 'auto'; //this.itemHeight;

			var itemView = new modelNS.SingleImageView({ model: model });
			this.listenTo(itemView, 'ImageLoaded', this.imageLoaded);
			this.listenTo(itemView, 'ItemClick', this.itemOnClick);
			var inRow = this.options.imagesInRow == 'auto' ? this.currentImagesInRow : this.options.imagesInRow;
			if ((this.rowsCount != 1 && i % inRow == 0) ||
				(this.rowsCount == 1 && i == 0)) {
				this.$currentRow = $('<div class="row"></div>');
				this.$el.append(this.$currentRow);
			}
			this.$currentRow.append(itemView.render().el);
			this.items.push(itemView);
		},
		imageLoaded: function() {
			this.loadedImages += 1;
			if (this.loadedImages == this.galleryCollection.length) {
				this.trigger('AllImagesLoaded');
			}
		},
		allImagesLoaded: function() {
			this.calculateRows();
			this.trigger('GalleryRendered');
		},
		itemOnClick: function(model) {
			this.trigger('GaleryViewItemClicked', model);
		},
		viewRendered: function() {
			this.$el.removeClass('hidden-element');
		}
	});
	/* ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||*/
	/* ------------------------------- Horizontal slider --------------------------------------*/

	modelNS.LabelModel = Backbone.Model.extend({
		initialize: function(options) {
			this.set({
				align: typeof options.align != 'undefined' ? options.align : 'right',
				valign: typeof options.valign != 'undefined' ? options.valign : 'bottom',
				value: courseML.getHTMLFromCourseML('<page>' + options.value + '</page>')
			});
		}
	});

	modelNS.LabelCollection = Backbone.Collection.extend({
		model: modelNS.LabelModel
	});

	modelNS.MarkModel = Backbone.Model.extend({
		initialize: function(options) {
			this.set({
				id: options.id,
				current: typeof options.current != 'undefined' ? Boolean(options.current) : false,
				value: typeof options.value != 'undefined' ? courseML.getHTMLFromCourseML('<page>' + options.value + '</page>') : '',
				labels: options.labels
			});
		}
	});
	modelNS.MarkCollection = Backbone.Collection.extend({
		model: modelNS.MarkModel
	});

	modelNS.SliderModel = Backbone.Model.extend({
		initialize: function(options) {
			this.orientation = options.orientation || 'bottom';
			this.parent = options.parent;
			this.min = typeof options.min != 'undefined' ? parseFloat(options.min) : 1;
			this.max = typeof options.max != 'undefined' ? parseFloat(options.max) : 2;
			this.dates = options.dates;
			this.set({ 'range': options.range || 1 });
			this.value = typeof options.value != 'undefined' ? parseFloat(options.value) : 1;
			this.axisLabels = typeof options.axisLabels != 'undefined' ? options.axisLabels : new modelNS.LabelCollection();
			this.marks = typeof options.marks != 'undefined' ? options.marks : new modelNS.MarkCollection();

			// видно может быть больше, но это будет максимальное для выбора
			this.maxPosible = options.maxPosible;
		}
	});

	// HorizontalSliderHandler является надстройкой над HorizontalSlider.
	// Используется для разметки iScale и управляет данными в соответствующем формате. Но в конечном итоге,
	// для рендеринга используется HorizontalSlider
	// В модели iMap была необходимость управлять положением рисок и их подписей над/под слайдером с помощью
	// атрибута valign. Такая возможность есть у HorizontalSliderHandler, но разметка модели iMap не такая, как
	// у iScale, поэтому при передаче данных потребовалось привести их к нужному формату.
	modelNS.HorizontalSliderHandler = Backbone.View.extend({
		className: 'slider-handler',
		initialize: function(options) {
			this.model = options.model;
		},
		render: function() {
			var _this = this;
			this.model.get('parent').append(this.$el);
			if (this.model.get('axisLabels')) { // #11635 Обернул в условие
                this.hasLeftLabels = this.model.get('axisLabels').where({ align: 'left' }).length != 0;
                this.hasRightLabels = this.model.get('axisLabels').where({ align: 'right' }).length != 0;
			}
			var columns = [];
			if (this.hasLeftLabels) {
				columns.push({ width: 40, height: 68 });
			}
			columns.push({
				width: this.$el.width() -
					(this.hasLeftLabels && this.hasRightLabels ? 80 :
						this.hasLeftLabels || this.hasRightLabels ? 40 : 0)
			});
			if (this.hasRightLabels) {
				columns.push({ width: 40, height: 68 });
			}
			this.sliderWrapper = new modelNS.MultipleColumnLayout({
				parent: this.$el,
				columns: columns
			});
			this.sliderWrapper.render();
			var sliderModel = this.model,
				sliderParent = this.sliderWrapper.getColumn(this.hasLeftLabels ? 1 : 0);
			sliderModel.set({ parent: sliderParent });
			this.sliderView = new modelNS.HorizontalSlider({ model: sliderModel });
			this.sliderView.renderScaleOrigin = this.sliderView.renderScale;
			this.sliderView.renderScale = function() {
				if (typeof _this.model.get('marks') == 'undefined') {
					_this.sliderView.renderScaleOrigin();
					return;
				}

				/// linear
				if (this.model.get('scale') == 'linear' || this.model.get('scale') == "logarithmic") {
					_this.sliderView.slider.slider("option", "scaleValues", _this.model.get('scaleValues'));
					_this.sliderView.slider.slider("option", "min", _this.model.get('minValue'));
					_this.sliderView.slider.slider("option", "max", _this.model.get('maxValue'));
				}

				var max = _this.model.get('max') - 1,
					min = _this.model.get('min');
				max = Math.floor(max / _this.model.get('range')) * _this.model.get('range') + 1; // ???

				var sliderWidth = _this.sliderView.slider.width(),
					pixelsPerMark = sliderWidth / (max - min - 1),
					minValue = this.model.get('minValue'),
					maxValue = this.model.get('maxValue');
				_this.sliderView.slider.append(_this.sliderView.scale);
				for (var index = min; index < max; index++) {
					if (index % this.model.get('range') != 0) {
						continue;
					}
					var mark = _this.model.get('marks').at(index),
						labels = mark.get('labels'),
						left = (index - min) * pixelsPerMark;

					// linear
					if (this.model.get('scale') == 'linear' || this.model.get('scale') == 'logarithmic') {
						var scaleValue = mark.get('scaleValue'),
							left = (scaleValue - minValue) * sliderWidth / (maxValue - minValue);
					}

					if (labels && labels.length != 0) {
						labels.each(function(l) {
							_this.renderMark(index, max, l.get('value'), l.get('valign'), left);
						});
					}
					else {
						_this.renderMark(index, max, modelNS.valueToLabel(mark.get('value')), 'bottom', left);
					}
				}
			};
			// this.sliderView.$el.width(sliderParent.css('width'));
			this.sliderView.render();

			if (this.model.get('axisLabels')) { // #11635 Обернул в условие
                this.model.get('axisLabels').each(function(l) {
                    var $wrapper = l.get('align') == 'left' ? _this.sliderWrapper.getColumn(0) :
                        _this.sliderWrapper.getColumn(_this.hasLeftLabels ? 2 : 1);
                    var label = $('<div class="slider-label font14 ' + l.get('valign') + ' ' + l.get('align') + '">' + l.get('value') + '</div>');
                    $wrapper.append(label);
                });
			}
			return this;
		},
		renderMark: function(index, max, value, align, left) {
			var text = value, // .replace(/ /g, '&#160;'),	// ???? проблемы если приходит что-то типа <span class="times">
				// text = modelNS.valueToLabel(text), // #9796
				mark = $('<div class="mark">' + text + '</div>'),
				markLine = $('<div class="markLine" style="left: ' + left + 'px; height: 18px;"></div>');
			this.sliderView.scale.append(markLine);
			this.sliderView.scale.append(mark);
			// if (mark.width() > 140) {	// #9727
			// 	mark.width(140);
			// }
			if (align == 'top') {
				mark.attr('valign', "top");
				markLine.attr('valign', "top");
			}
			mark.css('left', left);
			mark.css('margin-left', -mark.width() / 2 + 1); // 1px for border width

			// if (index == max - 1) {
			// 	mark.css({'left': (left - (mark.width() > 20 ? mark.width() - 10 : mark.width() / 2)) + 'px', 'text-align': 'right'});
			// } else
			// if (index == 0) {
			// 	mark.css('left', (left - 8) + 'px');
			// } else {
			// 	mark.css('left', (left - (mark.width() / 2)) + 'px');
			// }
			return;
		},
		getSliderView: function() {
			return this.sliderView;
		}
	});

	modelNS.HorizontalSliderModel = modelNS.SliderModel;


	modelNS.HorizontalSlider = Backbone.View.extend({
		className: 'model-slider model-slider-horizontal',
		events: {
			'click': 'onAreaClick'
		},
		initialize: function(options) {
			this.model = options.model;
		},
		render: function() {
			if (!this.model.get('parent')) {
				return;
			}

			this.slider = $('<div class="model-slider-slider"></div>');
			this.sliderLeft = $('<div class="model-slider-left"></div>');
			this.sliderRight = $('<div class="model-slider-right"></div>');
			this.sliderBack = $('<div class="model-slider-back"></div>');
			this.scale = $('<div class="model-slider-scale"><div class="model-slider-scale-back"></div></div>');

			if (this.model.get('addClass')) {
				this.$el.addClass(this.model.get('addClass'));
			}

			if (this.model.get('marksAtBottom')) {
				this.$el.addClass('model-slider-marksbottom');
			}

			var _slider = this,
				scale = window.zoomScale || 1; // parseFloat($('#theory').css('transform').replace(/matrix\((.*?)\,.*\)/gi, '$1')) || 1;

			// this.model.get('parent').append(this.$el);
			// this.$el.addClass(this.model.get('orientation'));
			this.$el.append(this.sliderLeft);
			this.$el.append(this.sliderRight);
			this.slider.append(this.sliderBack);
			this.$el.append(this.slider);

			this.slider.slider({
				min: _slider.model.min,
				max: _slider.model.max - 1,
				value: _slider.model.value,
				scale: scale,
				slide: function(event, ui) {
					if (!_slider.validateValue(ui.value)) return false;

					_slider.onSlide(event, ui);
					_slider.calculateBackground(ui);
				},
				stop: function(event, ui) {
					if (!_slider.validateValue(ui.value)) return false;

					_slider.calculateBackground(ui);
					_slider.onStop(event, ui);
				},
				change: function(event, ui) {
					if (!_slider.validateValue(ui.value)) return false;

					_slider.calculateBackground(ui);
					_slider.onChange(event, ui);
				}
			});

			this.model.get('parent').append(this.$el);

			// this.slider.width(this.$el.width().width() - 40);	// fix #7868
			this.slider.width(this.model.get('parent').width() - 40);

			this.slider.find('.ui-slider-handle').append('<div class="handler"><div class="slide"></div></div>');
			this.renderScale();
			this.calculateBackground();

			return this;
		},
		validateValue : function (value)
		{
			if (this.model.maxPosible) {
				if (value > this.model.maxPosible) return false;
			}
			return true;
		},
		onAreaClick: function(e) {
			if ($(e.target).attr('class').indexOf('model-slider-slider') != -1) {
				return;
			}

			var max = this.model.get('max') - 1,
				min = this.model.get('min');
			max = Math.floor(max / this.model.get('range')) * this.model.get('range') + 1;
			var pixelsPerMark = this.slider.width() / (max - min - 1),
				value = Math.round(e.offsetX / pixelsPerMark) + 1; // #9713

			this.setValue(value);
		},
		onSlide: function(event, ui) {
			this.trigger('Slide', ui, event);
		},
		onStop: function(event, ui) {
			this.trigger('Stop', ui, event);
		},
		onChange: function(event, ui) {
			this.trigger('Change', ui, event);
		},
		getMax: function() {
			return this.slider.slider('option', 'max');
		},
		getValue: function() {
			return this.slider.slider('value');
		},
		setValue: function(val) {
			if (!this.validateValue(val)) return false;
			this.slider.slider('option', 'value', val);
			return true;
		},
		getSlider: function() {
			return this.slider;
		},
		calculateBackground: function(ui) {

			if (!ui) {
				this.sliderBack.width(parseInt(this.$el.find('.ui-slider-handle').css('left').replace('px', '')));
				return;
			}

			if (this.model.get('scale') == 'linear' || this.model.get('scale') == 'logarithmic') {
				var max = this.model.get('maxValue'),
					min = this.model.get('minValue'),
					width = this.slider.width() * (ui.value - min) / (max - min);
				this.sliderBack.width(width);
			}
			else {
				var max = this.model.get('max') - 1,
					min = this.model.get('min');
				max = Math.floor(max / this.model.get('range')) * this.model.get('range') + 1;
				var pixelsPerMark = this.slider.width() / (max - min - 1),
					width = ui.value * pixelsPerMark;
				this.sliderBack.width(width);
			}
		},
		renderScale: function() {
			var _this = this,
				max = this.model.get('max') - 1,
				min = this.model.get('min');
			max = Math.floor(max / this.model.get('range')) * this.model.get('range') + 1;
			var pixelsPerMark = this.slider.width() / (max - min - 1);
			this.slider.append(this.scale);
			for (var index = min; index < max; index++) {
				if (index % this.model.get('range') != 0) {
					continue;
				}
				var date = (this.model.dates[index] || '').toString().replace(/ /g, '&#160;'),
					mark = $('<div class="mark">' + courseML.fixDash(date) + '</div>'),
					markLine = $('<div class="markLine" style="left: ' + ((index - min) * pixelsPerMark) + 'px"></div>');

				if (date) {
					this.scale.append(markLine);
					this.scale.append(mark);
				}
				// if (mark.width() > 140) {	// ????? #9290 #note-9
				// 	mark.width(140);
				// }

				if (index == max - 1) {
					mark.css({ 'left': ((index - min) * pixelsPerMark - (mark.width() > 20 ? mark.width() - 10 : mark.width() / 2)) + 'px', 'text-align': 'right' });
				}
				else
				if (index == 0) {
					mark.css('left', ((index - min) * pixelsPerMark - 10) + 'px');
				}
				else {
					mark.css('left', ((index - min) * pixelsPerMark - (mark.width() / 2)) + 'px');
				}
			}
		}
	});


	modelNS.VerticalSliderView = Backbone.View.extend({
		className: 'model-slider-vertical',
		initialize: function(options) {
			this.model = options.model;
			this.slider = $('<div class="slider"></div>');
			this.handleBack = $('<div class="handle-back"></div>');
			this.handle = $('<div class="handle"></div>');
		},
		render: function() {
			if (!this.model.parent) {
				return;
			}
			var _slider = this;
			this.model.parent.append(this.$el);
			this.$el.append(this.slider);
			this.handle.append(this.handleBack);
			this.slider.slider({
				orientation: 'vertical',
				min: this.model.min,
				max: this.model.max,
				value: this.model.value,
				slide: function(event, ui) {
					_slider.onSlide(event, ui);
				},
				stop: function(event, ui) {
					_slider.onStop(event, ui);
				},
				change: function(event, ui) {
					_slider.onChange(event, ui);
				}
			});
			this.slider.find('.ui-slider-handle').append(this.handle);
			this.renderMarks();
			return this;
		},
		renderMarks: function() {
			this.marksWrapper = $('<div class="marks-wrapper"></div>');
			this.$el.append(this.marksWrapper);
			this.pxPerMark = this.$el.height() / (this.model.dates.length - 1);
			for (var i = 0; i < this.model.dates.length; i++) {
				var mark = $('<div class="mark"></div>'),
					label = $('<div class="mark-label font12">' + this.model.dates[i] + '</div>');
				mark.css({ 'top': (this.$el.height() - (i * this.pxPerMark)) + 'px' });
				label.css({ 'top': (this.$el.height() - (i * this.pxPerMark) - 8) + 'px' });
				this.marksWrapper.append(mark);
				this.marksWrapper.append(label);
			}
		},
		disable: function () {
			this.slider.slider({disabled: true});
			this.$el.addClass('disabled');
		},
		getValue: function() {
			return this.slider.slider('value');
		},
		setValue: function(val) {
			this.slider.slider('option', 'value', val);
		},
		onSlide: function(event, ui) {
			this.trigger('Slide', ui);
		},
		onStop: function(event, ui) {
			this.trigger('Stop', ui);
		},
		onChange: function(event, ui) {
			this.trigger('Change', ui);
		}
	});

	/* ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||*/
	/* ------------------------------- Switchers --------------------------------------*/

	modelNS.SwitcherModel = Backbone.Model.extend({
		initialize: function(options) {
			this.checked = typeof options.checked !== 'undefined' ? Boolean(options.checked) : true;
			this.label = options.label || '';
			this.disabled = typeof options.disabled !== 'undefined' ? Boolean(options.disabled) : false;
			this.color = options.color || '#0B72B4';
			this.onCheck = options.onCheck || null;
			this.onUncheck = options.onUncheck || null;
			this.mode = options.mode ? options.mode : 'checkbox';
			this.value = options.value || '';
			this.width = options.width;
			this.height = options.height;
			this.cls = options.cls;
			this.parent = options.parent;
		}
	});

	modelNS.SwitcherCollection = Backbone.Collection.extend({
		model: modelNS.SwitcherModel
	});

	modelNS.SwitcherView = Backbone.View.extend({
		className: 'base-switcher',
		events: {
			'click .switcher': 'onClick'
		},
		initialize: function(options) {
			this.model = options.model;
			this.listenTo(this.model, 'change:checked', this.onCheck);
			this.listenTo(this.model, 'change:color', this.setColor);
		},
		render: function() {
			if (this.model.get('disabled') == true) {
				this.disable();
			}
			if (this.model.width) {
				this.$el.width(this.model.width);
			}
			if (this.model.height) {
				this.$el.height(this.model.height);
			}
			if (this.model.cls) {
				this.$el.addClass(this.model.cls);
			}
			this.titleHandler = $('<div class="switcher-title"></div>');
			this.switcher = $('<div class="switcher"></div>');
			this.slider = $('<div class="switcher-slider"></div>');
			this.switcher.append('<div class="plus">+</div>');
			this.switcher.append('<div class="minus">-</div>');
			this.switcher.append(this.slider);
			this.$el.append(this.switcher);
			this.$el.append(this.titleHandler);
			this.titleHandler.append(this.model.label);
			this.titleHandler.width(this.$el.width() - this.switcher.width());
			this.setColor();
			this.onCheck();
			return this;
		},
		setColor: function() {
			this.switcher.css('background-color', this.model.color);
		},
		enable: function() {
			this.$el.removeClass('disabled');
		},
		disable: function() {
			this.$el.addClass('disabled');
		},
		onClick: function() {
			if (this.model.get('mode') == 'radiobutton' && this.model.get('checked')) {
				return;
			}
			this.model.set('checked', !this.model.get('checked'));
		},
		onCheck: function() {
			if (this.model.get('disabled')) {
				return;
			}
			if (this.model.get('checked')) {
				this.check();
			}
			else {
				this.uncheck();
			}
			this.trigger('Change', this.model);
		},
		check: function() {
			if (!this.$el.hasClass('checked')) {
				this.$el.addClass('checked');
				this.trigger('Checked', this.model);
			}
			if (this.model.onCheck || '') {
				this.model.onCheck();
			}
		},
		uncheck: function() {
			if (this.$el.hasClass('checked')) {
				this.$el.removeClass('checked');
				this.trigger('Unchecked', this.model);
			}
			if (this.model.onUncheck || '') {
				this.model.onUncheck();
			}
		}
	});

	modelNS.SwitcherGroup = Backbone.View.extend({
		className: 'switcher-group',
		initialize: function(options) {
			this.modes = { CHECKBOX: 'checkbox', RADIOBUTTON: 'radiobutton' };
			this.collection = options.collection;
			this.mode = options.mode ? options.mode : this.modes.CHECKBOX;
		},
		render: function() {
			this.switchers = [];
			this.collection.each(this.createSwitcher, this);
			return this;
		},
		createSwitcher: function(model) {
			model.set('mode', this.mode);
			var $model = this,
				switcherView = new modelNS.SwitcherView({ model: model });
			this.switchers.push(switcherView);
			this.$el.append(switcherView.render().el);
			if (this.mode == this.modes.RADIOBUTTON) {
				this.listenTo(switcherView, 'Checked', this.onCheck);
			}
		},
		onCheck: function(switcher) {
			var switchers = this.collection.filter(function(s) {
				return s.cid != switcher.cid;
			});
			for (var i = 0; i < switchers.length; i++) {
				this.uncheck(switchers[i]);
			}
			this.trigger('Checked', switcher);
		},
		uncheck: function(model) {
			model.set('checked', false);
		}
	});

	// ------------------------------ Canvas ------------------------------------

	modelNS.Canvas = Backbone.View.extend({
		className: 'base-model-canvas',
		tagName: 'canvas',
		initialize: function(options) {
			Backbone.View.prototype.initialize.apply(this, arguments);

			this.parent = options.parent;
			this.width = options.width;
			this.height = options.height;
			this.id = options.id;
		},
		render: function() {
			if (this.width) {
				this.$el.attr('width', this.width);
				this.$el.width(this.width);
			}
			if (this.height) {
				this.$el.attr('height', this.height);
				this.$el.height(this.height);
			}
			this.$el.attr('id', this.id);
			if (this.parent) {
				$(this.parent).append(this.$el);
			}
			return this;
		},
		getContext: function() {
			return this.el.getContext('2d');
		},
		clear: function() {
			this.getContext().clearRect(0, 0, this.width, this.height);
		},
		drawPoint: function(x, y, color) {
			var r = 6,
				ctx = this.getContext();
			ctx.fillStyle = color;
			ctx.beginPath();
			ctx.arc(x, y, r, 0, 2 * Math.PI, true);
			ctx.closePath();
			ctx.fill();
		},
		onClick: function(callback, modelCtx) {
			var ctx = new canvas_events(this.id),
				$this = this;
			ctx.beginPath();
			ctx.fillStyle = "rgba(255, 255, 255, 0)";
			this.clickableRect = ctx.fillRect(0, 0, this.width, this.height);
			this.clickableRect.addEvent('click', function(e, args) {
				setTimeout(function() {
					if (!$this.rectClicked) {
						if (callback) {
							callback(e, modelCtx);
						}
					}
					$this.rectClicked = false;
				}, 50);
			});
			ctx.closePath();
		},
		clearCanvas: function() {
			var ctx = this.getContext();
			this.clickableRect.addEvent('click', null);
			ctx.beginPath();
			ctx.clearRect(0, 0, this.width, this.height);
			ctx.closePath();
		},
		generateClickableRegion: function(model, callback, modelCtx) {
			this.generateMlRegion(model, callback, modelCtx, "rgba(255, 255, 255, 0)", true);
		},
		strokeRegion: function(model, callback, modelCtx) {
			this.generateMlRegion(model, null, modelCtx, "rgb(100, 245, 123)", false);
		},
		generateMlRegion: function(model, callback, modelCtx, color, fill) {
			var ctx = new canvas_events(this.id),
				$this = this,
				coords = model.coords.split(','),
				x1, y1, x2, y2, r;
			ctx.beginPath();
			ctx.fillStyle = color;
			ctx.strokeStyle = color;
			ctx.lineWidth = 4;
			switch (model.type) {
				case "poly":
					var len = coords.length;
					for (var i = 0; i < len; i += 2) {
						i === 0 ? ctx.moveTo(coords[i], coords[i + 1]) : ctx.lineTo(coords[i], coords[i + 1]);
					}
					var rect = fill ? ctx.fill() : ctx.stroke();
					break;
				case "rect":
					x1 = Math.round(coords[0]);
					y1 = Math.round(coords[1]);
					x2 = Math.round(coords[2]);
					y2 = Math.round(coords[3]);
					var rect = fill ? ctx.fillRect(x1, y1, x2 - x1, y2 - y1) :
						ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);

					break;
				case "circle":
					x1 = Math.round(coords[0]);
					y1 = Math.round(coords[1]);
					r = Math.round(coords[2]);
					ctx.arc(x1, y1, r, 0, Math.PI, true);
					ctx.arc(x1, y1, r, Math.PI, 0, true);
					var rect = fill ? ctx.fill() : ctx.stroke();
					break;
			}
			ctx.closePath();
			rect.addEvent('click', function(e, args) {
				if (callback) {
					callback(e, model, modelCtx);
				}
				$this.rectClicked = true;
			});
		}
	});

	modelNS.ProgressCircle = Backbone.View.extend({
		className: 'base-model-circle-progress',
		initialize: function (options) {
				Backbone.View.prototype.initialize.apply(this, arguments);

				this.radius = options.radius || 10;
				this.lineWidth = options.lineWidth || 2;

				if (!options.width) options.width = this.radius*2 + this.lineWidth;
				if (!options.height) options.height = this.radius*2 + this.lineWidth;

				this.offset = options.offset || this.lineWidth*Math.PI*2/(Math.PI*this.radius*2)/2;
				this.color = options.color || '#0d68a7';
				this.value = options.value || 0;
				this.width = options.width;
				this.height = options.height;
				this.parent = options.parent;
		},

		render: function () {
			Backbone.View.prototype.render.apply(this, arguments);

			$(this.parent).append(this.el);

			this.Canvas = new modelNS.Canvas({
				parent: this.$el,
				width: this.width,
				height: this.height,
			}).render();

			var ctx = this.Canvas.getContext();

			ctx.beginPath();
			ctx.strokeStyle = this.color;
			ctx.lineCap = 'square';
			ctx.closePath();
			ctx.fill();	// ?
			ctx.lineWidth = this.lineWidth;

			this.imd = ctx.getImageData(0, 0, 50, 50);

			if (this.value) this.progress(this.value);

			return this;
		},

		progress: function (val) {
			var ctx = this.Canvas.getContext(),
					circ = Math.PI * 2,
					quart = Math.PI / 2;

			ctx.putImageData(this.imd, 0, 0);

			//
			// ctx.strokeStyle = 'gray';
	    // ctx.beginPath();
	    // ctx.arc(this.width/2, this.height/2, this.radius, -(quart - this.offset), ((circ) * 1) - quart + this.offset, false);
	    // ctx.stroke();

			ctx.strokeStyle = this.color;
	    ctx.beginPath();
	    ctx.arc(this.width/2, this.height/2, this.radius, -(quart - this.offset), ((circ) * val) - quart + this.offset, false);
	    ctx.stroke();

			// ctx.font = (this.radius*2-4)+"px Arial";
			// ctx.fillStyle = this.color;
			// ctx.textAlign = "center";
			// ctx.fillText("≈", this.width/2, (this.radius*2)-3);	// ⮃

			this.value = val;

			this.trigger('progress', val);

			if (val>=1) this.trigger('done');
		},

		// change progress value in some duration (ms)
		animate: function (options) {
			var to = options.to,	// max 1
					from = options.from || this.value, //  min 0
					duration = options.duration || 400,
					self = this;	// ms

			this.$el
				.stop()
				.css('borderSpacing', from)
				.animate(
					{
						borderSpacing: to
					},
					$.extend(options, {
						duration: duration,
						step: function(now) {
							self.progress(now);
						},
						complete: function() {
							self.trigger('complete');
						}
					})
				);
		},

		remove: function () {
			this.$el.stop();
			return modelNS.Canvas.prototype.remove.apply(this, arguments);
		}
	});

	modelNS.drawLine = function(x1, y1, x2, y2, line) {
		var length = Math.sqrt(((x2 - x1) * (x2 - x1)) + ((y2 - y1) * (y2 - y1))),
			cx = ((x1 + x2) / 2) - (length / 2),
			cy = ((y1 + y2) / 2) - (4 / 2),
			angle = Math.atan2((y1 - y2), (x1 - x2)) * (180 / Math.PI);
		if (!line) {
			line = $('<div class="connection-line"></div>');
		}

		line.css({
			'left': cx + 'px',
			'top': cy + 'px',
			'width': length + 'px',
			'-moz-transform': 'rotate(' + angle + 'deg)',
			'-webkit-transform': 'rotate(' + angle + 'deg)',
			'-o-transform': 'rotate(' + angle + 'deg)',
			'-ms-transform': 'rotate(' + angle + 'deg)',
			'transform': 'rotate(' + angle + 'deg)'
		});
		return line;
	};

	// -------------------------- Label View -----------------------------------

	modelNS.Label = modelNS.LabelView = Backbone.View.extend({
		className: 'label-view',

		// шаблон живых переменных
		match: /{%\w+}/gi,

		initialize: function(options) {
			this.parent = options.parent;
			this.width = options.width;
			this.height = options.height;
			this.text = options.text;
			this.cls = options.cls;
			this.title = options.title;
		},
		render: function() {
			this.$inner = this.$el;

			this.matches = {};

			if (this.parent) {
				this.parent.append(this.$el);
			}
			if (this.width) {
				this.$el.width(this.width);
			}
			if (this.height) {
				this.$el.height(this.height);
			}
			if (this.cls) {
				this.$el.addClass(this.cls);
			}
			if (this.title) {	// we use $inner becose of column parent and label-view can take all width
				this.$el.wrapInner(this.$inner = $('<span class="label-inner"/>'));
				this.$inner.attr('title', this.title);
			}

			// живые переменные, без перерисовки блока
			var matches = this.text.match(this.match);
			if (matches) {
				for (var i=0; i<matches.length; i++) {
					var match = matches[i];
					this.text = this.text.replace(match, '<span match="'+this.getMatchName(match)+'"/>');
				}
			}

			this.$inner.append(this.text);
			return this;
		},
		getMatchName: function (name) {
			return name.replace('{%', '').replace('}','');
		},
		set: function (set) {
			var text = this.text;
			for (var key in set) {
				var $match = this.$inner.find("[match='"+key+"']");

				if ($match.length) {
					$match.html(set[key]);
				} else {
					text = text.replace(key, set[key]);
				}
			}
			if (text != this.text) {
				this.$inner.html(text);
			}
		}
	});

	//-------------------------- Input View -----------------------------------

	modelNS.Input = Backbone.View.extend({
		className: 'input-view',
		initialize: function(options) {
			this.parent = options.parent;
			this.width = options.width;
			this.height = options.height;
			this.placeholder = options.placeholder;
			this.inputType = options.inputType;
			this.value = options.value;
			this.disabled = options.disabled != undefined ? Boolean(options.disabled) : false;
			this.cls = options.cls;

			this.step = options.step || 1;
			this.label = options.label;
			this.labelAfter = options.labelAfter;
			this.title = options.title;
			this.row = options.row;
			this.min = options.min;
			this.max = options.max;

			// количество знаков после запятой
			this.fixed = options.fixed === undefined ? 1 : options.fixed;
		},
		render: function() {
			var _this = this;

			this.$parent = this.parent;

			if (this.row) {
				this.$row = $('<div class="row-view"/>').appendTo(this.parent);
				this.$parent = this.$row;
			}

			if (this.label) {
				this.Label = this.addLabel(this.label);
			}

			this.input = $('<input type="text"/>');
			this.$el.append(this.input);

			if (this.cls) {
				this.$el.addClass(this.cls);
			}

			if (this.disabled) {
				this.disable();
			}
			if (parent) {
				this.$parent.append(this.$el);
			}

			if (this.labelAfter) {
				this.Label = this.addLabel(this.labelAfter);
			}

			if (this.title) {
				this.$el.attr('title', this.title);
			}

			if (this.width) {
				this.$el.width(this.width);
			}
			if (this.height) {
				this.$el.height(this.height);
			}
			if (this.placeholder) {
				this.input.attr('placeholder', this.placeholder);
			}
			if (this.value !== undefined) {
				this.setText(this.value);
			}
			this.$el.attr('input', this.inputType)
			if (this.inputType == 'number') {
				this.input.keydown(function(e) {
					var val = $(this).val();
					_this.keyDownVal = val;
					if (e.key.match(/^[0-9,.-]/) == null &&
						e.keyCode != 8 &&
						e.keyCode != 9 && // #7904	[TAB] ?
						e.keyCode != 46 && // #8376 [Del]
						e.keyCode != 37 &&
						e.keyCode != 39
						|| e.key.match(/^[,.]/) && val.indexOf(',')>0
						|| e.key == "-" && val.indexOf('-')==0
					) {
						e.preventDefault();
						e.stopPropagation();
						return false;
					}
				});
				this.input.blur(function(e) {
					var val = $(this).val();
					$(this).val(_this.validate(val));
				});

				// TODO: long mousedown make fast change values
				if (modelNS.restyling) {
					$('<i class="up"/>')
						.appendTo(this.$el)
						.click(function () {
							_this.numberUp();
						});
					$('<i class="down"/>')
						.appendTo(this.$el)
						.click(function () {
							_this.numberDown();
						});
				}
			}
			this.input.keydown(function(e) {
				_this.trigger('OnKeyDown', _this.getText());
			});
			if (this.inputType == 'number') {
				this.input.blur(function(e) {
					_this.trigger('Change', _this.getText());
				});
			} else {
				this.input.keyup(function(e) {
					_this.trigger('Change', _this.getText());
				});
			}
			this.input.on('paste', function(e) {
				_this.trigger('Change', _this.getText());
			});
			this.input.change(function(e) {
				_this.trigger('Change', _this.getText());
			});

			return this;
		},
		addLabel: function (label, $parent)
		{
			var options = label;

			if (typeof(label) == 'string') {
				options = {text:label};
			}

			if (!options.parent) options.parent = this.$parent;
			if (options.title === undefined) options.title = this.title;
			options.cls = 'input-label';

			return new modelNS.LabelView(options).render()
		},
		disable: function() {
			this.input.prop('disabled', true);
			this.input.addClass('disabled');
		},
		enable: function() {
			this.input.prop('disabled', false);
			this.input.removeClass('disabled');
		},
		getText: function() {
			if (this.inputType == 'number') {
				return this.input.val().replace(',', '.');
			}
			return this.input.val();
		},
		setText: function(value) {
			if (this.inputType == 'number') {
				if (value === undefined) value = '';
				return this.input.val(value.toString().replace('.', ','));
			}

			return this.input.val(value);
		},

		// TODO: add zeros to numbers with step < 1 https://stackoverflow.com/questions/24038971/add-00-tofixed-only-if-number-has-less-than-two-decimal-places
		validate: function (val, defVal) {
			if (val === "") {
				return defVal || val;
			}

			if (this.inputType == 'number') {
				var numVal = val.toString().replace(',', '.')*1; // если просто в конце точка то добавлем 0 что бы не было ошибки

				// TODO: fix 2х точек в одном числе
				if (this.fixed !== undefined && val.toString().indexOf('.') != val.length-1) val = numVal.toFixed(this.fixed)*1;

				if (this.max !== undefined && numVal > this.max) {
					val = this.max;
				}
				if (this.min !== undefined && numVal < this.min) {
					val = this.min;
				}

				return val.toString().replace('.', ',');
			}

			return val;
		},
		numberUp: function()
		{
			if (this.input.hasClass('disabled')) return;

			var numVal = this.getText().replace(',', '.')*1;
				numVal += this.step;

			// var val = ((Math.floor(this.getText()*1000/this.step/1000) + 1)*(this.step*1000))/1000;	// complex algoritm for correct work with 0.1, and 0.01 etc

			this.setText(this.validate(numVal, this.min));
			this.trigger('Change', this.getText());
		},
		numberDown: function()
		{
			if (this.input.hasClass('disabled')) return;

			var numVal = this.getText().replace(',', '.')*1;
				numVal -= this.step;

			// var val = ((Math.floor(this.getText()*1000/this.step/1000) - 1)*(this.step*1000))/1000;

			this.setText(this.validate(numVal, this.max));
			this.trigger('Change', this.getText());
		}
	});

	/* ---------------------------- Select ---------------------------*/

	modelNS.Select = Backbone.View.extend({
		className: 'select-view base-model-select',
		initialize: function(options) {
			this.data = options.data;
			this.parent = options.parent;
			this.width = options.width;
			this.selected = options.selected;
			this.label = options.label;

			// количество отоброжаемых элементов списка (остальные в скролле)
			this.visibleCount = options.visibleCount;

			this.restyling = options.restyling === undefined ? true : options.restyling;
			this.defaults = {
				disabled: options.disabled
			};
		},
		render: function() {
			var self = this;
			if (this.parent) {
				this.parent.append(this.$el);
			}

			// label
			if (this.label) {
				this.label = new modelNS.LabelView({
					text: this.label,
					parent: this.$el
				}).render();
			}

			this.$select = this.select = $('<select></select>');
			for (var i = 0; i < this.data.length; i++) {
				var value = i,
						label = this.data[i];
				if (typeof(label) == "object") { // [{value:"..", label:".."}, {..} ..]
					value = label.value;
					label = label.label;
				}
				var selected = this.selected == value ? " selected" : "";
				this.select.append('<option' + selected + ' value="' + value + '">' + label + '</option>');
			}
			this.$el.append(this.select);

			if (modelNS.restyling && this.restyling) {
				var $selectmenu = $('<div class="selectmenu-view">')
					.appendTo(this.$el)
					.append(this.select);

				this.select.selectmenu({
					change: function(event, ui) {
						self.trigger('Change', event, ui);
					},
					width: this.width,
					appendTo: $selectmenu,
				});
			} else {	// OLD support (где ?? в анимации переделано)
				this.select.selectWidget({
					change: function(changes) {
						self.trigger('Change', changes);
						return changes;
					},
					scrollHeight: 'auto' // 250 ??? #9700-6
				});
				if (this.width) {
					this.select.parent().find('.select-main').width(this.width);
					this.select.parent().find('.select-list').width(this.width);
				}
			}

			if (this.visibleCount) {
				var $menuWidget = this.select.selectmenu("menuWidget");
				this.select.selectmenu("open");
				var height = this.visibleCount * $menuWidget.find('li').height();
				$menuWidget.height(height);
				this.select.selectmenu("close");
			}

			if (this.defaults.disabled) {
				setTimeout(function () {self.disable()}, 0);	// напрямую не работает, только через setTimeout, не стал разбираться почему.
			}

			return this;
		},

		change: function ( val ) {
			this.$select.val( val );
			this.$select.selectmenu("refresh");
			this.$select.selectmenu("close");

			var item = this.$select.selectmenu("instance").menuInstance.active.data( "ui-selectmenu-item" ),
					event = jQuery.Event( "change" );
			event.isTrigger = 2;

			this.trigger('Change', event, {item: item});
		},

		disable: function () {
			this.$select.selectmenu( "disable" );
		},

		enable: function () {
			this.$select.selectmenu( "enable" );
		}
	});

	/* -------------------------- Radiobutton ----------------------------*/

	modelNS.RadioButtonModel = Backbone.Model.extend({
		initialize: function(options) {
			this.checked = typeof options.checked !== 'undefined' ? Boolean(options.checked) : true;
			this.label = options.label || '';
			this.disabled = typeof options.disabled !== 'undefined' ? Boolean(options.disabled) : false;
			this.color = options.color || '#0B72B4';
			this.onCheck = options.onCheck || null;
			this.onUncheck = options.onUncheck || null;
			this.mode = options.mode ? options.mode : 'checkbox';
			this.value = options.value || '';
			this.width = options.width;
			this.height = options.height;
			this.cls = options.cls;
			this.id = options.id;
		}
	});

	modelNS.RadioButtonCollection = Backbone.Collection.extend({
		model: modelNS.RadioButtonModel
	});

	modelNS.RadioButtonView = Backbone.View.extend({
		className: 'base-radiobutton',
		events: {
			'click': 'onClick'
		},
		initialize: function(options) {
			this.model = options.model;
			this.parent = options.parent;
			this.listenTo(this.model, 'change:checked', this.onCheck);
			this.listenTo(this.model, 'change:color', this.setColor);
		},
		render: function() {
			if (this.parent) {
				this.parent.append(this.$el);
			}
			if (this.model.disabled) {
				this.disable();
			}
			if (this.model.width) {
				this.$el.width(this.model.width);
			}
			if (this.model.height) {
				this.$el.height(this.model.height);
			}
			if (this.model.cls) {
				this.$el.addClass(this.model.cls);
			}
			if (this.model.id) {
				this.$el.attr('id', this.model.id);
			}
			this.titleHandler = $('<div class="radio-title"></div>');
			this.radioButton = $('<div class="radiobutton"></div>');
			this.radioSpot = $('<div class="radiospot"></div>');
			this.radioButton.append(this.radioSpot);
			this.$el.append(this.radioButton);
			this.$el.append(this.titleHandler);
			this.titleHandler.append(this.model.label);
			if (!modelNS.restyling) {
				this.titleHandler.width(this.$el.width() - this.radioButton.width()); // old support
			}
			this.setColor();
			this.onCheck();
			return this;
		},
		setColor: function() {
			this.radioButton.css('border-color', this.model.color);
			this.radioSpot.css('background-color', this.model.color);
		},
		enable: function() {
			this.$el.removeClass('disabled');
		},
		disable: function() {
			this.$el.addClass('disabled');
		},
		onClick: function() {
			if (this.model.get('checked') || this.$el.hasClass('disabled')) {
				return;
			}
			this.model.set('checked', !this.model.get('checked'));
		},
		onCheck: function() {
			if (this.model.get('disabled') || this.$el.hasClass('disabled')) {
				return;
			}
			if (this.model.get('checked')) {
				this.check();
			}
			else {
				this.uncheck();
			}
			this.trigger('Change', this.model);
		},
		check: function() {
			if (!this.$el.hasClass('checked')) {
				this.$el.addClass('checked');
				this.trigger('Checked', this.model);
			}
			if (this.model.onCheck || '') {
				this.model.onCheck();
			}
		},
		uncheck: function() {
			if (this.$el.hasClass('checked')) {
				this.$el.removeClass('checked');
				this.trigger('Unchecked', this.model);
			}
			if (this.model.onUncheck || '') {
				this.model.onUncheck();
			}
		}
	});

	modelNS.RadioButtonGroup = Backbone.View.extend({
		className: 'radiobutton-group',
		initialize: function(options) {
			this.collection = options.collection;
			this.parent = options.parent;
			this.columns = options.columns;
			this.verticalAlign = options.verticalAlign;
		},
		render: function() {
			if (this.parent) {
				this.parent.append(this.$el);
			}
			this.switchers = [];
			this.collection.each(this.createSwitcher, this);
			if (this.columns) {
				//this.$el.attr("columns", this.collection.length); // #8754 Закомментил
                this.$el.attr("columns", this.columns); //#8754
			}
			if (this.verticalAlign == "middle") {	// now we set verticalAlign for panel
				this.alignMiddle(); // #9480#note-6
				// for now only one column support
				// 	this.$el.find('.base-radiobutton').css('margin-top', Math.floor((this.parent.height()-this.switchers[0].$el.height())/2));
			}
			return this;
		},
		createSwitcher: function(model) {
			var $model = this,
				radioButtonView = new modelNS.RadioButtonView({ model: model, parent: this.$el });
			this.switchers.push(radioButtonView);
			radioButtonView.render();
			if (model.checked) this.checked = model;
			this.listenTo(radioButtonView, 'Checked', this.onCheck);
		},
		onCheck: function(switcher) {
			var switchers = this.collection.filter(function(s) {
				return s.cid != switcher.cid;
			});
			for (var i = 0; i < switchers.length; i++) {
				this.uncheck(switchers[i]);
			}
			this.checked = switcher;
			this.trigger('Checked', switcher);
		},
		uncheck: function(model) {
			model.set('checked', false);
		},
		disable: function() {
			for (var i = 0; i < this.switchers.length; i++) {
				this.switchers[i].disable();
			}
		},
		enable: function() {
			for (var i = 0; i < this.switchers.length; i++) {
				this.switchers[i].enable();
			}
		},
		value: function (value)
		{
			var switchers = this.collection.filter(function(s) {
				return s.value == value;
			});
			for (var i = 0; i < switchers.length; i++) {
				switchers[i].set('checked', true);
			}
		},
		alignMiddle: function ()	// TODO: более универсально? общий метод для любых блочных узлов?
		{
			var $radiobuttons = this.$el.find('.base-radiobutton:visible'),
					height = 0,
					panelHeight = this.$el.height();

			$radiobuttons.each(function () {
				height += this.offsetHeight;
			});

			if (this.columns) {
				height = height / this.columns; //#11592 Высота кнопок делится на количество колонок для правильного центрирования
			}

			var outset = Math.floor((panelHeight - height)/($radiobuttons.length*2));

			$radiobuttons.css({margin:outset + 'px 0'});
		}
	});

	/* ----------------------- Checkbox -------------------------------*/

	modelNS.Checkbox = Backbone.View.extend({
		className: 'base-model-checkbox',
		events: {
			'click': 'onClick'
		},
		initialize: function(options) {
			this.model = options.model;
			this.listenTo(this.model, 'change:checked', this.onCheck);
			this.listenTo(this.model, 'change:color', this.setColor);
		},
		render: function() {
			if (this.model.get('parent')) {
				this.model.get('parent').append(this.$el);
			}
			if (this.model.get('disabled') == true) {
				this.disable();
			}
			if (this.model.get('checked') == true) {
				this.check();
			}
			if (this.model.get('cls')) {
				this.$el.addClass(this.model.get('cls'));
			}

			this.chkInner = $('<div class="checkbox-inner"></div>');
			this.$el.append(this.chkInner);

			if (this.model.get('label')) {
				this.addLabel(this.model.get('label'));
			}

			return this;
		},
		addLabel: function (label, $parent)
		{
			var options = label;

			if (typeof(label) == 'string') {
				options = {text:label};
			}

			if (!options.parent) options.parent = this.$el;
			if (options.title === undefined) options.title = this.title;

			return new modelNS.LabelView(options).render()
		},
		enable: function() {
			this.model.set({ disabled: false });
			this.$el.removeClass('disabled');
		},
		disable: function() {
			this.model.set({ disabled: true });
			this.$el.addClass('disabled');
		},
		onClick: function() {
			this.model.set('checked', !this.model.get('checked'));
		},
		onCheck: function() {
			if (this.model.get('disabled')) {
				return;
			}
			if (this.model.get('checked')) {
				this.check();
			}
			else {
				this.uncheck();
			}
			this.trigger('Change', this.model);
		},
		check: function() {
			this.model.set({ checked: true });
			if (!this.$el.hasClass('checked')) {
				this.$el.addClass('checked');
				this.trigger('Checked', this.model, this);
			}
			if (this.model.onCheck || '') {
				this.model.onCheck();
			}
		},
		uncheck: function() {
			this.model.set({ checked: false });
			if (this.$el.hasClass('checked')) {
				this.$el.removeClass('checked');
				this.trigger('Unchecked', this.model, this);
			}
			if (this.model.onUncheck || '') {
				this.model.onUncheck();
			}
		}
	});



	/**
	 * Slideshow Carousel Gallery
	 * @todo вырезать поддержку ie9 ?
	 */

	modelNS.Slideshow = modelNS.BaseModel.extend({
		// defaults: _.extend({}, modelNS.BaseModel.prototype.defaults, {}),
		initialize: function(options) {
			options.defaults = $.extend({
				width: 600,
				height: 400,
				minWidth: 400,
				maxWidth: 1200,
				minHeight: 300,
				maxHeight: 1000,
				navHeight: 35,
				titleHeight: 30
			}, options.defaults);
			this.options = options;
			modelNS.BaseModel.prototype.initialize.apply(this, [options]);
		},
		parseXML: function(xmlData) {
			var $model = this,
				$xml = $(typeof(xmlData) == 'string' ? $.parseXML(xmlData) : xmlData),
				$root = $xml.find('slideshow'),
				arrow = $root.attr('arrow') === 'true',
				titles = $root.attr('titles') === 'true',
				xmlHeigh = $root.attr('height') * 0.85 || 0, // ARCH #9564 чтоб было место для текста (было значение 1)
				xmlWidth = $root.attr('width') * 1 || 0,
				viewwidth = $root.attr('viewwidth') * 1,
				viewheight = $root.attr('viewheight') * 1,
				$objects = $xml.find('object');

			this.height = this.options.height || xmlHeigh || this.defaults.height;
			if (this.height < this.defaults.minHeight) this.height = this.defaults.minHeight;
			if (this.height > this.defaults.maxHeight) this.height = this.defaults.maxHeight;

			this.width = this.options.width || xmlWidth || this.defaults.width;
			if (this.width < this.defaults.minWidth) this.width = this.defaults.minWidth;
			if (this.width > this.defaults.maxWidth) this.width = this.defaults.maxWidth;

			return $.extend($model.defaults, {
				width: $model.width,
				height: $model.height,
				viewwidth: viewwidth,
				viewheight: viewheight,
				objects: $objects,
				arrow: arrow,
				titles: titles
			})
		}
	})


	modelNS.SlideshowView = modelNS.BaseModelView.extend({

		events: {
			// 'click .player-controls .play:not(.disable)': 'centerClick',
		},

		centerclick: [],
		onsetcenter: [],

		initialize: function(options) {
			var params = options.model.dataJSON,
				mediaType = params.mediaType,
				self = this;
		},

		onCenterClick: function(fn) {
			this.centerclick.push(fn);
		},

		centerClick: function($img) {
			var openPopup = true;
			for (var i = 0; i < this.centerclick.length; i++) {
				if (this.centerclick[i].apply(this, [$img]) === false) openPopup = false;
			}

			if (openPopup) this.openPopup($img);
		},

		onSetCenter: function(fn) {
			if (fn) {
				this.onsetcenter.push(fn)
			}
			else {
				for (var i = 0; i < this.onsetcenter.length; i++) {
					this.onsetcenter[i].apply(this);
				}
			}
		},

		render: function() {
			modelNS.BaseModelView.prototype.render.apply(this);
			this.$el.addClass('slideshow');

			var params = this.model.dataJSON,
				sizes = _.pick(params, ["width", "height", "minWidth", "minHeight", "maxWidth", "maxHeight"]);

			// размеры модели
			this.$el.css(sizes);

			if (isIE() == 9) this.$el.addClass('ie9');

			this.renderLayout();
			this.renderPics();
			this.renderNav();
			this.renderArrow();

			this.parsePopups();

			return this;
		},

		renderLayout: function() {
			var params = this.model.dataJSON,
				navHeight = params.navHeight;

			this.mainLayout = new modelNS.DualHorizontalLayout({
				nopadding: true,
				bottomPaneHeight: navHeight,
				parent: this.$el
			}).render();

			this.$container = $('<div class="slideshow-container"></div>').appendTo(this.mainLayout.$topPane);

		},

		renderNav: function() {
			var params = this.model.dataJSON,
				objects = params.objects,
				self = this;

			this.$nav = this.mainLayout.$bottomPane;
			for (var o = 0; o < objects.length; o++) {
				var object = $(objects[o]);
				this.$nav.append($("<div class='slideshow-point' index='" + o + "'/>").click(function() {
					self.setCenterByIndex($(this).attr('index'));
				}));
			}
		},

		renderArrow: function() {
			var params = this.model.dataJSON,
				arrow = params.arrow,
				self = this;

			if (arrow) {
				this.$container.append($('<a class="next"/>').click(function() {
					self.setCenter(self.$figure.find('.right'));
				}));
				this.$container.append($('<a class="prev"/>').click(function() {
					self.setCenter(self.$figure.find('.left'));
				}));
				this.$container.addClass('has-arrow');
			}
		},

		renderPics: function() {
			var params = this.model.dataJSON,
				basePath = this.model.options.basePath,
				objects = params.objects,
				self = this,
				$center;

			this.perspective = params.width / 2;

			this.$figure = $('<figure/>')
				.css('perspective', this.perspective)
				.addClass('fast')
				.appendTo(this.$container);

			this.$canvasFigure = $('<figure/>')
				.addClass('canvases')
				.appendTo(this.$container);

			this.loaded = 0;
			this.count = 0;
			for (var o = 0; o < objects.length; o++) {
				var object = $(objects[o]),
					src = basePath + object.attr('file'),
					id = object.attr('id'),
					$img = $('<img id="'+id+'" src="' + src + '" index="' + o + '" title="' + object.text() + '"/>'),
					$canvas = $('<canvas/>'),
					sizesCalcualted = false;

				if (object.attr('width')) $img.attr('width', object.attr('width'));
				if (object.attr('height')) $img.attr('height', object.attr('height'));
				$img.error(function() { self.imgErrorLoad.apply(self, [this, src]) });
				$img.load(function() { self.imgOnLoad.apply(self, [this, $center]) });
				$img.click(function() { self.imgOnClick.apply(self, [this]) });

				(function(img) { $canvas.click(function() { self.imgOnClick.apply(self, [img]) }) })($img[0]);

				if (!$center && object.attr('center')) $center = $img.data('center', 1);

				this.$figure.append($img);

				this.$canvasFigure.append($canvas);
				$img.data('canvas', $canvas);

				this.count++;
				// repeat adding for nice look
				if (o == objects.length - 1 && this.count < 8) o = -1;
			}

			if (!$center) $center = this.$figure.find('img').first();
		},

		imgErrorLoad: function (img, src)
		{
			alert("Error load img: " + src);
		},

		imgOnClick: function(img) {
			return this.setCenter($(img));
		},

		imgOnLoad: function(img, $center) {
			var $img = $(img);

			// size K
			var width = $img.width(),
				height = $img.height(),
				sizek = width / height;

			$img.data({
				width: width,
				height: height,
				sizek: sizek
			});

			if ($img.data('center')) {
				this.setCenter($img);
			}

			this.loaded++;
			if (this.loaded == this.count) {
				$center ? this.setCenter($center) : this.setCenterByIndex(0);
			}

			// #8870
			var kWidth = height/img.naturalHeight * img.naturalWidth,
					kHeight = width/img.naturalWidth * img.naturalHeight;
			if (kWidth < width) $img.css('padding', '0 ' + Math.round((width - kWidth)/2) + 'px');
			if (kHeight < height) $img.css('padding', Math.round((height - kHeight)/2) + 'px 0');
		},

		drawCanvas: function($img, params) {
			var $canvas = $img.data('canvas'),
				canvas = $canvas[0],
				ctx = canvas.getContext('2d'),
				deg = params.rotate,
				scale = 1 - 1 / 90 * Math.abs(deg),
				img = document.createElement('img'),
				currentStyle = $img[0].currentStyle;
			// width = $img.data('width'),
			// height = $img.data('height');


			img.src = $img.attr('src');

			img.onload = function() {

				var width = img.width,
					height = img.height,
					numSlices = width * 1,
					sliceWidth = width / numSlices,
					sliceHeight = height,
					heightScale = (1 - scale) / numSlices,
					widthScale = (scale * scale * scale),
					borderRadius = currentStyle.borderRadius.replace('px', '') * 2,
					borderWidth = currentStyle.borderWidth.replace('px', '') * 1,
					borders = [];

				ctx.clearRect(0, 0, width, height);
				canvas.height = height;

				canvas.width = width * widthScale;

				for (var i = numSlices; i >= 0; i--) {
					// Where is the vertical chunk taken from?
					var sx = sliceWidth * i,
						sy = 0,
						koef = i;

					if (deg < 0) {
						koef = numSlices - i;
					}

					// Where do we put it?
					var dx = sliceWidth * i * widthScale,
						dy = (sliceHeight * heightScale * koef) / 2,
						dHeight = sliceHeight * (1 - (heightScale * koef)),
						dWidth = sliceWidth * scale;

					ctx.drawImage(img, sx, sy, sliceWidth, sliceHeight, dx, dy, dWidth, dHeight);

					// save border points
					if (borderWidth) {
						if (i == 0) {
							borders.push({ x: borderWidth / 2, y: dy + borderRadius + borderWidth });
							borders.push({ x: borderWidth / 2, y: dy + dHeight - borderRadius - borderWidth });
						}
						else if (i == borderRadius) {
							borders.push({ x: dx, y: dy + borderWidth / 2 });
							borders.push({ x: dx, y: dy + dHeight - borderWidth / 2 });
						}
						else if (i == (numSlices - 1 - borderRadius)) {
							borders.push({ x: dx, y: dy + borderWidth / 2 });
							borders.push({ x: dx, y: dy + dHeight - borderWidth / 2 });
						}
						else if (i == (numSlices - 1)) {
							borders.push({ x: dx, y: dy + borderRadius });
							borders.push({ x: dx, y: dy + dHeight - borderRadius });
						}
					}
				}

				// draw border
				if (borderWidth) {
					ctx.beginPath();
					ctx.strokeStyle = currentStyle.borderColor;
					ctx.lineWidth = borderWidth;
					ctx.moveTo(borders[2].x, borders[2].y);
					ctx.lineTo(borders[4].x, borders[4].y);
					ctx.quadraticCurveTo(borders[6].x, borders[4].y, borders[6].x, borders[6].y);
					ctx.lineTo(borders[7].x, borders[7].y);
					ctx.quadraticCurveTo(borders[7].x, borders[5].y, borders[5].x, borders[5].y);
					ctx.lineTo(borders[3].x, borders[3].y);
					ctx.quadraticCurveTo(borders[1].x, borders[3].y, borders[1].x, borders[1].y);
					ctx.lineTo(borders[0].x, borders[0].y);
					ctx.quadraticCurveTo(borders[0].x, borders[2].y, borders[2].x, borders[2].y);
					ctx.stroke();
				}

			}
		},

		parsePopups: function() {
			var params = this.model.dataJSON,
				viewwidth = params.viewwidth,
				viewheight = params.viewheight;

			if (viewwidth && viewheight) this.popupCollection = new modelNS.PopupCollection([{
				autoWidth: false,
				closableOnOverlayClick: true,
				id: 'popup',
				height: viewheight,
				width: viewwidth,
				content: "<div class='title'/><div class='pic'/><div class='nav'/>"
			}]);

			// $popup = new modelNS.PopupView({model: this.popupCollection.get('popup')});
			// this.$el.append($popup.render().el);
			// $popup.$el.hide();
		},

		openPopup: function($img) {
			var params = this.model.dataJSON,
				popup = this.popupCollection && this.popupCollection.get('popup'),
				titles = params.titles,
				titleHeight = params.titleHeight,
				heightOutset = (titles && titleHeight || 0) + 60,
				self = this;

			if (popup) {
				$popup = new modelNS.PopupView({ model: popup });
				this.$el.append($popup.render().el);
				$popup.on("PopupShowed", function() {

					self.$el.find('.nav').append(self.$nav.find('.point').clone());
					setImgInPopup($img);
					if (!titles) this.$el.find('.title').hide();

					function setImgInPopup($img) {
						var $clone = $img.clone();
						self.$el.find('.pic').html('').append($clone);
						$clone.height(params.height - heightOutset); // TODO: in settings
						$clone.width((params.height - heightOutset) * $clone.data('sizek'));
						self.$el.find('.title').html($clone.attr('title'));
					}

					self.$el.find('.nav .point').click(function() {
						self.$el.find('.nav .active').removeClass('active');
						$(this).addClass('active');
						self.selectedIndex = $(this).attr('index');
						setImgInPopup(self.$figure.find('img[index=' + self.selectedIndex + ']').first());
					});
				});
				$popup.on("PopupClosedOnCloseBtn", function() {
					self.setCenterByIndex(self.selectedIndex);
				});
			}
		},

		setCenter: function($img) {
			var params = this.model.dataJSON,
				$prev = this.loopPrev($img),
				$next = this.loopNext($img),
				$images = this.$figure.find('img'),
				$center = this.$figure.find('.center'),
				objects = params.objects,
				curIndex = $center.attr('index')
			self = this;

			// this.$center = $img;

			if ($img.hasClass('center')) {
				return this.centerClick($img);
			}

			// slide effect by order (corusel)
			if (!this.gotoID && $center.length && ($img[0] != this.loopPrev($center)[0] && $img[0] != this.loopNext($center)[0])) {
				var direction,
					$searchLeft = $center,
					$searchRight = $center;
				while (!direction) {
					$searchLeft = this.loopPrev($searchLeft);
					$searchRight = this.loopNext($searchRight);
					if ($img[0] == $searchLeft[0]) direction = 'loopPrev';
					if ($img[0] == $searchRight[0]) direction = 'loopNext';
				}

				// this.$figure.addClass('fast');
				function goto() {
					var $goto = self[direction](self.$figure.find('.center'));
					if ($img[0] == $goto[0]) {
						self.gotoID = clearInterval(self.gotoID);
						// self.$figure.removeClass('fast');
					}
					self.setCenter($goto);
				}
				goto();
				this.gotoID = setInterval(goto, 100);

				return;
			}

			$images
				.removeClass('center')
				.removeClass('lleft')
				.removeClass('left')
				.removeClass('rright')
				.removeClass('right')
				.removeClass('leftback')
				.removeClass('rightback')

			var figureWidth = this.$figure.width(),
				maxHeight = params.height - params.navHeight,
				centerWidth = figureWidth / 2,
				centerHeight = centerWidth / $img.data('sizek'),
				sideWidth = figureWidth * 0.25;

			if (centerHeight > maxHeight) {
				centerHeight = maxHeight;
				centerWidth = maxHeight * $img.data('sizek');
			}

			var centerTop = (maxHeight - centerHeight) / 2;

			this.animateImg($img, 'center', this.centerParams = {
				width: centerWidth,
				height: centerHeight,
				left: figureWidth / 2 - centerWidth / 2,
				top: centerTop,
				rotate: 0,
				zIndex: 4
			});

			this.animateImg($prev, 'left', {
				width: figureWidth / 4,
				height: centerHeight * 0.7,
				left: figureWidth / 4 - sideWidth + figureWidth * 0.03,
				top: centerTop + centerHeight * 0.3 / 2,
				rotate: -30,
				zIndex: 3
			});

			var $first = this.loopPrev($prev);
			this.animateImg($first, 'lleft', {
				width: figureWidth * 0.1,
				height: centerHeight * 0.5,
				left: 0,
				top: centerTop + centerHeight * 0.5 / 2,
				rotate: -40,
				zIndex: 2
			});

			this.animateImg($next, 'right', {
				width: figureWidth / 4,
				height: centerHeight * 0.7,
				left: figureWidth / 4 * 3 - figureWidth * 0.03,
				top: centerTop + centerHeight * 0.3 / 2,
				rotate: 30,
				zIndex: 3
			});

			this.animateImg(this.loopNext($next), 'rright', {
				width: params.width * 0.1,
				height: centerHeight * 0.5,
				left: figureWidth / 4 * 3 + figureWidth * 0.14,
				top: centerTop + centerHeight * 0.5 / 2,
				rotate: 40,
				zIndex: 2
			});

			var length = $images.length - 5;
			for (var i = 0; i < length; i++) {

				var className = i < Math.floor(length / 2) && 'leftback' || i > length / 2 && 'rightback' || '';

				this.animateImg($first = this.loopPrev($first), className, {
					width: 200,
					height: centerHeight * 0.3,
					left: (figureWidth - figureWidth * 0.2) / length * (i + 0.5) - 100 + figureWidth * 0.1,
					top: centerTop + centerHeight * 0.5 - centerHeight * 0.3 / 2,
					rotate: className == 'leftback' && -100 || className == 'rightback' && 100 || false,
					zIndex: 0
				});

			}

			// nav points
			this.$nav.find('.active').removeClass('active');
			this.$nav.find('div[index=' + $img.attr('index') + ']').addClass('active');

			this.selectedIndex = $img.attr("index");

			this.onSetCenter();
		},

		animateImg: function($img, className, params) {
			$img.addClass(className);

			if (isIE() == 9) { // using jQuery js animations

				var $canvas = $img.data('canvas');

				// perspective outsets and size changes
				var figureWidth = this.$figure.width() / 2,
					widthK = 1 - (figureWidth - Math.abs(figureWidth - (params.left + params.width / 2))) / figureWidth,
					perspectiveWidth = 1 / 90 * Math.abs(params.rotate) * params.width * widthK * 2;
				// console.log(className, perspectiveWidth, widthK)
				params.width = params.width - perspectiveWidth;
				params.left += perspectiveWidth / 2;
				var perspectiveHeight = 1 / 90 * Math.abs(params.rotate) * params.width;
				params.height += perspectiveHeight;
				params.top -= perspectiveHeight / 2;
				// console.log(className, perspectiveHeight)


				$canvas.stop().animate(params, 300);

				this.drawCanvas($img, params);

			}	else { // using css animations

				$img
					// .width(params.width)			// #8870
					.css('width', params.width)	// #8870
					.height(params.height)
					.css('left', params.left)
					.css('top', params.top)

			}
		},

		setCenterByIndex: function(index) {
			var $center = this.$figure.find('.center'),
				curIndex = $center.attr('index');

			if (curIndex === undefined) {
				return this.setCenter(this.$figure.find('img:first-child'));
			}

			if ($center.length && curIndex == index) return;

			if (index > curIndex) {
				while (index != curIndex) {
					$center = this.loopNext($center);
					curIndex = $center.attr('index');
				}
			}
			else {
				while (index != curIndex) {
					$center = this.loopPrev($center);
					curIndex = $center.attr('index');
				}
			}

			this.setCenter($center);
		},

		loopPrev: function($el) {
			var $prev = $el.prev();
			return $prev.length ? $prev : $el.parent().children().last();
		},

		loopNext: function($el) {
			var $next = $el.next();
			return $next.length ? $next : $el.parent().children().first();
		}

	});

})();


/* ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||*/
/* ------------------------------- TabLayout --------------------------------------*/

modelNS.PaneModel = Backbone.Model.extend({});

modelNS.PaneCollection = Backbone.Collection.extend({
	model: modelNS.PaneModel
});



/**
 * Табы в панеле
 *
 * @example Как создать:
 *  var tabsPane = new modelNS.TabsLayout({
            collection: new modelNS.PaneCollection([
                { title: 'Tab1', content: $(..) },
                { title: 'Tab2', content: $(..) }
            ]),
            parent: $parent
        }).render();
 *
 * @example
 *
 */
modelNS.TabsLayout = modelNS.SingleLayout.extend({
	className: 'single-layout tabs-layout',
	events: {
		'click .tabs-layout-bar>.title-bar': 'titleBarClick',
	},
	initialize: function(options) {

		modelNS.SingleLayout.prototype.initialize.apply(this, arguments);

		this.panels = [];
		this.collection = options.collection;
		this.collection.each(function (model) {
			if (model.attributes.hasContent === undefined) model.attributes.hasContent = true;
			this.panels.push(new modelNS.SingleLayout(model.attributes));
		}, this);

		// this.columns = options.columns;
		// this.verticalAlign = options.verticalAlign;

		this.activeTab = options.activeTab || 0;
	},
	render: function() {
		modelNS.SingleLayout.prototype.render.apply(this, arguments);

		this.$tabbar = $('<div class="tabs-layout-bar title-bar"/>')
				.attr('columns', this.panels.length)
				.appendTo(this.$el);

		for (var i=0; i<this.panels.length; i++) {
			var panel = this.panels[i].render();
			panel.$head.appendTo(this.$tabbar);
			(panel.$contentWrap || panel.$content)
				.addClass('tab-layout-content')
				.appendTo(this.$el);
		}

		this.activateTab(this.panels[this.activeTab].$head);

		return this;
	},
	titleBarClick: function (event) {
		var $tab = $(event.currentTarget);
		this.activateTab($tab);
	},
	activateTab: function ($tab) {
		this.$el.find('.tabs-layout-bar>.title-bar').removeClass('active');
		this.$el.find('>.tab-layout-content').hide();
		$tab.addClass('active');
		var panel = this.panels[$tab.index()];
		(panel.$contentWrap || panel.$content).show();
		this.trigger("TabActivated", panel);
	},
	activateTabByIndex: function (index) {
		this.activateTab(this.panels[index].$head);
	}
})

//-------------------------- Color slider View -----------------------------------

modelNS.ColorSlider = Backbone.View.extend({
    className: 'input-view',
    initialize: function (options) {
        this.parent = options.parent;
        this.width = options.width;
        this.cls = options.cls;
        this.step = options.step || 1;
        this.row = options.row;
        this.min = options.min;
        this.max = options.max;
        this.value = options.value;
        this.title = options.title;
    },
    render: function () {
        var _this = this;

        this.$parent = this.parent;

        if (this.row) {
            this.$row = $('<div class="row-view"/>').appendTo(this.parent);
            this.$parent = this.$row;
        }

        this.slider = $('<div class="color-slider"></div>');

        if (this.cls) {
            this.slider.addClass(this.cls);
        }

        if ((this.value && this.min) && (this.value < this.min)) {
            this.value = this.min;
        }
        if ((this.value && this.max) && (this.value > this.max)) {
            this.value = this.max;
        }
        if (!this.value) {
            this.value = this.min;
        }

        this.slider.slider({
            value: this.value,
            min: this.min,
            max: this.max,
            step: this.step,
            orientation: "horizontal",
            slide: function (event, ui) {
                _this.trigger('Slide', event, ui);
                _this.colorPicker.css('background-color', this.waveLengthToRgb(ui.value))
            },
        })

        if (parent) {
            this.$parent.append(this.slider);
        }

        if (this.width) {
            this.slider.width(this.width);
        }

        if (this.title) {
            this.slider.attr('title', this.title);
        }

        var gap = this.max - this.min;
        var steps = 50;
        var stepSize = gap / steps;
        var gradientString = 'linear-gradient(90deg';

        for (var i = 0; i < steps; i++) {
            var currentLambda = this.min + stepSize * i;
            gradientString += ', ' + this.waveLengthToRgb(currentLambda);
        }
        gradientString += ')';
        this.slider.css('background-image', gradientString);

        this.colorPicker = this.slider.find('span.ui-slider-handle');
        this.setValue(this.getValue());

        return this;
    },
    validateValue: function (val) {
        if ((this.max && this.min) && ((val >= this.min) && (val <= this.max))) {
            return true;
        }
        return false;
    },
    setValue: function (val) {
        if (!this.validateValue(val)) return false;
        this.slider.slider('option', 'value', val);
        this.colorPicker.css('background-color', this.waveLengthToRgb(val))
    },
    getValue: function () {
        return this.slider.slider('value');
    },
    waveLengthToRgb: function (wavelength) {
        function componentToHex(c) {
            var hex = c.toString(16);
            return hex.length == 1 ? "0" + hex : hex;
        }
        function rgbToHex(r, g, b) {
            return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
        }

        var gamma = 0.5;
        var intensityMax = 255;

        if ((wavelength >= 380) && (wavelength < 440)) {
            red = -(wavelength - 440) / (440 - 380);
            green = 0.0;
            blue = 1.0;
        } else if ((wavelength >= 440) && (wavelength < 490)) {
            red = 0.0;
            green = (wavelength - 440) / (490 - 440);
            blue = 1.0;
        } else if ((wavelength >= 490) && (wavelength < 510)) {
            red = 0.0;
            green = 1.0;
            blue = -(wavelength - 510) / (510 - 490);
        } else if ((wavelength >= 510) && (wavelength < 580)) {
            red = (wavelength - 510) / (580 - 510);
            green = 1.0;
            blue = 0.0;
        } else if ((wavelength >= 580) && (wavelength < 645)) {
            red = 1.0;
            green = -(wavelength - 645) / (645 - 580);
            blue = 0.0;
        } else if ((wavelength >= 645) && (wavelength < 781)) {
            red = 1.0;
            green = 0.0;
            blue = 0.0;
        } else {
            red = 0.0;
            green = 0.0;
            blue = 0.0;
        };

        // Let the intensity fall off near the vision limits
        if ((wavelength >= 380) && (wavelength < 420)) {
            factor = 0.3 + 0.7 * (wavelength - 380) / (420 - 380);
        } else if ((wavelength >= 420) && (wavelength < 701)) {
            factor = 1.0;
        } else if ((wavelength >= 701) && (wavelength < 781)) {
            factor = 0.3 + 0.7 * (780 - wavelength) / (780 - 700);
        } else {
            factor = 0.0;
        };

        // Don't want 0^x = 1 for x <> 0
        red = ((red == 0.0) ? 0 : Math.round(intensityMax * Math.pow(red * factor, gamma)));
        green = (green == 0.0) ? 0 : Math.round(intensityMax * Math.pow(green * factor, gamma));
        blue = (blue == 0.0) ? 0 : Math.round(intensityMax * Math.pow(blue * factor, gamma));
        var color = rgbToHex(red, green, blue);
        return color;
    },
    getCurrentColor: function () {
        return this.waveLengthToRgb(this.getValue());
    },
});


function isIE() {
	var myNav = navigator.userAgent.toLowerCase();
	var ie = (myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1]) : false;
	if (!ie) ie = !!window.MSInputMethodContext && !!document.documentMode && 11;
	return ie;
}
modelNS.isIE = $.isIE = isIE();

function isEdge() {
	return !$.isIE && !!window.StyleMedia;
}
modelNS.isEdge = $.isEdge = isEdge();


// for IE when need be calculated offset with scale
if (!$.fn._offset) {
	$.fn._offset = $.fn.offset;
	$.fn.offset = function() {
		var offset = $.fn._offset.apply(this, arguments);
		if ($.zoomScale) offset.left /= $.zoomScale;
		return offset;
	}
}

// fix css transform(scale) of slider wich used in baseModels
if ($.ui) $.widget("ui.slider", $.ui.slider, {
	_create: function() {
		this._super.apply(this, arguments);
		this.baseModel = $('.base-model').is(':visible');	// .length // иначе  если перейти на обычный слайд от корусели, посчитает что есть base-model
	},
	_mouseCapture: function(event) {
		if (this.baseModel && $.isIE) $.zoomScale = courseML.zoomScale;
		this._super(event);
		if (this.baseModel && $.isIE) $.zoomScale = false;
		return true;
	},
	_mouseDrag: function(event) {
		if (this.baseModel && $.isIE) $.zoomScale = courseML.zoomScale;
		this._super(event);
		if (this.baseModel && $.isIE) $.zoomScale = false;
	},
	_normValueFromMouse: function(position) {
		if (this.baseModel) {
			this.elementSize.width = this.element.outerWidth() * CourseConfig.zoomScale * (courseML.zoomScale||1);
			this.elementOffset.left = this.element.offset().left * (courseML.zoomScale||1);
			if (this._clickOffset) this._clickOffset.left = 0;
		}

		return this._super(position);
	}
});

// fix scale and draggable
if ($.ui) $.widget("ui.draggable", $.ui.draggable, {
	_create: function() {
		this._super.apply(this, arguments);

		if (this.options.zoomfix === undefined) {
			this.options.zoomfix = this.handleElement.parents('.base-model').length;
		}
	},

	_generatePosition: function(event, constrainPosition ) {
		var position = this._super.apply(this, arguments);

		if (!this.options.zoomfix) {
			return position;
		}

		this.originalLeft = position.left;
		this.originalTop = position.top;

		// console.log(event.pageX, this.offset.click.left, this.offset.relative.left, this.offset.parent.left)

		// fix board mouse react equip and indicator micro DD
		position.top /= CourseConfig.zoomScale;
		position.left /= CourseConfig.zoomScale;


		return position;
	},

	_convertPositionTo: function(d, pos) {
		var position = this._super.apply(this, arguments);

		if (!this.options.zoomfix) {
			return position;
		}

		if (d === "absolute") {	// ???
			position.top = position.top + this.originalTop - this.position.top;
			position.left = position.left + this.originalLeft - this.position.left;
		}

		return position;
	},

	// fix containment: 'parent' #8911
	_setContainment: function ()
	{
		if (!this.options.zoomfix) { // когда конфликт с базовыми заданиями
			return this._super.apply(this, arguments);
		}

		this._super.apply(this, arguments);
		if (this.options.containment && this.options.containment.constructor !== Array) {	// ???? where is used?
			this.containment[2] *= CourseConfig.zoomScale;
			this.containment[3] *= CourseConfig.zoomScale;
		}
	}
});


// fix scale and dropabble
if ($.ui) {
	if (!$.ui.ddmanager._fix_prepareOffsets) {
		$.ui.ddmanager._fix_prepareOffsets = true;
		var prepareOffsets = $.ui.ddmanager.prepareOffsets;
		$.ui.ddmanager.prepareOffsets = function(t, event) {
			prepareOffsets.apply(this, arguments);

			var i,
				m = $.ui.ddmanager.droppables[t.options.scope] || [];

			for (i = 0; i < m.length; i++) {
				var proportions = m[i].proportions();
				m[i].proportions({ width: proportions.width * CourseConfig.zoomScale, height: proportions.height * CourseConfig.zoomScale });
			}
		};
	}
}



// add non step-aligned values in slider
// - linear
// - logarithmic
if ($.ui) $.widget("ui.slider", $.ui.slider, {
	_trimAlignValue: function(val) {
		var scaleValues = this.options.scaleValues;

		if (scaleValues) {

			if (val <= this._valueMin()) {
				return this._valueMin();
			}
			if (val >= this._valueMax()) {
				return this._valueMax();
			}

			var min = this.options.min,
				max = this.options.max,
				closestIndex = 0,
				closestValue = Infinity;

			for (var i = 0; i < scaleValues.length; i++) {
				var dist = Math.abs(val - scaleValues[i]);
				if (closestValue > dist) {
					closestIndex = i;
					closestValue = dist;
				}
			}

			return scaleValues[closestIndex];

		}
		else {
			return this._super.apply(this, arguments);
		}
	}
});


if ($.ui) $.widget("ui.tooltip", $.ui.tooltip, {
	// оптимизация тултипов, для IE настраиваем fps
	open: function(event, target, content) {
		if ($.isIE && event) {
      var fps = 5,
          self = this,
					target = $( event ? event.target : this.element ),
					_super = this._super;

      this.openArguments = arguments;
      if (!this.openTimer) {
				this.openTimer = setTimeout(function () {
					_super.apply(self, self.openArguments);
          self.openTimer = null;
        }, 1000/fps);
			}
			this._registerCloseHandlers(event, target);
    } else {
      this._super.apply(this, arguments);
    }
	},
	close: function ()
	{
		if ($.isIE) {
			this.openTimer = clearTimeout(this.openTimer);
		}
		this._super.apply(this, arguments);
	},
	// open: function(event, target, content) {
	// 	if (!this.tooltip) {
	// 		this._super.apply(this, arguments);
	// 	} else {
	// 		target.attr( "title", "" );
	// 		this.tooltipData.tooltip.appendTo( this._appendTo( this.tooltipData.element ) );
	// 		this.tooltipData.tooltip.show();
	// 	}
	// },
	// _tooltip: function () {
	// 	if (!this.tooltipData) {
	// 		var tooltipData = this._super.apply(this, arguments);
	// 		this.tooltipData = tooltipData;
	// 	}
	// 	return this.tooltipData;
	// }

	// fix <... title="..." support html tags
	options: {
		content: function() {
			return $(this).attr('title');
		},
		show: {},	// fix не понятный баг в буидере для РЭШ, может быть потому что чего-то не хватает
		hide: {},
	}
});


if ($.ui) $.widget( "ui.selectmenu", $.ui.selectmenu, {
	_position: function() {
	  this.menuWrap.css({top:0, left:0});	// fix bug 2й раз позиция меню открывается неверно
		this.menuWrap.position( $.extend( { of: this.button }, this.options.position ) );
	},
})



Math.logb = function(number, base) {
	return Math.log(number) / Math.log(base);
};

if (!Math.log10) Math.log10 = function(num) {
	return Math.logb(num, 10)
}


function shadeColor(color, percent) {
		var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
		return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
}


Math.roundDec = function (num, round)
{
  return Math.round((num*1 + 0.00001) * Math.pow(10, round||0)) / Math.pow(10, round||0);
}

Math.round00 = function (num)
{
 	return Math.roundDec(num, 2);
}



/* functions with for work with colors ===============- */
modelNS.colorUtils = {

	colorToString: function (color) {
		if (typeof(color) == "object") {
			return "rgb("+color[0]+","+color[1]+","+color[2]+")";
		}
		return color;
	},

	hex: function (c) {
	  var s = "0123456789abcdef";
	  var i = parseInt (c);
	  if (i == 0 || isNaN (c))
	    return "00";
	  i = Math.round (Math.min (Math.max (0, i), 255));
	  return s.charAt ((i - i % 16) / 16) + s.charAt (i % 16);
	},

	/* Convert an RGB triplet to a hex string */
	convertToHex: function (rgb) {
	  return this.hex(rgb[0]) + this.hex(rgb[1]) + this.hex(rgb[2]);
	},

	/* Remove '#' in color hex string */
	trim: function (s) {
		return (s.charAt(0) == '#') ? s.substring(1, 7) : s;
	},

	/* Convert a hex string to an RGB triplet */
	convertToRGB: function (hex) {
	  var color = [];
	  color[0] = parseInt ((trim(hex)).substring (0, 2), 16);
	  color[1] = parseInt ((trim(hex)).substring (2, 4), 16);
	  color[2] = parseInt ((trim(hex)).substring (4, 6), 16);
	  return color;
	},

	// return rgba array[length = 4];
	colorToArray: function (color) {
		if (!color) return "";
		var rgba;
		if (color.indexOf('#') == 0) {
			rgba = convertToRGB(color);
		} else if (color.indexOf('rgb') == 0) {
			rgba = color.replace(/rgba?\((.*?)\)/gi, '$1').split(/ ?\, ?/); // могут быть проблемы если пробелы
		} else {
			rgba = color.slice(0); // color is array, if changed in animation then must be not change original
		}
		if (rgba.length < 4) rgba[3] = 1;
		return rgba;
	},

	isWhited: function (color) { return color[0] > 240 && color[1] > 240 && color[2] > 240 }

};

function colorToString (color) { return modelNS.colorUtils.colorToString(color) }
function hex (c) { return modelNS.colorUtils.hex(c) }
function convertToHex (rgb) { return modelNS.colorUtils.convertToHex(rgb) }
function trim (s) { return modelNS.colorUtils.trim(s) }
function convertToRGB (hex) { return modelNS.colorUtils.convertToRGB(hex) }
function colorToArray (color) { return modelNS.colorUtils.colorToArray(color) }

/* -=======================================- */

modelNS.valueToLabel = function (value)
{
  //return value.toString().replace(".", ",") // #12059 Закомментил
    return value.toString().replace(/(\d+)\.(\d+)/, "$1,$2") // #12059 Точка меняется на запятую только между двумя числами
		.replace(/(\d|^| |>)(-)(.*)/, "$1<span class='verdana'>–</span>$3");	// #9714, слово-слово - не заменяем на длинное тире
}

modelNS.FileManager = $.extend({
	files: [],
	onReady: function (name, fn, obj) {
		if (this.files[name] == 'ready') {
			fn.apply(obj);
		} else {
			this.once("ready:" + name, function () {
				fn.apply(this);
			}, obj);
		}
	},
	loadFile: function (options) {

		var src = options.src,
				name = options.name || options.src,
				self = this;

		if (this.files[name]) {
			return;
		}

		this.files[name] = 'loading';

		courseML.loadScript(src, function () {
			var i = 0;
			var interval = setInterval(function() {
				if (self.isLoaded(src)) {
						self.trigger("loaded:"+name);
						self.trigger("ready:"+name);
						self.files[name] = 'ready';
						clearInterval(interval);
				} else if (i == 1000) {
					try {
						self.onFailed(options);
						document.body.removeChild(script);
					} catch(e) {}
				clearInterval(interval);
			}
			i++;
			}, 10);
		});
	},
	onFailed: function (options)
	{
		console.warn('filed load animation: ' + (options.name||options.src));
		self.trigger("failed:"+(options.name||options.src));
	},
	isLoaded: function (path)
	{
		return courseML.checkIfScriptExists(path);
	}
}, Backbone.Events);


// requestAnimationFrame polifyll
(function() {
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame =
          window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());



/* ---------------- NUMBERS --------------- */
Math.round00 = function (num)
{
	return Math.round((num + 0.00001) * 100) / 100;
}

Math.parseFloat = function (str)
{
  return parseFloat(str.replace(",",'.'));
}

modelNS.parseFloat = function (str) {
	return Math.parseFloat($('<div/>').html(str).text().replace("–", '-'));
}
/* ---------------- NUMBERS --------------- */


// Converts from degrees to radians.
Math.radians = function(degrees) {
  return degrees * Math.PI / 180;
};

// Converts from radians to degrees.
Math.degrees = function(radians) {
  return radians * 180 / Math.PI;
};

// Гипотенуза ES5 support
Math.hypot = Math.hypot || function(x, y){ return Math.sqrt(x*x + y*y) }
