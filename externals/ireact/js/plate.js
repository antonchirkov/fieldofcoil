(function (lib, img, cjs, ss) {

var p; // shortcut to reference prototypes

// library properties:
lib.properties = {
	width: 118,
	height: 35,
	fps: 12,
	color: "#FFFFFF",
	opacity: 1.00,
	x:-6,
	y:-8,
	scale: 1,
	manifest: []
};



lib.ssMetadata = [];


// symbols:



(lib.пластинка_1 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#C4BBB7").ss(0.1,1,1).p("Ao8AyQgCgHABgHQAAgBAAgBQADgQAPgTIBIhkQAhguBagCIK9ACQBnABAjAvIBMBbQAPATAEARQAAAFgBAIQgEAOgMAIQgcAPg8AAIu4AAQgxAAgWgLQgOgHgEgKgAI9ApIAAA4QACAJgCAHIgBAEQgNAghaAAIu4ABQhVAAgFgiQgBgHACgHIAAg0");
	this.shape.setTransform(57.5,15);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.lf(["#9A9A9A","#C4B8B5","#EEEEEE","#E9DEDA","#A49D9C","#7B7B7B"],[0.004,0.039,0.086,0.871,0.918,0.984],-64.1,0,64,0).s().p("Ao9AUQgBgHACgIIAAgyQAEALAOAHQAWAMAxgBIO4AAQA8AAAcgPQAMgIAEgOIAAA2QACAJgCAHIgBAEQgNAghaAAIu4AAQhVAAgFghg");
	this.shape_1.setTransform(57.5,24.6);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#FFF9F7").s().p("AoqBYQgOgIgEgKQgCgGABgIIBQhrQAiguBcgBILNABQBpACAkAuIBTBhQAAAGgBAIQgEAOgMAHQgcAPg8ABIu4AAQgxAAgWgLg");
	this.shape_2.setTransform(57.5,13);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#F5F0EE").s().p("Ao8BbQACgQAQgVIBHhiQAhguBagCIK9ACQBnACAkAuIBLBZQAPAVAEARIhShhQglgvhpgCIrNgBQhcACgiAuIhQBrIABgCg");
	this.shape_3.setTransform(57.5,9.3);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-1,-1,116.9,32);


// stage content:
(lib.plate = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.instance = new lib.пластинка_1();
	this.instance.parent = this;
	this.instance.setTransform(48.1,20.7,1,1,0,0,0,40.5,10.7);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(72.5,35,115,30.1);

})(lib = lib||{}, images = images||{}, createjs = createjs||{}, ss = ss||{});
var lib, images, ss;


if (window.modelNS) {
	modelNS.IReact.libs.plate = lib;
	lib = null;
}