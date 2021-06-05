// ICards
function ICardsModel(xmlData, wrapper, basePath, params) {

    var model;

    this.init = function () {

        model = new modelNS.ICards({
            xmlData: xmlData,
            wrapper: wrapper,
            basePath: basePath,
            restyling: true,
            // scalable: false,
            // defaults: {},
            width: wrapper.data('width'),
            height: wrapper.data('height'),
            params: params
        });
        return new modelNS.ICardsView({ model: model }).render();
    };
}

modelNS.addLangs({
    ru: {
      // notes: ['до', 'ре', 'ми', 'фа', 'соль', 'ля', 'си'],
    }
});

modelNS.ICards = modelNS.BaseModel.extend({
    initialize: function (options) {
        modelNS.BaseModel.prototype.initialize.apply(this, arguments);
    },
    parseXML: function(xmlData) {
    	modelNS.BaseModel.prototype.parseXML.apply(this, arguments);
      var $xml = $(typeof(xmlData) == 'string' ? $.parseXML(xmlData) : xmlData),
					$icards = $xml.find('icards'),
					$cards = $icards.find('card'),
					colmatrix = parseInt($icards.attr("colmatrix")),
					rowmatrix = parseInt($icards.attr("rowmatrix")) || 2,
					cards = [],
          self = this;

			$cards.each(function (i) {
				var $card = $(this),
						$front = $card.find('front'),
						$back = $card.find('back');
				cards.push({
					id: $card.attr("id"),
					front: {
						html: courseML.getHTMLFromCourseML($front),
						sound: $front.attr('sound')
					},
					back: {
						html: courseML.getHTMLFromCourseML($back),
						sound: $back.attr('sound')
					}
				});
			});

			this.cards = cards;
			this.rowmatrix = rowmatrix;
			this.colmatrix = colmatrix;
    }
});

modelNS.ICardsView = modelNS.BaseModelView.extend({
    events: {
       'mousedown .card': 'onFlipCard',
    },

    initialize: function () {
        modelNS.BaseModelView.prototype.initialize.apply(this, arguments);

				// for cache
        this.sounds = [];
    },
    render: function () {
        var self = this;

        modelNS.BaseModelView.prototype.render.apply(this);

				this.$el.attr({
					colmatrix: this.model.colmatrix,
					rowmatrix: this.model.rowmatrix,
				});

				this.renderCards();

        return this;
    },

		renderCards: function() {

			var self = this,
					cards = this.model.cards;

			for (var i=0; i<cards.length; i++) {
				var card = cards[i],
						front = card.front,
						back = card.back,
						$card = $('<div class="card"/>').appendTo(this.$el),
						$flipper = $('<div class="flipper"/>').appendTo($card),
						$front = $('<div class="front"/>')
							.html(front.html)
							.attr('sound', front.sound)
							.appendTo($flipper),
						$back = $('<div class="back"/>')
							.html(back.html)
							.attr('sound', back.sound)
							.appendTo($flipper);
			}

			// img => background
			var $imgs = this.$el.find('div>img');
			$imgs.each(function() {
				var $this = $(this),
						$parent = $this.parent();

				// if ($parent.children().length > 1) continue;

				$parent.css('background-image', 'url("' + this.src + '")');
				$this.hide();
			});

      // центрирование по вертикале
      var $pTags = this.$el.find('div>p');
      $pTags.each(function() {
				var $this = $(this),
						height = $this.height();
        $this.css({
          marginTop: -height/2,
        })
			});
		},

		onFlipCard: function (e) {
			var $card = $(e.currentTarget),
					frontSound = $card.find('.front').attr('sound'),
					backSound = $card.find('.back').attr('sound');

			$card.toggleClass('flipped');

			if ($card.hasClass('flipped')) {
				if (frontSound) this.playSound(frontSound);
				if (backSound) this.stopSound(backSound);
			} else {
				if (frontSound) this.stopSound(frontSound);
				if (backSound) this.playSound(backSound);
			}
		},

		playSound: function (file) {
      var path = this.model.options.basePath + file,
          self = this; // courseML.modelPath(file);

      if (!this.sounds[file]) {
        this.sounds[file] = new Audio(path);
        this.sounds[file].loop = false;
      }

      var audio = this.sounds[file];
      audio.play();

      audio.addEventListener("ended", function(){
         self.stopSound(file);
      });
    },

		stopSound: function (file) {
      var audio = this.sounds[file];
      audio.pause();
      audio.currentTime = 0;
    },


})
