var microscopeNS = microscopeNS || {};

function Microscope(xmlData, wrapper, basePath, params) {
	var model, view;
	this.init = function() {
		model = new modelNS.IMicroModel({xmlData: xmlData,
										 wrapper: wrapper,
										 basePath: basePath,
										 scalable: false,
										 params: params,
										 restyling: "title",
										 // width: width,
										 // height: height
									 });
		view = new modelNS.IMicroView({model: model}).renderOnShow(); // #11934 замена стандартного .render(), для отрисовки скрытых элементов при их появлении (tabs).
		return view;
	};
}

(function() {
	microscopeNS.langs = {
		ru : {
			answerTitle : 'Задание',
			infoTitle : 'Описание',
			zoom : 'Увеличение',
			light : 'Свет',
			zoomSmall : 'Малое (10 × 4)',
			zoomMiddle : 'Среднее (10 × 10)',
			zoomLarge : 'Большое (10 × 40)',
			lightDirect : 'Прямой',
			lightReflected : 'Отражённый',
			previewTitle : 'Цифровое увеличение',
		},
		be : {
			answerTitle : 'Заданне',
			infoTitle : 'Апісанне',
			zoom : 'Павелічэнне',
			light : 'Святло',
			zoomMiddle : 'Сярэдняе (10 × 10)',
			zoomLarge : 'Вялікае (10 × 40)',
			lightDirect : 'Прамое',
			lightReflected : 'Адлюстраванае',
			previewTitle : 'Лічбавае павелічэнне',
		},
		en : {
			answerTitle : 'Description',
			infoTitle : 'Description',
			zoom : 'Zoom',
			light : 'Light',
			zoomSmall : 'Small (10 × 4)',
			zoomMiddle : 'Average (10 × 10)',
			zoomLarge : 'Big (10 × 40)',
			lightDirect : 'Direct',
			lightReflected : 'Reflected',
			previewTitle : 'Digital zoom',
		}
	}

	microscopeNS.lang = function (lang) {
		return this.langs[CourseConfig.language||'ru'][lang];
	}

	microscopeNS.Layer = Backbone.Model.extend({
		initialize: function(options) {
			this.file = options.file;
			this.scale = options.scale;
			this.light = options.light;
			this.def = options.def != undefined ? Boolean(options.def) : false;
		}
	});

	microscopeNS.LayerCollection = Backbone.Collection.extend({
		model: microscopeNS.Layer
	});

	microscopeNS.IndicatorModel = Backbone.Model.extend({
		initialize: function(options) {
			this.image = options.image;
			this.parent = options.parent;
		}
	});

	microscopeNS.Indicator = Backbone.View.extend({
		className: 'indicator',
		initialize: function(options) {
			this.model = options.model;
			this.listenTo(this.model.image, 'Drag', this.refresh);
		},
		render: function() {
			var imageWidth = this.model.image.getImage().width(),
				parentWidth = this.model.parent.getImage().width(),
				_this = this;
			this.scale = parentWidth / imageWidth;
			var width = this.model.image.$el.parent().width() * this.scale,
					height = this.model.image.$el.parent().height() * this.scale;
			// width = Math.floor(width);
			// height = Math.floor(height);
			this.$el
					.width(width)
					.height(height);
			this.model.parent.$el.append(this.$el);
			this.refresh(this.model.image.getImageWrapper().position());
			this.$el.draggable({
				containment: 'parent',
				drag: function(event, ui) {
					_this.onDrag(ui.position);
				}
			});
			var left = Math.abs(this.model.image.getImageWrapper().css('left').replace('px', '') * this.scale),
				top = Math.abs(this.model.image.getImageWrapper().css('top').replace('px', '') * this.scale);
			// left = Math.round(left);
			// top = Math.round(top);
			this.$el.css({
				'left' : left + 'px',
				'top' : top + 'px'
			});
		},
		onDrag: function(position) {
			var left = (-position.left / this.scale),
				top = (-position.top / this.scale);
			// if (Math.abs(left) > 4 / this.scale) {	// ???
			// 	left += 0.4 / this.scale;
			// }
			// if (Math.abs(top) > 4 / this.scale) {	// ???
			// 	top += 0.4 / this.scale;
			// }



			// left = parseInt(left);
			// top = parseInt(top);
			this.model.image.getImageWrapper().css({
				'left': left + 'px',
				'top': top + 'px'
			});
			// console.log(position, [left, top])
		},
		refresh: function(position) {
			var left = Math.abs(position.left * this.scale),
					top = Math.abs(position.top * this.scale);
			// left = Math.floor(left);
			// top = Math.floor(top);

			// console.log(position, [left, top])

			this.$el.css({'left':  left + 'px',
						  'top':  top + 'px'});
		}
	});

	microscopeNS.MatchingLegend = Backbone.Model.extend({
		initialize: function(options) {
			this.image = options.image;
			this.width = options.width;
			this.height = options.height;
			this.regions = options.regions;
		}
	});

	microscopeNS.Region = Backbone.Model.extend({
		initialize: function(options) {
			this.set({
				type: options.type,
				coords: options.coords,
				point: options.point,
				index: options.index,
				correct: options.correct != undefined ? options.correct === 'true' : true,
				connectedTo: null,
				selected: false
			});
		}
	});

	microscopeNS.Regions = Backbone.Collection.extend({
		model: microscopeNS.Region
	});

	microscopeNS.Spot = Backbone.View.extend({
		className: 'spot',
		events: {
			'click': 'onClick'
		},
		initialize: function(options) {
			this.model = options.model;
			this.parent = options.parent;
			this.model.set({view: this});
			this.imicro = options.imicro;
		},
		render: function() {
			var self = this;
			this.$el.css({'top': this.model.get('y') + 'px', 'left': this.model.get('x') + 'px'});
			this.parent.append(this.$el);

			// dragging already setted points
			/*
			this.$el.draggable({
				containment: 'parent',
				start : function () {
					if (self.imicro.answerMode != 'answer') return false;
				},
				drag: function(event, ui) {
					// self.onDrag(ui.position);
					self.dragging = true;
				},
				stop: function (event, ui) {
					self.onDragStop(ui.position);
				}
			});
			*/
		},
		// onDrag: function(position) {
			// var left = (-position.left / this.scale),
			// 	top = (-position.top / this.scale);
			// if (Math.abs(left) > 4 / this.scale) {
			// 	left += 0.4 / this.scale;
			// }
			// if (Math.abs(top) > 4 / this.scale) {
			// 	top += 0.4 / this.scale;
			// }
			// this.model.image.getImageWrapper().css({
			// 	'left': left + 'px',
			// 	'top': top + 'px'
			// });
		// },
		onDragStop: function (position) {
			var point = {x:position.left, y:position.top};

			this.imicro.createPoint(point);
		},
		onClick: function() {
			if (this.imicro.answerMode != 'answer') return;
			this.spotRemove();
			this.imicro.refreshHotspointsCount();
		},
		spotRemove: function() {
			this.trigger('SpotRemoved', this.model);
			if (this.model.get('connectedTo')) {
				var connectedTo = this.model.get('connectedTo');
				connectedTo.model.set({connectedTo: null});
				connectedTo.spotRemove();
				this.model.get('line').remove();
			}
			this.remove();
		},
		setWrong: function() {
			this.$el.addClass('wrong');
			if (this.model.get('line')) {
				this.model.get('line').addClass('wrong');
			}
			if (this.model.get('connectedTo')) {
				this.model.get('connectedTo').$el.addClass('wrong');
			}
		},
		setCorrect: function() {
			this.$el.addClass('correct');
			if (this.model.get('line')) {
				this.model.get('line').addClass('correct');
			}
			if (this.model.get('connectedTo')) {
				this.model.get('connectedTo').$el.addClass('correct');
			}
		}
	});

	microscopeNS.SpotModel = Backbone.Model.extend({
		initialize: function(options) {
			this.set({
				x: options.x,
				y: options.y,
				correct: options.correct,
				onRemove: options.onRemove,
				modelCtx: options.modelCtx,
				region: options.region,
				disabled: false,
				connected: options.connected,
				connectedTo: options.connectedTo,
				view: options.view
			});

		}
	});

	microscopeNS.SpotCollection = Backbone.Collection.extend({
		model: microscopeNS.SpotModel
	});
})();



modelNS.IMicroModel = modelNS.BaseModel.extend({
	defaults: _.extend({}, modelNS.BaseModel.prototype.defaults, {
		width: 800,
		height: 600,
	}),

	initialize: function(options) {
		// this.defaults.width = options.width;
		// this.defaults.height = options.height;
		modelNS.BaseModel.prototype.initialize.apply(this, arguments);
		this.params.scale = this.params.scale;
		this.params.light = this.params.light;
		this.params.mode = this.params.mode || 'demo'; // || 'answer';
	} ,
	parseXML: function(xmlData) {
		modelNS.BaseModel.prototype.parseXML.apply(this, arguments);

		var $model = this,
		    $xml = $($.parseXML(xmlData)),
				$imicro = $xml.find('imicro'),
			settings = {};
		settings['name'] = $xml.find('layers').attr('name') || '';
		var layers = [];
		$xml.find('layer').each(function() {
			var layer = {};
			layer.file = $(this).attr('file');
			layer.light = $(this).attr('light');
			layer.scale = $(this).attr('scale');
			layer.def = $(this).attr('default');
			layers.push(layer);
		});
		settings['layers'] = new microscopeNS.LayerCollection(layers);

		settings['matchinglegend'] = null;
		var ml = $xml.find('matchinglegend');
		if (ml.length != 0) {
			settings.matchinglegend = {};
			ml = $(ml.get(0));
			var imageGroup  = ml.find('imagegroup'),
				imageItem = ml.find('imageitem');
			if (imageGroup.length != 0) {
				imageGroup = $(imageGroup.get(0));
				var regions = new microscopeNS.Regions();
				try {
					ml.find('classgroup').each(function() {
						regions.add({
							parentType: 'classgroup',
							index: $(this).attr('number'),
							type: $($(this).find('region').get(0)).attr('type'),
							coords: $($(this).find('region').get(0)).attr('coords'),
							point: {x: $($(this).find('point').get(0)).attr('x'),
									y: $($(this).find('point').get(0)).attr('y'),
                                	// #10743 В дальнейшем будет проверяться нужно ли отобразить point
									visible: $($(this).find('point').get(0)).attr('visible')}
						});
					});
				} catch (e) {}

				settings.matchinglegend['classGroup'] = new microscopeNS.MatchingLegend({
					image: imageGroup.attr('file'),
					width: imageGroup.attr('width'),
					height: imageGroup.attr('height'),
					regions: regions
				});
			}
			if (imageItem.length != 0) {
				imageItem = $(imageItem.get(0));
				var regions = new microscopeNS.Regions();
				try {
					ml.find('classitem').each(function() {
						regions.add({
							parentType: 'classitem',
							index: $(this).attr('classgroup'),
							type: $($(this).find('region').get(0)).attr('type'),
							coords: $($(this).find('region').get(0)).attr('coords'),
							point: {x: $($(this).find('point').get(0)).attr('x'),
									y: $($(this).find('point').get(0)).attr('y'),
									// #10743 В дальнейшем будет проверяться нужно ли отобразить point
                                	visible: $($(this).find('point').get(0)).attr('visible')}
						});
					});
				} catch (e) {}
				settings.matchinglegend['classItem'] = new microscopeNS.MatchingLegend({
				   width: imageItem.attr('width'),
				   height: imageItem.attr('height'),
				   image: imageItem.attr('file'),
				   regions: regions
				});
			}
		}
		// if (settings.matchinglegend) {
		// 	return settings;
		// }
		settings['hotspot'] = null;
		var hs = $xml.find('hotspot');
		if (hs.length != 0) {
			settings.hotspot = {
				// #12255 В points может записаться значение requirepoints, если количество регионов может быть больше
				// чем предлагается точек и нужно указать лишь некоторые регионы.
				points : hs.attr('requirepoints')*1 || hs.attr('points')*1 || hs.find('answer[valid="true"]').length, // #12255 Убрано жестко заданное число 5
				requirepoints : hs.attr('requirepoints')*1  || hs.find('answer[valid="true"]').length // #12255 Убрано жестко заданное число 1
			};
			hs = $(hs.get(0));
			settings.hotspot['file'] = hs.attr('file');
			settings.hotspot['regions'] = new microscopeNS.Regions();
			try {
				hs.find('answer').each(function(i) {
					settings.hotspot.regions.add({
						type: $($(this).find('region').get(0)).attr('type'),
						coords: $($(this).find('region').get(0)).attr('coords'),
						correct: $(this).attr('valid'),
						requirepoints: $(this).attr('requirepoints')*1 || 0,
						index : i
					});
				});
			} catch (e) {}
			settings.hotspot.selected = new microscopeNS.SpotCollection();
		}
		settings['description'] = null;
		var desc = $xml.find('description');
		if (desc.length != 0) {
			settings['description'] = courseML.getHTMLFromCourseML(desc.first());
		}

		settings['task'] = null;
		var task = $xml.find('task');
		if (task.length != 0) {
			settings['task'] = courseML.getHTMLFromCourseML(task.first());
		}

		return settings;
	}
});

modelNS.IMicroView = modelNS.BaseModelView.extend({
	initialize: function(options) {
		window.IM = this;	// TODO: temporary while develop
		modelNS.BaseModelView.prototype.initialize.apply(this, arguments);
	},
	render: function() {
		modelNS.BaseModelView.prototype.render.apply(this, arguments);
		this.$el.addClass('imicro title16');
		this.renderMainView();
		return this;
	},

	answerScore : function () {
		this.answerMode = "score";
		return this.model.dataJSON.matchinglegend ? this.checkMatchingLegend() : this.checkHotspot();
	},

	saveAnswer : function () {
		var points = [];

		this.spotCollection.each(function(spot) {
			points.push({
				index : spot.get('region').get('index'),
				x : spot.get('x'),
				y : spot.get('y'),
				region : spot.get('region').get('parentType')
			});
		});

		return points;
	},

	loadAnswer : function (points) {
		var self = this,
				regions;

		for (var i=0; i<points.length; i++) {
			var point = points[i];

			if (point.region == 'classitem') {
				regions = this.model.dataJSON.matchinglegend.classItem.regions;
			} else if (point.region == 'classgroup') {
				regions = this.model.dataJSON.matchinglegend.classGroup.regions;
			} else {
				regions = this.model.dataJSON.hotspot.regions
			}

			regions.each(function(model) {
				if (point.index == model.get('index')) {
					self.createPoint(point, model);
				}
			});
		}

	},

	showSolution: function ()	{
		// this.reloadBut.show();
		// this.checkBut.hide();
		// this.solutionBut.hide();
        this.removeAllWrongLines();
		this.model.dataJSON.matchinglegend ? this.openMatchingLegend() : this.showHotspotCorrectAnswer();
		this.answerMode = 'open';
	},

	reload : function ()
	{
		// this.reloadBut.hide();
		// this.checkBut.show();
		// this.solutionBut.hide();
		this.removeAllSpots();
		this.removeAllLines();
		this.removeAllCircles();
		this.checkPanel.$el.hide();
		this.answerMode = 'answer';

		// нужен для hotspot режима, восстанавливает количество точек
		this.refreshHotspointsCount();
	},

	// checkAnswer: function() {
	// 	switch (this.model.get('params').mode) {
	// 		case 'answer': {
	// 			if (this.model.dataJSON.matchinglegend) {
	// 				this.checkMatchingLegend();
	// 			}
	// 			if (this.model.dataJSON.hotspot) {
	// 				this.removeHSEvents();
	// 				this.showHotspotCorrectAnswer();
	// 				return this.checkHSAnswer();
	// 			}
	// 			break;
	// 		}
	// 		case 'solution': {
	// 			if (this.model.dataJSON.matchinglegend) {
	// 			}
	// 			if (this.model.dataJSON.hotspot) {
	// 			}
	// 			break;
	// 		}
	// 		default: return false;
	// 	}
	// },

/* ----------------------------------------------------------------------------*/
/* ------------------------------- Main View ----------------------------------*/
/* ----------------------------------------------------------------------------*/

	renderMainView: function() {
		var menuWidth = this.model.$root.attr('menuWidth') || 280; // #9460 Если атрибута нет, то берем значение, которое использовалось раньше
		this.mainLayout = new modelNS.DualVerticalLayout({firstPaneWidth: this.$el.width() - menuWidth, secondPaneWidth: menuWidth, parent: this.$el, nopadding:true});
		this.mainLayout.render();
		this.rightPanelLayout = new modelNS.DualHorizontalLayout({topPaneHeight: 48, parent: this.mainLayout.$secondPane, nopadding: true});
		this.rightPanelLayout.render();
		this.rightPanelLayout.$el.attr('id', 'rightPanel');
		var layer;
		if (this.model.get('params').scale && this.model.get('params').light) {
			layer = this.model.dataJSON.layers.where({'scale': this.model.get('params').scale,
													  'light': this.model.get('params').light});
			if (layer.length != 0) {
				layer = layer[0];
			}
		}
		if (!layer) {
			layer = this.model.dataJSON.layers.where({'def': 'true'});
			if (layer.length != 0) {
				layer = layer[0];
			} else {
				layer = this.model.dataJSON.layers.at(0);
			}
			this.model.get('params').scale = (layer.scale);
			this.model.get('params').light = (layer.light);
		}
		this.renderTopButtons();
		// if (this.model.get('params').mode == 'demo') {
			this.renderInfo();
			this.renderSettings();
			this.renderAnswerBlock();
			this.image = this.renderImage(this.mainLayout.$firstPane, layer.file, 1);

			if (this.model.get('params').mode == 'answer') {
				this.onButtonClick(this.answerBtn);
			}
		// } else
		// if (this.model.get('params').mode == 'answer') {
		// }
	},

	renderSlider: function() {
		var zoomSliderValue = 1; // #12112 По-умолчанию ползунок в начале
		if (this.zoomSlider) {
            zoomSliderValue = this.zoomSlider.getValue(); // #12112 Запишем последнее положение ползунка слайдера
			this.stopListening(this.zoomSlider);
			this.zoomSlider.remove();
		}

		var settingsHiden = !this.settingsBlock.$el.is(':visible');
		if (settingsHiden) {
			this.settingsBlock.$el.show();
		}

		// просчитываем параметры слайдера
		this.image.calcZoomMatrix();

		var dates = [];
		for (var i=1; i<=this.image.maxZoom; i+=0.5) {
			dates.push(modelNS.valueToLabel(i));
		}

		// calsZoomMatrix
		this.sliderModel = new modelNS.SliderModel({
			parent: this.previewBlockInner.$secondPane,
			min: 1,
			max: dates.length,
			dates: dates,
			//value: 1, // #12112 Закомментил
            value: zoomSliderValue, // #12112
			maxPosible: 1,
		});
		this.zoomSlider = new modelNS.VerticalSliderView({
			model: this.sliderModel,
			height: this.previewHeight
		});
		this.zoomSlider.render();

		if (!this.image.model.zoomEnabled) {
			this.zoomSlider.disable();
		}

		this.listenTo(this.zoomSlider, 'Change', this.onZoomChange);

		if (settingsHiden) {
			this.settingsBlock.$el.hide();
		}
	},
	renderTopButtons: function() {
		this.$buttonsBlock = $('<table class="buttons-block"><tr></tr></table>').appendTo(this.rightPanelLayout.$topPane);
		var $tr = this.$buttonsBlock.find("tr");

		this.infoBtn = new modelNS.Button({
			cls: 'info-btn'
			// disabled: this.model.get('params').mode != 'demo'
		});
		$tr.append($('<td/>').append(this.infoBtn.render().el));
		this.listenTo(this.infoBtn, 'ButtonClicked', this.onButtonClick);

		if (this.model.dataJSON.matchinglegend || this.model.dataJSON.hotspot) {
			this.answerBtn = new modelNS.Button({
				cls: 'answer-btn',
				disabled: false	/// TODO if no answer mode then disabled
			});
			$tr.append($('<td/>').append(this.answerBtn.render().el));
			this.listenTo(this.answerBtn, 'ButtonClicked', this.onButtonClick);
			this.$buttonsBlock.addClass('has-answer')
		}

		this.settingsBtn = new modelNS.Button({
			cls: 'settings-btn',
			active: this.model.get('params').mode == 'demo'
			// disabled: this.model.get('params').mode != 'demo'
		});
		$tr.append($('<td/>').append(this.settingsBtn.render().el));
		this.listenTo(this.settingsBtn, 'ButtonClicked', this.onButtonClick);
	},
	onButtonClick: function(button) {
		this.$buttonsBlock.find('.model-button').removeClass('active');
		button.$el.addClass('active');
		this.hideAllBlocks();
		if (button.$el.hasClass('info-btn')) {
			this.showInfo();
		} else
		if (button.$el.hasClass('answer-btn')) {
			this.showAnswer();
		} else
		if (button.$el.hasClass('settings-btn')) {
			this.showSettings();
		}
	},

	hideAllBlocks: function() {
		this.rightPanelLayout.$el.find('.main-blk').hide();
		this.$el.find('.connection-line').hide();
		this.$el.find('.spot').hide();
	},

	/// TODO optimize
	showInfo: function() {
		this.infoBlock.$el.show();
		this.infoBlock.titleBarResize();
	},
	showAnswer: function() {
		this.image.$el.hide();

		this.answerImage.$el.removeClass('hidden');
		this.answerBlock.$el.show();
		this.$el.find('.connection-line').show();
		this.$el.find('.spot').show();
		this.redrawSpotLines();
	},
	showSettings: function() {
		this.image.$el.show();
		this.hideAnswer();
		this.settingsBlock.$el.show();

		// если первым грузился не блок настроек, то после активации нужно пересчитать размеры
		this.onPreviewLoaded();
	},

	hideAnswer : function () {
		if (this.answerImage) this.answerImage.$el.addClass('hidden');
	},

	clickCheckAnswer : function ()
	{
		// this.checkBut.hide();
		// this.reloadBut.show();
		// this.solutionBut.show();
		this.model.dataJSON.matchinglegend ? this.checkMatchingLegend() : this.checkHotspot();
		this.answerMode = 'check';
	},

	clickReloadAnswer : function ()
	{
		this.reload();
	},

	clickShowSolution : function ()
	{
		this.showSolution();
	},

	renderAnswerBlock: function() {
		var self = this;

		this.answerMode = 'answer';

		this.answerBlock = new modelNS.SingleLayout({
			cls: 'answer-block main-blk',
			hasPadding: false,
			parent: this.rightPanelLayout.$bottomPane,
			hasTitleBar: true,
			title: microscopeNS.lang('answerTitle')
		});
		this.answerBlock.render();
		this.listenTo(this.answerBlock, 'ResizeTitleBar', this.resizeAnswerBlockTitle);

		// -------------- temp solution ----------------
		// this.checkBut = $('<button>'+microscopeNS.lang('check')+'</button>')
		// 	.click(function () { self.clickCheckAnswer(); })
		// 	.appendTo(this.answerBlock.$el);
    //
		// this.reloadBut = $('<button>'+microscopeNS.lang('reload')+'</button>')
		// 	.click(function () { self.clickReloadAnswer();	})
		// 	.hide()
		// 	.appendTo(this.answerBlock.$el);
    //
		// this.solutionBut = $('<button>'+microscopeNS.lang('solution')+'</button>')
		// 	.click(function () { self.clickShowSolution(); })
		// 	.hide()
		// 	.appendTo(this.answerBlock.$el);

		if (this.model.dataJSON.hotspot) {
			this.hasHotspots = $('<div class="has-spots"></div>')
				.appendTo(this.answerBlock.$el);
			// this.refreshHotspointsCount();
		}
		// ------------------------------

		this.checkPanel = new modelNS.SingleLayout({
			cls: 'microscope-check-panel',
			hasPadding: false,
			height: 60,
			parent: this.answerBlock.$el
		});
		this.checkPanel.$el.append('<div class="check-icon"></div>');
		this.checkPanel.render();
		if (this.model.dataJSON.matchinglegend) {
			this.lastSelected = null;
		}
		this.allSpots = [];
		this.spotCollection = new microscopeNS.SpotCollection();
		if (this.model.dataJSON.task) {
			this.taskBlockContent = new modelNS.SingleLayout({
				cls: 'info-block-content',
				hasPadding: false,
				border: false,
				parent: this.answerBlock.$el
			});
			this.taskBlockContent.render();
			this.taskBlockContent.$el.append(this.model.dataJSON.task);
			this.taskBlockContent.$el.mCustomScrollbar({
				theme:"3d-thick-dark"
			});
		}
		this.answerBlock.titleBarResize();

		// render answer images
		if (this.model.dataJSON.matchinglegend) {
			this.answerImage = this.renderImage(this.mainLayout.$firstPane, this.model.dataJSON.matchinglegend.classItem.image, 1, this.onAnswerImageLoaded);
		} else if (this.model.dataJSON.hotspot) {
			this.answerImage = this.renderImage(this.mainLayout.$firstPane, this.model.dataJSON.hotspot.file, 1, this.onHotSpotImageLoaded);
		} else {
			// this.answerBtn.$el.hide();
		}

		this.answerBlock.$el.hide();	// TODO: depend from mode posible opened only answer block
		this.hideAnswer();
	},
	refreshHotspointsCount: function () {
		if (this.hasHotspots) {
			var self = this,
					hasSpots = this.model.dataJSON.hotspot.points - (this.spotCollection ? this.spotCollection.length : 0),
					$containment = this.answerImage.getImageWrapper(),
					limits = this.answerImage.$el.offset(),
					titleBar = this.answerImage.titleBar,
					titleBarHeight = titleBar && titleBar.height() || 0,
					imageViewHeight = self.answerImage.$el.height(),
					imageViewWidth = self.answerImage.$el.width();

			this.hasHotspots.html('');

			for (var i=0; i<hasSpots; i++) {
				$("<i class='spot'/>")
					.appendTo(this.hasHotspots)
					.draggable({
						cursorAt: {left:8, top:8},
						start: function (event, ui) {
							if (self.answerMode != 'answer') return false;
						},
						stop: function (e, ui) {
							var offset = $containment.offset(),
									clickX = e.pageX - offset.left,
									clickY = e.pageY - offset.top;

							// console.log(e.pageX - limits.left,  e.pageY - limits.top)

							// limits
							if (e.pageY - limits.top - titleBarHeight < 0	// top
								|| e.pageY - limits.top > imageViewHeight
								|| e.pageX - limits.left < 0
								|| e.pageX - limits.left > imageViewWidth
							) {
								$(this).css({left:0, top:0});
								return;
							} else {
								$(this).remove();
							}

							self.createPoint({x:clickX-8, y:clickY-8});
						}
					});
			}
		}
	},
	renderInfo: function() {
		if (!this.model.dataJSON.description) {
			this.infoBtn.disable();
			return;
		}
		this.infoBlock = new modelNS.SingleLayout({
			cls: 'info-block main-blk',
			hasPadding: false,
			parent: this.rightPanelLayout.$bottomPane,
			// hasTitleBar: true,
			hasContent: true,
			title: microscopeNS.lang('infoTitle')
		});
		this.infoBlock.render();
		this.infoBlock.$content.append(this.model.dataJSON.description);
		this.infoBlock.$content.mCustomScrollbar({
			theme:"3d-thick-dark"
		});
		// this.infoBlockContent = new modelNS.SingleLayout({
		// 	cls: 'info-block-content',
		// 	hasPadding: false,
		// 	border: false,
		// 	hasContent: true,
		// 	parent: this.infoBlock.$el
		// });
		// this.infoBlockContent.render();
		// this.infoBlockContent.$content.append(this.model.dataJSON.description);
		// this.infoBlockContent.$content.mCustomScrollbar({
		// 	theme:"3d-thick-dark"
		// });
		this.listenTo(this.infoBlock, 'ResizeTitleBar', this.resizeInfoTitle);
	},
	resizeAnswerBlockTitle: function() {
		this.answerBlock.titleBar.width(this.answerBlock.$el.outerWidth() - 2);
	},
	resizeInfoTitle: function() {
		this.infoBlock.titleBar.width(this.infoBlock.$el.outerWidth() - 2);
	},
	renderSettings: function() {
		this.settingsBlock = new modelNS.SingleLayout({
			cls: 'settings-block main-blk',
			hasPadding: false,
			border: false,
			parent: this.rightPanelLayout.$bottomPane
		});
		this.settingsBlock.render();
		this.renderSwitchers();
		this.renderPreviewBlock();
	},
	renderSwitchers: function() {
		this.zoomBlock = new modelNS.SingleLayout({
			cls: 'zoom-block',
			hasTitleBar: true,
			title: microscopeNS.lang('zoom'),
			hasPadding: false,
			parent: this.settingsBlock.$el
		});
		this.zoomBlock.render();
		this.zoomBlock.$el.height(this.zoomBlock.$el.height() - 8);

		this.lightBlock = new modelNS.SingleLayout({
			cls: 'light-block',
			hasTitleBar: true,
			title: microscopeNS.lang('light'),
			hasPadding: false,
			parent: this.settingsBlock.$el
		});
		this.lightBlock.render();
		this.lightBlock.$el.height(this.lightBlock.$el.height() - 8);
		this.zoomSwitcherCollection = new modelNS.RadioButtonCollection([
																							{
																								checked: this.model.get('params').scale == 'small',
																								label: microscopeNS.lang('zoomSmall'),
																								disabled: this.model.dataJSON.layers.where({'scale': 'small'}).length == 0,
																								value: 'small'
																							}, {
																								checked: this.model.get('params').scale == 'middle',
																								label: microscopeNS.lang('zoomMiddle'),
																								disabled: this.model.dataJSON.layers.where({'scale': 'middle'}).length == 0,
																								value: 'middle'
																							}, {
																								checked: this.model.get('params').scale == 'large',
																								label: microscopeNS.lang('zoomLarge'),
																								disabled: this.model.dataJSON.layers.where({'scale': 'large'}).length == 0,
																								value: 'large'
																							}]);
		this.lightSwitcherCollection = new modelNS.RadioButtonCollection([
			{
				checked: this.model.get('params').light == 'direct',
				label: microscopeNS.lang('lightDirect'),
				disabled: this.model.dataJSON.layers.where({'light': 'direct'}).length == 0,
				value: 'direct'
			},
			{
				checked: this.model.get('params').light == 'reflected',
				label: microscopeNS.lang('lightReflected'),
				disabled: this.model.dataJSON.layers.where({'light': 'reflected'}).length == 0,
				value: 'reflected'
			}
		]);

		this.zoomSwitchers = new modelNS.RadioButtonGroup({collection: this.zoomSwitcherCollection, parent: this.zoomBlock.$el, verticalAlign: "middle"});
		this.lightSwitchers = new modelNS.RadioButtonGroup({collection: this.lightSwitcherCollection, parent: this.lightBlock.$el, verticalAlign: "middle"});
		this.listenTo(this.zoomSwitchers, 'Checked', this.onSwitchLayer)
			.listenTo(this.lightSwitchers, 'Checked', this.onSwitchLight);
		this.zoomSwitchers.render();
		this.lightSwitchers.render();
	},
	renderPreviewBlock: function() {
		this.previewBlock = new modelNS.SingleLayout({
			cls: 'preview-block',
			hasTitleBar: true,
			title: microscopeNS.lang('previewTitle'),
			hasPadding: false,
			parent: this.settingsBlock.$el
		});

		this.previewBlock.render();
		// #11938
		// Из-за процентной величины высоты блока появлется погрешность. Вычисляем высоту путем вычитания из родителя остальных блоков и отступов.
        this.previewBlock.$el.outerHeight(this.settingsBlock.$el.outerHeight() - this.zoomBlock.$el.outerHeight(true) - this.lightBlock.$el.outerHeight(true));
		this.previewBlockInner = new modelNS.DualVerticalLayout({
			cls: 'preview-block-inner',
			secondPaneWidth: 64,
			parent: this.previewBlock.$el
		});
		this.previewBlockInner.render();

		// this.renderSlider();

		// далее панель может скрыться, поэтому запоминаем высоту
		this.previewHeight = this.previewBlockInner.$secondPane.height();
	},
	onSwitchLight: function(switcher) {
		this.model.get('params').light = switcher.value;
		this.reloadView();

		var updateSwitcher = this.zoomSwitchers;
		for (var i=0; i<updateSwitcher.switchers.length; i++) {
			var radio = updateSwitcher.switchers[i],
					value = radio.model.get("value");
			var layer = this.model.dataJSON.layers.where({'scale': value,
				  										  'light': switcher.value});

			if (layer.length) {
				radio.enable();
			} else {
				radio.disable();
			}
		}
	},
	onSwitchLayer: function(switcher) {
		this.model.get('params').scale = switcher.value;
		this.reloadView();

		var updateSwitcher = this.lightSwitchers;
		for (var i=0; i<updateSwitcher.switchers.length; i++) {
			var radio = updateSwitcher.switchers[i],
					value = radio.model.get("value");
			var layer = this.model.dataJSON.layers.where({'scale': switcher.value,
				  										  'light': value});
			if (layer.length) {
				radio.enable();
			} else {
				radio.disable();
			}
		}
	},
	reloadView: function() {
		this.indicator.remove();
		this.preview.remove();
		var layer = this.model.dataJSON.layers.where({'scale': this.model.get('params').scale, 'light': this.model.get('params').light}),
			url = layer.length != 0 ? this.model.get('basePath') + layer[0].file : null;
		this.reloadImage(url);
	},
	reloadImage: function(url) {
		this.imagePosition = this.image.getImageWrapper().position();
		this.image.model.set({'url': url, 'currentZoom': this.sliderModel.get('dates')[this.zoomSlider.getValue() - 1]});
	},
	reloadPreview: function(url) {
		this.preview.model.set({'url': url});
	},
	onZoomChange: function() {
		this.image.zoomImage(this.zoomSlider.getValue());
		this.indicator.remove();
		this.renderIndicator();
	},
	renderPreview: function() {
		if (!this.rightPanelLayout) {
			return;
		}
		var layer = this.model.dataJSON.layers.where({'scale': this.model.get('params').scale,
			  										  'light': this.model.get('params').light});
		if (layer.length != 0) {
			layer = layer[0];
		}
		this.previewModel = new modelNS.SingleImage({
			url : this.model.basePath + layer.file,
			width: this.previewBlockInner.$firstPane.width() * 0.9,
			height: this.previewBlockInner.$firstPane.height() * 0.9,
			hasPadding: false
		});

		this.preview = new modelNS.SingleImageView({model: this.previewModel, className: 'single-image image-preview'});
		this.previewBlockInner.$firstPane.append(this.preview.render().el);
		this.listenTo(this.preview, 'ImageLoaded', this.onPreviewLoaded);
	},
	onPreviewLoaded: function (model) {
		// блок настроек должен быть видимым
		if (!this.settingsBlock.$el.is(':visible')) {
			return;
		}

		// выполняем только один раз
		if (this.preview.scaleK) {
			return;
		}

		var img = this.preview.getImage(),
			previewWidth = this.previewBlockInner.$firstPane.width(),
			previewHeight = this.previewBlockInner.$firstPane.height(),
			scaleK = Math.min(previewWidth / img[0].naturalWidth, previewHeight / img[0].naturalHeight),
			imgHeight = img[0].naturalHeight * scaleK,
			imgWidth = img[0].naturalWidth * scaleK;

			this.preview.$el.width(imgWidth)
						.height(imgHeight)
						.css({'margin-left': ((previewWidth - imgWidth) / 2) + 'px',
							  'margin-top': ((previewHeight - imgHeight) / 2) + 'px'});

			this.preview.scaleK = scaleK;

			this.renderIndicator();
	},
	renderIndicator: function() {
		this.indicatorModel = new microscopeNS.IndicatorModel({
			image: this.image,
			parent: this.preview
		});
		this.indicator = new microscopeNS.Indicator({model: this.indicatorModel});
		this.indicator.render();
	},
	renderImage: function(parentLayout, url, zoom, callback) {
		var imageModel = new modelNS.SingleImage({
				url: this.model.basePath + url,
				title: this.model.dataJSON.name.length > 48 ? this.model.dataJSON.name.substring(0, 45) + '...' : this.model.dataJSON.name,
				width: parentLayout.width(),
				height: parentLayout.height(),
				draggable: true,
				hasTitleBar: true,
				hasPadding: false,
				zoomEnabled: true,
				zoomControl: false,
				currentZoom: zoom,
				maxZoom: 3,
				zoomStep: 0.5,
				zoomAvailableAuto: true,
			}),
			image = new modelNS.SingleImageView({model: imageModel, cls: 'main-image-view'});

		parentLayout.append(image.render().el);
		this.listenTo(image, 'ImageLoaded', callback || this.imageLoaded);
		this.listenTo(image, 'ImageError', this.imageError);

		return image;
	},
	imageError: function() {
		this.reloadPreview(null);
	},
	prepareImage : function (model, view) {	/// TODO this.image => arg
		this.image.getImageWrapper().addClass('hidden-element');
		if (this.imagePosition) {
			if (this.imagePosition.left < view.$el.width() - view.getImage().width()) {
				this.imagePosition.left = view.$el.width() - view.getImage().width();
			}
			if (this.imagePosition.top < view.$el.height() - view.getImage().height()) {
				this.imagePosition.top = view.$el.height() - view.getImage().height();
			}
			this.image.getImageWrapper().css({'left': this.imagePosition.left + 'px',
										 'top': this.imagePosition.top + 'px'});
		}

		var $this = this;
		setTimeout(function() {	// ?????
			$this.image.getImageWrapper().removeClass('hidden-element');
		}, 500);
	},
	imageLoaded: function(model, view) {
		this.prepareImage(model, view);
		this.renderPreview();

		// для корректных расчетов временно показываем блок настроек
		this.renderSlider();
	},
	checkPanelSetWrong: function() {
		this.checkPanel.$el.removeClass('correct').addClass('wrong');
		this.checkPanel.$el.show();
	},
	checkPanelSetCorrect: function() {
		this.checkPanel.$el.removeClass('wrong').addClass('correct');
		this.checkPanel.$el.show();
	},

/* ----------------------------------------------------------------------------*/
/* --------------------- Answer Matching Legend -------------------------------*/
/* ----------------------------------------------------------------------------*/

	renderSourceImage: function() {
		var classGroup = this.model.dataJSON.matchinglegend.classGroup;
		this.sourceImageModel = new modelNS.SingleImage({
			url: this.model.basePath + classGroup.image,
			hasTitleBar: false,
			hasPadding: false
		});
		this.sourceImage = new modelNS.SingleImageView({model: this.sourceImageModel, cls: 'source-image'});
		this.answerBlock.$el.append(this.sourceImage.render().el);
		this.listenTo(this.sourceImage, 'ImageLoaded', this.onSourceLoaded);
	},
	onSourceLoaded: function(model, view) {
		this.createSourceMap();
	},
	createMap: function(regions, mapName, relatedImage, hasPoints) {
		var $map = $('<map name="' + mapName + '"/>'),
			scaleK = this.answerImage.scaleK,
			$this = this;

		regions.each(function(model) {
			// #10752 применяем к координатам масштаб изображения после того как оно вписалось в контейнер
			var coords = model.get('coords').replace(/ /g, '').split(",");
			for (var i=0; i<coords.length; i++) {
				coords[i] = Math.round(coords[i]*scaleK);
			}

			var $area = $('<area id="' + model.get('index') + '" shape="' + model.get('type') + '" coords="' + coords + '"/>');

			$map.append($area);
			if (hasPoints) {
				$this.generatePoint(model, relatedImage);
			}
			$area.click(function(e) {
				$this.createPoint(e, model);
			});
		});
		this.$el.append($map);
		relatedImage.attr('usemap', '#' + mapName);
		return $map;
	},
	createSourceMap: function() {
		this.$sourceMap = this.createMap(this.model.dataJSON.matchinglegend.classGroup.regions,
					   'sourceImageMap', this.sourceImage.getImage(), true);
	},
	createMainImageMap: function() {
		this.$mainMap = this.createMap(this.model.dataJSON.matchinglegend.classItem.regions,
					   'mainImageMap', this.answerImage.getImage(), true); // #10743 Сменил аргумент hasPoint на true, чтобы отображались точки на основной картинке
	},
	generatePoint: function(model, relatedImage) {
		var point = $('<div class="source-point"></div>'),
		    $this = this;
		// #10743 Если генерируем точки на основной картинке, то добавим масштабирование
		var scaleValue = model.get('parentType') === 'classitem' ? this.answerImage.scaleK : 1;

        // #10743 Если имеются видимые регионы на картинке, то клик может производиться только по ним
		if (!model.get('point').visible || model.get('point').visible === 'true') {
            relatedImage.unbind('click');
		}

		point.css({
			'left': Math.round(model.get('point').x * scaleValue) - 21 + 'px', // #10743
			'top': Math.round(model.get('point').y * scaleValue) - 21 + 'px', // #10743
			'display': !model.get('point').visible || model.get('point').visible === 'true' ? 'block' : 'none' // #10743 Отображение в зависимости от атрибута
		});
		var pointRegion = $('<div class="source-point-region"></div>');// #10743
		var regionCoords = model.get('coords').split(',');// #10743

		// #10743 Задаем свойства региону в зависимости от его формы
		// Если регион указывается на картинке, то scaleValue будет равен масштабу. Если нет, то 1.
		if (model.get('type') == 'rect') {
            pointRegion.css({
                'left': (parseFloat(regionCoords[0]) * scaleValue) + 'px',
                'top': (parseFloat(regionCoords[1]) * scaleValue) + 'px',
                'width': (parseFloat(regionCoords[2]) - parseFloat(regionCoords[0])) + 'px',
                'height': (parseFloat(regionCoords[3]) - parseFloat(regionCoords[1])) + 'px'
            });
		} else if (model.get('type') == 'circle') {
            pointRegion.css({
                'left': (parseFloat(regionCoords[0]) * scaleValue - 21) + 'px', // #10743
                'top': (parseFloat(regionCoords[1]) * scaleValue - 21) + 'px', // #10743
                'width': (parseFloat(regionCoords[2]) * 2) + 'px',
                'height': (parseFloat(regionCoords[2]) * 2) + 'px',
                'border-radius': '50%'
            });
		}
		relatedImage.parent().append(point);
        relatedImage.parent().append(pointRegion);// #10743
		point.click(function(e) {
			$this.createPoint(e, model);
		});
        pointRegion.click(function(e) {
            $this.createPoint(e, model);
        });
	},
	onAnswerImageLoaded: function(model, view) {
		// this.prepareImage(model, view);

		var $this = this;
		this.answerImage.getImage().click(function(e) {
			if ($this.spotCollection.length == $this.model.dataJSON.matchinglegend.classItem.regions.length * 2) {
			//	$this.checkMatchingLegend();
				return;
			}
			var fakeModel = new microscopeNS.Region({
				x: e.offsetX,
				y: e.offsetY,
				index: -1,
				parentType: 'classitem',
				selected: true,
				correct: false
			});

			$this.createPoint(e, fakeModel);
		});
		this.createMainImageMap();
		this.listenTo(view, 'DragStart', function(e, ui) {
			$this.dragging = true;
		});

		this.listenTo(view, 'DragStop', function(e, ui) {
			$this.dragging = false;
			$this.redrawSpotLines();
		});
		this.listenTo(view, 'Drag', function(e, ui) {
			$this.redrawSpotLines();
		});
		this.renderSourceImage();
	},

	// размещаем точку в изображении
	createPoint: function(e, region) {
		if (this.answerMode != 'answer' && !e.openMode) {
			return;
		}

		// определяем регион в который попапала точка
		if (!region) {
			region = this.findRegion(e);
		}

		if (!region) {
			region = this.fakeRegion();
		}

		if (this.dragging) {
			return;
		}

		var self = this;

		// режим matchinglegend
		if (this.model.dataJSON.matchinglegend) {
			if (this.spotCollection.length == this.model.dataJSON.matchinglegend.classItem.regions.length * 2 && !e.openMode) {
				return;
			}
			var parent = region.get('parentType') == 'classitem' ? this.answerImage.getImageWrapper() : this.sourceImage.$el,
					offset = $(parent).offset(),
					clickX = e.pageX - offset.left,
					clickY = e.pageY - offset.top;
			// #10743 Установка координат точки в зависимости от условия
			var spotModelData = {
                region: region
			};

			if (e.x || region.get('parentType') == 'classgroup') {
                spotModelData.x = region.get('point').x - 13;
            // Если идет установка точки classitem в видимом регионе на главной картинке, то умножим на масштаб картинки
			// Если клик был по картинке, а видимых регионов нет, то region.get('point') будет undefined
			} else if (region.get('parentType') == 'classitem' && region.get('point')) {
                spotModelData.x = Math.round(region.get('point').x * this.answerImage.scaleK - 13);
			} else {
                spotModelData.x = clickX/CourseConfig.zoomScale - 8
			}
            if (e.y || region.get('parentType') == 'classgroup') {
                spotModelData.y = region.get('point').y - 13;
                // Если идет установка точки classitem в видимом регионе на главной картинке, то умножим на масштаб картинки
                // Если клик был по картинке, а видимых регионов нет, то region.get('point') будет undefined
            } else if (region.get('parentType') == 'classitem' && region.get('point')) {
                spotModelData.y = Math.round(region.get('point').y * this.answerImage.scaleK - 13);
            } else {
                spotModelData.y = clickY/CourseConfig.zoomScale - 8
            }

            // #10743 Закомментировал этот блок
			/*var spotModel = new microscopeNS.SpotModel({
						x: e.x || (region.get('parentType') == 'classgroup' || e.openMode ? region.get('point').x - 2 : clickX/CourseConfig.zoomScale - 8),
						y: e.y || (region.get('parentType') == 'classgroup' || e.openMode ? region.get('point').y - 2 : clickY/CourseConfig.zoomScale - 8),
						region: region
					});*/
            var spotModel = new microscopeNS.SpotModel(spotModelData);
			var spot = new microscopeNS.Spot({
				    		parent: parent,
				    		model: spotModel,
								imicro: self
				    	});

			if (this.lastSelected) {
	    		var lastSelectedType = this.lastSelected.model.get('region').get('parentType');
	    		if (lastSelectedType == spot.model.get('region').get('parentType')) {
	    			this.removeSpot(this.lastSelected);
	    			this.lastSelected = spot;
	    		} else {
	    			var line = this.drawLine(this.lastSelected.model, spotModel);
	    			this.lastSelected.model.set({connectedTo: spot, line: line});
	    			spotModel.set({connectedTo: this.lastSelected, line: line});
	    			this.$el.append(line);
	    			this.lastSelected = null;
	    		}
	    	} else {
	    		this.lastSelected = spot;
	    	}
		}

		// режим hotspot
		else {
			if (this.spotCollection.length == this.model.dataJSON.hotspot.points) { // #12255
			 	return;
			}
			var parent = this.answerImage.getImageWrapper(),
				offset = $(parent).offset();

			// #10752
			// Если клик был произведен не по картинке, а по региону, то нужно вычесть отступы родителя из координат места клика..
			// Отступы появляются, если двигать картинку. При клике по картинке координаты рассчитываются верно.
			var parentPositionLeft = 0;
			var parentPositionTop = 0;
			if (!$(e.currentTarget).hasClass('draggable')) {
                parentPositionLeft = parent.position().left;
                parentPositionTop = parent.position().top;
			}

			var	clickX = e.offsetX - parentPositionLeft,
				clickY = e.offsetY - parentPositionTop,
				spotModel = new microscopeNS.SpotModel({
						x: e.x || clickX - 8,
						y: e.y || clickY - 8,
						region: region
					}),
				spot = new microscopeNS.Spot({
		    		parent: parent,
		    		model: spotModel,
						imicro: self
					});
		}
		spot.render();

		this.spotCollection.add(spotModel);
		this.allSpots.push(spot);

		var $this = this;
		this.listenTo(spot, 'SpotRemoved', function(spotModel) {
			$this.spotCollection.remove(spotModel);
		});

		this.refreshHotspointsCount();
	},
	fakeRegion: function () {
		return new microscopeNS.Region({	// fake
			index: -1,
			selected: true,
			correct: false
		});
	},
	findRegion: function (point) {
		var regions,
				foundRegion = null,
				scaleK = this.answerImage.scaleK;

			if (this.model.dataJSON.matchinglegend) {
				// regions = this.model.dataJSON.matchinglegend.classItem.regions;
				regions = this.model.dataJSON.matchinglegend.classGroup.regions;
			} else {
				regions = this.model.dataJSON.hotspot.regions
			}

			regions.each(function(region) {
				var coords = region.get('coords').split(","),
						type = region.get('type');

				if (type == 'poly') {
					var points = [];
					for (var c=0; c<coords.length; c++) {
							points.push({x:parseFloat(coords[c]), y:parseFloat(coords[++c])});
					}
					if (microscopeNS.AreaUtils.isPointInPoly(point, points)) {
						foundRegion = region;
						return false;
					}
				}

				if (type == 'circle') {
					var circle = {x:coords[0]*scaleK,y:coords[1]*scaleK,r:coords[2]*scaleK};
					if (microscopeNS.AreaUtils.isPointInCircle(point, circle)) {
						foundRegion = region;
						return false;
					}
				}

			});

			return foundRegion;
	},
	removeSpot: function(spot) {
		this.spotCollection.remove(spot.model);
		spot.remove();
	},
	removeAllLines: function () {
		this.answerImage.$el.find('.connection-line').remove();
	},
	removeAllCircles: function () {
		this.answerImage.$el.find('.circle-line').remove();
	},
	removeAllSpots : function ()
	{
		var self = this;
		for (var i=0; i<this.allSpots.length; i++) {
			var spot = this.allSpots[i];
			this.removeSpot(spot);
			spot.spotRemove();
		}
		this.allSpots = [];
	},
	removeAllWrongLines: function() {
		this.$el.find('.connection-line.wrong').remove();
	},
	redrawSpotLines: function() {
		var spots = this.spotCollection.filter(function(spot) {
			return spot.get('connectedTo') != undefined;
		});
		for (var i = 0; i < spots.length; i++) {
			var spot = spots[i],
			    type = spot.get('region').get('parentType');
			if (type == 'classgroup') {
				var connectedTo = spot.get('connectedTo');
				this.drawLine(spot, connectedTo.model);
			}
		}
	},
	drawLine: function(spot1, spot2) {
        // #10743 Дальнейший кусок кода закомментировал, т.к. он не имеет смысла из-за того, что после него используется
        // функция getSpotPosition и аннулирует все эти вычисления. Со временем этот код можно удалить
		/*var firstPane = this.mainLayout.$firstPane,
			secondPane = this.mainLayout.$secondPane,
			answerPane = this.rightPanelLayout.$bottomPane,
			sourceImage = this.sourceImage.$el,
			imageWrapper = this.answerImage.getImageWrapper();

		var x1 = (spot1.get('region').get('parentType') == 'classitem' ?
				 parseInt(firstPane.position().left) +  parseInt(spot1.get('x')) + imageWrapper.position().left :
				 parseInt(secondPane.position().left) + sourceImage.position().left + answerPane.position().left + parseInt(spot1.get('x'))) + 12,
			y1 = (spot1.get('region').get('parentType') == 'classitem' ?
				 parseInt(firstPane.position().top) + parseInt(spot1.get('y')) + imageWrapper.position().top :
				 parseInt(secondPane.position().top) + sourceImage.position().top + answerPane.position().top + parseInt(spot1.get('y'))) + 12,
			x2 = (spot2.get('region').get('parentType') == 'classitem' ?
				 parseInt(firstPane.position().left) + parseInt(spot2.get('x')) + imageWrapper.position().left:
	    		 parseInt(secondPane.position().left) + sourceImage.position().left + answerPane.position().left + parseInt(spot2.get('x'))) + 12,
	    	y2 = (spot2.get('region').get('parentType') == 'classitem' ?
	    		 parseInt(firstPane.position().top) + parseInt(spot2.get('y')) + imageWrapper.position().top :
	    		 parseInt(secondPane.position().top) + sourceImage.position().top + answerPane.position().top + parseInt(spot2.get('y'))) + 12;
		if (spot1.get('region').get('parentType') == 'classitem') {
			x1 = x1 < 5 ? 5 : x1 > this.answerImage.$el.width() ? this.answerImage.$el.width() : x1;
			y1 = y1 < 5 ? 5 : y1 > this.answerImage.$el.height() ? this.answerImage.$el.height() : y1;
		}
		if (spot2.get('region').get('parentType') == 'classitem') {
			x2 = x2 < 5 ? 5 : x2 > this.answerImage.$el.width() ? this.answerImage.$el.width() + 4 : x2;
			y2 = y2 < 5 ? 5 : y2 > this.answerImage.$el.height() ? this.answerImage.$el.height() + 4 : y2;
		}*/

		var spotPos1 = this.getSpotPosition(spot1),
			spotPos2 = this.getSpotPosition(spot2),
			x1 = spotPos1.left,
			y1 = spotPos1.top,
			x2 = spotPos2.left,
			y2 = spotPos2.top;



		return modelNS.drawLine(x1, y1, x2, y2, spot1.get('line'));
	},

	// Возвращает координаты spot относительно главной панели микроскопа
	getSpotPosition: function ( spot ) {
		if (spot.get('region').get('parentType') == 'classitem') {
			var leftPanePos = this.mainLayout.$firstPane.position(),
					answerImagePos = this.answerImage.getImageWrapper().position();
			return {
				left: (leftPanePos.left + answerImagePos.left)/CourseConfig.zoomScale + spot.get('x') + 13,
				top: (leftPanePos.top + answerImagePos.top)/CourseConfig.zoomScale + spot.get('y') + 13,
			}
		} else {
			var rightPanePos = this.mainLayout.$secondPane.position(),
					answerPanePos = this.rightPanelLayout.$bottomPane.position(),
					sourceImagePos = this.sourceImage.$el.position();
			return {
				left: (rightPanePos.left + sourceImagePos.left + answerPanePos.left)/CourseConfig.zoomScale + spot.get('x') + 13,
				top: (rightPanePos.top + sourceImagePos.top + answerPanePos.top)/CourseConfig.zoomScale + spot.get('y') + 13,
			}
		}
	},

	checkMatchingLegend: function( silent ) {
		var self = this,
				wrong = false,
				correctAnswers = this.model.dataJSON.matchinglegend.classItem.regions.length;

		// if not all answered
		if (this.spotCollection.length != correctAnswers * 2) {
			wrong = true;
		}

		this.correctAnswers = [];
		this.spotCollection.each(function(spot) {
			var region = spot.get('region');
			if (region.get('parentType') == 'classitem') {
				if (region.get('correct') == false) {
					spot.get('view').setWrong();
					wrong = true;
					return;
				}
				var connectedTo = spot.get('connectedTo');
				if (!connectedTo) {
					wrong = true;
					return;
				}
				if (connectedTo && connectedTo.model.get('region').get('correct') == false) {
					if (!silent) spot.get('view').setWrong();
					wrong = true;
					return;
				}
				if (connectedTo.model.get('region').get('index') != region.get('index')) {
					if (!silent) spot.get('view').setWrong();
					wrong = true;
					return;
				}
				spot.get('view').setCorrect();
				self.correctAnswers.push(region.get('index'));
			}
		});

		// if (!silent) {
			// wrong ? this.checkPanelSetWrong() :	this.checkPanelSetCorrect();
		// }

		return this.correctAnswers.length / correctAnswers * 100;
	},

	openMatchingLegend: function() {
		var mainRegions = this.model.dataJSON.matchinglegend.classItem.regions,
				sourceRegions = this.model.dataJSON.matchinglegend.classGroup.regions,
				self = this;

		mainRegions.each(function(model) {

			// show only not founded answers
			if (self.correctAnswers.indexOf(model.get('index'))>=0) {
				console.log(self.correctAnswers)
				return;
			}
			self.createPoint({openMode:true}, model);
			sourceRegions.each(function(source) {
				if (source.get('index') === model.get('index')) {
					self.createPoint({openMode:true}, source);
				}
			});
		});

		this.checkMatchingLegend();

	},

/* -------------------------------------------------------------------*/
/* ------------------------ HOTSPOT ----------------------------------*/
/* -------------------------------------------------------------------*/

	/// TODO this.image => this.answerImage
	onHotSpotImageLoaded: function(model, view) {
		this.prepareImage(model, view);

		var $this = this;
		this.answerImage.getImage().click(function(e) {
			var fakeModel = new microscopeNS.Region({
				x: e.offsetX,
				y: e.offsetY,
				selected: true,
				correct: false
			});
			$this.createPoint(e, fakeModel);
		});
		this.createHotSpotImageMap();
		this.listenTo(view, 'DragStart', function(e, ui) {
			$this.dragging = true;
		});
		this.listenTo(view, 'DragStop', function(e, ui) {
			$this.dragging = false;
		});
		this.refreshHotspointsCount();
	},
	showHotspotCorrectAnswer: function () {
		var regions = this.model.dataJSON.hotspot.regions,
				imageWrapper = this.answerImage.imageWrapper,
				scaleK = this.answerImage.scaleK;

		regions.each(function(model) {
			var coords = model.get('coords').split(","),
					type = model.get('type'),
					x1, y1, x2, y2, $line;

			if (type == "poly") {
				for (var i=0; i<coords.length; i++) {
					x2 = parseInt(coords[i] * scaleK);
					y2 = parseInt(coords[++i] * scaleK);
					if (x1) modelNS.drawLine(x1, y1, x2, y2).appendTo(imageWrapper);
					x1 = x2;
					y1 = y2;
				}

				if (x2) modelNS.drawLine(x2, y2, parseInt(coords[0] * scaleK), parseInt(coords[1] * scaleK)).appendTo(imageWrapper);
			}

			if (type == "circle") {
				var x = parseFloat(coords[0])*scaleK,
						y = parseFloat(coords[1])*scaleK,
						r = (parseFloat(coords[2]))*scaleK - 3*2; // 3 - компенсация размера border
				$('<div class="circle-line"/>')
					.css({
						left: x - r - 3, // 3 - компенсация размера border
						top: y - r - 3,
						height: r*2,
						width: r*2,
					})
					.appendTo(imageWrapper);
			}

		});
	},
	createHotSpotImageMap: function() {
        // Изменить координаты относительно масштаба
    //     for (var i = 0; i < this.model.dataJSON.hotspot.regions.models.length; i++) {
    //         var coords = this.model.dataJSON.hotspot.regions.models[i].get('coords').split(',');
    //         for (var j = 0; j < coords.length; j++) {
    //             coords[j] = parseInt(coords[j] * this.answerImage.scaleK);
    //         }
    //         this.model.dataJSON.hotspot.regions.models[i].set({coords: coords.join(',')});
    //     }
		// this.createMap(this.model.dataJSON.hotspot.regions,
		// 			   'hotSpotImageMap', this.answerImage.getImage(), false);

		// #10752
		this.createMap(this.model.dataJSON.hotspot.regions,
						   'hotSpotImageMap', this.answerImage.getImage(), false);
	},
	checkHotspot: function( silence ) {
		var $this = this,
				wrong = false,
				regions = this.model.dataJSON.hotspot.regions,
				requirepoints = this.model.dataJSON.hotspot.requirepoints,
				points = this.model.dataJSON.hotspot.points,
				correctCount = 0,
				wrongCount = 0,
				correctRequire = 0,
				answers = {},
				correctRegions = [];

		this.spotCollection.each(function(spot) {
			var region = spot.get('region'),
					index = region.get('index');

			// #12255
			// Если количество точек больше, чем регионов, то позволим указывать несколько точек в одном
			var onlyOnePerRegion = points > requirepoints ? false : correctRegions.indexOf(region) !== -1;

			if (region.get('correct') == false
				// #12255
				//|| (points > requirepoints ? false : correctRegions.indexOf(region) !== -1)	// только одна точка в регионе допускается
                || onlyOnePerRegion
			) {
					if (!silence) spot.get('view').setWrong();
					wrong = true;
					wrongCount++;
			} else {
					if (!silence) spot.get('view').setCorrect();
					correctRegions.push(region);
					correctCount++;
			}

			if (!answers[index]) answers[index] = 0;
			answers[index]++;
		});

		// check evry region require answer
		var correctAnswerRegion = 0,
				correctRequireRegion = 0;
		regions.each(function(model) {
			var index = model.get('index');

			// #12255
			// Если точек больше, чем правильных регионов, то все регионы обязательно должны быть заполнены
			if (points > requirepoints && !answers[index]) {
                wrong = true;
                wrongCount++;
			}

			if (answers[index] < model.get('requirepoints')) {
				wrong = true;
			}

			correctAnswerRegion += Math.min(answers[index]||0, model.get('requirepoints'));
			correctRequireRegion += model.get('requirepoints');
		});

		// check alltogether answers
		if (correctCount < requirepoints) wrong = true;

		// if (!silence) {
			// wrong ? $this.checkPanelSetWrong() : $this.checkPanelSetCorrect();
		// }

		var score = requirepoints ? correctCount/requirepoints : 1;
		if (correctRequireRegion) score = Math.min(correctAnswerRegion/correctRequireRegion, score);

		// console.log(requirepoints, correctRequireRegion, correctAnswerRegion, score)

		return Math.max(Math.min(score,1) - (1/points*wrongCount), 0)*100;
	},

/* ----------------------------------------------------------------------------*/

	renderSolutionViewMatchingLegend: function() {

	},
	renderSolutionViewHotspot: function() {

	}

});

microscopeNS.AreaUtils = {
	isPointInPoly: function (point, points) {
		var nvert = points.length,
				i, j, c = 0;
		for (i = 0, j = nvert-1; i < nvert; j = i++) {
			if ( ((points[i].y>point.y) != (points[j].y>point.y)) &&
			 (point.x < (points[j].x-points[i].x) * (point.y-points[i].y) / (points[j].y-points[i].y) + points[i].x) )
				 c = !c;
		}
		return c;
	},
	isPointInCircle: function (point, circle) {
			var a = point.x,
					b = point.y,
					x = circle.x,
					y = circle.y,
					r = circle.r;

	    var dist_points = (a - x) * (a - x) + (b - y) * (b - y);
	    r *= r;
	    if (dist_points < r) {
	        return true;
	    }
	    return false;
	},
}
