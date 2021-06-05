function Collage(xmlData, wrapper, basePath, params) {

	var model, view;

	this.init = function() {
		model = new modelNS.Collage({
			xmlData: xmlData,
			wrapper: wrapper,
			basePath: basePath,
			scalable: false,
			defaults: {
				width: 600,
				height: 400,
				scalable: true,
				scroll: false,
				alignCollage: 'center',
				alignPreview: 'left',
			},
			width: wrapper.data('width') || null,
			height: wrapper.data('height') || null,
			params: params,
			restyling: "title",
		});
		return new modelNS.CollageView({ model: model }).renderOnShow();
	};
}

modelNS.Collage = modelNS.BaseModel.extend({
	defaults: _.extend({}, modelNS.BaseModel.prototype.defaults, {}),
	initialize: function(options) {
		modelNS.BaseModel.prototype.initialize.apply(this, arguments);
		this.options = options;
	},
	parseXML: function(xmlData) {
		modelNS.BaseModel.prototype.parseXML.apply(this, arguments);

		var $model = this,
			$xml = typeof(xmlData) == 'string' ? $($.parseXML(xmlData)) : xmlData,
			$collage = $xml.find('collage, icollage'),
			collageParams = { pictures: [], popups: [] },
			rows = $xml.find('row'),
			colmatrix = $collage.attr("colmatrix");

		// if(rows.length != 0){
		// 	alert('ERROR! <row> elements in XML-DATA is obsolete!!!');
		// } else {
		// if (rows.length) rows=collage;	// ??
		// }


		this.options.customSizes = true;

		this.options.customPreviewSizes = true;

		collageParams.NoRightPreview = false;

		collageParams.params = this.options.params;

		// if(!$collage.attr('rowmatrix'))alert('ERROR! Missing "rowmatrix" option!!!');
		collageParams.rowsCount = parseInt(this.options.params.rowmatrix) || 2;

		this.scroll = collageParams.scroll = $collage.attr('scroll') == 'true' || '' ? true : this.defaults.scroll;

		this.height = this.options.height ? this.options.height : ($collage.attr('height') ? parseInt($collage.attr('height')) : this.defaults.height);
		this.height = this.height > 300 ? this.height : 300; // 300px < this.height < 1080px
		this.height = this.height < 1080 ? this.height : 1080;
		collageParams.height = this.height;

		this.width = this.options.width ? this.options.width : ($collage.attr('width') ? parseInt($collage.attr('width')) : this.defaults.width);
		this.width = this.width > 400 ? this.width : 400; // 400px < this.width < 1920px
		this.width = this.width < 1920 ? this.width : 1920;
		collageParams.width = this.width;



		var imagesInRow = 0;
		rows.each(function() {
			var imagesCnt = $(this).find('image').length;
			if (imagesCnt > imagesInRow) {
				imagesInRow = imagesCnt;
			}
		});

		collageParams.imagesInRow = parseInt(this.options.params.colmatrix) || colmatrix || imagesInRow / collageParams.rowsCount;

		collageParams.rightPreviewCols = $collage.attr('previewcolumns') || '' ? parseInt($collage.attr('previewcolumns')) : 2;

		collageParams.prewidth = $collage.attr('prewidth');
		collageParams.preheight = $collage.attr('preheight');

//console.log(collageParams.prewidth, collageParams.preheight);

		//		if(!collageParams.prewidth || !collageParams.preheight) {
		if (!collageParams.prewidth && !collageParams.preheight) {
			$model.options.customPreviewSizes = false;
		}

		// Parse images rows
		var ImageCounter = 0;

		$collage.find('image').each(function() {
			var pic = $(this),
				$object = pic.find('object'),
				$copyright = $object.find('copyright'),
				file = $object.attr('file') || pic.attr('file'),
				$title = $object.length ? pic.find('title') : pic,
				picUrl = courseML.modelPath(file), // .toLowerCase().substring(pic.attr('file').toLowerCase().indexOf('img')) : '',
				preview = pic.attr('preview') && $model.options.basePath + pic.attr('preview'), //.toLowerCase().substring(pic.attr('preview').toLowerCase().indexOf('img')) : '';
				miniature = pic.attr('miniature') && $model.options.basePath + pic.attr('miniature')
					|| picUrl; // #11436 Если миниатюра не указана, то берем из основного изображения

			if (!(pic.attr('width') && pic.attr('height'))) {
				$model.options.customSizes = false;
			}

			collageParams.pictures.push({
				id: ImageCounter + 1,
				url: picUrl,
				title: courseML.getHTMLFromCourseML($title) || ' ', // #11455 Панель управления должна быть даже с пустыми заголовками
				copyright: courseML.getHTMLFromCourseML($copyright),
				popup: pic.attr('popup') || null,
				width: pic.attr('width') || null,
				height: pic.attr('height') || null,
				preview: preview,
				miniature: miniature,
				previewWidth: pic.attr('prewidth') || '',
				previewHeight: pic.attr('preheight') || null,

				// demo
				time : pic.attr('time'),
				endtime : pic.attr('endtime'),
				order : pic.attr('order'),
			});
			ImageCounter++;
		});


		// флаг авторасчета размеров коллажа и align
		collageParams.customSizes = this.options.customSizes;
		this.alignCollage = collageParams.alignCollage = $collage.attr('alignCollage') ? $collage.attr('alignCollage') : this.options.defaults.alignCollage;

		// флаг авторасчета размеров превью и align
		collageParams.customPreviewSizes = this.options.customPreviewSizes;
		this.alignPreview = collageParams.alignPreview = $collage.attr('alignPreview') ? $collage.attr('alignPreview') : this.options.defaults.alignPreview;

		//если задано только количество рядов
		if ($collage.attr('rowmatrix') && !$collage.attr('colmatrix')) {
			collageParams.imagesInRow = Math.ceil(ImageCounter / parseInt($collage.attr('rowmatrix')));
		}

		//если кол-во фото больше заданной матрицы
		var row_col = collageParams.rowsCount * collageParams.imagesInRow,
			ost = ImageCounter - row_col;
		if (row_col < ImageCounter) collageParams.rowsCount += Math.ceil(ost / collageParams.imagesInRow);

		// truncate num to defined in decimalPlaces digits after comma
		function $trunc(num, decimalPlaces) {
			var numPowerConverter = Math.pow(10, decimalPlaces);
			return ~~(num * numPowerConverter) / numPowerConverter;
		}

		//авторасчет
		if (!collageParams.customSizes) {
			var h1 = 3, // расстояние между элементами, значение из css 3px
				w = $trunc(($model.width - (collageParams.imagesInRow - 1) * h1) / collageParams.imagesInRow, 1),
				h = $model.scroll ? '100%' : $trunc(($model.height - (collageParams.rowsCount - 1) * h1) / collageParams.rowsCount, 1);
			for (var z = 0; z < collageParams.pictures.length; z++) {
				collageParams.pictures[z].width = w;
				collageParams.pictures[z].height = h;
			}
			collageParams.w = w;
			collageParams.h = h;
			collageParams.customSizes = true;
		}

		//авторасчет превью
		/*if(!collageParams.customPreviewSizes){
			for(z=0;z<collageParams.pictures.length;z++){
				if (!collageParams.pictures[z].previewHeight) {
					collageParams.pictures[z].previewHeight = 'auto';
				}

				if (!collageParams.pictures[z].previewWidth) {
					collageParams.pictures[z].previewWidth =
						// 3px - margins between preview, 4px - common left padding compensation, 25px - big image header compensation
						($model.width-$model.height-(collageParams.rightPreviewCols-1)*3-4+25)/collageParams.rightPreviewCols - 16;
				}

				// если ширина правых превью < 30px - скрыть правую галерею
				if(!collageParams.NoRightPreview && collageParams.pictures[z].previewWidth<30) collageParams.NoRightPreview = true;
			}
			// collageParams.customPreviewSizes=true;
		}
		*/

		// Parse popups
		$xml.find('popup').each(function() {
			try {
				var id = $(this).attr('id') || '' ? $(this).attr('id') : $(this).attr('name'),
					width = $(this).attr('width'),
					height = $(this).attr('height'),
					content = courseML.getHTMLFromCourseML($(this));
				collageParams.popups.push({ closableOnOverlayClick: true, id: id, width: width, height: height, content: content });
			}
			catch (e) {}
		});
		return collageParams;
	}
});

modelNS.CollageView = modelNS.BaseModelView.extend({
	initialize: function(options) {
		modelNS.BaseModelView.prototype.initialize.apply(this, [options]);
	},
	render: function() {

		modelNS.BaseModelView.prototype.render.apply(this);
		this.views = [];
		this.timers = {};
		this.pictureViewLayout = null;
		this.galleryLayout = null;
		this.$el.addClass('icollage');

		var $dimensions = {
			'min-width': '400px', //400px < this.width < 1920px
			'max-width': '1920px',
			'width': this.model.options.width ? (this.model.options.width + 'px') : (this.model.dataJSON.width + 'px'),
			'min-height': '300px', // 300px < this.height < 1080px
			'max-height': '1080px',
			'height': this.model.options.height ? (this.model.options.height + 'px') : (this.model.dataJSON.height + 'px')
		}
		// размер родителя
		this.$el.parent().css($dimensions);

		// размер модели
		//$dimensions.width = this.model.dataJSON.width+'px';
		//$dimensions.height = this.model.dataJSON.height+'px';
		this.$el.css($dimensions);


		this.popupCollection = new modelNS.PopupCollection(this.model.dataJSON.popups);

		this.renderGalleryView();
		this.handleKeys();

		return this;
	},
	handleKeys: function (){
		var self = this;

		function keydown (e) {
			// подчищаем за собой событие если модель умерла
			if (!self.$el.is(":visible")) {
				$(document).unbind( "keydown", keydown );
				return;
			}
			if (e.ctrlKey) {
				return;
			}
			if (!self.keyOn) {
				return;
			}

			if (e.keyCode === 27) {
				self.renderGalleryView();
				e.stopImmediatePropagation();
			}
			if (e.keyCode === 37) {
					self.openPrevImage();
					e.stopImmediatePropagation();
			}
			if (e.keyCode === 39) {
					self.openNextImage();
					e.stopImmediatePropagation();
			}
		}

		// функция исполняется первей всех, это что бы она могла события прерывать
		$(document).keydown(keydown);
		jQuery._data( document, "events" ).keydown.reverse();
	},
	handleKeysPictureLayout: function () {
		this.keyOn = true;
	},
	handleKeysGalleryLayout: function () {
		this.keyOn = false;
	},
	renderGalleryView: function() {

		this.hideViews();

		this.handleKeysGalleryLayout();

		var self = this;

		if (this.galleryLayout) {
			//this.galleryLayout.$el.show();
			// this.galleryLayout.$el.css({ 'opacity': '0', 'display': 'block', 'transition': 'opacity .2s ease-out' }); // smooth show start
			// setTimeout(function() {  }, 400); //smooth show end
			// this.galleryLayout.$el.stop().animate({ 'opacity': '1' }, 400);
			this.galleryLayout.$el.css({'display': 'block'});
			this.galleryLayout.$el.stop().animate({ 'opacity': '1' }, 400);
			return;
		}
		this.galleryLayout = new modelNS.SingleLayout();
		this.views.push(this.galleryLayout);
		this.$el.append(this.galleryLayout.render().el);

		this.galleryLayout.$el.css({ 'opacity': '0' }); //smooth show start

		this.galleryView = new modelNS.GalleryView({
			cls: 'gallery-view' + (this.model.dataJSON.customSizes ? ' setted-image' : ''),
			imagesInRow: this.model.dataJSON.imagesInRow,
			multipleLines: true,
			verticalAlign: 'top',
			align: this.model.dataJSON.alignCollage,
			parent: this.galleryLayout.$el,
			pictures: this.model.dataJSON.pictures,
			customSizes: this.model.dataJSON.customSizes,
			scalableWidth: this.model.dataJSON.customSizes ? false : true,
			scroll: this.model.dataJSON.scroll
		}).render();

		// fix ie image fit
		this.galleryView.$el.find('.single-image img').each(function() {
			$(this).parent().css('background-image', 'url("' + this.src + '")');
		});

		this.listenTo(this.galleryView, 'GaleryViewItemClicked', this.onItemClick);
		this.listenToOnce(this.galleryView, 'GalleryRendered', this.onAllImgLoaded);

		//this.galleryLayout.$el.show();
		this.galleryLayout.$el.css({ 'opacity': '0', 'display': 'block' }); // smooth show middle
		setTimeout(function() { self.galleryLayout.$el.css({ 'opacity': '1' }) }, 140); // smooth show end
	},
	onAllImgLoaded: function() {

		var _this = this;

		// если для модели задано scroll="true" и коллаж не помещается - будет вертикальный скролл
		if (_this.model.dataJSON.scroll === true) {
			_this.galleryView.$el.mCustomScrollbar({
				theme: "3d-thick-dark",
				callbacks: {
					onInit: function() {
						_this.galleryView.$el.css({ 'width': _this.galleryView.$el.outerWidth() + 22 + 'px' }); // 22px - место для скролла
					}
				}
			});
		}

		// если задан показ большой картинки param="<номер_картинки>"
		if (this.model.params.picture) {
			$(this.galleryLayout.$el.find('.single-image > img')[parseInt(_this.model.params.picture) - 1]).trigger('click');
		}
	},
	onItemClick: function(model) {
		this.renderPictureView(model);
		//this.pictureViewLayout.$el.css({'opacity':1});
	},
	renderPictureView: function(model) {

		this.hideViews();

		this.handleKeysPictureLayout();

		var self = this;

		if (!this.pictureViewLayout) {

			var collageParams = this.model.dataJSON,
				width = collageParams.width || this.$el.width(),
				height = collageParams.height || this.$el.height(),
				titleHeight = 25,
				previewOutset = 4,
				scrollWidth = 19,
				viewHeight = height - titleHeight,
				viewWidth = Math.ceil(collageParams.w * (viewHeight) / collageParams.h),
				smallGalleryPictures = [],
				columnsCount = collageParams.rightPreviewCols,
				rightRowsCount = Math.ceil(smallGalleryPictures.length / columnsCount);

			//задает размеры превью, если указаны
			// if(this.model.dataJSON.customPreviewSizes){
			// for (k=0;k<smallGalleryPictures.length;k++){
			// 	smallGalleryPictures[k].width= galleryWidth < smallGalleryPictures[k].previewWidth ? galleryWidth : smallGalleryPictures[k].previewWidth,
			// 	smallGalleryPictures[k].height=smallGalleryPictures[k].previewHeight;
			// }
			// }

			// calculate auto preview sizes
			if (!collageParams.customPreviewSizes) {
				var w = (width - viewWidth) / collageParams.rightPreviewCols,
					h = viewHeight / viewWidth * w;

				// if have scroll
				if (h * rightRowsCount > height) {
					w -= scrollWidth / collageParams.rightPreviewCols;
					h = viewHeight / viewWidth * w;
				}

				h = Math.floor(h);
				w = Math.floor(w);

				// check min sizes not show preview gallery
				if (h < 30 || w < 30) {
					collageParams.NoRightPreview = true;
					viewWidth = width;
				}

			}
			else {
				if (collageParams.prewidth == undefined) {
					//console.log('collageParams.prewidth', collageParams.pictures);
					// вычисляем соотношение
					var z = collageParams.pictures[0].width / collageParams.pictures[0].height;
					collageParams.prewidth = collageParams.preheight * z;
				}
                if (collageParams.preheight == void 0) { // #8998
                    // вычисляем соотношение
                    var z = collageParams.pictures[0].width / collageParams.pictures[0].height;
                    collageParams.preheight = collageParams.prewidth / z;
                }
				var w = collageParams.prewidth * 1 + 2, // 2px compensation outset for images in gallery
					h = collageParams.preheight * 1 + 2,
					isScroll = h * rightRowsCount + (rightRowsCount - 1) * 3 > height; // 3px compensation beetween previews

				viewWidth = width - w * collageParams.rightPreviewCols - (isScroll ? scrollWidth : 0) - 4; // 4px compensation .second-panel left padding
			}

			// prepare pictures
			for (var k = 0; k < collageParams.pictures.length; k++) {
				var picture = {};
				$.extend(picture, collageParams.pictures[k]);
				picture.width = w,
				picture.height = h;
				if (picture.miniature) { // #9429
					picture.preview = picture.miniature;
				}
				smallGalleryPictures.push(picture);
			}

			// заглушки, нужны что бы последний ряд ровнялся влево
			var notFullRow = smallGalleryPictures.length%columnsCount;
			if (notFullRow) {
					for (var i=notFullRow; i<columnsCount; i++) {
						smallGalleryPictures.push({width:w, height:h, url:smallGalleryPictures[0].url, cls : 'cap'});
					}
			}

			var galleryWidth = collageParams.width - viewWidth - 4; // + 25, // 4px - common left padding compensation, 25px - big image header compensation;

				this.pictureViewLayout = new modelNS.DualVerticalLayout({
					firstPaneWidth: viewWidth,
					secondPaneWidth: width - viewWidth, // 16 scroll width compensation // +25, // 25px - big image header compensation
					parent: this.$el
				});

			this.views.push(this.pictureViewLayout);
			this.$el.append(this.pictureViewLayout.render().el);

			this.smallGalleryView = new modelNS.GalleryView({
				width: galleryWidth,
				imagesInRow: columnsCount,
				cls: 'preview-gallery' + (this.model.dataJSON.customPreviewSizes ? ' setted-image' : ''),
				verticalAlign: 'top',
				align: this.model.dataJSON.alignPreview,
				multipleLines: true,
				parent: this.pictureViewLayout.$secondPane,
				pictures: smallGalleryPictures,
				// customSizes:this.model.dataJSON.customPreviewSizes,
				customSizes: true,
				scalableWidth: true // this.model.dataJSON.customPreviewSizes?false:true	// autowidth
			}).render();

			this.renderImageView = function(model) {

				// заглушка
				if (model.cls == 'cap') {
					return;
				}

				if (self.imageView) self.imageView.remove();

				model.height = parseInt(self.$el.height());
				model.width = viewWidth; //-titleHeight; // 25px - высота титул-бара
				model.hasTitleBar = true;
				model.hasPadding = false;
				model.customSizes = false;
				self.imageView = new modelNS.SingleImageView({
					model: model,
					skipPreview: true,
					cls: 'single-image setted-image'
				});

				self.pictureViewLayout.$firstPane.append(self.imageView.render().el);
				self.imageView.$el.css({ 'opacity': '0' }); //smooth show start

				// коррекция большого фото под шапку
				self.imageView.$el.find('img').css({ 'width': '100%', 'height': model.height - 25 + 'px' }); // 25px высота шапки большого фото

				self.listenTo(self.imageView, 'ImageClick', self.renderGalleryView);
				self.listenTo(self.imageView, 'ExitClick', self.renderGalleryView);
				self.listenTo(self.imageView, 'ImageLoaded', self.imageLoaded);
				self.listenTo(self.imageView, 'ImageTitleClick', self.showPopuppa);
				// self.listenTo(self.imageView, 'ImageCopyClick', self.showPopuppa);

				self.currentImageView = model;
			}

			this.showPopuppa = function(model) {
				this.openPopup(this.popupCollection.get(model.popup)); // #11094

				// comment it fix #8040
				// setTimeout(function(){	// ????????
				// $('body').append(self.$el.find('.ui-widget-overlay'));
				// },350);

			}

			this.listenTo(this.smallGalleryView, 'GaleryViewItemClicked', this.renderImageView /* this.renderPictureView */ );
			this.listenTo(this.smallGalleryView, 'GalleryRendered', this.smallGalleryRendered);

			// fix ie image fit
			this.pictureViewLayout.$el.find('.single-image img').each(function() {
				$(this).parent().css('background-image', 'url("' + this.src + '")');
			});
		}

		this.smallGalleryView.$el.css({ 'opacity': '0' }); // smooth show start

		this.pictureViewLayout.$el.show();
		this.pictureViewLayout.$el.stop().animate({opacity:1}, 400);

		this.renderImageView(model);
	},

	updatePrevNextStatus: function () {
		var index = this.findSmallGalleryCurrentImageIndex();
		if (index == this.smallGalleryView.galleryCollection.length - 1) {
			this.$next.addClass('disable');
		} else {
			this.$next.removeClass('disable');
		}
		if (index == 0) {
			this.$prev.addClass('disable');
		} else {
			this.$prev.removeClass('disable');
		}
	},

	findSmallGalleryCurrentImageIndex: function () {
		var index = 0,
				collection = this.smallGalleryView.galleryCollection;
		if (this.currentImageView) {
			index = collection.indexOf(this.currentImageView);
			if (index<0) {	// отображается превью модель из главного вида коллажа, ищем ее аналог в дополнительном виде
				var findModel = collection.findWhere({url:this.currentImageView.get('url')});
				index = collection.indexOf(findModel);
			}
		}
		return index || 0;
	},

	openNextImage: function ()
	{
		var index = this.findSmallGalleryCurrentImageIndex() + 1;
		this.renderImageViewByIndex(index);
	},

	openPrevImage: function () {
		var index = this.findSmallGalleryCurrentImageIndex() - 1;
		this.renderImageViewByIndex(index);
	},

	renderImageViewByIndex: function (index) {
		var collection = this.smallGalleryView.galleryCollection;
		if (index < 0 || index >= collection.length) {
			return;
		}
		var next = collection.at(index);
		this.renderImageView(next);
	},

	// #9715
	renderPrevNextButtons: function () {
		var self = this;

		this.$next = $('<div class="collage-next"/>')
			.prependTo(this.imageView.titleBar)
			.click(function () {
				self.openNextImage();
			});
		this.$prev = $('<div class="collage-prev"/>')
			.prependTo(this.imageView.titleBar)
			.click(function () {
				self.openPrevImage();
			});
	},

	resizeTitle: function () {
		// динамический размер текста в заголовке
		var $title = this.pictureViewLayout.$firstPane.find('.title-text'),
				$arr = this.pictureViewLayout.$firstPane.find('.title-exit-arrow'),
				$info = this.pictureViewLayout.$firstPane.find('.title-comment'),
				firstPaneWidth = this.imageView.$el.width(),
				titleTextWidth = firstPaneWidth - this.$prev.width() - this.$next.width() - $arr.width() - $info.width();

		// при троеточии показываем tooltip
		if ($title.width() > titleTextWidth) {
			$title.attr('title', $title.html()).tooltip();
		}

		$title.css({width: titleTextWidth});
	},

	smallGalleryRendered: function() {

		if (this.model.dataJSON.NoRightPreview) {
			// this.pictureViewLayout.$el.width(this.pictureViewLayout.$el.width()-this.pictureViewLayout.$secondPane.width());
			this.pictureViewLayout.$secondPane.css({ 'display': 'none' });
			return;
		}

		var _this = this;

		setTimeout(function() {
			_this.smallGalleryView.$el.mCustomScrollbar({
				theme: "3d-thick-dark",
				// callbacks:{
				// onInit:function(){
				// 				return; ///
				// setTimeout(function() {
				// 	_this.smallGalleryView.$el.width(_this.smallGalleryView.$el.outerWidth()+16+3); // 16px - место для скролла
				// 	_this.pictureViewLayout.$secondPane.width(_this.pictureViewLayout.$secondPane.width()+16+3)
				// 	_this.pictureViewLayout.$el.width(_this.pictureViewLayout.$firstPane.width()+_this.pictureViewLayout.$secondPane.width()+4);
				// 	setTimeout(function(){_this.pictureViewLayout.$el.css({'opacity':'1','transition':'opacity .5s ease-out'})},140); // smooth show end
				// }, 200);
				// 			}
				// 		}
			});
		}, 300);

		// -- контроль за неполным последним рядом - прижат влево --
		// if ((this.smallGalleryView.$el.find('.row:last-child > .single-image').length) < (this.model.dataJSON.rightPreviewCols)) {
		// 	this.smallGalleryView.$el.find('.row:last-child').css('margin-left', test_image.parentNode.style.margin ? test_image.parentNode.style.margin : '0px');
		// }

		// this.smallGalleryView.$el.css({ 'opacity': '1', 'transition': 'opacity .25s ease-in' }) // smooth show end
		this.smallGalleryView.$el.animate({'opacity':1}, 400);
	},
	imageLoaded: function() {

		// в мобильной версии почему-то событие срабатывает два раза подряд
		if (window.FP_img) return;

		window.FP_img = new Image();
		FP_img.src = this.imageView.$el.find('img')[0].src;
		FP_img.style.marginLeft = '-9999px';
		FP_img.style.marginTop = '-9999px';
		$('body').append(window.FP_img);

		var FP_natural_width = window.FP_img.offsetWidth, //this.imageView.$el.find('img')[0].naturalWidth, - не работает в моб. браузерах
			FP_natural_height = window.FP_img.offsetHeight, //this.imageView.$el.find('img')[0].naturalHeight,
			FP_scale = FP_natural_width / FP_natural_height;

		var firstPaneWidth = this.imageView.$el.width();
		// var firstPaneWidth = this.imageView.$el.height()>this.imageView.$el.find('img').outerWidth();
		// 						this.imageView.$el.find('img').outerWidth():this.imageView.$el.height();
		// firstPaneWidth = FP_scale<1?Math.floor(firstPaneWidth*FP_scale):firstPaneWidth;

		setTimeout(function() {
			$(window.FP_img).remove();
			window.FP_img = null;
		}, 100);

		// this.pictureViewLayout.$firstPane.width(firstPaneWidth);
		this.pictureViewLayout.$firstPane.find('.single-image').width(firstPaneWidth - 2); //2px - border compensation
		this.pictureViewLayout.$firstPane.find('.single-image .title-bar').width(firstPaneWidth);

		// если нет попапа к картинке - скрыть кнопу
		if (_.where(this.model.dataJSON.popups, { id: this.imageView.model.popup }).length == 0)
			this.pictureViewLayout.$firstPane.find('span.title-comment').hide();

		var pictureViewWidth =
			(this.model.dataJSON.NoRightPreview ? 0 : this.pictureViewLayout.$secondPane.outerWidth()) + this.pictureViewLayout.$firstPane.outerWidth();

		this.pictureViewLayout.$el.css({ 'display': 'block', 'width': pictureViewWidth + 'px', 'margin': 'auto' });

		// this.smallGalleryView.$el.css({ 'opacity': '1', 'transition': 'opacity .25s ease-in' }) // smooth show end
		// this.imageView.$el.css({ 'opacity': '1', 'transition': 'opacity .25s ease-in' }) // smooth show end
		this.smallGalleryView.$el.animate({opacity:1}, 400);
		this.imageView.$el.animate({opacity:1}, 400);

		// fix ie image fit
		this.imageView.$el.find('img').each(function() {
			var $this = $(this),
				$single = $this.parent(),
				$fon = $single.find('.fon');

			if (!$fon.length) $fon = $('<div class="fon" />').appendTo($single);
			$fon.css('background-image', 'url("' + this.src + '")');
		});

		// #9715
		this.renderPrevNextButtons();
		this.updatePrevNextStatus();

		this.resizeTitle();
	},
	hideViews: function() {
		// for (var i = 0; i < this.views.length; i++) {
		// 	this.views[i].$el.hide();
			// this.views[i].$el.animate({opacity:0}, 400);
		// }
		if (this.galleryLayout) this.galleryLayout.$el.hide();
		if (this.pictureViewLayout) this.pictureViewLayout.$el.animate({opacity:0}, 400, function () {$(this).hide()});
	},

	startDemo: function(fn) {
		var self = this;

		modelNS.BaseModelView.prototype.startDemo.apply(this, arguments);

		this.timers.start = setTimeout(function() { self.openNext() }, this.duration(this.demoFirstSlideAt - 1000, { max: 10000, min: 1000 }));	// -1000 for have time mark
	},

	openNext: function() {
		if (this.isDemoPause()) return this.saveDemoMoment();

		closePopup();

		var openedModel = this.openedModel,
				self = this;

		for (var i = 0; i < this.demoList.length; i++) {
			var json = this.demoList[i];

			if (!openedModel) {

				// <image time="..">
				if (json.time) {
					var time = json.time * 1000,
							timeDiff = time - this.demoPlayTime();

					// mark before 1s
					setTimeout(function () {self.markItem(json)}, timeDiff - 1500);

					if (timeDiff > 0) return this.waitAndOpenNext(timeDiff);
				}

				this.openModel(json);
				return;
			}

			if (json == openedModel) openedModel = null;
		}

		this.onDemoFinish();
	},

	markItem : function (json)
	{
		if (!this.$mark) this.$mark = $('<div class="mark"/>');

		this.$mark.appendTo(this.$el.find('.single-layout [image='+json.id+']'))
			.stop()
			.animate({'opacity': 0}, 300)
			.animate({'opacity': 1}, 300)
			.animate({'opacity': 0}, 300)
			.animate({'opacity': 1}, 300)
			.animate({'opacity': 0}, 300, function () {$(this).remove()});
	},

	openModel: function(json) {
		if (this.isDemoPause()) return this.saveDemoMoment();

		var self = this;

		this.openedModel = json;

		var model = this.getGalleryItemById(json.id);
		this.onItemClick(model);

		// <image endtime="..">
		if (json.endtime) {
			var time = json.endtime * 1000,
					timeDiff = time - this.demoPlayTime();

			setTimeout(function () {self.closeModel(json)}, timeDiff);
		}

		if (model.popup) {
			this.waitAndShowPopup(model, this.duration(1500, { max: 10000 }));
		}
		else {
			this.waitAndOpenNext(this.duration(1500, { max: 10000 }));
		}
	},

	closeModel : function (json)
	{
		if (this.openedModel != json) return;
		this.renderGalleryView();
	},

	waitAndShowPopup: function(model, ms) {
		var self = this;
		this.timers.popup = setTimeout(function() { self.demoPopup(model) }, ms);
	},

	demoPopup: function(model) {
		if (this.isDemoPause()) return this.saveDemoMoment();

		var self = this;

		this.showPopup(model);
		setTimeout(function() {
			self.waitAndOpenNext(self.duration(2000, { max: 10000, calc: ".model-popup .mCSB_container" }));
		}, 500);
	},

	waitAndOpenNext: function(ms) {
		var self = this;
		this.timers.next = setTimeout(function() { self.openNext() }, ms);
	},

	getGalleryItemById : function (id)
	{
			var items = this.galleryView.items;
			for (var i=0; i<items.length; i++) if (items[i].model.id == id) return items[i].model;
	},

	demoOrder : function ()
	{
		modelNS.BaseModelView.prototype.demoOrder.apply(this, arguments);

		var content = this.model.dataJSON.pictures,
				demoListObjects = [],
				demoListKeys = [],
				order = 0;

		this.demoFirstSlideAt = 3000;

		for (var c = 0; c < content.length; c++) {
			var json = content[c],
					time = json.time && json.time * 1000;
			if (json.order) order = json.order*100;
			demoListObjects[order] = json;
			demoListKeys.push(order);
			order += 1;
			if (time && this.demoFirstSlideAt > time) this.demoFirstSlideAt = time;
		}

		function sortNumber(a,b) {
				return a - b;
		}

		demoListKeys.sort(sortNumber);
		// console.log(demoListKeys);

		for (var k=0; k<demoListKeys.length; k++) {
			var key = demoListKeys[k];
			this.demoList.push(demoListObjects[key]);
		}
	},

});
