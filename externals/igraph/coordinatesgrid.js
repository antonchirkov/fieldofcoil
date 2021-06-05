(function() {

	iGraphNS.CoordinatesGrid = Backbone.View.extend({
		className: 'coordinates-grid',
		// events: {
		// 	'click .canvas-events': 'onClick',
		// 	'mousemove .canvas-events': 'onMouseMove'
		// },
		initialize: function(options) {
			this.options = options;
			this.domainX = this.options.domainX || this.options.domain;
			this.domainY = this.options.domainY || this.options.domain;
			this.stepX = this.options.stepX || this.options.step;
			this.stepY = this.options.stepY || this.options.step;
		},
		render: function() {
			this.options.parent.append(this.$el);
			this.layer = new modelNS.SingleLayout({
				cls: 'diagram-wrp',
				border: false
			});
			this.$el.append(this.layer.render().el);
			if (this.options.cls) {
				this.$el.addClass(this.options.cls);
			}
			this.renderScale();
			return this;
		},
		renderScale: function() {
			var self = this;
			this.axisY = this.vScale = new iGraphNS.VerticalScale({
				parent: this.layer.$el,
				label: this.options.labelY,
				scaleCentered: false,
				min: this.domainY[0],
				max: this.domainY[1],
				step: this.stepY,
				maxValue: this.options.maxValue,
				grid: this.options.grid,
				marks: this.options.marks,
				axisInLeft: this.domainX[0] == 0
			});
			this.vScale.render();

			this.axisX = this.hScale = new iGraphNS.HorizontalScale({
				parent: this.layer.$el,
				label: this.options.labelX,
				scaleCentered: false,
				min: this.domainX[0],
				max: this.domainX[1],
				step: this.stepX,
				maxValue: this.options.maxValue,
				grid: this.options.grid,
				marks: this.options.marks,
				outsetLeft: this.vScale.outsetLeft
			});
			this.hScale.render();

			this.hScale.setAxisTop(this.vScale.zeroTop);
			this.vScale.setAxisLeft(this.hScale.zeroLeft);

			if (this.vScale.min==0) this.$el.addClass('hscale-bottom');
			if (this.hScale.min==0) this.$el.addClass('vscale-left');
		},
		calcScaleX : function (k, axisValue, pixelsPerMark)
		{
			var step = this.hScale.step,
					settings = this.options.settings;

			if (step) {
				var axisK = Math.parseFloat(axisValue), // / step,
						lg;

				if (settings.pow) {
					lg = Math.pow(axisK, 1/settings.pow);
				} else if (settings.lg) {
					lg = Math.logb(axisK, settings.lg);
				}

				var rest = lg%step,
						markK = (lg-rest)/step - this.hScale.min;

				// if (markK < 0) return null;
				// if (markK > this.hScale.axisData.length-2 || markK > this.hScale.axisData.length-1 && !rest) return null;

				return pixelsPerMark * (markK) + rest*pixelsPerMark/step + (this.hScale.scaleCentered ? 0.5 : 0);
			}

			return pixelsPerMark * (k + 0.5);
		},
		getValByLeft : function (left) {
			return this.valToScale (Math.round00( (left-30-6)/this.hScale.pixelsPerStep ));
		},

		valToScale : function (val)
		{
			var settings = this.options.settings;

			if (settings.pow) {
				val = Math.round00( Math.pow(val, settings.pow) );
			}

			if (settings.lg) {
				val = Math.round00( Math.pow(settings.lg, val) );
			}

			return val;
		},

		getValByTop : function (top) {
				return Math.round00( (this.zeroTop-top+14+6)/this.pixelsPerStep );	// 6 is half of point
		},

		drawPoint : function (options)
	  {
			if (!options.left) options.left = this.axisX.getLeftAt(options.x);
			if (!options.top) options.top = this.axisY.getTopAt(options.y);
			if (options.tooltip) {
				var roundX = options.tooltip.replace(/.*%x\.?(\d)?.*/gi, '$1') || 2,
						roundY = options.tooltip.replace(/.*%x\.?(\d)?.*/gi, '$1') || 2;
				options.tooltip = options.tooltip
														.replace(/(.*)?(%x\.?\d?)(.*)?/gi, '$1'+modelNS.valueToLabel(Math.roundDec(options.x,roundX))+'$3')
														.replace(/(.*)?(%y\.?\d?)(.*)?/gi, '$1'+modelNS.valueToLabel(Math.roundDec(options.y,roundY))+'$3');
			}

	    var left = options.left + this.vScale.outsetLeft,
	        top = options.top + 20,
					isAnimation = !$.isIE && !$.isEdge;

	    return $('<div class="graph-point"/>').prependTo(this.$el).css({
	      left: left,
	      top: top
	    }).attr({
				title: ""
			}).tooltip({
				content:options.tooltip,
				position: { my: "left+25 top+25", at: "right center" },
				show: isAnimation,
				hide: isAnimation
			});
	  },

		refresh: function() {
			this.$el.html('');
			this.$el.remove();
			this.render();
		}
	});

})();
