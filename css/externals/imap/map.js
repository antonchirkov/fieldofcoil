function Map(xmlData, container, basePath) {
	var _this = this,
		layersObject = [],
		$container = $(container),
		$wrapper = $('<div class="interactive-map base-model" unselectable="on"></div>'),
		$mapArea = $('<div class="maparea"></div>'),
		$mapDraggableArea = $('<div class="mapdraggablearea"></div>'),
		$controlsArea = $('<div class="controlsarea"></div>'),
		$legend = $('<div class="legendhandler"></div>'),
		$switchers = $('<div class="switchers"></div>'),
		$sliderArea = $('<div class="sliderarea"></div>'),
		$sliderHandler = $('<div class="sliderhandler"></div>'),
		$multimediaButton = $('<div class="multimediabutton"></div>'),
		$zoomSliderHandler = $('<div class="zoomsliderhandler"></div>'),
		$zoomSlider = $('<div class="zoomslider"></div>'),
		$controlSwitcher = $('<div class="controlswitcher controls"><div class="layerstitle">Слои</div><div class="legendtitle">Легенда</div></div>'),
		popupCollection,
		scale = 1,
		currentZoom = 1,
		currentDate = 0,
		playInterval,
		svgScaleFactor = 1,
		settings = {},
		animation = false,
		firstLoad = true,
		ZOOM_OFF = 'off',
		ZOOM_VIRTUAL = 'virtual',
		ZOOM_REAL = 'real',
		missedLayers = [],
		sliderView;

	this.init = function() {
		$container.append($wrapper);
		$container.css('position', 'relative');
		$wrapper.addClass('non-visible');
		$wrapper.append($mapArea);
		$wrapper.append($controlsArea);
		$wrapper.append($sliderArea);
		$controlsArea.append($controlSwitcher);
		$controlsArea.append($switchers);
		$controlsArea.append($legend);
		parseXml();
		currentDate = settings.currentDate;
		if (settings.play) {
			initMediaButton();
		}


		$sliderArea.append($sliderHandler);
		$mapArea.append($mapDraggableArea);
		setTimeout(function() {
			$mapArea.width(settings.width);
			$mapArea.height(settings.height);
			$controlsArea.height(settings.height);
			$wrapper.width($mapArea.width() + $controlsArea.width() + 16);
			$wrapper.height($mapArea.height() + $sliderArea.height() + 16);
			$sliderArea.width(settings.width);
			if (settings.play) {
				$sliderHandler.width(settings.width - $multimediaButton.width() - 8);
			}
			else {
				$sliderHandler.width(settings.width);
			}
			resize();
			sliderInit();
		}, 200);

		if (settings.zoom !== ZOOM_OFF) {
			$zoomSliderHandler.append($zoomSlider);
			$mapArea.append($zoomSliderHandler);
			zoomSliderInit();
		}
		switchersInit();
		layersInit();
		setTimeout(function() {
			$wrapper.removeClass('non-visible');
		}, 200);
		$mapArea.click(function(e) {
			var x;
			var y;
			if (e.pageX || e.pageY) {
				x = e.pageX;
				y = e.pageY;
			}
			else {
				x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
				y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
			}
			var elements = getAllElementsFromPoint(x, y);
			for (var i = 0; i < elements.length; i++) {
				var elem = $(elements[i]),
					id = elem.attr('id'),
					parentId = elem.parent().length != 0 ? elem.parent().attr('id') : null,
					linkId = elem.attr('link');
				var popupId = (id || '') && id.indexOf('settlement') != -1 ? id :
					(parentId || '') && parentId.indexOf('settlement') != -1 ? parentId :
					(linkId || '') && linkId.indexOf('settlement') != -1 ? linkId : null;
				if (popupId == null) {
					popupId = (id || '') && id.indexOf('hydro') != -1 ? id :
						(parentId || '') && parentId.indexOf('hydro') != -1 ? parentId :
						(linkId || '') && linkId.indexOf('hydro') != -1 ? linkId : null;
				}
				if (popupId == null) {
					popupId = (id || '') && id.indexOf('relief') != -1 ? id :
						(parentId || '') && parentId.indexOf('relief') != -1 ? parentId :
						(linkId || '') && linkId.indexOf('relief') != -1 ? linkId : null;
				}
				if (popupId == null) {
					popupId = (id || '') && id.indexOf('protectedarea') != -1 ? id :
						(parentId || '') && parentId.indexOf('protectedarea') != -1 ? parentId :
						(linkId || '') && linkId.indexOf('protectedarea') != -1 ? linkId : null;
				}
				if (popupId != null && popupId != 'settlement' && popupId != 'hydro' && popupId != 'relief' && popupId != 'protectedarea') {
					popupId = popupId.replace(/_x5F_/g, '_');
					showPopup(popupId);
				}
			}
		});
	};

	function resize() {
		if ($container.width() == 0 || $container.height() == 0) {
			$container.width($wrapper.width());
			$container.height($wrapper.height());
		}
		else {
			scale = $container.width() / $wrapper.width();
			$wrapper.css({
				'-moz-transform': 'scale(' + scale + ')',
				'-webkit-transform': 'scale(' + scale + '))',
				'-o-transform': 'scale(' + scale + '))',
				'transform': 'scale(' + scale + ')'
			});
			$container.height($wrapper.height() * scale);
		}
	}

	function initMediaButton() {
		$sliderArea.append($multimediaButton);
		$multimediaButton.click(function() {
			if ($(this).hasClass('pause')) {
				clearInterval(playInterval);
				playInterval = null;
				$(this).removeClass('pause');
				$sliderHandler.css('pointer-events', 'auto');
				$sliderHandler.find('.slide').css('pointer-events', 'auto');
				return;
			}
			var value = sliderView.getSlider().slider('value');
			if (value == settings.dates.length - 1) {
				return;
			}
			$sliderHandler.css('pointer-events', 'none');
			$sliderHandler.find('.slide').css('pointer-events', 'none');
			$(this).addClass('pause');
			var that = this;
			playInterval = setInterval(function() {
				value += 1;
				sliderView.getSlider().slider("value", value);
				sliderOnStop(value);
				if (value == settings.dates.length - 1) {
					clearInterval(playInterval);
					playInterval = null;
					$sliderHandler.css('pointer-events', 'auto');
					$sliderHandler.find('.slide').css('pointer-events', 'auto');
					$(that).removeClass('pause');
				}
			}, 5000);
		});
	}

	function getAllElementsFromPoint(x, y) {
		var elements = [];
		var display = [];
		var item = document.elementFromPoint(x, y);
		while (item && item !== document.body && item !== window && item !== document && item !== document.documentElement) {
			elements.push(item);
			display.push(item.style.display);
			item.style.display = "none";
			item = document.elementFromPoint(x, y);
		}
		// restore display property
		for (var i = 0; i < elements.length; i++) {
			elements[i].style.display = display[i];
		}
		return elements;
	}

	function isLayerExists(name) {
		var exists = false;
		for (var i = 0; i < layersObject.length; i++) {
			var layer = layersObject[i];
			if (layer.name == name && layer.year == currentDate) {
				exists = true;
				break;
			}
		}
		return exists;
	}

	function isLayerSwitcherChecked(name) {
		var switcher = $controlsArea.find('.base-model-checkbox[layerid="' + name + '"]');
		if (switcher.length == 0) {
			return true;
		}
		return switcher.hasClass('checked');
	}

	function loadJS(layer, callback, date, layersToShow) {
		var name = layer.name,
			id = layer.id,
			permanent = layer.permanent || '' ? layer.permanent : false,
			alwaysVisible = layer.alwaysVisible || '' ? layer.alwaysVisible : false,
			opacity = layer.opacity || '' ? layer.opacity : 1,
			zoom = settings.zoom == ZOOM_REAL ? zoomToScale(currentZoom) * 10 : 10,
			isVisible = isLayerSwitcherChecked(layer.name);
		var path = basePath + 'resources/' + (alwaysVisible || permanent ? 'base/zoom_' + zoom + '/' : (date + '/zoom_' + zoom + '/')) + name + '.js';
		if ($(document).find('script[src="' + path + '"]').length != 0) {
			if (callback || '') {
				callback();
			}
			return;
		}

		var ignore = false;
		missedLayers.forEach(function(p) {
			if (p === path) {
				ignore = true;
			}
		});

		var jsElm = document.createElement("script");
		jsElm.type = "application/javascript";
		jsElm.src = path;
		jsElm.layer = layer;

		var parent = $switchers.find('.base-model-checkbox[layerid="' + layer.name + '"]').first().parent(),
			switcher = $switchers.find('.base-model-checkbox[layerid="' + layer.name + '"]').first();

		var onLoadError = function() {
			missedLayers.push(path);
			$(jsElm).remove();
			if (date != 0) {
				loadJS(layer, callback, date - 1, layersToShow);
			}
			else {
				switcher.addClass('disabled');
				parent.addClass('disabled');
				legendInit(layer);
				if (callback || '') {
					callback();
				}
			}
		};

		if (!ignore) {
			$wrapper.get(0).appendChild(jsElm);
		}
		else {
			onLoadError();
			return;
		}

		$(jsElm).on('error', onLoadError);
		$(jsElm).on('load', function() {
			switcher.removeClass('disabled');
			parent.removeClass('disabled');
			var layerItem = {
				name: name,
				year: currentDate,
				xml: svgData[name]
			};
			svgData[name] = null;
			layersObject.push(layerItem);
			var $layer = $('<div class="mapLayer ' + name + ' ' + currentDate + '" alwaysvisible="' + alwaysVisible + '"></div>'),
				temp = $('<div></div>');
			$layer.hide();
			temp.append(layerItem.xml);
			layerItem.xml = null;
			var svg = $(temp.find('svg').get(0));
			if (!(svg.attr('width') || '')) {
				svg.attr('width', settings.width + 'px');
				svg.attr('height', settings.height + 'px');
			}
			svgScaleFactor = settings.width / svg.attr('width').substring(0, svg.attr('width').indexOf('px'));
			svg.attr('width', '100%');
			svg.attr('height', '100%');
			$layer.append(svg);
			$layer.css({ 'z-index': id, 'opacity': opacity });
			$layer.find('svg text').each(function() {
				// Быстрый фикс. Нужно будет сделать по-нормальному
				if ($(this).attr('font-family') == '\'TrebuchetMS\'') {
					$(this).attr('font-family', 'Trebuchet MS');
				}
				if ($(this).attr('font-family') == '\'TrebuchetMS-Italic\'') {
					$(this).attr('font-family', 'Trebuchet MS');
					$(this).attr('font-style', 'italic');
				}
				if ($(this).attr('font-family') == '\'SegoeUI-Semilight\'') {
					$(this).attr('font-family', 'Segoe UI');
					$(this).attr('font-weight', '300');
				}
				if ($(this).attr('font-family') == '\'SegoeUI\'') {
					$(this).attr('font-family', 'Segoe UI');
					$(this).attr('font-weight', '400');
				}
				if ($(this).attr('font-family') == '\'SegoeUI-SemilightItalic\'') {
					$(this).attr('font-family', 'Segoe UI');
					$(this).attr('font-style', 'italic');
					$(this).attr('font-weight', '200');
				}
				if ($(this).attr('font-family') == '\'SegoeUI-SemiboldItalic\'') {
					$(this).attr('font-family', 'Segoe UI');
					$(this).attr('font-style', 'italic');
					$(this).attr('font-weight', '500');
				}
				if ($(this).attr('font-family') == '\'SegoeUI-Semibold\'') {
					$(this).attr('font-family', 'Segoe UI');
					$(this).attr('font-weight', '500');
				}
				if ($(this).attr('font-family') == '\'SegoeUI-Italic\'') {
					$(this).attr('font-family', 'Segoe UI');
					$(this).attr('font-style', 'italic');
					$(this).attr('font-weight', '400');
				}
			});
			checkClickable(svg);
			$mapDraggableArea.append($layer);
			$mapDraggableArea.draggable({
				start: function() {
					if (currentZoom == 1) {
						return false;
					}
				},
				stop: function() {

				},
				containment: [
					$mapArea.offset().left - $mapDraggableArea.width() + $mapArea.width(),
					$mapArea.offset().top - $mapDraggableArea.height() + $mapArea.height(),
					$mapArea.offset().left,
					$mapArea.offset().top
				]
			});
			$(jsElm).remove();
			legendInit(layer);
			if (isVisible) {
				layersToShow.push($layer);
			}
			if (callback || '') {
				callback();
			}
		});
	}

	function checkClickable(svg) {
		var elements = svg.find('[id*="settlement"], [id*="hydro"], [id*="relief"], [id*="protectedarea"]');
		settings.popups.forEach(function(popup) {
			var id = popup.id;
			for (var i = 0; i < elements.length; i++) {
				var element = $(elements[i]),
					elementId = element.attr('id').replace(/_x5F_/g, '_');
				if (id == elementId) {
					element.css({ 'cursor': 'pointer', 'pointer-events': 'auto' });
					element.children().each(function() {
						$(this).attr('id', elementId);
					});
				}
			}
		});
	}

	function zoomToScale() {
		return (currentZoom - 1) * settings.zoomstep + 1;
	}

	function legendInit(layer) {
		var switcher = $switchers.find('.base-model-checkbox[layerid="' + layer.name + '"]').first();
		if (switcher.parent().hasClass('disabled')) {
			$legend.find('.legend.' + layer.name).hide();
			return;
		}
		if ($legend.find('.legend.' + layer.name).length != 0) {
			if (switcher.hasClass('checked')) {
				$legend.find('.legend.' + layer.name).show();
			}
			else {
				$legend.find('.legend.' + layer.name).hide();
			}
			return;
		}
		if (!(layer.legend || '')) {
			return;
		}
		var legend = $('<div class="legend ' + layer.name + '"></div>'),
			img = $('<img src="' + layer.legend + '"/>');
		legend.append(img);
		$legend.append(legend);
		if (!switcher.hasClass('checked')) {
			legend.hide();
		}
	}

	function zoomSliderInit() {
		$zoomSlider.slider({
			orientation: 'vertical',
			min: 1,
			max: Math.round((settings.zoommax - 1) / settings.zoomstep + 1),
			value: 1,
			step: 1,
			slide: function(event, ui) {},
			stop: function(event, ui) {
				event.stopPropagation();
			},
			change: function(event, ui) {
				currentZoom = ui.value;
				resizeLayers(zoomToScale());
			}
		});
		var handle = $('<div class="handle"><div class="handle-back"></div></div>');
		$zoomSlider.find('.ui-slider-handle').append(handle);
	}

	function resizeLayers(zoom) {
		var left = $mapDraggableArea.css('left').replace('px', ''),
			top = $mapDraggableArea.css('top').replace('px', ''),
			posXIndex = left != 0 ? left / $mapDraggableArea.width() : 0,
			posYIndex = top != 0 ? top / $mapDraggableArea.height() : 0;
		$mapDraggableArea.css('width', (100 * zoom) + '%');
		$mapDraggableArea.css('height', (100 * zoom) + '%');
		if (zoom == 1) {
			$mapDraggableArea.css('left', '0');
			$mapDraggableArea.css('top', '0');
		}
		else {
			var width = $mapDraggableArea.width(),
				height = $mapDraggableArea.height(),
				left = (width * posXIndex),
				top = (height * posYIndex);
			if (width + left < $mapArea.width()) {
				left = $mapArea.width() - width;
			}
			if (height + top < $mapArea.height()) {
				top = $mapArea.height() - height;
			}
			$mapDraggableArea.css('left', left + 'px');
			$mapDraggableArea.css('top', top + 'px');
		}
		$mapDraggableArea.draggable({
			start: function() {
				if (currentZoom == 1) {
					return false;
				}
			},
			containment: [
				$mapArea.offset().left - $mapDraggableArea.width() * scale + $mapArea.width() * scale,
				$mapArea.offset().top - $mapDraggableArea.height() * scale + $mapArea.height() * scale,
				$mapArea.offset().left,
				$mapArea.offset().top
			]
		});
		layersInit();
	}

	function layersInit() {
		if (!(settings.layers || '')) {
			return;
		}
		var layers = $wrapper.find('.mapLayer'),
			layersToShow = [],
			count = 0;
		for (var i = 0; i < settings.layers.length; i++) {
			var layer = settings.layers[i];
			try {
				loadJS(layer, function() { count++; }, currentDate, layersToShow);
			}
			catch (e) {}
		}
		var listenTime = 0;
		if (firstLoad) {
			$switchers.css({ 'opacity': 0 });
		}
		var loadedListener = setInterval(function() {
			if (count >= settings.layers.length || listenTime == 2000) {
				clearInterval(loadedListener);
				layers.remove();
				for (var i = 0; i < layersToShow.length; i++) {
					layersToShow[i].show();
				}
				if (currentZoom != 1) {
					resizeLayers(currentZoom);
				}
				$switchers.css({ 'opacity': 1 });
				firstLoad = false;
			}
			listenTime += 20;
		}, 20);
	}

	function switchersInit() {
		$controlSwitcher.on('click', '.layerstitle', function() {
			$controlSwitcher.removeClass('legend');
			$controlSwitcher.addClass('controls');
			$legend.hide();
			$switchers.show();
		});
		$controlSwitcher.on('click', '.legendtitle', function() {
			$controlSwitcher.removeClass('controls');
			$controlSwitcher.addClass('legend');
			$legend.show();
			$switchers.hide();
		});
		if (!(settings.layers || '')) {
			return;
		}
		for (var i = 1; i < settings.layers.length; i++) {
			var layer = settings.layers[i];
			new Switcher({
				id: layer.id,
				name: layer.name,
				excluded: layer.excluded,
				title: layer.description,
				checked: layer.visible != null && layer.visible != undefined ? layer.visible === true : true,
				disabled: false,
				bordered: i != settings.layers.length - 1,
				parent: $switchers
			});
		}
	}

	function sliderInit() {
		var sliderModel = new modelNS.SliderModel({
			parent: $sliderHandler,
			min: 0,
			max: settings.dates.length,
			step: 1,
			dates: settings.dates,
			value: settings.currentDate,
			orientation: 'top',
			areaClickDisabled: true
		});
		sliderView = new modelNS.HorizontalSlider({ model: sliderModel });
		sliderView.render();
		sliderView.listenTo(sliderView, 'Stop', function(ui) {
			sliderOnStop(ui.value);
		});
	}

	function sliderOnStop(value) {
		if (value == currentDate) {
			return;
		}
		currentDate = value;
		var layers = $mapArea.find('.mapLayer'),
			switchers = $controlsArea.find('.base-model-checkbox');
		layers.each(function() {
			if ($(this).attr('alwaysvisible') === 'false') {
				$(this).hide();
			}
		});
		switchers.each(function() {

			var layer = $mapArea.find('.mapLayer.' + $(this).attr('layerid') + '.' + currentDate),
				legend = $legend.find('.legend.' + $(this).attr('layerid'));
			if ($(this).hasClass('checked')) {
				layer.show();
				legend.show();
			}
			else {
				layer.hide();
				legend.hide();
			}
		});
		layersInit();

	}

	function Switcher(params) {
		if (!(params.disabled || '')) {
			params.disabled = false;
		}
		if (!(params.bordered || '')) {
			params.bordered = false;
		}
		var chkWrapper = new modelNS.SingleLayout({
			hasPadding: false,
			parent: params.parent,
			cls: 'switcher-layout ' + (params.bordered ? 'bordered' : ''),
			height: 32
		});
		chkWrapper.render();
		if (params.id || '') {
			chkWrapper.$el.attr('layout-id', params.id);
		}

		var chkBox = new modelNS.Checkbox({
			model: new modelNS.SwitcherModel({
				parent: chkWrapper.$el,
				disabled: params.disabled,
				checked: params.checked
			})
		});
		chkBox.render();
		var label = new modelNS.Label({
			width: chkWrapper.$el.width() - 23,
			text: params.title
		});
		chkBox.$el.attr({ 'layerid': params.name, 'excluded': params.excluded });
		chkWrapper.$el.append(label.render().el);
		chkWrapper.listenTo(chkBox, 'Checked', function(model, checkbox) {
			switchCheckbox(model, checkbox, true);
		});

		chkWrapper.listenTo(chkBox, 'Unchecked', function(model, checkbox) {
			switchCheckbox(model, checkbox, false);
		});

		function switchCheckbox(model, checkbox, checked) {
			var that = this,
				layerId = checkbox.$el.attr('layerid'),
				layer = $mapArea.find('.mapLayer.' + layerId + '.' + currentDate),
				legend = $legend.find('.legend.' + layerId);
			if (checked) {
				if (checkbox.$el.attr('excluded') || '') {
					var splitted = checkbox.$el.attr('excluded').split(',');
					for (var i = 0; i < splitted.length; i++) {
						var id = splitted[i];
						$switchers.find('.base-model-checkbox[layerid="' + id + '"].checked .checkbox-inner').click();
					}
				}
				layer.show();
				legend.show();
			}
			else {
				layer.hide();
				legend.hide();
			}
		}

		if (params || '') {
			if (params.title || '') {
				settings.title = params.title;
			}
			settings.checked = params.checked;
		}
	};

	function parseXml() {
		var $xml = $($.parseXML(xmlData)),
			$map = $xml.find('imap'),
			date = null,
			layers = [],
			dates = [];
		settings['play'] = ($map.attr('play') || '') && $map.attr('play') === 'true';
		settings['zoom'] = ($map.attr('zoom') || '') ? $map.attr('zoom') : ZOOM_OFF;
		if (settings.zoom != ZOOM_OFF) {
			settings['zoommax'] = $map.attr('zoommax') || 2;
			settings['zoomstep'] = $map.attr('zoomstep') || 0.5;
		}
		$xml.find('date').each(function(i) {
			dates.push($(this).text());
			if (($(this).attr('current') || '') && $(this).attr('current') === 'true') {
				date = i;
			}
		});
		settings['dates'] = dates || ['0', '1', '2', '3', '4'];
		settings['currentDate'] = date || settings.dates.length - 1;
		var width = $map.attr('width'),
			height = $map.attr('height');
		if (width > height) {
			width = height;
		}
		else {
			height = width;
		}
		if (width < 510) {
			width = 510;
			height = 510;
		}
		settings['width'] = width;
		settings['height'] = height;
		$xml.find('layers > layer').each(function(i) {
			var layer = $(this),
				data = {};
			data['opacity'] = (layer.attr('transparency') || '') && (layer.attr('transparency') === 'true') ? 0.5 : 1;
			data['name'] = layer.attr('type') || '' ? layer.attr('type') : '';
			data['description'] = layer.attr('title') || '' ? layer.attr('title') : '';
			data['visible'] = layer.attr('visible') || '' ? layer.attr('visible') === 'true' : false;
			data['alwaysVisible'] = layer.attr('toggle') || '' ? layer.attr('toggle') === 'false' : false;
			data['id'] = i;
			data['excluded'] = '';
			$(this).find('excluded > layer').each(function(i) {
				data.excluded += (i != 0 ? ',' : '') + $(this).attr('type');
			});
			data['permanent'] = layer.attr('permanent') || '' ? layer.attr('permanent') === 'true' : false;
			var legend = layer.find('legend').first();
			if (legend.length != 0) {
				data['legend'] = basePath + 'resources/legend/' + legend.attr('img');
			}
			layers.push(data);
		});
		settings['popups'] = [];
		$xml.find('popup').each(function(i) {
			var popup = $(this),
				data = {};
			data['closableOnOverlayClick'] = true;
			data['className'] = '.imap-popup';
			data['id'] = popup.attr('id');
			data['content'] = getHTMLFromCourseML(popup);
			data['width'] = popup.attr('width');
			data['height'] = popup.attr('height');
			settings.popups.push(data);
		});
		popupCollection = new modelNS.PopupCollection(settings.popups);
		settings['layers'] = layers;
		xmlData = null;
	}

	function showPopup(popupId) {
		$('.model-popup-wrapper').remove();
		if (popupId || '') {
			var popup = popupCollection.get(popupId);
			if (popup) {
				$wrapper.append(new modelNS.PopupView({ model: popup }).render().el);
			}
		}
	}
};
