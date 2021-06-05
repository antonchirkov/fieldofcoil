(function (lib, img, cjs, ss) {

var p; // shortcut to reference prototypes

// library properties:
lib.properties = {
	width: 128,
	height: 250,
	scale:0.35,	// glass ??
	fps: 12,
	color: "#FFFFFF",
	opacity: 1.00,
	type: 'test_tube',
	manifest: []
};



lib.ssMetadata = [];


// symbols:



(lib.Symbol3 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});
	
	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f(lib.properties.color).s().p("AgiAjQgOgOAAgVQAAgTAOgPQAPgPATAAQAUAAAPAPQAPAPAAATQAAAVgPAOQgPAPgUAAQgTAAgPgPg");
	this.shape.setTransform(13.7,32);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(8.7,27,10,10);


(lib.испарение_1 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 4 (mask)
	var mask = new cjs.Shape();
	mask._off = true;
	mask.graphics.p("Ap3HxIAAvhQDQBcGPADQGTADD9hdIAAPcg");
	mask.setTransform(54.5,42.7);

	// Layer 1
	this.instance = new lib.Symbol3();
	this.instance.parent = this;
	this.instance.setTransform(95,44.8,1,0.364,0,0,0,13,31.7);
	this.instance.filters = [new cjs.BlurFilter(15, 15, 1)];
	this.instance.cache(7,25,14,14);

	this.instance.mask = mask;

	this.timeline.addTween(cjs.Tween.get(this.instance).to({regX:13.8,regY:31.8,scaleX:3.82,scaleY:3.82,y:27.6},29).wait(1));

	// Layer 1
	this.instance_1 = new lib.Symbol3();
	this.instance_1.parent = this;
	this.instance_1.setTransform(39,44.4,1,1,0,0,0,13.5,31.9);
	this.instance_1.filters = [new cjs.BlurFilter(15, 15, 1)];
	this.instance_1.cache(7,25,14,14);

	this.instance_1.mask = mask;

	this.timeline.addTween(cjs.Tween.get(this.instance_1).to({regX:13.8,regY:31.8,scaleX:1.46,scaleY:1.46,x:36.7,y:22.9},29).wait(1));

	// Layer 1
	this.instance_2 = new lib.Symbol3();
	this.instance_2.parent = this;
	this.instance_2.setTransform(58,45,1,0.364,0,0,0,13,32.5);
	this.instance_2.filters = [new cjs.BlurFilter(15, 15, 1)];
	this.instance_2.cache(7,25,14,14);

	this.instance_2.mask = mask;

	this.timeline.addTween(cjs.Tween.get(this.instance_2).to({regX:13.8,regY:31.9,scaleX:2.39,scaleY:2.39,x:60.5,y:23.1},29).wait(1));

	// Layer 1
	this.instance_3 = new lib.Symbol3();
	this.instance_3.parent = this;
	this.instance_3.setTransform(23,47.7,1,0.4,0,0,0,13.5,32.5);
	this.instance_3.filters = [new cjs.BlurFilter(15, 15, 1)];
	this.instance_3.cache(7,25,14,14);

	this.instance_3.mask = mask;

	this.timeline.addTween(cjs.Tween.get(this.instance_3).to({regX:13.8,regY:31.8,scaleX:4.17,scaleY:4.34,x:26.1,y:35.1},29).wait(1));

	// Layer 1
	this.instance_4 = new lib.Symbol3();
	this.instance_4.parent = this;
	this.instance_4.setTransform(13,37.7,1,0.4,0,0,0,13.5,32.5);
	this.instance_4.filters = [new cjs.BlurFilter(15, 15, 1)];
	this.instance_4.cache(7,25,14,14);

	this.instance_4.mask = mask;

	this.timeline.addTween(cjs.Tween.get(this.instance_4).to({regX:13.8,regY:31.9,scaleX:2.39,scaleY:2.39,x:12,y:15.1},29).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-7.8,19.5,125.5,54);


// stage content:



(lib.fume = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.instance = new lib.испарение_1();
	this.instance.parent = this;
	this.instance.setTransform(62.6,35.4,1,1,0,0,0,52.5,24.9);
	
	if (lib.properties.type == 'test_tube') {
		this.instance.setTransform(30,90.4,0.5,2,0,0,0,52.5,24.9);
	} else {
		this.instance.setTransform(62.6,35.4,1,1,0,0,0,52.5,24.9);
	}
	
	this.playClip = this.instance;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(87.3,70.5,126.5,99.5);

})(lib = lib||{}, images = images||{}, createjs = createjs||{}, ss = ss||{});
var lib, images, ss;

if (window.modelNS) {
	modelNS.IReact.libs.fume = lib;
	lib = null;
}