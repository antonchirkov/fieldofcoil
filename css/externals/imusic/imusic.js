// IMusic
function IMusicModel(xmlData, wrapper, basePath, params, svgData) {

    var model;

    this.init = function () {

        model = new modelNS.IMusic({
            xmlData: xmlData,
            wrapper: wrapper,
            basePath: basePath,
            restyling: true,
            // scalable: false,
            // defaults: {},
            width: wrapper.data('width'),
            height: wrapper.data('height'),
            params: params,
            svgData: svgData, // по каким-то причинам предзагружено (используется в РЭШ2)
        });
        return new modelNS.IMusicView({ model: model }).render();
    };
}

modelNS.addLangs({
    ru: {
      notes: ['до', 'ре', 'ми', 'фа', 'соль', 'ля', 'си'],
    }
});

modelNS.IMusic = modelNS.BaseModel.extend({
    initialize: function (options) {
        modelNS.BaseModel.prototype.initialize.apply(this, arguments);
    },
    parseXML: function(xmlData) {
    	modelNS.BaseModel.prototype.parseXML.apply(this, arguments);
      var $xml = $(typeof(xmlData) == 'string' ? $.parseXML(xmlData) : xmlData),
          $ipicture = $xml.find('field[region="picture"]'), // договорились мол включение обуславливается наличием тега (resh2)
          $piano = $xml.find('field[region="piano"]'),
          $staff = $xml.find('field[region="staff"]'),
          self = this;

      this.regions = [];

      // ipicture
      if ($ipicture.length) {
        this.file = $ipicture.find('layer').attr('file');
        $ipicture.find('element').each(function (i) {
          var $region = $(this);
          self.regions.push({
            id: $region.attr('svgregion'),
            sound: $region.attr('sound'),
          });
        });
      }

      // piano
      if ($piano.length) {
        this.piano = true;
      }

      // staff
      if ($staff.length) {
        this.staff = true;
      }
    }
});

modelNS.IMusicView = modelNS.BaseModelView.extend({
    events: {
      'mousedown .piano-key': 'onPressSound',
      'mousedown .piano-key-black': 'onPressSound',
      'mousedown .staff-note': 'onPressSound',
    },

    initialize: function () {
        modelNS.BaseModelView.prototype.initialize.apply(this, arguments);

        this.Piano = Synth.createInstrument('piano');

        // Целая - 4 секунды
        // половинная - 2 секунды
        // четвертная - 1 сек
        // восьмая - 0.5 сек
        // шестнадцатая - 0.25 сек
        // 32 я - 0.125
        this.noteDuration = 1;

        this.noteKeys = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
        this.octaves = [4,5];
        this.notes = modelNS.lang('notes');

        // for cache
        this.sounds = [];
    },
    render: function () {
        var self = this;

        modelNS.BaseModelView.prototype.render.apply(this);

        if (this.model.file) {
          this.renderPicture();
        }
        this.renderPiano();
        this.renderStaff();

        if (!this.model.piano) this.$piano.hide();
        if (!this.model.staff) this.$staff.hide();

        return this;
    },

    renderPicture: function () {
      var basePath = this.model.options.basePath,
          path = courseML.modelPath(this.model.file); // basePath + this.model.file;

      this.$svgWrap = $('<div class="svg-wrap"/>').appendTo(this.$el);

      if (path.lastIndexOf('.svg') != -1) {
        this.loadSvgJs(path.replace('.svg', '.js'));
      }
    },

    loadSvgJs: function (path) {
      var script = document.createElement('script'),
          id = path.replace(/.*\/(.*?)\.js/, '$1'),
          self = this,
          t = 0,
          modelSvgData = this.model.get('svgData') || {}; // // по каким-то причинам предзагружено (используется в РЭШ2)

      // по каким-то причинам предзагружено (используется в РЭШ2)
      if (modelSvgData[id]) {
        var correctXML = modelSvgData[id].replace(/_x5F_/g, '_')
				        .replace(/(.*?)(\<svg.*)/gi, '$2')
                .replace(/\"\&/gi,'"&amp;'); // оформить как общий фикс в basModel ?
        return this.renderSVG(correctXML);
      }

      script.type = 'text/javascript';
      script.id = 'layer_' + id;
      script.src = path;
      document.body.appendChild(script);
      script.onload = function() {
        var interval = setInterval(function() {
          if (t == 1200 && svgData[id] == undefined) {
            document.body.removeChild(script);
            clearInterval(interval);
          } else {
            var svg = svgData[id].replace(/_x5F_/g, '_')
                .replace(/(.*?)(\<svg.*)/gi, '$2')	// remove all comments, fix #8119
            clearInterval(interval);
            self.renderSVG(svg);
          }
          t++;
        }, 10);
      };
    },

    renderSVG: function (svg) {
      var regions = this.model.regions,
          $svg = $(svg).appendTo(this.$svgWrap),
          self = this;

      for (var i=0; i<regions.length; i++) {
        var region = regions[i],
            $region = $svg.find('#' + region.id).attr('class', 'clickable').attr('sound', region.sound);
        $region.click(function() {
          var $region = $(this),
              file = $region.attr('sound');
          if ($region.attr('playing')) {
            self.stopSound(file);
          } else {
            self.playSound(file);
          }
        })
      }
    },

    markRegion: function ($svgregion) {
      var $mark = $svgregion.data('mark');
      if (!$mark) {
        switch ($svgregion.prop("tagName")) {
  				case 'image':
  					var rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect'),
  							$mark = $(rect)
  								.attr({
  									rx:20,
  									ry:20,
  									x:0,
  									y:0,
  									width:$svgregion.attr('width'),
  									height:$svgregion.attr('height'),
  									transform:$svgregion.attr('transform'),
                    mark:1,
  								})
  								// .css('fill', 'transparent')
  								.insertBefore($svgregion);
              $svgregion.data('mark', $mark);
            default:
              $svgregion.attr('marked', 1);
          }
      }

      if ($mark) $mark.animate({
        opacity: 1
      }, 100);

      $svgregion.attr('playing', true);
    },

    unmarkRegion: function ($svgregion) {
      var $mark = $svgregion.data('mark');
      if ($mark) $mark.animate({
        opacity: 0
      }, 100);
      $svgregion.attr('playing', '');
      $svgregion.attr('marked', null);
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

      var $region = this.$svgWrap.find("[sound='"+file+"']");
      this.markRegion($region);
    },

    stopSound: function (file) {
      var audio = this.sounds[file];
      audio.pause();
      audio.currentTime = 0;

      var $region = this.$svgWrap.find("[sound='"+file+"']");
      this.unmarkRegion($region);
    },

    renderStaff: function () {
      var notes = this.notes,
          octaves = this.octaves,
          keys = this.noteKeys;

      this.$staff = $('<div class="staff"/>').appendTo(this.$el);

      for (var i=0; i<5; i++) {
        $('<div class="staff-line"/>').appendTo(this.$staff);
      }

      for (var o=0; o<octaves.length; o++) {
        for (var i=0; i<notes.length; i++) {
          $('<div class="staff-note"/>')
            .attr({
              key: keys[i],
              octave: octaves[o],
            })
            .html(notes[i])
            .appendTo(this.$staff);
        }
      }
    },

    renderPiano: function () {
      var keys = this.noteKeys,
          octaves = this.octaves;

      this.$piano = $('<div class="piano"/>').appendTo(this.$el);

      for (var o=0; o<octaves.length; o++) {
        for (var k=0; k<keys.length; k++) {
          $('<div class="piano-key"/>')
            .attr({
              key: keys[k],
              octave: octaves[o],
            })
            .appendTo(this.$piano);
          // #
          if (!(k == 2 || k == 6)) {
            $('<div class="piano-key-black"/>')
              .attr({
                key: keys[k] + '#',
                octave: octaves[o],
              })
              .appendTo(this.$piano);
          }
        }
      }
    },

    onPressSound: function (e) {
      var $target = $(e.target),
          key = $target.attr('key'),
          octave = $target.attr('octave');

      this.Piano.play(key, octave, this.noteDuration); // plays C4 for 1s using the 'piano' sound profile

      this.pianoKeyPress(key, octave);
      this.blinkNote(key, octave);
    },

    pianoKeyPress: function (key, octave) {
      var $key = this.$piano.find("[key='"+key+"'][octave='"+octave+"']");
      $key.addClass('pressed');
      clearTimeout($key.data('pressedTimer'));
      $key.data('pressedTimer', setTimeout(function () {
        $key.removeClass('pressed');
      }, 400));
    },

    blinkNote: function (key, octave) {
      var $note = this.$staff.find("[key='"+key+"'][octave='"+octave+"']");
      $note
        .animate({opacity:0},100)
        .animate({opacity:1},100)
    }

})
