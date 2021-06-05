var iDiagramNS = iDiagramNS || {};

iDiagramNS.COLUMN_HOR = 'columnhor';
iDiagramNS.COLUMN_VERT = 'columnvert';
iDiagramNS.LINEAR = 'linear';
iDiagramNS.PETALS = 'petals';
iDiagramNS.CIRCULAR = 'circular';
iDiagramNS.DEFAULT_COLORS = ['#e2979e', '#44dd54', '#4454dd', '#dd44dc', '#ddca4e', '#ddcdad', '#adff00',
                             '#ab8854', '#ccd812', '#89acfd', '#783f68', '#0094ae', '#fe7b23', '#ffe32f', '#d16c34'];
iDiagramNS.ROMAN_NUMBERS = {'I': 1, 'V': 5, 'X': 10, 'L': 50, 'C': 100, 'D': 500, 'M': 1000} // #11386

function Diagram(xmlData, wrapper, basePath, params) {
	var model, view;
	this.init = function() {
		// xmlData = xmlData.substring(xmlData.indexOf('?>') + 2, xmlData.length); // ??? это приводит баг, согласно письму: [ВП-физ] Сценарий л/р "Закон Гука" для МО
		var $xml = $($.parseXML(xmlData));

		var width = wrapper.width() != 0 ? wrapper.width() :
					$xml.find('idiagram').attr('width') ? $xml.find('idiagram').attr('width') : 800,
			height = wrapper.height() != 0 ? wrapper.height() :
					$xml.find('idiagram').attr('height') ? $xml.find('idiagram').attr('height') : 600;

		model = new modelNS.IDiagramModel({
                     xmlData: xmlData,
										 wrapper: wrapper,
										 basePath: basePath,
										 scalable: false,
										 params: params,
										 width: width,
										 height: height,
                   });
		return new modelNS.IDiagramPanelView({model: model}).renderOnShow();
	};
}

modelNS.IDiagramModel = modelNS.BaseModel.extend({
  restyling: true,
	defaults: _.extend({}, modelNS.BaseModel.prototype.defaults, {}),
	initialize: function(options) {
		this.defaults.width = options.width;
		this.defaults.height = options.height;
    this.params = options.params;

    // options.types = ['columnhor'];
    // options.markCategories = true;
    // options.categories = [
    //   {title:'W<sub>e</sub>', tooltip:'<b>Электическая энергия</b><br><i>W</i> = %value кДж', points : [
    //     {value: 0.1},
    //   ]},
    //   {title:'W<sub>m</sub>', tooltip:'W<sub>m</sub>', points : [
    //     {value: 1},
    //   ]}
    // ];

    var types = options.types || [iDiagramNS.COLUMN_VERT, iDiagramNS.COLUMN_HOR, iDiagramNS.LINEAR, iDiagramNS.PETALS, iDiagramNS.CIRCULAR],
        axisXLabel = options.axisXLabel || "",
        axisYLabel = options.axisYLabel || "",
        axisXValues = new Backbone.Collection(),
        legend = options.legend || null,
        categories,
        referenceValues = [];

    // default axisXValues not empty
    if (!options.axisXValues) {
      axisXValues.add({value: ''});
    }

    // set categories when global ??
    if (options.categories) {
      categories = new iDiagramNS.CategoryCollection();
      for (var c=0; c<options.categories.length; c++) {
        var category = options.categories[c],
            points = new iDiagramNS.PointCollection();

        if (!category.color) category.color = iDiagramNS.DEFAULT_COLORS[c];
        if (!category.title) category.title = '';

        category = new iDiagramNS.Category(category);

        for (var p=0; p<options.categories[c].points.length; p++) {
          var point = options.categories[c].points[p];
          if (!options.axisXValues) {
            point.axisValue = axisXValues.at(0);
          }
          point.category = category;
          points.add(point);
        };

        category.set({points: points});
        categories.add(category);
      }
    }
    this.dataJSON = {
      title: options.title,
      databutton: options.databutton,
      options: options.options,
      referenceValues: options.referenceValues, // контрольные величины
      markCategories: options.markCategories, // выводить имена категорий на шкалах
      step: options.step,
      grid: options.grid,
      axisXLabel: axisXLabel,
      axisYLabel: axisYLabel,
      categories: categories,
      axisXValues: axisXValues,
      legend: legend,
      types: types,
      hasZeroAfterInteger: options.hasZeroAfterInteger || false
    };

		modelNS.BaseModel.prototype.initialize.apply(this, arguments);

	},
	parseXML: function(xmlData) {

    if (!xmlData) return this.dataJSON;

		var $model = this,
		    $xml = $($.parseXML(xmlData)),
        $settings = $xml.find('settings'),
        $types = $settings.find('types'),
        $legend = $settings.find('legend'),
			  settings = {
          default: $settings.attr('default'),
          types: $types.text().split(';'),
          radius: $xml.find('radius').text() * 1,
          round: $xml.find('round').text() || 2,
          title: $xml.find('title').text() || 'Диаграмма',
        };

      settings.legend = $legend.length ? courseML.getHTMLFromCourseML($legend) : null;
      settings.legendWidth = $legend.attr('width');
// console.log(courseML.getHTMLFromCourseML($xml.find('td')[0]))
			settings.grid = true;
			settings.marks = true;
			settings.marksY = true; // #11318
			var axis = $xml.find('axis');
			if (axis.length != 0) {
				settings.grid = typeof axis.attr('grid') != 'undefined' ? axis.attr('grid') == 'true' : true;
				settings.marks = typeof axis.attr('marks') != 'undefined' ? axis.attr('marks') == 'true' : true;
        		settings.gridY = true;
        		settings.marksY = typeof axis.attr('marksY') != 'undefined' ? axis.attr('marksY') == 'true' : true; // #11318
			}
			settings.minX = $xml.find('min').text() ? $xml.find('min').text()*1 : NaN;
			settings.maxX = $xml.find('max').text()*1;
			settings.minAuto = false;
			settings.maxAuto = false;
			settings.minRange = $xml.find('minrange').length != 0 ? $xml.find('minrange').text() : null;
			settings.maxRange = $xml.find('maxrange').length != 0 ? $xml.find('maxrange').text() : null;
			settings.step = $xml.find('step').length != 0 ? $xml.find('step').text() : null;
			settings.stepAuto = false;
			settings.axisXLabel = $xml.find('xlabel').length != 0 ?
								  courseML.getHTMLFromCourseML($xml.find('xlabel').first()) : 'x';
			settings.axisYLabel = $xml.find('ylabel').length != 0 ?
					  			  courseML.getHTMLFromCourseML($xml.find('ylabel').first()) : 'y';
			settings.editable = false;
      		settings.pow = 1; // type = 0;
			settings.minY = $xml.find('minY').text() ? $xml.find('minY').text()*1 : NaN; // #11318
        	settings.maxY = $xml.find('maxY').text() ? $xml.find('maxY').text()*1 : NaN; // #11318
        	settings.stepY = $xml.find('stepY').length != 0 ? $xml.find('stepY').text() : null; // #11318

      // settings.lg = 10; // type = 5;
			var dataBlock = $xml.find('data'),
          from = dataBlock.attr('from'),
          editable = dataBlock.attr('editable'),
  				options = dataBlock.attr('options');

      // connector to diagramdata
      if (from) {
        dataBlock = $('<div/>').html(globalParam['datafor' + from]);
      }

      settings.databutton = true; // always show databutton

			if (dataBlock.length != 0) {
				settings.editable = editable == 'false' ? false : editable;
				settings.options = typeof options != 'undefined' ? options == 'true' : true;
			} else {
				return settings;
			}


			var axisXData = this.getAxisXDataFromRow(dataBlock);
			settings.axisXValues = axisXData.axisXValues;
        	settings.axisTitle = axisXData.axisTitle;
			settings.categories = this.getDiagramCategoriesFromRow(dataBlock, settings.axisXValues);
        	this.addCustomDiagramData(dataBlock, settings);

			settings.popups = [];
			$xml.find('popup').each(function() {
				try {
					var id = $(this).attr('id') || '' ? $(this).attr('id') : $(this).attr('name'),
						width = $(this).attr('width'),
						height = $(this).attr('height'),
					    content = courseML.getHTMLFromCourseML($(this));
					settings.popups.push({closableOnOverlayClick: true, id: id, width: width, height: height, content: content});
				} catch (e) {}
			});

      settings.pointlines = $settings.attr('pointlines') === 'false' ? false : true;
      settings.trends = $settings.attr('trends') !== 'false';

      // Радиус petals диаграммы
      settings.petalsRadius = $settings.find('petalsRadius').text() * 1;

      // Если параметры глобальные, то данные общие #9894
      if (this.params.type == 'global') {
        var globalSettings = globalParam[this.params.jsID];
        if (globalSettings) {
          settings.categories = globalSettings.categories;
          settings.axisXValues = globalSettings.axisXValues;
        } else {
          globalParam[this.params.jsID] = {
            categories: settings.categories,
            axisXValues: settings.axisXValues,
          };
        }
      }

      // доступные типы диаграмм
      if (this.params.types) {
        settings.types = this.params.types.split(';');
      }

      // редактируемость данных
      if (this.params.editable) {
        settings.editable = this.params.editable == 'false' ? false : this.params.editable;
      }

      // текст вкладки "Диаграмма"
      // после смены дизайна - устаревшее ?
      if (this.params.title) {
        settings.title = this.params.title;
      }

      // видимость вкладки "настройки"
      if (this.params.options !== undefined) {
        settings.options = this.params.options == "true";
      }

      // Отвечает за показ вкладки, которое будет отображаться первым при входе на слайд
      if (this.params.default) {
        settings.default = this.params.default;
      }

		// } catch (e) {console.log(e);}
		return settings;
	},

    /**
	 * Возвращает объект, содержащий название оси X и коллекцию значений на оси X.
	 * Данные берутся из ячеек <th> в одной строке в разметке dataBlock.
     * @param {jQuery} dataBlock
     * @returns {{axisTitle: string, axisXValues: Collection}}
     */
	getAxisXDataFromRow: function(dataBlock) {
  		var axisTitle = '';
  		var axisXValues = new Backbone.Collection();
        dataBlock.first().find('th').each(function(i) {
            if (i == 0) {
                axisTitle = courseML.getHTMLFromCourseML($(this));
                return;
            }
            axisXValues.add({value: courseML.getHTMLFromCourseML($(this))});
        });
        return {
        	axisTitle,
			axisXValues
		}
	},

    /**
     * Возвращает объект, содержащий название оси X и коллекцию значений на оси X.
     * Данные берутся из первой колонки каждой строки таблицы в разметке dataBlock.
     * @param {jQuery} dataBlock
     * @returns {{axisTitle: string, axisXValues: Collection}}
     */
    getAxisXDataFromColumn: function(dataBlock) {
        var axisTitle = '';
        var axisXValues = new Backbone.Collection();
        dataBlock.first().find('tr').each(function(i) {
            var $firstColumn = null;
            if (i == 0) {
                $firstColumn = $(this).find('th').first();
                axisTitle = courseML.getHTMLFromCourseML($firstColumn);
                return;
            }
            $firstColumn = $(this).find('td').first()
            axisXValues.add({value: courseML.getHTMLFromCourseML($firstColumn)});
        });
        return {
            axisTitle,
            axisXValues
        }
        dataBlock.first().find('th').each(function(i) {
            if (i == 0) {
                axisTitle = courseML.getHTMLFromCourseML($(this));
                return;
            }
            axisXValues.add({value: courseML.getHTMLFromCourseML($(this))});
        });
        return {
            axisTitle,
            axisXValues
        }
	},

    /**
	 * Формирует и возвращает категории графиков в диаграмме. Под категорией понимаются столбцы, относящиеся к одной группе
	 * значений(имеют один цвет), один график с точками(имеет один цвет) и т.д.
	 * Данные формируются из ячеек строки таблицы. Одна строка - одна категория.
     * @param {jQuery} dataBlock Объект, представляющий элемент <data>
     * @param {Collection} axisXValues Объект с коллекцией значений по оси X.
     * @returns {Collection}
     */
	getDiagramCategoriesFromRow: function(dataBlock, axisXValues) {
        var categories = new iDiagramNS.CategoryCollection();
        dataBlock.first().find('tr').each(function(i) {
            if (i == 0) {
                return;
            }
            var points = new iDiagramNS.PointCollection();
            var color = $(this).attr('color') || iDiagramNS.DEFAULT_COLORS[i - 1];

            var category = new iDiagramNS.Category({
                color: color
            });
            $(this).find('td').each(function(j) {
                if (j == 0) {
                    category.set({
                        title: courseML.getHTMLFromCourseML($(this)),
                        petalsStyle: modelNS.toStyleObject( $(this).attr('petalsStyle') )
                    })
                    return;
                }

                var pointString = courseML.getHTMLFromCourseML($(this)),
                    pointValueFloat = modelNS.parseFloat(pointString),
                    pointValue = isNaN(pointValueFloat) ? '' : pointValueFloat;

                points.add({
                    category: category,
                    value: pointValue,
                    axisValue: axisXValues.at(j - 1),
                    link: $(this).attr('link'),
                });
            });
            category.set({points: points});
            categories.add(category);
        });
        return categories;
	},

    /**
     * Формирует и возвращает категории графиков в диаграмме. Под категорией понимаются столбцы, относящиеся к одной группе
     * значений(имеют один цвет), один график с точками(имеет один цвет) и т.д.
     * Данные формируются отдельно по каждой колонке из таблицы. Одна колонка таблицы - одна категория.
	 * Из первой колонки берутся названия подписей.
     * @param {jQuery} dataBlock Объект, представляющий элемент <data>
     * @param {Collection} axisXValues Объект с коллекцией значений по оси X.
     * @returns {Collection}
     */
    getDiagramCategoriesFromColumn: function(dataBlock, axisXValues) {
        var categories = new iDiagramNS.CategoryCollection();
        var $dataBlockRows = dataBlock.first().find('tr');
        var columnsLength = $dataBlockRows.first().find('th').length;
        for (var i = 1; i < columnsLength; i++) {
            var points = new iDiagramNS.PointCollection();
            var color = $(this).attr('color') || iDiagramNS.DEFAULT_COLORS[i - 1];
            var category = new iDiagramNS.Category({
                color: color
            });
            $dataBlockRows.each(function(rowIndex, rowItem) {
            	var $column = rowIndex === 0 ? $($(rowItem).find('th').get(i)) : $($(rowItem).find('td').get(i));
            	if (rowIndex === 0) {
                    category.set({
                        title: courseML.getHTMLFromCourseML($column),
                        petalsStyle: modelNS.toStyleObject($column.attr('petalsStyle')) // ???????????
                    })
                    return;
				}
                var pointString = courseML.getHTMLFromCourseML($column),
                    pointValueFloat = modelNS.parseFloat(pointString),
                    pointValue = isNaN(pointValueFloat) ? '' : pointValueFloat;

                points.add({
                    category: category,
                    value: pointValue,
                    axisValue: axisXValues.at(rowIndex - 1),
                    link: $column.attr('link'), // ????????????????
                });
			});
            category.set({points: points});
            categories.add(category);
		}

        return categories;
    },

    /**
	 * Сохраняет данные для построения диаграммы, которые были вычислены из таблицы данных(из XML) как построчно, так и
	 * по колонкам. Эти данные нужны, чтобы иметь возможность перерисовывать диаграммы динамически, например, по нажатию
	 * кнопки.
     * @param {jQuery} dataBlock Объект, представляющий элемент <data>
     * @param {Object} settings Объект с опциями для построения диаграмм
     */
	addCustomDiagramData: function(dataBlock, settings) {
        var axisXDataFromColumn = this.getAxisXDataFromColumn(dataBlock);
        settings.customDiagramData = {
            row: {
                axisXValues: settings.axisXValues,
                axisTitle: settings.axisTitle,
                categories: settings.categories
            },
            column: {
                axisXValues: axisXDataFromColumn.axisXValues,
                axisTitle: axisXDataFromColumn.axisTitle,
                categories: this.getDiagramCategoriesFromColumn(dataBlock, axisXDataFromColumn.axisXValues)
    		}
    	}
	}
});

modelNS.IDiagramView = modelNS.BaseModelView.extend({
	initialize: function(options) {
		modelNS.BaseModelView.prototype.initialize.apply(this, [options]);
		this.options = options;
		this.model = options.model;
		this.initData(options);

    this.selectable = false;

    this.activeDiagram = this.model.dataJSON.types[0];

    // обновлять модель при изменении globalParam
    this.reloadOnGlobalParamUpdated();
	},
	initData: function(options) {
		return;
    // расчитать значения шкалы
    this.calculateScale();
	},
	render: function() {
		modelNS.BaseModelView.prototype.render.apply(this);

    this.$center = this.$el;

		this.$el.addClass('idiagram');
		this.popupCollection = new modelNS.PopupCollection(this.model.dataJSON.popups);

		if (this.activeDiagram) {
      this.renderActiveDiagram();
    }

		return this;
	},
	renderActiveDiagram: function() {
    // расчитать значения шкалы
    this.calculateScale();
		this.diagramOptions = {
			parent: this.$center,
			labelX: this.model.dataJSON.axisXLabel,
			labelY: this.model.dataJSON.axisYLabel,
      		settings:this.model.dataJSON,
			axisXValues: this.model.dataJSON.axisXValues,
      		grid: this.model.dataJSON.grid,
			marks: this.model.dataJSON.marks,
			gridY: this.model.dataJSON.gridY,
			marksY: this.model.dataJSON.marksY,
			minX: this.model.dataJSON.minX,
			maxX: this.model.dataJSON.maxX,
			min: this.min,
			max: this.max,
			step: this.step,
			maxValue: this.getMaxValue(),
			categories: this.model.dataJSON.categories,
      		radius : this.model.dataJSON.radius,
			popups: this.popupCollection,
      		round: this.model.dataJSON.round,
      		pointlines: this.model.dataJSON.pointlines,
      		trends: this.model.dataJSON.trends,
      		markCategories: this.model.dataJSON.markCategories,
      		referenceValues: this.model.dataJSON.referenceValues,
			maxY: this.model.dataJSON.maxY || this.max, //#11318
            minY: this.model.dataJSON.minY || this.min, //#11318
            stepY: this.model.dataJSON.stepY || this.step, //#11318
			customDiagramData: this.model.dataJSON.customDiagramData,
            hasZeroAfterInteger: this.model.dataJSON.hasZeroAfterInteger
		};
		this.clearPane();
		switch (this.activeDiagram) {
			case iDiagramNS.COLUMN_VERT: {
				this.renderVerticalDiagram();
				break;
			}
			case iDiagramNS.COLUMN_HOR: {
				this.renderHorizontalDiagram();
				break;
			}
			case iDiagramNS.LINEAR: {
				this.renderLinearDiagram();
				break;
			}
      case iDiagramNS.PETALS: {
				this.renderPetalDiagram();
				break;
			}
      case iDiagramNS.CIRCULAR: {
				this.renderCircularDiagram();
				break;
			}
		}
	},
	clearPane: function() {
		try {
			this.$center.html('');
		} catch(e) {}
	},
  setTitle: function (title) {
    this.diagramsButton.setTitle(title);
  },

  // расчитать значения шкалы
	calculateScale: function() {
		if (this.model.dataJSON.autoStep) {
			this.model.dataJSON.step = null;
		}
		if (this.model.dataJSON.minAuto) {
			this.model.dataJSON.min = null;
		}
		if (this.model.dataJSON.maxAuto) {
			this.model.dataJSON.max = null;
		}

    this.step = this.model.dataJSON.step && parseFloat(this.model.dataJSON.step);
    if (!this.step) {
      var D = Math.abs(this.getMaxValue()) - Math.abs(this.getMinValue());
      if (D<=1) {
        this.step = 0.1;
      } else if (D<=5) {
        this.step = 1;
      } else if (D<=100) {
        this.step = 5;
      } else if (D<=1000) {
        this.step = 100;
      } else {  // default logic wich was
        this.step = Math.abs(this.getMaxValue()) > Math.abs(this.getMinValue()) ?
          Math.round(Math.abs(this.getMaxValue()) / 5) + 1 :
          Math.round(Math.abs(this.getMinValue()) / 5) + 1;
      }
    }

		this.max = this.model.dataJSON.max != null ? parseFloat(this.model.dataJSON.max) :
				   (((Math.round(this.getMaxValue() / this.step)) * this.step) < this.getMaxValue() ? ((Math.round(this.getMaxValue() / this.step) + 1) * this.step) :
					((Math.round(this.getMaxValue() / this.step)) * this.step));
		this.min = this.model.dataJSON.min != null ? parseFloat(this.model.dataJSON.min) :
				   this.getMinValue() > 0 ? 0 :
				   (((Math.round(this.getMinValue() / this.step)) * this.step) > this.getMinValue() ? ((Math.round(this.getMinValue() / this.step) - 1) * this.step) :
					((Math.round(this.getMinValue() / this.step)) * this.step));

		if (this.max % this.step != 0) {
			this.max = Math.round(this.max / this.step) * this.step;
		}
		if (this.min % this.step != 0) {
			this.min = Math.round(this.min / this.step) * this.step;
		}
		if (this.max < this.getMaxValue()) {
			this.max = Math.ceil(this.getMaxValue() / this.step) * this.step;
		}
		if (this.min > this.getMinValue()) {
			this.min = Math.floor(this.getMinValue() / this.step) * this.step;
		}
		if (this.max < 0) {
			this.max = 0;
		}

		var marksCount = Math.ceil((this.max - this.min) / this.step);
		if (marksCount > 20) {
			var optimalStep = (this.max - this.min) / 20;
			optimalStep = Math.ceil(optimalStep / this.step) * this.step;
			this.step = optimalStep;
		}

	},
	renderVerticalDiagram: function() {
		this.verticalDiagram = new iDiagramNS.VerticalDiagram(this.diagramOptions);
		this.verticalDiagram.render();
	},
	renderHorizontalDiagram: function() {
		this.horizontalDiagram = new iDiagramNS.HorizontalDiagram(this.diagramOptions);
		this.horizontalDiagram.render();
	},
	renderLinearDiagram: function() {
		this.linearDiagram = new iDiagramNS.LinearDiagram(this.diagramOptions);
		this.linearDiagram.render();
	},
  	renderPetalDiagram: function() {
		this.petalsDiagram = new iDiagramNS.PetalsDiagram($.extend({
      petalsRadius: this.model.dataJSON.petalsRadius,
    }, this.diagramOptions));
		this.petalsDiagram.render();
	},
  renderCircularDiagram: function() {
		this.circularDiagram = new iDiagramNS.CircularDiagram(this.diagramOptions);
		this.circularDiagram.render();
	},
	getMinValue: function() {
		return this.getMinMaxValue(true);
	},
	getMaxValue: function() {
		return this.getMinMaxValue(false);
	},
	getMinMaxValue: function(isMin) {
		var value;
		try {
			value = modelNS.parseFloat( this.model.dataJSON.categories.at(0).get('points').at(0).get('value') || 0 ) // (связано с #13377)
			this.model.dataJSON.categories.each(function(c) {
				c.get('points').each(function(p) {
          var pointValue = modelNS.parseFloat(p.get('value')); // (связано с #13377)
					if (!isMin && pointValue > value ||
						isMin && pointValue < value	) {
						value = pointValue;
					}
				});
			});
		} catch (e) {
			console.log(e);
		}
		return value;
	},
	hideLegendBtn: function() {
		this.legendButton.$el.hide();
	},
	showLegendBtn: function() {
		// this.legendButton.$el.show();  // bug in console
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
	onMainBtnClick: function(button) {
		// this.hideDiagBtns();
		// this.hideLegendBtn();
		// this.hideLegend();
    this.$center.attr('tab', 'main');
		this.$el.find('.mainButton').removeClass('active');
		button.$el.addClass('active');
		this.clearPane();
	},
	onDiagBtnClick: function(button) {
		this.onMainBtnClick(button);
    this.$center.attr('tab', 'diag');
		this.$center.css({'overflow-y': 'hidden'});
		this.showDiagBtns();
		this.showLegendBtn();
		this.renderActiveDiagram();
	},
	onDataBtnClick: function(button) {
		this.onMainBtnClick(button);
    this.$center.attr('tab', 'data');
		this.$center.css({'overflow-y': 'auto'});
		this.dataTable = new iDiagramNS.DataTable({
			data: this.options,
			parent: this.$center,
			editable: this.model.dataJSON.editable,
			diagram: this,
			linear: this.model.dataJSON.types.length == 1 && this.model.dataJSON.types.indexOf(iDiagramNS.LINEAR) != -1
		});
		this.dataTable.render();
	},
	onSettingsBtnClick: function(button) {
		this.onMainBtnClick(button);
    this.$center.attr('tab', 'settings');
		this.$center.css({'overflow-y': 'hidden'});
		this.diagramSettings = new iDiagramNS.DiagramSettings({
			parent: this.$center,
			max: this.max,
			min: this.min,
			data: this.options,
			diagram: this
		});
		this.diagramSettings.render();
	},
	onDiagButtonClick: function(button) {
		// this.$el.find('.diagButton').removeClass('active');
		// button.$el.addClass('active');
    this.onMainBtnClick(button);
		this.renderActiveDiagram();
    this.$center.css({'overflow-y': 'hidden'}); // #10667 скролл в ie
	},
	onVertColClick: function(button) {
		this.activeDiagram = iDiagramNS.COLUMN_VERT;
		this.onDiagButtonClick(button);
	},
	onHorColClick: function(button) {
		this.activeDiagram = iDiagramNS.COLUMN_HOR;
		this.onDiagButtonClick(button);
	},
	onLinearClick: function(button) {
		this.activeDiagram = iDiagramNS.LINEAR;
		this.onDiagButtonClick(button);
	},
  onPetClick: function(button) {
		this.activeDiagram = iDiagramNS.PETALS;
		this.onDiagButtonClick(button);
	},
  onCircularClick: function(button) {
		this.activeDiagram = iDiagramNS.CIRCULAR;
		this.onDiagButtonClick(button);
	},
	onLegendClick: function(button) {
		if (!this.legend) {
			this.showLegend();
		} else {
			this.hideLegend();
		}
	},
	showLegend: function() {
    var self = this;

    this.$el.addClass('legend-opened');

		this.legend = $('<div class="diagram-legend"></div>');
    $('<div class="close-legend"/>')
      .click(function () {self.hideLegend()})
      .appendTo(this.legend);

    // title
    if (this.model.dataJSON.legend) $('<div class="title-legend"/>')
      .html(this.model.dataJSON.legend)
      .appendTo(this.legend);

    // width
    if (this.model.dataJSON.legendWidth) {
      this.legend.css({
        width : this.model.dataJSON.legendWidth,
        minWidth : "auto"
      });
    }

		this.model.dataJSON.categories.each(function(category) {
			var legendItem = $('<div class="legend-item"></div>'),
				itemColor = $('<div class="item-color"><div/></div>'),
				itemDesc = $('<div class="item-desc"></div>');
			itemColor.css({'background-color': category.get('color')});
			itemDesc.append(category.get('title'));
			legendItem.append(itemColor);
			legendItem.append(itemDesc);
			self.legend.append(legendItem);
		});
		this.$el.append(this.legend);
	},
	hideLegend: function() {
		if (this.legend) {
			this.legend.remove();
			this.legend = null;
      this.$el.removeClass('legend-opened');
		}
	}
});

modelNS.IDiagramPanelView = modelNS.IDiagramView.extend({
  render: function() {
    // отрендерим диаграмму после renderView
    this.activeDiagram = null;

		modelNS.IDiagramView.prototype.render.apply(this);

    if (this.model.dataJSON.axisXValues.length !== 0) {
        this.renderView();
        // рендер активной диаграммы
        this.activeDiagram = this.model.dataJSON.types[0];
        this.renderActiveDiagram();

        // переключаем на таб по умолчанию (настройки, данные)
        this.defaultTab();
	} else {
    	this.$center.html('<div class="no-data-message">Нет данных для построения диаграммы.</div>');
	}
		return this;
	},
  renderView: function() {
    var self = this,
        settings = this.model.dataJSON,
        hasSettingsBtn = settings.options == true,
        hasDataBtn = settings.databutton == true;
        hasLegendBtn = settings.legend !== null,
        hasButs = settings.types.length >= 2 || hasLegendBtn,
        title = settings.title;

    this.centerLayout = new modelNS.DualHorizontalLayout({
      cls: 'center-layout',
      nopadding: true,
      bottomPaneHeight: this.$el.height() - 40,
      parent: this.$el
    }).render();

    this.$center = this.centerLayout.$bottomPane;
    this.$center.addClass('main-layout');

    this.$tabs = this.centerLayout.$topPane;
    this.$tabs.addClass('diag-tabs');

    var buttonsCount = 0;

    if (settings.types.indexOf(iDiagramNS.COLUMN_VERT) != -1) {
      this.colVertBtn = new modelNS.Button({
        cls: 'mainButton diagButton cVertBtn ' +
           (settings.types[0] == iDiagramNS.COLUMN_VERT ? 'active' : '')
      });
      this.$tabs.append(this.colVertBtn.render().el);
      this.listenTo(this.colVertBtn, 'ButtonClicked', this.onVertColClick);
      buttonsCount++;
    }

    if (settings.types.indexOf(iDiagramNS.COLUMN_HOR) != -1) {
      this.colHorBtn = new modelNS.Button({
        cls: 'mainButton diagButton cHorBtn ' +
           (this.model.dataJSON.types[0] == iDiagramNS.COLUMN_HOR ? 'active' : '')
      });
      this.$tabs.append(this.colHorBtn.render().el);
      this.listenTo(this.colHorBtn, 'ButtonClicked', this.onHorColClick);
      buttonsCount++;
    }

    if (settings.types.indexOf(iDiagramNS.LINEAR) != -1) {
      this.linearBtn = new modelNS.Button({
        cls: 'mainButton diagButton linearBtn ' +
           (this.model.dataJSON.types[0] == iDiagramNS.LINEAR ? 'active' : '')
      });
      this.$tabs.append(this.linearBtn.render().el);
      this.listenTo(this.linearBtn, 'ButtonClicked', this.onLinearClick);
      buttonsCount++;
    }

    if (settings.types.indexOf(iDiagramNS.PETALS) != -1) {
      this.petBtn = new modelNS.Button({
        cls: 'mainButton diagButton petBtn ' +
           (settings.types[0] == iDiagramNS.PETALS ? 'active' : '')
      });
      this.$tabs.append(this.petBtn.render().el);
      this.listenTo(this.petBtn, 'ButtonClicked', this.onPetClick);
      buttonsCount++;
    }

    if (settings.types.indexOf(iDiagramNS.CIRCULAR) != -1) {
      this.circularBtn = new modelNS.Button({
        cls: 'mainButton diagButton circularBtn ' +
           (settings.types[0] == iDiagramNS.CIRCULAR ? 'active' : '')
      });
      this.$tabs.append(this.circularBtn.render().el);
      this.listenTo(this.circularBtn, 'ButtonClicked', this.onCircularClick);
      buttonsCount++;
    }

    if (hasDataBtn) {
      this.dataButton = new modelNS.Button({
        cls: 'mainButton dataBtn font14 ' + (!hasSettingsBtn ? 'top-right-radius' : ''),
        tagName: "button",
      });
      this.$tabs.append(this.dataButton.render().el);

      this.listenTo(this.dataButton, 'ButtonClicked', this.onDataBtnClick);
      this.dataButton.$el.on("focus", function () {  self.onDataBtnClick(self.dataButton) });
      // this.dataButton.$el.css("width", buttonWidth);
      buttonsCount++;
    }

    if (hasSettingsBtn) {
      this.settingsButton = new modelNS.Button({
        cls: 'mainButton settingsBtn font14',
        tagName: "button",
      });
      this.$tabs.append(this.settingsButton.render().el);
      // this.listenTo(this.settingsButton, 'ButtonClicked', this.onSettingsBtnClick);
      this.settingsButton.$el.on("focus", function () { self.onSettingsBtnClick(self.settingsButton) });
      // this.settingsButton.$el.css("width", buttonWidth);  // fix ie9 .width for button wrong set
      buttonsCount++;
    }

    if (hasLegendBtn) {
      this.legendButton = new modelNS.Button({
        cls: 'mainButton legend'
      });
      this.$tabs.append(this.legendButton.render().el);
      this.listenTo(this.legendButton, 'ButtonClicked', this.onLegendClick);
      buttonsCount++;
    }

    var $buttons = this.$tabs.find('.mainButton'),
        buttonWidth = Math.floor(this.$tabs.width() / buttonsCount);

    $buttons.css('width', buttonWidth);

    /* компенсируем пиксели которые не удалось ровно разделить на кнопки */
    $buttons.last().css('width', buttonWidth + 5)
  },
  defaultTab: function () {
    var settings = this.model.dataJSON;
    if (settings.default == 'data' && this.dataButton) {
      this.onDataBtnClick(this.dataButton);
    }
    if (settings.default == 'options' && this.settingsButton) {
      this.onSettingsBtnClick(this.settingsButton)
    }
  },
});

modelNS.toDigitCapacity = function ( markVal ) {
  var markValParts = markVal.toString().split(".");
  markValParts[0] = markValParts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return markValParts.join(".");
}

// Если число на слайде равно или больше 10 000 то оно бьются на разряды (связано с #13848)
modelNS.hasDigitCapacity = function ( value ) {
  return !isNaN(value) && value >= 10000
}

// Строку стиля превратить в объект пригодный для jQuery
modelNS.toStyleObject = function ( strStyles ) {
  if (typeof(strStyles) !== 'string') {
    return {}
  }

  var objStyle = {};
  var rules = strStyles.split(';');
  for (var i=0; i<rules.length; i++) {
    var style = rules[i].split(':');
    var styleName = $.trim(style[0]);
    if (styleName) {
      objStyle[styleName] = $.trim(style[1]);
    }
  }
  return objStyle;
}
