(function (lib, img, cjs, ss) {

var p; // shortcut to reference prototypes

// library properties:
lib.properties = {
	width: 100,
	height: 120,
	x: -25,
	y:-10,
	fps: 24,
	defColor: "rgba(29,156,225,1)",
	// defColor: "rgba(255,255,255,1)",
	paint: 'dark',
	opacity: 1.00,
	manifest: [],
	cap: false,
	hasGlass: true,
};



lib.ssMetadata = [];


// symbols:



(lib.Path_5 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#00265C").s().p("AiWAeQhAgRAAgRQAAgSA/gNQA/gMBYAAQBZgBA/ANQA/AMAAASQAAARg+ASQhDAThVAAQhTAAhEgTg");
	this.shape.setTransform(21.5,4.9);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,43.1,9.8);


(lib.Path_4 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#00195F").s().p("AgsAYQhFgFg3gMQAKgKAYgWIEXADIAYAXQg6AZhgAAQgbAAgggCg");
	this.shape.setTransform(16.9,2.6);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,33.8,5.3);


(lib.Path_3 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FFFFFF").s().p("AgljAQgBAAAAAAQgBgBAAAAQAAAAAAgBQAAAAAAgBIACgCQgFhSgLgzQgGgZgFgIIA0gCQAyAgAOBJQAHAkgEAeIAEgCIAFIcQgFAFgQAFQgfALguABg");
	this.shape.setTransform(6.5,36.6);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,13,73.3);


(lib.Path_0 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FFFFFF").s().p("AgVgrQACACAUAAIAVAAIAABSQgVgBgUAEg");
	this.shape.setTransform(2.2,4.5);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,4.5,8.9);


(lib.флакон = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});
	
	this.shape_cap = new cjs.Shape();
	this.shape_cap2 = new cjs.Shape();
	
	if (lib.properties.cap || !lib.properties.hasGlass) {
		this.shape_cap.graphics.lf(["#BDC6CB","#B8C2C8","#637B92","#415F7D"],[0,0.039,0.698,1],-10,-37.7,-12.6,20.4).s().p("Ah4AaQgygKAAgPQAAgNAygLQAygLBGgBQBGAAAzAKQAyAKAAAOQABANgzALQgyAMhHAAIgKABQhAAAgugKg");
		this.shape_cap.setTransform(22.3,3.6);

		this.shape_cap2.graphics.lf(["#99A9B9","#E8EBED","#CFD6DD","#AEBAC8"],[0,0.451,0.671,1],-14.6,0,16.9,0).s().p("Ah3A9QgxgKgCgOIAAAAIgBhnIFWgDIABBmQgBAPgyALQgyALhGAAIgLAAQg/AAgugJg");
		this.shape_cap2.setTransform(22.3,10.3);	
	}
	
	if (!lib.properties.hasGlass) {
		this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_cap},{t:this.shape_cap2}]}).wait(1));
		return;
	}

	// Layer 1
	var color = lib.properties.color || lib.properties.defColor,
		rgb = colorToArray(color),
		rgb2 = rgb.slice(0);
	rgb2[3] -= rgb2[3]*0.4;
	// rgb2[3] -= 0.4;

	// !! 15,66,79 - default
	this.shape_liquid = new cjs.Shape();
	this.shape_liquid.graphics.f("rgba("+rgb2.join(",")+")").s().p("AiWAeQg/gRgBgRIAAAAIAAgBQADgSA8gMQA/gMBYAAQBZgBA/ANQA/AMAAASIgCAFQgIAPg0APQhDAThVAAQhTAAhEgTg");
	this.shape_liquid.setTransform(23.1,45.5);

	// !! 4,48,53,0.898
	this.shape_liquid2 = new cjs.Shape();
	this.shape_liquid2.graphics.f("rgba("+rgb.join(",")+")").s().p("AiWDQQhAgRAAgTIABgEIgBmKQABATA/ARQBEATBTAAQBVAABDgTQA0gPAIgQIAAGDIACAEIAAABQAAATg+ASQhDAThVAAQhTAAhEgTg");
	this.shape_liquid2.setTransform(23.1,67.2);

	// this.instance_2 = new lib.Path_0();
	// this.instance_2.parent = this;
	// this.instance_2.setTransform(18.3,12.5,1,1,0,0,0,2.2,4.5);
	// this.instance_2.alpha = 0.762;

	// this.instance_3 = new lib.Path_4();
	// this.instance_3.parent = this;
	// this.instance_3.setTransform(22.8,17,1,1,0,0,0,16.9,2.6);
	// this.instance_3.alpha = 0.219;

	// ????
	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.lf(["#B1C4CD","rgba(166,192,217,0.6)","rgba(175,200,254,0)","rgba(136,167,204,0.6)","#A3C8DC"],[0,0.102,0.329,0.851,1],-24.3,7.2,23.4,7.5).s().p("AilGTQhAgUAAghIAAo3IACAAQALhWBBg6QBBg6BWAAQBWgBBCA6QBAA6AMBWIACAAIAAI3QAAAdg9AVQhCAWhnAAQhoAAg9gSg");
	this.shape_6.setTransform(23.1,51.9);

	
	// Layer 1

	this.instance = new lib.Path_3();
	this.instance.parent = this;
	this.instance.setTransform(13.4,52.7,1,1,0,0,180,6.5,36.6);
	this.instance.alpha = 0.5;

	this.instance_1 = new lib.Path_5();
	this.instance_1.parent = this;
	this.instance_1.setTransform(23.1,85.1,1,1,0,0,0,21.5,4.9);
	this.instance_1.alpha = 0.1*1/rgb[3];

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#8DA6B8").s().p("AiOgRQAAAAgBAAQAAgBAAAAQAAgBAAAAQAAgBABAAQAAgBAAAAQAAgBABAAQAAAAAAgBQABAAAAAAQABAAAAAAQABgBAAAAQABAAAAAAQABABAAAAQAAAAABAAQAAAAABABQAAAAAAABQABAAAAAAQAUAqD8gIQAAAAABAAQAAABABAAQAAAAAAAAQABAAAAABQABAAAAAAQAAABAAAAQABABAAAAQAAABAAAAQAAABAAAAQAAABAAAAQgBABAAAAQAAABAAAAQgBAAAAABQgBAAAAAAQgBAAAAAAQAAAAgBAAIhFACQjDAAgRgqg");
	this.shape_2.setTransform(22.8,10.2);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#8DA6B8").s().p("AiOgRQAAAAgBAAQAAgBAAAAQAAgBAAAAQAAgBABAAQAAgBAAAAQAAgBABAAQAAAAAAgBQABAAAAAAQABAAAAAAQABgBAAAAQABAAAAAAQABABAAAAQAAAAABAAQAAAAABABQAAAAAAABQABAAAAAAQAUAqD8gIQAAAAABAAQAAABABAAQAAAAAAAAQABAAAAABQABAAAAAAQAAABAAAAQABABAAAAQAAABAAAAQAAABAAAAQAAABAAAAQgBABAAAAQAAABAAAAQgBAAAAABQgBAAAAAAQgBAAAAAAQAAAAgBAAIhFACQjDAAgRgqg");
	this.shape_3.setTransform(22.8,6.9);
	
	var rgba = lib.properties.paint == 'dark' ? [45, 20, 0, 0.8] : [177, 196, 205, 0]; // [163, 200, 220, 0];
	var rgba1 = rgba.slice(0);
	rgba1[3] = 1;
	var rgba06 = rgba.slice(0);
	rgba06[3] = 0.6;
	var rgba04 = rgba.slice(0);
	rgba04[3] = 0.4;
	var rgba_02 = rgba.slice(0);
	rgba_02[3] += 0.4;

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.lf(["rgba("+rgba04.join(",")+")","rgba("+rgba06.join(",")+")","rgba("+rgba.join(",")+")","rgba("+rgba_02.join(",")+")","rgba("+rgba1.join(",")+")"],[0,0.102,0.329,0.851,1],17.2,0,-17.1,0).s().p("Ah4AaQgygKAAgPQAAgNAygLQAygLBGgBQBGAAAzAKQAyAKAAAOQABANgzALQgyAMhHAAIgKABQhAAAgugKg");
	this.shape_4.setTransform(23,2.9,0.8,0.8);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.lf(["rgba("+rgba04.join(",")+")","rgba("+rgba06.join(",")+")","rgba("+rgba.join(",")+")","rgba("+rgba_02.join(",")+")","rgba("+rgba1.join(",")+")"],[0,0.102,0.329,0.851,1],-11.7,0,13.5,0).s().p("AheAxQgogIgCgMIAAAAIgBhSQAkAeBugCQBugCASgcIABBRQgBAMgpAJQgoAIg4ABIgKAAQgxAAgjgHg");
	this.shape_5.setTransform(23.1,8.3);

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.lf(["rgba("+rgba04.join(",")+")","rgba("+rgba06.join(",")+")","rgba("+rgba.join(",")+")","rgba("+rgba_02.join(",")+")","rgba("+rgba1.join(",")+")"],[0,0.102,0.329,0.851,1],-24.3,4.9,23.4,5.2).s().p("AilF8QhAgTAAgiIAAo2IACAAQALhXBBg5IAPgOQADALAmAIQAoAIA3gBQA4gBAogIQAigIAGgJIAQANQBAA5AMBXIACAAIAAI3QAAAcg9AVQhCAWhnAAQhoAAg9gSg");
	this.shape_6.setTransform(23.1,51.2);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_liquid},{t:this.shape_liquid2},{t:this.shape_6},{t:this.shape_5},{t:this.shape_4},{t:this.shape_3},{t:this.shape_2},{t:this.instance_1},{t:this.instance},{t:this.shape_cap},{t:this.shape_cap2}]}).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,46.2,94);


// stage content:
(lib.flask = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Isolation Mode
	this.instance = new lib.флакон();
	this.instance.parent = this;
	this.instance.setTransform(50.2,61.3,1,1,0,0,0,23.1,47);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(77.1,74.3,46.2,94);

})(lib = lib||{}, images = images||{}, createjs = createjs||{}, ss = ss||{});
var lib, images, ss;

if (window.modelNS) {
	modelNS.IReact.libs.flask = lib;
	lib = null;
}