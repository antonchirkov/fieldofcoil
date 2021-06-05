var iGraphNS = iGraphNS || {};

iGraphNS.COLUMN_HOR = 'columnhor';
iGraphNS.COLUMN_VERT = 'columnvert';
iGraphNS.LINEAR = 'linear';
iGraphNS.PETALS = 'petals';
iGraphNS.CIRCULAR = 'circular';
iGraphNS.DEFAULT_COLORS = ['#e2979e', '#44dd54', '#4454dd', '#dd44dc', '#ddca4e', '#ddcdad', '#adff00',
                             '#ab8854', '#ccd812', '#89acfd'];

function IGraph(xmlData, wrapper, basePath, params) {
	var model, view;
	this.init = function() {
		xmlData = xmlData.substring(xmlData.indexOf('?>') + 2, xmlData.length);
		model = new modelNS.IGraphModel({xmlData: xmlData,
										 wrapper: wrapper,
										 basePath: basePath,
										 params: params,
										 width: wrapper.data('width'),
										 height: wrapper.data('height')});
		return new modelNS.IGraphView({model: model}).render();
	};
}

modelNS.addLangs({
	ru : {
		graph : 'График',
	}
});


modelNS.IGraphModel = modelNS.BaseModel.extend({
  restyling: true,
	defaults: _.extend({}, modelNS.BaseModel.prototype.defaults, {}),
	initialize: function(options) {
		modelNS.BaseModel.prototype.initialize.apply(this, [options]);

    // options.graphics = [
    //    {fx:function (x) {return Math.cbrt(x*5)}, tooltip: "<b>Какойто текст</b><br> x:%x y:%y"},
    //    {fx:function (x) {return x*x}},
    //    {fx:function (x) {return 3}},
    // ];

    // options.labelY = '$${y \\over x} = 3 { 4 \\over 2}$$';
    // PlayerCourse.updateMathJax()

    this.labelX = options.labelX || '';
    this.labelY = options.labelY || '';
    this.domainX = options.domainX;
    this.domainY = options.domainY;
    this.stepX = options.stepX;
    this.stepY = options.stepY;
    this.graphics = options.graphics || [];
    this.isAxisXMarksProportionally = options.isAxisXMarksProportionally || false;
    this.lineWidth = options.lineWidth || 3;
	},
	parseXML: function(xmlData) {
    modelNS.BaseModel.prototype.parseXML.apply(this, arguments);
	}
});

modelNS.IGraphView = modelNS.BaseModelView.extend({
  events: {
    'mousemove .detecting-point': 'onDetectingPoint',
    'mouseout .detecting-point': 'destroyDetectingPoint'
  },
	initialize: function(options) {
		modelNS.BaseModelView.prototype.initialize.apply(this, [options]);
		this.options = options;
		this.model = options.model;
	},
	render: function() {
		modelNS.BaseModelView.prototype.render.apply(this);

		this.$el.addClass('igraph');
		this.renderView();
		this.renderDiagram();


    // пример фигуры
    // var fx = function (x) {return x*x};
    // var shape = this.drawShape({
    //   color: 'rgba(50,100,150,0.3)',
    //   points: [[0.5,0], [0.5,fx], [2,fx], [2,0]],
    // });

    // пример как перерисовать фигуру
    // shape.clear();
    // shape.points = [[1,0], [1,fx], [2,fx], [4,0]];
    // shape.draw();

    // пример точки
    // this.drawPoint({ x:1, y:1 }).css('background', 'red');

		return this;
	},
	renderDiagram: function() {
		this.diagramOptions = {
			parent: this.coordinatesPane.$el,
			labelX: this.model.labelX,
			labelY: this.model.labelY,
            grid: true,
			marks: true,
			min: -5,
			max: 5,
			step: 1,
            domain: [-5, 5],
            domainX: this.model.domainX,
            domainY: this.model.domainY,
            stepY: this.model.stepY,
            stepX: this.model.stepX,
            isAxisXMarksProportionally: this.model.isAxisXMarksProportionally,
            lineWidth: this.model.lineWidth


      // domainX: [0, 5],
      // domainY: [-25, 25],
      // stepY: 5,

      // domainX: [0, 4000],
      // stepX: 500

      // domainX: [0, 4000],
      // domainY: [0, 1.6],
      // stepY: 0.2,
      // stepX: 500,
		};

		this.renderCoordinatesGrid();
    this.renderGraphicalFunctions();
    this.renderDetectingPoint();
	},
  renderDetectingPoint: function ()
  {
    $('<div class="detecting-point"/>')
      .css({
        width: this.coordinatesGrid.$el.width() - 35 - this.coordinatesGrid.axisY.outsetLeft,
        height: this.coordinatesGrid.$el.height() - 62,
        top: 20,
        left: this.coordinatesGrid.axisY.outsetLeft
      })
      .appendTo(this.coordinatesGrid.$el);
  },
  renderCoordinatesGrid: function() {
		this.coordinatesGrid = new iGraphNS.CoordinatesGrid(this.diagramOptions);
		this.coordinatesGrid.render();
	},
  renderGraphicalFunctions: function ()
  {
    this.graphics = [];
    for (var i=0; i<this.model.graphics.length; i++) {
      var model = this.model.graphics[i];
      if (!model.color) model.color = iGraphNS.DEFAULT_COLORS[i];
      model.grid = this.coordinatesGrid;
      this.graphics[model.id || i] = new iGraphNS.GraphicalFunction(model).render();
    }
  },
	renderView: function() {
    this.coordinatesPane = new modelNS.SingleLayout({
			title : modelNS.lang('graph'),
			parent : this.$el,
		}).render();
	},
	hideDiagBtns: function() {
		this.$el.find('.diag-btns-layout').addClass('hidden');
		this.$el.find('.diagButton').hide();
		// this.$center.height(this.$el.height() - 60);
	},
	showDiagBtns: function() {
		this.$el.find('.diag-btns-layout').removeClass('hidden');
		this.$el.find('.diagButton').show();
		// this.$center.height(this.$el.height() - 108);
	},

  findClosestGraph: function (point)
  {
    var closestGraph,
        closestPoint,
        closestDist = +Infinity;

      for (var g in this.graphics) {
        var graph = this.graphics[g];

        if (!graph.tooltip) {
          continue;
        }

        var resultPoint = graph.findClosestPoint(point, {range:20});

        if (!resultPoint) {
          continue;
        }

        if (resultPoint.dist < closestDist) {
          closestDist = resultPoint.dist;
          closestPoint = resultPoint;
          closestGraph = graph;
        }
      }

      return {
        graph: closestGraph,
        point: closestPoint,
      }
  },

  onDetectingPoint: function (e)
  {
    // в .hta лагает если мышкой водить, поэтому вводим fps
    if (modelNS.isIE || modelNS.isEdge) {
      var fps = 6,
          self = this;

      this.detectingPointEvent = e;
      if (!this.detectingPointTimer) {
        this.detectingPointTimer = setTimeout(function () {
          self.detectingPoint(self.detectingPointEvent);
          self.detectingPointTimer = null;
        }, 1000/fps);
      }
    } else {
      this.detectingPoint(e);
    }
  },

  detectingPoint: function (e) {
      var offset = $(e.currentTarget).offset(),
          left = e.offsetX, // (e.pageX - offset.left)/CourseConfig.zoomScale,
          top = e.offsetY, // (e.pageY - offset.top)/CourseConfig.zoomScale,
          closestDist = +Infinity;

      this.detectingPointAt = Date.now();

      var result = this.findClosestGraph([left, top]),
          point = result.point,
          graph = result.graph;

      if (!point) {
         if (this.$hoverPoint) this.$hoverPoint.remove();
         this.$hoverPoint = null;
         return;
      }

      var left = point.left,
          top = point.top,
          x = point.x,
          y = point.y;

      if (this.$hoverPoint) {
        if (this.$hoverPoint.css('left').replace('px') == left
          && this.$hoverPoint.css('top').replace('px') == top) {
            return;
          }
      }

      this.destroyDetectingPoint();

      this.$hoverPoint = this.drawPoint({
        left: left,
        top: top,
        x: x,
        y: y,
        tooltip: graph.tooltip,
      })
      .css("zIndex", 201)
      // .attr("functooltip", graph.tooltip)
      // .addClass("hover-point")
      // .tooltip({
      //   position: { my: "left+25 top+25", at: "right center" },
      // })
      .tooltip("open");
  },

  destroyDetectingPoint: function ()
  {
    if (this.$hoverPoint) {
      this.$hoverPoint.remove();
      this.$hoverPoint = null;
    }
    if (this.detectingPointTimer) {
      clearTimeout(this.detectingPointTimer);
      this.detectingPointTimer = null;
    }
  },

  drawPoint: function (point)
  {
    return this.coordinatesGrid.drawPoint(point);
  },

  drawShape: function (options)
  {
    if (!options.grid) options.grid = this.coordinatesGrid;
    return new iGraphNS.GraphicalShape(options).render();
  },

});

//

//
// Math.parseFloat = function (str)
// {
//   return parseFloat(str.replace(",",'.'));
// }
