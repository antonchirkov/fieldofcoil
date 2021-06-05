(function (lib, img, cjs, ss) {

var p; // shortcut to reference prototypes

// library properties:
lib.properties = {
	width: 260,
	height: 60,
	fps: 12,
	color: "#FFFFFF",
	opacity: 1.00,
	scale: 0.8,
	part: '', // over
	manifest: []
};



lib.ssMetadata = [];


// symbols:


(lib.подставка1 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#AEBFCC").s().p("AAmCTIAAgBQgDgEgCAAIhLiDIAHgZIACADQAEAEAFAAQAJAAAHgQQAGgRAAgXIgBgUQgCgLgDgJIgDgGIAKglIAQAgIALAcIAGAWQARBJgIB4IgBANIAAAEIAAAAIAAABIgCAAg");
	this.shape.setTransform(4.4,17.7);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#A9B9C6").s().p("AgVCiIAAgCIAAAAIAAgEIABgMQAQgDArgQQAtgQgShCQgShAgwg3QgtgzgRgJIgEgBIgPgQIgJgIQA3AgAmAuQA2A+AcBVQAOAfgUAdQgVAeg9AGIgQACIgCAAg");
	this.shape_1.setTransform(10.6,16.3);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#D5EAFA").s().p("Aggg1IgGgWIgLgcIgSghIABgDQARAJAtAyQAwA3ATBBQASBBgtAQQgsAQgPADQAIh5gRhIg");
	this.shape_2.setTransform(11,16.6);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,19.8,32.5);


(lib.подставка = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#51595F").s().p("AgHA0IgCgDQgDgEgDgGQgGgQAAgXQAAgUAFgOIABgFQAHgQAIAAQAHAAAGALIADAFQADAKACALIABASQAAAXgGAQQgHARgJAAQgDAAgEgEg");
	this.shape.setTransform(209.3,17.5);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#AEBFCC").s().p("Ag4gXIACgHQAGgyAdgOQAXgMAaAUIAKAIIAOAQIADAFIgKAlQgGgLgHAAQgKAAgHARIgBAEQgFANAAAVQAAAXAGARQADAFADAEIgIAbg");
	this.shape_1.setTransform(205.9,15);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#C7DAE9").s().p("AveA4IgCgFIAAgBIACgHIAJgSQAWgjApgbQAqgaAlAAIbNAAQAkABAbAZQAUATAHAXIABAHIgBAGIgEAJQgHgSgQgNQgbgZgjgBI7OAAQglAAgqAaQgpAYgWAmIgDAGIgGgIg");
	this.shape_2.setTransform(110.8,22.1,0.925,1);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#A9B9C6").s().p("AuuAzQgmAAgLgaIgBgDQgFgQAGgSIAAABIACAFIAGAGQANAOAcAAIc/AAQAkgBAYgYQAKgLAGgNIADgJIACgGIABANQABALgCALQgEAWgRASQgYAZgkABg");
	this.shape_3.setTransform(110.7,28.5,0.925,1);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("#B7C9D7").s().p("AuxA3QgbAAgNgPIADgGQAVgjAqgbQApgaAmAAIbNAAQAkACAaAYQAQAQAHAQQgFANgLALQgYAagkABg");
	this.shape_4.setTransform(110.9,24.5,0.925,1);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("#A3B3BF").s().p("AzZAxIAAhiMAmyAAAIAABig");
	this.shape_5.setTransform(124.2,42.6);

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f("#CFE3F3").s().p("ATZCBMgmyAAAICvkCMAgsAAAIDYECg");
	this.shape_6.setTransform(124.3,24.6);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.f("#D5EAFA").s().p("AAAgBIABABIgBACIAAgDg");
	this.shape_7.setTransform(209,3.9);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_7},{t:this.shape_6},{t:this.shape_5},{t:this.shape_4},{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,3.7,248.6,43.9);


// stage content:
(lib.splinter_block = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});
	
	// верхняя часть, перекрывающая лучину
	if (lib.properties.part == 'over') {
		this.instance = new lib.подставка1();
		this.instance.parent = this;
		this.instance.setTransform(338,30,1,1,0,0,0,124.3,23.8);

		this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));	
		return;
	}

	// Layer 1
	this.instance = new lib.подставка();
	this.instance.parent = this;
	this.instance.setTransform(130.8,24.9,1,1,0,0,0,124.3,23.8);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(136.5,34.8,248.6,43.9);

})(lib = lib||{}, images = images||{}, createjs = createjs||{}, ss = ss||{});
var lib, images, ss;

if (window.modelNS) {
	modelNS.IReact.libs.splinter_block = lib;
	lib = null;
}