(function() {
	iDiagramNS.CircularDiagram = Backbone.View.extend({
		className: 'petals-diagram circular-diagram',
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

			var self = this,
					radius = this.options.radius || (Math.min(this.canvas.width/2,this.canvas.height/2) - 20);	// 20 outset from borders for lables;

			var axisData = this.options.axisXValues,
					colors = [],
					labels = {},
					myVinyls = {},
					canvas = this.canvas;
			this.options.categories.each(function(c, i) {
				var points = c.get('points'),
						color = c.get('color');

				colors.push(color);

				labels[color] = c.get('title');
				myVinyls[color] = 0;

				for (var k=0; k<points.length; k++) {
					myVinyls[color] += points.at(k).get('value').toString().replace(",",".")*1;
				}
			});

			// пробуем автоматически подобрать радиус, что бы метки по бокам поместились
			// var maxWidth = 0;
			// for (categ in labels){
			// 	var labelText = labels[categ] + '<br>' + "%% %",
			// 			$label = $('<div class="callout"/>')
			// 				.html(labelText)
			// 				.appendTo(self.$el);
			// 	var width = $label.width();
			// 	if (width > maxWidth) maxWidth = width;
			// 	$label.remove();
			// }
			// if (maxWidth*2 > (this.canvas.width - radius)) radius = this.canvas.width - maxWidth*2;	// ????
			// если метки слишком большие, то радиус отрицательный TODO: продумать логику дальше
			// if (radius < 0) radius = 50;	// минимальный радиус

			var Piechart = function(options){
			    this.options = options;
			    this.canvas = options.canvas;
			    this.ctx = this.canvas.getContext("2d");
			    this.colors = options.colors;
					this.start_angle = 0;
					this.total_value = 0;

					this.splitLabelsInSides = function (ang) {
						var start_angle = ang,
								labelLeftText = '',
								labelRightText = '',
								labelRightYs = [],
								labelLeftYs = [];

						for (categ in this.options.data){
							val = this.options.data[categ];

							if (!val) continue;

							slice_angle = 2 * Math.PI * val / this.total_value;
							var pieRadius = radius + 5; // 5 - outset from circle
							var labelX = this.canvas.width/2 + (pieRadius) * Math.cos(start_angle + slice_angle/2);
							var labelY = this.canvas.height/2 + (pieRadius) * Math.sin(start_angle + slice_angle/2);

							var labelText = labels[categ],
									labelProc = Math.roundDec(100 * val / this.total_value, self.options.round).toString().replace(".",",") + " %";

							// -============ метки с выносками ============- //
							if (labelX < this.canvas.width/2 - radius/2) {
								labelLeftYs.push({
									pos:{left:labelX, top:labelY},
									text:labelText,
									proc:labelProc,
									angle:start_angle + slice_angle/2,
								});
								labelLeftText += labelText;
							} else {
								labelRightYs.push({
									pos:{left:labelX, top:labelY},
									text:labelText,
									proc:labelProc,
									angle:start_angle + slice_angle/2,
								});
								labelRightText += labelText;
							}

							// -============ метки с выносками ============- //
							start_angle += slice_angle;
						}

						return {
							labelRightYs: labelRightYs,
							labelLeftYs: labelLeftYs,
							leftText: labelRightText,
							rightText: labelLeftText,
						}
					};

			    this.draw = function(){
			        var color_index = 0;
			        for (var categ in this.options.data){
			            var val = this.options.data[categ];
			            this.total_value += val;
			        }

							// ищем наиболее удобный стартовый угол для диаграммы
							var canvasWidth = this.canvas.width,
									canvasHeight = this.canvas.height,
									kLeftRightText = Infinity,
									splitLabelResult = null;

							for (var ang=0; ang<270; ang+=10) {
									var result = this.splitLabelsInSides(ang),
											k = 1 - Math.min(result.leftText.length, result.rightText.length) / Math.max(result.leftText.length, result.rightText.length);
									if (k < kLeftRightText) {
										kLeftRightText = k;
										splitLabelResult = result;
										this.start_angle = ang;
									}
							}
							// this.start_angle = 0;
							// splitLabelResult = this.splitLabelsInSides(0);


							if (!splitLabelResult) return;

							var labelLeftYs = splitLabelResult.labelLeftYs,
									labelRightYs = splitLabelResult.labelRightYs;


							// -============ Рендер меток с выносками ============- //

							var areaWidth = self.$el.width(),
									areaRight = areaWidth,
									freeAreaWidth = areaRight,
									areaHeight = self.$el.height(),
									areaBot = areaHeight,
									freeAreaHeight = areaHeight,
									circleOutset = {
										left: {top:0, bot:0},
										right: {top:0, bot:0},
									},
									labelsOutset = {
										left: {top:10, bot:10},
										right: {top:10, bot:10},
									};
									// freeAreaRightHeight = freeAreaLeftHeight;

							// расположить метку
							function placeLabel (label, options) {
								if (!options) options = {};

								var top = 0, // Math.round(Math.max(top, label.pos.top)),
										width = areaWidth/2 - radius; // согласно радиусу

								var $label = $('<div class="callout"/>')
										.append($('<div class="callout-text"/>').html(label.text))
										.append($('<div class="callout-proc"/>').html(label.proc))
										.css({
											width: width,
										})
										.appendTo(self.$el);

									if (options.side == 'right') {
										$label.addClass('rightside');
										$label.css('right', 10);
									} else {
										$label.css('left', 10);
									}

									if (options.at == 'top') {
										$label.css({
											top: labelsOutset[options.side][options.at],
										});
									} else {
										$label.css({
											bottom: labelsOutset[options.side][options.at],
										});
									}

									// метки могут распологаются сверху на половину ширины модели
									if (freeAreaWidth < freeAreaHeight	// если много пространства по высоте
										|| (circleOutset[options.side][options.at] + $label.height()) < (areaHeight - freeAreaHeight)/2 // если помещается в оставшееся свободное пространство
										|| !options.index // если первая метка в своем углу
									) {
										width = areaWidth/2;
										$label.css('width', width);
										circleOutset[options.side][options.at] += $label.height();

										freeAreaHeight = areaHeight - Math.max(circleOutset.left.top*2, circleOutset.left.bot*2, circleOutset.right.top*2, circleOutset.right.bot*2);
									} else {
										// если не получилось уместить в доступную ширину, то уменьшаем радиус? ориентироваться насколько близко к середине по высоте
										// TODO:
										// var realWidth = $label.find('.callout-text').width();
										// if (realWidth > width) {}
									}

									var labelHeight = $label.height() + 5; // 5 outset to bottom

									labelsOutset[options.side][options.at] += labelHeight;
									label.bottomLineAt = labelsOutset[options.side][options.at];
									if (options.at == "top") labelsOutset[options.side][options.at] += 10;

									// modelNS.drawLine(0, top + labelHeight, label.pos.left, top + labelHeight)
									// 	.addClass('callout-line')
									// 	.appendTo(self.$el);
									// top = top + labelHeight + 20;	// 10 min top outset beetween callout's

									label.options = options;
									label.$label = $label;
							}

							function drawLabels (labels, options) {
								for (var i=0; i<labels.length; i++) {
									var label = labels[i];
									if (label.$label) continue;
									placeLabel (label, {
										side: options.side,
										at: 'top',
										index: i,
									});

									//поочередно распологаем, сверху и снизу по выноске
									for (var b=labels.length-1; b>0; b--) {
										var label = labels[b];
										if (label.$label) continue;
										placeLabel (label, {
											side: options.side,
											at: 'bot',
											index: b
										});
										break;
									}
								}
							}

							labelLeftYs.sort(function (a, b) {return a.pos.top > b.pos.top ? 1 : -1});
							labelRightYs.sort(function (a, b) {return a.pos.top > b.pos.top ? 1 : -1});

							drawLabels(labelLeftYs, {side:"left"});
							drawLabels(labelRightYs, {side:'right'});

							// пробуем автоматически определить радиус
							// radius = freeAreaHeight/2;

							// отрисовка линии
							function drawLine (x1, y1, x2, y2)
							{
								return modelNS.drawLine(x1, y1, x2, y2)
									.addClass('callout-line')
									.appendTo(self.$el);
							}

							// отрисовка 2х отрезков
							function drawCalloutLine (x1, y1, x2, y2, x3, y3) {
								drawLine(x1, y1, x2, y2);
								drawLine(x2, y2, x3, y3);
							}

							// отрисовка линий
							function drawLabelLine (label) {
								var x1 = canvasWidth/2 + (radius*0.8) * Math.cos(label.angle),
										y1 = canvasHeight/2 + (radius*0.8) * Math.sin(label.angle),
										options = label.options,
										$label = label.$label,
										$proc = $label.find('.callout-proc'),
										textWidth = $label.find('.callout-text').width(),
										procWidth = $proc.width(),
										procHeight = $proc.height(),
										top = $label.css("top").replace("px", '')*1,
										labelHeight = $label.height() + 5; // 5 outset to bottom;

								if (options.side == "left" && options.at == "top") {
									var x2 = textWidth,
											y2 = top + labelHeight - procHeight + 10,
											x3 = procWidth + 15,
											y3 = y2;

										if (x2 > x1) x2 = x1-15;
										if (x3 > x2) x3 = x2;

										drawCalloutLine(x1, y1, x2, y2, x3, y3);
								}

								// Отрисовка линий выносок
								if (options.side == "right" && options.at == "top") {
									var x2 = areaWidth - textWidth,
											y2 = label.bottomLineAt - 15,
											x3 = areaRight - procWidth - 15,
											y3 = y2;

										if (x2 < x1) x2 = x1+15;
										if (x3 < x2) x3 = x2;

										drawCalloutLine(x1, y1, x2, y2, x3, y3);
								}

								if (options.side == "right" && options.at == "bot") {
									// var x2 = areaWidth - textWidth/2,
									// 		y2 = areaHeight - $label.css('bottom').replace('px', '')*1 + 5,
									// 		x3 = areaRight,
									// 		y3 = y2;
									//
									// if (y1 < y2 - labelHeight/2-10) { // линия в начало надписи
										y2 = areaHeight - $label.css('bottom').replace('px', '')*1 + 5 - procHeight + 10;
										y3 = y2;
										x2 = areaWidth - textWidth;
										x3 = areaWidth - procWidth - 15;
										if (x3 < x2) x3 = x2;
										drawCalloutLine(x1, y1, x2, y2, x3, y3);
									// } else {
									// 	drawCalloutLine(x1, y1, x2, y2, x3, y3);
									// }
								}

								if (options.side == "left" && options.at == "bot") {
									// var x2 = textWidth/2,
									var y2 = areaHeight - $label.css('bottom').replace('px', '')*1 + 5;
											// x3 = 0,
											// y3 = y2;

									// if (y1 < y2 - labelHeight/2-10) { // линия в начало надписи
										y2 -= procHeight - 10;
										y3 = y2;
										x2 = textWidth;
										x3 = procWidth + 10;
										if (x3 > x2) x3 = x2;
										drawCalloutLine(x1, y1, x2, y2, x3, y3);
									// } else {
									// 	drawCalloutLine(x1, y1, x2, y2, x3, y3);
									// }
								}
							}

							// отрисовка линий
							for (var i in labelLeftYs) {
								drawLabelLine (labelLeftYs[i]);
							}
							for (var i in labelRightYs) {
								drawLabelLine (labelRightYs[i]);
							}

							// отрисовываем дольки
							var start_angle = this.start_angle;
			        for (categ in this.options.data){
			            val = this.options.data[categ];
			            var slice_angle = 2 * Math.PI * val / this.total_value;

			            drawPieSlice(
			                this.ctx,
			                this.canvas.width/2,
			                this.canvas.height/2,
			                radius,
			                start_angle,
			                start_angle+slice_angle,
			                this.colors[color_index%this.colors.length]
			            );

			            start_angle += slice_angle;
			            color_index++;
			        }

			    }
			}

			function drawPieSlice(ctx,centerX, centerY, radius, startAngle, endAngle, color ){
			    ctx.fillStyle = color;
			    ctx.beginPath();
			    ctx.moveTo(centerX,centerY);
			    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
			    ctx.closePath();
			    ctx.fill();
			}

			var myPiechart = new Piechart(
			    {
			        canvas:canvas,
			        data:myVinyls,
							labels:labels,
			        colors:colors
			    }
			);
			myPiechart.draw();
		},
		refresh: function() {
			this.$el.html('');
			this.$el.remove();
			this.render();
		}
	});
})();
