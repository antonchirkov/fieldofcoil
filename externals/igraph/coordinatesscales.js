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

			if (!this.axisData) {
				if (!this.max && !this.step) {
					return;
				}
				this.pixelsPerMark = (this.$el.width() - 20) / (((this.max - this.min) / this.step));
				this.axisData = new Backbone.Collection();
				for (var i = Math.round(this.min / this.step); i <= Math.round(this.max / this.step); i++) {
					this.axisData.add({value: Math.round00(i * this.step)});
				}
				this.valueAxis = true;
				this.pixelsPerStep = (this.$el.width() - 20) / (this.max - this.min);
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

					if (this.proportionally && numeric) gridLine.addClass('subaxis-' + subaxis);
				}
			}
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
			if (this.min > 0) x -= this.min;
			return this.zeroLeft + x*this.pixelsPerStep;
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
			this.axisInLeft = this.min >= 0;// options.axisInLeft;
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

			this.outsetLeft = this.axisInLeft ? maxMarkWidth + 13 + 7 : 35; // 13px outset from axis, 7px outset from left

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
