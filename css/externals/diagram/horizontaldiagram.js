var iDiagramNS = iDiagramNS || {};

(function() {
	iDiagramNS.HorizontalDiagram = Backbone.View.extend({
		className: 'horizontal-diagram diagram-wrp',
		initialize: function(options) {
			this.options = options;
		},
		render: function() {
			this.options.parent.append(this.$el);
			this.layer = this;
			if (this.options.cls) {
				this.$el.addClass(this.options.cls);
			}
			this.renderScale();
			return this;
		},
		renderScale: function() {
			var self = this;

			// при необходимости отрисовки меток категорий, сначала узнаем их ширину, для отступа левой шкалы
			var leftOutset = 0;
			this.options.categories.each(function(c, i) {
				c.get('points').each(function(p, k) {
					if (self.options.markCategories) {
						var markVal = c.get('title'),
								mark = $('<div class="v-mark">' + markVal + '</div>');
							mark.appendTo(self.$el);

							leftOutset = Math.max(leftOutset, mark.width() + 10); // 10 - на отсутп от шкалы

							p.$mark = mark;
					}
				});
			});

			this.vScale = new iDiagramNS.VerticalScale({
				parent: this.layer.$el,
				label: this.options.labelX,
				axisData: this.options.axisXValues,
				leftOutset: leftOutset,
				scaleCentered: true,
				marks: this.options.marks // #11318
			});
			this.vScale.render();
			this.hScale = new iDiagramNS.HorizontalScale({
				parent: this.layer.$el,
				label: this.options.labelY,
				min: this.options.minY, // #11318 Передаем значение minY вместо min
				max: this.options.maxY, // #11318 Передаем значение maxY вместо max
				step: this.options.stepY, // #11318 Передаем значение stepY вместо step
				maxValue: this.options.maxValue,
				scaleCentered: false,
				grid: this.options.grid,
				marks: this.options.marksY, // #11318 В marks записываем значение marksY, потому что в горизонтальной диаграмме оси меняются местами
				referenceValues: this.options.referenceValues,
				settings: this.options.settings,
				leftOutset: this.vScale.leftOutset,
			});
			this.hScale.render();

			// отступ снизу учитывая высоту нижних подписей
			this.vScale.setBottomOutset(this.hScale.bottomOutset);

			var valueColumnHeight = Math.round((this.vScale.getPixelsPerMark() - 10) / this.options.categories.length),
				axisValues = this.vScale.getAxisValues(),
				pixelsPerMark = this.vScale.getPixelsPerMark(),
				pixelsPerStep = this.hScale.getPixelsPerStep();

			// ???
			// var hAxisValues = this.hScale.getAxisValues();
			// if (hAxisValues) hAxisValues.each(function(v) {
			// 	var valueObj = v.get('value');
			// 	if (valueObj.get('value') == 0) {
			// 		zeroLeft = v.get('left');
			// 	}
			// });

			this.options.categories.each(function(c, i) {
				c.get('points').each(function(p, k) {
					var valueColumn = $('<div class="value-column"></div>'),
						axisValue = axisValues.where({value: p.get('axisValue')})[0],
						top = ((axisValue.get('top') + 20 - (pixelsPerMark / 2)) + (i * valueColumnHeight) + 5),
						tooltip = c.get('tooltip') || '',
						value = p.get('value'),
						title = tooltip.replace('%value', modelNS.valueToLabel(Math.roundDec(value, 2)));

					p.$valueColumn = valueColumn.css({
						backgroundColor: c.get('color'),
						left: (value > 0 ? self.vScale.leftOutset :
							 	 self.vScale.leftOutset - (Math.abs(p.get('value') * pixelsPerStep))) + 'px',
						top: top + 'px',
						width: (Math.abs(p.get('value')) * pixelsPerStep) + 'px',
						height: valueColumnHeight + 'px',
					}).attr({
						title: title
					});

					p.pixelsPerStep = pixelsPerStep;
					self.layer.$el.append(valueColumn);

					if (self.options.markCategories) {
						var mark = p.$mark,
								markLine = $('<div class="v-mark-line"></div>');

						// Вместо числа 20 здесь было 25. Происхождение этого числа не удалось выяснить.
						// Судя по логике это число предназначено для возврата риски к верху столбца, а затем уже
						// центрирования его относительно этого столбца. Это один из пунктов задач из переписки [IN_Vp-Bio] (8) XML_324654. Модель.
						// Посмотрел пару других сборок, но там не было похожей ситуации, чтобы self.options.markCategories был true.
						// Это алгоритм расчета позиции рисок и подписей в verticaldiagram.js Но модель из переписки
						// строит диаграмму из кода и он использует этот блок расчета положения рисок и подписей.
						// Число поменял на 20, чтобы риски и подписи центрировались относительно столбца.
						// В других сборках принудительно запускал отработку этого блока с кодом и он тоже криво ставил риски.
						// После исправления на число 20 стало нормально. Если появится смещение в других слайдах, то можно будет
						// копать глубже и разбираться откуда это число взялось.
						markLine.css({top: top - 20 + valueColumnHeight/2});
						mark.css({
							top: top - 20,
							left:-36,	// ?
							height: valueColumnHeight,
							lineHeight: valueColumnHeight + 'px'
						}).attr({
							title: title
						});

						self.vScale.$el.append(p.$mark);
						self.vScale.$el.append(markLine);

						// количественный показатель
						var quantity = c.get('quantity');
						if (quantity) {
							p.quantityTitle = quantity.title || '%v';
							p.quantityMax = quantity.max || 100;
							p.$quantity = $('<div class="mark quantity-mark"/>').css({
								top: top,
							}).appendTo(self.$el);
						}
					}

					if (p.get('link')) {
						var popup = self.options.popups.where({id: p.get('link')});
						if (popup.length != 0) {
							popup = popup[0];
							valueColumn.css({'cursor': 'pointer'});
						} else {
							popup = null;
						}
						valueColumn.click(function() {
							if (!popup) {
								return;
							}
							var p = new modelNS.PopupView({model: popup});
							self.$el.parents('.base-model').first().append(p.render().el);
						});
					}
				});

				// dynamically changing points value
				self.listenTo(c, 'pointChanged', function (p, value) {
					var tooltip = p.get('category').get('tooltip') || '',
							title = tooltip.replace('%value', modelNS.valueToLabel(Math.roundDec(value, 2)));

					p.$valueColumn.css('width', Math.abs(value) * pixelsPerStep);
					p.$valueColumn.attr('title', title);
					if (p.$mark) {
						p.$mark.attr('title', title);
					}

					if (p.$quantity) {
						var quantityValue = value/(self.options.max - self.options.min) * p.quantityMax,
								quantityLabel = modelNS.valueToLabel(Math.roundDec(quantityValue, 0));
						p.$quantity.html(p.quantityTitle.replace('%value', quantityLabel))
					}
				});
			});

			// init jquery ui tooltip's
			this.$el.tooltip({track:true});
		},
		refresh: function() {
			this.$el.html('');
			this.$el.remove();
			this.render();
		}
	});
})();
