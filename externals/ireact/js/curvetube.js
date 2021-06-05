(function (lib, img, cjs, ss) {

var p; // shortcut to reference prototypes

// library properties:
lib.properties = {
	width: 200,
	height: 120,
	fps: 24,
	color: "#FFFFFF",
	opacity: 1.00,
	scale: 0.5,
	manifest: []
};



lib.ssMetadata = [];


// symbols:


(lib.Колбавюрца = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// трубка
	this.shape = new cjs.Shape();
	this.shape.graphics.lf(["#B1C4CD","rgba(166,192,217,0.4)","rgba(175,200,254,0)","rgba(136,167,204,0.4)","#A3C8DC"],[0,0.102,0.329,0.851,1],-4,37.1,5,37.1).s().p("AgmMAQgNgQAFnwQADj5AFjzIgGoaIBYAAIAFXEQgBAXgjAfQgVATgPAAQgJAAgGgHg");
	this.shape.setTransform(415.4,160.6,3.514,3.514,123.2);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f().s("#969A9C").ss(1,1,1).p("AArCvQgBAAgBAAQg0gZgYiKQgViJAogx");
	this.shape_1.setTransform(83.3,105.7);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.lf(["#B1C4CD","rgba(166,192,217,0.4)","rgba(175,200,254,0)","rgba(136,167,204,0.4)","#A3C8DC"],[0,0.102,0.329,0.851,1],-132.8,84.9,-113.5,109.8).s().p("ApYHKQgWiMAogwIOvrZIDZihQg0BEAcCMQASBYAlBJIg2AqIwyM+IgBAAIgCAAQg2gZgYiKg");
	this.shape_2.setTransform(139.9,61.1);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-287.5,-116.8,939.8,1049.5);


// stage content:
(lib.curvetube = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.instance = new lib.Колбавюрца();
	this.instance.parent = this;
	this.instance.setTransform(0,124.7,0.3,0.3,0,0,0,48.3,399.2);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(152.2,199.9,292.5,329);

})(lib = lib||{}, images = images||{}, createjs = createjs||{}, ss = ss||{});
var lib, images, ss;



if (window.modelNS) {
	modelNS.IReact.libs.curvetube = lib;
	lib = null;
}
