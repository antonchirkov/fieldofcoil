function ComplexMap(xmlData, wrapper, basePath) {
	var model, view;
	this.init = function() {
		model = new modelNS.ComplexMap({
			xmlData: xmlData,
			wrapper: wrapper,
			basePath: basePath,
			scalable: false,
			width: wrapper.attr('data-width'),
			height: wrapper.attr('data-height')
		});
		view = new modelNS.ComplexMapView({ model: model }).render();
	};
}

modelNS.Legend = Backbone.Model.extend({
	initialize: function(options) {
		this.img = options.img;
		this.date = options.date;
	}
});

modelNS.LegendCollection = Backbone.Collection.extend({
	model: modelNS.Legend
});

modelNS.Date = Backbone.Model.extend({
	initialize: function(options) {
		this.id = options.id;
		this.current = options.current;
		this.date = options.date;
		this.valign = options.valign; // #11635
	}
});

modelNS.DateCollection = Backbone.Collection.extend({
	model: modelNS.Date
});

modelNS.Layer = Backbone.Model.extend({
	initialize: function(options) {
		this.id = options.id;
		this.def = options.def;
		this.title = options.title;
		this.dates = options.dates;
		this.svgElements = options.svgElements;
		this.legend = options.legend || '';
	}
});

modelNS.LayerCollection = Backbone.Collection.extend({
	model: modelNS.Layer
});

modelNS.ComplexMap = modelNS.BaseModel.extend({
	defaults: _.extend({}, modelNS.BaseModel.prototype.defaults, {}),
	initialize: function(options) {
		this.constants = {
			zoom: {
				OFF: 'off',
				REAL: 'real',
				VIRTUAL: 'virtual'
			}
		};
		var $xml = $($.parseXML(options.xmlData)),
			map = $xml.find('imap');
		if (map.attr('width')) {
			this.defaults.width = map.attr('width');
			this.defaults.height = map.attr('height');
		}
		else {
			this.defaults.width = options.width;
			this.defaults.height = options.height;
		}
		modelNS.BaseModel.prototype.initialize.apply(this, [options]);
		this.options = options;
	},
	parseXML: function(xmlData) {
		var $model = this,
			$xml = $($.parseXML(xmlData)),
			map = $xml.find('imap'),
			settings = {};
		settings['zoom'] = map.attr('zoom') || this.constants.zoom.OFF;
		if (settings['zoom'] != this.constants.zoom.OFF) {
			settings['zoommax'] = typeof map.attr('zoommax') != 'undefined' ? parseFloat(map.attr('zoommax')) : 2;
			settings['zoomstep'] = typeof map.attr('zoomstep') != 'undefined' ? parseFloat(map.attr('zoomstep')) : 1;
		}
		settings['play'] = map.attr('play') || false;
		settings['height'] = map.attr('height') || this.options.height;
		settings['width'] = map.attr('width') || this.options.width;
		settings['layers'] = new modelNS.LayerCollection();
		map.find('layer').each(function() {
			var id = $(this).attr('id'),
				title = $(this).attr('title') || '',
				def = $(this).attr('default') || false,
				layer = { id: id, title: title, def: def },
				svgElements = new modelNS.SVGElementCollection(),
				dates = new modelNS.DateCollection();
			$(this).find('element').each(function() {
				svgElements.add({ svgregion: $(this).attr('svgregion'), link: $(this).attr('link') });
			});
			$(this).find('date').each(function() {
				dates.add({
					id: $(this).attr('id'),
					date: $(this).text(),
					current: $(this).attr('current') || false,
					valign: $(this).attr('valign') || 'top' // #11635
				});
			});
			if (dates.where({ 'current': true }).length == 0) {
				var first = dates.at(0);
				if (first) {
					first.set({ 'current': true });
				}
			}
			var legend = new modelNS.LegendCollection();
			$(this).find('legend').each(function() {
				legend.add({
					img: $(this).attr('img'),
					date: $(this).attr('date'),
					width: $(this).attr('width'), // #12702
					height: $(this).attr('height') // #12702
				});
			});
			layer['legend'] = legend;
			layer['svgElements'] = svgElements;
			layer['dates'] = dates;
			settings.layers.add(layer);
		});
		settings['popups'] = [];
		map.find('popup').each(function() {
			var id = $(this).attr('id') || '' ? $(this).attr('id') : $(this).attr('name'),
				width = $(this).attr('width'),
				height = $(this).attr('height'),
				content = courseML.getHTMLFromCourseML($(this));
			settings.popups.push({ closableOnOverlayClick: true, id: id, width: width, height: height, content: content });
		});
		return settings;
	}
});

modelNS.CMSingleImageView = modelNS.SingleImageView.extend({
	initialize: function(options) {
		modelNS.SingleImageView.prototype.initialize.apply(this, [options]);
	},
	render: function() {
		modelNS.SingleImageView.prototype.render.apply(this);
		return this;
	},
	onImageLoaded: function(model) {
		modelNS.SingleImageView.prototype.onImageLoaded.apply(this, [this]);
		this.$el.attr('id', model.id);
		var titleBar = this.$el.find('.title-bar');
		titleBar.css('width', 'auto');
		//		titleBar.width(titleBar.find('span').width() + 30);
	}
});

modelNS.ComplexMapView = modelNS.BaseModelView.extend({
	initialize: function(options) {
		modelNS.BaseModelView.prototype.initialize.apply(this, [options]);
		this.legendOpened = false;
		this.currentZoom = 10;
		this.playInterval = null;
		this.currentLayer = null;
		this.currentDate = 0;
		this.previousDate = 0;
	},
	render: function() {
		modelNS.BaseModelView.prototype.render.apply(this);
		this.$el.addClass('complex-map');
		this.popupCollection = new modelNS.PopupCollection(this.model.dataJSON.popups);
		this.renderMainView();
		this.$el.find('.single-image').css('height', 'auto');
		console.log('$mapArea', this.$el);

		return this;
	},
	renderMainView: function() {
		if (this.mainView) {
			this.mainView.$el.show();
			return;
		}
		this.mainView = new modelNS.SingleLayout();
		this.$el.append(this.mainView.render().el);

		this.mainLayer = this.mainLayer || this.model.dataJSON.layers.where({ 'def': 'true' });
		if (this.mainLayer.length != 0) {
			this.mainLayer = this.mainLayer[0];
		}

		// «Примеры ЭОР для фронтальной работы» (Physicon_IMUMK_Course_363731)
		// Не работает iMap (интерактивная карта) на слайде 1.4.1.2 (может быть просто потому, что картинка не подгрузилась)
		// причина Resources в курсе с большой буквы
		// resources => Resources

		this.mapImageModel = this.mapImageModel || new modelNS.SingleImage({
			id: this.mainLayer.get('id'),
			url: this.model.basePath + 'Resources/' + this.mainLayer.get('id') + '/' + this.mainLayer.get('id') + '.svg',
			title: this.mainLayer.get('title'),
			hasTitleBar: true,
			hasPadding: false,
			draggable: true,
			width: this.mainView.$el.width(),
			height: this.mainView.$el.height(),
			elements: this.mainLayer.svgElements.clone()
		});
		this.pictureView = new modelNS.CMSingleImageView({ model: this.mapImageModel });
		this.mainView.$el.append(this.pictureView.render().el);

		this.listenTo(this.pictureView, 'ImageLoaded', this.onMapLoaded);
		this.listenTo(this.pictureView, 'ElementClick', this.onElementClick);
	},
	resizeView: function() {
		//		this.$el.height(this.pictureView.$el.find('svg').get(0).getBBox().height);
		//		this.model.wrapper.height((this.$el.height()) * this.model.scale);
		//		this.pictureView.$el.height(this.$el.height());
	},
	resizeSVG: function() { // #11635
        var $svgElem = $(this.areaImage.$el.find('svg')[0]);
        $svgElem.attr('width', this.areaImage.$el.width() + 'px');
        $svgElem.attr('height', this.areaImage.$el.height() + 'px');
        this.areaImage.$el.find('.imageWrapper').width(this.areaImage.$el.width()).height(this.areaImage.$el.height());
	},
	renderAreaView: function(layer) {
		this.areaView = new modelNS.DualHorizontalLayout({
			nopadding: true,
			topPaneHeight: this.$el.height(),
			bottomPaneHeight: 75, // #11635 Высота панели управления(65) + верхнее поле(10)
			parent: this.$el
		});
		this.areaView.render();
		this.currentLayer = layer;
		this.currentDate = layer.get('dates').where({ 'current': 'true' })[0];
		if (!this.currentDate) {
			this.currentDate = layer.get('dates').at(0);
		}
		this.currentDate = layer.get('dates').indexOf(this.currentDate);
		this.previousDate = this.currentDate;
		this.areaImageModel = new modelNS.SingleImage({
			id: layer.get('id'),
			url: this.model.basePath + 'Resources/' + layer.get('id') + '/' + this.currentDate + '/zoom_' + this.currentZoom + '/' + layer.get('id') + '.svg',
			title: layer.get('title'),
			hasTitleBar: true,
			hasPadding: false,
			width: this.areaView.$topPane.width(),
			height: this.areaView.$topPane.height(),
			elements: layer.svgElements.clone(),
			draggable: true,
			zoomEnabled: this.model.dataJSON.zoom != this.model.constants.zoom.OFF,
			zoomControl: this.model.dataJSON.zoom != this.model.constants.zoom.OFF,
			maxZoom: this.model.dataJSON.zoommax,
			zoomStep: this.model.dataJSON.zoomstep
		});

		this.areaImage = new modelNS.CMSingleImageView({ model: this.areaImageModel });
		this.areaView.$topPane.append(this.areaImage.render().el);


		this.backButton = new modelNS.Button({ cls: 'backbutton' });
		this.areaView.$topPane.append(this.backButton.render().el);

		var columns = this.model.dataJSON.play == 'true' ? [{ width: 73, height: 40 }, { width: this.areaView.$bottomPane.width() - 146, height: 40 }, { width: 73, height: 40 }] : [{ width: this.areaView.$bottomPane.width() - 73, height: 40 }, { width: 73, height: 40 }];
		this.footer = new modelNS.MultipleColumnLayout({
			parent: this.areaView.$bottomPane,
			columns: columns
		});
		this.footer.render();
		this.footer.$el.addClass('complex-map-footer');

		if (this.model.dataJSON.play == 'true') {
			this.playButton = new modelNS.Button({ cls: 'play-button', tooltip: 'Вперёд' });
			this.footer.getColumn(0).append(this.playButton.render().el);
			this.listenTo(this.playButton, 'ButtonClicked', this.onPlayClicked);
		}

		this.legendButton = new modelNS.Button({ cls: 'legend-button', tooltip: 'Легенда' });
		this.footer.getColumn(this.model.dataJSON.play == 'true' ? 2 : 1).append(this.legendButton.render().el);
		var dates = [];

		// #11635 Создание объекта marks, чтобы использовать модель HorizontalSliderHandler, где поддержан атрибут
		// valign у меток.
		var marks = new modelNS.MarkCollection();
		for (var i = 0; i < layer.dates.length; i++) {
			var date = layer.dates.at(i);
			dates.push(date.date);

			var labels = new modelNS.LabelCollection();
			labels.add({
                value: date.get('date'),
                align: null,
                valign: date.get('valign')
			});
			marks.add({
                id: date.get('id'),
                index: i,
                value: date.get('date'),
                scaleValue : null,
                labels: labels,
                current: null
			});
		}

		var sliderModel = new modelNS.HorizontalSliderModel({
			parent: this.footer.getColumn(this.model.dataJSON.play == 'true' ? 1 : 0),
			min: 0,
			max: layer.dates.length,
			dates: dates,
			value: this.currentDate,
			orientation: 'top',
			marks: marks // #11635
		});
		this.datesSlider = new modelNS.HorizontalSliderHandler({ model: sliderModel });
		this.datesSlider.render();

		// #11635 Такой блок не нужен, т.к. нужно, чтобы первая и последняя метки были прижаты к краям слайдера
		/*lastMark = this.datesSlider.$el.find('.mark').last();
		if (lastMark.width() > 20) {
			var left = lastMark.css('left').replace('px', '');
			left -= 16;
			lastMark.css({ left: left + 'px' });
		}*/
        this.datesSlider.sliderView.$el.find('.mark').first().css({
			'margin-left': 0,
			'left': 0
		});
        this.datesSlider.sliderView.$el.find('.mark').last().css({
            'margin-left': 0,
            'right': 0,
			'left': 'auto'
        });

		//this.listenTo(this.datesSlider, 'Change', this.onChangeDate); // #11635 Закомментил
        // #11635 Прослушиваем this.datesSlider.sliderView, т.к. теперь используется HorizontalSliderHandler
		// и сам слайдер записывется в свойство sliderView
        this.listenTo(this.datesSlider.sliderView, 'Change', this.onChangeDate);
		this.listenTo(this.backButton, 'ButtonClicked', this.onBackClicked);
		this.listenTo(this.legendButton, 'ButtonClicked', this.onLegendClicked);
		this.listenTo(this.areaImage, 'ElementClick', this.onElementClicked);
        this.listenTo(this.areaImage, 'ImageLoaded', this.resizeSVG); // #11635 После загрузки svg подстроим ее размер так, чтобы уместилась в блоке целиком
		this.refreshLegendButton();
		//this.$el.find('.single-image').css('height', $('.imageWrapper').height() + 'px'); // #11635 Закомментил
		//this.$el.find('.bottom-pane').css('margin-top', ($('.imageWrapper').height() - 50) + 'px'); // #11635
		//this.$el.find('.mark').css('white-space', 'nowrap');
		this.$el.find('.mark').css('width', 'auto');
        this.$el.find('.bottom-pane').css('padding-top', '10px');
		this.$el.find('.model-slider').css('margin-top', '-15px');
		this.$el.find('.title-bar').css('width', 'auto');

		//this.$el.find('.play-button').css('margin-left', '12px');







		console.log('renderAreaView', $('.imageWrapper').height());
	},
	refreshLegendButton: function() {
		var legend = this.currentLayer.legend.where({ 'date': this.currentLayer.get('dates').at(this.currentDate).get('id') });
		if (legend.length == 0) {
			this.legendButton.$el.addClass('disabled');
		}
		else {
			this.legendButton.$el.removeClass('disabled');
		}
	},
	onElementClicked: function(element) {
		if (element.link || '') {
			var popup = this.popupCollection.get(element.link);
			if (popup) {
				// this.$el.append(new modelNS.PopupView({ model: popup }).render().el);
				// #11606 новый метод отображения стандартного попап
				this.openPopup(popup);
			}
		}
	},
	onChangeDate: function(ui) {
		this.currentDate = ui.value;
		if (this.currentDate == this.previousDate) {
			return;
		}
		this.previousDate = this.currentDate;
		this.areaImage.model.url = this.model.basePath + 'Resources/' + this.currentLayer.get('id') + '/' + this.currentDate + '/zoom_' + this.currentZoom + '/' + this.currentLayer.get('id') + '.svg';
		this.areaImage.model.elements = this.currentLayer.svgElements.clone(),
			this.areaImage.loadImage();

        // #11634 ВО с легендой теперь стандартное. Данная проверка не нужна.
		/*if (this.legendOpened) {
			this.onLegendClicked(null);
		}*/


		this.refreshLegendButton();
	},
	onBackClicked: function() {
		this.areaView.remove();
		this.areaImageModel = null;
		this.renderMainView();
		clearInterval(this.playInterval);
		this.playInterval = null;
		if (this.legendPopup) {
			this.legendPopup.closePopup();
		}
	},
	onPlayClicked: function(model) {
		if (this.playButton.$el.hasClass('pause')) {
			clearInterval(this.playInterval);
			this.playInterval = null;
			this.playButton.$el.removeClass('pause');
			return;
		}
		if (this.currentDate == this.currentLayer.get('dates').length - 1) {
			return;
		}
		this.playButton.$el.addClass('pause');
		var that = this;
		this.playInterval = setInterval(function() {
			that.currentDate += 1;
			that.datesSlider.slider.slider("value", that.currentDate);
			if (that.currentDate == that.currentLayer.get('dates').length - 1) {
				clearInterval(that.playInterval);
				that.playInterval = null;
				that.playButton.$el.removeClass('pause');
			}
		}, 2000);
	},
	onLegendClicked: function(model) {
		// #11634 ВО с легендой теперь стандартное. Данная проверка не нужна.
		/*if (this.legendOpened) {
			this.legendPopup.closePopup();
			this.onLegendClose();
			return;
		}*/


		var legend = this.currentLayer.legend.where({ 'date': this.currentLayer.get('dates').at(this.currentDate).get('id') });
		if (legend.length == 0) {
			if (this.legendOpened) {
				this.legendPopup.closePopup();
				this.onLegendClose();
			}
			return;
		}
		legend = legend[0];
		//var url = this.model.basePath + '/Resources/legend/' + legend.get('img'); //#11634
        var url = this.model.basePath + 'resources/legend/' + legend.get('img'); //#11634

        // #11634 ВО с легендой теперь стандартное.
		/*var popupModel = new modelNS.Popup({
			className: 'complex-map-legend',
			autoWidth: true,
			hasBackground: false,
			position: { my: 'right bottom', at: 'right-12 bottom-12', of: this.areaImage.$el },
			hasTitle: true,
			title: 'Легенда',
			content: '<img src="' + url + '"/>'
		});
		this.legendPopup = new modelNS.PopupView({ model: popupModel });
		this.$el.append(this.legendPopup.render().el);*/
		var legendWidth = legend.get('width') != void 0 ? parseInt(legend.get('width')) : 'auto'; // #12702
        var legendHeight = legend.get('height') != void 0 ? parseInt(legend.get('height')) : 'auto'; // #12702

		$('<img src="' + url + '"/>').popup({width: legendWidth, height: legendHeight}); // #11634 ВО с легендой теперь стандартное.
		this.legendOpened = true;
		this.listenTo(this.legendPopup, 'PopupClosed', this.onLegendClose);
	},
	onLegendClose: function() {
		this.legendOpened = false;
	},
	onMapLoaded: function(model) {
		// #11635 Для адаптации размеров svg под размеры модели используем эту функцию и берем размеры из model.width
		// и model.height, потому что к этому моменту элемент this.pictureView.$el уже подстроится под размеры свг, который
		// в нем расположен. Это изменение размеров происходит в baseModel.
		// В будущем лучше унифицировать этот функционал с resizeSVG, т.к. он делает почти одно и то же. Этот функционал
		// для основной карты, а в resizeSVG для групп.
        var $svgElem = $(this.pictureView.$el.find('svg')[0]);
        $svgElem.attr('width', model.width + 'px');
        $svgElem.attr('height', model.height + 'px');
        this.pictureView.$el.width(model.width).height(model.height);
        this.pictureView.$el.find('.imageWrapper').width(this.pictureView.$el.width()).height(this.pictureView.$el.height());

		this.resizeView();
	},
	onElementClick: function(element) {
		this.mainView.$el.hide();
		var layer = this.model.dataJSON.layers.where({ 'id': element.link })[0];
		if (this.areaView) {
			this.areaView.remove();
		}
		this.renderAreaView(layer);
	}
});
