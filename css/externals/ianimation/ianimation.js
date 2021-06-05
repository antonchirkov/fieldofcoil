
/**
 * Модель IAnimation
 *
 * @todo внедрить player-controls из BaseModel
 */

function IAnimation(xmlData, wrapper, basePath, params) {

	var model,view;

	this.init = function() {

		model = new modelNS.IAnimation({
			xmlData: xmlData,
			wrapper: wrapper,
			basePath: basePath,
			scalable: false,
			defaults: {
				width: 600,
				height: 400,
				minWidth: 400,
				maxWidth: 1200,
				minHeight: 300,
				maxHeight: 1000,
				position: 'left',
				movieControlsWidth: 170,
			},
			width: wrapper.data('width')||null,
			height: wrapper.data('height')||null,
			params:params,
		});
		return view = new modelNS.IAnimationView({model: model}).renderOnShow();
	};

}



modelNS.IAnimation = modelNS.BaseModel.extend({
	restyling: "title",
	defaults: _.extend({}, modelNS.BaseModel.prototype.defaults, {}),
	initialize: function(options) {
		modelNS.BaseModel.prototype.initialize.apply(this, [options]);
		this.options = options;
	},
	parseXML: function(xmlData) {
		var $model = this,
		    $xml = $(typeof(xmlData) == 'string' ? $.parseXML(xmlData): xmlData),
				$root = $xml.find('ianimation'),
				$title = $xml.find('ianimation>title'),
				xmlHeigh = $root.attr('height')*1||0,
				xmlWidth = $root.attr('width')*1||0,
				$controls = $xml.find('controls'),
				position = $controls.attr('position'),
				$states = $xml.find('states'),
				captionPosition = $states.attr('position'),
				movieHeight = $states.attr('height')*1||0,
				movieWidth = $states.attr('width')*1||0,
				captionHeight = $states.attr('captionheight')*1||0,
				movieButtons = $states.attr('buttons'),
				paramsState = this.options.params && this.options.params.id,
				defaultState = [],
				mediaType,
				showCaption,
				states = [],
				steps = [],
				jsID = this.options.params.jsID,
				basePath = this.options.basePath,
				title = courseML.getHTMLFromCourseML($title);

		// если заголовок пустой, но кнопки рсположены сверху
		if (!title && movieButtons !== 'bottom') {
			title = '&#160;'; // &nbsp;
		}

		if (!this.validate( xmlData )) {
			return;
		}

		this.height = this.options.height || xmlHeigh || this.defaults.height;
		if (this.height < this.defaults.minHeight) this.height = this.defaults.minHeight;
		if (this.height > this.defaults.maxHeight) this.height = this.defaults.maxHeight;

		this.width = this.options.width || xmlWidth || this.defaults.width;
		if (this.width < this.defaults.minWidth) this.width = this.defaults.minWidth;
		if (this.width > this.defaults.maxWidth) this.width = this.defaults.maxWidth;

		// prepare states
		$states.find('state').each(function () {

			var $state = $(this),
					id = $state.attr('id'),
					caption,
					caption2,
					file,
					files = [],
					active = [],
					$captions = $state.find('caption').not('caption[display=always]').not('caption[display=finish]'),
					$alwaysCaption = $state.find('caption[display=always]'),
					$finishCaption = $state.find('caption[display=finish]');

			if ($alwaysCaption.length > 1) {
					$alwaysCaption = $($alwaysCaption[0]);
			} else if (!$alwaysCaption.length) {
					$alwaysCaption = $($captions[0]);
			}

			if ($finishCaption.length>1) {
					$finishCaption = $($finishCaption[0]);
			} else if (!$finishCaption.length) {
					if ($captions.length > 1) $finishCaption = $($finishCaption[$captions[$captions.length-1]]);
			}

			// standart rules for get course formated html
			if (window.courseML) {
				if (!$alwaysCaption.attr('autonumber')) $alwaysCaption.attr('autonumber', 'false');
				caption = courseML.getHTMLFromCourseML($alwaysCaption);

				if (!$finishCaption.attr('autonumber')) $finishCaption.attr('autonumber', 'false');
				caption2 = courseML.getHTMLFromCourseML($finishCaption);
			} else {
				caption = xmlToHtml($alwaysCaption);
				caption2 = xmlToHtml($finishCaption);
			}

			if (caption || caption2) showCaption = true;

			$state.find('movie').each(function () {
				var file = $(this).attr('file');

				if (basePath.indexOf(jsID)>=0) {	// фикс для РЭШ, basePath не содержит jsID поэтому оставляем в file
					file = file.replace(jsID + '/', '');
				}
				files.push(file);
			});

			$state.find('active').each(function () {
				active.push( $(this).attr('id') );
			});

			if (id && id == paramsState) defaultState = active;
			states[active.sort().join('.')] = {
				id: id,
				file: files[0],
				files: files,
				caption: caption,
				caption2: caption2,
				active: active,
				title: courseML.getHTMLFromCourseML($state.find('title')),
			};

			if (!mediaType) {
				mediaType = (files[0]||"").replace(/.*\.(.*)/,"$1");
			}

		});

		// prepare steps
		$controls.find('step').each(function () {	steps.push($(this).attr('id')) });

		// default position
		if (['left', 'right', 'top', 'bottom'].indexOf(position)<0) position = this.defaults.position;

		this.popups = this.parsePopups($xml);

		return _.extend($model.defaults, {
			width: $model.width,
			height: $model.height,
			position: position,
			captionPosition: captionPosition,
			controls: $controls,
			mediaType: mediaType,
			showCaption: showCaption,
			title: title,
			movie: {
				width: movieWidth,
				height: movieHeight,
				captionHeight: captionHeight,
				controlsWidth: $model.defaults.movieControlsWidth,
				states: states,
				steps: steps,
				default: defaultState,
				buttons: movieButtons
			}
		})
	},

	validate: function ( xmlData )
	{
		return true;
	}
});




modelNS.IAnimationView = modelNS.BaseModelView.extend({
	type: 'ianimation',
	events: {
		'click .steps .step': 'onStep'
	},

	initialize: function(options) {
		window.A = this;
		var params = options.model.dataJSON,
				mediaType = params.mediaType,
				self = this;

		this.Media = new modelNS.IAnimationMedia[mediaType]({
			model: this.model,
			view: self
		});

		this.$el.addClass('loading');

		this.popupCollection = new modelNS.PopupCollection(this.model.popups);
	},

	onStep: function (e) {
		this.setActiveStep(e.currentTarget);
	},

	play: function () {
        // #11469 Если находимся на последнем шаге, то при нажатии кнопки play будет воспроизводиться последний шаг
        var isLast = this.getActiveStep().hasClass('last');
		if (this.animationFinished && !isLast) {
			this.playNext();
		} else {
			this.playMovie();
		}
	},

	onMovieEnd: function () {
		var self = this,
				isFilm = this.PlayerControls.isFilm(),
				isLast = this.getActiveStep().hasClass('last'),
				hasCaptionFinish;

		if (!this.$el.is(':visible')) return;	// protect IE if slide was changed

		if (this.animationFinished) return;

		this.movieEnded();
		if (this.setCaptionFinish()) hasCaptionFinish = true;

		// #11469 Не блокируем кнопку play, если находимся на последнем шаге
		/*if (isLast) {
			this.PlayerControls.end();
			return;
		}*/

		if (isFilm) {
			if (hasCaptionFinish) {
				setTimeout(function () { self.playNext() }, 3000);	// таймаут вреден
			} else {
				this.playNext();
			}
		}
	},

	movieEnded: function ()
	{
		// if slide was closed
		if (!this.$el.is(":visible")) return;

		this.pauseMovie();
		this.PlayerControls.showPlay();
		this.animationFinished = true;
	},

	setCaptionFinish: function ()
	{
			var params = this.model.dataJSON,
					states = params.movie.states,
					curActiveId = this.getCurrentActiveId(),
					curState = states[curActiveId];

			// if (!curState) return; // ??? bug from email, curState - undefined

			if (this.$caption) {
				if (curState.caption2) {
					this.updateCaption();
					return true;
				}
			}
	},

	updateTitle: function () {
		var self = this,
				params = this.model.dataJSON,
				states = params.movie.states,
				curActiveId = this.getCurrentActiveId(),
				curState = states[curActiveId],
				title = curState.title;

		if (title) {
			this.movieContainer.setTitle(title);
		}
	},

	updateCaption: function () {
		var self = this,
				params = this.model.dataJSON,
				states = params.movie.states,
				curActiveId = this.getCurrentActiveId(),
				curState = states[curActiveId];

		if (this.$caption) {
			var captionKey = this.animationFinished && curState.caption2 ? "caption2": "caption";

			// caption - отдельный елемент
			// что бы преобразованные формулы в Safari не пропадали
			if (!curState['$' + captionKey]) {
				curState['$' + captionKey] = $('<td class="caption-td">'+curState[captionKey]+'</td>').appendTo(this.$caption.parent());
			}

			this.$caption.hide();
			//this.$caption = curState['$' + captionKey].show(); // #12660 Закомментил
            this.$caption = curState['$' + captionKey].hide(); // #12660 При видимом блоке появляется скролл

			// cache updated math jax
			// if (PlayerCourse.updateMathJax) {
				if (!curState["mathUpdated_" + captionKey]) {
					var captionIndex = (this.captionIndex||0) + 1;
					this.captionIndex = captionIndex;
					PlayerCourse.updateMathJax(function () {
						self.$caption.show(); // #12660 Показываем блок только после отработки MathJax
						if (captionIndex == self.captionIndex) {
							curState["mathUpdated_" + captionKey] = true;
						}
					});
				} else {
					// #12660 Если подпись уже в кеше, то отобразим ее
                    self.$caption.show();
				}
			// } else {
			// 	console.warn("PlayerCourse.updateMathJax not defined");
			// }

		}

	},

	render: function() {
		modelNS.BaseModelView.prototype.render.apply(this);
		this.$el.addClass('ianimation');

		var params = this.model.dataJSON,
				sizes = _.pick(params, ["width", "height", "minWidth", "minHeight", "maxWidth", "maxHeight"]);

		// размеры модели
		this.$el.css(sizes);

		// layout
		this.renderLayout();

		// элементы управления
		this.renderControls();

		// подпись
		this.renderCaption();

		// подгрузка анимаций
		this.renderMovie();

		// movie controls
		this.renderMovieButtons ();

		// calculate controls height
		this.calculateControlsHeight();

		// default step select
		this.defaultStep();

		// this.onChange();

		// активируем первый шаг
		// this.activateStep( this.getFirstStep() );

		return this;
	},

	renderMovie: function () {
		this.movieContainer = new modelNS.SingleLayout({
			title: this.model.dataJSON.title,
			parent: this.$moviePane,
			skin: true,
			titleWidth: this.$moviePane.width() - 160*2,
		}).render();

		// var titleWidth = ;
		// this.movieContainer.$el.find('.title-bar>span').width(); // размеры
		// if ($title.width() > titleTextWidth) {
		// 	$title.attr('title', $title.text()).tooltip();
		// }

		this.model.headerHeight = this.movieContainer.$head ? this.movieContainer.$head.height(): 0;
		this.Media.render(this.movieContainer.$el);
	},

	renderLayout: function () {
		var params = this.model.dataJSON,
				position = params.position,
				captionPosition = params.captionPosition,
				movieWidth = params.movie.width,
				movieHeight = params.movie.height,
				captionHeight = params.movie.captionHeight,
				controlsWidth = params.movie.controlsWidth,
				width = params.width,
				height = params.height;

		if (['right', 'top', 'left', 'bottom'].indexOf(position)<0) position = 'left';
		this.$el.addClass('position-'+position);

		switch (position) {
			case 'top':
				this.mainLayout = new modelNS.DualHorizontalLayout({
					nopadding: true,
					bottomPaneHeight: movieHeight + captionHeight,
					parent: this.$el
				}).render();

				this.$movieCaptionParent = this.mainLayout.$bottomPane;
				this.$ctrlPane = this.mainLayout.$topPane;
				break;

			case 'right' :
					this.mainLayout = new modelNS.DualVerticalLayout({
						nopadding: true,
						firstPaneWidth: movieWidth,
						parent: this.$el
					}).render();

					this.$movieCaptionParent = this.mainLayout.$firstPane;
					this.$ctrlPane = this.mainLayout.$secondPane;
				break;

			case 'bottom':
				this.mainLayout = new modelNS.DualHorizontalLayout({
					nopadding: true,
					topPaneHeight: movieHeight + captionHeight,
					parent: this.$el
				}).render();

				this.$movieCaptionParent = this.mainLayout.$topPane;
				this.$ctrlPane = this.mainLayout.$bottomPane;

				break;

			default :	// left
				this.mainLayout = new modelNS.DualVerticalLayout({
					nopadding: true,
					firstPaneWidth: width-movieWidth,
					secondPaneWidth: movieWidth,
					parent: this.$el
				}).render();
				// this.mainLayout.$firstPane.addClass('nopadding');
				this.mainLayout.$secondPane.addClass('nopadding');

				this.$movieCaptionParent = this.mainLayout.$secondPane;
				this.$ctrlPane = this.mainLayout.$firstPane;

				// this.views.push(this.pictureViewLayout);
		}

		// movie and caption render
		if (captionPosition == 'top') {
			this.movieCaptionLayout = new modelNS.DualHorizontalLayout({
				nopadding: true,
				bottomPaneHeight: movieHeight,
				parent: this.$movieCaptionParent
			}).render();
			this.$moviePane = this.movieCaptionLayout.$bottomPane;
			this.$captionPane = this.movieCaptionLayout.$topPane;
			this.$captionPane.addClass('at-top');
		} else {
			this.movieCaptionLayout = new modelNS.DualHorizontalLayout({
				nopadding: true,
				topPaneHeight: movieHeight,
				parent: this.$movieCaptionParent
			}).render();
			this.$moviePane = this.movieCaptionLayout.$topPane;
			this.$captionPane = this.movieCaptionLayout.$bottomPane;
		}
		this.$moviePane.addClass('movie-pane');
	},

	renderCaption: function () {
		var params = this.model.dataJSON,
				showCaption = params.showCaption;

		if (showCaption) {
			$('<div class="caption-wrapper"/>')
				.appendTo(this.$captionPane)
				.append($('<div class="caption"><table class="caption-table"><tr><td class="caption-td"></td></tr></table></div>'));	// table used for middle valign
			this.$caption = this.$captionPane.find('.caption-td');
			this.handlePopups(this.$caption);
		}
	},

	renderControls: function () {
		this.renderSteps();
		this.renderChoices ();
		this.renderOptions ();
	},

	getCurrentActiveId: function () {
		var active = [];
		this.$el.find('.active:not(.disabled), .checked:not(.disabled)').each(function () {
			var id = $( this ).attr('id');
			if (id && active.indexOf(id)<0) active.push(id);
		});
		return active.sort().join('.');
	},

	setActiveStep: function ( step )	{
		var $curStep = this.getActiveStep(),
				$step = $(step);

		$curStep.removeClass('active');
		$step.addClass('active');

		var movie = this.getCurrentMovie();
		if (movie) {
			this.setMovie( movie );
			this.playMovie( movie );
		} else {
			$step.removeClass('active');
			$curStep.addClass('active');
			// this.setMovie( movie );
		}
	},

	setActiveStepById: function ( id ) {
		this.setActiveStep( this.$el.find('#'+id) );
	},

	/**
	 * Возвращает активизированный step
	 * @return {jQuery} - объект jQuery активного шага
	 */
	getActiveStep: function () {
		return this.$el.find('.steps .active');
	},

	getFirstStep: function () {
			return $(this.$el.find('.steps .step.first:not(.disabled)')[0]);
	},

	getLastStep: function () {
			return this.$el.find('.steps .step.last');
	},

	activateStep: function ( step )
	{
			this.getActiveStep().removeClass('active');
			step.addClass('active');
	},

	nextStep: function ( $step ) {
		return $step.next();
	},

	prevStep: function ( $step ) {
		return $step.prev();
	},

	getStateId: function () {

	},

	getCurrentMovie: function () {
		var params = this.model.dataJSON,
				states = params.movie.states,
				movies = this.Media.movies,
				curActId = this.getCurrentActiveId(),
				curState = states[curActId],
				src = curState && curState.file;

		return movies[src];
	},

	setMovie: function ( movie ) {
		var params = this.model.dataJSON,
				states = params.movie.states,
				curActiveId = this.getCurrentActiveId(),
				curState = states[curActiveId];

		this.animationFinished = false;

		if (!movie) movie = this.getCurrentMovie();
		// if (!movie) {this.stopPlay(); movie = this.getCurrentMovie();}
		if (!movie) return false;

		this.Media.open(movie);

		this.updateCaption();

		this.updateTitle();

		this.updateMovieControls();

		this.updateProgressBg();

		this.setProgress(0);
	},

	updateProgressBg: function ()
	{
		if (this.progressBg) {
			this.getActiveStep().find('td>div').append(this.progressBg);
		}
	},

	setProgress: function ( val )
	{
		if (!this.progressBg) {
			// SVG stuff
			this.$progressBg = $('<canvas class="progress" width="50" height="50"/>');
			this.progressBg = this.$progressBg[0];
			// this.$el.append(this.progressBg);

			var ctx = this.progressBg.getContext('2d'),
					lineWidth = 4.5,
					R = 18.8,
					imd = null,
					circ = Math.PI * 2,
					quart = Math.PI / 2,
					offset = 0;// lineWidth*circ/(Math.PI * R * 2) / 2;

			// ctx.lineWidth = 1;
			//
			// ctx.beginPath();
			// ctx.fillStyle = "#5a9ccc";
			// ctx.strokeStyle = '#5a9ccc';
			// ctx.arc(25.5, 25.5, R+3,0,2*Math.PI);
			// ctx.fill();
			// ctx.stroke();
			//
			// ctx.beginPath();
			// ctx.fillStyle = "#fff";
			// ctx.strokeStyle = '#fff';
			// ctx.arc(25.5, 25.5, R+2,0,2*Math.PI);
			// ctx.fill();
			// ctx.stroke();
			//
			// ctx.beginPath();
			// ctx.fillStyle = "#5a9ccc";
			// ctx.strokeStyle = '#5a9ccc';
			// ctx.arc(25.5, 25.5, R-1,0,2*Math.PI);
			// ctx.fill();
			// ctx.stroke();
			//
			// ctx.beginPath();
			// ctx.fillStyle = "#fff";
			// ctx.strokeStyle = '#fff';
			// ctx.arc(25.5, 25.5, R-2,0,2*Math.PI);
			// ctx.fill();
			// ctx.stroke();

			ctx.beginPath();
			ctx.strokeStyle = '#0d68a7';
			ctx.lineCap = 'butt';
			ctx.closePath();
			ctx.fill();
			ctx.lineWidth = lineWidth;

			imd = ctx.getImageData(0, 0, 50, 50);

			this.drawProgress = function(current) {
			    ctx.putImageData(imd, 0, 0);
			    ctx.beginPath();
			    if (current) ctx.arc(25.5, 25.5, R, -(quart - offset), ((circ) * current) - quart + offset, false);
			    ctx.stroke();
			}
		}

		this.drawProgress(val);
	},

	getFrame: function () {
		return this.Media.getFrame();
	},

	setFrame: function (frame) {
		return this.Media.setFrame( frame );
	},

	playMovie: function ( movie ) {
		if (!movie) movie = this.getCurrentMovie();
		if (!movie) return;

		if (this.animationFinished) {
			this.setMovie(movie);
		}

		this.Media.play(movie);
		this.PlayerControls.showPause();
	},

	pauseMovie: function ( movie )
	{
		if (!movie) movie = this.getCurrentMovie();
		if (!movie) return;

		// movie.exportRoot.stop();
		this.Media.pause(movie);
	},

	playNext: function () {
		var params = this.model.dataJSON,
				states = params.movie.states,
				movies = this.Media.movies,
				src,
				movie,
				$curStep = this.getActiveStep(),
				$nextStep = $curStep;

		// #8856
		if (!$nextStep.length) {
			movie = this.getCurrentMovie();
		}

		while ($nextStep.length && !movie) {
			$nextStep.removeClass('active');
			$nextStep = this.nextStep( $nextStep );
			$nextStep.addClass('active');

			movie = this.getCurrentMovie();
		}

		if (movie) {
			$curStep.removeClass('active');
			this.setMovie(movie);
			this.playMovie();
		} else {
			$curStep.addClass('active');
			// this.setMovie(movie);
		}

	},

	playPrev: function ()
	{
		var params = this.model.dataJSON,
				states = params.movie.states,
				movies = this.Media.movies,
				src, movie,
				$curStep = this.getActiveStep(),
				$prevStep = $curStep;

		while ($prevStep.length && !movie) {
			$prevStep.removeClass('active');
			$prevStep = this.prevStep( $prevStep );
			$prevStep.addClass('active');

			movie = this.getCurrentMovie();
		}

		if (movie) {
			$curStep.removeClass('active');
			this.setMovie(movie);
			this.playMovie();
		} else {
			$curStep.addClass('active');
			this.setMovie(movie);
		}

	},

	stopPlay: function ()
	{
		var params = this.model.dataJSON,
				states = params.movie.states,
				movies = this.Media.movies,
				movie = this.getCurrentMovie();

		if (movie) {
			this.setMovie(movie);
		}
	},

	renderOptions: function () {
		var params = this.model.dataJSON,
				defaultParam = params.movie.default,
				checkboxes = [],
				self = this,
				$options = this.$el.find('opts'),
				title = $options.find('title').html(), // || '&#160;', ??? если нет title то панель с заголовком не должна отображаться
				$optionsContainer = $('<div class="border"/>');

			if (title) {
				$optionsContainer.addClass('has-title');
				$optionsContainer.append("<div class='model-title'>"+title+"</div>");
			}

			$options.parent().append($optionsContainer);

		  $options.find('opt').each(function() {

				var label = window.courseML ? courseML.getHTMLFromCourseML($(this)): xmlToHtml($(this));

				// default
				var checked = false;
				if (defaultParam) {
					if (defaultParam.indexOf($(this).attr('id'))>=0) checked = true;
				} else {
					checked = $(this).attr('default') && true;
				}

				// Checkbox
				var chck = new modelNS.Checkbox({model: new modelNS.SwitcherModel({
						parent: $optionsContainer,
						checked: checked,
						label: label
					})
				}).render();

				chck.$el.on('click', function () {
					setTimeout(function () {self.changeView()}, 0);
				});

				chck.$el.attr('id', $(this).attr('id'));
				chck.$el.data('checkbox', chck);

			});

		$optionsContainer.parent().parent().addClass('checkboxes-tr'); // #9348

		$options.remove();
	},

	renderChoices: function ()
	{
		var self = this;
		this.$el.find('choices').each(function() {
			var $choicesParent = $('<div class="border padding choices"/>'),
					$choices = $(this),
					title = $(this).find('title').html();

			if ($choices.attr('main') !== void 0 && $choices.attr('main') === 'true') {
                $choicesParent.attr('main', 'true');
			}

			$choices.parent().append($choicesParent);

			if (title) {
				$choicesParent.append('<div class="model-title">'+title+'</div>').addClass('has-title');
			}

				switch ($choices.attr('type')) {
					// select
					case 'ddl':
						$choicesParent.parent().parent().addClass('ddl-tr');	/* #9700 */
						self.renderSelect($choices, $choicesParent);

						break;

					// radiobuttons
					default:
						self.renderRadiobuttons($choices, $choicesParent);

				}
		})
		.remove();

	},

	renderRadiobuttons: function ($choices, $choicesParent)
	{
			var self = this,
					params = this.model.dataJSON,
					defaultParam = params.movie.default,
					collection = [],
					active;

			// markup
			$choices.find('choice').each(function () {
				var $choice = $(this),
						label = window.courseML ? courseML.getHTMLFromCourseML($choice): xmlToHtml($choice),
						choice = {
							label: label,
							disable:false,
							value: $choice.attr('id'),
							// cls: $choice.attr('id'),
							id: $choice.attr('id'),
							onCheck: function () { onCheck(this) }
						};
				collection.push(choice);

				// default
				if (defaultParam.length) {
					if (defaultParam.indexOf($choice.attr('id'))>=0) {
						if (active) delete active.checked;
						active = choice;
						active.checked = true;
					}
				} else {
					if ($choice.attr('default') && !active) {
						active = choice;
						active.checked = true;
					}
				}
			});

			// render
			var $choices = new modelNS.RadioButtonGroup({
				collection: new modelNS.RadioButtonCollection(collection),
				parent: $choicesParent
			}).render();

			function onCheck ( choice )
			{
				// if (choice && $choices) $choices.$el.addClass('active').attr('id', choice.value);
				self.changeView();
			}

			onCheck ( active );
	},

	renderSelect: function ($choices, $choicesParent)
	{
		var self = this,
				params = this.model.dataJSON,
				defaultParam = params.movie.default,
				data = [],
				values = [],
				selected;

		$choices.find('choice').each(function () {
			var $choice = $(this),
					label = window.courseML ? courseML.getHTMLFromCourseML($choice): xmlToHtml($choice),
					value = $choice.attr('id');

			// Опеределение данных для селекта
			data.push( {value:value, label: label} );

			// Определить выбраный по умолчанию
			if (defaultParam && defaultParam.length) {
				if (defaultParam.indexOf($choice.attr('id'))>=0) selected = $choice.attr('id');
			} else if ($choice.attr('default') && !selected) {
				selected = $choice.attr('id');
			} else {
				if (!selected) selected = $choice.attr('id');
			}
		});

		var select = new modelNS.Select({
				data: data,
				width:'100%',
				selected: selected,
				parent: $choicesParent,
		}).render();

		select.$el.addClass('active').attr('id', selected);

		this.listenTo(select, 'Change', function (event, ui) {
			select.$el.attr('id', ui.item.value);
			self.changeView();
		});

		this.Select = select;
	},

	changeView: function ()
	{
		this.stopPlay();
		this.getActiveStep().removeClass('active');
		this.onChange();
	},

	onChange: function ()
	{
		// this.updateOptions();
		this.updateChoices();
		this.updateSteps();
		this.updateMovieControls();

		// #11950
		// $wrapper - контейнер в котором будут инициализированы попапы (#12483)
        courseML.initPopups({popupsXML: this.model.xmlData, $wrapper: this.$el});

		// this.updateControlsHeight();
	},

	updateChoices: function () {
        var params = this.model.dataJSON,
            states = params.movie.states,
            steps = params.movie.steps,
            enableSteps = [],
            enableStepsControls = 0,
            isChildChoiceChecked = false;

        // disable all
        this.$ctrlPane.find('.step, .select-items, .base-model-checkbox').addClass('disabled');
        this.$ctrlPane.find('.base-radiobutton').hide();

        // enable combinations wich is posible
        for (var key in states) {
            var state = states[key],
                active = state.active,
                selectedCount = 0,
                $parentChoice = null;

            // check is combination posible
            for (var i=0; i<active.length; i++) {
                var id = active[i],
                    $active = $('#'+id);

                // #10955 По наличию атрибута main устанавливаем чойс основного блока
                var isParent = $active.parent().parent().attr('main');

                // Установить родителя
                if ($active.hasClass('base-radiobutton') && isParent) { // ARCH #11274 Родителем может быть только радиокнопка, поэтому добавлена проверка, что элемент является радиокнопкой. Конфликт с тикетом ARCH #11273 исправлен.
                    $parentChoice = $active;
                }

                // Если родительская радиокнопка установлена, дочерняя радиокнопка еще неактивна и это дочерний элемент
                if ($parentChoice && !isChildChoiceChecked && !isParent) { // ARCH #11274 Добавлена проверка, что установлена родительская радиокнопка. После этого есть смысл проводить работу с дочерними элементами. Конфликт с тикетом ARCH #11273 исправлен.
                    // Если дочерний чойс и его родительский чойс чекнуты изначально
                    if ($active.hasClass('checked') && $parentChoice.hasClass('checked')) {
                        isChildChoiceChecked = true;
                        // Проверка дочерних чойсов активного родительского чойса
                    } else if ($parentChoice.hasClass('checked')) {
                        var currentCheckedChoices = this.$ctrlPane.find('.base-radiobutton.checked');
                        for (var j = 0; j < currentCheckedChoices.length; j++) {
                            // Найти дочерний активный чойс
                            if ($(currentCheckedChoices[j]).attr('id') !== $parentChoice.attr('id')) {
                                // Если пара родительского и дочернего чойса невозможна, то произошло переключение родителя.
                                if (!states[$parentChoice.attr('id') + '.' + $(currentCheckedChoices[j]).attr('id')]) {
                                    // Установить первый возможный дочерний чойс
                                    for (var k in states) {
                                        states[k].active.forEach(function(item, index) {
                                            if (
                                                item === $parentChoice.attr('id')
                                                && states[k].active[index + 1]
                                                && !isChildChoiceChecked
                                            ) {
                                                $('#' + states[k].active[index + 1]).trigger('click');
                                                isChildChoiceChecked = true;
                                            }
                                        });
                                    }
                                }
                            }
                        }
                    }
                }

                if (
                    steps.indexOf(id) != -1
                    || $active.hasClass('checked') // ARCH #11274 Неважно, есть ли у элемента родитель - если он чекнут, то должен быть добавлен. Конфликт с тикетом ARCH #11273 исправлен.
                    || $active.hasClass('active')
                ) {
                    selectedCount++;
                }

                // Если это радиокнопка, которая находится в главном блоке, то отобразить ее
                if ($active.hasClass('base-radiobutton') && isParent) {// ARCH #11274 Если это радиокнопка, у которой нет родителя, то отображать ее всегда. Конфликт с тикетом ARCH #11273 исправлен.
                    $active.show();
                }
            }

            // enable controlls
            if (selectedCount == active.length-1) {
                for (var i=0; i<active.length; i++) {
                    var id = active[i],
                        $active = $('#'+id);

                    // Установим, что чойс находится в главном блоке
                    var isParent = $active.parent().parent().attr('main');

                    if ($active.hasClass('base-radiobutton') && isParent) { // ARCH #11274 Родителем может быть только радиокнопка, поэтому добавлена проверка, что элемент является радиокнопкой. Конфликт с тикетом ARCH #11273 исправлен.
                        $parentChoice = $active;
                        $active.show();
                    }

                    if (
                        steps.indexOf(id) == -1
                        && !$active.hasClass('checked')
                        && !$active.hasClass('active')
                    ) {
                        $active.removeClass('disabled');
                    }
                    if (
                        steps.indexOf(id) == -1
                        && !$active.hasClass('checked')
                        && !$active.hasClass('active')
                    ) {
                        $active.show();
                    }
                }
            }

            // enable steps
            if (selectedCount == active.length) {
                if (enableStepsControls < selectedCount) {
                    enableStepsControls = selectedCount;
                    enableSteps = [];
                }
                if (enableStepsControls == selectedCount) {
                    enableSteps.push(active);
                }
            }
        }

        for (var s=0; s<enableSteps.length; s++) {
            var active = enableSteps[s];
            var $parentChoice = null;
            for (var i=0; i<active.length; i++) {
                var id = active[i],
                    $active = $('#'+id);

                // ARCH #11274 Найти значение атрибута родителя
                var isParent = $active.parent().parent().attr('main');

                // Отобразить родительскую радиокнопку
                if ($active.hasClass('base-radiobutton') && isParent) { // ARCH #11274 Отобразить родительскую радиокнопку.
                    $parentChoice = $active;
                    $active.show();
                }
                // Отобразить радиокнопку, если она дочерняя
                if ($active.hasClass('base-radiobutton') && !isParent) { // ARCH #11274 Отобразить дочерний элемент, если у радиокнопки определен родитель. Конфликт с тикетом ARCH #11273 исправлен.
                    $active.show();
                }

                $active.removeClass('disabled');
            }
        }
	},

	// found max steps combination and calculate with it block sizes
	calculateControlsHeight: function ()
	{
			this.openStepsMaxHeight();

			this.updateControlsHeight();

			this.hideAllSteps();
	},

	hideAllSteps: function ()
	{
		this.$el.find('.steps .step').addClass('disabled');
	},

	openStepsMaxHeight: function () {
		var params = this.model.dataJSON,
				states = params.movie.states,
				steps = params.movie.steps,
				combinations = {},
				maxCountStepsKey;

			// search maximum steps combination
			for (var key in states) {
				var state = states[key],
						active = state.active,
						keys = [],
						step;

				// sort combinations as combination[key] => steps[]
				for (var i=0; i<active.length; i++) {
					var id = active[i],
							$active = $('#'+id);

					if (steps.indexOf(id) < 0) {
						keys.push(id);
					} else {
						step = id;
					}
				}

				var ckey = keys.sort().join('.');
				if (!combinations[ckey]) combinations[ckey] = [];
				combinations[ckey].push(step);

				if (!maxCountStepsKey || combinations[maxCountStepsKey].length < combinations[ckey].length) {
					maxCountStepsKey = ckey;
				}
			}

			// show steps with max combination
			this.$el.find('.steps .step').addClass('disabled');
			for (var i=0; i<combinations[maxCountStepsKey].length; i++) {
				$('#' + combinations[maxCountStepsKey][i]).removeClass('disabled');
			}
	},

	updateControlsHeight: function () {
		// select-main  убираем бордер для выпадающего списка
		var combo = $('.select-main');
		if(combo.length > 0){
			// combo.parent().parent().css('padding',0);
			if (isIE () && isIE () <= 10) {
				// console.log(combo.parent().parent());
				combo.parent().parent().css('border','none');
				combo.parent().parent().css('padding-top','0 !important');
			}

		}


		// $().base-model-checkbox


		var fullHeight = 0,
				rowHeight = [],
				$rows = this.$ctrlPane.find('.ianimation-controls>tbody>tr');

		// calculate sizes only once
		// if (this.sizeCalculated) return;

		// сбрасываем размеры через css во время расчета
		// this.$ctrlPane.addClass('calculating-size');

		// #9347
		$rows.each(function () {
			var h = 0;
			$(this).find('.border').each(function () {
				h = Math.max(h, this.offsetHeight);
			});

			fullHeight += h;
			rowHeight.push(h);
		});

		$rows.each(function (i) {
		  var $tr = $(this);
		  $tr.css('height', rowHeight[i]/fullHeight*100 + '%');

		  // фикс IE9, div 100% не растягивается в td
		  if (isIE () && isIE () <= 10) {
		    // TODO: onresize
		    if ($tr.hasClass('checkboxes-tr')) {
		      var $border = $(this).find('.border');
		      $border.css('height', 'auto');
		      $border.css('height', $border.height());
		    } else {
		      var $border = $(this).find('.border');
		      $border.css('height', $(this).find('td').height());
		    }
		  }
		});


		// firsov
		var combo = $('.choices').parent().parent();
		if (isIE () && isIE () <= 10) {
			// TODO: onresize
			//$('.choices').css('height',combo.height()-20)
			//$tr.find('.border').css('height', $tr.find('td').height()); // td height
			// console.log($tr.find('td')[0].offsetHeight, $tr.find('td').height())
		}else{
			combo.css('height','5px')
		}

		// #8357 firsov	- cant use, wrong work #8470
		// var table_ = $('.choices').parent().parent().parent().find('tr');
		// if (isIE () && isIE () <= 10) {
		// 	$(table_[0]).find('.border').css('height',$(table_[0]).height()-30)
		// 	$(table_[1]).find('.border').css('height',$(table_[1]).height()+15)
		// }

		// #8357
		this.$el.find('.radiobutton-group').each(function () {
			var $radios = $(this),
				$parent = $radios.parent(),
				blockHeight = $parent.css("height").replace("px",'') - 10 - ($parent.hasClass('has-title') ? 40: 10); // padding compensasion
            var $radiobuttons = $radios.find('.base-radiobutton');
            $radiobuttons.show(); // #11793 Отображаем кнопки, чтобы произвести расчет высоты
			var radioHeight = $radios.height();
            $radiobuttons.hide();// #11793 Снова скрываем кнопки

			if (blockHeight > radioHeight) {
				var outset = Math.floor((blockHeight - radioHeight)/($radiobuttons.length*2));

				if (outset>0) $radiobuttons.css('margin', outset + 'px 0');
			}
		});

		// #9347 Блок не должен быть большим
		// // #9348 Выравнивание по вертикале в блоке options (checkboxes)
		// // актуально для ие9, там родительский td расчитывается иногда большего размера
		// this.$el.find('.checkboxes-td').each(function () {
		// 	var $buttons = $(this).find('.base-model-checkbox:visible'),
		// 			height = 0,
		// 			panelHeight = $(this).find('.border').height();
		//
		// 	$buttons.each(function () {
		// 		height += this.offsetHeight;
		// 	});
		//
		// 	var outset = Math.floor((panelHeight - height)/($buttons.length*2));
		//
		// 	$buttons.css({margin:outset + 'px 0'});
		// });


		// this.$ctrlPane.removeClass('calculating-size');
	},

	// disable checkboxes if no found states
	updateOptions: function () {
		var params = this.model.dataJSON,
				states = params.movie.states;

		// active controls
		var active = [];
		this.$el.find('.select-items.active, .radiobutton-group.active').each(function () {
			var id = $( this ).attr('id');
			if (id && active.indexOf(id)<0) active.push(id);
		});

		// for evry checkbox
		this.$el.find('.base-model-checkbox').each(function() {
			var id = $(this).attr('id');
			var exist = false;
			// is state contain current active controls
			for (var s in states) {
				var state = states[s],
						checkState = true;
				for (var i=0; i<active.length; i++) {
					if (state.active.indexOf(active[i])<0) {
						checkState = false;
						break;
					}
				}

				// is state wich contain active controls contain checkbox id too
				if (checkState && state.active.indexOf(id)>=0) {
					exist = true;
					break;
				}
			}

			// exist
			$(this).data('checkbox')[exist ? "enable": "disable"]();
		});
	},



	// disable checkboxes if no found states
	updateMovieControls: function ()
	{
		var $curStep = this.getActiveStep(),
				$lastStep = this.getLastStep(),
				$firstStep = this.getFirstStep();

		if (!this.$movieButtons) return;

		if ($curStep[0] == $firstStep[0]) {
			this.PlayerControls.$prev.addClass('disable');
		} else {
			this.PlayerControls.$prev.removeClass('disable');
		}

		if ($curStep[0] == $lastStep[0]) {
			this.PlayerControls.$next.addClass('disable');
		} else {
			this.PlayerControls.$next.removeClass('disable');
		}
	},

	// disable some play buttons if no found steps
	updateSteps: function () {
			if (!this.Media.movies) {
				return;
			}

			// var self = this,
			var $curStep = this.getActiveStep().removeClass('active');

			// this.$el.find('.steps .step').each(function () {
			// 		$step = $(this);
			// 		$step.addClass("active");
			// 		movie = self.getCurrentMovie();
			// 		if (!movie) {
			// 			$step.parent().parent().addClass('disabled'); // tr
			// 		} else {
			// 			$step.parent().parent().removeClass('disabled');
			// 		}
			// 		$step.removeClass("active");
			// });

			// first/last classNames
			var steps = this.$el.find('.steps .step:not(.disabled)')
				.removeClass('first')
				.removeClass('last');
			steps.first().addClass('first');
			steps.last().addClass('last');

			this.$el.find('.steps').attr('data-steps', steps.length);

			if ($curStep.length && !$curStep.hasClass('disabled')) {
				$curStep.addClass('active');
			} else {
				this.getFirstStep().addClass('active');
				this.setMovie();
			}

			// if (steps.length) {
				this.$el.removeClass('loading');
			// }
	},

	renderMovieButtons: function ()
	{
		var params = this.model.dataJSON,
				showCaption = params.showCaption,
				position = params.position,
				buttons = params.movie.buttons,
				$buttonsContainer = this.movieContainer.$el;

		if (buttons != "bottom") {
			$buttonsContainer = $buttonsContainer.find('.title-bar');
		}

		this.PlayerControls = new modelNS.PlayerControls({
			film: true,
			parent: $buttonsContainer,
		}).render();

		this.$movieButtons = this.PlayerControls.$el;

		this.listenTo(this.PlayerControls, 'Play', this.play);
		this.listenTo(this.PlayerControls, 'Pause', this.pauseMovie);
		this.listenTo(this.PlayerControls, 'Next', this.playNext);
		this.listenTo(this.PlayerControls, 'Prev', this.playPrev);
		this.listenTo(this.PlayerControls, 'Stop', this.stopPlay);

		// disable some of them if need
		if (!this.$ctrlPane.find('.steps').length) {
			this.PlayerControls.$prev.addClass('disable');
			this.PlayerControls.$next.addClass('disable');
			this.PlayerControls.$film.addClass('disable');
		}
	},


	renderSteps: function (html) {
		var params = this.model.dataJSON,
				$controls = params.controls,
				basePath = this.model.options.basePath,
				title = xmlToHtml($controls.find('steps title')),
				$stepsWrapper;

				this.$ctrlPane.append(
					$('<table class="ianimation-controls"/>').append(
							$('<tbody/>').html(
								xmlToHtml($controls)
									.replace(/<steps/gi, '<div class="steps border"><table><tbody')	// steps => ul
									.replace(/<\/steps>/gi, '</tbody></table></div>')	// steps => ul
									.replace(/<step/gi, '<tr class="step"><td><div')		// step => li
									.replace(/<\/step>/gi, '</div></td></tr>')		// step => li
									// .replace(/icon="(.*?)"(.*?)>/gi, '$2><i style="background-image:url('+basePath+'$1)"></i>') // icon => <tag> <i background=icon></i>.. </tag>
									.replace(/<(\/)?option/gi, '<$1opt')	// fix ie9 option is system tag
						)
					)
			);

		var $steps = this.$ctrlPane.find('.steps');

		// evry step must have icon
		$steps.find('.step div').each(function () {
			var $stepDiv = $(this),
					$i = $("<i/>"),
					icon = $stepDiv.attr('icon'),
					id = this.id;

			$stepDiv.html(courseML.getHTMLFromCourseML($stepDiv));

			$i.appendTo($stepDiv);
			$i.html('<svg><circle class="b" cx="21.5" cy="21.5" r="20.5" stroke="#5a9ccc" fill="#fff"/><circle cx="21.5" cy="21.5" r="16.5" stroke="#5a9ccc" fill="#fff"/></svg>');

			if (icon) $i.css('background-image', 'url('+basePath+icon+')');

			// id => TR
			$stepDiv.attr('id', null).parent().parent().attr('id',id);
		});

		if (title) {
			$steps.find('.border').addClass('has-title').append('<div class="model-title">'+title+'</div>');
		}

		$steps.parent().addClass('steps-td');
	},

	defaultStep: function ()
	{
		var params = this.model.dataJSON,
				defaultParam = params.movie.default;

		// default active
		this.$el.find('.step').each(function () {
			// if (window.courseML) $(this).html(courseML.getHTMLFromCourseML($(this)));	/// ??
			if (defaultParam.indexOf(this.id)>=0) $(this).addClass('active');
		});
		if (!this.getActiveStep().length) this.getFirstStep().addClass('active');
	},

	onMediaReady: function ()
	{
		var self = this;

		this.isMediaReady = true;

		// must called in next takt after controls height calculated
		setTimeout(function () {
			self.onChange();
			self.setMovie();
		}, 0);
	}

});

function xmlToHtml ($tag) {
	if (/(MSIE|Trident\/|Edge\/)/i.test(navigator.userAgent)) {
		return $tag[0] && (new XMLSerializer()).serializeToString($tag[0]).replace(/\n/gi, '').replace(/<.*?>(.*)<\/.*?>/gi,'$1') || "";
	} else {
		return $tag.html();
	}
}


modelNS.IAnimationMedia = {};
modelNS.IAnimationMedia.cache = {};
modelNS.IAnimationMedia.js = Backbone.View.extend({

	initialize: function( options ) {
		window.M = this;
		this.movies = {};
		this.View = options.view;

		// clear from memory if exists previous initialized media for no conflict
		if (modelNS.IAnimationMedia.globalMedia) {
			modelNS.IAnimationMedia.globalMedia.destroy();
		}

		modelNS.IAnimationMedia.globalMedia = this;
  },

	render: function ($parent) {
			this.$parent = $parent;
			this.preloadFile();
	},

  renderAfterLoad: function (movie) {
		var params = this.model.dataJSON,
				headerHeight = this.model.headerHeight,
				movieWidth = params.movie.width,
				movieHeight = params.movie.height - headerHeight,
				lib = movie.lib,
				libWidth = lib.properties.width,
				libHeight = lib.properties.height,
				scaleX = movieWidth && movieWidth/libWidth || 0,
				scaleY = movieHeight && movieHeight/libHeight || 0,
				canvasWidth = libWidth * scaleX || libWidth * scaleY || libWidth || movieWidth,
				canvasHeight = libHeight * scaleY || libHeight * scaleX || libHeight || movieHeight;

		this.$parent.append( this.$canvas =  $('<canvas id="canvas" class="canvas media" ' +
			 'width="' + canvasWidth + '" ' +
			 'height="' + canvasHeight + '"/>'
		));

		if (!this.stage) {
			// анимации нового формата что скинула Лиля запускали этот плагин для корректного
			createjs.MotionGuidePlugin.install();

			this.stage = new createjs.Stage(this.$canvas[0]);
			this.stage.scaleX = canvasWidth / libWidth;	// * (window.devicePixelRatio || 1) // fix #8131
			this.stage.scaleY = canvasHeight / libHeight; // * (window.devicePixelRatio || 1) // fix #8131

			//Registers the "tick" event listener.
			createjs.Ticker.setFPS(lib.properties.fps);
			createjs.Ticker.addEventListener("tick", this.stage);
			// window.stage = this.stage;
		}

		// TODO: resizing;
		// canvas.width = w*pRatio*sRatio;
		// canvas.height = h*pRatio*sRatio;
		// canvas.style.width = w*sRatio+'px';
		// canvas.style.height = h*sRatio+'px';
		// stage.scaleX = pRatio*sRatio;
		// stage.scaleY = pRatio*sRatio;
	},

	destroy: function () {
		if (this.movie) {
			this.stage.clear();
			if (this.movie.exportRoot) {
				this.movie.exportRoot.gotoAndPlay (0);
				// this.movie.exportRoot.stop();
				this.movie.exportRoot.framerate = 0;
			}
			this.stage.removeAllChildren();
			window.lib = null;

			// fix for using requestAnimationFrame #8470 P:\IN_IMUMK-Models\results\export\ianimation\346744 (1.6)
			var self = this;
			if (window.requestAnimationFrame) {
				if (!window._requestAnimationFrame) {
					window._requestAnimationFrame = window.requestAnimationFrame;
					window.requestAnimationFrame = function ()
					{
						self.requestAnimationFrameTimer = window._requestAnimationFrame.apply(window, arguments);
					}
				}
			};
			if (this.requestAnimationFrameTimer) {
				cancelAnimationFrame(self.requestAnimationFrameTimer);
				this.movie.exportRoot.removeAllEventListeners();
				this.movie.exportRoot = null;
			}
		}
	},

	// clear: function () {
	// 	this.destroy(this.movie);
	// },

	open: function (movie) {
		this.destroy();

		if (!movie.exportRoot) movie.init();

		var lib = movie.lib,
				exportRoot = movie.exportRoot;

		if (!this.stage) return;

		this.stage.addChild(exportRoot);

		// movie.exportRoot.stop();
		exportRoot.framerate = 0;
		this.movie = movie;

		this.setFrame(0);

		// window.M = movie;

		// if (movie.requestAnimationFrame) movie.requestAnimationFrame();
	},

	isPause: function () {
		return this.movie && this.movie.exportRoot.framerate === 0;
	},

	play: function (movie) {
		// movie.exportRoot.play();
		(movie || this.movie).exportRoot.framerate = null;
	},

	pause: function (movie) {
		(movie || this.movie).exportRoot.framerate = 0;
	},

	preloadFile: function () {
		var params = this.model.dataJSON,
				states = params.movie.states;

		// this.moviesToLoad = 0;

		for (var id in states) {
			this.loadMovie(states[id].file);
			break;	// последовательная загрузка
		}
	},

	getAdobeLib: function () {
		if (window.AdobeAn) {
			for (var key in AdobeAn.compositions) {
				return AdobeAn.compositions[key].getLibrary();
			}
		}
	},

	stageContent: function (lib, name) {
		if (!name) {
			return;
		}

		if (!lib) lib = this.getAdobeLib();

		return lib && (lib[name] || lib["_" + name]);
	},

	/**
	 * Подгружает скрипт с анимацией.
	 */
	loadMovie: function (src)	{
		if (this.movies[src] !== undefined) {
			return;
		}
		// this.moviesToLoad++;

		this.movies[src] = false;

		var self = this,
				name = src.replace(/.*\/(.*)\.js/,'$1'),
				basePath = this.model.options.basePath,
				fullPath = basePath + src,
				cacheMovie = modelNS.IAnimationMedia.cache[fullPath],
				script = document.createElement('script');
				script.type = 'text/javascript';
				script.src = fullPath;
				// script.id = 'svgimage_' + this.svgID;

		// load from cache
		if (cacheMovie) {
			self.onMovieLoaded(src, cacheMovie.name, cacheMovie.lib);
			return;
		}

		// Переделано из setInterval, потому что были проблемы в Safari с большими скриптами, а поддержка ie9 больше не нужна
		script.onload = function() {
				if (window.lib || window.AdobeAn) {
					if (self.stageContent(window.lib, name)) {
						self.onMovieLoaded(src, name, window.lib);
					} else {
						console.warn('Cant stage content:' + name);
						self.onMovieLoaded(src);
					}
				}
		}

		script.onerror = function () {
			self.onMovieLoaded(src);
			document.body.removeChild(script);
		}

		var firstScript = document.getElementsByTagName('script')[0];
		firstScript.parentNode.insertBefore(script, firstScript);
	},

	onMovieLoaded: function ( src, name, lib) {
		var params = this.model.dataJSON,
				states = params.movie.states,
				movies = this.movies,
				basePath = this.model.options.basePath,
				fullPath = basePath + src,
				movie = movies[src] = name && {} || false,
				stageContent = this.stageContent(lib, name),
				self = this;

		// this.moviesToLoad--;
		if (name) {
			movie.init = function () {
				movie.exportRoot = new (stageContent)();
				movie.exportRoot.loop = false;
				if (movie.exportRoot.instance) { // #10739
					movie.exportRoot.instance.loop = false;
				}

				// try autodetect correct duration #10739
				// var duration = movie.exportRoot.duration,
				// 		duration2 = movie.exportRoot.instance.duration;
				// movie.duration = duration2 && duration2 < duration ? duration2 : duration;
				movie.duration = movie.exportRoot.duration;

				movie.exportRoot.on("tick", function (e) {
					if (e.currentTarget.currentFrame == movie.duration) self.View.onMovieEnd();
					self.View.setProgress(self.getProgress());
					// console.log(e.currentTarget.currentFrame/movie.exportRoot.duration)

					// hack #13467 исправлено пропадание последних кадров
					var cameraInstance = movie.exportRoot.___camera___instance;
					for(child in movie.exportRoot.children)
					{
						var layerObj = movie.exportRoot.children[child];
						if(layerObj == cameraInstance)
							continue;
						if(layerObj.layerDepth === undefined)
							continue;
						if(layerObj.currentFrame != layerObj.parent.currentFrame)
						{
							layerObj.gotoAndPlay(layerObj.parent.currentFrame);
						}
					}
					// hack end
				})
			}

			movie.lib = lib || this.getAdobeLib();
			window.lib = null; // no conflicts #10367

			// очищаем в любом случае, чтобы не возникло конфликтов с другими анимациями
			if (window.AdobeAn) {
				AdobeAn = null;
				// AdobeAn.compositions = {};
			}

			if (!this.$canvas) this.renderAfterLoad(movie);

			// caching
			if (!modelNS.IAnimationMedia.cache[fullPath]) modelNS.IAnimationMedia.cache[fullPath] = {
				name: name,
				lib: movie.lib
			};
		}

		for (var id in states) {
			if (movies[states[id].file] === undefined) {
				return this.loadMovie(states[id].file);
			}
		}

		var wrong = [];
		for (var id in states) {
			if (movies[states[id].file] === false) {
				var src = states[id].file,
						name = src.replace(/.*?\/(.*)\.js/,'$1');
						// console.warn("Something wrong with load '" + states[id].file + "', if file exist check in file must exist:\n \t// stage content: \n\n\t\t(lib."+name+"..\nor \n\n\t\t(lib._"+name+"..");
						wrong.push(states[id].file);
			}
		}
		if (wrong.length) alert("Something wrong with animation file (please report to support): \n" + wrong.join("\n"));

		// if (!this.moviesToLoad) {
			this.ready();
		// }

		// if script load end set main frame
		// if (curState) {
		// 	var curMovie;
		// 	for (var src in movies) {
		// 		 if (curState.file == src) curMovie = movies[src];
		// 		 if (movies[src] === false) return; // not loaded
		// 	}
		// 	if (curMovie) this.setMovie( curMovie );
		// }
	},

	getProgress: function () {
		return this.getFrame()/this.movie.duration;
	},

	getFrame: function () {
		return this.movie.exportRoot.currentFrame;
	},

	setFrame: function ( frame ) {
		var exportRoot = this.movie.exportRoot;
		exportRoot.gotoAndPlay ( frame );
		if (exportRoot.instance && exportRoot.instance.duration) { // #10739
			exportRoot.instance.gotoAndPlay ( frame );
		}
	},

	ready: function ()
	{
		this.View.onMediaReady();
	}

});



modelNS.IAnimationMedia.ogg =
modelNS.IAnimationMedia.webm =
modelNS.IAnimationMedia.mp4 = Backbone.View.extend({

	initialize: function( options ) {
		this.movies = {};
		this.View = options.view;
  },

	render: function ($parent) {
		var params = this.model.dataJSON,
            headerHeight = this.model.headerHeight,
				width = params.movie.width,
				height = params.movie.height - headerHeight,
				states = params.movie.states,
			  basePath = this.model.options.basePath,
				self = this,
				$videoWrapper = $("<div class='media'/>").width(width).height(height).appendTo($parent);

			for (var id in states) {
				var $video, state = states[id];
				$videoWrapper.append( $video = $("<video/>").hide());
				this.movies[state.file] = $video[0];

				// onmovieend
				$video[0].onended = function () {self.View.onMovieEnd($video[0])};

				if (isIE () && isIE () <= 10) {
					$video.attr("src", basePath+state.file);
				}

				// append video with all posible sources
				for (var f=0; f<state.files.length; f++) {
					var src = state.files[f];
					$video.append($('<source src="'+basePath+src+'"/>'));
				}

				// progress event
				$video.on("timeupdate", function(event){
      		self.View.setProgress(self.getProgress());
    		});
			}
			this.ready();
	},

	getProgress: function () {
		return this.getFrame()/this.movie.duration;
	},

	getFrame: function ( frame ) {
	  return this.movie.currentTime;
	},

	setFrame: function ( frame ) {
		this.movie.currentTime = frame;
	},

	open: function (movie) {
		if (this.movie) {
			this.movie.pause();
			if (!isNaN(this.movie.duration)) {
				this.movie.currentTime = 0;
			}
			$(this.movie).hide();
		}

		this.movie = movie;
		$(this.movie).show();
	},

	isPause: function ()
	{
		return this.movie && this.movie.paused;
	},

	play: function (movie)
	{
		// movie.exportRoot.play();
		(movie || this.movie).play();
	},

	pause: function (movie)
	{
		(movie || this.movie).pause();
	},

	ready: function ()
	{
		this.View.onMediaReady();
	}

});


function isIE () {
  var myNav = navigator.userAgent.toLowerCase();
  return (myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1]): false;
}
