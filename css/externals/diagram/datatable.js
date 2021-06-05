(function() {
	iDiagramNS.FormulaCell = Backbone.View.extend({
		tagName: 'td',
		className: 'formula-cell',
		initialize: function(options) {
			this.formula = options.formula;
			this.category = options.category;
			this.diagram = options.diagram;
			this.dataTable = options.dataTable;
			this.evaluator = new TapDigit.Evaluator();
			this.parent = options.parent;
		},
		render: function() {
			if (this.parent) {
				this.parent.append(this.$el);
			}
			var self = this;
			setTimeout(function() {
				self.checkbox = new modelNS.Checkbox({model: new modelNS.SwitcherModel({
					parent: self.$el,
					disabled: !self.formula,
					checked: self.category.get('formulaEnabled')
				})});
				self.checkbox.render();
				self.listenTo(self.checkbox, 'Change', self.onCheck);

				self.input = new modelNS.Input({
					parent: self.$el,
					value: self.formula,
					width: self.$el.width() - self.checkbox.$el.width() - 8
				});
				self.input.render();
				self.listenTo(self.input, 'Change', self.onChange);
			}, 200);
			return this;
		},
		getValue: function() {
			return this.input.getValue();
		},
		onCheck: function(model) {
			if (model.get('checked')) {
				this.showDialog();
			} else {
				this.category.set({formulaEnabled: false});
				this.dataTable.enableRow(this.category);
			}
		},
		showDialog: function() {
			var self = this;
			this.dialog = new modelNS.PopupView({
				model: new modelNS.Popup({
					content: 'Все введенные данные этого ряда будут потеряны. Продолжить?',
					width: 300,
					// height: 200,
					buttons: [{
						text: 'Да',
						click: function() {
							self.calculateFormula(self.category.get('formula'));
							self.dialog.closePopup();
							self.category.set({formulaEnabled: true});
							// self.dataTable.disableRow(self.category);
					    }
					},
					{
						text: 'Нет',
						click: function() {
							self.dialog.closePopup();
							self.checkbox.uncheck();
							self.category.set({formulaEnabled: false});
					    }
					}]
				})
			});
			this.listenTo(this.dialog, 'PopupClosedOnCloseBtn', function() {
				self.category.set({formulaEnabled: false});
				self.checkbox.uncheck();
			});
			this.diagram.$el.append(this.dialog.render().el);
		},
		calculateFormula: function(value) {
			var	self = this,
			points = this.category.get('points');
			points.each(function(p, i) {
				// try {
					// var v = parseFloat(p.get('value')),
					var v = parseFloat(p.get('axisValue').get('value')),
						expression = value.replace(/x/g, '(' + v + ')');
					p.set({value: self.evaluator.evaluate(expression)});
				// } catch (e) {
				// 	return;
				// }
			});
			this.category.set({formula: value});
			this.dataTable.refreshValues();
		},
		onChange: function(value) {
			if (value || '') {
				this.checkbox.enable();
			} else {
				this.checkbox.uncheck();
				this.checkbox.disable();
			}
			this.category.set({formula: value});
			if (this.category.get('formulaEnabled') && this.category.get('formulaEnabled') == true) {
				this.calculateFormula(value);
			}
		}
	});

	iDiagramNS.TableCell = Backbone.View.extend({
		className: 'value-input-cell',
		initialize: function(options) {
			this.tagName = options.tagName;
			this.parent = options.parent;
			this.point = options.point;
			this.value = options.value;
			this.editable = typeof options.editable != 'undefined' ? Boolean(options.editable) : false;
			this.data = options.data;
			this.category = options.category;
			this.diagram = options.diagram;
			this.cls = options.cls;
			this.inputType = options.inputType;
			this.linear = options.linear;
			this.controlCell = typeof options.controlCell != 'undefined' ? Boolean(options.controlCell) : false;
			this.lastCell = typeof options.lastCell != 'undefined' ? Boolean(options.lastCell) : false;
			this.dataTable = options.dataTable;
			this.disabled = this.category.get('formulaEnabled') != undefined ? Boolean(this.category.get('formulaEnabled')) : false;
			this.columnIndex = options.columnIndex;

			// ##12701 Если пришло число, то поделим его на разряды
			// Если хоть одно число на слайде равно или больше 10 000, то бьются все (#13848)
			if (options.hasDigitCapacity && !isNaN(options.value)) {
				this.value = modelNS.toDigitCapacity( options.value )
			}
		},
		render: function() {
			var self = this;
			this.parent.append(this.$el);
			if (this.cls) {
				this.$el.addClass(this.cls);
			}
			// подсвечиваем заголовки колонок
			if (this.columnIndex !== undefined) {
				this.$el.css('borderBottom', "4px solid " + iDiagramNS.DEFAULT_COLORS[this.columnIndex]);
			};
			if (this.editable == false) {
				var value = this.tagName == 'td' ? this.value : this.value.get('value');
				value = modelNS.valueToLabel(value);
				this.$el.append(value);
				return;
			}
			this.input = new modelNS.Input({
				parent: this.$el,
				value: this.tagName == 'td' ? this.value : this.value.get('value'),
				inputType: this.inputType,
				disabled: !this.controlCell && this.disabled,
				min: 0 // #10291
			});
			this.input.render();
			this.previousValue = this.value;
			if (this.controlCell == true) {
				if (this.tagName == 'td') {
					this.input.$el.hide();
					setTimeout(function() {
						self.input.$el.width(self.$el.width() - 30);
						self.input.$el.show();
					}, 200);
				}
				if ((this.tagName == 'th' && this.data.model.dataJSON.axisXValues.length > 1) ||
					(this.tagName == 'td' && this.data.model.dataJSON.categories.length > 1)) {
					this.deleteButton = new modelNS.Button({
						cls: 'diag-delete-button'
					});
					this.$el.append(this.deleteButton.render().el);
					this.listenTo(this.deleteButton, 'ButtonClicked', this.onDelete);
				}
			}
			if (this.lastCell == true) {
				if ((this.tagName == 'th' && this.data.model.dataJSON.axisXValues.length <= 20) ||
					(this.tagName == 'td' && this.data.model.dataJSON.categories.length < 10)) {
					this.addButton = new modelNS.Button({
						cls: 'diag-add-button'
					});
					this.$el.append(this.addButton.render().el);
					this.listenTo(this.addButton, 'ButtonClicked', this.tagName == 'th' ? this.onAddColumn : this.onAddRow);
				}
			}
			this.listenTo(this.input, 'Change', this.onChange);
			return this;
		},
		getValue: function() {
			return this.input.getValue();
		},
		onAddColumn: function() {
			 var self = this;
			 this.data.model.dataJSON.axisXValues.add({value: ''});
			 this.data.model.dataJSON.categories.each(function(c) {
				c.get('points').add({
					category: c,
					value: '0',
					axisValue: self.data.model.dataJSON.axisXValues.at(self.data.model.dataJSON.axisXValues.length - 1)
				});
			 });
			 if (this.dataTable) {
				 this.dataTable.refreshTable();
			 }
		},
		onAddRow: function() {
			var points = new iDiagramNS.PointCollection(),
				pointsSize = this.data.model.dataJSON.categories.at(0).get('points').length;
			var category = new iDiagramNS.Category({
				color: iDiagramNS.DEFAULT_COLORS[this.data.model.dataJSON.categories.length]
			});
			for (var i = 0; i < pointsSize; i++) {
				points.add({
					category: category,
					value: '0',
					axisValue: this.data.model.dataJSON.axisXValues.at(i - 1)
				});
			}
			category.set({
				title: '',
				points: points
			});
			this.data.model.dataJSON.categories.add(category);
			if (this.dataTable) {
				this.dataTable.refreshTable();
			}
		},
		onDelete: function() {
			if (this.tagName == 'td') {
				this.data.model.dataJSON.categories.remove(this.category);
			} else
			if (this.tagName == 'th') {
				var self = this,
					axisValues = this.data.model.dataJSON.axisXValues;
				axisValues.remove(this.value);
				this.data.model.dataJSON.categories.each(function(c) {
					var points = c.get('points');
					if (!points) {
						return;
					}
					var point = points.where({axisValue: self.value});
					if (!point || point.length == 0) {
						return;
					}
					points.remove(point);
				});
			}
			if (this.dataTable) {
				this.dataTable.refreshTable();
			}
		},
		refreshValue: function() {
			this.input.setText(this.point.get('value'));
		},
		onChange: function(value) {
			try {
				if (parseFloat(value) < parseFloat(this.data.model.dataJSON.minRange)) {
					value = this.data.model.dataJSON.minRange;
					this.input.setText(value);
				} else
				if (parseFloat(value) > parseFloat(this.data.model.dataJSON.maxRange)) {
					value = this.data.model.dataJSON.maxRange;
					this.input.setText(value);
				}
			} catch(e) {}
			if (this.tagName == 'th') {
				this.value.set({value: value});
				return;
			}
			if (!this.category) {
				return;
			}
			if (this.cls.indexOf('category') != -1) {
				this.category.set({title: value});
			} else {
				var point = this.category.get('points').get(this.point);
				if (!point) {
					return;
				}
				point.set({value: value});
			}
			if (!this.diagram) {
				return;
			}
			if (this.linear == false) {
				this.data.model.dataJSON.min = null;
				this.data.model.dataJSON.max = null;
			}
		},
		disableInput: function() {
			this.input.disable();
		},
		enableInput: function() {
			this.input.enable();
		}
	});

	iDiagramNS.DataTable = Backbone.View.extend({
		className: 'diagram-data-table',
		initialize: function(options) {
			this.data = options.data;
			this.categories = this.data.model.dataJSON.categories;
			this.parent = options.parent;
			this.editable = options.editable;
			this.diagram = options.diagram;
			this.linear = typeof options.linear != 'undefined' ? Boolean(options.linear) : false;	 // ??? #9703
			// this.linear = true;	// ???	#9703
		},
		render: function() {

			if (!this.categories) return;

			var self = this,
					axisValues = this.categories.at(0),
					axisTitle = this.diagram.model.dataJSON.axisTitle || '';

			this.tableCells = [];
			this.parent.append(this.$el);
			this.table = $('<table class="data-table"></table>');
			this.header = $('<tr></tr>');

			if (this.editable == 'all') {
					new iDiagramNS.TableCell({
						editable: self.editable,
						tagName: 'td',
						cls: 'category empty',
						parent: this.header,
						value: axisTitle,
						data: this.data,
						diagram: this.diagram,
						// point: p,
						category: this.categories.at(0),
						inputType: 'text',
						linear: this.linear,
						controlCell: true,
						dataTable: this
					}).render();
			} else {
					this.header.append('<th class="empty">'+axisTitle+'</th>');
			}

			this.table.append(this.header);

			// console.log(axisValues.get('points').at(0).get('value'))

			var hasDigitCapacity = this.hasDigitCapacity();

			this.categories.each(function(c, i) {
				var category = $('<tr></tr>');
				var titleInput = new iDiagramNS.TableCell({
					editable: self.editable == 'all',
					tagName: 'td',
					parent: category,
					cls: 'category' + (i == self.categories.length - 1 ? ' last-cell' : ''),
					category: c,
					value: c.get('title'),
					data: self.data,
					diagram: self.diagram,
					inputType: 'text',
					controlCell: true,
					dataTable: self,
					lastCell: i == self.categories.length - 1
				});

				titleInput.render();
				titleInput.$el.css({
					'border-color': c.get('color')
				});

				c.get('points').each(function(p, k) {
					if (i == 0) {
						var inputType = self.linear == true ? 'number' : 'text';
						new iDiagramNS.TableCell({
							editable: self.editable == 'all' || (this.editable == 'data' && inputType == 'number'),
							tagName: 'th',
							cls: 'column_' + k,
							parent: self.header,
							value: p.get('axisValue'),
							hasDigitCapacity: hasDigitCapacity,
							data: self.data,
							diagram: self.diagram,
							point: p,
							category: c,
							inputType: inputType,
							linear: self.linear,
							controlCell: true,
							lastCell: k == c.get('points').length - 1,
							columnIndex:k,
							dataTable: self
						}).render();
					}
					var currentCell = new iDiagramNS.TableCell({
						editable: self.editable,
						cls: 'column_' + k,
						tagName: 'td',
						parent: category,
						category: c,
						value: p.get('value'),
						hasDigitCapacity: hasDigitCapacity,
						point: p,
						data: self.data,
						diagram: self.diagram,
						inputType: 'number',
						linear: self.linear,
						dataTable: self
					});
					currentCell.render();
					self.tableCells.push(currentCell);
				});
				if (self.linear == true && self.editable == true) {
					if (i == 0) {
						self.header.append('<th class="formula">Формула</th>');
					}
					new iDiagramNS.FormulaCell({
						parent: category,
						category: c,
						diagram: self.diagram,
						formula: c.get('formula'),
						dataTable: self
					}).render();
				}
				self.table.append(category);
			});

			// append footer visual tr for round corners #8480
			var l = this.table.find('tr th').length, td = '';
			for (var i=0; i<l; i++) td += '<td></td>';
			this.table.append('<tr class="footer">'+td+'</tr>');	// footer

			this.$el.append(this.table);
			return this;
		},
		hasDigitCapacity: function () {
			var categories = this.categories.models;

			for (var i=0; i<categories.length; i++) {
				var points = categories[i].get('points').models;

				for (var p=0; p < points.length; p++) {
					var point = points[p];

					if (modelNS.hasDigitCapacity( point.get('value') )) {
						return true;
					}

					if (modelNS.hasDigitCapacity( point.get('axisValue') )) {
						return true;
					}
				}

			}
		},
		refreshValues: function() {
			this.tableCells.forEach(function(cell) {
				cell.refreshValue();
			});
		},
		refreshTable: function() {
			this.$el.html('');
			this.render();
		},
		disableRow: function(category) {
			this.rowSwitch(category, false);
		},
		enableRow: function(category) {
			this.rowSwitch(category, true);
		},
		rowSwitch: function(category, on) {
			this.tableCells.forEach(function(cell) {
				var c = cell.category;
				if (c == category) {
					if (on) {
						cell.enableInput();
					} else {
						cell.disableInput();
					}
				}
			});
		}
	});
})();
