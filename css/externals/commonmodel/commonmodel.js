
function CommonModel(xmlData, wrapper, basePath, params) {

	var model;

	this.init = function() {

		model = new modelNS.CommonModel({
			xmlData: xmlData,
			wrapper: wrapper,
			basePath: basePath,
			restyling: true,
			// scalable: false,
			// defaults: {},
			width: wrapper.data('width'),
			height: wrapper.data('height'),
			params:params
		});
		return model;
	};

}

modelNS.CommonModel = modelNS.BaseModel.extend({
	parseXML: function(xmlData) {
		modelNS.BaseModel.prototype.parseXML.apply(this, arguments);

		var $scripts = this.$root.find('script'),
				$styles = this.$root.find('style'),
				$include = this.$root.find('include'),
				scripts = [],
				styles = [],
				models = [];

		$include.each(function () {
			models.push($(this).attr('model'));
		});

		$scripts.each(function () {
			var $this = $(this),
					src = $this.attr('src'),
					lib = $this.attr('lib');

			scripts.push({src:src, lib:lib});
		});

		$styles.each(function () {
			var $this = $(this),
					src = $this.attr('src'),
					lib = $this.attr('lib');

			styles.push({src:src, lib:lib});
		});

		return {
			scripts: scripts,
			styles: styles,
			models: models,
			type: this.$root.attr('type')
		};
	},

	initialize: function(options) {
		modelNS.BaseModel.prototype.initialize.apply(this, arguments);

		var loadStyles = [],
				scripts = this.dataJSON.scripts,
				styles = this.dataJSON.styles,
				models = this.dataJSON.models,
				type = this.dataJSON.type,
				self = this,
				modelsReady = 0,
				modelsDeferred = null;

		if (models.length) {
			modelsDeferred = new $.Deferred();
			function onModelLoaded () {
				if (++modelsReady == models.length) {
					modelsDeferred.resolve('models ready!');
				}
			};

			for (var i=0; i<models.length; i++) {
				courseML.preLoadModel(models[i], onModelLoaded);
			}
		}

		for (var i=0; i<styles.length; i++) {
			loadStyles.push(courseML.modelPath(options.params.jsID + '/' + styles[i].src));
		}
		courseML.loadStyles(loadStyles);

		var loadScripts = [];

		for (var i=0; i<scripts.length; i++) {
			var src = scripts[i].src,
					lib = scripts[i].lib;
			loadScripts.push(
				lib ? CourseConfig.templatePath + lib : courseML.modelPath(options.params.jsID + '/' + src)
			);
		}

		var commonDeferred = new $.Deferred();
		courseML.loadScripts(loadScripts, function () {
			courseML.preLoadModel('commonmodel', function () {
				commonDeferred.resolve('commonmodel ready!');
			});
		});

		this.modelReady = $.when(modelsDeferred, commonDeferred)
			.then(function () {
					return courseML.addModuleanswer(
							new modelNS.CommonModel.models[type](
								options.xmlData,
								options.wrapper,
								options.basePath,
								options.params
							).init(),
						options.params
					)
			})
	},

});

modelNS.CommonModel.models = {};
