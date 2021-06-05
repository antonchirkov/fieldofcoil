
function IDiagramData(xmlData, wrapper, basePath, params) {

	var model;

	this.init = function() {

		model = new modelNS.IDiagramData({
			xmlData: xmlData,
			wrapper: wrapper,
			basePath: basePath,
			restyling: true,
			width: wrapper.data('width'),
			height: wrapper.data('height'),
			params:params
		});
		return new modelNS.IDiagramDataView({model: model}).render();
	};
}


modelNS.addLangs({
	ru: {
        maxColumnsSelect: 'Вы уже исчерпали количество столбцов (измерений).<br/>Переходите на следующий слайд.',
	}
});

modelNS.IDiagramData = modelNS.BaseModel.extend({
	parseXML: function ()
	{
		modelNS.BaseModel.prototype.parseXML.apply(this, arguments);

		return {
			maxColumnsSelect: this.$root.attr('maxcolumnsselect')*1
		}
	}
});


modelNS.IDiagramDataView = modelNS.BaseModelView.extend({

	initialize: function () {
		modelNS.BaseModelView.prototype.initialize.apply(this, arguments);

		this.selectedColumns = [0];
	},

	render: function() {
		var self = this,
				$table = this.model.$root.find('table');

		modelNS.BaseModelView.prototype.render.apply(this);

		this.$scroll = $('<div class="scroll"/>').appendTo(this.$el);
		this.$scroll.append('<table>' + courseML.getHTMLFromCourseML($table) + '</table>');// #11412 К функции getHTMLFromCourseML добавлен объект courseML

		// fixDashes
		this.$el.find('th, td').each(function () {
			if (this.innerHTML == parseFloat(this.innerHTML)) {
				this.innerHTML = courseML.fixDash(this.innerHTML.replace("-", "–"));// #11412 К функции fixDash добавлен объект courseML
				this.className += ' number';
			}
		});

		this.$el.find('td').wrapInner('<div/>');

		this.$el.find('td, th').click(function () {
			self.selectColumn($(this).index());
		});

		// preselect
		for (var i=0; i<this.selectedColumns.length; i++) {
			this.selectColumn(this.selectedColumns[i]);
		}

		return this;
	},

	selectColumn: function ( index ) {
		if (this.selectedColumns.length == this.model.dataJSON.maxColumnsSelect) {
			$('<div/>').html(modelNS.lang('maxColumnsSelect')).popup({minHeight:0});
			return;
		}

		this.$el.find('td:nth-child('+(index+1)+')').addClass('selected');
		if (this.selectedColumns.indexOf(index)<0) this.selectedColumns.push(index);

		this.updateDiagramData();
	},

	updateDiagramData: function () {
		var self = this;

		this.model.$root.find('table').each(function (index) {
			var $table = $(this),
					$data = $('<table/>'),
					datafor = $table.attr('datafor');

			self.selectedColumns.sort(function (a,b) {
		    return a - b;
			});

			$table.find('tr').each(function (index) {
				var $tr = $(this);

				// игнорируем промежуточны th ряды
				if (!$tr.find('td').length && index > 0) {
					return;
				}

				var $dataTR = $('<tr/>').appendTo($data);

				for (var i=0; i<self.selectedColumns.length; i++) {
					var columnIndex = self.selectedColumns[i];
					if (index == 0) {
						$dataTR.append($tr.find('th:nth-child('+(columnIndex+1)+')').clone());
					} else {
						$dataTR.append($tr.find('td:nth-child('+(columnIndex+1)+')').clone());
					}
				}
			});

			globalParam['datafor' + datafor] = $data.html();

		});
	}


});
