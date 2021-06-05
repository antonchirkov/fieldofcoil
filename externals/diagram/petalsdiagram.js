(function() {
	iDiagramNS.PetalsDiagram = Backbone.View.extend({
		className: 'petals-diagram',
		initialize: function(options) {
			this.options = options;
		},
		render: function() {
			this.options.parent.append(this.$el);
			this.layer = new modelNS.SingleLayout({
				cls: 'diagram-wrp'
			});
			this.$el.append(this.layer.render().el);
			if (this.options.cls) {
				this.$el.addClass(this.options.cls);
			}
			this.canvas = new modelNS.Canvas({
				parent: this.layer.$el,
				width: this.layer.$el.width(),
				height: this.layer.$el.height()
			});
			this.layer.$el.append(this.canvas.render().el);
			this.renderCanvas();
			return this;
		},
		renderCanvas: function() {
			var _this = this,
			    centerX = this.canvas.$el.width() / 2,
					centerY = this.canvas.$el.height() / 2,
					canvasWidth = this.canvas.$el.width(),
				lineWidth = this.canvas.$el.height() <= this.canvas.$el.width() ?
						    ((this.canvas.$el.height() * 0.9) / 2) :
						    ((canvasWidth * 0.9) / 2),
			    angle = 360 / this.options.categories.length,
				pixelsPerValue = lineWidth / (this.options.max - this.options.min),
				pixelsPerMark = lineWidth / Math.round((this.options.max - this.options.min) / this.options.step);
				ctx = this.canvas.getContext();

			var dx, endX, endY, currentWidth, color, left, top, item, value;
			for (var i = 0; i < this.options.categories.length; i++) {
				var category = this.options.categories.at(i),
						currentAngle = angle * i - 90,
						endX = centerX + lineWidth * Math.cos(Math.PI * currentAngle / 180.0),
						endY = centerY + lineWidth * Math.sin(Math.PI * currentAngle / 180.0),
						color = category.get('color'),
						title = category.get('title');

				ctx.beginPath();
				ctx.font = "16px TrebuchetMS";
				ctx.strokeStyle= "#ababab"; //color; // "#ababab";
				ctx.moveTo(centerX, centerY);
				ctx.lineTo(endX, endY);
				ctx.stroke();

				// отрисовка подписи
				var labelCos = Math.round(Math.cos(Math.PI * currentAngle / 180.0)*10);
						isInLeft = labelCos < 0,
						isInRight = labelCos > 0,
						isInCenter = labelCos == 0,
						left = centerX + lineWidth * Math.cos(Math.PI * currentAngle / 180.0),
						top = centerY + lineWidth * Math.sin(Math.PI * currentAngle / 180.0) - 5,
						maxWidth = isInLeft && left || isInRight && canvasWidth - left || isInCenter && canvasWidth,
						$label = $('<div class="petals-label">')
							.css({maxWidth:maxWidth})
							.appendTo(this.$el)
							.html(title);

				if (isInLeft) {
					left -= $label.width();
				}

				if (isInCenter) {
					left -= $label.width()/2;
				}

				if (i == 0) top -= 18; // первый лебел не должен залазить на цифру

				$label.css({ left: left, top: top, maxWidth: maxWidth});

				// ctx.beginPath();
				// ctx.strokeStyle="#000000";
				// dx = Math.cos(Math.PI * currentAngle / 180.0) >= 0 ? 10 : -(this.options.axisXValues.at(i).get('value').length * 10);
				// ctx.fillText(this.options.axisXValues.at(i).get('value'),
				// 		     centerX + lineWidth * Math.cos(Math.PI * currentAngle / 180.0) + dx,
				// 		     centerY + lineWidth * Math.sin(Math.PI * currentAngle / 180.0));
				// ctx.stroke();

				// отрисовка цифр
				for (var k = Math.round(this.options.min / this.options.step); k <= Math.round(this.options.max / this.options.step); k++) {
					ctx.beginPath();
					ctx.strokeStyle = "#ababab"; //"#ababab";
					currentWidth = pixelsPerMark * (k + Math.abs(Math.round(this.options.min / this.options.step)));
					startX =  centerX + currentWidth * Math.cos(Math.PI * currentAngle / 180.0);
					startY =  centerY + currentWidth * Math.sin(Math.PI * currentAngle / 180.0);
					endX = centerX + currentWidth * Math.cos(Math.PI * (currentAngle + angle) / 180.0);
					endY = centerY + currentWidth * Math.sin(Math.PI * (currentAngle + angle) / 180.0);
					ctx.moveTo(startX, startY);
					ctx.lineTo(endX, endY);
					ctx.stroke();
					if (i == 0) {
						ctx.beginPath();
						ctx.font = "12px TrebuchetMS";
						ctx.strokeStyle="#ababab";
						//ctx.fillText(k * this.options.step, startX - 16, startY + 8); // #12362
                        ctx.fillText(Math.round00(k * this.options.step), startX - 16, startY + 8); // #12362
						ctx.stroke();
					}
				}
			}

			// отрисовка графиков
			for (var i = 0; i < this.options.axisXValues.length; i++) {
				var color = this.options.axisXValues.length == 1 ? "#e0182a" : iDiagramNS.DEFAULT_COLORS[i]; // iDiagramNS.DEFAULT_COLORS[i]; - Денис сказал для одной понасыщенней //c.get('color');
				ctx.beginPath();
				ctx.lineWidth = 2;
				ctx.strokeStyle = color;
				// var this.options.categories.at(i)

				var k = i;

				for (var categoryIndex = 0; categoryIndex <= _this.options.categories.length; categoryIndex++) {
					var category = categoryIndex == _this.options.categories.length ?
							_this.options.categories.at(0)	// замыкание линий
							: _this.options.categories.at(categoryIndex),
							points = category.get('points');
					if (points.length == 0) {
						return;
					}

						var value = points.at(k).get('value');
						if (value === "") continue;

						value = (parseFloat(value) + Math.abs(_this.options.min)) * pixelsPerValue;
						var p = k == points.length ? points.at(0) : points.at(k);
						currentAngle = k == points.length ? -90 : (angle * categoryIndex - 90);
						left = centerX + value * Math.cos(Math.PI * currentAngle / 180.0);
						top = centerY + value * Math.sin(Math.PI * currentAngle / 180.0);
						var popup;
						if (_this.options.popups) {
							popup = _this.options.popups.where({id: p.get('link')});
							if (popup.length != 0) {
								popup = popup[0];
							} else {
								popup = null;
							}
						}

						var point = new iDiagramNS.PointView({
							left: (left - 6) + 'px',
							top: (top - 6) + 'px',
							color: color,
							popup: popup
						});
						_this.layer.$el.append(point.render().el);

						if (categoryIndex == 0) {
							// ctx.moveTo(left, top);
							ctx.lineTo(left, top);
						} else {
							ctx.lineTo(left, top);
						}
						ctx.stroke();

				};

				ctx.closePath();
			};
		},
		refresh: function() {
			this.$el.html('');
			this.$el.remove();
			this.render();
		}
	});
})();
