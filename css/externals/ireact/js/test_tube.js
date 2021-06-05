// Жидкость из пробирки

(function (lib, img, cjs, ss) {

var p; // shortcut to reference prototypes

// library properties:
lib.properties = {
	width: 550,
	height: 550,
	scale: 200/550,
	fps: 12,
	color: "rgba(200,0,200,0.7)",
	opacity: 1.00,
	discharging: false,	// анимация выливания
	// plaque: true,	// анимация образования налета	// TODO: 1,2, и тд - номер фрейма который отобразить ? или конечное состояние добавить
	size: 40,	// высота жидкости (max 40ml, min 5ml)
	part:'front', // 'back'
	oil_film: '',
	manifest: [],
};



lib.ssMetadata = [];


// symbols:

// Налет ------------------------------------------------------------------------
(lib.Tween1 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.lf(["#252525","#FFFFFF","#E9E9E9","#252525"],[0,0.145,0.682,1],-11.5,9.6,11.5,9.6).s().p("AgFF0QhYgEgUg2IAAqsQBtAWB2gXIAAKtQgfA6hRAAIgHAAg");
	this.shape.setTransform(-0.1,-9.6);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-11.6,-27.6,23,55.3);

(lib.налет = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// налет
	this.instance_1 = new lib.Tween1("synched",0);
	this.instance_1.parent = this;
	this.instance_1.setTransform(15.9,107);
	this.instance_1.alpha = 0;

	this.timeline.addTween(cjs.Tween.get(this.instance_1).to({alpha:1},19).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0.1,0,32.2,134.6);
// Налет ------------------------------------------------------------------------


(lib.Symbol3 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// струйка
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#DBBD75").s().p("AgHK8QAMm6gBjcQAAiRgQo/QgTo/AAgcQAAg1ACgUIANAAQAbH1AFNMQAGQJAKFCQAAAKgFAIQgokNAGmHg");
	this.shape.setTransform(197.3,89.3);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#DBBD75").s().p("AgFK7QAbm6gQjcQgQiRgOo+IgHpaQgCg1AEgVIANAAQAIH1AWNLQAUQJgCFDIgFASQgxkOARmHg");
	this.shape_1.setTransform(197.2,89.3);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#DBBD75").s().p("AgPK7QASm6ABjcQAAiQgSo/QgTo8ACgeQgCgzAFgXIAMAAQAMH1ATNMQACQHAPFDIgFASQg0kPAKmFg");
	this.shape_2.setTransform(197.2,89.2);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape}]}).to({state:[{t:this.shape_1}]},2).to({state:[{t:this.shape_2}]},2).wait(2));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(194,-46.7,6.5,272);


(lib.glassbottom = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 3
	this.shape = new cjs.Shape();
	this.shape.graphics.lf(["rgba(255,255,255,0.412)","rgba(255,255,255,0.612)","rgba(255,255,255,0)"],[0,0.522,1],-5.8,0,6.2,0).s().p("AgQd7QgRAAgMgNQgLgMAAgRMAAAg6hQAAgRALgNQAMgMARAAIAmAAQAQAAAMAMQAEAFADAGIgGAFQgJAJAAAMMAAAA6lQAAALAHAIQgLAMgQAAg");
	this.shape.setTransform(-106.3,123.6);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	// Layer 5
	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.lf(["rgba(255,255,255,0.561)","rgba(255,255,255,0.361)","rgba(255,255,255,0)"],[0,0.522,1],-385.8,-108.9,346.4,-108.9).s().p("AgfBJQjsgBh1guQh0gsghgIQABgLAIgKQAKgKAVgJQG2B1IYh7IASAFQAbAJAIAMQg1AQiLAzQiHA0jiAAIgMAAg");
	this.shape_1.setTransform(-85.4,-82.7);

	this.timeline.addTween(cjs.Tween.get(this.shape_1).wait(1));

	// Layer 1
	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.lf(["#B1C4CD","rgba(166,192,217,0.6)","rgba(175,200,254,0)","rgba(136,167,204,0.6)","#A3C8DC"],[0,0.102,0.58,0.851,1],-53.8,-1.7,53.4,-1.7).s().p("EgAhAiVQktgMhCi2MAAAg+zQAPgYhXhCIgMgJQgXgRgOgQIgGgJQACgHAGgHQAKgKAUgJQG2B3IZh9IARAFQAQAFAJAHQgEAIgLAJQgMALgTAMQgbAQgUARQg6AuAAAsMAAAA+zQhpDCkRAAIggAAg");
	this.shape_2.setTransform(-85.9,129.7);

	this.timeline.addTween(cjs.Tween.get(this.shape_2).wait(1));

	// Layer 2
	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.rf(["#456976","rgba(183,193,200,0.6)","rgba(175,200,254,0)","rgba(157,174,183,0.6)","#476C7A"],[0,0.102,0.58,0.863,1],-0.6,-26.3,0,-0.6,-26.3,53.8).s().p("AgSB0QktgMgkiMQgdhYA7ALQBuAtCSAaQCQAaDuhaQBJglgcBrQhICZkLAAIglgBg");
	this.shape_3.setTransform(-87.4,334.4);

	this.timeline.addTween(cjs.Tween.get(this.shape_3).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-138.8,-90,106.9,439.6);


(lib._6 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.lf(["#3C6286","rgba(172,184,210,0.6)","rgba(176,197,255,0.251)","rgba(142,159,198,0.6)","#496C8E"],[0,0.102,0.329,0.863,1],-53.5,2.8,53.6,2.8).s().p("EgAfAjCQksgMhDi2MAABg+zQAOgYhXhCIgLgIQhjhKBVgkQHlh6HqBzQBtAchpBAQgbARgUAQQg5AvAAArMAAAA+zQhqDDkSAAIgfgBg");

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-53.6,-224.3,107.2,448.7);





(lib.glassunder = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 2
	this.shape = new cjs.Shape();
	this.shape.graphics.rf(["rgba(128,128,128,0.251)","#FFFFFF"],[0.871,1],-0.6,-51.9,0,-0.6,-51.9,117.5).s().p("Am9gzQDLAqDkAAQDzAADZgxQjHB1j7AAQj2AAjDhug");
	this.shape.setTransform(1,-212.5);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	// Layer 1
	this.instance = new lib._6();
	this.instance.parent = this;
	this.instance.alpha = 0.68;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-53.6,-224.3,107.2,448.7);



(lib.пробирка = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});
	

	// задняя часть пробирки
	if (lib.properties.part == 'back') {
		// Layer 5
		this.instance_2 = new lib.glassunder("synched",0);
		this.instance_2.parent = this;
		this.instance_2.setTransform(16.1,67.3,0.3,0.3);

		this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(50).to({startPosition:0},0).wait(50));
		return;
	}

	// timeline functions:
	// this.frame_49 = function() {
		/* stop();*/
		/* stop();*/
	// }

	var rgba = colorToArray(lib.properties.color),
			layer4color,
			liquidcolor;

	// actions tween:
	// this.timeline.addTween(cjs.Tween.get(this).wait(49).call(this.frame_49).wait(51));

	// glass bottom
	this.instance = new lib.glassbottom("synched",0);
	this.instance.parent = this;
	this.instance.setTransform(16.2,68.7,0.3,0.3,0,0,0,-85.5,129.7);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(49).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(50));

	// Размытые пятна сверху
	// if (lib.properties.blur) {
		// var blurLib = window.modelNS ? modelNS.IReact.libs.blur : lib;
		// blurLib.properties.blur = lib.properties.blur;
		// this.instance = new blurLib.blur();
		// this.instance.setTransform(10,3.8,0.17,0.3,0,0,0,50,0);
		// this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));
	// }

	// Налет
	if (lib.properties.plaque) {
		this.instance = new lib.налет();
		this.instance.parent = this;
		this.instance.setTransform(0,-2,1,1,0,0,0,0,0);

		this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));
	}

	// Layer 1 (mask)
	var mask = new cjs.Shape();
	mask._off = true;
	// var mask_graphics_17 = new cjs.Graphics().p("AjCILIAAwVIGFAAIAAQVg");
	// var mask_graphics_18 = new cjs.Graphics().p("AmtHLIAAuVINbAAIAAOVg");
	// var mask_graphics_19 = new cjs.Graphics().p("AqYGKIAAsTIUxAAIAAMTg");
	// var mask_graphics_20 = new cjs.Graphics().p("AuDFKIAAqTIcGAAIAAKTg");
	// var mask_graphics_45 = new cjs.Graphics().p("AuDDRIAAmhIcGAAIAAGhg");
	// var mask_graphics_46 = new cjs.Graphics().p("AqjCeIAAk7IVHAAIAAE7g");
	// var mask_graphics_47 = new cjs.Graphics().p("AnDBrIAAjVIOHAAIAADVg");
	// var mask_graphics_48 = new cjs.Graphics().p("AjjA4IAAhvIHHAAIAABvg");
	// var mask_graphics_49 = new cjs.Graphics().p("AgEAFIAAgIIAIAAIAAAIg");

	// this.timeline.addTween(cjs.Tween.get(mask).to({graphics:null,x:0,y:0}).wait(17).to({graphics:mask_graphics_17,x:11.8,y:29.8}).wait(1).to({graphics:mask_graphics_18,x:35.3,y:25.7}).wait(1).to({graphics:mask_graphics_19,x:58.7,y:21.6}).wait(1).to({graphics:mask_graphics_20,x:82.2,y:17.4}).wait(25).to({graphics:mask_graphics_45,x:82.2,y:5.3}).wait(1).to({graphics:mask_graphics_46,x:106.6,y:0.2}).wait(1).to({graphics:mask_graphics_47,x:131,y:-4.9}).wait(1).to({graphics:mask_graphics_48,x:155.3,y:-10}).wait(1).to({graphics:mask_graphics_49,x:179.7,y:-15.1}).wait(1).to({graphics:null,x:0,y:0}).wait(50));

	// струйка
	if (lib.properties.discharging) {
		this.instance_1 = new lib.Symbol3();
		this.instance_1.parent = this;
		this.instance_1.setTransform(27.2,2.9,0.999,0.999,-79.2,0,0,194,-46.8);
		this.instance_1._off = true;

		if (rgba) {
			this.instance_1.filters = [new cjs.ColorFilter(0, 0, 0, rgba[3]*0.7, rgba[0], rgba[1], rgba[2], 0)];
		} else {
			this.instance_1.filters = [new cjs.ColorFilter(0, 0, 0, 1, 217, 255, 255, 0)];
		}
		this.instance_1.cache(192,-49,11,276);

		this.instance_1.mask = mask;

		this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(17).to({_off:false},0).to({rotation:-85.5},20).to({regX:193.8,regY:-46.7,rotation:-91.3,x:27.1,y:3},12).to({_off:true},1).wait(50));
	}

	// какаято фигня судя по всему отвечает за "очистку" пробирки от вылитой жидкости
	if (lib.properties.discharging) {
		var mask_1 = new cjs.Shape();
		mask_1._off = true;
		var mask_1_graphics_28 = new cjs.Graphics().p("AhtJfIACgOIAGADIAAAAIACgBQALgDAJgYIAAAAQgPAegNgHIAAAAIgJgFIgCgCIADgBQAZgHARiFIAAAAIAUiuIAAAAQAQiDAThsIAAAAQARhiATjPIAAAAQAVjIAFgYIAAAAQAfihAZAHIAAAAIACAAIgBABQgWAPgVB/IAAAAQgGAqgRDJIAAAAQAVjFAEgYIAAAAQAgigAZAGIAAAAIACABIgCABIAATeQg3Awg5AAIAAAAQg3AAg7gvgAAWBDIgEAfIAAAAIAFgnIAAAAIgBAIg");
		var mask_1_graphics_29 = new cjs.Graphics().p("AhsJhIACgNIAGACIAAAAIACgBQALgDAJgYIAAAAQgPAegNgHIAAAAIgJgFIgCgBIADgBQAZgIAQiFIAAAAIATiuIAAAAQAPiEAShtIAAAAQAQhhASjQIAAAAQAUjJAEgYIAAAAQAfihAZAGIAAAAIACABIgCABQgVAPgUB/IAAAAQgGArgQDJIAAAAQAUjGAEgXIAAAAQAeihAZAGIAAAAIACAAIgBABIAIThQg3Axg5AAIAAAAQg3AAg7gvgAATBDIgDAfIAAAAIAEgnIAAAAIgBAIg");
		var mask_1_graphics_30 = new cjs.Graphics().p("AhsJjIACgNIAGACIAAAAIACgBQALgDAIgYIAAAAQgOAegNgHIAAAAIgJgFIgCgBIADgBQAZgIAPiFIAAAAIASivIAAAAQAOiEARhtIAAAAQAQhiARjQIAAAAQASjKAEgYIAAAAQAdihAaAGIAAAAIACAAIgCABQgWAPgTCBIAAAAQgFAqgODKIAAAAQASjGAEgYIAAAAQAdiiAZAGIAAAAIACABIgBABIAQTjQg3Axg6AAIAAAAQg2AAg7gugAAQBEIgDAfIAAAAIAEgnIAAAAIgBAIg");
		var mask_1_graphics_31 = new cjs.Graphics().p("AhsJlIACgNIAGACIAAAAIACgBQALgDAIgZIAAAAQgOAfgNgHIAAAAIgJgFIgCgBIADgBQAZgIAOiGIAAAAIARivIAAAAQANiFAQhsIAAAAQAPhjAQjQIAAAAQARjKAEgZIAAAAQAcihAZAGIAAAAIACAAIgBABQgWAPgSCBIAAAAQgGAqgMDKIAAAAQAQjGAEgYIAAAAQAdiiAZAGIAAAAIACAAIgCABIAZTlQg3Azg6AAIAAAAQg2AAg7gugAAMBEIgDAfIAAAAIAEgnIAAAAIgBAIg");
		var mask_1_graphics_32 = new cjs.Graphics().p("AhsJnIACgNIAGACIAAAAIACgBQALgDAIgZIAAAAQgOAfgNgHIAAAAIgJgFIgCgBIACgBQAagIANiGIAAAAIAQiwIAAAAQAMiFAQhtIAAAAQAOhjAQjRIAAAAQANjKAEgYIAAAAQAcijAZAGIAAAAIACABIgCABQgVAPgRCBIAAAAQgGAqgLDLIAAAAQAPjHAEgYIAAAAQAbijAZAGIAAAAIACABIgBABIAhTnQg3Azg7AAIAAAAQg1AAg7gtgAAJBEIgDAfIAAAAIADgnIAAAAIAAAIg");
		var mask_1_graphics_33 = new cjs.Graphics().p("AhsJpIACgNIAGACIAAAAIACgBQALgDAIgZIAAAAQgOAfgNgHIAAAAIgJgFIgCgBIACgBQAagIAMiHIAAAAIAOiwIAAAAQAMiFAPhtIAAAAQANhjAPjSIAAAAQAMjLAEgYIAAAAQAaijAZAGIAAAAIACAAIgBABQgWAQgQCBIAAAAQgFAqgKDLIAAAAQAOjHAEgYIAAAAQAaijAZAGIAAAAIACAAIgBABIApTpQg3A0g7AAIAAAAQg1AAg7gsgAAFBEIgCAgIAAAAIADgoIAAAAIgBAIg");
		var mask_1_graphics_34 = new cjs.Graphics().p("AhsJrIACgNIAGACIAAAAIACgBQALgDAIgZIAAAAQgOAfgNgHIAAAAIgJgFIgCgBIACgBQAagIALiHIAAAAIANixIAAAAQALiFAOhuIAAAAQANhjANjSIAAAAQANjLABgZIAAAAQAZijAaAFIAAAAIACABIgCABQgVAPgPCCIAAAAQgFArgJDLIAAAAQANjIADgYIAAAAQAZijAaAFIAAAAIACABIgCABIAyTrQg3A1g8AAIAAAAQg0AAg7gsgAABBFIgBAfIAAAAIACgnIAAAAIgBAIg");
		var mask_1_graphics_35 = new cjs.Graphics().p("AhsJtIACgNIAGACIAAAAIACgBQALgEAIgZIAAAAQgOAfgNgGIAAAAIgJgFIgCgBIACgBQAZgIALiIIAAAAIAMixIAAAAQAKiFANhuIAAAAQAMhkAMjSIAAAAQAMjMADgYIAAAAQAWikAZAFIAAAAIACABIgBABQgWAPgOCCIAAAAQgEArgGDMIAAAAQAKjIADgZIAAAAQAYijAZAFIAAAAIACAAIgBABIA6TtQg3A2g8AAIAAAAQg0AAg7grgAAABFIgCAgIAAAAIACgoIAAAAIAAAIg");
		var mask_1_graphics_36 = new cjs.Graphics().p("AhrJvIABgNIAGACIAAAAIACgBQALgEAHgZIAAAAQgNAfgNgGIAAAAIgJgFIgCgBIACgBQAZgJAKiHIAAAAIALixIAAAAQAJiHAMhuIAAAAQAMhkAKjSIAAAAQAKjNADgYIAAAAQAVikAaAFIAAAAIACAAIgCABQgVAQgNCCIAAAAQgDArgGDMIAAAAQAJjIADgYIAAAAQAWilAaAGIAAAAIACAAIgCABIBDTvQg3A2g9AAIAAAAQgzAAg6gqgAgEBFIgCAgIAAAAIADgoIAAAAIgBAIg");
		var mask_1_graphics_37 = new cjs.Graphics().p("AhrJxIABgOIAGADIAAAAIACgCQALgDAHgZIAAAAQgNAfgNgGIAAAAIgJgFIgCgBIACgBQAZgJAJiIIAAAAIAKixIAAAAQAHiHAMhuIAAAAQALhkAJjUIAAAAQAJjMADgZIAAAAQAUilAZAGIAAAAIACAAIgBABQgVAQgLCDIAAAAQgEArgFDMIAAAAQAJjJADgYIAAAAQAUilAZAFIAAAAIACABIgBABIBLTwQg3A4g9AAIAAAAQgzAAg6gqgAgHBGIgCAfIAAAAIACgoIAAAAIAAAJg");
		var mask_1_graphics_38 = new cjs.Graphics().p("AhrJzIABgOIAGACIAAAAIACgBQALgDAHgaIAAAAQgMAggOgGIAAAAIgJgFIgCgBIACgBQAZgJAIiIIAAAAIAIiyIAAAAQAHiHAMhvIAAAAQAKhkAHjUIAAAAQAIjNACgZIAAAAQAVilAXAFIAAAAIACABIgBABQgTAQgMCDIAAAAQgDArgDDNIAAAAQAHjKADgYIAAAAQASilAaAFIAAAAIACAAIgCABIBUTyQg3A5g+AAIAAAAQgyAAg6gpgAgLBGIgBAgIAAAAIABgoIAAAAIAAAIg");
		var mask_1_graphics_39 = new cjs.Graphics().p("AhrJ1IABgOIAGACIAAAAIADgBQAKgEAHgZIAAAAQgMAggOgGIAAAAIgJgFIgCgBIACgBQAZgJAHiJIAAAAIAHiyIAAAAQAGiHALhvIAAAAQAJhlAGjUIAAAAQAGjNADgZIAAAAQATimAYAFIAAAAIACAAIgCACQgTAQgLCDIAAAAQgDArgBDOIAAAAQAFjKADgZIAAAAQASilAZAFIAAAAIACAAIgBABIBcT0Qg3A5g+AAIAAAAQgzAAg5gogAgPBGIgBAgIAAAAIACgoIAAAAIgBAIg");
		var mask_1_graphics_40 = new cjs.Graphics().p("AhrJ3IABgOIAGACIAAAAIADgBQAKgEAHgZIAAAAQgMAfgOgGIAAAAIgJgEIgCgBIACgCQAZgJAGiJIAAAAIAGiyIAAAAQAFiIAKhvIAAAAQAJhlAEjUIAAAAQAFjOACgZIAAAAQATimAYAFIAAAAIABAAIgBABQgTARgKCDIAAAAQgDAsAADNIAAAAQAEjKADgYIAAAAQASimAXAEIAAAAIACABIgBABIBlT1Qg3A6g/AAIAAAAQgyAAg5gngAgSBGIgBAgIAAAAIABgoIAAAAIAAAIg");
		var mask_1_graphics_41 = new cjs.Graphics().p("AhrJ5IABgOIAGACIAAAAIADgCQAKgDAHgaIAAAAQgMAggOgGIAAAAIgJgEIgCgCIACgBQAZgJAFiJIAAAAIAFizIAAAAQAEiIAJhvIAAAAQAIhlADjVIAAAAQADjOADgZIAAAAQARinAZAFIAAAAIACAAIgBABQgVARgJCEIAAAAQgDArACDOIAAAAQADjKACgZIAAAAQARimAYAEIAAAAIACAAIgCACIBuT2Qg3A7g/AAIAAAAQgyAAg5gmgAgWBHIgBAgIAAAAIABgpIAAAAIAAAJg");
		var mask_1_graphics_42 = new cjs.Graphics().p("AhrJ6IABgOIAGACIAAAAIADgBQAKgEAHgZIAAAAQgMAggOgGIAAAAIgJgEIgCgCIACgBQAZgKAEiJIAAAAIADizIAAAAQAEiIAIhwIAAAAQAHhlACjVIAAAAQACjPACgZIAAAAQAQinAZAFIAAAAIADAAIgCABQgUARgJCEIAAAAQgCArADDPIAAAAQABjLACgZIAAAAQARimAYAEIAAAAIABAAIgBABIB2T5Qg3A7g/AAIAAAAQgyAAg5gmgAgaBHIAAAgIAAAAIAAgoIAAAAIAAAIg");
		var mask_1_graphics_43 = new cjs.Graphics().p("AhqJ8IAAgOIAGACIAAAAIADgBQAKgEAGgaIAAAAQgLAggOgFIAAAAIgJgFIgCgBIACgBQAZgKADiKIAAAAIACizIAAAAQADiIAHhxIAAAAQAHhlAAjWIAAAAQAAjPACgYIAAAAQAPioAaAFIAAAAIACAAIgCABQgUARgHCEIAAAAQgCAsADDPIAAAAQABjMACgYIAAAAQAPioAZAFIAAAAIACAAIgBABIB9T6Qg3A9g/AAIAAAAQgyAAg4gmgAgdBHIgBAgIAAAAIABgoIAAAAIAAAIg");
		var mask_1_graphics_44 = new cjs.Graphics().p("AhqJ+IAAgOIAGACIAAAAIADgCQAKgEAGgZIAAAAQgLAggOgGIAAAAIgJgEIgCgBIACgCQAZgJACiKIAAAAIABi0IAAAAQABiJAHhwIAAAAQAGhmgBjWIAAAAQgBjPACgZIAAAAQANioAaAEIAAAAIACABIgBABQgVARgGCFIAAAAQgCArAFDPIAAAAQgBjLACgZIAAAAQAOioAaAEIAAAAIACABIgCABICGT7Qg3A+g/AAIAAAAQgyAAg4glgAghBHIAAAgIAAAAIAAgoIAAAAIAAAIg");
		var mask_1_graphics_45 = new cjs.Graphics().p("AhqJ/IAAgOIAGACIAAAAIADgBQAKgEAGgaIAAAAQgLAggOgFIAAAAIgJgEIgCgCIACgBQAZgKABiKIAAAAIAAi0IAAAAQAAiJAGhxIAAAAQAFhlgCjXIAAAAQgDjPACgaIAAAAQAMinAaADIAAAAIACABIgBABQgUARgGCFIAAAAQgBAsAGDPIAAAAQgCjMACgZIAAAAQAMinAaADIAAAAIACABIgCABICPT8Qg3A/g/AAIAAAAQgyAAg4glgAglBIIAAAgIAAAAIAAgpIAAAAIAAAJg");
		var mask_1_graphics_46 = new cjs.Graphics().p("AhqKBIAAgOIAHACIAAAAIACgBQAKgFAGgaIAAAAQgLAhgOgGIAAAAIgJgEIgCgBIACgBQAZgLAAiKIAAAAIgCi1IAAAAQAAiIAFhxIAAAAQAFhmgEjXIAAAAQgEjQABgZIAAAAQAMioAZADIAAAAIACABIgBABQgUARgFCGIAAAAQgBArAIDQIAAAAQgEjMACgZIAAAAQALioAaADIAAAAIACABIgBABICXT9Qg3BAhAAAIAAAAQgxAAg4gkgAgpBIIABAgIAAAAIgBgpIAAAAIAAAJg");
		var mask_1_graphics_47 = new cjs.Graphics().p("AhqKDIAAgOIAHABIAAAAIACgBQAKgEAGgaIAAAAQgLAggOgFIAAAAIgJgEIgCgBIACgCQAZgKgBiLIAAAAIgDi1IAAAAQgBiJAEhxIAAAAQAEhmgGjXIAAAAQgFjQABgZIAAAAQALipAZADIAAAAIACABIgBABQgUASgECFIAAAAQgBAsAKDQIAAAAQgFjNABgZIAAAAQALioAZADIAAAAIACAAIgBACICgT+Qg3BBhAAAIAAAAQgxAAg4gjgAgsBIIAAAgIAAAAIAAgoIAAAAIAAAIg");
		var mask_1_graphics_48 = new cjs.Graphics().p("AhqKEIAAgOIAHACIAAAAIACgBQAKgFAGgaIAAAAQgLAhgOgFIAAAAIgJgEIgCgCIACgBQAYgLgBiKIAAAAIgEi2IAAAAQgCiJADhxIAAAAQADhngHjXIAAAAQgHjRACgZIAAAAQAJipAZADIAAAAIACABIgBABQgUASgDCFIAAAAQAAAsALDRIAAAAQgHjNABgZIAAAAQAKipAZADIAAAAIACAAIgBACICpT/Qg2BChCAAIAAAAQgwAAg4gjgAgwBIIABAgIAAAAIgBgoIAAAAIAAAIg");
		var mask_1_graphics_49 = new cjs.Graphics().p("AhpKGIAAgOIAGABIAAAAIACgBQAKgEAGgbIAAAAQgLAhgOgFIAAAAIgJgEIgCgBIACgCQAYgKgCiLIAAAAIgFi2IAAAAQgEiJADhyIAAAAQADhmgJjYIAAAAQgIjRABgZIAAAAQAIiqAZAEIAAAAIACAAIgBABQgTASgCCGIAAAAQgBAsANDQIAAAAQgIjNABgZIAAAAQAIipAZADIAAAAIACAAIgBACICyUAQg2BChCABIAAAAQgwAAg3gigAg0BIIABAhIAAAAIgBgpIAAAAIAAAIg");

		this.timeline.addTween(cjs.Tween.get(mask_1).to({graphics:null,x:0,y:0}).wait(28).to({graphics:mask_1_graphics_28,x:15.4,y:67.2}).wait(1).to({graphics:mask_1_graphics_29,x:16.3,y:67.4}).wait(1).to({graphics:mask_1_graphics_30,x:17.3,y:67.5}).wait(1).to({graphics:mask_1_graphics_31,x:18.3,y:67.7}).wait(1).to({graphics:mask_1_graphics_32,x:19.3,y:67.8}).wait(1).to({graphics:mask_1_graphics_33,x:20.3,y:68}).wait(1).to({graphics:mask_1_graphics_34,x:21.3,y:68.1}).wait(1).to({graphics:mask_1_graphics_35,x:22.3,y:68.2}).wait(1).to({graphics:mask_1_graphics_36,x:23.3,y:68.4}).wait(1).to({graphics:mask_1_graphics_37,x:24.3,y:68.5}).wait(1).to({graphics:mask_1_graphics_38,x:25.4,y:68.6}).wait(1).to({graphics:mask_1_graphics_39,x:26.4,y:68.8}).wait(1).to({graphics:mask_1_graphics_40,x:27.4,y:68.9}).wait(1).to({graphics:mask_1_graphics_41,x:28.4,y:69}).wait(1).to({graphics:mask_1_graphics_42,x:29.5,y:69.1}).wait(1).to({graphics:mask_1_graphics_43,x:30.5,y:69.2}).wait(1).to({graphics:mask_1_graphics_44,x:31.5,y:69.4}).wait(1).to({graphics:mask_1_graphics_45,x:32.6,y:69.5}).wait(1).to({graphics:mask_1_graphics_46,x:33.6,y:69.6}).wait(1).to({graphics:mask_1_graphics_47,x:34.7,y:69.7}).wait(1).to({graphics:mask_1_graphics_48,x:35.7,y:69.8}).wait(1).to({graphics:mask_1_graphics_49,x:36.9,y:70}).wait(1).to({graphics:null,x:0,y:0}).wait(50));
	}

	if (rgba) {
		layer4color = rgba.slice(0);
		layer4color[3] /= 3;
		layer4color = "rgba("+layer4color.join(",")+")";
	} else {
		layer4color = "#D9FFFF";
	}

	// this.shape = new cjs.Shape();
	// this.shape.graphics.rf(["rgba(252,215,71,0.514)","rgba(242,200,61,0.573)","rgba(242,200,61,0.573)"],[0.365,0.769,1],0,0,0,0,0,6.3).s().p("AhXAaIgcgJQgcgJgNgIIgIgCIgRgKIAAgCIABgCQC0gvC1AvQABAAAAABQAAAAAAAAQAAABAAAAQAAABgBAAIgCACQgVALgXALQg/AdhCAAQgtAAgwgOg");
	// this.shape.setTransform(18.5,4.1);

	// this.shape_1 = new cjs.Shape();
	// this.shape_1.graphics.lf(["#C2801E","#FCEDB4","rgba(186,112,1,0.902)"],[0,0.365,1],-18.4,6,18.4,6).s().p("Ai2IcIADw2IARAKIAIAFQAMAHAdAKIAbAIQB0AjBrgyQAWgKAWgOIACgCIAAABIAAgBIAAQ3g");
	// this.shape_1.setTransform(18.4,56.7);

	// this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	if (lib.properties.discharging) {
		// верхний уровень жидкости
		this.shape = new cjs.Shape();
		this.shape.graphics.f(layer4color).s().p("AhngCIgIgFIgBAAIgCgCIADAAQBvgdBxAdIACAAIgCACQg0Agg5AAQgzAAg4gbg");
		this.shape.setTransform(15.9,58.9);

		this.shape_1 = new cjs.Shape();
		this.shape_1.graphics.f(layer4color).s().p("AhMAiQgNAAgMgFIgJgDIgBAAIgBgBIAAgBIgBAAIAAAAIADgBQAOgFAOgJIBSgdQAogQAnABQARgEAQADIACAAIgBABQgNAJgOANQgmAYgpAQQgYALgbAAQgQAAgQgEg");
		this.shape_1.setTransform(15.8,58.5);

		this.shape_2 = new cjs.Shape();
		this.shape_2.graphics.f(layer4color).s().p("AhjA/QgFABgFgDIgBAAIgCgCIgBAAIABAAIADgCQAOgGAOgPQAogXApgdQAogfAmgFQARgLARAAIACAAIAAABQgOAJgOAUQglAggoAfQgnAggsAAQgHACgIAAIgKgBg");
		this.shape_2.setTransform(15.8,58);

		this.shape_3 = new cjs.Shape();
		this.shape_3.graphics.f(layer4color).s().p("AhtBdIgBAAIgCgCIAAAAIgBgBIABAAIADgCQAPgHAOgVQAmgfAqgsQAogvAkgLQASgSARgCIACAAIAAAAIABAAIgBAAQgOAKgPAcQgjAmgoAuQgnAxgqAIQgNAIgNAAIgEAAQgDAAgEgBg");
		this.shape_3.setTransform(15.8,57.8);

		this.shape_4 = new cjs.Shape();
		this.shape_4.graphics.f(layer4color).s().p("AhsB8IgCAAIgCgCIAAgBIgBAAIABAAIADgCQAQgIAOgcQAkgmArg8QAog+AjgSQASgZARgDIACgBIABAAIAAAAIABAAIgBAAQgPAKgOAjQgjAsgnA/QgmBBgqAQQgNAOgNABQgEACgCAAQgDAAgDgCg");
		this.shape_4.setTransform(15.8,57.7);

		this.shape_5 = new cjs.Shape();
		this.shape_5.graphics.f(layer4color).s().p("AhsCbIgBAAIgDgCIgBgBIABAAIAEgCQAQgKAOgiQAjgtArhMQAohOAigYQASgfARgGIADgBQAAAAAAgBQAAAAABAAQAAAAAAAAQAAABAAAAIABAAQgQAKgPAqQgiAzgnBOQglBRgpAZQgOASgNAEQgEADgDAAIgGgCg");
		this.shape_5.setTransform(15.8,57.5);

		this.shape_6 = new cjs.Shape();
		this.shape_6.graphics.f(layer4color).s().p("AhsC7IgBgBIgDgCIAAAAIgBgBIABAAIAEgDQARgKAOgpQAhg0ArhcQAohdAigeQASgnARgHIADgCQAAAAABgBQAAAAAAAAQAAAAABAAQAAAAAAABIABAAIgBAAQgPALgQAxQghA5gmBeQglBhgoAiQgOAWgOAGQgEAEgEAAIgGgBg");
		this.shape_6.setTransform(15.8,57.4);

		this.shape_7 = new cjs.Shape();
		this.shape_7.graphics.f(layer4color).s().p("AhrDaIgCgBIgDgCIAAgBIgBAAIABAAQADgBACgCQAQgMAPgvQAfg8ArhrQAphsAgglQASguASgJIAEgCQAAgBAAAAQABAAAAAAQAAAAAAAAQABAAAAAAIABAAIgBABQgQALgQA4QggBAglBuQglBwgnArQgOAbgPAIQgEAFgFAAIgFgBg");
		this.shape_7.setTransform(15.8,57.3);

		this.shape_8 = new cjs.Shape();
		this.shape_8.graphics.f(layer4color).s().p("AhqD5IgCAAIgEgDIAAAAIgBgBIABAAQADgBADgCQAQgNAOg2QAehDAsh6QAph8AegrQAUg1ARgLIAEgDQAAAAAAgBQABAAAAAAQABAAAAAAQABAAAAAAIABAAIgBABQgQALgSBAQgeBGglB+QgjCAgnA0QgPAfgOAKQgFAGgGAAIgEgBg");
		this.shape_8.setTransform(15.8,57.1);

		this.shape_9 = new cjs.Shape();
		this.shape_9.graphics.f(layer4color).s().p("AhqEYIgCAAIgEgDIgBgBIAAAAIABAAQADgBADgDQARgOAOg8QAdhLAsiJQApiMAdgxQATg8ASgNIAEgDQAAgBABAAQAAAAABAAQAAAAAAAAQABAAAAAAIABAAIABAAIgBABQgSALgQBHQgeBMgkCOQgkCQgmA9QgOAkgPAMQgGAHgGAAIgEgBg");
		this.shape_9.setTransform(15.8,57);

		this.shape_10 = new cjs.Shape();
		this.shape_10.graphics.f(layer4color).s().p("AhqE3IgBAAIgFgDIgBgBIAAAAIABgBQADgBADgDQARgPAPhCQAbhSAsiZQApicAcg3QAUhCASgQIAEgDQAAgBABAAQABAAAAAAQABgBAAAAQABAAAAAAIABAAIABABIgBAAQgSAMgRBOQgdBTgkCeQgiCggmBFQgPApgOAOQgHAJgGAAIgFgCg");
		this.shape_10.setTransform(15.8,56.9);

		this.shape_11 = new cjs.Shape();
		this.shape_11.graphics.f(layer4color).s().p("AhpFXIgCgBIgFgDIgBgBIAAAAIACgBQADAAADgEQARgQAPhJQAZhZAtipQApirAbg9QAUhKASgRIAEgEQADgCACAAIABAAIABABIgBAAQgTANgRBVQgbBZgkCuQgiCwglBOQgPAtgPAQQgHAKgGAAIgFgBg");
		this.shape_11.setTransform(15.8,56.8);

		this.shape_12 = new cjs.Shape();
		this.shape_12.graphics.f(layer4color).s().p("AhpF2IgCgBIgFgDIgBgBIAAAAIACgBQADgBADgEQASgRAOhPQAZhhAsi4QAqi6AZhEQAVhRATgTIAEgEQADgDACABIABAAIABAAIgBABQgTANgSBcQgaBfgjC+QgiDAgkBXQgPAygPASQgIALgHAAIgFgBg");
		this.shape_12.setTransform(15.8,56.7);

		this.shape_13 = new cjs.Shape();
		this.shape_13.graphics.f(layer4color).s().p("AhpGVIgBgBIgHgEIAAAAIACgBQADgBAEgEQASgSAOhWIBEkwQAqjJAYhKQAVhYATgVIAEgFQADgDADABIABAAIABAAIgBABQgUANgSBjQgZBmgjDOQghDQgjBgQgQA2gPAUQgIAMgIAAIgFgBg");
		this.shape_13.setTransform(15.8,56.5);

		this.shape_14 = new cjs.Shape();
		this.shape_14.graphics.f(layer4color).s().p("AhoG0IgCgBIgFgDIgCgBIACgBQAEgBADgEQATgUAOhcQAWhvAsjYQArjZAXhQQAVhfATgXIAEgFQAEgDADABIABAAIABAAIgBABQgUANgTBqQgYBtgiDdQghDggiBpQgQA7gQAWQgIAOgIAAIgFgCg");
		this.shape_14.setTransform(15.8,56.4);

		this.shape_15 = new cjs.Shape();
		this.shape_15.graphics.f(layer4color).s().p("AhoHUIgCgBIgIgFIADgBQAEgBADgEQAUgWAOhhQAUh3AtjnQArjpAVhXQAWhlASgZIAGgGQADgDAEABIABAAIACAAIgCABQgVAOgUBxQgWBzgiDtQggDwghBxQgRBAgPAYQgJAPgJAAIgFgBg");
		this.shape_15.setTransform(15.9,56.3);

		this.shape_16 = new cjs.Shape();
		this.shape_16.graphics.f(layer4color).s().p("AhoHzIgCgBIgFgEIgDgBIADgBQAEgBAEgFQATgWAOhpQATh+Atj2QArj5AVhcQAVhtAUgbIAFgGQAEgEAEABIABAAIACABIgCABQgVAOgVB4QgVB5ghD+QgfD/ghB7QgRBEgQAaQgJAQgJAAIgGgBg");
		this.shape_16.setTransform(15.9,56.2);

		this.shape_17 = new cjs.Shape();
		this.shape_17.graphics.f(layer4color).s().p("AhnISIgIgFIgDgCIADgBQAZgGARiGQASiFAtkGQArkIAThjQAfihAaAHIACAAIgCABQgWAPgVB/QgUCAghENQgeEQggCDQgdB2gYAAIgFgBg");
		this.shape_17.setTransform(15.9,56.1);

		this.shape_18 = new cjs.Shape();
		this.shape_18.graphics.f(layer4color).s().p("AhmIbIgCgBIgJgGIACgBIABAAQAXgGAQhxIADgXIATiFQAOhdAUh3IAKg4IAfjFQATh0AKg5IAEgVQAbiBAXgGIADAAIABAAIABAAIgBABQgUAOgTBsIgEAXQgLBHgPB5IgaDSIgKBNQgMBygPBdQgNBKgMAzIgFAWQgaBjgWAAIgFgBg");
		this.shape_18.setTransform(15.9,56.9);

		this.shape_19 = new cjs.Shape();
		this.shape_19.graphics.f(layer4color).s().p("AhmIjIgCgBIgHgEIgCgCIACgBIABAAQAXgGARhzIADgXIASiHQAOhhAUh1IAKg6IAfjJIAdiwIAEgVQAbiEAWgFIAEAAIABAAIABABIgBAAIgBABQgUAOgTBuIgEAXQgLBGgPB9IgZDUIgJBOQgNBwgPBiQgMBNgMAzIgFAWQgbBlgWAAIgFgBg");
		this.shape_19.setTransform(15.9,57.7);

		this.shape_20 = new cjs.Shape();
		this.shape_20.graphics.f(layer4color).s().p("AhlIrIgCgBIgJgGIACgBIABAAQAXgGARh1IADgXIASiIQAOhlAUh1IAKg6IAejNQATh7AJg4IAEgWQAciHAXgDIADAAIABAAIAAABIgBABQgUAOgTBvIgEAYQgKBFgPCBIgZDWIgKBPQgLBtgQBpQgMBOgMA0IgFAWQgbBngXAAIgEgBg");
		this.shape_20.setTransform(15.9,58.6);

		this.shape_21 = new cjs.Shape();
		this.shape_21.graphics.f(layer4color).s().p("AhlI0IgCgBIgJgGIACgBIABAAQAYgHAQh3IADgXIASiKQAPhpAUhzIAKg8IAdjRQASh+AKg3IADgWQAdiLAXgCIADAAIABAAIAAABIgCABQgUAPgTBxIgEAYQgKBEgOCEIgYDZIgKBQIgbDaQgNBQgMA0IgFAXQgaBpgYAAIgEgBg");
		this.shape_21.setTransform(16,59.4);

		this.shape_22 = new cjs.Shape();
		this.shape_22.graphics.f(layer4color).s().p("AhkI8IgCgBIgIgEIgCgCIADgBIABAAQAXgHARh4IADgYIASiLQAPhtAThyIAKg9QAPhnAPhuQARiCAJg2IADgWQAeiOAXgBIADAAIAAAAIAAABIgBABQgUAPgUBzIgEAYQgJBDgOCJIgYDaIgJBRIgbDeQgNBSgMA1IgEAWQgcBrgXAAIgEgBg");
		this.shape_22.setTransform(16,60.2);

		this.shape_23 = new cjs.Shape();
		this.shape_23.graphics.f(layer4color).s().p("AhkJFIgBgBIgIgFIgCgBIACgBIABAAQAXgIASh6IACgYIASiNQAQhwAThxIAKg/QAOhkAOh1QASiFAIg2IAEgWQAdiRAXABIAEAAIAAAAIAAABIAAAAIgBABQgVAPgUB0IgDAZQgKBCgOCMIgWDdIgKBSIgbDhQgMBVgMA1IgFAXQgbBsgYAAIgEAAg");
		this.shape_23.setTransform(16.1,61.1);

		this.shape_24 = new cjs.Shape();
		this.shape_24.graphics.f(layer4color).s().p("AhjJNIgCgBIgIgFIgCgBIADgBIAAAAQAYgIARh8IADgYIASiPQAPh0AThwIAKg/QAOhjAOh6QASiJAIg1IADgWQAeiUAYABIADABIAAAAIgBAAIgBABQgVAQgTB2IgEAZQgJBBgOCQQgLB9gLBiIgJBSIgbDmQgMBXgMA1IgFAXQgbBvgYAAIgEgBg");
		this.shape_24.setTransform(16.1,61.9);

		this.shape_25 = new cjs.Shape();
		this.shape_25.graphics.f(layer4color).s().p("AhiJWIgCgBIgIgFIgCgBIACgBIABAAQAYgIARh+IADgZIARiQQAQh4AThvIAKhAQANhiAOh/QARiMAIg1IADgWQAeiYAZADIACABIAAAAIAAAAIgBABQgWAQgTB4IgEAZQgIBAgOCUQgLCCgLBgIgJBTIgbDpQgMBZgLA1IgFAYQgcBwgYAAIgDAAg");
		this.shape_25.setTransform(16.1,62.7);

		this.shape_26 = new cjs.Shape();
		this.shape_26.graphics.f(layer4color).s().p("AhiJeIgCgBIgIgFIgCgBIACgBIABAAQAYgIARiAIADgZIASiRQAPh8AThuIAKhCQAMhgAPiFQARiPAHg0IADgXQAfiaAZAEIACAAIAAAAIgBABIgBABQgVAQgUB5IgEAaQgHA/gOCYQgLCHgKBdIgKBUIgaDtQgMBbgMA1IgFAYQgcBzgYAAIgDgBg");
		this.shape_26.setTransform(16.2,63.6);

		this.shape_27 = new cjs.Shape();
		this.shape_27.graphics.f(layer4color).s().p("AhiJmIgCgBIgIgEIgCgCIACgBIABAAQAZgIARiCIADgZIARiTQAQiAAShtIALhCQALheAPiLQARiTAHg0IADgXQAfidAYAFIADABIgBABIgBAAIgBABQgVAQgUB7IgDAaQgIA+gNCcQgMCMgJBaIgJBUIgbDxQgMBegLA1IgFAYQgcB1gZAAIgDgBg");
		this.shape_27.setTransform(16.2,64.4);

		this.shape_28 = new cjs.Shape();
		this.shape_28.graphics.f(layer4color).s().p("AhjJuIgJgFIgCgCIADgBQAagHAQiFIAUiuQARiDAShsQAPhiAWjPQAVjIAEgYQAfihAaAHIACAAIgCABQgWAPgVB/QgGArgRDNQgSDkgMBZIgaD1QgPB3gNA3QgdB2gYAAIgFgBg");
		this.shape_28.setTransform(16.3,65.3);

		this.shape_29 = new cjs.Shape();
		this.shape_29.graphics.f(layer4color).s().p("AhcJvIgDgBIgIgFIgBgBIgBAAIACgBIACAAQAYgJAQiEIAAgCIASirIABgFQAQiBARhqIABgFQAOhiATjKIABgGQATjCAEgYIABgHQAeiZAYAFIACABIgBABIgCACIgCABIgBACQgTAYgSBxIgBAHQgGAzgOC9IAAAEQgSDhgJBZIAAADIgZDyIAAACQgPB1gMA3IAAACQgcB1gYAAIgDgBg");
		this.shape_29.setTransform(16.7,65.3);

		this.shape_30 = new cjs.Shape();
		this.shape_30.graphics.f(layer4color).s().p("AhZJwIgCgBIgIgFIgBgBIgBAAIACgCIABAAQAZgIAQiEIAAgCIARisIABgFQAOiAAQhqIABgFQAOhiARjKIABgGQASjCAEgZIABgGQAdiZAYAEIACABIgBABIgCABIgBACIgBACQgUAYgRBxIgBAHQgGAygNC+IAAAEQgPDhgKBZIAAADIgXDyIAAACQgNB1gNA3IAAACQgbB1gYAAIgEAAg");
		this.shape_30.setTransform(17.1,65.3);

		this.shape_31 = new cjs.Shape();
		this.shape_31.graphics.f(layer4color).s().p("AhUJwIgCgBIgJgFIgBgBIAAgBIACgBIABAAQAZgIAOiEIAAgCIAQisIABgFQANiAAQhrIABgFQANhhAQjKIABgGQAQjCAEgZIABgHQAbiYAZAEIACAAIgBABIgCABIgBACIgBABQgTAYgRBxIgBAIQgFAygMC+IAAAEQgODigJBYIAAADQgJBagNCYIAAACQgMB2gMA2IAAACQgaB2gZAAIgDAAg");
		this.shape_31.setTransform(17.5,65.4);

		this.shape_32 = new cjs.Shape();
		this.shape_32.graphics.f(layer4color).s().p("AhQJwIgCgBIgJgEIgBgCIACgBIABAAQAYgJAOiDIAAgCIAPisIABgFQAMiBAPhqIABgFQAMhhAPjKIABgHQAPjAAEgaIABgHQAaiYAYADIACAAIgBAAIgBACIgBABIgBACQgTAXgQByIgBAIQgGAxgKC/IAAAEQgMDigJBZIAAACIgUDyIAAACQgLB2gMA3IAAACQgaB2gYAAIgDgBg");
		this.shape_32.setTransform(17.9,65.4);

		this.shape_33 = new cjs.Shape();
		this.shape_33.graphics.f(layer4color).s().p("AhMJxIgBgBIgJgFIgCgBIACgBIABAAQAZgJAMiEIAAgCIAOisIABgFQALiAAPhrIABgFQALhhAOjKIABgGQANjBAEgaIABgHQAZiXAYABIACAAIgBABIgBABIgBACIgBABQgTAXgPBzIgBAHQgFAxgJDAIAAAEQgLDhgIBZIAAADIgSDyIAAACQgLB2gLA3IAAACQgZB2gZAAIgDAAg");
		this.shape_33.setTransform(18.3,65.5);

		this.shape_34 = new cjs.Shape();
		this.shape_34.graphics.f(layer4color).s().p("AhHJxIgCgBIgJgFIAAgBIgBAAIACgBIABAAQAYgJAMiEIAAgCIANirIABgFQAKiBANhqIABgFQALhiANjKIAAgGQANjAADgbIABgHQAYiWAXAAIADAAIgBAAIAAACIgBABIgBACQgUAWgOBzIAAAHQgGAxgHDBIAAADQgKDigHBZIAAADIgSDyIAAACQgJB1gKA3IAAACQgYB3gZAAIgDAAg");
		this.shape_34.setTransform(18.7,65.5);

		this.shape_35 = new cjs.Shape();
		this.shape_35.graphics.f(layer4color).s().p("AhDJxIgCgBIgJgEIgBgCIACgBIABAAQAYgJALiEIAAgCIAMirIABgFQAJiBANhqIABgFQAKhiALjKIABgGQALi/ADgcIABgHQAXiWAXgBIACAAIAAABIgBABIAAABIgBACQgUAWgNBzIgBAIQgFAwgGDBIAAAEQgIDhgGBaIAAACIgRDzIAAACQgIB1gKA3IAAACQgXB4gZAAIgDgBg");
		this.shape_35.setTransform(19.1,65.6);

		this.shape_36 = new cjs.Shape();
		this.shape_36.graphics.f(layer4color).s().p("Ag/JxIgBAAIgJgFIgCgBIACgBIABAAQAZgKAJiDIAAgCIALisIABgFQAIiAANhrIAAgFQAKhiAKjKIAAgGQAKi/ADgcIABgHQAWiVAXgCIACAAIAAAAIgBABIAAABIgBACQgTAWgNB0IgBAHQgEAwgFDCIAAADQgGDigHBZIAAADIgPDzIAAACQgHB1gJA3IAAACQgXB4gYAAIgEgBg");
		this.shape_36.setTransform(19.5,65.6);

		this.shape_37 = new cjs.Shape();
		this.shape_37.graphics.f(layer4color).s().p("Ag6JyIgCgBIgJgFIgBgBIgBAAIADgBIABAAQAYgJAJiEIAAgCIAJirIABgFQAIiBALhrIABgFQAJhhAIjKIABgHQAIi+ADgdIABgGQAViVAWgDIACgBIAAABIAAABIAAABIgBABQgTAWgMB0IgBAHQgEAwgDDCIAAAEQgFDigGBZIAAADIgNDyIAAACQgHB2gJA3IAAACQgVB5gZAAIgDgBg");
		this.shape_37.setTransform(19.9,65.7);

		this.shape_38 = new cjs.Shape();
		this.shape_38.graphics.f(layer4color).s().p("Ag2JyIgCAAIgJgFIgBgBIAAAAIACgBIABAAQAYgKAIiDIAAgCIAJirIAAgGQAHiAALhrIAAgFQAJhiAHjKIAAgGQAIi+ACgeIABgGQAUiUAWgEIACgBIAAACIgBACQgTAVgLB1IgBAHQgEAwgCDCIAAAEQgDDigFBZIAAADIgMDzIAAACQgHB1gHA3IAAACQgVB5gZAAIgDgBg");
		this.shape_38.setTransform(20.3,65.7);

		this.shape_39 = new cjs.Shape();
		this.shape_39.graphics.f(layer4color).s().p("AgyJzIgCgBIgJgEIgBgCIACgBIABAAQAYgJAHiEIAAgCIAHirIABgFQAGiBAKhrIABgFQAHhhAGjKIAAgHQAGi9ADgeIAAgHQATiTAWgGIACAAIABAAIAAABIAAABIgBABQgTAVgLB1IAAAIQgEAugBDEIAAAEQgBDhgFBaIAAADIgKDyIAAACQgGB2gHA3IAAACQgUB5gZAAIgDAAg");
		this.shape_39.setTransform(20.7,65.7);

		this.shape_40 = new cjs.Shape();
		this.shape_40.graphics.f(layer4color).s().p("AguJzIgBgBIgKgEIgBgBIAAAAIACgBIABAAQAYgKAGiEIAAgCIAHirIAAgFQAFiBAJhrIABgFQAHhhAEjKIAAgHQAFi8ADgfIAAgHQASiTAWgGIACAAIABgBIAAABIAAABIgBACQgTAUgKB2IgBAHQgDAuABDEIAAAEQAADigFBaIAAACIgIDzIAAACQgFB2gIA3IAAACQgSB6gZAAIgDgBg");
		this.shape_40.setTransform(21.2,65.8);

		this.shape_41 = new cjs.Shape();
		this.shape_41.graphics.f(layer4color).s().p("AgqJzIgCAAIgJgFIgBgBIAAAAIACgBIABAAQAYgKAGiEIAAgCIAEiqIABgGQAEiBAJhqIAAgFQAGhiADjKIABgHQADi7ACggIABgGQAQiTAWgIIACAAIABAAIAAABIABAAIgBACQgTAUgJB2IgBAHQgDAuACDFIAAAEQABDhgDBbIAAACIgHDzIAAACQgEB1gJA4IAAACQgQB6gZAAIgDgBg");
		this.shape_41.setTransform(21.6,65.8);

		this.shape_42 = new cjs.Shape();
		this.shape_42.graphics.f(layer4color).s().p("AgmJ0IgBAAIgJgFIgBgBIgBAAIACgBIABAAQAYgKAEiEIAAgCIAFirIAAgFQADiBAIhrIABgFQAFhhACjKIAAgHQADi7ABghIABgGQAPiSAWgIIACgBIABAAIAAAAIABABIgBACQgTATgJB3IAAAHQgCAuACDFIAAAEQADDigDBaIAAACIgFDzIAAACQgEB2gHA3IAAACQgQB6gZAAIgDAAg");
		this.shape_42.setTransform(22,65.8);

		this.shape_43 = new cjs.Shape();
		this.shape_43.graphics.f(layer4color).s().p("AgiJ0IgBAAIgKgEIgBgBIAAgBIACgBIABAAQAYgKAEiEIAAgCIACiqIABgGQACiAAIhsIAAgFQAFhhAAjKIAAgHQABi7ACghIAAgGQAOiRAWgKIACAAIABgBIABABIABAAIgBACQgTATgIB3IAAAIQgDAtAFDFIAAAEQAEDigCBaIAAADIgDDzIAAACQgEB2gHA3IAAACQgPB7gZAAIgDgBg");
		this.shape_43.setTransform(22.4,65.9);

		this.shape_44 = new cjs.Shape();
		this.shape_44.graphics.f(layer4color).s().p("AgeJ1IgCAAIgJgFIgBgBIAAAAIACgBIABAAQAYgKADiEIAAgCIACiqIAAgGQABiBAHhrIAAgFQAEhhgBjKIAAgHQABi6ABgiIAAgGQANiRAVgLIACAAIABgBIACABIABAAIgBACQgTASgHB4IAAAHQgCAtAFDHIAAADQAGDigBBbIAAACIgCDzIAAACQgCB2gIA3IAAACQgNB7gaAAIgDAAg");
		this.shape_44.setTransform(22.9,65.9);

		this.shape_45 = new cjs.Shape();
		this.shape_45.graphics.f(layer4color).s().p("AgaJ1IgBAAIgJgEIgBgBIgBAAIACgCIABAAQAYgKACiEIAAgCIAAiqIAAgFQABiBAGhsIAAgFQAEhhgCjKIAAgHQAAi6AAgiIAAgGQAMiQAVgMIACgBIABAAIACAAIABAAIgBACQgTASgHB5IAAAHQgBAsAHDHIAAAEQAHDigBBaIAAADIAADzIAAACQgCB2gGA3IAAACQgPB8gXAAIgEgBg");
		this.shape_45.setTransform(23.3,65.9);

		this.shape_46 = new cjs.Shape();
		this.shape_46.graphics.f(layer4color).s().p("AgWJ1IgBAAIgKgEIgBgBIACgBIABAAQAYgLABiDIAAgCIgBirIAAgFQAAiBAFhrIABgFQAChigBjKIAAgHQgDi5ABgjIAAgGQAJiQAVgNIACAAIACgBIABAAIACAAIgBACQgTASgGB5IAAAHQgCAsAJDIIAAAEQAJDhgBBbIAAACIACD0IAAACQgBB1gGA4IAAACQgPB8gXAAIgDgBg");
		this.shape_46.setTransform(23.7,66);

		this.shape_47 = new cjs.Shape();
		this.shape_47.graphics.f(layer4color).s().p("AgSJ2IgBAAIgKgEIAAgBIAAgBIABgBIABAAQAYgKAAiEIAAgCIgCiqIAAgGQgBiBAFhrIAAgFQAChigDjKIAAgHQgEi4ABgkIAAgGQAHiPAVgOIACgBIACgBIACABIACAAIgBABQgUASgEB5IAAAIQgBArAJDIIAAAEQALDiAABbIAAACIADD0IAAACQAAB1gFA4IAAACQgPB9gXAAIgDgBg");
		this.shape_47.setTransform(24.2,66);

		this.shape_48 = new cjs.Shape();
		this.shape_48.graphics.f(layer4color).s().p("AgQJ2IgBAAIgKgEIgBgBIACgBIABAAQAYgLgBiDIAAgCIgDirIAAgFQgCiBAEhrIAAgFQADhigGjKIAAgHQgFi4ABgkIAAgGQAIiPATgPIACgBIACgBIACAAIACAAIgBACQgTARgFB6IAAAHQAAAsALDIIAAAEQAMDiAABbIAAACIAFD0IAAACQABB1gFA4IAAACQgNB9gYAAIgDgBg");
		this.shape_48.setTransform(24.8,66);

		this.shape_49 = new cjs.Shape();
		this.shape_49.graphics.f(layer4color).s().p("AgPJ3IgMgFIADgCQAYgKgCiGIgEiwQgDiEADhtQADhjgIjQQgHjJABgZQAJijAXADIACAAIgBABQgRASgDCBQgBArALDNQANDlACBaIAGD2QACB3gFA4QgMB9gYAAIgDAAg");
		this.shape_49.setTransform(25.5,66.1);

		this.shape.mask = this.shape_1.mask = this.shape_2.mask = this.shape_3.mask = this.shape_4.mask = this.shape_5.mask = this.shape_6.mask = this.shape_7.mask = this.shape_8.mask = this.shape_9.mask = this.shape_10.mask = this.shape_11.mask = this.shape_12.mask = this.shape_13.mask = this.shape_14.mask = this.shape_15.mask = this.shape_16.mask = this.shape_17.mask = this.shape_18.mask = this.shape_19.mask = this.shape_20.mask = this.shape_21.mask = this.shape_22.mask = this.shape_23.mask = this.shape_24.mask = this.shape_25.mask = this.shape_26.mask = this.shape_27.mask = this.shape_28.mask = this.shape_29.mask = this.shape_30.mask = this.shape_31.mask = this.shape_32.mask = this.shape_33.mask = this.shape_34.mask = this.shape_35.mask = this.shape_36.mask = this.shape_37.mask = this.shape_38.mask = this.shape_39.mask = this.shape_40.mask = this.shape_41.mask = this.shape_42.mask = this.shape_43.mask = this.shape_44.mask = this.shape_45.mask = this.shape_46.mask = this.shape_47.mask = this.shape_48.mask = this.shape_49.mask = mask_1;

		this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape}]}).to({state:[{t:this.shape_1}]},1).to({state:[{t:this.shape_2}]},1).to({state:[{t:this.shape_3}]},1).to({state:[{t:this.shape_4}]},1).to({state:[{t:this.shape_5}]},1).to({state:[{t:this.shape_6}]},1).to({state:[{t:this.shape_7}]},1).to({state:[{t:this.shape_8}]},1).to({state:[{t:this.shape_9}]},1).to({state:[{t:this.shape_10}]},1).to({state:[{t:this.shape_11}]},1).to({state:[{t:this.shape_12}]},1).to({state:[{t:this.shape_13}]},1).to({state:[{t:this.shape_14}]},1).to({state:[{t:this.shape_15}]},1).to({state:[{t:this.shape_16}]},1).to({state:[{t:this.shape_17}]},1).to({state:[{t:this.shape_18}]},1).to({state:[{t:this.shape_19}]},1).to({state:[{t:this.shape_20}]},1).to({state:[{t:this.shape_21}]},1).to({state:[{t:this.shape_22}]},1).to({state:[{t:this.shape_23}]},1).to({state:[{t:this.shape_24}]},1).to({state:[{t:this.shape_25}]},1).to({state:[{t:this.shape_26}]},1).to({state:[{t:this.shape_27}]},1).to({state:[{t:this.shape_28}]},1).to({state:[{t:this.shape_29}]},1).to({state:[{t:this.shape_30}]},1).to({state:[{t:this.shape_31}]},1).to({state:[{t:this.shape_32}]},1).to({state:[{t:this.shape_33}]},1).to({state:[{t:this.shape_34}]},1).to({state:[{t:this.shape_35}]},1).to({state:[{t:this.shape_36}]},1).to({state:[{t:this.shape_37}]},1).to({state:[{t:this.shape_38}]},1).to({state:[{t:this.shape_39}]},1).to({state:[{t:this.shape_40}]},1).to({state:[{t:this.shape_41}]},1).to({state:[{t:this.shape_42}]},1).to({state:[{t:this.shape_43}]},1).to({state:[{t:this.shape_44}]},1).to({state:[{t:this.shape_45}]},1).to({state:[{t:this.shape_46}]},1).to({state:[{t:this.shape_47}]},1).to({state:[{t:this.shape_48}]},1).to({state:[{t:this.shape_49}]},1).to({state:[]},1).wait(50));
	} else {
		// this.timeline.addTween(cjs.Tween.get(this.shape).wait(50).to({startPosition:0},0).wait(50));
	}


	if (rgba) {
		liquidcolor = rgba.slice(0);
		liquidcolor = "rgba("+liquidcolor.join(",")+")";
	} else {
		// liquidcolor = "#5BCAE5";
	}

	// liquid reagent
	//	this.shape_50 = new cjs.Shape();
	// this.shape_50.graphics.f(liquidcolor).s().p("AhxFFIACq4IAAAAQAxAeA6ACQBAACA2gjIgBK5Qg2Awg5AAQg3AAg8gwg");
	// this.shape_50.setTransform(15.8,95.4);


	// OIL 
	if (lib.properties.oil_film) {
		layer4color = lib.properties.oil_film;
	}
	
	// высота жидкости (size)
	var size = Math.min(40, Math.max(lib.properties.size, 0)), // min 5, max 40
		sizeP = (size - 5)/ 30;

	this.shape_50 = new cjs.Shape();
	this.shape_50.graphics.f(liquidcolor).s().p("Ai2H9IADv5IFqAAIAAP5g");

	// Layer 1
	this.shape_51 = new cjs.Shape();
	this.shape_51.graphics.f(layer4color).s().p("AhXAaIgcgJQgcgJgNgIIgIgCIgRgKIAAgCIABgCQC0gvC1AvQABAAAAABQAAAAAAAAQAAABAAAAQAAABgBAAIgCACQgVALgXALQg/AdhCAAQgtAAgwgOg");

	this.shape_52 = new cjs.Shape();
	this.shape_52.graphics.f(liquidcolor).s().p("Ai1AeIAAg6IARAKIAIAEQANAIAcAHIAcAJQBzAjBrgwQAXgLAVgNIACgCIAAAAIABAAIAAA7g");

	this.shape_53 = new cjs.Shape();
	this.shape_53.graphics.f(liquidcolor).s().p("Ai2gPIAAgsIFtAAIAAAsQhXBLhcAAQhaAAhghLg");
	
	// size = 3.1;

	if (size < 1) {
		this.shape_50.alpha = 0;
		this.shape_51.alpha = 0;
		this.shape_52.alpha = 0;
		this.shape_53.alpha = 0;
	} else if (size < 4) {  // 1-3
		this.shape_50.alpha = 0;
		this.shape_51.alpha = 0;
		this.shape_52.alpha = 0;
		this.shape_53.setTransform(15.6,132.45-2*(size/4),0.2+size/10,0.1+size/10);
	} else if (size < 5) { // 4.9
		this.shape_50.alpha = 0;
		this.shape_51.setTransform(15.7,62.3+60.99+3.4*(5-size) - (5-size),0.6,0.6*(size-4),0,0,0,0,0);
		this.shape_52.setTransform(15.7,63.15+60.99+1.7*(5-size),0.6,0.6*(size-4));
		this.shape_53.setTransform(15.6,129.45,0.6,0.6);
	} else {
		this.shape_50.setTransform(15.6,95.4+15.25*2*(1-sizeP),0.6,0.6*sizeP);
		this.shape_51.setTransform(15.7,62.3+60.99*(1-sizeP),0.6,0.6);
		this.shape_52.setTransform(15.7,63.15+60.99*(1-sizeP),0.6,0.6);
		this.shape_53.setTransform(15.6,129.45,0.6,0.6);
	}


	if (lib.properties.discharging) {
		this.shape_51 = new cjs.Shape();
		this.shape_51.graphics.f(liquidcolor).s().p("AhxFUIACqaQBVARAvgTQASgHAZgSIAygiIgBLXQg2Awg5AAQg3AAg8gwg");
		this.shape_51.setTransform(15.8,93.9);

		this.shape_52 = new cjs.Shape();
		this.shape_52.graphics.f(liquidcolor).s().p("AhxFkIACp+QA/AKA5gqQBDg7AmgeIgBL3Qg2Awg5AAQg3AAg8gwg");
		this.shape_52.setTransform(15.8,92.2);

		this.shape_53 = new cjs.Shape();
		this.shape_53.graphics.f(liquidcolor).s().p("AhxF1IACphQA8gCA7hAQBEhRAmgkIgBMXQg2Awg5AAQg3AAg8gvg");
		this.shape_53.setTransform(15.8,90.6);

		this.shape_54 = new cjs.Shape();
		this.shape_54.graphics.f(liquidcolor).s().p("AhxGGIACo+QA9gNA5hTQBChqApgzIgBM7Qg2Awg5AAQg3AAg8gwg");
		this.shape_54.setTransform(15.8,88.9);

		this.shape_55 = new cjs.Shape();
		this.shape_55.graphics.f(liquidcolor).s().p("AhxGWIACofQA7gbA7hnQBDh/Aog7IgBNbQg2Awg5AAQg3AAg8gwg");
		this.shape_55.setTransform(15.8,87.2);

		this.shape_56 = new cjs.Shape();
		this.shape_56.graphics.f(liquidcolor).s().p("AhxGoIACoCQA5gZA9iJIA0h0QAehCAZgkIgBN+Qg2Avg5AAQg3AAg8gvg");
		this.shape_56.setTransform(15.8,85.5);

		this.shape_57 = new cjs.Shape();
		this.shape_57.graphics.f(liquidcolor).s().p("AhxG3IACnkQA4gZA+inQAihdASgrQAehLAZglIgBOcQg2Avg5AAQg3AAg8gvg");
		this.shape_57.setTransform(15.8,84);

		this.shape_58 = new cjs.Shape();
		this.shape_58.graphics.f(liquidcolor).s().p("AhxHIIACnHQA3gXA/jIQAihtASgyQAdhUAagmIgBO/Qg2Awg5AAQg3AAg8gwg");
		this.shape_58.setTransform(15.8,82.2);

		this.shape_59 = new cjs.Shape();
		this.shape_59.graphics.f(liquidcolor).s().p("AhxHWIACmqQA3gYA/jkIA0iyQAdhdAagmIgBPbQg2Awg5AAQg3AAg8gwg");
		this.shape_59.setTransform(15.8,80.9);

		this.shape_60 = new cjs.Shape();
		this.shape_60.graphics.f(liquidcolor).s().p("AhxHmIACmLQA2gYBAkDIA0jIQAdhnAagmIgBP7Qg2Awg5AAQg3AAg8gwg");
		this.shape_60.setTransform(15.8,79.2);

		this.shape_61 = new cjs.Shape();
		this.shape_61.graphics.f(liquidcolor).s().p("AhxH4IACluQA2gYBAkjQAri+AJggQAdhxAagmIgBQeQg2Avg5AAQg3AAg8gvg");
		this.shape_61.setTransform(15.8,77.5);

		this.shape_62 = new cjs.Shape();
		this.shape_62.graphics.f(liquidcolor).s().p("AhxIJIAClNQA2gYBAlFQAqjNAKgoQAdh8AagmIgBRBQg2Awg5AAQg3AAg8gwg");
		this.shape_62.setTransform(15.8,75.7);

		this.shape_63 = new cjs.Shape();
		this.shape_63.graphics.f(liquidcolor).s().p("AhxIYIACk2QA1gYBBlgQApjZALguQAdiEAagmIgBRfQg2Awg5AAQg3AAg8gwg");
		this.shape_63.setTransform(15.8,74.2);

		this.shape_64 = new cjs.Shape();
		this.shape_64.graphics.f(liquidcolor).s().p("AhxIqIACkWQAhgPAhh8QAWhXAei4QApjpALg1QAdiOAagmIgBSCQg2Avg5AAQg3AAg8gvg");
		this.shape_64.setTransform(15.8,72.5);

		this.shape_65 = new cjs.Shape();
		this.shape_65.graphics.f(liquidcolor).s().p("AhxI6IACj4QAhgPAhiGQAWhdAejHQAoj4AMg8QAdiXAagnIgBSjQg2Awg5AAQg3AAg8gwg");
		this.shape_65.setTransform(15.8,70.9);

		this.shape_66 = new cjs.Shape();
		this.shape_66.graphics.f(liquidcolor).s().p("AhxJKIACjaQAhgOAhiQQAWhkAejWQAokIAMhBQAdihAagnIgBTDQg2Awg5AAQg3AAg8gwg");
		this.shape_66.setTransform(15.8,69.2);

		this.shape_67 = new cjs.Shape();
		this.shape_67.graphics.f(liquidcolor).s().p("AhxJYIACjBQASAJAkh3QAlh3AfkEQAikHAWiOQAViPAagRIgBTfQg2Awg5AAQg3AAg8gwg");
		this.shape_67.setTransform(15.8,67.9);

		this.shape_68 = new cjs.Shape();
		this.shape_68.graphics.f(liquidcolor).s().p("AhxJYIACiyQAQAGAPgZQAOgYATg+QARg1ARhtQALhGATiiQAKhNASieQAOh8AIgzQAViPAagRIgBTfQg2Awg5AAQg3AAg8gwg");
		this.shape_68.setTransform(15.8,67.9);

		this.shape_69 = new cjs.Shape();
		this.shape_69.graphics.f(liquidcolor).s().p("AhxJYIACijQAQAGAPgZQAOgYATg+QAQg0ASh2QAHgxAXi+QAKhNASieQAOh8AIgzQAViPAagRIgBTfQg2Awg5AAQg3AAg8gwg");
		this.shape_69.setTransform(15.8,67.9);

		this.shape_70 = new cjs.Shape();
		this.shape_70.graphics.f(liquidcolor).s().p("AhxJYIACiKQAQAGAPgZQAOgYATg+QAQgyASiEIAej8QAKhNASieQAOh8AIgzQAViPAagRIgBTfQg2Awg5AAQg3AAg8gwg");
		this.shape_70.setTransform(15.8,67.9);

		this.shape_71 = new cjs.Shape();
		this.shape_71.graphics.f(liquidcolor).s().p("AhxJYIACh7QAQAGAPgZQAOgYATg+QAQgyASiMIAekDQAKhNASieQAOh8AIgzQAViPAagRIgBTfQg2Awg5AAQg3AAg8gwg");
		this.shape_71.setTransform(15.8,67.9);

		this.shape_72 = new cjs.Shape();
		this.shape_72.graphics.f(liquidcolor).s().p("AhxJYIAChsQAiAOAjhyQAPgvAQiZIAckNQAKhNASieQAOh8AIgzQAViPAagRIgBTfQg2Awg5AAQg3AAg8gwg");
		this.shape_72.setTransform(15.8,67.9);

		this.shape_73 = new cjs.Shape();
		this.shape_73.graphics.f(liquidcolor).s().p("AhxJYIAChdQAiAOAjhyQAPgvAQigQAYj4AEgdQAKhNASieQAOh8AIgzQAViPAagRIgBTfQg2Awg5AAQg3AAg8gwg");
		this.shape_73.setTransform(15.8,67.9);

		this.shape_74 = new cjs.Shape();
		this.shape_74.graphics.f(liquidcolor).s().p("AhxJYIAChOQASAHANgOQAQgRARg4QAQgyAXivIAjkmQAMhcALiPQAKiDAHgsQAViPAagRIgBTfQg2Awg5AAQg3AAg8gwg");
		this.shape_74.setTransform(15.8,67.9);

		this.shape_75 = new cjs.Shape();
		this.shape_75.graphics.f(liquidcolor).s().p("AhxJYIACg6QATAHANgOQAQgRAQg4QASg6AWi2IAikrQAMhcALiPQAKiDAHgsQAViPAagRIgBTfQg2Awg5AAQg3AAg8gwg");
		this.shape_75.setTransform(15.8,67.9);

		this.shape_76 = new cjs.Shape();
		this.shape_76.graphics.f(liquidcolor).s().p("AhxJYIACgrQATAIANgMQAQgQAQg3QARg5AXjBQAXjgALhVQAMhcALiPQAKiDAHgsQAViPAagRIgBTfQg2Awg5AAQg3AAg8gwg");
		this.shape_76.setTransform(15.8,67.9);

		this.shape_77 = new cjs.Shape();
		this.shape_77.graphics.f(liquidcolor).s().p("AhxJYIACgcQAVAIALgHQAQgMAQg2QARg4AXjPQAXjsALhVQAMhcALiPQAKiDAHgsQAViPAagRIgBTfQg2Awg5AAQg3AAg8gwg");
		this.shape_77.setTransform(15.8,67.9);

		this.shape_78 = new cjs.Shape();
		this.shape_78.graphics.f(liquidcolor).s().p("AhxJYIACgNQAXAJAGgDQAPgIAPg1QAUhCAcjRQAYjAAMiOIARjxQAJhvAJg6QAViPAagRIgBTfQg2Awg5AAQg3AAg8gwg");
		this.shape_78.setTransform(15.8,67.9);

		this.shape_50.mask = this.shape_51.mask = this.shape_52.mask = this.shape_53.mask = this.shape_54.mask = this.shape_55.mask = this.shape_56.mask = this.shape_57.mask = this.shape_58.mask = this.shape_59.mask = this.shape_60.mask = this.shape_61.mask = this.shape_62.mask = this.shape_63.mask = this.shape_64.mask = this.shape_65.mask = this.shape_66.mask = this.shape_67.mask = this.shape_68.mask = this.shape_69.mask = this.shape_70.mask = this.shape_71.mask = this.shape_72.mask = this.shape_73.mask = this.shape_74.mask = this.shape_75.mask = this.shape_76.mask = this.shape_77.mask = this.shape_78.mask = mask_1;

		this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_50}]}).to({state:[{t:this.shape_51}]},1).to({state:[{t:this.shape_52}]},1).to({state:[{t:this.shape_53}]},1).to({state:[{t:this.shape_54}]},1).to({state:[{t:this.shape_55}]},1).to({state:[{t:this.shape_56}]},1).to({state:[{t:this.shape_57}]},1).to({state:[{t:this.shape_58}]},1).to({state:[{t:this.shape_59}]},1).to({state:[{t:this.shape_60}]},1).to({state:[{t:this.shape_61}]},1).to({state:[{t:this.shape_62}]},1).to({state:[{t:this.shape_63}]},1).to({state:[{t:this.shape_64}]},1).to({state:[{t:this.shape_65}]},1).to({state:[{t:this.shape_66}]},1).to({state:[{t:this.shape_67}]},1).to({state:[{t:this.shape_68}]},1).to({state:[{t:this.shape_69}]},1).to({state:[{t:this.shape_70}]},1).to({state:[{t:this.shape_71}]},1).to({state:[{t:this.shape_72}]},1).to({state:[{t:this.shape_73}]},1).to({state:[{t:this.shape_74}]},1).to({state:[{t:this.shape_75}]},1).to({state:[{t:this.shape_76}]},1).to({state:[{t:this.shape_77}]},1).to({state:[{t:this.shape_78}]},1).to({state:[]},22).wait(50));

	} else {
		this.timeline.addTween(cjs.Tween.get(this.shape_50).wait(1));
		this.timeline.addTween(cjs.Tween.get(this.shape_51).wait(1));
		this.timeline.addTween(cjs.Tween.get(this.shape_52).wait(1));
		this.timeline.addTween(cjs.Tween.get(this.shape_53).wait(1));
	}

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0.1,0,32.2,134.6);





// stage content:
(lib.test_tube = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 26
	this.prob = new lib.пробирка(null, null, null);
	this.prob.parent = this;
	this.prob.setTransform(192,348.3,2.484,2.484,0,0,0,16.1,67.3);

	if (lib.properties.discharging) {
		this.timeline.addTween(cjs.Tween.get(this.prob).to({rotation:90,x:210.4,y:131.7},19).wait(37).to({rotation:0,x:354.2,y:-856.9},52).wait(32));
	} else {
		this.timeline.addTween(cjs.Tween.get(this.prob).wait(37).to({startPosition:0},0).wait(32));
	}

	// this.instance = new lib.blur();
	// this.instance.setTransform(0,0,1,1,0,0,0,0,0);
	// this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(427,456,80,334.5);

})(lib = lib||{}, images = images||{}, createjs = createjs||{}, ss = ss||{});
var lib, images, ss;

if (window.modelNS) {
	modelNS.IReact.libs.test_tube = lib;
	lib = null;
}
