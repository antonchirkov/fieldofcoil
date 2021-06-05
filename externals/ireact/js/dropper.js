(function (lib, img, cjs, ss) {

var p; // shortcut to reference prototypes

// library properties:
lib.properties = {
	width: 30,
	height: 13,
	fps: 12,
	// color: "rgba(196,196,196,0.898)",
	// color: "rgba(255,255,0,0.898)",
	color: "rgba(91,202,229,0.898)",
	opacity: 1.00,
	manifest: [],
};



lib.ssMetadata = [];


// symbols:



(lib.капля_1 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});
	
	
	
	// if (lib.properties.color == 'default') {	// rgb(91,202,229)
		// lib.properties.color = 
	// }
	
	var rgba = colorToArray(lib.properties.color);

	if (!rgba)
		return;
	
	var rgba2 = rgba.slice(0),
		rgba3 = rgba.slice(0);
	rgba2[3] -= 0.1;
	rgba3[3] += 0.3;
	if (rgba3[3] > 1) rgba3[3] = 1;
	

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("rgba(255,255,255,0.6)").s().p("AgXAgIgGgDIgBgDIgBgHQABgYAUgRQATgNAXAEQgOALgKAcQgIAZgRAAIgGgBg");
	this.shape.setTransform(6.5,4.5,1.384,1);

	this.shape_1 = new cjs.Shape();
	// this.shape_1.graphics.f().s("#999999").ss(0.1,1,1).p("AgaAxQgDAAgCAAQgiAAgbgFQgpgGAAgaQAAgYAngTQAjgPAtgCQAIgBAGAAQA3AAAnASQAoATAAAYQAAAagmAFQgnAFg3ABQgOABgOgB");
	this.shape_1.graphics.f().s("rgba("+rgba3.join(",")+")").ss(0.1,1,1).p("AgaAxQgDAAgCAAQgiAAgbgFQgpgGAAgaQAAgYAngTQAjgPAtgCQAIgBAGAAQA3AAAnASQAoATAAAYQAAAagmAFQgnAFg3ABQgOABgOgB");
	this.shape_1.setTransform(13.4,5);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("rgba("+rgba.join(",")+")").s().p("AhPAxQA3gBAkgFQAmgFAAgaQAAgYgngTQgggPgugCIAPgBQA2AAAnASQAnATAAAYQAAAagmAFQgmAFg1ABIgQABIgOgBg");
	this.shape_2.setTransform(18.7,5);

	this.shape_3 = new cjs.Shape();
	// this.shape_3.graphics.f("rgba(204,204,204,0.898)").s().p("AgQAxQgiAAgbgFQgogGgBgaQAAgYAngTQAjgPAsgCQAtACAiAPQAnATAAAYQAAAagmAFQgmAFg1ABIAAAAIgDAAIgCAAg");
	this.shape_3.graphics.f("rgba("+rgba2.join(",")+")").s().p("AgQAxQgiAAgbgFQgogGgBgaQAAgYAngTQAjgPAsgCQAtACAiAPQAnATAAAYQAAAagmAFQgmAFg1ABIAAAAIgDAAIgCAAg");
	this.shape_3.setTransform(11.9,5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-1,-1,28.8,12);


// stage content:
(lib.dropper = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 2
	this.instance = new lib.капля_1();
	this.instance.parent = this;
	this.instance.setTransform(15,7.5,1,1,0,0,0,13.4,5);
	
	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	// this.instance_1 = new lib.капля_1();
	// this.instance_1.parent = this;
	// this.instance_1.setTransform(94,-8.2,1,1,0,0,0,13.4,5);
	// this.instance_1.filters = [new cjs.ColorFilter(0.65, 0.65, 0.65, 1, 89.25, 71.4, 0, 0)];
	// this.instance_1.cache(-3,-3,33,16);

	// this.instance_2 = new lib.капля_1();
	// this.instance_2.parent = this;
	// this.instance_2.setTransform(65,-8.2,1,1,0,0,0,13.4,5);
	// this.instance_2.filters = [new cjs.ColorFilter(0.8, 0.8, 0.8, 1, 51, 0, 0, 0)];
	// this.instance_2.cache(-3,-3,33,16);

	// this.instance_3 = new lib.капля_1();
	// this.instance_3.parent = this;
	// this.instance_3.setTransform(36,-8.2,1,1,0,0,0,13.4,5);
	// this.instance_3.filters = [new cjs.ColorFilter(0.65, 0.65, 0.65, 1, 0, 53.55, 89.25, 0)];
	// this.instance_3.cache(-3,-3,33,16);

	// this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_3},{t:this.instance_2},{t:this.instance_1},{t:this.instance}]}).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(16.6,-5.7,105.9,25.8);

})(lib = lib||{}, images = images||{}, createjs = createjs||{}, ss = ss||{});
var lib, images, ss;

if (window.modelNS) {
	modelNS.IReact.libs.dropper = lib;
	lib = null;
}