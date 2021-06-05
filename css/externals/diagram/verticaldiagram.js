var iDiagramNS = iDiagramNS || {};

(function() {

	iDiagramNS.Category = Backbone.Model.extend({
		initialize: function(options) {
			this.set({
				title: options.title,
				tooltip: options.tooltip,
				color: options.color,
				points: options.points
			});
		}
	});

	iDiagramNS.CategoryCollection = Backbone.Collection.extend({
		model: iDiagramNS.Category
	});

	iDiagramNS.PointModel = Backbone.Model.extend({
		initialize: function(options) {
			this.set({
				category: options.category,
				value: options.value,
				labels: options.labels,
				axisValue: options.axisValue
			});
			this.on('change:value', function (p, value) {
				this.get('category').trigger('pointChanged', p, value);
			});
		}
	});

	iDiagramNS.PointCollection = Backbone.Collection.extend({
		model: iDiagramNS.PointModel
	});

	iDiagramNS.AxisValue = Backbone.Model.extend({
		initialize: function(options) {
			this.set({
				value: options.value,
				left: options.left,
				top: options.top
			});
		}
	});

	iDiagramNS.AxisValues = Backbone.Collection.extend({
		model: iDiagramNS.AxisValue
	});

	iDiagramNS.PointView = Backbone.View.extend({
		className: 'diagram-point',
		events: {
			'click': 'onClick'
		},
		initialize: function(options) {
			this.left = options.left;
			this.top = options.top;
			this.value = options.value;
			this.color = options.color;
			this.popup = options.popup;
			this.label = options.label;
			this.link = options.link;
		},
		render: function() {
			this.$el.css({
				top: this.top,
				left: this.left,
				'background-color': this.color
			});
			if (this.$label) {
				this.labelElement = $('<div class="diagram-point-label"></div)');
				this.labelElement.append(this.$label);
				this.$el.append(this.labelElement);
			}
			return this;
		},
		onClick: function() {
			if (!this.popup) {
				return;
			}
			var popup = new modelNS.PopupView({model: this.popup});
			this.$el.parents('.base-model').first().append(popup.render().el);
		}
	});

	iDiagramNS.HorizontalScale = Backbone.View.extend({
		className: 'horizontal-scale',
		initialize: function(options) {
			this.parent = options.parent;
			this.label = options.label;
			this.axisData = options.axisData;
			this.proportionally = options.proportionally;
			this.scaleCentered = typeof options.scaleCentered != 'undefined' ? options.scaleCentered : true;
			this.max = options.max;
			this.min = options.min;
			this.step = options.step;
			this.maxValue = options.maxValue;
			this.marks = options.marks || options.marks === undefined;
			this.grid = options.grid;
			this.leftOutset = options.leftOutset;
			this.options = options;
			this.bottomOutset = 20;
			// console.log(this.step)
			this.referenceValues = options.referenceValues;
		},
		render: function() {
			this.parent.append(this.$el);
			this.$el.width(this.parent.width() - this.leftOutset - 35);
			this.$el.css({left: this.leftOutset});
			this.renderLabel();
			this.renderScale();
			this.renderReferenceValues();
			return this;
		},
		renderReferenceValues: function () {
			if (!this.referenceValues) {
				return;
			}

			var height = this.parent.height() - this.bottomOutset - 23; // 23 - top outset ??

			for (var i=0; i<this.referenceValues.length; i++) {
				var referenceValue = this.referenceValues[i],
						left = this.getScaledLeft(referenceValue.value),
						$mark = $('<div class="mark reference-mark">'+referenceValue.label+'</div>')
						.css({
							left: left,
							top: -height,
						}).appendTo(this.$el);
				$mark.css({
					marginLeft: -$mark.width()/2,
					marginTop: -$mark.height() + 3,
				});
				$('<div class="grid-line reference-line"/>').attr({
					title: referenceValue.tooltip
				}).css({
					left: left,
					height: height,
					top: -height,
				}).appendTo(this.$el);
			}
		},
		renderLabel: function() {
			this.$label = $('<div class="axis-label">' + this.label + '</div>');
			this.parent.append(this.$label);	// Данные построенной диаграммы перекрывают название оси #9872 (note-1)
		},
		renderScale: function() {
			var self = this,
					settings = this.options.settings;
			if (!this.axisData) {
				if (!this.max && !this.step) {
					return;
				}
				this.pixelsPerMark = (this.$el.width() - 20) / ((Math.round(this.max - this.min) / this.step));
				this.axisData = new Backbone.Collection();
				for (var i = Math.round(this.min / this.step); i <= Math.round(this.max / this.step); i++) {
					this.axisData.add({value: Math.roundDec(i * this.step, 3)}); // fix 0.1 * 3 = 0.30000000000000004
				}
				this.valueAxis = true;
				this.pixelsPerStep = (this.$el.width() - 20) / (this.max - this.min);
			} else {
				this.pixelsPerMark = (this.$el.width() - 20) / this.axisData.length;
				this.valueAxis = false;

				var axis0 = this.axisData.at(0);

				if (this.proportionally && axis0) {	// #8372 Ось x строится непропорционально указанным значениям в режиме графика
					var numeric = true,
							// min = this.scalingData( Math.parseFloat(this.axisData.at(0).get('value')) ),
							// max = this.scalingData( Math.parseFloat(this.axisData.at(this.axisData.length-1).get('value')) ),
							min = modelNS.parseFloat(axis0.get('value')),
							max = modelNS.parseFloat(this.axisData.at(this.axisData.length-1).get('value')),
							prevVal = null,
							step;

					for (var i = 0; i < this.axisData.length; i++) {
						// var value = this.scalingData( Math.parseFloat(this.axisData.at(i).get('value')) );
						var value = modelNS.parseFloat(this.axisData.at(i).get('value')),
								prevStep = value -prevVal;
						if (isNaN(value)) numeric = false;
						if (prevVal !== null && (!step || prevStep>0 && step > prevStep)) step = prevStep;
						if (value > max) max = value;
						if (value < min) min = value;
						prevVal = value;
					}

					// #11851 Если подписи - одинаковые цифры. (избегаем зависания)
					if (min == max) {
						numeric = false;
					}

					if (numeric) {
						this.scaleCentered = false;

						this.max = this.options.settings.maxX || Math.ceil(max);	// ceil becose of x^2 = 3.4 then we have 4 good scaling
						this.min = isNaN(this.options.settings.minX) ? min : this.options.settings.minX;
						this.step = step;

						var detectPow = Math.round(Math.round(Math.log10((max-min) / 10)*10)/10),
								autoStep = Math.pow(10, detectPow);
						if (step < autoStep) this.step = autoStep;

						// fix small steps
						if ((max-min) > 1 && this.step < 1) this.step = 1;

						// this.step = 0.5;

						var axisData = new Backbone.Collection(),
								minLeft = self.getScaledLeft(this.min);

						// 0
						axisData.add({
							value : Math.round00(this.min),
							left : this.getScaledLeft(this.min),
							subaxis : 0
						});

						setAxisData(this.min, this.max, this.step, 0, 0);

						function setAxisData (min, max, step, subaxis, prevLeft) {
							var fromI = Math.round(min / step),
									toI = Math.round(max / step),
									valueRight = 0,
									pxPerLetter = 10,	// 8	// temporary fix for board, TODO: calculate by offsetWidth?
									lastValueRight = self.getScaledLeft(toI*step) - Math.round00(i*step).toString().length*pxPerLetter/2;

							for (var i = fromI; i <= toI; i++) {
								var val = i*step > max ? max : i*step,	// поддержка отрицательных
										left = self.getScaledLeft(val),
										diffLeft = left - prevLeft,
										diffRight = self.getScaledLeft((i+1)*step) - left,
										value = Math.round00(val),
										// prevLeft = left;
										$value = $('<div class="mark" >' + value + '</div>').appendTo(self.$el),
										valueWidth = $value.width() + 4; // outsets
										// valueWidth = value.toString().length*pxPerLetter;

								$value.remove();
								// console.log(valueWidth, value.toString().length*pxPerLetter)

								if (diffLeft > 60) {
									var newStep;
									if (Math.log10(step) == Math.round(Math.log10(step))) { // && Math.log10(value) == Math.round(Math.log10(value)) ) {
										newStep = step/2;
									} else {
										newStep = Math.pow(10, Math.round(Math.log10(step))-1);
									}

									// TODO: + шаг в 1/5 ? 2, 4, 8

									// console.log((i-1)*step, i*step, newStep, subaxis+1, left - prevLeft);
									if (newStep >= 1) {
										setAxisData((i-1)*step, val, newStep, subaxis+1, prevLeft);
									}
								}

								if (diffLeft < valueWidth || diffRight < valueWidth) {

									// dont dublicate
									if (subaxis && (i==fromI || i==toI)) {

										prevLeft = left == null ? -50 : left;
										continue;
									}

									// if current not before last
									if (subaxis || (i!=fromI && i!=toI)) {
										 	// if first value miss like [0.1] then return, becose looks bad if start from 0.2 or 0.3
											if (subaxis && i >= fromI+1) {
												return;
											}
//
// console.log(value, [valueWidth, diffLeft], [left, valueRight])

											// if main scale (0)
											if (subaxis == 0 && diffLeft > valueWidth && left > valueRight && left + valueWidth < lastValueRight) {
												valueRight = left + valueWidth;
											} else {
												// prevLeft = left == null ? -50 : left;
												continue;
											}
									}

								}

								// dont dublicate values for subaxis
								if (subaxis>0 && (i==fromI || i==toI)) continue;
								if (left <= minLeft) continue;

								axisData.add({
									value : value,
									left : left,
									subaxis : subaxis
								});

								// protect log10 from 0 = null;
								prevLeft = left == null ? -50 : left;
							}
						}

						this.valueAxis = true;
						this.axisData = axisData;
						this.pixelsPerMark = (this.$el.width() - 20) / (this.axisData.length-1);
						this.pixelsPerStep = this.pixelsPerMark/this.step;
					}
				}

			}

			this.axisValues = new iDiagramNS.AxisValues();
			for (var i = 0; i < this.axisData.length; i++) {

				var value = this.axisData.at(i),
						markVal = modelNS.valueToLabel(this.addZeroAfterInteger(value.get('value'))),
						subaxis = value.get('subaxis') || 0;

                // #11652 В будущем с помощью этого флага будем запрещать перенос слов, если это число, которое может быть поделено на разряды
				var markIsNum = !isNaN(markVal);

                // #11652
				if (markVal && markIsNum && markVal >= 10000) {
					var markValParts = markVal.toString().split(".");
					markValParts[0] = markValParts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
					markVal = markValParts.join(".");
				}

				if (this.marks
					&&	this.axisData.length > 1 	// 9734#note-3 если набор данных только один, то подпись к данным аналогична названию шкалы
				) {	//  || !this.valueAxis ???

					var mark = $('<div class="mark" >' + markVal + '</div>'),
							markLine = $('<div class="mark-line"></div>'),
							left;

					// #11652
					if (markIsNum) {
						mark.addClass('mark_num');
					}

					if (this.proportionally && numeric) {
						// left = this.getScaledLeft(markVal);
						left = value.get('left'); // this.getScaledLeft(i);

						mark.addClass('subaxis-' + subaxis);
						markLine.addClass('subaxis-' + subaxis);

						if (left === null) continue;
					} else {
						left = ((i + (this.scaleCentered ? 0.5 : 0)) * this.pixelsPerMark);
					}

					markLine.css({left: left + 'px'});
					mark.css({left: (left + (!this.scaleCentered && i == 0 ? 5 : 0)) + 'px'});
					this.$el.append(mark);
					var marginLeft = -mark.width()/2;
					this.$el.append(markLine);
					if (i == 0 && !this.scaleCentered) {
						// mark.css('padding-left', (markVal.toString().length * 5) + 'px');
						marginLeft -= 4;
					}
					mark.css({marginLeft: marginLeft});

					this.bottomOutset = Math.max(this.bottomOutset, mark.height() + 12); // 12 - отступ подписей сверху
				}

				this.axisValues.add({	// ?
					value: value,
					left: i * this.pixelsPerMark + 35
				});

				// линии сетки вертикальные
				if (this.grid) {	// this.valueAxis ???
					var gridLine = $('<div class="grid-line"></div>');
					this.$el.append(gridLine);
						gridLine.css({height: (this.parent.height() - 62) + 'px',
						          left: left + 'px',
						          top: (-this.parent.height() + 62) + 'px'});

					if (this.proportionally && numeric) gridLine.addClass('subaxis-' + subaxis);
				}
			}

			this.$el.css('bottom', this.bottomOutset);
			this.$label.css('bottom', this.bottomOutset + 10); // Отступ увеличен с 4 до 10 (#13847)
		},
		getScaledLeft: function (k) {
			var settings = this.options.settings,
					min = this.getScaledK(this.min),
					max = this.getScaledK(this.max),
					scaledK = this.getScaledK(k + (this.scaleCentered ? 0.5 : 0)),
					scaleWidth = this.$el.width() - 20; // right outset from arrow. this.leftOutset;

					// temporary protect from Math.log10(0) = -Math.Infinity
					if (settings.lg && min<0) min = 0;
					if (settings.lg && scaledK < 0) return null

					// max - min = scaleWidth;
					// scaledK - min = x
					return (scaledK-min) * scaleWidth / (max - min);
		},
		getScaledK: function (k) {
			var settings = this.options.settings;

			if (settings.pow) {
				k = Math.pow(k, 1/settings.pow);
			} else if (settings.lg) {
				k = Math.logb(k, settings.lg);
			}

			return k;
		},
		getPixelsPerStep: function() {
			return this.pixelsPerStep;
		},
		getAxisValues: function() {
			return this.axisValues;
		},
		getPixelsPerMark: function() {
			return this.pixelsPerMark;
		},
		scalingData : function (data) {
			var settings = this.options.settings;

			if (settings.pow) {
				data = Math.round00( Math.pow(data, 1/settings.pow) );
			}
			if (settings.lg) {
				data = Math.round00( Math.logb(data, settings.lg) );
			}
			return data;
		},
		/**
		 * Добавляет 0 в дробной части целого числового значения, если это значение больше нуля и была установлена
		 * необходимая опция при инициализации модели.
		 * @param value Значение на оси
		 * @returns {*|string}
		 */
		addZeroAfterInteger: function(value) {
			if (!isNaN(value) && value > 0 && this.options.settings.hasZeroAfterInteger) {
				return value.toFixed(1);
			} else {
				return value;
			}
		}
	});

	iDiagramNS.VerticalScale = Backbone.View.extend({
		className: 'vertical-scale',
		initialize: function(options) {
			this.parent = options.parent;
			this.label = options.label;
			this.axisData = options.axisData;
			this.scaleCentered = typeof options.scaleCentered != 'undefined' ? options.scaleCentered : true;
			this.max = options.max;
			this.min = options.min;
			this.step = options.step;
			this.maxValue = options.maxValue;
			this.marks = options.marks;
			this.grid = options.grid;
			this.leftOutset = options.leftOutset || 5;
		},
		render: function() {
			this.axisValues = new iDiagramNS.AxisValues();
			this.parent.append(this.$el);
			this.$el.height(this.parent.height() - 62);
			this.renderScale();
			this.renderLabel();
			this.$el.css({left: this.leftOutset, top: '20px'});
			return this;
		},
		renderLabel: function() {
			this.label = $('<div class="axis-label">' + this.label + '</div>');
			this.label.width(this.parent.width() - this.leftOutset - 62);	// фикс что слова переносятся, так как размер по умолчанию равен полос
			this.$el.append(this.label);
		},
		renderScale: function() {
			this.calculateMarksDistance();

			this.$el.append('<div class="scale-line"></div>');

			var isShowMarks = (this.marks || !this.valueAxis)
							&& this.axisData.length > 1;	// 9734#note-3 если набор данных только один, то подпись к данным аналогична названию шкалы

			this.marksWidth = 0;

			// сброс перед расчетом
			this.$el.find('.v-mark').css({width:''});

			var marks = [];
			for (var i = 0; i < this.axisData.length; i++) {
				this.axisValues.add({
					value: this.axisData.at(i),
					top: ((this.axisData.length - 1) - (i + (this.scaleCentered ? -0.5 : 0))) * this.pixelsPerMark
				});

				if (isShowMarks) {
					var value = this.axisData.at(i).get('value');
					var $mark = this.renderScaleMark( value, {
						// Если ХОТЬ ОДНО число на слайде разрядное, то на разряды бьются и все остальные (#13848)
						hasDigitCapacity: this.hasDigitCapacity()
					});
					marks.push( $mark );
				}
			}

			if (isShowMarks) {
				this.resizeScaleMarks( marks );
			}

			this.renderGridLines();
		},
        /**
		 * Рассчёт расстояния между рисками на оси.
		 * Необходимо учитывать, что минимальное значение на оси может быть меньше нуля.
		 * Для проверки условия продолжения итераций при добавлении объектов в коллекцию axisData мы используем
         * округлённое число, чтобы их количество соответствовало количеству отметок на оси.
         * marksCount используется для расчёта количества рисок на оси. Значение округляем в большую сторону,
         * чтобы максимальное значение метки на оси было не меньше максимального значения в данных.
         * Для записи самого значения отметки на оси используется неокруглённое число, представляющее соотношение
         * минимального значения и шага(valueToStepRatio). Это нужно на случай, если минимальное число будет не
         * ноль, а отрицательным.
         * Если минимальное значение будет -30, а step будет 20, то соотношение будет -1.5. После округления оно
         * станет равным -1, поэтому когда будем записывать значение, то оно уже получится не -30, а -20. Чтобы
         * этого избежать используем i для итераций, а valueToStepRatio для записи значения.
         */
		calculateMarksDistance: function () {
			if (!this.axisData) {
				if (!this.max && !this.step) {
					return;
				}
				this.axisData = new Backbone.Collection();
				var marksCount = Math.ceil((this.max - this.min) / this.step);
                var valueToStepRatio = this.min / this.step;
				for (var i = 0; i <= marksCount; i++, valueToStepRatio++) {
					this.axisData.add({value: Math.round00(valueToStepRatio * this.step)});
				}
				this.valueAxis = true;
				var maxYAxisValue = this.getMaxValueFromAxisData();
				var minYAxisValue = this.getMinValueFromAxisData();
                this.pixelsPerMark = this.$el.height() / (Math.round((maxYAxisValue - minYAxisValue) / this.step));
				this.pixelsPerStep = this.$el.height() / (maxYAxisValue - minYAxisValue);
			} else {
				this.pixelsPerMark = Math.round((this.$el.height() / this.axisData.length));
				this.valueAxis = false;
			}
		},
		hasDigitCapacity: function () {
			var hasDigitCapacity = false;

			for (var i = 0; i < this.axisData.length; i++) {
				var value = this.axisData.at(i).get('value');
				var markVal = modelNS.valueToLabel( value );

				// #11652
				if (modelNS.hasDigitCapacity( markVal )) {
					return true;
				}
			}
		},
		renderScaleMark: function ( value, options ) {
			var markVal = modelNS.valueToLabel( value );

			if (!markVal) {
				return;
			}

			// #11652 В будущем с помощью этого флага будем запрещать перенос слов, если это число, которое может быть поделено на разряды
			var markIsNum = !isNaN(markVal);

			// #11652
			if (options.hasDigitCapacity) {
				markVal = modelNS.toDigitCapacity( markVal );
			}

			var $mark = $('<div class="v-mark">' + markVal + '</div>'),
					markLine = $('<div class="v-mark-line"></div>');

			// #11652
			if ( markIsNum ) {
				$mark.addClass('v-mark_num');
			}

			this.$el.append($mark);
			this.$el.append(markLine);

			this.marksWidth = Math.max(this.marksWidth, $mark.width());

			return $mark;
		},
		resizeScaleMarks: function ( marks ) {
			for (var i = 0; i < marks.length; i++) {
				marks[i].css({width:this.marksWidth, left:-this.marksWidth-13});
			}
			this.leftOutset = this.marksWidth + 15;
		},
		renderGridLines: function () {
			for (var i = 0; i < this.axisData.length; i++) {
				if (this.valueAxis && this.grid) {
					var gridLine = $('<div class="v-grid-line"></div>');
					this.$el.append(gridLine);
					gridLine.css({width: (this.parent.width() - this.leftOutset - 35) + 'px', top: (((this.axisData.length - 1) - (i + (this.scaleCentered ? -0.5 : 0))) * this.pixelsPerMark) + 'px'});
				}
			}
		},
		zeroTop: function () {
			// console.log(this.axisData.length, this.pixelsPerMark)
			return (this.axisData.length - 1)  * this.pixelsPerMark;
		},
		setBottomOutset: function (bottomOutset) {
			var self = this,
					parentHeight = this.parent.height(),
					height = parentHeight - bottomOutset - 20; // 20 отступ сверху

			this.$el.height(height);

			// пересчитываем размерности
			if (this.max === undefined || this.min === undefined) {
				this.pixelsPerMark = height / this.axisData.length;
			} else {
                var maxYAxisValue = this.getMaxValueFromAxisData();
                var minYAxisValue = this.getMinValueFromAxisData();
				this.pixelsPerMark = height / (Math.round((maxYAxisValue - minYAxisValue) / this.step));
				this.pixelsPerStep = height / (maxYAxisValue - minYAxisValue);
			}

			// перерисовываем размерности
			this.$el.find('.v-mark').each(function (i) {
				var $mark = $(this);
				$mark.css({
					top: ((self.axisData.length - 1 - (i + (self.scaleCentered ? 0 : 0.5))) * self.pixelsPerMark),
					marginTop: (self.pixelsPerMark-$mark.height())/2
				});
			});

			this.$el.find('.v-mark-line').each(function (i) {
				$(this).css('top', ((self.axisData.length - 1) - (i + (self.scaleCentered ? -0.5 : 0))) * self.pixelsPerMark);
			});

			this.$el.find('.v-grid-line').each(function (i) {
				$(this).css('top', ((self.axisData.length - 1) - (i + (self.scaleCentered ? -0.5 : 0))) * self.pixelsPerMark);
			});

			// Что это? Почему создание происходит в методе set где должна быть только установка значений?
			// Приводит к ошибке при установке дробных значений (#13377)
			// var gridLine = $('<div class="v-grid-line"></div>');
			// this.$el.append(gridLine);
			// gridLine.css({width: (this.parent.width() - this.leftOutset - 35) + 'px', top: (((this.axisData.length - 1) - (i + (this.scaleCentered ? -0.5 : 0))) * this.pixelsPerMark) + 'px'});

			if (this.grid) {
				this.$el.find('.grid-line').css({height: parentHeight - bottomOutset});
			}
		},
		getPixelsPerStep: function() {
			return this.pixelsPerStep;
		},
		getAxisValues: function() {
			return this.axisValues;
		},
		getPixelsPerMark: function() {
			return this.pixelsPerMark;
		},
        /**
		 * Возвращает минимальное значение, которое указано на оси Y.
		 * За минимальное значение можно считать первую модель в коллекции axisData.
         * @returns {*}
         */
		getMinValueFromAxisData: function() {
			return this.axisData.first().get('value');
		},
        /**
         * Возвращает максимальное значение, которое указано на оси Y.
         * За максимальное значение можно считать последнюю модель в коллекции axisData.
         * @returns {*}
         */
        getMaxValueFromAxisData: function() {
            return this.axisData.last().get('value');
        }
	});

	iDiagramNS.VerticalDiagram = Backbone.View.extend({
		className: 'vertical-diagram diagram-wrp',
		initialize: function(options) {
			this.options = options;
		},
		render: function() {
			this.options.parent.append(this.$el);

			// this.layer = new modelNS.SingleLayout({
			// 	cls: 'model-wrp'
			// });
			// this.$el.append(this.layer.render().el);
			this.layer = this;

			if (this.options.cls) {
				this.$el.addClass(this.options.cls);
			}
			this.renderScale();
			return this;
		},
		renderScale: function() {
			var _this = this;
			this.vScale = new iDiagramNS.VerticalScale({
				parent: this.layer.$el,
				label: this.options.labelY,
				scaleCentered: false,
				min: this.options.minY, // #11318 Передаем значение minY вместо min
				max: this.options.maxY, // #11318 Передаем значение maxY вместо max
				step: this.options.stepY, // #11318 Передаем значение stepY вместо step
				grid: this.options.grid,
				marks: this.options.marksY, // #11318 В marks запишем marksY, чтобы манипулировать осью Y
				maxValue: this.options.maxValue,
			});
			this.vScale.render();
			this.hScale = new iDiagramNS.HorizontalScale({
				parent: this.layer.$el,
				label: this.options.labelX,
				axisData: this.options.axisXValues,
				leftOutset: this.vScale.leftOutset,
				scaleCentered: true,
				marks: this.options.marks, // #11317
			});
			this.hScale.render();

			// отступ снизу учитывая высоту нижних подписей
			this.vScale.setBottomOutset(this.hScale.bottomOutset);

			var axisData = this.options.axisXValues;

			if (!this.options.categories) {
				return;
			}

			var valueColumnWidth = Math.round((this.hScale.getPixelsPerMark() - 10) / this.options.categories.length),
				axisValues = this.hScale.getAxisValues(),
				pixelsPerStep = this.vScale.getPixelsPerStep();

			var zeroTop;
			this.vScale.getAxisValues().each(function(v) {
				var valueObj = v.get('value');
				if (valueObj.get('value') == 0) {
					zeroTop = v.get('top');
				}
			});

			// for (var i = 0; i < this.axisData.length; i++) {
			// 	this.axisValues.add({
			// 		value: this.axisData.at(i),
			// 		top: ((this.axisData.length - 1) - (i + (this.scaleCentered ? -0.5 : 0))) * this.pixelsPerMark
			// 	});
			// 	if (this.valueAxis && this.grid) {
			// 		var gridLine = $('<div class="v-grid-line"></div>');
			// 		this.$el.append(gridLine);
			// 		gridLine.css({width: (this.parent.width() - 70) + 'px', top: (((this.axisData.length - 1) - (i + (this.scaleCentered ? -0.5 : 0))) * this.pixelsPerMark) + 'px'});
			// 	}
			// 	if (this.marks || !this.valueAxis) {
						// var markVal = this.axisData.at(i).get('value').toString().replace(".", ",");	// #9703#note-4
			//
			// 		if (!markVal) continue;
			//
					// ???????????
					// var mark = $('<div class="v-mark">' + markVal + '</div>'),
					// 		markLine = $('<div class="v-mark-line"></div>');
					// markLine.css({top: (((this.axisData.length - 1) - (i + (this.scaleCentered ? -0.5 : 0))) * this.pixelsPerMark) + 'px'});
					// mark.css({top: ((this.axisData.length - 1 - (i + (this.scaleCentered ? 0 : 0.5))) * this.pixelsPerMark) + 'px',
					// 							height: this.pixelsPerMark + 'px',
					// 							display: 'none',
					// 							'line-height': this.pixelsPerMark + 'px'});
					// marks.push(mark);
					// this.$el.append(mark);
					// this.$el.append(markLine);
			// 	}
			// }

			this.options.categories.each(function(c, i) {
				c.get('points').each(function(p, pointIndex) {
					var valueColumn = $('<div class="value-column"></div>'),
						axisValue = axisValues.where({value: p.get('axisValue')})[0],
						scaleHeight = _this.$el.height() - _this.hScale.bottomOutset - 22, // 22 - top outset
						bottom = (p.get('value') > 0 ? _this.hScale.bottomOutset :
								 scaleHeight - zeroTop - (Math.abs(p.get('value') * pixelsPerStep)));

					bottom += 2; // #9465-15 компенсация ширины линии шкалы

					valueColumn.css({
						'background-color': c.get('color'),
						'bottom': bottom + 'px',
						'left': (_this.vScale.leftOutset + (i * valueColumnWidth) + 5) + (pointIndex*_this.hScale.pixelsPerMark) + 'px',
						'height': (Math.abs(p.get('value') * pixelsPerStep)) + 'px',
						'width': valueColumnWidth + 'px'
					});

					_this.layer.$el.append(valueColumn);
					if (p.get('link')) {
						var popup = _this.options.popups.where({id: p.get('link')});
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
							_this.$el.parents('.base-model').first().append(p.render().el);
						});
					}
				});
			});
		},
		refresh: function() {
			this.$el.html('');
			this.$el.remove();
			this.render();
		}
	});
})();
