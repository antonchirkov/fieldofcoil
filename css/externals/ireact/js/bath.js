(function (lib, img, cjs, ss) {

var p; // shortcut to reference prototypes

// library properties:
lib.properties = {
	width: 300,
	height: 500,
	x:-16,
	y:-16,
	fps: 24,
	color: "#FFFFFF",
	opacity: 1.00,
	scale: 0.48,
	manifest: [
		{src:"images/Bitmap3.png?1529496107457", id:"Bitmap3"}
	],
	part:'stick' // stand, front, front_bath, front_clip, back
};



lib.ssMetadata = [];


// symbols:



(lib.Bitmap3 = function() {
	this.initialize(img.Bitmap3);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,1024,768);


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


(lib.кольцо = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// щуп
	if (lib.properties.part == 'front_bath') {
		this.shape = new cjs.Shape();
		this.shape.graphics.lf(["#666666","#CCCCCC","#666666","#404040"],[0,0.396,0.71,1],-46.1,0,46.2,0).s().p("AlFAqQiBgJgGgOIABgDIAAhCQAJANB9AKQCHAKC+AAQC/AACHgKQCGgKABgPIAABGQAAAOiHAKQiHALi/AAQi+AAiHgLg");
		this.shape.setTransform(226,-5.7);

		this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));
	}

	// крепление
	if (lib.properties.part.indexOf('front') !== 0) {
		this.shape_1 = new cjs.Shape();
		this.shape_1.graphics.lf(["#222222","#999999","#484848","#000000"],[0,0.396,0.71,1],-6.7,0.8,6.9,0.8).s().p("AhFAWIAAgrICLAAIAAArg");
		this.shape_1.setTransform(101.8,-16.5);

		this.shape_2 = new cjs.Shape();
		this.shape_2.graphics.lf(["#666666","#CCCCCC","#666666","#404040"],[0,0.396,0.71,1],43.4,-7.4,43.4,7.1).s().p("Ah8BGIAAiLID6AAIAACLg");
		this.shape_2.setTransform(101.8,-7.2);

		this.shape_3 = new cjs.Shape();
		this.shape_3.graphics.lf(["#222222","#999999","#484848","#000000"],[0,0.396,0.71,1],-6.7,0.7,6.9,0.7).s().p("AhGAWIAAgrICNAAIAAArg");
		this.shape_3.setTransform(101.8,2);

		this.shape_4 = new cjs.Shape();
		this.shape_4.graphics.lf(["#222222","#999999","#484848","#000000"],[0,0.396,0.71,1],-0.6,-5.6,-0.3,5.8).s().p("AgSA7IAAh1IAlAAIAAB1g");
		this.shape_4.setTransform(87.2,-7.2);

		this.shape_5 = new cjs.Shape();
		this.shape_5.graphics.lf(["#666666","#CCCCCC","#666666","#404040"],[0,0.396,0.71,1],0.3,-3.4,0.3,3.4).s().p("AmJAjIAAhGIMTABIAABFg");
		this.shape_5.setTransform(141.4,-7.2);

		this.shape_6 = new cjs.Shape();
		this.shape_6.graphics.f("#333333").s().p("AARAyIggAAIgBAAIAAgBIAAgBIABAAIAgAAIABAAIAAABIAAABIgBAAgAARAsIggAAIgBAAIAAgBIAAgBIABAAIAgAAIABAAIAAABIAAABIgBAAgAgQAnIAAgCIAAAAQAAgBAAAAQAAAAAAAAQAAAAAAAAQAAAAAAABIAhAAQAAgBABABIAAAAIAAACgAgQAhIAAgCIAAAAIAAAAIAhAAIABAAIAAAAIAAACgAAQAbIggAAIgBAAIAAgBIAAgBIABAAIAgAAIACAAIAAABIAAABIgCAAgAgQAVIAAgBIAAgBQAAAAAAAAQAAAAAAAAQAAAAAAAAQAAAAAAAAIAhAAQAAgBABABIAAABIAAABgAAQAPIgfAAIgBAAIAAgBIAAgBIABAAIAfAAIACAAIAAABIAAABIgCAAgAAQAJIggAAIgBAAIAAgBIAAgBIABAAIAgAAIACAAIAAABIAAABIgCAAgAgQADIAAgBIAAgBIAAAAIAhAAIABAAIAAABIAAABgAgQAAIAAgCIAAAAQAAAAAAgBQAAAAAAAAQAAAAAAAAQAAABAAAAIAhAAQAAgBABABIAAAAIAAACgAAQgGIggAAIgBAAIAAgCIAAAAIABAAIAgAAIACAAIAAAAIAAACIgCAAgAARgMIggAAIgBAAIAAgBIAAgBIABAAIAgAAIABAAIAAABIAAABIgBAAgAgQgSIAAgBIAAgBQAAAAAAAAQAAAAAAAAQAAAAAAAAQAAAAAAAAIAhAAQAAgBABABIAAABIAAABgAgQgYIAAgBIAAgBIAAAAIAhAAIABAAIAAABIAAABgAgQgeIAAgBIAAgBIAAAAIAhAAIABAAIAAABIAAABgAAQgkIggAAIgBAAIAAgBIAAAAQAAAAAAgBQAAAAABAAQAAAAAAAAQAAABAAAAIAgAAQAAAAAAgBQABAAAAAAQAAAAAAAAQAAABABAAIAAAAIAAABIgCAAgAgPgpIgBAAIAAgCIAAAAIABAAIAgAAIABAAIAAAAIAAACgAgPgvIgBAAIAAgBIAAgBIABAAIAfAAIACAAIAAABIAAABIgCAAg");
		this.shape_6.setTransform(79.6,-7.2);

		this.shape_7 = new cjs.Shape();
		this.shape_7.graphics.lf(["#999999","#D9D9D9","#666666"],[0.008,0.38,1],-0.1,-5.2,1.3,5.2).s().p("AgTA1IAAhpIAnAAIAABpg");
		this.shape_7.setTransform(79.5,-7.2);

		this.shape_8 = new cjs.Shape();
		this.shape_8.graphics.lf(["#999999","#D9D9D9","#666666"],[0.008,0.38,1],-0.2,-1.4,2.3,1.5).s().p("AghAOIAAgbIBDAAIAAAbg");
		this.shape_8.setTransform(82.9,-7.2);

		this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_8},{t:this.shape_7},{t:this.shape_6},{t:this.shape_5},{t:this.shape_4},{t:this.shape_3},{t:this.shape_2},{t:this.shape_1}]}).wait(1));
	}
}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(77.5,-18.7,194.6,23);


(lib.зажим = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// щуп
	if (lib.properties.part == 'front_clip') {
		this.shape = new cjs.Shape();
		this.shape.graphics.rf(["#DDDDDD","#999999"],[0.141,1],-1.9,-1.7,0,-1.9,-1.7,9.1).s().p("AgsAtQgTgTAAgaQAAgZATgTIAKgIIABgBIABgBIAIgEIADgBQALgEAKAAQAaAAATATQATATAAAZQAAAagTATIgBABIgIAHIgEADQgOAIgSAAQgZAAgTgTg");
		this.shape.setTransform(190.4,-8,1,1,0,0,0,1.1,-0.7);

		this.shape_1 = new cjs.Shape();
		this.shape_1.graphics.f("#333333").s().p("Ah/BkIATAAIgBitIAAgBIADAAIDqgbIAACyIjnAZg");
		this.shape_1.setTransform(235.8,-6.1);

		this.shape_2 = new cjs.Shape();
		this.shape_2.graphics.f("#565656").s().p("ABVBlIi+gYIAAiwIABgBIDSAZIAAACIgDAAIAAABIABCtg");
		this.shape_2.setTransform(214.4,-6.2);

		this.shape_3 = new cjs.Shape();
		this.shape_3.graphics.f("#3C3C3C").s().p("AiIBZIAAiwIAAgBIERAAIAAABIAACwg");
		this.shape_3.setTransform(190,-7.4);

		this.shape_4 = new cjs.Shape();
		this.shape_4.graphics.f("#333333").s().p("ABoBkIi9gXIkTAAIAAixIAAgBIETAAIAAABIAAgBIDSAaIAAABIDsgbIAACyIjoAZg");
		this.shape_4.setTransform(215.1,-2.4,1,1,0,0,0,2.6,3.7);

		this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_4},{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));
	}

	// крепление
	if (lib.properties.part.indexOf('front') !== 0) {
		this.shape_5 = new cjs.Shape();
		this.shape_5.graphics.lf(["#222222","#999999","#484848","#000000"],[0,0.396,0.71,1],-6.7,0.8,6.9,0.8).s().p("AhFAWIAAgrICLAAIAAArg");
		this.shape_5.setTransform(101.8,-16.5);

		this.shape_6 = new cjs.Shape();
		this.shape_6.graphics.lf(["#666666","#CCCCCC","#666666","#404040"],[0,0.396,0.71,1],43.4,-7.4,43.4,7.1).s().p("Ah8BGIAAiLID6AAIAACLg");
		this.shape_6.setTransform(101.8,-7.2);

		this.shape_7 = new cjs.Shape();
		this.shape_7.graphics.lf(["#222222","#999999","#484848","#000000"],[0,0.396,0.71,1],-6.7,0.7,6.9,0.7).s().p("AhGAWIAAgrICNAAIAAArg");
		this.shape_7.setTransform(101.8,2);

		this.shape_8 = new cjs.Shape();
		this.shape_8.graphics.lf(["#222222","#999999","#484848","#000000"],[0,0.396,0.71,1],-0.6,-5.6,-0.3,5.8).s().p("AgSA7IAAh1IAlAAIAAB1g");
		this.shape_8.setTransform(87.2,-7.2);

		this.shape_9 = new cjs.Shape();
		this.shape_9.graphics.lf(["#666666","#CCCCCC","#666666","#404040"],[0,0.396,0.71,1],0.3,-3.4,0.3,3.4).s().p("AmJAjIAAhGIMTABIAABFg");
		this.shape_9.setTransform(151.4,-7.2);

		this.shape_10 = new cjs.Shape();
		this.shape_10.graphics.f("#333333").s().p("AARAyIggAAIgBAAIAAgBIAAgBIABAAIAgAAIABAAIAAABIAAABIgBAAgAARAsIggAAIgBAAIAAgBIAAgBIABAAIAgAAIABAAIAAABIAAABIgBAAgAgQAnIAAgCIAAAAQAAgBAAAAQAAAAAAAAQAAAAAAAAQAAAAAAABIAhAAQAAgBABABIAAAAIAAACgAgQAhIAAgCIAAAAIAAAAIAhAAIABAAIAAAAIAAACgAAQAbIggAAIgBAAIAAgBIAAgBIABAAIAgAAIACAAIAAABIAAABIgCAAgAgQAVIAAgBIAAgBQAAAAAAAAQAAAAAAAAQAAAAAAAAQAAAAAAAAIAhAAQAAgBABABIAAABIAAABgAAQAPIgfAAIgBAAIAAgBIAAgBIABAAIAfAAIACAAIAAABIAAABIgCAAgAAQAJIggAAIgBAAIAAgBIAAgBIABAAIAgAAIACAAIAAABIAAABIgCAAgAgQADIAAgBIAAgBIAAAAIAhAAIABAAIAAABIAAABgAgQAAIAAgCIAAAAQAAAAAAgBQAAAAAAAAQAAAAAAAAQAAABAAAAIAhAAQAAgBABABIAAAAIAAACgAAQgGIggAAIgBAAIAAgCIAAAAIABAAIAgAAIACAAIAAAAIAAACIgCAAgAARgMIggAAIgBAAIAAgBIAAgBIABAAIAgAAIABAAIAAABIAAABIgBAAgAgQgSIAAgBIAAgBQAAAAAAAAQAAAAAAAAQAAAAAAAAQAAAAAAAAIAhAAQAAgBABABIAAABIAAABgAgQgYIAAgBIAAgBIAAAAIAhAAIABAAIAAABIAAABgAgQgeIAAgBIAAgBIAAAAIAhAAIABAAIAAABIAAABgAAQgkIggAAIgBAAIAAgBIAAAAQAAAAAAgBQAAAAABAAQAAAAAAAAQAAABAAAAIAgAAQAAAAAAgBQABAAAAAAQAAAAAAAAQAAABABAAIAAAAIAAABIgCAAgAgPgpIgBAAIAAgCIAAAAIABAAIAgAAIABAAIAAAAIAAACgAgPgvIgBAAIAAgBIAAgBIABAAIAfAAIACAAIAAABIAAABIgCAAg");
		this.shape_10.setTransform(79.6,-7.2);

		this.shape_11 = new cjs.Shape();
		this.shape_11.graphics.lf(["#999999","#D9D9D9","#666666"],[0.008,0.38,1],-0.1,-5.2,1.3,5.2).s().p("AgTA1IAAhpIAnAAIAABpg");
		this.shape_11.setTransform(79.5,-7.2);

		this.shape_12 = new cjs.Shape();
		this.shape_12.graphics.lf(["#999999","#D9D9D9","#666666"],[0.008,0.38,1],-0.2,-1.4,2.3,1.5).s().p("AghAOIAAgbIBDAAIAAAbg");
		this.shape_12.setTransform(82.9,-7.2);

		this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_12},{t:this.shape_11},{t:this.shape_10},{t:this.shape_9},{t:this.shape_8},{t:this.shape_7},{t:this.shape_6},{t:this.shape_5}]}).wait(1));
	}

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(77.5,-18.7,171.1,23);



(lib.баня = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("rgba(0,0,0,0.098)").s().p("AnHAPQhVgPgvgTIAAgdQAvATBVARIAgAGIABAAQCxAcD0AAIAAAAQDyAACwgcIABAAIAhgGQBYgRAxgVIAAAdQgvAUhaAQQi8AkkIAAQkJAAi9gkg");
	this.shape.setTransform(64.5,27.8);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.lf(["#9A9A9A","#666666","#B3B3B3","#EEEEEE","#C3C3C3","#A4A4A4","#777777","#515151","#7B7B7B"],[0.004,0.114,0.255,0.341,0.459,0.518,0.616,0.859,0.988],-59,-5.5,59,-5.5).s().p("AmjPWQiPgbgagmIAAgYIAA8NQAuAUBYAQQC8AlEKAAQEIAAC8glQBagRAvgVIAAcVIAAAIQgKAsijAfQiuAijzAAQj0AAiugigAgBt9IAAgJIABAAIAAAJgAJNv3IAAAAIAAADIAAABg");
	this.shape_1.setTransform(64.4,114.3);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#D4D4D4").s().p("AAAA0QD0gBCtghQCkgeAKgsIAAgBIABgDIAyAAQgBANgNANQgNALgYAKQgvAThbASIghAGIAAAAQiyAfjyAAgAmkAeIgBAAIgggGQhXgRgvgSQgagLgOgMQgNgNgBgNIAxAAIABADIAAAAIACAGIACAEQAXAmCSAbQCuAhD0ABIAAAJQjxgBizgeg");
	this.shape_2.setTransform(64.3,18.7);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.lf(["#9A9A9A","#666666","#B3B3B3","#EEEEEE","#C3C3C3","#A4A4A4","#777777","#515151","#7B7B7B"],[0.004,0.114,0.255,0.341,0.459,0.6,0.702,0.859,0.988],-64.2,0,64.3,0).s().p("AnFAzQhXgRgvgUQg2gVAAgbIAAg1QABANANANQAOAMAaALQAvAUBXARIAgAEIABAAQCzAeDxABIAAAAQDyAACygfIAAAAIAhgEQBbgSAvgVQAYgKANgLQANgNABgNIAAA1IAAADQgEAZgvASQgvAVhbASQi8AlkJAAQkIAAi9glg");
	this.shape_3.setTransform(64.3,21.4);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,12.6,128.5,203.3);


(lib.Баня2 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("rgba(0,153,255,0.2)").s().p("AAABzQjxgBisghQiQgdgXglIgCgFIgCgGIAAAAIgBgDIAAgBQAAgGAEgGIADgEQAXggBtgZIAhgHQA4gLBAgHQBAgHBIgEQA4gEA9AAIABAAIAngBIApABQA+AAA4AEQBHAEBAAHQBAAHA4ALQCbAfAQAqIABANQgLArihAgQisAhjyABg");
	this.shape.setTransform(64.2,22.4);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.lf(["#9A9A9A","#666666","#B3B3B3","#EEEEEE","#C3C3C3","#A4A4A4","#777777","#515151","#7B7B7B"],[0.004,0.114,0.255,0.341,0.459,0.518,0.616,0.859,0.988],-117.9,96.7,0.1,96.7).s().p("AAAAFIAAgJIAAAJg");
	this.shape_1.setTransform(123.3,12);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.lf(["#9A9A9A","#666666","#B3B3B3","#EEEEEE","#C3C3C3","#A4A4A4","#777777","#515151","#7B7B7B"],[0.004,0.114,0.255,0.341,0.459,0.518,0.616,0.859,0.988],48.3,0,-44.5,0).s().p("AAABzQjzgBiughQiSgdgXgmIgCgEIgCgGIAAAAIgBgDIAAgBQAAgGAEgGIADgEQAYggBtgZIAigHQA5gLBAgHQBBgIBIgEQA5gCA+gBIAAAAIAogBIAqABIAAAAQA+ABA5ACQBIAEBAAIQBBAHA4ALQCdAfAQApIAAAJIABAEQgKAsikAgQitAhj1ABg");
	this.shape_2.setTransform(64.2,12.4);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#D4D4D4").s().p("AJQA+IAAgBQAAgFgCgFQgPgpiegdQg4gLhBgHQhAgIhIgEQg5gCg+gBIAAAAIgpgBIgpABIAAAAQg+ABg5ACQhIAEhAAIQhBAHg5ALIgiAHQhtAXgYAgIgDAEQgEAGAAAIIAAABIgxAAIAAAAIAAgCQAAgFACgFQAKgYA2gVQAtgPBNgQQBIgNBTgJIAIgBQBygLCHgBIApgBIAAAAIApABQCHABBzALIAGABQBUAJBIANQBRAQAuARQA9AYABAdIAAACIAAAAg");
	this.shape_3.setTransform(64.3,6.3);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,128.5,33.9);


(lib.штатив2 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.lf(["#999999","#D9D9D9","#4D4D4D"],[0,0.302,1],-8.7,-1.2,8.8,-1.2).s().p("EgA9AziQgVgFgDgGIgBgDMAAAhm6ICtAAMAAABm7IAAACQgEAGgWAFQgZAFgkAAQgiAAgbgFg");
	this.shape.setTransform(8.8,335.4);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.rf(["#D9D9D9","#999999","#666666"],[0.22,0.776,1],-3,2.4,0,-3,2.4,9.5).s().p("AhWAZQABgOAVgOQAbgVAlAAQAlAAAbAUQAVAOACAPg");
	this.shape_1.setTransform(8.8,2.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,17.5,665.8);


(lib.подставкаштатива = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#4EA6FE").s().p("EAh3AB0QALgegcjEMhDjAABQgDAAgDgCQgCgCAAgDQAAgDACgDQADgDgBAFMBDzgAFIAGgDQAZCTgVBug");
	this.shape.setTransform(205.9,67.7);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.lf(["#0277EC","#3999F9","#0277EC"],[0,0.396,1],0.3,-14.8,0.3,13.3).s().p("ABcB+IAAj4IbbgDIFOACIABAHQAUB+gWBzIgDABgABcB+MgjVAAAQgrhsAqiIMAjWgAEIAAD4gEgh5gB7IACAAIgDAEIABgEg");
	this.shape_1.setTransform(204.3,68.3);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#0480FB").s().p("EAh/AB2IgBgGIlOgDI7bADMgjWAAEIAAAAIAAgBIADgDIDKjlMAgJAAAIAADlIAAjlIeLAAICeDlIAEAGg");
	this.shape_2.setTransform(205,44.7);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f().s("#00FF00").ss(1,1,1,3,true).p("AAAAAIABAAQAAAAAAAA");
	this.shape_3.setTransform(422.2,55.8);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.lf(["#0277EC","#3999F9","#0277EC"],[0,0.396,1],0.3,-14.9,0.3,13.2).s().p("Egh5AB9QgshuAsiLMBD6AAAIAEAAQAWCCgXB1IgDACg");
	this.shape_4.setTransform(204.3,68.4);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_4},{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-14.9,32.8,439,48.2);


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


(lib.штатив = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	if (lib.properties.part == 'stick') {
		// Layer 1
		this.instance = new lib.штатив2();
		this.instance.parent = this;
		this.instance.setTransform(35.9,334,0.5,0.5,0,0,0,9.8,667.9);	
		this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));
	} else {
		this.instance_1 = new lib.подставкаштатива();
		this.instance_1.parent = this;
		this.instance_1.setTransform(105.1,326.5,0.5,0.5,0,0,0,195.2,35.3);
		this.instance_1.filters = [new cjs.ColorFilter(0.7, 0.7, 0.7, 1, 15.3, 15.3, 15.3, 0)];
		this.instance_1.cache(-17,31,443,52);
		this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(1));
	}

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,219.5,349.4);



// stage content:
(lib.bath = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	if (!lib.properties.part || lib.properties.part.indexOf('front')===0 || lib.properties.part == 'back') {
		this.instance = new lib.кольцо();
		this.instance.parent = this;
		this.instance.setTransform(162.1,187,1.33,1.33,0,0,0,174.8,-7.3);
		this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));
	}

	if (!lib.properties.part || lib.properties.part == 'front_bath' || lib.properties.part == 'back') {
		this.instance_1 = new lib.баня();
		this.instance_1.parent = this;
		this.instance_1.setTransform(230.9,263.9,1,1,0,0,0,64.3,108.1);
		this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(1));
	}

	if (!lib.properties.part || lib.properties.part.indexOf('front')===0 || lib.properties.part == 'back') {
		this.instance_2 = new lib.зажим();
		this.instance_2.parent = this;
		this.instance_2.setTransform(147.8,143.6,1.332,1.332,0,0,0,163.1,-7.3);
		this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(1));
	}

	if (!lib.properties.part || lib.properties.part == 'back') {
		this.instance_4 = new lib.Баня2();
		this.instance_4.parent = this;
		this.instance_4.setTransform(231,172.8,1,1,0,0,0,64.3,16.9);
		this.timeline.addTween(cjs.Tween.get(this.instance_4).wait(1));
	}
	
	if (!lib.properties.part || lib.properties.part == 'stand' || lib.properties.part == 'stick') {
		this.instance_6 = new lib.штатив();
		this.instance_6.parent = this;
		this.instance_6.setTransform(165,250,1.332,1.332,0,0,0,109.7,174.6);
		this.timeline.addTween(cjs.Tween.get(this.instance_6).wait(1));
	}

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-195,80.1,1024,768);

})(lib = lib||{}, images = images||{}, createjs = createjs||{}, ss = ss||{});
var lib, images, ss;

if (window.modelNS) {
	modelNS.IReact.libs.bath = lib;
	lib = null;
}