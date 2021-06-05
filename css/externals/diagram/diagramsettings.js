var iDiagramNS = iDiagramNS || {};

(function() {
	iDiagramNS.DiagramSettings = Backbone.View.extend({
		className: 'diagram-settings',
		initialize: function(options) {
			this.options = options;
		},
		render: function() {
			this.options.parent.append(this.$el);
			this.layer = new modelNS.SingleLayout({
				cls: 'diagram-wrp',
				selectable : true
			});
			this.$el.append(this.layer.render().el);
			if (this.options.cls) {
				this.$el.addClass(this.options.cls);
			}
			this.unitWidth = (this.$el.width() - 90) / 4;
			this.renderTitleInputs();
			this.renderTypeCombobox();
			this.renderMinValueView();
			this.renderMaxValueView();
			this.renderPrimaryStepsView();
			this.renderSecondaryStepsView();
			return this;
		},
		renderTitleInputs: function() {
			this.titleLayout = new modelNS.SingleLayout({
				cls: 'settings-row title-layout',
				parent: this.layer.$el,
				selectable : true
			});
			this.titleLayout.render();
			this.titleLayoutInner = this.constructRowInner(this.titleLayout.$el);
			this.titleXLabel = this.constructLabel(this.titleLayoutInner.$el, 'Подпись к оси X', 140);
			var inputWidth = (this.titleLayoutInner.$el.width() - (this.titleXLabel.$el.width() * 2)) / 2;
			this.titleXInput = this.constructInput(this.titleLayoutInner.$el, inputWidth);
			var axisXData = this.options.data.model.dataJSON.axisXLabel;
			var axisX = $(axisXData).text() ? $(axisXData).text() : axisXData;
			this.titleXInput.setText(axisX);
			this.listenTo(this.titleXInput, 'Change', this.onAxisXChange);
			this.titleYLabel = this.constructLabel(this.titleLayoutInner.$el, 'Подпись к оси Y', 140);
			this.titleYInput = this.constructInput(this.titleLayoutInner.$el, inputWidth);
			var axisYData = this.options.data.model.dataJSON.axisYLabel;
			var axisY = $(axisYData).text() ? $(axisYData).text() : axisYData;
			this.titleYInput.setText(axisY);
			this.listenTo(this.titleYInput, 'Change', this.onAxisYChange);
		},
		renderTypeCombobox: function() {
			this.typeSelectLayout = new modelNS.SingleLayout({
				cls: 'settings-row',
				parent: this.layer.$el,
				selectable : true
			});
			this.typeSelectLayout.render();
			this.typeLayoutInner = this.constructRowInner(this.typeSelectLayout.$el);
			this.typeCombobox = new modelNS.Select({
				parent: this.typeLayoutInner.$el,
				selected: this.options.data.model.dataJSON.type,
				data: ['Линейная', 'Квадратичная', 'Кубическая', 'Квадратно-коренная', 'Логарифмическая'],
				width: 300
			});
			this.typeCombobox.render();
			this.listenTo(this.typeCombobox, 'Change', this.onTypeChange);
		},
		renderMinValueView: function() {
			this.minValueLayout = new modelNS.SingleLayout({
				cls: 'settings-row',
				parent: this.layer.$el,
				selectable : true
			});
			this.minValueLayout.render();
			this.minValueLayoutInner = this.constructRowInner(this.minValueLayout.$el);
			this.minValueLabel = this.constructLabel(this.minValueLayoutInner.$el, 'Минимальное значение', 130);
			this.minValueInput = this.constructInput(this.minValueLayoutInner.$el, 90, 'number');
			this.minValueInput.setText(this.options.data.model.dataJSON.min);
			if (this.options.data.model.dataJSON.minAuto == true) {
				this.minValueInput.disable();
			}
			this.listenTo(this.minValueInput, 'Change', this.minValueChange);
			this.minValueSwitcher = this.constructSwitcher(this.minValueLayoutInner.$el, 'Авто', this.unitWidth, {check: this.options.data.model.dataJSON.minAuto});
			this.listenTo(this.minValueSwitcher, 'Change', this.onMinValAuto);
		},
		renderMaxValueView: function() {
			this.maxValueLayout = new modelNS.SingleLayout({
				cls: 'settings-row',
				parent: this.layer.$el,
				selectable : true
			});
			this.maxValueLayout.render();
			this.maxValueLayoutInner = this.constructRowInner(this.maxValueLayout.$el);
			this.maxValueLabel = this.constructLabel(this.maxValueLayoutInner.$el, 'Максимальное значение', 130);
			this.maxValueInput = this.constructInput(this.maxValueLayoutInner.$el, 90, 'number');
			if (this.options.data.model.dataJSON.maxAuto == true) {
				this.maxValueInput.disable();
			}
			this.maxValueInput.setText(this.options.data.model.dataJSON.max);
			this.listenTo(this.maxValueInput, 'Change', this.maxValueChange);
			this.maxValueSwitcher = this.constructSwitcher(this.maxValueLayoutInner.$el, 'Авто', this.unitWidth, {check: this.options.data.model.dataJSON.maxAuto});
			this.listenTo(this.maxValueSwitcher, 'Change', this.onMaxValAuto);
		},
		renderPrimaryStepsView: function() {
			this.primaryStepsLayout = new modelNS.SingleLayout({
				cls: 'settings-row',
				parent: this.layer.$el,
				selectable : true
			});
			this.primaryStepsLayout.render();
			this.primaryStepsLayoutInner = this.constructRowInner(this.primaryStepsLayout.$el);
			this.primaryStepsLabel = this.constructLabel(this.primaryStepsLayoutInner.$el, 'Шаг первичных меток', 130);
			this.primaryStepsInput = this.constructInput(this.primaryStepsLayoutInner.$el, 90, 'number');
			this.primaryStepsInput.setText(this.options.data.model.dataJSON.step);
			if (this.options.data.model.dataJSON.stepAuto == true) {
				this.primaryStepsInput.disable();
			}
			this.listenTo(this.primaryStepsInput, 'Change', this.stepChange);
			this.primaryStepsSwitcher = this.constructSwitcher(this.primaryStepsLayoutInner.$el, 'Авто', this.unitWidth, {check: this.options.data.model.dataJSON.stepAuto});
			this.listenTo(this.primaryStepsSwitcher, 'Change', this.onStepAuto);
			this.primaryStepsSwitcherMarks = this.constructSwitcher(this.primaryStepsLayoutInner.$el, 'Метки', this.unitWidth, {check: this.options.data.model.dataJSON.marks});
			this.listenTo(this.primaryStepsSwitcherMarks, 'Change', this.onMarksChange);
			this.primaryStepsSwitcherLines = this.constructSwitcher(this.primaryStepsLayoutInner.$el, 'Линии', this.unitWidth, {check: this.options.data.model.dataJSON.grid});
			this.listenTo(this.primaryStepsSwitcherLines, 'Change', this.onGridChange);
		},
		renderSecondaryStepsView: function() {
			var dataJSON = this.options.data.model.dataJSON;

			this.secondaryStepsLayout = new modelNS.SingleLayout({
				cls: 'settings-row',
				parent: this.layer.$el,
				selectable : true
			});
			this.secondaryStepsLayout.render();
			this.secondaryStepsLayoutInner = this.constructRowInner(this.secondaryStepsLayout.$el);
			this.secondaryStepsLabel = this.constructLabel(this.secondaryStepsLayoutInner.$el, 'Шаг вторичных меток', 130);
			this.secondaryStepsInput = this.constructInput(this.secondaryStepsLayoutInner.$el, 90, 'number');
			this.secondaryStepsInput.setText(this.options.data.model.dataJSON.stepY);
			if (this.options.data.model.dataJSON.stepAuto == true) {
				this.secondaryStepsInput.disable();
			}
			this.listenTo(this.secondaryStepsInput, 'Change', this.stepChange);
			this.secondaryStepsSwitcher = this.constructSwitcher(this.secondaryStepsLayoutInner.$el, 'Авто', this.unitWidth, {check: this.options.data.model.dataJSON.stepAuto});
			this.listenTo(this.secondaryStepsSwitcher, 'Change', this.onStepAuto);

			this.secondaryStepsSwitcherMarks = this.constructSwitcher(this.secondaryStepsLayoutInner.$el, 'Метки', this.unitWidth, {check: dataJSON.marksY});
			this.listenTo(this.secondaryStepsSwitcherMarks, 'Change', function (chk) { dataJSON.marksY = chk.get('checked') });

			this.secondaryStepsSwitcherLines = this.constructSwitcher(this.secondaryStepsLayoutInner.$el, 'Линии', this.unitWidth, {check: dataJSON.gridY});
			this.listenTo(this.secondaryStepsSwitcherLines, 'Change', function (chk) { dataJSON.gridY = chk.get('checked') });
		},
		constructRowInner: function(layout) {
			var inner = new modelNS.SingleLayout({
				cls: 'inner',
				parent: layout,
				selectable : true
			});
			inner.render();
			return inner;
		},
		constructInput: function(layout, width, type) {
			var input = new modelNS.Input({
				parent: layout,
				width: width,
				inputType: type
			});
			input.render();
			return input;
		},
		constructLabel: function(layout, text, width) {
			var label = new modelNS.Label({
				parent: layout,
				cls: 'settings-label',
				width: width,
				text: text
			});
			label.render();
			return label;
		},
		constructSwitcher: function(layout, label, width, options) {
			var wrapper = new modelNS.SingleLayout({
				parent: layout,
				cls: 'switcher-wrapper',
				width: width,
				selectable : true
			});
			wrapper.render();

			var switcher = new modelNS.Checkbox({
				model: new modelNS.SwitcherModel({
					// label: label,
					cls: 'settings-switcher',
					checked: options && typeof options.check != 'undefined' ? options.check === true : false
				})
			});
			wrapper.$el.append(switcher.render().el);

			var labelView = new modelNS.Label({
				text: label,
				height: 48
			});
			wrapper.$el.append(labelView.render().el);

			var width = labelView.$el.outerWidth() + switcher.$el.outerWidth(),
				padding = (wrapper.$el.width() - width) / 2;

			wrapper.$el.css({'padding': '0 ' + padding + 'px'});

			return switcher;
		},
		onMinValAuto: function(switcherModel) {
			if (switcherModel.get('checked') == true) {
				this.options.data.model.dataJSON.min = null;
				this.minValueInput.disable();
			} else {
				this.minValueInput.enable();
			}
			this.options.data.model.dataJSON.minAuto = switcherModel.get('checked');
		},
		onMaxValAuto: function(switcherModel) {
			if (switcherModel.get('checked') == true) {
				this.options.data.model.dataJSON.max = null;
				this.maxValueInput.disable();
			} else {
				this.maxValueInput.enable();
			}
			this.options.data.model.dataJSON.maxAuto = switcherModel.get('checked');
		},
		onStepAuto: function(switcherModel) {
			if (switcherModel.get('checked') == true) {
				this.options.data.model.dataJSON.step = null;
				this.primaryStepsInput.disable();
			} else {
				this.primaryStepsInput.enable();
			}
			this.options.data.model.dataJSON.stepAuto = switcherModel.get('checked');
		},
		onAxisXChange: function(value) {
			var axisXData = this.options.data.model.dataJSON.axisXLabel;
			var axis = $('<axis><axis>');
			axis.html(axisXData);
			if (axis.html()) {
				var oldValue = $(axis).text();
				if (!value) {
					value = 'X';
				}
				this.options.data.model.dataJSON.axisXLabel = this.options.data.model.dataJSON.axisXLabel.replace(oldValue, value);
			} else {
				this.options.data.model.dataJSON.axisXLabel = value;
			}
		},
		onAxisYChange: function(value) {
			var axisYData = this.options.data.model.dataJSON.axisYLabel;
			var axis = $('<axis><axis>');
			axis.html(axisYData);
			if (axis.html()) {
				var oldValue = $(axis).text();
				if (!value) {
					value = 'Y';
				}
				this.options.data.model.dataJSON.axisYLabel = this.options.data.model.dataJSON.axisYLabel.replace(oldValue, value);
			} else {
				this.options.data.model.dataJSON.axisYLabel = value;
			}
		},
		onMarksChange: function(switcherModel) {
			this.options.data.model.dataJSON.marks = switcherModel.get('checked');
		},
		onGridChange: function(switcherModel) {
			this.options.data.model.dataJSON.grid = switcherModel.get('checked');
		},
		onTypeChange : function (value)
		{
			var typePow = {
				"0" : 1,
				"1" : 2,
				"2" : 3,
				"3" : 0.5
			}

			var typeLg = {
				"4" : 10
			}

			this.options.data.model.dataJSON.type = value;
			this.options.data.model.dataJSON.pow = typePow[value];
			this.options.data.model.dataJSON.lg = typeLg[value];
		},
		minValueChange: function(value) {
			if (!value || isNaN(parseFloat(value))) {
				return;
			}
			try {
				if (parseFloat(value) < parseFloat(this.options.data.model.dataJSON.minRange)) {
					value = this.options.data.model.dataJSON.minRange;
					this.minValueInput.setText(value);
				}
			} catch(e) {}
			this.options.data.model.dataJSON.min = parseFloat(value);
		},
		maxValueChange: function(value) {
			if (!value || isNaN(parseFloat(value))) {
				return;
			}
			try {
				if (parseFloat(value) > parseFloat(this.options.data.model.dataJSON.maxRange)) {
					value = this.options.data.model.dataJSON.maxRange;
					this.maxValueInput.setText(value);
				}
			} catch(e) {}
			this.options.data.model.dataJSON.max = parseFloat(value);
		},
		stepChange: function(value) {
			if (!value || isNaN(parseFloat(value))) {
				return;
			}
			try {
				if (parseFloat(value) < 0) {
					value = Math.abs(value);
					this.primaryStepsInput.setText(value);
				}
				if (parseFloat(value) > parseFloat(this.options.data.model.dataJSON.maxRange)) {
					value = this.options.data.model.dataJSON.maxRange;
					this.primaryStepsInput.setText(value);
				}
			} catch(e) {}
			this.options.data.model.dataJSON.step = parseFloat(value);
		},
		refresh: function() {
			this.$el.html('');
			this.$el.remove();
			this.render();
		}
	});
})();
