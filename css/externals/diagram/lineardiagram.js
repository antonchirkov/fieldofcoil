(function() {

	iDiagramNS.ToolPointModel = Backbone.Model.extend({
		initialize: function(options) {
			this.set({
				parent: options.parent,
				left: options.left,
				top: options.top,
				value: options.value,
				connectedTo: null,
				view: null,
				onClick: options.onClick
			});
		}
	});

	iDiagramNS.ToolPointCollection = Backbone.Collection.extend({
		model: iDiagramNS.ToolPointModel
	});

	iDiagramNS.ToolPoint = Backbone.View.extend({
		className: 'tool-point',
		events: {
			'click': 'onClick'
		},
		initialize: function(options) {
			this.model = options.model;
			this.parent = this.model.get('parent');
			this.left = this.model.get('left');
			this.top = this.model.get('top');
			this.value = this.model.get('value');
			this.onClickCallback = this.model.get('onClick');
		},
		render: function() {
			this.model.set({view: this});
			this.$el.css({
				left: (this.left - 6) + 'px',
				top: (this.top - 6) + 'px'
			});
			this.parent.append(this.$el);
			return this;
		},
		onClick: function(e) {
			if (this.onClickCallback) {
				this.onClickCallback();
			}
			this.removePoint();
			return false;
		},
		removePoint: function() {
			this.$el.remove();
			this.remove();
		},
		getValue: function() {
			return this.value;
		},
		getConnectedTo: function() {
			return this.connectedTo;
		}
	});

	iDiagramNS.LinearDiagram = Backbone.View.extend({
		className: 'linear-diagram',
		events: {
			'click .canvas-events': 'onClick',
			'mousemove .canvas-events': 'onMouseMove'
		},
		initialize: function(options) {
			this.options = options;
			this.points = new iDiagramNS.ToolPointCollection();
		},
		render: function() {
			this.options.parent.append(this.$el);
			this.layer = new modelNS.SingleLayout({
				cls: 'diagram-wrp',
				border: false,
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

			this.vScale = new iDiagramNS.VerticalScale({
				parent: this.layer.$el,
				label: this.options.labelY,
				scaleCentered: false,
                min: this.options.minY, // #11318 Передаем значение minY вместо min
                max: this.options.maxY, // #11318 Передаем значение maxY вместо max
                step: this.options.stepY, // #11318 Передаем значение stepY вместо step
				maxValue: this.options.maxValue,
				grid: this.options.grid,
        marks: this.options.marksY, // #11318 В marks запишем marksY, чтобы манипулировать осью Y
				// axisData: this.options.axisXValues, // необходимо для setBottomOutset (связано с #13377)
			});
			this.vScale.render();

			this.hScale = new iDiagramNS.HorizontalScale({
				parent: this.layer.$el,
				label: this.options.labelX,
				axisData: this.options.axisXValues,
				proportionally : true,
				scaleCentered: true,
				marks: this.options.marks, // #11318 Раньше было this.options.marksY почему-то
				grid: this.options.gridY,
				leftOutset: this.vScale.leftOutset,
				settings: this.options.settings,

				// #10084
				min: this.options.min,
				max: this.options.max,
			});
			this.hScale.render();

			// отступ снизу учитывая высоту нижних подписей
			this.vScale.setBottomOutset(this.hScale.bottomOutset);

			var canvasWidth = this.layer.$el.width() - 70,
					canvasHeight = this.layer.$el.height() - this.hScale.bottomOutset - 20; // 20 - отступ сверху
			this.canvas = new modelNS.Canvas({
				parent: this.layer.$el,
				width: canvasWidth,
				height: canvasHeight
			});
			this.layer.$el.append(this.canvas.render().el);
			this.canvas.$el.css({
				top: '20px',
				left: this.vScale.leftOutset
			});

			$("<div class='canvas-events'>").css({
				top: '20px',
				left: this.vScale.leftOutset,
				width: canvasWidth,
				height: canvasHeight
			}).appendTo(this.layer.$el)

			var axisValues = this.hScale.getAxisValues(),
				pixelsPerMark = this.hScale.getPixelsPerMark(),
				pixelsPerStep = this.vScale.getPixelsPerStep(),
				ctx = this.canvas.getContext();

			// this.vScale.getAxisValues().each(function(v) {
			// 	var valueObj = v.get('value');
			// 	if (valueObj.get('value') == 0) {
			// 		zeroTop = v.get('top');
			// 	}
			// });
			// console.log(zeroTop, this.vScale.zeroTop());

			this.pixelsPerMark = pixelsPerMark;
			this.zeroTop = this.vScale.zeroTop();
			this.pixelsPerStep = pixelsPerStep;

			this.options.categories.each(function(c, i) {
				var color = c.get('color');
				ctx.beginPath();
				ctx.lineWidth = 3;
				var points = [];

				c.get('points').each(function(p, k) {
					var axis = p.get('axisValue').get('value'),
							value = p.get('value'),
							x, y;

					if (axis && (value || value === 0)) {
						// Дробные значения определяются как NaN (#12977)
						x = modelNS.parseFloat( axis );
						y = modelNS.parseFloat( value );
						var leftOutset = self.calcLeftOutset(x, k);
                        points.push({
                            value: y,
                            left: leftOutset,
                            top: self.zeroTop - pixelsPerStep * self.addMinValueFromScale(y),
                            link: p.get('link'),
                        });
					}
				});

				// Михаил: Всегда точки соединяем по порядку увеличения абсциссы
				points.sort(function (a, b) {return a.left > b.left ? 1 : -1});

				for (var k=0; k<points.length; k++) {
					var point = points[k],
							axisValue = point.value,
							left = point.left,
							top = point.top,
							popup;

							// point not at scale
							if (left === null) return;

							// console.log(stepK, step, axisValue, self.hScale.min, (parseInt(axisValue) - self.hScale.min) / step)

							if (self.options.popups) {
								popup = self.options.popups.where({id: point.link});
								if (popup.length != 0) {
									popup = popup[0];
								} else {
									popup = null;
								}
							}

							if (axisValue !== "") { // #12361 Точку добавлять, только при непустом значении
                                var point = new iDiagramNS.PointView({
                                    left: (left + self.vScale.leftOutset - 5) + 'px',
                                    top: (top + 14) + 'px', // 14 ??
                                    color: color,
                                    popup: popup
                                });
                                self.layer.$el.append(point.render().el);
							}

							if (self.options.pointlines) {
								ctx.strokeStyle = color;
								if (k == 0) {
									ctx.moveTo(left, top);
								} else {
										ctx.lineTo(left, top);
								}
								ctx.stroke();
							}

							// ctx.beginPath();
							// ctx.rect(left-4, top-4, 8, 8);
							// ctx.fillStyle = color;
							// ctx.fill();
							// ctx.moveTo(left, top);
				}
				ctx.closePath();
			});
		},

        /**
		 * Данное значение нужно прибавить к значению по оси Y при расчёте отступа сверху у точки на случай, если на шкале
		 * есть отрицательные значения. Это нужно для компенсации отступа от начала оси, т.к. предполагается,
		 * что отсчёт идёт с нуля. Если на оси нет отрицательных значений, то минимальное значение будет ноль.
         * Если на оси есть отрицательные значения, то берём наименьшее и прибавляем его абсолютное значение
         * к текущему значению по оси Y, чтобы отступ расчитался правильно.
         * @param {number} currentValue Значение по оси Y
         * @returns {number}
         */
		addMinValueFromScale: function(currentValue) {
            return currentValue + Math.abs(this.vScale.getMinValueFromAxisData());
		},
		calcScaleX : function (k, axisValue, pixelsPerMark)
		{
			var step = this.hScale.step,
					settings = this.options.settings;

			if (step) {
				var axisK = modelNS.parseFloat(axisValue), // / step,
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
		onClick: function(e) {
			if (!this.options.trends) return;
			this.createPoint(e.offsetX + this.vScale.leftOutset, e.offsetY + 20);
		},
		onMouseMove: function (e) {
			this.drawLine(e.offsetX + this.vScale.leftOutset, e.offsetY + 20);
		},

		htmlToLatex: function (html) {
			return html.replace(/<sub>(.*?)<\/sub>/gi, "_$1") // <sub/>
						.replace(/<\/?.*?>/gi, ""); // other tags = ""
		},

		drawLine: function (x, y) {
			if (this.points.length != 1) {
				return;
			}

			var self = this,
				pModel = new iDiagramNS.ToolPointModel({
				left: x,
				top: y,
				parent: this.$el,
				onClick: function() {
					var connectedTo = this.model.get('connectedTo');
					if (connectedTo) {
						connectedTo.get('view').removePoint();
						self.points.remove(connectedTo);
						this.model.get('line').remove();
					}
					self.points.remove(this.model);
				}
			});

			var connectedTo = this.points.at(this.points.length - 1),
					x1 = pModel.get('left'),
					y1 = pModel.get('top'),
					x2 = connectedTo.get('left'),
					y2 = connectedTo.get('top');

			this.line = modelNS.drawLine(x1, y1, x2, y2, this.line);

			// var angle = Math.atan2(y1 - y2, x1 - x2) * 180 / Math.PI;
			var xVal = this.htmlToLatex(this.options.labelX),
					yVal = this.htmlToLatex(this.options.labelY),
					left = x1 + (x2-x1)/2,
					top = y1 + (y2-y1)/2,
					deltaY = (this.getValByTop(y2)-this.getValByTop(y1)),
					deltaX = (this.getValByLeft(x2)-this.getValByLeft(x1)),
					num = modelNS.valueToLabel(Math.round00( deltaY / this.valToScale(deltaX) ));

					// long minus
					// num = num.toString().replace("-", "<span class='verdana'>–</span>");	// "&mdash;" &ndash;

			if (!this.$angle) {
				this.$angle = $('<div class="line-angle"></div>')
						.appendTo(this.$el)
						.html('$${y \\over x} = $$ <b>'+num+'</b> $$ { '+yVal+' \\over '+xVal+'}$$')
						// .html('<i>y/x</i>' + Math.round(Math.atan2(y1 - y2, x1 - x2) * 180 / Math.PI) + '&deg;');
						.css({
							left : left,
							top : top,
							opacity : 0
						});
						MathJax.Hub.Queue(["Typeset",MathJax.Hub], function () {
							self.MathJaxProcess = 2;
							self.$angle.css('opacity', 1);
						});
				this.MathJaxProcess = 1;
			} else {
				this.$angle.css({left:left, top:top}).find('b').html(num);
			}

			// angle draw
			if (!this.angleCanvas) {
				var canvasWidth = this.layer.$el.width() - 70,
						canvasHeight = this.layer.$el.height() - 62;
				this.angleCanvas = new modelNS.Canvas({
					parent: this.layer.$el,
					width: canvasWidth,
					height: canvasHeight
				});
				this.layer.$el.append(this.angleCanvas.render().el);
				this.angleCanvas.$el.css({
					top: '20px',
					left: this.vScale.leftOutset
				});
			}

			this.angleCanvas.clear();

			var ctx = this.angleCanvas.getContext();
			ctx.beginPath();
			ctx.lineWidth = 2;
			ctx.moveTo(left - 34, top - 19);

			// label not at line
			var scrollProtect = this.$el.width() - 20 < this.$angle.width() + left;

			if (y1 > y2 && x1 > x2 || y1 < y2 && x1 < x2) {
				this.$angle.css({
					'marginLeft': -this.$angle.width()-10,
					'marginTop': 0
				});

				// ctx.lineTo(left - 64, top - 19);
				// if (y1 > y2) {
				// 	ctx.arc(left - 34, top - 19, 15, Math.PI, Math.atan2(y2-y1,x2-x1), false);
				// } else {
				// 	ctx.arc(left - 34, top - 19, 15, Math.PI, Math.atan2(y1-y2,x1-x2), false);
				// }
			} else {
				this.$angle.css({
					'marginLeft' : scrollProtect ? -this.$angle.width()-10 : 10,
					'marginTop' : scrollProtect ? (-this.$angle.height()-20) : 0
				});
			}

			ctx.lineTo(left, top - 19);
			if (y1 > y2 || y1 == y2 && x1 < x2) {
				ctx.arc(left - 34, top - 19, 15, 0, Math.atan2(y2-y1,x2-x1), true);
			} else {
				ctx.arc(left - 34, top - 19, 15, 0, Math.atan2(y1-y2,x1-x2), true);
			}

			ctx.stroke();

			// top = zeroTop - pixelsPerStep * p.get('value')

			this.$el.append(this.line);

			// var pModel = new iDiagramNS.ToolPointModel({
			// 	left: x,
			// 	top: y,
			// 	parent: this.$el,
			// 	onClick: function() {
			// 		var connectedTo = this.model.get('connectedTo');
			// 		if (connectedTo) {
			// 			connectedTo.get('view').removePoint();
			// 			self.points.remove(connectedTo);
			// 			this.model.get('line').remove();
			// 		}
			// 		self.points.remove(this.model);
			// 	}
			// });
			//
			// pModel.set({connectedTo: connectedTo, line: line});
			// connectedTo.set({connectedTo: pModel, line: line});
		},

		getValByLeft: function (left) {
			return this.valToScale (Math.round00( (left-30-6)/this.hScale.pixelsPerStep ));
		},

		valToScale: function (val) {
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

		createPoint: function(x, y) {
			if (this.points.length == 2) {
				this.removePoint(this.points.at(0));
				this.removePoint(this.points.at(0));
				this.$angle.remove();
				this.angleCanvas.clear();
				this.$angle = null;
			}
			var self = this;
			var pModel = new iDiagramNS.ToolPointModel({
				left: x,
				top: y,
				parent: this.$el,
				onClick: function() {
					self.removePoint(this.model);
					if (!self.points.length) self.$angle.remove();
				}
			});
			var point = new iDiagramNS.ToolPoint({model: pModel});
			point.render();
			pModel.point = point;
			// if (this.points.length != 0) {
			//
			// }
			this.points.add(pModel);
		},

		removePoint : function (model) {
			var connectedTo = model.get('connectedTo');
			// if (connectedTo) {
				// connectedTo.get('view').removePoint();
				// this.points.remove(connectedTo);
				// this.model.get('line').remove();
			// }
			model.point.removePoint();
			this.points.remove(model);
			if (!this.points.length) this.line.remove();
		},

		refresh: function() {
			this.$el.html('');
			this.$el.remove();
			this.render();
		},

		// #11386 Перевод римских цифр в арабские
		romanToArabConvert: function (roman) {
            var digits = Object.keys(iDiagramNS.ROMAN_NUMBERS);

            roman = roman.toUpperCase();
            var res = 0;

            for (var q=0; q<roman.length; ++q) {
                if (digits.indexOf(roman[q]) < digits.indexOf(roman[q+1])) {
                    res -= iDiagramNS.ROMAN_NUMBERS[roman[q]];
                } else {
                    res += iDiagramNS.ROMAN_NUMBERS[roman[q]];
                }
            }

            return res;
        },

        /**
         * Функция расчёта координаты по оси X для точек.
         * Если на оси X лежат нечисловые значения, то их нужно распределять на равных промежутках между
         * друг другом.
         * Для оси Y эти вычисления не нужны, т.к. там должны указываться всегда числовые значения. Если
         * будут указаны нечисловые значения, то в value запишется пустая строка и эта точка вообще не
         * будет добавлена.
         * @param {number} xValue - Значение точки по оси X
         * @param {number} pointIndex - Порядковый номер точки
         * @returns {number}
         */
        calcLeftOutset: function(xValue, pointIndex) {
            var leftOutset = isNaN(xValue)
                ? this.pixelsPerMark * (pointIndex + (this.hScale.scaleCentered ? 0.5 : 0))
                : this.hScale.getScaledLeft(xValue);
            return leftOutset;
        }
	});

})();
