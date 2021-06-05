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
				petalsRadius = this.options.petalsRadius || Math.min(this.canvas.$el.height(), this.canvas.$el.width()) / 2 - 30,
			    angle = 360 / this.options.axisXValues.length,
				pixelsPerValue = petalsRadius / (this.options.max - this.options.min),
				pixelsPerMark = petalsRadius / Math.round((this.options.max - this.options.min) / this.options.step),
				ctx = this.canvas.getContext();
			this.renderAxes({angle, centerX, centerY, ctx, canvasWidth, petalsRadius, pixelsPerMark});
			this.renderCharts({angle, centerX, centerY, ctx, canvasWidth, petalsRadius, pixelsPerValue});
		},
        /**
		 * Функция построения осей диаграммы и подписей.
         * @param {number} angle - Угол между осями
         * @param {number} centerX - Координата центра элемента canvas по ширине
         * @param {number} centerY - Координата центра элемента canvas по высоте
         * @param {Object} ctx - Объект, представляющий canvas
         * @param {number} canvasWidth - Ширина элемента canvas
         * @param {number} petalsRadius - Радиус диаграммы
         * @param {number} pixelsPerMark - Расстояние между метками на осях
         */
		renderAxes: function({angle, centerX, centerY, ctx, canvasWidth, petalsRadius, pixelsPerMark}) {
            for (var i = 0; i < this.options.axisXValues.length; i++) {
                var category = this.options.categories.at(0),
                    currentAngle = angle * i - 90,
                    endX = centerX + petalsRadius * Math.cos(Math.PI * currentAngle / 180.0),
                    endY = centerY + petalsRadius * Math.sin(Math.PI * currentAngle / 180.0),
                    title = this.options.axisXValues.at(i).get('value'),
                    labelStyles = category.get('petalsStyle');

                ctx.beginPath();
                ctx.font = "16px TrebuchetMS";
                ctx.strokeStyle= "#ababab";
                ctx.moveTo(centerX, centerY);
                ctx.lineTo(endX, endY);
                ctx.stroke();

                // отрисовка подписи
                var labelCos = Math.round(Math.cos(Math.PI * currentAngle / 180.0)*10),
                    isInLeft = labelCos < 0,
                    isInRight = labelCos > 0,
                    isInCenter = labelCos == 0,
                    labelSin = Math.round(Math.sin(Math.PI * currentAngle / 180.0)*10),
                    isInTop = labelSin < 0,
                    isInBottom = labelSin > 0,
                    isInMiddle = labelSin == 0,
                    left = centerX + petalsRadius * Math.cos(Math.PI * currentAngle / 180.0),
                    top = centerY + petalsRadius * Math.sin(Math.PI * currentAngle / 180.0) - 5,
                    maxWidth = isInLeft && (left - 10)
                        || isInRight && (canvasWidth - left)
                        || isInCenter && canvasWidth,
                    $label = $('<div class="petals-label">')
                        .css({maxWidth:maxWidth})
                        .appendTo(this.$el)
                        .html(title);

                if (isInTop) top -= 5;
                if (isInBottom) top += 5;
                if (isInLeft) left -= $label.width() + 5;
                if (isInRight) {
                    left += 10;
                    $label.css('textAlign', 'left');
                }

                if (isInCenter) {
                    left -= $label.width()/2;
                }

                // первый лебел не должен залазить на цифру
                if (i == 0) top -= 18;

                $label.css({ left: left, top: top, maxWidth: maxWidth});
                $label.css(labelStyles)

                // отрисовка цифр
                for (var k = Math.round(this.options.min / this.options.step); k <= Math.round(this.options.max / this.options.step); k++) {
                    ctx.beginPath();
                    ctx.strokeStyle = "#ababab";
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
		},
        /**
		 * Функция рисования диаграмм.
         * @param {number} angle - Угол между осями
         * @param {number} centerX - Координата центра элемента canvas по ширине
         * @param {number} centerY - Координата центра элемента canvas по высоте
         * @param {Object} ctx - Объект, представляющий canvas
         * @param {number} canvasWidth - Ширина элемента canvas
         * @param {number} petalsRadius - Радиус диаграммы
         * @param {number} pixelsPerValue - Количество пикселей на единицу значения
         */
		renderCharts: function({angle, centerX, centerY, ctx, canvasWidth, petalsRadius, pixelsPerValue}) {
            for (var categoryIndex = 0; categoryIndex < this.options.categories.length; categoryIndex++) {
                var color = this.options.axisXValues.length == 1 ? "#e0182a" : iDiagramNS.DEFAULT_COLORS[categoryIndex]; // iDiagramNS.DEFAULT_COLORS[i]; - Денис сказал для одной понасыщенней //c.get('color');
                ctx.beginPath();
                ctx.lineWidth = 2;
                ctx.strokeStyle = color;
                var category = this.options.categories.at(categoryIndex);
                for (var i = 0, axisIndex = 0; i <= this.options.axisXValues.length; i++) {
                    axisIndex = i === this.options.axisXValues.length ? 0 : i;
                    var points = category.get('points');
                    if (points.length == 0) {
                        return;
                    }

                    var value = points.at(axisIndex).get('value');
                    if (value === "") continue;
                    value = (parseFloat(value) + Math.abs(this.options.min)) * pixelsPerValue;
                    var p = points.at(axisIndex);
                    var currentAngle = axisIndex == points.length ? -90 : (angle * axisIndex - 90);
                    var left = centerX + value * Math.cos(Math.PI * currentAngle / 180.0);
                    var top = centerY + value * Math.sin(Math.PI * currentAngle / 180.0);
                    var popup;
                    if (this.options.popups) {
                        popup = this.options.popups.where({id: p.get('link')});
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
                    this.layer.$el.append(point.render().el);

                    ctx.lineTo(left, top);
                    ctx.stroke();
                }
            }
		},
		refresh: function() {
			this.$el.html('');
			this.$el.remove();
			this.render();
		}
	});
})();
