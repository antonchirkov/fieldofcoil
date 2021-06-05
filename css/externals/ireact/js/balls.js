(function (lib, img, cjs, ss) {

var p; // shortcut to reference prototypes

// library properties:
lib.properties = {
	width: 130,
	height: 90,
	fps: 12,
	color: "#FFFFFF",
	opacity: 1.00,
	scale: 0.36,
	size:1,
	manifest: []
};



lib.ssMetadata = [];


// symbols:



(lib.комок = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});
	
	// rgba(242,203,47,0.353);
	var color = lib.properties.color || lib.properties.defColor || 'rgba(242,203,47,0.353)',
	rgba = colorToArray(color);

	// тень
	this.shape = new cjs.Shape();
	this.shape.graphics.f("rgba(0,0,0,0.047)").s().p("AhiB1QgRgFgJgUIAAgBQAMAAAOAGQASAHAIAAQAFAAAKgPQAKgPAOAAQAqABALgNQAEgEAAgGQAAgDgMgMQgMgNAAgGQAAgFAfgNQAegNAAgMQAAgGgFgJQgFgJAAgCQAAgHAIgDQAIgDAAgJQAAgZgMgLIgIgJIABAAIAJAGQASAOATAbIADAEQAZAkABAWIACAiQAAANgOAWQgOAVgQADQgFABgNARIgBAAQgOAPgQAAQgEAAgMgDQgMgEgEAAQgtAJgNAAQggAAgIgCg");
	this.shape.setTransform(17.2,15);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	// Layer 1
	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("rgba("+rgba.join(",")+")").s().p("AhLCEQgRgEgIgVQgHgQgWgMQgSgLAAgSQAAgjAKgPQAOgRAGgxQADgYAlgXQAhgUAbgBIALABIARAHQAdAFAfASQAYAPAZAkQAaAkABAVIABAjQABANgOAWQgOAVgQADQgFACgPAQQgNAPgRABQgDgBgMgDQgMgEgEAAQguAJgNABQgggBgIgCg");
	this.shape_1.setTransform(14.9,13.5);

	this.timeline.addTween(cjs.Tween.get(this.shape_1).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,29.8,27);


(lib.glassvol = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	this.instance_1 = new lib.комок();
	this.instance_1.parent = this;
	this.instance_1.setTransform(129.4,119,0.704,0.704,0,0,0,14.9,13.5);

	this.instance_2 = new lib.комок();
	this.instance_2.parent = this;
	this.instance_2.setTransform(117.8,158,0.704,0.704,0,0,0,14.9,13.5);

	this.instance_3 = new lib.комок();
	this.instance_3.parent = this;
	this.instance_3.setTransform(62.8,118.1,0.848,0.848,0,0,0,14.9,13.6);

	this.instance_4 = new lib.комок();
	this.instance_4.parent = this;
	this.instance_4.setTransform(46,128.3,0.704,0.704,0,0,-1.4,14.9,13.6);

	this.instance_5 = new lib.комок();
	this.instance_5.parent = this;
	this.instance_5.setTransform(33.3,144,0.704,0.704,0,0,0,14.9,13.5);

	this.instance_6 = new lib.комок();
	this.instance_6.parent = this;
	this.instance_6.setTransform(79.2,130.3,0.848,0.848,0,0,0,14.9,13.6);

	this.instance_7 = new lib.комок();
	this.instance_7.parent = this;
	this.instance_7.setTransform(110.1,130.5,1,1,0,0,0,14.9,13.5);

	this.instance_8 = new lib.комок();
	this.instance_8.parent = this;
	this.instance_8.setTransform(138.3,142.4,1.294,1.294,0,0,0,14.9,13.7);

	this.instance_9 = new lib.комок();
	this.instance_9.parent = this;
	this.instance_9.setTransform(93,153.2,1,1,0,0,0,14.9,13.5);

	this.instance_10 = new lib.комок();
	this.instance_10.parent = this;
	this.instance_10.setTransform(59.8,148.7,1,1,0,0,0,14.9,13.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_10},{t:this.instance_9},{t:this.instance_8},{t:this.instance_7},{t:this.instance_6},{t:this.instance_5},{t:this.instance_4},{t:this.instance_3},{t:this.instance_2},{t:this.instance_1}]}).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,-44.6,180.3,234.5);




(lib.probirka_vol = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// комок
	this.instance_1 = new lib.комок();
	this.instance_1.parent = this;
	this.instance_1.setTransform(15.6,123.9,0.586,0.586,0,0,0,15,13.6);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0.1,0,32.2,134.6);


// stage content:
(lib.balls = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// множество
	if (lib.properties.size == Infinity) {
		this.instance = new lib.glassvol();
		this.instance.parent = this;
		this.instance.setTransform(65,0,0.905,1,0,0,0,92.9,80.2);

		this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));
	} else {
		// один
		this.instance = new lib.probirka_vol();
		this.instance.parent = this;
		this.instance.setTransform(58,-15,1.609,1.609,0,0,0,16.1,67.3);

		this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));
	}

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(98.4,132.8,163.2,234.5);

})(lib = lib||{}, images = images||{}, createjs = createjs||{}, ss = ss||{});
var lib, images, ss;


if (window.modelNS) {
	modelNS.IReact.libs.balls = lib;
	lib = null;
}
