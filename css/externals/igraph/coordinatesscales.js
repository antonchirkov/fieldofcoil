var iGraphNS = iGraphNS || {};

(function() {

	iGraphNS.HorizontalScale = Backbone.View.extend({
		className: 'horizontal-scale',
		initialize: function(options) {
			this.parent = options.parent;
			this.label = options.label;
			this.proportionally = options.proportionally;
			this.scaleCentered = typeof options.scaleCentered != 'undefined' ? options.scaleCentered : true;
			this.max = options.max;
			this.min = options.min;
			this.step = options.step;
			this.maxValue = options.maxValue;
			this.marks = options.marks || options.marks === undefined;
			this.grid = options.grid;
			this.outsetLeft = options.outsetLeft;
			this.options = options;
		},
		render: function() {
			this.parent.append(this.$el);
			this.$el.width(this.parent.width() - 35 - this.outsetLeft);	// 35px - right outset
			this.$el.css({left: this.outsetLeft});
			this.renderScale();
			this.renderLabel();
			return this;
		},
		renderLabel: function() {
			this.label = $('<div class="scale-label">' + this.label + '</div>');
			this.$axis.append(this.label);
		},
		renderScale: function() {
			var self = this,
					settings = this.options.settings;

			this.$axis = $('<div class="scale-line"/>').appendTo(this.$el);

			this.calculateMarksDistance();

			if (this.proportionally) {
				this.calculateMarksDistanceProportionallyToStep();
			}

			for (var i = 0; i < this.axisData.length; i++) {

				var value = this.axisData.at(i),
						markVal = modelNS.valueToLabel(value.get('value')),
						subaxis = value.get('subaxis') || 0,
						minVal = modelNS.valueToLabel(this.min);

				if (this.marks) {	//  || !this.valueAxis ???

					var mark = $('<div class="mark" >' + markVal + '</div>'),
							markLine = $('<div class="mark-line"></div>'),
							left;

					if (this.proportionally) {
						left = this.getLeftAt(markVal);

						mark.addClass('subaxis-' + subaxis);
						markLine.addClass('subaxis-' + subaxis);

						if (left === null) continue;
					} else {
						left = ((i + (this.scaleCentered ? 0.5 : 0)) * this.pixelsPerMark);
					}

					markLine.css({left: left + 'px'});
					this.$axis.append(mark);
					mark.css({left: left - mark.width()/2});
					var marginLeft = -mark.width()/2;
					this.$axis.append(markLine);

					if (markVal == minVal && minVal >= 0 || markVal == 0) {
						this.zeroLeft = left;
						// if (markVal == minVal) {
							mark.addClass('zero');
						// }
					};
				}

				// линии сетки вертикальные
				if (this.grid) {	// this.valueAxis ???
					var gridLine = $('<div class="grid-line"></div>');
					this.$el.append(gridLine);
						gridLine.css({height: (this.parent.height() - 62) + 'px',
						          left: left + 'px',
						          top: (-this.parent.height() + 62) + 'px'});

					if (this.proportionally) gridLine.addClass('subaxis-' + subaxis);
				}
				if (i + 1 === this.axisData.length) {
					this.setHorizontalGridLinesWidth(left);
				}
			}
		},
		/**
		 * Установка ширины горизонтальных линий сетки.
		 * На случай, если модель iGraphNS.HorizontalScale будет вызвана напрямую, а не через модель
		 * iGraphNS.CoordinatesGrid, делаем проверку на наличие ссылки на iGraphNS.CoordinatesGrid и наличие в ней
		 * модели iGraphNS.VerticalScale.
		 * Если инициализировать iGraphNS.CoordinatesGrid, то сначала будет обработана модель iGraphNS.VerticalScale,
		 * а затем iGraphNS.HorizontalScale(данная модель), поэтому на момент попытки установки ширины горизонтальных
		 * линий сетки, эти линии уже будут существовать, а если вызывать эту модель отдельно, то информации о модели
		 * iGraphNS.CoordinatesGrid не будет. Нужно делать проверку.
		 * @param widthValue
		 */
		setHorizontalGridLinesWidth: function(widthValue) {
			if (this.options.coordinatesGridModel !== void 0 && this.options.coordinatesGridModel.axisY !== void 0) {
				this.options.coordinatesGridModel.axisY.$el.find('.v-grid-line').css('width', widthValue);
			}
		},
		setAxisData: function(min, max, step, subaxis, prevLeft) {
			var fromI = Math.floor(min / step),
				toI = Math.ceil(max / step),
				valueRight = 0,
				pxPerLetter = 10,	// 8	// temporary fix for board, TODO: calculate by offsetWidth?
				lastValueRight = this.getLeftAt(toI*step) - Math.round00(i*step).toString().length*pxPerLetter/2;

			for (var i = fromI; i <= toI; i++) {
				var val = i*step,
					left = this.getLeftAt(val),
					diffLeft = left - prevLeft,
					diffRight = this.getLeftAt((i+1)*step) - left,
					value = Math.round00(val),
					// prevLeft = left;
					$value = $('<div class="mark" >' + value + '</div>').appendTo(this.$el),
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
						this.setAxisData((i-1)*step, val, newStep, subaxis+1, prevLeft);
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
				if (left <= this.getLeftAt(this.min)) continue;

				this.axisData.add({
					value : value,
					left : left,
					subaxis : subaxis
				});

				// protect log10 from 0 = null;
				prevLeft = left == null ? -50 : left;
			}
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
				this.pixelsPerMark = (this.$el.width() - 20) / (((this.max - this.min) / this.step));
				this.axisData = new Backbone.Collection();
				var marksCount = Math.ceil((this.max - this.min) / this.step);
				var valueToStepRatio = this.min / this.step;
				for (var i = 0; i <= marksCount; i++, valueToStepRatio++) {
					this.axisData.add({value: Math.round00(valueToStepRatio * this.step)});
				}
				this.valueAxis = true;
				this.pixelsPerStep = (this.$el.width() - 20) / (this.max - this.min);
			}
		},
		/**
		 * Расчёт расстояния между рисками на оси, когда значения меток должны быть кратны значению step, кроме первого.
		 * Значение первой метки на оси должно быть равно минимальному значению. Все дальнейшие метки рассчитываются
		 * с учётом кратности шагу.
		 * Для верных вычислений, значения pixelsPerMark и pixelsPerStep должны быть перерассчитаны на основе тех значений,
		 * которые будут на оси, а не тех, что указаны в диапазоне. Если максимальное значение в диапазоне равно 410, то
		 * на шкале максимальное значение будет 420(при step = 20) и местоположение меток будет вычисляться некорректно,
		 * т.к. до этого pixelsPerMark и pixelsPerStep вычилялись для максимального значения в 410.
		 */
		calculateMarksDistanceProportionallyToStep: function () {
			var minValueOnScale = this.min;
			var maxValueOnScale = Math.ceil(this.max / this.step) * this.step;
			this.pixelsPerMark = (this.$el.width() - 20) / (((maxValueOnScale - minValueOnScale) / this.step));
			this.pixelsPerStep = (this.$el.width() - 20) / (maxValueOnScale - minValueOnScale);
			this.axisData = new Backbone.Collection();
			this.axisData.add({
				value : Math.round00(this.min),
				left : this.getLeftAt(this.min),
				subaxis : 0
			});
			this.setAxisData(this.min, this.max, this.step, 0, 0);
		},

		setAxisTop : function (top)
		{
			this.$axis.css('top', top - this.parent.height() + 20 + 41 -2); // top, bottom and half axis height outsets
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
		getLeftAt: function (x) {
			// когда график начинается например с 500, мы должны учитывать это
			if (this.min > 0) {
				x -= this.min;
			}
			return x * this.pixelsPerStep;
		},
		getXAt: function (left) {
			// когда график начинается например с 500, мы должны учитывать это
			return (left-this.zeroLeft)/this.pixelsPerStep + (this.min > 0 && this.min);
		},
		getXperPx: function ()
		{
			return 1/this.pixelsPerStep; // *this.step; ??
		}
	});

	iGraphNS.VerticalScale = Backbone.View.extend({
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
		},
		render: function() {
			this.parent.append(this.$el);
			this.$el.height(this.parent.height() - 62);
			this.renderScale();
			this.renderLabel();

			this.$el.css({left: this.outsetLeft, top: '20px'});

			return this;
		},
		renderLabel: function() {
			this.label = $('<div class="scale-label">' + this.label + '</div>');
			this.$axis.append(this.label);
		},
		renderScale: function() {
			if (!this.axisData) {
				if (!this.max && !this.step) {
					return;
				}
				this.pixelsPerMark = this.$el.height() / (Math.round((this.max - this.min) / this.step));
				this.axisData = new Backbone.Collection();
				for (var i = Math.round(this.min / this.step); i <= Math.round(this.max / this.step); i++) {
					this.axisData.add({value: Math.round00(i * this.step)});
				}
				this.valueAxis = true;
				this.pixelsPerStep = this.$el.height() / (this.max - this.min);
			}

			var marks = [],
					maxMarkWidth = 15;	// min mark width is 15px
			this.$axis = $('<div class="scale-line"/>').appendTo(this.$el);
			for (var i = 0; i < this.axisData.length; i++) {
				var val = this.axisData.at(i).get('value'),
						markVal = modelNS.valueToLabel(val),
						top = ((this.axisData.length - 1) - i) * this.pixelsPerMark,
						isZero = val == this.min && val >= 0 || val == 0;

				if (isZero) {
					this.zeroTop = top;
					// continue;
				}

				if (this.grid) {
					var gridLine = $('<div class="v-grid-line"></div>');
					this.$el.append(gridLine);
					gridLine.css({top: top + 'px'});
				}
				if (this.marks) {
					var $mark = $('<div class="v-mark">' + markVal + '</div>'),
							markLine = $('<div class="v-mark-line"></div>');

					if (isZero) {
						$mark.addClass('zero')
					}

					markLine.css({top: top + 'px'});
					$mark.css({top: ((this.axisData.length - 1 - (i + (this.scaleCentered ? 0 : 0.5))) * this.pixelsPerMark) + 'px',
						            height: this.pixelsPerMark + 'px',
						            // display: 'none',
						            'line-height': this.pixelsPerMark + 'px'});
					marks.push($mark);
					this.$axis.append($mark);
					this.$axis.append(markLine);
					maxMarkWidth = Math.max(maxMarkWidth, $mark.width());
				}
			}

			this.outsetLeft = maxMarkWidth + 13 + 7; // 13px outset from axis, 7px outset from left

			// correcting v-grid-line width
			this.$el.find('.v-grid-line').css('width', this.parent.width() - 35 - this.outsetLeft);

			// correcting v-mark positions
			this.$axis.find('.v-mark').css({
				width: maxMarkWidth,
				left: -maxMarkWidth - 13
			});

			// setTimeout(function() {	// ??
			// 	for (var i = 0; i < marks.length; i++) {
			// 		marks[i].css({left: (-marks[i].width() - 14) + 'px', display: 'block'});
			// 	}
			// }, 100);
		},
		setAxisLeft: function (left)
		{
			this.$axis.css('left', left - 1); // compensation axis/2 width
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
		getTopAt : function (x) {
			// когда график начинается например с 500, мы должны учитывать это
			if (this.min > 0) x -= this.min;
			return this.zeroTop - x*this.pixelsPerStep;// - this.parent.height() + 20 + 41;
		},
		getYAt: function (top) {
			return (this.zeroTop-top)/this.pixelsPerStep + (this.min > 0 && this.min); // когда не с нуля начинается шкала нужен this.min
		}
	});

})();
