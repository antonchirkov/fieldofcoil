(function (lib, img, cjs, ss) {

var p; // shortcut to reference prototypes

// library properties:
lib.properties = {
	width: 200,
	height: 20,
	fps: 12,
	color: "#FFFFFF",
	opacity: 1.00,
	scale:0.8,
	manifest: []
};



lib.ssMetadata = [];


// symbols:



(lib.luchina_1 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 2
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#EBCAAA").s().p("AtaAgQgigjAigcIazAAQAmAfgmAgg");
	this.shape.setTransform(87.2,-8.7);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(13));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-0.4,-20.3,175.3,19.2);


// stage content:
(lib.splinter = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.instance = new lib.luchina_1();
	this.instance.parent = this;
	this.instance.setTransform(28,24.9,1.008,1,0,0,0,15.7,6.1);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(111.7,16.8,176.7,6.5);

})(lib = lib||{}, images = images||{}, createjs = createjs||{}, ss = ss||{});
var lib, images, ss;


if (window.modelNS) {
	modelNS.IReact.libs.splinter = lib;
	lib = null;
}