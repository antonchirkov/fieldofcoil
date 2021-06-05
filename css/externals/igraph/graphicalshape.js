(function() {

	iGraphNS.GraphicalShape = Backbone.View.extend({
		className: 'graphical-shape',
		initialize: function(options) {
			this.grid = options.grid;
			this.layer = this.grid.layer;
			this.axisX = this.grid.hScale;
			this.axisY = this.grid.vScale;
			this.points = options.points;
			this.color = options.color;
			// this.fx = options.fx;
			// this.tooltip = options.tooltip;
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

		},

		draw : function (options)
		{
			if (!options) options = {};

			var ctx = this.canvas.getContext(),
					drawStep = this.axisX.getXperPx(),
					self = this,
					width = options.width || 0,
					color = options.color || this.color;

			ctx.beginPath();
			// ctx.lineWidth = width;
			// ctx.strokeStyle = color; TODO
			ctx.fillStyle = color; // '#8ED6FF';

			var prevX;
			for (var i=0; i<this.points.length; i++) {
				var point = this.points[i],
						x = point[0],
						y = point[1];

			  if (typeof(y) == "function" && (!prevX || prevX == x)) y = y(x);

				if (typeof(y) == "function") {
					var drawX = prevX;
					if (x<prevX) {
						while (drawX>x) {
							drawX -= drawStep;
							if (drawX<x) drawX = x;

							var left = this.axisX.getLeftAt(drawX),
									top = this.axisY.getTopAt(y(drawX));

							this.pathTo(left, top, ctx);
						}
					} else {
						while (drawX<x) {
							drawX += drawStep;
							if (drawX>x) drawX = x;

							var left = this.axisX.getLeftAt(drawX),
									top = this.axisY.getTopAt(y(drawX));

							 	this.pathTo(left, top, ctx);
						}
					}

					// var left = this.axisX.getLeftAt(x),
					// 		top = this.axisY.getTopAt(y);
					//
					// if (i==0) {
					// 	ctx.moveTo(left, top);
					// } else {
					// 	ctx.lineTo(left, top);
					// }
				} else {
					var left = this.axisX.getLeftAt(x),
							top = this.axisY.getTopAt(y);

					this.pathTo(left, top, ctx);
				}
				prevX = x;
			}

			// ctx.fillStyle = '#8ED6FF';
      ctx.fill();
			// ctx.stroke();
			this.closePath(ctx);
			// this.drawn();
		},

		pathTo: function (left, top, ctx)
		{
			if (!this.pathOpened) {
				this.pathOpened = true;
				ctx.moveTo(left, top);
			} else {
				ctx.lineTo(left, top);
			}
		},

		closePath: function (ctx)
		{
			this.pathOpened = true;
			ctx.closePath();
		},

		drawInterval : function (ctx, x)
		{
			var left = this.axisX.getLeftAt(x),
					y = this.fx(x),
					top = this.axisY.getTopAt(y);

			if (x>this.axisX.max
				|| y>this.axisY.max
			) {
				return false;
			}

			if (x == this.axisX.min) {
				ctx.moveTo(left, top);
			} else {
				ctx.lineTo(left, top);
			}

			return true;
		},

		refresh: function ()
		{
			clearInterval(this.drawIntervalID);
			this.clear();
		},

		show : function ()
		{
			this.$el.show();
		},

		hide: function ()
		{
			this.$el.hide();
		},

		isVisible : function ()
		{
			return !this.$el.is(':visible');
		},

		clear: function() {
			// clearInterval(this.drawIntervalID);
			// this.canvas.getContext().closePath();
			this.canvas.clear();
			// this.$el.html('');
			// this.$el.remove();
			// this.render();
		}
	});

})();
