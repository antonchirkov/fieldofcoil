(function() {

	iGraphNS.GraphicalFunction = Backbone.View.extend({
		className: 'graphical-function',
		initialize: function(options) {
			this.grid = options.grid;
			this.layer = this.grid.layer;
			this.axisX = this.grid.hScale;
			this.axisY = this.grid.vScale;
			this.fx = options.fx;
			this.color = options.color;
			this.tooltip = options.tooltip;
			this.lineWidth = options.grid.options.lineWidth;

			// важные для просчета отрисовки точки которые обязательно передадутся в функцию отрисовки графика не зависимо от размера шага
			this.fxPoints = options.fxPoints || [];
			// this.cacheTop = [];	// кэшированые Yки функции, для улучшенной работы findClosestPoint

			this.heightDiff = []; // массив перепада высот
		},
		render: function() {
			this.layer.$el.append(this.$el);
			this.renderCanvas();
			this.draw();
			return this;
		},
		renderCanvas: function() {
			var self = this;

			var canvasWidth = this.layer.$el.width() - 35 - this.axisY.outsetLeft,
					canvasHeight = this.layer.$el.height() - 62;

			this.canvas = new modelNS.Canvas({
				parent: this.$el,
				width: canvasWidth,
				height: canvasHeight
			});
			this.$el.append(this.canvas.render().el);
			this.canvas.$el.css({
				top: 20,
				left: this.axisY.outsetLeft
			});
			this.ctx = this.canvas.getContext();
		},

		draw: function (options) {
			if (!options) options = {};

			var ctx = this.canvas.getContext(),
					drawStep = 1/this.axisX.pixelsPerStep,	// step in X for 1px
					self = this,
					width = options.width || this.lineWidth,
					color = options.color || this.color;

			ctx.beginPath();
			ctx.lineWidth = width;
			ctx.strokeStyle = color;

			var fxPoints = this.fxPoints.slice(0);
			fxPoints.sort();

			for (var x=this.axisX.min; x<this.axisX.max; x+=drawStep) {
				if (fxPoints.length && x>fxPoints[0]) {
					self.drawX(ctx, fxPoints[0]);
					fxPoints.shift();
				}
				self.drawX(ctx, x);
			}

			this.trigger("draw", this.drawnToX, this.drawnToY);

			ctx.stroke();
			ctx.closePath();
			this.drawn();
		},

		animateDraw: function (options) {
				if (!options) options = {};

				var ctx = this.canvas.getContext(),
						drawStep = (1/this.axisX.pixelsPerStep), // step for 1 px
						self = this;

				this.clear();

				ctx.beginPath();
				ctx.lineWidth = this.lineWidth;
				ctx.strokeStyle = this.color;

				var start = null,
						prevTime = 0,
						duration = options.duration || 10000; // 10s default

				function step (time) {
					if (!start) start = time;

					if (self.paused) {
						start += time-prevTime;
					}

					var progress = (time - start) / duration;

					prevTime = time;	// for pause need

					if (self.paused) {
						self.drawingID = requestAnimationFrame(step);
						return;
					}

					self.canvas.clear();

					var x = self.axisX.min + progress*(self.axisX.max-self.axisX.min);

					if (!self.drawToX(ctx, x)) {
						ctx.stroke();
						ctx.closePath();
						self.drawn();
					} else {
						ctx.stroke();
						self.drawingID = requestAnimationFrame(step);
					}

					self.trigger("draw", self.drawnToX, self.drawnToY); // once per frame draw event
				}
				self.drawingID = requestAnimationFrame(step);
		},

		pause: function ()
		{
			this.paused = true;
		},

		unpause: function ()
		{
			this.paused = false;
		},

		drawToX: function (ctx, toX) {
			var drawStep = (1/this.axisX.pixelsPerStep);

			for (var x=this.drawnToX; x<toX; x+=drawStep) {
				if (!this.drawX(ctx, x)) {
					return false;
				}
			}
			return true;
		},

		drawX: function (ctx, x) {
			var yy = this.fx(x);

			// [y1,y2] отрезок по X
			if (typeof(yy) == "object") {
				return this.drawXY(ctx, x, yy[0]) && this.drawXY(ctx, x, yy[1]);
			} else {
				return this.drawXY(ctx, x, yy);
			}
		},

		drawXY: function (ctx, x, y) {
			var left = this.axisX.getLeftAt(x),
					top = this.axisY.getTopAt(y);

			// this.cachingTop(top, left);
			if (x>this.axisX.max) {
				x=this.axisX.max;
				y = this.fx(x);
			}
			if (y>this.axisY.max) {
				y=this.axisY.max;
			}

			var triggerDiff = 10;
			if (this.drawnTop - top > triggerDiff) {
				this.heightDiff.push([[this.drawnLeft, left],[this.drawnTop, top]]);
			}

			if (x == this.axisX.min) {
				ctx.moveTo(left, top);
			} else {
				ctx.lineTo(left, top);
			}

			this.drawnToX = x;
			this.drawnToY = y;

			this.drawnTop = top;
			this.drawnLeft = left;

			if (x==this.axisX.max
				|| y==this.axisY.max
			) {
				return false;
			}

			return true;
		},

		drawn: function () {
			this.trigger("drawn");
			console.log('drawn');
		},

		refresh: function () {
			cancelAnimationFrame(this.drawingID);
			this.clear();
		},

		show: function () {
			this.$el.show();
		},

		hide: function () {
			this.$el.hide();
		},

		isVisible : function ()
		{
			return this.$el.is(':visible');
		},

		clear: function() {
			cancelAnimationFrame(this.drawingID);
			this.canvas.getContext().closePath();
			this.drawnToX = 0;	// temp, need best solution, in future posible graphics < 0
			this.canvas.clear();
			// this.cacheTop = [];
			// this.$el.html('');
			// this.$el.remove();
			// this.render();
		},

		// cachingTop: function (top, left)
		// {
		// 	var top = Math.round(top);
		// 	if (!this.cacheTop[top]) {
		// 		this.cacheTop[top] = [left];
		// 	} else {
		// 		this.cacheTop[top].push(left);
		// 	}
		// },

		getPointByLeft: function (left)	{
			var x = this.axisX.getXAt(left);

			if (this.drawnToX < x) {
				return null;
			}

			var y = this.fx(x),
					top = this.axisY.getTopAt(y);

			return {
				x: x,
				y: y,
				left: left,
				top: top,
			};
		},

		// fillCacheTop: function (left, top, range)
		// {
		// 	var i = 0;
		// 	while (!this.cacheTop[top - ++i]) {
		// 		if (i > range) {
		// 			break;
		// 		}
		// 	}
		//
		// 	if (i > range) {
		// 		return;
		// 	}
		//
		// 	var fromTop = top - i;
		//
		// 	var i = 0;
		// 	while (!this.cacheTop[top + ++i]) {
		// 		if (i > range) {
		// 			break;
		// 		}
		// 	}
		//
		// 	if (i > range) {
		// 		return;
		// 	}
		//
		// 	var toTop = top + i;
		//
		// 	// если несколько точек в этом Y то находим index для ближайшего X
		// 	var closestL, closestLeft = +Infinity;
		// 	for (var l=0; l<this.cacheTop[fromTop].length; l++) {
		// 		var distLeft = Math.abs(left - this.cacheTop[fromTop][l]);
		// 		if (closestLeft > distLeft) {
		// 			closestLeft = distLeft;
		// 			closestL = l;
		// 		}
		// 	}
		//
		// 	// если несколько точек в этом Y то находим index для ближайшего X
		// 	var closestR, closestRight = +Infinity;
		// 	for (var r=0; r<this.cacheTop[toTop].length; r++) {
		// 		var distRight = Math.abs(left - this.cacheTop[toTop][r]);
		// 		if (closestRight > distRight) {
		// 			closestRight = distRight;
		// 			closestR = r;
		// 		}
		// 	}
		//
		// 	// console.log(fromTop, toTop)
		// 	var count = toTop-fromTop,
		// 			fromX = this.cacheTop[fromTop][closestL],
		// 			stepX = Math.abs(fromX - this.cacheTop[toTop][closestR]) / count*2;
		//
		// 	console.log(count, [fromTop, toTop], [fromX, this.cacheTop[toTop][closestR]])
		//
		// 	for (i=0; i<count*2; i++) {
		// 		// cachingTop
		// 		var calcLeft = fromX+stepX*i,
		// 				x = this.axisX.getXAt(calcLeft),
		// 		 		y = this.fx(x),
		// 		 		calcTop = this.axisY.getTopAt(y);
		//
		// 		this.cachingTop(calcTop, calcLeft);
		// 		console.log(calcTop, calcLeft, top, fromX)
		// 	}
		// },

		findClosestPointByDiffHeights: function (point) {
			var left = point[0],
					top = point[1],
					closestPoint;

			for (var i=0; i<this.heightDiff.length; i++) {
				var tops = this.heightDiff[i][1],
						lefts = this.heightDiff[i][0];
				if (top < tops[0] && top > tops[1]) {
					var foundLeft = top / (tops[0]-tops[1]) * (lefts[1]-lefts[0]) + lefts[0],
							dist = this.dist(point, [foundLeft, top]);

					if (!closestPoint || closestPoint.dist > dist) {
						closestPoint = {
							top: top,
							left: foundLeft,
							dist: dist,
						};
					}
				}
			}

			if (closestPoint) {
				closestPoint.x = this.axisX.getXAt(closestPoint.left);
				closestPoint.y = this.axisY.getYAt(closestPoint.top);
			}

			return closestPoint;
		},

		// TODO: можно через top тоже находить точку, по соотношению перепада высоты и известным координатам отрисовки (кэшировать их во время рисования?)
		// вроде так пытался уже делать, но лагает в ie, проблема не в кэше а в поиске по кэшу
		// как раз алгоритм выше делает что-то похожее, можно изучить и попробовать оптимизировать поиск (сделать ключи значений x? округленных?)
		// кэшировать только перепады большие высот, а не все подряд?
		// кэш производить во время отрисовки, ведь от визуального зависит рисовать точку и где
		findClosestPoint: function (point, options) {
			if (!this.isVisible()) {
				return +Infinity;
			}

			var left = point[0],
					top = point[1],
					resultPoint = this.getPointByLeft(left);

			if (!resultPoint) {
				return null;
			}

			if (resultPoint) {
				resultPoint.dist = Math.abs(top - resultPoint.top);
			}

			// if (!this.cacheTop) {}
			// while (this.cacheTop[top])

			// if (!this.cacheTop[top]) this.fillCacheTop(left, top, options.range);
			//
			// if (this.cacheTop[top]) {
			// 	for (var i=0; i<this.cacheTop[top].length; i++) {
			// 		var leftByTop = this.cacheTop[top][i],
			// 				resultByTop = this.getPointByLeft(leftByTop);
			// 		resultByTop.dist = this.dist(point, [resultByTop.left, resultByTop.top]);
			// 		if (resultByTop.dist < resultPoint.dist) resultPoint = resultByTop;
			// 	}
			// }

			// TODO: options.range
			// временно отключаем все эти нанопоиски
			// return resultPoint;

			if (!options) options = {};
			var range = options.range;

			var closestHeightPoint = this.findClosestPointByDiffHeights(point);
			if (closestHeightPoint && closestHeightPoint.dist < resultPoint.dist && closestHeightPoint.dist <= range) {
				return closestHeightPoint;
			}

			var pointOverCanvas;

			// пытаемся найти точку через поиск по графику на канвасе
			if (range) for (var r=0; r<=range; r+=1) {
					var data = this.ctx.getImageData(left+r, top, 1, 1).data;
					if (data[0] || data[1] || data[2] || data[3]) {
						pointOverCanvas = this.getPointByLeft(left+r);
						break;
					}
					var data = this.ctx.getImageData(left-r, top, 1, 1).data;
					if (data[0] || data[1] || data[2] || data[3]) {
						pointOverCanvas = this.getPointByLeft(left-r);
						break;
					}
			}

			if (!resultPoint) {
				resultPoint = pointOverCanvas;
			} else {
				if (pointOverCanvas) {
					pointOverCanvas.dist = this.dist(point, [pointOverCanvas.left, pointOverCanvas.top]);
					if (resultPoint.dist > pointOverCanvas.dist) resultPoint = pointOverCanvas;
				} else {
					if (range && resultPoint.dist > range) resultPoint = null;
				}
			}

			if (!resultPoint) {
				return null;
			}

			// увеличиваем точность
      var accuracy = 0.01,
			 		accuracyPoint;
      while (true) {
				accuracyPoint = this.getPointByLeft(resultPoint.left+accuracy);
				if (!accuracyPoint) {
					break;
				}
				accuracyPoint.dist = this.dist(point, [accuracyPoint.left, accuracyPoint.top]);
        if (accuracyPoint.dist < resultPoint.dist) {
          if (accuracyPoint.x > this.drawnToX) {break}
          if (accuracyPoint.x < this.axisX.min) {break}
          resultPoint = accuracyPoint;
        } else {
          if (accuracy>0) {
            accuracy = -accuracy;
          } else {
            break;
          }
        }
      }

			return resultPoint;
		},

		dist : function (point1, point2)
		{
			var a = point1[0] - point2[0];
			var b = point1[1] - point2[1];

			return Math.sqrt( a*a + b*b );
		}

	});

})();
