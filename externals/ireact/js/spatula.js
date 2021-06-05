(function (lib, img, cjs, ss) {

var p; // shortcut to reference prototypes

// library properties:
lib.properties = {
	width: 300,
	height: 100,
	scale:0.6,
	x:135,
	y:33,
	rotation:-5,
	fps: 24,
	color: "#FFFFFF",
	opacity: 1.00,
	manifest: []
};



lib.ssMetadata = [];


// symbols:



(lib.spatula_ = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("rgba(255,255,255,0.502)").s().p("AG+B5QgzgYhAgTQg/gUlThgQlYhjghgIQhMgQgdgbQAMgHAhALIGEBrQFsBhAgALQAuAPBJAcQAhAQAsAfQArAgAnAmQg5gugzgYg");
	this.shape.setTransform(87.6,8.6,1.518,0.863,-9.3);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#8E8A8A").s().p("AhoAiQingNgNgQQgOgQA2gNQA2gNBdgCQBdgDCGAEQCIADARAWQARAVgnAOQgnAOhNAEIg/ABQhPAAhrgHg");
	this.shape_1.setTransform(210.5,19.1,1,1,0,0,0,-17.4,0.6);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#AAAAAA").s().p("AgcAMQhPgdhEgNIAXgBQAsgFAAggQAAgWgZgPQBPAPBiAnQA9AYBGALQADACgRgEQgRgEgYAOQgYALAoA2QAfAqAJAHg");
	this.shape_2.setTransform(171.2,12.4);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#B4B4B4").s().p("AJaBnIgBgBIgDgBQgJgIgfgqQgngzAXgOQAYgOARAEQARAEgDgCQCAAUBkgHIEuAGQB+ANAXATQAXAUgSAfQgTAdgxAKQgwAJhOABIi+AAIgSAAQimAAhvgagA0AhIIAAgBQghg1BiAFIJjgHQJcAAA5ABQA6ACBgAFQAkABApAIQAYAPAAAXQAAAfgsAGIgXAAQgigGgggBQhdgEorAIQouAJg0ACIguACQh2AAglgug");
	this.shape_3.setTransform(129,13);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,258,26);


// stage content:
(lib.spatula = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.instance = new lib.spatula_();
	this.instance.parent = this;
	this.instance.setTransform(150.5,55.1,1,1,0,0,0,129,13);
	
	this.clip = this.instance;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(171.5,92.1,258,26);

})(lib = lib||{}, images = images||{}, createjs = createjs||{}, ss = ss||{});
var lib, images, ss;


if (window.modelNS) {
	modelNS.IReact.libs.spatula = lib;
	lib = null;
}