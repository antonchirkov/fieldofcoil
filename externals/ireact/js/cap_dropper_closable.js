(function (lib, img, cjs, ss) {

var p; // shortcut to reference prototypes

// library properties:
lib.properties = {
	width: 60,
	height: 290,
	fps: 24,
	color: "#cc0000",
	opacity: 1.00,
	scale: 0.55,
	manifest: []
};



lib.ssMetadata = [];


// symbols:



(lib.Symbol1 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("rgba(102,102,102,0.498)").ss(1,1,1,3,true).p("Ag0gCQADgGAMgEQARgFAUAAQAYAAAQAFQAKADADAFAA1AFQgDAFgKADQgQAFgYAAQgUAAgRgFQgMgEgDgG");
	this.shape.setTransform(5.4,173.5);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.lf(["#B1C4CD","rgba(166,192,217,0.6)","rgba(175,200,254,0)","rgba(136,167,204,0.6)","#A3C8DC"],[0,0.102,0.58,0.851,1],-5.4,0,5.3,0).s().p("AglAMQgMgDgDgHIAAgEQADgGAMgEQAQgFAVAAQAYAAAQAFQAKADADAFIAAAIQgDAGgKACQgQAGgYAAQgVAAgQgGg");
	this.shape_1.setTransform(5.4,173.5);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.lf(["#B1C4CD","rgba(166,192,217,0.6)","rgba(175,200,254,0)","rgba(136,167,204,0.6)","#A3C8DC"],[0,0.102,0.58,0.851,1],-5.4,0,5.3,0).s().p("Ag0ieQA3AHAygHIAAE6QgDgFgKgDQgQgFgYAAQgVAAgQAFQgMAEgDAGg");
	this.shape_2.setTransform(5.4,157.3);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.lf(["#B1C4CD","rgba(166,192,217,0.6)","rgba(175,200,254,0)","rgba(136,167,204,0.6)","#A3C8DC"],[0,0.102,0.58,0.851,1],-5.4,7.8,5.3,7.8).s().p("Ag0LBIAA2EQAIAGALAEQAQAFAVAAQAXAAAQgFIAKgEIAAV+QgZADgbAAQgZAAgcgDg");
	this.shape_3.setTransform(5.4,70.9);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-1,0,12.7,176.4);


(lib.Символ4 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Слой 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().ls(["#4F5557","#89A29A","#CDE1E2","#758F7C","#ADBDB8"],[0,0.055,0.502,0.906,1],-3.7,-1.2,3.7,1.2).ss(8,1,1).p("AAkh+IhHD9");
	this.shape.setTransform(3.6,12.8);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-4,-4,15.3,33.5);


(lib.капельница1 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#999999").s().p("AgUAuIAAhbIApAAIAABbg");
	if (lib.properties.closed) {
		this.shape.setTransform(34.2,55,1,0.974);
	} else {
		this.shape.setTransform(34.2,55,1,2.5);
	}

	this.instance = new lib.Символ4();
	this.instance.parent = this;
	this.instance.setTransform(25,55.2,0.782,0.782,73.4,0,0,3.6,13);
	this.instance.alpha = 0.699;
	
	var color = lib.properties.color || lib.properties.defColor; // || 'rgba(7,164,203,0.2)',
	rgba = colorToArray(color);

	function prepareColor(diff)
	{
		var diffColor = [];
		for (var i=0; i<3; i++) {
			var c = rgba[i] - diff[i];
			if (c<0) c=0;
			if (c>255) c=255;
			diffColor.push(c);
		}
		var alfa = rgba[3] ? rgba[3] : 1;
		if (diff[3]) alfa -= diff[3];
		return 'rgba(' + diffColor.join(',') + ','+alfa+')';
	}

	// брать в качестве основного - с наибольшей alfa
	var colors = {
		'rgba(7,164,203,0.2)': prepareColor([0, 0, 0, 0]),
		'rgba(0,204,255,0.2)': prepareColor([7, -40, -52, 0]),
	};
	
	/*
	function _tempDiff (color1, color2)
	{
		var diffColor = [];
		color1 = colorToArray(color1);
		color2 = colorToArray(color2);
		for (var i=0; i<3; i++) diffColor.push(color1[i]-color2[i]);
		console.log(color1[3], color2[3])
		diffColor.push((color1[3]||1) - (color2[3]||1));
		return diffColor;
	}
	_tempDiff('#ABDEF5', '#A2D6EE');
	*/

	// жидкость до краника
	this.shape_1 = new cjs.Shape();
	// жидкость верх
	this.shape_2 = new cjs.Shape();
	// жидкость середина
	this.shape_3 = new cjs.Shape();
	
	if (color) {
		this.shape_1.graphics.f(colors["rgba(7,164,203,0.2)"]).s().p("AgrBQIAAieQArAGAtgHIgBCfg");
		this.shape_1.setTransform(20,44.2,0.98,0.98);

		this.shape_2.graphics.f(colors["rgba(0,204,255,0.2)"]).s().p("Ai0AhQhHgNgFgRIAAgDIAAAAIAAAAIAAgCQAHgSBFgNQBLgOBpAAQBqAABLAOQBFANAHASIAAACIAAAAIAAAAQAAAUhMANQhLAPhqABQhpgBhLgPg");
		this.shape_2.setTransform(19.5,13.5);

		this.shape_3.graphics.f(colors["rgba(7,164,203,0.2)"]).s().p("Ai3AsQhBg/gKhYQAFASBHANQBMAPBqAAQBoAABMgPQBMgOgBgUIAAgBIAAgBIAAgCIAAgEIAAgBIAAgBIACACQAAABAAAAQABABAAAAQAAABABAAQAAABABAAQgIBchEBCQhNBNhrAAQhqAAhNhNgAkDh2IABgBIAAABIAAAEIAAACIgBgGg");
		this.shape_3.setTransform(19.7,24.6);
	}

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.rf(["rgba(175,200,254,0.2)","rgba(136,167,204,0.6)","#A3C8DC"],[0.435,0.851,1],-5.7,-6.8,0,-5.7,-6.8,35.1).s().p("AjACMQhRhQAAhwQAAhgA5hIIAAADQAAATA/AOQBAANBZAAQBaAAA/gNQBAgOAAgTIgBgDQA6BIAABgQAABwhQBQQhRBRhxAAQhwAAhQhRg");
	this.shape_4.setTransform(19.9,16);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.rf(["rgba(175,200,254,0.098)","rgba(136,167,204,0.6)","#A3C8DC"],[0.435,0.851,1],-0.1,3.7,0,-0.1,3.7,30.4).s().p("AiZAgQg/gOAAgSIAAgBIAJgLQAPgKAngJQBAgNBZAAQBaAAA/ANQAoAJAPAKIAIALIABABQAAAShAAOQg/ANhaAAQhZAAhAgNg");
	this.shape_5.setTransform(19.9,-5.8);

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f().s("rgba(102,102,102,0.302)").ss(1,1,1,3,true).p("AgqAFQAAgEAMgBQAOgEAQAAQATAAANAEQAKAAACAD");
	this.shape_6.setTransform(20.1,36.3,1,1,0,0,0,-0.1,0.2);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.lf(["#B1C4CD","rgba(166,192,217,0.6)","rgba(175,200,254,0)","rgba(136,167,204,0.6)","#A3C8DC"],[0,0.102,0.58,0.851,1],-5.4,0,5.3,0).s().p("AghANQgMgEgHgGIAAgFQAHgGAMgEQAQgFAVAAQAXAAAQAFIAKAFIAAAQIgKAEQgQAFgXAAQgVAAgQgFg");
	this.shape_7.setTransform(20.1,71.8);

	this.shape_8 = new cjs.Shape();
	this.shape_8.graphics.lf(["#B1C4CD","rgba(166,192,217,0.6)","rgba(175,200,254,0)","rgba(136,167,204,0.6)","#A3C8DC"],[0,0.102,0.58,0.851,1],-5.4,-6.5,5.4,-6.5).s().p("Ag0gUIAAAAIAAARIBpAAIAAATIgJgFQgRgFgXAAQgVAAgQAFQgLAEgIAGg");
	this.shape_8.setTransform(20.1,69.3);

	this.shape_9 = new cjs.Shape();
	this.shape_9.graphics.lf(["#B1C4CD","rgba(166,192,217,0.6)","rgba(175,200,254,0)","rgba(136,167,204,0.6)","#A3C8DC"],[0,0.102,0.58,0.851,1],-5.4,-13.5,5.4,-13.5).s().p("Ag0B9IAAgRIAAjpIBpAAIAAAAIAAD6g");
	this.shape_9.setTransform(20.1,56.3);

	this.shape_10 = new cjs.Shape();
	this.shape_10.graphics.lf(["#B1C4CD","rgba(166,192,217,0.6)","rgba(175,200,254,0)","rgba(136,167,204,0.6)","#A3C8DC"],[0,0.102,0.58,0.851,1],-5.4,5.3,5.4,5.3).s().p("Ag0AgIAAgxIAAgOQADADALADQAQAEAWAAQAXAAAQgEQAKgDAFgCIgBANIAAAxg");
	this.shape_10.setTransform(20.1,40.4);

	this.shape_11 = new cjs.Shape();
	this.shape_11.graphics.f().s("rgba(0,0,0,0.302)").ss(0.5,1,1).p("Ai0gLQgBgCAAgCQAAgRA2gMQA1gLBKAAQBLAAA2ALQA1AMAAARQAAACAAACQgFAMgwALQg2AMhLAAQhKAAg1gMQgwgLgFgMgAi0A4IAAhDAC2gLIAABA");
	this.shape_11.setTransform(19.8,75);

	this.shape_12 = new cjs.Shape();
	this.shape_12.graphics.f("rgba(44,42,42,0.698)").s().p("Ah/BSQg1gMgBgPIABiRQAFAOAwAKQA1ANBKAAQBLAAA2gNQA0gLABgRIAACVQgBAPg0AMQg2AMhLAAQhKAAg1gMg");
	this.shape_12.setTransform(19.8,89.9);

	this.shape_13 = new cjs.Shape();
	this.shape_13.graphics.f("#2C2A2A").s().p("AiAAoQgvgKgFgOIAAhEQAEAPAwAKQA2AMBKAAQBLAAA1gMQAwgKAFgPIAABBQAAAQg1ALQg1ANhLAAQhKAAg2gNg");
	this.shape_13.setTransform(19.9,79.1);

	this.shape_14 = new cjs.Shape();
	this.shape_14.graphics.f("#414040").s().p("Ah/AcQgwgKgFgPIgBgDQAAgQA2gMQA1gLBKAAQBLAAA2ALQA1AMAAAQIAAADQgFAPgwAKQg2AMhLAAQhKAAg1gMg");
	this.shape_14.setTransform(19.8,73.4);

	this.instance_1 = new lib.Symbol1();
	this.instance_1.parent = this;
	this.instance_1.setTransform(20.2,185.7,1,1,0,0,0,5.4,87.7);
	this.instance_1.alpha = 0.699;

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_1},{t:this.shape_14},{t:this.shape_13},{t:this.shape_12},{t:this.shape_11},{t:this.shape_10},{t:this.shape_9},{t:this.shape_8},{t:this.shape_7},{t:this.shape_6},{t:this.shape_5},{t:this.shape_4},{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.instance},{t:this.shape}]}).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-7.5,-10.4,54.9,283.8);


// stage content:
(lib.cap_dropper_closable = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.instance = new lib.капельница1();
	this.instance.parent = this;
	this.instance.setTransform(30.1,162,1,1,0,0,0,20,149.2);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(72.6,158.1,54.9,283.8);

})(lib = lib||{}, images = images||{}, createjs = createjs||{}, ss = ss||{});
var lib, images, ss;


if (window.modelNS) {
	modelNS.IReact.libs.cap_dropper_closable = lib;
	lib = null;
}

