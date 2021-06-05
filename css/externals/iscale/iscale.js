var iScaleNS = iScaleNS || {},
		language = window.language || 'ru';

iScaleNS.langs = {
	ru : {
		start : 'Старт',
		stop : 'Стоп',
	},
	en : {
		start : 'Start',
		stop : 'Stop',
	}
};

(function() {
	iScaleNS.EventModel = Backbone.Model.extend({
		initialize: function(options) {
			this.set({
				id: options.id,
				title: options.title,
				tAlign: options.tAlign,
				content: options.content,
				popup: options.popup
			});
		}
	});
	iScaleNS.EventCollection = Backbone.Collection.extend({
		model: iScaleNS.EventModel
	});
})();

function IScale(xmlData, wrapper, basePath, params) {
    var model, view;
	this.init = function() {
		xmlData = xmlData.substring(xmlData.indexOf('?>') + 2, xmlData.length);
        var $xml = $($.parseXML(xmlData));

				// В рэш это плохо работает, пробуем пофиксить:

				// var width = wrapper.width() != 0 ? wrapper.width() :
        //         $xml.find('iscale').attr('width') ? $xml.find('iscale').attr('width') : 800,
        //     height = wrapper.height() != 0 ? wrapper.height() :
        //         $xml.find('iscale').attr('height') ? $xml.find('iscale').attr('height') : 600;

				var xmlWidth = $xml.find('iscale').attr('width'),
						width = xmlWidth ? xmlWidth : (wrapper.width() || 800),
						xmlHeight = $xml.find('iscale').attr('height'),
						height = xmlHeight ? xmlHeight : (wrapper.height() || 600);

			//console.log(xmlData)

        model = new modelNS.IScaleModel({
            xmlData: xmlData,
            wrapper: wrapper,
            basePath: basePath,
            scalable: false,
            params: params,
            width: width,
            height: height,
						restyling: "title",
        });
		view = new modelNS.IScaleView({model: model}).renderOnShow();
	};
}

modelNS.IScaleModel = modelNS.BaseModel.extend({
	defaults: _.extend({}, modelNS.BaseModel.prototype.defaults, {}),
	initialize: function(options) {
    this.defaults.width = options.width; // > 600 ? options.width : 600;	// fix #8265
    this.defaults.height = options.height > 400 ? options.height : 400;
		this.options = options;
		modelNS.BaseModel.prototype.initialize.apply(this, [options]);
	},
	parseXML: function(xmlData) {
        var $model = this,
		    $xml = $($.parseXML(xmlData)),
			settings = {};

		try {
			var $axislabels = $xml.find('axislabels axislabel');
			if ($axislabels.length == 0) {
				$axislabels = $xml.find('axislabels label');
			}
			settings.axislabels = new modelNS.LabelCollection();
			$axislabels.each(function() {

				var value =courseML.getHTMLFromCourseML($(this));


				settings.axislabels.add({
					value: value,
					align: $(this).attr('align'),
					valign: $(this).attr('valign')
				});
			});
			settings.scale = $xml.find('axis').attr('scale');
			settings.marks = new modelNS.MarkCollection();
			$xml.find('axis mark').each(function(index) {
				var labels = new modelNS.LabelCollection(),
						xmlValue = courseML.getHTMLFromCourseML($(this).find('value')),
						value = xmlValue
										.replace(/(\d?)\e(\d?)/gi, '$1∙10<sup>$2</sup>')	// e=>10x
										.replace(/^∙(.*?)/gi, "$1"), // ''x10 => 10
						splitValue = xmlValue.split("e"),
						floatValue = splitValue[0].replace(',','.')*Math.pow(10, splitValue[1]*1||0),
						log10Value = Math.round(Math.log10(floatValue)*100);

				$(this).find('label').each(function() {
					labels.add({
						value: courseML.getHTMLFromCourseML($(this)),
						align: $(this).attr('align'),
						valign: $(this).attr('valign')
					});
					// console.log(courseML.getHTMLFromCourseML($(this)));
				});
				settings.marks.add({
					id: $(this).attr('id'),
                    index: index,
					value: value,
					scaleValue : settings.scale == 'linear' ? floatValue : log10Value,
					labels: labels,
					current: $(this).attr('current') == 'true'
				});
			});
			settings.events = new iScaleNS.EventCollection();
			$xml.find('events event').each(function() {
				var $event = $(this),
						$title = $event.find('title');
				settings.events.add({
					id: $event.attr('id'),
					title: courseML.getHTMLFromCourseML($title),
          link: $title.attr('link'),
					tAlign:	$title.attr('align') || 'center',
					content: courseML.getHTMLFromCourseML($(this).find('content'))
				});
			});
			settings.popups = this.parsePopups($xml);
		} catch (e) {console.log(e);}
		return settings;
	}
});

modelNS.IScaleView = modelNS.BaseModelView.extend({
	type: "iscale",
	initialize: function(options) {
		modelNS.BaseModelView.prototype.initialize.apply(this, [options]);
	},
	render: function() {
		modelNS.BaseModelView.prototype.render.apply(this);
		this.popupCollection = new modelNS.PopupCollection(this.model.dataJSON.popups);
		this.$el.addClass('iscale');
		this.renderView();
		return this;
	},
	renderView: function() {
		var self = this,
				settings = this.model.dataJSON;

		this.layout = new modelNS.DualHorizontalLayout({
			parent: this.$el,
			bottomPaneHeight: 80,
			//nopadding: true, // #8402 Будет указано поле сверху
		});
		this.layout.render();
		var	marks = settings.marks,
				events = settings.events,
				dates = [],
				scaleValues = [],
				minValue = Infinity,
				maxValue = -Infinity;

		marks.each(function(mark) {
			var value = mark.get('scaleValue');
			scaleValues.push(value);
			if (minValue > value) minValue = value;
			if (maxValue < value) maxValue = value;

			dates.push(mark.get('value'));
    });

		this.demoBlock = new modelNS.SingleLayout({
			cls: 'demo-block',
			parent: this.layout.$topPane,
			hasPadding: false,
			hasContent: true,
			border: false,
		});
		this.demoBlock.render();

		// this.demoBlockContent = new modelNS.SingleLayout({
		// 	cls: 'demo-block-content',
		// 	parent: this.demoBlock.$el,
		// 	height: this.demoBlock.$el.height() - 30,
		// 	hasPadding: false
		// });
		// this.demoBlockContent.render();

        this.currentMark = marks.where({current: true}).length != 0 ?
            marks.where({current: true})[0] : marks.first();

		this.renderContent();

		this.demoBlock.$el.click(function(event) {
			self.onPopupLinkClick(event);
		});

		this.bottomLayout = new modelNS.DualVerticalLayout({
			parent: this.layout.$bottomPane,
			firstPaneWidth: 81,
			hasPadding: true
		});
		this.bottomLayout.render();

		this.playButton = new modelNS.Button({
			cls: 'play-button',
			width: 73,
			height: 40
		});
		this.bottomLayout.$firstPane.append(this.playButton.render().el);
        self.playButton.$el.attr('title', iScaleNS.langs[language].start);

		this.listenTo(this.playButton, 'ButtonClicked', this.onPlayClick);

		var value = marks.indexOf(this.currentMark) != - 1 ? marks.indexOf(this.currentMark) : 0;
		if (['linear', 'logarithmic'].indexOf(this.model.dataJSON.scale) >= 0) {
			value = this.currentMark.get("scaleValue");
		}

		this.sliderHandler = new modelNS.HorizontalSliderHandler({
			model: new modelNS.SliderModel({
				min: 0,
				max: marks.length,
				parent: this.bottomLayout.$secondPane,
				value: value,
				dates: dates,
				axisLabels: settings.axislabels,
				marks: settings.marks,
				scale: settings.scale,
				scaleValues : scaleValues,
				minValue: minValue,
				maxValue: maxValue
			})
        });
		this.sliderHandler.render();
		// #8402 - ARCH #8420 firsov Закомментил, т.к. из-за разметки подпись хоть и центрируется, но относительно всего первого <td>, а не слайдера.
		// Нижние подписи уходят за пределы блока слайдера. Сначала нужно исправить высоту слайдера, чтобы центрирование по вертикали
		// работало верно.
		/*if(settings.axislabels.length && settings.axislabels.at(0).get('valign') == 'middle'){
			var column = $(this.sliderHandler.el).find('.column');
			var table = $('<table>').appendTo( $(this.sliderHandler.el));
			var tr = $('<tr>').appendTo( table);
			for(var i=0;i<column.length;i++){
				var td = $('<td>').appendTo( tr);
				$(column[i]).appendTo(td);
				var sl = td.find('.slider-label');
				sl.css('position','inherit');
				sl.parent().css('height','auto');
			}
		}*/


		this.sliderView = this.sliderHandler.getSliderView();
		this.listenTo(this.sliderView, 'Change', this.onSliderChange);
		this.listenTo(this.sliderView, 'Slide', this.onSliderChange);
	},
	renderContent: function() {
		var self = this,
				currentEvent = this.model.dataJSON.events.where({id: this.currentMark.get('id')}),
				$content = this.demoBlock.$content;
		$content.html('');
		this.demoBlock.$el.hide();
		if (currentEvent.length == 0) {
			return;
		}
		this.demoBlock.$el.show();
    $content.append(currentEvent[0].get('content'));
		$content.scrollTop(0);
    this.demoBlock.setTitle(currentEvent[0].get('title'), currentEvent[0].get('tAlign'));
		if (!currentEvent[0].get('title') || currentEvent[0].get('title') == '') {
			$content.addClass('without-title');
			$content.height(this.demoBlock.$el.height());
		} else {
			$content.removeClass('without-title');
		}

		this.demoBlock.$el.find('.magnify-glass').remove();

		if (currentEvent[0].get('link')) {
			var magnifyGlass = $('<div class="magnify-glass" link="' + currentEvent[0].get('link') + '"></div>');
			this.demoBlock.$el.find('.title-bar').append(magnifyGlass);
		}
	},
	onPopupLinkClick: function(event) {
		var link = this.$el.find('.magnify-glass').attr('link');
		if (link) {
			var popup = this.popupCollection.get(link);
			if (popup) {
				// 9718#note-14
				// this.popup = new modelNS.PopupView({model: popup});
				// this.$el.append(this.popup.render().el);
				this.popup = this.createPopup(popup.attributes, event);
			}
		}
	},
	onPlayClick: function(button) {
		if (this.sliderView.getValue() == this.sliderView.getMax() &&
			!button.$el.hasClass('pause')) {
			return;
		}
		if (button.$el.hasClass('pause')) {
			button.$el.removeClass('pause');
            button.$el.attr('title', iScaleNS.langs[language].start);
			this.stopPlay();
		} else {
			button.$el.addClass('pause');
            button.$el.attr('title', iScaleNS.langs[language].stop);
			this.startPlay();
		}
	},
	startPlay: function() {
		var self = this;

		this.playInterval = setInterval(function() {
			self.setNextSliderPosition();
        }, 4000);

		this.$el.attr("play", this.playInterval);
	},
	stopPlay: function() {
		clearInterval(this.playInterval);
	},
	onSliderChange: function(ui) {
		if (this.popup) {
			// 9718#note-14
			// this.popup.closePopup();
			if (this.popup.parent().length)	// TEMP solution, need better, потому что .remove() в ._close .popup()
				this.popup.popup( "close" );
		}
		if (this.model.dataJSON.scale == 'linear' || this.model.dataJSON.scale == 'logarithmic' ) {
			this.currentMark = this.model.dataJSON.marks.where({scaleValue: ui.value});
		} else {
			this.currentMark = this.model.dataJSON.marks.where({index: ui.value});
		}
		if (this.currentMark.length != 0) {
			this.currentMark = this.currentMark[0];
		}
		if (this.previousMark) {
			if (this.currentMark.get('id') == this.previousMark.get('id'))
			return;
		}
		this.previousMark = this.currentMark;
		this.renderContent();
	},
	setNextSliderPosition: function() {
		// #8515 если произошел переход на другой слайд, прекращаем проигрывание
		if ($('.iscale').attr("play") != this.playInterval) {
			return this.stopPlay();
		}

		var currentPosition = this.sliderView.getValue();

		if (['linear', 'logarithmic'].indexOf(this.model.dataJSON.scale) >= 0) {
			var scaleValue = this.currentMark.get('scaleValue'),
					nextValue = Infinity,
					nextCount = 0;

			this.model.dataJSON.marks.each(function (mark) {
				var markValue = mark.get('scaleValue');
				// console.log(scaleValue, markValue, nextValue)
				if (markValue > scaleValue) {
					nextCount++;
					if (markValue < nextValue) nextValue = markValue;
				}
			});

			// console.log(nextValue, nextCount);

			this.sliderView.setValue(nextValue);
			if (nextCount < 2) {
				this.playButton.$el.trigger('click');
			};
		} else {
			this.sliderView.setValue(currentPosition + 1);
			if (currentPosition + 1 == this.sliderView.getMax()) {
				this.playButton.$el.trigger('click');
			}
		}
	}
});
