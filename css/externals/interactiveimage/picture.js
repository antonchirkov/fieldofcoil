// TODO: переделать код более правильный по структуре
//		- SingleLayout
//		- im-model - BaseModelView.render();

function Picture(xmlData, wrapper, basePath, params) {
	this.init = function() {
		// model = new modelNS.modelNS.BaseModel();
		return new modelNS.InteractiveImage({model: new modelNS.InteractiveImageModel({
				xmlData : xmlData,
				wrapper : wrapper,
				basePath : basePath,
				params : params,
				restyling: "title"
			})
		}).renderOnShow();
	};
}


modelNS.InteractiveImageModel = modelNS.BaseModel.extend({
	defaults: _.extend({}, modelNS.BaseModel.prototype.defaults, {
		width: 800,
		height: 600,
	}),

	initialize: function(options) {
		modelNS.BaseModel.prototype.initialize.apply(this, arguments);
	},

	parseXML: function(xmlData) {
		modelNS.BaseModel.prototype.parseXML.apply(this, arguments);

			var pictureParams = {},
					data = $(typeof(xmlData) == 'string' ? $.parseXML(xmlData) : xmlData),
					iPicture = $(data.find('ipicture').get(0)),
					types = iPicture.find('type'),
					hascontrolsPanel = false;

			pictureParams.typespoint = iPicture.attr('typespoint');
			pictureParams.typesHeight = iPicture.attr('typesHeight') != void 0
				? iPicture.attr('typesHeight')*1 : false; // #8968 Добавлена проверка на наличие атрибута для установки значения по-умолчанию
			pictureParams.typesColumn = iPicture.attr('typesColumn') != void 0
				? iPicture.attr('typesColumn')*1 : 1; // #8968 Добавлена проверка на наличие атрибута для установки значения по-умолчанию

			// pictureParams.width = $wrapper.data('width') ? $wrapper.data('width') :
			// 						 iPicture.attr('width') ? iPicture.attr('width') : DEFAULT_WIDTH;
		 //
		 // pictureParams.height = $wrapper.data('height') ? $wrapper.data('height') :
			// 						 iPicture.attr('height') ? iPicture.attr('height') : DEFAULT_HEIGHT;
		 //
			// if (pictureParams.width < MIN_WIDTH) pictureParams.width = MIN_WIDTH;
			// if (pictureParams.width > MAX_WIDTH) pictureParams.width = MAX_WIDTH;
		 //
			// if (pictureParams.height < MIN_HEIGHT) pictureParams.height = MIN_HEIGHT;
			// if (pictureParams.height > MAX_HEIGHT) pictureParams.height = MAX_HEIGHT;

			pictureParams.title = iPicture.attr('title');
			pictureParams.link = iPicture.attr('link');

			pictureParams.menuwidth = iPicture.attr('menuwidth') || 250;
			if (pictureParams.menuwidth && pictureParams.menuwidth < 0) pictureParams.menuwidth = 250;

			pictureParams.menu = iPicture.attr('menu') == 'false' || true;

			pictureParams['types'] = [];

			for (var i = 0; i < types.length; i++) {
				var $currType = $(types[i]),
						name = $currType.attr('name'),
						type = {
							id: $currType.attr('id'),
							name: name && courseML.postProcessingCourseML(name) || "",
							width: $currType.attr('width'),
							height: $currType.attr('height'),
							file: $currType.attr('file'),
							def: $currType.attr('default') == 'true',
							toggle: $currType.attr('toggle') != 'false' && $currType.attr('toggle') != 'no',
							hidden: $currType.attr('hidden') == 'true' || $currType.attr('hidden') == 'yes' || $currType.attr('hidden') == 'hidden'
						};

				// console.log(type.width, type.height, maxWidth, width, hascontrolsPanel);
				// continue;

				type.backbutton = type.hidden ? ($currType.attr('backbutton') == 'true') : false;

				if (type.toggle) hascontrolsPanel = true;

				pictureParams.types.push(type);
			}

			// Correcting sizes after we know is has right panel
			var maxWidth = pictureParams.width*1,
					maxHeight = pictureParams.height*1 - (pictureParams.title);

			if (pictureParams.typespoint == 'top') {
				maxHeight -= pictureParams.typesHeight + 13 + 4; // 13 - sep compensation, 4 - border
			} else {
				maxWidth -= (hascontrolsPanel ? pictureParams.menuwidth*1 + 13 : 0); // 13 - sep
			}

			for (var i = 0; i < types.length; i++) {

				var $currType = $(types[i]),
				 		type = pictureParams.types[i];

						// ????? не может быть определено тут, потому что размер заголовка - динамический
				// 		width = type.width,
				// 		height = type.height,
				// 		scaleK = Math.min(maxWidth/(width||maxWidth), maxHeight/(height||maxHeight));
				//
				// type.width = width && width * scaleK || maxWidth;
				// type.height = height && height * scaleK || maxHeight;

				type.layers = parseLayers($currType);
			}

			popupCollection = this.popupCollection;

			function parseLayers(data) {
				var $layers = $(data).find('layers');

				if ($layers.length == 0) {
					console.warn('layers length: 0');
					return;
				}

				/************************* Изменения для #8754 *******************/
				// Превращаем layers в массив, чтобы разделить переключатели на подгруппы
				var layers = [];

                // Сюда запишем данные о всех <layer> независимо от <layers> в <type>, чтобы не было ошибок в других функциях
				// Много мест где код пытается получить доступ к type.layers.items
				layers.items = [];

				// Флаг для установки, что есть <layers> с radio="true"
				var hasRadio = false;

				$layers.each(function() {
					var $this = $(this);
					var layerItems  = [];
					if ($this.attr('radio') == 'true') {
                        hasRadio = true;
					}
					$this.find('layer').each(function() {
                        var $layer = $(this),
                            name = $layer.attr('name'),
                            layer = {
                                id : $layer.attr('id'),
                                name : name && courseML.postProcessingCourseML(name) || "",
                                file : $layer.attr('file'),
                                toggle : $this.toggle && $layer.attr('toggle') != 'no',
                                multimedia : $layer.attr('multimedia'),
                                elements : parseElements($layer),
                                startEnable: $layer.attr('startEnable') === 'true' ? true : false
                            };
                        layerItems.push(layer);
                        layers.items.push(layer);
					});
					layers.push({
                        name : $this.attr('name') || '',
                        toggle : $this.attr('toggle') != 'no',
                        radio : $this.attr('radio') == 'true', // Это свйоство отсюда возможно стоит удалить, потому что оно записывается в отдельное свойство
                        items : layerItems,
						file: $this.attr('file')
					});
				});

				// Если в каком-то из <layers> установлено radio="true", то все <layers> в <type> делаем radio
				// Для поддержки старого кода и проверки из type.layers.radio запишем его в отдельное свойство, а не в каждый элемент массива с layers
				if (hasRadio) {
                    layers.radio = true
				}
                /************************* Изменения для #8754 *******************/

                /************** Код до изменений #8754. Со временем удалить этот блок ***************/
                /*var layers = {
                    name : $layers.attr('name') || '',
                    toggle : $layers.attr('toggle') != 'no',
                    radio : $layers.attr('radio') == 'true',
                    items : []
                };

                $layers.find('layer').each(function() {
                    var $this = $(this),
                            name = $this.attr('name'),
                            layer = {
                                id : $this.attr('id'),
                                name : name && courseML.postProcessingCourseML(name) || "",
                                file : $this.attr('file'),
                                toggle : layers.toggle && $this.attr('toggle') != 'no',
                                multimedia : $this.attr('multimedia'),
                                elements : parseElements($this),
                                startEnable: $this.attr('startEnable') === 'true' ? true : false
                            };

                    layers.items.push(layer);
                });*/
                /************** Код до изменений #8754. Со временем удалить этот блок ***************/

				return layers;
			}

			function parseElements(data) {
				var result = [];
				data.find('element').each(function() {
					var $this = $(this),
							element = {
								svgregion : $this.attr('svgregion'),
								audio : $this.attr('audio'),
								link : $this.attr('link'),
								title : courseML.getHTMLFromCourseML($this),
							};
					result.push(element);
				});
				return result;
			}

			this.hascontrolsPanel = hascontrolsPanel;

			return pictureParams;

	}
});





modelNS.InteractiveImage  = modelNS.BaseModelView.extend({
	type: "ipicture",
	initialize: function(options) {
		modelNS.BaseModelView.prototype.initialize.apply(this, arguments);

		this.options = options;

		this.loadingStatus = {busy: false, isLoaded: false};
	},
	render: function () {
			modelNS.BaseModelView.prototype.render.apply(this, arguments);

			this.$el.addClass('interactive-image');

			this.previousLayers = [];
			this.$popup = null;
			this.$multimediaBtn = $('<div class="mult-btn play"></div>');	// ???

			var options = this.options,
					wrapper = options.wrapper,
					data = options.xmlData,
					params = options.params,
					basePath = this.model.basePath;

						var self = this,
							jsonData = this.model.dataJSON,
							hascontrolsPanel = this.model.hascontrolsPanel,
							$container = $(wrapper),
							// $wrapper = $('<div class="container interactive-image base-model im-model"></div>'),
							$wrapper = this.$el,
							$backBtn = $('<div class="back-btn">Назад</div>'),
							$switchersPanel,
						    $switchWrapper,
						    popupCollection,
						    activeLayerID,
								MIN_WIDTH = 0, // 400,
								MAX_WIDTH = 1200,
								MIN_HEIGHT = 0, // 300,
								MAX_HEIGHT = 1000,
						    // DEFAULT_WIDTH = 800,
						    // DEFAULT_HEIGHT = 600,
							logging = false;

						this.log = function(msg) {
							if (logging) {
								console.log(msg);
							}
						};

						this.layers = {};
						this.audios = {};

						this.renderLayout();
						this.renderTypes();

						// Инициализация интерактивного рисунка
						this.init = function() {
							var jsonData = this.model.dataJSON;
							// self.log('Json data: ' + JSON.stringify(jsonData));

							$wrapper.addClass('loading'); // не рендерится лайот
							$container.append($wrapper);
						    $switchWrapper = $($wrapper.find('#switchers .mcontent')[0]);
						    // $switchersPanel = $($wrapper.find('.switchers-panel')[0]);
						    // $switchersPanel.append(self.$multimediaBtn);
						    // $switchersPanel.append($backBtn);
						    self.$multimediaBtn.click(function() {
						    	if ($(this).hasClass('play')) {
						    		$(this).removeClass('play');
						    		$(this).addClass('pause');
						    	} else {
						    		$(this).removeClass('pause');
						    		$(this).addClass('play');
						    	}
						    });
						    $backBtn.click(function() {
						    	self.goBack();
						    });

							var svgData = {};

							renderSwithers();
							renderModelTitle ();
							renderMenu ();
							renderPopups();

							var interval = setInterval(function() {
								self.log('Waiting...');
								for (var i = 0; i < jsonData.types.length; i++) {
									var type = jsonData.types[i];
									if ((type.file || '') && (!(type.loaded || '') && !(type.error || ''))) {
										return;
									}
									for (var k = 0; k < type.layers.items.length; k++) {
										var layer = type.layers.items[k];
										if (!(layer.loaded || '') && !(layer.error || '')) {
											return;
										}
									}
								}
								var width = $wrapper.find('#layers .type').first().width(),
									height = $wrapper.find('#layers .type').first().height();
								if ($switchWrapper.find('.switchers').length != 0 && hascontrolsPanel) {
									width += $switchWrapper.find('.switchers').outerWidth();
								}

					//			var scale = $container.width() / width;
								var scale = 1;
								// var height = height * scale;
								self.log('Scale...' + scale);
								$wrapper.css({'-moz-transform': 'scale(' + scale + ')',
											  '-webkit-transform': 'scale(' + scale + ')',
											  '-o-transform': 'scale(' + scale + ')',
											  'transform': 'scale(' + scale + ')'});
								$wrapper.removeClass('loading');
								// if (!hascontrolsPanel) {
								// 	$wrapper.find('.right-panel').hide();
								// 	$wrapper.find('.separate').hide();
								// 	$wrapper.addClass('no-right');
								// }
								clearInterval(interval);

								$wrapper.height(jsonData.height).width(jsonData.width);	// ?? old
								// if (jsonData.typespoint == 'top') {
									// $wrapper.find('.top-panel .border').height(jsonData.typesHeight);
								// } else {
									// $wrapper.find('.border').css('height',jsonData.height*1); // +2 fix ie9 + 2px for border width top+bottom // fix wrong height calculated, и залаиет по углам снизу на рамки в board
								// }

								// height 100% of left menu panel items
								// var $switchers	= $wrapper.find('#switchers')
								// if ($switchers.is(":visible")) {
								// 	var switchersHeight = $switchers.height();
								// 	$wrapper.find('.switchers-panel').css({
								// 		paddingTop : switchersHeight,
								// 		marginTop : -switchersHeight
								// 	});
								// }

								resizeRadioGroup();	// #9158
								// $wrapper.base-radiobutton

							}, 100);
						};

						function resizeRadioGroup ()
						{
							//if (jsonData.typespoint == 'top') { // #8754 Закомментил

							//} else { // #9158 //#8754 Закомментил
								// TODO: alignMiddle ?
								var $radiobuttons = $switchWrapper.find('.base-radiobutton:visible'),
										height = 0,
										panelHeight = $switchWrapper.height(); // #10832 // - 20; compensation

								$radiobuttons.each(function () {
									height += this.offsetHeight;
								});

								var outset = Math.floor((panelHeight - height)/($radiobuttons.length*2));

								if (outset) {
									// $radiobuttons.css({marginTop: outset, marginBottom: outset});
									$switchWrapper.find('.radiobutton-group').css({ // #10832
										//height: '100%', // #8754 Закомментил
										height: 'auto', // #8754 В одной вкладке возможны несколько групп радиокнопок. Одна группа не должна занимать всю высоту вкладки
										overflow: 'hidden',
									})
								}
							//} // #8754 Закомментил
						}

						function renderMenu ()
						{
							// $wrapper.find("#switchers").width(jsonData.menuwidth);
							if (jsonData.menu) {
								$wrapper.find(".right-panel").width(jsonData.menuwidth);
							} else {
								$wrapper.find(".right-panel").hide();
								$wrapper.find(".separate").hide();
							}
						}

						function renderModelTitle ()
						{
							// if (jsonData.title) {
								// $wrapper.find('.title-bar').html(jsonData.title);
								// $wrapper.find('.left-panel .border').addClass('has-title');
							// }
							if (jsonData.link) {
								$wrapper.find('.info').click(function () {
									var popupId = jsonData.link;
									if (popupId) {
										var popup = popupCollection.get(popupId);
										if (popup) {
											self.$popup = new modelNS.PopupView({model: popup});
											// this.handlePopups($popup);
											$wrapper.append(self.$popup.render().el);
											// document.body.append($popup.render().el);
										}
									}
								}).show();
							} else {
								$wrapper.find('.info').hide();
							}

							$wrapper.find('.back').click(function() {
								self.goBack();
							});
						}

						function renderPopups()
						{
							// прогружаем зарание контент для попапов и обрабатываем преобразование формул
							self.$popups = $('<div/>').appendTo($wrapper).hide();
							if (popupCollection) popupCollection.each(function (popup) {
								popup.popupContent = $('<div/>').html(popup.content).appendTo(self.$popups);
							});
							PlayerCourse.updateMathJax();
						}

						function renderSwithers() {
							var types = jsonData.types,
									activeTab = 0,
									tabs = [];

							for (var i = 0; i < types.length; i++) {
								type = types[i];
								if (!type.toggle || type.hidden) {
									continue;
								}

								if (type.name) tabs.push({
									title: type.name,
									content: $('#es_'+type.id),
									layer: type.id,
								});

								if (type.def) activeTab = i;

							}

							if (!tabs.length) {
								return;
							}

							var tabsPane = new modelNS.TabsLayout({
			             collection: new modelNS.PaneCollection(tabs),
				           parent: $switchWrapper,
									 activeTab: activeTab,
			         }).render();

							 tabsPane.on("TabActivated", function (panel) {
								 self.switchType(panel.options.layer);
								 resizeRadioGroup();
							 });

							 // используется внешними перехватчиками (например синхронизацией)
							 self.Tabs = tabsPane;
						};

						function disableElementsSwitchers() {
							$wrapper.find('.element-switcher').addClass('disabled');
							$wrapper.find('.element-switcher-block .title').addClass('disabled');

							for (var i = 0; i < jsonData.types.length; i++) {
								type = jsonData.types[i];
								if (type.layers.RadioButtonGroup) type.layers.RadioButtonGroup.disable();
							}
						}

						function enableElementSwitchers() {
							$wrapper.find('.element-switcher').removeClass('disabled');
							$wrapper.find('.element-switcher-block .title').removeClass('disabled');

									for (var i = 0; i < jsonData.types.length; i++) {
										type = jsonData.types[i];
										if (type.layers.RadioButtonGroup) type.layers.RadioButtonGroup.enable();
									}
						}


						function initElementSwitchers() {
							this.$typeElementsWrapper.on('click', '.element-switcher', function() {
								if ($(this).hasClass('disabled')) {
									return;
								}
								var $this = this,
								    slider = $($(this).find('.slider')[0]),
								    sliderStartPosition = slider.position().left,
								    isChecked = $($this).hasClass('checked');
								// Небольшой таймаут, на случай, если пользователь кликает
								// на элемент быстро несколько раз подряд.
								setTimeout(function() {
									if (isChecked) {
										slider.css({'left': 0, 'right': 'auto'});
										$wrapper.find('#' + $($this).attr('link')).hide();
										$($this).removeClass('checked');
									} else {
										slider.css({'right': 0, 'left': 'auto'});
										$wrapper.find('#' + $($this).attr('link')).show();
										$($this).addClass('checked');
									}
								}, 200);
							});
						}

						function getType(link) {
							for (var i = 0; i < jsonData.types.length; i++) {
								if (jsonData.types[i].id == link) {
									return jsonData.types[i];
								}
							}
						}

						// function layerSwitch($contents) {
							// var $switcher = $(switcher);
							// $('.elementsSwitchers').hide();
							// $('#es_'+$switcher.attr('link')).show();
							// renderTypeSwitchers(getType($switcher.attr('link')));
						// 	self.switchType($switcher.attr('link'));
						// }



					// layers - объект слоев, подгружаемых из res/layers/
					// loadedCount - количество загруженных слоев. Необходимо для синхронной загрузки
					// loadingStatus - статус загрузки текущего слоя. Если загрузчик занят, то загрузка
					//	                 следующего слоя откладывается по таймауту. Необходимо для синхронной
					//					   загрузки слоев
						this.loadedCount = 0;
						this.isHighlighted = false;
						this.elementOver = null;

						// Загрузчик слоя
						// id - айдишник слоя, который должен совпадать с параметром объекта layers, который хранит
					//	      загружаемый слой (js-файлы в папке res/layers )
						// path - путь к загружаемому слою (js-файл в папке res/layers) Строка-значение в данном файле -
					//	        копипаста из svg
						// lrs - передаваемый массив слоев из класса Pictures
						// index - индекс текущего загружаемого слоя в массиве слоев класса Pictures

					this.init();
					// this.popupCollection = popupCollection;
					this.$el = $wrapper;
					this.openedPopup = null;
					this.timers = {};
					this.jsonData = jsonData;

					this.handlePopups();

        			// #11610 После изменения зума пересчитать размеры и позицию фейковых регионов
        			PlayerCourse.listen('zoomScaleUpdated', function() {
            			$('.fake-region').each(function () {
                            var regionRect = self.$el.find('#' + $(this).attr('data-link')).find('#region' + $(this).attr('data-link'))[0].getBoundingClientRect();
                			$(this).css({
                    			width: regionRect.width,
                    			height: regionRect.height,
                    			top: self.$el.find('#' + $(this).attr('data-link')).find('#region' + $(this).attr('data-link')).position().top,
                    			left: self.$el.find('#' + $(this).attr('data-link')).find('#region' + $(this).attr('data-link')).position().left
                			});
            			});
        			});

					return this;
	},

	renderLayout: function () {
			var jsonData = this.model.dataJSON,
					hascontrolsPanel = this.model.hascontrolsPanel,
					$svgParent = this.$el,
					$controlsParent;

			if (jsonData.typespoint == 'top') {

				if (hascontrolsPanel) {
					var mainLayout = new modelNS.DualHorizontalLayout({
						cls: 'markup',
						topPaneHeight: jsonData.typesHeight,
						parent: this.$el
					});
					mainLayout.render();
					mainLayout.$el.attr({
						typespoint: "top"
					});

					$svgParent = mainLayout.$bottomPane;
					$controlsParent = mainLayout.$topPane;
				}

			} else if (jsonData.typespoint == 'left') {
                if (hascontrolsPanel) {
                    var mainLayout = new modelNS.DualVerticalLayout({
                        cls: 'markup',
                        firstPaneWidth: jsonData.menuwidth,
                        parent: this.$el
                    });
                    mainLayout.render();

                    $svgParent = mainLayout.$secondPane;
                    $controlsParent = mainLayout.$firstPane;
                }
			} else if (jsonData.typespoint == 'bottom') {
                if (hascontrolsPanel) {
                    var mainLayout = new modelNS.DualHorizontalLayout({
                        cls: 'markup',
                        bottomPaneHeight: jsonData.typesHeight,
                        parent: this.$el
                    });
                    mainLayout.render();

                    $svgParent = mainLayout.$topPane;
                    $controlsParent = mainLayout.$bottomPane;
                }
			} else {

				if (hascontrolsPanel) {
					var mainLayout = new modelNS.DualVerticalLayout({
						cls: 'markup',
						secondPaneWidth: jsonData.menuwidth,
						parent: this.$el
					});
					mainLayout.render();

					$svgParent = mainLayout.$firstPane;
					$controlsParent = mainLayout.$secondPane;
				}
			}

			if (hascontrolsPanel) {
				var controlsPane = new modelNS.SingleLayout({
					hasPadding: false,
					parent: $controlsParent,
				});
				controlsPane.render();
				controlsPane.$el.append(
					'<div unselectable="on" id="switchers" class="background" style="overflow: hidden">' +
						'<div class="mcontent"></div>' +
					'</div>'
				);
				this.$typeElementsWrapper = controlsPane.$el.find('#switchers .mcontent'); //controlsPane.$el.find('#elements .mcontent');
			}

			var svgPane = new modelNS.SingleLayout({
				hasPadding: false,
				parent: $svgParent,
				border: hascontrolsPanel,
				title: jsonData.title,
			});
			svgPane.render();
			svgPane.$el.append(
				'<div class="back" style="display:none"/>' +
				'<div class="info"/>' +
				'<div unselectable="on" id="layers" class="background">' +
					'<div class="mcontent"></div>' +
				'</div>'
			);

			this.$layersWrapper = svgPane.$el.find('#layers .mcontent');
	},

	renderTypes: function () {
		var jsonData = this.model.dataJSON,
				basePath = this.model.basePath,
				type, $tabWrapper;

		this.types = {};

		for (var i = 0; i < jsonData.types.length; i++) {
			type = jsonData.types[i];
			//if (type.layers && type.layers.toggle) { // #8754
            if (type.layers) { // #8754 Проверка на toggle производится для каждой группы переключателей в renderTypeSwitchers
				this.renderTypeSwitchers(type);
				// if (!type.def) {
				// 	disableElementsSwitchers();
				// }
			}
			var $typeWrapper = $('<div id="' + type.id + '" class="type"></div>');
			$typeWrapper.width(type.width);
			$typeWrapper.height(type.height);

			// #10831
			// this.$layersWrapper.append($typeWrapper);
			// if (type.def) {
			// 	$typeWrapper.show(); // #10831
			// 	activeLayerID = type.id;
			// } else {
			// 	$typeWrapper.hide(); // #10831
			// }

			// #10831
			if (type.def) {
				this.$layersWrapper.append($typeWrapper);
				activeLayerID = type.id;
			}
			this.types[type.id] = $typeWrapper;

			$typeWrapper.attr('backbutton', type.backbutton);
			if (type.backbutton && activeLayerID == type.id) {
				$backBtn.show();
			}

			if (type.file) {
				var path = basePath + type.file;
				if (type.file.lastIndexOf('.svg') != -1) {
					this.loadLayer(type, path.replace('.svg', '.js'));
				} else {
					$typeWrapper.css('background', 'url("' + path + '") center center no-repeat');
 					// изображение вписывается в доступную область не меняя пропорций (связано с #11240)
					$typeWrapper.css('background-size', 'contain');
					type['loaded'] = true;
				}
			} else {
				for (var j = 0; j < type.layers.length; j++) {
					if (type.layers[j].file) {
                        var path = basePath + type.layers[j].file;
                        if (type.layers[j].file.lastIndexOf('.svg') != -1) {
                            type.layers[j].id = type.id; // Передаем id от <type> к <layers>, чтобы знать, куда вставлять svg
                            this.loadLayer(type.layers[j], path.replace('.svg', '.js'));
                            if (j == 0) {
                                this.renderLayer(type.layers[j]);
                            }
                        } else {
                            if (j == 0) {
                                $typeWrapper.css('background', 'url("' + path + '") center center no-repeat');
                                // изображение вписывается в доступную область не меняя пропорций (связано с #11240)
                                $typeWrapper.css('background-size', 'contain');
                            }
                        }
					}
				}
			}

			/*
			* var path = basePath + type.layers[0].file;
                if (type.layers[0].file.lastIndexOf('.svg') != -1) {
                    type.layers[0].id = type.id; // Передаем id от <type> к <layers>, чтобы знать, куда вставлять svg
                    this.loadLayer(type.layers[0], path.replace('.svg', '.js'));
                    this.renderLayer(type.layers[0]);
                } else {
                    $typeWrapper.css('background', 'url("' + path + '") center center no-repeat');
                    // изображение вписывается в доступную область не меняя пропорций (связано с #11240)
                    $typeWrapper.css('background-size', 'contain');
                    type['loaded'] = true;
                }
			*
			*
			* */

			this.renderLayer(type);
			this.loadLayers(type.layers.items);
			this.renderTypeLayers(type);
		}
	},

	renderLayer: function (type) {
			if (!type.file || type.file.lastIndexOf('.svg') == -1) {
				return;
			}
			var $typeWrp = this.$el.find('#' + type.id),
					layer,
					i = 0;
			var interval = setInterval(function() {
				if (type.error || '' && type.error) {
					clearInterval(interval);
					self.log('Filed to load background...' + type.id);
					return;
				}
				if (!(type.loaded || '') || !type.loaded) {
					return;
				}
				$typeWrp.append('<div class="layer">' + type.src + '</div>');
				clearInterval(interval);
			}, 50);
	},

	loadLayers: function (layers) {
		var basePath = this.model.basePath,
				layer, src;
		for (var i = 0; i < layers.length; i++) {
			layer = layers[i];
			src = basePath + layer.file;
			if (src.lastIndexOf('.svg') != -1) {
				this.loadLayer(layer, src.replace('.svg', '.js'));
			} else {
				layer['loaded'] = true;
			}
		}
	},

	// TODO: реализовать вставку svg через baseModel по аналогии с iMap
	loadLayer: function (layer, path) {
		var id = path.substring(path.lastIndexOf('/') + 1, path.lastIndexOf('.')),
				jsID = this.model.params.jsID,
				self = this;

		// TODO: LoadManager ? requirejs ?
		if (self.loadingStatus.busy) {
			setTimeout(function() {
				self.loadLayer(layer, path);
			}, 10);
			return;
		}
		self.loadingStatus.busy = true;
		self.loadingStatus.isLoaded = false;
		var script = document.createElement('script');
	    script.type = 'text/javascript';
	    script.id = 'layer_' + id;
	    script.src = path;
    	document.body.appendChild(script);
    	script.onload = function() {
    		var i = 0;
    		var interval = setInterval(function() {
    			if (i == 1200 && svgData[id] == undefined) {
					self.loadingStatus.isLoaded = false;
					self.loadingStatus.busy = false;
					document.body.removeChild(script);
					clearInterval(interval);
				} else {
			    	self.loadingStatus.busy = false;
			    	self.loadingStatus.isLoaded = true;
			    	try {
			    		layer['src'] = svgData[id].replace(/_x5F_/g, '_')	// ??
								.replace(/(.*?)(\<svg.*)/gi, '$2')	// удаляем верхушку до svg тега #8119
								// .replace(/\\x/gi, '') // fix #8121
								// .replace(/\\\u/gi, ''); // fix #8121
				    	} catch(e) {}
			    	layer['loaded'] = true;
			    	layer['error'] = false;
			    	self.loadedCount += 1;
			    	clearInterval(interval);
			    }
    			i++;
    		}, 10);
    	};
    	script.onerror = function() {
    		layer['error'] = true;
    		layer['loaded'] = false;
    		self.loadingStatus.busy = false;
	    	self.loadingStatus.isLoaded = true;
	    	self.loadedCount += 1;
				alert('Неверный путь: ' + layer.file.replace(jsID + '/', ''));
    	};
	},

	renderTypeSwitchers: function (type) {
		/************ Изменения для #8754******************/
		var hasToggleLayers = false;
		type.layers.forEach(function(item) {
			if (item.toggle) { // Если есть хотя бы одна группа переключателей, которую нужно отобразить, то меняем флаг на true
				hasToggleLayers = true;
				return;
            }
		});
		if (!hasToggleLayers) { // Если нет групп переключателей для отображения, то выходим
			return;
		}
        /************ Изменения для #8754******************/

		var jsonData = this.model.dataJSON,
				self = this;

		// if (!type.layers || !type.layers.toggle) {
		// 	disableElementsSwitchers();
		// 	return;
		// }
		// if ($('#es_' + type.id).length != 0) {
		// 	enableElementSwitchers();
		// 	return;
		// }
		// $typeElementsWrapper.html('');

		this.$elementsSwitchers = $('<div unselectable="on" id="es_' + type.id + '" class="elementsSwitchers"></div>').appendTo(this.$typeElementsWrapper);

        /************ Изменения для #8754******************/
        var checked = true; // Для радиокнопок делаем активной только самую первую в первой группе
		this.$radioButtons = [];
		this.$checkboxButtons = [];
        for (var i = 0; i < type.layers.length; i++) {
            if (type.layers[i].name) {
                this.$elementsSwitchers.append($('<div class="elements-title">' + type.layers[i].name + '</div>'));
            }
            var el;

            if (type.layers.radio) {
                var radios = [];
                for (var j = 0; j < type.layers[i].items.length; j++) {
                    el = type.layers[i].items[j];
                    if (el.toggle) {
                        radios.push({label:el.name, checked:checked, value:el.id});
                        if (checked) {
                            checked = false;
                            type.activeRadioID = el.id;
                        }
                    }
                }

                // RadioButtonGroup
                var RadioButtonGroup = new modelNS.RadioButtonGroup({
                    collection: new modelNS.RadioButtonCollection(radios),
                    verticalAlign: 'middle',
                    parent: this.$elementsSwitchers,
                    // #11592 Свойство будет использоваться при создании радиокнопок для правильного центрирования
                    // #8968 Если блок отображается слева или справа, то колонка всегда одна для правильного отступа радиокнопок
                    columns: jsonData.typespoint == 'top' || jsonData.typespoint == 'bottom' ? jsonData.typesColumn : 1
                }).render();

                // #8754 Добавляем кнопки в общий массив, чтобы правильно рассчитать расстояние между ними после рендеринга
                RadioButtonGroup.switchers.forEach(function(item) {
                    self.$radioButtons.push(item.$el);
				});

                if (jsonData.typespoint == 'top' || jsonData.typespoint == 'bottom') { // #8968 Закомментил. columns задается при 'top' или 'bottom'
                    this.$elementsSwitchers.find('.radiobutton-group').attr("columns", jsonData.typesColumn)
                    // $elementsSwitchers.find('.radiobutton-group')
                    // 	.wrapInner("<div class='element-row'></div>")
                    // $elementsSwitchers.find('.base-radiobutton')
                    // 	.wrap( "<div class='element-cell'></div>" );
                } else {

                }

                // $wrapper.find('.radiobutton-group').height();
                // $elementsSwitchers.find('.radiobutton-group')

                RadioButtonGroup.on('Checked', function (radio) {
                	// #8754 Удаляем активные радиокнопки из соседних групп, чтобы они работали как в одной группе
                	var thisRadioGroup = this;
                	type.layers.forEach(function(item) {
                		if (item.RadioButtonGroup != thisRadioGroup) { // Если это не та группа, радиокнопка которой была выбрана, то удаляем у нее все активности с радиокнопок
                            item.RadioButtonGroup.switchers.forEach(function(radioButtonItem) {
                            	radioButtonItem.model.set('checked', false);
                            	radioButtonItem.$el.removeClass('checked');
							});
						} else {
                			// Если у <layers> есть свой атрибут file и атрибута file нет у <type>, то используем его для установки основной картинки
                			if (type.file == void 0 && item.file != void 0) {
                                if (item.file.lastIndexOf('.svg') != -1) {
                                	if (item.loaded && !item.error) {
                                        self.$layersWrapper.find('.type')
											.css('background', '') // При переключении удалить предыдущую не svg картинку, если была
											.append('<div class="layer">' + item.src + '</div>');
									}
                                } else {
                                    self.$layersWrapper.find('.type')
                                        .css({
                                            'background': 'url("' + self.model.basePath + item.file+ '") center center no-repeat',
                                            'background-size': 'contain'
                                        })
										.find('.layer').remove(); // При переключении удалить предыдущую картинку svg, если была
                                }
							}
						}
					});

                	// Когда используется svg возможны проблемы со вставкой через append. Её можно решить, если
					// вставлять разметку svg через innerHTML в некую обёртку-родитель, а уже сам этот родитель вставлять
					// в блок. Пока такая проблема была только в чекбоксах, но там элементы не вставляются каждый раз
					// при переключении а просто появляются/скрываются. При первоначальной вставке svg используется
					// innerHTML и обёртка, поэтому такой проблемы в чекбоксах нет.
                    $('#' + type.activeRadioID).remove();

                    type.activeRadioID = radio.value;
                    var $actLayer = self.layers[type.activeRadioID]; 	// #9249
                    $('#' + type.id).append($actLayer); 	// #9249
                    // $actLayer.show();
                });

                type.layers[i].RadioButtonGroup = RadioButtonGroup;

                var height = 0;
                var groupTitles = this.$elementsSwitchers.find('.elements-title');

                this.$radioButtons.forEach(function($item) {
                    height += $item.height();
                });

                groupTitles.each(function(index, item) {
                    height += $(item).outerHeight();
                });

                if (type.name) { // Если есть табы то добавить их высоту к суммирующей, для правильного рассчета отступов
                	height += 36;
				}

                var marginTopBottom = Math.floor((this.$elementsSwitchers.height() - height)/(this.$radioButtons.length*2));
                marginTopBottom = marginTopBottom < 5 ? 5 : marginTopBottom;
                this.$radioButtons.forEach(function($item) {
                    $item.css({margin: marginTopBottom + 'px 0'});
                });

            } else {

                // checkboxes add
                for (var j = 0; j < type.layers[i].items.length; j++) {
                    el = type.layers[i].items[j];
                    if (el.toggle) {
                    	let $checkbox = this.renderSwitcher(el);
                        this.$elementsSwitchers.append($checkbox);
                        this.$checkboxButtons.push($checkbox);
                    }
                }

                var height = 0;
                var groupTitles = this.$elementsSwitchers.find('.elements-title');

                this.$checkboxButtons.forEach(function($item) {
                    height += $item.height();
                });

                groupTitles.each(function(index, item) {
                    height += $(item).outerHeight();
                });

                if (type.name) { // Если есть табы то добавить их высоту к суммирующей, для правильного рассчета отступов
                    height += 36;
                }

                var marginTopBottom = Math.floor((this.$elementsSwitchers.height() - height)/(this.$checkboxButtons.length*2));
                marginTopBottom = marginTopBottom < 5 ? 5 : marginTopBottom;
                this.$checkboxButtons.forEach(function($item) {
                    $item.css({margin: marginTopBottom + 'px 0'});
                });

                // Для вкладки с чекбоксами атрибут columns задаем самому родительскому контейнеру
                if (jsonData.typespoint == 'top' || jsonData.typespoint == 'bottom') {
                    this.$elementsSwitchers.attr("columns", jsonData.typesColumn)
                } else {
                    this.$elementsSwitchers.attr("columns", 1);
				}

            }
        }

        /************ Изменения для #8754******************/

        /************** Код до изменений #8754. Со временем удалить этот блок ***************/
		/*if (type.layers.name) {
			this.$elementsSwitchers.append($('<div class="elements-title">' + type.layers.name + '</div>'));
		}

		// if (!type.def) {
		// 	this.$elementsSwitchers.hide();
		// }

		var el;

		if (type.layers.radio) {

			var radios = [],
					checked = true;
			for (var i = 0; i < type.layers.items.length; i++) {
				el = type.layers.items[i];
				if (el.toggle) {
					radios.push({label:el.name, checked:checked, value:el.id});
					if (checked) {
						checked = false;
						type.activeRadioID = el.id;
					}
				}
			}

			// RadioButtonGroup
			var RadioButtonGroup = new modelNS.RadioButtonGroup({
				collection: new modelNS.RadioButtonCollection(radios),
				verticalAlign: 'middle',
				parent: this.$elementsSwitchers,
                // #11592 Свойство будет использоваться при создании радиокнопок для правильного центрирования
				// #8968 Если блок отображается слева или справа, то колонка всегда одна для правильного отступа радиокнопок
				columns: jsonData.typespoint == 'top' || jsonData.typespoint == 'bottom' ? jsonData.typesColumn : 1
			}).render();


			if (jsonData.typespoint == 'top' || jsonData.typespoint == 'bottom') { // #8968 Закомментил. columns задается при 'top' или 'bottom'
				this.$elementsSwitchers.find('.radiobutton-group').attr("columns", jsonData.typesColumn)
				// $elementsSwitchers.find('.radiobutton-group')
				// 	.wrapInner("<div class='element-row'></div>")
				// $elementsSwitchers.find('.base-radiobutton')
				// 	.wrap( "<div class='element-cell'></div>" );
			} else {

			}

			// $wrapper.find('.radiobutton-group').height();
			// $elementsSwitchers.find('.radiobutton-group')

			RadioButtonGroup.on('Checked', function (radio) {
				// for (var i = 0; i < type.layers.items.length; i++) {
				$('#' + type.activeRadioID).remove();
				// }
// console.log(type.activeRadioID, radio.value, self)
				type.activeRadioID = radio.value;
				var $actLayer = self.layers[type.activeRadioID]; 	// #9249
				$('#' + type.id).append($actLayer); 	// #9249
				// $actLayer.show();
			});

			type.layers.RadioButtonGroup = RadioButtonGroup;

		} else {

			// checkboxes add
			for (var i = 0; i < type.layers.items.length; i++) {
				el = type.layers.items[i];
				if (el.toggle) {
					this.$elementsSwitchers.append(this.renderSwitcher(el));
				}
			}

			// #8180
			// checkboxes full height like cells in table
			this.$elementsSwitchers.wrapInner("<div class='element-table'></div>")
				.find('.element-switcher-block')
					.wrap( "<div class='element-row'></div>" )
					.wrap( "<div class='element-cell'></div>" );

			// #9528
			if (jsonData.typespoint == 'top' || jsonData.typespoint == 'bottom') { // #8968 Закомментил. columns задается при 'top' или 'bottom'
				this.$elementsSwitchers.find('.element-table').attr("columns", jsonData.typesColumn)
			}

		}


		// initElementSwitchers();*/
        /************** Код до изменений #8754. Со временем удалить этот блок ***************/
	},


	renderSwitcher: function (el) {
		var name = el.name,
				link = el.id,
				isChecked = el.startEnable,
				$elementSwitcherBlock = $('<div class="element-switcher-block"></div>'),
				$switcher = $('<div class="element-switcher checked" name="' + name + '" link="' + link + '"><div class="slider"></div></div>'),
				// $title = $('<div class="checkbox-label">' + name + '</div>'),
				checkbox = new modelNS.Checkbox({model: new modelNS.SwitcherModel({
						parent: $elementSwitcherBlock,
						label: name, // #10826
						disabled: false,
						checked: isChecked // true
					})
				}).render(),
				$checkbox = checkbox.$el,
				self = this;

				$elementSwitcherBlock.attr('link', link);

				checkbox.on('Checked', function () {
					if ($elementSwitcherBlock.hasClass('disabled')) {
						return;
					}
					// var isChecked = $(this).parent().hasClass('checked');
					// Небольшой таймаут, на случай, если пользователь кликает
					// на элемент быстро несколько раз подряд.
					setTimeout(function() {
						self.$el.find('#' + link).show();

						// #11610 Добавляем фейковые регионы для видимых svg.
						// Из-за того, что svg перекрывают друг друга, кликабельным является только самый верхний в стопке
						// С помощью z-index делаем фейковые регионы на одном уровне.
                        var $fakeRegion = $('<div id="fake-region' + link + '" class="fake-region" data-link="' + link + '"></div>');
                        var $svgElemRegion = self.$el.find('#' + link).find('#region' + link);
                        var regionRect = $svgElemRegion[0].getBoundingClientRect();
                        $fakeRegion.css({
                            width: regionRect.width,
                            height: regionRect.height,
                            top: $svgElemRegion.position().top,
                            left: $svgElemRegion.position().left
                        }).click(function() {
                            $svgElemRegion.click();
                        });
                        $('body').append($fakeRegion);

					}, 200);
				});

				checkbox.on('Unchecked', function () {
					if ($elementSwitcherBlock.hasClass('disabled')) {
						return;
					}
					setTimeout(function() {
						self.$el.find('#' + link).hide();

                        // #11610 При снятии галочки удаляем фейковый регион для данного svg
                        $('#fake-region' + link).remove();
					}, 200);
				});

				$checkbox.data('checkbox', 0);

		$elementSwitcherBlock
			// .append($switcher)
			.append($checkbox)
			// .append($title); // #10826
		return $elementSwitcherBlock;
	},

	renderTypeLayers: function (type) {
		if (type.layers.items.length == 0) {
			return;
		}

		var $typeWrp = this.types[type.id], // #10831 this.$el.find('#' + type.id),
				basePath = this.model.basePath,
				layer,
				i = 0,
				hasMultimedia = false,
				self = this;

		var interval = setInterval(function() {
			if (i >= type.layers.items.length) {
				clearInterval(interval);
				$typeWrp.attr('multimedia', hasMultimedia);
				self.layersLoaded(type.layers);
				return;
			}
			layer = type.layers.items[i];
			if (layer.error || '' && layer.error) {
				self.log('Failed to load ' + layer.id);
				i++;
				return;
			}
			if (!(layer.loaded || '') || !layer.loaded) {
				return;
			}
			if (layer.file.lastIndexOf('.svg') == -1) {
				var $l = $('<div id="' + layer.id + '" class="layer"></div>'),
					path = basePath + layer.file;
				$l.css('background-image', 'url("' + path + '")');
				$typeWrp.append($l);
				i++;
				if (type.layers.radio) {
					if (type.activeRadioID != layer.id) $l.remove();
					self.layers[layer.id] = $l;
				}
				return;
			}
			if (layer.multimedia == 'true') {
				hasMultimedia = true;
			}

			var $svgsrc = self.addSVGInTypeWrapper({
                svgString: layer.src,
                $wrapper: $typeWrp
            });

            var $svg = $svgsrc.find('svg');

			$svg.attr('id', layer.id);

			// Автоматический размер svg по типу contain
			var layerWidth = self.$layersWrapper.width(),	// type.width
					layerHeight = self.$layersWrapper.height(), 	// type.height
					//scaleK = Math.min(layerWidth/$svg.width(), layerHeight/$svg.height()),//#11240
					//svgWidth = $svg.width(),//#11240
					//svgHeight = $svg.height();//#11240

					// #11240 Вычисление размеров svg заменено с $svg.width() на $svg.attr('width'),
					// т.к. для неактивной вкладки элементы не находятся в DOM и .width()/.height() возвращают ноль.
					// Значение ширины теперь получаются из атрибутов и обрабатываются для дальнейшего использования.
                	svgWidth = parseInt($svg.attr('width').replace('px', '')), // #11240
                	svgHeight = parseInt($svg.attr('height').replace('px', '')), // #11240
                	scaleK = Math.min(layerWidth/svgWidth, layerHeight/svgHeight); // #11240

			if (layerWidth) {
				$svg.width(scaleK*svgWidth);
				$svg.css('margin-left',(layerWidth-scaleK*svgWidth)/2);
			}

			if (layerHeight) {
				$svg.height(scaleK*svgHeight);
				$svg.css('margin-top',(layerHeight-scaleK*svgHeight)/2);
			}
			// end auto size for svg

			i++;

			if (layer.elements && layer.elements.length != 0) {
				for (var j = 0; j < layer.elements.length; j++) {
					var element = layer.elements[j],
							$el = $svgsrc.find('#' + element.svgregion).first();

					if ($el.length == 0) {	// ????
						$el = $svgsrc.find('#' + element.svgregion.replace(/_/g, '_x5F_')).first();
					}

					if (element.title) $el.attr('title', element.title);

					if (element.audio || element.link) {
						$el.attr('class', 'pointer');
						$el.css('pointer-events', 'auto');
					}

					if (element.audio) {
						$el.attr('audio', element.audio);
						$el.click(function() {
							self.stopAllAudio();
							var audio = $(this).attr('audio');
							if (audio) self.playAudio(audio);
						});
					}

					if (!element.link) {
						continue;
					}

					$el.attr('link', element.link);
					// .click() cant becose in radio .remove() erase events
					self.$el.on('click', '#' + element.svgregion, function(event) { // delegate => on, delegate deprecated
						var link = $(this).attr('link');

						// Переключаем <type/> если возможно
						// if ($('.type#' + link).length != 0) { // #10831
						if (self.types[link]) {
							self.switchType(link);
							return;
						}

						if (link) {
							var popup = popupCollection.get(link);
							if (popup) {
								self.openPopup(popup);
							}
						}
					});
				}
			}

			// #9249#note-9 при старте модели показываются сначала все svg (js файлы) одновременно, потом пропадают
			if (type.layers.radio) {
				if (type.activeRadioID != layer.id) $svgsrc.remove();
				self.layers[layer.id] = $svg;
			} else {
				if (!layer.startEnable && type.layers.items.length>1) $svg.hide();
			}

		}, 50);
	},

	playAudio: function ( file ) {
		var basePath = this.model.basePath,
				jsID = this.model.params.jsID,
				path = basePath + (jsID ? jsID + '/' : '') + file;

		if (!this.audios[path]) {
			this.audios[path] = new Audio(path);
			this.audios[path].loop = false;
			this.audios[path].play();
		} else {
			this.audios[path].currentTime = 0;
			this.audios[path].play();
		}
	},

	stopAllAudio: function() {
		for (var path in this.audios) {
			this.audios[path].pause();
		}
	},

	layersLoaded: function (layers) {
		// init jquery ui tooltip's
		if ($.ui) this.$el.tooltip();

		if (layers.radio) {
			for (var i=0; i<layers.items.length; i++) {
				if (i) this.$el.find('#' + layers.items[i].id).hide();
			}
		}

		// for hidden layers with backbutton - cursor is lupa
		for (var i=0; i<layers.items.length; i++) {
			var item = layers.items[i],
					id = item.id,
					elements = item.elements;

				 for (var e=0; e<elements.length; e++) {
					 var $svgregion = $('#'+elements[e].svgregion),
							 link = $svgregion.attr('link');
					 if (this.$el.find('#' + link).attr('backbutton')) {
							$svgregion.attr('lupa', '1');
					 }
				 }

		}
	},

	switchType: function (typeID, options) {
		if (!options) options = {};

		// #10831
		// var $typeWrp = this.$el.find('#' + typeID);
		// this.$layersWrapper.find('.type').hide();
		// $typeWrp.show();
		// $typeWrp.parent().prepend($typeWrp);	// #9249

		// #10831
		var $typeWrp = this.types[typeID];
		this.$layersWrapper.find('.type').remove();
		this.$layersWrapper.append($typeWrp);

		if (options.back) {
			this.previousLayers.pop();
		} else {
			this.previousLayers.push(activeLayerID);
		}

		// console.log(this.previousLayers.join(';'));

		activeLayerID = typeID;
		if (this.$popup) {
			this.$popup.closePopup();
		}
		if ($typeWrp && $typeWrp.attr('multimedia') === 'true') {
			this.$multimediaBtn.show();
		} else {
			this.$multimediaBtn.hide();
		}
		if ($typeWrp && $typeWrp.attr('backbutton') === 'true') {
			this.$el.find(".back").show();
		} else {
			this.$el.find(".back").hide();
		}

		this.trigger("typeChanged", typeID, options);
	},

	goBack: function () {
		this.switchType(this.previousLayers[this.previousLayers.length-1], {back:true});
	},

    /**
	 * Вставка разметки svg в указанный родитель.
     * @param svgString {string} Строка с разметкой svg.
     * @param $wrapper {jQuery} Место, куда вставлется элемент c <svg>
     * @returns {jQuery} Вставленный элемент с <svg>
     */
	addSVGInTypeWrapper: function({svgString, $wrapper}) {
        svgString = svgString.replace(/\"\&/gi,'"&amp;');
        var $svgsrc = $('<div/>');

        // Бывают svg, которые при вставке в div через функции jQuery append(), html() или оборачивания самого
        // svg с помощью wrap, не отображаются на странице. Сама разметке в DOM попадает. Если вставлять <svg>
        // через свойство innerHTML, то svg отображается.
		$svgsrc[0].innerHTML = svgString;

        $svgsrc.find('[title]').attr('title', ''); // clear default titles

        $wrapper.append($svgsrc);
        return $svgsrc;
	},



	/* DEMONSTRATION METHODS ============= */

	startDemo: function (fn) {
		modelNS.BaseModelView.prototype.startDemo.apply(this, arguments);
		var self = this;

		this.timers.start = setTimeout(function () {self.openNext()}, this.duration(3000, {max:10000, min:1000}));
	},

	demoOrder: function () {
		modelNS.BaseModelView.prototype.demoOrder.apply(this, arguments);

		var content = this.popups,
				demoListObjects = [],
				demoListKeys = [],
				order = 0;

		for (var c = 0; c < content.length; c++) {
			var json = content[c];
			if (json.order) order = json.order*100;
			demoListObjects[order] = json;
			demoListKeys.push(order);
			order += 1;
		}

		function sortNumber(a,b) {
		    return a - b;
		}

		demoListKeys.sort(sortNumber);
		// console.log(demoListKeys);

		for (var k=0; k<demoListKeys.length; k++) {
			var key = demoListKeys[k];
			this.demoList.push(demoListObjects[key]);
		}
	},

	getPopupById: function (id) {
		var popups = this.popupCollection && this.popupCollection.models || [];
		for (var i=0; i<popups.length; i++) if (popups[i].id == id) return popups[i];
	},

	openNext: function () {
		if (this.isDemoPause()) return this.saveDemoMoment();

		var curId = this.openedPopup && this.openedPopup.id;

		for (var i=0; i<this.demoList.length; i++) {
			var json = this.demoList[i],
					id = json.id;

			if (!curId) {

				// <element time="..">
				if (json.time) {
					var time = json.time * 1000,
							timeDiff = time - this.demoPlayTime();

					if (timeDiff > 0) return this.waitAndOpenNext(timeDiff);
				}

				this.closePopup();
				this.markLink(json);
				return;
			}

			if (id == curId) curId = false;
		}

		this.waitAndClosePopup(json.id, json.endtime*1000 - this.demoPlayTime(), function () {
			this.unmarkRegions();
			this.onDemoFinish();
		});
	},

	closePopup: function (id) {
		// close popup
		var $popup = id ? $('[popup="'+id+'"]') : $('.model-popup');

		$popup.find('.ui-dialog-titlebar-close').click();
	},

	markLink: function (json) {
		var data = this.jsonData,
				types = data.types,
				$svgregions = $('[link="'+ json.id + '"]');

		if ($svgregions.length) {
			this.unmarkRegions();
			this.markRegions($svgregions);
			this.waitAndShowPopup(json.id, this.duration(1000, {max:10000}));
			if (json.endtime) this.waitAndClosePopup(json.id, json.endtime*1000 - this.demoPlayTime());
		} else {
			this.openedPopup = json;
			this.openNext();
		}
	},

	markRegions: function ($svgregions) {
		function animate ($obj, props, complete)
		{
			$obj.animate(props, {
				step : function ()
				{
					this.style.strokeWidth = this.style.fontSize.replace('px', '')/10 + 'px';
					this.style.stroke = this.style.color;
				},
				duration : 600,
				complete : complete
			});
		}

		function mark ($obj)
		{
			$obj.css({
				strokeWidth:0,
				color: '#ddd',
				stroke: '#ddd',
				fillOpacity : 1,
				border: '1px solid #ddd',
				// fill:'transparent',
				opacity:1
			});
		}

		function animateInCicle ($obj) {
			if (!$obj.length) return;

			animate($obj, {
				fontSize:20,
				color:'#005e9e',
				// fillOpacity : 0.3,
			}, function () {
				animate($obj, {
					fontSize:0,
					color:'#fff',
					// fillOpacity : 0.6,
				}, function () {
					animateInCicle($obj);
				})
			})
		}

		$svgregions.each(function () {
			var $svgregion = $(this);
			switch ($svgregion.prop("tagName")) {
				case 'image':
					var rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect'),
							$rect = $(rect)
								.attr({
									markedrect:1,
									rx:20,
									ry:20,
									x:0,
									y:0,
									width:$svgregion.attr('width'),
									height:$svgregion.attr('height'),
									transform:$svgregion.attr('transform')
								})
								.css('fill', 'transparent')
								.insertBefore($svgregion);

					// while (!$parent.attr('transform') && $parent[0].nodeName != 'svg') $parent = $.parent.parent();
					// $rect.appendTo($parent);

					mark($rect);
					animateInCicle($rect);
					break;

				default:
						$svgregion.attr('marked', 1);
						mark($svgregion);
						animateInCicle($svgregion);
					break;

			}
		});

	},

	unmarkRegions: function () {
		$('[marked="1"]').stop().css({stroke:'none', fillOpacity:1});	// fill:'transparent'
		$('[markedrect="1"]').stop().remove();
	},

	waitAndShowPopup: function (id, ms) {
		var self = this;
		this.timers.popup = setTimeout(function () {self.showPopup(id)}, ms);
	},

	waitAndClosePopup: function (id, ms, callback) {
		var self = this;
		this.timers.popup = setTimeout(function () {self.closePopup(id); callback && callback.apply(self); }, ms);
	},

	showPopup: function (id) {
		if (this.isDemoPause()) return this.saveDemoMoment();

		var self = this,
				popup = this.getPopupById(id);

		this.openedPopup = popup;
		var $popup = new modelNS.PopupView({model: popup});
		this.$el.append($popup.render().el);
		// $popup.attr("popup")

		setTimeout(function () {
			self.waitAndOpenNext(self.duration(2000, {max:10000, calc:".model-popup"}))
		}, 500);
	},

	waitAndOpenNext : function (ms) {
		var self = this;
		this.timers.next = setTimeout(function () { self.openNext()} ,ms);
	}

});
